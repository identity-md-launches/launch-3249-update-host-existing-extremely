# Extremely Long Dog — $XLONGDOG

The animated, indefinitely scrolling website for Extremely Long Dog.
Scroll to pan along one impossibly long dachshund while animated landscapes, strange characters and easter eggs pass by. It includes an auto-pan mode, an interactive distance ruler, mobile support and respect for reduced-motion preferences.

## Status: live on Robinhood Chain

$XLONGDOG is live.

| Fact | Value |
| --- | --- |
| Name / ticker | Extremely Long Dog / $XLONGDOG |
| Chain | Robinhood Chain (chain id 4663) |
| Contract address (the only official one) | `0x3026f202b01fb15f9d8a7dbe9e29cf5c4273dc6c` |
| Launch | IMD launch #3248 |
| Pool | Uniswap v4, ETH / XLONGDOG (paired with ETH, not IMD) |
| Pool fee | 1.25% (1% to the launch payer, 0.25% to the IMD network) |
| Supply | 1,000,000,000 (18 decimals) |
| Allocation | 90% seeded in the pool, 10% to the IMD swarm, 0% team reserve |
| Token rules | No transfer tax, no mint after launch |

Links:

- Buy / trade (official): https://explorer.imd.fun/token/0x3026f202b01fb15f9d8a7dbe9e29cf5c4273dc6c
- Chart: https://www.defined.fi/token/robinhood/0x3026f202b01fb15f9d8a7dbe9e29cf5c4273dc6c
- Block explorer: https://explorer.mainnet.chain.robinhood.com/token/0x3026f202b01fb15f9d8a7dbe9e29cf5c4273dc6c
- Contract source: https://github.com/identity-md-launches/launch-3248-launch-standard-evm-project-token-only
- Source post (inspiration only): https://x.com/taylor_/status/2120975103148359750
- Official website: https://midaswhale.wtf/xlongdog

Ignore DM links, presales and any other contract address. No returns or price performance are promised.
This is an unofficial fan meme. It is not affiliated with or endorsed by @taylor_ or the dog's owner.

## What is in this repository

| Path | Role |
| --- | --- |
| `index.html` | The whole site: markup, CSS and JavaScript in one file. This is the source and is served from the repository root. |
| `logo.png` | The supplied $XLONGDOG logo (unchanged copy, 1254×1254 PNG). Used for the favicon, apple-touch-icon, og:image / twitter:image and the header mark. |
| `dist/` | The static export: byte-identical copies of `index.html` and `logo.png`, produced by `scripts/build.mjs`. |
| `scripts/build.mjs` | Dependency-free build: runs static checks, then copies the site into `dist/`. |
| `DESIGN.md` | Design system of the implemented site (tokens, type, components, responsive behaviour). |
| `VALIDATION.md` | Design review (Better Interface) and the checks that were run, with their results and limitations. |

All asset paths are relative (`logo.png`), so the site works from the repository root, from `dist/`, at an IPFS gateway subpath or under an ENS name.

## Install

Nothing to install. There are no npm dependencies, no `package.json` and so no lockfile: the site is plain HTML, CSS and JavaScript. You need Node.js 18 or newer only to run the build script. The two Google Fonts (DM Sans, Space Grotesk) load at runtime; system fonts are used if they are blocked.

## Preview

- Quickest: open `index.html` (or `dist/index.html`) in a modern browser.
- Over HTTP, which is closer to production (clipboard copy uses the secure-context API on `localhost`):

      python3 -m http.server 8080 --directory dist
      # then open http://localhost:8080/

## Rebuild

    node scripts/build.mjs

The script fails without writing anything if any of these checks fail:

- leftover CP437 mojibake;
- a contract address other than the official one;
- a URL outside the brief's list (fonts and the SVG namespace are also allowed);
- a missing or root-absolute local asset;
- missing title, favicon, description, og or twitter tags;
- a `target="_blank"` link without `rel="noopener noreferrer"`.

If every check passes, it replaces `dist/` with fresh copies of `index.html` and `logo.png`. Edit `index.html` at the root, then rebuild and commit both the root files and `dist/`.

## Deployment

Any static host that serves `index.html` works: the repository root or `dist/` (Vercel preset "Other", Cloudflare Pages, GitHub Pages, IPFS). The official website is https://midaswhale.wtf/xlongdog.

## Validation (last run: this revision)

Run against the final `dist/` export in headless Chromium (Playwright). Full details are in `VALIDATION.md`.

| Check | Command | Result |
| --- | --- | --- |
| Build + static checks | `node scripts/build.mjs` | pass; `dist/` byte-identical to the root files (`cmp`) |
| JS syntax | `node --check` on the extracted inline script | pass |
| Typecheck | `tsc 5.9.3 --noEmit --allowJs --checkJs --lib es2022,dom` on the extracted inline script (TypeScript installed in a scratch folder, not committed) | 0 errors after adding JSDoc casts (11 reported at first) |
| Interactions at 320 / 390 / 1440 | Playwright script (scratch) | 50/50 (previous round) |
| Keyboard, inert, clipboard fallback, subpath, meta | Playwright script (scratch) | 11/11 (previous round) |
| Revision 2 regression suite (23 widths 320–1440, real fonts) | Playwright script (scratch) | all pass. Covers Buy / CA reachable at every width, no header overlap, tokenomics/live modal without horizontal overflow, toast wraps the full address, focus kept after fallback copy. |
| Header overlap scan, every width 320–1500 | Playwright script (scratch), real and fallback fonts | 0 failing widths |
| Typecheck (this revision) | `tsc 5.9.3 --noEmit --allowJs --checkJs` on the extracted inline script | 0 errors |
| Design probe | `node .imd/reads/skills/design-critic/scripts/taste.mjs --out test/scratch/taste` | 9/16; every failure comes from the existing design the brief says to keep (see `VALIDATION.md`) |

Limitations:

- WebKit/Safari could not run on the build machine because of missing system libraries.
- No screen reader, physical device, or native 200% zoom was tested.
- External links were checked for exact URLs, not fetched.

## Source of truth

Website-only publishing remote: https://github.com/How1337ItIs/xlongdog-website
The website is also part of the private full project at https://github.com/How1337ItIs/xlongdog under website/.
To update the website publishing remote from the full source checkout:

    git subtree split --prefix=website HEAD
    git push website <sha-returned-above>:refs/heads/main

Use the returned split SHA for <sha-returned-above>, not the source repository main commit SHA.
