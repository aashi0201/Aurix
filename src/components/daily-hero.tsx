"use client";
import Image from "next/image";
import { useState, useSyncExternalStore } from "react";
import { MapPin, Compass, ArrowRight, ArrowUpRight } from "lucide-react";
import { heroCollection } from "@/config/hero";
import {
  heroForDay,
  indiaDateKey,
  millisecondsUntilIndiaMidnight,
} from "@/lib/daily-hero";
import { WhatsappLink } from "./whatsapp-link";

function subscribeToDay(update: () => void) {
  let timer: number;
  const schedule = () => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      update();
      schedule();
    }, millisecondsUntilIndiaMidnight() + 50);
  };
  const resume = () => {
    update();
    schedule();
  };
  schedule();
  window.addEventListener("focus", resume);
  document.addEventListener("visibilitychange", resume);
  return () => {
    window.clearTimeout(timer);
    window.removeEventListener("focus", resume);
    document.removeEventListener("visibilitychange", resume);
  };
}
const serverDay = () => "";

export function DailyHero() {
  const day = useSyncExternalStore(subscribeToDay, indiaDateKey, serverDay);
  const selected = heroForDay(day);
  const [loaded, setLoaded] = useState<string>(heroCollection[0].id);
  const visible = loaded === selected.id ? selected : heroCollection[0];
  return (
    <section
      className="hero"
      aria-labelledby="hero-title"
      data-hero={visible.id}
    >
      <Image
        src={heroCollection[0].src}
        alt={visible.id === heroCollection[0].id ? visible.alt : ""}
        fill
        priority
        sizes="100vw"
        style={{ objectPosition: heroCollection[0].position }}
      />
      {selected.id !== heroCollection[0].id && (
        <Image
          key={selected.id}
          src={selected.src}
          alt={loaded === selected.id ? selected.alt : ""}
          fill
          sizes="100vw"
          loading="eager"
          onLoad={() => setLoaded(selected.id)}
          className={`daily-hero-image ${loaded === selected.id ? "is-ready" : ""}`}
          style={{ objectPosition: selected.position }}
        />
      )}
      <div className="hero-shade" />
      <div className="container hero-content">
        <span className="hero-kicker">
          <span /> YOUR NEXT JOURNEY STARTS HERE
        </span>
        <h1 id="hero-title">
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
          {visible.location}
          <small>A new view each day · Destination inspiration</small>
        </span>
      </div>
    </section>
  );
}
