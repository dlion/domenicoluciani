---
layout: page
title: Editorial Dashboard
permalink: /stats/
sitemap: false
robots: noindex, nofollow
hide_progress: true
---

{% assign posts = site.posts %}
{% assign total_posts = posts | size %}
{% assign now_ts = 'now' | date: '%s' | plus: 0 %}
{% assign now_year = 'now' | date: '%Y' | plus: 0 %}
{% assign now_month = 'now' | date: '%m' | plus: 0 %}
{% assign current_month_index = now_year | times: 12 | plus: now_month %}
{% assign last_year = now_year | minus: 1 %}
{% assign boundary_12 = current_month_index | minus: 12 %}
{% assign boundary_24 = current_month_index | minus: 24 %}

{% assign total_words = 0 %}
{% assign words_short = 0 %}
{% assign words_medium = 0 %}
{% assign words_long = 0 %}

{% assign total_tag_links = 0 %}
{% assign posts_with_multiple_tags = 0 %}
{% assign missing_tags = 0 %}
{% assign missing_description = 0 %}
{% assign missing_cover = 0 %}

{% assign posts_with_updates = 0 %}
{% assign total_update_delay_days = 0 %}
{% assign stale_unupdated_posts = 0 %}

{% assign posts_with_code = 0 %}
{% assign posts_with_mermaid = 0 %}
{% assign posts_with_external_links = 0 %}
{% assign posts_hn = 0 %}
{% assign posts_reddit = 0 %}

{% assign bookmark_posts = 0 %}
{% assign non_bookmark_posts = 0 %}

{% assign posts_last_30 = 0 %}
{% assign posts_last_90 = 0 %}
{% assign posts_last_365 = 0 %}
{% assign posts_last_12m = 0 %}
{% assign words_last_12m = 0 %}
{% assign posts_prev_12m = 0 %}
{% assign words_prev_12m = 0 %}
{% assign posts_this_year = 0 %}
{% assign words_this_year = 0 %}
{% assign posts_last_year = 0 %}
{% assign words_last_year = 0 %}

{% assign longest_words = 0 %}
{% assign shortest_words = 99999999 %}
{% assign longest_post = nil %}
{% assign shortest_post = nil %}

{% for post in posts %}
  {% assign words = post.content | number_of_words %}
  {% assign total_words = total_words | plus: words %}

  {% if words < 800 %}
    {% assign words_short = words_short | plus: 1 %}
  {% elsif words < 2000 %}
    {% assign words_medium = words_medium | plus: 1 %}
  {% else %}
    {% assign words_long = words_long | plus: 1 %}
  {% endif %}

  {% if words > longest_words %}
    {% assign longest_words = words %}
    {% assign longest_post = post %}
  {% endif %}
  {% if words < shortest_words %}
    {% assign shortest_words = words %}
    {% assign shortest_post = post %}
  {% endif %}

  {% assign tag_count = post.tags | size %}
  {% assign total_tag_links = total_tag_links | plus: tag_count %}
  {% if tag_count == 0 %}
    {% assign missing_tags = missing_tags | plus: 1 %}
  {% endif %}
  {% if tag_count > 1 %}
    {% assign posts_with_multiple_tags = posts_with_multiple_tags | plus: 1 %}
  {% endif %}

  {% if post.description == nil or post.description == '' %}
    {% assign missing_description = missing_description | plus: 1 %}
  {% endif %}

  {% assign has_cover = false %}
  {% if post.cover or post.image %}
    {% assign has_cover = true %}
  {% endif %}
  {% unless has_cover %}
    {% assign missing_cover = missing_cover | plus: 1 %}
  {% endunless %}

  {% assign post_ts = post.date | date: '%s' | plus: 0 %}
  {% assign age_days = now_ts | minus: post_ts | divided_by: 86400 %}

  {% if age_days <= 30 %}
    {% assign posts_last_30 = posts_last_30 | plus: 1 %}
  {% endif %}
  {% if age_days <= 90 %}
    {% assign posts_last_90 = posts_last_90 | plus: 1 %}
  {% endif %}
  {% if age_days <= 365 %}
    {% assign posts_last_365 = posts_last_365 | plus: 1 %}
  {% endif %}

  {% assign post_year = post.date | date: '%Y' | plus: 0 %}
  {% assign post_month = post.date | date: '%m' | plus: 0 %}
  {% assign post_month_index = post_year | times: 12 | plus: post_month %}

  {% if post_month_index > boundary_12 and post_month_index <= current_month_index %}
    {% assign posts_last_12m = posts_last_12m | plus: 1 %}
    {% assign words_last_12m = words_last_12m | plus: words %}
  {% elsif post_month_index > boundary_24 and post_month_index <= boundary_12 %}
    {% assign posts_prev_12m = posts_prev_12m | plus: 1 %}
    {% assign words_prev_12m = words_prev_12m | plus: words %}
  {% endif %}

  {% if post_year == now_year %}
    {% assign posts_this_year = posts_this_year | plus: 1 %}
    {% assign words_this_year = words_this_year | plus: words %}
  {% endif %}
  {% if post_year == last_year %}
    {% assign posts_last_year = posts_last_year | plus: 1 %}
    {% assign words_last_year = words_last_year | plus: words %}
  {% endif %}

  {% if post.updated %}
    {% assign posts_with_updates = posts_with_updates | plus: 1 %}
    {% assign updated_ts = post.updated | date: '%s' | plus: 0 %}
    {% assign update_gap = updated_ts | minus: post_ts | divided_by: 86400 %}
    {% if update_gap > 0 %}
      {% assign total_update_delay_days = total_update_delay_days | plus: update_gap %}
    {% endif %}
  {% elsif age_days > 730 %}
    {% assign stale_unupdated_posts = stale_unupdated_posts | plus: 1 %}
  {% endif %}

  {% if post.content contains '```' %}
    {% assign posts_with_code = posts_with_code | plus: 1 %}
  {% endif %}
  {% if post.content contains '```mermaid' %}
    {% assign posts_with_mermaid = posts_with_mermaid | plus: 1 %}
  {% endif %}
  {% if post.content contains 'http://' or post.content contains 'https://' %}
    {% assign posts_with_external_links = posts_with_external_links | plus: 1 %}
  {% endif %}

  {% if post.hn_url %}
    {% assign posts_hn = posts_hn | plus: 1 %}
  {% endif %}
  {% if post.reddit_url %}
    {% assign posts_reddit = posts_reddit | plus: 1 %}
  {% endif %}

  {% assign is_bookmark = false %}
  {% if post.tags contains 'bookmarks' or post.title contains ' - Bookmarks' %}
    {% assign is_bookmark = true %}
  {% endif %}
  {% if is_bookmark %}
    {% assign bookmark_posts = bookmark_posts | plus: 1 %}
  {% else %}
    {% assign non_bookmark_posts = non_bookmark_posts | plus: 1 %}
  {% endif %}
{% endfor %}

