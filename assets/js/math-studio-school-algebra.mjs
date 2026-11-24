import {Graph,control,fmt,result,stat,legend,color,text,bounds} from "./math-studio-core.mjs?v=school3";
import {intersectLines,solveQuadratic,numberTex as n} from "./math-studio-numerics.mjs?v=school3";
const finish=(svg,stats,notes,values,keys)=>result(svg,"",stats,notes,values,keys);
function polynomial(a,b,c){
  const terms=[[a,"x^2"],[b,"x"],[c,""]].filter(([v])=>Math.abs(v)>1e-10);
  return terms.map(([v,t],j)=>(v<0?"-":j?"+":"")+(t&&Math.abs(v)===1?"":n(Math.abs(v)))+t).join("")||"0";
}
export default [
  {
    id:"linear-system",title:"二元一次方程组：交点就是解",category:"函数与代数",level:"初等数学",symbolTex:"\\ell_1\\cap\\ell_2",
    summary:"调整两条直线，亲眼区分唯一解、平行无解和重合时的无穷多解。",
    question:"两条直线越来越接近平行时，交点会怎样移动？斜率相同就一定重合吗？",
    keywords:"二元一次方程组 直线 交点 平行 重合 linear system simultaneous equations",animate:"m2",
    controls:[control("m1","第一条直线斜率 m₁",-2,2,.25,1),control("b1","第一条直线截距 b₁",-4,4,.25,0),control("m2","第二条直线斜率 m₂",-2,2,.25,-1),control("b2","第二条直线截距 b₂",-4,4,.25,2)],
    presets:[{label:"相交：唯一解",values:{m1:1,b1:0,m2:-1,b2:2}},{label:"平行：无解",values:{m1:1,b1:0,m2:1,b2:2}},{label:"重合：无穷多解",values:{m1:1,b1:0,m2:1,b2:0}}],
    tex:p=>"\\begin{cases}y="+polynomial(0,p.m1,p.b1)+"\\\\ y="+polynomial(0,p.m2,p.b2)+"\\end{cases}",
    render(p){
      const solution=intersectLines(p.m1,p.b1,p.m2,p.b2),point=solution.point;
      const xmin=Math.min(-5,point?point[0]-1:0),xmax=Math.max(5,point?point[0]+1:0),ymin=Math.min(-5,point?point[1]-1:0),ymax=Math.max(5,point?point[1]+1:0);
      const g=new Graph({xmin,xmax,ymin,ymax,equal:true,id:"linear-system-plot"});
      const body=g.curve(x=>p.m1*x+p.b1,"green")+g.curve(x=>p.m2*x+p.b2,"blue",{"stroke-dasharray":"8 5"})+(point?g.point(...point,7,"gold"):"");
      const type={unique:"唯一解",parallel:"无解",coincident:"无穷多解"}[solution.type];
      return finish(g.render(body),[stat("方程组的解",type),stat("交点横坐标 x",point?fmt(point[0],6):"不适用"),stat("交点纵坐标 y",point?fmt(point[1],6):"不适用"),stat("两条直线的斜率差",fmt(p.m1-p.m2))],
        [solution.type==="unique"?"交点同时落在两条直线上，因此它的横纵坐标同时满足两个方程。坐标轴会适当扩展，以保留交点。":solution.type==="parallel"?"斜率相同、截距不同，两条直线平行，没有同时满足两个方程的点。":"斜率和截距都相同，两条直线完全重合，线上每一点都满足两个方程。","接近平行时，斜率的微小差异可能让交点移动很远；读图时应留意坐标轴刻度。"],
        {...solution,slopeDifference:p.m1-p.m2},legend(["green","第一个方程"],["blue","第二个方程"],["gold","同时满足两式的点"]));
    }
  },
  {
    id:"quadratic-roots",title:"判别式：抛物线与横轴见几次面",category:"函数与代数",level:"初等数学",symbolTex:"\\Delta=b^2-4ac",
    summary:"改变二次方程的系数，把实根个数与函数图像的横轴交点联系起来。",
    question:"两个交点合成一个时，图像在横轴处发生了什么？二次项系数变成零后呢？",
    keywords:"一元二次方程 实根 判别式 重根 零点 quadratic roots discriminant",animate:"c",
    controls:[control("a","二次项系数 a",-2,2,.25,1),control("b","一次项系数 b",-5,5,.25,0),control("c","常数项 c",-5,5,.25,-1)],
    presets:[{label:"两个实根",values:{a:1,b:0,c:-1}},{label:"一个二重根",values:{a:1,b:-2,c:1}},{label:"没有实根",values:{a:1,b:0,c:1}},{label:"退化为一次方程",values:{a:0,b:2,c:-1}}],
    tex:p=>"\\begin{aligned}f(x)&="+polynomial(p.a,p.b,p.c)+"\\\\ "+(p.a===0?"a&=0\\quad\\text{此时不使用二次方程判别式}":"\\Delta&=b^2-4ac="+n(p.b*p.b-4*p.a*p.c)+"\\\\ x&=\\frac{-b\\pm\\sqrt{\\Delta}}{2a}\\quad(\\Delta\\ge0)")+"\\end{aligned}",
    render(p){
      const solution=solveQuadratic(p.a,p.b,p.c),f=x=>p.a*x*x+p.b*x+p.c,vertex=p.a!==0?[-p.b/(2*p.a),p.c-p.b*p.b/(4*p.a)]:null;
      const xs=[...solution.roots,...(vertex?[vertex[0]]:[])],xmin=Math.min(-5,...xs.map(x=>x-1)),xmax=Math.max(5,...xs.map(x=>x+1));
      const ymin=Math.min(-6,p.c-1,vertex?vertex[1]-1:0),ymax=Math.max(6,p.c+1,vertex?vertex[1]+1:0),g=new Graph({xmin,xmax,ymin,ymax,id:"quadratic-roots-plot"});
      let body=g.curve(f);for(const x of solution.roots)body+=g.point(x,0,7,"blue");
      if(vertex)body+=g.point(...vertex,5,"gold");
      const rootText=solution.roots.length?solution.roots.map(x=>"x = "+fmt(x,6)).join("；"):solution.type==="all"?"任意实数":"无实数解";
      const kind={two:"两个不同实根",double:"一个二重根",none:"没有实根",linear:"一次方程的一个解",all:"恒等式：所有实数",empty:"常数方程：无解"}[solution.type];
      return finish(g.render(body),[stat("实数解的情况",kind),stat("判别式 Δ",solution.discriminant===null?"不适用":fmt(solution.discriminant)),stat("方程的解",rootText),stat("二次项是否存在",p.a===0?"不存在":"存在")],
        [p.a===0?"a = 0 后，表达式不再是二次函数；应按一次方程或常数方程判断，不能继续套二次方程求根公式。":"蓝点是横轴交点；判别式大于零时有两个交点，等于零时相切，小于零时没有实数交点。","金点表示二次函数的顶点。图形范围会随实根和顶点调整，避免把关键位置裁掉。"],
        {...solution,vertex},legend(["green","函数图像"],["blue","实数解"],["gold","二次函数顶点"]));
    }
  },
  {
    id:"absolute-inequality",title:"绝对值不等式：到中心的距离",category:"函数与代数",level:"初等数学",symbolTex:"|x-c|\\le r",
    summary:"把绝对值理解成距离，在函数图像和数轴区间之间来回对照。",
    question:"允许距离为零时，解集会消失，还是只剩一个点？",
    keywords:"绝对值 不等式 距离 解集 闭区间 absolute inequality interval",animate:"t",
    controls:[control("c","距离中心 c",-3,3,.25,0),control("r","允许的最大距离 r",0,4,.25,2),control("t","待检查的位置 x",-8,8,.25,1)],
    presets:[{label:"在允许范围内",values:{c:0,r:2,t:1}},{label:"超出允许范围",values:{c:0,r:2,t:3}},{label:"只剩一个点",values:{c:1,r:0,t:1}}],
    tex:p=>"|x-"+(p.c<0?"("+n(p.c)+")":n(p.c))+"|\\le"+n(p.r)+"\\quad\\Longleftrightarrow\\quad x\\in["+n(p.c-p.r)+","+n(p.c+p.r)+"]",
    render(p){
      const left=p.c-p.r,right=p.c+p.r,distance=Math.abs(p.t-p.c),satisfies=distance<=p.r+1e-10;
      const g=new Graph({xmin:Math.min(-8,left-1,p.t-1),xmax:Math.max(8,right+1,p.t+1),ymin:-1.7,ymax:Math.max(7,distance+1),id:"absolute-inequality-plot"});
      const body=g.rectangle(left,0,right,g.ymax,"green",{"fill-opacity":.08})+g.curve(x=>Math.abs(x-p.c))+g.segment(g.xmin,p.r,g.xmax,p.r,"blue",{"stroke-dasharray":"7 5"})+g.segment(left,-1,right,-1,"green",{"stroke-width":5})+g.point(left,-1,5)+g.point(right,-1,5)+g.segment(p.t,0,p.t,distance,"gold",{"stroke-dasharray":"5 5"})+g.point(p.t,distance,7,satisfies?"gold":"pink");
      return finish(g.render(body),[stat("左边界",fmt(left)),stat("右边界",fmt(right)),stat("当前距离 |x − c|",fmt(distance)),stat("当前位置是否满足条件",satisfies?"满足":"不满足")],
        ["蓝色水平线给出允许的最大距离；绿色图像不超过这条线的部分，对应下方绿色解集区间。",p.r===0?"允许距离为零时，只有中心这一点满足条件。闭区间两端都取到同一个位置。":"不等号包含等号，所以区间的两个端点都属于解集，用实心点表示。"],
        {left,right,distance,satisfies},legend(["green","距离函数与解集"],["blue","允许距离"],["gold","范围内的观察点"],["pink","范围外的观察点"]));
    }
  },
  {
    id:"arithmetic-sequence",title:"等差数列：每一步增加同样多",category:"数列与级数",level:"初等数学",symbolTex:"a_n=a_1+(n-1)d",
    summary:"让一串离散数值按相同的差递增或递减，再观察前若干项的和。",
    question:"把第一项与最后一项配成一对，第二项与倒数第二项再配一对，和有什么规律？",
    keywords:"等差数列 公差 通项 前n项和 arithmetic sequence series",animate:"N",
    controls:[control("a1","第一项 a₁",-3,5,.5,1),control("d","每一步的公差 d",-2,3,.25,1),control("N","显示的项数 N",1,20,1,8)],
    presets:[{label:"连续奇数",values:{a1:1,d:2,N:8}},{label:"逐步递减",values:{a1:5,d:-1,N:8}},{label:"每项都一样",values:{a1:3,d:0,N:8}}],
    tex:()=>"\\begin{aligned}a_n&=a_1+(n-1)d\\\\ S_N&=\\frac N2(a_1+a_N)\\end{aligned}",
    render(p){
      const terms=Array.from({length:p.N},(_,j)=>p.a1+j*p.d),last=terms.at(-1),sum=p.N*(p.a1+last)/2,[ymin,ymax]=bounds(terms,.18);
      const g=new Graph({xmin:0,xmax:p.N+1,ymin,ymax,id:"arithmetic-sequence-plot",xticks:Array.from({length:p.N},(_,j)=>j+1).filter(j=>p.N<=12||j%2===0).map(j=>[j,j])});
      let body="";terms.forEach((value,j)=>{body+=g.rectangle(j+.72,0,j+1.28,value,value<0?"pink":"green",{"fill-opacity":.22})+g.point(j+1,value,4,j===0||j===p.N-1?"gold":"green");});
      return finish(g.render(body),[stat("末项 aₙ",fmt(last)),stat("公差 d",fmt(p.d)),stat("首尾配对的和",fmt(p.a1+last)),stat("前 N 项的和",fmt(sum))],
        ["横轴表示项的序号，只有整数位置上的数值才是数列的项；柱子用来比较大小和正负。","公差固定，任意相邻两项的差都相同。首尾对称的两项之和相同，因此可用平均项值乘项数求和；项数为奇数时公式仍成立。"],
        {terms,last,sum,pairSum:p.a1+last,difference:p.d},legend(["green","非负项"],["pink","负项"],["gold","首项与末项"]));
    }
  }
];
