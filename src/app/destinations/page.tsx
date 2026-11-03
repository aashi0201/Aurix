import { PageIntro } from "@/components/page-intro";
import { DestinationCards, FinalCta } from "@/components/destinations";
export const metadata = {
  title: "Popular Destinations",
  description:
    "Find inspiration in Dubai, Maldives, Switzerland, London, Singapore and Thailand. Enquire about travel options with Aurix.",
  alternates: { canonical: "/destinations" },
};
export default function Destinations() {
  return (
    <>
      <PageIntro eyebrow="WHERE TO NEXT?" title="Find your kind of escape.">
        A little inspiration for the places you’ve been dreaming about.
      </PageIntro>
      <section className="container section">
        <h2 className="sr-only">Explore our destinations</h2>
        <DestinationCards />
        <p className="section-note">
          Images are generated illustrations for inspiration, not advertised
          packages. Enquire for individually checked travel options,
          availability and conditions.
        </p>
      </section>
      <FinalCta />
    </>
  );
}
