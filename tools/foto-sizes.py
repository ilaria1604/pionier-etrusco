# Smaller copies of every photo, so each page can download the size it really shows (rev 141).
# For each pionier-etrusco/assets/foto/NAME.jpg it writes assets/foto/sizes/NAME-200.jpg, -400, -640 and -960
# (only the widths smaller than the original). The originals stay as they are: the lightbox uses them.
# tools/build.mjs then adds srcset/sizes to the <img> tags of the published pages.
#
# Needs Pillow:  python3 -m pip install pillow
# Usage:         python3 tools/foto-sizes.py           (only new or changed photos)
#                python3 tools/foto-sizes.py --all     (all of them again)
import os, sys
from PIL import Image, ImageOps

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'pionier-etrusco', 'assets', 'foto')
OUT = os.path.join(ROOT, 'sizes')
WIDTHS = (200, 400, 640, 960)
QUALITY = 72  # checked at 2x zoom against the original: no visible difference (rev 141)

os.makedirs(OUT, exist_ok=True)
redo = '--all' in sys.argv
made = kept = 0
for name in sorted(os.listdir(ROOT)):
    if not name.lower().endswith('.jpg'):
        continue
    src = os.path.join(ROOT, name)
    stem = name[:-4]
    im = None
    for w in WIDTHS:
        dst = os.path.join(OUT, f'{stem}-{w}.jpg')
        if not redo and os.path.exists(dst) and os.path.getmtime(dst) >= os.path.getmtime(src):
            kept += 1
            continue
        if im is None:
            im = ImageOps.exif_transpose(Image.open(src)).convert('RGB')
        if w >= im.size[0]:
            continue
        h = round(im.size[1] * w / im.size[0])
        im.resize((w, h), Image.LANCZOS).save(dst, 'JPEG', quality=QUALITY, optimize=True, progressive=True)
        made += 1
print(f'sizes/: {made} copie create, {kept} già aggiornate')
