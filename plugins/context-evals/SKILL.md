---
name: context-evals
description: Test whether AGENTS.md, SOUL.md, ME.md, or other personal context changes an agent's answers as expected. Run paired baseline and context checks, replay saved answers offline, and keep a local evidence report.
license: MIT
compatibility: Requires Node.js 22 or newer. Works with any agent that can run a local CLI. Live runs require a user-configured OpenAI-compatible chat completions endpoint; offline replay needs no network.
---

# Personal context evals

Use this skill when the user wants to test personal context, compare behavior
with and without instructions, or inspect saved evaluation answers.

Read [README.md](README.md) for the suite schema, environment variables, limits,
and report fields. Resolve the CLI and examples relative to this skill file.
No specific agent product is required.

1. Identify the context files and the behavior the user expects. Use only the
   selected files. Do not discover or send other private files.
2. Write or use a JSON suite with concrete prompts and deterministic checks.
   Use `contains`, `notContains`, `exact`, and `maxWords`. Do not add executable
   assertions or judge output with an unrecorded model call.
3. Use `--responses` to replay supplied answers without network access. Mark
   invented answers with `synthetic: true`. A synthetic example tests the CLI;
   it does not establish model performance.
4. For an authorized live evaluation, use the user's selected endpoint and
   model through `LOOOOM_EVAL_BASE_URL` and `LOOOOM_EVAL_MODEL`. Read an API key
   from `LOOOOM_EVAL_API_KEY` if needed. Never place secrets in source files,
   shell commands, reports, or chat. Live mode sends selected context to that
   endpoint and can incur model charges.
5. Run the CLI with `--suite`, one `--context` per selected file, and a new
   `--output` path. Use a private destination. Existing reports cannot be
   overwritten. Do not publish a report unless the user asks you to do so.
6. Read the report. State the evidence mode, case and assertion counts, delta,
   and any incomplete or failed calls. Inspect raw answers before recommending
   context changes. Explain that substring checks and a single run are limited.
7. Keep the original files and report. If the user requests a context edit,
   make it as a separate change and use a new report path for the next run.

For a source checkout, this offline example runs from the repository root:

```sh
node plugins/context-evals/bin/loooom-context-eval.mjs \
  --suite plugins/context-evals/examples/suite.json \
  --context plugins/context-evals/examples/AGENTS.md \
  --context plugins/context-evals/examples/SOUL.md \
  --context plugins/context-evals/examples/ME.md \
  --responses plugins/context-evals/examples/responses.synthetic.json \
  --output /tmp/loooom-context-report.json
```

## Next Steps

Review the evidence label and raw answers. Use new report paths for further
tests. Keep personal reports private unless sharing is requested.
