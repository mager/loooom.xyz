import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { spawn } from 'node:child_process';

const root = fileURLToPath(new URL('../', import.meta.url));
const cli = resolve(root, 'plugins/context-evals/bin/loooom-context-eval.mjs');
const hash = value => createHash('sha256').update(value).digest('hex');
const suite = () => ({ schemaVersion: 1, name: 'Personal preferences', cases: [
  { id: 'color', prompt: 'Name the colors.', assertions: [
    { type: 'contains', value: 'GREEN', caseSensitive: false },
    { type: 'notContains', value: 'red' },
    { type: 'maxWords', value: 3 }
  ] },
  { id: 'ready', prompt: 'Confirm that you are ready.', assertions: [{ type: 'exact', value: 'READY' }] }
] });
const replay = () => ({ schemaVersion: 1, synthetic: true, results: [
  { caseId: 'ready', baseline: 'READY', context: 'READY' },
  { caseId: 'color', baseline: 'red', context: 'green blue' }
] });

async function fixture(t, definition = suite(), responses = replay()) {
  const dir = await mkdtemp(join(tmpdir(), 'loooom-context-test-'));
  t.after(async () => { const { rm } = await import('node:fs/promises'); await rm(dir, { recursive: true, force: true }); });
  const suitePath = join(dir, 'suite.json'), contextPath = join(dir, 'AGENTS.md');
  const replayPath = join(dir, 'responses.json'), output = join(dir, 'report.json');
  await Promise.all([
    writeFile(suitePath, JSON.stringify(definition)),
    writeFile(contextPath, 'Use green and blue. Reply READY to a readiness check.\n'),
    writeFile(replayPath, JSON.stringify(responses))
  ]);
  const args = ['--suite', suitePath, '--context', contextPath, '--output', output];
  return { dir, suitePath, contextPath, replayPath, output, args, replayArgs: [...args, '--responses', replayPath] };
}

function run(args, env = {}) {
  return new Promise((resolveResult, reject) => {
    const child = spawn(process.execPath, [cli, ...args], {
      cwd: root, env: { PATH: process.env.PATH, HOME: process.env.HOME, ...env }, stdio: ['ignore', 'pipe', 'pipe']
    });
    let stdout = '', stderr = '';
    child.stdout.on('data', data => { stdout += data; });
    child.stderr.on('data', data => { stderr += data; });
    child.on('error', reject);
    child.on('close', code => resolveResult({ code, stdout, stderr }));
  });
}

test('offline replay pairs by case ID and records independently checkable evidence', async t => {
  const f = await fixture(t);
  const result = await run(f.replayArgs);
  assert.equal(result.code, 0, result.stderr);
  assert.match(result.stdout, /replay/i);
  assert.match(result.stdout, /synthetic/i);
  const report = JSON.parse(await readFile(f.output, 'utf8'));
  assert.equal(report.schemaVersion, 1);
  assert.equal(report.status, 'complete');
  assert.equal(report.evidence.mode, 'replay');
  assert.equal(report.evidence.synthetic, true);
  assert.equal(report.suite.sha256, hash(await readFile(f.suitePath)));
  assert.equal(report.context.files[0].sha256, hash(await readFile(f.contextPath)));
  assert.equal(report.context.sha256, hash(report.context.text));
  assert.equal(report.replay.sha256, hash(await readFile(f.replayPath)));
  assert.equal(report.results[0].caseId, 'color');
  assert.equal(report.results[0].baseline.output, 'red');
  assert.equal(report.results[0].context.output, 'green blue');
  assert.deepEqual(report.results[0].baseline.assertions.map(a => a.passed), [false, false, true]);
  assert.deepEqual(report.summary.baseline, { passed: 1, total: 2, assertionsPassed: 2, assertionsTotal: 4 });
  assert.deepEqual(report.summary.context, { passed: 2, total: 2, assertionsPassed: 4, assertionsTotal: 4 });
  assert.deepEqual(report.summary.delta, { casesPassed: 1, assertionsPassed: 2 });
  assert.equal((await stat(f.output)).mode & 0o777, 0o600);
});

test('context evidence preserves a UTF-8 BOM and the original file hash', async t => {
 const f=await fixture(t);
 const text='\ufeffUse green and blue. Reply READY to a readiness check.\n';
 await writeFile(f.contextPath,text);
 const result=await run(f.replayArgs);assert.equal(result.code,0,result.stderr);
 const report=JSON.parse(await readFile(f.output,'utf8'));
 assert.equal(report.context.files[0].content,text);
 assert.equal(hash(report.context.files[0].content),report.context.files[0].sha256);
});

test('a failed context assertion returns exit 1 and keeps the full report', async t => {
  const responses = replay();
  responses.results.find(r => r.caseId === 'ready').context = 'ready';
  const f = await fixture(t, suite(), responses);
  assert.equal((await run(f.replayArgs)).code, 1);
  const report = JSON.parse(await readFile(f.output, 'utf8'));
  assert.equal(report.status, 'complete');
  assert.equal(report.results[1].context.assertions[0].passed, false);
  assert.equal(report.summary.context.passed, 1);
});

