import { business } from "@/config/business";
export default function sitemap() {
  return ["", "/about", "/services", "/destinations", "/contact"].map(
    (path) => ({
      url: `${business.domain}${path}`,
      changeFrequency: "monthly" as const,
      priority: path ? 0.7 : 1,
    }),
  );
}
