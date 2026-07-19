---
layout: page
title: Editorial Dashboard
description: A build-time view of the garden's publishing health, connections, and next editorial actions.
permalink: /stats/
sitemap: false
robots: noindex, nofollow
hide_progress: true
extra_css:
  - stats
---

{% comment %}
  This dashboard intentionally uses only GitHub Pages-compatible Liquid filters.
  Jekyll exposes rendered post HTML here, so word counts are estimates after
  strip_html. Metrics that depend on Markdown source syntax are avoided.
{% endcomment %}

{% assign posts = site.posts %}
{% assign empty_array = '' | split: '' %}
{% assign original_posts = empty_array %}
{% assign bookmark_posts = empty_array %}

{% for post in posts %}
  {% if post.tags contains 'bookmarks' %}
    {% assign bookmark_posts = bookmark_posts | push: post %}
  {% else %}
    {% assign original_posts = original_posts | push: post %}
  {% endif %}
{% endfor %}

{% assign total_posts = posts | size %}
{% assign original_count = original_posts | size %}
{% assign bookmark_count = bookmark_posts | size %}
{% assign now_ts = 'now' | date: '%s' | plus: 0 %}
{% assign now_year = 'now' | date: '%Y' | plus: 0 %}
{% assign now_month = 'now' | date: '%m' | plus: 0 %}
{% assign current_month_index = now_year | times: 12 | plus: now_month %}
{% assign boundary_12 = current_month_index | minus: 12 %}
{% assign boundary_24 = current_month_index | minus: 24 %}
{% assign recent_year_boundary = now_year | minus: 2 %}

{% assign original_words = 0 %}
{% assign words_short = 0 %}
{% assign words_medium = 0 %}
{% assign words_long = 0 %}
{% assign posts_with_code = 0 %}
{% assign posts_with_mermaid = 0 %}
{% assign posts_with_headings = 0 %}
{% assign posts_with_images = 0 %}
{% assign connected_posts = 0 %}
{% assign isolated_posts = 0 %}
{% assign original_last_12m = 0 %}
{% assign original_prev_12m = 0 %}
{% assign missing_covers = 0 %}
{% assign missing_descriptions = 0 %}
{% assign missing_tags = 0 %}
{% assign updated_posts = 0 %}
{% assign links_to_notes = 0 %}
{% assign links_to_now = 0 %}
{% assign links_to_photos = 0 %}
{% assign links_to_bookmarks = 0 %}
{% assign links_to_someday = 0 %}
{% assign total_internal_links = 0 %}
{% assign total_external_links = 0 %}
{% assign code_languages_pipe = '|' %}
{% assign longest_original_words = 0 %}
{% assign longest_original = nil %}

{% for post in original_posts %}
  {% assign visible_words = post.content | strip_html | number_of_words %}
  {% assign original_words = original_words | plus: visible_words %}

  {% if visible_words < 800 %}
    {% assign words_short = words_short | plus: 1 %}
  {% elsif visible_words < 2000 %}
    {% assign words_medium = words_medium | plus: 1 %}
  {% else %}
    {% assign words_long = words_long | plus: 1 %}
  {% endif %}

  {% if visible_words > longest_original_words %}
    {% assign longest_original_words = visible_words %}
    {% assign longest_original = post %}
  {% endif %}

  {% assign has_code = false %}
  {% if post.content contains 'highlighter-rouge' or post.content contains 'language-' or post.content contains '<pre' %}
    {% assign has_code = true %}
    {% assign posts_with_code = posts_with_code | plus: 1 %}
  {% endif %}
  {% if post.content contains 'language-mermaid' %}
    {% assign posts_with_mermaid = posts_with_mermaid | plus: 1 %}
  {% endif %}
  {% assign language_chunks = post.content | split: 'class="language-' %}
  {% for language_chunk in language_chunks offset: 1 %}
    {% assign language_name = language_chunk | split: '"' | first | split: ' ' | first | downcase %}
    {% if language_name != '' and language_name != 'mermaid' %}
      {% assign language_key = '|' | append: language_name | append: '|' %}
      {% unless code_languages_pipe contains language_key %}
        {% assign code_languages_pipe = code_languages_pipe | append: language_name | append: '|' %}
      {% endunless %}
    {% endif %}
  {% endfor %}
  {% if post.content contains '<h2' or post.content contains '<h3' or post.content contains '<h4' %}
    {% assign posts_with_headings = posts_with_headings | plus: 1 %}
  {% endif %}
  {% if post.content contains '<img' %}
    {% assign posts_with_images = posts_with_images | plus: 1 %}
  {% endif %}

  {% assign relative_links = post.content | split: 'href="/' | size | minus: 1 %}
  {% assign absolute_links = post.content | split: 'href="https://domenicoluciani.com/' | size | minus: 1 %}
  {% assign internal_links = relative_links | plus: absolute_links %}
  {% assign total_internal_links = total_internal_links | plus: internal_links %}
  {% assign http_links = post.content | split: 'href="http://' | size | minus: 1 %}
  {% assign https_links = post.content | split: 'href="https://' | size | minus: 1 %}
  {% assign external_links = http_links | plus: https_links | minus: absolute_links %}
  {% assign total_external_links = total_external_links | plus: external_links %}
  {% if internal_links > 0 %}
    {% assign connected_posts = connected_posts | plus: 1 %}
  {% else %}
    {% assign isolated_posts = isolated_posts | plus: 1 %}
  {% endif %}

  {% assign chunks = post.content | split: 'href="/notes' %}
  {% assign links_to_notes = links_to_notes | plus: chunks.size | minus: 1 %}
  {% assign chunks = post.content | split: 'domenicoluciani.com/notes' %}
  {% assign links_to_notes = links_to_notes | plus: chunks.size | minus: 1 %}
  {% assign chunks = post.content | split: 'href="/now' %}
  {% assign links_to_now = links_to_now | plus: chunks.size | minus: 1 %}
  {% assign chunks = post.content | split: 'domenicoluciani.com/now' %}
  {% assign links_to_now = links_to_now | plus: chunks.size | minus: 1 %}
  {% assign chunks = post.content | split: 'href="/photos' %}
  {% assign links_to_photos = links_to_photos | plus: chunks.size | minus: 1 %}
  {% assign chunks = post.content | split: 'domenicoluciani.com/photos' %}
  {% assign links_to_photos = links_to_photos | plus: chunks.size | minus: 1 %}
  {% assign chunks = post.content | split: 'href="/bookmarks' %}
  {% assign links_to_bookmarks = links_to_bookmarks | plus: chunks.size | minus: 1 %}
  {% assign chunks = post.content | split: 'domenicoluciani.com/bookmarks' %}
  {% assign links_to_bookmarks = links_to_bookmarks | plus: chunks.size | minus: 1 %}
  {% assign chunks = post.content | split: 'href="/someday' %}
  {% assign links_to_someday = links_to_someday | plus: chunks.size | minus: 1 %}
  {% assign chunks = post.content | split: 'domenicoluciani.com/someday' %}
  {% assign links_to_someday = links_to_someday | plus: chunks.size | minus: 1 %}

  {% assign post_year = post.date | date: '%Y' | plus: 0 %}
  {% assign post_month = post.date | date: '%m' | plus: 0 %}
  {% assign post_month_index = post_year | times: 12 | plus: post_month %}
  {% if post_month_index > boundary_12 and post_month_index <= current_month_index %}
    {% assign original_last_12m = original_last_12m | plus: 1 %}
  {% elsif post_month_index > boundary_24 and post_month_index <= boundary_12 %}
    {% assign original_prev_12m = original_prev_12m | plus: 1 %}
  {% endif %}

  {% if post.layout == 'post' %}
    {% unless post.cover or post.image %}
      {% assign missing_covers = missing_covers | plus: 1 %}
    {% endunless %}
  {% endif %}
  {% if post.description == nil or post.description == '' %}
    {% assign missing_descriptions = missing_descriptions | plus: 1 %}
  {% endif %}
  {% if post.tags == empty or post.tags.size == 0 %}
    {% assign missing_tags = missing_tags | plus: 1 %}
  {% endif %}
  {% if post.updated %}
    {% assign updated_posts = updated_posts | plus: 1 %}
  {% endif %}
{% endfor %}

