"""Render JADOO's own demo (simulated hands) offline, frame by frame, without opening a window.

Usage: python jadoo_capture.py OUT_DIR [SECONDS]
Writes OUT_DIR/jadoo_master.mp4 (1080p, 30 fps), OUT_DIR/stills/*.jpg every 0.5 s and OUT_DIR/log.txt.
The project itself is only imported, never modified.
"""
import os
import subprocess
import sys
import time
import types

PROJ = r"D:\project\python_app\detector_hand"
FFMPEG = (r"C:\Users\sdnn\AppData\Local\Microsoft\WinGet\Packages"
          r"\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-9.0.2-full_build\bin\ffmpeg.exe")
sys.path.insert(0, PROJ)

import cv2  # noqa: E402
import numpy as np  # noqa: E402

from jadoo.app import App  # noqa: E402
from jadoo.config import QUALITY, Config  # noqa: E402
from jadoo.gfx import HAVE_NUMBA, warmup  # noqa: E402
from jadoo.hud import _envelope  # noqa: E402

OUT = sys.argv[1]
SECONDS = float(sys.argv[2]) if len(sys.argv) > 2 else 66.0
FPS = 30
os.makedirs(os.path.join(OUT, "stills"), exist_ok=True)


def light_hud(self, img, app, now):
    """The app's own HUD minus FPS / sound / key help (those make no sense in a recording)."""
    s, T, W, H = self.s, self.t, self.W, self.H
    mode = app.mode
    T.draw(img, app.cfg.title, (30 * s, 24 * s), 26 * s, (255, 255, 255), "bold", alpha=0.92, tracking=8 * s)
    T.draw(img, f"{app.mode_i + 1:02d}   {mode.title}", (32 * s, 62 * s), 16 * s, mode.accent,
           "regular", alpha=0.95, tracking=4 * s)
    y = int(94 * s)
    for i, m in enumerate(app.modes):
        c = (int(37 * s + i * 18 * s), y)
        if i == app.mode_i:
            cv2.circle(img, c, max(2, int(4 * s)), m.accent, -1, cv2.LINE_AA)
        else:
            cv2.circle(img, c, max(2, int(3 * s)), (120, 120, 120), 1, cv2.LINE_AA)
    if self.banner:
        idx, title, t0 = self.banner
        a = _envelope(now - t0, 0.2, 1.1, 0.6)
        if a <= 0:
            self.banner = None
        else:
            T.draw(img, f"{idx + 1:02d}", (W // 2, H * 0.40), 22 * s, mode.accent, "regular", anchor="mm",
                   alpha=a, tracking=6 * s)
            T.draw(img, title, (W // 2, H * 0.47), 72 * s, (255, 255, 255), "light", anchor="mm",
                   alpha=a, tracking=26 * s)


def main():
    cfg = Config(**QUALITY["ultra"])
    cfg.demo, cfg.sound, cfg.show_help, cfg.background = True, False, False, 2  # void background
    if HAVE_NUMBA:
        t = time.time()
        warmup()
        print(f"warmup {time.time() - t:.1f}s", flush=True)
    app = App(cfg)
    app.hud.draw = types.MethodType(light_hud, app.hud)
    W, H = app.W, app.H
    print(f"render {W}x{H}, {cfg.particles} particles, numba={HAVE_NUMBA}", flush=True)

    enc = subprocess.Popen([FFMPEG, "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "bgr24",
                            "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-", "-c:v", "libx264", "-preset", "slow",
                            "-crf", "15", "-pix_fmt", "yuv420p", os.path.join(OUT, "jadoo_master.mp4")],
                           stdin=subprocess.PIPE)
    log = open(os.path.join(OUT, "log.txt"), "w", encoding="utf-8")
    last_mode = -1
    t0 = time.time()
    n = int(SECONDS * FPS)
    for i in range(n):
        now = 1.0 + i / FPS
        img = app.frame(now, 1.0 / FPS)
        enc.stdin.write(np.ascontiguousarray(img).tobytes())
        if app.mode_i != last_mode:
            last_mode = app.mode_i
            log.write(f"t={i / FPS:6.2f}s frame={i} mode={app.mode_i + 1} {app.mode.title}\n")
            log.flush()
        if i % 15 == 0:
            cv2.imwrite(os.path.join(OUT, "stills", f"f{i:05d}_m{app.mode_i + 1}.jpg"), img,
                        [cv2.IMWRITE_JPEG_QUALITY, 92])
        if i % 150 == 0:
            el = time.time() - t0
            print(f"{i}/{n} frames  {el:.0f}s  ({(i + 1) / max(el, 1e-3):.1f} fps)", flush=True)
    enc.stdin.close()
    enc.wait()
    log.close()
    print(f"done in {time.time() - t0:.0f}s", flush=True)


if __name__ == "__main__":
    main()
