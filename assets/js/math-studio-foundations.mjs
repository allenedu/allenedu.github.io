import {Graph,control,fmt,result,stat,legend,color,tag,poly,rect,text,line,circle,px} from "./math-studio-core.mjs?v=studio2";
import {choose,numberTex as n} from "./math-studio-numerics.mjs?v=studio2";
const finish=(svg,stats,notes,values,keys)=>result(svg,"",stats,notes,values,keys);
const sector=(cx,cy,r,angle,half,name)=>{
  const points=[[cx,cy]];
  const steps=Math.max(8,Math.ceil(half*28));
  for(let j=0;j<=steps;j++){const t=angle-half+2*half*j/steps;points.push([cx+r*Math.cos(t),cy+r*Math.sin(t)]);}
  return poly(points,name,{stroke:"var(--ms-surface)","stroke-width":1,"fill-opacity":.8});
};
export default [
  {
    id:"fractions",title:"分数：从一份到几个整体",category:"数与图形",level:"初等数学",symbolTex:"\\frac{m}{n}",
    summary:"把圆平均分成若干份，再涂色；分子超过分母时，看看会发生什么。",
    question:"分子、分母同时扩大两倍，涂色面积占一个整体的比例会变吗？",
    keywords:"分数 假分数 带分数 等分 fraction numerator denominator",animate:"m",
    controls:[control("n","每个整体的等份数 n",1,12,1,5),control("m","涂色份数 m",0,12,1,3)],
    presets:[{label:"一半",values:{n:4,m:2}},{label:"超过一个整体",values:{n:5,m:8}},{label:"等值分数",values:{n:10,m:6}}],
    tex:p=>"\\frac{"+p.m+"}{"+p.n+"}"+(p.m>=p.n?"="+Math.floor(p.m/p.n)+(p.m%p.n?"+\\frac{"+(p.m%p.n)+"}{"+p.n+"}":""):p.m===0?"=0":""),
    render(p){
      const value=p.m/p.n,units=Math.max(1,Math.ceil(value)),cols=Math.min(4,units),rows=Math.ceil(units/cols);
      const radius=Math.min(130,270/cols,135/rows),cellW=630/cols,cellH=310/rows;
      let body="";
      for(let u=0;u<units;u++){
        const cx=65+cellW*(u%cols+.5),cy=45+cellH*(Math.floor(u/cols)+.5),filled=Math.min(p.n,Math.max(0,p.m-u*p.n));
        for(let j=0;j<p.n;j++)body+=sector(cx,cy,radius,-Math.PI/2+(2*j+1)*Math.PI/p.n,Math.PI/p.n,j<filled?"green":"grid");
        body+=circle(cx,cy,radius,"surface",{fill:"none",stroke:color("muted"),"stroke-width":1.2});
      }
      const max=Math.max(2,Math.ceil(value)),y=417,x0=85,w=590;
      body+=line(x0,y,x0+w,y,"muted",{"stroke-width":1.5});
      for(let j=0;j<=max;j++)body+=line(x0+j/max*w,y-6,x0+j/max*w,y+6,"muted")+text(x0+j/max*w,y+28,j,{"text-anchor":"middle"});
      body+=circle(x0+value/max*w,y,7)+text(380,31,"相同大小的圆，代表相同的一个整体",{"text-anchor":"middle",fill:color("muted")});
      return finish(body,[stat("涂色份数",p.m),stat("每个整体的等份数",p.n),stat("小数表示（约）",fmt(value,6)),stat("完整涂满的圆",Math.floor(value))],
        ["分母决定每个整体怎样等分，分子决定总共取了多少份。",p.m>p.n?"分子大于分母时，需要超过一个整体来表示；数轴上的点也会越过 1。":"把分子和分母按同一倍数扩大，会改变每一份的大小和份数，但不改变分数的值。"],
        {value,whole:Math.floor(value),remainder:p.m%p.n,units},legend(["green","已取的份数"],["grid","未取的份数"]));
    }
  },
  {
    id:"percentages",title:"百分比：把整体分成一百格",category:"数与图形",level:"初等数学",symbolTex:"p\\%",
    summary:"在百格图上调整比例，再看看同一比例对应多少实际数量。",
    question:"同样是百分之二十，为什么换一个整体，实际数量也会改变？",
    keywords:"百分比 百分数 比例 percentage percent 百格",animate:"p",
    controls:[control("p","所占百分比 p",0,100,1,35,{unit:"%"}),control("total","整体数量",20,500,10,200)],
    presets:[{label:"一半",values:{p:50,total:200}},{label:"四分之一",values:{p:25,total:200}},{label:"换一个整体",values:{p:35,total:400}}],
    tex:p=>"\\frac{"+p.p+"}{100}\\times "+p.total+"="+n(p.total*p.p/100),
    render(p){
      let body=text(225,45,"一百格，代表同一个整体",{"text-anchor":"middle","font-size":18});
      for(let j=0;j<100;j++)body+=rect(80+(j%10)*29,75+Math.floor(j/10)*29,25,25,j<p.p?"green":"grid",{rx:3});
      body+=rect(445,160,235,65,"grid",{rx:8})+rect(445,160,235*p.p/100,65,"green",{rx:5})+text(562,125,"实际数量的同一比例",{"text-anchor":"middle","font-size":18})+text(562,275,"整体 = "+p.total,{"text-anchor":"middle","font-size":21})+text(562,319,"部分 = "+fmt(p.total*p.p/100),{"text-anchor":"middle","font-size":21,fill:color("green")})+text(380,426,"一格表示整体的百分之一",{"text-anchor":"middle",fill:color("muted")});
      return finish(body,[stat("比例",p.p+"%"),stat("整体数量",p.total),stat("对应数量",fmt(p.total*p.p/100)),stat("剩余数量",fmt(p.total*(1-p.p/100)))],
        ["百格图描述比例；右侧色条把这个比例应用到实际数量。","固定百分比时，整体翻倍，对应的部分也翻倍。百分比相加前，要先确认比较的是不是同一个整体。"],
        {ratio:p.p/100,part:p.total*p.p/100,remainder:p.total*(1-p.p/100)},legend(["green","所占部分"],["grid","剩余部分"]));
    }
  },
  {
    id:"completing-square",title:"完全平方：把代数拼成面积",category:"数与图形",level:"初等数学",symbolTex:"(a+b)^2",
    summary:"把一个大正方形切成四块，看中间的两倍乘积从哪里来。",
    question:"为什么完全平方公式中有两块乘积面积，而不是一块？",
    keywords:"完全平方 配方 面积 代数 恒等式 completing square identity",animate:"b",
    controls:[control("a","第一段长度 a",1,5,.25,3),control("b","第二段长度 b",.25,3,.25,1)],
    presets:[{label:"两段一样长",values:{a:2,b:2}},{label:"一大一小",values:{a:4,b:1}}],
    tex:p=>"\\begin{aligned}(a+b)^2&=a^2+2ab+b^2\\\\ ("+n(p.a)+"+"+n(p.b)+")^2&="+n((p.a+p.b)**2)+"\\end{aligned}",
    render(p){
      const s=300/(p.a+p.b),x=225,y=75,A=p.a*s,B=p.b*s;
      const body=rect(x,y,A,A,"green",{"fill-opacity":.22,stroke:color("green")})+rect(x+A,y,B,A,"blue",{"fill-opacity":.25,stroke:color("blue")})+rect(x,y+A,A,B,"blue",{"fill-opacity":.25,stroke:color("blue")})+rect(x+A,y+A,B,B,"gold",{"fill-opacity":.3,stroke:color("gold")})+text(x+A/2,y+A/2+7,"a²",{"text-anchor":"middle","font-size":24})+text(x+A+B/2,y+A/2+5,"ab",{"text-anchor":"middle","font-size":19})+text(x+A/2,y+A+B/2+5,"ab",{"text-anchor":"middle","font-size":19})+text(x+A+B/2,y+A+B/2+5,"b²",{"text-anchor":"middle","font-size":19})+text(x+A/2,y-18,"a = "+fmt(p.a),{"text-anchor":"middle"})+text(x+A+B/2,y-18,"b = "+fmt(p.b),{"text-anchor":"middle"})+text(380,431,"四块面积相加，正好铺满大正方形",{"text-anchor":"middle",fill:color("muted")});
      return finish(body,[stat("第一块 a²",fmt(p.a*p.a)),stat("两块乘积 2ab",fmt(2*p.a*p.b)),stat("最后一块 b²",fmt(p.b*p.b)),stat("总面积",fmt((p.a+p.b)**2))],
        ["两个蓝色长方形的长和宽相同，只是摆放方向不同，所以面积之和是 2ab。","本图用正长度解释面积；得到的代数恒等式对任意实数 a、b 都成立。"],
        {a2:p.a*p.a,cross:2*p.a*p.b,b2:p.b*p.b,total:(p.a+p.b)**2},legend(["green","a²"],["blue","两块 ab"],["gold","b²"]));
    }
  },
  {
    id:"polygon-circle",title:"正多边形怎样逼近圆",category:"几何与三角",level:"初等数学 / 微积分",symbolTex:"A_n\\to\\pi r^2",
    summary:"不断增加内接正多边形的边数，同时比较周长和面积。",
    question:"边数加倍后，周长和面积分别离圆的对应值更近了吗？",
    keywords:"正多边形 圆 周长 面积 圆周率 极限 polygon circle pi",animate:"n",
    controls:[control("n","正多边形边数 n",3,64,1,6),control("r","外接圆半径 r",.5,3,.25,1)],
    presets:[{label:"三角形",values:{n:3,r:1}},{label:"正六边形",values:{n:6,r:1}},{label:"接近圆",values:{n:64,r:1}}],
    tex:()=>"\\begin{aligned}P_n&=2nr\\sin\\frac{\\pi}{n}\\longrightarrow2\\pi r\\\\ A_n&=\\frac{nr^2}{2}\\sin\\frac{2\\pi}{n}\\longrightarrow\\pi r^2\\end{aligned}",
    render(p){
      const perimeter=2*p.n*p.r*Math.sin(Math.PI/p.n),area=p.n*p.r*p.r*Math.sin(2*Math.PI/p.n)/2;
      const pts=Array.from({length:p.n},(_,j)=>[380+163*Math.cos(-Math.PI/2+2*Math.PI*j/p.n),230+163*Math.sin(-Math.PI/2+2*Math.PI*j/p.n)]);
      let body=circle(380,230,163,"surface",{fill:"none",stroke:color("muted"),"stroke-width":2,"stroke-dasharray":"5 5"})+poly(pts,"green",{"fill-opacity":.14,stroke:color("green"),"stroke-width":2.4});
      for(const q of pts)body+=line(380,230,...q,"gold",{"stroke-width":.9,"stroke-opacity":.4});
      body+=poly([[380,230],pts[0],pts[1]],"gold",{"fill-opacity":.3})+text(380,449,"一个个等腰三角形的面积，拼成整个多边形",{"text-anchor":"middle",fill:color("muted")});
      return finish(body,[stat("多边形周长",fmt(perimeter,6)),stat("圆周长",fmt(2*Math.PI*p.r,6)),stat("多边形面积",fmt(area,6)),stat("与圆的面积差",fmt(Math.PI*p.r*p.r-area,6))],
        ["半径固定时，边数越多，内接多边形的周长和面积都从下方逼近圆的对应值。","画面会按半径同步缩放，比较的是形状与数值；坐标长度由参数 r 给出。"],
        {perimeter,area,circumference:2*Math.PI*p.r,circleArea:Math.PI*p.r*p.r},legend(["green","内接正多边形"],["muted","外接圆"],["gold","一个等腰三角形"]));
    }
  },
  {
    id:"circle-area",title:"圆面积：把扇形重新排列",category:"几何与三角",level:"初等数学 / 微积分",symbolTex:"S=\\pi r^2",
    summary:"将圆切成偶数个小扇形，交错排列，观察边缘怎样逐渐变平。",
    question:"切得越来越细时，重新排列的图形为什么接近底为半个圆周、高为半径的长方形？",
    keywords:"圆面积 扇形 拼图 圆周率 极限 circle area sectors",animate:"pairs",
    controls:[control("pairs","扇形对数",3,40,1,6),control("r","圆半径 r",.5,3,.25,1)],
    presets:[{label:"分成 6 块",values:{pairs:3,r:1}},{label:"分成 80 块",values:{pairs:40,r:1}}],
    tex:()=>"S=\\pi r\\cdot r=\\pi r^2",
    render(p){
      const count=2*p.pairs,alpha=Math.PI/count,R=88,d=R*Math.sin(alpha),bottom=292,top=bottom-R*Math.cos(alpha),start=370;
      let body=text(173,105,"原来的圆",{"text-anchor":"middle","font-size":18})+text(520,105,"交错排列，面积保持不变",{"text-anchor":"middle","font-size":18});
      for(let j=0;j<count;j++){
        const name=j%2?"blue":"green";
        body+=sector(173,238,R,-Math.PI/2+(2*j+1)*alpha,alpha,name);
        const cx=start+j*d,cy=j%2?top:bottom,angle=j%2?Math.PI/2:-Math.PI/2;
        body+=sector(cx,cy,R,angle,alpha,name);
      }
      body+=line(start-d,332,start+(count-1)*d,332,"gold",{"stroke-width":1.5})+text(start+(count-2)*d/2,361,"底边逐渐接近 πr",{"text-anchor":"middle"})+text(520,397,"高度逐渐接近 r",{"text-anchor":"middle"})+text(173,375,"扇形数 n = "+count,{"text-anchor":"middle"});
      const base=count*p.r*Math.sin(alpha),height=p.r*Math.cos(alpha),approx=base*height,exact=Math.PI*p.r*p.r;
      return finish(body,[stat("扇形块数 n",count),stat("近似底边",fmt(base,6)),stat("圆的准确面积",fmt(exact,6)),stat("近似矩形面积",fmt(approx,6))],
        ["重新排列不增减任何一块扇形，所以总面积始终不变。有限块时边缘仍是弧线，还不是准确的长方形。","增加扇形数量，弧形边缘越来越平；近似底边趋近 πr，高度趋近 r。"],
        {count,base,height,approximation:approx,exact,error:exact-approx},legend(["green","一组扇形"],["blue","另一组扇形"]));
    }
  },
  {
    id:"similar-triangles",title:"相似图形：长度与面积的缩放",category:"几何与三角",level:"初等数学",symbolTex:"S_2=k^2S_1",
    summary:"按同一个倍率放大三角形，比较边长和面积为什么变化得不一样。",
    question:"边长放大三倍，面积是三倍还是九倍？缩小时又怎样？",
    keywords:"相似 三角形 比例 缩放 面积 similar triangles scale",animate:"k",
    controls:[control("a","原三角形的底 a",2,5,.25,3),control("h","原三角形的高 h",1,4,.25,2),control("k","长度倍率 k",.25,2,.05,1.5)],
    presets:[{label:"边长翻倍",values:{a:3,h:2,k:2}},{label:"缩小为一半",values:{a:3,h:2,k:.5}}],
    tex:()=>"a_2=ka_1,\\qquad h_2=kh_1,\\qquad S_2=k^2S_1",
    render(p){
      const unit=145/Math.max(p.a,p.h),base=p.a*unit,height=p.h*unit;
      const body=poly([[90,370],[90+base,370],[90,370-height]],"green",{"fill-opacity":.18,stroke:color("green"),"stroke-width":2.5})+poly([[425,370],[425+p.k*base,370],[425,370-p.k*height]],"blue",{"fill-opacity":.18,stroke:color("blue"),"stroke-width":2.5})+text(90+base/2,402,"a = "+fmt(p.a),{"text-anchor":"middle"})+text(425+p.k*base/2,402,"ka = "+fmt(p.k*p.a),{"text-anchor":"middle"})+text(190,50,"原图形",{"text-anchor":"middle","font-size":19})+text(570,50,"按相同比例缩放",{"text-anchor":"middle","font-size":19});
      const area=p.a*p.h/2;
      return finish(body,[stat("长度倍率",fmt(p.k)),stat("面积倍率 k²",fmt(p.k*p.k)),stat("原面积",fmt(area)),stat("新面积",fmt(area*p.k*p.k))],
        ["底和高都乘以 k，面积中的两个长度因子一起变化，所以面积乘以 k²。","两幅图使用相同的长度比例。角度不变，边长成比例，是相似图形的关键。"],
        {area,scaledArea:area*p.k*p.k,lengthRatio:p.k,areaRatio:p.k*p.k},legend(["green","原三角形"],["blue","相似三角形"]));
    }
  },
  {
    id:"pascal",title:"杨辉三角与二项式系数",category:"数列与级数",level:"初等数学",symbolTex:"\\binom{n}{k}",
    summary:"选中一行和一个位置，观察每个系数怎样由上一行相邻两数相加得到。",
    question:"为什么每一行的数字之和总是二的整数次幂？",
    keywords:"杨辉三角 Pascal 二项式 组合数 binomial coefficient",animate:"n",
    controls:[control("n","展开次数 n",0,8,1,4),control("k","选中的位置 k",0,8,1,2)],
    presets:[{label:"平方展开",values:{n:2,k:1}},{label:"八次展开",values:{n:8,k:4}},{label:"超出本行",values:{n:3,k:5}}],
    tex:p=>"\\begin{aligned}(a+b)^{"+p.n+"}&=\\sum_{j=0}^{"+p.n+"}\\binom{"+p.n+"}{j}a^{"+p.n+"-j}b^j\\\\ \\sum_{j=0}^{"+p.n+"}\\binom{"+p.n+"}{j}&=2^{"+p.n+"}\\end{aligned}",
    render(p){
      let body="";
      for(let row=0;row<=p.n;row++)for(let k=0;k<=row;k++){
        const x=380+(2*k-row)*32,y=43+row*44,selected=row===p.n&&k===p.k,parent=row===p.n-1&&(k===p.k||k===p.k-1)&&p.k<=p.n;
        body+=circle(x,y,19,selected?"gold":parent?"blue":row===p.n?"green":"grid",{"fill-opacity":selected?.5:parent?.25:row===p.n?.2:1})+text(x,y+5,choose(row,k),{"text-anchor":"middle","font-size":15});
      }
      body+=text(380,448,"每个内部数字 = 左上方数字 + 右上方数字",{"text-anchor":"middle",fill:color("muted")});
      return finish(body,[stat("所在行 n",p.n),stat("选择的位置 k",p.k),stat("组合数",choose(p.n,p.k)),stat("本行数字之和",2**p.n)],
        [p.k<=p.n?"金色数字是当前系数，蓝色数字是产生它的上一行相邻系数；每一行两端都为 1。":"选中的位置超出了本行，按组合数约定取 0。把 k 调小，便可回到本行。","令 a = b = 1，二项式展开式的左边变成 2ⁿ，右边正好是本行所有系数之和。"],
        {coefficient:choose(p.n,p.k),rowSum:2**p.n,row:Array.from({length:p.n+1},(_,k)=>choose(p.n,k))},legend(["green","选中的一行"],["gold","当前系数"],["blue","上一行相邻系数"]));
    }
  }
];
