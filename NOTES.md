# Agent Control Room v3: notes

- Build: `node --test tests/` then `node src/build.mjs [--date=YYYY-MM-DD] [--all-scenes]` (Node 20+, no deps). Daily Action: `.github/workflows/control-room.yml`.
- Real data only: hero facts (latest pushed own repo, public repo count) and the Agent log (latest commit of 6 most recently pushed own non-fork repos) come from the public GitHub API.
- Live system map (`assets/system-map-*.svg`), `llms.txt` and `status.json` come from `src/system.mjs`: latest CI run on each repo's default branch, last scheduled run (digest, weekly watch) and committed eval files. Missing data renders as "no data".
- Placeholder: Become Human stage is set by hand in `config.json` (`becomeHuman.stage`, currently 0 = Spec) and labelled "plan status · set by hand" in the SVG.
- Illustrative only: the "markets" scene curve is labelled "not market data".

## Optional motifs (remove independently)
| Motif | Off switch | Effect |
|---|---|---|
| Pixel cat walking along the bottom letterbox bar | `config.json → motifs.cat: false` | `<g id="motif-cat">` and its animation are not emitted (tested) |
| Espresso "extraction" crema gradient on the status bar | `motifs.brew: false` | plain accent bar, "☕ extraction" label removed |
| Live-set / Premiere scenes (live music, IMAX cinema) | delete entries from `src/scenes.mjs` SCENES | rotation shrinks; tests still require ≥5 distinct scenes per week, so keep at least 5 or lower that bar |

Previews: rendered from GitHub's own Markdown API output + github-markdown-css in headless Chrome (`../renderer/`).

