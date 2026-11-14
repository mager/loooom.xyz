import { open, realpath } from 'node:fs/promises';
import { basename } from 'node:path';
import { createHash } from 'node:crypto';

export const LIMITS = Object.freeze({
  fileBytes: 1_048_576, contextBytes: 262_144, responseBytes: 1_048_576,
  outputBytes: 131_072, cases: 100, assertions: 20, contextFiles: 16,
  promptLength: 32_768, assertionLength: 8192, runMs: 300_000
});
export const sha256 = value => createHash('sha256').update(value).digest('hex');

function object(value, location, allowed) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error(`${location} must be an object.`);
  for (const key of Object.keys(value)) {
    if (!allowed.includes(key)) throw new Error(`${location} has an unknown field: ${key}.`);
  }
}

function text(value, location, max = LIMITS.promptLength, allowEmpty = false) {
  if (typeof value !== 'string' || (!allowEmpty && !value.trim()) || value.length > max) {
    throw new Error(`${location} must be ${allowEmpty ? 'a' : 'a non-empty'} string of at most ${max} characters.`);
  }
}

function id(value, location) {
  if (typeof value !== 'string' || !/^[a-zA-Z0-9][a-zA-Z0-9._-]{0,99}$/.test(value)) {
    throw new Error(`${location} must use 1–100 letters, numbers, dots, underscores, or hyphens.`);
  }
}

export function validateSuite(suite) {
  object(suite, 'Suite', ['schemaVersion', 'name', 'description', 'cases']);
  if (suite.schemaVersion !== 1) throw new Error('Suite schemaVersion must be 1.');
  text(suite.name, 'Suite name', 200);
  if (suite.description !== undefined) text(suite.description, 'Suite description', 2000);
  if (!Array.isArray(suite.cases) || !suite.cases.length || suite.cases.length > LIMITS.cases) {
    throw new Error(`Suite must contain 1–${LIMITS.cases} cases.`);
  }
  const seen = new Set();
  for (const item of suite.cases) {
    object(item, 'Case', ['id', 'prompt', 'assertions']);
    id(item.id, 'Case ID');
    if (seen.has(item.id)) throw new Error(`Duplicate case ID: ${item.id}.`);
    seen.add(item.id);
    text(item.prompt, `Case ${item.id} prompt`);
    if (!Array.isArray(item.assertions) || !item.assertions.length || item.assertions.length > LIMITS.assertions) {
      throw new Error(`Case ${item.id} must have 1–${LIMITS.assertions} assertions.`);
    }
    for (const assertion of item.assertions) {
      object(assertion, `Case ${item.id} assertion`, ['type', 'value', 'caseSensitive']);
      if (assertion.type === 'maxWords') {
        if (!Number.isInteger(assertion.value) || assertion.value < 0 || assertion.value > 100_000 || assertion.caseSensitive !== undefined) {
          throw new Error('maxWords requires an integer from 0 to 100000 and no caseSensitive field.');
        }
      } else if (['contains', 'notContains', 'exact'].includes(assertion.type)) {
        text(assertion.value, `${assertion.type} value`, LIMITS.assertionLength);
        if (assertion.caseSensitive !== undefined && typeof assertion.caseSensitive !== 'boolean') {
          throw new Error('caseSensitive must be true or false.');
        }
      } else throw new Error(`Unknown assertion type: ${assertion.type}. Use contains, notContains, exact, or maxWords.`);
    }
  }
  return suite;
}

export function validateReplay(replay, suite) {
  object(replay, 'Replay', ['schemaVersion', 'synthetic', 'description', 'results']);
  if (replay.schemaVersion !== 1 || typeof replay.synthetic !== 'boolean') {
    throw new Error('Replay requires schemaVersion: 1 and synthetic: true or false.');
  }
  if (replay.description !== undefined) text(replay.description, 'Replay description', 2000);
  if (!Array.isArray(replay.results) || replay.results.length !== suite.cases.length) {
    throw new Error('Replay must contain exactly one result per suite case.');
  }
  const ids = new Set(suite.cases.map(item => item.id));
  const results = new Map();
  for (const item of replay.results) {
    object(item, 'Replay result', ['caseId', 'baseline', 'context']);
    if (!ids.has(item.caseId) || results.has(item.caseId)) throw new Error(`Unknown or duplicate replay case ID: ${item.caseId}.`);
    for (const condition of ['baseline', 'context']) {
      text(item[condition], `Replay ${item.caseId} ${condition}`, LIMITS.outputBytes, true);
      if (Buffer.byteLength(item[condition]) > LIMITS.outputBytes) throw new Error('Replay output exceeds the byte limit.');
    }
    results.set(item.caseId, item);
  }
  return results;
}

