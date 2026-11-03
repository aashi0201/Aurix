import Link from "next/link";
import { business } from "@/config/business";
import { whatsappUrl } from "@/lib/whatsapp";
export function WhatsappLink({
  children,
  message = "Hello Aurix Travels! I would like help planning a journey.",
  className = "button",
}: {
  children: React.ReactNode;
  message?: string;
  className?: string;
}) {
  const url = whatsappUrl(business.whatsapp, message);
  return url ? (
    <a
      className={className}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ) : (
    <Link className={className} href="/contact#enquire">
      {children}
    </Link>
  );
}
