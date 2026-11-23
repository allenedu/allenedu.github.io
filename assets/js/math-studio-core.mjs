/* Pure SVG and numerical helpers shared by the mathematics experiments. */
export const W = 760;
export const H = 480;
export const color = name => "var(--ms-" + name + ")";
export const escape = value => String(value).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
export function fmt(value, digits = 3) {
  if (!Number.isFinite(value)) return "未定义";
  if (Math.abs(value) < 1e-10) return "0";
  if (Math.abs(value) >= 1e5 || Math.abs(value) < 1e-4) return value.toExponential(2);
  return String(Number(value.toFixed(digits)));
}
export const px = value => Number(value.toFixed(3));
export const offset = value => Math.abs(value)<1e-10 ? "" : (value<0?" − ":" + ")+fmt(Math.abs(value));
export const shifted = (variable,value) => Math.abs(value)<1e-10 ? variable : "("+variable+offset(-value)+")";
export const factor = (value,term) => value===0?"0":value===1?term:value===-1?"−"+term:fmt(value)+" "+term;
export const superscript = number => String(number).split("").map(c=>"⁰¹²³⁴⁵⁶⁷⁸⁹"[Number(c)]).join("");
export function piFraction(degrees) {
  const gcd=(a,b)=>b?gcd(b,a%b):a;
  const divisor=gcd(Math.abs(degrees),180),a=Math.abs(degrees)/divisor,b=180/divisor;
  return (a===1?"":String(a))+"π"+(b===1?"":"/"+b);
}
export const radians = degrees => degrees * Math.PI / 180;
export const degrees = value => value * 180 / Math.PI;
export function tag(name, attrs = {}, body = "") {
  return "<" + name + Object.entries(attrs).map(([k,v]) => " " + k + '="' + escape(v) + '"').join("") + ">" + body + "</" + name + ">";
}
export const text = (x, y, label, attrs = {}) => tag("text", {x:px(x), y:px(y), fill:color("ink"), "font-size":15, ...attrs}, escape(label));
export const line = (x1, y1, x2, y2, name = "green", attrs = {}) => tag("line", {x1:px(x1), y1:px(y1), x2:px(x2), y2:px(y2), stroke:color(name), "stroke-width":2.4, ...attrs});
export const circle = (cx, cy, r, name = "green", attrs = {}) => tag("circle", {cx:px(cx), cy:px(cy), r:px(r), fill:color(name), ...attrs});
export const rect = (x, y, width, height, name = "green", attrs = {}) => tag("rect", {x:px(x), y:px(y), width:px(Math.max(0,width)), height:px(Math.max(0,height)), fill:color(name), ...attrs});
export const poly = (points, name = "green", attrs = {}) => tag("polygon", {points:points.map(p=>p.map(px).join(",")).join(" "), fill:color(name), ...attrs});
export function vector(x1, y1, x2, y2, name = "green", attrs = {}) {
  const angle = Math.atan2(y2-y1,x2-x1), length = Math.hypot(x2-x1,y2-y1);
  if (length < .1) return circle(x1,y1,3,name);
  const head = Math.min(11,length/3);
  return line(x1,y1,x2,y2,name,attrs) + poly([[x2,y2],[x2-head*Math.cos(angle-.42),y2-head*Math.sin(angle-.42)],[x2-head*Math.cos(angle+.42),y2-head*Math.sin(angle+.42)]],name);
}
export const control = (key, label, min, max, step, value, extra = {}) => ({key,label,min,max,step,value,...extra});
export function stateFor(model, raw = {}) {
  const values = {};
  for (const c of model.controls) {
    let value = raw[c.key] === "" || raw[c.key] === null ? NaN : Number(raw[c.key]);
    if (!Number.isFinite(value)) value = c.value;
    value = Math.min(c.max,Math.max(c.min,value));
    values[c.key] = Number((c.min + Math.round((value-c.min)/c.step)*c.step).toFixed(8));
    values[c.key] = Math.min(c.max,Math.max(c.min,values[c.key]));
  }
  return values;
}
export function ticks(min, max, target = 6) {
  const rough = (max-min)/target, power = 10**Math.floor(Math.log10(rough));
  const ratio = rough/power, step = (ratio <= 1 ? 1 : ratio <= 2 ? 2 : ratio <= 5 ? 5 : 10)*power;
  const result = [];
  for (let v = Math.ceil(min/step)*step; v <= max+step*1e-7; v += step) result.push(Number(v.toPrecision(12)));
  return result;
}
export class Graph {
  constructor({xmin=-5,xmax=5,ymin=-3,ymax=5,equal=false,area={x:62,y:35,w:654,h:382},id="ms-plot",xticks,yticks} = {}) {
    this.area = area;
    if (equal) {
      const ratio = area.w/area.h, cx=(xmin+xmax)/2, cy=(ymin+ymax)/2;
      if ((xmax-xmin)/(ymax-ymin) < ratio) { const d=(ymax-ymin)*ratio/2; xmin=cx-d; xmax=cx+d; }
      else { const d=(xmax-xmin)/ratio/2; ymin=cy-d; ymax=cy+d; }
    }
    Object.assign(this,{xmin,xmax,ymin,ymax,id,xticks,yticks});
  }
  X(x) { return this.area.x+(x-this.xmin)/(this.xmax-this.xmin)*this.area.w; }
  Y(y) { return this.area.y+(this.ymax-y)/(this.ymax-this.ymin)*this.area.h; }
  point(x,y,r=5,name="green",attrs={}) { return circle(this.X(x),this.Y(y),r,name,{stroke:"var(--allen-surface)","stroke-width":2,...attrs}); }
  segment(x1,y1,x2,y2,name="green",attrs={}) { return line(this.X(x1),this.Y(y1),this.X(x2),this.Y(y2),name,attrs); }
  label(x,y,label,attrs={}) { return text(this.X(x),this.Y(y),label,attrs); }
  polygon(points,name="green",attrs={}) { return poly(points.map(([x,y])=>[this.X(x),this.Y(y)]),name,attrs); }
  ellipse(cx,cy,rx,ry,name="green",attrs={}) {
    return tag("ellipse",{cx:px(this.X(cx)),cy:px(this.Y(cy)),rx:px(Math.abs(this.X(rx)-this.X(0))),ry:px(Math.abs(this.Y(ry)-this.Y(0))),fill:"none",stroke:color(name),"stroke-width":2.5,...attrs});
  }
  curve(fn,name="green",{min=this.xmin,max=this.xmax,samples=500,...attrs}={}) {
    let d="", active=false, lastY;
    for (let i=0;i<=samples;i++) {
      const x=min+(max-min)*i/samples, y=fn(x);
      if (y === null || !Number.isFinite(y) || Math.abs(this.Y(y))>this.area.h*20) { active=false; continue; }
      const X=this.X(x),Y=this.Y(y);
      if (lastY!==undefined && Math.abs(Y-lastY)>this.area.h*2) active=false;
      d+=(active?"L":"M")+px(X)+" "+px(Y);
      active=true; lastY=Y;
    }
    return tag("path",{d,fill:"none",stroke:color(name),"stroke-width":3,"stroke-linejoin":"round","stroke-linecap":"round",...attrs});
  }
  areaUnder(fn,min,max,name="green",baseline=0,samples=160) {
    if (Math.abs(max-min)<1e-10) return "";
    const points=[[min,baseline]];
    for (let i=0;i<=samples;i++) { const x=min+(max-min)*i/samples;points.push([x,fn(x)]); }
    points.push([max,baseline]);
    return this.polygon(points,name,{"fill-opacity":.17,stroke:"none"});
  }
  rectangle(x1,y1,x2,y2,name="green",attrs={}) {
    return rect(Math.min(this.X(x1),this.X(x2)),Math.min(this.Y(y1),this.Y(y2)),Math.abs(this.X(x2)-this.X(x1)),Math.abs(this.Y(y2)-this.Y(y1)),name,attrs);
  }
  render(body,overlay="") {
    const a=this.area;
    const xt=this.xticks || ticks(this.xmin,this.xmax).map(v=>[v,fmt(v)]);
    const yt=this.yticks || ticks(this.ymin,this.ymax).map(v=>[v,fmt(v)]);
    const zeroY=this.Y(Math.min(this.ymax,Math.max(this.ymin,0)));
    const zeroX=this.X(Math.min(this.xmax,Math.max(this.xmin,0)));
    let grid="";
    for (const [v,label] of xt) if(v>=this.xmin-1e-8&&v<=this.xmax+1e-8) {
      grid+=line(this.X(v),a.y,this.X(v),a.y+a.h,"grid",{"stroke-width":1});
      grid+=text(this.X(v),a.y+a.h+24,label,{"text-anchor":"middle",fill:color("muted"),"font-size":13,"class":"ms-axis-label"});
    }
    for (const [v,label] of yt) if(v>=this.ymin-1e-8&&v<=this.ymax+1e-8) {
      grid+=line(a.x,this.Y(v),a.x+a.w,this.Y(v),"grid",{"stroke-width":1});
      grid+=text(a.x-11,this.Y(v)+5,label,{"text-anchor":"end",fill:color("muted"),"font-size":13,"class":"ms-axis-label"});
    }
    grid+=line(a.x,zeroY,a.x+a.w,zeroY,"muted",{"stroke-width":1.1,"stroke-opacity":.6});
    grid+=line(zeroX,a.y,zeroX,a.y+a.h,"muted",{"stroke-width":1.1,"stroke-opacity":.6});
    const clip=tag("defs",{},tag("clipPath",{id:this.id},rect(a.x,a.y,a.w,a.h,"green")));
    return clip+grid+tag("g",{"clip-path":"url(#"+this.id+")"},body)+overlay;
  }
}
export function result(svg,formula,stats,observations,values={},legend=[]) {
  return {svg,formula,stats,observations,values,legend};
}
export const stat = (label,value) => ({label,value:String(value)});
export const legend = (...entries) => entries.map(([name,label])=>({color:name,label}));
export function bounds(values,padding=.15) {
  const min=Math.min(0,...values),max=Math.max(0,...values),span=Math.max(1,max-min);
  return [min-padding*span,max+padding*span];
}
export function integrate(fn,a,b,n=600) {
  if(n%2) n++;
  const h=(b-a)/n;
  let sum=fn(a)+fn(b);
  for(let i=1;i<n;i++) sum+=(i%2?4:2)*fn(a+i*h);
  return sum*h/3;
}
