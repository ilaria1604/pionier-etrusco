# grade.py OUTDIR [names...] : converts sources to web JPGs with a per-kind professional grade
import subprocess, sys, os
sys.path.insert(0, os.path.dirname(__file__))
from manifest import M, P
FF = os.path.expanduser('~/.local/bin/ffmpeg')
TMP = os.path.join(os.path.dirname(__file__), 'grade-png')
os.makedirs(TMP, exist_ok=True)
SHARP = 'unsharp=5:5:0.6:5:5:0'
RSHARP = 'unsharp=5:5:0.45:5:5:0'
G = {
  # daylight exteriors: deeper blacks, opened shadows, brighter mids, vibrance for greens and sky, clarity
  'ext':   "curves=all='0/0 0.08/0.07 0.25/0.27 0.5/0.54 0.75/0.8 1/1',vibrance=intensity=0.2," + SHARP,
  # wood interiors: neutralise the orange cast, bright and airy mids, clean whites, calmer wood
  'int':   "colortemperature=temperature=7800:mix=0.5:pl=1,colorbalance=rm=-0.05:bm=0.04:rh=-0.03:bh=0.04:pl=1,curves=all='0/0 0.15/0.19 0.5/0.61 0.85/0.93 1/1',eq=saturation=0.9," + SHARP,
  # night: lift the lawn and trees a touch, keep the bulbs from blowing
  'night': "curves=all='0/0 0.12/0.16 0.5/0.56 0.9/0.92 1/1',vibrance=intensity=0.1," + SHARP,
  # sunsets: richer colour, deeper contrast
  'sunset':"curves=all='0/0 0.25/0.21 0.5/0.5 0.8/0.84 1/1',vibrance=intensity=0.14," + SHARP,
  # already professional web photos: only a light clarity pass
  'web':   "unsharp=3:3:0.35:3:3:0",
  'keep':  "null",
  # restaurant photos sent by the owner (rev 72): one light grade each, checked side by side with the original
  'rist-sala':      "colorchannelmixer=rr=0.99:bb=1.05,curves=all='0/0 0.06/0.08 0.2/0.25 0.5/0.57 0.8/0.85 1/1',vibrance=intensity=0.04," + RSHARP,
  'rist-risotto':   "colorchannelmixer=rr=1.04:gg=1.005:bb=0.965,curves=all='0/0 0.25/0.235 0.5/0.51 0.85/0.9 1/1',vibrance=intensity=0.1," + RSHARP,
  'rist-polpette':  "colorchannelmixer=rr=1.01:bb=0.985,curves=all='0/0 0.25/0.23 0.5/0.5 0.85/0.9 1/1',vibrance=intensity=0.1," + RSHARP,
  # white balance only in the highlights, so the yellow tomatoes keep their own colour
  'rist-spaghetti': "format=rgb24,colorbalance=rh=0.008:bh=-0.028,curves=all='0/0 0.2/0.185 0.5/0.5 0.85/0.88 1/1',hue=h=1.5:s=0.95," + RSHARP,
}
CROP = {'bung-hero': 'crop=iw*0.9:ih:iw*0.1:0'}
def run(name, outdir):
    src, kind = M[name]
    src = P + src
    png = os.path.join(TMP, name + '.png')
    if src.lower().endswith(('.heic',)) or 'foto-selezione' in src or 'materiali' in src:  # HEIC originals -> PNG
        subprocess.run(['sips', '-s', 'format', 'png', '-Z', '1600', src, '--out', png], check=True, capture_output=True)
    else:
        png = src
    vf = (CROP[name] + ',' if name in CROP else '') + G[kind] + ",scale='min(1400,iw)':'min(1400,ih)':force_original_aspect_ratio=decrease"
    out = os.path.join(outdir, name + '.jpg')
    subprocess.run([FF, '-hide_banner', '-loglevel', 'error', '-i', png, '-vf', vf, '-q:v', '4', '-y', out], check=True)
    return out
if __name__ == '__main__':
    outdir = sys.argv[1]; os.makedirs(outdir, exist_ok=True)
    names = sys.argv[2:] or list(M)
    for n in names:
        run(n, outdir); print('graded', n)
