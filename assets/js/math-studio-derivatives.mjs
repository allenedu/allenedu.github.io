import {Graph,control,fmt,result,stat,legend,color,shifted} from "./math-studio-core.mjs";
const category="极限与导数";
export default [
  {
    id:"function-limit",title:"极限与单点的函数值",category,level:"微积分",symbol:"lim",
    summary:"让左右两点靠近同一个位置，再单独改变这个位置的函数值。",
    question:"只改变 f(1) 的值，会改变 x 趋近 1 时的极限吗？",
    keywords:"极限 连续 单点 间断 limit continuity removable discontinuity",
    controls:[control("h","到 x = 1 的距离 h",.01,1,.01,.6),control("c","单点函数值 f(1)",-1,4,.1,-1)],
    presets:[{label:"靠得很近",values:{h:.02,c:-1}},{label:"补成连续函数",values:{h:.1,c:2}}],
    render(p){
      const g=new Graph({xmin:-.5,xmax:2.5,ymin:-1.5,ymax:4.5,id:"limit-plot"});
      const body=g.curve(x=>Math.abs(x-1)<1e-10?null:x+1)+g.segment(1,g.ymin,1,g.ymax,"muted",{"stroke-dasharray":"5 6","stroke-width":1})+g.point(1,2,7,"green",{fill:color("surface"),stroke:color("green")})+g.point(1,p.c,7,"blue")+g.point(1-p.h,2-p.h,6,"gold")+g.point(1+p.h,2+p.h,6,"gold");
      return result(g.render(body),"f(x) = x + 1 (x ≠ 1);   f(1) = "+fmt(p.c),
        [stat("左侧点的函数值",fmt(2-p.h)),stat("右侧点的函数值",fmt(2+p.h)),stat("x → 1 时的极限","2")],
        ["金色点越靠近 x = 1，纵坐标越靠近 2。改变蓝色单点，不影响这个趋势。",Math.abs(p.c-2)<1e-9?"此时 f(1) 等于极限 2，函数在 x = 1 连续。":"此时 f(1) 不等于极限，函数在 x = 1 不连续。"],
        {left:2-p.h,right:2+p.h,limit:2,pointValue:p.c,continuous:Math.abs(p.c-2)<1e-9},
        legend(["green","x ≠ 1 时的图像"],["gold","趋近的两点"],["blue","单点 f(1)"]));
    }
  },
  {
    id:"epsilon-delta",title:"ε–δ：给极限一个精确范围",category,level:"微积分",symbol:"ε–δ",
    summary:"调整横向邻域与纵向误差带，看整段函数图像能否装进误差带。",
    question:"固定 ε 后，怎样缩小 δ，才能保证邻域内的点都满足要求？",
    keywords:"epsilon delta 极限 严格定义 邻域 误差",
    controls:[control("epsilon","允许的纵向误差 ε",.1,2,.05,.6),control("delta","横向邻域半径 δ",.02,1,.02,.2)],
    presets:[{label:"一个有效的 δ",values:{epsilon:.6,delta:.2}},{label:"δ 取大了",values:{epsilon:.6,delta:.6}}],
    render(p){
      const g=new Graph({xmin:-.5,xmax:2.5,ymin:-.5,ymax:4.5,id:"epsilon-plot"});
      const bound=2*p.delta+p.delta*p.delta,valid=bound<=p.epsilon+1e-10;
      const body=g.rectangle(1-p.delta,g.ymin,1+p.delta,g.ymax,"gold",{"fill-opacity":.1})+g.rectangle(g.xmin,1-p.epsilon,g.xmax,1+p.epsilon,"blue",{"fill-opacity":.1})+g.segment(1-p.delta,g.ymin,1-p.delta,g.ymax,"gold",{"stroke-dasharray":"6 5"})+g.segment(1+p.delta,g.ymin,1+p.delta,g.ymax,"gold",{"stroke-dasharray":"6 5"})+g.segment(g.xmin,1-p.epsilon,g.xmax,1-p.epsilon,"blue",{"stroke-dasharray":"6 5"})+g.segment(g.xmin,1+p.epsilon,g.xmax,1+p.epsilon,"blue",{"stroke-dasharray":"6 5"})+g.curve(x=>x*x,"green",{"stroke-opacity":.45})+g.curve(x=>x*x,"green",{min:1-p.delta,max:1+p.delta,"stroke-width":4})+g.point(1,1,5,"muted");
      return result(g.render(body),"0 < |x − 1| < δ  ⇒  |x² − 1| < ε",
        [stat("偏差上界 2δ + δ²",fmt(bound)),stat("允许误差 ε",fmt(p.epsilon)),stat("当前 δ 是否有效",valid?"有效":"还不够小")],
        [valid?"金色邻域内的绿色曲线全部落在蓝色误差带中，当前 δ 可以保证条件成立。":"金色邻域内有曲线超出蓝色误差带，需要缩小 δ。","这里 δ ≤ 1，邻域端点给出偏差上界 2δ + δ²；边界不包含在严格不等式的邻域内。"],
        {bound,valid},legend(["green","f(x) = x²"],["gold","δ 邻域"],["blue","ε 误差带"]));
    }
  },
  {
    id:"secant-tangent",title:"割线怎样变成切线",category,level:"微积分",symbol:"Δy/Δx",
    summary:"让两点的间距逐渐缩小，比较平均变化率与瞬时变化率。",
    question:"让 h 分别从正数和负数靠近 0，两侧的割线斜率会靠近同一个值吗？",
    keywords:"导数 割线 切线 差商 derivative secant tangent",
    controls:[control("t","切点横坐标 x₀",-1.5,1.5,.1,1),control("h","另一点的位移 h",-1.5,1.5,.05,1)],
    presets:[{label:"从右侧靠近",values:{t:1,h:.05}},{label:"从左侧靠近",values:{t:1,h:-.05}},{label:"h = 0 的极限",values:{t:1,h:0}}],
    render(p){
      const g=new Graph({xmin:-3.3,xmax:3.3,ymin:-1,ymax:10,id:"secant-plot"}),slope=2*p.t+p.h,derivative=2*p.t;
      const body=g.curve(x=>x*x)+g.curve(x=>p.t*p.t+derivative*(x-p.t),"gold",{"stroke-dasharray":"7 5","stroke-width":2.2})+g.curve(x=>p.t*p.t+slope*(x-p.t),"blue",{"stroke-width":2})+g.point(p.t,p.t*p.t,7)+g.point(p.t+p.h,(p.t+p.h)**2,6,"blue");
      return result(g.render(body),"f(x) = x²;   [f(x₀+h) − f(x₀)] / h = 2x₀ + h (h ≠ 0)",
        [stat(p.h===0?"差商的极限":"割线斜率",fmt(slope)),stat("切线斜率 f′(x₀)",fmt(derivative)),stat("两种斜率之差",fmt(Math.abs(p.h)))],
        [p.h===0?"h = 0 时原差商不能直接代入；此处显示它的极限值，即切线斜率。":"h 越靠近 0，平均变化率越靠近瞬时变化率。","蓝色割线与金色切线在极限中重合；导数描述的是切点附近的局部变化。"],
        {secantSlope:slope,derivative,slopeError:Math.abs(p.h)},legend(["green","原函数"],["blue",p.h===0?"差商极限":"割线"],["gold","切线"]));
    }
  },
  {
    id:"derivative-sign",title:"函数与导函数的对应",category,level:"微积分",symbol:"f′(x)",
    summary:"把正弦函数与导函数放在一起，联系切线斜率、增减性和极值。",
    question:"原函数达到最高点时，导函数的值是什么？导函数为负时原函数怎样变化？",
    keywords:"导函数 增减性 极值 chain rule derivative sign",
    controls:[control("k","函数中的系数 k",.5,3,.1,1),control("t","观察位置 x₀（弧度）",-3,3,.05,1)],
    presets:[{label:"观察最高点",values:{k:1,t:1.55}},{label:"频率加倍",values:{k:2,t:1}}],
    render(p){
      const f=x=>Math.sin(p.k*x),d=x=>p.k*Math.cos(p.k*x),g=new Graph({xmin:-Math.PI,xmax:Math.PI,ymin:-3.5,ymax:3.5,id:"derivative-sign-plot",xticks:[[-Math.PI,"−π"],[0,"0"],[Math.PI,"π"]]});
      const slope=d(p.t),body=g.curve(f)+g.curve(d,"blue")+g.curve(x=>f(p.t)+slope*(x-p.t),"gold",{"stroke-dasharray":"7 5","stroke-width":1.8})+g.segment(p.t,0,p.t,slope,"blue",{"stroke-dasharray":"4 5","stroke-width":1.3})+g.point(p.t,f(p.t),6)+g.point(p.t,slope,6,"blue");
      return result(g.render(body),"f(x) = sin("+fmt(p.k)+"x);   f′(x) = "+fmt(p.k)+" cos("+fmt(p.k)+"x)",
        [stat("f(x₀)",fmt(f(p.t))),stat("f′(x₀)",fmt(slope)),stat("当前位置趋势",Math.abs(slope)<1e-8?"切线水平":slope>0?"上升":"下降")],
        ["蓝色导函数的高度，对应绿色原函数在同一横坐标处的切线斜率。","复合函数求导会带来系数 k；改变 k 会同时改变原函数的频率与导数的振幅。"],
        {value:f(p.t),derivative:slope},legend(["green","原函数 f"],["blue","导函数 f′"],["gold","当前切线"]));
    }
  },
  {
    id:"linear-approximation",title:"放大局部，发现线性近似",category,level:"微积分",symbol:"≈",
    summary:"不断缩小观察窗口，看看光滑曲线怎样逐渐贴近切线。",
    question:"观察点离切点越近，切线给出的近似值通常会怎样变化？",
    keywords:"局部线性化 线性近似 微分 linearization approximation",
    controls:[control("t","切点横坐标 x₀",-1,1,.1,0),control("radius","观察窗口半径",.1,1.5,.05,1),control("s","观察点的相对位置",-1,1,.05,.7)],
    presets:[{label:"放大 10 倍",values:{t:0,radius:.1,s:.7}},{label:"较远处的近似",values:{t:0,radius:1.5,s:1}}],
    render(p){
      const x=p.t+p.radius*p.s,v=Math.exp(p.t),L=z=>v*(1+z-p.t),actual=Math.exp(x),approx=L(x);
      const xmin=p.t-p.radius,xmax=p.t+p.radius,ymin=Math.min(0,L(xmin))-.1,ymax=Math.exp(xmax)*1.12;
      const g=new Graph({xmin,xmax,ymin,ymax,id:"linear-approximation-plot"});
      const body=g.curve(Math.exp)+g.curve(L,"gold",{"stroke-width":2.3})+g.segment(x,approx,x,actual,"pink",{"stroke-width":4})+g.point(p.t,v,6)+g.point(x,actual,6)+g.point(x,approx,5,"gold");
      return result(g.render(body),"eˣ ≈ e^("+fmt(p.t)+") [1 + "+shifted("x",p.t)+"]",
        [stat("实际值 eˣ",fmt(actual,5)),stat("线性近似值",fmt(approx,5)),stat("绝对误差",fmt(Math.abs(actual-approx),6))],
        ["缩小窗口，观察点也会向切点靠近，曲线与切线的差距随之减小。","eˣ 是凸函数，所以它的切线位于图像下方；粉色线段表示当前近似误差。"],
        {x,actual,approximation:approx,error:Math.abs(actual-approx)},legend(["green","eˣ"],["gold","切线近似"],["pink","当前误差"]));
    }
  },
  {
    id:"newton",title:"牛顿法寻找 √2",category,level:"微积分",symbol:"xₙ₊₁",
    summary:"从曲线上的点作切线，用切线与横轴的交点产生下一个近似。",
    question:"为什么下一次迭代要先回到曲线上，再作一条新的切线？",
    keywords:"牛顿法 求根 迭代 数值方法 Newton root iteration",
    controls:[control("x0","初始近似 x₀",.3,3,.05,2.5),control("steps","迭代次数 n",0,5,1,2)],
    presets:[{label:"从右侧出发",values:{x0:2.5,steps:3}},{label:"较小的初值",values:{x0:.3,steps:1}}],
    render(p){
      const g=new Graph({xmin:-.3,xmax:3.8,ymin:-2.5,ymax:8,id:"newton-plot"}),f=x=>x*x-2;
      let x=p.x0,body=g.curve(f),points=[x];
      for(let i=0;i<p.steps;i++){
        const next=(x+2/x)/2;
        body+=g.segment(x,f(x),next,0,"gold",{"stroke-width":2})+g.segment(next,0,next,f(next),"blue",{"stroke-dasharray":"5 5","stroke-width":1.7})+g.point(x,f(x),4,"gold");
        x=next;points.push(x);
      }
      body+=g.point(x,0,7,"pink")+g.point(x,f(x),5);
      return result(g.render(body),"xₙ₊₁ = ½(xₙ + 2 / xₙ)",
        [stat("当前 xₙ",fmt(x,7)),stat("√2",fmt(Math.SQRT2,7)),stat("绝对误差",fmt(Math.abs(x-Math.SQRT2),8))],
        ["金色切线给出下一次近似；蓝色竖线把新的横坐标送回原函数。","这里选择正初值求正根 √2。牛顿法一般依赖初值与函数性质，不能对任意问题保证收敛。"],
        {estimate:x,error:Math.abs(x-Math.SQRT2),iterates:points},legend(["green","f(x) = x² − 2"],["gold","迭代切线"],["blue","回到曲线"],["pink","当前近似"]));
    }
  }
];
