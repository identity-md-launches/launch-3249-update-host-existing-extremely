# Validation and design review — XLONGDOG live update

## Scope and assumptions

**Scope.** This update switches the existing single-file site to the live token. Reviewed surfaces:

- header (brand logo, Buy link, mobile menu "Buy / CA");
- bottom bar CA chip;
- the launch, tokenomics and about panels;
- `<noscript>` and the meta/share tags;
- the CP437 mojibake repair across `index.html` and `README.md`.

The scene, animation, jokes, colours and fonts were kept as they were, as the brief requires.

**Export.** `dist/` (`index.html` and `logo.png`, byte-identical to the root files and produced by `node scripts/build.mjs`). It was served by a local HTTP server started inside each foreground test script, including once under a `/sub/` path to mimic an IPFS gateway.

**Assumptions:**

- "No build step, no dependencies" (brief) and "dist/ committed with a lockfile" (acceptance) conflict. I resolved it this way:
  - the root `index.html` stays the source;
  - a dependency-free Node script copies it to `dist/`;
  - there is no `package.json` or lockfile because there are no packages.
- `logo.png` is the supplied file copied unchanged (SHA-256 `c4b1a625…aca7bb`, 1.2 MB). It replaces the 🐕 emoji next to the wordmark.
- The brief's design wins over the house probe. Kicker labels, uppercase tracked labels, the ticker strip and the hard sticker shadows are the site's established system and were kept.

## Coverage (Better Interface, six domains)

| Domain | Status | Evidence |
| --- | --- | --- |
| Accessibility | Checked | Native `<a>` for Buy and links and `<button>` for copy. Accessible names contain the visible labels (CA chip, Buy, link row). Keyboard walk: ☰ → "Buy / CA" → modal; focus lands on close, Tab is trapped, Escape closes. Background is `inert` while open. Focus returns. Reduced motion pauses animation. Toast `role="status"` announces copies. **Unperformed:** screen reader session, forced-colors mode, native 200% zoom, physical devices. |
| Layout | Checked | Rendered at 320, 390 and 1440: no horizontal scroll and the header items do not overlap (measured boxes). The CA chip and Buy are inside the viewport at all three widths. The modal has no horizontal overflow. **Not checked:** RTL (the site is English-only and does not support RTL). |
| Writing | Checked | Verb-first labels ("Buy $XLONGDOG", "Copy"). Destination-describing link names. The live-status copy says only verified facts from the brief. Warning tone is plain. No "pending" or "not launched" text remains (scripted grep). |
| Typography | Checked | Monospace only for the address (data). The address wraps (`overflow-wrap:anywhere`) instead of being clipped. Tabular numerals on the chip. No new families or weights (probe: 2 families, 3 weights). |
| Colors | Checked | New components reuse existing literals (`#ffe09e`, `#ffc574`, `#24354a`, `#35519b`). The probe measured all solid text pairs at ≥4.5:1. **Not measured:** 27 text boxes over scene gradients or images. |
| UI | Checked | New surfaces use the existing sticker-card and pill language. No `transition: all`. Endless animations stop under reduced motion (probe). |

## Findings and fixes

| # | Severity | Location | Finding | Fix | Recheck |
| --- | --- | --- | --- | --- | --- |
| 1 | High | `index.html` (whole file), `README.md` | UTF-8 text had been mis-decoded as CP437 (e.g. `ΓÇö`, `≡ƒÉò`) | Re-encoded every character to CP437 bytes and decoded them as UTF-8. The round trip was lossless for both files. | Build-script mojibake check passes. The probe's glyph count shows the emoji render. |
| 2 | High | `index.html:39` (originally `.site-header>.buy-button{display:none}` at ≤430px) | The main action (Buy) was hidden on phones, so it was not on the first screen at 390 | Show a compact "BUY ↗" (`.buy-ticker` hidden, full accessible name kept) | Visible at 320, 390 and 1440 (Playwright) |
| 3 | Medium | `index.html:40` | At 320px the `$XLONGDOG` pill (172–249px) overlapped the Buy link (196–255px) | Hide `.ticker-pill` at ≤360px | Boxes measured without overlap at 320 |
| 4 | Medium | `index.html:30` `.modal-tag` | At 390 the modal kicker text ran under the ✕ close button (screenshot) | `padding-right:48px` | Rechecked screenshot |
| 5 | Medium | `index.html:29` `.toast` (z-index 111 < modal 250) | Copy feedback inside the modal would sit behind the backdrop | Toast z-index 260; copy always toasts (`role="status"`) | z-index 260 and opacity 1 measured over the open modal |
| 6 | Medium | `index.html:406`, `:411` | The modal did not make the background inert | Set `inert` on header and main while open | Playwright: both inert while open, cleared on close |
| 7 | Medium | `index.html:411` `closePanel` | Focus was lost after closing a panel opened from the mobile menu, because the trigger becomes `display:none` | Fall back to the ☰ button | Playwright: focus on `#menuButton` after Escape |
| 8 | Low | `index.html:99`, `:370` | Visible labels ("CA 0x3026…dc6c", "Explorer") were not part of an accessible name, or were vague | `aria-label`s that start with or contain the visible text and name the destination | Source review |
| 9 | Low | inline script | `tsc --checkJs` reported 11 DOM-typing errors (mixed pre-existing and new) | JSDoc casts, no runtime change | `tsc` exit 0 |