{% assign grouped_by_month = posts | group_by_exp: 'post', "post.date | date: '%Y-%m'" %}
{% assign months_count = grouped_by_month | size %}
{% assign months_sorted_asc = grouped_by_month | sort: 'name' %}
{% assign months_sorted_desc = months_sorted_asc | reverse %}
{% assign grouped_by_year = posts | group_by_exp: 'post', "post.date | date: '%Y'" | sort: 'name' | reverse %}

{% if total_posts > 0 %}
  {% assign sorted_posts_asc = posts | sort: 'date' %}
  {% assign first_post = sorted_posts_asc | first %}
  {% assign latest_post = sorted_posts_asc | last %}

  {% assign first_post_year = first_post.date | date: '%Y' | plus: 0 %}
  {% assign first_post_month = first_post.date | date: '%m' | plus: 0 %}
  {% assign first_month_index = first_post_year | times: 12 | plus: first_post_month %}
  {% assign possible_months = current_month_index | minus: first_month_index | plus: 1 %}

  {% assign latest_post_ts = latest_post.date | date: '%s' | plus: 0 %}
  {% assign days_since_last_post = now_ts | minus: latest_post_ts | divided_by: 86400 %}

  {% assign latest_post_year = latest_post.date | date: '%Y' | plus: 0 %}
  {% assign latest_post_month = latest_post.date | date: '%m' | plus: 0 %}
  {% assign latest_post_month_index = latest_post_year | times: 12 | plus: latest_post_month %}
  {% assign months_since_last_post = current_month_index | minus: latest_post_month_index %}

  {% assign avg_words = total_words | times: 1.0 | divided_by: total_posts %}
  {% assign avg_read_minutes = avg_words | times: 1.0 | divided_by: 200 %}

  {% assign prev_ts = 0 %}
  {% assign prev_post = nil %}
  {% assign total_gap_days = 0 %}
  {% assign max_gap_days = 0 %}
  {% assign max_gap_from = nil %}
  {% assign max_gap_to = nil %}
  {% assign gap_count = 0 %}

  {% for post in sorted_posts_asc %}
    {% assign post_ts = post.date | date: '%s' | plus: 0 %}
    {% if prev_ts != 0 %}
      {% assign gap_days = post_ts | minus: prev_ts | divided_by: 86400 %}
      {% assign total_gap_days = total_gap_days | plus: gap_days %}
      {% assign gap_count = gap_count | plus: 1 %}
      {% if gap_days > max_gap_days %}
        {% assign max_gap_days = gap_days %}
        {% assign max_gap_from = prev_post %}
        {% assign max_gap_to = post %}
      {% endif %}
    {% endif %}
    {% assign prev_ts = post_ts %}
    {% assign prev_post = post %}
  {% endfor %}

  {% if gap_count > 0 %}
    {% assign avg_gap_days = total_gap_days | times: 1.0 | divided_by: gap_count %}
  {% else %}
    {% assign avg_gap_days = 0 %}
  {% endif %}

  {% if possible_months > 0 %}
    {% assign monthly_coverage = months_count | times: 100.0 | divided_by: possible_months %}
  {% else %}
    {% assign monthly_coverage = 0 %}
  {% endif %}

  {% assign prev_month_index = nil %}
  {% assign current_streak = 0 %}
  {% assign current_streak_start = '' %}
  {% assign longest_streak = 0 %}
  {% assign longest_streak_start = '' %}
  {% assign longest_streak_end = '' %}

  {% for bucket in months_sorted_asc %}
    {% assign parts = bucket.name | split: '-' %}
    {% assign year_val = parts[0] | plus: 0 %}
    {% assign month_val = parts[1] | plus: 0 %}
    {% assign month_index = year_val | times: 12 | plus: month_val %}

    {% if prev_month_index %}
      {% assign expected_index = prev_month_index | plus: 1 %}
      {% if month_index == expected_index %}
        {% assign current_streak = current_streak | plus: 1 %}
      {% else %}
        {% assign current_streak = 1 %}
        {% assign current_streak_start = bucket.name %}
      {% endif %}
    {% else %}
      {% assign current_streak = 1 %}
      {% assign current_streak_start = bucket.name %}
    {% endif %}

    {% if current_streak > longest_streak %}
      {% assign longest_streak = current_streak %}
      {% assign longest_streak_start = current_streak_start %}
      {% assign longest_streak_end = bucket.name %}
    {% endif %}

    {% assign prev_month_index = month_index %}
  {% endfor %}

  {% assign latest_month_streak = 0 %}
  {% assign expected_prev_month_index = 0 %}
  {% assign latest_streak_closed = false %}

  {% for bucket in months_sorted_desc %}
    {% assign parts = bucket.name | split: '-' %}
    {% assign year_val = parts[0] | plus: 0 %}
    {% assign month_val = parts[1] | plus: 0 %}
    {% assign month_index = year_val | times: 12 | plus: month_val %}

    {% if forloop.first %}
      {% assign latest_month_streak = 1 %}
      {% assign expected_prev_month_index = month_index | minus: 1 %}
    {% elsif latest_streak_closed == false %}
      {% if month_index == expected_prev_month_index %}
        {% assign latest_month_streak = latest_month_streak | plus: 1 %}
        {% assign expected_prev_month_index = expected_prev_month_index | minus: 1 %}
      {% else %}
        {% assign latest_streak_closed = true %}
      {% endif %}
    {% endif %}
  {% endfor %}
{% endif %}

