# Skills gym

`/gym` displays local experiments from the [loooom runner](https://github.com/mager/loooom/tree/main/gym). It does not call a model from the server or browser.

Run a suite in the runner checkout, then use **Load run JSON** for a private browser preview. To include a complete report in the site:

```sh
npm run gym:import -- ../loooom/gym/runs/<run-id>.json
npm run test:gym
npm run check
npm run build
```

The import command uses Node 22.6+ type stripping. It validates the report and SHA-256 skill content hashes, then writes one current report per suite under `src/lib/data/gym`. Deployment is a separate step. The runner repository retains every experiment.

The page uses server-side loading for bundled reports. Local file imports stay in browser memory and are lost on reload. Invalid JSON, unsupported reports, and files over 2 MB show an error while retaining the previous result. Report text renders as escaped text.

The examples distinguish the unchanged absorb skill, a deliberately introduced absorb regression, and a focus section ablation. Scores describe single saved model responses, not learning outcomes. Do not relabel the controlled regression as a defect in the original skill. Keep failed experiments and test revisions in the runner history.
