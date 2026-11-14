import type { GitHubSnapshot } from '../server/github-harness';
export type Harness = {id:string; title:string; description:string; topic:string; snapshot:GitHubSnapshot; sharedBy:string|null; userId:string|null; curated:boolean;};
export const topics = ['all','coding','design','workflow','testing'] as const;
export function dateLabel(value: string) { return new Intl.DateTimeFormat('en-US',{month:'short',day:'numeric',year:'numeric', timeZone:'UTC'}).format(new Date(value)); }
export function pinnedUrl(file: GitHubSnapshot) { return `https://github.com/${file.owner}/${file.repo}/blob/${file.commitSha}/${file.path.split('/').map(encodeURIComponent).join('/')}`; }