{% assign code_language_names = code_languages_pipe | remove_first: '|' | split: '|' %}
{% assign code_unique_languages = 0 %}
{% for language_name in code_language_names %}
  {% if language_name != '' %}{% assign code_unique_languages = code_unique_languages | plus: 1 %}{% endif %}
{% endfor %}

{% if original_count > 0 %}
  {% assign connected_pct = connected_posts | times: 100.0 | divided_by: original_count %}
  {% assign avg_original_words = original_words | times: 1.0 | divided_by: original_count %}
  {% assign sorted_original_asc = original_posts | sort: 'date' %}
  {% assign first_original = sorted_original_asc | first %}
  {% assign latest_original = sorted_original_asc | last %}
  {% assign latest_original_ts = latest_original.date | date: '%s' | plus: 0 %}
  {% assign days_since_original = now_ts | minus: latest_original_ts | divided_by: 86400 %}
  {% assign months_since_original = days_since_original | times: 1.0 | divided_by: 30 | round %}
  {% assign years_since_original = days_since_original | times: 1.0 | divided_by: 365 | round: 1 %}
{% else %}
  {% assign connected_pct = 0 %}
  {% assign avg_original_words = 0 %}
  {% assign days_since_original = 0 %}
{% endif %}

{% if original_prev_12m > 0 %}
  {% assign original_delta = original_last_12m | minus: original_prev_12m %}
  {% assign original_delta_pct = original_delta | times: 100.0 | divided_by: original_prev_12m %}
{% else %}
  {% assign original_delta_pct = 0 %}
{% endif %}

{% assign avg_gap_days = 0 %}
{% assign max_gap_days = 0 %}
{% assign previous_original_ts = 0 %}
{% assign gap_total = 0 %}
{% assign gap_count = 0 %}
{% for post in sorted_original_asc %}
  {% assign post_ts = post.date | date: '%s' | plus: 0 %}
  {% if previous_original_ts > 0 %}
    {% assign gap = post_ts | minus: previous_original_ts | divided_by: 86400 %}
    {% assign gap_total = gap_total | plus: gap %}
    {% assign gap_count = gap_count | plus: 1 %}
    {% if gap > max_gap_days %}{% assign max_gap_days = gap %}{% endif %}
  {% endif %}
  {% assign previous_original_ts = post_ts %}
{% endfor %}
{% if gap_count > 0 %}
  {% assign avg_gap_days = gap_total | times: 1.0 | divided_by: gap_count %}
{% endif %}

{% comment %}Build original-only topic records.{% endcomment %}
{% assign original_tags_pipe = '|' %}
{% for post in original_posts %}
  {% for tag in post.tags %}
    {% assign normalized_tag = tag | downcase %}
    {% assign tag_key = '|' | append: normalized_tag | append: '|' %}
    {% unless original_tags_pipe contains tag_key %}
      {% assign original_tags_pipe = original_tags_pipe | append: normalized_tag | append: '|' %}
    {% endunless %}
  {% endfor %}
{% endfor %}

{% assign original_tag_names = original_tags_pipe | remove_first: '|' | split: '|' %}
{% assign original_unique_tags = 0 %}
{% assign original_single_use_tags = 0 %}
{% assign top_original_tag = '' %}
{% assign top_original_tag_count = 0 %}
{% capture original_tag_records %}
  {% for tag_name in original_tag_names %}
    {% if tag_name != '' %}
      {% assign original_unique_tags = original_unique_tags | plus: 1 %}
      {% assign tag_hits = 0 %}
      {% assign recent_tag_hits = 0 %}
      {% for post in original_posts %}
        {% assign post_tags_downcase = post.tags | join: '|' | downcase | split: '|' %}
        {% if post_tags_downcase contains tag_name %}
          {% assign tag_hits = tag_hits | plus: 1 %}
          {% assign tag_year = post.date | date: '%Y' | plus: 0 %}
          {% if tag_year >= recent_year_boundary %}
            {% assign recent_tag_hits = recent_tag_hits | plus: 1 %}
          {% endif %}
        {% endif %}
      {% endfor %}
      {% if tag_hits == 1 %}{% assign original_single_use_tags = original_single_use_tags | plus: 1 %}{% endif %}
      {% if tag_hits > top_original_tag_count %}
        {% assign top_original_tag_count = tag_hits %}
        {% assign top_original_tag = tag_name %}
      {% endif %}
      {{ tag_hits | plus: 100000 }}::{{ tag_name | replace: '::', '-' }}::{{ tag_hits }}::{{ recent_tag_hits }}|~|
    {% endif %}
  {% endfor %}
{% endcapture %}
{% assign original_tag_records_sorted = original_tag_records | split: '|~|' | sort | reverse %}

{% comment %}Incoming-link analysis: bounded to original articles.{% endcomment %}
{% assign posts_without_incoming = 0 %}
{% assign top_hub_title = '' %}
{% assign top_hub_url = '' %}
{% assign top_hub_incoming = 0 %}
{% capture incoming_records %}
  {% for target in original_posts %}
    {% assign incoming = 0 %}
    {% assign target_absolute = target.url | absolute_url %}
    {% for source in original_posts %}
      {% if source.url != target.url %}
        {% if source.content contains target.url or source.content contains target_absolute %}
          {% assign incoming = incoming | plus: 1 %}
        {% endif %}
      {% endif %}
    {% endfor %}
    {% if incoming == 0 %}{% assign posts_without_incoming = posts_without_incoming | plus: 1 %}{% endif %}
    {% if incoming > top_hub_incoming %}
      {% assign top_hub_incoming = incoming %}
      {% assign top_hub_title = target.title %}
      {% assign top_hub_url = target.url %}
    {% endif %}
    {{ incoming | plus: 100000 }}::{{ target.url }}::{{ target.title | replace: '::', '-' }}::{{ incoming }}|~|
  {% endfor %}
{% endcapture %}
{% assign incoming_records_sorted = incoming_records | split: '|~|' | sort | reverse %}

{% comment %}Rank refresh candidates with transparent binary signals.{% endcomment %}
{% capture refresh_records %}
  {% for post in original_posts %}
    {% assign score = 0 %}
    {% assign post_ts = post.date | date: '%s' | plus: 0 %}
    {% assign age_days = now_ts | minus: post_ts | divided_by: 86400 %}
    {% assign visible_words = post.content | strip_html | number_of_words %}
    {% assign flag_old = 0 %}
    {% assign flag_long = 0 %}
    {% assign flag_code = 0 %}
    {% assign flag_unupdated = 0 %}
    {% assign flag_unlinked = 0 %}
    {% assign flag_cover = 0 %}
    {% if age_days > 730 %}{% assign score = score | plus: 1 %}{% assign flag_old = 1 %}{% endif %}
    {% if visible_words >= 1200 %}{% assign score = score | plus: 1 %}{% assign flag_long = 1 %}{% endif %}
    {% if post.content contains 'highlighter-rouge' or post.content contains 'language-' or post.content contains '<pre' %}
      {% assign score = score | plus: 1 %}{% assign flag_code = 1 %}
    {% endif %}
    {% unless post.updated %}{% assign score = score | plus: 1 %}{% assign flag_unupdated = 1 %}{% endunless %}
    {% assign relative_links = post.content | split: 'href="/' | size | minus: 1 %}
    {% assign absolute_links = post.content | split: 'href="https://domenicoluciani.com/' | size | minus: 1 %}
    {% assign internal_links = relative_links | plus: absolute_links %}
    {% if internal_links == 0 %}{% assign score = score | plus: 1 %}{% assign flag_unlinked = 1 %}{% endif %}
    {% if post.layout == 'post' %}
      {% unless post.cover or post.image %}{% assign score = score | plus: 1 %}{% assign flag_cover = 1 %}{% endunless %}
    {% endif %}
    {% assign sort_score = score | times: 1000000 | plus: age_days | plus: 100000000 %}
    {{ sort_score }}::{{ post.url }}::{{ post.title | replace: '::', '-' }}::{{ score }}::{{ age_days }}::{{ visible_words }}::{{ flag_old }}::{{ flag_long }}::{{ flag_code }}::{{ flag_unupdated }}::{{ flag_unlinked }}::{{ flag_cover }}|~|
  {% endfor %}
{% endcapture %}
{% assign refresh_records_sorted = refresh_records | split: '|~|' | sort | reverse %}

