import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { destinations } from "@/config/business";
export function DestinationCards({ limit = 6 }: { limit?: number }) {
  return (
    <div className="destination-grid">
      {destinations.slice(0, limit).map((d) => (
        <article className="destination-card" key={d.name}>
          <a
            href={`/?destination=${d.code}#flight-enquiry`}
            aria-label={`Enquire about ${d.name}`}
          >
            <div className="destination-image">
              <Image
                src={d.image}
                alt={`${d.name} destination inspiration`}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 900px) 50vw, 33vw"
              />
              <span className="destination-tag">{d.tag}</span>
              <span className="destination-arrow">
                <ArrowUpRight size={20} />
              </span>
            </div>
            <div className="destination-info">
              <div>
                <h3>{d.name}</h3>
                <span>{d.country}</span>
              </div>
              <p>{d.description}</p>
              <span className="text-link">
                Enquire now <ArrowUpRight size={14} />
              </span>
            </div>
          </a>
        </article>
      ))}
    </div>
  );
}
export function FinalCta() {
  return (
    <section className="container final-cta">
      <span className="eyebrow">YOUR NEXT CHAPTER</span>
      <h2>
        Ready to plan your
        <br />
        next journey?
      </h2>
      <p>
        Tell us where you want to go, and our team will help you explore your
        travel options.
      </p>
      <Link className="button" href="/#flight-enquiry">
        Get Your Travel Quote <ArrowUpRight size={17} />
      </Link>
      <span className="cta-orbit" aria-hidden="true">
        ✦
      </span>
    </section>
  );
}
