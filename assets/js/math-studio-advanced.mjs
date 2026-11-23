import {Graph,control,fmt,result,stat,legend,color,bounds,radians,line,superscript} from "./math-studio-core.mjs?v=latex1";
export default [
  {
    id:"geometric-series",title:"等比级数：部分和与极限",category:"数列与级数",level:"初等数学 / 微积分",symbol:"1+r+…",
    summary:"改变公比与项数，比较逐渐稳定、交替靠近和不收敛的情形。",
    question:"每一项越来越小，部分和就一定收敛吗？先观察本实验中 |r| 的作用。",
    keywords:"等比 数列 级数 部分和 收敛 geometric series convergence",
    controls:[control("r","公比 r",-1.2,1.2,.05,.5),control("n","累加项数 N",1,40,1,12)],
    presets:[{label:"交替靠近",values:{r:-.7,n:20}},{label:"公比等于 1",values:{r:1,n:20}},{label:"公比大于 1",values:{r:1.1,n:20}}],
    render(p){
      const sums=[0];let sum=0,term=1;
      for(let i=0;i<p.n;i++){sum+=term;sums.push(sum);term*=p.r;}
      const converges=Math.abs(p.r)<1,limit=converges?1/(1-p.r):null;
      const [ymin,ymax]=bounds(converges?[...sums,limit]:sums);
      const g=new Graph({xmin:0,xmax:Math.max(5,p.n),ymin,ymax,id:"geometric-series-plot"});
      let body=converges?g.segment(0,limit,g.xmax,limit,"gold",{"stroke-dasharray":"7 5"}):"";
      for(let i=1;i<sums.length;i++)body+=g.segment(i-1,sums[i-1],i,sums[i],"green",{"stroke-width":1.7})+g.point(i,sums[i],3.5);
      return result(g.render(body),"Sₙ = 1 + r + ⋯ + rⁿ⁻¹",
        [stat("当前部分和",fmt(sum,6)),stat("无限级数是否收敛",converges?"收敛":"不收敛"),stat("无限和",converges?fmt(limit,6):"不存在")],
        [converges?(p.r<0?"公比为负时，部分和在极限两侧交替靠近。":"|r| < 1 时，等比级数的无限和为 1 / (1 − r)。"):"|r| ≥ 1 时，本等比级数不收敛；有限部分和仍然可以计算。","横轴表示累加项数，点之间的细线只用于引导观察，数列本身是离散的。"],
        {sum,converges,limit,sums},legend(["green","部分和 Sₙ"],["gold","收敛时的无限和"]));
    }
  },
  {
    id:"taylor",title:"Taylor 多项式逼近 sin x",category:"数列与级数",level:"微积分",symbol:"Pₙ(x)",
    summary:"增加展开项数并扩大观察范围，比较局部逼近与远处的误差。",
    question:"只用固定次数的多项式，能不能在越来越大的区间上都保持相同精度？",
    keywords:"泰勒 Taylor Maclaurin 幂级数 多项式 近似",
    controls:[control("m","保留的非零项数 m",1,8,1,3),control("R","横向观察半径 R",1,8,.25,4),control("s","观察点相对位置",-1,1,.05,.75)],
    presets:[{label:"只看一阶近似",values:{m:1,R:4,s:.75}},{label:"七阶多项式",values:{m:4,R:4,s:.75}},{label:"扩大区间",values:{m:4,R:8,s:.75}}],
    render(p){
      const P=x=>{let term=x,sum=x;for(let j=1;j<p.m;j++){term*=-x*x/((2*j)*(2*j+1));sum+=term;}return sum;};
      const degree=2*p.m-1,x=p.R*p.s,actual=Math.sin(x),approx=P(x);
      let factorial=1;for(let i=2;i<=degree+1;i++)factorial*=i;
      const bound=Math.abs(x)**(degree+1)/factorial;
      const g=new Graph({xmin:-p.R,xmax:p.R,ymin:-2,ymax:2,id:"taylor-plot"});
      const body=g.curve(Math.sin)+g.curve(P,"blue")+g.segment(x,actual,x,approx,"pink",{"stroke-width":3})+g.point(x,actual,5)+g.point(x,approx,5,"blue");
      const terms=Array.from({length:p.m},(_,j)=>j===0?"x":(j%2?" − ":" + ")+"x"+superscript(2*j+1)+"/"+(2*j+1)+"!").join("");
      return result(g.render(body),"P_"+degree+"(x) = "+terms,
        [stat("当前位置 x",fmt(x)),stat("多项式值",fmt(approx,6)),stat("绝对误差",fmt(Math.abs(approx-actual),6)),stat("Lagrange 余项上界",fmt(bound,6))],
        ["这是在 x = 0 处的 Maclaurin 展开。固定观察区间时，增加项数可改善逼近。","纵轴固定为 [−2, 2]；多项式在较远处超出视窗的部分会被裁去。余项上界是保证，不一定紧。"],
        {degree,x,actual,approximation:approx,error:Math.abs(approx-actual),bound},legend(["green","sin x"],["blue","Taylor 多项式"],["pink","当前误差"]));
    }
  },
  {
    id:"fourier",title:"用正弦波拼出方波",category:"数列与级数",level:"进阶数学",symbol:"Fourier",
    summary:"叠加更多奇次谐波，观察 Fourier 逼近与跳点附近的振荡。",
    question:"增加项数后，跳点附近的振荡会完全消失，还是挤到更窄的区域？",
    keywords:"傅里叶 Fourier 方波 正弦 叠加 Gibbs 吉布斯",
    controls:[control("n","奇次谐波数量 N",1,30,1,5),control("theta","观察位置 x（角度）",-180,180,1,30,{unit:"°"})],
    presets:[{label:"只有一条正弦波",values:{n:1,theta:30}},{label:"叠加 20 项",values:{n:20,theta:10}},{label:"观察跳点",values:{n:20,theta:0}}],
    render(p){
      const F=x=>{let sum=0;for(let j=0;j<p.n;j++){const k=2*j+1;sum+=Math.sin(k*x)/k;}return 4*sum/Math.PI;};
      const x=radians(p.theta),s=Math.sin(x),target=Math.abs(s)<1e-10?0:Math.sign(s),approx=F(x);
      const g=new Graph({xmin:-Math.PI,xmax:Math.PI,ymin:-1.6,ymax:1.6,id:"fourier-plot",xticks:[[-Math.PI,"−π"],[0,"0"],[Math.PI,"π"]]});
      let body=g.segment(-Math.PI,-1,0,-1,"green",{"stroke-width":2})+g.segment(0,1,Math.PI,1,"green",{"stroke-width":2})+g.curve(F,"blue",{samples:1000})+g.point(x,approx,6,"blue");
      for(const jump of [-Math.PI,0,Math.PI])body+=g.point(jump,0,3,"green");
      body+=g.point(0,1,5,"green",{fill:color("surface"),stroke:color("green")})+g.point(0,-1,5,"green",{fill:color("surface"),stroke:color("green")});
      return result(g.render(body),"Fₙ(x) = (4/π) Σ sin((2j+1)x)/(2j+1),   j = 0, …, N−1",
        [stat("当前位置的部分和",fmt(approx,6)),stat("原方波（跳点取 0）",fmt(target)),stat("当前位置误差",fmt(Math.abs(approx-target),6))],
        ["远离跳点的地方，叠加更多谐波会让曲线更像方波；跳点处趋近左右极限的平均值 0。","跳点附近会出现 Gibbs 振荡：振荡区域变窄，但峰值超调不会随着项数增加而完全消失。"],
        {approximation:approx,target,error:Math.abs(approx-target)},legend(["green","目标方波"],["blue","Fourier 部分和"]));
    }
  },
  {
    id:"euler",title:"Euler 法：沿斜率一步步走",category:"微分方程",level:"微积分",symbol:"y′ = y",
    summary:"用当前点的斜率走下一步，比较数值折线与准确解。",
    question:"把总步数加倍，终点误差有什么变化？为什么步长太大时偏差明显？",
    keywords:"欧拉 Euler 微分方程 斜率 数值解 ODE",
    controls:[control("T","观察终点 T",.5,3,.1,2),control("n","Euler 总步数 n",2,40,1,8)],
    presets:[{label:"粗步长",values:{T:2,n:4}},{label:"细步长",values:{T:2,n:40}}],
    render(p){
      const exact=Math.exp(p.T),h=p.T/p.n,g=new Graph({xmin:0,xmax:p.T+.04,ymin:0,ymax:exact*1.12,id:"euler-plot"});
      let y=1,body=g.curve(Math.exp);
      for(let i=0;i<p.n;i++){const next=y*(1+h);body+=g.segment(i*h,y,(i+1)*h,next,"blue",{"stroke-width":2})+g.point(i*h,y,p.n>20?2:3.5,"blue");y=next;}
      body+=g.point(p.T,y,6,"blue")+g.point(p.T,exact,6)+g.segment(p.T,y,p.T,exact,"pink",{"stroke-dasharray":"4 4"});
      return result(g.render(body),"y′ = y, y(0) = 1;   yₙ₊₁ = yₙ + h yₙ",
        [stat("步长 h",fmt(h,5)),stat("Euler 终点值",fmt(y,6)),stat("准确值 eᵀ",fmt(exact,6)),stat("终点绝对误差",fmt(Math.abs(exact-y),6))],
        ["Euler 法用每一步起点的斜率代替整段真实变化，得到蓝色折线。","本例中缩小步长会改善精度；数值方法的步长选择还要结合方程性质与稳定性要求。"],
        {step:h,approximation:y,exact,error:Math.abs(exact-y)},legend(["green","准确解 eˣ"],["blue","Euler 数值解"],["pink","终点误差"]));
    }
  },
  {
    id:"logistic",title:"方向场与 Logistic 增长",category:"微分方程",level:"微积分",symbol:"y′ = ry…",
    summary:"改变增长率、承载量和初值，观察解曲线如何顺着方向场运动。",
    question:"初值高于承载量 K 时，解是继续增长，还是逐渐回落？",
    keywords:"方向场 Logistic 逻辑斯蒂 微分方程 平衡解 slope field",
    controls:[control("r","增长率 r",.25,2,.25,1),control("K","承载量 K",.5,3,.25,2),control("y0","初值 y(0)",.2,4,.1,.5),control("t","观察时刻 t",0,6,.1,3)],
    presets:[{label:"从下方接近",values:{r:1,K:2,y0:.5,t:3}},{label:"从上方接近",values:{r:1,K:2,y0:3.5,t:3}},{label:"平衡解",values:{r:1,K:2,y0:2,t:3}}],
    render(p){
      const f=(t,y)=>p.r*y*(1-y/p.K),Y=t=>p.K/(1+(p.K/p.y0-1)*Math.exp(-p.r*t));
      const g=new Graph({xmin:0,xmax:6,ymin:0,ymax:4.5,id:"logistic-plot"});
      let field="";
      for(let t=.2;t<6;t+=.4)for(let y=.15;y<4.5;y+=.35){
        const vx=g.X(t+1)-g.X(t),vy=g.Y(y+f(t,y))-g.Y(y),length=Math.hypot(vx,vy),dx=7*vx/length,dy=7*vy/length;
        field+=line(g.X(t)-dx,g.Y(y)-dy,g.X(t)+dx,g.Y(y)+dy,"muted",{"stroke-width":1.1,"stroke-opacity":.35});
      }
      const current=Y(p.t),slope=f(p.t,current);
      const body=field+g.segment(0,p.K,6,p.K,"gold",{"stroke-dasharray":"7 5"})+g.curve(Y,"green",{"stroke-width":3.5})+g.point(0,p.y0,6,"blue")+g.point(p.t,current,7);
      return result(g.render(body),"y′ = r y (1 − y/K);   y(0) = "+fmt(p.y0),
        [stat("当前 y(t)",fmt(current,6)),stat("当前斜率",fmt(slope,6)),stat("非零平衡值 K",fmt(p.K))],
        ["小线段表示各位置的变化方向；解曲线在每一点都与相应方向相切。",Math.abs(p.y0-p.K)<1e-9?"初值恰好等于 K，解是一条水平直线。":p.y0<p.K?"初值在 0 与 K 之间，解逐渐增大并趋近 K。":"初值高于 K，斜率为负，解逐渐回落并趋近 K。"],
        {value:current,slope,equilibrium:p.K},legend(["green","当前解曲线"],["blue","初值"],["gold","平衡线 y = K"],["muted","方向场"]));
    }
  }
];
