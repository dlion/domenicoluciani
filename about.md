---
layout: page
title: About
permalink: /about/
extra_css: [about, timeline]
cdn_css:
  - https://unpkg.com/leaflet@1.9.4/dist/leaflet.css
cdn_js:
  - https://unpkg.com/leaflet@1.9.4/dist/leaflet.js
extra_js: [about]
hide_progress: true
---

{% assign about_photos = site.data.about_photos | default: site.about.photos %}
{% assign about_experience = site.data.about_experience | default: site.about.experience %}
{% assign about_places = site.data.about_places | default: site.about.places %}

<section class="about-hero" id="introduction">
  {% assign avatar_pos = site.about.avatar_pos | default: '50% 50%' %}
  <img class="about-avatar" src="{{ site.author_avatar | relative_url }}" alt="{{ site.author }}" width="72" height="72" style="object-position: {{ avatar_pos }};">
  <div class="about-intro">
    <h2 class="about-name">{{ site.author }}</h2>
    {% if site.about.tagline %}
      {% assign tl = site.about.tagline | newline_to_br %}
      <p class="about-tagline">{{ tl }}</p>
    {% endif %}
    <ul class="about-meta">
      {% if site.about.location %}<li><span class="emoji" aria-hidden="true">📍</span>{{ site.about.location }}</li>{% endif %}
      <li><span class="emoji" aria-hidden="true">🧭</span>Software craftsmanship · product engineering · open source</li>
    </ul>
  </div>
  {% if about_photos %}
    <div class="about-photos" aria-label="A few moments from my travels">
      {% for p in about_photos %}
        {% assign src = p.src | default: p %}
        {% if p.alt %}
          {% assign alt = p.alt %}
        {% else %}
          {% capture alt %}Travel photo {{ forloop.index }}{% endcapture %}
        {% endif %}
        {% assign pos = p.pos | default: '' %}
        <img src="{{ src | relative_url }}" alt="{{ alt }}" loading="lazy" decoding="async"{% if pos %} style="object-position: {{ pos }};"{% endif %}>
      {% endfor %}
    </div>
  {% endif %}
</section>

<div class="about-links" aria-label="More about me">
  <a href="{{ '/now/' | relative_url }}">
    <span>What I’m doing now</span>
    <small>Current projects, interests, and life updates.</small>
  </a>
  <a href="{{ '/bookmarks/' | relative_url }}">
    <span>Bookmarks I kept</span>
    <small>A monthly shelf of ideas worth returning to.</small>
  </a>
</div>

---

## Experience

<p class="section-intro">More than a decade moving from full-stack development to technical leadership, infrastructure, and product engineering.</p>

<ol class="timeline timeline-current">
  {% for job in about_experience limit: 4 %}
    <li class="timeline-item">
      <div class="timeline-dot" aria-hidden="true"></div>
      <div class="timeline-body">
        <div class="timeline-head">
          <h3>{{ job.role }} · {% if job.url %}<a href="{{ job.url }}" target="_blank" rel="noopener">{{ job.org }}</a>{% else %}{{ job.org }}{% endif %}</h3>
          <span class="timeline-when">{{ job.from }}–{{ job.to }}</span>
        </div>
        {% if job.summary %}<p>{{ job.summary }}</p>{% endif %}
      </div>
    </li>
  {% endfor %}
</ol>

{% assign earlier_roles = about_experience.size | minus: 4 %}
{% if earlier_roles > 0 %}
  <details class="experience-more">
    <summary>Earlier adventures · {{ earlier_roles }} roles</summary>
    <ol class="timeline timeline-older">
      {% for job in about_experience offset: 4 %}
        <li class="timeline-item">
          <div class="timeline-dot" aria-hidden="true"></div>
          <div class="timeline-body">
            <div class="timeline-head">
              <h3>{{ job.role }} · {% if job.url %}<a href="{{ job.url }}" target="_blank" rel="noopener">{{ job.org }}</a>{% else %}{{ job.org }}{% endif %}</h3>
              <span class="timeline-when">{{ job.from }}–{{ job.to }}</span>
            </div>
            {% if job.summary %}<p>{{ job.summary }}</p>{% endif %}
          </div>
        </li>
      {% endfor %}
    </ol>
  </details>
{% endif %}

---

## Places I’ve been

