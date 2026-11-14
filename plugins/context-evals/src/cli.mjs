import { resolve } from 'node:path';
import { loadContext, providerConfig, readJson, validateReplay, validateSuite } from './inputs.mjs';
import { evaluate } from './runner.mjs';

const HELP = `Loooom context evals 0.1.0 — Node.js 22 or newer

Usage:
  loooom-context-eval --suite suite.json --context AGENTS.md --output report.json
  loooom-context-eval --suite suite.json --context AGENTS.md --responses answers.json --output report.json

Options:
  --suite PATH             JSON prompts and deterministic assertions (required)
  --context PATH           Context file; repeat for SOUL.md, ME.md, or other files
  --output PATH            New JSON report path (required; never overwrites)
  --responses PATH         Offline replay; no network calls
  --timeout-ms NUMBER      Per-request timeout: 100–120000 (default: 30000)
  --max-output-tokens N     Completion token limit: 32–8192 (default: 1024)
  --help                   Show this help
  --version                Show package version

Live mode environment:
  LOOOOM_EVAL_BASE_URL      Chat completions API root, such as http://localhost:8000/v1
  LOOOOM_EVAL_MODEL         Model name accepted by that endpoint
  LOOOOM_EVAL_API_KEY       Optional bearer token; omitted from reports

Live mode sends the selected context and suite prompts to that endpoint.
Reports contain context and raw answers. Keep private reports private.
Limits: 100 cases, 256 KiB combined context, 5 minutes per run; no retries.
Exit codes: 0 = all context cases pass; 1 = context assertion failure; 2 = input or run error.
`;

function parseArgs(args) {
  if (args.length === 1 && ['--help', '-h'].includes(args[0])) return { help: true };
  if (args.length === 1 && args[0] === '--version') return { version: true };
  const options = { context: [], timeoutMs: 30_000, maxOutputTokens: 1024 };
  const names = { '--suite': 'suite', '--context': 'context', '--output': 'output', '--responses': 'responses', '--timeout-ms': 'timeoutMs', '--max-output-tokens': 'maxOutputTokens' };
  const seen = new Set();
  for (let index = 0; index < args.length; index++) {
    const flag = args[index], key = Object.hasOwn(names, flag) ? names[flag] : undefined;
    if (!key) throw new Error(`Unknown option: ${flag}. Run --help for usage.`);
    if (key !== 'context' && seen.has(key)) throw new Error(`Duplicate option: ${flag}.`);
    seen.add(key);
    const value = args[++index];
    if (!value || value.startsWith('--')) throw new Error(`${flag} needs a value.`);
    if (key === 'context') options.context.push(value);
    else if (key === 'timeoutMs' || key === 'maxOutputTokens') {
      if (!/^\d+$/.test(value)) throw new Error(`${flag} needs an integer.`);
      options[key] = Number(value);
    } else options[key] = value;
  }
  if (!options.suite || !options.output || !options.context.length) throw new Error('--suite, at least one --context, and --output are required. Run --help for usage.');
  if (options.timeoutMs < 100 || options.timeoutMs > 120_000) throw new Error('--timeout-ms must be from 100 to 120000.');
  if (options.maxOutputTokens < 32 || options.maxOutputTokens > 8192) throw new Error('--max-output-tokens must be from 32 to 8192.');
  options.output = resolve(options.output);
  return options;
}

export async function runCli(args, { env = process.env, fetchImpl = fetch, stdout = line => process.stdout.write(line), stderr = line => process.stderr.write(line) } = {}) {
  let abort;
  try {
    const options = parseArgs(args);
    if (options.help) { stdout(HELP); return 0; }
    if (options.version) { stdout('0.1.0\n'); return 0; }
    const suite = await readJson(options.suite);
    validateSuite(suite.definition);
    const context = await loadContext(options.context);
    const replay = options.responses ? await readJson(options.responses) : null;
    const replayResults = replay ? validateReplay(replay.definition, suite.definition) : null;
    const provider = replay ? null : providerConfig(env);
    const controller = new AbortController();
    abort = () => controller.abort();
    process.once('SIGINT', abort); process.once('SIGTERM', abort);
    const report = await evaluate({ ...options, suite, context, replay, replayResults, provider }, { fetchImpl, signal: controller.signal });
    stdout(`${report.evidence.label}\n`);
    const { baseline, context: contextual, delta } = report.summary;
    stdout(`Baseline: ${baseline.passed}/${baseline.total} cases. With context: ${contextual.passed}/${contextual.total} cases. Delta: ${delta ? `${delta.casesPassed >= 0 ? '+' : ''}${delta.casesPassed}` : 'not available (incomplete pairs)'}.\n`);
    stdout(`Report: ${options.output}\n`);
    if (report.status === 'error') { stderr(`Error: ${report.error.message}\n`); return 2; }
    return contextual.passed === contextual.total ? 0 : 1;
  } catch (error) {
    stderr(`Error: ${error.message}\n`); return 2;
  } finally {
    if (abort) { process.removeListener('SIGINT', abort); process.removeListener('SIGTERM', abort); }
  }
}
