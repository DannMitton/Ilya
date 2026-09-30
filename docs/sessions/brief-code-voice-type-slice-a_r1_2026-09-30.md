# Brief for Code: the singer declares a voice type (slice A)

Written by the desk 2026-09-30 about 00:35. Draft r1. The design and every ruling it rests on are in `docs/sessions/draft-voice-labels_r2_2026-09-30.md`; read it first. `docs/memory/OPEN.md` §N.168 carries the rulings with their times.

## What the singer gets

In the voice's **Voice characteristics** step, a new first group, **Voice type**. The singer picks one of nine broad types. Under it, optionally, **More specific** offers the finer labels for that type, plus **Other**, where the singer types their own. Nothing is required, and every choice saves on change, as the Range fields do. The label the singer chose then prints on their Insights after the voice's name: "Insights for Dann · basso cantante · calibrated 2026-09-12". "Not sure" prints nothing.

Who offered what: the two tiers, the dignity principle, and the label after the name are **Dann's**; Tier 1 as Boldrey's p. 11 list, "Not sure", the routing, and the placement in Voice characteristics are **the desk's**, ruled in by Dann 2026-09-30 00:19 and 00:27.

## What the tree has now (read by the desk at `47a6f8f`; re-check before you edit)

- `voice/profileStore.ts:81-88`: `voiceType?: VoiceType`, optional, "a routing key to Bozeman value-sets". `engine/types.ts:35`: `VoiceType = string`. **Nothing writes it:** no route or component passes a value, and `CalibrationWizard.svelte:207` defaults the prop to `undefined`. No stored voice has one, so no migration is needed.
- `engine/plausibility.ts:131-139`, `bucketFor()`: maps soprano; mezzo or tenor; baritone; bass; everything else to `union`.
- `CalibrationWizard.svelte:1512` onward: the Voice characteristics phase (range `:1526`, tessitura `:1546`, then passaggi).
- `insights/InsightsPane.svelte:242-246`: the identity line from `insights.identity` / `insights.identityUncalibrated` (`i18n.ts:1471-1472`), used in the title header (`:599`) and the running head (`:492`).
- **Ceilings** (`scripts/ratchets.json`): `CalibrationWizard.svelte` is AT its ceiling, 2124; `InsightsPane.svelte` is 1349 against 1350. New files may not pass 1000 lines.

## Step 1. Report before building

With `path:line`: how the wizard gets `activeVoice` and saves a field (the characteristics path, `setCharacteristic`, `:416-422`); how `InsightsPane` receives `voiceName` from `+page.svelte`; and how you will fit this under both ceilings. Read old code with `git show` or `git archive`; do not stash, check out, restore, or use a worktree.

## Step 2. Build

1. **A data module**, new, for example `lib/voice/voiceTypes.ts`: the nine Tier 1 ids (`soprano`, `mezzo-soprano`, `contralto`, `countertenor`, `tenor`, `baritone`, `bass-baritone`, `bass`, `not-sure`), the 29 Tier 2 ids each with its Tier 1 parent, and each Tier 1 id's plausibility bucket. Display strings go in `i18n.ts` (exempt from the ratchet), never in the module.
2. **Storage.** Keep `voiceType` as the Tier 1 id; add two optional fields beside it, the Tier 2 id and the singer's own text for Other. Optional and additive, the same discipline as `characteristics`; `validVoice()` does not require them.
3. **Routing.** `bucketFor()` must map: soprano to `soprano`; mezzo-soprano, contralto, tenor to `tenor-mezzo`; baritone to `baritone`; bass-baritone, bass to `bass`; countertenor and not-sure to `union`. The wizard must route from the stored voice's `voiceType`, not from the prop nobody passes. Keep the existing strings `bucketFor` accepts.
4. **The intake.** A new component (the wizard is at its ceiling), rendered first in Voice characteristics, before Range. Tier 1 as one radio group with "Not sure" and a way back to no answer, as `InsightsIntake.svelte` does (its header comment explains why). Tier 2 appears only after a Tier 1 choice, lists only that type's labels, and ends with Other and a text field. Changing Tier 1 clears a Tier 2 choice that no longer belongs to it; it keeps Other's text.
5. **The print.** The identity line gains the label: `insights.identity` becomes "Insights for {voice} · {voiceType} · calibrated {date}", and the uncalibrated line likewise. `{voiceType}` is Other's text if set, else the Tier 2 label, else the Tier 1 label; "Not sure" or nothing leaves the line exactly as it is today, with no empty separator. **Lower case mid-line in both languages**, keeping the capitals a name carries (Baryton Martin, Falcon, Heldentenor, Heldenbariton); Other's text prints exactly as typed.
6. **Strings.** English and French for the heading, hint, "More specific (optional)", "Other (type your own)", the nine Tier 1 labels, and the identity lines are **ratified** (table in the draft, §"French for slice A"). The 29 Tier 2 labels are **ratified** too (Dann 2026-09-30 00:32): English in the draft's shortlist, French in its §"Tier 2 French". Use them verbatim.

## Step 3. Prove it

- Unit tests: `bucketFor` for every Tier 1 id; the identity-line composition for Other, Tier 2, Tier 1, not-sure, and nothing, in both languages; a voice saved before this change still loads.
- In the browser, English and French: pick Bass then Basso cantante; see it on the Insights header and running head; switch to Tenor and see the Tier 2 choice cleared; choose Not sure and see the line return to today's; type an Other label with a capital and see it print as typed.
- All eight ship-script gates at baseline or better, with counts. `check` 0 errors; ratchets OK. If a ceiling must rise, do not raise it: say which, by how much, and why, and the desk brings it to Dann.
- Screenshots of the intake group and of the Insights header, desk and phone, English and French.

## Not in this slice

The courtesy check (slice B), the Tier 2 labels' aliases, any change to Markup, and any new analysis. `analyze.ts` takes `_voiceType` and ignores it; leave it.

## The report

`docs/sessions/report-code-voice-type-slice-a_r1_<date>.md`: step 1's reading, what changed with `path:line`, the gate numbers, the screenshots, and **What I could not establish**. NOT ESTABLISHED beats a complete invented answer.
