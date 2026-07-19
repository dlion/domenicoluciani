---
layout: page
title: Notes 🌱
description: "Short thoughts, tiny moments, and small discoveries."
permalink: /notes/
hide_progress: true
extra_css: [explore, notes]
extra_js: [notes]
---

<section class="notes-page">
  {% assign notes = site.data.notes | default: site.notes %}
  {% if notes and notes.size > 0 %}
    {% assign note_records = '' | split: '' %}
    {% for note in notes %}
      {% assign ts = note.date | date: "%s" | plus: 0 %}
      {% assign ts_str = ts | append: "" %}
      {% assign ts_pad = ts_str | prepend: "0000000000000" | slice: -13, 13 %}
      {% assign note_records = note_records | push: ts_pad %}
    {% endfor %}
    {% assign note_records = note_records | uniq | sort | reverse %}
    {% assign notes_sorted = '' | split: '' %}
    {% for ts_pad in note_records %}
      {% for note in notes %}
        {% assign note_ts = note.date | date: "%s" | plus: 0 %}
        {% assign note_ts_str = note_ts | append: "" %}
        {% assign note_ts_pad = note_ts_str | prepend: "0000000000000" | slice: -13, 13 %}
        {% if note_ts_pad == ts_pad %}{% assign notes_sorted = notes_sorted | push: note %}{% endif %}
      {% endfor %}
    {% endfor %}

    {% assign note_years = '' | split: '' %}
    {% assign all_note_tags = '' | split: '' %}
    {% for note in notes_sorted %}
      {% assign note_year = note.date | date: "%Y" %}
      {% assign note_years = note_years | push: note_year %}
      {% if note.tags and note.tags.size > 0 %}{% assign all_note_tags = all_note_tags | concat: note.tags %}{% endif %}
    {% endfor %}
    {% assign note_years = note_years | uniq | sort | reverse %}
    {% assign all_note_tags = all_note_tags | uniq | sort_natural %}
    {% assign all_photo_tags = '' | split: '' %}
    {% for photo in site.data.photos %}
      {% if photo.tags and photo.tags.size > 0 %}{% assign all_photo_tags = all_photo_tags | concat: photo.tags %}{% endif %}
    {% endfor %}
    {% assign all_photo_tags = all_photo_tags | uniq %}

    <section class="explore-panel" aria-labelledby="notes-explore-title">
      <div class="explore-head">
        <p class="explore-summary" id="notes-explore-title">Explore <span id="notesResultSummary">{{ notes_sorted.size }} notes</span></p>
      </div>
      <form class="explore-form explore-form--notes" id="notesExploreForm" action="{{ '/notes/' | relative_url }}" method="get" role="search">
        <label class="explore-field">
          <span class="explore-label">Search</span>
          <input class="explore-input" id="notesSearch" name="q" type="search" placeholder="Search thoughts and discoveries…" autocomplete="off">
        </label>
        <label class="explore-field">
          <span class="explore-label">Mood</span>
          <select class="explore-select" id="notesMood" name="mood">
            <option value="">Any mood</option>
            <option value="🌱">🌱 Updates</option>
            <option value="💭">💭 Thoughts</option>
            <option value="✍️">✍️ Writing</option>
          </select>
        </label>
        <label class="explore-field">
          <span class="explore-label">Year</span>
          <select class="explore-select" id="notesYear" name="year">
            <option value="">Any year</option>
            {% for year in note_years %}<option value="{{ year }}">{{ year }}</option>{% endfor %}
          </select>
        </label>
        <label class="explore-field">
          <span class="explore-label">Tag</span>
          <select class="explore-select" id="notesTag" name="tag">
            <option value="">Any tag</option>
            {% for tag in all_note_tags %}<option value="{{ tag | downcase | escape }}">#{{ tag }}</option>{% endfor %}
          </select>
        </label>
      </form>
      <div class="explore-actions" aria-label="Note browsing actions">
        <button class="explore-button" id="notesRandom" type="button">Random note</button>
        <a class="explore-link" id="notesClear" href="{{ '/notes/' | relative_url }}">Clear filters</a>
      </div>
    </section>

    <div class="notes-filter" id="notesFilterStatus" aria-live="polite" hidden>
      <span class="notes-filter-label">Showing</span>
      <span class="notes-filter-tag"></span>
    </div>

    <div class="notes-list" id="notesList">
      {% assign current_month = '' %}
      {% for note in notes_sorted %}
        {% assign note_month = note.date | date: "%Y-%m" %}
        {% if note_month != current_month %}
          <h2 class="notes-month" data-notes-month>{{ note.date | date: "%B %Y" }}</h2>
          {% assign current_month = note_month %}
        {% endif %}

        {% if note.id and note.id != '' %}
          {% assign note_id = note.id | slugify %}
        {% else %}
          {% capture note_seed %}{{ note.date | date: "%Y%m%d" }}-{{ forloop.index }}{% endcapture %}
          {% assign note_id = note_seed | strip | slugify %}
        {% endif %}
        {% assign mood = note.mood | default: "🌱" %}
        {% case mood %}
          {% when '💭' %}{% assign mood_label = 'Thought' %}
          {% when '✍️' %}{% assign mood_label = 'Writing idea' %}
          {% else %}{% assign mood_label = 'Update' %}
        {% endcase %}
        {% assign location = note.location | default: '' %}
        {% assign tags = note.tags | default: '' %}
        {% assign tags_attr = '' %}
        {% if tags and tags.size > 0 %}{% assign tags_attr = tags | join: ',' | downcase %}{% endif %}
        {% assign note_year = note.date | date: "%Y" %}
        {% assign note_text = note.content | markdownify | strip_html | strip_newlines | downcase %}
        {% assign photo_trail_tag = '' %}
        {% for tag in tags %}
          {% if photo_trail_tag == '' and all_photo_tags contains tag %}{% assign photo_trail_tag = tag %}{% endif %}
        {% endfor %}

        {% assign related_min = 999999 %}
        {% assign related_tag = '' %}
        {% if tags and tags.size > 0 %}
          {% for tag in tags %}
            {% assign tag_count = 0 %}
            {% for other in notes_sorted %}
              {% if other.tags contains tag %}{% assign tag_count = tag_count | plus: 1 %}{% endif %}
            {% endfor %}
            {% assign related_count = tag_count | minus: 1 %}
            {% if related_count > 0 and related_count < related_min %}
              {% assign related_min = related_count %}
              {% assign related_tag = tag %}
            {% endif %}
          {% endfor %}
        {% endif %}

        {% assign source_url = note.source_url | default: '' %}
        {% if source_url == '' and note.id contains 'bsky-' and site.bluesky_handle %}
          {% assign bsky_rkey = note.id | remove_first: 'bsky-' %}
          {% capture source_url %}https://bsky.app/profile/{{ site.bluesky_handle }}/post/{{ bsky_rkey }}{% endcapture %}
          {% assign source_url = source_url | strip %}
        {% endif %}

        <article class="note-item"
                 id="{{ note_id }}"
                 data-year="{{ note_year }}"
                 data-mood="{{ mood }}"
                 data-tags="{{ tags_attr }}"
                 data-search="{{ note_text | append: ' ' | append: tags_attr | append: ' ' | append: location | escape }}">
          <header class="note-meta">
            <span class="note-marker" role="img" aria-label="{{ mood_label }}">{{ mood }}</span>
            <a class="note-date" href="#{{ note_id }}" aria-label="Permanent link to note from {{ note.date | date: '%d %B %Y' }}">
              <time datetime="{{ note.date | date_to_xmlschema }}">{{ note.date | date: "%d %b %Y" }}</time>
            </a>
            {% if location != '' %}
              <span class="note-sep" aria-hidden="true">·</span>
              <span class="note-location">📍 {{ location }}</span>
            {% endif %}
            {% if source_url != '' %}<a class="note-source" href="{{ source_url }}" target="_blank" rel="noopener">Bluesky source</a>{% endif %}
            <button class="note-copy" type="button" data-copy-note="{{ note_id }}">Copy link</button>
          </header>
          <div class="note-content">{{ note.content | markdownify }}</div>
          {% if tags and tags.size > 0 %}
            <footer class="note-footer">
              <div class="note-tags">
                <span class="note-tags-label">↳ tagged:</span>
                {% for tag in tags %}<a class="note-tag" href="{{ '/notes/' | relative_url }}?tag={{ tag | downcase | url_encode }}">#{{ tag }}</a>{% endfor %}
              </div>
              {% if photo_trail_tag != '' %}<a class="note-photo-trail" href="{{ '/photos/' | relative_url }}?tag={{ photo_trail_tag | downcase | url_encode }}">See photos from #{{ photo_trail_tag }}</a>{% endif %}
            </footer>
          {% endif %}

          {% if related_tag != '' %}
            <details class="note-connections">
              <summary>{{ related_min }} more {% if related_min == 1 %}note{% else %}notes{% endif %} about #{{ related_tag }}</summary>
              <ul>
                {% assign related_shown = 0 %}
                {% for other in notes_sorted %}
                  {% if other.id and other.id != '' %}
                    {% assign other_id = other.id | slugify %}
                  {% else %}
                    {% capture other_seed %}{{ other.date | date: "%Y%m%d" }}-{{ forloop.index }}{% endcapture %}
                    {% assign other_id = other_seed | strip | slugify %}
                  {% endif %}
                  {% if other_id != note_id and other.tags contains related_tag and related_shown < 2 %}
                    {% assign other_preview = other.content | markdownify | strip_html | strip_newlines | truncate: 108 %}
                    <li><a href="#{{ other_id }}">{{ other_preview }}</a></li>
                    {% assign related_shown = related_shown | plus: 1 %}
                  {% endif %}
                {% endfor %}
              </ul>
            </details>
          {% endif %}
        </article>
      {% endfor %}
    </div>

    <section class="explore-empty" id="notesEmpty" hidden>
      <h2>Nothing is growing here—yet.</h2>
      <p>Try another mood, year, tag, or search phrase.</p>
    </section>
  {% else %}
    <p class="muted">No notes yet.</p>
  {% endif %}
</section>