{% comment %}Garden section metrics.{% endcomment %}
{% assign now_timeline = site.data.now.timeline | default: site.now.timeline %}
{% assign now_updates = now_timeline | size | default: 0 %}
{% assign now_recent_90 = 0 %}
{% assign now_work = 0 %}
{% assign now_personal = 0 %}
{% assign now_travels = 0 %}
{% assign now_gaming = 0 %}
{% if now_updates > 0 %}
  {% assign now_sorted = now_timeline | sort: 'date' %}
  {% assign now_first_entry = now_sorted | first %}
  {% assign now_latest_entry = now_sorted | last %}
  {% assign now_latest_ts = now_latest_entry.date | date: '%s' | plus: 0 %}
  {% assign now_age_days = now_ts | minus: now_latest_ts | divided_by: 86400 %}
  {% assign now_age_months = now_age_days | times: 1.0 | divided_by: 30 | round %}
  {% assign now_age_years = now_age_days | times: 1.0 | divided_by: 365 | round: 1 %}
  {% for entry in now_timeline %}
    {% assign entry_ts = entry.date | date: '%s' | plus: 0 %}
    {% assign entry_age = now_ts | minus: entry_ts | divided_by: 86400 %}
    {% if entry_age <= 90 %}{% assign now_recent_90 = now_recent_90 | plus: 1 %}{% endif %}
    {% if entry.body contains '### Work' %}{% assign now_work = now_work | plus: 1 %}{% endif %}
    {% if entry.body contains '### Personal Life' %}{% assign now_personal = now_personal | plus: 1 %}{% endif %}
    {% if entry.body contains '### Travels' %}{% assign now_travels = now_travels | plus: 1 %}{% endif %}
    {% if entry.body contains '### Gaming' %}{% assign now_gaming = now_gaming | plus: 1 %}{% endif %}
  {% endfor %}
{% else %}
  {% assign now_age_days = 0 %}
{% endif %}

{% assign photos = site.data.photos | default: site.photos %}
{% assign photos_total = photos | size | default: 0 %}
{% assign photos_recent_365 = 0 %}
{% assign photo_tags_pipe = '|' %}
{% assign photo_locations_pipe = '|' %}
{% if photos_total > 0 %}
  {% assign photos_sorted = photos | sort: 'date' %}
  {% assign photos_first = photos_sorted | first %}
  {% assign photos_latest = photos_sorted | last %}
  {% assign photos_latest_ts = photos_latest.date | date: '%s' | plus: 0 %}
  {% assign photos_age_days = now_ts | minus: photos_latest_ts | divided_by: 86400 %}
  {% assign photos_age_months = photos_age_days | times: 1.0 | divided_by: 30 | round %}
  {% assign photos_age_years = photos_age_days | times: 1.0 | divided_by: 365 | round: 1 %}
  {% for photo in photos %}
    {% assign photo_ts = photo.date | date: '%s' | plus: 0 %}
    {% assign photo_age = now_ts | minus: photo_ts | divided_by: 86400 %}
    {% if photo_age <= 365 %}{% assign photos_recent_365 = photos_recent_365 | plus: 1 %}{% endif %}
    {% for tag in photo.tags %}
      {% assign normalized_tag = tag | downcase %}
      {% assign tag_key = '|' | append: normalized_tag | append: '|' %}
      {% unless photo_tags_pipe contains tag_key %}{% assign photo_tags_pipe = photo_tags_pipe | append: normalized_tag | append: '|' %}{% endunless %}
    {% endfor %}
    {% assign photo_location = photo.location | default: photo.place | default: '' %}
    {% if photo_location != '' %}
      {% assign location_key = '|' | append: photo_location | append: '|' %}
      {% unless photo_locations_pipe contains location_key %}{% assign photo_locations_pipe = photo_locations_pipe | append: photo_location | append: '|' %}{% endunless %}
    {% endif %}
  {% endfor %}
{% else %}
  {% assign photos_age_days = 0 %}
{% endif %}

{% assign photo_tag_names = photo_tags_pipe | remove_first: '|' | split: '|' %}
{% assign photo_unique_tags = 0 %}
{% assign photo_single_use_tags = 0 %}
{% assign photo_top_tag = '' %}
{% assign photo_top_tag_count = 0 %}
{% for tag_name in photo_tag_names %}
  {% if tag_name != '' %}
    {% assign photo_unique_tags = photo_unique_tags | plus: 1 %}
    {% assign tag_hits = 0 %}
    {% for photo in photos %}
      {% assign photo_tags_downcase = photo.tags | join: '|' | downcase | split: '|' %}
      {% if photo_tags_downcase contains tag_name %}{% assign tag_hits = tag_hits | plus: 1 %}{% endif %}
    {% endfor %}
    {% if tag_hits == 1 %}{% assign photo_single_use_tags = photo_single_use_tags | plus: 1 %}{% endif %}
    {% if tag_hits > photo_top_tag_count %}{% assign photo_top_tag_count = tag_hits %}{% assign photo_top_tag = tag_name %}{% endif %}
  {% endif %}
{% endfor %}
{% if photo_unique_tags > 0 %}
  {% assign photo_single_use_pct = photo_single_use_tags | times: 100.0 | divided_by: photo_unique_tags %}
{% else %}
  {% assign photo_single_use_pct = 0 %}
{% endif %}
{% assign photo_location_names = photo_locations_pipe | remove_first: '|' | split: '|' %}
{% assign photo_unique_locations = 0 %}
{% assign photo_top_location = '' %}
{% assign photo_top_location_count = 0 %}
{% for location_name in photo_location_names %}
  {% if location_name != '' %}
    {% assign photo_unique_locations = photo_unique_locations | plus: 1 %}
    {% assign location_hits = 0 %}
    {% for photo in photos %}
      {% assign current_location = photo.location | default: photo.place | default: '' %}
      {% if current_location == location_name %}{% assign location_hits = location_hits | plus: 1 %}{% endif %}
    {% endfor %}
    {% if location_hits > photo_top_location_count %}{% assign photo_top_location_count = location_hits %}{% assign photo_top_location = location_name %}{% endif %}
  {% endif %}
{% endfor %}
{% assign photo_year_groups = photos | group_by_exp: 'photo', "photo.date | date: '%Y'" %}
{% assign photo_top_year = '' %}
{% assign photo_top_year_count = 0 %}
{% for bucket in photo_year_groups %}
  {% assign year_count = bucket.items | size %}
  {% if year_count > photo_top_year_count %}{% assign photo_top_year_count = year_count %}{% assign photo_top_year = bucket.name %}{% endif %}
{% endfor %}

