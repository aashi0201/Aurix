import { test } from "node:test";
import assert from "node:assert/strict";
import { flightSchema, localDate, type Flight } from "./validation";
import { airports } from "./airports";
import { flightMessage, whatsappUrl } from "./whatsapp";
const valid: Flight = {
  trip: "Round Trip",
  from: airports[0].label,
  to: airports[5].label,
  departure: "2099-12-15",
  returnDate: "2099-12-22",
  adults: 2,
  children: 0,
  infants: 0,
  cabin: "Economy",
  airline: "",
  flexible: false,
  notes: "",
};
test("valid one-way and round-trip enquiries", () => {
  assert.ok(flightSchema.safeParse(valid).success);
  assert.ok(
    flightSchema.safeParse({ ...valid, trip: "One Way", returnDate: "" })
      .success,
  );
});
test("rejects invalid routes, past dates, malformed dates and return order", () => {
  for (const patch of [
    { from: "Unknown" },
    { to: valid.from },
    { departure: "2000-01-01" },
    { departure: "2099-02-31" },
    { returnDate: "2099-12-14" },
    { returnDate: "" },
  ])
    assert.equal(flightSchema.safeParse({ ...valid, ...patch }).success, false);
});
test("traveller rules enforce adult accompaniment and total limit", () => {
  for (const patch of [
    { adults: 0 },
    { children: -1 },
    { infants: 3 },
    { adults: 8, children: 2 },
    { adults: 1.5 },
  ])
    assert.equal(flightSchema.safeParse({ ...valid, ...patch }).success, false);
});
test("local date uses local calendar components", () => {
  const now = new Date(2026, 10, 3, 0, 5);
  assert.equal(localDate(now), "2026-11-03");
});
test("WhatsApp URL is encoded and missing/invalid numbers cannot open", () => {
  assert.equal(whatsappUrl("", "hello"), null);
  assert.equal(whatsappUrl("+123", "hello"), null);
  assert.equal(whatsappUrl("01234567890", "hello"), null);
  const url = whatsappUrl("919876543210", flightMessage(valid));
  assert.ok(url);
  assert.equal(new URL(url).searchParams.get("text"), flightMessage(valid));
});
test("message contains journey details and omits return for one way", () => {
  const message = flightMessage({
    ...valid,
    airline: "Example & Airline",
    notes: "Window seat & assistance",
    flexible: true,
  });
  for (const text of [
    "Round Trip",
    "DEL",
    "DXB",
    "15 December 2099",
    "22 December 2099",
    "Adults: 2",
    "Children: 0",
    "Infants: 0",
    "Economy",
    "Example & Airline",
    "Window seat & assistance",
    "Flexible travel dates: Yes",
  ])
    assert.ok(message.includes(text));
  assert.equal(
    flightMessage({ ...valid, trip: "One Way" }).includes("Return:"),
    false,
  );
});
