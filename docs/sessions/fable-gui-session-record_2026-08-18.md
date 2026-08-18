# Fable GUI session record, 2026-08-18

**Fable, in Cowork, with Dann present throughout. Every ruling below is Dann's,
made in conversation tonight; every design consequence marked (Fable) was
ratified by his eyes on the rendered mockup.**

## Rulings

1. **The principles slate is ratified**: the eleven-principle catalogue and the
   operational spec (colour, shape, grouping, typography, motion, error copy)
   in the audit document below, with the amendments in rulings 2 to 4.
2. **NOTATION opens collapsed.** Dann's rationale, kept in his words: Ilya is
   already set to Grayson's defaults; the toggles are departures from Grayson's
   schema, permissible at the user's discretion, so they are something the user
   intentionally accesses, not screen real estate spent by default.
3. **Error copy voice**: name what happened, what it means, and where possible
   one next step; a next step is not always needed and is judged case by case;
   never patronizing.
4. **Portrait treatment C is ruled.** The fitted page is portrait's arrival
   view: the true paper, whole, with its header block, shadow, and colophon.
   One tap (Read) enters a reading aid; one tap (The page) returns. The
   interstitial is retired. Treatment B (a dressed scroll as the sole portrait
   representation) is rejected. This amends the portrait accommodation in
   PRODUCT.md; rotation-as-mode-switch stands.
5. **The reading aid wears no paper dress** (Fable, ratified): no shadow, no
   page edges, no header block, no colophon, a "reading aid, not the page"
   label, line rules at poem breaks, an end-of-verse mark, a labelled drawer
   pull. Nothing on it prints. The page owns its dress exclusively.
6. **Chapter-opening bands for Learn and Guide** (Fable, ratified): one
   full-strength colour band per chapter (rose for Learn, cobalt for Guide),
   oversized sans title, italic deck, meta line (source sections, reading
   time), then the untouched serif reading measure. Oversized type and
   full-strength hue are spent on arrival moments only.
7. **Tabs die everywhere under Studio**, reconfirmed after Dann questioned
   them: three destinations (Studio, Learn, Guide); within Studio the boxed
   pair chooses a document; Learn and Guide are set-apart links; the phone's
   bottom bar is deleted. This is the E.44 ruling, not a new one.
8. **Displacement**: tonight displaced N.67 step 5 by Dann's word. Step 5
   remains THE ONE THING.

## Artifacts, paths and md5s

| file | md5 |
|---|---|
| `docs/sessions/fable-gui-audit-and-spec_r1_2026-08-18.md` | `80474828853ec7dc1c495fe9c954a967` |
| `docs/sessions/fable-gui-mockup_r1_2026-08-18.html` | `d623aa7ea9fe4c15c10604fddd78b121` |
| `docs/sessions/fable-gui-mockup_r2_2026-08-18.html` | `39501730ad74292647e1f2ca095a93e7` |

Mockup r1's portrait exhibit carries today's four-tab bar and is superseded by
r2 on that point; r1 remains the record of the drawer comparison (today beside
Studio) and of the rejected treatment B.

## Audit findings carried forward

F1 to F9 are in the audit document. Two are one-look items for a future Code
session, neither blocking: **F7**, auto-name produced the one-letter song title
`Я` from the poem `Я вас любил: любовь ещё...` (cause not established; STATE.md
records 4b auto-naming `Я тебя любил` correctly from a different poem); **F8**,
the song row still reads as a text input. **F5**: the mobile interstitial still
ships; a project document is titled `e45-n63-ruled-kill-the-interstitial` (title
only, not read this session); portrait C is its cure in any case.

## Instrument notes

- Walked on deploy `ilya-b0gn6a3ru` (commit `ed8318e`), Chrome on Dann's Mac,
  1427 by 840 and 390 by 844 and 844 by 390. Not walked: Print, Safari, Fit
  with a loaded score, the calibration ritual.
- A song auto-named `Я` was left in that deploy origin's IndexedDB. Separate
  origin per deploy; nothing Dann uses daily was touched.
- Hue stand-ins in both mockups (lavender, rose, cobalt accents, desk tints)
  were read by eye and must be re-verified against `app.css` before any build.
  Typefaces are stand-ins; the tree's font declarations were not read.
- The Cowork cloud container renders and screenshots local HTML with Playwright
  and the preinstalled Chromium at `/opt/pw-browsers/chromium`; the container
  cannot reach `*.vercel.app`, so live walks go through Dann's Chrome.

## What this session did not do

No application code was written or changed. No git was run. The five-user task
script (audit §5.3) and the briefs to Code for Studio S1 to S4 and portrait C
remain unwritten, and the GUI track still builds nothing before the beta line
closes unless Dann names what it displaces.

*Fable, 2026-08-18.*
