// Run with: node --env-file=.env scripts/migrate-context.mjs
// This migration only adds tables and an index. Existing records are preserved.
import { readFile } from 'node:fs/promises';
import { neon } from '@neondatabase/serverless';
if (!process.env.DATABASE_URL) throw new Error('Set DATABASE_URL before running the migration.');
const source = await readFile(new URL('../migrations/0001_harness_network.sql',import.meta.url),'utf8');
const statements=source.replace(/^--.*$/gm,'').split(';').map(s=>s.trim()).filter(s=>s && !['BEGIN','COMMIT'].includes(s));
const sql=neon(process.env.DATABASE_URL);
await sql.transaction(statements.map(statement=>sql.query(statement)));
console.log('Context tables and index are ready.');
