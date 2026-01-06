---
layout: page
title: Notes 🌱
description: "Short thoughts, tiny moments, and small discoveries."
permalink: /notes/
hide_progress: true
extra_css: [notes]
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
      {% assign rec = ts_pad | append: "::" | append: forloop.index0 %}
      {% assign note_records = note_records | push: rec %}
    {% endfor %}
    {% assign note_records = note_records | sort | reverse %}
    {% assign notes_sorted = '' | split: '' %}
    {% for rec in note_records %}
      {% assign idx = rec | split: "::" | last | plus: 0 %}
      {% assign notes_sorted = notes_sorted | push: notes[idx] %}
    {% endfor %}
    <div class="notes-filter" aria-live="polite" hidden>
      <span class="notes-filter-label">Filtered by</span>
      <span class="notes-filter-tag"></span>
      <a class="notes-filter-clear" href="{{ '/notes/' | relative_url }}">Clear</a>
    </div>
    <div class="notes-list">
      {% for note in notes_sorted %}
        {% assign note_seed = note.id | default: note.date | date: "%Y%m%d" | append: "-" | append: forloop.index %}
        {% assign note_id = note_seed | slugify %}
        {% assign location = note.location | default: "Málaga, Spain" %}
        {% assign mood = note.mood | default: "🌱" %}
        {% assign tags = note.tags | default: "" %}
        {% assign tags_attr = "" %}
        {% if tags and tags.size > 0 %}
          {% assign tags_attr = tags | join: ',' %}
        {% endif %}
        {% assign related_max = 0 %}
        {% assign related_tag = "" %}
        {% if tags and tags.size > 0 %}
          {% for tag in tags %}
            {% assign tag_count = 0 %}
            {% for other in notes_sorted %}
              {% if other.tags contains tag %}
                {% assign tag_count = tag_count | plus: 1 %}
              {% endif %}
            {% endfor %}
            {% assign related_count = tag_count | minus: 1 %}
            {% if related_count > related_max %}
              {% assign related_max = related_count %}
              {% assign related_tag = tag %}
            {% endif %}
          {% endfor %}
        {% endif %}
        <article class="note-item" id="{{ note_id }}" data-tags="{{ tags_attr }}">
          <header class="note-meta">
            {% if mood != "" %}
              <span class="note-marker" aria-hidden="true">{{ mood }}</span>
            {% endif %}
            <time class="note-date" datetime="{{ note.date | date_to_xmlschema }}">{{ note.date | date: "%d %b %Y" }}</time>
            <span class="note-sep" aria-hidden="true">·</span>
            <span class="note-location">📍 {{ location }}</span>
          </header>
          <div class="note-content">
            {{ note.content | markdownify }}
          </div>
          {% if tags and tags.size > 0 %}
            <footer class="note-footer">
              <div class="note-tags">
                <span class="note-tags-label">↳ tagged:</span>
                {% for tag in tags %}
                  <a class="note-tag" href="{{ '/notes/' | relative_url }}?t={{ tag | url_encode }}">#{{ tag }}</a>
                {% endfor %}
              </div>
              {% if related_max > 0 %}
                <a class="note-related" href="{{ '/notes/' | relative_url }}?t={{ related_tag | url_encode }}">related: {{ related_max }}</a>
              {% endif %}
            </footer>
          {% endif %}
        </article>
      {% endfor %}
    </div>
  {% else %}
    <p class="muted">No notes yet.</p>
  {% endif %}
</section>
