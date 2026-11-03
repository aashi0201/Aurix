import { z } from "zod";
export const leadConsent =
  "Aurix Travels may contact me about this travel enquiry using my selected contact method and send me an email acknowledgement. This is not consent to marketing.";
export const leadSchema = z
  .object({
    name: z.string().trim().min(2, "Please enter your name.").max(100),
    email: z.email("Please enter a valid email address.").max(254),
    phone: z
      .string()
      .trim()
      .max(25)
      .refine(
        (v) => !v || /^[+\d\s()-]{7,25}$/.test(v),
        "Please enter a valid phone number.",
      ),
    preference: z.enum(["Email", "WhatsApp", "Call"]),
    destination: z.string().trim().max(120),
    consent: z
      .boolean()
      .refine(Boolean, "Please agree to being contacted about this enquiry."),
    website: z.string().max(0, "Please leave this field empty."),
  })
  .superRefine((v, ctx) => {
    if (v.preference !== "Email" && !v.phone)
      ctx.addIssue({
        code: "custom",
        path: ["phone"],
        message: "Add your number so we can contact you this way.",
      });
  });
export const leadRequestSchema = leadSchema.and(
  z.object({ requestId: z.uuid(), token: z.string().min(1).max(2048) }),
);
export type Lead = z.infer<typeof leadSchema>;
