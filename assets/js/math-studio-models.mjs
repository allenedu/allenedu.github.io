import functions from "./math-studio-functions.mjs?v=studio2";
import geometry from "./math-studio-geometry.mjs?v=studio2";
import derivatives from "./math-studio-derivatives.mjs?v=studio2";
import integrals from "./math-studio-integrals.mjs?v=studio2";
import advanced from "./math-studio-advanced.mjs?v=studio2";
import foundations from "./math-studio-foundations.mjs?v=studio2";
import calculus from "./math-studio-calculus.mjs?v=studio2";
import exploration from "./math-studio-exploration.mjs?v=studio2";
import {stateFor} from "./math-studio-core.mjs?v=studio2";
import {formulaTex,symbols} from "./math-studio-tex.mjs?v=studio2";
export const experiments=[...foundations,...functions,...geometry,...derivatives,...calculus.filter(m=>m.category==="极限与导数"),...integrals,...calculus.filter(m=>m.category==="积分与累积"),...advanced,...exploration];
export const categories=["数与图形","函数与代数","几何与三角","极限与导数","积分与累积","数列与级数","微分方程","概率与统计"];
export const metadata=experiments.map(({id,title,category,level,symbol,symbolTex,summary,keywords})=>({id,title,category,level,symbol:symbol||"",symbolTex:symbolTex||symbols[id],summary,keywords}));
const animationKeys={quadratic:"h",linear:"m","absolute-value":"h",exponential:"t",logarithm:"t",reciprocal:"a","unit-circle":"theta","sine-wave":"phi",pythagoras:"a",triangle:"theta",ellipse:"theta",vectors:"theta",complex:"phi","function-limit":"h","epsilon-delta":"delta","secant-tangent":"h","derivative-sign":"t","linear-approximation":"radius",newton:"steps",riemann:"n","signed-area":"b","fundamental-theorem":"theta",quadrature:"pairs","between-curves":"t","arc-length":"n","geometric-series":"n",taylor:"m",fourier:"n",euler:"n",logistic:"t"};
export const animationControl=model=>model.controls.find(c=>c.key===(model.animate||animationKeys[model.id]))||model.controls[0];
export function getExperiment(id){return experiments.find(item=>item.id===id);}
export function renderExperiment(id,raw={}){
  const model=getExperiment(id);
  if(!model)throw new Error("Unknown mathematics experiment: "+id);
  const state=stateFor(model,raw);
  return {model,state,...model.render(state),formulaTex:model.tex?model.tex(state):formulaTex(id,state)};
}
