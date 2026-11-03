import type { Flight } from "./validation";
export function whatsappUrl(number: string, message: string) {
  return /^[1-9]\d{7,14}$/.test(number)
    ? `https://wa.me/${number}?text=${encodeURIComponent(message)}`
    : null;
}
function formatDate(v: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${v}T12:00:00`));
}
export function flightMessage(v: Flight) {
  return [
    "Hello Aurix Travels!",
    "I would like a flight quotation.",
    `Trip Type: ${v.trip}`,
    `From: ${v.from}`,
    `To: ${v.to}`,
    `Departure: ${formatDate(v.departure)}`,
    v.trip === "Round Trip" ? `Return: ${formatDate(v.returnDate)}` : "",
    `Adults: ${v.adults}`,
    `Children: ${v.children}`,
    `Infants: ${v.infants}`,
    `Class: ${v.cabin}`,
    v.airline ? `Preferred airline: ${v.airline}` : "",
    `Flexible travel dates: ${v.flexible ? "Yes" : "No"}`,
    v.notes ? `Additional requirements: ${v.notes}` : "",
    "Please share available flight options and fares.",
    "Thank you!",
  ]
    .filter(Boolean)
    .join("\n");
}