{% if posts_with_updates > 0 %}
  {% assign avg_update_delay_days = total_update_delay_days | times: 1.0 | divided_by: posts_with_updates %}
{% else %}
  {% assign avg_update_delay_days = 0 %}
{% endif %}

{% assign tag_counts = site.tags | sort %}
{% assign unique_tags = tag_counts | size %}
{% assign single_use_tags = 0 %}
{% assign top_tag_name = '' %}
{% assign top_tag_count = 0 %}

{% capture tag_records -%}
{%- for tag in tag_counts -%}
  {%- assign tag_name = tag[0] -%}
  {%- assign tag_count = tag[1] | size -%}
  {%- if tag_count == 1 -%}
    {%- assign single_use_tags = single_use_tags | plus: 1 -%}
  {%- endif -%}
  {%- if tag_count > top_tag_count -%}
    {%- assign top_tag_count = tag_count -%}
    {%- assign top_tag_name = tag_name -%}
  {%- endif -%}
  {{ tag_count | plus: 100000 }}::{{ tag_name | replace: '::', '-' }}::{{ tag_count }}{%- unless forloop.last -%}|~|{%- endunless -%}
{%- endfor -%}
{%- endcapture %}
{% assign tag_records = tag_records | strip %}

{% assign top3_tag_links = 0 %}
{% if tag_records != '' %}
  {% assign tag_array_desc = tag_records | split: '|~|' | sort | reverse %}
  {% for record in tag_array_desc limit: 3 %}
    {% assign cols = record | split: '::' %}
    {% assign tag_hits = cols[2] | plus: 0 %}
    {% assign top3_tag_links = top3_tag_links | plus: tag_hits %}
  {% endfor %}
{% endif %}

{% if total_posts > 0 and total_tag_links > 0 %}
  {% assign avg_tags_per_post = total_tag_links | times: 1.0 | divided_by: total_posts %}
  {% assign top3_tag_link_share = top3_tag_links | times: 100.0 | divided_by: total_tag_links %}
{% else %}
  {% assign avg_tags_per_post = 0 %}
  {% assign top3_tag_link_share = 0 %}
{% endif %}

{% if posts_prev_12m > 0 %}
  {% assign posts_delta_12m = posts_last_12m | minus: posts_prev_12m %}
  {% assign posts_delta_pct_12m = posts_delta_12m | times: 100.0 | divided_by: posts_prev_12m %}
{% else %}
  {% assign posts_delta_pct_12m = 0 %}
{% endif %}

{% if words_prev_12m > 0 %}
  {% assign words_delta_12m = words_last_12m | minus: words_prev_12m %}
  {% assign words_delta_pct_12m = words_delta_12m | times: 100.0 | divided_by: words_prev_12m %}
{% else %}
  {% assign words_delta_pct_12m = 0 %}
{% endif %}

{% assign now_timeline = site.data.now.timeline | default: site.now.timeline %}
{% assign now_updates = 0 %}
{% assign now_words_total = 0 %}
{% assign now_images_total = 0 %}
{% assign now_entries_last_90 = 0 %}
{% assign now_entries_last_365 = 0 %}
{% assign now_entries_work = 0 %}
{% assign now_entries_personal = 0 %}
{% assign now_entries_travels = 0 %}
{% assign now_entries_gaming = 0 %}

{% if now_timeline and now_timeline.size > 0 %}
  {% assign now_updates = now_timeline | size %}
  {% assign now_sorted = now_timeline | sort: 'date' %}
  {% assign now_first_entry = now_sorted | first %}
  {% assign now_latest_entry = now_sorted | last %}
  {% assign now_latest_ts = now_latest_entry.date | date: '%s' | plus: 0 %}
  {% assign now_days_since_update = now_ts | minus: now_latest_ts | divided_by: 86400 %}

  {% for entry in now_timeline %}
    {% assign entry_words = entry.body | number_of_words %}
    {% assign now_words_total = now_words_total | plus: entry_words %}

    {% assign img_chunks = entry.body | split: '<img ' %}
    {% assign imgs_in_entry = img_chunks | size | minus: 1 %}
    {% assign now_images_total = now_images_total | plus: imgs_in_entry %}

    {% assign entry_ts = entry.date | date: '%s' | plus: 0 %}
    {% assign entry_age_days = now_ts | minus: entry_ts | divided_by: 86400 %}
    {% if entry_age_days <= 90 %}
      {% assign now_entries_last_90 = now_entries_last_90 | plus: 1 %}
    {% endif %}
    {% if entry_age_days <= 365 %}
      {% assign now_entries_last_365 = now_entries_last_365 | plus: 1 %}
    {% endif %}

    {% if entry.body contains '### Work' %}
      {% assign now_entries_work = now_entries_work | plus: 1 %}
    {% endif %}
    {% if entry.body contains '### Personal Life' %}
      {% assign now_entries_personal = now_entries_personal | plus: 1 %}
    {% endif %}
    {% if entry.body contains '### Travels' %}
      {% assign now_entries_travels = now_entries_travels | plus: 1 %}
    {% endif %}
    {% if entry.body contains '### Gaming' %}
      {% assign now_entries_gaming = now_entries_gaming | plus: 1 %}
    {% endif %}
  {% endfor %}

  {% assign now_avg_words = now_words_total | times: 1.0 | divided_by: now_updates %}
{% else %}
  {% assign now_avg_words = 0 %}
{% endif %}

