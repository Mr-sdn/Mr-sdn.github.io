/**
 * Particle text for the hero — a small web echo of JADOO's "Nebula" mode.
 * Thousands of glowing points spring into the shape of a word, part around the pointer,
 * scatter on click and morph when the word changes. WebGL2 points + additive light.
 */

const MAX = 16000;

export type FontSpec = { family: string; weight: number; dir: CanvasDirection; lineHeight?: number };

const VERT = `#version 300 es
layout(location=0) in vec3 a_dyn;
layout(location=1) in vec4 a_stat;
uniform vec2 u_res;
uniform float u_dpr;
uniform float u_time;
uniform float u_gain;
out vec3 v_col;
out float v_a;
float hash(float n){ return fract(sin(n) * 43758.5453123); }
void main(){
  vec2 clip = (a_dyn.xy / u_res) * 2.0 - 1.0;
  gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
  float sp = clamp(a_dyn.z * 0.08, 0.0, 1.0);
  float id = float(gl_VertexID);
  float tw = 0.78 + 0.22 * sin(u_time * (1.1 + hash(id) * 2.4) + hash(id + 7.0) * 6.2831);
  gl_PointSize = a_stat.w * u_dpr * (1.0 + sp * 1.1);
  v_col = mix(a_stat.rgb, vec3(1.0, 0.96, 0.88), sp * 0.6);
  v_a = tw * u_gain * (1.0 + sp * 0.6);
}`;

const FRAG = `#version 300 es
precision mediump float;
in vec3 v_col;
in float v_a;
out vec4 o;
void main(){
  vec2 d = gl_PointCoord - 0.5;
  float r = length(d) * 2.0;
  if (r > 1.0) discard;
  float a = 1.0 - r;
  a = a * a * v_a;
  o = vec4(v_col * a, a);
}`;

const ICE = [0.36, 0.88, 0.9];
const MID = [0.94, 0.95, 1.0];
const AMBER = [1.0, 0.71, 0.28];

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const s = gl.createShader(type);
  if (!s) throw new Error("shader");
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? "compile");
  return s;
}

const isInteractive = (el: EventTarget | null) =>
  el instanceof Element && !!el.closest("a,button,input,textarea,select,label,[data-no-burst]");

export class ParticleEngine {
  private gl: WebGL2RenderingContext;
  private prog: WebGLProgram;
  private vao: WebGLVertexArrayObject;
  private dynBuf: WebGLBuffer;
  private statBuf: WebGLBuffer;
  private uRes: WebGLUniformLocation | null;
  private uDpr: WebGLUniformLocation | null;
  private uTime: WebGLUniformLocation | null;
  private uGain: WebGLUniformLocation | null;

  private pos = new Float32Array(MAX * 2);
  private vel = new Float32Array(MAX * 2);
  private tgt = new Float32Array(MAX * 2);
  private ph = new Float32Array(MAX);
  private dyn = new Float32Array(MAX * 3);
  private stat = new Float32Array(MAX * 4);
  private n = 0;

  private w = 0;
  private h = 0;
  private dpr = 1;
  private slot = { x: 0, y: 0, w: 0, h: 0 };
  private word = "";
  private font: FontSpec | null = null;
  private token = 0;
  private hasTargets = false;

  private raf = 0;
  private running = false;
  private visible = true;
  private last = 0;
  private time = 0;
  private introAt = -1;
  private pointer = { x: -1e4, y: -1e4, vx: 0, vy: 0, active: false, lastMove: -1e9 };
  private canvasRect: DOMRect;

  private ro: ResizeObserver;
  private io: IntersectionObserver;
  private readonly coarse: boolean;
  private readonly reduced: boolean;
  private disposed = false;

