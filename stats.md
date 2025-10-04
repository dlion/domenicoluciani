---
layout: page
title: Internal Stats
permalink: /stats/
sitemap: false
robots: noindex, nofollow
hide_progress: true
---

{% assign posts = site.posts %}
{% assign total_posts = posts | size %}
{% assign total_words = 0 %}
{% assign longest_words = 0 %}
{% assign shortest_words = 999999 %}
{% assign longest_post = nil %}
{% assign shortest_post = nil %}
{% assign read_short = 0 %}
{% assign read_medium = 0 %}
{% assign read_long = 0 %}
{% assign posts_no_tags = 0 %}
{% assign posts_no_cover = 0 %}
{% assign posts_with_updates = 0 %}
{% assign total_update_delay = 0 %}
{% assign posts_with_mermaid = 0 %}
{% assign posts_with_code = 0 %}
{% assign posts_with_external_links = 0 %}
{% assign posts_hn = 0 %}
{% assign posts_reddit = 0 %}

{% for post in posts %}
  {% assign words = post.content | number_of_words %}
  {% assign total_words = total_words | plus: words %}
  {% if words < 1000 %}
    {% assign read_short = read_short | plus: 1 %}
  {% elsif words < 2000 %}
    {% assign read_medium = read_medium | plus: 1 %}
  {% else %}
    {% assign read_long = read_long | plus: 1 %}
  {% endif %}
  {% if words > longest_words %}
    {% assign longest_words = words %}
    {% assign longest_post = post %}
  {% endif %}
  {% if words < shortest_words %}
    {% assign shortest_words = words %}
    {% assign shortest_post = post %}
  {% endif %}
  {% if post.tags == empty or post.tags.size == 0 %}
    {% assign posts_no_tags = posts_no_tags | plus: 1 %}
  {% endif %}
  {% unless post.cover %}
    {% assign posts_no_cover = posts_no_cover | plus: 1 %}
  {% endunless %}
  {% if post.updated %}
    {% assign posts_with_updates = posts_with_updates | plus: 1 %}
    {% assign update_ts = post.updated | date: '%s' | plus: 0 %}
    {% assign publish_ts = post.date | date: '%s' | plus: 0 %}
    {% assign update_gap_days = update_ts | minus: publish_ts | divided_by: 86400 %}
    {% if update_gap_days > 0 %}
      {% assign total_update_delay = total_update_delay | plus: update_gap_days %}
    {% endif %}
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
{% endfor %}

{% assign grouped_by_month = posts | group_by_exp: 'post', "post.date | date: '%Y-%m'" %}
{% assign months_count = grouped_by_month | size %}
{% if months_count > 0 %}
  {% assign avg_posts_per_month = total_posts | times: 1.0 | divided_by: months_count %}
  {% assign months_sorted_asc = grouped_by_month | sort: 'name' %}
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
  {% assign active_streak = current_streak %}
  {% assign active_streak_start = current_streak_start %}
{% else %}
  {% assign avg_posts_per_month = 0 %}
{% endif %}
{% if total_posts > 0 %}
  {% assign avg_words = total_words | times: 1.0 | divided_by: total_posts %}
  {% assign avg_read_minutes = avg_words | times: 1.0 | divided_by: 200 %}
  {% assign sorted_posts_asc = posts | sort: 'date' %}
  {% assign first_post = sorted_posts_asc | first %}
  {% assign latest_post = posts | first %}
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
      {% assign diff_seconds = post_ts | minus: prev_ts %}
      {% assign diff_days = diff_seconds | divided_by: 86400 %}
      {% assign total_gap_days = total_gap_days | plus: diff_days %}
      {% assign gap_count = gap_count | plus: 1 %}
      {% if diff_days > max_gap_days %}
        {% assign max_gap_days = diff_days %}
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
{% endif %}
{% if posts_with_updates > 0 %}
  {% assign avg_update_delay = total_update_delay | times: 1.0 | divided_by: posts_with_updates %}
{% else %}
  {% assign avg_update_delay = 0 %}
{% endif %}

## Overview

- **Total posts:** {{ total_posts }}
{% if total_posts > 0 %}
- **First post:** {{ first_post.date | date: "%d %b %Y" }} — [{{ first_post.title }}]({{ first_post.url | relative_url }})
- **Latest post:** {{ latest_post.date | date: "%d %b %Y" }} — [{{ latest_post.title }}]({{ latest_post.url | relative_url }})
- **Average posts per month:** {{ avg_posts_per_month | round: 2 }}
- **Average words per post:** {{ avg_words | round }}
- **Average read time:** {{ avg_read_minutes | round: 1 }} min (`@200 wpm`)
- **Total words published:** {{ total_words | divided_by: 1000 | round: 1 }}k
{% else %}
- There are no published posts yet.
{% endif %}

## Word Count Extremes