{% assign photos_collection = site.data.photos | default: site.photos %}
{% assign photos_total = 0 %}
{% assign photos_total_tag_links = 0 %}
{% assign photos_without_tags = 0 %}
{% assign photos_unique_tags = 0 %}
{% assign photos_unique_tags_pipe = '|' %}
{% assign photos_unique_locations = 0 %}
{% assign photos_unique_locations_pipe = '|' %}
{% assign photos_last_90 = 0 %}
{% assign photos_last_365 = 0 %}
{% assign photos_top_tag = '' %}
{% assign photos_top_tag_count = 0 %}

{% if photos_collection and photos_collection.size > 0 %}
  {% assign photos_total = photos_collection | size %}
  {% assign photos_sorted = photos_collection | sort: 'date' %}
  {% assign photos_first = photos_sorted | first %}
  {% assign photos_latest = photos_sorted | last %}
  {% assign photos_latest_ts = photos_latest.date | date: '%s' | plus: 0 %}
  {% assign photos_days_since_latest = now_ts | minus: photos_latest_ts | divided_by: 86400 %}

  {% for photo in photos_collection %}
    {% assign photo_ts = photo.date | date: '%s' | plus: 0 %}
    {% assign photo_age_days = now_ts | minus: photo_ts | divided_by: 86400 %}
    {% if photo_age_days <= 90 %}
      {% assign photos_last_90 = photos_last_90 | plus: 1 %}
    {% endif %}
    {% if photo_age_days <= 365 %}
      {% assign photos_last_365 = photos_last_365 | plus: 1 %}
    {% endif %}

    {% assign photo_location = photo.location | default: photo.place | default: '' %}
    {% if photo_location != '' %}
      {% assign location_key = '|' | append: photo_location | append: '|' %}
      {% unless photos_unique_locations_pipe contains location_key %}
        {% assign photos_unique_locations_pipe = photos_unique_locations_pipe | append: photo_location | append: '|' %}
        {% assign photos_unique_locations = photos_unique_locations | plus: 1 %}
      {% endunless %}
    {% endif %}

    {% if photo.tags and photo.tags.size > 0 %}
      {% for tag in photo.tags %}
        {% assign photos_total_tag_links = photos_total_tag_links | plus: 1 %}
        {% assign tag_key = '|' | append: tag | append: '|' %}
        {% unless photos_unique_tags_pipe contains tag_key %}
          {% assign photos_unique_tags_pipe = photos_unique_tags_pipe | append: tag | append: '|' %}
          {% assign photos_unique_tags = photos_unique_tags | plus: 1 %}
        {% endunless %}
      {% endfor %}
    {% else %}
      {% assign photos_without_tags = photos_without_tags | plus: 1 %}
    {% endif %}
  {% endfor %}

  {% if photos_total_tag_links > 0 %}
    {% assign photos_avg_tags_per_photo = photos_total_tag_links | times: 1.0 | divided_by: photos_total %}
  {% else %}
    {% assign photos_avg_tags_per_photo = 0 %}
  {% endif %}

  {% if photos_unique_tags > 0 %}
    {% assign photo_tag_names = photos_unique_tags_pipe | remove_first: '|' | split: '|' %}
    {% for tag_name in photo_tag_names %}
      {% if tag_name != '' %}
        {% assign tag_hits = 0 %}
        {% for photo in photos_collection %}
          {% if photo.tags contains tag_name %}
            {% assign tag_hits = tag_hits | plus: 1 %}
          {% endif %}
        {% endfor %}
        {% if tag_hits > photos_top_tag_count %}
          {% assign photos_top_tag_count = tag_hits %}
          {% assign photos_top_tag = tag_name %}
        {% endif %}
      {% endif %}
    {% endfor %}
  {% endif %}
{% else %}
  {% assign photos_avg_tags_per_photo = 0 %}
{% endif %}

{% assign notes_collection = site.data.notes | default: site.notes %}
{% assign notes_total = 0 %}
{% assign notes_words_total = 0 %}
{% assign notes_with_tags = 0 %}
{% assign notes_without_tags = 0 %}
{% assign notes_total_tag_links = 0 %}
{% assign notes_unique_tags = 0 %}
{% assign notes_unique_tags_pipe = '|' %}
{% assign notes_last_30 = 0 %}
{% assign notes_last_90 = 0 %}
{% assign notes_last_365 = 0 %}
{% assign notes_links_now = 0 %}
{% assign notes_links_photos = 0 %}
{% assign notes_links_bookmarks = 0 %}
{% assign notes_links_someday = 0 %}
{% assign notes_unique_moods = 0 %}
{% assign notes_unique_moods_pipe = '|' %}
{% assign notes_top_tag = '' %}
{% assign notes_top_tag_count = 0 %}

