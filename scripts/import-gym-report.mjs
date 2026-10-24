import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseReport } from '../src/lib/gym/report.ts';

const file = process.argv[2];
if (!file) throw new Error('Usage: npm run gym:import -- /path/to/report.json');
const report = parseReport(JSON.parse(await readFile(resolve(file), 'utf8')));
if (!['accepted', 'rejected', 'no-defect'].includes(report.status)) throw new Error('Only complete reports can be published. Inspect partial reports with the browser file loader.');
for (const variant of [report.baseline, report.candidate].filter(Boolean)) {
 if (createHash('sha256').update(variant.content).digest('hex') !== variant.hash) throw new Error('Skill content does not match its saved hash.');
}
const dir = fileURLToPath(new URL('../src/lib/data/gym/', import.meta.url));
await mkdir(dir, { recursive: true });
const destination = resolve(dir, `${report.suite.id}.json`);
await writeFile(destination, JSON.stringify(report, null, 2) + '\n');
console.log(`Imported ${report.suite.id}: ${report.status}\n${destination}`);
