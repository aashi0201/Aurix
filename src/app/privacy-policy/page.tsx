import { PageIntro } from "@/components/page-intro";
import { business } from "@/config/business";
export const metadata = {
  title: "Privacy Policy — Draft",
  description:
    "Draft privacy information for the Aurix Travels enquiry website.",
  alternates: { canonical: "/privacy-policy" },
  robots: { index: false, follow: true },
};
export default function Privacy() {
  return (
    <>
      <PageIntro
        eyebrow="PRIVACY"
        title="Your information, handled thoughtfully."
      >
        Draft for business review before public launch. Last updated 3 November
        2026.
      </PageIntro>
      <article className="container legal section">
        <p className="review-note">
          This is an editable policy draft. It has not been legally reviewed.
          Actual business practices and hosting arrangements must be confirmed
          before launch.
        </p>
        <h2>Information you choose to provide</h2>
        <p>
          You may provide travel dates, routes, traveller counts, preferences,
          and contact details when preparing an enquiry. Please do not send
          passport numbers, payment card data, or other sensitive information
          through these forms.
        </p>
        <h2>How enquiries work</h2>
        <p>
          Flight enquiries and the longer contact form prepare WhatsApp or email
          drafts for you to send. The optional personal-reply form, when
          enabled, sends the details you submit to our team through Resend and
          requests an email acknowledgement to your address. This happens only
          after you submit the form and actively agree to contact about that
          enquiry. If automatic requests are unavailable, the form prepares an
          email draft instead and tells you nothing was sent automatically. We
          do not have a lead database or add these details to a marketing list.
          Messages may be retained in our business inbox and by our email
          delivery provider to handle your request.
        </p>
        <h2>Third-party services</h2>
        <p>
          WhatsApp and your email provider process messages under their own
          policies. Resend processes submitted contact details to send enquiry
          notifications and acknowledgements when the automatic form is enabled.
          A Cloudflare Turnstile security check loads when you interact with
          that enabled form; Cloudflare may process technical browser and
          network information to prevent abuse. The server verifies the security
          token before requesting email delivery. Hosting providers may process
          technical request logs for delivery and security. Provider
          arrangements and retention practices must be reviewed before launch.
        </p>
        <h2>Cookies and local data</h2>
        <p>
          This implementation does not add advertising trackers, analytics
          scripts, or a persistent lead database. Short-lived, hashed anti-abuse
          counters may be held in server memory; email providers and the
          business inbox retain sent messages under their own practices.
          Essential infrastructure behavior should be reviewed with the selected
          hosting provider.
        </p>
        <h2>Use and retention</h2>
        <p>
          Enquiry details are intended for responding to requests and discussing
          travel arrangements. The business must confirm a retention schedule,
          access controls and any supplier-sharing process before accepting
          operational bookings.
        </p>
        <h2>Questions and requests</h2>
        <p>
          Contact <a href={`mailto:${business.email}`}>{business.email}</a> to
          ask about the information you have shared, request correction, or
          discuss deletion, subject to any applicable recordkeeping
          requirements.
        </p>
      </article>
    </>
  );
}
