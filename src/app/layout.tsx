import type { Metadata } from "next";
import { Header, Footer } from "@/components/layout";
import { business } from "@/config/business";
import "./globals.css";
export const metadata: Metadata = {
  metadataBase: new URL(business.domain),
  title: {
    default: "Aurix Travels | Your next journey, thoughtfully planned",
    template: "%s | Aurix Travels",
  },
  description:
    "Personalized domestic and international flight enquiries with Aurix Travels. Share your travel plans for manual quotations and friendly travel assistance.",
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: business.name,
    title: "Explore the world with Aurix Travels",
    description: "Personal travel assistance for your next journey.",
  },
  twitter: { card: "summary_large_image" },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: business.name,
              url: business.domain,
              email: business.email,
            }).replace(/</g, "\\u003c"),
          }}
        />
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
