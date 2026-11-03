import { Plane, ArrowUpRight } from "lucide-react";
import { PageIntro } from "@/components/page-intro";
import { enabledServices } from "@/config/business";
import { WhatsappLink } from "@/components/whatsapp-link";
export const metadata = {
  title: "Travel Services",
  description:
    "Explore personalized flight ticketing assistance and request a quotation from Aurix Travels.",
  alternates: { canonical: "/services" },
};
export default function Services() {
  return (
    <>
      <PageIntro eyebrow="HERE TO HELP" title="Travel plans, made simpler.">
        Personalized assistance and clear next steps for your journey.
      </PageIntro>
      <section className="container section">
        {enabledServices.map((s) => (
          <article id={s.id} key={s.id} className="service-card">
            <span className="service-icon">
              <Plane />
            </span>
            <div>
              <h2>{s.name}</h2>
              <p>{s.description}</p>
              <p>
                Share your route, dates, traveller details and cabin preference.
                We’ll discuss options, applicable supplier conditions, and the
                next steps before any booking is made.
              </p>
              <p>
                Fares and availability can change until confirmed by the
                supplier. No live inventory or automatic ticket issuance is
                provided on this website.
              </p>
            </div>
            <WhatsappLink
              message={`Hello Aurix Travels! I would like assistance with ${s.name}.`}
            >
              Enquire now <ArrowUpRight size={17} />
            </WhatsappLink>
          </article>
        ))}
      </section>
    </>
  );
}
