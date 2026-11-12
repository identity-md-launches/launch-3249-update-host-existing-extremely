#!/usr/bin/env node
// Dependency-free "build" for the Extremely Long Dog site.
// The site is one self-contained index.html plus logo.png served from the repository root.
// This script copies those files unchanged into dist/ (the static export) and runs static checks.
// Usage: node scripts/build.mjs        (from the repository root)
import { readFileSync, mkdirSync, copyFileSync, existsSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const FILES = ['index.html', 'logo.png'];
const CONTRACT = '0x3026f202b01fb15f9d8a7dbe9e29cf5c4273dc6c';
const ALLOWED_EXTERNAL = new Set([
  `https://explorer.imd.fun/token/${CONTRACT}`,
  `https://www.defined.fi/token/robinhood/${CONTRACT}`,
  `https://explorer.mainnet.chain.robinhood.com/token/${CONTRACT}`,
  'https://github.com/identity-md-launches/launch-3248-launch-standard-evm-project-token-only',
  'https://x.com/taylor_/status/2120975103148359750',
  'https://midaswhale.wtf/xlongdog',
  'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap',
  'http://www.w3.org/2000/svg'
]);

const errors = [];
const html = readFileSync(join(root, 'index.html'), 'utf8');

// 1. No CP437 mojibake left (UTF-8 bytes shown as box-drawing / Greek characters).
const mojibake = html.match(/[ΓÇ≡ƒ┬╕∩][─-╿\u0080-ÿ←-⋿ΐ-Ͽ]/g);
if (mojibake) errors.push(`mojibake sequences remain: ${[...new Set(mojibake)].slice(0, 10).join(' ')}`);

// 2. The contract address is present and no other 40-hex address appears.
const addresses = new Set((html.match(/0x[0-9a-fA-F]{40}/g) || []).map((a) => a.toLowerCase()));
if (!addresses.has(CONTRACT)) errors.push('contract address missing');
for (const a of addresses) if (a !== CONTRACT) errors.push(`unexpected address ${a}`);

// 3. Every absolute URL in the page is one of the brief's URLs (plus fonts and the SVG namespace).
// Template-built URLs (`${LINKS...}`) are expanded from the LINKS object, so check their literal parts too.
const urls = (html.match(/https?:\/\/[^\s"'`<>)]+/g) || []).map((u) => u.replace(/\$\{CONTRACT\}/, CONTRACT).replace(/[.,]$/, ''));
for (const u of urls) if (!ALLOWED_EXTERNAL.has(u)) errors.push(`unexpected URL ${u}`);

// 4. Local asset references are relative and exist.
for (const [, ref] of html.matchAll(/(?:src|href|content)="([^"#:]+\.(?:png|svg|ico|css|js|webp|jpg))"/g)) {
  if (ref.startsWith('/')) errors.push(`root-absolute asset path ${ref}`);
  else if (!existsSync(join(root, ref))) errors.push(`missing asset ${ref}`);
}

// 5. Share metadata required for unfurls.
for (const needle of ['<title>', 'rel="icon"', 'name="description"', 'property="og:title"', 'property="og:image"', 'name="twitter:card"', 'property="og:url"']) {
  if (!html.includes(needle)) errors.push(`missing ${needle}`);
}

// 6. External links open in a new tab safely.
for (const m of html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)) {
  if (!/rel="noopener noreferrer"/.test(m[0])) errors.push(`target=_blank without rel: ${m[0].slice(0, 80)}`);
}

if (errors.length) {
  console.error(`build checks failed (${errors.length}):\n- ${errors.join('\n- ')}`);
  process.exit(1);
}

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });
for (const f of FILES) copyFileSync(join(root, f), join(dist, f));
console.log(`build ok: ${FILES.map((f) => `dist/${f}`).join(', ')} (${urls.length} external URL references checked, contract ${CONTRACT})`);
