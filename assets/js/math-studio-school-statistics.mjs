import {Graph,control,fmt,result,stat,legend,color,text,rect,tag,circle,px} from "./math-studio-core.mjs?v=school3";
import {probabilityTable,circleOverlap,describeData} from "./math-studio-numerics.mjs?v=school3";
const finish=(svg,stats,notes,values,keys)=>result(svg,"",stats,notes,values,keys);
export default [
  {
    id:"conditional-probability",title:"条件概率：换一个观察的整体",category:"概率与统计",level:"初等数学 / 进阶数学",symbolTex:"P(A\\mid B)",
    summary:"把概率铺成面积，观察已知一个事件发生后，计算比例的整体怎样改变。",
    question:"已知 B 发生后，为什么要用 B 的全部面积作分母，而不是整个正方形？",
    keywords:"条件概率 贝叶斯 独立事件 面积模型 conditional probability Bayes",animate:"a",
    controls:[control("a","事件 A 的概率",0,1,.05,.4),control("ba","A 发生时 B 的概率",0,1,.05,.75),control("bn","A 不发生时 B 的概率",0,1,.05,.25)],
    presets:[{label:"相互独立",values:{a:.4,ba:.5,bn:.5}},{label:"B 在 A 中更常见",values:{a:.4,ba:.75,bn:.25}},{label:"B 不可能发生",values:{a:.4,ba:0,bn:0}}],
    tex:()=>"\\begin{aligned}P(B)&=P(A)P(B\\mid A)+P(A^c)P(B\\mid A^c)\\\\ P(A\\mid B)&=\\frac{P(A\\cap B)}{P(B)}\\quad(P(B)>0)\\end{aligned}",
    render(p){
      const table=probabilityTable(p.a,p.ba,p.bn),x=205,y=60,w=350,h=350,split=w*p.a;
      let body=rect(x,y,split,h,"green",{"fill-opacity":.08})+rect(x+split,y,w-split,h,"gold",{"fill-opacity":.1})+rect(x,y,split,h*p.ba,"blue",{"fill-opacity":.6})+rect(x+split,y,w-split,h*p.bn,"blue",{"fill-opacity":.6})+rect(x,y,w,h,"surface",{fill:"none",stroke:color("muted"),"stroke-width":1.8});
      const cells=[[x,y,split,h*p.ba,table.AB],[x,y+h*p.ba,split,h*(1-p.ba),table.AnotB],[x+split,y,w-split,h*p.bn,table.notAB],[x+split,y+h*p.bn,w-split,h*(1-p.bn),table.neither]];
      for(const [cx,cy,cw,ch,probability] of cells)if(cw>64&&ch>35)body+=text(cx+cw/2,cy+ch/2+5,fmt(probability*100,2)+"%",{"text-anchor":"middle","font-size":19});
      if(split>25)body+=text(x+split/2,y-20,"A",{"text-anchor":"middle","font-size":18});
      if(w-split>25)body+=text(x+split+(w-split)/2,y-20,"Aᶜ",{"text-anchor":"middle","font-size":18});
      body+=text(380,431,"整个正方形面积为 1，蓝色部分合起来代表 B",{"text-anchor":"middle",fill:color("muted")});
      return finish(body,[stat("P(A)",fmt(p.a,6)),stat("P(B)",fmt(table.pB,6)),stat("P(A ∩ B)",fmt(table.AB,6)),stat("P(A | B)",table.posterior===null?"未定义":fmt(table.posterior,6))],
        ["竖向分区先区分 A 与它的补集；每一列中蓝色高度比例由对应的条件概率决定。格子中的百分数是格子占整个正方形的概率。",table.pB===0?"此时 B 的概率为零，不能把它作为条件去相除，所以 P(A | B) 未定义。":"把注意力限制在全部蓝色面积中，再看其中多少落在 A 这一列，就得到 P(A | B)。条件概率一般不等于 P(B | A)。"],
        {pA:p.a,...table,total:table.AB+table.AnotB+table.notAB+table.neither},legend(["blue","事件 B 的全部面积"],["green","左列：事件 A"],["gold","右列：A 的补集"]));
    }
  },
  {
    id:"venn-sets",title:"集合与面积：为什么并集要减一次交集",category:"概率与统计",level:"初等数学",symbolTex:"A\\cup B",
    summary:"移动两个圆形区域，比较交集、并集，以及重复计算的那一部分。",
    question:"直接把两个圆的面积相加，重叠区域会被算了几次？完全分开时公式还成立吗？",
    keywords:"集合 交集 并集 容斥 Venn sets union intersection",animate:"d",
    controls:[control("d","两个圆心之间的距离 d",0,3,.05,1)],
    presets:[{label:"完全重合",values:{d:0}},{label:"部分重叠",values:{d:1}},{label:"刚好外切",values:{d:2}},{label:"完全分开",values:{d:3}}],
    tex:()=>"S(A\\cup B)=S(A)+S(B)-S(A\\cap B)",
    render(p){
      const overlap=circleOverlap(p.d),union=2*Math.PI-overlap,g=new Graph({xmin:-3.2,xmax:3.2,ymin:-1.65,ymax:1.65,equal:true,id:"venn-plot",xticks:[],yticks:[]});
      const ax=g.X(-p.d/2),bx=g.X(p.d/2),cy=g.Y(0),r=Math.abs(g.X(1)-g.X(0));
      const clip=tag("defs",{},tag("clipPath",{id:"venn-intersection-clip"},circle(ax,cy,r,"green")));
      const body=clip+circle(ax,cy,r,"green",{"fill-opacity":.16,stroke:color("green"),"stroke-width":2.2})+circle(bx,cy,r,"blue",{"fill-opacity":.16,stroke:color("blue"),"stroke-width":2.2})+tag("g",{"clip-path":"url(#venn-intersection-clip)"},circle(bx,cy,r,"pink",{"fill-opacity":.44}))+text(ax,cy-r-24,"A",{"text-anchor":"middle","font-size":20,fill:color("green")})+text(bx,cy+r+31,"B",{"text-anchor":"middle","font-size":20,fill:color("blue")});
      return finish(g.render(body),[stat("单个圆的面积",fmt(Math.PI,6)),stat("交集面积",fmt(overlap,6)),stat("并集面积",fmt(union,6)),stat("直接相加时多算的面积",fmt(overlap,6))],
        ["每个圆的半径都是 1，粉色部分属于两个集合，称为交集；两圆覆盖的全部区域称为并集。","本图按平面区域的面积计算，不是数有限集合的元素个数。把两圆面积直接相加会把交集重复算一次，因此要减掉一次。"],
        {distance:p.d,overlap,union,singleArea:Math.PI,doubleCount:overlap},legend(["green","集合 A"],["blue","集合 B"],["pink","交集 A ∩ B"]));
    }
  },
  {
    id:"mean-median",title:"平均数与中位数：一个大数的影响",category:"概率与统计",level:"初等数学",symbolTex:"\\bar x\\;\\text{与中位数}",
    summary:"只移动七个观测值中的一个，观察平均数、中位数和分散程度怎样回应。",
    question:"把一个数从普通范围推得很远时，平均数和中位数哪一个变化更明显？",
    keywords:"平均数 中位数 离群值 标准差 描述统计 mean median outlier",animate:"x",
    controls:[control("x","可变的第七个观测值",0,30,1,8)],
    presets:[{label:"普通的一组数",values:{x:8}},{label:"一个很大的数",values:{x:30}},{label:"一个较小的数",values:{x:0}}],
    tex:()=>"\\bar x=\\frac17\\sum_{i=1}^{7}x_i,\\qquad\\text{中位数为排序后的第 4 个数}",
    render(p){
      const data=[2,3,4,5,6,7,p.x],summary=describeData(data),g=new Graph({xmin:0,xmax:32,ymin:0,ymax:3.3,id:"mean-median-plot",xticks:[0,5,10,15,20,25,30].map(x=>[x,x]),yticks:[]});
      let body=g.segment(summary.mean,.25,summary.mean,2.8,"blue",{"stroke-width":3})+g.segment(summary.median,.25,summary.median,2.8,"gold",{"stroke-dasharray":"7 5","stroke-width":2.4});
      const levels=new Map();data.forEach((x,j)=>{const level=levels.get(x)||0;levels.set(x,level+1);body+=g.point(x,1.8+.35*level,8,j===6?"pink":"green");});
      const svg=text(380,35,"固定的六个数：2，3，4，5，6，7；粉点由你来调节",{"text-anchor":"middle","font-size":17})+g.render(body)+text(380,461,"重叠的观测值上下叠放，表示同一位置有多个数据",{"text-anchor":"middle",fill:color("muted")});
      return finish(svg,[stat("平均数",fmt(summary.mean,6)),stat("中位数",fmt(summary.median)),stat("极差",fmt(summary.range)),stat("总体标准差",fmt(summary.standardDeviation,6))],
        ["平均数用到了所有数据的大小；中位数关注排序后中间的那个位置。本实验只改变第七个数，其余六个保持不变。","很大的观测值会明显拉动平均数，但中位数往往变化较小。这里按整组七个数据计算总体标准差，分母使用 7。"],
        {data,...summary},legend(["green","固定观测值"],["pink","可变观测值"],["blue","平均数位置"],["gold","中位数位置"]));
    }
  }
];
