import { business } from "./business";

// Only bright, owner-reviewable local assets. Add new licensed images here;
// arbitrary third-party photographs are never fetched at runtime.
export const heroCollection = [
  {
    id: "santorini",
    src: business.assets.hero,
    alt: "Generated Santorini-inspired blue domes overlooking the Mediterranean",
    location: "Santorini, Greece",
    position: "center 55%",
  },
  {
    id: "maldives",
    src: "/images/maldives.png",
    alt: "Generated Maldives-inspired turquoise lagoon and palm-lined shore",
    location: "Maldives",
    position: "center 55%",
  },
  {
    id: "switzerland",
    src: "/images/switzerland.png",
    alt: "Generated Swiss Alps-inspired mountains, green meadows and alpine village",
    location: "Swiss Alps, Switzerland",
    position: "center 50%",
  },
  {
    id: "thailand",
    src: "/images/thailand.png",
    alt: "Generated Thailand-inspired limestone cliffs and turquoise sea",
    location: "Krabi, Thailand",
    position: "center 55%",
  },
] as const;
export const heroRotation = {
  enabled: true,
  timeZone: "Asia/Kolkata",
  startDate: "2026-11-03",
} as const;