{% assign notes = site.data.notes | default: site.notes %}
{% assign notes_total = notes | size | default: 0 %}
{% assign notes_recent_90 = 0 %}
{% assign notes_moods_pipe = '|' %}
{% assign note_tags_pipe = '|' %}
{% assign note_links_to_garden = 0 %}
{% if notes_total > 0 %}
  {% assign notes_sorted = notes | sort: 'date' %}
  {% assign notes_first = notes_sorted | first %}
  {% assign notes_latest = notes_sorted | last %}
  {% assign notes_latest_ts = notes_latest.date | date: '%s' | plus: 0 %}
  {% assign notes_age_days = now_ts | minus: notes_latest_ts | divided_by: 86400 %}
  {% assign notes_age_months = notes_age_days | times: 1.0 | divided_by: 30 | round %}
  {% assign notes_age_years = notes_age_days | times: 1.0 | divided_by: 365 | round: 1 %}
  {% for note in notes %}
    {% assign note_ts = note.date | date: '%s' | plus: 0 %}
    {% assign note_age = now_ts | minus: note_ts | divided_by: 86400 %}
    {% if note_age <= 90 %}{% assign notes_recent_90 = notes_recent_90 | plus: 1 %}{% endif %}
    {% assign mood = note.mood | default: '🌱' %}
    {% assign mood_key = '|' | append: mood | append: '|' %}
    {% unless notes_moods_pipe contains mood_key %}{% assign notes_moods_pipe = notes_moods_pipe | append: mood | append: '|' %}{% endunless %}
    {% for tag in note.tags %}
      {% assign normalized_tag = tag | downcase %}
      {% assign tag_key = '|' | append: normalized_tag | append: '|' %}
      {% unless note_tags_pipe contains tag_key %}{% assign note_tags_pipe = note_tags_pipe | append: normalized_tag | append: '|' %}{% endunless %}
    {% endfor %}
    {% if note.content contains '/now' %}{% assign note_links_to_garden = note_links_to_garden | plus: 1 %}{% endif %}
    {% if note.content contains '/photos' %}{% assign note_links_to_garden = note_links_to_garden | plus: 1 %}{% endif %}
    {% if note.content contains '/bookmarks' %}{% assign note_links_to_garden = note_links_to_garden | plus: 1 %}{% endif %}
    {% if note.content contains '/someday' %}{% assign note_links_to_garden = note_links_to_garden | plus: 1 %}{% endif %}
  {% endfor %}
{% else %}
  {% assign notes_age_days = 0 %}
{% endif %}
{% assign note_tag_names = note_tags_pipe | remove_first: '|' | split: '|' %}
{% assign notes_unique_tags = 0 %}
{% assign notes_single_use_tags = 0 %}
{% for tag_name in note_tag_names %}
  {% if tag_name != '' %}
    {% assign notes_unique_tags = notes_unique_tags | plus: 1 %}
    {% assign tag_hits = 0 %}
    {% for note in notes %}
      {% assign note_tags_downcase = note.tags | join: '|' | downcase | split: '|' %}
      {% if note_tags_downcase contains tag_name %}{% assign tag_hits = tag_hits | plus: 1 %}{% endif %}
    {% endfor %}
    {% if tag_hits == 1 %}{% assign notes_single_use_tags = notes_single_use_tags | plus: 1 %}{% endif %}
  {% endif %}
{% endfor %}
{% assign notes_unique_moods = notes_moods_pipe | remove_first: '|' | split: '|' | size %}
{% assign note_variant_count = 0 %}
{% capture note_variant_records %}
  {% for tag_name in note_tag_names %}
    {% if tag_name != '' %}
      {% assign plural_tag = tag_name | append: 's' %}
      {% assign plural_key = '|' | append: plural_tag | append: '|' %}
      {% if note_tags_pipe contains plural_key %}
        {% assign note_variant_count = note_variant_count | plus: 1 %}
        {{ tag_name }}::{{ plural_tag }}|~|
      {% endif %}
    {% endif %}
  {% endfor %}
{% endcapture %}
{% assign note_variant_records = note_variant_records | split: '|~|' %}

{% assign bookmark_links_total = 0 %}
{% if bookmark_count > 0 %}
  {% assign bookmarks_sorted = bookmark_posts | sort: 'date' %}
  {% assign bookmark_first = bookmarks_sorted | first %}
  {% assign bookmark_latest = bookmarks_sorted | last %}
  {% assign bookmark_latest_ts = bookmark_latest.date | date: '%s' | plus: 0 %}
  {% assign bookmark_age_days = now_ts | minus: bookmark_latest_ts | divided_by: 86400 %}
  {% assign bookmark_age_months = bookmark_age_days | times: 1.0 | divided_by: 30 | round %}
  {% assign bookmark_age_years = bookmark_age_days | times: 1.0 | divided_by: 365 | round: 1 %}
  {% for post in bookmark_posts %}
    {% assign link_chunks = post.content | split: 'href=' %}
    {% assign links_in_post = link_chunks | size | minus: 1 %}
    {% assign bookmark_links_total = bookmark_links_total | plus: links_in_post %}
  {% endfor %}
  {% assign bookmark_avg_links = bookmark_links_total | times: 1.0 | divided_by: bookmark_count %}
{% else %}
  {% assign bookmark_age_days = 0 %}
  {% assign bookmark_avg_links = 0 %}
{% endif %}

{% assign someday_page = nil %}
{% for p in site.pages %}{% if p.permalink == '/someday/' %}{% assign someday_page = p %}{% endif %}{% endfor %}
{% assign someday_total = 0 %}
{% assign someday_done = 0 %}
{% if someday_page %}
  {% assign someday_html = someday_page.content | markdownify %}
  {% assign someday_items = someday_html | split: '<li>' %}
  {% assign someday_total = someday_items | size | minus: 1 %}
  {% for item in someday_items offset: 1 %}{% if item contains '<del>' %}{% assign someday_done = someday_done | plus: 1 %}{% endif %}{% endfor %}
{% endif %}
{% assign someday_open = someday_total | minus: someday_done %}
{% if someday_total > 0 %}{% assign someday_pct = someday_done | times: 100.0 | divided_by: someday_total %}{% else %}{% assign someday_pct = 0 %}{% endif %}

{% comment %}Garden-wide yearly history and shared chart scale.{% endcomment %}
{% assign history_first_year = now_year %}
{% if first_original %}{% assign candidate_year = first_original.date | date: '%Y' | plus: 0 %}{% if candidate_year < history_first_year %}{% assign history_first_year = candidate_year %}{% endif %}{% endif %}
{% if bookmark_first %}{% assign candidate_year = bookmark_first.date | date: '%Y' | plus: 0 %}{% if candidate_year < history_first_year %}{% assign history_first_year = candidate_year %}{% endif %}{% endif %}
{% if photos_first %}{% assign candidate_year = photos_first.date | date: '%Y' | plus: 0 %}{% if candidate_year < history_first_year %}{% assign history_first_year = candidate_year %}{% endif %}{% endif %}
{% if notes_first %}{% assign candidate_year = notes_first.date | date: '%Y' | plus: 0 %}{% if candidate_year < history_first_year %}{% assign history_first_year = candidate_year %}{% endif %}{% endif %}
{% if now_first_entry %}{% assign candidate_year = now_first_entry.date | date: '%Y' | plus: 0 %}{% if candidate_year < history_first_year %}{% assign history_first_year = candidate_year %}{% endif %}{% endif %}
{% assign max_year_activity = 1 %}
{% for history_year in (history_first_year..now_year) %}
  {% assign year_originals = 0 %}{% assign year_bookmarks = 0 %}{% assign year_photos = 0 %}{% assign year_notes = 0 %}{% assign year_now = 0 %}
  {% for post in original_posts %}{% assign item_year = post.date | date: '%Y' | plus: 0 %}{% if item_year == history_year %}{% assign year_originals = year_originals | plus: 1 %}{% endif %}{% endfor %}
  {% for post in bookmark_posts %}{% assign item_year = post.date | date: '%Y' | plus: 0 %}{% if item_year == history_year %}{% assign year_bookmarks = year_bookmarks | plus: 1 %}{% endif %}{% endfor %}
  {% for photo in photos %}{% assign item_year = photo.date | date: '%Y' | plus: 0 %}{% if item_year == history_year %}{% assign year_photos = year_photos | plus: 1 %}{% endif %}{% endfor %}
  {% for note in notes %}{% assign item_year = note.date | date: '%Y' | plus: 0 %}{% if item_year == history_year %}{% assign year_notes = year_notes | plus: 1 %}{% endif %}{% endfor %}
  {% for entry in now_timeline %}{% assign item_year = entry.date | date: '%Y' | plus: 0 %}{% if item_year == history_year %}{% assign year_now = year_now | plus: 1 %}{% endif %}{% endfor %}
  {% assign year_activity = year_originals | plus: year_bookmarks | plus: year_photos | plus: year_notes | plus: year_now %}
  {% if year_activity > max_year_activity %}{% assign max_year_activity = year_activity %}{% endif %}
{% endfor %}

