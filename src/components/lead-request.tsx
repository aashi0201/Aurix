"use client";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowUpRight, Mail, ShieldCheck } from "lucide-react";
import { business } from "@/config/business";
import { leadSchema, leadConsent, type Lead } from "@/lib/lead-validation";
import { SecurityCheck } from "./turnstile";
export function LeadRequest({ id = "callback-request" }: { id?: string }) {
  const [service, setService] = useState<{
    available: boolean;
    siteKey: string;
  } | null>(null);
  const [interacted, setInteracted] = useState(false);
  const [token, setToken] = useState("");
  const [checkVersion, setCheckVersion] = useState(0);
  const [status, setStatus] = useState("");
  const [success, setSuccess] = useState(false);
  const [emailUrl, setEmailUrl] = useState("");
  const request = useRef({ payload: "", id: "" });
  const busy = useRef(false);
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Lead>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      destination: "",
      preference: "Email",
      consent: false,
      website: "",
    },
  });
  const preference = useWatch({ control, name: "preference" });
  const onToken = useCallback((value: string) => setToken(value), []);
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/enquiries", { signal: controller.signal, cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((value) => {
        if (!controller.signal.aborted)
          setService(
            value?.available && typeof value.siteKey === "string"
              ? { available: true, siteKey: value.siteKey }
              : { available: false, siteKey: "" },
          );
      })
      .catch(() => {
        if (!controller.signal.aborted)
          setService({ available: false, siteKey: "" });
      });
    return () => controller.abort();
  }, []);
  const submit = async (values: Lead) => {
    const draft = `Hello Aurix Travels!\nPlease contact me about a travel enquiry.\nName: ${values.name}\nEmail: ${values.email}\nPreferred contact: ${values.preference}\nPhone: ${values.phone || "Not provided"}\nDestination: ${values.destination || "To be discussed"}\n\nConsent: ${leadConsent}`;
    const fallback = `mailto:${business.email}?subject=${encodeURIComponent("Please contact me about my travel plans")}&body=${encodeURIComponent(draft)}`;
    setEmailUrl(fallback);
    setSuccess(false);
    setStatus("");
    if (!service?.available) {
      setStatus(
        "Your email draft is ready. Open your email app and send it to request a reply. Nothing has been sent automatically.",
      );
      return;
    }
    if (!token) {
      setStatus(
        "Please complete the security check, or use the email draft below.",
      );
      return;
    }
    if (busy.current) return;
    busy.current = true;
    const payload = JSON.stringify(values);
    if (request.current.payload !== payload)
      request.current = { payload, id: crypto.randomUUID() };
    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          token,
          requestId: request.current.id,
        }),
        signal: AbortSignal.timeout(25000),
      });
      const result = await response.json();
      if (response.status === 202 && typeof result.reference === "string") {
        setSuccess(true);
        setStatus(
          "Your request is on its way to our team. Check your inbox for an acknowledgement. This is not a confirmed booking.",
        );
      } else
        setStatus(
          typeof result.message === "string"
            ? result.message
            : "We could not confirm your request. Please use the email option below.",
        );
    } catch {
      setStatus(
        "We could not confirm your request. Retry without changing your details, or use the email option below.",
      );
    } finally {
      busy.current = false;
      setToken("");
      setCheckVersion((v) => v + 1);
    }
  };
  return (
    <form
      id={id}
      className="lead-form"
      onFocusCapture={() => setInteracted(true)}
      onSubmit={(event) => {
        void handleSubmit(submit)(event);
      }}
      noValidate
    >
      <span className="eyebrow">LET US COME BACK TO YOU</span>
      <h2>Prefer a personal reply?</h2>
      <p>Leave a few details and tell us how you’d like to hear from us.</p>
      <div className="lead-fields">
        {(["name", "email", "destination"] as const).map((name) => (
          <label className="field" key={name}>
            <span>
              {name === "name"
                ? "Your name"
                : name === "email"
                  ? "Email for acknowledgement"
                  : "Destination (optional)"}
            </span>
            <input
              type={name === "email" ? "email" : "text"}
              autoComplete={
                name === "name" ? "name" : name === "email" ? "email" : "off"
              }
              maxLength={name === "email" ? 254 : name === "name" ? 100 : 120}
              {...register(name)}
              aria-invalid={!!errors[name]}
              aria-describedby={
                errors[name] ? `${id}-${name}-error` : undefined
              }
            />
            {errors[name] && (
              <span className="field-error" id={`${id}-${name}-error`}>
                {errors[name]?.message}
              </span>
            )}
          </label>
        ))}
        <label className="field">
          <span>How should we contact you?</span>
          <select {...register("preference")}>
            <option>Email</option>
            <option>WhatsApp</option>
            <option>Call</option>
          </select>
        </label>
        {preference !== "Email" && (
          <label className="field lead-phone">
            <span>
              {preference === "WhatsApp" ? "WhatsApp number" : "Phone number"}
            </span>
            <input
              type="tel"
              autoComplete="tel"
              maxLength={25}
              {...register("phone")}
              aria-invalid={!!errors.phone}
              aria-describedby={errors.phone ? `${id}-phone-error` : undefined}
            />
            {errors.phone && (
              <span id={`${id}-phone-error`} className="field-error">
                {errors.phone.message}
              </span>
            )}
          </label>
        )}
      </div>
      <div className="lead-honeypot" aria-hidden="true">
        <label>
          Leave this field empty
          <input autoComplete="off" tabIndex={-1} {...register("website")} />
        </label>
      </div>
      <label className="lead-consent">
        <input
          type="checkbox"
          {...register("consent")}
          aria-invalid={!!errors.consent}
          aria-describedby={`${id}-consent-note${errors.consent ? ` ${id}-consent-error` : ""}`}
        />
        <span>{leadConsent}</span>
      </label>
      {errors.consent && (
        <span className="field-error" id={`${id}-consent-error`}>
          {errors.consent.message}
        </span>
      )}
      <p id={`${id}-consent-note`} className="form-note">
        <ShieldCheck size={14} /> No payment or passport details needed. Read
        our <Link href="/privacy-policy">Privacy Policy</Link>.
      </p>
      {service?.available && interacted && !success && (
        <SecurityCheck
          key={checkVersion}
          siteKey={service.siteKey}
          onToken={onToken}
        />
      )}
      <button
        type="submit"
        className="button"
        disabled={
          isSubmitting ||
          service === null ||
          (!!service?.available && !token) ||
          success
        }
      >
        {isSubmitting
          ? "Sending your request…"
          : service?.available
            ? "Ask Aurix to contact me"
            : "Prepare email request"}
        <ArrowUpRight size={16} />
      </button>
      {service?.available ? (
        <p className="form-note">
          We’ll email an acknowledgement and pass your enquiry to our team.
          WhatsApp and call follow-ups are handled personally.
        </p>
      ) : (
        <p className="form-note">
          This option prepares an email for you to send. You can also{" "}
          <a href={`mailto:${business.email}`}>email us directly</a>.
        </p>
      )}
      {service?.available && !emailUrl && !success && (
        <a className="text-link lead-email" href={`mailto:${business.email}`}>
          Prefer email? Contact us directly
        </a>
      )}
      <div
        className={`form-status ${success ? "lead-success" : ""}`}
        role="status"
        aria-live="polite"
      >
        {status}
      </div>
      {emailUrl && !success && (
        <a className="text-link lead-email" href={emailUrl}>
          <Mail size={16} />
          Open email draft instead
        </a>
      )}
    </form>
  );
}