export async function readBounded(path, limit = LIMITS.fileBytes) {
  let handle;
  try {
    handle = await open(path, 'r');
    const info = await handle.stat();
    if (!info.isFile()) throw new Error(`Input must be a regular file: ${path}.`);
    if (info.size > limit) throw new Error(`Input exceeds ${limit} bytes: ${path}.`);
    // One extra byte detects a file that grows after stat, without an unbounded read.
    const buffer = Buffer.alloc(limit + 1);
    let size = 0;
    while (size < buffer.length) {
      const { bytesRead } = await handle.read(buffer, size, buffer.length - size, null);
      if (!bytesRead) break;
      size += bytesRead;
    }
    if (size > limit) throw new Error(`Input exceeds ${limit} bytes: ${path}.`);
    const bytes = buffer.subarray(0, size);
    return { text: new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(bytes), sha256: sha256(bytes) };
  } finally { await handle?.close(); }
}

export async function readJson(path) {
  const file = await readBounded(path);
  let definition;
  try { definition = JSON.parse(file.text.replace(/^\uFEFF/, '')); }
  catch { throw new Error(`Invalid JSON in ${path}.`); }
  return { sha256: file.sha256, definition };
}

export async function loadContext(paths) {
  if (!paths.length || paths.length > LIMITS.contextFiles) throw new Error(`Supply 1–${LIMITS.contextFiles} --context files.`);
  const seen = new Set(), files = [];
  let bytes = 0;
  for (const path of paths) {
    const canonicalPath = await realpath(path);
    if (seen.has(canonicalPath)) throw new Error(`Duplicate context file: ${path}.`);
    seen.add(canonicalPath);
    const file = await readBounded(path, LIMITS.contextBytes);
    if (!file.text.trim()) throw new Error(`Context file is empty: ${path}.`);
    bytes += Buffer.byteLength(file.text);
    if (bytes > LIMITS.contextBytes) throw new Error(`Combined context exceeds ${LIMITS.contextBytes} bytes.`);
    files.push({ name: basename(path), sha256: file.sha256, content: file.text });
  }
  // The exact string is saved. Its hash depends on both file order and file labels.
  const text = files.map((file, index) => `--- Context file ${index + 1}: ${file.name} ---\n${file.content}`).join('\n\n');
  return { sha256: sha256(text), text, files };
}

export function providerConfig(env) {
  const base = env.LOOOOM_EVAL_BASE_URL;
  if (!base) throw new Error('Set LOOOOM_EVAL_BASE_URL, or use --responses for offline replay.');
  let url;
  try { url = new URL(base); } catch { throw new Error('LOOOOM_EVAL_BASE_URL must be a valid API base URL.'); }
  const local = ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);
  if ((url.protocol !== 'https:' && !(url.protocol === 'http:' && local)) || url.username || url.password || url.search || url.hash) {
    throw new Error('Use HTTPS (or HTTP on localhost). The base URL must not contain credentials, a query, or a fragment.');
  }
  text(env.LOOOOM_EVAL_MODEL, 'LOOOOM_EVAL_MODEL', 200);
  const key = env.LOOOOM_EVAL_API_KEY;
  if (key !== undefined && (typeof key !== 'string' || !key.trim() || /[\r\n]/.test(key))) throw new Error('LOOOOM_EVAL_API_KEY is invalid.');
  url.pathname = `${url.pathname.replace(/\/+$/, '')}/chat/completions`;
  return { endpoint: url.href, model: env.LOOOOM_EVAL_MODEL, key };
}
