// Loads the canonical skill files. skills/<name>/SKILL.md is the single source
// of truth — the same files the seed route publishes — so the harness always
// scores exactly what ships.

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const SKILLS_DIR = join(fileURLToPath(new URL('..', import.meta.url)), 'skills');
const FIXTURES_DIR = join(fileURLToPath(new URL('.', import.meta.url)), 'fixtures');

export interface LoadedSkill {
	name: string;
	raw: string;
}

function loadDir(base: string): LoadedSkill[] {
	let names: string[];
	try {
		names = readdirSync(base).sort();
	} catch {
		return []; // directory absent
	}
	const out: LoadedSkill[] = [];
	for (const name of names) {
		const dir = join(base, name);
		if (!statSync(dir).isDirectory()) continue;
		try {
			out.push({ name, raw: readFileSync(join(dir, 'SKILL.md'), 'utf8') });
		} catch {
			// directory without a SKILL.md — skip
		}
	}
	return out;
}

// Published, canonical skills (these get seeded).
export function loadSkills(): LoadedSkill[] {
	return loadDir(SKILLS_DIR);
}

// Calibration fixtures — deliberately bad "costume" skills used to verify the
// judge actually discriminates. Never seeded.
export function loadFixtures(): LoadedSkill[] {
	return loadDir(FIXTURES_DIR);
}