test('an existing report cannot be overwritten', async t => {
  const f = await fixture(t);
  await writeFile(f.output, 'keep this evidence');
  const result = await run(f.replayArgs);
  assert.equal(result.code, 2);
  assert.match(result.stderr, /exists/i);
  assert.equal(await readFile(f.output, 'utf8'), 'keep this evidence');
});

test('duplicate case IDs, unknown assertions, and invalid limits stop before creating a report', async t => {
  for (const change of [
    s => { s.cases[1].id = s.cases[0].id; },
    s => { s.cases[0].assertions[0] = { type: 'eval', value: 'process.exit()' }; },
    s => { s.cases[0].assertions[0] = { type: 'contains', value: '' }; },
    s => { s.cases[0].assertions[0] = { type: 'contains', value: 'x', caseSensitive: 'false' }; },
    s => { s.cases[0].assertions[0] = { type: 'maxWords', value: -1 }; },
    s => { s.cases[0].assertions = []; },
    s => { s.cases[0].assertions[0].typo = true; },
    s => { s.cases[0].prompt = ''; }
  ]) {
    const definition = suite(); change(definition);
    const f = await fixture(t, definition);
    const result = await run(f.replayArgs);
    assert.equal(result.code, 2, result.stdout);
    await assert.rejects(stat(f.output), { code: 'ENOENT' });
  }
});

test('replay rejects missing, extra, duplicate, and non-text answers', async t => {
  for (const change of [
    r => { r.results.pop(); },
    r => { r.results.push({ caseId: 'unknown', baseline: 'x', context: 'x' }); },
    r => { r.results[1].caseId = r.results[0].caseId; },
    r => { r.results[0].context = null; },
    r => { delete r.synthetic; }
  ]) {
    const responses = replay(); change(responses);
    const f = await fixture(t, suite(), responses);
    assert.equal((await run(f.replayArgs)).code, 2);
    await assert.rejects(stat(f.output), { code: 'ENOENT' });
  }
});

test('strict CLI parsing rejects unknown flags, duplicate options, and out-of-range limits', async t => {
  const f = await fixture(t);
  for (const extra of [ ['--mystery'], ['toString', 'unexpected'], ['--suite', f.suitePath], ['--timeout-ms', '0'], ['--max-output-tokens', '999999'] ]) {
    assert.equal((await run([...f.replayArgs, ...extra])).code, 2);
  }
  assert.equal((await run(['--suite', f.suitePath])).code, 2);
  await assert.rejects(stat(f.output), { code: 'ENOENT' });
});

test('invalid JSON, non-files, oversize context, and repeated context paths are rejected', async t => {
  const f = await fixture(t);
  await writeFile(f.replayPath, '{oops');
  assert.equal((await run(f.replayArgs)).code, 2);
  await writeFile(f.replayPath, JSON.stringify(replay()));
  assert.equal((await run([...f.replayArgs, '--context', f.contextPath])).code, 2);
  await writeFile(f.contextPath, 'x'.repeat(300_000));
  assert.equal((await run(f.replayArgs)).code, 2);
  const folder = join(f.dir, 'folder'); await mkdir(folder);
  assert.equal((await run([...f.replayArgs, '--context', folder])).code, 2);
  await assert.rejects(stat(f.output), { code: 'ENOENT' });
});

test('help and version work without credentials or input files', async () => {
  const help = await run(['--help']);
  assert.equal(help.code, 0); assert.match(help.stdout, /--responses/);
  assert.match(help.stdout, /LOOOOM_EVAL_BASE_URL/);
  const version = await run(['--version']);
  assert.equal(version.code, 0); assert.match(version.stdout, /0\.1\.0/);
});

function fakeEndpoint(handler) {
  const requests = [];
  const env = { LOOOOM_EVAL_BASE_URL: 'http://127.0.0.1:8000/v1', LOOOOM_EVAL_MODEL: 'test-model', LOOOOM_EVAL_API_KEY: 'private-test-key' };
  const fetchImpl = async (url, options) => {
    const body = JSON.parse(options.body);
    requests.push({ url: new URL(url).pathname, body, authorization: options.headers.Authorization });
    return handler(body, requests.length, options.signal);
  };
  return { requests, env, fetchImpl };
}

async function runWithTransport(args, endpoint) {
  const { runCli } = await import('../plugins/context-evals/src/cli.mjs');
  let stdout = '', stderr = '';
  const code = await runCli(args, { ...endpoint, stdout: value => { stdout += value; }, stderr: value => { stderr += value; } });
  return { code, stdout, stderr };
}