{% if notes_collection and notes_collection.size > 0 %}
  {% assign notes_total = notes_collection | size %}
  {% assign notes_sorted = notes_collection | sort: 'date' %}
  {% assign notes_first = notes_sorted | first %}
  {% assign notes_latest = notes_sorted | last %}
  {% assign notes_latest_ts = notes_latest.date | date: '%s' | plus: 0 %}
  {% assign notes_days_since_latest = now_ts | minus: notes_latest_ts | divided_by: 86400 %}

  {% for note in notes_collection %}
    {% assign note_words = note.content | number_of_words %}
    {% assign notes_words_total = notes_words_total | plus: note_words %}

    {% assign note_ts = note.date | date: '%s' | plus: 0 %}
    {% assign note_age_days = now_ts | minus: note_ts | divided_by: 86400 %}
    {% if note_age_days <= 30 %}
      {% assign notes_last_30 = notes_last_30 | plus: 1 %}
    {% endif %}
    {% if note_age_days <= 90 %}
      {% assign notes_last_90 = notes_last_90 | plus: 1 %}
    {% endif %}
    {% if note_age_days <= 365 %}
      {% assign notes_last_365 = notes_last_365 | plus: 1 %}
    {% endif %}

    {% assign mood = note.mood | default: '🌱' %}
    {% assign mood_key = '|' | append: mood | append: '|' %}
    {% unless notes_unique_moods_pipe contains mood_key %}
      {% assign notes_unique_moods_pipe = notes_unique_moods_pipe | append: mood | append: '|' %}
      {% assign notes_unique_moods = notes_unique_moods | plus: 1 %}
    {% endunless %}

    {% if note.content contains '/now' %}
      {% assign notes_links_now = notes_links_now | plus: 1 %}
    {% endif %}
    {% if note.content contains '/photos' %}
      {% assign notes_links_photos = notes_links_photos | plus: 1 %}
    {% endif %}
    {% if note.content contains '/bookmarks' %}
      {% assign notes_links_bookmarks = notes_links_bookmarks | plus: 1 %}
    {% endif %}
    {% if note.content contains '/someday' %}
      {% assign notes_links_someday = notes_links_someday | plus: 1 %}
    {% endif %}

    {% if note.tags and note.tags.size > 0 %}
      {% assign notes_with_tags = notes_with_tags | plus: 1 %}
      {% for tag in note.tags %}
        {% assign notes_total_tag_links = notes_total_tag_links | plus: 1 %}
        {% assign note_tag_key = '|' | append: tag | append: '|' %}
        {% unless notes_unique_tags_pipe contains note_tag_key %}
          {% assign notes_unique_tags_pipe = notes_unique_tags_pipe | append: tag | append: '|' %}
          {% assign notes_unique_tags = notes_unique_tags | plus: 1 %}
        {% endunless %}
      {% endfor %}
    {% else %}
      {% assign notes_without_tags = notes_without_tags | plus: 1 %}
    {% endif %}
  {% endfor %}

  {% assign notes_avg_words = notes_words_total | times: 1.0 | divided_by: notes_total %}
  {% if notes_total_tag_links > 0 %}
    {% assign notes_avg_tags_per_note = notes_total_tag_links | times: 1.0 | divided_by: notes_total %}
  {% else %}
    {% assign notes_avg_tags_per_note = 0 %}
  {% endif %}

  {% if notes_unique_tags > 0 %}
    {% assign note_tag_names = notes_unique_tags_pipe | remove_first: '|' | split: '|' %}
    {% for tag_name in note_tag_names %}
      {% if tag_name != '' %}
        {% assign note_tag_hits = 0 %}
        {% for note in notes_collection %}
          {% if note.tags contains tag_name %}
            {% assign note_tag_hits = note_tag_hits | plus: 1 %}
          {% endif %}
        {% endfor %}
        {% if note_tag_hits > notes_top_tag_count %}
          {% assign notes_top_tag_count = note_tag_hits %}
          {% assign notes_top_tag = tag_name %}
        {% endif %}
      {% endif %}
    {% endfor %}
  {% endif %}
{% else %}
  {% assign notes_avg_words = 0 %}
  {% assign notes_avg_tags_per_note = 0 %}
{% endif %}

{% assign bookmark_posts_list = site.tags.bookmarks %}
{% if bookmark_posts_list %}
  {% assign bookmark_posts_total = bookmark_posts_list | size %}
{% else %}
  {% assign bookmark_posts_total = 0 %}
{% endif %}
{% assign bookmark_posts_last_365 = 0 %}
{% assign bookmark_words_total = 0 %}
{% assign bookmark_links_total = 0 %}

{% if bookmark_posts_total > 0 %}
  {% assign bookmark_sorted = bookmark_posts_list | sort: 'date' %}
  {% assign bookmark_first = bookmark_sorted | first %}
  {% assign bookmark_latest = bookmark_sorted | last %}
  {% assign bookmark_latest_ts = bookmark_latest.date | date: '%s' | plus: 0 %}
  {% assign bookmark_days_since_latest = now_ts | minus: bookmark_latest_ts | divided_by: 86400 %}

  {% for post in bookmark_posts_list %}
    {% assign b_words = post.content | number_of_words %}
    {% assign bookmark_words_total = bookmark_words_total | plus: b_words %}

    {% assign link_chunks = post.content | split: '](' %}
    {% assign links_in_post = link_chunks | size | minus: 1 %}
    {% assign bookmark_links_total = bookmark_links_total | plus: links_in_post %}

    {% assign post_ts = post.date | date: '%s' | plus: 0 %}
    {% assign post_age_days = now_ts | minus: post_ts | divided_by: 86400 %}
    {% if post_age_days <= 365 %}
      {% assign bookmark_posts_last_365 = bookmark_posts_last_365 | plus: 1 %}
    {% endif %}
  {% endfor %}

  {% assign bookmark_avg_words = bookmark_words_total | times: 1.0 | divided_by: bookmark_posts_total %}
  {% assign bookmark_avg_links = bookmark_links_total | times: 1.0 | divided_by: bookmark_posts_total %}
{% else %}
  {% assign bookmark_avg_words = 0 %}
  {% assign bookmark_avg_links = 0 %}
{% endif %}

{% assign someday_page = nil %}
{% for p in site.pages %}
  {% if p.permalink == '/someday/' %}
    {% assign someday_page = p %}
  {% endif %}
{% endfor %}
{% assign someday_goals_total = 0 %}
{% assign someday_goals_done = 0 %}
{% assign someday_goals_open = 0 %}
{% assign someday_completion_rate = 0 %}

{% if someday_page %}
  {% assign someday_html = someday_page.content | markdownify %}
  {% assign someday_items = someday_html | split: '<li>' %}
  {% assign someday_goals_total = someday_items | size | minus: 1 %}
  {% for item in someday_items offset:1 %}
    {% if item contains '<del>' %}
      {% assign someday_goals_done = someday_goals_done | plus: 1 %}
    {% endif %}
  {% endfor %}

  {% assign someday_goals_open = someday_goals_total | minus: someday_goals_done %}
  {% if someday_goals_total > 0 %}
    {% assign someday_completion_rate = someday_goals_done | times: 100.0 | divided_by: someday_goals_total %}
  {% endif %}
{% endif %}

## Snapshot