  constructor(
    private canvas: HTMLCanvasElement,
    private slotEl: HTMLElement,
    private root: HTMLElement,
    opts: { reduced: boolean },
  ) {
    this.reduced = opts.reduced;
    this.coarse = window.matchMedia("(pointer: coarse)").matches;
    const gl = canvas.getContext("webgl2", {
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "high-performance",
    });
    if (!gl) throw new Error("webgl2 unavailable");
    this.gl = gl;

    const prog = gl.createProgram();
    if (!prog) throw new Error("program");
    gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog) ?? "link");
    this.prog = prog;
    this.uRes = gl.getUniformLocation(prog, "u_res");
    this.uDpr = gl.getUniformLocation(prog, "u_dpr");
    this.uTime = gl.getUniformLocation(prog, "u_time");
    this.uGain = gl.getUniformLocation(prog, "u_gain");

    const vao = gl.createVertexArray();
    const dynBuf = gl.createBuffer();
    const statBuf = gl.createBuffer();
    if (!vao || !dynBuf || !statBuf) throw new Error("buffers");
    this.vao = vao;
    this.dynBuf = dynBuf;
    this.statBuf = statBuf;
    gl.bindVertexArray(vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, dynBuf);
    gl.bufferData(gl.ARRAY_BUFFER, this.dyn.byteLength, gl.DYNAMIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, statBuf);
    gl.bufferData(gl.ARRAY_BUFFER, this.stat.byteLength, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1, 4, gl.FLOAT, false, 0, 0);
    gl.bindVertexArray(null);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE);

    for (let i = 0; i < MAX; i++) this.ph[i] = Math.random() * Math.PI * 2;
    this.canvasRect = canvas.getBoundingClientRect();

    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(canvas);
    this.ro.observe(slotEl);
    this.io = new IntersectionObserver(([e]) => {
      this.visible = e.isIntersecting;
      this.updateRunning();
    });
    this.io.observe(canvas);

    window.addEventListener("pointermove", this.onMove, { passive: true });
    window.addEventListener("pointerdown", this.onDown, { passive: true });
    window.addEventListener("pointerup", this.onUp, { passive: true });
    window.addEventListener("blur", this.onLeave);
    document.documentElement.addEventListener("pointerleave", this.onLeave);
    document.addEventListener("visibilitychange", this.updateRunning);
    this.resize();
  }

  /* ---------------- public ---------------- */

  setWord(word: string, font: FontSpec) {
    this.word = word;
    this.font = font;
    void this.resample(true);
  }

  burst(clientX: number, clientY: number, strength = 1) {
    const r = this.canvas.getBoundingClientRect();
    const cx = clientX - r.left;
    const cy = clientY - r.top;
    const R = (this.coarse ? 220 : 320) * strength;
    const { pos, vel } = this;
    for (let i = 0; i < this.n; i++) {
      const dx = pos[2 * i] - cx;
      const dy = pos[2 * i + 1] - cy;
      const d = Math.sqrt(dx * dx + dy * dy) + 0.001;
      if (d < R) {
        const f = (1 - d / R) * 26 * strength;
        vel[2 * i] += (dx / d) * f + (Math.random() - 0.5) * 6;
        vel[2 * i + 1] += (dy / d) * f + (Math.random() - 0.5) * 6;
      }
    }
    this.kickAwake();
  }

  destroy() {
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    this.running = false;
    this.ro.disconnect();
    this.io.disconnect();
    window.removeEventListener("pointermove", this.onMove);
    window.removeEventListener("pointerdown", this.onDown);
    window.removeEventListener("pointerup", this.onUp);
    window.removeEventListener("blur", this.onLeave);
    document.documentElement.removeEventListener("pointerleave", this.onLeave);
    document.removeEventListener("visibilitychange", this.updateRunning);
    const gl = this.gl;
    gl.deleteBuffer(this.dynBuf);
    gl.deleteBuffer(this.statBuf);
    gl.deleteVertexArray(this.vao);
    gl.deleteProgram(this.prog);
  }

  /* ---------------- input ---------------- */

  private onMove = (e: PointerEvent) => {
    const p = this.pointer;
    const nx = e.clientX;
    const ny = e.clientY;
    if (p.active) {
      p.vx = nx - p.x;
      p.vy = ny - p.y;
    }
    p.x = nx;
    p.y = ny;
    p.active = e.pointerType !== "touch" || e.buttons > 0 || e.pressure > 0;
    p.lastMove = performance.now();
  };
  private onDown = (e: PointerEvent) => {
    if (isInteractive(e.target) || !this.root.contains(e.target as Node)) return;
    if (this.reduced) return;
    this.burst(e.clientX, e.clientY);
    if (e.pointerType === "touch") {
      this.pointer.x = e.clientX;
      this.pointer.y = e.clientY;
      this.pointer.active = true;
      this.pointer.lastMove = performance.now();
    }
  };
  private onUp = (e: PointerEvent) => {
    if (e.pointerType === "touch") this.pointer.active = false;
  };
  private onLeave = () => {
    this.pointer.active = false;
  };

  /* ---------------- layout & sampling ---------------- */

  private resize() {
    if (this.disposed) return;
    const w = this.canvas.clientWidth;
    const h = this.canvas.clientHeight;
    if (!w || !h) return;
    const dpr = Math.min(window.devicePixelRatio || 1, this.coarse ? 1.75 : 2);
    const sizeChanged = w !== this.w || h !== this.h || dpr !== this.dpr;
    this.w = w;
    this.h = h;
    this.dpr = dpr;
    this.canvas.width = Math.round(w * dpr);
    this.canvas.height = Math.round(h * dpr);
    this.canvasRect = this.canvas.getBoundingClientRect();
    const s = this.slotEl.getBoundingClientRect();
    const slot = { x: s.left - this.canvasRect.left, y: s.top - this.canvasRect.top, w: s.width, h: s.height };
    const slotChanged =
      Math.abs(slot.x - this.slot.x) > 1 || Math.abs(slot.y - this.slot.y) > 1 ||
      Math.abs(slot.w - this.slot.w) > 1 || Math.abs(slot.h - this.slot.h) > 1;
    this.slot = slot;
    if ((sizeChanged || slotChanged) && this.word) void this.resample(false);
    else if (this.reduced) this.draw();
  }

  private async resample(isNewWord: boolean) {
    const font = this.font;
    if (!font || !this.slot.w || !this.slot.h) return;
    const token = ++this.token;
    const fontStr = (size: number) => `${font.weight} ${size}px "${font.family}"`;
    try {
      await document.fonts.load(fontStr(64), this.word.replace("|", ""));
    } catch {
      /* fall back to whatever font is available */
    }
    if (token !== this.token || this.disposed) return;

    const W = Math.max(1, Math.floor(this.slot.w));
    const H = Math.max(1, Math.floor(this.slot.h));
    const c = document.createElement("canvas");
    c.width = W;
    c.height = H;
    const ctx = c.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;
    ctx.direction = font.dir;
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = "#fff";

    // one line if it fits at a decent size, otherwise break at "|"
    const oneLine = this.word.replace("|", "");
    let lines = [oneLine];
    let size = H * 0.9;
    ctx.font = fontStr(size);
    let widest = ctx.measureText(oneLine).width;
    if (widest > W * 0.98) size *= (W * 0.98) / widest;
    if (this.word.includes("|") && size < H * 0.5) {
      const split = this.word.split("|");
      const lh = font.lineHeight ?? 0.92;
      let s2 = (H * 0.9) / (split.length * lh);
      ctx.font = fontStr(s2);
      widest = Math.max(...split.map((t) => ctx.measureText(t).width));
      if (widest > W * 0.98) s2 *= (W * 0.98) / widest;
      if (s2 > size * 1.15) {
        lines = split;
        size = s2;
      }
    }
    // keep the real ink (tall Persian letters, descenders) inside the slot
    let lh = 0;
    let asc = 0;
    let block = 0;
    for (let pass = 0; pass < 3; pass++) {
      ctx.font = fontStr(size);
      lh = size * (font.lineHeight ?? 0.92);
      const metrics = lines.map((t) => ctx.measureText(t));
      asc = Math.max(...metrics.map((m) => m.actualBoundingBoxAscent));
      const desc = Math.max(...metrics.map((m) => m.actualBoundingBoxDescent));
      block = (lines.length - 1) * lh + asc + desc;
      if (block <= H * 0.96) break;
      size *= (H * 0.96) / block;
    }
    let y = (H - block) / 2 + asc;
    for (const t of lines) {
      ctx.fillText(t, W / 2, y);
      y += lh;
    }

    // collect lit pixels, then pick exactly n of them
    const data = ctx.getImageData(0, 0, W, H).data;
    let lit = 0;
    for (let i = 3; i < data.length; i += 4) if (data[i] > 128) lit++;
    if (!lit) return;
    const n = Math.max(2000, Math.min(MAX, Math.round(Math.sqrt(lit) * (this.coarse ? 32 : 46))));
    const step = Math.max(1, Math.sqrt(lit / (n * 1.25)));
    const cand: number[] = [];
    for (let yy = step / 2; yy < H; yy += step) {
      for (let xx = step / 2; xx < W; xx += step) {
        const jx = Math.min(W - 1, Math.max(0, Math.round(xx + (Math.random() - 0.5) * step * 0.8)));
        const jy = Math.min(H - 1, Math.max(0, Math.round(yy + (Math.random() - 0.5) * step * 0.8)));
        if (data[(jy * W + jx) * 4 + 3] > 128) cand.push(jx, jy);
      }
    }
    const count = cand.length / 2;
    if (!count) return;
    // shuffle candidate indices
    const idx = new Uint32Array(count);
    for (let i = 0; i < count; i++) idx[i] = i;
    for (let i = count - 1; i > 0; i--) {
      const j = (Math.random() * (i + 1)) | 0;
      const tmp = idx[i];
      idx[i] = idx[j];
      idx[j] = tmp;
    }

    const prevN = this.hasTargets ? this.n : 0;
    this.n = n;
    const { tgt, pos, vel, stat } = this;
    const sx = this.slot.x;
    const sy = this.slot.y;
    const dot = Math.min(3.8, Math.max(1.8, step * 1.4));
    for (let i = 0; i < n; i++) {
      const k = idx[i % count];
      const extra = i >= count ? 0.9 : 0;
      const tx = sx + cand[2 * k] + (Math.random() - 0.5) * extra * step;
      const ty = sy + cand[2 * k + 1] + (Math.random() - 0.5) * extra * step;
      tgt[2 * i] = tx;
      tgt[2 * i + 1] = ty;
      // colour: ice → white → amber across the word, with some variation and a few hot sparks
      const u = Math.min(1, Math.max(0, (tx - sx) / W));
      const a = u < 0.5 ? ICE : MID;
      const b = u < 0.5 ? MID : AMBER;
      const f = u < 0.5 ? u * 2 : (u - 0.5) * 2;
      const shade = 0.85 + Math.random() * 0.4;
      const hot = Math.random() < 0.06;
      stat[4 * i] = hot ? 1 : (a[0] + (b[0] - a[0]) * f) * shade;
      stat[4 * i + 1] = hot ? 0.95 : (a[1] + (b[1] - a[1]) * f) * shade;
      stat[4 * i + 2] = hot ? 0.85 : (a[2] + (b[2] - a[2]) * f) * shade;
      stat[4 * i + 3] = hot ? dot * 0.7 : dot * (0.55 + Math.random() * 0.8);
      if (i >= prevN) {
        // new particles drift in from a wide cloud
        const ang = Math.random() * Math.PI * 2;
        const rad = (0.35 + Math.random() * 0.75) * Math.max(this.w, this.h) * 0.6;
        pos[2 * i] = this.w / 2 + Math.cos(ang) * rad;
        pos[2 * i + 1] = this.h * 0.45 + Math.sin(ang) * rad * 0.6;
        vel[2 * i] = (Math.random() - 0.5) * 4;
        vel[2 * i + 1] = (Math.random() - 0.5) * 4;
      } else if (isNewWord) {
        // morph: give everyone a little kick so the change reads as magic, not a slide
        vel[2 * i] += (Math.random() - 0.5) * 9;
        vel[2 * i + 1] += (Math.random() - 0.5) * 9 - 2;
      }
    }
    if (this.reduced) {
      pos.set(tgt.subarray(0, n * 2));
      vel.fill(0);
    }
    const gl = this.gl;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.statBuf);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, stat.subarray(0, n * 4));
    if (!this.hasTargets) this.introAt = performance.now();
    this.hasTargets = true;
    this.kickAwake();
  }

  /* ---------------- loop ---------------- */

  private kickAwake() {
    if (this.reduced) {
      this.draw();
      return;
    }
    this.updateRunning();
  }

  private updateRunning = () => {
    const should = this.visible && !document.hidden && this.hasTargets && !this.disposed && !this.reduced;
    if (should && !this.running) {
      this.running = true;
      this.last = performance.now();
      this.raf = requestAnimationFrame(this.frame);
    } else if (!should && this.running) {
      this.running = false;
      cancelAnimationFrame(this.raf);
    }
  };

  private frame = (now: number) => {
    if (!this.running) return;
    const dt = Math.min(0.05, Math.max(0.001, (now - this.last) / 1000));
    this.last = now;
    this.time += dt;
    this.step(dt, now);
    this.draw();
    this.raf = requestAnimationFrame(this.frame);
  };

  private step(dt: number, now: number) {
    const f = dt * 60;
    const { pos, vel, tgt, ph, dyn } = this;
    const intro = this.introAt < 0 ? 1 : Math.min(1, (now - this.introAt) / 1800);
    const k = (0.012 + 0.036 * intro * intro) * f;
    const damp = Math.pow(0.86, f);
    const wob = 0.7;
    const t = this.time;

    // pointer in canvas space (a gentle autopilot takes over when nobody is moving the mouse)
    this.canvasRect = this.canvas.getBoundingClientRect();
    const p = this.pointer;
    let mx = p.x - this.canvasRect.left;
    let my = p.y - this.canvasRect.top;
    let R = this.coarse ? 95 : 125;
    let F = 3.4;
    let pvx = p.vx;
    let pvy = p.vy;
    let active = p.active && now - p.lastMove < 2500;
    if (!active && intro >= 1) {
      const s = this.slot;
      const a = t * 0.42;
      mx = s.x + s.w * (0.5 + 0.46 * Math.sin(a));
      my = s.y + s.h * (0.5 + 0.32 * Math.sin(a * 2.3 + 0.7));
      pvx = Math.cos(a) * s.w * 0.004;
      pvy = 0;
      R *= 0.8;
      F *= 0.55;
      active = true;
    }
    p.vx *= 0.8;
    p.vy *= 0.8;
    const R2 = R * R;
    const swirl = 0.55;

    for (let i = 0; i < this.n; i++) {
      const ix = 2 * i;
      const iy = ix + 1;
      let x = pos[ix];
      let y = pos[iy];
      let vx = vel[ix];
      let vy = vel[iy];
      const tx = tgt[ix] + Math.sin(t * 0.9 + ph[i]) * wob;
      const ty = tgt[iy] + Math.cos(t * 0.8 + ph[i] * 1.3) * wob;
      vx += (tx - x) * k;
      vy += (ty - y) * k;
      if (active) {
        const dx = x - mx;
        const dy = y - my;
        const d2 = dx * dx + dy * dy;
        if (d2 < R2) {
          const d = Math.sqrt(d2) + 0.001;
          const fall = 1 - d / R;
          const force = fall * fall * F * f;
          const nx = dx / d;
          const ny = dy / d;
          vx += nx * force - ny * force * swirl + pvx * fall * 0.06 * f;
          vy += ny * force + nx * force * swirl + pvy * fall * 0.06 * f;
        }
      }
      vx *= damp;
      vy *= damp;
      x += vx * f;
      y += vy * f;
      pos[ix] = x;
      pos[iy] = y;
      vel[ix] = vx;
      vel[iy] = vy;
      const j = 3 * i;
      dyn[j] = x;
      dyn[j + 1] = y;
      dyn[j + 2] = Math.sqrt(vx * vx + vy * vy);
    }
  }

  private draw() {
    const gl = this.gl;
    if (this.reduced) {
      for (let i = 0; i < this.n; i++) {
        this.dyn[3 * i] = this.pos[2 * i];
        this.dyn[3 * i + 1] = this.pos[2 * i + 1];
        this.dyn[3 * i + 2] = 0;
      }
    }
    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    if (!this.n) return;
    gl.useProgram(this.prog);
    gl.uniform2f(this.uRes, this.w, this.h);
    gl.uniform1f(this.uDpr, this.dpr);
    gl.uniform1f(this.uTime, this.time);
    gl.uniform1f(this.uGain, this.coarse ? 1.05 : 0.95);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.dynBuf);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.dyn.subarray(0, this.n * 3));
    gl.bindVertexArray(this.vao);
    gl.drawArrays(gl.POINTS, 0, this.n);
    gl.bindVertexArray(null);
  }
}
