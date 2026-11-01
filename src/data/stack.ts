import type { SimpleIcon } from "simple-icons";
import {
  siClaude,
  siDart,
  siDocker,
  siFastify,
  siFfmpeg,
  siFlutter,
  siGit,
  siGooglegemini,
  siLinux,
  siMediapipe,
  siNodedotjs,
  siNumba,
  siNumpy,
  siOllama,
  siOpencv,
  siPm2,
  siPython,
  siQwen,
  siRedis,
  siSocketdotio,
  siTelegram,
  siTypescript,
  siWebrtc,
  siAndroid,
} from "simple-icons";
import type { L } from "../i18n/lang";

const l = (fa: string, en: string): L => ({ fa, en });

export type Tool = { name: string; icon?: SimpleIcon; color?: string };

const t = (name: string, icon?: SimpleIcon, color?: string): Tool => ({ name, icon, color });

/** Marquee rows */
export const marqueeRows: Tool[][] = [
  [
    t("Flutter", siFlutter, "#54C5F8"),
    t("Dart", siDart, "#2CB7F6"),
    t("Node.js", siNodedotjs, "#7CC36E"),
    t("Socket.IO", siSocketdotio, "#ffffff"),
    t("WebRTC", siWebrtc, "#ffffff"),
    t("Redis", siRedis, "#FF5B4A"),
    t("Fastify", siFastify, "#ffffff"),
    t("Docker", siDocker, "#3EA8F4"),
    t("PM2", siPm2, "#9F7BFF"),
    t("Android", siAndroid, "#3DDC84"),
    t("TypeScript", siTypescript, "#4A90E2"),
  ],
  [
    t("Python", siPython, "#5B9BD5"),
    t("MediaPipe", siMediapipe, "#22C5D4"),
    t("OpenCV", siOpencv, "#8A74FF"),
    t("NumPy", siNumpy, "#4DABCF"),
    t("Numba", siNumba, "#00A3E0"),
    t("FFmpeg", siFfmpeg, "#3FBF3F"),
    t("Ollama", siOllama, "#ffffff"),
    t("Qwen", siQwen, "#8B7BFF"),
    t("Gemma", siGooglegemini, "#A992E8"),
    t("Claude Code", siClaude, "#E08A63"),
    t("Linux", siLinux, "#FCC624"),
    t("Git", siGit, "#F05133"),
  ],
];

export const capabilityGroups: {
  key: string;
  title: L;
  text: L;
  accent: string;
  tools: Tool[];
}[] = [
  {
    key: "mobile",
    title: l("موبایل", "Mobile"),
    text: l(
      "اپ‌های Flutter با حس بومی، رابط فارسی راست‌چین، تماس تصویری و آمادهٔ انتشار در فروشگاه.",
      "Flutter apps that feel native — Persian RTL interfaces, video calling, store-ready builds.",
    ),
    accent: "#54C5F8",
    tools: [t("Flutter", siFlutter, "#54C5F8"), t("Dart", siDart, "#2CB7F6"), t("Provider"), t("go_router"), t("WebRTC", siWebrtc), t("Golden tests")],
  },
  {
    key: "backend",
    title: l("بک‌اند و بی‌درنگ", "Backend & real-time"),
    text: l(
      "سرورهای وب‌سوکت، صف جفت‌سازی، کیف پول و پنل مدیریت — با تست بار و امنیت.",
      "WebSocket servers, matchmaking queues, wallets and admin panels — load-tested and hardened.",
    ),
    accent: "#FF5B4A",
    tools: [t("Node.js", siNodedotjs, "#7CC36E"), t("Fastify", siFastify), t("Socket.IO", siSocketdotio), t("Redis", siRedis, "#FF5B4A"), t("PM2", siPm2, "#9F7BFF"), t("Docker", siDocker, "#3EA8F4"), t("coturn"), t("Linux", siLinux, "#FCC624")],
  },
  {
    key: "ai",
    title: l("هوش مصنوعی و بینایی", "AI & vision"),
    text: l(
      "ردیابی دست و حرکات، مدل‌های زبانی محلی و ایجنت‌ها، و ساختن سریع با هوش مصنوعی.",
      "Hand and gesture tracking, local language models and agents, and building fast with AI.",
    ),
    accent: "#22C5D4",
    tools: [t("MediaPipe", siMediapipe, "#22C5D4"), t("OpenCV", siOpencv, "#8A74FF"), t("Ollama", siOllama), t("Qwen", siQwen, "#8B7BFF"), t("Gemma", siGooglegemini, "#A992E8"), t("Claude Code", siClaude, "#E08A63")],
  },
  {
    key: "media",
    title: l("گرافیک، صدا و رسانه", "Graphics, audio & media"),
    text: l(
      "ذرات و نور، موشن‌گرافیک با کد، سنتز صدا و خط تولید ویدیو.",
      "Particles and light, motion graphics in code, sound synthesis and video pipelines.",
    ),
    accent: "#FFB547",
    tools: [t("Python", siPython, "#5B9BD5"), t("NumPy", siNumpy, "#4DABCF"), t("Numba", siNumba, "#00A3E0"), t("Pillow"), t("FFmpeg", siFfmpeg, "#3FBF3F"), t("WebGL")],
  },
];

export const alsoTools: Tool[] = [
  t("TypeScript", siTypescript, "#4A90E2"),
  t("Git", siGit, "#F05133"),
  t("PowerShell"),
  t("Telegram bots", siTelegram, "#26A5E4"),
  t("Android", siAndroid, "#3DDC84"),
];
