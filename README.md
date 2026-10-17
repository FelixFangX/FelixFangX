<!-- Agent Control Room v3. Assets regenerate daily via .github/workflows/control-room.yml -->
<a href="https://github.com/FelixFangX">
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./assets/hero-dark.svg">
  <img alt="Felix Fang — Agent Control Room. Agents run the ops, I keep the judgment. Building Become Human: portable, private, correctable memory for agents. The banner scene changes every day." src="./assets/hero-light.svg" width="100%">
</picture>
</a>

<p align="center">
  <a href="https://ledring.dev"><img alt="ledring.dev — Felix Fang's personal site" src="https://ledring.dev/og.png" width="640"></a>
  <br>
  <sub><b><a href="https://ledring.dev">ledring.dev</a></b> · my site · <a href="https://play.ledring.dev/play/">play LEDRING</a> · <a href="https://x.com/ColeFangX">X @ColeFangX</a></sub>
</p>

> Fast software, careful UI, open source, and an iced americano.

## ▶ Flagship: LEDRING

[![LEDRING Play](https://raw.githubusercontent.com/FelixFangX/ledring/main/docs/assets/play.gif)](https://play.ledring.dev/play/)

**[Play LEDRING in your browser](https://play.ledring.dev/play/)**. You watch an AI builder make a web page and decide what gets through. The free built-in AI needs no key; the game is in English and 中文. Under the hood it is a toolkit that replays agent traces as branch trees and scores how far a run drifted from its instruction. **[Repo →](https://github.com/FelixFangX/ledring)**

## The control room

My agents run the repetitive parts of work and life. I stay in the loop where judgment matters: what to build, how to test it, and whether it actually works.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./assets/layers-dark.svg">
  <img alt="Two layers. Agent layer handles ops: research-thinking-ai, n8n-workflow-collection, tech-news-digest, lakeboard-converter. Human layer keeps judgment: spec, seams, review, decide. Specs flow to agents; evidence and diffs flow back." src="./assets/layers-light.svg" width="100%">
</picture>

| Agent layer | What it takes off my plate |
|---|---|
| [**research-thinking-ai**](https://github.com/FelixFangX/research-thinking-ai) | Turns a vague research interest into evidence-tiered directions · [live](https://research-thinking-ai.vercel.app) |
| [**n8n-workflow-collection**](https://github.com/FelixFangX/n8n-workflow-collection) | Lark/Feishu bot messages → Bitable records and PRD drafts; social metrics tracking |
| **tech-news-digest** <sub>(private)</sub> | Papers, GitHub Trending and Stack Overflow, ranked to my interests every morning |
| [**lakeboard-converter**](https://github.com/FelixFangX/lakeboard-converter) | Yuque Lakeboard / XMind → Markdown that agents can read |
| [**dev-work-grok-bot-skill**](https://github.com/FelixFangX/dev-work-grok-bot-skill) | A Grok Bot skill that sets up a careful developer assistant: repos, tracker, team chat, preview tests, with a secret/PII checker |
| [**ledring**](https://github.com/FelixFangX/ledring) | Status lights for my agents: replays many runs as one branch tree with divergence %, and scores how far a run drifted from its instruction. Claude Code + OpenTelemetry GenAI traces |

## Live system map

<sub>Sense → think → act. Built daily from GitHub Actions runs and committed eval results only; failing runs show as failing. Agents: read [`llms.txt`](./llms.txt) or [`status.json`](./status.json).</sub>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./assets/system-map-dark.svg">
  <img alt="Live system map: sense (tech-news-digest, lakeboard-converter, n8n-workflow-collection) feeds think (research-thinking-ai) feeds act (dev-work-grok-bot-skill). Each public node shows its real CI status, last scheduled run and latest eval result; the private digest shows no status." src="./assets/system-map-light.svg" width="100%">
</picture>

## Now building: Become Human

A personal memory layer for agents that is **portable** (plain files, any model), **private** (stays on your disk), and **correctable** (you can see and fix what it believes about you).

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./assets/status-dark.svg">
  <img alt="Become Human plan status. Stages: Spec, Slices, Tests, Release. Status is set by hand." src="./assets/status-light.svg" width="100%">
</picture>

## Agent log

<sub>Pulled from my public GitHub activity by a daily Action. Real events only.</sub>

<!-- agent-log:start -->
| date&nbsp;(UTC) | repo | latest commit |
|---|---|---|
| 2026-10-17 | [ledring](https://github.com/FelixFangX/ledring) | Merge pull request #99 from FelixFangX/fix/i18n-strict-bilingual |
| 2026-10-17 | [research-thinking-ai](https://github.com/FelixFangX/research-thinking-ai) | Merge pull request #16 from FelixFangX/fix/i18n-strict-bilingual |
| 2026-10-17 | [lakeboard-converter](https://github.com/FelixFangX/lakeboard-converter) | Merge pull request #15 from FelixFangX/fix/i18n-strict-bilingual |
| 2026-10-16 | [n8n-workflow-collection](https://github.com/FelixFangX/n8n-workflow-collection) | feat: split workflows into global (English) and cn (Chinese) editions (# |
| 2026-10-14 | [dev-work-grok-bot-skill](https://github.com/FelixFangX/dev-work-grok-bot-skill) | docs: README in house style with For agents section (#21) |
| 2026-04-19 | [llm-resume-platform](https://github.com/FelixFangX/llm-resume-platform) | chore: clean up repo — remove design doc, add bilingual README, standard |
<!-- agent-log:end -->

<details>
<summary><b>Tools I reach for</b></summary>

Stack I reach for: TypeScript · React/Next.js · Node · Python · n8n · Lark Open Platform · MCP · Claude Code / Codex / Cursor.
</details>

<sub>The banner scene rotates daily across focus, recovery and fun: deep work, dialogue, markets, recovery, live set, premiere. Nobody needs the same day twice.</sub>
