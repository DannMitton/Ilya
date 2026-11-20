# Code brief, lane 75: the pane stops repeating the picker, and Begin stays in reach

r2, 2026-11-19, by the desk (Opus 5). Replaces r1 (md5 `267a5658`), which Fable reviewed as SEND WITH AMENDMENTS with four blockers (`review-fable-lane75-brief_r1_2026-11-19.md`, md5 `6c711245`). Every blocker and every amendment of that review is applied here, and the desk read each cited line itself before writing it. Branch: `cloud-lane-75`, cut from `Shane` at the commit this brief ships in. It serves QUEUE row 167 and closes what Dann's walk of lanes 71 and 74 ruled.

## 1. What these lines are for

A singer who calls herself a contralto is told two things, and Ilya owes her both exactly once. The first is the concession: the field has published no resonance values for her type, and she may either let Ilya start from the mezzo-soprano staff or record her own vowels. That belongs at the moment she chooses the name, which is the picker's note, ratified by Dann 2026-11-19 18:36 (`OPEN.md`, "ROW 167: THE CONCESSION IS MADE AT THE MOMENT OF CHOICE"). The second is the state of her profile: which staff Ilya is using until she records. That is the VOICE pane's sentence at rest.

Lane 74 made the pane say both. Dann walked it on 2026-11-19 at 22:42 and ruled, transcribed as written: *"Yes it reads a s asstutter, and yes please cut the pane sentence, not the note."* The two open with the same clause word for word and sit on one phone screen, which the desk confirmed in a browser on `c8ced58f`. So the reason lives in the note, on MELODY, and on INSIGHTS.

**What the pane reads after the cut.** With nothing sampled it names the staff, as the five published types already do. With one to four stable core vowels it names no staff and no reason: it prints the count sentence alone, which is lane 71's behaviour restored. That second case is a DESK DEFAULT, Dann's to overrule, taken because the same two readings would otherwise stutter in that state too, and because MELODY and INSIGHTS keep the borrowing line for zero to four stable core vowels (`analysis/placeholder-line.ts:108-118`).

The second line this lane serves is the wizard's Begin. A singer who has just chosen contralto reads the note and then needs the next action. With the note on the screen, Begin needs a window 765 px tall in English and 828 in French (`review-fable-lane74-as-built_r1_2026-11-19.md`, section 4 step 4), and an iPhone in Safari shows less. She has to hunt for the button that starts the thing she came to do.

## 2. Item 1: the VOICE pane's borrowing sentence comes out

All of this is in `apps/web/src/lib/components/Drawer/voice-pane.ts`, read by the desk at `ce9abfc9`.

- `borrowingSentence` (`:39-45`) and `borrowingFor` (`:47-49`) go, with their comments.
- In `paneSentence`'s `below-core` branch (`:75-79`), the call at `:77` and the prefix go: every type reads `belowCoreText('calib.pane.belowCore', i.core, language)` alone.
- In its `typed-generic` branch (`:86-92`), the call at `:88`, the test at `:89`, and the comment at `:87` go: every Tier 1 type with a placeholder profile reads `calib.pane.typedGeneric` filled with `borrowedStaffLabel` at `:91`, which is what the five published types read today.
- The file's header runs `:1-16`. The paragraph at `:12-15`, which begins "A CONTRALTO, COUNTERTENOR, OR BASS-BARITONE WITH FEWER THAN FIVE STABLE CORE VOWELS", describes what is being cut and comes out with it.
- `isBorrowingType` is then the one import left unused in this file (desk check at `ce9abfc9`). Remove it, or gate 3 moves off its baseline. No other module imports `borrowingSentence` or `borrowingFor`.

**What does not change.** `analysis/placeholder-line.ts:108-118` and its callers on MELODY (`markup/MarkupPane.svelte:996`) and INSIGHTS (`insights/InsightsPane.svelte:503`) keep the borrowing line exactly as built. Both pickers keep the note. `calib.pane.typedGeneric`, `calib.pane.belowCore`, `calib.pane.notSure`, `calib.pane.none`, and `placeholder.borrowing` keep their text, and no string is added, removed, or retranslated by this lane.

### Tests. Five files, and the list is complete as of `ce9abfc9`

**`src/lib/components/Drawer/voice-pane.test.ts`**

