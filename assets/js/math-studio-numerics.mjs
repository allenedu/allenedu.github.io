import {integrate} from "./math-studio-core.mjs?v=school3";
export const numberTex=value=>String(Number(Number(value).toFixed(8)));
export function choose(n,k){
  if(k<0||k>n||!Number.isInteger(k))return 0;
  k=Math.min(k,n-k);let value=1;
  for(let j=1;j<=k;j++)value=value*(n-k+j)/j;
  return Math.round(value);
}
export function sinc(x){return Math.abs(x)<1e-6?1-x*x/6+x**4/120:Math.sin(x)/x;}
export function powerIntegral(p,b){return Math.abs(p-1)<1e-10?Math.log(b):Math.expm1((1-p)*Math.log(b))/(1-p);}
export function normalCentralProbability(z){return integrate(x=>Math.exp(-x*x/2)/Math.sqrt(2*Math.PI),-z,z,800);}
export function sampleSquare(seed,count){
  let state=seed>>>0;const points=[];
  const random=()=>{state=(Math.imul(1664525,state)+1013904223)>>>0;return state/4294967296;};
  for(let i=0;i<count;i++){const x=random(),y=random();points.push({x,y,inside:x*x+y*y<=1});}
  return points;
}
export function intersectLines(m1,b1,m2,b2){
  if(Math.abs(m1-m2)<1e-10)return {type:Math.abs(b1-b2)<1e-10?"coincident":"parallel",point:null};
  const x=(b2-b1)/(m1-m2);return {type:"unique",point:[x,m1*x+b1]};
}
export function solveQuadratic(a,b,c){
  if(Math.abs(a)<1e-10){
    if(Math.abs(b)<1e-10)return {type:Math.abs(c)<1e-10?"all":"empty",discriminant:null,roots:[]};
    return {type:"linear",discriminant:null,roots:[-c/b]};
  }
  const discriminant=b*b-4*a*c;
  if(discriminant< -1e-10)return {type:"none",discriminant,roots:[]};
  if(Math.abs(discriminant)<1e-10)return {type:"double",discriminant:0,roots:[-b/(2*a)]};
  const q=-(b+(b<0?-1:1)*Math.sqrt(discriminant))/2;
  return {type:"two",discriminant,roots:[q/a,c/q].sort((x,y)=>x-y)};
}
export function angleAt(a,o,b){
  const u=[a[0]-o[0],a[1]-o[1]],v=[b[0]-o[0],b[1]-o[1]];
  return Math.atan2(Math.abs(u[0]*v[1]-u[1]*v[0]),u[0]*v[0]+u[1]*v[1]);
}
export function circleOverlap(distance,radius=1){
  if(distance>=2*radius)return 0;
  if(distance<=0)return Math.PI*radius*radius;
  return 2*radius*radius*Math.acos(distance/(2*radius))-distance*Math.sqrt(4*radius*radius-distance*distance)/2;
}
export function probabilityTable(pA,pBgivenA,pBgivenNotA){
  const AB=pA*pBgivenA,notAB=(1-pA)*pBgivenNotA,pB=AB+notAB;
  return {AB,AnotB:pA-AB,notAB,neither:1-pA-notAB,pB,posterior:pB>1e-14?AB/pB:null};
}
export function describeData(values){
  const sorted=[...values].sort((a,b)=>a-b),count=values.length,mean=values.reduce((a,b)=>a+b,0)/count;
  const median=count%2?sorted[(count-1)/2]:(sorted[count/2-1]+sorted[count/2])/2;
  const variance=values.reduce((sum,x)=>sum+(x-mean)**2,0)/count;
  return {sorted,count,mean,median,variance,standardDeviation:Math.sqrt(variance),range:sorted.at(-1)-sorted[0]};
}
