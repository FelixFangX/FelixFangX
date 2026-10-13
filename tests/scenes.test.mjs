import { test } from "node:test";
import assert from "node:assert/strict";
import { pickScene, SCENES } from "../src/scenes.mjs";

test("same date always yields the same scene", () => {
  assert.equal(pickScene(new Date("2026-10-13")).id, pickScene(new Date("2026-10-13T23:00:00Z")).id);
});
test("a week of days shows at least 5 different scenes (no fixed template)", () => {
  const ids = new Set(Array.from({ length: 7 }, (_, i) => pickScene(new Date(Date.UTC(2026, 9, 13 + i))).id));
  assert.ok(ids.size >= 5, `only ${ids.size}`);
});
test("every scene declares a mode from the focus/recovery/fun balance", () => {
  for (const s of SCENES) assert.ok(["focus", "recovery", "fun"].includes(s.mode), s.id);
});
