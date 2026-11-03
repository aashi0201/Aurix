import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Compass,
  Headphones,
  Globe2,
  Plane,
  Check,
} from "lucide-react";
import { FlightEnquiry } from "@/components/flight-enquiry";
import { LeadSection } from "@/components/lead-section";
import { DailyHero } from "@/components/daily-hero";
import { JourneySteps } from "@/components/journey-steps";
import { ServiceOverview } from "@/components/service-overview";
import { DestinationCards, FinalCta } from "@/components/destinations";
import { Reveal } from "@/components/reveal";
import { business } from "@/config/business";
export const metadata = { alternates: { canonical: "/" } };
export default function Home() {
  return (
    <>
      <DailyHero />
      <FlightEnquiry />
      <section
        className="container trust-row"
        aria-label="Personal travel guidance"
      >
        {[
          [
            Compass,
            "Personalized Travel Assistance",
            "Your preferences, at the heart of every plan.",
          ],
          [
            Plane,
            "Convenient Flight Enquiries",
            "Share your route. We’ll help with the next step.",
          ],
          [
            Globe2,
            "Domestic & International Support",
            "Near or far, explore your travel possibilities.",
          ],
          [
            Headphones,
            "Dedicated Customer Guidance",
            "A real conversation, from start to finish.",
          ],
        ].map(([Icon, title, description]) => {
          const I = Icon as typeof Compass;
          return (
            <div key={String(title)}>
              <I size={23} />
              <h3>{String(title)}</h3>
              <p>{String(description)}</p>
            </div>
          );
        })}
      </section>
      <section className="section destinations-section home-destinations">
        <div className="container">
          <Reveal>
            <div className="section-heading">
              <div>
                <span className="eyebrow">FIND YOUR SOMEWHERE</span>
                <h2>A world worth exploring.</h2>
                <p>
                  City lights, island days, or a breath of mountain air. Where
                  will you go next?
                </p>
              </div>
              <Link className="text-link" href="/destinations">
                All destinations <ArrowUpRight size={18} />
              </Link>
            </div>
            <DestinationCards limit={4} />
          </Reveal>
          <p className="section-note">
            Generated imagery for destination inspiration. Travel options are
            confirmed individually.
          </p>
        </div>
      </section>
      <section className="container section about-preview">
        <Reveal className="about-visual">
          <Image
            src={business.assets.story}
            alt="Original Maldives-inspired island illustration"
            fill
            sizes="(max-width: 800px) 100vw, 45vw"
          />
          <div className="image-caption">
            <Compass />
            <span>
              Good journeys start
              <br />
              <strong>with a little guidance.</strong>
            </span>
          </div>
        </Reveal>
        <Reveal>
          <span className="eyebrow">MORE THAN A DESTINATION</span>
          <h2>
            Your plans.
            <br />
            Our personal attention.
          </h2>
          <p>
            Every journey is a little different. At Aurix Travels, we take the
            time to understand yours — where you want to go, how you like to
            travel, and what matters along the way.
          </p>
          <p>
            From a quick trip home to a long-awaited escape, we make the next
            steps feel simpler.
          </p>
          <ul className="check-list">
            {[
              "Travel assistance shaped around you",
              "Clear communication at every step",
              "Domestic and international flight support",
            ].map((t) => (
              <li key={t}>
                <Check size={17} />
                {t}
              </li>
            ))}
          </ul>
          <Link className="text-link" href="/about">
            Get to know Aurix <ArrowUpRight size={17} />
          </Link>
        </Reveal>
      </section>
      <section className="section services-preview">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="eyebrow">A LITTLE HELP, A LONG WAY</span>
              <h2>Let’s make travel simpler.</h2>
              <p>Practical assistance for the journey you have in mind.</p>
            </div>
            <Link className="text-link" href="/services">
              Explore our services <ArrowUpRight size={17} />
            </Link>
          </div>
          <ServiceOverview />
        </div>
      </section>
      <JourneySteps />
      <LeadSection />
      <FinalCta />
    </>
  );
}