<p class="section-intro">A personal atlas of {{ about_places.size }} places I’ve lived in or visited. Search the list, focus a marker, or follow a place into the photo archive.</p>

<div class="places-explorer">
  <div class="places-map-column">
    <div id="placesMap" class="places-map" role="region" tabindex="0" aria-label="Interactive map of places I've been" aria-describedby="placesMapHint"></div>
    <div class="map-legend" aria-label="Map legend">
      <span><span class="leg living"></span>Living</span>
      <span><span class="leg lived"></span>Lived</span>
      <span><span class="leg visited"></span>Visited</span>
      <span class="hint" id="placesMapHint">Select the map before zooming.</span>
    </div>
  </div>

  <aside class="places-directory" aria-labelledby="placesDirectoryTitle">
    <h3 id="placesDirectoryTitle">Find a place</h3>
    <label class="places-search-label" for="placesSearch">Search the atlas</label>
    <input id="placesSearch" class="places-search" type="search" placeholder="Try Palermo or Japan…" autocomplete="off">
    <p class="places-count" id="placesCount" aria-live="polite">{{ about_places.size }} places</p>

    {% assign place_kinds = 'living,lived,visited' | split: ',' %}
    {% for kind in place_kinds %}
      {% assign kind_places = about_places | where: 'kind', kind %}
      {% if kind_places.size > 0 %}
        <details class="places-group" data-place-group {% unless kind == 'visited' %}open{% endunless %}>
          <summary>{{ kind | capitalize }} · {{ kind_places.size }}</summary>
          <ul>
            {% for place in kind_places %}
              {% assign country_name = site.data.countries[place.country] | default: place.country %}
              <li data-place-entry data-place-search="{{ place.name | append: ' ' | append: place.country | append: ' ' | append: country_name | downcase | escape }}">
                <button class="place-focus" type="button" data-place-index="{{ forloop.index0 }}" data-place-name="{{ place.name | escape }}">{{ place.name }}, {{ country_name }}</button>
                <a class="place-photos" href="{{ '/photos/' | relative_url }}?place={{ place.name | url_encode }}">Photos</a>
              </li>
            {% endfor %}
          </ul>
        </details>
      {% endif %}
    {% endfor %}
    <p class="places-empty" id="placesEmpty" hidden>No places match that search.</p>
  </aside>
</div>

<script>
  window.ABOUT_PLACES = {{ about_places | jsonify }};
  window.ABOUT_COUNTRIES = {{ site.data.countries | jsonify }};
</script>

---

## Open source
{: #open-source }

<section class="open-source-card">
  <div>
    <p class="open-source-kicker">Build in public, learn in public</p>
    <h3>Code, experiments, and contributions</h3>
    <p>I care about software craftsmanship, product engineering, and sharing what I learn along the way.</p>
    <a class="open-source-link" href="https://github.com/{{ site.about.github.username }}" target="_blank" rel="me noopener">Explore my GitHub profile</a>
  </div>

  {% if site.about.github.show_metrics and site.about.github.username %}
    {% assign gh = site.about.github.username %}
    <details class="github-details">
      <summary>Detailed GitHub metrics</summary>
      <div class="gh-stack">
        <div class="gh-row gh-two">
          <img class="gh-img" src="https://raw.githubusercontent.com/{{ gh }}/{{ gh }}/main/metrics.svg" alt="GitHub activity overview for {{ gh }}" loading="lazy" decoding="async">
          <img class="gh-img" src="https://raw.githubusercontent.com/{{ gh }}/{{ gh }}/main/calendar.svg" alt="GitHub contribution calendar for {{ gh }}" loading="lazy" decoding="async">
        </div>
        <div class="gh-row gh-center">
          <img class="gh-img" src="https://raw.githubusercontent.com/{{ gh }}/{{ gh }}/main/languages.svg" alt="Programming language breakdown for {{ gh }}" loading="lazy" decoding="async">
        </div>
      </div>
    </details>
  {% endif %}
</section>

<nav class="about-next" aria-label="Keep exploring">
  <a href="{{ '/photos/' | relative_url }}"><span>Wander through places</span><small>Explore the photo archive</small></a>
  <a href="{{ '/notes/' | relative_url }}"><span>Follow the thoughts</span><small>Read notes from the garden</small></a>
</nav>
