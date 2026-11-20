import test from "node:test";
import assert from "node:assert/strict";
import { formatHours, to12h } from "../lib/hours";
test("12h conversion", () => { assert.equal(to12h("09:30"), "9:30 am"); assert.equal(to12h("13:30"), "1:30 pm"); assert.equal(to12h("21:30"), "9:30 pm"); assert.equal(to12h("12:00"), "12:00 pm"); });
test("daily hours match the Google profile", () => {
  assert.equal(formatHours([{ days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], ranges: [["09:30", "13:30"], ["17:00", "21:30"]] }]), "Daily: 9:30 am–1:30 pm, 5:00 pm–9:30 pm");
});
test("partial week lists days; empty is null", () => { assert.equal(formatHours([{ days: ["Mon", "Tue"], ranges: [["10:00", "12:00"]] }]), "Mon, Tue: 10:00 am–12:00 pm"); assert.equal(formatHours(null), null); });
