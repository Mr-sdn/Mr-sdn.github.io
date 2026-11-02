import type { SimpleIcon } from "simple-icons";
import {
  siAndroid,
  siClaude,
  siDart,
  siDocker,
  siFastify,
  siFfmpeg,
  siFlask,
  siFlutter,
  siGit,
  siGooglegemini,
  siLinux,
  siMediapipe,
  siMysql,
  siNodedotjs,
  siNumba,
  siNumpy,
  siOllama,
  siOpencv,
  siPm2,
  siPython,
  siQwen,
  siReact,
  siRedis,
  siSocketdotio,
  siSqlalchemy,
  siSqlite,
  siTelegram,
  siTypescript,
  siWebrtc,
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
    t("Flask", siFlask, "#ffffff"),
    t("SQLAlchemy", siSqlalchemy, "#D7A27A"),
    t("Docker", siDocker, "#3EA8F4"),
    t("PM2", siPm2, "#9F7BFF"),
    t("Android", siAndroid, "#3DDC84"),
    t("TypeScript", siTypescript, "#4A90E2"),
  ],
  [
    t("Python", siPython, "#5B9BD5"),
    t("Telegram", siTelegram, "#2AABEE"),
    t("MediaPipe", siMediapipe, "#22C5D4"),
    t("OpenCV", siOpencv, "#8A74FF"),
    t("NumPy", siNumpy, "#4DABCF"),
    t("Numba", siNumba, "#00A3E0"),
    t("FFmpeg", siFfmpeg, "#3FBF3F"),
    t("SQLite", siSqlite, "#5BA7D8"),
    t("Ollama", siOllama, "#ffffff"),
    t("Qwen", siQwen, "#8B7BFF"),
    t("Gemma", siGooglegemini, "#A992E8"),
    t("Claude Code", siClaude, "#E08A63"),
    t("Linux", siLinux, "#FCC624"),
    t("Git", siGit, "#F05133"),
  ],
];

/** The services section ("انجام پروژه"): what I build, with the tools behind each. */
export const services: {
  key: string;
  title: L;
  text: L;
  accent: string;
  tools: Tool[];
}[] = [
  {
    key: "mobile",
    title: l("اپ موبایل", "Mobile apps"),
    text: l(
      "اپ موبایل با Flutter: رابط فارسی راست‌چین، چت و تماس تصویری، حالت آفلاین و نسخهٔ آمادهٔ انتشار در فروشگاه.",
      "Flutter apps with Persian RTL interfaces, chat and video calls, offline mode and store-ready builds.",
    ),
    accent: "#54C5F8",
    tools: [t("Flutter", siFlutter, "#54C5F8"), t("Dart", siDart, "#2CB7F6"), t("Provider"), t("go_router"), t("WebRTC", siWebrtc), t("Golden tests")],
  },
  {
    key: "web",
    title: l("سایت و بک‌اند", "Websites & backends"),
    text: l(
      "سایت فروشگاهی و آموزشی، API و سرور بی‌درنگ، پنل مدیریت و درگاه پرداخت؛ با تست بار و امنیت.",
      "Store and course websites, APIs and real-time servers, admin panels and payment gateways — load-tested and secured.",
    ),
    accent: "#FF5B4A",
    tools: [t("Node.js", siNodedotjs, "#7CC36E"), t("Fastify", siFastify), t("Socket.IO", siSocketdotio), t("Redis", siRedis, "#FF5B4A"), t("Flask", siFlask), t("SQLAlchemy", siSqlalchemy, "#D7A27A"), t("Docker", siDocker, "#3EA8F4"), t("Linux", siLinux, "#FCC624")],
  },
  {
    key: "bots",
    title: l("ربات تلگرام و بله", "Telegram & Bale bots"),
    text: l(
      "ربات فروش و پرداخت، چت ناشناس، آپلودر و پردازش فایل؛ با پنل مدیریت داخل خود ربات.",
      "Bots for sales and payments, anonymous chat, file uploads and media processing — with an admin panel inside the bot.",
    ),
    accent: "#2AABEE",
    tools: [t("Telegram", siTelegram, "#2AABEE"), t("Python", siPython, "#5B9BD5"), t("Pyrogram"), t("Bale Bot API"), t("MySQL", siMysql, "#6BA3C8"), t("SQLite", siSqlite, "#5BA7D8"), t("FFmpeg", siFfmpeg, "#3FBF3F")],
  },
  {
    key: "ai",
    title: l("هوش مصنوعی و بینایی ماشین", "AI & computer vision"),
    text: l(
      "ردیابی دست و حرکت، گرافیک تعاملی، و راه‌اندازی مدل‌های زبانی روی کامپیوتر خودتان، بدون اینترنت.",
      "Hand and gesture tracking, interactive graphics, and language models that run offline on your own computer.",
    ),
    accent: "#22C5D4",
    tools: [t("MediaPipe", siMediapipe, "#22C5D4"), t("OpenCV", siOpencv, "#8A74FF"), t("NumPy", siNumpy, "#4DABCF"), t("Numba", siNumba, "#00A3E0"), t("Ollama", siOllama), t("Qwen", siQwen, "#8B7BFF"), t("Claude Code", siClaude, "#E08A63")],
  },
];

export const alsoTools: Tool[] = [
  t("TypeScript", siTypescript, "#4A90E2"),
  t("React", siReact, "#61DAFB"),
  t("WebGL"),
  t("Git", siGit, "#F05133"),
  t("PowerShell"),
  t("Android", siAndroid, "#3DDC84"),
];
