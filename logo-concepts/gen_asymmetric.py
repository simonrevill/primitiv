import math

# shared equilateral triangle, centroid O
O = (50.0, 55.0)
A = (50.0, 10.0); B = (11.0, 77.5); C = (89.0, 77.5)
rel = [(A[0]-O[0],A[1]-O[1]), (B[0]-O[0],B[1]-O[1]), (C[0]-O[0],C[1]-O[1])]

def fmt(p): return f"{p[0]:.2f} {p[1]:.2f}"

def vortex(r, phi_deg, n):
    """nested triangles each scaled r^k and rotated k*phi about O, even-odd."""
    subs = []
    for k in range(n+1):
        s = r**k
        th = math.radians(phi_deg*k)
        ct, st = math.cos(th), math.sin(th)
        pts = []
        for (x,y) in rel:
            xr = x*ct - y*st; yr = x*st + y*ct
            pts.append((O[0]+s*xr, O[1]+s*yr))
        subs.append("M "+" L ".join(fmt(p) for p in pts)+" Z")
    return " ".join(subs)

def diagonal_ramp(gap=2.5):
    """3 bands parallel to side AB, growing toward vertex C."""
    def onCB(u): return (C[0]+u*(B[0]-C[0]), C[1]+u*(B[1]-C[1]))
    def onCA(u): return (C[0]+u*(A[0]-C[0]), C[1]+u*(A[1]-C[1]))
    # cut params; gap expressed as fraction shift
    g = gap/100.0
    cuts = [(0.0, 1/3-g), (1/3+g, 2/3-g), (2/3+g, 1.0)]
    polys=[]
    for (u0,u1) in cuts:
        if u0==0.0:
            polys.append(f"M {fmt(C)} L {fmt(onCB(u1))} L {fmt(onCA(u1))} Z")
        else:
            polys.append("M "+" L ".join(fmt(p) for p in
                [onCB(u0),onCB(u1),onCA(u1),onCA(u0)])+" Z")
    return " ".join(polys)

def write(path, d, evenodd=False):
    fr = ' fill-rule="evenodd"' if evenodd else ''
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">\n'
           f'  <path fill="#000"{fr}\n        d="{d}"/>\n</svg>\n')
    open(path,'w').write(svg)

write("harmoni-vortex.svg", vortex(0.80, 18, 6), evenodd=True)
write("harmoni-vortex-b.svg", vortex(0.86, 12, 8), evenodd=True)
write("harmoni-ramp-diagonal.svg", diagonal_ramp(2.5))
print("done")