- `:28-30`, three rows of the `cases` table (a contralto, a countertenor, a bass-baritone), each pinning the borrowing sentence in both languages. Each becomes the `calib.pane.typedGeneric` sentence filled with its staff: "Ilya is using generic values for a mezzo-soprano voice until you record your own." and « Ilya utilise des valeurs par défaut pour une voix type de mezzo-soprano jusqu'à ce que vous captiez les vôtres. », and the same shape for "mezzo and tenor" and "bass". Keep the rows; do not delete them.
- `:92-108`, the `BORROWING` record and the `lead()` prefix inside "prints the ratified sentence with the count, the list, and what is left". Both go, so every type's expectation is `EN(n, …)` and `FR(n, …)` alone. Keep all seven types in the loop.
- `:93`, the comment above that record. It describes the old order and comes out with it.
- `:177`, the `describe` title "lane 74, item 1: the pane gives its reason, for all eight declared types…". Retitle it to what the block now proves.
- `:184`, "nothing sampled: the three read the borrowing line, the five keep 'generic values', exactly": the three now read the same sentence as the five. Keep it exact, keep both languages, keep the `EIGHT` list; the `BORROW_EN` and `BORROW_FR` branch goes, and the assertion that no sentence contains "The field has not yet published" now runs for all eight.
- `:200`, "three stable core vowels": every one of the eight reads `BELOW3_EN` and `BELOW3_FR` alone. Keep the no-double-space and no-newline assertions.
- `:220` and `:228`: both already assert that no borrowing line appears. Widen them to all eight Tier 1 ids plus `not-sure`, `undefined`, and `castrato`, so the pane can never grow one again.
- `:236`, "the pane takes the same words as the ratified line on the pages": this pins what is being cut. It goes, and this takes its place. **The words of `placeholder.borrowing` means, exactly:** the template `t('placeholder.borrowing', language)` split on `{type}` and `{borrowed}`, each resulting piece trimmed, each piece of three characters or more. The new test asserts that for a contralto, a countertenor, and a bass-baritone, with nothing sampled and with three stable core vowels, in both languages, `paneSentence` contains none of those pieces.
- `:11` and `:27`, the two comments describing the borrowing behaviour. Repair both.

**`src/lib/stand-in-borrowing.test.ts`.** It does read this pane: `:19` imports `paneSentence`, `:46` wraps it as `pane`, and `:60` puts it in the table as `'VOICE pane (4.6)'`. Its `:88` and `:90` assert that the pane contains the singer's own type name and equals the borrowing line, and both fail after the cut. Return that key to its lane 71 treatment: the pane takes the fills' treatment with the other four keys at `:85-86`, which assert the sentence does NOT contain the singer's own type name, and the two assertions at `:88` and `:90` go. The comment above them describes lane 74 and comes out. Everything else in the file is about MELODY, INSIGHTS, and the sheet, and is not touched.

**`e2e/voice-pane.test.ts:95`** pins the borrowing sentence for a contralto in a real browser. It becomes "Ilya is using generic values for a mezzo-soprano voice until you record your own." The comment at `:93` describes lane 74 and is repaired. Playwright is not one of the eight gates, so nothing on the Mac catches this: run it yourself and say so in the report.

**`e2e/insights-no-score.test.ts:65-74`** renders INSIGHTS for a contralto with no score and asserts the borrowing line's exact text. It must keep passing UNCHANGED. If it fails, the cut has reached the pages, which it must not: stop and report.

**`e2e-phone/`**: the desk's grep of `e2e` and `e2e-phone` for "contralto", "bass-baritone", and "countertenor" at `ce9abfc9` returned those two files and nothing else.

## 3. Item 2: the empty live region costs every singer a flex gap

Fable measured 4.8 px at 390 px wide in the wizard, and at 390 by 700 it is what makes the body scroll at all. Both pickers keep an empty `<div class="vt-note" aria-live="polite">` in the page, and both fieldsets are flex columns with `gap: 0.3rem`: `voice/VoiceTypeFirst.svelte:40-42` and `voice/VoiceTypeIntake.svelte:82-84`, read by the desk at `ce9abfc9`. Add to the `<style>` block of each:

```css
	.vt-note:empty {
		margin-top: -0.3rem;
	}
```

The region stays in the page, so the announcement pattern is untouched. Verify by reading Begin's bottom edge for a tenor at 390 by 844 in English with no note: 626.6 px means it worked.

## 4. Item 3: Begin stays in reach on a short phone

**Done when,** all four:

