import { business } from "@/config/business";
import Image from "next/image";
import { PageIntro } from "@/components/page-intro";
import { FinalCta } from "@/components/destinations";
export const metadata = {
  title: "About Us",
  description:
    "Get to know Aurix Travels and our personal approach to flight enquiries and travel guidance.",
  alternates: { canonical: "/about" },
};
export default function About() {
  return (
    <>
      <PageIntro
        eyebrow="HELLO, WE’RE AURIX"
        title="Your journey deserves personal attention."
      >
        A thoughtful approach to travel, built around the person taking the
        trip.
      </PageIntro>
      <section className="container section about-preview">
        <div className="about-visual">
          <Image
            src={business.assets.hero}
            fill
            sizes="(max-width: 800px) 100vw, 45vw"
            alt="Original coastal illustration"
          />
        </div>
        <div>
          <h2>
            A conversation.
            <br />
            Then a world of possibilities.
          </h2>
          <p>
            Aurix Travels is a travel-service brand focused on helping people
            explore domestic and international flight options with clear,
            personal guidance.
          </p>
          <p>
            We start by listening. Share your destination, dates and
            preferences, and we’ll help you take the next step. Flight options
            and quotations are checked separately through an authorized
            ticketing provider.
          </p>
          <p>
            Our approach is simple: understand your requirements, communicate
            clearly, and help you make an informed decision. Sending an enquiry
            does not create a booking.
          </p>
        </div>
      </section>
      <FinalCta />
    </>
  );
}
