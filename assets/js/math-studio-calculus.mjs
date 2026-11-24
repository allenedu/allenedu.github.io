import {Graph,control,fmt,result,stat,legend,color,text,line,poly,rect,tag,px} from "./math-studio-core.mjs?v=school3";
import {sinc,powerIntegral,numberTex as n} from "./math-studio-numerics.mjs?v=school3";
const finish=(svg,stats,notes,values,keys)=>result(svg,"",stats,notes,values,keys);
export default [
  {
    id:"sinc-limit",title:"夹逼定理与第一个重要极限",category:"极限与导数",level:"微积分",symbolTex:"\\frac{\\sin x}{x}",
    summary:"不断放大原点附近，看正弦之比怎样被两条界线夹向同一个高度。",
    question:"原式在零点没有定义，为什么仍然可以讨论趋近零时的极限？",
    keywords:"夹逼定理 重要极限 sinx/x sinc squeeze theorem 弧度",animate:"R",
    controls:[control("R","观察窗口半径 R",.1,6,.1,2),control("s","观察点相对位置",-1,1,.05,.5)],
    presets:[{label:"放大原点附近",values:{R:.1,s:.5}},{label:"原式的空点",values:{R:1,s:0}},{label:"观察较大范围",values:{R:6,s:.8}}],
    tex:()=>"\\begin{gathered}\\cos x\\le\\frac{\\sin x}{x}\\le1\\quad(0<|x|<\\tfrac{\\pi}{2})\\\\ \\lim_{x\\to0}\\frac{\\sin x}{x}=1\\end{gathered}",
    render(p){
      const x=p.R*p.s,value=sinc(x),lower=Math.min(p.R,Math.PI/2),g=new Graph({xmin:-p.R,xmax:p.R,ymin:p.R<.5?1-p.R*p.R*.6:-.35,ymax:p.R<.5?1+p.R*p.R*.12:1.2,id:"sinc-limit-plot"});
      const body=g.curve(()=>1,"gold",{"stroke-dasharray":"6 5"})+g.curve(Math.cos,"blue",{min:-lower,max:lower})+g.curve(t=>Math.abs(t)<1e-10?null:sinc(t))+g.point(0,1,6,"green",{fill:color("surface"),stroke:color("green")})+(Math.abs(x)<1e-10?"":g.point(x,value,6));
      return finish(g.render(body),[stat("观察位置 x（弧度）",fmt(x)),stat(x===0?"极限值（原式未定义）":"当前比值",fmt(value,8)),stat("与极限的差",fmt(1-value,8)),stat("局部下界 cos x",Math.abs(x)<Math.PI/2?fmt(Math.cos(x),8):"超出局部夹逼区间")],
        ["这里的角度必须用弧度。靠近零时，蓝色下界与金色上界都趋近 1，绿色比值被夹在中间。",x===0?"空心点提醒：原式在零点不能直接相除；极限 1 描述的是零点附近的趋势。":"缩小观察窗口，横轴和纵轴都会放大，便于看清绿色曲线与上界之间的小差距。"],
        {x,value:x===0?null:value,continuousExtension:value,limit:1,error:1-value},legend(["green","sin x / x"],["blue","局部下界 cos x"],["gold","上界 1"]));
    }
  },
  {
    id:"chain-rule",title:"链式法则：两次变化怎样相乘",category:"极限与导数",level:"微积分",symbolTex:"(f\\circ g)'",
    summary:"并排观察内层函数与复合函数，拆开导数中的两个变化率。",
    question:"内层函数的导数为零时，复合函数的切线会怎样？",
    keywords:"链式法则 复合函数 求导 chain rule composition",animate:"t",
    controls:[control("a","内层系数 a",.25,2,.25,1),control("t","观察位置 x₀",-2,2,.05,1)],
    presets:[{label:"内层暂时不变",values:{a:1,t:0}},{label:"内层变化加快",values:{a:2,t:1}}],
    tex:p=>"\\begin{aligned}g(x)&="+n(p.a)+"x^2,\\quad h(x)=\\sin(g(x))\\\\ h'(x)&=\\cos(g(x))\\,g'(x)="+n(2*p.a)+"x\\cos("+n(p.a)+"x^2)\\end{aligned}",
    render(p){
      const inner=x=>p.a*x*x,h=x=>Math.sin(inner(x)),t=p.t,innerSlope=2*p.a*t,outerSlope=Math.cos(inner(t)),slope=innerSlope*outerSlope;
      const a=new Graph({xmin:-2.2,xmax:2.2,ymin:-.25,ymax:5*p.a,area:{x:58,y:83,w:277,h:273},id:"chain-inner"});
      const b=new Graph({xmin:-2.2,xmax:2.2,ymin:-1.5,ymax:1.5,area:{x:430,y:83,w:277,h:273},id:"chain-composed"});
      const svg=text(196,40,"内层 g(x)",{"text-anchor":"middle","font-size":18})+text(570,40,"复合后 h(x) = sin(g(x))",{"text-anchor":"middle","font-size":18})+a.render(a.curve(inner)+a.curve(x=>inner(t)+innerSlope*(x-t),"gold",{"stroke-dasharray":"6 5","stroke-width":1.8})+a.point(t,inner(t),6))+b.render(b.curve(h,"blue",{samples:700})+b.curve(x=>h(t)+slope*(x-t),"gold",{"stroke-dasharray":"6 5","stroke-width":1.8})+b.point(t,h(t),6,"blue"))+text(380,437,"先改变内层的输入，再按外层的变化率传递",{"text-anchor":"middle",fill:color("muted")});
      return finish(svg,[stat("内层的值 g(x₀)",fmt(inner(t),6)),stat("内层变化率 g′(x₀)",fmt(innerSlope,6)),stat("外层变化率",fmt(outerSlope,6)),stat("复合变化率 h′(x₀)",fmt(slope,6))],
        ["两幅图的横坐标是同一个输入，但纵轴刻度不同；应比较读数，不能直接比较线条的视觉倾角。","复合函数的导数是外层在当前内层值处的导数，乘以内层对原输入的导数。"],
        {inner:inner(t),value:h(t),innerSlope,outerSlope,derivative:slope},legend(["green","内层函数"],["blue","复合函数"],["gold","各自的切线"]));
    }
  },
  {
    id:"product-rule",title:"乘积法则：面积增加了哪几块",category:"极限与导数",level:"微积分",symbolTex:"(uv)'=u'v+uv'",
    summary:"让长方形的两条边同时变化，把总面积增量拆成边条与小角块。",
    question:"当位移趋近零时，为什么小角块对差商的贡献也趋近零？",
    keywords:"乘积法则 求导 面积 微分 product rule differential",animate:"h",
    controls:[control("x","原来的输入 x",.5,2.5,.1,1.5),control("h","输入增加量 h",.01,1,.01,.5)],
    presets:[{label:"明显的增量",values:{x:1.5,h:1}},{label:"接近微分",values:{x:1.5,h:.01}}],
    tex:()=>"\\begin{aligned}u(x)&=x,\\quad v(x)=x^2,\\quad (uv)'=u'v+uv'=3x^2\\\\ \\Delta(uv)&=v\\,\\Delta u+u\\,\\Delta v+\\Delta u\\,\\Delta v\\end{aligned}",
    render(p){
      const u=p.x,v=p.x*p.x,du=p.h,dv=2*p.x*p.h+p.h*p.h,s=Math.min(410/(u+du),310/(v+dv)),left=185,bottom=395;
      const box=(x,y,w,h,c)=>rect(left+x*s,bottom-(y+h)*s,w*s,h*s,c,{"fill-opacity":.28,stroke:color(c),"stroke-width":1.5});
      const svg=box(0,0,u,v,"green")+box(u,0,du,v,"blue")+box(0,v,u,dv,"gold")+box(u,v,du,dv,"pink")+text(left+u*s/2,bottom+30,"u = x",{"text-anchor":"middle"})+text(left-22,bottom-v*s/2,"v = x²",{"text-anchor":"end"})+text(380,35,"原面积、两条边条，以及一个小角块",{"text-anchor":"middle","font-size":18});
      const increment=(p.x+p.h)**3-p.x**3,quotient=3*p.x*p.x+3*p.x*p.h+p.h*p.h,derivative=3*p.x*p.x;
      return finish(svg,[stat("原面积 x³",fmt(p.x**3,6)),stat("面积增量",fmt(increment,6)),stat("面积差商",fmt(quotient,6)),stat("瞬时变化率 3x²",fmt(derivative,6))],
        ["蓝色与金色边条来自两条边各自的变化；粉色小角块同时包含两条边的增量。","有限位移下必须保留小角块。把总增量除以 h，再令 h 趋近 0，才得到乘积求导法则。"],
        {u,v,du,dv,increment,corner:du*dv,quotient,derivative,error:quotient-derivative},legend(["green","原面积"],["blue","v Δu"],["gold","u Δv"],["pink","Δu Δv"]));
    }
  },
  {
    id:"mean-value",title:"中值定理：找到平行的切线",category:"极限与导数",level:"微积分",symbolTex:"f'(c)",
    summary:"移动区间两端，让一条内部切线始终与端点连线平行。",
    question:"平均变化率和某一瞬间的变化率，为什么会在这个区间里相遇？",
    keywords:"拉格朗日 中值定理 平均变化率 瞬时变化率 mean value theorem",animate:"b",
    controls:[control("a","区间左端点 a",0,1,.05,0),control("b","区间右端点 b",1.5,3,.05,2.5)],
    presets:[{label:"从零开始",values:{a:0,b:3}},{label:"缩小区间",values:{a:1,b:1.5}}],
    tex:()=>"\\begin{gathered}f(x)=x^3,\\quad f'(c)=3c^2=\\frac{b^3-a^3}{b-a}\\\\ c=\\sqrt{\\frac{a^2+ab+b^2}{3}}\\end{gathered}",
    render(p){
      const slope=p.a*p.a+p.a*p.b+p.b*p.b,c=Math.sqrt(slope/3),f=x=>x**3,g=new Graph({xmin:-.2,xmax:3.2,ymin:-1,ymax:30,id:"mean-value-plot"});
      const body=g.rectangle(p.a,g.ymin,p.b,g.ymax,"grid",{"fill-opacity":.35})+g.curve(f)+g.segment(p.a,f(p.a),p.b,f(p.b),"blue",{"stroke-width":2.5})+g.curve(x=>f(c)+slope*(x-c),"gold",{"stroke-dasharray":"7 5","stroke-width":2.2})+g.point(p.a,f(p.a),6,"blue")+g.point(p.b,f(p.b),6,"blue")+g.point(c,f(c),7,"gold");
      return finish(g.render(body),[stat("区间平均变化率",fmt(slope,6)),stat("内部位置 c",fmt(c,6)),stat("切线斜率 f′(c)",fmt(3*c*c,6)),stat("c 是否在区间内部",c>p.a&&c<p.b?"是":"否")],
        ["在所选区间上，这个函数连续，且在内部可导，因此中值定理保证至少存在一个这样的内部位置。","本例的区间在非负半轴上，导数严格递增，因此满足条件的内部位置唯一；一般函数不一定唯一。"],
        {a:p.a,b:p.b,c,secantSlope:slope,tangentSlope:3*c*c},legend(["green","原函数 x³"],["blue","端点连线"],["gold","与它平行的切线"]));
    }
  },
  {
    id:"rectangle-optimization",title:"固定周长，怎样围出最大面积",category:"极限与导数",level:"初等数学 / 微积分",symbolTex:"S=a\\left(\\frac P2-a\\right)",
    summary:"用同样长的围栏围长方形，把实际形状和面积函数并排观察。",
    question:"细长的长方形与正方形，哪一个在周长相同时面积更大？",
    keywords:"最优化 极值 最大面积 周长 长方形 optimization rectangle",animate:"s",
    controls:[control("P","固定周长 P",8,24,1,16),control("s","第一边占半周长的比例",.05,.95,.05,.3)],
    presets:[{label:"细长的长方形",values:{P:16,s:.1}},{label:"正方形",values:{P:16,s:.5}}],
    tex:()=>"\\begin{aligned}S(a)&=a\\left(\\frac P2-a\\right),\\quad S'(a)=\\frac P2-2a\\\\ S_{\\max}&=\\frac{P^2}{16}\\quad\\text{在 }a=\\frac P4\\text{ 时取得}\\end{aligned}",
    render(p){
      const half=p.P/2,a=half*p.s,b=half-a,area=a*b,maxArea=p.P*p.P/16,unit=270/half;
      const left=200-a*unit/2,top=245-b*unit/2,g=new Graph({xmin:0,xmax:half,ymin:0,ymax:maxArea*1.14,area:{x:438,y:80,w:268,h:290},id:"rectangle-area-plot"});
      const svg=rect(left,top,a*unit,b*unit,"green",{"fill-opacity":.15,stroke:color("green"),"stroke-width":3})+text(200,top+b*unit+29,"a = "+fmt(a),{"text-anchor":"middle"})+text(200,top-19,"b = "+fmt(b),{"text-anchor":"middle"})+text(200,43,"同一条围栏，不同的形状",{"text-anchor":"middle","font-size":18})+text(570,43,"面积怎样随边长变化",{"text-anchor":"middle","font-size":18})+g.render(g.curve(x=>x*(half-x),"blue")+g.point(half/2,maxArea,6,"gold")+g.point(a,area,7))+text(380,442,"最大值发生在两条边相等时",{"text-anchor":"middle",fill:color("muted")});
      return finish(svg,[stat("边长 a",fmt(a)),stat("边长 b",fmt(b)),stat("当前面积",fmt(area)),stat("该周长下的最大面积",fmt(maxArea))],
        ["一条边增加，另一条边必须减少，才能保持周长不变。右图记录每一种分配对应的面积。","面积函数是一条开口向下的抛物线；顶点对应正方形，也可以用配方或基本不等式理解。"],
        {a,b,perimeter:2*(a+b),area,maxArea,derivative:half-2*a},legend(["green","当前长方形与面积"],["blue","面积函数"],["gold","最大面积"]));
    }
  },
  {
    id:"disk-volume",title:"旋转体体积：把圆盘叠起来",category:"积分与累积",level:"微积分",symbolTex:"V=\\pi\\int f(x)^2\\,dx",
    summary:"把直线下的区域绕横轴旋转，用越来越多的薄圆盘近似圆锥体积。",
    question:"同样是累积小块，为什么计算体积时要用半径的平方？",
    keywords:"旋转体 圆盘法 圆锥 体积 disk method volume solid revolution",animate:"n",
    controls:[control("b","旋转区间右端点 b",.5,3,.25,2),control("n","中点圆盘数量 n",2,40,1,8)],
    presets:[{label:"四个厚圆盘",values:{b:2,n:4}},{label:"四十个薄圆盘",values:{b:2,n:40}}],
    tex:()=>"\\begin{aligned}V&=\\pi\\int_0^b x^2\\,dx=\\frac{\\pi b^3}{3}\\\\ V_n&=\\pi\\sum_{j=0}^{n-1}\\left((j+\\tfrac12)\\Delta x\\right)^2\\Delta x,\\quad\\Delta x=\\frac bn\\end{aligned}",
    render(p){
      const h=p.b/p.n,g=new Graph({xmin:0,xmax:p.b*1.05,ymin:-p.b*1.2,ymax:p.b*1.2,area:{x:55,y:85,w:275,h:275},id:"disk-profile"});
      let body=g.polygon([[0,0],[p.b,p.b],[p.b,-p.b]],"green",{"fill-opacity":.08})+g.curve(x=>x)+g.curve(x=>-x),sum=0,disks="";
      for(let j=0;j<p.n;j++){
        const x=(j+.5)*h,r=118*x/p.b,cx=442+230*x/p.b;sum+=Math.PI*x*x*h;
        body+=g.segment(x,-x,x,x,"blue",{"stroke-width":Math.max(1,110/p.n),"stroke-opacity":.35});
        disks+=tag("ellipse",{cx:px(cx),cy:231,rx:px(.23*r),ry:px(r),fill:color("blue"),"fill-opacity":.07,stroke:color("blue"),"stroke-width":1});
      }
      const exact=Math.PI*p.b**3/3,svg=text(193,40,"半径来自 y = x",{"text-anchor":"middle","font-size":18})+text(565,40,"圆盘截面示意",{"text-anchor":"middle","font-size":18})+g.render(body)+line(442,231,672,113,"green",{"stroke-width":2})+line(442,231,672,349,"green",{"stroke-width":2})+disks+tag("ellipse",{cx:672,cy:231,rx:27.14,ry:118,fill:"none",stroke:color("green"),"stroke-width":2})+line(429,231,719,231,"muted",{"stroke-dasharray":"5 5","stroke-width":1})+text(380,435,"每个截面的面积是 πx²，再乘以薄片厚度",{"text-anchor":"middle",fill:color("muted")});
      return finish(svg,[stat("圆盘数量",p.n),stat("中点圆盘体积和",fmt(sum,6)),stat("准确体积",fmt(exact,6)),stat("绝对误差",fmt(exact-sum,6))],
        ["左图显示旋转体的上下轮廓，右图画出圆盘截面；示意图不表示圆盘之间有空隙。","每片的体积是圆面积乘厚度；本例使用中点半径，增加圆盘数量会从下方逼近准确体积。"],
        {step:h,approximation:sum,exact,error:exact-sum},legend(["green","圆锥轮廓"],["blue","中点圆盘截面"]));
    }
  },
  {
    id:"improper-integral",title:"无穷区间：面积会不会无限增加",category:"积分与累积",level:"微积分",symbolTex:"\\int_1^\\infty x^{-p}\\,dx",
    summary:"把积分上限不断向右推，比较曲线下降速度与总面积是否有界。",
    question:"曲线趋近零，是否就足以保证曲线下面的无穷面积有限？",
    keywords:"反常积分 广义积分 收敛 发散 p积分 improper integral",animate:"B",
    controls:[control("p","衰减指数 p",.5,3,.1,2),control("B","当前积分上限 B",2,60,1,10)],
    presets:[{label:"收敛：平方反比",values:{p:2,B:30}},{label:"临界：一次反比",values:{p:1,B:30}},{label:"下降得更慢",values:{p:.5,B:30}}],
    tex:p=>"\\begin{aligned}\\int_1^{"+p.B+"}x^{ -"+n(p.p)+"}\\,dx&\\approx"+n(powerIntegral(p.p,p.B))+"\\\\ \\int_1^\\infty x^{-p}\\,dx&=\\begin{cases}\\dfrac1{p-1},&p>1,\\\\+\\infty,&0<p\\le1.\\end{cases}\\end{aligned}",
    render(p){
      const f=x=>x>=1?x**(-p.p):null,g=new Graph({xmin:0,xmax:Math.max(10,p.B)*1.04,ymin:0,ymax:1.2,id:"improper-plot"});
      const value=powerIntegral(p.p,p.B),converges=p.p>1,limit=converges?1/(p.p-1):null;
      const curve=g.curve(f,"green",{min:1,max:g.xmax,samples:800});
      return finish(g.render(g.areaUnder(f,1,p.B,"blue")+curve+g.segment(p.B,0,p.B,f(p.B),"gold",{"stroke-width":2})+g.point(p.B,f(p.B),6,"gold")),
        [stat("当前有限区间面积",fmt(value,6)),stat("无穷面积是否收敛",converges?"收敛":"发散"),stat("无穷面积",converges?fmt(limit,6):"无限大"),stat("剩余尾部面积",converges?fmt(limit-value,6):"不存在有限尾和")],
        ["这些曲线都趋近零，但只有 p > 1 时无穷区间的面积有限。上限不断增大，是观察反常积分的关键。",converges?"蓝色面积持续增加，同时剩余尾部面积越来越小；横轴范围会随积分上限扩展。":"有限区间面积可以算出，但把积分上限推向无穷时，面积仍会无限增长，不能把曲线趋零当作收敛依据。"],
        {value,converges,limit,tail:converges?limit-value:null},legend(["green","衰减曲线"],["blue","当前累积面积"],["gold","积分上限"]));
    }
  },
  {
    id:"integral-average",title:"函数平均值：等面积的水平高度",category:"积分与累积",level:"微积分",symbolTex:"f_{\\mathrm{avg}}",
    summary:"用一个水平长方形替代曲线下面的面积，找到函数在区间上的平均高度。",
    question:"函数的平均高度与左右端点函数值的平均数，总是一样吗？",
    keywords:"函数平均值 积分中值定理 等面积 average value integral",animate:"b",
    controls:[control("b","区间右端点 b",.5,4,.1,3)],
    presets:[{label:"单位区间",values:{b:1}},{label:"扩大三倍",values:{b:3}}],
    tex:()=>"f_{\\mathrm{avg}}=\\frac1b\\int_0^b x^2\\,dx=\\frac{b^2}{3},\\qquad c=\\frac b{\\sqrt3},\\quad f(c)=f_{\\mathrm{avg}}",
    render(p){
      const average=p.b*p.b/3,c=p.b/Math.sqrt(3),integral=p.b**3/3,g=new Graph({xmin:-.05*p.b,xmax:1.08*p.b,ymin:-.06*p.b*p.b,ymax:1.12*p.b*p.b,id:"average-plot"});
      const body=g.areaUnder(x=>x*x,0,p.b)+g.rectangle(0,0,p.b,average,"blue",{"fill-opacity":.09,stroke:color("blue"),"stroke-width":2,"stroke-dasharray":"7 4"})+g.curve(x=>x*x)+g.segment(0,average,p.b,average,"gold",{"stroke-width":2.5})+g.segment(c,0,c,average,"gold",{"stroke-dasharray":"5 5"})+g.point(c,average,7,"gold");
      return finish(g.render(body),[stat("函数平均值",fmt(average,6)),stat("等高位置 c",fmt(c,6)),stat("曲线下方面积",fmt(integral,6)),stat("长方形面积",fmt(p.b*average,6))],
        ["蓝色长方形与绿色曲线下方区域的面积相等，因此长方形的高度就是平均值。","本例两端函数值的平均数是 b²/2，与区间上的函数平均值 b²/3 不同；平均值取决于整个区间的累积。"],
        {average,c,integral,rectangleArea:p.b*average,endpointAverage:p.b*p.b/2},legend(["green","原函数及其面积"],["blue","等面积长方形"],["gold","平均高度"]));
    }
  }
];
