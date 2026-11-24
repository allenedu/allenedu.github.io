import {experiments,categories,getExperiment,renderExperiment,animationControl} from "./math-studio-models.mjs?v=school3";
import {escape,fmt,stateFor} from "./math-studio-core.mjs?v=school3";
import {mixedHTML} from "./math-notation.mjs?v=school3";
import {setMath,setMixedMath,renderMath} from "./math-renderer.mjs?v=school3";

const studio=document.querySelector("[data-math-studio]");
if(studio){
  const $=selector=>studio.querySelector(selector);
  const title=$("[data-studio-title]"),summary=$("[data-studio-summary]"),category=$("[data-studio-category]");
  const controls=$("[data-studio-controls]"),presets=$("[data-studio-presets]"),svg=$("[data-studio-svg]");
  const formula=$("[data-studio-formula]"),metrics=$("[data-studio-metrics]"),notes=$("[data-studio-notes]"),question=$("[data-studio-question]");
  const legend=$("[data-studio-legend]"),status=$("[data-studio-status]"),shareField=$("[data-studio-share-field]");
  const numeric=$("[data-studio-numeric]"),playButton=$("[data-studio-play]"),playInfo=$("[data-studio-play-info]"),focusButton=$("[data-studio-focus]");
  const enlargeButton=$("[data-studio-enlarge]"),plotScroll=$("[data-studio-plot-scroll]");
  const cards=Array.from(document.querySelectorAll("[data-experiment-id]"));
  const cache=new Map();
  let current=null,state={},categoryFilter="全部",searchTerm="",levelFilter="全部",animationId=0,focusScroll=0;

  function stopPlayback(){
    cancelAnimationFrame(animationId);animationId=0;
    playButton.textContent="播放演示";playButton.setAttribute("aria-pressed","false");
    if(current)setMixedMath(playInfo,"演示参数："+animationControl(current).label);
  }
  function startPlayback(){
    const control=animationControl(current),span=control.max-control.min,start=(state[control.key]-control.min)/span;
    let startTime,lastTime=-100;
    playButton.textContent="暂停演示";playButton.setAttribute("aria-pressed","true");
    setMixedMath(playInfo,"正在演示："+control.label);
    function tick(time){
      startTime??=time;
      if(time-lastTime>=90){
        const phase=(start+(time-startTime)/8000)%2,fraction=phase<=1?phase:2-phase;
        const value=Math.min(control.max,Math.max(control.min,Number((control.min+Math.round(fraction*span/control.step)*control.step).toFixed(8))));
        if(value!==state[control.key]){state[control.key]=value;updateScene();writeHash();}
        lastTime=time;
      }
      animationId=requestAnimationFrame(tick);
    }
    animationId=requestAnimationFrame(tick);
  }
  playButton.addEventListener("click",()=>animationId?stopPlayback():startPlayback());
  enlargeButton.addEventListener("click",()=>{
    const enlarged=plotScroll.classList.toggle("is-enlarged");
    enlargeButton.textContent=enlarged?"适应宽度":"放大图像";enlargeButton.setAttribute("aria-pressed",String(enlarged));
    plotScroll.tabIndex=enlarged?0:-1;$("[data-studio-zoom-hint]").hidden=!enlarged;
  });
  document.addEventListener("visibilitychange",()=>{if(document.hidden)stopPlayback();});
  function exitFocus(){
    document.body.classList.remove("ms-focus-mode");focusButton.textContent="专注展示";focusButton.setAttribute("aria-pressed","false");window.scrollTo({top:focusScroll});
  }
  focusButton.addEventListener("click",()=>{
    if(document.body.classList.contains("ms-focus-mode")){exitFocus();return;}
    focusScroll=window.scrollY;document.body.classList.add("ms-focus-mode");
    focusButton.textContent="退出专注";focusButton.setAttribute("aria-pressed","true");studio.scrollIntoView({block:"start"});
  });
  document.addEventListener("keydown",event=>{if(event.key==="Escape"){stopPlayback();if(document.body.classList.contains("ms-focus-mode"))exitFocus();}});

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
      const numberInput=numeric.querySelector('[data-ms-number="'+c.key+'"]');
      numberInput.value=String(state[c.key]);
    }
    for(const button of presets.querySelectorAll("[data-ms-preset]")){
      const values=stateFor(current,current.presets[Number(button.dataset.msPreset)].values);
      button.setAttribute("aria-pressed",String(current.controls.every(c=>Math.abs(values[c.key]-state[c.key])<1e-9)));
    }
    renderMath(studio);
    shareField.hidden=true;status.textContent="";
  }
  function setState(values){
    stopPlayback();state=stateFor(current,values);updateScene();writeHash();
  }
  $("[data-studio-apply]").addEventListener("click",()=>{
    const values={...state};
    for(const input of numeric.querySelectorAll("[data-ms-number]")){
      if(input.value!==""&&Number.isFinite(Number(input.value)))values[input.dataset.msNumber]=Number(input.value);
    }
    setState(values);
  });
  function selectExperiment(id,{raw,historyMode="push",focus=false,scroll=false}={}){
    stopPlayback();
    current=getExperiment(id)||getExperiment("unit-circle");
    state=stateFor(current,raw||cache.get(current.id)||{});
    setMixedMath(title,current.title);
    setMixedMath(summary,current.summary);
    category.textContent=current.category+" / "+current.level;
    setMixedMath(question,current.question);
    controls.innerHTML=current.controls.map(c=>'<div class="ms-control"><label for="ms-input-'+escape(c.key)+'"><span>'+mixedHTML(c.label)+'</span><output for="ms-input-'+escape(c.key)+'" data-ms-output="'+escape(c.key)+'"></output></label><input type="range" id="ms-input-'+escape(c.key)+'" min="'+c.min+'" max="'+c.max+'" step="'+c.step+'" value="'+state[c.key]+'" data-ms-parameter="'+escape(c.key)+'"></div>').join("");
    controls.querySelectorAll("[data-ms-parameter]").forEach(input=>{
      input.addEventListener("input",()=>{stopPlayback();state[input.dataset.msParameter]=Number(input.value);updateScene();writeHash();});
    });
    numeric.innerHTML=current.controls.map(c=>'<div><label for="ms-number-'+escape(c.key)+'">'+mixedHTML(c.label)+'</label><input id="ms-number-'+escape(c.key)+'" type="number" min="'+c.min+'" max="'+c.max+'" step="'+c.step+'" value="'+state[c.key]+'" data-ms-number="'+escape(c.key)+'"></div>').join("");
    numeric.querySelectorAll("[data-ms-number]").forEach(input=>{
      const experimentId=current.id;
      input.addEventListener("focus",stopPlayback);
      const commitNumber=()=>{
        if(current.id!==experimentId)return;
        const value=Number(input.value),key=input.dataset.msNumber;
        if(input.value===""||!Number.isFinite(value)){input.value=String(state[key]);return;}
        const next=stateFor(current,{...state,[key]:value});
        if(next[key]!==state[key])setState(next);else input.value=String(state[key]);
      };
      input.addEventListener("change",commitNumber);
      input.addEventListener("blur",commitNumber);
      input.addEventListener("keydown",event=>{if(event.key==="Enter"){event.preventDefault();commitNumber();}});
    });
    setMixedMath(playInfo,"演示参数："+animationControl(current).label);
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
  document.querySelectorAll("[data-start-experiment]").forEach(button=>button.addEventListener("click",()=>selectExperiment(button.dataset.startExperiment,{focus:true,scroll:true})));
  $("[data-studio-reset]").addEventListener("click",()=>setState({}));
  $("[data-studio-previous]").addEventListener("click",()=>selectExperiment(experiments[(experiments.indexOf(current)-1+experiments.length)%experiments.length].id));
  $("[data-studio-next]").addEventListener("click",()=>selectExperiment(experiments[(experiments.indexOf(current)+1)%experiments.length].id));
  $("[data-studio-share]").addEventListener("click",async()=>{
    stopPlayback();
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
      const levelMatch=levelFilter==="全部"||card.dataset.level.includes(levelFilter);
      card.hidden=!(match&&levelMatch);if(match&&levelMatch)visible++;
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
  const levelSelect=document.querySelector("[data-studio-level]");
  levelSelect.addEventListener("change",()=>{levelFilter=levelSelect.value;filter();});
  document.querySelector("[data-studio-clear]").addEventListener("click",()=>{
    search.value="";searchTerm="";categoryFilter="全部";levelFilter="全部";levelSelect.value="全部";
    chips.forEach(chip=>chip.setAttribute("aria-pressed",String(chip.dataset.studioFilter==="全部")));filter();
  });
  window.addEventListener("hashchange",()=>{
    if(!getExperiment(location.hash.slice(1).split("?")[0]))return;
    const parsed=hashState();selectExperiment(parsed.id,{raw:parsed.raw,historyMode:"none"});
  });
  const initial=hashState();
  selectExperiment(initial.id,{raw:initial.raw,historyMode:"replace"});
  filter();
}
