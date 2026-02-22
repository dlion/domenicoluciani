#!/usr/bin/env ruby
# frozen_string_literal: true

require "date"
require "json"
require "net/http"
require "openssl"
require "set"
require "time"
require "uri"
require "yaml"

class BlueskyNotesSync
  MOOD_BY_TAG = {
    "updates" => "🌱",
    "ideas" => "💭",
    "reminder" => "✍️"
  }.freeze
  DEFAULT_MOOD = "🌱"

  def initialize
    @api_base = ENV.fetch("BLUESKY_API_BASE", "https://public.api.bsky.app")
    @identity_base = ENV.fetch("BLUESKY_IDENTITY_BASE", "https://bsky.social")
    @handle = ENV.fetch("BLUESKY_HANDLE")
    @required_tag = ENV.fetch("REQUIRED_TAG", "notes").downcase
    @target_timezone = ENV.fetch("TARGET_TIMEZONE", "UTC")
    @notes_file = ENV.fetch("NOTES_FILE", "_data/notes.yml")
    @dry_run = ENV.fetch("DRY_RUN", "0") == "1"
    @mention_handle_cache = {}
  end

  def run
    window = build_time_window
    puts "Sync window (#{@target_timezone}): #{window[:start_local]} -> #{window[:end_local]}"

    posts = fetch_posts(window[:start_utc], window[:end_utc])
    puts "Fetched #{posts.length} Bluesky post(s) in time window."

    notes = []
    posts.each do |post|
      note = build_note(post)
      notes << note unless note.nil?
    end
    puts "Found #{notes.length} post(s) tagged ##{@required_tag}."

    results = prepend_new_notes(notes)
    puts "Added #{results[:added]} note(s), updated #{results[:updated]} note(s) in #{@notes_file}."

    results[:changed]
  end

  private

  def build_time_window
    with_timezone(@target_timezone) do
      target_date =
        if ENV["SYNC_DATE"].to_s.strip.empty?
          Date.today - 1
        else
          Date.iso8601(ENV.fetch("SYNC_DATE"))
        end

      next_day = target_date + 1
      start_local = Time.local(target_date.year, target_date.month, target_date.day, 0, 0, 0)
      end_local = Time.local(next_day.year, next_day.month, next_day.day, 0, 0, 0)

      {
        start_local: start_local.iso8601,
        end_local: end_local.iso8601,
        start_utc: start_local.getutc,
        end_utc: end_local.getutc
      }
    end
  end

  def with_timezone(timezone)
    previous_timezone = ENV["TZ"]
    ENV["TZ"] = timezone
    yield
  ensure
    ENV["TZ"] = previous_timezone
  end

  def fetch_posts(start_utc, end_utc)
    author_did = resolve_did(@handle)
    cursor = nil
    posts = []

    loop do
      response = xrpc_get(
        "/xrpc/app.bsky.feed.getAuthorFeed",
        {
          actor: author_did,
          limit: 100,
          cursor: cursor
        }.compact
      )

      feed_entries = response.fetch("feed", [])
      break if feed_entries.empty?

      stop = false
      feed_entries.each do |entry|
        post_view = entry["post"]
        next unless post_view.is_a?(Hash)
        next unless post_view.dig("author", "did").to_s == author_did

        record = post_view["record"]
        next unless record.is_a?(Hash)
        next if record.key?("reply")

        created_at = parse_time(record["createdAt"] || post_view["indexedAt"])
        next unless created_at

        if created_at < start_utc
          stop = true
          break
        end
        next if created_at >= end_utc

        posts << {
          uri: post_view["uri"].to_s,
          rkey: post_rkey(post_view["uri"]),
          created_at: created_at,
          text: record["text"].to_s,
          facets: normalize_facets(record["facets"]),
          images: extract_images(post_view)
        }
      end

      break if stop

      cursor = response["cursor"]
      break if cursor.to_s.strip.empty?
    end

    posts.sort_by { |post| post[:created_at] }.reverse
  end

  def build_note(post)
    tags = extract_hashtags(post[:text], post[:facets])
    return nil unless tags.include?(@required_tag)

    note_tags = tags.reject { |tag| tag == @required_tag }
    primary_tag = note_tags.first
    mood = MOOD_BY_TAG.fetch(primary_tag, DEFAULT_MOOD)

    content = markdown_from(post[:text], post[:facets])
    content = append_images_to_content(content, post[:images])
    if content.empty?
      content = "[View this post on Bluesky](#{post_url(post[:rkey])})"
    end

    {
      "id" => "bsky-#{post[:rkey]}",
      "date" => local_date(post[:created_at]),
      "mood" => mood,
      "tags" => note_tags,
      "content" => content
    }
  end

  def local_date(timestamp)
    with_timezone(@target_timezone) { timestamp.getlocal.strftime("%F") }
  end

  def extract_images(post_view)
    images = []
    embed = post_view["embed"]
    return images unless embed.is_a?(Hash)

    image_entries =
      case embed["$type"]
      when "app.bsky.embed.images#view"
        embed["images"]
      when "app.bsky.embed.recordWithMedia#view"
        media = embed["media"]
        if media.is_a?(Hash) && media["$type"] == "app.bsky.embed.images#view"
          media["images"]
        else
          []
        end
      else
        []
      end

    seen_urls = Set.new
    Array(image_entries).each do |image_entry|
      next unless image_entry.is_a?(Hash)

      url = image_entry["fullsize"].to_s.strip
      next if url.empty? || seen_urls.include?(url)

      seen_urls << url
      alt = image_entry["alt"].to_s.strip
      images << { "url" => url, "alt" => (alt.empty? ? "Bluesky image" : alt) }
    end

    images
  end

  def append_images_to_content(content, images)
    return content if images.nil? || images.empty?

    image_lines = images.map { |image| markdown_image(image["alt"], image["url"]) }
    return image_lines.join("\n") if content.empty?

    "#{content}\n\n#{image_lines.join("\n")}"
  end

  def markdown_image(alt, url)
    "![#{escape_markdown_label(alt)}](#{url})"
  end

  def extract_hashtags(text, facets)
    tags = []
    facets
      .sort_by { |facet| facet.dig("index", "byteStart").to_i }
      .each do |facet|
        next unless tag_feature?(facet)

        raw_tag = facet["features"].find { |feature| feature["$type"] == "app.bsky.richtext.facet#tag" }["tag"].to_s
        if raw_tag.strip.empty?
          segment = facet_segment(text, facet)
          raw_tag = segment.delete_prefix("#")
        end

        normalized_tag = raw_tag.downcase.gsub(/\A#+/, "").strip
        tags << normalized_tag unless normalized_tag.empty?
      end

    if tags.empty?
      text.scan(/(?:^|\s)#([[:alnum:]_]+)/u) { |tag| tags << tag.to_s.downcase }
    end

    unique(tags)
  end

  def markdown_from(text, facets)
    source = text.to_s.dup.force_encoding("UTF-8").b
    replacements = []

    facets.each do |facet|
      span = facet_span(facet)
      next unless span

      start_byte, end_byte = span
      segment = source.byteslice(start_byte...end_byte).to_s.force_encoding("UTF-8")
      replacement = facet_replacement(segment, facet)
      next if replacement.nil?

      replacements << [start_byte, end_byte, replacement]
    end

    replacements.sort_by(&:first).reverse_each do |start_byte, end_byte, replacement|
      source[start_byte...end_byte] = replacement.b
    end

    normalize_content(source.force_encoding("UTF-8"))
  end

  def normalize_content(content)
    normalized = content.to_s.gsub(/\r\n?/, "\n")
    normalized = normalized.lines.map { |line| line.gsub(/[ \t]+$/, "") }.join
    normalized = normalized.gsub(/[ \t]+\n/, "\n")
    normalized = normalized.gsub(/\n{3,}/, "\n\n")
    normalized.strip
  end

  def facet_replacement(segment, facet)
    features = normalize_features(facet["features"])

    if features.any? { |feature| feature["$type"] == "app.bsky.richtext.facet#tag" }
      ""
    elsif (link_feature = features.find { |feature| feature["$type"] == "app.bsky.richtext.facet#link" })
      uri = link_feature["uri"].to_s
      return nil if uri.empty?

      label = segment.strip
      label = uri if label.empty?
      markdown_link(label, uri)
    elsif (mention_feature = features.find { |feature| feature["$type"] == "app.bsky.richtext.facet#mention" })
      did = mention_feature["did"].to_s
      return nil if did.empty?

      handle = resolve_handle_for_did(did)
      label = segment.strip
      label = "@#{handle}" if label.empty?
      markdown_link(label, "https://bsky.app/profile/#{handle}")
    end
  end

  def markdown_link(label, url)
    "[#{escape_markdown_label(label)}](#{url})"
  end

  def escape_markdown_label(text)
    text.to_s.gsub("\\", "\\\\").gsub("[", "\\[").gsub("]", "\\]")
  end

  def normalize_facets(facets)
    return [] unless facets.is_a?(Array)

    facets.select { |facet| facet.is_a?(Hash) }
  end

  def normalize_features(features)
    return [] unless features.is_a?(Array)

    features.select { |feature| feature.is_a?(Hash) }
  end

  def tag_feature?(facet)
    normalize_features(facet["features"]).any? { |feature| feature["$type"] == "app.bsky.richtext.facet#tag" }
  end

  def facet_segment(text, facet)
    span = facet_span(facet)
    return "" unless span

    start_byte, end_byte = span
    text.to_s.dup.force_encoding("UTF-8").b.byteslice(start_byte...end_byte).to_s.force_encoding("UTF-8")
  end

  def facet_span(facet)
    index = facet["index"]
    return nil unless index.is_a?(Hash)

    start_byte = index["byteStart"]
    end_byte = index["byteEnd"]
    return nil unless start_byte.is_a?(Integer) && end_byte.is_a?(Integer)
    return nil if start_byte.negative? || end_byte <= start_byte

    [start_byte, end_byte]
  end

  def prepend_new_notes(notes)
    return { added: 0, updated: 0, changed: 0 } if notes.empty?

    existing_text = File.exist?(@notes_file) ? File.read(@notes_file) : ""
    existing_ids = extract_existing_ids(existing_text)
    updated_text = existing_text
    added_notes = []
    updated_notes = 0

    notes.each do |note|
      id = note["id"].to_s.strip
      if id.empty? || !existing_ids.include?(id)
        added_notes << note
        next
      end

      replacement = render_note(note)
      replaced_text, replaced_entries = replace_note_entry_by_id(updated_text, id, replacement)
      if replaced_entries.positive? && replaced_text != updated_text
        updated_text = replaced_text
        updated_notes += 1
      elsif replaced_entries.zero?
        added_notes << note
      end
    end

    added_count = added_notes.length
    changed_count = added_count + updated_notes
    return { added: added_count, updated: updated_notes, changed: changed_count } if @dry_run

    rendered_new_notes = added_notes.map { |note| render_note(note) }.join("\n\n")
    final_text = updated_text
    unless rendered_new_notes.empty?
      final_text =
        if final_text.strip.empty?
          "#{rendered_new_notes}\n"
        else
          "#{rendered_new_notes}\n\n#{final_text.lstrip}"
        end
    end

    final_text = ensure_trailing_newline(final_text)
    if final_text != existing_text
      File.write(@notes_file, final_text)
    else
      changed_count = 0
    end

    { added: added_count, updated: updated_notes, changed: changed_count }
  end

  def replace_note_entry_by_id(existing_text, id, rendered_note)
    lines = existing_text.lines
    output = []
    index = 0
    replaced_entries = 0

    while index < lines.length
      line = lines[index]
      entry_id = id_from_id_line(line)
      if entry_id == id
        replaced_entries += 1
        index += 1
        index += 1 while index < lines.length && !lines[index].start_with?("- ")
        separator = index < lines.length ? "\n\n" : "\n"
        output << "#{rendered_note}#{separator}"
        next
      end

      output << line
      index += 1
    end

    [output.join, replaced_entries]
  end

  def id_from_id_line(line)
    return nil unless line.start_with?("- id:")

    match = line.chomp.match(/\A-\s+id:\s*(.+?)\s*\z/)
    return nil unless match

    raw = match[1]
    if raw.start_with?("'") && raw.end_with?("'")
      raw[1..-2].gsub("''", "'")
    elsif raw.start_with?("\"") && raw.end_with?("\"")
      raw[1..-2].gsub("\\\"", "\"").gsub("\\\\", "\\")
    else
      raw
    end
  end

  def ensure_trailing_newline(text)
    text.end_with?("\n") ? text : "#{text}\n"
  end

  def extract_existing_ids(existing_text)
    return Set.new if existing_text.strip.empty?

    loaded = YAML.safe_load(existing_text, permitted_classes: [Date, Time], aliases: false)
    return Set.new unless loaded.is_a?(Array)

    ids = []
    loaded.each do |note|
      next unless note.is_a?(Hash)

      id = note["id"].to_s.strip
      next if id.empty?

      ids << id
    end
    Set.new(ids)
  rescue Psych::SyntaxError => error
    raise "Could not parse #{@notes_file}: #{error.message}"
  end

  def render_note(note)
    lines = []
    lines << "- id: #{yaml_single_quoted(note.fetch("id"))}"
    lines << "  date: #{note.fetch("date")}"
    lines << "  mood: #{yaml_double_quoted(note.fetch("mood"))}"

    tags = note.fetch("tags", [])
    if tags.empty?
      lines << "  tags: []"
    else
      lines << "  tags:"
      tags.each do |tag|
        lines << "    - #{yaml_tag(tag)}"
      end
    end

    lines << "  content: |"
    note.fetch("content").to_s.split("\n", -1).each do |line|
      lines << "    #{line}"
    end
    lines.join("\n")
  end

  def yaml_single_quoted(value)
    "'#{value.to_s.gsub("'", "''")}'"
  end

  def yaml_double_quoted(value)
    "\"#{value.to_s.gsub("\\", "\\\\").gsub("\"", "\\\"")}\""
  end

  def yaml_tag(tag)
    tag_string = tag.to_s
    if tag_string.match?(/\A[a-zA-Z0-9_-]+\z/)
      tag_string
    else
      yaml_single_quoted(tag_string)
    end
  end

  def unique(values)
    seen = Set.new
    values.each_with_object([]) do |value, result|
      next if seen.include?(value)

      result << value
      seen << value
    end
  end

  def resolve_did(handle)
    response = xrpc_get("/xrpc/com.atproto.identity.resolveHandle", { handle: handle }, base: @identity_base)
    did = response["did"].to_s
    raise "Could not resolve DID for handle #{handle}" if did.empty?

    did
  end

  def resolve_handle_for_did(did)
    return @mention_handle_cache[did] if @mention_handle_cache.key?(did)

    response = xrpc_get("/xrpc/app.bsky.actor.getProfile", actor: did)
    handle = response["handle"].to_s
    handle = did if handle.empty?
    @mention_handle_cache[did] = handle
  rescue StandardError
    @mention_handle_cache[did] = did
  end

  def post_url(rkey)
    "https://bsky.app/profile/#{@handle}/post/#{rkey}"
  end

  def post_rkey(uri)
    uri.to_s.split("/").last.to_s
  end

  def parse_time(value)
    Time.parse(value.to_s).utc
  rescue ArgumentError
    nil
  end

  def xrpc_get(path, params, base: @api_base)
    uri = URI.join(base, path)
    uri.query = URI.encode_www_form(params)

    request = Net::HTTP::Get.new(uri)
    request["User-Agent"] = "notes-sync/1.0"

    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = uri.scheme == "https"
    http.open_timeout = 10
    http.read_timeout = 30
    http.verify_mode = OpenSSL::SSL::VERIFY_PEER

    cert_store = OpenSSL::X509::Store.new
    cert_store.set_default_paths
    http.cert_store = cert_store

    response = http.start { |session| session.request(request) }

    unless response.is_a?(Net::HTTPSuccess)
      raise "Bluesky request failed (#{response.code}): #{response.body}"
    end

    JSON.parse(response.body)
  end
end

begin
  BlueskyNotesSync.new.run
  exit(0)
rescue StandardError => error
  warn "sync_bsky_notes.rb failed: #{error.message}"
  exit(1)
end
