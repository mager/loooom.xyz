# Skills gym

The gym release (`0.3.0`) is not on npm yet. To try the tested source version now, use Node 22+ and a signed-in Codex CLI:

```sh
npx --yes https://github.com/mager/loooom/archive/f45997f86ced5d8db2020ab74b9e761fc1f30a39.tar.gz gym climb focus-climb --rounds 3 --repetitions 3
```

The shorter npm commands below apply after version `0.3.0` is published.

`/gym` displays local experiments from the [loooom runner](https://github.com/mager/loooom/tree/main/gym). It does not call a model from the server or browser.

With Node 22+ and a signed-in Codex CLI, run `npx loooom@latest gym run absorb` from your terminal. Reports are saved to `gym/runs/` in your current directory. Then use **Load run JSON** for a private browser preview. To include a complete report in the site:

```sh
npm run gym:import -- ../loooom/gym/runs/<run-id>.json
npm run test:gym
npm run check
npm run build
```

The import command uses Node 22.6+ type stripping. It validates the report and SHA-256 skill content hashes, then writes one current report per suite under `src/lib/data/gym`. Deployment is a separate step. The runner repository retains every experiment.

The page uses server-side loading for bundled reports. Local file imports stay in browser memory and are lost on reload. Invalid JSON, unsupported reports, and files over 2 MB show an error while retaining the previous result. Report text renders as escaped text.

The examples distinguish the unchanged absorb skill, a deliberately introduced absorb regression, and a focus section ablation. Schema 1 scores describe single saved responses. Schema 2 shows repeated trials and fresh verification. Neither measures learning outcomes. Do not relabel the controlled regression as a defect in the original skill. Keep failed experiments and test revisions in the runner history.

## Repeated search

`npx loooom@latest gym climb focus-climb --rounds 3 --repetitions 3` searches on training cases, then locks its selection and runs fresh verification. Each case has three responses. The final check includes held-out cases and does not feed another edit. The original and candidate each get new responses in final verification.

Schema 2 reports use `ClimbReport.svelte`. Its round selector separates training evidence from final evidence. Open a case, then a trial, to inspect all responses and checks. Word counts include frontmatter. They are not token counts or cost estimates. An accepted training round is not a verified final result.

The file loader supports schema 1 and 2. The parser checks repeated sample IDs, criterion coverage, score totals, call limits, and completed-state consistency. The server importer also verifies content hashes and the schema 2 suite hash. Session imports use `<suite-id>.session.json`, so the earlier one-pass report can remain beside them.

The homepage preview derives its round counts from the saved Focus session. It never invents a progress state or calls a model. Update that report and rebuild to update the preview.
