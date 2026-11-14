# Loooom context evals

Test whether personal context changes an agent's answers in the ways you expect.
Supply `AGENTS.md`, `SOUL.md`, `ME.md`, or other text files. Write prompts and
observable checks. Run each prompt with and without the context. Save both
answers and their results in a local JSON report.

This package is agent-neutral, uses Node.js 22 or newer, and has no dependencies.
It is released under the [MIT license](LICENSE). The package source is in this
repository; an npm registry release is not required for the commands below.

## Try the offline example

From the Loooom repository root:

```sh
node plugins/context-evals/bin/loooom-context-eval.mjs \
  --suite plugins/context-evals/examples/suite.json \
  --context plugins/context-evals/examples/AGENTS.md \
  --context plugins/context-evals/examples/SOUL.md \
  --context plugins/context-evals/examples/ME.md \
  --responses plugins/context-evals/examples/responses.synthetic.json \
  --output /tmp/loooom-context-report.json
```

The example uses **handwritten synthetic answers**. It makes no network calls.
It demonstrates 0/3 baseline cases and 3/3 context cases. These values do not
measure a real model. Both the report and terminal output state that this is a
synthetic replay. Choose a new output path for each run; existing files are never
overwritten.

A [saved synthetic report](examples/report.synthetic.json) is included for
report viewers and local import tests. It was produced by the same replay CLI.
Its string checks are demonstration data, not a model quality score.

You can also install from this source checkout with
`npm install -g ./plugins/context-evals`. This adds the `loooom-context-eval`
command. To use the package with an agent, read [SKILL.md](SKILL.md) or copy the
whole package directory into a skill directory supported by that agent.
The CLI works without a skill loader.

## Write checks for your context

Start with preferences that have observable results. For example, check a
specific command, required wording, a time zone, or a word limit. Keep prompts
the same in both conditions.

```json
{
  "schemaVersion": 1,
  "name": "My work preferences",
  "cases": [
    {
      "id": "project-check",
      "prompt": "How should I check this project?",
      "assertions": [
        { "type": "contains", "value": "npm run check" },
        { "type": "notContains", "value": "Great question", "caseSensitive": false },
        { "type": "maxWords", "value": 40 }
      ]
    }
  ]
}
```

| Type | Rule |
| --- | --- |
| `contains` | The answer includes the supplied text as a substring. |
| `notContains` | The answer does not include the supplied text as a substring. |
| `exact` | The entire answer equals the supplied text, including whitespace. |
| `maxWords` | The answer has no more than `value` whitespace-separated tokens. |

Text checks are case-sensitive by default. Set `caseSensitive: false` to use
Unicode lowercase conversion on both strings. The CLI does not trim text or
remove Markdown before a text check. Text values must be non-empty. `maxWords`
accepts an integer from 0 to 100000. An empty answer has zero words. Each case
passes only when all of its assertions pass. Unknown fields, assertion types,
and duplicate IDs are errors. There is no JavaScript evaluation, regular
expression execution, or model-based judge.

Substring checks have limits: an answer that says "do not use npm run check"
still contains that command. Pair checks with review of the saved answers.
`maxWords` is a count of whitespace-separated tokens, not linguistic words.

## Run a model

Use an endpoint that supports the OpenAI-compatible `POST /chat/completions`
wire format. This is a transport interface; no specific model vendor or agent
is required. The base URL must include the API prefix, such as `/v1`.

Set these environment variables through your shell or secret manager:

- `LOOOOM_EVAL_BASE_URL`: the API root. HTTPS is required, except on localhost.
- `LOOOOM_EVAL_MODEL`: a model name accepted by that endpoint.
- `LOOOOM_EVAL_API_KEY`: an optional bearer token. Omit it for an endpoint that
  does not need authentication.

Then omit `--responses`:

```sh
node plugins/context-evals/bin/loooom-context-eval.mjs \
  --suite ./my-context-suite.json \
  --context ./AGENTS.md \
  --context ./SOUL.md \
  --context ./ME.md \
  --output /tmp/loooom-context-live-report.json
```

Live mode sends the selected files and prompts to your configured endpoint.
The endpoint can charge for these requests. Reports contain the full context,
prompts, and returned answers. Review them before sharing. Authorization
headers are not saved. The CLI does not upload reports to Loooom.

Each case uses two fresh chat requests. Both use the same prompt, model,
`temperature: 0`, and output token limit. The baseline system message is:

