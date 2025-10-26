---
layout: page
title: Now
permalink: /now/
hide_progress: true
updated: 2025-10-04
extra_css: [timeline]
---
> This is a “now” page — a snapshot of what I’m doing at the moment.    
> _Inspired by the [nownownow.com](https://nownownow.com/about) movement._

---

{% assign base_timeline = site.data.now.timeline | default: site.now.timeline %}
{% if base_timeline %}
{% assign timeline_entries = base_timeline | sort: "date" | reverse %}
<ol class="timeline">
  {% for entry in timeline_entries %}
  <li class="timeline-item">
    <div class="timeline-dot" aria-hidden="true"></div>
    <div class="timeline-body">
      <div class="timeline-head">
        {% capture display_date %}
          {% if entry.date %}
            {{ entry.date | date: "%d %b %Y" }}
          {% else %}
            Update
          {% endif %}
        {% endcapture %}
        <h3>{{ display_date | strip }}</h3>
      </div>
      {{ entry.body | markdownify }}
    </div>
  </li>
  {% endfor %}
</ol>
{% endif %}

---

Want to say hi? 👋🏻 You’ll find my links in the footer. 👇🏻
