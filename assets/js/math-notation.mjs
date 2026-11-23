/* Convert the studio's plain accessibility labels to explicit TeX fragments. */
export const escapeHTML=value=>String(value).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const sup={"⁰":"0","¹":"1","²":"2","³":"3","⁴":"4","⁵":"5","⁶":"6","⁷":"7","⁸":"8","⁹":"9","ⁿ":"n","ˣ":"x","ᵀ":"T","ᵇ":"b","ᶜ":"c","⁻":"-","⁺":"+"};
const sub={"₀":"0","₁":"1","₂":"2","₃":"3","₄":"4","₅":"5","₆":"6","₇":"7","₈":"8","₉":"9","ₙ":"n","₊":"+","₋":"-","ᵢ":"i","ₓ":"x","ᵦ":"b"};
const commands={"θ":"\\theta ","φ":"\\varphi ","ω":"\\omega ","π":"\\pi ","δ":"\\delta ","ε":"\\varepsilon ","Δ":"\\Delta ","Σ":"\\sum ","∑":"\\sum ","∫":"\\int ","∞":"\\infty ","≈":"\\approx ","∈":"\\in ","→":"\\to ","⇒":"\\Longrightarrow ","≠":"\\ne ","≤":"\\le ","≥":"\\ge ","×":"\\times ","·":"\\cdot ","⋯":"\\cdots ","…":"\\ldots ","−":"-","½":"\\tfrac{1}{2}"};
const word=/(?<![A-Za-z])(?:arctan|sin|cos|tan|log|ln|exp|max|min|arg|Re|Im|zw|bc|PF(?=[₁₂])|[A-Za-z](?![A-Za-z]))[₀₁₂₃₄₅₆₇₈₉ₙ₊₋ᵢₓᵦ⁰¹²³⁴⁵⁶⁷⁸⁹ⁿˣᵀᵇᶜ⁻⁺′″']*/.source;
const numeric=/\d+(?:\.\d+)?(?:e[+-]?\d+)?/.source;
const symbols=/[θφωπδεΔΣ∑∫∞≈∈→⇒≠≤≥×·⋯½√+\-−*/=<>|()[\]{},°⁰¹²³⁴⁵⁶⁷⁸⁹ⁿˣᵀᵇᶜ⁻⁺₀₁₂₃₄₅₆₇₈₉ₙ₊₋ᵢₓᵦ]/.source;
const atom="(?:"+word+"|"+numeric+"|"+symbols+")";
const run=new RegExp(atom+"(?:[ \\t]*"+atom+")*","gu");
const mathematical=/[A-Za-zθφωπδεΔΣ∑∫∞≈∈→⇒≠≤≥×·½√=<>|⁰¹²³⁴⁵⁶⁷⁸⁹ⁿˣᵀᵇᶜ⁻⁺₀₁₂₃₄₅₆₇₈₉ₙ₊₋ᵢₓᵦ°]/u;
function topIndices(source,characters){
  let depth=0;const found=[];
  for(let i=0;i<source.length;i++){
    if("([{".includes(source[i]))depth++;
    else if(")]}".includes(source[i]))depth=Math.max(0,depth-1);
    else if(depth===0&&characters.includes(source[i]))found.push(i);
  }
  return found;
}
function roots(source){
  let out="";
  for(let i=0;i<source.length;i++){
    if(source[i]!=="√"){out+=source[i];continue;}
    while(source[i+1]===" ")i++;
    if(source[i+1]==="("){
      let depth=1,j=i+2;for(;j<source.length&&depth;j++){if(source[j]==="(")depth++;if(source[j]===")")depth--;}
      out+="\\sqrt{"+plainToTex(source.slice(i+2,j-1))+"}";i=j-1;
    }else{
      const match=source.slice(i+1).match(/^(?:\d+(?:\.\d+)?|[A-Za-zθφωπδε])/);
      if(match){out+="\\sqrt{"+plainToTex(match[0])+"}";i+=match[0].length;}
      else out+="\\sqrt{\\vphantom{x}}";
    }
  }
  return out;
}
export function plainToTex(input){
  const raw=String(input).trim();
  const relations=topIndices(raw,"=≠≤≥<>→⇒∈≈");
  if(relations.length){
    let last=0,tex="";
    for(const i of relations){tex+=plainToTex(raw.slice(last,i))+" "+(commands[raw[i]]||raw[i])+" ";last=i+1;}
    return tex+plainToTex(raw.slice(last));
  }
  const slashes=topIndices(raw,"/");
  if(slashes.length===1){
    const a=raw.slice(0,slashes[0]).trim(),b=raw.slice(slashes[0]+1).trim();
    if(a&&b&&!topIndices(a.replace(/^[+\-−]\s*/,""),"+-−").length&&!topIndices(b.replace(/^[+\-−]\s*/,""),"+-−").length)
      return "\\frac{"+plainToTex(a)+"}{"+plainToTex(b)+"}";
  }
  return roots(raw)
    .replace(/(\d+(?:\.\d+)?)e([+-]?\d+)/g,"$1\\times 10^{$2}")
    .replace(/[₀₁₂₃₄₅₆₇₈₉ₙ₊₋ᵢₓᵦ]+/g,s=>"_{" + [...s].map(c=>sub[c]).join("")+"}")
    .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹ⁿˣᵀᵇᶜ⁻⁺]+/g,s=>"^{" + [...s].map(c=>sup[c]).join("")+"}")
    .replace(/′+/g,s=>"^{"+Array.from(s,()=>"\\prime").join("")+"}")
    .replace(/″/g,"^{\\prime\\prime}")
    .replace(/[θφωπδεΔΣ∑∫∞≈∈→⇒≠≤≥×·⋯…−½]/g,c=>commands[c])
    .replace(/°/g,"^{\\circ}")
    .replace(/(?<![A-Za-z\\])(arctan|sin|cos|tan|log|ln|exp|max|min|arg)(?![A-Za-z])/g,"\\$1 ")
    .replace(/(?<![A-Za-z\\])(Re|Im)(?![A-Za-z])/g,"\\operatorname{$1}")
    .replace(/\s+/g," ").trim();
}
export function mathSegments(value,{numbers=false}={}){
  const source=String(value),segments=[];let last=0;
  for(const match of source.matchAll(run)){
    const candidate=match[0],lead=candidate.length-candidate.trimStart().length;
    const trimmed=candidate.trim().replace(/[,;]+$/,"").trimEnd();
    const numericExpression=/^[()[\]\s\d.,+\-−]+$/.test(trimmed)&&/[()[\],]/.test(trimmed);
    const isMath=trimmed&&(mathematical.test(trimmed)||numericExpression||numbers);
    if(!isMath)continue;
    const start=match.index+lead,end=start+trimmed.length;
    if(start>last)segments.push({text:source.slice(last,start)});
    segments.push({math:trimmed,tex:plainToTex(trimmed)});last=end;
  }
  if(last<source.length)segments.push({text:source.slice(last)});
  return segments.length?segments:[{text:source}];
}
export function mixedHTML(value,options={}){
  return mathSegments(value,options).map(part=>part.tex!==undefined?
    '<span class="allen-tex" data-tex="'+escapeHTML(part.tex)+'" aria-label="'+escapeHTML(part.math)+'"></span>':escapeHTML(part.text)).join("");
}
export function mixedToTex(value,options={}){
  return mathSegments(value,options).map(part=>part.tex!==undefined?part.tex:
    "\\text{"+part.text.replace(/[\\{}%$#&_]/g,c=>c==="\\"?"\\backslash ":("\\"+c))+"}").join("");
}
export function hasMath(value,{numbers=false}={}){
  return mathSegments(value,{numbers}).some(part=>part.tex!==undefined);
}
