import math
A=(50.0,10.0); B=(11.0,77.5); C=(89.0,77.5)
def fmt(p): return f"{p[0]:.2f} {p[1]:.2f}"
def lerp(P,Q,u): return (P[0]+u*(Q[0]-P[0]), P[1]+u*(Q[1]-P[1]))

def ramp(vertex, p, q, cuts, gap=0.018):
    """bands parallel to edge p-q, converging at `vertex`.
       cuts = interior boundary u-values (0<u<1). gap in u-units."""
    bounds = [0.0]+cuts+[1.0]
    polys=[]
    for i in range(len(bounds)-1):
        u0 = bounds[i] + (gap if i>0 else 0.0)
        u1 = bounds[i+1] - (gap if i< len(bounds)-2 else 0.0)
        if i==0:  # tip triangle at the vertex
            polys.append(f"M {fmt(vertex)} L {fmt(lerp(vertex,p,u1))} L {fmt(lerp(vertex,q,u1))} Z")
        else:
            pts=[lerp(vertex,p,u0),lerp(vertex,p,u1),lerp(vertex,q,u1),lerp(vertex,q,u0)]
            polys.append("M "+" L ".join(fmt(x) for x in pts)+" Z")
    return " ".join(polys)

PHI=(1+5**0.5)/2
def golden_cuts(n):
    """n bands, thickness ratio PHI (smallest at vertex). return interior cuts."""
    w=[PHI**k for k in range(n)]            # increasing toward the wide edge
    tot=sum(w); cum=0; cuts=[]
    for k in range(n-1):
        cum+=w[k]; cuts.append(cum/tot)
    return cuts

def write(name,d):
    open(name,'w').write(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">\n'
      f'  <path fill="#000" d="{d}"/>\n</svg>\n')

# toward C (down-right lean)
write("c1-golden3.svg",  ramp(C,B,A, golden_cuts(3)))
write("c1-golden4.svg",  ramp(C,B,A, golden_cuts(4)))
# flipped: toward B (down-left lean)
write("c1-golden3-flip.svg", ramp(B,A,C, golden_cuts(3)))
# equal 4-band toward C for comparison
write("c1-equal4.svg",   ramp(C,B,A,[0.25,0.5,0.75]))
print("cuts3",golden_cuts(3),"cuts4",golden_cuts(4))
