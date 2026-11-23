---
layout: learning
permalink: /
title: "把数学讲明白，让学习更有趣"
description: "Allen智学，开放的国际数学学习空间。探索 AP、IB、A-Level 等课程资源、数学词汇、官方真题与交互式数学工具。"
author_profile: false
redirect_from:
  - /about/
  - /about.html
---
<main id="main">
  <section class="allen-hero">
    <div class="allen-container allen-hero-grid">
      <div class="allen-hero-copy">
        <span class="allen-pill"><span aria-hidden="true">✦</span> 为每一份好奇心，打开数学的门</span>
        <h1>把数学讲明白，<br><em>让学习更有趣。</em></h1>
        <p class="allen-hero-english">Making Math Simple.<br>Making Learning Fun.</p>
        <p class="allen-hero-description">在这里，复杂的概念有清晰的解释，努力的每一步都有方向。一起理解数学，也发现思考的乐趣。</p>
        <div class="allen-button-row"><a class="allen-button" href="#resources">探索学习资源</a><a class="allen-button allen-button-outline" href="{{ '/cv-json/' | relative_url }}">认识 Allen</a></div>
        <div class="allen-hero-footnote"><span class="allen-check" aria-hidden="true">✓</span> 公益分享 <span aria-hidden="true">·</span> 免费开放 <span aria-hidden="true">·</span> 一起进步</div>
      </div>
      <div class="allen-hero-visual">
        <span class="allen-doodle allen-doodle-one" aria-hidden="true" data-tex="\sum"></span><span class="allen-doodle allen-doodle-two" aria-hidden="true" data-tex="x^2+y^2"></span>
        <div class="allen-illustration"><div class="allen-illustration-caption"><span class="allen-mini-mark" aria-hidden="true">✳</span><span>A LITTLE CURIOSITY. A WORLD OF POSSIBILITIES.</span></div><img src="{{ '/images/discussys.png' | relative_url }}" alt="学生们围坐在一起，讨论黑板上的数学问题" width="1024" height="546" fetchpriority="high"><div class="allen-illustration-bottom"><span>理解 · 探索 · 发现</span><span aria-hidden="true" data-tex="\infty"></span></div></div>
        <div class="allen-floating-note"><span class="allen-note-icon" aria-hidden="true">✦</span><div><strong>每一个「为什么」</strong><span>都可以成为进步的起点</span></div></div>
      </div>
    </div>
    <div class="allen-container"><div class="allen-course-band"><span>与你一起探索国际数学</span><div><b>AP</b><b>IB</b><b>A-Level</b><b>AMC</b><b>SAT</b></div><span class="allen-course-band-note">从基础理解，到独立思考</span></div></div>
  </section>

  <section class="allen-section allen-container" id="resources" aria-labelledby="resources-title">
    <div class="allen-section-heading"><div><p class="allen-eyebrow">YOUR LEARNING STARTS HERE</p><h2 id="resources-title">找到你的下一步</h2></div><p>少一点盲目摸索，多一点清晰方向。<br>从现在需要的那一份资源开始。</p></div>
    <div class="allen-resource-grid">
    {% for item in site.data.learning.resources %}
      <a class="allen-resource-card allen-{{ item.color }}" href="{{ item.url | relative_url }}"><span class="allen-card-icon">{% include allen-icon.html name=item.icon %}</span><span class="allen-card-eyebrow">{{ item.en }}</span><h3>{{ item.title }}</h3><p>{{ item.description }}</p><span class="allen-card-action">{{ item.action }}<span class="allen-action-line" aria-hidden="true"></span></span></a>
    {% endfor %}
    </div>
  </section>

  <section class="allen-course-section">
    <div class="allen-container allen-course-layout"><div class="allen-course-intro"><p class="allen-eyebrow">BUILD A STRONG FOUNDATION</p><h2>知识连成线，<br>学习才有章法。</h2><p>从函数到微积分，先看清整幅地图，再一步步建立自己的知识体系。</p><a class="allen-text-link" href="{{ '/teaching/' | relative_url }}">浏览课程大纲</a></div><div class="allen-course-list"><a href="{{ '/teaching/ap-precalculus' | relative_url }}"><span class="allen-course-symbol" aria-hidden="true" data-tex="f(x)"></span><div><span class="allen-card-eyebrow">FOUNDATION</span><h3>AP Precalculus</h3><p>函数、三角与数学建模，筑牢微积分的起点。</p></div><span class="allen-course-tag">预微积分</span></a><a href="{{ '/teaching/ap-calculus' | relative_url }}"><span class="allen-course-symbol allen-course-symbol-blue" aria-hidden="true" data-tex="\int"></span><div><span class="allen-card-eyebrow">EXPLORATION</span><h3>AP Calculus AB / BC</h3><p>从变化率到累积量，理解微积分的核心联系。</p></div><span class="allen-course-tag">微积分</span></a></div></div>
  </section>

  <section class="allen-section allen-container" id="math-lab" aria-labelledby="lab-title">
    <div class="allen-section-heading"><div><p class="allen-eyebrow">A SMALL EXPERIMENT, A BIG IDEA</p><h2 id="lab-title">数学，也可以亲手探索。</h2></div><p>拖动参数，看公式如何变成图像。<br>让「看懂」多一种方式。</p></div>
    {% include allen-lab.html %}
    <div class="allen-callout"><h2>50 个实验，把数学串起来。</h2><p>转动单位圆，观察割线变成切线，用小矩形拼出积分，再试着用正弦波拼出方波。</p><div class="allen-button-row" style="margin-top:18px"><a class="allen-button" href="{{ '/year-archive/' | relative_url }}">浏览数学实验室</a><a class="allen-text-link" href="{{ '/year-archive/#unit-circle' | relative_url }}">单位圆</a><a class="allen-text-link" href="{{ '/year-archive/#secant-tangent' | relative_url }}">割线与切线</a><a class="allen-text-link" href="{{ '/year-archive/#riemann' | relative_url }}">黎曼和</a></div></div>
  </section>

  <section class="allen-container allen-about-section"><div class="allen-about-portrait"><img src="{{ '/images/profile720bys.png' | relative_url }}" alt="Allen 的插画头像" width="176" height="176" loading="lazy"><span>HELLO, I’M ALLEN.</span></div><div class="allen-about-copy"><p class="allen-eyebrow">A TEACHER. A FELLOW LEARNER.</p><h2>讲清知识，也陪你建立信心。</h2><p>我相信，数学的魅力藏在「原来如此」的瞬间里。这个小小的学习空间，希望用清晰的讲解、实用的资源和真诚的分享，让更多人享受思考的乐趣。</p><a class="allen-text-link" href="{{ '/cv-json/' | relative_url }}">了解我的教学理念</a></div><span class="allen-about-quote" aria-hidden="true">“</span></section>

  <section class="allen-container allen-final-note"><span aria-hidden="true">✳</span><h2>保持好奇，答案会慢慢清晰。</h2><p>学习从来不必孤军奋战。欢迎来这里，找到资源，也找到方向。</p><a class="allen-button" href="{{ '/images/wechat.png' | relative_url }}" data-wechat>和 Allen 聊聊</a></section>
</main>








