import test from "node:test";
import assert from "node:assert/strict";
import {renderExperiment} from "../assets/js/math-studio-models.mjs";
import {intersectLines,solveQuadratic,angleAt,circleOverlap} from "../assets/js/math-studio-numerics.mjs";
const v=(id,p={})=>renderExperiment(id,p).values;
const close=(a,b,tol=1e-10)=>assert.ok(Math.abs(a-b)<=tol*Math.max(1,Math.abs(b)),`${a} != ${b}`);

test("a linear system distinguishes intersection, parallel lines, and coincidence",()=>{
  assert.deepEqual(intersectLines(1,0,-1,2),{type:"unique",point:[1,1]});
  assert.equal(v("linear-system",{m1:1,b1:0,m2:1,b2:2}).type,"parallel");
  assert.equal(v("linear-system",{m1:1,b1:0,m2:1,b2:0}).type,"coincident");
  const a=v("linear-system",{m1:1,b1:-4,m2:.75,b2:4});
  close(a.point[0],32);close(a.point[1],28);
  close(a.point[1],.75*a.point[0]+4);
});
test("quadratic classification includes double roots and all degree-degenerate cases",()=>{
  assert.deepEqual(solveQuadratic(1,-5,6).roots,[2,3]);
  assert.deepEqual(solveQuadratic(1,-2,1).roots,[1]);
  assert.equal(solveQuadratic(1,0,1).type,"none");
  assert.deepEqual(solveQuadratic(0,2,-1).roots,[.5]);
  assert.equal(solveQuadratic(0,0,0).type,"all");
  assert.equal(solveQuadratic(0,0,2).type,"empty");
});
test("quadratic roots satisfy the equation and Vieta identities without cancellation",()=>{
  for(const a of [-2,-.25,.25,2])for(const b of [-5,0,5])for(const c of [-5,0,5]){
    const s=solveQuadratic(a,b,c);
    for(const x of s.roots)close(a*x*x+b*x+c,0,1e-8);
    if(s.type==="two"){close(s.roots[0]+s.roots[1],-b/a);close(s.roots[0]*s.roots[1],c/a);}
  }
  const s=solveQuadratic(1,1e8,1);close(s.roots[0]*s.roots[1],1);close(s.roots[1],-1e-8,1e-16);
});
test("absolute-value inequalities include both endpoints and the zero-radius singleton",()=>{
  assert.equal(v("absolute-inequality",{c:0,r:2,t:2}).satisfies,true);
  assert.equal(v("absolute-inequality",{c:0,r:2,t:2.25}).satisfies,false);
  const a=v("absolute-inequality",{c:1,r:0,t:1});assert.equal(a.left,1);assert.equal(a.right,1);assert.equal(a.satisfies,true);
  assert.equal(v("absolute-inequality",{c:1,r:0,t:1.25}).satisfies,false);
  assert.equal(v("absolute-inequality",{c:3,r:4,t:7}).satisfies,true);
  assert.equal(v("absolute-inequality",{c:3,r:4,t:7.25}).satisfies,false);
});
test("triangle angle measurements have correct references and always sum to a straight angle",()=>{
  close(angleAt([-1,0],[0,Math.sqrt(3)],[1,0])*180/Math.PI,60);
  const right=v("triangle-angles",{x:0,h:2});close(right.angles[0],45);close(right.angles[1],45);close(right.angles[2],90);
  for(const x of [-3,0,3])for(const h of [.75,2,4])close(v("triangle-angles",{x,h}).sum,180);
  assert.ok(v("triangle-angles",{x:0,h:.75}).angles[2]>90);
});
test("inscribed angles remain half the central angle throughout the allowed major arc",()=>{
  for(const theta of [20,80,160])for(const phi of [100,180,260]){
    const a=v("inscribed-angle",{theta,phi});close(a.central,theta);close(a.inscribed,theta/2);
    for(const point of [a.A,a.B,a.C])close(Math.hypot(...point),1);
  }
});
test("circle tangents appear only on or outside the circle and are perpendicular to radii",()=>{
  const inside=v("circle-tangent",{d:.5});assert.equal(inside.tangentCount,0);assert.equal(inside.length,null);
  const on=v("circle-tangent",{d:1});assert.equal(on.tangentCount,1);close(on.length,0);
  for(const d of [1.05,2,4]){
    const a=v("circle-tangent",{d});assert.equal(a.tangentCount,2);close(a.length,Math.sqrt(d*d-1));
    for(const [x,y] of a.tangentPoints){close(x*x+y*y,1);close(x*(d-x)-y*y,0);close(Math.hypot(d-x,y),a.length);}
  }
});
test("the centroid is interior and divides each displayed median in the ratio two to one",()=>{
  const a=v("triangle-centroid",{x:0,h:3});assert.deepEqual(a.G,[0,1]);close(a.longSegment,2);close(a.shortSegment,1);
  for(const x of [-3,0,3])for(const h of [.75,4]){const b=v("triangle-centroid",{x,h});close(b.ratio,2);assert.ok(b.G[1]>0&&b.G[1]<h);}
});
test("rotation has the known quarter-turn coordinates and preserves lengths and area",()=>{
  const a=v("rotation",{theta:90});close(a.rotated[0][0],0);close(a.rotated[0][1],1);close(a.rotated[2][0],-2);close(a.rotated[2][1],2);
  for(const theta of [0,45,90,180,360]){const b=v("rotation",{theta});close(b.area,2);close(b.side,2);close(b.radiusBefore,b.radiusAfter);}
});
test("arithmetic sequences have the expected sums with positive, zero, and negative differences",()=>{
  close(v("arithmetic-sequence",{a1:1,d:2,N:8}).sum,64);
  const descending=v("arithmetic-sequence",{a1:5,d:-1,N:8});close(descending.sum,12);close(descending.last,-2);
  close(v("arithmetic-sequence",{a1:3,d:0,N:8}).sum,24);
  close(v("arithmetic-sequence",{a1:5,d:-2,N:1}).sum,5);
  close(descending.terms.reduce((s,x)=>s+x,0),descending.sum);
});
test("Bayes area tables normalize and distinguish reverse conditional probabilities",()=>{
  const a=v("conditional-probability",{a:.4,ba:.75,bn:.25});close(a.AB,.3);close(a.pB,.45);close(a.posterior,2/3);close(a.total,1);
  close(v("conditional-probability",{a:.4,ba:.5,bn:.5}).posterior,.4);
  assert.equal(v("conditional-probability",{a:.4,ba:0,bn:0}).posterior,null);
  close(v("conditional-probability",{a:0,ba:1,bn:.5}).posterior,0);
  close(v("conditional-probability",{a:1,ba:.5,bn:0}).posterior,1);
});
test("Venn regions obey inclusion-exclusion for coincident, overlapping, and disjoint circles",()=>{
  close(circleOverlap(0),Math.PI);close(circleOverlap(1),2*Math.PI/3-Math.sqrt(3)/2);close(circleOverlap(2),0);close(circleOverlap(3),0);
  let previous=0;
  for(const d of [0,.5,1,1.5,2,3]){const a=v("venn-sets",{d});close(a.union+a.overlap,2*Math.PI);assert.ok(a.union>=previous);previous=a.union;}
});
test("an outlier pulls the mean while the median stays at the middle rank",()=>{
  const a=v("mean-median",{x:8});close(a.mean,5);close(a.median,5);close(a.standardDeviation,2);close(a.range,6);
  const b=v("mean-median",{x:30});close(b.mean,57/7);close(b.median,5);close(b.range,28);assert.ok(b.standardDeviation>a.standardDeviation);
  close(v("mean-median",{x:0}).median,4);
});
test("existing phase, projection, ellipse, and Euler refinements agree with their reference values",()=>{
  const sine=v("sine-wave",{omega:2,phi:90});close(sine.horizontalShift,-Math.PI/4);
  const vector=v("vectors",{u:2,v:3,theta:120});close(vector.projection,-1.5);close(vector.dot,2*vector.projection);
  const ellipse=v("ellipse",{a:1.5,b:3,theta:170});close(ellipse.sum,ellipse.majorAxis);
  const e=v("euler",{T:2,n:8});close(e.refined,(1+2/16)**16);assert.ok(e.refinedError<e.error);
});
