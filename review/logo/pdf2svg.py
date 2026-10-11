import re, sys
# Minimal PDF content-stream to SVG converter: fills only (what these logo pages use).
src, out = sys.argv[1], sys.argv[2]
H = 595.276
tok = re.findall(rb'\[[^\]]*\]|\([^)]*\)|/[^\s/\[\]()<>]+|[-+]?\d*\.\d+|[-+]?\d+|[A-Za-z\*\'"]+', open(src,'rb').read())
def mul(a,b):  # a then b  (row-vector convention, PDF: M' = M_new x CTM)
    return [a[0]*b[0]+a[1]*b[2], a[0]*b[1]+a[1]*b[3], a[2]*b[0]+a[3]*b[2], a[2]*b[1]+a[3]*b[3], a[4]*b[0]+a[5]*b[2]+b[4], a[4]*b[1]+a[5]*b[3]+b[5]]
ctm=[1,0,0,1,0,0]; stack=[]; fill=(0,0,0); stack_fill=[]
path=[]; cur=None; start=None; stackv=[]
paths=[]
def T(x,y):
    return (ctm[0]*x+ctm[2]*y+ctm[4], H-(ctm[1]*x+ctm[3]*y+ctm[5]))
def fmt(p): return '%.2f %.2f' % p
def cmyk(c,m,y,k): return tuple(round(255*(1-min(1,v+k))) for v in (c,m,y))
num=[]
for t in tok:
    try:
        num.append(float(t)); continue
    except ValueError: pass
    op=t.decode('latin1')
    if op=='q': stack.append((ctm[:],fill))
    elif op=='Q': ctm,fill=stack.pop()
    elif op=='cm': ctm=mul(num[-6:],ctm)
    elif op=='k': fill=cmyk(*num[-4:])
    elif op=='rg': fill=tuple(round(255*v) for v in num[-3:])
    elif op=='g': fill=(round(255*num[-1]),)*3
    elif op=='m': path.append('M'+fmt(T(*num[-2:]))); cur=num[-2:]
    elif op=='l': path.append('L'+fmt(T(*num[-2:]))); cur=num[-2:]
    elif op=='c': a=num[-6:]; path.append('C'+fmt(T(a[0],a[1]))+' '+fmt(T(a[2],a[3]))+' '+fmt(T(a[4],a[5]))); cur=a[4:6]
    elif op=='v': a=num[-4:]; path.append('C'+fmt(T(*cur))+' '+fmt(T(a[0],a[1]))+' '+fmt(T(a[2],a[3]))); cur=a[2:4]
    elif op=='y': a=num[-4:]; path.append('C'+fmt(T(a[0],a[1]))+' '+fmt(T(a[2],a[3]))+' '+fmt(T(a[2],a[3]))); cur=a[2:4]
    elif op=='h': path.append('Z')
    elif op=='re':
        x,y,w,h=num[-4:]; path.append('M'+fmt(T(x,y))+'L'+fmt(T(x+w,y))+'L'+fmt(T(x+w,y+h))+'L'+fmt(T(x,y+h))+'Z')
    elif op in ('f','F','f*','B','B*','b','b*'):
        if path: paths.append((''.join(path), fill, 'evenodd' if op.endswith('*') else 'nonzero'))
        path=[]
    elif op in ('n','S','s'): path=[]
    num=[]
with open(out,'w') as f:
    f.write('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 %.3f %.3f">\n' % (H,H))
    for d,c,r in paths:
        f.write('<path d="%s" fill="#%02x%02x%02x"%s/>\n' % (d, *c, ' fill-rule="evenodd"' if r=='evenodd' else ''))
    f.write('</svg>\n')
print(len(paths), 'paths')