{% if total_posts > 0 %}
- **Longest post:** [{{ longest_post.title }}]({{ longest_post.url | relative_url }}) — {{ longest_words }} words
- **Shortest post:** [{{ shortest_post.title }}]({{ shortest_post.url | relative_url }}) — {{ shortest_words }} words

{% capture posts_word_records -%}
{% for post in posts %}
{% assign words = post.content | number_of_words %}
{{ words | plus: 1000000 }}::{{ post.url }}::{{ post.title | replace: '::', '—' }}::{{ words }}{% unless forloop.last %}|~|{% endunless %}
{% endfor %}
{%- endcapture %}
{% assign posts_word_records = posts_word_records | strip %}
{% if posts_word_records != '' %}
  {% assign posts_word_array = posts_word_records | split: '|~|' | sort %}
  {% assign posts_word_array_desc = posts_word_array | reverse %}

  ### Top 5 longest posts
  <ol>
    {% for record in posts_word_array_desc limit:5 %}
      {% assign cols = record | split: '::' %}
      {% assign wc = cols[3] %}
      {% assign url = cols[1] %}
      {% assign title = cols[2] %}
      <li><a href="{{ url | relative_url }}">{{ title }}</a> — {{ wc }} words</li>
    {% endfor %}
  </ol>

  ### Top 5 shortest posts
  <ol>
    {% for record in posts_word_array limit:5 %}
      {% assign cols = record | split: '::' %}
      {% assign wc = cols[3] %}
      {% assign url = cols[1] %}
      {% assign title = cols[2] %}
      <li><a href="{{ url | relative_url }}">{{ title }}</a> — {{ wc }} words</li>
    {% endfor %}
  </ol>
{% endif %}
{% else %}
- Not enough data yet.
{% endif %}

## Yearly breakdown

{% assign grouped_by_year = posts | group_by_exp: 'post', "post.date | date: '%Y'" | sort: 'name' | reverse %}
{% if grouped_by_year.size > 0 %}
<table>
  <thead>
    <tr>
      <th>Year</th>
      <th>Posts</th>
      <th>Total words</th>
      <th>Avg words/post</th>
      <th>Months with posts</th>
    </tr>
  </thead>
  <tbody>
  {% for bucket in grouped_by_year %}
    {% assign year_words = 0 %}
    {% for post in bucket.items %}
      {% assign post_words = post.content | number_of_words %}
      {% assign year_words = year_words | plus: post_words %}
    {% endfor %}
    {% assign year_post_count = bucket.items | size %}
    {% assign year_avg_words = year_words | times: 1.0 | divided_by: year_post_count %}
    {% assign year_months = bucket.items | group_by_exp: 'p', "p.date | date: '%Y-%m'" | size %}
    <tr>
      <td>{{ bucket.name }}</td>
      <td>{{ year_post_count }}</td>
      <td>{{ year_words }}</td>
      <td>{{ year_avg_words | round }}</td>
      <td>{{ year_months }}</td>
    </tr>
  {% endfor %}
  </tbody>
</table>
{% else %}
<p>No yearly data yet.</p>
{% endif %}

## Publication cadence

{% if total_posts > 1 %}
- **Average gap between posts:** {{ avg_gap_days | round: 1 }} days
{% if max_gap_from and max_gap_to %}
  {% assign gap_from_label = max_gap_from.date | date: '%d %b %Y' %}
  {% assign gap_to_label = max_gap_to.date | date: '%d %b %Y' %}
- **Longest gap:** {{ max_gap_days | round }} days ({{ gap_from_label }} → {{ gap_to_label }})
{% endif %}
{% else %}
- Not enough posts to compute cadence.
{% endif %}

{% if months_count > 0 %}
  {% assign longest_streak_start_label = '' %}
  {% assign longest_streak_end_label = '' %}
  {% if longest_streak_start != '' %}
    {% assign longest_streak_start_label = longest_streak_start | append: '-01' | date: '%b %Y' %}
  {% endif %}
  {% if longest_streak_end != '' %}
    {% assign longest_streak_end_label = longest_streak_end | append: '-01' | date: '%b %Y' %}
  {% endif %}
  {% assign active_streak_start_label = '' %}
  {% if active_streak_start != '' %}
    {% assign active_streak_start_label = active_streak_start | append: '-01' | date: '%b %Y' %}
  {% endif %}
- **Longest monthly streak:** {{ longest_streak }} months{% if longest_streak_start_label != '' and longest_streak_end_label != '' %} ({{ longest_streak_start_label }} → {{ longest_streak_end_label }}){% endif %}
- **Current streak:** {{ active_streak }} months{% if active_streak_start_label != '' %} (since {{ active_streak_start_label }}){% endif %}
{% endif %}

## Posts by Month

