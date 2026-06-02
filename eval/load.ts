// Loads the canonical skill files. skills/<name>/SKILL.md is the single source
// of truth — the same files the seed route publishes — so the harness always
// scores exactly what ships.

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const SKILLS_DIR = join(fileURLToPath(new URL('..', import.meta.url)), 'skills');

export interface LoadedSkill {
	name: string;
	raw: string;
}

export function loadSkills(): LoadedSkill[] {
	const out: LoadedSkill[] = [];
	for (const name of readdirSync(SKILLS_DIR).sort()) {
		const dir = join(SKILLS_DIR, name);
		if (!statSync(dir).isDirectory()) continue;
		const file = join(dir, 'SKILL.md');
		try {
			out.push({ name, raw: readFileSync(file, 'utf8') });
		} catch {
			// directory without a SKILL.md — skip
		}
	}
	return out;
}
