import {mixedHTML,mixedToTex,plainToTex} from "./math-notation.mjs?v=latex1";

let available=false;
const cache=new Map();
function waitForMathJax(){
  return new Promise((resolve,reject)=>{
    function loaded(){
      const promise=window.MathJax?.startup?.promise;
      if(!promise){reject(new Error("Local mathematics renderer did not initialize."));return;}
      promise.then(()=>resolve(window.MathJax),reject);
    }
    if(window.MathJax?.startup?.promise)loaded();
    else{
      const script=document.querySelector("[data-mathjax-local]");
      if(!script){reject(new Error("Missing local mathematics renderer."));return;}
      script.addEventListener("load",loaded,{once:true});
      script.addEventListener("error",()=>reject(new Error("Could not load the local mathematics renderer.")),{once:true});
    }
  });
}
export const mathReady=waitForMathJax().then(jax=>{
  available=true;
  if(!document.getElementById("MJX-SVG-styles"))document.head.appendChild(jax.svgStylesheet());
  document.documentElement.classList.add("allen-math-ready");
  return jax;
});
function template(tex,display){
  const key=String(display)+":"+tex;
  if(!cache.has(key)){
    const container=window.MathJax.tex2svg(tex,{display,em:16,ex:8,containerWidth:1200});
    if(container.querySelector('[data-mml-node="merror"]'))throw new Error("Invalid TeX: "+tex);
    cache.set(key,container);
    if(cache.size>700)cache.delete(cache.keys().next().value);
  }
  return cache.get(key);
}
const collect=(root,selector)=>[...(root.matches?.(selector)?[root]:[]),...root.querySelectorAll(selector)];
function typesetElement(element){
  if(!available||element.dataset.mathRendered==="true")return;
  const tex=element.getAttribute("data-tex")||"";
  try{
    element.replaceChildren(template(tex,element.dataset.mathDisplay==="true").cloneNode(true));
    element.dataset.mathRendered="true";delete element.dataset.mathError;
  }catch(error){
    element.textContent=tex;element.dataset.mathError="true";console.error(error);
  }
}
export function setMath(element,tex,{display=false}={}){
  if(!element)return;
  const same=element.dataset.tex===tex&&element.dataset.mathDisplay===String(display);
  if(!same){
    element.setAttribute("data-tex",tex);element.dataset.mathDisplay=String(display);
    delete element.dataset.mathRendered;element.replaceChildren();
  }
  typesetElement(element);
}
export function setMixedMath(element,source,options={}){
  if(!element)return;
  element.innerHTML=mixedHTML(source,options);
  element.dataset.mathTextReady="true";
  for(const node of collect(element,"[data-tex]"))typesetElement(node);
}
export function typesetSvgLabels(root=document,{force=false}={}){
  if(!available)return;
  for(const node of collect(root,"text[data-tex-svg], g[data-tex-svg]")){
    if(node.dataset.mathRendered==="true"&&!force)continue;
    const tex=node.getAttribute("data-tex-svg");
    try{
      let group=node;
      if(node.tagName.toLowerCase()==="text"){
        group=document.createElementNS("http://www.w3.org/2000/svg","g");
        for(const attr of node.attributes)group.setAttribute(attr.name,attr.value);
        group.dataset.mathX=node.getAttribute("x")||"0";
        group.dataset.mathY=node.getAttribute("y")||"0";
        group.dataset.mathAnchor=node.getAttribute("text-anchor")||"start";
        node.replaceWith(group);
      }
      const output=template(tex,false).querySelector("svg").cloneNode(true);
      const view=output.getAttribute("viewBox").split(/\s+/).map(Number);
      const size=parseFloat(getComputedStyle(group).fontSize)||15;
      const scale=size/1000,width=view[2]*scale,height=view[3]*scale;
      const anchor=group.dataset.mathAnchor;
      const x=Number(group.dataset.mathX)-(anchor==="middle"?width/2:anchor==="end"?width:0);
      const y=Number(group.dataset.mathY)+view[1]*scale;
      output.setAttribute("x",String(x));output.setAttribute("y",String(y));
      output.setAttribute("width",String(width));output.setAttribute("height",String(height));
      output.removeAttribute("style");output.setAttribute("aria-hidden","true");
      group.setAttribute("color",group.getAttribute("fill")||"currentColor");
      group.setAttribute("aria-label",group.getAttribute("data-math-label")||tex);
      group.replaceChildren(output);group.dataset.mathRendered="true";
    }catch(error){
      node.dataset.mathError="true";console.error(error);
    }
  }
}
export function renderMath(root=document){
  if(!available)return;
  for(const host of collect(root,"[data-math-text]")){
    if(host.dataset.mathTextReady!=="true")setMixedMath(host,host.textContent);
  }
  for(const node of collect(root,"[data-tex]"))typesetElement(node);
  typesetSvgLabels(root);
}
mathReady.then(async()=>{
  for(const script of document.querySelectorAll('script[type^="math/tex"]')){
    const node=document.createElement(script.type.includes("display")?"div":"span");
    script.replaceWith(node);setMath(node,script.textContent,{display:script.type.includes("display")});
  }
  for(const label of document.querySelectorAll(".allen-graph-labels text")){
    label.setAttribute("data-tex-svg",plainToTex(label.textContent));
  }
  renderMath(document);
  await window.MathJax.typesetPromise([document.body]);
}).catch(error=>console.error(error));
let resizeFrame;
window.addEventListener("resize",()=>{
  cancelAnimationFrame(resizeFrame);
  resizeFrame=requestAnimationFrame(()=>typesetSvgLabels(document,{force:true}));
});
