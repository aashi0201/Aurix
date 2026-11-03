import { Mail, MessageCircle, ArrowUpRight } from "lucide-react";
import { PageIntro } from "@/components/page-intro";
import { LeadRequest } from "@/components/lead-request";
import { ContactForm } from "@/components/contact-form";
import { business } from "@/config/business";
import { whatsappUrl } from "@/lib/whatsapp";
export const metadata = {
  title: "Contact Us",
  description:
    "Contact Aurix Travels by email or prepare a travel enquiry. Get personal assistance planning your next trip.",
  alternates: { canonical: "/contact" },
};
export default function Contact() {
  const url = whatsappUrl(
    business.whatsapp,
    "Hello Aurix Travels! I would like travel assistance.",
  );
  return (
    <>
      <PageIntro eyebrow="LET’S TALK TRAVEL" title="Good journeys start here.">
        A question, an idea, or a destination in mind? We’d love to hear from
        you.
      </PageIntro>
      <section className="container section contact-grid">
        <div>
          <span className="eyebrow">GET IN TOUCH</span>
          <h2>
            A real conversation.
            <br />A personal plan.
          </h2>
          <div className="contact-channel">
            <span className="service-icon">
              <Mail size={22} />
            </span>
            <div>
              <h3>Email us</h3>
              <a className="text-link" href={`mailto:${business.email}`}>
                {business.email}
              </a>
            </div>
          </div>
          <div className="contact-channel">
            <span className="service-icon">
              <MessageCircle size={22} />
            </span>
            <div>
              <h3>WhatsApp</h3>
              {url ? (
                <a
                  href={url}
                  className="text-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Start a conversation <ArrowUpRight size={15} />
                </a>
              ) : (
                <p>
                  Our WhatsApp contact is being set up. Please use email for
                  now.
                </p>
              )}
            </div>
          </div>
          {business.phone && (
            <p>
              Phone: <a href={`tel:${business.phone}`}>{business.phone}</a>
            </p>
          )}
          {business.address && <p>{business.address}</p>}
          {business.businessHours && <p>{business.businessHours}</p>}
          <div className="contact-note">
            Flight enquiries are quotation requests. A booking is confirmed only
            after you receive explicit confirmation and ticketing details from
            the agent.
          </div>
        </div>
        <div>
          <LeadRequest id="enquire" />
          <details className="contact-alternative" id="longer-enquiry">
            <summary>Prefer to write a longer email?</summary>
            <ContactForm />
          </details>
        </div>
      </section>
    </>
  );
}
