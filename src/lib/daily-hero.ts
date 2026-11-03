import { heroCollection, heroRotation } from "../config/hero";
const DAY = 86_400_000;
const INDIA_OFFSET = 19_800_000;
const formatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: heroRotation.timeZone,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});
export function indiaDateKey(date = new Date()) {
  const parts = formatter.formatToParts(date);
  const get = (part: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === part)!.value;
  return `${get("year")}-${get("month")}-${get("day")}`;
}
export function heroForDay(day: string) {
  if (!heroRotation.enabled || !/^\d{4}-\d{2}-\d{2}$/.test(day))
    return heroCollection[0];
  const offset = Math.floor(
    (Date.parse(`${day}T00:00:00Z`) -
      Date.parse(`${heroRotation.startDate}T00:00:00Z`)) /
      DAY,
  );
  if (!Number.isFinite(offset)) return heroCollection[0];
  return heroCollection[
    ((offset % heroCollection.length) + heroCollection.length) %
      heroCollection.length
  ];
}
export function millisecondsUntilIndiaMidnight(now = Date.now()) {
  return DAY - ((((now + INDIA_OFFSET) % DAY) + DAY) % DAY);
}
