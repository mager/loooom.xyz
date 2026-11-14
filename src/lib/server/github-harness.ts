import { createHash } from 'node:crypto';

export class ImportError extends Error {
 status: number;
 constructor(message: string, status = 400) { super(message); this.status = status; }
}
export type GitHubSnapshot = {
 sourceUrl: string; owner: string; repo: string; ref: string; path: string;
 content: string; commitSha: string; contentHash: string; updatedAt: string;
 importedAt: string; lineCount: number; commitMessage: string;
};
export function parseGitHubFileUrl(input: string) {
 let url: URL;
 try { url = new URL(input.trim()); } catch { throw new ImportError('Enter a full GitHub link to a Markdown file.'); }
 const raw = decodeURIComponent(input);
 if (url.protocol !== 'https:' || url.username || url.password || url.port || /(?:^|\/)\.{1,2}(?:\/|$)/.test(raw) || raw.includes('\\')) throw new ImportError('Use a public HTTPS GitHub file link.');
 if (!['github.com', 'raw.githubusercontent.com'].includes(url.hostname)) throw new ImportError('Use a file link from github.com or raw.githubusercontent.com.');
 const parts = url.pathname.split('/').filter(Boolean).map(decodeURIComponent);
 const owner = parts.shift() ?? ''; const repo = parts.shift() ?? '';
 if (!/^[\w-]+$/.test(owner) || !/^[\w.-]+$/.test(repo)) throw new ImportError('The repository link is not valid.');
 if (url.hostname === 'github.com' && parts.shift() !== 'blob') throw new ImportError('Open the file on GitHub and copy the file link.');
 if (parts[0] === 'refs' && ['heads','tags'].includes(parts[1])) parts.splice(0,2);
 if (parts.length < 2 || parts.length > 12 || !/\.md$/i.test(parts.at(-1) ?? '') || parts.some(p=>!p || p === '..' || p.includes('\\'))) throw new ImportError('The link must point to a Markdown (.md) file.');
 return { owner, repo, candidates: parts.slice(1).map((_,i)=>({ref:parts.slice(0,i+1).join('/'),path:parts.slice(i+1).join('/')})) };
}

export async function importGitHubHarness(input: string, options: {fetcher?: typeof fetch; token?: string} = {}): Promise<GitHubSnapshot> {
 const parsed = parseGitHubFileUrl(input);
 const fetcher = options.fetcher ?? fetch;
 const base = `https://api.github.com/repos/${encodeURIComponent(parsed.owner)}/${encodeURIComponent(parsed.repo)}`;
 const signal = AbortSignal.timeout(20000);
 async function get(path: string, allowMissing = false) {
  let response: Response;
  try { response = await fetcher(base + path, {headers: {Accept:'application/vnd.github+json', 'X-GitHub-Api-Version':'2022-11-28', ...(options.token ? {Authorization:`Bearer ${options.token}`} : {})}, redirect:'error', signal}); }
  catch { throw new ImportError('GitHub could not be reached. Try again in a moment.', 502); }
  if (allowMissing && [404,422].includes(response.status)) return null;
  if ([403,429].includes(response.status)) throw new ImportError('GitHub’s request limit was reached. Try again later.',429);
  if (response.status===404) throw new ImportError('File not found. Check that the repository and file are public.',404);
  if (!response.ok) throw new ImportError('GitHub could not read this file. Try again later.',502);
  return response.json();
 }
 const repository = await get('');
 if (repository.private !== false) throw new ImportError('Only public GitHub repositories can be shared.');
 for (const candidate of parsed.candidates) {
  const query = new URLSearchParams({path:candidate.path,sha:candidate.ref,per_page:'1'});
  const commits = await get(`/commits?${query}`,true);
  if (!Array.isArray(commits) || !commits[0]) continue;
  const commit = commits[0];
  if (!/^[a-f0-9]{40}$/i.test(commit.sha)) throw new ImportError('GitHub returned an invalid commit.',502);
  const file = await get(`/contents/${candidate.path.split('/').map(encodeURIComponent).join('/')}?ref=${commit.sha}`,true);
  if (!file) continue;
  if (file.type !== 'file' || file.encoding !== 'base64') throw new ImportError('The link must point to a text file under 100 KiB.');
  if (file.size > 102400 || typeof file.content !== 'string' || file.content.length > 145000) throw new ImportError('Use a Markdown file smaller than 100 KiB.');
  const bytes = Buffer.from(file.content,'base64');
  if (bytes.length > 102400) throw new ImportError('Use a Markdown file smaller than 100 KiB.');
  let content: string;
  try { content = new TextDecoder('utf-8',{fatal:true,ignoreBOM:true}).decode(bytes); } catch { throw new ImportError('Save the file as UTF-8 text.'); }
  if (content.includes('\0') || !content.trim()) throw new ImportError('The file must contain readable text.');
  const updatedAt = commit.commit?.committer?.date;
  if (!updatedAt || Number.isNaN(Date.parse(updatedAt))) throw new ImportError('GitHub did not return a valid update date.',502);
  return {owner:parsed.owner,repo:parsed.repo,...candidate,
   sourceUrl:`https://github.com/${parsed.owner}/${parsed.repo}/blob/${candidate.ref.split('/').map(encodeURIComponent).join('/')}/${candidate.path.split('/').map(encodeURIComponent).join('/')}`,
   content, commitSha:commit.sha, contentHash:createHash('sha256').update(bytes).digest('hex'),
   lineCount:content.replace(/\r\n/g,'\n').replace(/\n$/,'').split('\n').length,
   updatedAt, importedAt:new Date().toISOString(),commitMessage:String(commit.commit.message ?? '').split('\n')[0].slice(0,200)
  };
 }
 throw new ImportError('The context file was not found at that branch or path. Check the link.',404);
}
