/* Canonical LaTeX for every experiment, separate from screen-reader prose. */
import {piFraction} from "./math-studio-core.mjs?v=school3";
import {plainToTex} from "./math-notation.mjs?v=school3";
const n=value=>String(Number(Number(value).toFixed(8)));
const plus=value=>Math.abs(value)<1e-10?"":(value<0?" - ":" + ")+n(Math.abs(value));
const shift=value=>Math.abs(value)<1e-10?"x":"\\left(x"+plus(-value)+"\\right)";
const multiply=(a,term)=>a===1?term:a===-1?"-"+term:n(a)+"\\,"+term;
const coord=(h,k)=>"\\left("+n(h)+","+n(k)+"\\right)";
export const symbols={
  "quadratic":"x^{2}","linear":"mx+b","absolute-value":"\\lvert x\\rvert",
  "exponential":"b^{x}","logarithm":"\\log_b x","reciprocal":"\\frac{1}{x}",
  "unit-circle":"\\sin\\theta","sine-wave":"A\\sin x","pythagoras":"a^{2}+b^{2}",
  "triangle":"\\cos\\theta","ellipse":"\\mathcal{E}","vectors":"\\mathbf{u}+\\mathbf{v}",
  "complex":"z\\,w","function-limit":"\\lim","epsilon-delta":"\\varepsilon\\text{–}\\delta",
  "secant-tangent":"\\frac{\\Delta y}{\\Delta x}","derivative-sign":"f'(x)",
  "linear-approximation":"\\approx","newton":"x_{n+1}","riemann":"\\sum f_i\\Delta x",
  "signed-area":"\\pm S","fundamental-theorem":"F'=f","quadrature":"\\int",
  "between-curves":"\\int(g-f)\\,dx","arc-length":"ds",
  "geometric-series":"1+r+\\cdots","taylor":"P_n(x)","fourier":"\\sum\\sin",
  "euler":"y'=y","logistic":"y'=f(y)"
};
export function formulaTex(id,p){
  switch(id){
    case "quadratic":return "y="+(p.a===0?n(p.k):multiply(p.a,shift(p.h)+"^{2}")+plus(p.k));
    case "linear":return "y="+(p.m===0?n(p.b):multiply(p.m,"x")+plus(p.b));
    case "absolute-value":return "y="+(p.a===0?n(p.k):multiply(p.a,"\\left|x"+plus(-p.h)+"\\right|")+plus(p.k));
    case "exponential":return "y="+(p.A===1?"":n(p.A)+"\\cdot ")+n(p.b)+"^{x}";
    case "logarithm":return Math.abs(p.b-1)<1e-10?"b=1\\;\\Longrightarrow\\;\\log_b x\\;\\text{未定义}":"y=\\log_{"+n(p.b)+"}x,\\qquad x>0";
    case "reciprocal":return "y=\\frac{"+n(p.a)+"}{"+shift(p.h)+"}"+plus(p.k)+",\\qquad x\\ne "+n(p.h);
    case "unit-circle":return "\\cos^{2}\\theta+\\sin^{2}\\theta=1";
    case "sine-wave":{
      const phase=p.phi===0?"":(p.phi<0?" - ":" + ")+plainToTex(piFraction(p.phi));
      return "y="+multiply(p.A,"\\sin\\!\\left("+(p.omega===1?"x":n(p.omega)+"x")+phase+"\\right)")+plus(p.d);
    }
    case "pythagoras":return "a^{2}+b^{2}=c^{2}";
    case "triangle":return "\\begin{aligned}a^{2}&=b^{2}+c^{2}-2bc\\cos\\theta\\\\ S&=\\frac{1}{2}bc\\sin\\theta\\end{aligned}";
    case "ellipse":return "\\frac{x^{2}}{"+n(p.a*p.a)+"}+\\frac{y^{2}}{"+n(p.b*p.b)+"}=1";
    case "vectors":return "\\mathbf{u}\\cdot\\mathbf{v}=\\lVert\\mathbf{u}\\rVert\\,\\lVert\\mathbf{v}\\rVert\\cos\\theta";
    case "complex":return "zw=rs\\bigl[\\cos(\\theta+\\varphi)+i\\sin(\\theta+\\varphi)\\bigr]";
    case "function-limit":return "f(x)=\\begin{cases}x+1,&x\\ne1,\\\\"+n(p.c)+",&x=1,\\end{cases}\\qquad\\lim_{x\\to1}f(x)=2";
    case "epsilon-delta":return "0<\\lvert x-1\\rvert<\\delta\\quad\\Longrightarrow\\quad\\lvert x^{2}-1\\rvert<\\varepsilon";
    case "secant-tangent":return "\\begin{aligned}f(x)&=x^{2}\\\\ \\frac{f(x_0+h)-f(x_0)}{h}&=2x_0+h\\quad(h\\ne0)\\\\ \\lim_{h\\to0}\\frac{f(x_0+h)-f(x_0)}{h}&=2x_0\\end{aligned}";
    case "derivative-sign":return "\\begin{aligned}f(x)&=\\sin("+(p.k===1?"x":n(p.k)+"x")+")\\\\f'(x)&="+multiply(p.k,"\\cos("+(p.k===1?"x":n(p.k)+"x")+")")+"\\end{aligned}";
    case "linear-approximation":return "e^{x}\\approx e^{"+n(p.t)+"}\\left[1+"+shift(p.t)+"\\right]";
    case "newton":return "x_{n+1}=\\frac{1}{2}\\left(x_n+\\frac{2}{x_n}\\right),\\qquad f(x)=x^{2}-2";
    case "riemann":return "\\begin{aligned}\\int_0^2(x^{2}+1)\\,dx&\\approx\\sum_{i=0}^{n-1}f\\!\\left((i+\\theta)\\Delta x\\right)\\Delta x\\\\ \\Delta x&=\\frac{2}{n}\\end{aligned}";
    case "signed-area":return "\\int_a^b x\\,dx=\\frac{b^{2}-a^{2}}{2}";
    case "fundamental-theorem":return "\\begin{aligned}F(x)&=\\int_0^x\\sin t\\,dt=1-\\cos x\\\\F'(x)&=\\sin x\\end{aligned}";
    case "quadrature":return "\\int_0^2 x^{4}\\,dx=\\frac{32}{5}=6.4,\\qquad n="+n(2*p.pairs);
    case "between-curves":return "S=\\int_{-\\sqrt{c}}^{\\sqrt{c}}(c-x^{2})\\,dx=\\frac{4c\\sqrt{c}}{3}";
    case "arc-length":return "L=\\int_0^b\\sqrt{1+\\bigl[f'(x)\\bigr]^{2}}\\,dx,\\qquad f(x)=\\frac{x^{2}}{2}";
    case "geometric-series":return "\\begin{aligned}S_N&=\\sum_{k=0}^{N-1}r^k\\\\ "+(Math.abs(p.r)<1?"\\sum_{k=0}^{\\infty}r^k&=\\frac{1}{1-r}\\quad(\\lvert r\\rvert<1)":"\\lvert r\\rvert&\\ge1:\\quad\\text{无限级数不收敛}")+"\\end{aligned}";
    case "taylor":{
      const terms=Array.from({length:p.m},(_,j)=>j===0?"x":(j%2?" - ":" + ")+"\\frac{x^{"+(2*j+1)+"}}{"+(2*j+1)+"!}");
      if(p.m<=4)return "P_{"+(2*p.m-1)+"}(x)="+terms.join("");
      const rows=[];for(let j=0;j<terms.length;j+=3)rows.push(terms.slice(j,j+3).join(""));
      return "\\begin{aligned}P_{"+(2*p.m-1)+"}(x)&="+rows.join("\\\\ &\\quad")+"\\end{aligned}";
    }
    case "fourier":return "F_N(x)=\\frac{4}{\\pi}\\sum_{j=0}^{N-1}\\frac{\\sin\\!\\bigl((2j+1)x\\bigr)}{2j+1}";
    case "euler":return "\\begin{aligned}y'&=y,\\qquad y(0)=1\\\\y_{n+1}&=y_n+h\\,y_n,\\qquad h=\\frac{T}{n}\\end{aligned}";
    case "logistic":return "\\begin{aligned}y'&=r\\,y\\left(1-\\frac{y}{K}\\right),\\qquad y(0)="+n(p.y0)+"\\\\r&="+n(p.r)+",\\qquad K="+n(p.K)+"\\end{aligned}";
    default:throw new Error("Missing LaTeX formula: "+id);
  }
}
