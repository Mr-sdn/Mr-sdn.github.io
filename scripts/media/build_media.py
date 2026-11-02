"""Build every image / video the portfolio uses into SITE/public/media.

python build_media.py SCRATCH SITE [images|videos|all]
Sources are only read; nothing in the projects is changed.
"""
import glob
import os
import subprocess
import sys

import numpy as np
from PIL import Image

SCRATCH, SITE = sys.argv[1], sys.argv[2]
STEP = sys.argv[3] if len(sys.argv) > 3 else "all"
OUT = os.path.join(SITE, "public", "media")
FF = (r"C:\Users\sdnn\AppData\Local\Microsoft\WinGet\Packages"
      r"\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-9.0.2-full_build\bin\ffmpeg.exe")
JADOO_MASTER = os.path.join(SCRATCH, "jadoo_capture", "jadoo_master.mp4")
JADOO_STILLS = os.path.join(SCRATCH, "jadoo_capture", "stills")
HG = r"D:\project\applications\hellogap_app"
ASH = r"D:\project\applications\cooking_app"


def d(*p):
    path = os.path.join(OUT, *p)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    return path


def webp(im, path, width, q=80):
    im = im.convert("RGB") if im.mode not in ("RGB", "RGBA") else im
    if im.width != width:
        im = im.resize((width, round(im.height * width / im.width)), Image.LANCZOS)
    im.save(path, "WEBP", quality=q, method=6)
    return os.path.getsize(path)


def ff(*args):
    subprocess.run([FF, "-hide_banner", "-loglevel", "error", "-y", *args], check=True)


def report(path):
    print(f"  {os.path.relpath(path, OUT):40s} {os.path.getsize(path) / 1024:8.0f} KB", flush=True)


def content_box(im, thr=30):
    """Rows that are not the flat letterbox colour."""
    a = np.asarray(im.convert("L"), np.float32)
    rows = np.where(a.std(1) > 6)[0] if a.size else []
    top, bot = (int(rows[0]), int(rows[-1]) + 1) if len(rows) else (0, im.height)
    return top, bot


def images():
    print("JADOO stills")
    picks = {"nebula": 6.0, "nebula-title": 0.5, "nebula-orb": 7.5, "echo": 18.0, "echo-2": 22.5,
             "paint": 31.5, "storm": 46.5, "storm-2": 42.0, "galaxy": 61.5, "galaxy-bang": 60.0}
    for name, t in picks.items():
        src = glob.glob(os.path.join(JADOO_STILLS, f"f{int(round(t * 30)):05d}_m*.jpg"))[0]
        im = Image.open(src)
        for w in (1600, 800):
            p = d("jadoo", f"{name}-{w}.webp")
            webp(im, p, w, 80)
            report(p)

    print("HelloGap")
    # logo on black -> transparent (alpha = brightest channel), so it can sit on any background
    rgb = np.asarray(Image.open(os.path.join(HG, "assets", "images", "logo.png")).convert("RGB")).astype(np.float32) / 255
    a = np.clip((rgb.max(axis=2) - 0.02) / 0.98, 0, 1)
    col = np.where(a[..., None] > 1e-4, rgb / np.maximum(a[..., None], 1e-4), 0)
    logo = Image.fromarray((np.dstack([np.clip(col, 0, 1), a]) * 255 + 0.5).astype(np.uint8), "RGBA")
    logo = logo.crop(logo.getchannel("A").point(lambda v: 255 if v > 8 else 0).getbbox())
    side = max(logo.size)
    sq = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    sq.paste(logo, ((side - logo.width) // 2, (side - logo.height) // 2))
    p = d("hellogap", "logo.webp")
    sq.resize((384, 384), Image.LANCZOS).save(p, "WEBP", quality=90, method=6)
    report(p)
    posters = {
        "call": "LHEPxtuuzu_BXOjazUVEEIIAbfQ-5mikUtHeRIKyU4JpxH9CPg",
        "chat": "U12p8n63tGCNRGDM5JtU5JEhjjw-gKc18HmAQdOKZBCwV0xvGw",
        "home": "_AWQ3oyLbjLwqBdX6-Tr07UnUKQ-g_xeBj2BT8-ttDyk-cTGRg(1)",
    }
    for name, stem in posters.items():
        im = Image.open(os.path.join(HG, "store", "screenshots", "myket", stem + ".jpg")).convert("RGB")
        top, bot = content_box(im)
        h = round(im.width * 1.5)                       # 2:3
        if bot - top >= h:                               # full-bleed poster: keep the logo at the top
            box = (0, 85, im.width, 85 + h)
        else:
            mid = (top + bot) // 2
            box = (0, max(0, mid - h // 2), im.width, max(0, mid - h // 2) + h)
        print(f"  {name}: content rows {top}-{bot} -> crop {box}")
        im = im.crop(box)
        for w in (720, 360):
            p = d("hellogap", f"{name}-{w}.webp")
            webp(im, p, w, 82)
            report(p)

    print("Ashpazino")
    icon = Image.open(os.path.join(ASH, "assets", "icon", "icon_512.png"))
    p = d("ashpazino", "icon.webp")
    webp(icon, p, 256, 90)
    report(p)
    for src in sorted(glob.glob(os.path.join(ASH, "store", "screenshots", "*.png"))):
        name = os.path.splitext(os.path.basename(src))[0].split("_", 1)[1]
        p = d("ashpazino", f"screen-{name}.webp")
        webp(Image.open(src), p, 540, 86)
        report(p)
    for src in sorted(glob.glob(os.path.join(ASH, "store", "banners", "*.jpg"))):
        name = os.path.splitext(os.path.basename(src))[0].split("_", 1)[1]
        for w in (720, 360):
            p = d("ashpazino", f"banner-{name}-{w}.webp")
            webp(Image.open(src), p, w, 80)
            report(p)


def videos():
    print("JADOO reel")
    segs = [(3.0, 8.5), (15.5, 20.5), (29.5, 33.5), (44.0, 49.0), (57.0, 62.5)]
    parts, offs, acc = [], [], 0.0
    for i, (a, b) in enumerate(segs):
        part = os.path.join(SCRATCH, "jadoo_capture", f"seg{i}.mp4")
        dur = b - a
        ff("-ss", str(a), "-i", JADOO_MASTER, "-t", str(dur), "-vf",
           f"scale=1280:-2:flags=lanczos,fade=t=in:st=0:d=0.25,fade=t=out:st={dur - 0.3}:d=0.3",
           "-c:v", "libx264", "-preset", "slow", "-crf", "12", "-pix_fmt", "yuv420p", "-an", part)
        parts.append(part)
        offs.append(round(acc, 2))
        acc += dur
    lst = os.path.join(SCRATCH, "jadoo_capture", "segs.txt")
    with open(lst, "w") as f:
        for p in parts:
            f.write(f"file '{p}'\n")
    p = d("jadoo", "reel.mp4")
    ff("-f", "concat", "-safe", "0", "-i", lst, "-c:v", "libx264", "-preset", "slow", "-crf", "27",
       "-tune", "film", "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-an", p)
    report(p)
    print("  segment offsets:", offs, "total", acc)


if STEP in ("images", "all"):
    images()
if STEP in ("videos", "all"):
    videos()
print("done")