{% if total_posts > 0 %}
- **Total posts:** {{ total_posts }}
- **First post:** {{ first_post.date | date: "%d %b %Y" }} - [{{ first_post.title }}]({{ first_post.url | relative_url }})
- **Latest post:** {{ latest_post.date | date: "%d %b %Y" }} - [{{ latest_post.title }}]({{ latest_post.url | relative_url }})
- **Days since last post:** {{ days_since_last_post }} ({{ months_since_last_post }} months)
- **Total words published:** {{ total_words | divided_by: 1000 | round: 1 }}k
- **Average post size:** {{ avg_words | round }} words ({{ avg_read_minutes | round: 1 }} min)
- **This year ({{ now_year }}):** {{ posts_this_year }} posts, {{ words_this_year | divided_by: 1000 | round: 1 }}k words
- **Previous year ({{ last_year }}):** {{ posts_last_year }} posts, {{ words_last_year | divided_by: 1000 | round: 1 }}k words
{% else %}
- No published posts found.
{% endif %}

## Velocity And Cadence

{% if total_posts > 1 %}
- **Posts in last 30 days:** {{ posts_last_30 }}
- **Posts in last 90 days:** {{ posts_last_90 }}
- **Posts in last 365 days:** {{ posts_last_365 }}
- **Trailing 12 months vs previous 12 months:** {{ posts_last_12m }} vs {{ posts_prev_12m }} posts
- **12-month post trend:** {{ posts_delta_pct_12m | round: 1 }}%
- **12-month word trend:** {{ words_delta_pct_12m | round: 1 }}%
- **Average gap between posts:** {{ avg_gap_days | round: 1 }} days
{% if max_gap_from and max_gap_to %}
- **Longest gap:** {{ max_gap_days | round }} days ({{ max_gap_from.date | date: "%b %Y" }} -> {{ max_gap_to.date | date: "%b %Y" }})
{% endif %}
- **Months with at least one post:** {{ months_count }} / {{ possible_months }} ({{ monthly_coverage | round: 1 }}%)
- **Longest publishing streak:** {{ longest_streak }} consecutive months
- **Most recent streak:** {{ latest_month_streak }} consecutive months (ending {{ latest_post.date | date: "%b %Y" }})
{% elsif total_posts == 1 %}
- Not enough history for cadence trends.
{% endif %}

### Last 12 Months

{% if total_posts > 0 %}
<table>
  <thead>
    <tr>
      <th>Month</th>
      <th>Posts</th>
      <th>Words</th>
    </tr>
  </thead>
  <tbody>
    {% for i in (0..11) %}
      {% assign month_index = current_month_index | minus: i %}
      {% assign month_num = month_index | modulo: 12 %}
      {% assign year_num = month_index | divided_by: 12 %}
      {% if month_num == 0 %}
        {% assign month_num = 12 %}
        {% assign year_num = year_num | minus: 1 %}
      {% endif %}
      {% assign month_str = month_num | prepend: '0' | slice: -2, 2 %}
      {% assign ym = year_num | append: '-' | append: month_str %}

      {% assign month_posts = 0 %}
      {% assign month_words = 0 %}
      {% for bucket in grouped_by_month %}
        {% if bucket.name == ym %}
          {% assign month_posts = bucket.items | size %}
          {% for p in bucket.items %}
            {% assign p_words = p.content | number_of_words %}
            {% assign month_words = month_words | plus: p_words %}
          {% endfor %}
        {% endif %}
      {% endfor %}

      <tr>
        <td>{{ ym | append: '-01' | date: "%b %Y" }}</td>
        <td>{{ month_posts }}</td>
        <td>{{ month_words }}</td>
      </tr>
    {% endfor %}
  </tbody>
</table>
{% endif %}

## Yearly Output

{% if grouped_by_year.size > 0 %}
<table>
  <thead>
    <tr>
      <th>Year</th>
      <th>Posts</th>
      <th>Words</th>
      <th>Avg Words/Post</th>
      <th>Active Months</th>
    </tr>
  </thead>
  <tbody>
    {% for bucket in grouped_by_year %}
      {% assign year_words = 0 %}
      {% for post in bucket.items %}
        {% assign post_words = post.content | number_of_words %}
        {% assign year_words = year_words | plus: post_words %}
      {% endfor %}
      {% assign year_posts = bucket.items | size %}
      {% assign year_avg_words = year_words | times: 1.0 | divided_by: year_posts %}
      {% assign year_months = bucket.items | group_by_exp: 'p', "p.date | date: '%Y-%m'" | size %}
      <tr>
        <td>{{ bucket.name }}</td>
        <td>{{ year_posts }}</td>
        <td>{{ year_words }}</td>
        <td>{{ year_avg_words | round }}</td>
        <td>{{ year_months }}</td>
      </tr>
    {% endfor %}
  </tbody>
</table>
{% endif %}

## Portfolio Mix

{% if total_posts > 0 %}
{% assign short_pct = words_short | times: 100.0 | divided_by: total_posts %}
{% assign medium_pct = words_medium | times: 100.0 | divided_by: total_posts %}
{% assign long_pct = words_long | times: 100.0 | divided_by: total_posts %}
{% assign bookmark_pct = bookmark_posts | times: 100.0 | divided_by: total_posts %}

- **Bookmark posts:** {{ bookmark_posts }} ({{ bookmark_pct | round: 1 }}%)
- **Original/essay posts:** {{ non_bookmark_posts }}
- **Short posts (<800 words):** {{ words_short }} ({{ short_pct | round: 1 }}%)
- **Medium posts (800-1999 words):** {{ words_medium }} ({{ medium_pct | round: 1 }}%)
- **Long posts (2000+ words):** {{ words_long }} ({{ long_pct | round: 1 }}%)
- **Posts with code blocks:** {{ posts_with_code }}
- **Posts with mermaid diagrams:** {{ posts_with_mermaid }}
- **Posts with external links:** {{ posts_with_external_links }}
- **Cross-post links:** HN {{ posts_hn }}, Reddit {{ posts_reddit }}

