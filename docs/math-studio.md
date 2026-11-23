# Mathematics studio

The studio is published at `/year-archive/`, with `/math-lab/` as an alias.
It contains 50 adjustable experiments across eight topic groups, from fractions
and geometry to calculus, differential equations, and probability.
Each experiment has a stable fragment, such as `#unit-circle` or
`#riemann?n=20&theta=0.5`. Links include nondefault parameter values.
Existing course and vocabulary content is unaffected.

The models are pure ES modules in `assets/js/math-studio-*.mjs`. Every model
defines its controls, teaching question, presets, SVG renderer, observations,
and numerical outputs. The interface loads only on the studio page. All SVG
colors respond to the site's existing theme. No remote plotting dependency
or arbitrary expression evaluation is used.

After adding or editing experiment metadata, run:

```sh
node scripts/update-math-catalog.mjs
node --test tests/*.test.mjs
```

The catalog JSON is committed so Jekyll renders the full directory before
JavaScript runs. The tests check reference values, convergence examples,
degenerate cases, and rendering at control bounds. A full production build
uses the existing GitHub Pages workflow.

Plots use the ranges shown by their axes; offscreen portions are clipped.
Numerical approximations and exact quantities are labelled separately.
Particular cases are explicit: logarithms with base 1 are undefined,
zero quadratic coefficients yield a line, a zero secant increment displays
the limiting slope, and geometric series with |r| >= 1 do not converge.

All mathematical notation is rendered from LaTeX with the locally hosted
MathJax TeX-to-SVG component. `math-studio-tex.mjs` defines the main formulas
and catalog symbols. `math-notation.mjs` converts the models' plain accessibility
labels into TeX fragments, preserving surrounding Chinese and English prose.
`math-renderer.mjs` renders HTML formulas and SVG graph labels and caches
independent glyph paths, so parameter updates do not depend on a remote service.
Long display formulas scroll inside their own panel on narrow screens.
The same renderer handles the homepage playground and existing page TeX.
The vendor source, pinned version, and Apache license are recorded under
`assets/vendor/mathjax-3.2.2/`.

Every experiment has a chosen playback parameter. Playback is explicit, stops
on manual adjustment, sharing, experiment changes, Escape, or a hidden tab,
and uses the same clamped slider values as manual input. The precision panel
supports numeric entry, Enter, blur, and an explicit apply action. Focus mode
removes surrounding navigation and the catalog, while image enlargement keeps
its horizontal scroll within the plot. Topic, learning-stage, and text filters
can be combined and cleared together. Existing fragment links remain valid.

Reference tests cover all control-bound combinations, known values, convergence
orders, probability normalization, deterministic Monte Carlo sample prefixes,
LaTeX notation, and production catalog consistency. Diagrams of sectors and
rotating disks are explanatory projections; approximations are labelled.
