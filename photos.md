---
layout: page
title: Photos 📷
description: "Small moments, wide places."
permalink: /photos/
hide_progress: true
extra_css: [explore, photos]
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

    {% assign photo_years = '' | split: '' %}
    {% assign all_photo_tags = '' | split: '' %}
    {% for photo in sorted_photos %}
      {% assign photo_year = photo.date | date: "%Y" %}
      {% assign photo_years = photo_years | push: photo_year %}
      {% if photo.tags and photo.tags.size > 0 %}
        {% assign all_photo_tags = all_photo_tags | concat: photo.tags %}
      {% endif %}
    {% endfor %}
    {% assign photo_years = photo_years | uniq | sort | reverse %}
    {% assign all_photo_tags = all_photo_tags | uniq | sort_natural %}
    {% assign all_note_tags = '' | split: '' %}
    {% for note in site.data.notes %}
      {% if note.tags and note.tags.size > 0 %}{% assign all_note_tags = all_note_tags | concat: note.tags %}{% endif %}
    {% endfor %}
    {% assign all_note_tags = all_note_tags | uniq %}

    <section class="explore-panel" aria-labelledby="photos-explore-title">
      <div class="explore-head">
        <p class="explore-summary" id="photos-explore-title">
          Explore <span id="photosResultSummary">{{ sorted_photos.size }} photos · {{ photo_years.last }}–{{ photo_years.first }}</span>
        </p>
      </div>
      <form class="explore-form" id="photosExploreForm" action="{{ '/photos/' | relative_url }}" method="get" role="search">
        <label class="explore-field">
          <span class="explore-label">Search</span>
          <input class="explore-input" id="photosSearch" name="q" type="search" placeholder="Try Palermo, friends, Japan…" autocomplete="off">
        </label>
        <label class="explore-field">
          <span class="explore-label">Year</span>
          <select class="explore-select" id="photosYear" name="year">
            <option value="">Any year</option>
            {% for year in photo_years %}<option value="{{ year }}">{{ year }}</option>{% endfor %}
          </select>
        </label>
        <label class="explore-field">
          <span class="explore-label">Tag</span>
          <select class="explore-select" id="photosTag" name="tag">
            <option value="">Any tag</option>
            {% for tag in all_photo_tags %}<option value="{{ tag | downcase | escape }}">#{{ tag }}</option>{% endfor %}
          </select>
        </label>
      </form>
      <div class="explore-actions" aria-label="Photo browsing actions">
        <button class="explore-button" id="photosSurprise" type="button">Surprise me</button>
        <a class="explore-link" id="photosClear" href="{{ '/photos/' | relative_url }}">Clear filters</a>
      </div>
    </section>

    <div class="photos-filter" id="photosFilterStatus" aria-live="polite" hidden>
      <span class="photos-filter-label">Showing</span>
      <span class="photos-filter-tag"></span>
    </div>

    <div class="photo-grid" id="photoGrid">
      {% for photo in sorted_photos %}
        {% assign src = photo.src | default: photo.image | default: photo %}
        {% assign web_src = src %}
        {% if src contains '.heic' %}{% assign web_src = src | replace: '.heic', '.webp' %}{% endif %}
        {% assign location = photo.location | default: photo.place | default: '' %}
        {% assign taken = photo.date %}
        {% assign photo_year = taken | date: "%Y" %}
        {% assign tags = photo.tags | default: '' %}
        {% assign tags_attr = '' %}
        {% if tags and tags.size > 0 %}
          {% assign tags_attr = tags | join: ',' | downcase %}
        {% endif %}
        {% assign photo_file = src | split: '/' | last | split: '.' | first %}
        {% assign photo_id = 'photo-' | append: photo_file | slugify %}
        {% assign note_trail_tag = '' %}
        {% for tag in tags %}
          {% if note_trail_tag == '' and all_note_tags contains tag %}{% assign note_trail_tag = tag %}{% endif %}
        {% endfor %}

        {% assign related_min = 999999 %}
        {% assign related_tag = '' %}
        {% if tags and tags.size > 0 %}
          {% for tag in tags %}
            {% assign tag_down = tag | downcase %}
            {% unless tag_down == 'travels' or tag_down == 'travel' or tag_down == 'spain' or tag_down == 'italy' %}
              {% assign tag_count = 0 %}
              {% for other in sorted_photos %}
                {% if other.tags contains tag %}{% assign tag_count = tag_count | plus: 1 %}{% endif %}
              {% endfor %}
              {% assign related_count = tag_count | minus: 1 %}
              {% if related_count > 0 and related_count < related_min %}
                {% assign related_min = related_count %}
                {% assign related_tag = tag %}
              {% endif %}
            {% endunless %}
          {% endfor %}
        {% endif %}

        <figure class="photo-card"
                id="{{ photo_id }}"
                data-photo-id="{{ photo_id }}"
                data-photo-src="{{ web_src | relative_url }}"
                data-photo-original="{{ src | relative_url }}"
                data-photo-location="{{ location | escape }}"
                data-photo-date="{{ taken | date: '%d %b %Y' }}"
                data-photo-note-tag="{{ note_trail_tag | downcase | escape }}"
                data-year="{{ photo_year }}"
                data-tags="{{ tags_attr }}"
                data-search="{{ location | append: ' ' | append: tags_attr | append: ' ' | append: photo_year | downcase | escape }}">
          <button class="photo-frame photo-open" type="button" aria-label="Open photo{% if location %} from {{ location | escape }}{% endif %}, {{ taken | date: '%d %B %Y' }}" data-photo-open>
            <img class="photo-img"
                 src="{{ web_src | relative_url }}"
                 alt="{% if photo.alt %}{{ photo.alt | escape }}{% elsif location %}Photo taken in {{ location | escape }} on {{ taken | date: '%d %B %Y' }}{% else %}Photo taken on {{ taken | date: '%d %B %Y' }}{% endif %}"
                 decoding="async"
                 {% if forloop.index <= 2 %}loading="eager"{% else %}loading="lazy"{% endif %}
                 {% if forloop.first %}fetchpriority="high"{% endif %}>
          </button>
          <figcaption class="photo-meta" id="{{ photo_id }}-caption">
            <div class="photo-line">
              {% if location %}<span class="photo-location">{{ location }}</span>{% endif %}
              {% if location and taken %}<span class="photo-sep" aria-hidden="true">·</span>{% endif %}
              {% if taken %}<time class="photo-date" datetime="{{ taken | date_to_xmlschema }}">{{ taken | date: "%d %b %Y" }}</time>{% endif %}
              <a class="photo-permalink" href="#{{ photo_id }}" aria-label="Link to this photo">Link</a>
            </div>
            {% if tags and tags.size > 0 %}
              <div class="photo-tags">
                {% for tag in tags %}<a class="photo-tag" href="{{ '/photos/' | relative_url }}?tag={{ tag | downcase | url_encode }}">#{{ tag }}</a>{% endfor %}
                {% if related_tag != '' %}
                  <a class="photo-related" href="{{ '/photos/' | relative_url }}?tag={{ related_tag | downcase | url_encode }}">{{ related_min }} more from #{{ related_tag }}</a>
                {% endif %}
              </div>
            {% endif %}
          </figcaption>
        </figure>
      {% endfor %}
    </div>

    <section class="explore-empty" id="photosEmpty" hidden>
      <h2>No photos on this path—yet.</h2>
      <p>Try another place, year, or tag, or let “Surprise me” choose the next stop.</p>
    </section>

    <dialog class="photo-viewer" id="photoViewer" aria-labelledby="photoViewerTitle">
      <div class="photo-viewer-shell">
        <div class="photo-viewer-bar">
          <p id="photoViewerTitle">Photo viewer</p>
          <button class="photo-viewer-close" type="button" data-photo-close>Close</button>
        </div>
        <div class="photo-viewer-stage">
          <img id="photoViewerImage" alt="Selected photo">
        </div>
        <div class="photo-viewer-details">
          <div>
            <p class="photo-viewer-location" id="photoViewerLocation"></p>
            <p class="photo-viewer-date" id="photoViewerDate"></p>
          </div>
          <div class="photo-viewer-actions">
            <button type="button" data-photo-prev>Previous</button>
            <button type="button" data-photo-copy>Copy link</button>
            <a id="photoViewerNotes" hidden>Related notes</a>
            <a id="photoViewerOriginal" target="_blank" rel="noopener">Open original</a>
            <button type="button" data-photo-next>Next</button>
          </div>
        </div>
      </div>
    </dialog>
  {% else %}
    <p class="muted">No photos yet.</p>
  {% endif %}
</section>
