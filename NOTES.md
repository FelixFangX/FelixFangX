# Profile notes

- Build: `node --test tests/*.test.mjs` then `node src/build.mjs [--date=YYYY-MM-DD] [--all-scenes]` (Node 20+, no deps). Daily Action: `.github/workflows/control-room.yml` (runs at `00:05 UTC` / `08:05 UTC+8` so Actions queue jitter stays on the same UTC day as `pickScene()`).
- Real data only: hero facts (latest default-branch commit among the curated public repos in `SYSTEM`, plus public repo count) and the `Public repos` table (`<!-- projects:start -->` … `<!-- projects:end -->`) come from the public GitHub API. Missing, forked, or private repos are skipped.
- The banner scene rotates every UTC day even when product commit dates stay put. Do not overwrite a repo's commit date with today's date.
- Live status map (`assets/system-map-*.svg`), `llms.txt`, and `status.json` come from `src/system.mjs`: latest completed push run named `CI` or `check` on each repo's default branch, optional scheduled runs, and committed eval files. Missing data renders as "no data".
- Illustrative only: the "markets" scene curve is labelled "not market data"; the two-layer diagram illustrates the active public tools rather than live status.

## Optional motifs (remove independently)

| Motif | Off switch | Effect |
|---|---|---|
| Pixel cat walking along the bottom letterbox bar | `config.json → motifs.cat: false` | `<g id="motif-cat">` and its animation are not emitted (tested) |
| Live-set / Premiere scenes (live music, IMAX cinema) | delete entries from `src/scenes.mjs` SCENES | rotation shrinks; tests still require ≥5 distinct scenes per week, so keep at least 5 or lower that bar |

Previews: rendered from GitHub's own Markdown API output + github-markdown-css in headless Chrome (`../renderer/`).
