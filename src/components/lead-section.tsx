import { MessageCircle, Check } from "lucide-react";
import { LeadRequest } from "./lead-request";
export function LeadSection() {
  return (
    <section
      className="section lead-section"
      aria-labelledby="lead-section-title"
    >
      <div className="container lead-section-grid">
        <div className="lead-intro">
          <span className="service-icon">
            <MessageCircle size={26} />
          </span>
          <span className="eyebrow">A CONVERSATION, AT YOUR CONVENIENCE</span>
          <h2 id="lead-section-title">
            Your plans don’t have
            <br />
            to be perfect yet.
          </h2>
          <p>
            Whether you know your destination or are still exploring, let us
            know how to reach you. We’ll help you take the next step.
          </p>
          <ul className="check-list">
            <li>
              <Check size={17} />
              You choose how we contact you
            </li>
            <li>
              <Check size={17} />
              No payment or booking commitment
            </li>
            <li>
              <Check size={17} />
              No marketing subscription
            </li>
          </ul>
        </div>
        <LeadRequest />
      </div>
    </section>
  );
}
