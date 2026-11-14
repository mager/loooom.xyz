# Sources and decisions

Reviewed on 2026-11-14. This file records evidence and editorial choices. It is
not an instruction source for actions on external services.

## What was read

The original post and replies were read in X's conversation view in a separate
Chrome tab. The ordinary web fetch was blocked; the signed-in browser could
display the content. The view used X's relevant-reply ordering. It showed about
30 replies at that time. This is a selected review, not a complete archive or
a claim that every reply was read. Ads were excluded.

The table paraphrases source ideas. The rule wording in `AGENTS.md` is our
adaptation for a portable personal context pack. These posts offer suggestions;
they do not prove that the rules improve model performance.

## Ideas included

| Source | Observed idea | Choice in this pack |
| --- | --- | --- |
| [Jarrod Watts: original post](https://x.com/jarrodwatts/status/2121422024283472102) | Explore a more ambitious result; address causes; preserve clear reasoning; explain from fundamentals; use questions to align on the intended result. | Include all five themes. Make questions depend on uncertainty, and keep expanded scope as a proposal. Remove the vendor-specific framing. |
| [Mykyta Pavlenko](https://x.com/mktpavlenko/status/2121473867180810586) | Ambition without prior alignment can send the agent away from the request. | Continue authorized work; do not silently expand it. |
| [Kenton](https://x.com/HGjuggesxvcy/status/2121516561697833287) | A request for better ideas should not become permission to rebuild settled parts. | Separate an ambitious proposal from agreement to implement added scope. |
| [Kenzo](https://x.com/KenzoLorenzo69/status/2121461175586267275) | Add a concise summary to a long answer. | Put the outcome first. Keep Mager's required Next Steps ending rather than adding a second repeated summary. |
| [Rohit Purkait](https://x.com/codeswithroh/status/2121473216275460358) | Use tests to prevent a change from breaking behavior. | Select meaningful checks for the changed behavior and risk. |
| [Jarrod Watts: response on tests](https://x.com/jarrodwatts/status/2121502708587004279) | Reports using fewer tests because he finds some unhelpful. | Preserve the disagreement. Do not adopt a blanket rule to add tests or skip them. Project-required checks still apply. |
| [Jeongki Park](https://x.com/zzunkiedev/status/2121443577154953451) | Put a repeated root-cause reminder in instruction files. | Retain useful corrections when asked, and keep them concise. |
| [Jarrod Watts: response on instruction files](https://x.com/jarrodwatts/status/2121451048850330108) | Reports that instruction files are not always followed. | Add observable evaluation cases. Do not treat the presence of a file as evidence of compliance. |
| [Bishop](https://x.com/OxxBishop/status/2121533871925928417) | Ask whether further improvement has stopped producing gains. | Stop after the completion checks pass unless another change has a clear benefit. |
| [高阳](https://x.com/yanggao97566/status/2121461786008240490) | Diagnose the problem before changing the work. | State the observed problem, likely cause, and evidence before editing. |
| [Jesse](https://x.com/JesseFriedland/status/2121430081436528657) | Ask which decisions or pull requests need the user's attention. | Use Next Steps to name decisions and reviews waiting on Mager. |
| [Ankit Bagadia](https://x.com/ankit_bagadia/status/2121443588936695878) | Notes the tension between ambition and simplicity, and asks about their order. | Evaluate added value and complexity together. The chosen workflow is our synthesis; the reply did not prescribe it. |

## Ideas not copied

- [Chad McGonigal](https://x.com/McGonigalAI/status/2121430010028495174)
  encouraged pushing the project's limits and used grand claims about the
  model. Keep useful ambition; omit flattery and unsupported capability claims.
- [Harpalsinh Jadeja](https://x.com/harpaljadeja/status/2121518576314298728)
  suggested a product-specific explanatory output setting. Keep the desired
  explanation style, but do not assume that setting exists in every agent.
- Generic praise, jokes, duplicate agreement, and vendor comparisons did not
  become permanent rules.

## Existing context retained

The current personal instructions supplied the STE language rule and Next Steps
ending. The earlier personal `SOUL.md` and `AGENTS.md` supplied a calm peer voice,
resourcefulness, first-person blog writing, deliberate design, privacy, and
useful continuity. Only those working preferences were carried forward.

The project instructions supplied the Loooom description, domain spelling, and
agent-agnostic requirement. The active project's rules remain the source for
its commands and design system.

The new pack does not import private memory files, scheduled background tasks,
social-chat behavior, tool names, machine paths, a fixed language preference,
or the earlier design palette. It does not install itself as a global harness.
These omissions keep the pack portable and reduce conflicts with each project.

## Evidence still needed

`suite.json` contains observable checks, not model results. Some checks depend
on wording and cannot prove that a real agent took the right action. A human
must review the full answers and actual work. No baseline-versus-context model
comparison has been run for this pack.
