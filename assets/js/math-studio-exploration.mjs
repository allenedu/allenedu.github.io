import {Graph,control,fmt,result,stat,legend,color,radians,text,line,rect,circle} from "./math-studio-core.mjs?v=studio2";
import {choose,normalCentralProbability,sampleSquare,numberTex as n} from "./math-studio-numerics.mjs?v=studio2";
const finish=(svg,stats,notes,values,keys)=>result(svg,"",stats,notes,values,keys);
const gcd=(a,b)=>b?gcd(b,a%b):a;
const pointCache=new Map();
export default [
  {
    id:"polar-rose",title:"极坐标：用一个公式画玫瑰线",category:"函数与代数",level:"进阶数学",symbolTex:"r=A\\cos(k\\theta)",
    summary:"让角度带着半径一起转动，观察简单余弦式怎样画出不同花瓣。",
    question:"半径为负时，点画在射线的哪一侧？奇数和偶数参数的花瓣数有什么不同？",
    keywords:"极坐标 玫瑰线 花瓣 polar rose coordinates",animate:"theta",
    controls:[control("A","长度系数 A",.5,3,.25,2),control("k","角度倍数 k",1,8,1,3),control("theta","当前极角 θ",0,360,1,40,{unit:"°"})],
    presets:[{label:"三片花瓣",values:{A:2,k:3,theta:40}},{label:"八片花瓣",values:{A:2,k:4,theta:40}},{label:"负半径",values:{A:2,k:3,theta:60}}],
    tex:p=>"\\begin{gathered}r="+n(p.A)+"\\cos("+p.k+"\\theta)\\\\ x=r\\cos\\theta,\\quad y=r\\sin\\theta\\end{gathered}",
    render(p){
      const xy=t=>{const r=p.A*Math.cos(p.k*t);return [r*Math.cos(t),r*Math.sin(t)];},t=radians(p.theta),[x,y]=xy(t),r=p.A*Math.cos(p.k*t),g=new Graph({xmin:-3.5,xmax:3.5,ymin:-3.5,ymax:3.5,equal:true,id:"rose-plot"});
      const body=g.ellipse(0,0,p.A,p.A,"muted",{"stroke-dasharray":"4 6","stroke-width":1})+g.parametric(xy,0,2*Math.PI,"green",{samples:1800})+g.segment(0,0,p.A*Math.cos(t),p.A*Math.sin(t),"gold",{"stroke-dasharray":"5 5"})+g.segment(0,0,x,y,"blue",{"stroke-width":3})+g.point(x,y,7,"blue");
      return finish(g.render(body),[stat("当前半径 r",fmt(r,6)),stat("点的坐标","("+fmt(x)+", "+fmt(y)+")"),stat("完整花瓣数",p.k%2?p.k:2*p.k),stat("最大离原点距离",fmt(p.A))],
        ["金色虚线表示当前极角的正向射线；蓝色线段连接原点和曲线上的实际点。",r<0?"此时半径为负，实际点落在正向射线的反方向。":"整数 k 为奇数时有 k 片花瓣，为偶数时有 2k 片；改变 A 只会整体缩放。"],
        {radius:r,x,y,petals:p.k%2?p.k:2*p.k},legend(["green","完整玫瑰线"],["blue","当前半径与点"],["gold","极角的正向射线"]));
    }
  },
  {
    id:"parametric",title:"参数方程：两个振动合成一条轨迹",category:"函数与代数",level:"进阶数学",symbolTex:"\\bigl(x(t),y(t)\\bigr)",
    summary:"把横向和纵向的简谐振动合成 Lissajous 曲线，看点怎样沿轨迹运行。",
    question:"频率比改变时，轨迹会怎样改变？同样的轨迹，点的运动方向是否固定？",
    keywords:"参数方程 李萨如 Lissajous parametric frequency phase",animate:"theta",
    controls:[control("p","横向频率 p",1,5,1,1),control("q","纵向频率 q",1,5,1,2),control("phi","横向相位 φ",0,180,5,0,{unit:"°"}),control("theta","当前时刻的相角",0,360,1,45,{unit:"°"})],
    presets:[{label:"椭圆轨迹",values:{p:1,q:1,phi:0,theta:45}},{label:"八字轨迹",values:{p:1,q:2,phi:90,theta:45}},{label:"复杂的频率比",values:{p:3,q:4,phi:30,theta:45}}],
    tex:p=>"\\begin{aligned}x(t)&=2\\cos("+p.p+"t+\\varphi)\\\\ y(t)&=1.5\\sin("+p.q+"t),\\qquad\\varphi=\\frac{"+p.phi+"}{180}\\pi\\end{aligned}",
    render(p){
      const phase=radians(p.phi),xy=t=>[2*Math.cos(p.p*t+phase),1.5*Math.sin(p.q*t)],t=radians(p.theta),[x,y]=xy(t),vx=-2*p.p*Math.sin(p.p*t+phase),vy=1.5*p.q*Math.cos(p.q*t),g=new Graph({xmin:-2.6,xmax:2.6,ymin:-2,ymax:2,equal:true,id:"parametric-plot"});
      const body=g.parametric(xy,0,2*Math.PI,"green",{samples:1800})+g.segment(x,0,x,y,"gold",{"stroke-dasharray":"5 5","stroke-width":1.5})+g.segment(0,y,x,y,"gold",{"stroke-dasharray":"5 5","stroke-width":1.5})+g.segment(x,y,x+.12*vx,y+.12*vy,"blue",{"stroke-width":3})+g.point(x,y,7,"blue");
      return finish(g.render(body),[stat("横坐标 x(t)",fmt(x,6)),stat("纵坐标 y(t)",fmt(y,6)),stat("瞬时速率",fmt(Math.hypot(vx,vy),6)),stat("一组重复时间",fmt(2*Math.PI/gcd(p.p,p.q),6))],
        ["横纵坐标都由时间决定，曲线可以折返，也可以在同一个位置多次经过，不必是单值函数图像。","蓝色短线表示沿时间增加方向的局部位移趋势；两个频率都是整数，因此轨迹会闭合并重复。"],
        {x,y,vx,vy,speed:Math.hypot(vx,vy),period:2*Math.PI/gcd(p.p,p.q)},legend(["green","完整运动轨迹"],["blue","当前点与运动趋势"],["gold","横纵坐标投影"]));
    }
  },
  {
    id:"binomial",title:"二项分布：重复试验的成功次数",category:"概率与统计",level:"初等数学 / 进阶数学",symbolTex:"X\\sim B(n,p)",
    summary:"调整试验次数和成功概率，观察概率柱形图怎样移动和改变形状。",
    question:"成功概率不变、试验次数增加时，成功次数的中心和分散程度怎样变化？",
    keywords:"二项分布 概率 独立试验 成功次数 binomial distribution probability",animate:"p",
    controls:[control("n","独立试验次数 n",1,24,1,10),control("p","单次成功概率 p",0,1,.05,.5),control("k","关注的成功次数 k",0,24,1,5)],
    presets:[{label:"公平硬币",values:{n:10,p:.5,k:5}},{label:"成功较少见",values:{n:20,p:.15,k:3}},{label:"每次都成功",values:{n:10,p:1,k:10}}],
    tex:p=>"\\begin{aligned}P(X=k)&=\\binom{n}{k}p^k(1-p)^{n-k}\\\\ \\mathbb E[X]&=np="+n(p.n*p.p)+"\\end{aligned}",
    render(p){
      const probabilities=Array.from({length:p.n+1},(_,k)=>choose(p.n,k)*p.p**k*(1-p.p)**(p.n-k)),probability=p.k<=p.n?probabilities[p.k]:0,mean=p.n*p.p,variance=p.n*p.p*(1-p.p);
      const ymax=Math.max(...probabilities)*1.17,g=new Graph({xmin:-1,xmax:p.n+1,ymin:0,ymax,id:"binomial-plot",xticks:Array.from({length:p.n+1},(_,k)=>k).filter(k=>p.n<=12||k%2===0).map(k=>[k,k])});
      let body="";probabilities.forEach((value,k)=>body+=g.rectangle(k-.36,0,k+.36,value,k===p.k?"blue":"green",{"fill-opacity":k===p.k?.85:.45}));
      body+=g.segment(mean,0,mean,ymax,"gold",{"stroke-dasharray":"6 5","stroke-width":2});
      return finish(g.render(body),[stat("关注次数的概率",fmt(probability,8)),stat("期望 np",fmt(mean)),stat("方差 np(1 − p)",fmt(variance)),stat("所有柱子的概率和",fmt(probabilities.reduce((a,b)=>a+b,0),8))],
        [p.k>p.n?"关注的成功次数超过了试验次数，因此概率为零。把 k 调回可取范围，就能高亮对应的柱子。":"每根柱子的高度，是恰好得到该成功次数的概率；所有可能次数的概率相加为 1。","模型假设各次试验独立，且每次成功概率相同。期望给出平均中心，不保证一定是整数，也不代表每次都会得到它。"],
        {probability,probabilities,mean,variance,total:probabilities.reduce((a,b)=>a+b,0)},legend(["green","成功次数的概率"],["blue","当前关注次数"],["gold","期望所在位置"]));
    }
  },
  {
    id:"normal",title:"正态分布：概率藏在面积里",category:"概率与统计",level:"进阶数学",symbolTex:"X\\sim N(\\mu,\\sigma^2)",
    summary:"移动均值、改变标准差，再用同样的标准差倍数框住中间一段。",
    question:"标准差变大、曲线变矮时，整条曲线下的总概率会减少吗？",
    keywords:"正态分布 均值 标准差 概率密度 normal Gaussian distribution",animate:"z",
    controls:[control("mu","均值 μ",-2,2,.25,0),control("sigma","标准差 σ",.5,2,.1,1),control("z","两侧标准差倍数 z",0,3,.1,1)],
    presets:[{label:"一个标准差",values:{mu:0,sigma:1,z:1}},{label:"两个标准差",values:{mu:0,sigma:1,z:2}},{label:"更分散的分布",values:{mu:1,sigma:2,z:1}}],
    tex:()=>"\\begin{aligned}f(x)&=\\frac1{\\sigma\\sqrt{2\\pi}}\\exp\\!\\left(-\\frac{(x-\\mu)^2}{2\\sigma^2}\\right)\\\\ P(|X-\\mu|\\le z\\sigma)&=\\int_{\\mu-z\\sigma}^{\\mu+z\\sigma}f(x)\\,dx\\end{aligned}",
    render(p){
      const f=x=>Math.exp(-.5*((x-p.mu)/p.sigma)**2)/(p.sigma*Math.sqrt(2*Math.PI)),left=p.mu-p.z*p.sigma,right=p.mu+p.z*p.sigma,probability=normalCentralProbability(p.z),g=new Graph({xmin:-8,xmax:8,ymin:0,ymax:.88,id:"normal-plot"});
      const body=g.areaUnder(f,left,right,"blue",0,300)+g.curve(f,"green",{samples:900})+g.segment(p.mu,0,p.mu,f(p.mu),"gold",{"stroke-dasharray":"6 5"})+g.segment(left,0,left,f(left),"blue",{"stroke-width":1.8})+g.segment(right,0,right,f(right),"blue",{"stroke-width":1.8});
      return finish(g.render(body),[stat("中间区间的概率",fmt(100*probability,4)+"%"),stat("两侧合计概率",fmt(100*(1-probability),4)+"%"),stat("区间左端点",fmt(left)),stat("区间右端点",fmt(right))],
        ["概率由曲线下面的面积给出，密度的单个高度本身不是概率。改变均值会平移，改变标准差会伸缩。","固定标准差倍数 z 时，阴影部分的概率保持不变。图只展示有限横轴范围，完整正态曲线在整个实轴下的面积才是 1。"],
        {mean:p.mu,sigma:p.sigma,left,right,probability,outside:1-probability},legend(["green","概率密度"],["blue","所选区间的概率面积"],["gold","均值位置"]));
    }
  },
  {
    id:"monte-carlo",title:"用随机点估计圆周率",category:"概率与统计",level:"初等数学 / 进阶数学",symbolTex:"\\pi\\approx4\\frac{N_{\\mathrm{in}}}{N}",
    summary:"在单位正方形里撒点，用落进四分之一圆的比例估计圆周率。",
    question:"点数增加后，估计值一定每次都更接近圆周率吗？换一次撒点会怎样？",
    keywords:"蒙特卡洛 随机 圆周率 概率 Monte Carlo pi simulation",animate:"N",
    controls:[control("N","撒点数量 N",50,2000,50,500),control("seed","可重复的撒点编号",1,20,1,1)],
    presets:[{label:"先撒 100 个点",values:{N:100,seed:1}},{label:"增加到 2000 个点",values:{N:2000,seed:1}},{label:"换一次撒点",values:{N:500,seed:7}}],
    tex:()=>"\\frac{\\text{四分之一圆面积}}{\\text{正方形面积}}=\\frac\\pi4,\\qquad\\widehat\\pi=4\\frac{N_{\\mathrm{in}}}{N}",
    render(p){
      if(!pointCache.has(p.seed))pointCache.set(p.seed,sampleSquare(p.seed,2000));
      const points=pointCache.get(p.seed).slice(0,p.N),inside=points.filter(q=>q.inside).length,estimate=4*inside/p.N;
      const g=new Graph({xmin:0,xmax:1,ymin:0,ymax:1,equal:true,area:{x:197,y:42,w:360,h:360},id:"monte-carlo-plot",xticks:[[0,"0"],[.5,"0.5"],[1,"1"]],yticks:[[0,"0"],[.5,"0.5"],[1,"1"]]});
      let body=g.rectangle(0,0,1,1,"grid",{"fill-opacity":.25})+g.areaUnder(x=>Math.sqrt(Math.max(0,1-x*x)),0,1,"green",0,250)+g.curve(x=>Math.sqrt(Math.max(0,1-x*x)),"green",{min:0,max:1,samples:400});
      for(const q of points)body+=circle(g.X(q.x),g.Y(q.y),p.N>1000?1.8:2.7,q.inside?"blue":"pink",{"fill-opacity":.65});
      return finish(g.render(body)+text(380,459,"编号固定时，增加点数会保留已经撒下的点",{"text-anchor":"middle",fill:color("muted")} ),[stat("圆内点数",inside),stat("全部点数",p.N),stat("估计的圆周率",fmt(estimate,6)),stat("绝对误差",fmt(Math.abs(estimate-Math.PI),6))],
        ["点由可重复的伪随机序列产生；在单位正方形内均匀取点时，落入四分之一圆的概率等于面积之比。","更多点通常让估计更稳定，但一次实验的误差不会单调下降。换一个编号，可以比较不同撒点结果。"],
        {inside,count:p.N,estimate,error:Math.abs(estimate-Math.PI)},legend(["blue","落在圆内"],["pink","落在圆外"],["green","四分之一圆边界"]));
    }
  }
];
