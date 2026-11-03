import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  ArrowRight,
  Compass,
  Headphones,
  Globe2,
  Plane,
  Check,
  MapPin,
} from "lucide-react";
import { FlightEnquiry } from "@/components/flight-enquiry";
import { WhatsappLink } from "@/components/whatsapp-link";
import { DestinationCards, FinalCta } from "@/components/destinations";
import { Reveal } from "@/components/reveal";
import { business, enabledServices } from "@/config/business";
export const metadata = { alternates: { canonical: "/" } };
export default function Home() {
  return (
    <>
      <section className="hero">
        <Image
          src={business.assets.hero}
          alt="Generated Santorini-inspired view of blue domes and the Mediterranean coast"
          fill
          priority
          sizes="100vw"
        />
        <div className="hero-shade" />
        <div className="container hero-content">
          <span className="hero-kicker">
            <span /> YOUR NEXT JOURNEY STARTS HERE
          </span>
          <h1>
            Explore the World
            <br />
            with <em>Aurix Travels.</em>
          </h1>
          <p>
            Your journey starts here. Discover destinations and get personalized
            assistance for your next trip.
          </p>
          <div className="hero-actions">
            <a className="button" href="#flight-enquiry">
              Plan Your Journey <ArrowUpRight size={18} />
            </a>
            <WhatsappLink className="hero-secondary">
              Chat on WhatsApp <ArrowRight size={17} />
            </WhatsappLink>
          </div>
          <div className="hero-footnote">
            <Compass size={18} /> Thoughtfully planned. Personally guided.
          </div>
        </div>
        <div className="hero-location">
          <MapPin size={15} />
          <span>
            Oia, Santorini{" "}
            <small>A little inspiration for your next escape</small>
          </span>
        </div>
      </section>
      <FlightEnquiry />
      <section className="container trust-row">
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
            A little destination inspiration. Availability and travel options
            are confirmed individually.
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
          {enabledServices.map((s) => (
            <article key={s.id} className="service-card">
              <span className="service-icon">
                <Plane />
              </span>
              <div>
                <h3>{s.name}</h3>
                <p>{s.description}</p>
              </div>
              <Link className="button button-light" href="/#flight-enquiry">
                Let’s plan your flight <ArrowUpRight size={17} />
              </Link>
            </article>
          ))}
        </div>
      </section>
      <FinalCta />
    </>
  );
}
