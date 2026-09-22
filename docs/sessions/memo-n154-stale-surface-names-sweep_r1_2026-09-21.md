# MEMO. N.154's English half, the sweep of the string dictionary

**Run 2026-09-21 by a read-only Sonnet agent, spawned by the desk on Dann's instruction
(CONTRACT §2, ruled 2026-09-16). Brief: `brief-n154-stale-surface-names-sweep_r1_2026-09-21.md`.**

**COST: 116,375 tokens against the desk's quote of 30k to 50k.** The grep-first method
held; the desk's arithmetic on a 1542-line, 614-entry file was wrong. **Quote sweeps of
`i18n.ts` at 120k.** This is the third quote overrun on 2026-09-21 and the second of the
desk's.

**Scope: `apps/web/src/lib/i18n.ts` only.** The Guide and Learn prose was named out of
scope in the brief, and Dann ratified that the same evening: *"I agree. I suspect guide
and Learn will undergo radical rewrites, so this is an appropriate plan."*

**Counts: STALE 5, FINE 12, BORDERLINE 4, from 21 value-level hits.**

---

## THE HEADLINE, and it is a negative result worth more than a list

**The 5 STALE rows are 3 keys, and they are the same three the desk had already found by
hand.** No stale string exists in the dictionary that was not already known. **The damage
from the N.132 rename is bounded to three keys.**

## STALE. Three keys, five rows

| key | line | slot | the string | what it names, and what that is called now |
|---|---|---|---|---|
| `a11y.paper` | 145 | en | `Transcription` | The tab, now `Text` (`i18n.ts:105`). |
| `a11y.paper` | 145 | fr | `Transcription` | Same, now « Texte ». |
| `upload.banner.reader` | 902 | en | *"…type them in Transcription."* | Sends the singer to a tab now called `Text`. |
| `upload.banner.reader` | 902 | fr | *"…saisissez-les dans Transcription."* | Same, now « Texte ». |
| `profile.scoreRegionAria` | 1181 | fr | `Partition annotée du répertoire` | Carries the name superseded by the file's own `:112-113` note; the tab is « Annotation ». |

**`a11y.paper` was independently verified by Code the same evening** at `Paper.svelte:63`:
it names the page area the `Text` tab shows, and only that tab has one. **The sweeping
agent flagged its own classification of this row as inferred from the brief rather than
verified, which was honest and is now discharged by Code's read.**

## BORDERLINE. Four rows, two keys, and the desk settled them after the run

`calib.welcome.lede` (`:1046`) and `calib.welcome.fryAnswer` (`:1048`), both languages.
They say *"Fit will measure your voice"* and *"Fit reads its resonances"*. The agent
refused to decide and said so, correctly, naming the calibration component as out of its
scope.

**Read by the desk 2026-09-21, after the run:**

- **`tab.fit` is read by nothing in source.** A grep across `apps` and `packages` returns
  hits only in `apps/web/.svelte-kit/output/server/chunks/_page.js`, which is build
  output. **It is a dead key.**
- **There is no Fit destination.** `destinations.ts:47` defines
  `TabId = 'transcription' | 'learn' | 'guide' | 'shane' | 'insights'`, and `:38` gives
  `StudioDocument` three members. **A singer cannot navigate to Fit.**
- **The calibration wizard exists and renders both strings**, at
  `CalibrationWizard.svelte:1257` and `:1265`.

**DESK DEFAULT, and Dann can wave it off: leave both strings as they are.** His ruling of
2026-07-13, that Fit is the tool's name and is invariant in French, is restated as current
at `i18n.ts:115`, and nothing amending it has been found. A string naming a TOOL is not
false because the tool has no tab of its own.

**A CORRECTION TO THE RECORD.** `SCHEDULE.md` week 5's N.154 note, written by the desk
2026-09-19, says these two strings were written *"for a surface that no longer exists"*.
**The surface they sit in exists.** What no longer exists is a Fit tab. The note overstated
it and the overstatement is the desk's, not Dann's.

## FINE. Twelve rows, compressed

Full rows are in the agent's return. The reasons collapse to three, and no row needs an
action:

- **"fit" as a verb or an adjective, never a place:** `input.transcribe` (`:175`),
  `calib.characteristics.lede` (`:1133`), `profile.lede` (`:1164`),
  `profile.scoreRegionAria` en (`:1181`), `insights.fit.heading` (`:1458`),
  `insights.verdict.fit` (`:1484`), `insights.verdict.outsideTessitura` (`:1486`),
  `insights.verdict.rangeOnly` (`:1487`).
- **`Fit` as the tool's ruled, invariant name:** `tab.fit` (`:108`), both slots.
- **Unrelated to any renamed surface:** `calib.characteristics.passaggioHint` (`:1144`),
  whose « non marquée » describes an unfilled field.

**Carried out of this sweep to another item, not fixed here:** `input.transcribe` (`:175`)
reads "Transcribe and fit" in the French slot as well as the English. **That is an N.131
parity member**, not an N.154 stale name.

## NO HITS AT ALL

**No value-level hit for `Score markup`, `Marked score`, `Melody`, or `Mélodie`.** Every
occurrence of those in the file is in a code comment. **So the never-built `Melody` name
promises nothing to a singer**, which is the question dependency 2 left open.

## NOT ESTABLISHED

- **Whether any stale surface name sits in the prose files** outside `i18n.ts`, above all
  `LearnContent.svelte`. Out of scope by the brief and by Dann's ratification; it stands
  as his `INBOX.md` note of 2026-09-21.
- **Whether pulling N.154's English half forward is the right trade** against
  `SCHEDULE.md` week 3. That is Dann's, and the agent said so rather than guessing.
- **Whether `tab.fit`, being dead, should be deleted.** N.154's own record puts the 35
  `fit.*` key names out of scope as cosmetic, and this is the same category.
