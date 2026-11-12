# DESIGN.md — Extremely Long Dog ($XLONGDOG)

Extracted from the final source, `index.html` (all CSS is in its single `<style>` block, lines 21–41; markup lines 43–112; script from line 113). `dist/index.html` is a byte-identical copy.

## Overview

A one-page meme site in which the product *is* the scroll. A fixed, full-viewport scene (`.viewport`, sticky inside the very tall `.scroll-track`) pans sideways as the visitor scrolls vertically. One continuous dog body (`.dog-body`, tens of thousands of pixels wide) runs through themed chapters (beach, surf, city … wormhole) that are generated and recycled by JavaScript.

All chrome floats above the scene in fixed layers:

- the top `.site-header`;
- the hero (`.hero-ui`), which fades out after the first chapter;
- the chapter `.story-bubble`;
- the `.floating-status` distance counter;
- the `.bottom-controls` bar;
- the `.ticker-strip`.

The character is playful and loud: heavy Space Grotesk display type, warm yellow actions on deep navy glass, and cream "sticker" cards with thick navy borders and hard offset shadows. Information (lore, tokenomics, how-to, live status and contract) lives in one reusable modal (`.info-modal`) filled from the `PANELS` object, not on extra pages.

The token is live. The live facts are centralised in the script constants `CONTRACT` and `LINKS`. The components `CA_BOX` and `LINK_ROW` are built from them, along with the header Buy link, the CA chip, `<noscript>` and the meta tags.

## Colors

Custom properties (`:root`, line 22):

| Token | Value | Use |
| --- | --- | --- |
| `--yellow` | `#ffc778` | Primary action fill (`.buy-button`), "long" in wordmark |
| `--cream` | `#fff3d6` | Defined palette cream (cards use the near-identical literal `#fff4d6` / `#fff5d6`) |
| `--navy` / `--ink` | `#131b2e` / `#132036` | Defined dark tones; the page body uses `#111a30` |
| `--brown` | `#874a2e` | Dog palette reference |
| `--pink`, `--mint` | `#f7aeb8`, `#9edbc7` | Accent palette (progress gradient uses `#ffcf83 → #c3f1d9`) |
| `--glass` | `rgba(16,26,48,.70)` | Translucent chrome reference |

Literal roles used across components (keep these when adding UI):

- **Dark chrome:**
  - header gradient `rgba(12,24,46,.92) → .73`;
  - bottom bar `#112039fa → #13273ad9`;
  - mobile menu sheet `#14253cf8`.
- **Text on dark:** `#fff`, `#f4f3ed` (nav), `#fff8e9` (controls).
- **Primary action:**
  - `#ffc574` (`.button.primary`) and `--yellow` (`.buy-button`);
  - hover `#ffe4ad`;
  - control pressed/hover `#f9c377` with text `#1b2a3f`.
- **Sticker cards:** fill `#fff4d6`, border and shadow `#172b42` / `#152b43` / `#24354a`, text `#1b2c43`.
- **Modal secondary buttons** (close, Copy): `#ffe09e`; links in the modal `#35519b`.
- **Warning callout:** `#ffe0b2` with a `#b86f36` left rule.
- **Focus ring:** `3px solid #ffe49a`, offset 4px (`button:focus-visible, a:focus-visible`).
- **Ticker strip:** `#f9c879` on `#1c2d44`.

The probe measured every solid text/background pair at ≥4.5:1. Text over the scene gradients was not measured (see VALIDATION.md).

## Typography

