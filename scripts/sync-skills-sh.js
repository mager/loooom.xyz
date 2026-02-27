#!/usr/bin/env node
/**
 * sync-skills-sh.js
 *
 * Fetches the skills.sh all-time and trending leaderboards, parses install
 * counts for every known skill, and writes two JSON files:
 *
 *   src/lib/skills-sh-installs.json  — { "obra/superpowers/brainstorming": 33100, ... }
 *   src/lib/skills-sh-trending.json  — [{ path, rank }, ...]
 *
 * Run manually:   node scripts/sync-skills-sh.js
 * GitHub Action:  .github/workflows/sync-skills-sh.yml (daily @ 6am UTC)
 */

import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const LIB = join(ROOT, 'src', 'lib');

// ── helpers ──────────────────────────────────────────────────────────────────

/**
 * Parse human-readable install count to integer.
 * "343.2K" → 343200  |  "41.1K" → 41100  |  "5.5K" → 5500  |  "1.2M" → 1200000
 */
function parseInstalls(str) {
  str = str.trim();
  if (str.endsWith('M')) return Math.round(parseFloat(str) * 1_000_000);
  if (str.endsWith('K')) return Math.round(parseFloat(str) * 1_000);
  return parseInt(str, 10) || 0;
}

/**
 * Fetch a URL and return the response text. Simple wrapper with error handling.
 */
