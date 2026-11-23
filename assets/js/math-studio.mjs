import {experiments,categories,getExperiment,renderExperiment} from "./math-studio-models.mjs?v=latex1";
import {escape,fmt,stateFor} from "./math-studio-core.mjs?v=latex1";
import {mixedHTML} from "./math-notation.mjs?v=latex1";
import {setMath,setMixedMath,renderMath} from "./math-renderer.mjs?v=latex1";

const studio=document.querySelector("[data-math-studio]");
if(studio){
  const $=selector=>studio.querySelector(selector);
  const title=$("[data-studio-title]"),summary=$("[data-studio-summary]"),category=$("[data-studio-category]");
  const controls=$("[data-studio-controls]"),presets=$("[data-studio-presets]"),svg=$("[data-studio-svg]");
  const formula=$("[data-studio-formula]"),metrics=$("[data-studio-metrics]"),notes=$("[data-studio-notes]"),question=$("[data-studio-question]");
  const legend=$("[data-studio-legend]"),status=$("[data-studio-status]"),shareField=$("[data-studio-share-field]");
  const cards=Array.from(document.querySelectorAll("[data-experiment-id]"));
  const cache=new Map();
  let current=null,state={},categoryFilter="全部",searchTerm="";

  function hashState(){
    const [id,query=""]=location.hash.slice(1).split("?");
    return {id:getExperiment(id)?id:"unit-circle",raw:Object.fromEntries(new URLSearchParams(query))};
  }
  function writeHash(push=false){
    const params=new URLSearchParams();
    current.controls.forEach(c=>{if(Math.abs(state[c.key]-c.value)>1e-9)params.set(c.key,String(state[c.key]));});
    const hash="#"+current.id+(params.size?"?"+params.toString():"");
    if(location.hash!==hash)history[push?"pushState":"replaceState"](null,"",hash);
  }
  function updateScene(){
    const frame=renderExperiment(current.id,state);
    state=frame.state;cache.set(current.id,{...state});
    setMath(formula,frame.formulaTex,{display:true});
    svg.innerHTML='<title id="ms-chart-title">'+escape(current.title)+'</title><desc id="ms-chart-description">'+escape(current.summary+"。"+frame.observations.join(" "))+'</desc>'+frame.svg;
    metrics.innerHTML=frame.stats.map(s=>'<div><dt>'+mixedHTML(s.label)+'</dt><dd>'+mixedHTML(s.value,{numbers:true})+'</dd></div>').join("");
    notes.innerHTML=frame.observations.map(s=>"<li>"+mixedHTML(s)+"</li>").join("");
    legend.innerHTML=frame.legend.map(s=>'<span><i class="ms-key ms-key-'+escape(s.color)+'" aria-hidden="true"></i>'+mixedHTML(s.label)+"</span>").join("");
    for(const c of current.controls){
      const input=controls.querySelector('[data-ms-parameter="'+c.key+'"]');
      const output=controls.querySelector('[data-ms-output="'+c.key+'"]');
      input.value=String(state[c.key]);
      input.setAttribute("aria-valuetext",fmt(state[c.key])+(c.unit||""));
      output.innerHTML=mixedHTML(fmt(state[c.key])+(c.unit||""),{numbers:true});
    }
    renderMath(studio);
    shareField.hidden=true;status.textContent="";
  }
  function setState(values){
    state=stateFor(current,values);updateScene();writeHash();
  }
  function selectExperiment(id,{raw,historyMode="push",focus=false,scroll=false}={}){
    current=getExperiment(id)||getExperiment("unit-circle");
    state=stateFor(current,raw||cache.get(current.id)||{});
    setMixedMath(title,current.title);
    setMixedMath(summary,current.summary);
    category.textContent=current.category+" / "+current.level;
    setMixedMath(question,current.question);
    controls.innerHTML=current.controls.map(c=>'<div class="ms-control"><label for="ms-input-'+escape(c.key)+'"><span>'+mixedHTML(c.label)+'</span><output for="ms-input-'+escape(c.key)+'" data-ms-output="'+escape(c.key)+'"></output></label><input type="range" id="ms-input-'+escape(c.key)+'" min="'+c.min+'" max="'+c.max+'" step="'+c.step+'" value="'+state[c.key]+'" data-ms-parameter="'+escape(c.key)+'"></div>').join("");
    controls.querySelectorAll("[data-ms-parameter]").forEach(input=>{
      input.addEventListener("input",()=>{state[input.dataset.msParameter]=Number(input.value);updateScene();writeHash();});
    });
    presets.innerHTML=current.presets.map((p,i)=>'<button type="button" data-ms-preset="'+i+'">'+mixedHTML(p.label)+'</button>').join("");
    presets.querySelectorAll("[data-ms-preset]").forEach(button=>button.addEventListener("click",()=>setState(current.presets[Number(button.dataset.msPreset)].values)));
    for(const card of cards)card.setAttribute("aria-pressed",String(card.dataset.experimentId===current.id));
    updateScene();
    studio.dataset.ready="true";
    if(historyMode!=="none")writeHash(historyMode==="push");
    if(focus)title.focus({preventScroll:true});
    if(scroll)studio.scrollIntoView({behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"start"});
  }
  cards.forEach(card=>card.addEventListener("click",()=>selectExperiment(card.dataset.experimentId,{focus:true,scroll:true})));
  $("[data-studio-reset]").addEventListener("click",()=>setState({}));
  $("[data-studio-previous]").addEventListener("click",()=>selectExperiment(experiments[(experiments.indexOf(current)-1+experiments.length)%experiments.length].id));
  $("[data-studio-next]").addEventListener("click",()=>selectExperiment(experiments[(experiments.indexOf(current)+1)%experiments.length].id));
  $("[data-studio-share]").addEventListener("click",async()=>{
    writeHash();
    const link=location.href;
    try{
      if(!navigator.clipboard?.writeText)throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(link);
      status.textContent="实验链接已复制，包含当前参数。";
    }catch(error){
      shareField.hidden=false;shareField.value=link;shareField.focus();shareField.select();
      status.textContent="已显示当前实验链接，可选择并复制。";
    }
  });
  const search=document.querySelector("[data-studio-search]");
  const chips=Array.from(document.querySelectorAll("[data-studio-filter]"));
  function filter(){
    const terms=searchTerm.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
    let visible=0;
    for(const card of cards){
      const haystack=(card.dataset.searchText||card.textContent+" "+card.dataset.keywords).toLocaleLowerCase();
      const match=(categoryFilter==="全部"||card.dataset.category===categoryFilter)&&terms.every(term=>haystack.includes(term));
      card.hidden=!match;if(match)visible++;
    }
    document.querySelector("[data-studio-count]").textContent="显示 "+visible+" / "+experiments.length+" 个实验";
    document.querySelector("[data-studio-empty]").hidden=visible>0;
  }
  search.addEventListener("input",()=>{searchTerm=search.value;filter();});
  search.addEventListener("keydown",event=>{if(event.key==="Escape"){search.value="";searchTerm="";filter();}});
  chips.forEach(chip=>chip.addEventListener("click",()=>{
    categoryFilter=chip.dataset.studioFilter;
    chips.forEach(item=>item.setAttribute("aria-pressed",String(item===chip)));
    filter();
  }));
  window.addEventListener("hashchange",()=>{
    if(!getExperiment(location.hash.slice(1).split("?")[0]))return;
    const parsed=hashState();selectExperiment(parsed.id,{raw:parsed.raw,historyMode:"none"});
  });
  const initial=hashState();
  selectExperiment(initial.id,{raw:initial.raw,historyMode:"replace"});
  filter();
}