test('live transport uses paired fresh requests and stores answers without credentials', async t => {
  const f = await fixture(t);
  const endpoint = fakeEndpoint(body => {
    const contextual = body.messages[0].content.includes('Use green and blue.');
    const answer = body.messages[1].content.includes('colors') ? (contextual ? 'green blue' : 'red') : 'READY';
    return Response.json({ id: 'local-test-response', choices: [{ message: { role: 'assistant', content: answer }, finish_reason: 'stop' }], usage: { prompt_tokens: 8, completion_tokens: 2 } });
  });
  const result = await runWithTransport(f.args, endpoint);
  assert.equal(result.code, 0, result.stderr);
  assert.equal(endpoint.requests.length, 4);
  assert.ok(endpoint.requests.every(r => r.url === '/v1/chat/completions'));
  assert.ok(endpoint.requests.every(r => r.body.messages.length === 2));
  assert.equal(endpoint.requests[0].body.messages[1].content, endpoint.requests[1].body.messages[1].content);
  assert.equal(endpoint.requests[0].body.messages[0].content.includes('Use green and blue.'), false);
  assert.equal(endpoint.requests[1].body.messages[0].content.includes('Use green and blue.'), true);
  assert.ok(endpoint.requests.every(r => r.authorization === 'Bearer private-test-key'));
  const raw = await readFile(f.output, 'utf8');
  assert.equal(raw.includes('private-test-key'), false);
  const report = JSON.parse(raw);
  assert.equal(report.evidence.mode, 'live');
  assert.equal(report.evidence.synthetic, false);
  assert.equal(report.results[0].baseline.rawResponse.id, 'local-test-response');
  assert.equal(report.results[0].context.request.messages[1].content, 'Name the colors.');
  assert.equal(report.summary.delta.casesPassed, 1);
});

test('provider byte limits reject oversized output and oversized streamed response bodies', async t => {
  for (const response of [
    () => Response.json({ choices: [{ message: { content: 'x'.repeat(131_073) } }] }),
    () => new Response(new ReadableStream({
      start(controller) { controller.enqueue(new Uint8Array(1_048_577)); controller.close(); }
    }))
  ]) {
    const f = await fixture(t);
    const result = await runWithTransport(f.args, fakeEndpoint(response));
    assert.equal(result.code, 2);
    assert.match(result.stderr, /exceeds/);
    const report = JSON.parse(await readFile(f.output, 'utf8'));
    assert.equal(report.status, 'error');
    assert.equal(report.summary.baseline.total, 0);
  }
});

test('live mode checks output file protection before sending a request', async t => {
  const f = await fixture(t);
  await writeFile(f.output, 'prior report');
  const endpoint = fakeEndpoint(() => { throw new Error('A request must not be sent.'); });
  const result = await runWithTransport(f.args, endpoint);
  assert.equal(result.code, 2);
  assert.equal(endpoint.requests.length, 0);
  assert.equal(await readFile(f.output, 'utf8'), 'prior report');
});

test('a provider failure keeps prior outputs and returns an error report', async t => {
  const f = await fixture(t);
  const endpoint = fakeEndpoint((_body, call) => {
    if (call === 2) return new Response('do not echo provider body', { status: 503 });
    return Response.json({ choices: [{ message: { content: 'red' }, finish_reason: 'stop' }] });
  });
  const result = await runWithTransport(f.args, endpoint);
  assert.equal(result.code, 2);
  assert.match(result.stderr, /503/);
  const report = JSON.parse(await readFile(f.output, 'utf8'));
  assert.equal(report.status, 'error');
  assert.equal(report.results[0].baseline.output, 'red');
  assert.equal(report.results[0].context, null);
  assert.equal(report.summary.delta, null);
  assert.equal(report.summary.baseline.total, 1);
  assert.equal(endpoint.requests.length, 2);
});

test('timeouts and malformed provider answers cannot be scored as valid output', async t => {
  for (const handler of [
    (_body, _call, signal) => new Promise((_resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('Transport did not abort')), 1000);
      signal.addEventListener('abort', () => { clearTimeout(timer); reject(signal.reason); }, { once: true });
    }),
    () => Response.json({ choices: [{ message: { content: null } }] })
  ]) {
    const f = await fixture(t);
    const endpoint = fakeEndpoint(handler);
    const result = await runWithTransport([...f.args, '--timeout-ms', '100'], endpoint);
    assert.equal(result.code, 2);
    const report = JSON.parse(await readFile(f.output, 'utf8'));
    assert.equal(report.status, 'error');
    assert.equal(report.summary.baseline.total, 0);
    assert.equal(report.summary.delta, null);
  }
});

test('live endpoint validation prevents credential leaks and insecure remote requests', async t => {
  const f = await fixture(t);
  for (const base of ['http://example.com/v1', 'https://user:pass@example.com/v1', 'https://example.com/v1?key=secret', 'file:///tmp/model']) {
    const result = await run(f.args, { LOOOOM_EVAL_BASE_URL: base, LOOOOM_EVAL_MODEL: 'test' });
    assert.equal(result.code, 2);
    await assert.rejects(stat(f.output), { code: 'ENOENT' });
  }
});