> Answer the user request. Follow any personal context supplied below.

The context condition appends the selected files in command-line order, with
file labels. The first case runs baseline first; the next runs context first,
and this order alternates. No conversation history, tools, agent memory,
automatic file discovery, or retries are added. Each selected file must exist.

Options:

- `--timeout-ms`: 100–120000 per request; default 30000.
- `--max-output-tokens`: 32–8192; default 1024. Sent as `max_tokens`.
- `--help` and `--version` need no input files or credentials.

Limits: 100 cases, 20 assertions per case, 16 context files, 256 KiB of combined
context, 32,768 characters per prompt, and 1 MiB per JSON input file. Provider
responses are limited to 1 MiB and answer text to 128 KiB. Runs stop after five
minutes, at the next request or checkpoint boundary. Calls are sequential.
Providers that do not accept these chat completion fields need an adapter.

## Replay saved answers

Pass a JSON file with one pair of answers per suite case. Array order can differ
from the suite order. All case IDs must match exactly.

```json
{
  "schemaVersion": 1,
  "synthetic": false,
  "description": "Answers exported from my prior run.",
  "results": [
    {
      "caseId": "project-check",
      "baseline": "Run npm test.",
      "context": "Run npm run check."
    }
  ]
}
```

Set `synthetic: true` for invented or edited demonstration answers. Even with
`synthetic: false`, replay cannot verify the answers' source or that the context
was used to generate them. The report labels this limitation. A replay report
does not count as a new model run.

## Read the report

Reports use `schemaVersion: 1` and contain:

- `evidence`: `mode` (`live` or `replay`), `synthetic`, and a plain-language label.
- `context`: each file's name, full content, and SHA-256, plus the exact combined
  `text` and its SHA-256. File order and labels affect the combined hash.
- `suite`: SHA-256 of the input file bytes and the parsed `definition`.
- `replay`: replay file SHA-256 and definition, when used.
- `config`: baseline instruction, model endpoint where used, request limits,
  and condition order. No API key or request headers.
- `results`: one row per case with `caseId`, `prompt`, `baseline`, and `context`.
  Each completed condition holds its raw `output`, `rawResponse` for live
  calls, `finishReason`, request body, timing, individual `assertions`, and
  overall `passed` value. Each assertion has `passed`; word checks also have
  an `actual` count.
- `summary.baseline` and `summary.context`: `passed`, `total`,
  `assertionsPassed`, and `assertionsTotal`.
- `summary.delta`: `casesPassed` and `assertionsPassed`, calculated as context
  minus baseline. It is `null` until all pairs are complete.
- `status`: `running`, `complete`, or `error`, with start/end time and error
  metadata.

The CLI reserves a new report path before any provider call. It saves a valid
JSON checkpoint after each completed answer, with file permissions `0600`.
Each checkpoint uses an atomic rename. A failed request stops the run and keeps
prior answers. Unfinished conditions remain `null`; missing answers are not
counted as passed or failed. Invalid provider responses and HTTP error bodies
are not scored or saved as answers. On a forced process kill, the latest report
can remain `running`; that report is incomplete.

Exit codes: **0** when all context cases pass, **1** when at least one context
case fails, and **2** for input or runtime errors. A failed baseline is expected
in many tests and does not cause exit 1.

## Interpret the result

The result measures only the checks you wrote. It does not establish general
quality, truth, safety, or personal fit. A single paired run has no confidence
interval, and temperature zero does not guarantee repeatable answers. Context
can help one check and harm another. Read every failed assertion and the raw
answers. Run independent repeats with new report paths to study variation.

The first version does not run an installed agent's full tool loop, change your
context files, or search for improved instructions. It measures a controlled
chat request with and without supplied context.

## Development

From the repository root:

```sh
node --test tests/context-evals.test.mjs
```

The tests use offline fixtures and an in-memory HTTP transport substitute. They
make no network calls and need no API keys. The suite checks replay evidence,
validation, report preservation, paired request construction, provider errors,
and timeout behavior.

## Next Steps

Run the offline example. Write checks for your own context. Then run your chosen
model and review the saved answers before you change your instructions.

### Browser report limits

Loooom's `/evals` reader accepts reports up to 64 MiB, including interrupted
`running` checkpoints. It labels incomplete runs and leaves missing answers
unscored. For larger reports, split the suite into smaller runs or inspect the
JSON locally. Reports contain request and response evidence, so their size
can be much larger than the context files.
