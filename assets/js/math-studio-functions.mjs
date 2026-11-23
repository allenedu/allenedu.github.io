import {Graph,control,fmt,result,stat,legend,color,degrees,offset,shifted,factor} from "./math-studio-core.mjs?v=latex1";
const category="函数与代数";
export default [
  {
    id:"quadratic",title:"抛物线与函数变换",category,level:"初等数学",symbol:"x²",
    summary:"改变开口系数与顶点位置，看二次函数怎样伸缩、翻转和平移。",
    question:"把 a 改成负数，图像为什么翻转？h 增大时，顶点向哪边移动？",
    keywords:"二次函数 顶点 quadratic parabola transformation",
    controls:[control("a","开口系数 a",-2,2,.25,1),control("h","水平移动 h",-3,3,.25,0),control("k","竖直移动 k",-3,3,.25,0)],
    presets:[{label:"开口向下",values:{a:-1,h:0,k:2}},{label:"向右平移",values:{a:.5,h:2,k:-1}}],
    render(p){
      const g=new Graph({ymin:-4,ymax:6,id:"quadratic-plot"}),f=x=>p.a*(x-p.h)**2+p.k;
      const body=g.curve(f)+(p.a===0?"":g.point(p.h,p.k,6));
      return result(g.render(body),"y = "+(p.a===0?fmt(p.k):factor(p.a,shifted("x",p.h)+"²")+offset(p.k)),
        [stat("开口",p.a===0?"退化为直线":p.a>0?"向上":"向下"),stat("顶点",p.a===0?"不存在":"("+fmt(p.h)+", "+fmt(p.k)+")"),stat("对称轴",p.a===0?"不适用":"x = "+fmt(p.h))],
        [p.a===0?"a = 0 时，二次项消失，函数成为水平直线。":"|a| 越大，离开顶点后函数值变化越快，抛物线看起来越窄。","式子中的 x − h 表示向右平移 h；h 为负时向左平移。"],
        {a:p.a,vertex:p.a===0?null:[p.h,p.k]},legend(["green","当前函数"]));
    }
  },
  {
    id:"linear",title:"直线的斜率与截距",category,level:"初等数学",symbol:"kx+b",
    summary:"用一个斜率三角形，把“横着走一格、竖着走多少”画出来。",
    question:"保持截距不变，改变斜率。两条直线为什么都经过同一个点？",
    keywords:"一次函数 斜率 截距 linear slope intercept",
    controls:[control("m","斜率 m",-3,3,.1,1),control("b","纵截距 b",-3,3,.25,1)],
    presets:[{label:"水平直线",values:{m:0,b:2}},{label:"负斜率",values:{m:-1.5,b:1}}],
    render(p){
      const g=new Graph({xmin:-4,xmax:4,ymin:-4,ymax:5,equal:true,id:"linear-plot"});
      const inclination=(degrees(Math.atan(p.m))+180)%180;
      const body=g.curve(x=>p.m*x+p.b)+g.segment(0,p.b,1,p.b,"blue",{"stroke-dasharray":"6 5"})+g.segment(1,p.b,1,p.m+p.b,"blue",{"stroke-dasharray":"6 5"})+g.point(0,p.b,6)+g.point(1,p.m+p.b,5,"blue");
      return result(g.render(body),"y = "+(p.m===0?fmt(p.b):factor(p.m,"x")+offset(p.b)),
        [stat("Δx",1),stat("Δy",fmt(p.m)),stat("倾斜角 θ ∈ [0°, 180°)",fmt(inclination)+"°")],
        ["斜率 m = Δy / Δx，描述每单位水平变化对应的竖直变化。",p.m===0?"m = 0 时直线水平，函数值不随 x 改变。":p.m>0?"m > 0，随着 x 增大，函数值上升。":"m < 0，随着 x 增大，函数值下降。"],
        {slope:p.m,intercept:p.b,inclination},legend(["green","直线"],["blue","斜率三角形"]));
    }
  },
  {
    id:"absolute-value",title:"绝对值与距离",category,level:"初等数学",symbol:"|x|",
    summary:"把绝对值理解成距离，观察 V 形图像的顶点与折角。",
    question:"把图像放大很多倍，顶点处能不能变成一条平滑的直线？",
    keywords:"绝对值 距离 不可导 absolute value distance",
    controls:[control("a","纵向系数 a",-2,2,.25,1),control("h","距离起点 h",-3,3,.25,0),control("k","竖直移动 k",-2,2,.25,0)],
    presets:[{label:"倒 V 形",values:{a:-1,h:0,k:2}},{label:"距离 x = 2",values:{a:1,h:2,k:0}}],
    render(p){
      const g=new Graph({ymin:-4,ymax:6,id:"absolute-plot"});
      return result(g.render(g.curve(x=>p.a*Math.abs(x-p.h)+p.k)+g.point(p.h,p.k,6)),
        "y = "+(p.a===0?fmt(p.k):factor(p.a,"|x"+offset(-p.h)+"|")+offset(p.k)),
        [stat("折点",p.a===0?"折角消失":"("+fmt(p.h)+", "+fmt(p.k)+")"),stat("左侧斜率",fmt(-p.a)),stat("右侧斜率",fmt(p.a))],
        ["|x − h| 表示 x 到 h 的距离。左右两侧的距离变化率互为相反数。",p.a===0?"a = 0 时函数为常数，处处可导。":"a ≠ 0 时，折点两侧斜率不同，所以该点不可导。"],
        {leftSlope:-p.a,rightSlope:p.a,differentiable:p.a===0},legend(["green","绝对值函数"]));
    }
  },
  {
    id:"exponential",title:"指数增长与衰减",category,level:"初等数学",symbol:"bˣ",
    summary:"改变底数，比较不断放大与不断缩小的乘法规律。",
    question:"同样把 x 增加 1，函数值的差保持不变，还是比值保持不变？",
    keywords:"指数 增长 衰减 exponential growth decay",
    controls:[control("b","底数 b",.2,3,.1,2),control("A","初始系数 A",.5,2,.25,1),control("t","观察位置 x",-2,2,.1,1)],
    presets:[{label:"每步翻倍",values:{b:2,A:1,t:1}},{label:"每步减半",values:{b:.5,A:1,t:1}}],
    render(p){
      const f=x=>p.A*p.b**x,g=new Graph({xmin:-3,xmax:3,ymin:-.5,ymax:7,id:"exponential-plot"});
      return result(g.render(g.curve(f)+g.point(p.t,f(p.t),6)+g.point(0,p.A,5,"blue")),
        "y = "+fmt(p.A)+" × "+fmt(p.b)+"ˣ",
        [stat("f(0)",fmt(p.A)),stat("f("+fmt(p.t)+")",fmt(f(p.t))),stat("f(x+1) / f(x)",fmt(p.b))],
        [p.b===1?"b = 1 时图像退化为常数函数。":p.b>1?"b > 1 时，每增加一个单位的 x，函数值都乘以 b，呈现增长。":"0 < b < 1 时，每增加一个单位的 x，函数值都乘以 b，呈现衰减。","固定的是相邻函数值的比值，而不是差值。"],
        {value:f(p.t),initial:p.A,ratio:p.b},legend(["green","指数函数"],["blue","初始值"]));
    }
  },
  {
    id:"logarithm",title:"对数、底数与定义域",category,level:"初等数学",symbol:"log",
    summary:"观察对数函数的共同经过点、增减性，以及底数为 1 的特殊情况。",
    question:"为什么无论怎样改变有效底数，图像都会经过 (1, 0)？",
    keywords:"对数 底数 定义域 logarithm domain",
    controls:[control("b","底数 b",.2,3,.1,2),control("t","观察位置 x",.1,5,.1,2)],
    presets:[{label:"底数小于 1",values:{b:.5,t:2}},{label:"底数等于 1",values:{b:1,t:2}}],
    render(p){
      const g=new Graph({xmin:-.5,xmax:5.5,ymin:-4,ymax:4,id:"logarithm-plot"}),valid=Math.abs(p.b-1)>1e-8;
      const f=x=>x>0&&valid?Math.log(x)/Math.log(p.b):null;
      let body=valid?g.curve(f)+g.point(1,0,6,"blue")+g.point(p.t,f(p.t),6):"";
      if(!valid) body+=g.label(2.5,1,"底数为 1 时，对数函数无定义",{"text-anchor":"middle","font-size":19});
      return result(g.render(body),"y = log_"+fmt(p.b)+"(x),  x > 0",
        [stat("底数是否有效",valid?"有效":"无效：b = 1"),stat("logᵦ(1)",valid?"0":"未定义"),stat("当前函数值",valid?fmt(f(p.t)):"未定义")],
        [valid?(p.b>1?"底数大于 1 时图像递增。":"底数在 0 与 1 之间时图像递减。"):"因为 1 的任意次幂都等于 1，不能用它唯一反求指数，所以底数不能取 1。","实数对数的真数必须大于 0；有效底数必须大于 0 且不等于 1。"],
        {valid,value:valid?f(p.t):null},legend(["green","对数函数"],["blue","共同经过点"]));
    }
  },
  {
    id:"reciprocal",title:"反比例函数与渐近线",category,level:"初等数学",symbol:"1/x",
    summary:"拖动中心与系数，观察两支曲线和水平、竖直渐近线。",
    question:"曲线越来越靠近渐近线，是否意味着一定会碰到渐近线？",
    keywords:"反比例 双曲线 渐近线 reciprocal hyperbola asymptote",
    controls:[control("a","系数 a",-3,3,.25,1),control("h","水平移动 h",-2,2,.25,0),control("k","竖直移动 k",-2,2,.25,0)],
    presets:[{label:"中心平移",values:{a:1,h:1,k:1}},{label:"零系数的特例",values:{a:0,h:0,k:1}}],
    render(p){
      const g=new Graph({ymin:-5,ymax:5,id:"reciprocal-plot"}),f=x=>p.a/(x-p.h)+p.k;
      const eps=.005;
      let body=g.segment(g.xmin,p.k,g.xmax,p.k,"gold",{"stroke-dasharray":"7 6"});
      if(p.a!==0) body+=g.segment(p.h,g.ymin,p.h,g.ymax,"gold",{"stroke-dasharray":"7 6"});
      body+=g.curve(f,"green",{max:p.h-eps})+g.curve(f,"green",{min:p.h+eps});
      if(p.a===0) body+=g.point(p.h,p.k,6,"green",{fill:"var(--allen-surface)",stroke:color("green")});
      return result(g.render(body),"y = "+fmt(p.a)+" / "+shifted("x",p.h)+offset(p.k)+",  x ≠ "+fmt(p.h),
        [stat("排除的 x",fmt(p.h)),stat("水平参考线","y = "+fmt(p.k)),stat("竖直渐近线",p.a===0?"不存在":"x = "+fmt(p.h))],
        [p.a===0?"a = 0 时图像是带一个空点的水平直线；x = h 仍不在原表达式的定义域内。":"a ≠ 0 时，两支曲线分别位于 x = h 两侧，不能跨过未定义的位置。","渐近线描述接近某个边界或无穷远处的趋势，并不是给图像增加的一条分支。"],
        {verticalAsymptote:p.a===0?null:p.h,horizontalReference:p.k},legend(["green","函数图像"],["gold",p.a===0?"水平参考线":"渐近线"]));
    }
  }
];
