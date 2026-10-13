import { test } from "node:test";
import assert from "node:assert/strict";
import { renderLog, inject } from "../src/log.mjs";

const c = (message, repo = "FelixFangX/a", date = "2026-10-12T03:00:00Z") => ({ repo, date, message });

test("one row per repo: latest commit's first line", () => {
  assert.match(renderLog([c("fix: retry\n\nbody")]), /^\| 2026-10-12 \| \[a\]\(https:\/\/github.com\/FelixFangX\/a\) \| fix: retry \|$/);
});
test("newest repo first regardless of input order", () => {
  const out = renderLog([c("old", "u/old", "2026-01-01T00:00:00Z"), c("new", "u/new", "2026-10-01T00:00:00Z")]);
  assert.ok(out.indexOf("new") < out.indexOf("old"));
});
test("pipes in commit messages cannot break the table", () => {
  assert.doesNotMatch(renderLog([c("a | b")]), /a \| b/);
});
test("emoji-prefixed bot messages are normalised, not hidden", () => {
  assert.match(renderLog([c("📰 2026-10-12 11:26:18 自动备份")]), /\| 2026-10-12 11:26:18 自动备份 \|/);
});
test("respects the row limit", () => {
  assert.equal(renderLog([c("1", "u/1"), c("2", "u/2"), c("3", "u/3")], 2).split("\n").length, 2);
});
test("inject touches only the marked region", () => {
  const out = inject("A\n<!-- agent-log:start -->old<!-- agent-log:end -->\nB", "| x |");
  assert.ok(out.startsWith("A\n") && out.endsWith("\nB") && !out.includes("old"));
});
