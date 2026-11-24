import {Graph,control,fmt,result,stat,legend,color,radians,degrees,text} from "./math-studio-core.mjs?v=school3";
import {angleAt,numberTex as n} from "./math-studio-numerics.mjs?v=school3";
const finish=(svg,stats,notes,values,keys)=>result(svg,"",stats,notes,values,keys);
const distance=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]);
function corner(g,o,a,b,r,name){
  const start=Math.atan2(a[1]-o[1],a[0]-o[0]),end=Math.atan2(b[1]-o[1],b[0]-o[0]);
  let delta=((end-start+Math.PI*3)%(2*Math.PI))-Math.PI;
  const points=[o];for(let j=0;j<=35;j++){const t=start+delta*j/35;points.push([o[0]+r*Math.cos(t),o[1]+r*Math.sin(t)]);}
  return {wedge:g.polygon(points,name,{"fill-opacity":.25}),bisector:start+delta/2};
}
export default [
  {
    id:"triangle-angles",title:"三角形内角和：形状变，和不变",category:"几何与三角",level:"初等数学",symbolTex:"\\alpha+\\beta+\\gamma=180^\\circ",
    summary:"移动三角形顶点，同时观察三个内角怎样此消彼长。",
    question:"顶点移到很偏的位置，出现钝角后，三个内角的和还会改变吗？",
    keywords:"三角形 内角和 锐角 钝角 角度 triangle angles angle sum",animate:"x",
    controls:[control("x","顶点的横向位置",-3,3,.1,0),control("h","顶点离底边的高度",.75,4,.25,2.5)],
    presets:[{label:"左右对称",values:{x:0,h:2.5}},{label:"一个钝角",values:{x:0,h:.75}},{label:"顶点偏向一侧",values:{x:3,h:2}}],
    tex:()=>"\\alpha+\\beta+\\gamma=180^\\circ",
    render(p){
      const A=[-2,0],B=[2,0],C=[p.x,p.h],angles=[degrees(angleAt(B,A,C)),degrees(angleAt(A,B,C)),degrees(angleAt(A,C,B))];
      const g=new Graph({xmin:-3.8,xmax:3.8,ymin:-.8,ymax:4.8,equal:true,id:"triangle-angles-plot"});
      let body=g.polygon([A,B,C],"green",{"fill-opacity":.09,stroke:color("green"),"stroke-width":2.5});
      [[A,B,C,"α","gold"],[B,A,C,"β","blue"],[C,A,B,"γ","pink"]].forEach(([o,a,b,label,name],i)=>{
        const arc=corner(g,o,a,b,.28,name);body+=arc.wedge+g.point(...o,5,"green");
        const r=.65,x=o[0]+r*Math.cos(arc.bisector),y=o[1]+r*Math.sin(arc.bisector);
        body+=g.label(x,y,label+" = "+fmt(angles[i],1)+"°",{"text-anchor":"middle","font-size":16,fill:color(name)});
      });
      body+=g.label(A[0]-.15,-.38,"A")+g.label(B[0]+.1,-.38,"B")+g.label(C[0]+.12,C[1]+.28,"C");
      return finish(g.render(body),[stat("内角 α",fmt(angles[0],3)+"°"),stat("内角 β",fmt(angles[1],3)+"°"),stat("内角 γ",fmt(angles[2],3)+"°"),stat("三个内角之和",fmt(angles.reduce((a,b)=>a+b,0),6)+"°")],
        ["顶点移动时，有的角变大，有的角变小，但三个内角的和始终是平角。图中使用真实等比例坐标，角度没有被拉伸。","本实验保持顶点在底边上方，避免三点共线；显示的角度经过四舍五入，分项读数相加可能有微小舍入差。"],
        {vertices:[A,B,C],angles,sum:angles.reduce((a,b)=>a+b,0),area:2*p.h},legend(["gold","内角 α"],["blue","内角 β"],["pink","内角 γ"]));
    }
  },
  {
    id:"inscribed-angle",title:"圆周角定理：同一段弧的两个角",category:"几何与三角",level:"初等数学",symbolTex:"\\angle ACB=\\tfrac12\\angle AOB",
    summary:"固定弧的两端，把圆上的观察点移来移去，对照圆周角与圆心角。",
    question:"观察点沿同一条大弧移动时，圆周角的大小为什么不变？",
    keywords:"圆周角 圆心角 同弧 圆周角定理 inscribed angle circle theorem",animate:"phi",
    controls:[control("theta","小弧对应的圆心角 θ",20,160,1,80,{unit:"°"}),control("phi","观察点的圆周位置 φ",100,260,1,180,{unit:"°"})],
    presets:[{label:"观察点在左侧",values:{theta:80,phi:180}},{label:"沿大弧移动",values:{theta:80,phi:115}},{label:"改变对应的弧",values:{theta:140,phi:180}}],
    tex:()=>"\\angle ACB=\\frac12\\angle AOB\\quad\\text{（两角对应同一段小弧）}",
    render(p){
      const t=radians(p.theta)/2,A=[Math.cos(t),-Math.sin(t)],B=[Math.cos(t),Math.sin(t)],C=[Math.cos(radians(p.phi)),Math.sin(radians(p.phi))],O=[0,0];
      const central=degrees(angleAt(A,O,B)),inscribed=degrees(angleAt(A,C,B));
      const g=new Graph({xmin:-1.65,xmax:1.65,ymin:-1.45,ymax:1.45,equal:true,id:"inscribed-angle-plot",xticks:[],yticks:[]});
      const centerArc=corner(g,O,A,B,.24,"gold"),pointArc=corner(g,C,A,B,.2,"blue");
      let body=g.ellipse(0,0,1,1,"muted")+g.segment(...O,...A,"gold")+g.segment(...O,...B,"gold")+g.segment(...C,...A,"blue")+g.segment(...C,...B,"blue")+centerArc.wedge+pointArc.wedge;
      for(const [point,label] of [[A,"A"],[B,"B"],[C,"C"],[O,"O"]])body+=g.point(...point,5,label==="C"?"blue":"green")+g.label(point[0]*1.14+(label==="O"?-.15:0),point[1]*1.14+(label==="O"?-.2:0),label,{"text-anchor":"middle"});
      const arcPoints=Array.from({length:81},(_,j)=>{const q=-t+2*t*j/80;return [Math.cos(q),Math.sin(q)];});
      for(let j=1;j<arcPoints.length;j++)body+=g.segment(...arcPoints[j-1],...arcPoints[j],"green",{"stroke-width":5});
      return finish(g.render(body),[stat("圆心角",fmt(central,4)+"°"),stat("圆周角",fmt(inscribed,4)+"°"),stat("圆心角与圆周角之比",fmt(central/inscribed,6)),stat("圆周角对应的弧", "高亮的绿色小弧")],
        ["金色两条半径夹出圆心角，蓝色两条弦夹出圆周角；它们对应同一段绿色小弧。","观察点始终位于另一条大弧上，不经过弧的两个端点。这样的圆周角始终等于圆心角的一半。"],
        {A,B,C,central,inscribed,ratio:central/inscribed},legend(["green","两角共同对应的小弧"],["gold","圆心角"],["blue","圆周角"]));
    }
  },
  {
    id:"circle-tangent",title:"圆的切线：半径与切线垂直",category:"几何与三角",level:"初等数学",symbolTex:"PT=\\sqrt{d^2-r^2}",
    summary:"把一个点从圆内移到圆外，观察切线什么时候出现，以及切线段怎样变长。",
    question:"点在圆内、圆上和圆外时，分别能作几条切线？圆外两条切线段一样长吗？",
    keywords:"切线 圆 半径 垂直 切线长 circle tangent right angle",animate:"d",
    controls:[control("d","点到圆心的距离 d",.5,4,.05,2)],
    presets:[{label:"圆内：没有切线",values:{d:.5}},{label:"圆上：一条切线",values:{d:1}},{label:"圆外：两条切线",values:{d:2}}],
    tex:p=>"r=1,\\quad OP="+n(p.d)+",\\qquad "+(p.d>=1?"PT=\\sqrt{d^2-1}\\quad(d\\ge1)":"d<1\\quad\\text{点在圆内，没有实切线}"),
    render(p){
      const outside=p.d>1+1e-10,onCircle=Math.abs(p.d-1)<1e-10,tangentCount=outside?2:onCircle?1:0,length=p.d>=1?Math.sqrt(Math.max(0,p.d*p.d-1)):null;
      const g=new Graph({xmin:-1.7,xmax:4.6,ymin:-2,ymax:2,equal:true,id:"circle-tangent-plot"});
      let body=g.ellipse(0,0,1,1)+g.segment(0,0,p.d,0,"muted",{"stroke-dasharray":"5 5"})+g.point(0,0,5,"muted")+g.point(p.d,0,7,"blue")+g.label(-.2,-.3,"O")+g.label(p.d+.1,-.3,"P");
      const tangentPoints=[];
      if(outside){
        for(const sign of [-1,1]){
          const T=[1/p.d,sign*Math.sqrt(1-1/(p.d*p.d))];tangentPoints.push(T);
          body+=g.segment(0,0,...T,"gold")+g.segment(p.d,0,...T,"blue",{"stroke-width":2.7})+g.point(...T,6,"gold")+g.label(T[0]+.1,T[1]+sign*.24,sign>0?"T₁":"T₂",{fill:color("gold")});
          const u=[-T[0],-T[1]],v=[(p.d-T[0])/length,-T[1]/length],s=.11;
          body+=g.segment(T[0]+u[0]*s,T[1]+u[1]*s,T[0]+(u[0]+v[0])*s,T[1]+(u[1]+v[1])*s,"gold",{"stroke-width":1.4})+g.segment(T[0]+v[0]*s,T[1]+v[1]*s,T[0]+(u[0]+v[0])*s,T[1]+(u[1]+v[1])*s,"gold",{"stroke-width":1.4});
        }
      }else if(onCircle){body+=g.segment(1,g.ymin,1,g.ymax,"blue",{"stroke-width":2.5})+g.point(1,0,6,"gold")+g.label(.65,.25,"T = P");tangentPoints.push([1,0]);}
      return finish(g.render(body),[stat("点的位置",outside?"圆外":onCircle?"圆上":"圆内"),stat("可作切线条数",tangentCount),stat("切线段长度",length===null?"不存在":fmt(length,6)),stat("半径",1)],
        [outside?"圆外有两条切线；圆心、切点、圆外点组成直角三角形，因此可以用勾股定理计算切线段长。":onCircle?"点恰好在圆上时，只有经过该点的一条切线；切线段退化为零长度。":"圆内的点无法作出实切线：任何经过它的直线都会与圆相交于两点。","切线在切点处与半径垂直；圆外同一点引出的两条切线段长度相等。"],
        {distance:p.d,tangentCount,length,tangentPoints},legend(["green","单位圆"],["blue","点与切线"],["gold","切点处的半径与直角"]));
    }
  },
  {
    id:"triangle-centroid",title:"三角形重心：三条中线相遇",category:"几何与三角",level:"初等数学",symbolTex:"CG:GM=2:1",
    summary:"改变顶点位置，观察三条中线始终相交，且重心把每条中线按相同比例分开。",
    question:"三角形变得很斜时，重心还能落在三角形内部吗？长短两段的比会变吗？",
    keywords:"三角形 中线 重心 中点 比例 centroid median midpoint",animate:"x",
    controls:[control("x","上方顶点的横坐标",-3,3,.1,.5),control("h","上方顶点的高度",.75,4,.25,3)],
    presets:[{label:"对称三角形",values:{x:0,h:3}},{label:"倾斜三角形",values:{x:3,h:1}},{label:"高而窄的视角",values:{x:-1,h:4}}],
    tex:()=>"G=\\left(\\frac{x_A+x_B+x_C}{3},\\frac{y_A+y_B+y_C}{3}\\right),\\qquad CG=2GM",
    render(p){
      const A=[-2,0],B=[2,0],C=[p.x,p.h],M=[0,0],M1=[(B[0]+C[0])/2,p.h/2],M2=[(A[0]+C[0])/2,p.h/2],G=[p.x/3,p.h/3];
      const g=new Graph({xmin:-3.8,xmax:3.8,ymin:-.8,ymax:4.8,equal:true,id:"centroid-plot"});
      let body=g.polygon([A,B,C],"green",{"fill-opacity":.08,stroke:color("green"),"stroke-width":2.5})+g.segment(...A,...M1,"muted",{"stroke-dasharray":"5 5"})+g.segment(...B,...M2,"muted",{"stroke-dasharray":"5 5"})+g.segment(...C,...G,"blue",{"stroke-width":4})+g.segment(...G,...M,"gold",{"stroke-width":4});
      for(const [point,label,dx,dy] of [[A,"A",-.2,-.3],[B,"B",.12,-.3],[C,"C",.1,.3],[M,"M",.1,-.3],[G,"G",.25,.1]])body+=g.point(...point,label==="G"?7:4,label==="G"?"pink":"green")+g.label(point[0]+dx,point[1]+dy,label);
      return finish(g.render(body),[stat("重心坐标", "("+fmt(G[0],4)+", "+fmt(G[1],4)+")"),stat("顶点到重心 CG",fmt(distance(C,G),6)),stat("重心到中点 GM",fmt(distance(G,M),6)),stat("两段长度之比",fmt(distance(C,G)/distance(G,M),6))],
        ["中线连接顶点与对边的中点。三条中线在同一个点相交，这个交点是重心。","蓝色段从顶点走到重心，金色段从重心走到中点；蓝色段的长度始终是金色段的两倍。"],
        {A,B,C,M,G,longSegment:distance(C,G),shortSegment:distance(G,M),ratio:distance(C,G)/distance(G,M),area:2*p.h},legend(["muted","另外两条中线"],["blue","顶点到重心"],["gold","重心到中点"],["pink","重心 G"]));
    }
  },
  {
    id:"rotation",title:"平面旋转：位置变，形状不变",category:"几何与三角",level:"初等数学",symbolTex:"\\begin{pmatrix}\\cos\\theta&-\\sin\\theta\\\\\\sin\\theta&\\cos\\theta\\end{pmatrix}",
    summary:"把三角形绕原点旋转，用对应边长和面积验证旋转前后的图形全等。",
    question:"转过九十度时，点的横纵坐标怎样交换？为什么到旋转中心的距离不变？",
    keywords:"旋转 全等 坐标变换 九十度 rotation isometry transformation",animate:"theta",
    controls:[control("theta","逆时针旋转角 θ",0,360,1,60,{unit:"°"})],
    presets:[{label:"旋转九十度",values:{theta:90}},{label:"旋转半圈",values:{theta:180}},{label:"转回原位",values:{theta:360}}],
    tex:()=>"\\begin{aligned}x'&=x\\cos\\theta-y\\sin\\theta\\\\ y'&=x\\sin\\theta+y\\cos\\theta\\end{aligned}",
    render(p){
      const t=radians(p.theta),original=[[1,0],[3,0],[2,2]],rotated=original.map(([x,y])=>[x*Math.cos(t)-y*Math.sin(t),x*Math.sin(t)+y*Math.cos(t)]);
      const g=new Graph({xmin:-3.6,xmax:3.6,ymin:-3.6,ymax:3.6,equal:true,id:"rotation-plot"});
      let body=g.ellipse(0,0,1,1,"muted",{"stroke-dasharray":"4 5","stroke-width":1})+g.polygon(original,"green",{"fill-opacity":.13,stroke:color("green"),"stroke-width":2.3})+g.polygon(rotated,"blue",{"fill-opacity":.15,stroke:color("blue"),"stroke-width":2.3})+g.segment(0,0,...original[2],"gold",{"stroke-dasharray":"6 5"})+g.segment(0,0,...rotated[2],"gold",{"stroke-dasharray":"6 5"})+g.point(0,0,5,"muted");
      original.forEach((point,j)=>body+=g.point(...point,4)+g.label(point[0],point[1]-.25,["A","B","C"][j],{"text-anchor":"middle"}));
      rotated.forEach((point,j)=>body+=g.point(...point,5,"blue")+g.label(point[0]+.12,point[1]+.25,["A′","B′","C′"][j],{"text-anchor":"middle",fill:color("blue")}));
      const area=Math.abs((rotated[1][0]-rotated[0][0])*(rotated[2][1]-rotated[0][1])-(rotated[1][1]-rotated[0][1])*(rotated[2][0]-rotated[0][0]))/2;
      return finish(g.render(body),[stat("原边长 AB",2),stat("旋转后边长 A′B′",fmt(distance(rotated[0],rotated[1]),6)),stat("原面积",2),stat("旋转后面积",fmt(area,6))],
        ["所有点绕同一个中心转过相同角度，图形的边长、内角和面积保持不变；金色线段表示对应点到原点的距离。","正角表示逆时针旋转；转过一整圈后回到原位。重合时两种颜色叠在一起，不表示图形消失。"],
        {original,rotated,area,side:distance(rotated[0],rotated[1]),radiusBefore:Math.hypot(...original[2]),radiusAfter:Math.hypot(...rotated[2])},legend(["green","原三角形"],["blue","旋转后的三角形"],["gold","到旋转中心的距离"]));
    }
  }
];
