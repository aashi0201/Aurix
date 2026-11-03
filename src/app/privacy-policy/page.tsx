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
          The website validates and formats details in your browser. It does not
          have an enquiry database and does not itself submit or store form
          entries on a server. You choose whether to send a prepared message
          through WhatsApp or your email application. Sent messages may then be
          retained in the business’s email or messaging account to respond and
          assist with your request.
        </p>
        <h2>Third-party services</h2>
        <p>
          WhatsApp and your email provider process information under their own
          policies. Opening their links may share information such as your IP
          address and prepared message with those services. Hosting providers
          may process technical request logs for delivery and security. The
          final hosting provider and retention practices must be documented
          before launch.
        </p>
        <h2>Cookies and local data</h2>
        <p>
          This implementation does not add advertising trackers, analytics
          scripts, or persistent enquiry storage. Essential infrastructure
          behavior should be reviewed with the selected hosting provider.
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
