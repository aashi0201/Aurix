import { z } from "zod";
import { airports } from "./airports";
export function localDate(now = new Date()) {
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}
const airport = z
  .string()
  .refine(
    (v) => airports.some((a) => a.label === v),
    "Choose an airport from the suggestions.",
  );
const date = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a valid date.")
  .refine((v) => {
    const d = new Date(`${v}T12:00:00`);
    return !isNaN(d.getTime()) && localDate(d) === v;
  }, "Choose a valid date.");
export const flightSchema = z
  .object({
    trip: z.enum(["One Way", "Round Trip"]),
    from: airport,
    to: airport,
    departure: date,
    returnDate: z.string(),
    adults: z.number().int().min(1).max(9),
    children: z.number().int().min(0).max(8),
    infants: z.number().int().min(0).max(9),
    cabin: z.enum(["Economy", "Premium Economy", "Business", "First Class"]),
    airline: z.string().max(100),
    flexible: z.boolean(),
    notes: z.string().max(1000),
  })
  .superRefine((v, c) => {
    const issue = (path: string, message: string) =>
      c.addIssue({ code: "custom", path: [path], message });
    if (v.from === v.to) issue("to", "Choose a different arrival airport.");
    if (v.departure < localDate())
      issue("departure", "Departure cannot be in the past.");
    if (
      v.trip === "Round Trip" &&
      (!date.safeParse(v.returnDate).success || v.returnDate < v.departure)
    )
      issue("returnDate", "Choose a return date on or after departure.");
    if (v.infants > v.adults)
      issue("infants", "Each infant must be accompanied by an adult.");
    if (v.adults + v.children + v.infants > 9)
      issue(
        "adults",
        "For more than 9 travellers, please contact us by email.",
      );
  });
export type Flight = z.infer<typeof flightSchema>;