**Kept on purpose** (probe failures caused by the established design the brief says to keep exactly):

- `casing` (12 uppercase content boxes);
- `tracking` (17 boxes; h1 at −0.096em, tracked caps labels);
- `eyebrows` (the hero `.eyebrow` at line 77);
- `type-sizes` (7 sizes at 1440 / 12 with one-offs);
- `repetition` (the `.ticker-strip` marquee at line 102);
- `chrome` (border + shadow sticker buttons);
- `layout`: only "text cut off by overflow: hidden" items, which are the ticker marquee and the decorative rotated `.scene-title` watermark. There is no horizontal scroll and no overlap.

## Verification (final source)

| Check | Command | Result |
| --- | --- | --- |
| Build | `node scripts/build.mjs` | `build ok` (10 external URL references, all on the allow-list; one address only); `cmp` confirms `dist/` matches the root files |
| Syntax | `node --check` on the extracted inline script | OK |
| Typecheck | `tsc --noEmit --allowJs --checkJs --target es2022 --lib es2022,dom,dom.iterable` (TypeScript 5.9.3 in a scratch folder) | exit 0 |
| Interactions, Chromium at 320 / 390 / 1440 (50 assertions) | Playwright script, external requests blocked | 50/50 on the final run (an earlier run of the same build reported 49/50; the failing assertion was not captured and the rerun passed) |
| Keyboard / inert / fallback / subpath / meta (11 assertions) | Playwright, 390, reduced motion, no clipboard permission | 11/11 |
| Design probe | `node .imd/reads/skills/design-critic/scripts/taste.mjs --out test/scratch/taste` | 9/16 |

**Interaction assertions:**

- **Page and header:**
  - no page errors;
  - no horizontal overflow;
  - header boxes don't overlap.
- **Buy link and CA chip:**
  - the Buy href, target and rel are exact;
  - the CA chip is in the viewport;
  - the chip copies the full address (clipboard read back);
  - "Buy / CA" opens "LIVE ON ROBINHOOD CHAIN";
  - the full address shows in the code box;
  - all 5 links are exact and open in a new tab;
  - the Copy button reads "Copied".
- **Panels:**
  - Escape closes the modal;
  - the tokenomics panel shows 1 BILLION, 90%, 10%, 0%, ROBINHOOD / ETH, 1.25%, the address and "No returns", with no "PLANNED", "Not yet launched" or "proposed";
  - the about panel has the fan-meme note and the link row Buy, Chart, Explorer, Contract, Source post.
- **Scroll:** scrolling pans the dog, and the test status reports `launched: true` and the contract.
- **Keyboard and fallback checks:**
  - relative `logo.png` loads under `/sub/`;
  - og:url, og:image, twitter:image, twitter:card and description are set;
  - the clipboard fallback copies without permission.

The probe passed `render`, `targets`, `contrast`, `type-faces`, `glyphs`, `slogans`, `copy-budget`, `motion` and `share`.

Screenshots were reviewed at 390 and 1440 (first screen), plus the launch and tokenomics panels at 390. They were kept in the scratch folder, which is not delivered.

## Limitations and completion

- WebKit could not start on this machine (missing system libraries), so Safari/iOS behaviour was not tested.
- No screen reader, physical-device, forced-colors or native-zoom checks were run.
- External destinations were checked for exact URLs, not fetched.
- The `navigator.clipboard` path was verified in Chromium with permission granted; the `execCommand` fallback was verified without permission.

Status: **Complete for the stated scope**, with the limitations above.
