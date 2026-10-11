# Brief for Design: Insights, laid out for the singer (r2, 2026-10-10)

Written by the desk (Opus) 2026-10-10, saved 23:17 (file timestamp; an earlier header said "about 23:25", a time the desk typed without reading a clock). For Claude Design, with the repository `DannMitton/Ilya` connected on branch `Shane`. **r2 replaces r1** (`brief-design-insights-for-the-singer_r1_2026-10-09.md`). Round 1 was held by Dann on 2026-10-09 at 16:19 because it rearranged the page's existing parts instead of serving the singer. This round starts from the purpose Dann ratified on 2026-10-10 at 23:17. The record is `docs/memory/OPEN.md`, "INSIGHTS, REVIEWED AS A PAGE FOR THE SINGER".

## The singer, first

A classical singer has given Ilya a song in a key, a calibration of their voice (each vowel's first resonance, sampled in fry), their range, and their passaggi. They open Insights **to learn, not to decide.** Dann, 2026-10-10 21:45: Insights *"should equip the user with enough information about the song itself and how their specific voice interacts with the song in the key given, to eventually determine 1) whether the song suits them as-is; 2) if not, whether its technical challenges are navigable; 3) whether a [transposition] will be more suitable for their particular voice; or 4) that the song itself poses challenges outside the skill and/or comfort of the user, so they can move on to other, more suitable repertoire."* (His word in 3 was "transcription"; he confirmed transposition at 21:48.)

The reader may be a student, a teacher, a coach, a professional, or a hobbyist. Dann prefers that a teacher filters Ilya's advice, and the page says so (see "The purpose", point 2).

**The test for every element:** say which of the four outcomes it helps the singer reach. An element that helps none is frame, or it goes.

## The purpose, ratified by Dann 2026-10-10 23:17

1. **Insights informs.** The singer decides later.
2. **The teacher.** A line saying the singer reviews the approach with their teacher sits on every comment that suggests an approach, and on no comment that only describes. It also appears once in the page's opening frame and once with the printed endnotes. **Wording RULED by Dann 2026-10-11 00:19** (`docs/memory/OPEN.md`, THE TEACHER LINE): on a comment, "Check this approach with your teacher."; in the opening frame, "Ilya does not invent advice. It notices conditions in this piece and in your voice that the voice pedagogy literature addresses, and names each source so you can read it. Check any approach it suggests with your teacher."; with the endnotes, "Review these sources with your teacher, who can weigh in on which of them truly apply to your voice." The French is ruled too; take it from `OPEN.md`, not from memory.
3. **Calm authority, no verdict.** The strongest sentence Ilya writes is of this shape: *"In this key, [checkable reason], [checkable reason]. Together, these make the song unlikely to sit comfortably in your voice as written."* Each reason names bars, notes, or the singer's own references. The sentence is always followed by a way forward: a key that fits better, with "Try this key", or, where no key fits better, a plain statement of that and the teacher.
   **Its source, ruled by Dann 2026-08-07:** *"a recommendation is admissible when the singer can see every term that produced it."* His example: "Down a minor third, because your E4 ceiling and these two F4s" passes, because all four terms are on the page; a bare difficulty grade fails. Draw every reason of the "unlikely" sentence, and every "Try this key", with its terms visible on the same page (project doc `claude/repertoire-information-what-teachers-want_2026-08-07.md`, section 0, read by the desk 2026-10-11 00:06).
4. **Order of findings.** Range first. Then **what another key would change** (range, and where a note's pitch meets a vowel's resonance). Then **what practice changes** (language: [ɨ], the harder palatalized consonants). A finding that fits neither group goes after both.
5. **When nothing is flagged.** Insights confirms the fit with its reasons, in the same groups. Where another key sits better by the same measures, it says so: *"This key suits your voice. A tone lower would keep more of the line below your passaggio."* with "Try this key". No "optimal" or "acceptable" labels.
6. **The measures.** Time per vowel is drawn **against where each vowel turns in this singer's voice** (Bozeman: about an octave below the vowel's first resonance). The cycle dose is drawn **beside the singer's own tessitura**, never as a bare number (Titze 2008; no norms exist, Gaskill et al. 2013). Every comment follows one chain: a source states a condition, Ilya measures it, a gate fires, the comment shows its citation.
7. **Neutrality.** Ilya endorses neither taking on a challenge nor building on strengths.

## Dann's findings on round 1 (2026-10-09 16:13, his grade B minus); do not repeat them

- The verdict was set in body type.
- Squircles never overlapped a page break.
- The compass was too wide.
- A grey clef sat at the foot.
- Hairline leaders appeared.

Round 1's pictures are on the canvas "Insights for the singer" (`https://claude.ai/artifact/TUQ7EeUZLBTRuuBBNY6PrQ`), kept as a record. Treat them as what not to repeat, not as a starting point.

## Still ruled, from round 1; design within these

- **The comments' heading:** "Where this piece meets your voice" / « Là où cette pièce rencontre votre voix » (Dann, 2026-10-09 13:03 and 13:10).
- **"More to explore, and why" prints as endnotes** (Dann, 2026-10-09 13:03). On screen the expanding control stays.
- **The compass floats top right with no squircle** (Dann, 2026-10-09 01:38 and 13:17), narrower than round 1 drew it.
- **Squircles may run across a page break** (Dann, 2026-10-09 12:59). Show it.
- **No control is part of the printed page** (`docs/memory/CONTRACT.md` §6), except that "Try this key" is a control on screen; in print it becomes the key named in words.
- **Rose is Insights' colour** (`apps/web/src/lib/insights/InsightsPane.svelte:10-11`: dusty rose, `--rose-ink`, `--rose`; the earlier citation of `PRODUCT.md` was wrong, corrected by the desk 2026-10-11). Both languages, start to finish; French runs about 15 percent longer.

## The page as built, for reference only

Read `apps/web/src/lib/insights/InsightsPane.svelte`, `Tessituragram.svelte`, `CompassStave.svelte`, `FitTable.svelte`, and `cycle-dose.ts`. "Try this key" exists for a range finding (`apps/web/src/lib/insights/insights.ts:132-136`). **Not built, drawn here as proposals:** time per vowel against each vowel's turning pitch; the transposition search when nothing is flagged; the teacher line; the "unlikely" sentence. Draw them with plausible values and mark each value `ILLUSTRATIVE`.

**French.** Take every existing French string from `apps/web/src/lib/i18n.ts`, not from memory. For a new string, set the English and mark the French `[FR: desk draft owed]`. Do not write new French yourself.

## What we ask for

1. **Three cases, each as the full printed set in English:**
   - **Quiet:** *Without Sun*, no. 1, in Dann's voice (bass): fits, nothing flagged, one comment.
   - **Better key:** the same song with another key fitting better (illustrative).
   - **Unlikely:** a song whose line lies above the singer's passaggio for long stretches (Kabalevsky, Shakespeare sonnets, T01, draws four comments for Dann's voice: `tools/n168-frequency-run/out/comments-oracle.md`), with the "unlikely" sentence and its way forward.
2. One French page for the longest strings.
3. Page 1 at phone width (390 px).
4. For each element: which outcome it serves, where it went, and what you cut or merged and why.

Say what you could not establish. NOT ESTABLISHED beats a complete invented answer.
