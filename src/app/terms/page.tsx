import { PageIntro } from "@/components/page-intro";
import { business } from "@/config/business";
export const metadata = {
  title: "Terms & Conditions — Draft",
  description:
    "Draft terms for flight quotations and travel enquiries with Aurix Travels.",
  alternates: { canonical: "/terms" },
  robots: { index: false, follow: true },
};
export default function Terms() {
  return (
    <>
      <PageIntro
        eyebrow="WEBSITE TERMS"
        title="Clear expectations for your journey."
      >
        Draft for business review before public launch. Last updated 3 November
        2026.
      </PageIntro>
      <article className="container legal section">
        <p className="review-note">
          Editable draft only. Legal and commercial review is required before
          launch. No unverified registration or accreditation is asserted.
        </p>
        <h2>Enquiries, not instant bookings</h2>
        <p>
          This website presents the supplied Aurix Travels Limited brand and
          enables travel enquiries. It is not a live flight search, payment or
          ticket issuance platform. Preparing an enquiry, opening WhatsApp, or
          sending a message does not confirm a booking.
        </p>
        <h2>Quotations and availability</h2>
        <p>
          Flight options are checked separately with an authorized supplier.
          Fares, availability and conditions may change. Destination photographs
          are for inspiration and do not indicate an available package or
          guaranteed experience.
        </p>
        <h2>Confirming arrangements</h2>
        <p>
          Before agreeing to a booking, request and review the itinerary, total
          price, supplier conditions and applicable payment and ticketing
          requirements. A booking requires explicit agent confirmation and the
          appropriate supplier documentation.
        </p>
        <h2>Supplier conditions</h2>
        <p>
          Airlines and other providers set their own baggage, travel-document,
          schedule and service conditions. Confirm applicable requirements for
          your specific trip before proceeding.
        </p>
        <h2>Changes, cancellations and refunds</h2>
        <p>
          Applicable change, cancellation and refund conditions must be
          disclosed for the selected fare or service before booking. This
          website does not establish a universal refund policy, guarantee
          refunds, or process automated cancellations.
        </p>
        <h2>Your enquiry details</h2>
        <p>
          Provide accurate travel preferences and contact details. Do not
          include sensitive identity or payment information in website
          enquiries. See the Privacy Policy for this website’s enquiry workflow.
        </p>
        <h2>Support and policy review</h2>
        <p>
          For questions, contact{" "}
          <a href={`mailto:${business.email}`}>{business.email}</a>. These draft
          terms must be updated to reflect verified business information and
          agreed commercial practices.
        </p>
      </article>
    </>
  );
}
