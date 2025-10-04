---
layout: page
title: About
permalink: /about/
extra_css: [about]
cdn_css:
  - https://unpkg.com/leaflet@1.9.4/dist/leaflet.css
cdn_js:
  - https://unpkg.com/leaflet@1.9.4/dist/leaflet.js
extra_js: [about]
hide_progress: true
---

<section class="about-hero">
  {% assign avatar_pos = site.about.avatar_pos | default: '50% 50%' %}
  <img class="about-avatar" src="{{ site.author_avatar | relative_url }}" alt="{{ site.author }}" width="72" height="72" style="object-position: {{ avatar_pos }};">
  <div class="about-intro">
    <h2 class="about-name">{{ site.author }}</h2>
    {% if site.about.tagline %}
    {% assign tl = site.about.tagline | newline_to_br %}
    <p class="about-tagline">{{ tl }}</p>
    {% endif %}
    <ul class="about-meta">
      {% if site.about.location %}<li><span class="emoji">📍</span>{{ site.about.location }}</li>{% endif %}
    </ul>
  </div>
  {% if site.about.photos %}
  <div class="about-photos">
    {% for p in site.about.photos %}
      {% assign src = p.src | default: p %}
      {% assign alt = p.alt | default: 'Photo ' | append: forloop.index %}
      {% assign pos = p.pos | default: '' %}
      <img src="{{ src | relative_url }}" alt="{{ alt }}" loading="lazy"{% if pos %} style="object-position: {{ pos }};"{% endif %}>
    {% endfor %}
  </div>
  {% endif %}
</section>

---

## Experience

{% assign jobs = site.about.experience %}

<ol class="timeline">
  {% for job in jobs %}
  <li class="timeline-item">
    <div class="timeline-dot" aria-hidden="true"></div>
    <div class="timeline-body">
      <div class="timeline-head">
        <h3>{{ job.role }} · <a href="{{ job.url }}" target="_blank" rel="noopener">{{ job.org }}</a></h3>
        <span class="timeline-when">{{ job.from }}–{{ job.to }}</span>
      </div>
      {% if job.summary %}<p>{{ job.summary }}</p>{% endif %}
    </div>
  </li>
  {% endfor %}
</ol>
---

## Places I’ve been

<div id="placesMap" class="places-map" aria-label="Map of places I've been"></div>
<div class="map-legend" aria-label="Legend">
  <span class="leg living"></span> Living
  <span class="leg lived"></span> Lived
  <span class="leg visited"></span> Visited
  <span class="sep">·</span>
  <span class="hint">Drag to pan, scroll to zoom</span>
</div>

<script>
  window.ABOUT_PLACES = {{ site.about.places | jsonify }};
</script>

---

## GitHub Stats
{% if site.about.github.show_metrics and site.about.github.username %}
{% assign gh = site.about.github.username %}
<div class="gh-stack">
  <div class="gh-row gh-two">
    <img class="gh-img" src="https://raw.githubusercontent.com/{{ gh }}/{{ gh }}/main/metrics.svg" alt="GitHub overview metrics" loading="lazy">
    <img class="gh-img" src="https://raw.githubusercontent.com/{{ gh }}/{{ gh }}/main/calendar.svg" alt="GitHub contributions calendar" loading="lazy">
  </div>
  <div class="gh-row gh-center">
    <img class="gh-img" src="https://raw.githubusercontent.com/{{ gh }}/{{ gh }}/main/languages.svg" alt="GitHub languages breakdown" loading="lazy">
  </div>
  
</div>
{% else %}
<p>Enable this by setting <code>about.github.show_metrics: true</code> and your <code>username</code> in <code>_config.yml</code>.</p>
{% endif %}
