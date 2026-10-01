# Brief to Code: seat two rulings the tree does not carry

From the desk, 2026-09-30 21:45. Found by the ledger `ledger-rulings-vs-tree_r1_2026-09-30.md`. No git writes. Gates before and after.

## 1. The Insights heading. RATIFIED by Dann 2026-09-30 21:30

`insights.fit.heading` (`apps/web/src/lib/i18n.ts:1486`), verbatim, with a comment carrying the ratification and its history (English ruled 2026-09-22, `docs/memory/OWED.md` "Rulings Dann owes" item 2; French desk-drafted, ratified 21:30):

- EN: "Ilya reads your compatibility from these three measurements."
- FR: « Ilya évalue votre compatibilité à partir de ces trois relevés. »

Check it renders where `InsightsPane.svelte` draws the heading (the 2026-09-30 audit cited `:632-633`), in both languages, and that the longer line wraps cleanly at phone width.

## 2. A leap is a minor sixth. Ruled by Dann 2026-09-23 00:27

*"the literature tells us a 'large' or 'wide' leap is a minor sixth or greater"* (`docs/sessions/method-leaps_r1_2026-09-22.md:254`, homed in `docs/memory/OPEN.md` §RULINGS HOMED FROM SESSION FILES). The tree uses a fifth, labelled "build default": `COMMENT_DEFAULTS.leapSemitones: 7` (`insights/comments.ts:54`) and `GATE_DEFAULTS` `leapSemitones: 7` (`analysis/gates.ts:67`, which says to change both together). **DESK DEFAULT: set both to 8** and rewrite both comments to cite the ruling. Report, on Dann's library or the fixtures you already use, which comments and watch-band lines appear or disappear. If a test pins 7, update it to the ruling.

## 3. Two calibration strings. RATIFIED by Dann 2026-09-30 22:16 (*"Ratified"*), drafted by Code in `report-code-sing-first-then-fry_r1_2026-09-30.md`

- `pacifier.wheelAria`: EN "Vowel calibration. Tap a vowel to begin, tap again to cancel, long-press to skip." FR « Calibration des voyelles. Touchez une voyelle pour commencer, touchez-la de nouveau pour annuler, appuyez longuement pour l’ignorer. »
- `pacifier.ready` (new; the pointer's caption, replacing the DESK DEFAULT one): EN "Tap {v} to begin." FR « Touchez {v} pour commencer. »

Verbatim, with comments carrying the ratification.

## Report

`docs/sessions/report-code-seat-missing-rulings_r1_2026-09-30.md`. NOT ESTABLISHED beats a complete invented answer.
