---
layout: page
title: Photos 📷
description: "Small moments, wide places."
permalink: /photos/
hide_progress: true
extra_css: [photos]
extra_js: [photos]
---

<section class="photos-page">
  {% assign photos = site.data.photos | default: site.photos %}
  {% if photos and photos.size > 0 %}
    {% assign photo_records = '' | split: '' %}
    {% for photo in photos %}
      {% assign ts = photo.date | date: "%s" | plus: 0 %}
      {% assign ts_str = ts | append: "" %}
      {% assign ts_pad = ts_str | prepend: "0000000000000" | slice: -13, 13 %}
      {% assign rec = ts_pad | append: "::" | append: forloop.index0 %}
      {% assign photo_records = photo_records | push: rec %}
    {% endfor %}
    {% assign photo_records = photo_records | sort | reverse %}
    {% assign sorted_photos = '' | split: '' %}
    {% for rec in photo_records %}
      {% assign idx = rec | split: "::" | last | plus: 0 %}
      {% assign sorted_photos = sorted_photos | push: photos[idx] %}
    {% endfor %}

    <div class="photos-filter" aria-live="polite" hidden>
      <span class="photos-filter-label">Filtered by</span>
      <span class="photos-filter-tag"></span>
      <a class="photos-filter-clear" href="{{ '/photos/' | relative_url }}">Clear</a>
    </div>

    <div class="photo-grid">
      {% for photo in sorted_photos %}
        {% assign src = photo.src | default: photo.image | default: photo %}
        {% assign location = photo.location | default: photo.place | default: '' %}
        {% assign taken = photo.date %}
        {% assign tags = photo.tags | default: "" %}
        {% assign tags_attr = "" %}
        {% if tags and tags.size > 0 %}
          {% assign tags_attr = tags | join: ',' %}
        {% endif %}
        {% assign related_max = 0 %}
        {% assign related_tag = "" %}
        {% if tags and tags.size > 0 %}
          {% for tag in tags %}
            {% assign tag_count = 0 %}
            {% for other in sorted_photos %}
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
        <figure class="photo-card" data-tags="{{ tags_attr }}">
          <div class="photo-frame">
            <img class="photo-img" src="{{ src | relative_url }}" alt="" loading="lazy">
          </div>
          <figcaption class="photo-meta">
            <div class="photo-line">
              {% if location %}
                <span class="photo-location">{{ location }}</span>
              {% endif %}
              {% if location and taken %}
                <span class="photo-sep" aria-hidden="true">·</span>
              {% endif %}
              {% if taken %}
                <time class="photo-date" datetime="{{ taken | date_to_xmlschema }}">{{ taken | date: "%d %b %Y" }}</time>
              {% endif %}
            </div>
            {% if tags and tags.size > 0 %}
              <div class="photo-tags">
                {% for tag in tags %}
                  <a class="photo-tag" href="{{ '/photos/' | relative_url }}?t={{ tag | url_encode }}">#{{ tag }}</a>
                {% endfor %}
                {% if related_max > 0 %}
                  <a class="photo-related" href="{{ '/photos/' | relative_url }}?t={{ related_tag | url_encode }}">↔ {{ related_max }} related</a>
                {% endif %}
              </div>
            {% endif %}
          </figcaption>
        </figure>
      {% endfor %}
    </div>
  {% else %}
    <p class="muted">No photos yet.</p>
  {% endif %}
</section>
