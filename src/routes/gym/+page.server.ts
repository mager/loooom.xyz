import { parseReport } from '$lib/gym/report';

export function load() {
 const files = import.meta.glob('$lib/data/gym/*.json', { eager: true, import: 'default' });
 const reports = Object.values(files).map(parseReport).sort((a, b) => a.suite.id.localeCompare(b.suite.id));
 return { reports };
}
