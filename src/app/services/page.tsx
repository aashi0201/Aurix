import { JourneySteps } from "@/components/journey-steps";
import { ServiceOverview } from "@/components/service-overview";
import { FinalCta } from "@/components/destinations";
import { PageIntro } from "@/components/page-intro";
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
        <ServiceOverview headingLevel={2} />
        <p className="section-note">
          Fares and availability are checked individually. Supplier conditions
          and booking requirements are shared before you decide.
        </p>
      </section>
      <JourneySteps />
      <FinalCta />
    </>
  );
}
