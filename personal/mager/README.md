# Mager's personal context pack

This is a local, portable draft. It does not replace any global instruction
file. It contains no private memory archive.

Load these three files together in an agent that supports text instructions:

1. `AGENTS.md`: how to do the work.
2. `SOUL.md`: working character and voice.
3. `ME.md`: confirmed context and preferences.

An agent may not load adjacent files on its own. Supply them directly or use its
documented context mechanism. Keep the active project's instructions in place.
`SOURCES.md` records attribution and choices; it is for review rather than a
required part of every prompt.

## Evaluate the rules

`suite.json` uses the repository's context-evals schema. It checks a small set
of visible behaviors. It cannot certify STE compliance, prove root-cause work,
or judge general model quality. Read each answer as well as its checks. These
are test definitions only; no performance result is included.

From the repository root, after selecting and configuring a model endpoint:

```sh
node plugins/context-evals/bin/loooom-context-eval.mjs \
  --suite personal/mager/suite.json \
  --context personal/mager/AGENTS.md \
  --context personal/mager/SOUL.md \
  --context personal/mager/ME.md \
  --output /tmp/mager-context-live-report.json
```

Use a new output path for each run. Live evaluation sends these selected files
and the test prompts to the configured endpoint and can incur model charges.
See the [context-evals guide](../../plugins/context-evals/README.md) for endpoint
settings and how to replay real saved answers. Keep reports private unless
sharing is requested. A synthetic replay tests the evaluation tool, not the
quality of this pack.

## Next Steps

Review the three context files. Then run the suite with the chosen model, read
the saved answers, and change only rules that have a clear benefit.
