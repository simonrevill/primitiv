A=(50.0,10.0); B=(11.0,77.5); C=(89.0,77.5)
def fmt(p): return f"{p[0]:.2f} {p[1]:.2f}"
def lerp(P,Q,u): return (P[0]+u*(Q[0]-P[0]), P[1]+u*(Q[1]-P[1]))
def ramp(vertex,p,q,cuts,gap):
    bounds=[0.0]+cuts+[1.0]; polys=[]
    for i in range(len(bounds)-1):
        u0=bounds[i]+(gap if i>0 else 0.0)
        u1=bounds[i+1]-(gap if i<len(bounds)-2 else 0.0)
        if i==0:
            polys.append(f"M {fmt(vertex)} L {fmt(lerp(vertex,p,u1))} L {fmt(lerp(vertex,q,u1))} Z")
        else:
            pts=[lerp(vertex,p,u0),lerp(vertex,p,u1),lerp(vertex,q,u1),lerp(vertex,q,u0)]
            polys.append("M "+" L ".join(fmt(x) for x in pts)+" Z")
    return " ".join(polys)
PHI=(1+5**0.5)/2
def golden_cuts(n):
    w=[PHI**k for k in range(n)]; tot=sum(w); cum=0; cuts=[]
    for k in range(n-1): cum+=w[k]; cuts.append(cum/tot)
    return cuts
def write(name,d):
    open(name,'w').write('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">\n'
        f'  <path fill="#000" d="{d}"/>\n</svg>\n')
# flipped golden x3, gap 0.018 -> 0.025
write("c1-golden3-flip-gap.svg", ramp(B,A,C, golden_cuts(3), 0.025))
