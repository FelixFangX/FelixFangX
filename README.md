<!-- Hero SVGs and the agent log regenerate daily via .github/workflows/control-room.yml -->

<a href="https://github.com/FelixFangX">
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./assets/hero-dark.svg">
  <img alt="Felix Fang. Daily banner. My agents run the ops. I keep the judgment. The scene changes every day." src="./assets/hero-light.svg" width="100%">
</picture>
</a>

<sub>The banner scene rotates daily across focus, recovery, and fun. Scene art is animated (drawing traces, equalizer, dialogue, breathing rings, a walking cat, a blinking cursor). The daily Action rewrites <code>assets/hero-light.svg</code> and <code>assets/hero-dark.svg</code>.</sub>

My agents run the ops. I keep the judgment.

> Fast software, careful UI, open source, and an iced americano.

[ledring.dev](https://ledring.dev) · [X @ColeFangX](https://x.com/ColeFangX)

## Products

**[LEDRING / Play](https://play.ledring.dev/play/)** — Review AI builders like a game: watch the branch tree, catch instruction drift.

**[maptaste](https://maptaste.ledring.dev)** — Stop agents shipping rainbow MapLibre choropleths.

```sh
npx maptaste check style.json --pack global
```

**[lakeboard-converter](https://convert.ledring.dev)** — Mind maps your agents can actually read — Lakeboard/XMind → Markdown.

```sh
npx -y lakeboard-converter mcp
```

<details>
<summary>Daily diagrams</summary>

The Action still draws these. The map uses real GitHub Actions runs and committed eval results. The status bar is set by hand. Agents can read [`llms.txt`](./llms.txt) or [`status.json`](./status.json).

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./assets/layers-dark.svg">
  <img alt="Two layers. Agents handle the repetitive repos. I keep spec, review, and what ships." src="./assets/layers-light.svg" width="100%">
</picture>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./assets/system-map-dark.svg">
  <img alt="System map from GitHub Actions and committed evals. A failing run shows as failing. Private repos show no status." src="./assets/system-map-light.svg" width="100%">
</picture>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./assets/status-dark.svg">
  <img alt="Become Human plan status, set by hand. Stages: Spec, Slices, Tests, Release." src="./assets/status-light.svg" width="100%">
</picture>

</details>

## Agent log

<sub>Pulled from my public GitHub activity by a daily Action. Real events only.</sub>

<!-- agent-log:start -->
| date&nbsp;(UTC) | repo | latest commit |
|---|---|---|
| 2026-10-30 | [ledring.dev](https://github.com/FelixFangX/ledring.dev) | Merge pull request #20 from FelixFangX/feat/apex-view-transitions |
| 2026-10-30 | [dashtaste](https://github.com/FelixFangX/dashtaste) | Merge pull request #4 from FelixFangX/feat/blend-fold |
| 2026-10-30 | [lakeboard-converter](https://github.com/FelixFangX/lakeboard-converter) | Merge pull request #28 from FelixFangX/feat/blend-fold |
| 2026-10-30 | [ledring](https://github.com/FelixFangX/ledring) | Merge pull request #104 from FelixFangX/feat/blend-fold-play |
| 2026-10-30 | [research-thinking-ai](https://github.com/FelixFangX/research-thinking-ai) | Merge pull request #24 from FelixFangX/feat/blend-fold |
| 2026-10-30 | [maptaste](https://github.com/FelixFangX/maptaste) | Merge pull request #2 from FelixFangX/feat/blend-fold |
<!-- agent-log:end -->