{% if longest_post and shortest_post %}
- **Longest post:** [{{ longest_post.title }}]({{ longest_post.url | relative_url }}) ({{ longest_words }} words)
- **Shortest post:** [{{ shortest_post.title }}]({{ shortest_post.url | relative_url }}) ({{ shortest_words }} words)
{% endif %}
{% endif %}

## Metadata Quality

{% if total_posts > 0 %}
{% assign missing_tags_pct = missing_tags | times: 100.0 | divided_by: total_posts %}
{% assign missing_description_pct = missing_description | times: 100.0 | divided_by: total_posts %}
{% assign missing_cover_pct = missing_cover | times: 100.0 | divided_by: total_posts %}
{% assign updated_pct = posts_with_updates | times: 100.0 | divided_by: total_posts %}

- **Missing tags:** {{ missing_tags }} ({{ missing_tags_pct | round: 1 }}%)
- **Missing description:** {{ missing_description }} ({{ missing_description_pct | round: 1 }}%)
- **Missing cover/image:** {{ missing_cover }} ({{ missing_cover_pct | round: 1 }}%)
- **Posts with 2+ tags:** {{ posts_with_multiple_tags }}
- **Posts updated after publish:** {{ posts_with_updates }} ({{ updated_pct | round: 1 }}%)
{% if posts_with_updates > 0 %}
- **Average time to first update:** {{ avg_update_delay_days | round: 1 }} days
{% endif %}
- **Posts older than 2 years without update:** {{ stale_unupdated_posts }}
{% endif %}

### Recent Posts Missing Metadata

{% assign quick_fix_count = 0 %}
<ul>
{% for post in posts %}
  {% assign needs_tags = false %}
  {% assign needs_description = false %}
  {% assign needs_cover = false %}

  {% if post.tags == empty or post.tags.size == 0 %}
    {% assign needs_tags = true %}
  {% endif %}
  {% if post.description == nil or post.description == '' %}
    {% assign needs_description = true %}
  {% endif %}
  {% unless post.cover or post.image %}
    {% assign needs_cover = true %}
  {% endunless %}

  {% if quick_fix_count < 12 %}
    {% if needs_tags or needs_description or needs_cover %}
      {% assign quick_fix_count = quick_fix_count | plus: 1 %}
      {% capture missing_fields %}
        {% if needs_tags %}tags{% endif %}
        {% if needs_description %}{% if needs_tags %}, {% endif %}description{% endif %}
        {% if needs_cover %}{% if needs_tags or needs_description %}, {% endif %}cover{% endif %}
      {% endcapture %}
      <li>
        {{ post.date | date: "%d %b %Y" }} - <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
        (<code>{{ missing_fields | strip }}</code>)
      </li>
    {% endif %}
  {% endif %}
{% endfor %}
{% if quick_fix_count == 0 %}
  <li>No recent metadata gaps found.</li>
{% endif %}
</ul>

## Tag Strategy

{% if unique_tags > 0 %}
- **Unique tags:** {{ unique_tags }}
- **Average tags per post:** {{ avg_tags_per_post | round: 2 }}
- **Single-use tags (fragmentation risk):** {{ single_use_tags }}
- **Top tag:** {{ top_tag_name }} ({{ top_tag_count }} posts)
- **Top 3 tags share of all tag assignments:** {{ top3_tag_link_share | round: 1 }}%

{% if tag_records != '' %}
{% assign tag_array_desc = tag_records | split: '|~|' | sort | reverse %}

<table>
  <thead>
    <tr>
      <th>Tag</th>
      <th>Posts</th>
    </tr>
  </thead>
  <tbody>
    {% for record in tag_array_desc limit: 15 %}
      {% assign cols = record | split: '::' %}
      {% assign tag_name = cols[1] %}
      {% assign tag_count = cols[2] %}
      <tr>
        <td><a href="{{ '/tags/?t=' | append: tag_name | uri_escape | relative_url }}">{{ tag_name }}</a></td>
        <td>{{ tag_count }}</td>
      </tr>
    {% endfor %}
  </tbody>
</table>
{% endif %}
{% endif %}

## Refresh Candidates (Long + Old + Never Updated)

{% capture refresh_records -%}
{%- for post in posts -%}
  {%- assign words = post.content | number_of_words -%}
  {%- assign post_ts = post.date | date: '%s' | plus: 0 -%}
  {%- assign age_days = now_ts | minus: post_ts | divided_by: 86400 -%}
  {%- if age_days > 730 and words >= 1200 -%}
    {%- if post.updated == nil or post.updated == '' -%}
      {{ words | plus: 1000000 }}::{{ post.url }}::{{ post.title | replace: '::', '-' }}::{{ age_days }}::{{ words }}|~|
    {%- endif -%}
  {%- endif -%}
{%- endfor -%}
{%- endcapture %}
{% assign refresh_records = refresh_records | strip %}

{% if refresh_records != '' %}
{% assign refresh_array_desc = refresh_records | split: '|~|' | sort | reverse %}
<ol>
  {% for record in refresh_array_desc limit: 12 %}
    {% if record contains '::' %}
      {% assign cols = record | split: '::' %}
      {% assign url = cols[1] %}
      {% assign title = cols[2] %}
      {% assign age_days = cols[3] | plus: 0 %}
      {% assign words = cols[4] | plus: 0 %}
      {% assign age_years = age_days | times: 1.0 | divided_by: 365 %}
      <li><a href="{{ url | relative_url }}">{{ title }}</a> - {{ words }} words, {{ age_years | round: 1 }} years old</li>
    {% endif %}
  {% endfor %}
</ol>
{% else %}
- No obvious refresh candidates based on current rules.
{% endif %}

## Garden Sections Snapshot

