# Report: consistency batch 1, step 4 (row 169's convention in `i18n.ts` and LEARN), r1, 2026-11-02

Branch `cloud-lane-24`, on top of the French drafts commit. Rule applied: `docs/house-style/SKILL.md`, "Interface text that singers read", with Fable's amendment 16 (DESK DEFAULT: a checkbox, toggle, or field is bold by its exact label, no chip; the chip class is `guide-key`, built once in `app.css`).

## What changed

- `apps/web/src/app.css`: one new class, `.guide-key`, the button chip: bold, 1px outline in the text colour, pill ends (`border-radius: 999px`, as `MetadataFields.svelte` `.btn-reset`), no shadow, no hover, default cursor. The comment says how a button, a checkbox, and a place are each named. `app.css` has no ratchet ceiling.
- `apps/web/src/lib/components/Reading/LearnContent.svelte` (4096 lines, unchanged; ceiling 4099): the Spot checkbox labels, which LEARN named in quotation marks, are bold by their exact label with no chip: `:987` and `:996` (French: « Réduction ponctuelle », « Reconstitution ponctuelle »), `:3028` and `:3037` (English: Spot reduction, Spot reconstitution). In French the « » quotation marks around the label are replaced by bold. The words are identical.

## Gates

| gate | result |
|---|---|
| web check | `svelte-check found 0 errors and 12 warnings in 5 files` |
| web test | `Tests  3789 passed \| 1 skipped (3790)` |
| `pnpm ratchets` | `ratchets: OK.` |

## Decisions, and what I did not do

1. **`.guide-key` has no user yet.** LEARN names no button anywhere: its "click" and "toggle" instructions all point at checkboxes and switches. The class waits for the GUIDE (row 171), which names buttons (Transcribe, Calibrate, Reset). It is in `app.css` so Guide and LEARN will share one chip, as the brief asks. If Dann would rather not carry unused CSS until the Guide uses it, the rule is one block at the end of `app.css`.
2. **French markup, not wording.** Replacing « … » with bold in `:987` and `:996` changes no word. I treated it as the chip markup the brief allows in the main line; if Dann reads it as a French change beyond the chip, revert those two lines. Not listed as a draft because no French word changed.
3. **`i18n.ts` strings are plain text.** A value is drawn as a text node, and the only markup channel is `*…*` for italics (`italics.ts`). A chip or bold cannot reach a singer through `i18n.ts`, so for those strings the convention reduces to what steps 1 to 3 did: places in capitals (`paper.empty.mobile` names the DRAWER; `console.selectWord` names no control). I found no value that names a button by its label.
4. **Not done: the Notation toggles.** LEARN says "the reconstitution toggle", "toggle global reconstitution on" (`:3031`, `:3035`, `:3037`), and "the geminate toggle" (`:4012`). The exact labels are "Default reduction | Reconstitution" and "Separate geminates [tt] | Length markers [tː]" (`cosmetic.reconstitution.*`, `cosmetic.geminates.*`). Naming them by exact label rewrites the sentence ("global reconstitution" becomes **Reconstitution**), and the French sentence would change with it, which is a draft. TASTE for Dann: (a) leave the descriptive wording, (b) rewrite to the exact labels. I did not guess.
5. **Messages Ilya shows.** I did not find a message quoted in LEARN to put in quotation marks; the Guide may (row 171).
6. **Terms defined on first use** are italic in LEARN already where I looked (`<em>`); I did not re-audit every defined term, and I add no claim about it. NOT ESTABLISHED: whether each first use in LEARN is italic.

## NOT ESTABLISHED

- How the chip looks on screen: I have not rendered it (it is not used).
- Whether bold for the Spot labels reads distinct from the bold run-in lead-ins LEARN uses at paragraph starts (`<strong>Voicing assimilation.</strong>`). No render was taken.
