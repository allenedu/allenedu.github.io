import {Graph,control,fmt,result,stat,legend,color,radians} from "./math-studio-core.mjs";
const category="积分与累积";
export default [
  {
    id:"riemann",title:"黎曼和：用小矩形拼出积分",category,level:"微积分",symbol:"Σ fΔx",
    summary:"增加矩形数量，比较左端点、中点和右端点取样带来的误差。",
    question:"固定矩形数量，换一个取样位置，近似面积会发生什么变化？",
    keywords:"黎曼和 积分 矩形 近似 riemann sum midpoint",
    controls:[control("n","矩形数量 n",1,60,1,6),control("theta","取样位置 θ（0 左，0.5 中，1 右）",0,1,.5,.5)],
    presets:[{label:"左端点",values:{n:6,theta:0}},{label:"中点",values:{n:6,theta:.5}},{label:"细分 40 份",values:{n:40,theta:.5}}],
    render(p){
      const f=x=>x*x+1,g=new Graph({xmin:-.2,xmax:2.3,ymin:-.3,ymax:5.7,id:"riemann-plot"}),h=2/p.n;
      let sum=0,body="";
      for(let i=0;i<p.n;i++){const x=(i+p.theta)*h,y=f(x);sum+=y*h;body+=g.rectangle(i*h,0,(i+1)*h,y,"blue",{"fill-opacity":.15,stroke:color("blue"),"stroke-width":.9});if(p.n<=20)body+=g.point(x,y,3,"blue");}
      body+=g.curve(f);
      const exact=14/3;
      return result(g.render(body),"∫₀² (x² + 1) dx ≈ Σ f(xᵢ*) Δx",
        [stat("矩形面积之和",fmt(sum,6)),stat("准确积分 14/3",fmt(exact,6)),stat("绝对误差",fmt(Math.abs(sum-exact),6))],
        ["每个矩形的宽度是 Δx = 2/n，高度取自选定的取样点。","固定取样规则并不断细分时，矩形面积之和趋近积分；不同取样规则的有限步误差可以很不一样。"],
        {approximation:sum,exact,error:Math.abs(sum-exact)},legend(["green","f(x) = x² + 1"],["blue","取样矩形"]));
    }
  },
  {
    id:"signed-area",title:"定积分与几何面积",category,level:"微积分",symbol:"± area",
    summary:"分别累积横轴上方和下方的区域，理解“带符号的面积”。",
    question:"把上下两块区域调成同样大小，定积分与几何面积分别是多少？",
    keywords:"定积分 正负 面积 signed area integral",
    controls:[control("a","积分下限 a",-3,0,.1,-2),control("b","积分上限 b",0,3,.1,2)],
    presets:[{label:"正负抵消",values:{a:-2,b:2}},{label:"积分为负",values:{a:-3,b:1}}],
    render(p){
      const g=new Graph({xmin:-3.4,xmax:3.4,ymin:-3.4,ymax:3.4,equal:true,id:"signed-area-plot"});
      const positive=p.b*p.b/2,negative=p.a*p.a/2,net=positive-negative;
      const body=g.areaUnder(x=>x,p.a,0,"pink")+g.areaUnder(x=>x,0,p.b,"green")+g.curve(x=>x)+g.point(p.a,p.a,5,"pink")+g.point(p.b,p.b,5);
      return result(g.render(body),"∫ₐᵇ x dx = ½(b² − a²)",
        [stat("上方面积",fmt(positive)),stat("下方面积（大小）",fmt(negative)),stat("定积分 / 几何面积",fmt(net)+" / "+fmt(positive+negative))],
        ["定积分把横轴上方记为正、下方记为负；几何面积把两部分的大小相加。",Math.abs(net)<1e-9?"两块区域正负抵消，积分为 0，但总几何面积不一定为 0。":net>0?"上方区域更大，所以定积分为正。":"下方区域更大，所以定积分为负。"],
        {positive,negative,integral:net,geometricArea:positive+negative},legend(["green","正的贡献"],["pink","负的贡献"]));
    }
  },
  {
    id:"fundamental-theorem",title:"微积分基本定理：累积量的变化",category,level:"微积分",symbol:"F′ = f",
    summary:"移动积分上限，把被积函数的高度与累积函数的变化率联系起来。",
    question:"当 f(x) 为负时，累积函数 F(x) 还会继续增加吗？",
    keywords:"微积分基本定理 累积函数 integral accumulation fundamental theorem",
    controls:[control("theta","积分上限 x（以角度调节）",0,360,1,120,{unit:"°"})],
    presets:[{label:"累积量最大",values:{theta:180}},{label:"正负抵消一周",values:{theta:360}}],
    render(p){
      const x=radians(p.theta),F=t=>1-Math.cos(t),g=new Graph({xmin:0,xmax:2*Math.PI,ymin:-1.4,ymax:2.5,id:"ftc-plot",xticks:[[0,"0"],[Math.PI,"π"],[2*Math.PI,"2π"]]});
      let body=g.areaUnder(Math.sin,0,Math.min(x,Math.PI),"green");
      if(x>Math.PI)body+=g.areaUnder(Math.sin,Math.PI,x,"pink");
      body+=g.curve(Math.sin)+g.curve(F,"blue")+g.segment(x,g.ymin,x,g.ymax,"gold",{"stroke-dasharray":"6 5","stroke-width":1.6})+g.point(x,Math.sin(x),6)+g.point(x,F(x),7,"blue");
      return result(g.render(body),"F(x) = ∫₀ˣ sin(t) dt = 1 − cos(x);   F′(x) = sin(x)",
        [stat("上限 x（弧度）",fmt(x)),stat("累积量 F(x)",fmt(F(x))),stat("瞬时变化率 F′(x)",fmt(Math.sin(x)))],
        ["蓝线的高度是从 0 累积到当前上限的带符号面积；绿线的高度是这个累积量的导数。",p.theta>180&&p.theta<360?"进入负值区域后，新增的面积为负，累积量开始减少。":"当被积函数为正，累积量上升；为负则下降。在 x = π 处累积量达到最大。"],
        {x,accumulation:F(x),derivative:Math.sin(x)},legend(["green","f(x) = sin x / 正贡献"],["blue","F(x) = 1 − cos x"],["pink","负贡献"],["gold","当前积分上限"]));
    }
  },
  {
    id:"quadrature",title:"梯形法与 Simpson 法",category,level:"微积分",symbol:"∫ ≈",
    summary:"对同一个积分，同时用直线段和二次曲线近似，比较两种误差。",
    question:"为什么仅增加同样数量的采样点，不同拼接方法的精度仍可能不同？",
    keywords:"梯形 Simpson 辛普森 数值积分 quadrature trapezoid",
    controls:[control("pairs","区间对数 m（n = 2m）",1,20,1,2)],
    presets:[{label:"粗分 2 份",values:{pairs:1}},{label:"细分 20 份",values:{pairs:10}}],
    render(p){
      const f=x=>x**4,n=2*p.pairs,h=2/n,exact=32/5,g=new Graph({xmin:-.1,xmax:2.1,ymin:-.5,ymax:18,id:"quadrature-plot"});
      let trap=(f(0)+f(2))/2,simpson=f(0)+f(2),body="";
      for(let i=1;i<n;i++){trap+=f(i*h);simpson+=(i%2?4:2)*f(i*h);}
      trap*=h;simpson*=h/3;
      for(let i=0;i<n;i++)body+=g.segment(i*h,f(i*h),(i+1)*h,f((i+1)*h),"blue",{"stroke-width":2.5});
      for(let i=0;i<n;i+=2){
        const start=i*h,y0=f(start),y1=f(start+h),y2=f(start+2*h);
        body+=g.curve(x=>{const t=(x-start)/h;return y0*(t-1)*(t-2)/2-y1*t*(t-2)+y2*t*(t-1)/2;},"gold",{min:start,max:start+2*h,samples:35,"stroke-dasharray":"7 4","stroke-width":2.5});
      }
      body+=g.curve(f,"green",{"stroke-width":1.8});
      return result(g.render(body),"∫₀² x⁴ dx = 32/5 = 6.4;   n = "+n,
        [stat("梯形近似",fmt(trap,7)),stat("梯形误差",fmt(Math.abs(trap-exact),7)),stat("Simpson 近似",fmt(simpson,7)),stat("Simpson 误差",fmt(Math.abs(simpson-exact),7))],
        ["梯形法在相邻点间连直线；Simpson 法每两个小区间使用一段二次插值曲线。","本例中 Simpson 法的误差更小。此比较针对当前光滑函数，不代表所有问题和取样条件下都能直接套用同一结论。"],
        {n,trapezoid:trap,simpson,exact,trapezoidError:Math.abs(trap-exact),simpsonError:Math.abs(simpson-exact)},legend(["green","真实函数 x⁴"],["blue","梯形直线段"],["gold","Simpson 二次曲线"]));
    }
  },
  {
    id:"between-curves",title:"两条曲线之间的面积",category,level:"微积分",symbol:"∫(g−f)",
    summary:"改变水平直线的高度，观察交点、积分区间和封闭区域的面积。",
    question:"为什么这块面积要积“上面的函数减下面的函数”，而不是直接积 x²？",
    keywords:"两曲线 面积 交点 integral between curves",
    controls:[control("c","直线高度 c",.25,4.5,.25,2),control("t","从左到右填充的比例",0,1,.05,1)],
    presets:[{label:"小区域",values:{c:1,t:1}},{label:"填充一半",values:{c:2,t:.5}}],
    render(p){
      const r=Math.sqrt(p.c),z=-r+2*r*p.t,exact=4*p.c*r/3,current=p.c*(z+r)-(z**3+r**3)/3;
      const g=new Graph({xmin:-2.8,xmax:2.8,ymin:-.5,ymax:5.2,id:"between-curves-plot"});
      const shape=(end)=>{const points=[[-r,p.c]];for(let i=0;i<=150;i++){const x=-r+(end+r)*i/150;points.push([x,x*x]);}points.push([end,p.c]);return points;};
      const body=g.polygon(shape(r),"blue",{"fill-opacity":.06})+g.polygon(shape(z),"blue",{"fill-opacity":.22})+g.curve(x=>x*x)+g.segment(g.xmin,p.c,g.xmax,p.c,"gold")+g.point(-r,p.c,6,"gold")+g.point(r,p.c,6,"gold")+g.segment(z,z*z,z,p.c,"blue",{"stroke-width":2});
      return result(g.render(body),"S = ∫ (c − x²) dx，区间 [−√c, √c]；完整面积 = 4c√c / 3",
        [stat("左 / 右交点横坐标",fmt(-r)+" / "+fmt(r)),stat("完整区域面积",fmt(exact,6)),stat("当前已填充面积",fmt(current,6))],
        ["交点由 x² = c 得到，所以积分区间也会随着直线高度变化。","每一根竖直小条的高度都是 c − x²；把这些小条累积起来，得到两曲线之间的面积。"],
        {left:-r,right:r,exact,current},legend(["green","下边界 y = x²"],["gold","上边界 y = c"],["blue","累积的区域"]));
    }
  },
  {
    id:"arc-length",title:"曲线弧长与折线逼近",category,level:"微积分",symbol:"ds",
    summary:"把曲线切成短段，用小线段的长度之和逐渐逼近弧长。",
    question:"为什么只把横向小区间 Δx 加起来，还不是曲线的长度？",
    keywords:"弧长 折线 勾股 近似 arc length polyline",
    controls:[control("b","终点横坐标 b",.5,3,.1,2),control("n","折线段数量 n",1,60,1,5)],
    presets:[{label:"只用一根弦",values:{b:2,n:1}},{label:"细分 40 段",values:{b:2,n:40}}],
    render(p){
      const f=x=>x*x/2,g=new Graph({xmin:-.2,xmax:3.3,ymin:-.3,ymax:5,id:"arc-length-plot"}),h=p.b/p.n;
      let length=0,body=g.curve(f,"green",{"stroke-width":3.5});
      for(let i=0;i<p.n;i++){const x=i*h,next=(i+1)*h;length+=Math.hypot(h,f(next)-f(x));body+=g.segment(x,f(x),next,f(next),"blue",{"stroke-width":2})+g.point(x,f(x),p.n>20?2:3,"blue");}
      body+=g.point(p.b,f(p.b),5,"blue");
      const exact=(p.b*Math.sqrt(1+p.b*p.b)+Math.asinh(p.b))/2;
      return result(g.render(body),"L = ∫₀ᵇ √(1 + [f′(x)]²) dx;   f(x) = x²/2",
        [stat("折线总长",fmt(length,6)),stat("准确弧长",fmt(exact,6)),stat("绝对误差",fmt(Math.abs(length-exact),6))],
        ["每一小段的长度是 √(Δx² + Δy²)，这正是勾股定理在局部的应用。","对这条光滑曲线，把分段不断细化，折线总长会逼近弧长。"],
        {approximation:length,exact,error:Math.abs(length-exact)},legend(["green","原曲线"],["blue","折线与分点"]));
    }
  }
];
