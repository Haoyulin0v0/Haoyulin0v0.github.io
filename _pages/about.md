---
layout: page
permalink: /about/
title: about
---
{% assign profile = site.data.profile %}
{% if profile.intro and profile.intro != empty %}<p>{{ profile.intro | escape }}</p>{% endif %}
<section class="about-section" aria-labelledby="contact-title">
  <h2 id="contact-title">联系方式</h2><ul class="contact-list">
  {% if profile.github and profile.github != empty %}<li><a href="{{ profile.github | escape }}">GitHub · {{ site.github_username | escape }} ↗</a></li>{% endif %}
  {% if profile.email and profile.email != empty %}<li><a href="mailto:{{ profile.email | escape }}">{{ profile.email | escape }}</a></li>{% endif %}
  {% for contact in profile.contacts %}{% if contact.url and contact.url != empty %}<li><a href="{{ contact.url | escape }}">{{ contact.label | escape }} ↗</a></li>{% endif %}{% endfor %}
  </ul>
</section>
<section class="about-section" aria-labelledby="cv-title"><h2 id="cv-title">CV</h2>
{% if profile.cv_url and profile.cv_url != empty %}<p><a href="{{ profile.cv_url | relative_url }}">{{ profile.cv_label | default: '查看 CV' | escape }} ↗</a></p>{% else %}<p class="about-empty">暂未提供。</p>{% endif %}
</section>
<section class="about-section" aria-labelledby="publications-title"><h2 id="publications-title">文章与成果</h2>
{% for publication in profile.publications %}<div class="publication">{% if publication.url and publication.url != empty %}<h3><a href="{{ publication.url | relative_url }}">{{ publication.title | escape }} ↗</a></h3>{% else %}<h3>{{ publication.title | escape }}</h3>{% endif %}{% if publication.description and publication.description != empty %}<p>{{ publication.description | escape }}</p>{% endif %}</div>{% else %}<p class="about-empty">待更新。</p>{% endfor %}
</section>
