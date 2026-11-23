# Profile notes

- Build: `node --test tests/*.test.mjs` then `node src/build.mjs [--date=YYYY-MM-DD] [--all-scenes]` (Node 20+, no deps). Daily Action: `.github/workflows/control-room.yml`.
- Real data only. The hero fact is the latest default-branch commit among the public repos in `SYSTEM` (`src/system.mjs`), plus the account's public repo count. The README table between `<!-- projects:start -->` and `<!-- projects:end -->` is that same list: GitHub description and commit day. A repo that is missing, forked, or private is skipped.
- The banner scene changes every day even when those commit days do not. Do not write a fresh "today" date over a commit that did not change.
- `llms.txt`, `status.json`, and `assets/system-map-*.svg` are the same public list. CI is recorded only when a completed push run is named CI or check. Missing data renders as "no data".
- The layers picture is an illustration of the public tools. It is not a status board.
- The hand-set Become Human meter is not published. `renderBrew` remains for tests; the build does not write it.

## Optional motifs (remove independently)

| Motif | Off switch | Effect |
|---|---|---|
| Pixel cat walking along the bottom letterbox bar | `config.json → motifs.cat: false` | `<g id="motif-cat">` and its animation are not emitted (tested) |
| Live-set / Premiere scenes (live music, IMAX cinema) | delete entries from `src/scenes.mjs` SCENES | rotation shrinks; tests still require ≥5 distinct scenes per week, so keep at least 5 or lower that bar |

Previews: rendered from GitHub's own Markdown API output + github-markdown-css in headless Chrome (`../renderer/`).
