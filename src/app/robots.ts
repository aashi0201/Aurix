import { business } from "@/config/business";
export default function robots() {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${business.domain}/sitemap.xml`,
  };
}