- **Families:** `'DM Sans', system-ui, -apple-system, 'Segoe UI', sans-serif` for body and UI; `'Space Grotesk', system-ui, sans-serif` for display (h1, modal h2, placards, story titles, fact values, ticker). Both load from Google Fonts via `@import` (weights DM Sans 400–800, Space Grotesk 400–700; 900 requests fall back to the heaviest available). `font-synthesis: none` is set on `:root`.
- **Monospace (data only):** `ui-monospace, SFMono-Regular, Menlo, Consolas, monospace` in `.ca-code` for the full contract address.
- **Display:** hero `h1` `clamp(55px, 8.8vw, 156px)`, line-height .82, letter-spacing −.096em, weight 900, white-space nowrap; 52px at ≤430px. Modal `h2` `clamp(28px, 4vw, 48px)`/.95, uppercase, −2px.
- **Body:** hero `p` `clamp(15px, 1.55vw, 20px)`/1.55 weight 700; modal `p` 15px/1.6 weight 600.
- **UI labels:** uppercase with wide tracking (a deliberate brand trait), from 8px to 13px:
  - nav 12px/800;
  - buttons 12–13px/900, .9px tracking;
  - control buttons 10px/900, .8px;
  - eyebrow 11px/900, 2.1px;
  - modal tag 10px/900, 2px.
- **Fact values:** Space Grotesk 900 at 27px; fact labels 11px/900 `#6b544a`.
- **Numbers:** the CA chip uses `font-variant-numeric: tabular-nums`.

## Layout

- The page is a single fixed stage. Vertical scroll is translated to horizontal camera movement (`travelPerScroll` 1.38 desktop / 1.65 under 750px). Scenes are `sceneWidth` = max(1320, innerWidth × 1.48, or × 1.9 under 750px) wide. Only the current chapter ±2/+3 are in the DOM.
- **Header:** 74px high (65px ≤750px), with the brand group at the leading edge, nav centred and the Buy link at the trailing edge. Under 750px the nav collapses into a ☰ sheet and the Buy link stays visible.
- **Bottom controls:** three clusters (playback, progress, contract chip + tail/help) in a space-between flex row. Under 750px the row wraps:
  - row 1 is the progress track plus the CA chip;
  - row 2 is the playback and tail/help clusters.
- Breakpoints (from content, all `max-width` except the first):

| Width | Changes |
| --- | --- |
| ≥1500px | Thicker dog body and larger head |
| ≤1080px | Header tagline hidden, smaller wordmark and controls |
| ≤750px | Mobile header and menu, hero repositioned, bottom bar wraps, story bubble narrowed |
| ≤430px | Hero h1 52px, single-column fact grid, Buy link shows "BUY ↗" (ticker text hidden, accessible name keeps it), "Buy / CA" item in the menu |
| ≤360px | `$XLONGDOG` ticker pill hidden so the logo, wordmark, Buy and menu fit at 320px |

- Modal: centred, `width: min(650px, 100%)`, `max-height: calc(100vh - 50px)`, scrolls internally; padding `clamp(25px, 4vw, 48px)`.
- Measured: no horizontal scroll at 320, 390 or 1440. The first screen at 390 shows the logo, wordmark, BUY, the dog scene, the hero actions and the CA chip.

## Elevation & Depth

- Stacking (z-index):
  - scene layers 0–15;
  - vignettes 12;
  - hero / story 25;
  - status 26;
  - bottom controls 45;
  - ticker 48;
  - header 100;
  - modal 250;
  - toast 260 (above the modal so copy feedback is visible);
  - skip link 500.
- Two depth languages:
  1. **Glass chrome:** translucent navy with `backdrop-filter: blur(12–18px)` and soft shadows (header, bottom bar, floating status, ghost button).
  2. **Sticker cards:** opaque cream, 2–5px navy border and a hard offset shadow such as `7px 8px 0 #152b43` (story bubble, placards, toast, modal, gag labels). New informational surfaces should use the sticker language. Chrome on the scene uses glass.
- Primary buttons use a hard offset shadow (`4px 5px 0 #1d3043`) and lift 3px on hover.

## Shapes

Radii:

| Element | Radius |
| --- | --- |
| Pills (ticker pill, link-row links) | 999px |
| Buttons | 14px |
| Control buttons, Copy, CA box | 10px |
| Story bubble | 22px |
| Modal | 24px |
| Fact cards | 14px |

