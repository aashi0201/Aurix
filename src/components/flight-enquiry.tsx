"use client";
import { useEffect, useState, useSyncExternalStore } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRight,
  PlaneTakeoff,
  ShieldCheck,
  SlidersHorizontal,
} from "lucide-react";
import { flightSchema, localDate, type Flight } from "@/lib/validation";
import { flightMessage, whatsappUrl } from "@/lib/whatsapp";
import { airports } from "@/lib/airports";
import { business } from "@/config/business";
const subscribeToDate = (update: () => void) => {
  const timer = window.setInterval(update, 60_000);
  return () => window.clearInterval(timer);
};
export function FlightEnquiry() {
  const today = useSyncExternalStore(subscribeToDate, localDate, () => "");
  const [status, setStatus] = useState("");
  const [draft, setDraft] = useState("");
  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Flight>({
    resolver: zodResolver(flightSchema),
    defaultValues: {
      trip: "One Way",
      from: "",
      to: "",
      departure: "",
      returnDate: "",
      adults: 1,
      children: 0,
      infants: 0,
      cabin: "Economy",
      airline: "",
      flexible: false,
      notes: "",
    },
  });
  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("destination");
    const a = airports.find((a) => a.code === code);
    if (a) setValue("to", a.label);
  }, [setValue]);
  const trip = useWatch({ control, name: "trip" });
  const departure = useWatch({ control, name: "departure" });
  const submit = (values: Flight) => {
    const msg = flightMessage(values);
    setDraft(msg);
    const url = whatsappUrl(business.whatsapp, msg);
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
      setStatus(
        "Your message is prepared and WhatsApp has been requested. If it did not open, use the link below. Send the message there to start the conversation. This is a quotation request, not a confirmed booking.",
      );
    } else
      setStatus(
        "WhatsApp enquiries are not available yet. Your travel details are ready below. Copy them into an email to our team.",
      );
  };
  const error = (name: keyof Flight) =>
    errors[name] && (
      <span id={`${name}-error`} className="field-error">
        {errors[name]?.message}
      </span>
    );
  const inputProps = (name: keyof Flight) => ({
    "aria-invalid": !!errors[name],
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
  });
  return (
    <section
      id="flight-enquiry"
      className="container enquiry-anchor"
      aria-labelledby="enquiry-title"
    >
      <div className="enquiry-card">
        <div className="enquiry-heading">
          <div>
            <span className="eyebrow">LET’S GET YOU GOING</span>
            <h2 id="enquiry-title">Where would you like to fly?</h2>
          </div>
          <span className="enquiry-badge">
            <PlaneTakeoff size={17} /> Personalized flight quotes
          </span>
        </div>
        <form onSubmit={handleSubmit(submit)} noValidate>
          <fieldset className="trip-types">
            <legend className="sr-only">Trip type</legend>
            {["One Way", "Round Trip"].map((t) => (
              <label key={t}>
                <input type="radio" value={t} {...register("trip")} />
                {t}
              </label>
            ))}
          </fieldset>
          <div className="flight-fields">
            {(["from", "to"] as const).map((name) => (
              <label key={name} className="field">
                <span>{name === "from" ? "From" : "To"}</span>
                <input
                  list={`airports-${name}`}
                  placeholder={
                    name === "from"
                      ? "Departure city or airport"
                      : "Where are you headed?"
                  }
                  autoComplete="off"
                  {...register(name)}
                  {...inputProps(name)}
                />
                <datalist id={`airports-${name}`}>
                  {airports.map((a) => (
                    <option key={a.code} value={a.label}>
                      {a.city} · {a.name} · {a.code}
                    </option>
                  ))}
                </datalist>
                {error(name)}
              </label>
            ))}
            <label className="field">
              <span>Departure</span>
              <input
                type="date"
                min={today}
                {...register("departure")}
                {...inputProps("departure")}
              />
              {error("departure")}
            </label>
            {trip === "Round Trip" && (
              <label className="field">
                <span>Return</span>
                <input
                  type="date"
                  min={departure || today}
                  {...register("returnDate")}
                  {...inputProps("returnDate")}
                />
                {error("returnDate")}
              </label>
            )}
          </div>
          <div className="traveller-fields">
            {(["adults", "children", "infants"] as const).map((name, i) => (
              <label className="field" key={name}>
                <span>
                  {["Adults (12+)", "Children (2–11)", "Infants (under 2)"][i]}
                </span>
                <input
                  type="number"
                  min={name === "adults" ? 1 : 0}
                  max={9}
                  {...register(name, { valueAsNumber: true })}
                  {...inputProps(name)}
                />
                {error(name)}
              </label>
            ))}
            <label className="field">
              <span>Cabin class</span>
              <select {...register("cabin")}>
                {["Economy", "Premium Economy", "Business", "First Class"].map(
                  (c) => (
                    <option key={c}>{c}</option>
                  ),
                )}
              </select>
              {error("cabin")}
            </label>
          </div>
          <details className="preferences">
            <summary>
              <SlidersHorizontal size={15} /> Add travel preferences{" "}
              <span>Optional</span>
            </summary>
            <div className="preferences-fields">
              <label className="field">
                <span>Preferred airline</span>
                <input maxLength={100} {...register("airline")} />
                {error("airline")}
              </label>
              <label className="check-label">
                <input type="checkbox" {...register("flexible")} /> My travel
                dates are flexible
              </label>
              <label className="field">
                <span>Additional requirements</span>
                <textarea
                  maxLength={1000}
                  placeholder="Anything else we should know? Please do not include sensitive information."
                  {...register("notes")}
                />
                {error("notes")}
              </label>
            </div>
          </details>
          <div className="enquiry-bottom">
            <span>
              <ShieldCheck size={16} /> Personal assistance. No automated
              bookings.
            </span>
            <button className="button" type="submit">
              Get Flight Quote on WhatsApp <ArrowRight size={17} />
            </button>
          </div>
          {!whatsappUrl(business.whatsapp, "test") && (
            <p className="form-note">
              WhatsApp contact is being set up. You can prepare your request
              here and email it to {business.email}.
            </p>
          )}
          <div role="status" className="form-status">
            {status}
          </div>
          {draft && (
            <div className="message-draft">
              {whatsappUrl(business.whatsapp, draft) && (
                <a
                  className="button"
                  target="_blank"
                  rel="noopener noreferrer"
                  href={whatsappUrl(business.whatsapp, draft)!}
                >
                  Open prepared WhatsApp message <ArrowRight size={16} />
                </a>
              )}
              <label className="field">
                <span>Your travel enquiry</span>
                <textarea readOnly rows={12} value={draft} />
              </label>
              <a
                className="text-link"
                href={`mailto:${business.email}?subject=${encodeURIComponent("Flight quotation enquiry")}&body=${encodeURIComponent(draft)}`}
              >
                Open email with these details <ArrowRight size={16} />
              </a>
            </div>
          )}
        </form>
      </div>
    </section>
  );
}
