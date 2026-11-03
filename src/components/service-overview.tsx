import Link from "next/link";
import {
  ArrowUpRight,
  Plane,
  MapPinned,
  UsersRound,
  MessageCircle,
} from "lucide-react";
import { enabledServices } from "@/config/business";
import { WhatsappLink } from "./whatsapp-link";
export function ServiceOverview({
  headingLevel = 3,
}: {
  headingLevel?: 2 | 3;
}) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return (
    <div className="service-overview">
      <div className="service-list">
        {enabledServices.map((s) => (
          <article key={s.id} className="service-feature" id={s.id}>
            <span className="service-icon">
              <Plane size={27} />
            </span>
            <span className="eyebrow">PERSONAL TRAVEL ASSISTANCE</span>
            <Heading className="service-title">{s.name}</Heading>
            <p>{s.description}</p>
            <div className="service-features">
              <span>
                <MapPinned size={16} />
                {s.id === "flights"
                  ? "Domestic & international routes"
                  : "Discuss options and requirements"}
              </span>
              <span>
                <UsersRound size={16} />
                Your dates. Your travel preferences.
              </span>
            </div>
            {s.id === "flights" ? (
              <Link className="text-link" href="/#flight-enquiry">
                Request your flight quote <ArrowUpRight size={17} />
              </Link>
            ) : (
              <WhatsappLink
                className="text-link"
                message={`Hello Aurix Travels! I would like assistance with ${s.name}.`}
              >
                Enquire about {s.name} <ArrowUpRight size={17} />
              </WhatsappLink>
            )}
          </article>
        ))}
      </div>
      <aside className="service-help">
        <MessageCircle size={28} />
        <Heading className="service-title">
          Not sure where
          <br />
          to start?
        </Heading>
        <p>
          You don’t need every detail figured out. Tell us what you have in
          mind, and we’ll help with the next steps.
        </p>
        <WhatsappLink className="button button-light">
          Talk to our team <ArrowUpRight size={17} />
        </WhatsappLink>
        <span className="service-help-note">
          Personal guidance. Clear communication.
        </span>
      </aside>
    </div>
  );
}