1. On the wizard's welcome screen at 390 by 667, with contralto chosen, in English and in French, the whole of Begin is on screen without the singer scrolling.
2. The nine voice-type choices are not covered by Begin at any height you test, and neither is the note.
3. The same holds at 375 by 667 and 360 by 640.
4. A kept test asserts 1 and 2, so the guard cannot lapse again unnoticed.

The guard this restores is already written at `voice/VoiceTypeFirst.svelte:46-47`, which says the two-column grid exists so the nine choices do not push Begin off a phone screen. It stopped holding before lane 74: Begin needed 683 px in English and 746 in French even then.

**What you need to know before you choose a mechanism.**

- Begin is `voice/CalibrationWizard.svelte:811`, class `wizard-primary`, inside the welcome phase's `.wizard-phase`.
- The box that scrolls is `.takeover-body` (`components/Drawer/Drawer.svelte:1474-1479`, `overflow-y: auto`), not `.wizard-body`.
- `.wizard-primary` is also Start, three Continues, and Finish across the wizard's other phases. **Scope your change to the welcome screen.** A pinned Finish would float over the summary's sheet.
- By the lane 74 review's figures Begin is 160 px past the fold in French and 97 px in English at 667, and the screen's own gaps total 56 px, so trimming spacing alone does not reach it. Taking Begin out of the flow, or placing it ahead of the picker, does.
- **Ratchets bind here.** `CalibrationWizard.svelte` is 1,124 lines against a ceiling of 1,126 (`scripts/ratchets.json:14`), so you have two lines. `Drawer.svelte` is 1,986 of 1,990 and `routes/+page.svelte` is 5,532 of 5,534. If the change does not fit, put it in a new file under `apps/web/src/lib/voice/` rather than raising a ceiling.

The mechanism is otherwise yours. Read every phase of the wizard before you change anything about that button, and name in the report each phase you rendered and what its buttons are.

## 5. Item 4: one kept browser test

**The search CONTRACT section 4 requires, run by the desk at `ce9abfc9`:** `grep -rln` over `e2e` and `e2e-phone` for the three borrowing types returns `e2e/insights-no-score.test.ts` and `e2e/voice-pane.test.ts` only. So INSIGHTS with NO score is already covered for a contralto (`insights-no-score.test.ts:65-74`), and the VOICE pane is covered (`voice-pane.test.ts:95`). **What no kept test renders is either page WITH a score for a borrowing type**; `stand-in-borrowing.test.ts:172-179` reads the two panes' source text with a regular expression instead.

So: one Playwright case, kept in the tree, that renders a contralto with a score on MELODY and on INSIGHTS, in English and in French, and asserts the borrowing line is on both pages.

## 6. This brief changes no computation

No number Ilya computes moves, so the rule of `CONTRACT.md` section 4 on naming every site that computes the same number does not apply here. Say so in your report if you find otherwise, and stop.

## 7. Gates

All eight at baseline, from `~/Downloads/ilya-ship.sh:90-92`, `:182-184`, `:188-190`, read by the desk 2026-11-19 23:0x:

| gate | baseline |
| --- | --- |
| 1 phonology | `462 passed (462)` |
| 2 dictionary | `248 passed (248)` |
| 3 web-check | `found 0 errors and 12 warnings in 5 files` |
| 4 web-test | `6743 passed | 1 skipped (6744)` with numpy and scipy, `6739 passed | 5 skipped (6744)` without |
| 5 score-parser | `904 passed | 5 skipped (909)` |
| 6 blurb | `178 passed (178)` |
| 7 integration | `159 passed (159)` |
| 8 ratchets | `ratchets: OK.` |

Gate 4 moves by this lane's own arithmetic: say in the report how many tests you added and removed and what the new figure is.

Two phone tests are known to fail on an untouched tree and are not yours: `e2e-phone/insights-links.test.ts:32` and `e2e-phone/voice-stations.test.ts:62`, both sub-pixel. `e2e/time-signature-card.test.ts` hangs under load and passes on an idle machine.

## 8. What you could not establish

**NOT ESTABLISHED beats a complete invented answer.**

Report, do not guess: anything the done-when of item 3 cannot be met without changing a string or a ratified sentence, which this brief forbids; any phase of the wizard your change harms; whether a screen reader announces the picker's note, which nobody has run; and any assertion you find pinning the pane's borrowing sentence outside the five files named in section 2.

## 9. One commit per item, one report per item

Four commits, four reports in `docs/sessions/`, named `report-code-lane75-item<n>_r1_2026-11-19.md`. Write nothing under `docs/memory/`.