{% comment %}Latest activity across first-class garden sections.{% endcomment %}
{% assign latest_activity_ts = latest_original_ts | default: 0 %}
{% assign latest_activity_label = 'Original writing' %}
{% assign latest_activity_date = latest_original.date %}
{% assign latest_activity_url = latest_original.url %}
{% if now_latest_ts and now_latest_ts > latest_activity_ts %}
  {% assign latest_activity_ts = now_latest_ts %}{% assign latest_activity_label = '/now' %}{% assign latest_activity_date = now_latest_entry.date %}{% assign latest_activity_url = '/now/' %}
{% endif %}
{% if notes_latest_ts and notes_latest_ts > latest_activity_ts %}
  {% assign latest_activity_ts = notes_latest_ts %}{% assign latest_activity_label = '/notes' %}{% assign latest_activity_date = notes_latest.date %}{% assign latest_activity_url = '/notes/' %}
{% endif %}
{% if photos_latest_ts and photos_latest_ts > latest_activity_ts %}
  {% assign latest_activity_ts = photos_latest_ts %}{% assign latest_activity_label = '/photos' %}{% assign latest_activity_date = photos_latest.date %}{% assign latest_activity_url = '/photos/' %}
{% endif %}
{% if bookmark_latest_ts and bookmark_latest_ts > latest_activity_ts %}
  {% assign latest_activity_ts = bookmark_latest_ts %}{% assign latest_activity_label = '/bookmarks' %}{% assign latest_activity_date = bookmark_latest.date %}{% assign latest_activity_url = '/bookmarks/' %}
{% endif %}
{% assign latest_activity_days = now_ts | minus: latest_activity_ts | divided_by: 86400 %}
{% assign latest_activity_months = latest_activity_days | times: 1.0 | divided_by: 30 | round %}
{% assign latest_activity_years = latest_activity_days | times: 1.0 | divided_by: 365 | round: 1 %}

<div class="stats-intro">
  <p class="stats-eyebrow">Private editorial cockpit</p>
  <p>This page is generated from the repository during every Jekyll build. It separates original writing from bookmark digests and turns the archive into concrete editorial actions.</p>
  <p class="stats-method"><strong>Method:</strong> word counts are estimates from rendered text after HTML is removed; code produced by syntax highlighting may still affect them. Updated {{ 'now' | date: '%d %b %Y' }}.</p>
</div>

<section class="stats-section" aria-labelledby="current-state">
  <div class="stats-section-heading">
    <div><p class="stats-kicker">At a glance</p><h2 id="current-state">Current state</h2></div>
    <span class="stats-status stats-status--neutral">{{ total_posts }} archive entries</span>
  </div>

  <div class="stats-grid stats-grid--hero">
    <article class="stat-card stat-card--accent">
      <p class="stat-label">Original articles</p>
      <p class="stat-value">{{ original_count }}</p>
      <p class="stat-note">{{ bookmark_count }} bookmark digests kept separate</p>
    </article>
    <article class="stat-card">
      <p class="stat-label">Latest original</p>
      <p class="stat-value">{{ days_since_original }}<span> day{% unless days_since_original == 1 %}s{% endunless %}</span></p>
      {% if latest_original %}<p class="stat-note">{% if months_since_original == 0 %}&lt;1 month ago{% else %}~{{ months_since_original }} month{% unless months_since_original == 1 %}s{% endunless %} ago{% endif %}{% if days_since_original >= 365 %} · ~{{ years_since_original }} year{% unless years_since_original == 1 %}s{% endunless %} ago{% endif %} · <a href="{{ latest_original.url | relative_url }}">{{ latest_original.title }}</a></p>{% endif %}
    </article>
    <article class="stat-card">
      <p class="stat-label">Trailing 12 months</p>
      <p class="stat-value">{{ original_last_12m }}<span> articles</span></p>
      <p class="stat-note">Previous period: {{ original_prev_12m }} · {{ original_delta_pct | round: 1 }}% change</p>
    </article>
    <article class="stat-card">
      <p class="stat-label">Estimated visible words</p>
      <p class="stat-value">{{ original_words | divided_by: 1000.0 | round: 1 }}k</p>
      <p class="stat-note">Original writing only · {{ avg_original_words | round }} average</p>
    </article>
    <article class="stat-card {% if connected_pct < 50 %}stat-card--warn{% endif %}">
      <p class="stat-label">Articles linking internally</p>
      <p class="stat-value">{{ connected_pct | round: 1 }}%</p>
      <div class="stat-progress" role="img" aria-label="{{ connected_posts }} of {{ original_count }} original articles contain an internal link"><span style="width: {{ connected_pct | at_most: 100 }}%"></span></div>
      <p class="stat-note">{{ connected_posts }} of {{ original_count }} link to another article or site page</p>
    </article>
    <article class="stat-card">
      <p class="stat-label">Latest garden activity</p>
      <p class="stat-value stat-value--text"><a href="{{ latest_activity_url | relative_url }}">{{ latest_activity_label }}</a></p>
      <p class="stat-note">{{ latest_activity_date | date: '%d %b %Y' }} · {{ latest_activity_days }} day{% unless latest_activity_days == 1 %}s{% endunless %} ago · {% if latest_activity_months == 0 %}&lt;1 month ago{% else %}~{{ latest_activity_months }} month{% unless latest_activity_months == 1 %}s{% endunless %} ago{% endif %}{% if latest_activity_days >= 365 %} · ~{{ latest_activity_years }} year{% unless latest_activity_years == 1 %}s{% endunless %} ago{% endif %}</p>
    </article>
  </div>
</section>

