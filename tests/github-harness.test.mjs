import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import { parseGitHubFileUrl, importGitHubHarness } from '../src/lib/server/github-harness.ts';

const sha = 'a'.repeat(40);
function github(content = '# Instructions\n\nTest your changes.\n', options = {}) {
 const calls = [];
 const fetcher = async (url) => {
  calls.push(String(url));
  const u = new URL(url);
  if (options.status) return new Response('{}', { status: options.status });
  if (u.pathname.endsWith('/commits')) {
   if (options.slashRef && u.searchParams.get('sha') !== 'feature/docs') return new Response('{}', {status:404});
   return Response.json([{sha, commit:{committer:{date:'2026-11-12T10:00:00Z'}, message:'Update instructions'}}]);
  }
  if (u.pathname.includes('/contents/')) return Response.json({type:'file', encoding:'base64', size:options.size ?? Buffer.byteLength(content), content:Buffer.from(content).toString('base64'), sha:'b'.repeat(40)});
  return Response.json({private: options.private ?? false, owner:{login:'mager'}});
 };
 return {fetcher, calls};
}
test('accepts GitHub blob and raw links and strips line fragments', () => {
 assert.equal(parseGitHubFileUrl('https://github.com/mager/repo/blob/main/AGENTS.md#L5').owner, 'mager');
 assert.equal(parseGitHubFileUrl('https://raw.githubusercontent.com/mager/repo/refs/heads/main/AGENTS.md').candidates[0].ref, 'main');
});
test('rejects other hosts, credentials, ports, and non-Markdown files', () => {
 for (const url of ['http://github.com/a/b/blob/main/AGENTS.md','https://evil.test/a/AGENTS.md','https://u:p@github.com/a/b/blob/main/AGENTS.md','https://github.com:999/a/b/blob/main/AGENTS.md','https://github.com/a/b/blob/main/README.txt','https://github.com/a/b/blob/main/%2e%2e/AGENTS.md']) assert.throws(()=>parseGitHubFileUrl(url));
});
test('pins text to the last file commit and counts lines without a trailing empty line', async () => {
 const {fetcher,calls} = github();
 const file = await importGitHubHarness('https://github.com/mager/repo/blob/main/AGENTS.md', {fetcher});
 assert.equal(file.commitSha,sha); assert.equal(file.lineCount,3); assert.equal(file.content,'# Instructions\n\nTest your changes.\n');
 assert.equal(file.updatedAt,'2026-11-12T10:00:00Z');
 assert.ok(calls.some(u=>u.includes('/contents/AGENTS.md?ref='+sha)));
 assert.match(file.contentHash,/^[a-f0-9]{64}$/);
});
test('resolves refs that contain slashes', async () => {
 const {fetcher} = github(undefined,{slashRef:true});
 const file = await importGitHubHarness('https://github.com/mager/repo/blob/feature/docs/AGENTS.md',{fetcher});
 assert.equal(file.ref,'feature/docs'); assert.equal(file.path,'AGENTS.md');
});
test('rejects private repositories, oversized files and rate limits', async () => {
 await assert.rejects(importGitHubHarness('https://github.com/a/b/blob/main/AGENTS.md',{fetcher:github('',{private:true}).fetcher}),/public/);
 await assert.rejects(importGitHubHarness('https://github.com/a/b/blob/main/AGENTS.md',{fetcher:github('',{size:102401}).fetcher}),/100/);
 await assert.rejects(importGitHubHarness('https://github.com/a/b/blob/main/AGENTS.md',{fetcher:github('',{status:403}).fetcher}),/limit/);
});
test('keeps HTML as inert source text', async () => {
 const content='<script>alert(1)</script>\n';
 const file=await importGitHubHarness('https://github.com/a/b/blob/main/AGENTS.md',{fetcher:github(content).fetcher});
 assert.equal(file.content,content);
});

test('imports optional Markdown context without changing its file name', async () => {
 for (const name of ['SOUL.md','ME.md','DESIGN.md','USER.md']) { const result = await importGitHubHarness('https://github.com/a/b/blob/main/'+name,{fetcher:github('# Personal context').fetcher}); assert.equal(result.path,name); }
});

test('preserves a UTF-8 BOM so the saved source matches its content hash', async () => {
 const content='\ufeff# Instructions\n';
 const file=await importGitHubHarness('https://github.com/a/b/blob/main/AGENTS.md',{fetcher:github(content).fetcher});
 assert.equal(file.content,content);
 assert.equal(createHash('sha256').update(file.content).digest('hex'),file.contentHash);
});
