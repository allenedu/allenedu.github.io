---
layout: learning
title: 学习导航
permalink: /sitemap/
redirect_from:
- /page-archive/
- /collection-archive/
- /categories/
- /tags/
- /talkmap/
---
<main class="allen-container allen-inner-main" id="main">
  <header class="allen-page-heading"><p class="allen-eyebrow">FIND YOUR WAY</p><h1>想学什么，从这里出发。</h1><p>课程框架、数学英语、真题练习与交互实验，按你现在需要的方向选择。</p></header>
  <div class="allen-directory-grid">
    <section class="allen-directory"><h2>课程与复习</h2><a href="{{ '/teaching/' | relative_url }}">浏览全部课程大纲</a>{% for course in site.teaching %}<a href="{{ course.url | relative_url }}">{{ course.title | escape }}</a>{% endfor %}<a href="{{ '/publications/' | relative_url }}">历年真题与官方资源</a><a href="{{ '/portfolio/' | relative_url }}">学习方法与复盘建议</a></section>
    <section class="allen-directory"><h2>数学词汇</h2>{% assign vocabulary = site.talks | sort: 'order' %}{% for topic in vocabulary %}<a href="{{ topic.url | relative_url }}">{{ topic.title | escape }}<span>{{ topic.term_count }} 个词条</span></a>{% endfor %}</section>
    <section class="allen-directory"><h2>动手探索</h2><p>从初等数学到微积分，用可调节的图像理解公式。</p><a href="{{ '/year-archive/' | relative_url }}">数学实验室 · {{ site.data.math_studio.experiments.size }} 个实验</a><a href="{{ '/#math-lab' | relative_url }}">首页小实验</a><h2>关于这里</h2><a href="{{ '/cv-json/' | relative_url }}">认识 Allen</a><a href="{{ '/terms/' | relative_url }}">使用说明</a></section>
  </div>
</main>
