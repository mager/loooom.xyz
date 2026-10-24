# The Loooom Quality Bar

Loooom is a curated collection, not an open marketplace. Every skill is held to a
deliberately high bar — and this is that bar, written down. It's also a runnable
harness: `npm run eval` scores every skill in `skills/*/SKILL.md` against the
rubric below. What we publish is exactly what we grade.

The whole project is an experiment in one question: **how good can a skill
actually be, and how do you measure it?** This rubric is the current answer.

## Two gates

Most people stop at the first one.

### Gate 1 — Spec compliance (free, deterministic)

Structure a skill must have before it's worth judging. No model, runs in CI.

- Frontmatter parses, and uses only the agentskills-allowed keys (`name`,
  `description`, `license`, `compatibility`, `allowed-tools`, `metadata`).
  Everything else belongs under `metadata`.
- `name` present and matches the directory; `description` is a real sentence.
- Has an ordered method, a "what not to do" section, and a worked example.
- Has an `Agent Behavior` block (Loooom house convention).
- Signal density: 250–1500 words. Skills should be high-signal, not long
  (the [SkillOpt](https://mager.co/blog/2026-05-26-skill-evals-skillopt) finding
  — the median good skill is ~920 tokens).

### Gate 2 — Quality (LLM-as-judge)

The part that separates a real skill from a costume. A free model scores five
dimensions 0–5 against calibration anchors. Run rarely, by the author.

## The five dimensions

| Dimension | Weight | What it measures |
|---|---:|---|
| **Method** | 25% | A real, ordered, followable procedure — not adjectives. A reader could *do* the steps. |
| **Specificity** | 25% | Concrete, non-obvious technique. *Could you regenerate this from the title alone?* If yes, it's a costume. |
| **Worked example** | 15% | At least one case carried end to end — ideally a weak→strong transformation. |
| **Point of view** | 20% | What *not* to do: failure modes, anti-patterns, tradeoffs. Where expertise hides. |
| **Voice & restraint** | 15% | Reads like a practitioner wrote it. Opinionated, signal-dense, unpadded. |

Anchors (every dimension): **0** absent · **1** costume (generic, regenerable
from the title) · **3** competent but obvious · **5** expert craft.

Weighted 0–5 scores roll up to a 0–100 score:

- **passing** — score ≥ 80 *and* no single dimension below 3 (no weak limb)
- **needs-work** — score ≥ 60
- **failing** — below that

The single most important test is **specificity's regeneration check**: if a
decent writer could reproduce the skill knowing only its title and one-liner,
it's a costume no matter how polished the prose.

## Running it

The judge is provider-agnostic — any OpenAI-compatible endpoint. It defaults to
**Groq's free tier** (no Anthropic, no cost):

```bash
npm run eval              # both gates, all skills → writes eval-scores.json
npm run eval -- --spec    # Gate 1 only — no model, no network
npm run eval -- hook      # filter by name
npm run eval -- --calibrate  # self-test: must score costumes low, real skills high
```

### Calibrating the judge

A judge is only useful if it can fail a bad skill. `--calibrate` runs the judge
against deliberate "costume" fixtures in `eval/fixtures/` (generic, regenerable
from the title) alongside the real skills, and **fails** (exit 1) unless every
costume scores below 60 and every real skill at or above 80. The separation gap
is the headline number — a discriminating judge keeps them far apart. On the
default Groq judge, the costume `hook` scores ~8 against the real `hook`'s 100.
Add a fixture whenever you find a failure mode the judge should catch.

Swap the judge with three env vars:

```bash
# Higher-ceiling free judges on Groq:
EVAL_MODEL=openai/gpt-oss-120b npm run eval
EVAL_MODEL=qwen/qwen3-32b      npm run eval

# Fully local / offline (Ollama):
EVAL_BASE_URL=http://localhost:11434/v1 EVAL_MODEL=qwen2.5:14b EVAL_API_KEY= npm run eval

# Any OpenAI-compatible provider:
EVAL_BASE_URL=… EVAL_MODEL=… EVAL_API_KEY=… npm run eval
```

The operative rubric (the judge's system prompt) lives in `eval/rubric.ts`; keep
this document in sync with it.