<section class="stats-section" aria-labelledby="publishing-history">
  <div class="stats-section-heading">
    <div><p class="stats-kicker">Movement</p><h2 id="publishing-history">Garden history</h2></div>
    <span class="stats-status stats-status--neutral">Original gap avg {{ avg_gap_days | round: 1 }} days</span>
  </div>
  <div class="chart-card">
    <div class="chart-legend" aria-hidden="true">
      <span><i class="legend-original"></i>Originals</span>
      <span><i class="legend-bookmarks"></i>Bookmarks</span>
      <span><i class="legend-photos"></i>Photos</span>
      <span><i class="legend-notes"></i>Notes</span>
      <span><i class="legend-now"></i>/now</span>
    </div>
    <div class="year-chart" role="img" aria-label="Yearly activity across original articles, bookmark digests, photos, notes, and now updates">
      {% for year_offset in (0..9) %}
        {% assign history_year = now_year | minus: year_offset %}
        {% if history_year >= history_first_year %}
        {% assign year_originals = 0 %}{% assign year_bookmarks = 0 %}{% assign year_photos = 0 %}{% assign year_notes = 0 %}{% assign year_now = 0 %}{% assign year_words = 0 %}
        {% for post in original_posts %}{% assign item_year = post.date | date: '%Y' | plus: 0 %}{% if item_year == history_year %}{% assign year_originals = year_originals | plus: 1 %}{% assign post_words = post.content | strip_html | number_of_words %}{% assign year_words = year_words | plus: post_words %}{% endif %}{% endfor %}
        {% for post in bookmark_posts %}{% assign item_year = post.date | date: '%Y' | plus: 0 %}{% if item_year == history_year %}{% assign year_bookmarks = year_bookmarks | plus: 1 %}{% endif %}{% endfor %}
        {% for photo in photos %}{% assign item_year = photo.date | date: '%Y' | plus: 0 %}{% if item_year == history_year %}{% assign year_photos = year_photos | plus: 1 %}{% endif %}{% endfor %}
        {% for note in notes %}{% assign item_year = note.date | date: '%Y' | plus: 0 %}{% if item_year == history_year %}{% assign year_notes = year_notes | plus: 1 %}{% endif %}{% endfor %}
        {% for entry in now_timeline %}{% assign item_year = entry.date | date: '%Y' | plus: 0 %}{% if item_year == history_year %}{% assign year_now = year_now | plus: 1 %}{% endif %}{% endfor %}
        {% assign original_width = year_originals | times: 100.0 | divided_by: max_year_activity %}
        {% assign bookmark_width = year_bookmarks | times: 100.0 | divided_by: max_year_activity %}
        {% assign photo_width = year_photos | times: 100.0 | divided_by: max_year_activity %}
        {% assign note_width = year_notes | times: 100.0 | divided_by: max_year_activity %}
        {% assign now_width = year_now | times: 100.0 | divided_by: max_year_activity %}
        <div class="year-row">
          <span class="year-label">{{ history_year }}</span>
          <div class="year-bars">
            <div class="year-output" aria-label="{{ year_originals }} originals, {{ year_bookmarks }} bookmarks, {{ year_photos }} photos, {{ year_notes }} notes, {{ year_now }} now updates">
              {% if year_originals > 0 %}<span class="year-segment year-segment--original" style="width: {{ original_width }}%"><b>{{ year_originals }}</b></span>{% endif %}
              {% if year_bookmarks > 0 %}<span class="year-segment year-segment--bookmark" style="width: {{ bookmark_width }}%"><b>{{ year_bookmarks }}</b></span>{% endif %}
              {% if year_photos > 0 %}<span class="year-segment year-segment--photo" style="width: {{ photo_width }}%"><b>{{ year_photos }}</b></span>{% endif %}
              {% if year_notes > 0 %}<span class="year-segment year-segment--note" style="width: {{ note_width }}%"><b>{{ year_notes }}</b></span>{% endif %}
              {% if year_now > 0 %}<span class="year-segment year-segment--now" style="width: {{ now_width }}%"><b>{{ year_now }}</b></span>{% endif %}
            </div>
            <span class="year-words">{{ year_words | divided_by: 1000.0 | round: 1 }}k words</span>
          </div>
        </div>
        {% endif %}
      {% endfor %}
    </div>
  </div>
  <details class="stats-details">
    <summary>Complete yearly data</summary>
    <div class="stats-table-wrap">
      <table>
        <thead><tr><th>Year</th><th>Originals</th><th>Bookmarks</th><th>Photos</th><th>Notes</th><th>/now</th><th>Estimated original words</th></tr></thead>
        <tbody>
        {% for history_year in (history_first_year..now_year) reversed %}
          {% assign year_originals = 0 %}{% assign year_bookmarks = 0 %}{% assign year_photos = 0 %}{% assign year_notes = 0 %}{% assign year_now = 0 %}{% assign year_words = 0 %}
          {% for post in original_posts %}{% assign item_year = post.date | date: '%Y' | plus: 0 %}{% if item_year == history_year %}{% assign year_originals = year_originals | plus: 1 %}{% assign post_words = post.content | strip_html | number_of_words %}{% assign year_words = year_words | plus: post_words %}{% endif %}{% endfor %}
          {% for post in bookmark_posts %}{% assign item_year = post.date | date: '%Y' | plus: 0 %}{% if item_year == history_year %}{% assign year_bookmarks = year_bookmarks | plus: 1 %}{% endif %}{% endfor %}
          {% for photo in photos %}{% assign item_year = photo.date | date: '%Y' | plus: 0 %}{% if item_year == history_year %}{% assign year_photos = year_photos | plus: 1 %}{% endif %}{% endfor %}
          {% for note in notes %}{% assign item_year = note.date | date: '%Y' | plus: 0 %}{% if item_year == history_year %}{% assign year_notes = year_notes | plus: 1 %}{% endif %}{% endfor %}
          {% for entry in now_timeline %}{% assign item_year = entry.date | date: '%Y' | plus: 0 %}{% if item_year == history_year %}{% assign year_now = year_now | plus: 1 %}{% endif %}{% endfor %}
          <tr><td>{{ history_year }}</td><td>{{ year_originals }}</td><td>{{ year_bookmarks }}</td><td>{{ year_photos }}</td><td>{{ year_notes }}</td><td>{{ year_now }}</td><td>{{ year_words }}</td></tr>
        {% endfor %}
        </tbody>
      </table>
    </div>
  </details>
</section>

<section class="stats-section" aria-labelledby="content-shape">
  <div class="stats-section-heading"><div><p class="stats-kicker">Depth and mix</p><h2 id="content-shape">Content shape</h2></div></div>
  {% if original_count > 0 %}
    {% assign short_pct = words_short | times: 100.0 | divided_by: original_count %}
    {% assign medium_pct = words_medium | times: 100.0 | divided_by: original_count %}
    {% assign long_pct = words_long | times: 100.0 | divided_by: original_count %}
  {% else %}
    {% assign short_pct = 0 %}{% assign medium_pct = 0 %}{% assign long_pct = 0 %}
  {% endif %}
  <div class="stats-grid stats-grid--two">
    <article class="panel-card">
      <h3>Estimated article length</h3>
      <div class="distribution" aria-label="Article length distribution">
        <div><span>Short · under 800</span><strong>{{ words_short }} · {{ short_pct | round: 1 }}%</strong><div class="mini-bar"><i style="width: {{ short_pct }}%"></i></div></div>
        <div><span>Medium · 800–1,999</span><strong>{{ words_medium }} · {{ medium_pct | round: 1 }}%</strong><div class="mini-bar"><i style="width: {{ medium_pct }}%"></i></div></div>
        <div><span>Long · 2,000+</span><strong>{{ words_long }} · {{ long_pct | round: 1 }}%</strong><div class="mini-bar"><i style="width: {{ long_pct }}%"></i></div></div>
      </div>
      {% if longest_original %}<p class="panel-foot">Longest: <a href="{{ longest_original.url | relative_url }}">{{ longest_original.title }}</a> · {{ longest_original_words }} estimated words</p>{% endif %}
    </article>
    <article class="panel-card">
      <h3>Formats used</h3>
      <div class="metric-list">
        <p><span>Articles with code</span><strong>{{ posts_with_code }}</strong></p>
        <p><span>Articles with Mermaid</span><strong>{{ posts_with_mermaid }}</strong></p>
        <p><span>Structured with headings</span><strong>{{ posts_with_headings }}</strong></p>
        <p><span>Inline images</span><strong>{{ posts_with_images }}</strong></p>
        <p><span>Updated after publishing</span><strong>{{ updated_posts }}</strong></p>
      </div>
      {% if code_unique_languages > 0 %}
      <div class="code-language-list" aria-label="Languages detected in original article code blocks">
        {% for language_name in code_language_names %}
          {% if language_name != '' %}
            {% assign language_blocks = 0 %}
            {% assign language_space_needle = 'class="language-' | append: language_name | append: ' ' %}
            {% assign language_quote_needle = 'class="language-' | append: language_name | append: '"' %}
            {% for post in original_posts %}
              {% assign chunks = post.content | split: language_space_needle %}
              {% assign language_blocks = language_blocks | plus: chunks.size | minus: 1 %}
              {% assign chunks = post.content | split: language_quote_needle %}
              {% assign language_blocks = language_blocks | plus: chunks.size | minus: 1 %}
            {% endfor %}
            <span><code>{{ language_name }}</code> {{ language_blocks }}</span>
          {% endif %}
        {% endfor %}
      </div>
      {% endif %}
    </article>
  </div>
  <article class="panel-card panel-card--wide">
    <h3>Original topics</h3>
    <p class="panel-subtitle">Recent means {{ recent_year_boundary }}–{{ now_year }}. Bookmark tags are excluded.</p>
    <div class="topic-grid">
      {% for desired_hits in (1..top_original_tag_count) reversed %}
        {% for tag_name in original_tag_names %}
          {% if tag_name != '' %}
            {% assign tag_hits = 0 %}{% assign recent_hits = 0 %}
            {% for post in original_posts %}
              {% assign post_tags_downcase = post.tags | join: '|' | downcase | split: '|' %}
              {% if post_tags_downcase contains tag_name %}
                {% assign tag_hits = tag_hits | plus: 1 %}
                {% assign tag_year = post.date | date: '%Y' | plus: 0 %}
                {% if tag_year >= recent_year_boundary %}{% assign recent_hits = recent_hits | plus: 1 %}{% endif %}
              {% endif %}
            {% endfor %}
            {% if tag_hits == desired_hits %}
              {% assign topic_pct = tag_hits | times: 100.0 | divided_by: original_count %}
              <div class="topic-row"><a href="{{ '/tags/?t=' | append: tag_name | uri_escape | relative_url }}">{{ tag_name }}</a><div class="topic-track"><i style="width: {{ topic_pct }}%"></i></div><strong>{{ tag_hits }}</strong><small>{{ recent_hits }} recent</small></div>
            {% endif %}
          {% endif %}
        {% endfor %}
      {% endfor %}
    </div>
  </article>