Borders are thick (2–5px) and navy on cream surfaces, and 1px white-alpha on dark chrome.

## Components

| Component | Source | Notes |
| --- | --- | --- |
| Brand | `.brand`, `.brand-logo`, `.brand-wordmark`, `.ticker-pill` (lines 45–51) | `logo.png` at 34px (28px mobile), round, decorative `alt=""`; wordmark with yellow "long". |
| Buy link | `a.button.buy-button` (line 58) | Real link to the IMD buy page, `target="_blank" rel="noopener noreferrer"`, accessible name "Buy $XLONGDOG on IMD (opens in a new tab)". |
| Nav link | `.nav-link` buttons with `data-panel` | Open a modal panel; `.mobile-launch` ("Buy / CA") shows only at ≤430px in the menu sheet. |
| Hero buttons | `.button.primary`, `.button.ghost` | Primary scrolls to chapter 2; ghost opens the lore panel. |
| Control button | `.control-button` | Glass pill used for pause, auto-pan, ruler, tail and help. `aria-pressed` turns it yellow. |
| CA chip | `button.control-button.ca-chip[data-copy-ca]` (line 99) | Shows `CA 0x3026…dc6c ⧉`. Click copies the full address and shows a toast. Always visible in the bottom bar. |
| Toast | `#toast` `role="status"` | Sticker card, top right, 3.8s. Also announces copy results. |
| Info modal | `.modal-backdrop > .info-modal[role=dialog]` | `openPanel(type)` fills `#modalBody` from `PANELS`. Focus moves to close, Tab is trapped, Escape and backdrop close it, header and main are `inert` while open, and focus returns to the trigger (or the ☰ button if the trigger was in the closed menu). |
| Fact grid | `.fact-grid > .fact` (`.fact-wide` spans both columns) | Tokenomics values; one column at ≤430px. |
| Contract box | `CA_BOX` → `.ca-box > code.ca-code + button.ca-copy[data-copy-ca]` | Full address in monospace, wraps anywhere, `user-select: all`. Copy uses `navigator.clipboard`, then a `textarea` + `execCommand('copy')` fallback, and finally selects the text and asks for Ctrl+C. The button reads "Copied" for 2s. |
| Link row | `LINK_ROW` → `nav.link-row` | Pill links Buy · Chart · Explorer · Contract · Source post (first one yellow). Each has a descriptive accessible name. Used in the about and tokenomics panels; the launch panel uses the same component with long labels. |
| Warning | `p.warning` | Callout for the official-address and no-returns notes. |
| Story bubble, floating status, progress, ticker strip, gags, placards | lines 21–29 | Scene chrome, unchanged from the original design. |

All copy actions are wired through one delegated listener on `[data-copy-ca]`.

## Do's and Don'ts

- **Do:**
  - put new token facts in `CONTRACT` / `LINKS` and reuse `CA_BOX` / `LINK_ROW`;
  - add information as a new `PANELS` entry opened by a `data-panel` button rather than as a new page;
  - use the sticker-card language for information surfaces and `.control-button` for controls on the scene;
  - keep all asset paths relative (`logo.png`) and rebuild with `node scripts/build.mjs`.
- **Do** keep every external link to the brief's exact URLs. The build script rejects any other URL or address.
- **Don't:**
  - shorten the address anywhere except the chip (which still copies it in full);
  - add a second accent hue: yellow means "act";
  - add frameworks, dependencies or extra fonts;
  - move the Buy link out of the header, since it is the first-screen action at 390px.
- **Recipe for one more panel:** add `PANELS.newid = ['TITLE', `<p>…</p>${LINK_ROW}`]` and a `<button class="nav-link" data-panel="newid">` in `.top-links`. The modal, focus handling and copy wiring work automatically.
