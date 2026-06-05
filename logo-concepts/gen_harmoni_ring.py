A=(50.0,10.0); B=(11.0,77.5); C=(89.0,77.5); O=(50.0,55.0)
rel=[(A[0]-O[0],A[1]-O[1]),(B[0]-O[0],B[1]-O[1]),(C[0]-O[0],C[1]-O[1])]
def fmt(p): return f"{p[0]:.2f} {p[1]:.2f}"
GAP=0.225   # scale-difference giving a 5.06u perpendicular gap (== C-g3f+++)
def tri(s): return "M "+" L ".join(fmt((O[0]+s*x,O[1]+s*y)) for (x,y) in rel)+" Z"
def ring(b):
    """outer ring (1.0 -> b+GAP) + gap + inner solid triangle (<= b)."""
    a=b+GAP
    return " ".join([tri(1.0), tri(a), tri(b)])
def write(name,d):
    open(name,'w').write('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">\n'
        f'  <path fill="#000" fill-rule="evenodd"\n        d="{d}"/>\n</svg>\n')
# inner triangle small / medium / large
write("harmoni-ring-bold.svg",     ring(0.325))  # bold outer frame, small inner core
write("harmoni-ring-balanced.svg", ring(0.55))   # frame thickness == gap, medium inner
write("harmoni-ring-thin.svg",     ring(0.70))   # thin outer outline, large inner
print("bold: outer 1.0->0.55 frame, inner<=0.325")
print("balanced: outer 1.0->0.775 frame(==gap), inner<=0.55")
print("thin: outer 1.0->0.925 frame, inner<=0.70")
