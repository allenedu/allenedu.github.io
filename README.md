# Allen智学

开放的国际数学学习空间：课程大纲、数学词汇、官方真题入口与交互式数学实验。

网站：https://allenedu.github.io

## 内容结构

- `_pages/`：首页、资源索引、学习导航与使用说明。
- `_teaching/`：课程大纲；使用 `resource` 布局和章节目录。
- `_talks/`：数学词汇；保留历史集合名称，页面使用中文主题与可搜索的对照表。
- `_data/math_studio.json`：数学实验目录。
- `assets/js/math-*.mjs`：实验计算、绘图与 LaTeX 渲染。
- `_layouts/learning.html`：共享页面布局。
- `_layouts/resource.html`：课程与词汇阅读布局。

数学符号统一使用 LaTeX，由仓库内的 MathJax 渲染。添加内容时优先使用 `data-tex` 或已有的数学渲染函数。

## 更新与验证

保留已公开链接，调整路径时添加 `redirect_from`。课程页与词汇页不使用发布日期、演讲地点等无关元数据。

运行数学实验回归检查：

```sh
node --test tests/*.test.mjs
```

网站通过 GitHub Pages 的 Jekyll 构建发布。

## 模板与许可

网站最初基于 [Academic Pages](https://github.com/academicpages/academicpages.github.io) 与 Minimal Mistakes 构建，现已调整为教学资源网站。原始 MIT 许可保留在 `LICENSE` 中；MathJax 的许可保留在对应的 vendor 目录。
