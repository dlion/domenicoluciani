---
layout: default
title: Tags
permalink: /tags/
hide_progress: true
---

<section class="tags-page">
  <header class="tags-hero">
    <h1>Tags</h1>
  </header>

  <nav class="tag-chips" aria-label="Tags">
    {% assign sorted = site.tags | sort %}
    <a class="tag-chip is-active" data-tag="all" href="#all">All</a>
    {%- comment -%} Put #highlights immediately after All {%- endcomment -%}
    {% for tag in sorted %}
      {% assign name = tag[0] %}
      {% assign name_lc = name | downcase %}
      {% if name_lc == 'highlights' %}
        {% assign posts = tag[1] | sort: 'date' | reverse %}
        {% assign count = posts | size %}
        <a class="tag-chip" data-tag="{{ name | slugify }}" href="#{{ name | slugify }}">#{{ name }} <span class="count">{{ count }}</span></a>
      {% endif %}
    {% endfor %}
    {%- comment -%} Then render the rest alphabetically {%- endcomment -%}
    {% for tag in sorted %}
      {% assign name = tag[0] %}
      {% assign name_lc = name | downcase %}
      {% if name_lc != 'highlights' %}
        {% assign posts = tag[1] | sort: 'date' | reverse %}
        {% assign count = posts | size %}
        <a class="tag-chip" data-tag="{{ name | slugify }}" href="#{{ name | slugify }}">#{{ name }} <span class="count">{{ count }}</span></a>
      {% endif %}
    {% endfor %}
  </nav>

  <div class="tags-sections">
    {%- comment -%} First, the #highlights section (if present) {%- endcomment -%}
    {% for tag in sorted %}
      {% assign name = tag[0] %}
      {% assign name_lc = name | downcase %}
      {% if name_lc == 'highlights' %}
        {% assign posts = tag[1] | sort: 'date' | reverse %}
        <section id="{{ name | slugify }}" class="tag-section" data-tag="{{ name | slugify }}">
          <h2>#{{ name }}</h2>
          <ul class="tag-posts">
            {% for post in posts %}
              <li>
                <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
                <span class="meta">· {{ post.date | date: "%d %b %Y" }}</span>
              </li>
            {% endfor %}
          </ul>
        </section>
      {% endif %}
    {% endfor %}

    {%- comment -%} Then, all other tags in alpha order {%- endcomment -%}
    {% for tag in sorted %}
      {% assign name = tag[0] %}
      {% assign name_lc = name | downcase %}
      {% if name_lc != 'highlights' %}
        {% assign posts = tag[1] | sort: 'date' | reverse %}
        <section id="{{ name | slugify }}" class="tag-section" data-tag="{{ name | slugify }}">
          <h2>#{{ name }}</h2>
          <ul class="tag-posts">
            {% for post in posts %}
              <li>
                <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
                <span class="meta">· {{ post.date | date: "%d %b %Y" }}</span>
              </li>
            {% endfor %}
          </ul>
        </section>
      {% endif %}
    {% endfor %}
  </div>
</section>