async function fetchText(url) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'loooom-sync-bot/1.0 (https://loooom.xyz)',
      'Accept': 'text/html,application/xhtml+xml'
    }
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${url}`);
  return res.text();
}

/**
 * Parse a skills.sh HTML page and return a map of { skillPath → installCount }
 * and an ordered array of skill paths (for ranking).
 *
 * The leaderboard HTML contains entries that, after readability extraction, look like:
 *   [1find-skillsvercel-labs/skills343.2K](/vercel-labs/skills/find-skills)
 *
 * We parse the link hrefs: href="/obra/superpowers/brainstorming"
 * and the install count that precedes the closing paren.
 */
function parseLeaderboard(html) {
  const installs = {};
  const ranked = [];

  // Match markdown-style links from the readability-processed content, or raw <a> tags
  // Primary: look for href="/owner/repo/skill" patterns with nearby install counts
  // The raw HTML will have <a href="/obra/superpowers/brainstorming"> etc.

  // Strategy 1: parse <a href="/..."> tags with 3-segment paths
  const hrefRe = /href="\/([a-z0-9_.-]+\/[a-z0-9_.-]+\/[a-z0-9_.-]+)"/g;
  const paths = [];
  let m;
  while ((m = hrefRe.exec(html)) !== null) {
    const path = m[1];
    // Skip non-skill paths (e.g. github.com links embedded)
    if (!path.includes('/')) continue;
    if (!paths.includes(path)) paths.push(path);
  }

  // Strategy 2: parse install counts near the skill name
  // Look for patterns like: >343.2K< or "343.2K" near skill links
  // We'll try to match the full entry: rank + skill-name + owner/repo + installCount
  // Format in raw HTML: <td>343.2K</td> or similar
  const countRe = /(\d+\.?\d*[KMB]?)\s*(?:installs?)?/gi;

  // Build a simpler approach: just match the markdown-style text we know skills.sh generates
  // "[rank][skill-name][owner/repo][count](/owner/repo/skill-name)"
  const entryRe = /\[(\d+)([a-z0-9-]+)([\w-]+\/[\w-]+)([\d.]+K?)\]\(\/([^)]+)\)/g;
  let entry;
  while ((entry = entryRe.exec(html)) !== null) {
    const [, rank, , , countStr, path] = entry;
    const segments = path.split('/');
    if (segments.length === 3) {
      const count = parseInstalls(countStr);
      installs[path] = count;
      ranked.push({ path, rank: parseInt(rank, 10), installs: count });
    }
  }

  // Fallback: if entryRe didn't match much (different HTML format), try extracting
  // from structured table rows. Look for the path in href and count nearby.
  if (ranked.length < 5) {
    console.log('  Primary regex found few results, trying fallback parser...');
    // Try: href="/a/b/c">skill-name</a>...count
    const rowRe = /href="\/([a-z0-9_.-]+\/[a-z0-9_.-]+\/[a-z0-9_.-]+)"[^>]*>[^<]+<\/a>[^<]*<[^>]+>([\d.]+K?)<\//g;
    let row;
    let rank = 1;
    while ((row = rowRe.exec(html)) !== null) {
      const [, path, countStr] = row;
      const count = parseInstalls(countStr);
      if (!installs[path]) {
        installs[path] = count;
        ranked.push({ path, rank: rank++, installs: count });
      }
    }
  }

  return { installs, ranked };
}

// ── main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🔄 Syncing skills.sh data...\n');

  // 1. All-time leaderboard
  console.log('  Fetching https://skills.sh (all-time)...');
  let allTimeHtml = '';
  let allTimeData = { installs: {}, ranked: [] };
  try {
    allTimeHtml = await fetchText('https://skills.sh');
    allTimeData = parseLeaderboard(allTimeHtml);
    console.log(`  ✓ Parsed ${allTimeData.ranked.length} skills from all-time leaderboard`);
  } catch (err) {
    console.warn(`  ⚠ Failed to fetch all-time: ${err.message}`);
  }

  // 2. Trending leaderboard
  console.log('  Fetching https://skills.sh/trending...');
  let trendingData = { installs: {}, ranked: [] };
  try {
    const trendingHtml = await fetchText('https://skills.sh/trending');
    trendingData = parseLeaderboard(trendingHtml);
    console.log(`  ✓ Parsed ${trendingData.ranked.length} skills from trending leaderboard`);
  } catch (err) {
    console.warn(`  ⚠ Failed to fetch trending: ${err.message}`);
  }

  // 3. Merge install counts (all-time wins over trending for counts)
  const merged = { ...trendingData.installs, ...allTimeData.installs };

  // 4. Write installs file
  mkdirSync(LIB, { recursive: true });
  const installsPath = join(LIB, 'skills-sh-installs.json');
  writeFileSync(installsPath, JSON.stringify(merged, null, 2) + '\n');
  console.log(`\n  📝 Wrote ${Object.keys(merged).length} install counts → src/lib/skills-sh-installs.json`);

  // 5. Write trending file (top 50)
  const trendingPath = join(LIB, 'skills-sh-trending.json');
  const trendingTop = trendingData.ranked.slice(0, 50).map(({ path, rank }) => ({ path, rank }));
  writeFileSync(trendingPath, JSON.stringify(trendingTop, null, 2) + '\n');
  console.log(`  📝 Wrote ${trendingTop.length} trending skills → src/lib/skills-sh-trending.json`);

  // 6. Print what we know about our tracked skills
  const trackedPaths = [
    'obra/superpowers/brainstorming',
    'obra/superpowers/systematic-debugging',
    'obra/superpowers/writing-plans',
    'coreyhaines31/marketingskills/seo-audit',
    'coreyhaines31/marketingskills/copywriting',
    'browser-use/browser-use/browser-use',
    'inference-sh-9/skills/ai-image-generation',
    'firecrawl/cli/firecrawl',
    'anthropics/skills/pdf',
    'obra/episodic-memory/remembering-conversations',
  ];

  console.log('\n  📊 Tracked skill install counts:');
  for (const path of trackedPaths) {
    const count = merged[path];
    if (count !== undefined) {
      console.log(`     ${path}: ${count.toLocaleString()}`);
    } else {
      console.log(`     ${path}: (not found in leaderboard — using seed value)`);
    }
  }

  console.log('\n✅ Done!\n');
}

main().catch((err) => {
  console.error('❌ Sync failed:', err);
  process.exit(1);
});
