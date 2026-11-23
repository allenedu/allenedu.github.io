import test from "node:test";
import assert from "node:assert/strict";
import {plainToTex,mathSegments,mixedHTML,mixedToTex} from "../assets/js/math-notation.mjs";
import {experiments,metadata,renderExperiment} from "../assets/js/math-studio-models.mjs";

test("derivatives, subscripts, Greek symbols, and degrees use TeX commands",()=>{
  assert.equal(plainToTex("f′(x₀)"),"f^{\\prime}(x_{0})");
  assert.equal(plainToTex("θ ∈ [0°, 180°)").replace(/\s+/g," "),"\\theta \\in [0^{\\circ}, 180^{\\circ})");
  assert.equal(plainToTex("Sₙ"),"S_{n}");
});
test("fractions and roots preserve mathematical grouping",()=>{
  assert.equal(plainToTex("m = Δy / Δx"),"m = \\frac{\\Delta y}{\\Delta x}");
  assert.equal(plainToTex("√(a² + b²)"),"\\sqrt{a^{2} + b^{2}}");
  assert.equal(plainToTex("a + b / c"),"a + b / c");
  assert.equal(plainToTex("1 / (1 + x)"),"\\frac{1}{(1 + x)}");
});
test("very small errors use TeX scientific notation",()=>{
  assert.equal(plainToTex("2.17e-14"),"2.17\\times 10^{-14}");
});
test("Chinese explanations and English method names remain prose",()=>{
  const parts=mathSegments("Euler 终点值；当 x = π 时达到最大。");
  assert.ok(parts.some(p=>p.text?.includes("Euler 终点值")));
  assert.deepEqual(parts.filter(p=>p.tex!==undefined).map(p=>p.math),["x = π"]);
  assert.equal(mixedToTex("圆上的点 P = (cos θ, sin θ)"),"\\text{圆上的点 }P = (\\cos \\theta , \\sin \\theta )");
});
test("compound variables and the complex argument operator are rendered",()=>{
  assert.equal(mathSegments("zw")[0].tex,"zw");
  assert.equal(plainToTex("arg z"),"\\arg z");
});
test("math fragments escape markup and attribute delimiters",()=>{
  const html=mixedHTML('函数 x < 2 与 "标签"');
  assert.ok(html.includes('data-tex="x &lt; 2"'));
  assert.ok(html.includes("&quot;标签&quot;"));
  assert.ok(!html.includes("< 2"));
});
test("all experiments and catalog symbols expose canonical LaTeX",()=>{
  for(const model of experiments){
    const cases=[{},...model.presets.map(p=>p.values)];
    for(let bits=0;bits<2**model.controls.length;bits++){
      cases.push(Object.fromEntries(model.controls.map((c,i)=>[c.key,(bits>>i)&1?c.max:c.min])));
    }
    for(const p of cases){
      const tex=renderExperiment(model.id,p).formulaTex;
      assert.ok(tex.length>=3,model.id);
      assert.ok(!/[²³₀₁₂ₙ√∫∑θπ]|NaN|undefined|Infinity/.test(tex),model.id+": "+tex);
    }
    assert.ok(metadata.find(item=>item.id===model.id).symbolTex);
  }
});
test("ellipse denominators retain exact squared slider values",()=>{
  assert.equal(renderExperiment("ellipse",{a:.75,b:1.25}).formulaTex,"\\frac{x^{2}}{0.5625}+\\frac{y^{2}}{1.5625}=1");
});
test("negative phase is expressed as subtraction of a positive radian fraction",()=>{
  const tex=renderExperiment("sine-wave",{phi:-90}).formulaTex;
  assert.ok(tex.includes(" - \\frac{\\pi}{2}"),tex);
  assert.ok(!tex.includes(" - -"));
});
test("separate measured quantities cannot be mistaken for division",()=>{
  for(const id of ["signed-area","between-curves"]){
    const stats=renderExperiment(id,{}).stats;
    assert.equal(stats.length,4);
    assert.ok(stats.every(item=>!String(item.value).includes(" / ")));
  }
});
