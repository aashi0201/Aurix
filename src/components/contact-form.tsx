"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { business } from "@/config/business";
const schema = z.object({
  name: z.string().trim().min(2, "Enter your name.").max(100),
  email: z.email("Enter a valid email."),
  phone: z
    .string()
    .max(25)
    .refine(
      (v) => !v || /^[+\d\s()-]{6,25}$/.test(v),
      "Enter a valid phone number or leave it blank.",
    ),
  subject: z.string().trim().min(2, "Enter a subject.").max(150),
  message: z
    .string()
    .trim()
    .min(10, "Please add at least 10 characters.")
    .max(2000),
});
type Values = z.infer<typeof schema>;
export function ContactForm() {
  const [url, setUrl] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>({ resolver: zodResolver(schema) });
  return (
    <form
      id="email-enquiry"
      className="contact-form"
      onSubmit={handleSubmit((v) => {
        const body = `Name: ${v.name}\nEmail: ${v.email}\nPhone: ${v.phone || "Not provided"}\n\n${v.message}`;
        setUrl(
          `mailto:${business.email}?subject=${encodeURIComponent(v.subject)}&body=${encodeURIComponent(body)}`,
        );
      })}
      noValidate
    >
      <h2>Tell us what you have in mind.</h2>
      <p>
        This form prepares an email. Nothing is sent or stored by this website.
      </p>
      {(["name", "email", "phone", "subject", "message"] as const).map((n) => (
        <label className="field" key={n}>
          <span>
            {n[0].toUpperCase() + n.slice(1)}{" "}
            {n === "phone" ? "(optional)" : ""}
          </span>
          {n === "message" ? (
            <textarea
              rows={5}
              maxLength={2000}
              {...register(n)}
              aria-invalid={!!errors[n]}
              aria-describedby={errors[n] ? `${n}-error` : undefined}
            />
          ) : (
            <input
              type={n === "email" ? "email" : n === "phone" ? "tel" : "text"}
              maxLength={n === "subject" ? 150 : n === "phone" ? 25 : 100}
              autoComplete={
                n === "name"
                  ? "name"
                  : n === "email"
                    ? "email"
                    : n === "phone"
                      ? "tel"
                      : "off"
              }
              {...register(n)}
              aria-invalid={!!errors[n]}
              aria-describedby={errors[n] ? `${n}-error` : undefined}
            />
          )}{" "}
          {errors[n] && (
            <span className="field-error" id={`${n}-error`}>
              {errors[n]?.message}
            </span>
          )}
        </label>
      ))}
      <p className="form-note">
        Please don’t include passport details or payment information. See our{" "}
        <a href="/privacy-policy">Privacy Policy</a>.
      </p>
      <button type="submit" className="button">
        Prepare email enquiry
      </button>
      {url && (
        <div className="form-status" role="status">
          <p>
            Your email draft is ready. Open your email app and send it to
            contact us.
          </p>
          <a className="text-link" href={url}>
            Open email draft →
          </a>
        </div>
      )}
    </form>
  );
}
