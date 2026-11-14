import test from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import { createServer as createHttpServer } from 'node:http';

const root = fileURLToPath(new URL('../', import.meta.url));

test('collection and owner queries do not depend on the first discovery page', async t => {
 const queries = [];
 globalThis.__harnessStoreQuery = async (sql, params) => {
  queries.push({sql, params});
  return {rows: []};
 };
 const server = await createServer({
  configFile: false, root, server: {middlewareMode: true, hmr: {server:createHttpServer()}, watch: null},
  optimizeDeps: {noDiscovery: true},
  resolve: {alias: {'$lib': `${root}src/lib`}},
  plugins: [{
   name: 'harness-store-database-transport', enforce: 'pre',
   resolveId(source, importer) {
    if (source === '$env/dynamic/private') return '\0test-environment';
    if ((source === './db' && importer?.endsWith('/harness-store.ts')) || /\/server\/db(?:\.ts)?$/.test(source)) return '\0test-database';
   },
   load(id) {
    if (id === '\0test-environment') return 'export const env = {DATABASE_URL: "test"};';
    if (id === '\0test-database') return 'import {drizzle} from "drizzle-orm/pg-proxy"; export const db = drizzle((...args) => globalThis.__harnessStoreQuery(...args));';
   }
  }]
 });
 t.after(async () => {await server.close(); delete globalThis.__harnessStoreQuery;});
 const {listHarnesses} = await server.ssrLoadModule('/src/lib/server/harness-store.ts');

 await t.test('discovery remains bounded', async () => {
  queries.length = 0;
  await listHarnesses();
  assert.equal(queries.length, 1);
  assert.match(queries[0].sql, /limit \$/);
  assert.equal(queries[0].params.at(-1), 100);
 });

 await t.test('saved IDs are selected in the database without a discovery limit', async () => {
  queries.length = 0;
  const savedId = '11111111-1111-4111-8111-111111111111';
  const result = await listHarnesses({ids: [savedId]});
  assert.equal(queries.length, 1);
  assert.match(queries[0].sql, /where .*"harnesses"\."id" in/);
  assert.deepEqual(queries[0].params, [savedId]);
  assert.doesNotMatch(queries[0].sql, /limit/);
  assert.deepEqual(result.harnesses, []);
 });

 await t.test('owner pages and following queries filter all stored files', async () => {
  queries.length = 0;
  const result = await listHarnesses({owners: ['OLDER-OWNER']});
  assert.equal(queries.length, 1);
  assert.match(queries[0].sql, /where .*lower\(/);
  assert.deepEqual(queries[0].params, ['older-owner']);
  assert.doesNotMatch(queries[0].sql, /limit/);
  assert.deepEqual(result.harnesses, []);
 });

 await t.test('an empty saved collection never becomes discovery data', async () => {
  queries.length = 0;
  const result = await listHarnesses({ids: []});
  assert.deepEqual(result.harnesses, []);
  assert.equal(queries.length, 0);
 });
});
