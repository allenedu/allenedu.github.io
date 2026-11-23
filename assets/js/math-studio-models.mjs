import functions from "./math-studio-functions.mjs";
import geometry from "./math-studio-geometry.mjs";
import derivatives from "./math-studio-derivatives.mjs";
import integrals from "./math-studio-integrals.mjs";
import advanced from "./math-studio-advanced.mjs";
import {stateFor} from "./math-studio-core.mjs";
export const experiments=[...functions,...geometry,...derivatives,...integrals,...advanced];
export const categories=[...new Set(experiments.map(item=>item.category))];
export const metadata=experiments.map(({id,title,category,level,symbol,summary,keywords})=>({id,title,category,level,symbol,summary,keywords}));
export function getExperiment(id){return experiments.find(item=>item.id===id);}
export function renderExperiment(id,raw={}){
  const model=getExperiment(id);
  if(!model)throw new Error("Unknown mathematics experiment: "+id);
  const state=stateFor(model,raw);
  return {model,state,...model.render(state)};
}
