# Report: lane 66, Step 2 (the recorder panel follows the session)

2026-11-18, Code (cloud session). Branch `cloud-lane-66`. Files: `voice/engine/capture-file.ts` and `voice/engine/capture-file.test.ts`. English only, as the brief says; no string in `i18n.ts`.

## What changed

- `mountRecorderPanel` no longer returns when the panel exists. Every call sets `panelPicker`, reads `measure` from the address (`new URLSearchParams(location.search).get('measure')`, inside the function: `chart/stub-switch.ts` is not touched and `capture-file.test.ts:174-175` still pins its call), and then either rewrites the face and the card (`refreshPanel`) or builds the panel.
- The card gains two lines, `Last take:` and `Address:`, beside `Picker in use:`:
  - `Last take: no take yet`, or `Last take stamped: <picker>`: what the last held take's sidecar says (`rec.picker ?? 'shipped'`, the value `holdCapture` writes). `clearHeld` resets it.
  - `Address: measure=<value>`, or `Address: no measure in the address`. An empty `?measure=` reads `measure=`, not "no measure".
  Together they separate "the address lost its query" (the address line says none while the picker line says `path`) from "the picker ignored it" (the address line says `measure=shipped` while the take was stamped `path`).
- The words are three pure, exported functions: `panelPickerLine`, `panelLastTakeLine`, `panelAddressLine`; and `lastHeldPicker()` for the stamp.
- The default is `'path'` at the module variable (was `:198`), at the function's default parameter (was `:223`), and in the pin (`capture-file.test.ts`, was `:173`). The sidecar's fallback to `'shipped'` (`picker: rec.picker ?? 'shipped'`) stays: a record with no picker predates lane 64. A new test pins it.
- `capture-file.ts` still imports only `./analyze` and `./extract` (a new test pins that).

Comments made false by this: the comment above `panelPicker` (written new), and the doc comment of `mountRecorderPanel` ("once" now says what a second call does).

## Tests (only the changed file)

`capture-file.test.ts`: 20 passed (15 before, five new): the three lines' words; an empty measure is not none; the stamp on a held take, with one that has no picker stamped `shipped`, and cleared by `clearHeld`; the order inside `mountRecorderPanel` (picker, then the address, then the panel lookup, and an existing panel is rewritten); the sidecar fallback and the imports.

## Seen in a browser

The development server (`pnpm dev`, where `__ILYA_RECORDER__` is true), Chromium at 390 by 844, the card unfolded, three addresses. The card's text, read from the page: `?measure=open` gives "Picker in use: open / Last take: no take yet / Address: measure=open" and the tab "rec · open · 0"; no `measure` gives "Picker in use: path / Last take: no take yet / Address: no measure in the address" and "rec · path · 0"; `?measure=shipped` gives the shipped lines. I looked at two pictures (no measure; `measure=open`): the card shows the three lines legibly above the sung vowel field and Save, and the folded tab shows the picker. `report-code-lane66-pictures/step2-card-no-measure.png` and `step2-card-measure-open.png`.

NOT ESTABLISHED: the case the step exists for, a panel already on the page that a second session then rewrites. A page load builds the panel once, so these pictures show the first call only. The second call's rewrite is pinned from the source's order and by `refreshPanel` being the function every other event already uses, not seen in a browser. The desk's next phone walk can show it: raise the wizard twice, with the address changed between, and read the card.

## Not run

`vercel.json` is Step 6.
