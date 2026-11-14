import { open, rename, unlink } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import { LIMITS } from './inputs.mjs';

export const BASE_INSTRUCTION = 'Answer the user request. Follow any personal context supplied below.';

export function checkOutput(output, assertions) {
  return assertions.map(assertion => {
    let passed, actual;
    if (assertion.type === 'maxWords') {
      actual = output.trim() ? output.trim().split(/\s+/u).length : 0;
      passed = actual <= assertion.value;
    } else {
      const candidate = assertion.caseSensitive === false ? output.toLowerCase() : output;
      const value = assertion.caseSensitive === false ? assertion.value.toLowerCase() : assertion.value;
      if (assertion.type === 'contains') passed = candidate.includes(value);
      else if (assertion.type === 'notContains') passed = !candidate.includes(value);
      else passed = candidate === value;
    }
    return { ...assertion, passed, ...(actual === undefined ? {} : { actual }) };
  });
}

export function summarize(results) {
  const count = condition => results.reduce((score, row) => {
    const result = row[condition];
    if (!result) return score;
    score.total += 1;
    score.passed += Number(result.passed);
    score.assertionsTotal += result.assertions.length;
    score.assertionsPassed += result.assertions.filter(check => check.passed).length;
    return score;
  }, { passed: 0, total: 0, assertionsPassed: 0, assertionsTotal: 0 });
  const baseline = count('baseline'), context = count('context');
  const fullyPaired = results.length > 0 && results.every(row => row.baseline && row.context);
  return { baseline, context, delta: fullyPaired ? {
    casesPassed: context.passed - baseline.passed,
    assertionsPassed: context.assertionsPassed - baseline.assertionsPassed
  } : null };
}

export async function reserveReport(path) {
  try {
    const handle = await open(path, 'wx', 0o600);
    await handle.close();
  } catch (error) {
    if (error.code === 'EEXIST') throw new Error(`Report already exists: ${path}. Choose a new --output path.`);
    throw error;
  }
  // Every checkpoint replaces only the report reserved by this invocation.
  // An interrupted write leaves the last complete JSON checkpoint intact.
  return async report => {
    const temporary = `${path}.${randomUUID()}.tmp`;
    let handle;
    try {
      handle = await open(temporary, 'wx', 0o600);
      await handle.writeFile(`${JSON.stringify(report, null, 2)}\n`);
      await handle.sync();
      await handle.close(); handle = null;
      await rename(temporary, path);
    } finally {
      await handle?.close();
      await unlink(temporary).catch(error => { if (error.code !== 'ENOENT') throw error; });
    }
  };
}

async function boundedResponse(response) {
  if (!response.body) throw new Error('Provider returned an empty response body.');
  const reader = response.body.getReader();
  const chunks = []; let size = 0;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > LIMITS.responseBytes) throw new Error(`Provider response exceeds ${LIMITS.responseBytes} bytes.`);
      chunks.push(value);
    }
  } finally { await reader.cancel().catch(() => {}); }
  let data;
  try { data = JSON.parse(Buffer.concat(chunks).toString('utf8')); }
  catch { throw new Error('Provider returned invalid JSON.'); }
  const choice = data?.choices?.[0];
  const output = choice?.message?.content;
  if (typeof output !== 'string') throw new Error('Provider response must include choices[0].message.content as text.');
  if (Buffer.byteLength(output) > LIMITS.outputBytes) throw new Error(`Provider output exceeds ${LIMITS.outputBytes} bytes.`);
  return { output, rawResponse: data, finishReason: choice.finish_reason ?? null };
}

