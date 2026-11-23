import test from "node:test";
import assert from "node:assert/strict";
import {renderExperiment,experiments,animationControl} from "../assets/js/math-studio-models.mjs";
import {choose,sampleSquare} from "../assets/js/math-studio-numerics.mjs";
const v=(id,p={})=>renderExperiment(id,p).values;
const close=(a,b,tol=1e-10)=>assert.ok(Math.abs(a-b)<=tol*Math.max(1,Math.abs(b)),`${a} != ${b}`);

test("proper, improper, zero, and equivalent fractions represent the same whole",()=>{
  close(v("fractions",{m:3,n:5}).value,.6);
  close(v("fractions",{m:6,n:10}).value,.6);
  const a=v("fractions",{m:8,n:5});close(a.value,1.6);assert.equal(a.whole,1);assert.equal(a.remainder,3);
  assert.equal(v("fractions",{m:0,n:1}).value,0);
});
test("percentages depend on the base while square areas include both cross terms",()=>{
  close(v("percentages",{p:35,total:200}).part,70);
  close(v("percentages",{p:35,total:400}).part,140);
  const a=v("completing-square",{a:3,b:1});close(a.total,16);close(a.a2+a.cross+a.b2,a.total);
});
test("inscribed polygon and rearranged sector approximations approach circle area from below",()=>{
  const hex=v("polygon-circle",{n:6,r:1});close(hex.perimeter,6);close(hex.area,3*Math.sqrt(3)/2);
  const more=v("polygon-circle",{n:64,r:1});assert.ok(more.area>hex.area&&more.area<Math.PI);
  const coarse=v("circle-area",{pairs:3,r:2}),fine=v("circle-area",{pairs:40,r:2});
  close(coarse.exact,4*Math.PI);assert.ok(fine.error>0&&fine.error<coarse.error);
});
test("similarity scales lengths linearly and areas quadratically",()=>{
  const a=v("similar-triangles",{a:3,h:2,k:2});close(a.area,3);close(a.scaledArea,12);close(a.areaRatio,4);
});
test("Pascal rows obey combinatorial identities, including the zero row",()=>{
  assert.equal(choose(8,4),70);assert.equal(choose(7,3)+choose(7,4),70);
  assert.deepEqual(v("pascal",{n:0,k:0}).row,[1]);
  const a=v("pascal",{n:8,k:4});assert.equal(a.rowSum,256);assert.equal(a.row.reduce((s,x)=>s+x,0),256);
  assert.equal(v("pascal",{n:3,k:5}).coefficient,0);
});
test("the sinc limit preserves the hole and approaches one from both sides",()=>{
  const zero=v("sinc-limit",{s:0});assert.equal(zero.value,null);close(zero.continuousExtension,1);
  const a=v("sinc-limit",{R:.1,s:.5}),b=v("sinc-limit",{R:.1,s:-.5});close(a.value,b.value);
  assert.ok(a.error>0&&a.error<.001);
});
test("the chain-rule product agrees with an independent symmetric difference",()=>{
  const a=v("chain-rule",{a:1.5,t:.7}),h=1e-6,f=x=>Math.sin(1.5*x*x);
  close(a.derivative,(f(.7+h)-f(.7-h))/(2*h),1e-8);close(a.derivative,a.innerSlope*a.outerSlope);
});
test("the finite product increment includes the corner and the difference quotient converges",()=>{
  const a=v("product-rule",{x:1.5,h:.5}),b=v("product-rule",{x:1.5,h:.01});
  close(a.increment,a.v*a.du+a.u*a.dv+a.du*a.dv);close(a.quotient,a.increment/.5);
  close(a.derivative,6.75);assert.ok(b.error<a.error);
});
test("the mean-value location is interior and has exactly the secant slope",()=>{
  for(const p of [{a:0,b:3},{a:1,b:1.5},{a:.4,b:2.7}]){
    const a=v("mean-value",p);assert.ok(a.c>p.a&&a.c<p.b);close(a.tangentSlope,(p.b**3-p.a**3)/(p.b-p.a));
  }
});
test("a fixed-perimeter rectangle reaches its unique maximum at a square",()=>{
  const square=v("rectangle-optimization",{P:16,s:.5}),thin=v("rectangle-optimization",{P:16,s:.1});
  close(square.perimeter,16);close(square.area,16);close(square.derivative,0);assert.ok(thin.area<square.area);
});
test("midpoint disks have the independent cone volume and second-order error",()=>{
  const a=v("disk-volume",{b:2,n:4}),b=v("disk-volume",{b:2,n:8});
  close(a.exact,8*Math.PI/3);close(a.error,Math.PI*8/(12*16));close(a.error/b.error,4);
});
test("p-integrals distinguish convergence from decay and handle the logarithmic case",()=>{
  const a=v("improper-integral",{p:2,B:10});close(a.value,.9);close(a.limit,1);close(a.tail,.1);
  const b=v("improper-integral",{p:1,B:10});close(b.value,Math.log(10));assert.equal(b.converges,false);
  const c=v("improper-integral",{p:.5,B:9});close(c.value,4);assert.equal(c.limit,null);
});
test("function average equals integral divided by interval length, not endpoint average",()=>{
  const a=v("integral-average",{b:3});close(a.average,3);close(a.integral,9);close(a.c,Math.sqrt(3));
  close(a.rectangleArea,a.integral);assert.notEqual(a.average,a.endpointAverage);
});
test("polar coordinates retain signed radii and parametric velocity matches derivatives",()=>{
  const a=v("polar-rose",{A:2,k:3,theta:60});close(a.radius,-2);close(a.x,-1);close(a.y,-Math.sqrt(3));assert.equal(a.petals,3);
  assert.equal(v("polar-rose",{k:4}).petals,8);
  const b=v("parametric",{p:1,q:1,phi:0,theta:0});close(b.x,2);close(b.y,0);close(b.vx,0);close(b.vy,1.5);close(b.period,2*Math.PI);
});
test("binomial probabilities normalize and handle deterministic and impossible outcomes",()=>{
  const a=v("binomial",{n:10,p:.5,k:5});close(a.probability,252/1024);close(a.mean,5);close(a.variance,2.5);close(a.total,1);
  close(v("binomial",{n:10,p:1,k:10}).probability,1);close(v("binomial",{n:10,p:0,k:0}).probability,1);
  close(v("binomial",{n:3,p:.5,k:5}).probability,0);
});
test("normal interval probabilities match references and are invariant under location and scale",()=>{
  const a=v("normal",{mu:0,sigma:1,z:1}),b=v("normal",{mu:2,sigma:2,z:1});
  close(a.probability,.682689492137,1e-9);close(b.probability,a.probability);
  close(v("normal",{z:2}).probability,.954499736104,1e-9);close(v("normal",{z:0}).probability,0);
});
test("Monte Carlo seeds are repeatable and extending a sample preserves its prefix",()=>{
  const a=sampleSquare(7,100),b=sampleSquare(7,200);assert.deepEqual(a,b.slice(0,100));
  assert.notDeepEqual(a,sampleSquare(8,100));
  const frame=v("monte-carlo",{N:100,seed:7});assert.equal(frame.inside,a.filter(p=>p.x*p.x+p.y*p.y<=1).length);
  close(frame.estimate,4*frame.inside/100);assert.ok(frame.estimate>=0&&frame.estimate<=4);
});
test("every experiment has an intentional playable parameter and discoverable presets",()=>{
  for(const model of experiments){assert.ok(model.controls.includes(animationControl(model)));assert.ok(model.presets.length>=2,model.id);}
});