</section>

<section class="stats-section" aria-labelledby="connectivity">
  {% assign cross_section_links = links_to_notes | plus: links_to_now | plus: links_to_photos | plus: links_to_bookmarks | plus: links_to_someday %}
  <div class="stats-section-heading">
    <div><p class="stats-kicker">Knowledge graph</p><h2 id="connectivity">Garden connectivity</h2></div>
    <span class="stats-status {% if connected_pct < 50 %}stats-status--warn{% else %}stats-status--good{% endif %}">{{ connected_pct | round: 1 }}% link internally</span>
  </div>
  <div class="stats-grid stats-grid--two">
    <article class="panel-card">
      <h3>Links from articles to garden sections</h3>
      {% if cross_section_links > 0 %}
        <div class="metric-list">
          {% if links_to_notes > 0 %}<p><span><a href="{{ '/notes/' | relative_url }}">/notes</a></span><strong>{{ links_to_notes }}</strong></p>{% endif %}
          {% if links_to_now > 0 %}<p><span><a href="{{ '/now/' | relative_url }}">/now</a></span><strong>{{ links_to_now }}</strong></p>{% endif %}
          {% if links_to_photos > 0 %}<p><span><a href="{{ '/photos/' | relative_url }}">/photos</a></span><strong>{{ links_to_photos }}</strong></p>{% endif %}
          {% if links_to_bookmarks > 0 %}<p><span><a href="{{ '/bookmarks/' | relative_url }}">/bookmarks</a></span><strong>{{ links_to_bookmarks }}</strong></p>{% endif %}
          {% if links_to_someday > 0 %}<p><span><a href="{{ '/someday/' | relative_url }}">/someday</a></span><strong>{{ links_to_someday }}</strong></p>{% endif %}
        </div>
      {% else %}
        <p class="big-inline"><strong>0</strong><span>No original article currently links to a garden section.</span></p>
      {% endif %}
      <p class="panel-foot">{{ total_internal_links }} total internal links point to articles or other site pages · {{ total_external_links }} external references</p>
    </article>
    <article class="panel-card">
      <h3>Article backlinks</h3>
      <p class="big-inline"><strong>{{ posts_without_incoming }}</strong><span>original articles are not linked from another original article.</span></p>
      <p class="panel-foot">Why it matters: contextual links help readers rediscover older writing. This count excludes navigation, tag pages, related-post cards, and links from notes or other garden sections; it is a discoverability signal, not a quality score.</p>
      {% if top_hub_incoming > 0 %}<p class="panel-foot">Most referenced: <a href="{{ top_hub_url | relative_url }}">{{ top_hub_title }}</a> · {{ top_hub_incoming }} incoming links</p>{% else %}<p class="panel-foot">No article-to-article hubs detected yet.</p>{% endif %}
    </article>
  </div>
  <details class="stats-details">
    <summary>Original articles linked from other originals</summary>
    <ol class="ranked-list">
      {% assign shown_hubs = 0 %}
      {% for record in incoming_records_sorted %}
        {% if shown_hubs < 10 and record contains '::' %}
          {% assign cols = record | strip | split: '::' %}{% assign incoming = cols[3] | plus: 0 %}
          {% if incoming > 0 %}<li><a href="{{ cols[1] | relative_url }}">{{ cols[2] }}</a><span>{{ incoming }} incoming</span></li>{% assign shown_hubs = shown_hubs | plus: 1 %}{% endif %}
        {% endif %}
      {% endfor %}
      {% if shown_hubs == 0 %}<li>No internally referenced articles found.</li>{% endif %}
    </ol>
  </details>
</section>

<section class="stats-section" aria-labelledby="garden-activity">
  <div class="stats-section-heading"><div><p class="stats-kicker">Beyond articles</p><h2 id="garden-activity">Garden activity</h2></div></div>
  <div class="garden-grid">
    <article class="garden-card">
      <div class="garden-card-head"><h3><a href="{{ '/now/' | relative_url }}">/now</a></h3>{% if now_age_days > 180 %}<span class="stats-status stats-status--warn">stale</span>{% else %}<span class="stats-status stats-status--good">active</span>{% endif %}</div>
      <p class="garden-value">{{ now_updates }} <span>updates</span></p>
      {% if now_updates > 0 %}<p>Latest {{ now_latest_entry.date | date: '%d %b %Y' }} · {{ now_age_days }} day{% unless now_age_days == 1 %}s{% endunless %} ago · {% if now_age_months == 0 %}&lt;1 month ago{% else %}~{{ now_age_months }} month{% unless now_age_months == 1 %}s{% endunless %} ago{% endif %}{% if now_age_days >= 365 %} · ~{{ now_age_years }} year{% unless now_age_years == 1 %}s{% endunless %} ago{% endif %}</p><p class="garden-meta">{{ now_recent_90 }} updates in the last 90 days</p>{% endif %}
      <p class="garden-meta">Work {{ now_work }} · Personal {{ now_personal }} · Travel {{ now_travels }} · Gaming {{ now_gaming }}</p>
    </article>
    <article class="garden-card">
      <div class="garden-card-head"><h3><a href="{{ '/notes/' | relative_url }}">/notes</a></h3>{% if notes_age_days > 180 %}<span class="stats-status stats-status--warn">stale</span>{% else %}<span class="stats-status stats-status--good">active</span>{% endif %}</div>
      <p class="garden-value">{{ notes_total }} <span>notes</span></p>
      {% if notes_total > 0 %}<p>Latest {{ notes_latest.date | date: '%d %b %Y' }} · {{ notes_age_days }} day{% unless notes_age_days == 1 %}s{% endunless %} ago · {% if notes_age_months == 0 %}&lt;1 month ago{% else %}~{{ notes_age_months }} month{% unless notes_age_months == 1 %}s{% endunless %} ago{% endif %}{% if notes_age_days >= 365 %} · ~{{ notes_age_years }} year{% unless notes_age_years == 1 %}s{% endunless %} ago{% endif %}</p><p class="garden-meta">{{ notes_recent_90 }} notes in the last 90 days</p>{% endif %}
      <p class="garden-meta">{{ notes_unique_moods }} moods · {{ notes_unique_tags }} normalized tags · {{ note_links_to_garden }} links to other sections</p>
    </article>
    <article class="garden-card">
      <div class="garden-card-head"><h3><a href="{{ '/photos/' | relative_url }}">/photos</a></h3>{% if photos_age_days > 180 %}<span class="stats-status stats-status--warn">stale</span>{% else %}<span class="stats-status stats-status--good">active</span>{% endif %}</div>
      <p class="garden-value">{{ photos_total }} <span>photos</span></p>
      {% if photos_total > 0 %}<p>Latest {{ photos_latest.date | date: '%d %b %Y' }} · {{ photos_age_days }} day{% unless photos_age_days == 1 %}s{% endunless %} ago · {% if photos_age_months == 0 %}&lt;1 month ago{% else %}~{{ photos_age_months }} month{% unless photos_age_months == 1 %}s{% endunless %} ago{% endif %}{% if photos_age_days >= 365 %} · ~{{ photos_age_years }} year{% unless photos_age_years == 1 %}s{% endunless %} ago{% endif %}</p><p class="garden-meta">{{ photos_recent_365 }} photos in the last 365 days</p>{% endif %}
      <p class="garden-meta">{{ photo_unique_locations }} locations · top {{ photo_top_location }} ({{ photo_top_location_count }})</p>
      <p class="garden-meta">Busiest year {{ photo_top_year }} ({{ photo_top_year_count }}) · top tag {{ photo_top_tag }} ({{ photo_top_tag_count }})</p>
    </article>
    <article class="garden-card">
      <div class="garden-card-head"><h3><a href="{{ '/bookmarks/' | relative_url }}">/bookmarks</a></h3>{% if bookmark_age_days > 365 %}<span class="stats-status stats-status--neutral">paused</span>{% else %}<span class="stats-status stats-status--good">active</span>{% endif %}</div>
      <p class="garden-value">{{ bookmark_count }} <span>digests</span></p>
      {% if bookmark_count > 0 %}<p>Latest {{ bookmark_latest.date | date: '%d %b %Y' }} · {{ bookmark_age_days }} day{% unless bookmark_age_days == 1 %}s{% endunless %} ago · {% if bookmark_age_months == 0 %}&lt;1 month ago{% else %}~{{ bookmark_age_months }} month{% unless bookmark_age_months == 1 %}s{% endunless %} ago{% endif %}{% if bookmark_age_days >= 365 %} · ~{{ bookmark_age_years }} year{% unless bookmark_age_years == 1 %}s{% endunless %} ago{% endif %}</p>{% endif %}
      <p class="garden-meta">{{ bookmark_links_total }} links tracked · {{ bookmark_avg_links | round: 1 }} average</p>
    </article>
    <article class="garden-card garden-card--someday">
      <div class="garden-card-head"><h3><a href="{{ '/someday/' | relative_url }}">/someday</a></h3><span class="stats-status stats-status--neutral">personal</span></div>
      <p class="garden-value">{{ someday_pct | round: 1 }}%</p>
      <div class="stat-progress" role="img" aria-label="{{ someday_done }} of {{ someday_total }} goals completed"><span style="width: {{ someday_pct | at_most: 100 }}%"></span></div>
      <p class="garden-meta">{{ someday_done }} complete · {{ someday_open }} open</p>
    </article>
  </div>
