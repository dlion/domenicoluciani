---
layout: page
title: Photos
description: "A small collection of places and moments."
permalink: /photos/
hide_progress: true
extra_css: [photos]
---

{% assign photos = site.data.photos | default: site.photos %}
{% if photos and photos.size > 0 %}
  {% assign sorted_photos = photos | sort: "date" | reverse %}
  <div class="photo-grid">
    {% for photo in sorted_photos %}
      {% assign src = photo.src | default: photo.image | default: photo %}
      {% assign alt = photo.alt | default: 'Photo ' | append: forloop.index %}
      {% assign location = photo.location | default: photo.place | default: '' %}
      {% assign taken = photo.date %}
      <figure class="photo-card">
        <img src="{{ src | relative_url }}" alt="{{ alt }}" loading="lazy">
        <figcaption class="photo-meta">
          {% if location %}
            <span class="photo-location">{{ location }}</span>
          {% endif %}
          {% if taken %}
            <time class="photo-date" datetime="{{ taken | date_to_xmlschema }}">{{ taken | date: "%d %b %Y" }}</time>
          {% endif %}
        </figcaption>
      </figure>
    {% endfor %}
  </div>
{% else %}
  <p class="muted">No photos yet.</p>
{% endif %}
