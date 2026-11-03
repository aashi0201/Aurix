import { test } from "node:test";
import assert from "node:assert/strict";
import {
  indiaDateKey,
  heroForDay,
  millisecondsUntilIndiaMidnight,
} from "./daily-hero";
import { heroCollection } from "../config/hero";
import { existsSync } from "node:fs";
import { join } from "node:path";
test("India date changes at 18:30 UTC, not browser or server midnight", () => {
  assert.equal(indiaDateKey(new Date("2026-11-03T18:29:59Z")), "2026-11-03");
  assert.equal(indiaDateKey(new Date("2026-11-03T18:30:00Z")), "2026-11-04");
  assert.equal(indiaDateKey(new Date("2026-12-31T18:30:00Z")), "2027-01-01");
});
test("curated backgrounds stay consistent per India day and cycle across days", () => {
  const sequence = ["2026-11-03", "2026-11-04", "2026-11-05", "2026-11-06"].map(
    (day) => heroForDay(day).id,
  );
  assert.equal(new Set(sequence).size, 4);
  assert.equal(heroForDay("2026-11-07").id, heroForDay("2026-11-03").id);
  assert.equal(heroForDay("2026-11-02").id, "thailand");
  assert.equal(heroForDay("").id, "santorini");
  assert.equal(heroForDay("not-a-date").id, "santorini");
});
test("midnight scheduler handles boundary and year rollover", () => {
  assert.equal(
    millisecondsUntilIndiaMidnight(Date.parse("2026-11-03T18:29:59Z")),
    1000,
  );
  assert.equal(
    millisecondsUntilIndiaMidnight(Date.parse("2026-11-03T18:30:00Z")),
    86_400_000,
  );
  assert.equal(
    millisecondsUntilIndiaMidnight(Date.parse("2026-12-31T18:29:59.999Z")),
    1,
  );
});
test("every background points to an existing local asset with accessible descriptions", () => {
  for (const item of heroCollection) {
    assert.ok(existsSync(join(process.cwd(), "public", item.src)));
    assert.ok(item.alt);
    assert.ok(item.location);
  }
});
