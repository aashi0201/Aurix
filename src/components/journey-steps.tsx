import {
  ArrowUpRight,
  MapPinned,
  MessagesSquare,
  PlaneTakeoff,
} from "lucide-react";
import Link from "next/link";
const steps = [
  {
    icon: MapPinned,
    title: "Tell us your travel plans",
    text: "Choose your route, dates and the little details that make the trip yours.",
  },
  {
    icon: MessagesSquare,
    title: "Let’s explore your options",
    text: "Send your enquiry. We’ll discuss available options and supplier conditions with you.",
  },
  {
    icon: PlaneTakeoff,
    title: "Take the next step, together",
    text: "Review the quotation with your agent before agreeing to any booking or payment.",
  },
];
export function JourneySteps() {
  return (
    <section className="section journey-section">
      <div className="container">
        <div className="section-heading">
          <div>
            <span className="eyebrow">
              FROM A LITTLE IDEA TO YOUR NEXT JOURNEY
            </span>
            <h2>
              Three simple steps.
              <br />
              One personal conversation.
            </h2>
          </div>
          <Link className="text-link" href="/#flight-enquiry">
            Let’s start planning <ArrowUpRight size={17} />
          </Link>
        </div>
        <ol className="journey-grid">
          {steps.map((step, i) => (
            <li key={step.title}>
              <div className="journey-step-top">
                <span className="service-icon">
                  <step.icon size={25} />
                </span>
                <span className="step-number">0{i + 1}</span>
              </div>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
        <p className="section-note">
          An enquiry starts a conversation. A booking requires separate
          confirmation.
        </p>
      </div>
    </section>
  );
}
