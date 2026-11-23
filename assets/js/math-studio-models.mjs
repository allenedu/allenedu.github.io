import functions from "./math-studio-functions.mjs?v=latex1";
import geometry from "./math-studio-geometry.mjs?v=latex1";
import derivatives from "./math-studio-derivatives.mjs?v=latex1";
import integrals from "./math-studio-integrals.mjs?v=latex1";
import advanced from "./math-studio-advanced.mjs?v=latex1";
import {stateFor} from "./math-studio-core.mjs?v=latex1";
import {formulaTex,symbols} from "./math-studio-tex.mjs?v=latex1";
export const experiments=[...functions,...geometry,...derivatives,...integrals,...advanced];
export const categories=[...new Set(experiments.map(item=>item.category))];
export const metadata=experiments.map(({id,title,category,level,symbol,summary,keywords})=>({id,title,category,level,symbol,symbolTex:symbols[id],summary,keywords}));
export function getExperiment(id){return experiments.find(item=>item.id===id);}
export function renderExperiment(id,raw={}){
  const model=getExperiment(id);
  if(!model)throw new Error("Unknown mathematics experiment: "+id);
  const state=stateFor(model,raw);
  return {model,state,...model.render(state),formulaTex:formulaTex(id,state)};
}