</section>

<section class="stats-section" aria-labelledby="editorial-queue">
  <div class="stats-section-heading"><div><p class="stats-kicker">Next actions</p><h2 id="editorial-queue">Editorial queue</h2></div><span class="stats-status stats-status--warn">prioritized</span></div>

  <article class="queue-card">
    <div class="queue-heading"><div><h3>Refresh candidates</h3><p>One point each for age, length, code, no update date, no internal link, and a missing cover on <code>layout: post</code>.</p></div></div>
    <ol class="queue-list">
      {% assign shown_refresh = 0 %}
      {% for record in refresh_records_sorted %}
        {% if shown_refresh < 12 and record contains '::' %}
          {% assign cols = record | strip | split: '::' %}
          {% assign score = cols[3] | plus: 0 %}
          {% if score >= 3 %}
            {% assign age_days = cols[4] | plus: 0 %}{% assign age_years = age_days | times: 1.0 | divided_by: 365 %}
            <li>
              <div><a href="{{ cols[1] | relative_url }}">{{ cols[2] }}</a><span class="queue-meta">{{ cols[5] }} words · {{ age_years | round: 1 }} years</span></div>
              <div class="reason-list"><strong>{{ score }}/6</strong>{% if cols[6] == '1' %}<span>old</span>{% endif %}{% if cols[7] == '1' %}<span>long</span>{% endif %}{% if cols[8] == '1' %}<span>code</span>{% endif %}{% if cols[9] == '1' %}<span>never updated</span>{% endif %}{% if cols[10] == '1' %}<span>unlinked</span>{% endif %}{% if cols[11] == '1' %}<span>no cover</span>{% endif %}</div>
            </li>
            {% assign shown_refresh = shown_refresh | plus: 1 %}
          {% endif %}
        {% endif %}
      {% endfor %}
      {% if shown_refresh == 0 %}<li>No candidate scores three or more points.</li>{% endif %}
    </ol>
  </article>

  <div class="stats-grid stats-grid--two stats-grid--queues">
    <article class="queue-card">
      <div class="queue-heading"><div><h3>Connect next</h3><p>Recent original entries without an internal site link.</p></div><span>{{ isolated_posts }}</span></div>
      <ul class="compact-list">
        {% assign shown_unlinked = 0 %}
        {% for post in original_posts %}
          {% if shown_unlinked < 10 %}
            {% assign relative_links = post.content | split: 'href="/' | size | minus: 1 %}
            {% assign absolute_links = post.content | split: 'href="https://domenicoluciani.com/' | size | minus: 1 %}
            {% assign internal_links = relative_links | plus: absolute_links %}
            {% if internal_links == 0 %}<li><a href="{{ post.url | relative_url }}">{{ post.title }}</a><span>{{ post.date | date: '%Y' }}</span></li>{% assign shown_unlinked = shown_unlinked | plus: 1 %}{% endif %}
          {% endif %}
        {% endfor %}
        {% if shown_unlinked == 0 %}<li>Every original entry has an internal site link.</li>{% endif %}
      </ul>
    </article>
    <article class="queue-card">
      <div class="queue-heading"><div><h3>Metadata fixes</h3><p>Descriptions and tags for all originals; covers only for <code>layout: post</code>.</p></div><span>{{ missing_covers | plus: missing_descriptions | plus: missing_tags }}</span></div>
      <ul class="compact-list">
        {% assign shown_metadata = 0 %}
        {% for post in original_posts %}
          {% if shown_metadata < 10 %}
            {% assign needs_metadata = false %}
            {% if post.layout == 'post' %}{% unless post.cover or post.image %}{% assign needs_metadata = true %}{% endunless %}{% endif %}
            {% if post.description == nil or post.description == '' %}{% assign needs_metadata = true %}{% endif %}
            {% if post.tags == empty or post.tags.size == 0 %}{% assign needs_metadata = true %}{% endif %}
            {% if needs_metadata %}
              <li><a href="{{ post.url | relative_url }}">{{ post.title }}</a><span>{% if post.layout == 'post' %}{% unless post.cover or post.image %}cover {% endunless %}{% endif %}{% if post.description == nil or post.description == '' %}description {% endif %}{% if post.tags == empty or post.tags.size == 0 %}tags{% endif %}</span></li>
              {% assign shown_metadata = shown_metadata | plus: 1 %}
            {% endif %}
          {% endif %}
        {% endfor %}
        {% if shown_metadata == 0 %}<li>No metadata gaps found.</li>{% endif %}
      </ul>
    </article>
  </div>

  <details class="stats-details">
    <summary>Taxonomy maintenance</summary>
    <div class="taxonomy-summary">
      <p><strong>Original writing:</strong> {{ original_unique_tags }} normalized tags; {{ original_single_use_tags }} used once.</p>
      <p><strong>Photos:</strong> {{ photo_unique_tags }} normalized tags; {{ photo_single_use_tags }} used once ({{ photo_single_use_pct | round: 1 }}%).</p>
      <p><strong>Notes:</strong> {{ notes_unique_tags }} normalized tags; {{ notes_single_use_tags }} used once.</p>
      {% if note_variant_count > 0 %}
        <p><strong>Possible note-tag variants:</strong>
          {% assign shown_variants = 0 %}
          {% for record in note_variant_records %}
            {% if record contains '::' %}{% assign cols = record | strip | split: '::' %}{% if shown_variants > 0 %} · {% endif %}<code>{{ cols[0] }}</code> / <code>{{ cols[1] }}</code>{% assign shown_variants = shown_variants | plus: 1 %}{% endif %}
          {% endfor %}
        </p>
      {% endif %}
    </div>
  </details>
</section>

<footer class="stats-footer">
  <p><strong>Sources:</strong> <code>site.posts</code>, <code>_data/now.yml</code>, <code>_data/notes.yml</code>, <code>_data/photos.yml</code>, and <code>someday.md</code>.</p>
  <p>This is an editorial aid, not audience analytics. It is hidden from navigation and marked <code>noindex, nofollow</code>, but it is not access-controlled.</p>
</footer>
