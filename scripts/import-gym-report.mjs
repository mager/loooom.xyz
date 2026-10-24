import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArtifact } from '../src/lib/gym/session.ts';

const file = process.argv[2];
if (!file) throw new Error('Usage: npm run gym:import -- /path/to/report.json');
const report = parseArtifact(JSON.parse(await readFile(resolve(file), 'utf8')));
if (!['accepted', 'rejected', 'no-defect','verified','not-verified','no-improvement'].includes(report.status)) throw new Error('Only complete reports can be published. Inspect partial reports with the browser file loader.');
if (report.schemaVersion === 2 && createHash('sha256').update(JSON.stringify(report.suite)).digest('hex') !== report.suiteHash) throw new Error('Suite content does not match its saved hash.');
const variants = report.schemaVersion === 2 ? [report.original,report.baseline,report.selected,...report.rounds.map(r=>r.candidate),report.verification?.baseline,report.verification?.candidate] : [report.baseline,report.candidate];
for (const variant of variants.filter(Boolean)) {
 if (createHash('sha256').update(variant.content).digest('hex') !== variant.hash) throw new Error('Skill content does not match its saved hash.');
}
const dir = fileURLToPath(new URL('../src/lib/data/gym/', import.meta.url));
await mkdir(dir, { recursive: true });
const destination = resolve(dir, `${report.suite.id}${report.schemaVersion === 2 ? '.session' : ''}.json`);
await writeFile(destination, JSON.stringify(report, null, 2) + '\n');
console.log(`Imported ${report.suite.id}: ${report.status}\n${destination}`);
