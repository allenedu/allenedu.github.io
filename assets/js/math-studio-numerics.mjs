import {integrate} from "./math-studio-core.mjs?v=studio2";
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