{% assign months = grouped_by_month | sort: 'name' | reverse %}
{% if months_count > 0 %}
<table>
  <thead>
    <tr>
      <th>Month</th>
      <th>Posts</th>
      <th>Titles</th>
    </tr>
  </thead>
  <tbody>
  {% for bucket in months %}
    {% capture month_name %}{{ bucket.name }}-01{% endcapture %}
    <tr>
      <td>{{ month_name | date: "%B %Y" }}</td>
      <td>{{ bucket.items | size }}</td>
      <td>
        <ul>
          {% for post in bucket.items %}
            <li><a href="{{ post.url | relative_url }}">{{ post.title }}</a> ({{ post.content | number_of_words }} words)</li>
          {% endfor %}
        </ul>
      </td>
    </tr>
  {% endfor %}
  </tbody>
</table>
{% else %}
<p>No posts to display yet.</p>
{% endif %}

## Reading time distribution

{% if total_posts > 0 %}
{% assign short_pct = read_short | times: 100.0 | divided_by: total_posts %}
{% assign medium_pct = read_medium | times: 100.0 | divided_by: total_posts %}
{% assign long_pct = read_long | times: 100.0 | divided_by: total_posts %}
<table>
  <thead>
    <tr>
      <th>Bucket</th>
      <th>Posts</th>
      <th>Share</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>&lt; 5 min (&lt; 1k words)</td>
      <td>{{ read_short }}</td>
      <td>{{ short_pct | round: 1 }}%</td>
    </tr>
    <tr>
      <td>5–10 min (1k–2k words)</td>
      <td>{{ read_medium }}</td>
      <td>{{ medium_pct | round: 1 }}%</td>
    </tr>
    <tr>
      <td>&gt; 10 min (&gt; 2k words)</td>
      <td>{{ read_long }}</td>
      <td>{{ long_pct | round: 1 }}%</td>
    </tr>
  </tbody>
</table>
{% else %}
<p>No reading time data yet.</p>
{% endif %}

## Metadata health

{% if total_posts > 0 %}
- Posts without tags: {{ posts_no_tags }} ({{ posts_no_tags | times: 100.0 | divided_by: total_posts | round: 1 }}%)
- Posts without cover image: {{ posts_no_cover }} ({{ posts_no_cover | times: 100.0 | divided_by: total_posts | round: 1 }}%)
- Posts updated after publish: {{ posts_with_updates }}{% if posts_with_updates > 0 %} (avg {{ avg_update_delay | round: 1 }} days to update){% endif %}
- Posts containing code blocks: {{ posts_with_code }}
- Posts with Mermaid diagrams: {{ posts_with_mermaid }}
- Posts containing external links: {{ posts_with_external_links }}
{% else %}
- Not enough data yet.
{% endif %}

## Cross-post reach

{% if total_posts > 0 %}
- Hacker News links: {{ posts_hn }}
- Reddit links: {{ posts_reddit }}
{% else %}
- Not tracked yet.
{% endif %}

## Tags Snapshot

{% assign tag_counts = site.tags | sort %}
{% assign total_tags = tag_counts | size %}
{% assign top_tag_name = '' %}
{% assign top_tag_count = 0 %}
{% for tag in tag_counts %}
  {% assign tag_posts = tag[1] | size %}
  {% if tag_posts > top_tag_count %}
    {% assign top_tag_count = tag_posts %}
    {% assign top_tag_name = tag[0] %}
  {% endif %}
{% endfor %}
{% if total_tags > 0 %}
- **Unique tags:** {{ total_tags }}
- **Posts per tag (avg):** {{ total_posts | times: 1.0 | divided_by: total_tags | round: 2 }}
- **Top tag:** {{ top_tag_name }} ({{ top_tag_count }} posts)
{% endif %}

{% if tag_counts.size > 0 %}
<table>
  <thead>
    <tr>
      <th>Tag</th>
      <th>Count</th>
    </tr>
  </thead>
  <tbody>
  {% for tag in tag_counts %}
    {% assign tag_name = tag[0] %}
    {% assign tag_posts = tag[1] %}
    <tr>
      <td><a href="{{ '/tags/?t=' | append: tag_name | uri_escape | relative_url }}">{{ tag_name }}</a></td>
      <td>{{ tag_posts | size }}</td>
    </tr>
  {% endfor %}
  </tbody>
</table>
{% else %}
<p>No tags recorded yet.</p>
{% endif %}

## Language breakdown

{% assign lang_groups = posts | group_by: 'lang' | sort: 'name' %}
{% if lang_groups.size > 0 %}
<table>
  <thead>
    <tr>
      <th>Language</th>
      <th>Posts</th>
    </tr>
  </thead>
  <tbody>
  {% for bucket in lang_groups %}
    {% assign lang_label = bucket.name %}
    {% if lang_label == '' or lang_label == nil %}
      {% assign lang_label = 'unset' %}
    {% endif %}
    <tr>
      <td>{{ lang_label }}</td>
      <td>{{ bucket.items | size }}</td>
    </tr>
  {% endfor %}
  </tbody>
</table>
{% else %}
<p>No language metadata recorded.</p>
{% endif %}

---

_This page is intentionally hidden from navigation and search engines. Bookmark it directly for future reference._
