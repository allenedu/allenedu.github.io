import {Graph,control,fmt,result,stat,legend,color,radians,text,line,circle,poly,vector,tag,px,offset,piFraction} from "./math-studio-core.mjs?v=studio2";
const category="几何与三角";
export default [
  {
    id:"unit-circle",title:"单位圆与三角函数",category,level:"初等数学",symbol:"sin θ",
    summary:"转动半径，把圆上点的横纵坐标与正弦曲线联系起来。",
    question:"转过半圈后，正弦和余弦的符号会怎样变化？什么时候 tan θ 没有定义？",
    keywords:"单位圆 正弦 余弦 正切 unit circle sine cosine tangent",
    controls:[control("theta","转角 θ",0,360,1,40,{unit:"°"})],
    presets:[{label:"第一象限",values:{theta:45}},{label:"直角",values:{theta:90}},{label:"第三象限",values:{theta:225}}],
    render(p){
      const t=radians(p.theta),s=Math.sin(t),c=Math.cos(t);
      const g=new Graph({xmin:-1.4,xmax:1.4,ymin:-1.4,ymax:1.4,equal:true,area:{x:48,y:75,w:310,h:310},id:"circle-left",xticks:[[-1,"−1"],[0,"0"],[1,"1"]],yticks:[[-1,"−1"],[0,"0"],[1,"1"]]});
      const h=new Graph({xmin:0,xmax:2*Math.PI,ymin:-1.3,ymax:1.3,area:{x:438,y:100,w:278,h:260},id:"circle-sine",xticks:[[0,"0"],[Math.PI,"π"],[2*Math.PI,"2π"]],yticks:[[-1,"−1"],[0,"0"],[1,"1"]]});
      const arc=[[0,0]];for(let i=0;i<=80;i++){const a=t*i/80;arc.push([.28*Math.cos(a),.28*Math.sin(a)]);}
      const body=g.ellipse(0,0,1,1,"muted")+g.polygon(arc,"gold",{"fill-opacity":.25})+g.segment(0,0,c,s,"green")+g.segment(c,0,c,s,"green",{"stroke-width":5})+g.segment(0,0,c,0,"blue",{"stroke-width":5})+g.segment(0,s,c,s,"green",{"stroke-dasharray":"4 4","stroke-width":1.5})+g.point(c,s,7);
      const right=h.curve(Math.sin,"green")+h.segment(t,0,t,s,"gold",{"stroke-dasharray":"5 5"})+h.point(t,s,7);
      const svg=text(202,35,"圆上的点 P = (cos θ, sin θ)",{"text-anchor":"middle","font-size":17})+g.render(body)+text(575,35,"把纵坐标展开成正弦曲线",{"text-anchor":"middle","font-size":17})+h.render(right)+text(202,443,"半径 = 1",{"text-anchor":"middle",fill:color("muted")})+text(575,415,"横轴：θ（弧度）",{"text-anchor":"middle",fill:color("muted")});
      return result(svg,"cos²θ + sin²θ = 1",
        [stat("sin θ",fmt(s)),stat("cos θ",fmt(c)),stat("tan θ",Math.abs(c)<1e-10?"未定义":fmt(s/c))],
        ["圆上点的横坐标是 cos θ，纵坐标是 sin θ；右图的点与左图同步。",Math.abs(c)<1e-10?"此时 cos θ = 0，因此 tan θ = sin θ / cos θ 没有定义。":"角度绕圆一周，坐标回到原处，这正是周期性的来源。"],
        {sine:s,cosine:c,tangent:Math.abs(c)<1e-10?null:s/c},legend(["green","正弦 / 纵坐标"],["blue","余弦 / 横坐标"],["gold","角度与位置"]));
    }
  },
  {
    id:"sine-wave",title:"正弦波的四个参数",category,level:"初等数学",symbol:"A sin",
    summary:"分别调整振幅、频率、相位和中线，感受周期函数的变换。",
    question:"把 ω 加倍后，一个完整波形所占的横向长度怎样变化？",
    keywords:"振幅 周期 相位 正弦 sinusoid amplitude period phase",
    controls:[control("A","振幅 A",0,2,.1,1),control("omega","角频率 ω",.5,3,.1,1),control("phi","相位 φ",-180,180,5,0,{unit:"°"}),control("d","中线高度 d",-1.5,1.5,.1,0)],
    presets:[{label:"更快的振荡",values:{A:1,omega:2,phi:0,d:0}},{label:"平移与放大",values:{A:1.5,omega:1,phi:90,d:.5}}],
    render(p){
      const t=radians(p.phi),g=new Graph({xmin:-2*Math.PI,xmax:2*Math.PI,ymin:-4,ymax:4,id:"sine-wave-plot",xticks:[[-2*Math.PI,"−2π"],[-Math.PI,"−π"],[0,"0"],[Math.PI,"π"],[2*Math.PI,"2π"]]});
      return result(g.render(g.segment(g.xmin,p.d,g.xmax,p.d,"gold",{"stroke-dasharray":"7 6"})+g.curve(x=>p.A*Math.sin(p.omega*x+t)+p.d)),
        "y = "+fmt(p.A)+" sin("+fmt(p.omega)+"x"+(p.phi===0?"":(p.phi<0?" − ":" + ")+piFraction(p.phi))+")"+offset(p.d)+" （角度统一用弧度）",
        [stat("振幅",fmt(p.A)),stat("周期",p.A===0?"常数函数，无最小正周期":fmt(2*Math.PI/p.omega)),stat("值域","["+fmt(p.d-p.A)+", "+fmt(p.d+p.A)+"]")],
        ["ω 越大，波形在横向压得越紧；非零振幅时周期为 2π / ω。","相位滑块以角度显示；计算时转换为弧度。整体水平移动量为 −φ / ω（φ 用弧度）。"],
        {amplitude:p.A,period:p.A===0?null:2*Math.PI/p.omega},legend(["green","正弦波"],["gold","中线"]));
    }
  },
  {
    id:"pythagoras",title:"勾股定理的面积",category,level:"初等数学",symbol:"a²+b²",
    summary:"改变直角三角形的两条直角边，看三个正方形的面积关系。",
    question:"边长翻倍时，对应正方形的面积翻几倍？",
    keywords:"勾股定理 直角三角形 正方形 面积 Pythagorean theorem",
    controls:[control("a","直角边 a",1,5,.1,3),control("b","直角边 b",1,5,.1,4)],
    presets:[{label:"3–4–5 三角形",values:{a:3,b:4}},{label:"等腰直角三角形",values:{a:3,b:3}}],
    render(p){
      const scale=25,A=[260,270],B=[260+scale*p.a,270],C=[260,270-scale*p.b],u=scale*p.a,v=scale*p.b,c=Math.hypot(p.a,p.b);
      const aSquare=[A,B,[B[0],B[1]+u],[A[0],A[1]+u]],bSquare=[A,C,[C[0]-v,C[1]],[A[0]-v,A[1]]],cSquare=[B,C,[C[0]+v,C[1]-u],[B[0]+v,B[1]-u]];
      const svg=poly(aSquare,"green",{"fill-opacity":.2,stroke:color("green"),"stroke-width":2})+poly(bSquare,"blue",{"fill-opacity":.2,stroke:color("blue"),"stroke-width":2})+poly(cSquare,"gold",{"fill-opacity":.2,stroke:color("gold"),"stroke-width":2})+poly([A,B,C],"surface",{stroke:color("ink"),"stroke-width":2.5})+line(260,258,272,258,"muted")+line(272,258,272,270,"muted")+text(260+u/2,270+u/2+6,"a²",{"text-anchor":"middle","font-size":21,fill:color("green")})+text(260-v/2,270-v/2+6,"b²",{"text-anchor":"middle","font-size":21,fill:color("blue")})+text((B[0]+C[0])/2+v/2,(B[1]+C[1])/2-u/2+6,"c²",{"text-anchor":"middle","font-size":21,fill:color("gold")})+text(380,450,"两块直角边正方形的面积之和，等于斜边正方形的面积。",{"text-anchor":"middle","font-size":16});
      return result(svg,"a² + b² = c²",
        [stat("a²",fmt(p.a*p.a)),stat("b²",fmt(p.b*p.b)),stat("c²",fmt(c*c))],
        ["绿色与蓝色正方形面积相加，始终等于金色正方形面积。","这个关系适用于直角三角形；斜边 c = √(a² + b²)。"],
        {a2:p.a**2,b2:p.b**2,c2:p.a**2+p.b**2,c},legend(["green","a²"],["blue","b²"],["gold","c²"]));
    }
  },
  {
    id:"triangle",title:"余弦定理与三角形面积",category,level:"初等数学",symbol:"cos C",
    summary:"固定两条边，拖动夹角，观察第三边与面积的同步变化。",
    question:"两边固定时，夹角为多少度，三角形面积最大？",
    keywords:"三角形 正弦 余弦定理 面积 cosine rule sine area",
    controls:[control("b","边长 b",1,4,.1,3),control("c","边长 c",1,4,.1,4),control("theta","两边夹角 θ",15,165,1,60,{unit:"°"})],
    presets:[{label:"直角",values:{b:3,c:4,theta:90}},{label:"钝角",values:{b:3,c:4,theta:135}}],
    render(p){
      const t=radians(p.theta),x=p.b*Math.cos(t),y=p.b*Math.sin(t),a=Math.sqrt(p.b*p.b+p.c*p.c-2*p.b*p.c*Math.cos(t)),area=p.b*p.c*Math.sin(t)/2;
      const g=new Graph({xmin:-4.5,xmax:5,ymin:-.8,ymax:5,equal:true,id:"triangle-plot"});
      const arc=[[0,0]];for(let i=0;i<=50;i++)arc.push([.5*Math.cos(t*i/50),.5*Math.sin(t*i/50)]);
      const body=g.polygon([[0,0],[p.c,0],[x,y]],"green",{"fill-opacity":.13,stroke:color("green"),"stroke-width":2.5})+g.polygon(arc,"gold",{"fill-opacity":.4})+g.segment(x,0,x,y,"blue",{"stroke-dasharray":"6 5"})+g.point(0,0)+g.point(p.c,0)+g.point(x,y)+g.label(p.c/2,-.35,"c = "+fmt(p.c),{"text-anchor":"middle"})+g.label(x/2-.25,y/2+.1,"b = "+fmt(p.b),{"text-anchor":"end"})+g.label((p.c+x)/2+.15,y/2+.2,"a = "+fmt(a))+g.label(.65,.15,fmt(p.theta)+"°");
      return result(g.render(body),"a² = b² + c² − 2bc cos θ;   S = ½bc sin θ",
        [stat("第三边 a",fmt(a)),stat("面积 S",fmt(area)),stat("高 b sin θ",fmt(y))],
        ["两边固定时，面积由 sin θ 决定，在 θ = 90° 时达到最大。",p.theta===90?"θ = 90° 时 cos θ = 0，余弦定理正好退化为勾股定理。":"夹角变大，夹角所对的边也变长；面积则会先增大再减小。"],
        {opposite:a,area,height:y},legend(["green","三角形"],["blue","对底边所在直线的高"],["gold","夹角"]));
    }
  },
  {
    id:"ellipse",title:"椭圆与两个焦点",category,level:"初等数学",symbol:"ellipse",
    summary:"移动椭圆上的点，观察到两个焦点的距离之和。",
    question:"什么时候两个焦点重合，椭圆变成一个圆？",
    keywords:"椭圆 焦点 圆 圆锥曲线 ellipse focus conic",
    controls:[control("a","水平半轴 a",.75,3.5,.25,3),control("b","竖直半轴 b",.75,3.5,.25,2),control("theta","圆周参数 θ",0,360,1,40,{unit:"°"})],
    presets:[{label:"圆",values:{a:2,b:2,theta:40}},{label:"竖向椭圆",values:{a:1.5,b:3,theta:60}}],
    render(p){
      const t=radians(p.theta),x=p.a*Math.cos(t),y=p.b*Math.sin(t),c=Math.sqrt(Math.abs(p.a*p.a-p.b*p.b));
      const F1=p.a>=p.b?[-c,0]:[0,-c],F2=p.a>=p.b?[c,0]:[0,c];
      const d1=Math.hypot(x-F1[0],y-F1[1]),d2=Math.hypot(x-F2[0],y-F2[1]);
      const g=new Graph({xmin:-4,xmax:4,ymin:-4,ymax:4,equal:true,id:"ellipse-plot"});
      const body=g.ellipse(0,0,p.a,p.b)+g.segment(...F1,x,y,"gold")+g.segment(...F2,x,y,"blue")+g.point(...F1,6,"gold")+g.point(...F2,6,"blue")+g.point(x,y,7)+g.label(F1[0]-.1,F1[1]-.45,"F₁",{"text-anchor":"end"})+g.label(F2[0]+.1,F2[1]-.45,"F₂");
      return result(g.render(body),"x² / "+fmt(p.a*p.a)+" + y² / "+fmt(p.b*p.b)+" = 1",
        [stat("PF₁",fmt(d1)),stat("PF₂",fmt(d2)),stat("距离之和",fmt(d1+d2))],
        ["无论点 P 移到哪里，PF₁ + PF₂ 始终等于长轴长度 2 max(a, b)。","焦点总在较长的轴上。a = b 时两焦点重合于圆心，椭圆成为圆。"],
        {distance1:d1,distance2:d2,sum:d1+d2,majorAxis:2*Math.max(p.a,p.b)},legend(["green","椭圆与点 P"],["gold","PF₁"],["blue","PF₂"]));
    }
  },
  {
    id:"vectors",title:"向量加法与点积",category,level:"初等数学",symbol:"u + v",
    summary:"改变两向量的长度和夹角，亲眼看平行四边形法则。",
    question:"当夹角超过 90° 时，点积为什么会变成负数？",
    keywords:"向量 平行四边形 点积 投影 vector dot product",
    controls:[control("u","向量 u 的长度",.5,3,.25,2),control("v","向量 v 的长度",.5,3,.25,2),control("theta","v 相对 u 的角度",-180,180,5,60,{unit:"°"})],
    presets:[{label:"互相垂直",values:{u:2,v:2,theta:90}},{label:"方向相反",values:{u:2,v:2,theta:180}}],
    render(p){
      const t=radians(p.theta),vx=p.v*Math.cos(t),vy=p.v*Math.sin(t),sx=p.u+vx,sy=vy,dot=p.u*vx;
      const g=new Graph({xmin:-4,xmax:7,ymin:-4,ymax:4,equal:true,id:"vectors-plot"});
      const V=(x1,y1,x2,y2,c)=>vector(g.X(x1),g.Y(y1),g.X(x2),g.Y(y2),c);
      const body=g.segment(p.u,0,sx,sy,"blue",{"stroke-dasharray":"6 5","stroke-opacity":.7})+g.segment(vx,vy,sx,sy,"green",{"stroke-dasharray":"6 5","stroke-opacity":.7})+V(0,0,p.u,0,"green")+V(0,0,vx,vy,"blue")+V(0,0,sx,sy,"pink")+g.point(0,0,4,"muted");
      return result(g.render(body),"u · v = |u| |v| cos θ",
        [stat("合向量","("+fmt(sx)+", "+fmt(sy)+")"),stat("|u + v|",fmt(Math.hypot(sx,sy))),stat("u · v",fmt(dot))],
        ["把两向量放到同一起点，平行四边形的对角线就是它们的和。",Math.abs(dot)<1e-9?"两向量垂直时，点积为 0。":dot>0?"夹角是锐角时，v 沿 u 方向的投影为正，点积也为正。":"夹角是钝角或平角时，v 沿 u 方向的投影为负，点积也为负。"],
        {sumX:sx,sumY:sy,magnitude:Math.hypot(sx,sy),dot},legend(["green","u"],["blue","v"],["pink","u + v"]));
    }
  },
  {
    id:"complex",title:"复数乘法：旋转与伸缩",category,level:"进阶数学",symbol:"z × w",
    summary:"在复平面上，把复数相乘看成模长相乘、角度相加。",
    question:"乘以 i 会把一个非零复数旋转多少度？再乘一次会怎样？",
    keywords:"复数 辐角 模 旋转 complex multiplication rotation argand",
    controls:[control("r","z 的模 r",.5,2,.1,1.5),control("theta","z 的辐角 θ",-180,180,5,30,{unit:"°"}),control("s","w 的模 s",.5,2,.1,1),control("phi","w 的辐角 φ",-180,180,5,90,{unit:"°"})],
    presets:[{label:"乘以 i",values:{r:1.5,theta:30,s:1,phi:90}},{label:"放大两倍",values:{r:1.5,theta:30,s:2,phi:0}}],
    render(p){
      const t=radians(p.theta),f=radians(p.phi),x=p.r*Math.cos(t),y=p.r*Math.sin(t),wx=p.s*Math.cos(f),wy=p.s*Math.sin(f),zx=x*wx-y*wy,zy=x*wy+y*wx;
      const arg=((p.theta+p.phi+180)%360+360)%360-180;
      const g=new Graph({xmin:-4.6,xmax:4.6,ymin:-4.6,ymax:4.6,equal:true,id:"complex-plot"});
      const V=(x,y,c)=>vector(g.X(0),g.Y(0),g.X(x),g.Y(y),c);
      const body=g.ellipse(0,0,1,1,"muted",{"stroke-dasharray":"5 5","stroke-width":1.5})+V(x,y,"green")+V(wx,wy,"blue")+V(zx,zy,"pink")+g.label(g.xmax-.3,-.4,"Re",{"text-anchor":"end"})+g.label(.2,g.ymax-.4,"Im");
      return result(g.render(body),"z w = r s [cos(θ + φ) + i sin(θ + φ)]",
        [stat("乘积的模",fmt(p.r*p.s)),stat("辐角（−180° ≤ arg < 180°）",fmt(arg)+"°"),stat("乘积坐标",fmt(zx)+" + ("+fmt(zy)+")i")],
        ["乘积的模等于两个模相乘，辐角等于两个辐角相加（相差整圈视为同一方向）。","乘以 i 的模不变，方向逆时针转 90°；连续乘两次相当于乘以 −1。"],
        {real:zx,imaginary:zy,modulus:p.r*p.s,argument:arg},legend(["green","z"],["blue","w"],["pink","zw"]));
    }
  }
];
