import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {experiments,categories,metadata,renderExperiment} from "../assets/js/math-studio-models.mjs";
import {stateFor} from "../assets/js/math-studio-core.mjs";

const values=(id,p={})=>renderExperiment(id,p).values;
const close=(actual,expected,tolerance=1e-10)=>assert.ok(Math.abs(actual-expected)<=tolerance*Math.max(1,Math.abs(expected)),actual+" != "+expected);

test("catalog has 50 distinct, discoverable experiments matching the production metadata",()=>{
  assert.equal(experiments.length,50);
  assert.equal(new Set(experiments.map(m=>m.id)).size,50);
  assert.equal(categories.length,8);
  const catalog=JSON.parse(readFileSync(new URL("../_data/math_studio.json",import.meta.url)));
  assert.deepEqual(catalog,{categories,experiments:metadata});
});

for(const model of experiments){
  test(model.id+": defaults, presets, and all parameter-bound combinations render finite SVG",()=>{
    const cases=[{},...model.presets.map(p=>p.values)];
    for(let bits=0;bits<2**model.controls.length;bits++){
      cases.push(Object.fromEntries(model.controls.map((c,i)=>[c.key,(bits>>i)&1?c.max:c.min])));
    }
    for(const raw of cases){
      const frame=renderExperiment(model.id,raw);
      assert.match(frame.svg,/<(?:path|rect|circle|polygon|line|ellipse)\b/,"every frame needs a drawable mathematical figure");
      assert.ok(!/NaN|Infinity|undefined/.test(frame.svg),model.id+" produced an invalid SVG coordinate");
      assert.ok(frame.stats.length>=3);
      assert.ok(frame.observations.length>=2);
      const ids=[...frame.svg.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
      assert.equal(new Set(ids).size,ids.length,"SVG definition IDs must be unique");
    }
    const invalid=Object.fromEntries(model.controls.map(c=>[c.key,"not-a-number"]));
    assert.deepEqual(stateFor(model,invalid),stateFor(model,{}));
  });
}

test("linear, quadratic, absolute value, and reciprocal degeneracies are explicit",()=>{
  assert.equal(values("quadratic",{a:0}).vertex,null);
  close(values("linear",{m:2,b:1}).slope,2);
  close(values("linear",{m:-1,b:0}).inclination,135);
  close(values("linear",{m:0,b:1}).inclination,0);
  const v=values("absolute-value",{a:2});
  close(v.leftSlope,-2);close(v.rightSlope,2);assert.equal(v.differentiable,false);
  assert.equal(values("absolute-value",{a:0}).differentiable,true);
  assert.equal(values("reciprocal",{a:0}).verticalAsymptote,null);
});
test("exponential and logarithm agree with known values and reject base one",()=>{
  close(values("exponential",{b:2,A:1,t:2}).value,4);
  close(values("logarithm",{b:2,t:4}).value,2);
  assert.equal(values("logarithm",{b:1}).valid,false);
  assert.equal(values("logarithm",{b:1}).value,null);
});
test("the unit circle handles quadrants and undefined tangent",()=>{
  const a=values("unit-circle",{theta:90});
  close(a.sine,1);close(a.cosine,0);assert.equal(a.tangent,null);
  const b=values("unit-circle",{theta:225});
  close(b.sine,-Math.SQRT1_2);close(b.cosine,-Math.SQRT1_2);
  close(b.sine*b.sine+b.cosine*b.cosine,1);
});
test("sinusoid period and its constant special case are correct",()=>{
  close(values("sine-wave",{omega:2,A:1}).period,Math.PI);
  assert.equal(values("sine-wave",{A:0}).period,null);
});
test("Pythagoras, cosine rule, and triangle area agree for a 3-4-5 triangle",()=>{
  close(values("pythagoras",{a:3,b:4}).c,5);
  const t=values("triangle",{b:3,c:4,theta:90});
  close(t.opposite,5);close(t.area,6);
});
test("ellipse focal distance sum is constant, including a circle and a vertical ellipse",()=>{
  for(const p of [{a:3,b:2,theta:40},{a:1.5,b:3,theta:170},{a:2,b:2,theta:90}]){
    const e=values("ellipse",p);close(e.sum,2*Math.max(p.a,p.b));
  }
});
test("perpendicular vectors and multiplication by i have their geometric meanings",()=>{
  const v=values("vectors",{u:2,v:2,theta:90});
  close(v.dot,0);close(v.sumX,2);close(v.sumY,2);
  const z=values("complex",{r:1,theta:0,s:1,phi:90});
  close(z.real,0);close(z.imaginary,1);close(z.modulus,1);
});
test("a single function value changes continuity but does not change the limit",()=>{
  assert.equal(values("function-limit",{c:-1}).limit,2);
  assert.equal(values("function-limit",{c:-1}).continuous,false);
  assert.equal(values("function-limit",{c:2}).continuous,true);
});
test("epsilon-delta decisions use the whole neighborhood, including the equality boundary",()=>{
  assert.equal(values("epsilon-delta",{epsilon:.6,delta:.2}).valid,true);
  assert.equal(values("epsilon-delta",{epsilon:.6,delta:.6}).valid,false);
  close(values("epsilon-delta",{epsilon:.6,delta:.2}).bound,.44);
  // δ = 0.2 yields the exact supremum 0.44; excluded boundary points allow equality.
  const model=experiments.find(m=>m.id==="epsilon-delta");
  assert.equal(model.render({epsilon:.44,delta:.2}).values.valid,true);
});
test("secant slope approaches the derivative from both sides without dividing by zero",()=>{
  for(const h of [-.5,0,.5]){
    const v=values("secant-tangent",{t:1,h});
    close(v.secantSlope,2+h);close(v.derivative,2);close(v.slopeError,Math.abs(h));
  }
  close(values("derivative-sign",{k:2,t:0}).derivative,2);
});
test("local linearization of exp and a Newton iteration have known reference values",()=>{
  const e=values("linear-approximation",{t:0,radius:1,s:1});
  close(e.actual,Math.E);close(e.approximation,2);
  close(values("newton",{x0:2,steps:1}).estimate,1.5);
  assert.ok(values("newton",{x0:2.5,steps:5}).error<1e-10);
});
test("Riemann sums have correct endpoint cases and second-order midpoint convergence",()=>{
  close(values("riemann",{n:1,theta:0}).approximation,2);
  close(values("riemann",{n:1,theta:1}).approximation,10);
  const a=values("riemann",{n:4,theta:.5}),b=values("riemann",{n:40,theta:.5});
  close(a.exact,14/3);close(a.error/b.error,100,1e-8);
});
test("signed integral and ordinary area differ when positive and negative regions cancel",()=>{
  const a=values("signed-area",{a:-2,b:2});
  close(a.integral,0);close(a.geometricArea,4);
});
test("the fundamental theorem matches exact accumulation over half and a full period",()=>{
  const a=values("fundamental-theorem",{theta:180});
  close(a.accumulation,2);close(a.derivative,0);
  close(values("fundamental-theorem",{theta:360}).accumulation,0);
});
test("trapezoid and Simpson quadrature match independent reference values on x^4",()=>{
  const a=values("quadrature",{pairs:1});
  close(a.trapezoid,9);close(a.simpson,20/3);close(a.exact,32/5);
  assert.ok(values("quadrature",{pairs:10}).simpsonError<a.simpsonError);
});
test("area between curves and exact parabola arc length have correct references",()=>{
  const a=values("between-curves",{c:1,t:1});
  close(a.exact,4/3);close(a.current,4/3);
  close(values("between-curves",{c:1,t:.5}).current,2/3);
  const l=values("arc-length",{b:2,n:1});
  close(l.approximation,Math.sqrt(8));
  close(l.exact,(2*Math.sqrt(5)+Math.asinh(2))/2);
  assert.ok(values("arc-length",{b:2,n:40}).error<values("arc-length",{b:2,n:4}).error);
});
test("geometric partial sums distinguish convergence, oscillation, and divergence",()=>{
  const a=values("geometric-series",{r:.5,n:3});
  close(a.sum,1.75);close(a.limit,2);
  assert.equal(values("geometric-series",{r:-1,n:20}).converges,false);
  const b=values("geometric-series",{r:1,n:10});
  close(b.sum,10);assert.equal(b.limit,null);
});
test("Taylor approximation uses the actual truncated polynomial and a valid error bound",()=>{
  close(values("taylor",{m:1,R:1,s:1}).approximation,1);
  const a=renderExperiment("taylor",{m:4,R:1,s:1});
  assert.equal(a.values.degree,7);
  assert.ok(a.values.error<3e-6);
  assert.ok(a.values.error<=a.values.bound);
  assert.ok(a.formula.includes("x⁷/7!"));
  assert.ok(!a.formula.includes("x⁹"));
});
test("Fourier first harmonic and midpoint values at jumps are correct",()=>{
  close(values("fourier",{n:1,theta:90}).approximation,4/Math.PI);
  const a=values("fourier",{n:20,theta:0});
  close(a.approximation,0);close(a.target,0);
});
test("Euler endpoint and logistic equilibrium are correct, with step refinement improving this example",()=>{
  close(values("euler",{T:1,n:10}).approximation,1.1**10);
  assert.ok(values("euler",{T:2,n:40}).error<values("euler",{T:2,n:4}).error);
  const a=values("logistic",{r:1,K:2,y0:2,t:5});
  close(a.value,2);close(a.slope,0);
  assert.ok(values("logistic",{r:1,K:2,y0:3.5,t:3}).value>2);
  assert.ok(values("logistic",{r:1,K:2,y0:.5,t:3}).value<2);
});
test("shared links clamp out-of-range values and reject unknown experiments",()=>{
  const model=experiments.find(m=>m.id==="unit-circle");
  assert.equal(stateFor(model,{theta:999}).theta,360);
  assert.equal(stateFor(model,{theta:-999}).theta,0);
  assert.equal(stateFor(model,{theta:"Infinity"}).theta,40);
  assert.throws(()=>renderExperiment("unknown"),/Unknown/);
});
