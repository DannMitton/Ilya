# Brief to Code: three fixes for a newcomer reading Ilya's code

From the desk, 2026-10-01 03:10. No git writes. Gates before and after. Documents and comments only; no behaviour changes.

**The ruling:** Dann, 2026-10-01 02:59 ("yes"), on the desk's three changes from `docs/sessions/memo-overnight-A18-A19_r1_2026-10-01.md` §A18. Who offered: the desk. Who ruled: Dann. Context: Ilya is meant to be a legacy others build on (`docs/memory/PRODUCT.md`, "Why Ilya exists").

1. **The blurb data path and two missing folders (checked by the desk 2026-10-01).** `ARCHITECTURE.md:84-86` names `data/blurb-composer.json` inside the `apps/web` bullet, which reads as `apps/web/data/`; the file is at the repository root (`data/`; fetched as `/data/blurb-composer.json`, `apps/web/src/lib/loader.ts:64`). Say so plainly, there and at `ARCHITECTURE.md:173` if it repeats. Add `data/` (the shipped dictionary and blurb data) and `tools/` (dated research harnesses a contributor may ignore) to the structure block in `README.md:56-65`.
2. **Point to the control map.** One line in `ARCHITECTURE.md`, "Where to start": to find the code behind something on screen, read `docs/sessions/memo-n84-path-map_r1_2026-10-01.md` (dated 2026-10-01; it ages), or search `apps/web/src/lib/i18n.ts` for the words on screen and follow the key.
3. **The i18n key prefixes as an index.** A comment block at the top of `i18n.ts` listing each key prefix and the module it belongs to (for example `calib.` → `lib/voice/CalibrationWizard.svelte`, `loupe.` → `lib/score/Loupe.svelte`). Derive the list from the file, not from the memo; name the three legacy keys (`group.scoreMarkup`, `tab.markedScore`, `insights.fit.*`) and point to the comments that explain why they keep their names. One line in `ARCHITECTURE.md` saying the prefixes are the feature index.

House style throughout (`docs/house-style/SKILL.md`).

**Report:** `docs/sessions/report-code-newcomer-docs_r1_2026-10-01.md`.