async function complete(request, provider, timeoutMs, fetchImpl, signal) {
  const controller = new AbortController();
  const combined = signal ? AbortSignal.any([controller.signal, signal]) : controller.signal;
  const timer = setTimeout(() => controller.abort(new Error('Provider request timed out.')), timeoutMs);
  try {
    const response = await fetchImpl(provider.endpoint, {
      method: 'POST', redirect: 'error', signal: combined,
      headers: { 'Content-Type': 'application/json', ...(provider.key ? { Authorization: `Bearer ${provider.key}` } : {}) },
      body: JSON.stringify(request)
    });
    if (!response.ok) {
      await response.body?.cancel();
      // Error bodies may contain provider credentials or other sensitive data.
      throw new Error(`Provider returned HTTP ${response.status}.`);
    }
    return await boundedResponse(response);
  } catch (error) {
    if (combined.aborted) throw new Error(signal?.aborted ? 'Run stopped before completion.' : 'Provider request timed out.');
    // Do not copy fetch diagnostics that may contain a credential-bearing URL.
    if (error.message.startsWith('Provider ')) throw error;
    throw new Error('Provider request failed. Check the endpoint and service connection.');
  } finally { clearTimeout(timer); }
}

export async function evaluate({ suite, context, replay, replayResults, provider, timeoutMs, maxOutputTokens, output }, { fetchImpl = fetch, signal } = {}) {
  const checkpoint = await reserveReport(output);
  const report = {
    schemaVersion: 1, id: randomUUID(), status: 'running', startedAt: new Date().toISOString(), finishedAt: null,
    runner: { name: '@loooom/context-evals', version: '0.1.0', node: process.version },
    evidence: replay ? {
      mode: 'replay', synthetic: replay.definition.synthetic,
      label: replay.definition.synthetic ? 'Synthetic offline replay. No model was called.' : 'Offline replay of supplied outputs. Origin is not verified. No model was called.'
    } : { mode: 'live', synthetic: false, label: 'Responses collected from the configured endpoint during this run.' },
    config: { baselineInstruction: BASE_INSTRUCTION, temperature: 0, maxOutputTokens, timeoutMs, maxRunMs: LIMITS.runMs, order: 'baseline first on even case indexes; context first on odd indexes', ...(provider ? { endpoint: provider.endpoint, model: provider.model } : {}) },
    context, suite, ...(replay ? { replay } : {}),
    results: suite.definition.cases.map(item => ({ caseId: item.id, prompt: item.prompt, baseline: null, context: null })),
    summary: null, error: null
  };
  const save = async () => { report.summary = summarize(report.results); await checkpoint(report); };
  await save();
  const deadline = Date.now() + LIMITS.runMs;
  try {
    for (let index = 0; index < suite.definition.cases.length; index++) {
      const item = suite.definition.cases[index], row = report.results[index];
      const order = index % 2 === 0 ? ['baseline', 'context'] : ['context', 'baseline'];
      for (const condition of order) {
        if (signal?.aborted) throw new Error('Run stopped before completion.');
        const remaining = deadline - Date.now();
        if (remaining <= 0) throw new Error('Run exceeded the 5-minute limit.');
        const request = {
          ...(provider ? { model: provider.model } : {}), temperature: 0, max_tokens: maxOutputTokens,
          messages: [
            { role: 'system', content: condition === 'context' ? `${BASE_INSTRUCTION}\n\n${context.text}` : BASE_INSTRUCTION },
            { role: 'user', content: item.prompt }
          ]
        };
        const startedAt = new Date().toISOString(), started = performance.now();
        const response = replayResults ? { output: replayResults.get(item.id)[condition], rawResponse: null, finishReason: null }
          : await complete(request, provider, Math.min(timeoutMs, remaining), fetchImpl, signal);
        const assertions = checkOutput(response.output, item.assertions);
        row[condition] = { ...response, request, startedAt, durationMs: Math.round(performance.now() - started), assertions, passed: assertions.every(check => check.passed) };
        await save();
      }
    }
    report.status = 'complete';
  } catch (error) {
    report.status = 'error'; report.error = { message: error.message };
  }
  report.finishedAt = new Date().toISOString();
  await save();
  return report;
}
