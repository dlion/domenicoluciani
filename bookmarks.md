---
layout: default
title: Bookmarks
description: "Bookmarks from around the web."
permalink: /bookmarks/
hide_progress: true
hero:
  image: /assets/images/covers/bookmark.png
  title: Bookmarks
  subtext: "Bookmarks from around the web."
---

{% assign hero_image = page.hero.image | default: page.hero_image | default: site.hero.image %}
{% assign hero_kicker = page.hero.kicker | default: page.hero_kicker | default: site.hero.kicker %}
{% assign hero_title = page.hero.title | default: page.hero_title | default: site.hero.title %}
{% assign hero_subtext = page.hero.subtext | default: page.hero_subtext | default: site.hero.subtext %}
{% assign hero_cta_label = page.hero.cta_label | default: page.hero_cta_label | default: site.hero.cta_label %}
{% assign hero_cta_url = page.hero.cta_url | default: page.hero_cta_url | default: site.hero.cta_url %}
{% assign hero_pos = page.hero.pos | default: site.hero.pos | default: '' %}

{% assign hero_image_url = hero_image | default: '' %}
{% if hero_image_url != '' %}
  {% unless hero_image_url contains '://' %}
    {% assign hero_image_url = hero_image_url | relative_url %}
  {% endunless %}
{% endif %}

{% assign hero_cta_href = hero_cta_url | default: '' %}
{% if hero_cta_href != '' %}
  {% unless hero_cta_href contains '://' %}
    {% assign hero_cta_href = hero_cta_href | relative_url %}
  {% endunless %}
{% endif %}

<section class="home-hero"{% if hero_pos != '' %} style="--hero-pos: {{ hero_pos }};"{% endif %}>
  {% if hero_image_url != '' %}
    <img class="hero-img" src="{{ hero_image_url }}" alt="" fetchpriority="high" decoding="async" referrerpolicy="no-referrer" width="1600" height="900" />
  {% endif %}
  <div class="hero-inner">
    {% if hero_kicker %}<p class="hero-kicker">{{ hero_kicker }}</p>{% endif %}
    {% if hero_title %}<h1 class="hero-title">{{ hero_title }}</h1>{% endif %}
    {% if hero_subtext %}
      <p class="hero-subtext">{{ hero_subtext }}</p>
    {% endif %}
    {% if hero_cta_label and hero_cta_href %}
      <a class="hero-cta" href="{{ hero_cta_href }}">{{ hero_cta_label }}</a>
    {% endif %}
  </div>
</section>

<section class="post-list">
  <h2 class="visually-hidden">Bookmarks</h2>

  {% assign bookmark_posts = site.tags.bookmarks %}
  {% if bookmark_posts %}
    {% assign bookmark_posts = bookmark_posts | sort: 'date' | reverse %}
  {% else %}
    {% assign bookmark_posts = "" | split: "" %}
  {% endif %}

  {% for post in bookmark_posts %}
    <article class="post-card">
      <h2 class="post-card-title">
        <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
      </h2>
      <p class="post-card-meta">
        <time datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: "%d %b %Y" }}</time>
        <span class="dot">•</span>
        {{ post.content | number_of_words | divided_by:200 | plus:1 }} min read
      </p>
      {% if post.description %}
        <p class="post-card-excerpt">{{ post.description }}</p>
      {% else %}
        <p class="post-card-excerpt">{{ post.excerpt | strip_html | truncate: 180 }}</p>
      {% endif %}
    </article>
  {% endfor %}

  {% if bookmark_posts == empty %}
    <p class="muted">No bookmarks yet.</p>
  {% endif %}
</section>