<table>
  <thead>
    <tr>
      <th>Section</th>
      <th>Total items</th>
      <th>Latest activity</th>
      <th>Recent activity</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><a href="{{ '/now/' | relative_url }}">/now</a></td>
      <td>{{ now_updates }} updates</td>
      <td>{% if now_updates > 0 %}{{ now_latest_entry.date | date: "%d %b %Y" }}{% else %}n/a{% endif %}</td>
      <td>{{ now_entries_last_90 }} in last 90 days</td>
    </tr>
    <tr>
      <td><a href="{{ '/photos/' | relative_url }}">/photos</a></td>
      <td>{{ photos_total }} photos</td>
      <td>{% if photos_total > 0 %}{{ photos_latest.date | date: "%d %b %Y" }}{% else %}n/a{% endif %}</td>
      <td>{{ photos_last_90 }} in last 90 days</td>
    </tr>
    <tr>
      <td><a href="{{ '/notes/' | relative_url }}">/notes</a></td>
      <td>{{ notes_total }} notes</td>
      <td>{% if notes_total > 0 %}{{ notes_latest.date | date: "%d %b %Y" }}{% else %}n/a{% endif %}</td>
      <td>{{ notes_last_90 }} in last 90 days</td>
    </tr>
    <tr>
      <td><a href="{{ '/bookmarks/' | relative_url }}">/bookmarks</a></td>
      <td>{{ bookmark_posts_total }} posts</td>
      <td>{% if bookmark_posts_total > 0 %}{{ bookmark_latest.date | date: "%d %b %Y" }}{% else %}n/a{% endif %}</td>
      <td>{{ bookmark_posts_last_365 }} in last 365 days</td>
    </tr>
    <tr>
      <td><a href="{{ '/someday/' | relative_url }}">/someday</a></td>
      <td>{{ someday_goals_total }} goals</td>
      <td>completion {{ someday_completion_rate | round: 1 }}%</td>
      <td>{{ someday_goals_done }} done / {{ someday_goals_open }} open</td>
    </tr>
  </tbody>
</table>

## Now Section (/now)

{% if now_updates > 0 %}
- **Total updates:** {{ now_updates }}
- **First update:** {{ now_first_entry.date | date: "%d %b %Y" }}
- **Latest update:** {{ now_latest_entry.date | date: "%d %b %Y" }} ({{ now_days_since_update }} days ago)
- **Updates in last 90 days:** {{ now_entries_last_90 }}
- **Updates in last 365 days:** {{ now_entries_last_365 }}
- **Average size per update:** {{ now_avg_words | round }} words
- **Total embedded images in updates:** {{ now_images_total }}
- **Topic coverage:** Work {{ now_entries_work }}, Personal {{ now_entries_personal }}, Travels {{ now_entries_travels }}, Gaming {{ now_entries_gaming }}
{% else %}
- No timeline updates found in `/now`.
{% endif %}

## Photos Section (/photos)

{% if photos_total > 0 %}
- **Total photos:** {{ photos_total }}
- **First photo:** {{ photos_first.date | date: "%d %b %Y" }}
- **Latest photo:** {{ photos_latest.date | date: "%d %b %Y" }} ({{ photos_days_since_latest }} days ago)
- **Photos in last 90 days:** {{ photos_last_90 }}
- **Photos in last 365 days:** {{ photos_last_365 }}
- **Unique locations:** {{ photos_unique_locations }}
- **Unique tags:** {{ photos_unique_tags }}
- **Average tags per photo:** {{ photos_avg_tags_per_photo | round: 2 }}
- **Photos without tags:** {{ photos_without_tags }}
{% if photos_top_tag != '' %}
- **Most used photo tag:** `{{ photos_top_tag }}` ({{ photos_top_tag_count }} photos)
{% endif %}
{% else %}
- No photos found in `/photos`.
{% endif %}

## Notes Section (/notes)

{% if notes_total > 0 %}
- **Total notes:** {{ notes_total }}
- **First note:** {{ notes_first.date | date: "%d %b %Y" }}
- **Latest note:** {{ notes_latest.date | date: "%d %b %Y" }} ({{ notes_days_since_latest }} days ago)
- **Notes in last 30 days:** {{ notes_last_30 }}
- **Notes in last 90 days:** {{ notes_last_90 }}
- **Notes in last 365 days:** {{ notes_last_365 }}
- **Average size per note:** {{ notes_avg_words | round }} words
- **Unique moods used:** {{ notes_unique_moods }}
- **Tagged notes:** {{ notes_with_tags }}
- **Notes without tags:** {{ notes_without_tags }}
- **Unique note tags:** {{ notes_unique_tags }}
- **Average tags per note:** {{ notes_avg_tags_per_note | round: 2 }}
{% if notes_top_tag != '' %}
- **Most used note tag:** `{{ notes_top_tag }}` ({{ notes_top_tag_count }} notes)
{% endif %}
- **Cross-links from notes:** `/now` {{ notes_links_now }}, `/photos` {{ notes_links_photos }}, `/bookmarks` {{ notes_links_bookmarks }}, `/someday` {{ notes_links_someday }}
{% else %}
- No notes found in `/notes`.
{% endif %}

## Bookmarks Section (/bookmarks)

{% if bookmark_posts_total > 0 %}
- **Total bookmark posts:** {{ bookmark_posts_total }}
- **First bookmark post:** {{ bookmark_first.date | date: "%d %b %Y" }}
- **Latest bookmark post:** {{ bookmark_latest.date | date: "%d %b %Y" }} ({{ bookmark_days_since_latest }} days ago)
- **Bookmark posts in last 365 days:** {{ bookmark_posts_last_365 }}
- **Total words in bookmark posts:** {{ bookmark_words_total }}
- **Average words per bookmark post:** {{ bookmark_avg_words | round }}
- **Estimated links tracked in bookmark posts:** {{ bookmark_links_total }}
- **Average links per bookmark post:** {{ bookmark_avg_links | round: 1 }}
{% else %}
- No bookmark posts found.
{% endif %}

## Someday Section (/someday)

{% if someday_page %}
- **Total goals:** {{ someday_goals_total }}
- **Completed goals:** {{ someday_goals_done }}
- **Open goals:** {{ someday_goals_open }}
- **Completion rate:** {{ someday_completion_rate | round: 1 }}%
{% else %}
- Could not locate `/someday/` page metadata.
{% endif %}

---

_Internal page for editorial planning. Hidden from navigation and search engines._
