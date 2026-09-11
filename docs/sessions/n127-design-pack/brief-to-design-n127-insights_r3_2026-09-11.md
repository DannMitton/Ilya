# Brief to Design: N.127, Insights

**r3, 2026-09-11. Status: for Dann's strikes, then to Design. Supersedes r2.**
Numbered N.127 and named **Insights** by Dann 2026-09-11. French name: not
yet coined; the whole strings table comes to Dann before anything ships.

## What it is

Ilya's third document, beside Transcription and Score markup, joining them
as the third member of the desk selector's boxed set (`DeskHead.svelte:43`).
A read-only, printable prose-and-graphics page consolidating what Ilya
knows at the intersection of one voice and one piece: insights,
observations, range limits, and evidence-based advice. Dann's purpose
ruling, 2026-09-11: Insights is most useful when researching repertoire; it
never replaces the literal insights of a skilled teacher with an informed
ear; it offers evidence-based truths specific to this voice meeting this
piece. "This is what Ilya is for."

Insights is the confluence document: the only page that reads everything
the singer has given Ilya (text, melody, formant data, typed range and
passaggi, metadata, transposition, overrides).

## The law of appearance

Each document appears the instant its governing input exists: text begets
Transcription, melody begets Score markup, voice information begets
Insights. Thin on a typed range alone, deep on a full calibration, growing
as the singer gives more; when even the typed range is absent, the page
runs broad and says so, inheriting the broad-analysis pattern
(`VoiceProfilePane.svelte:93-96`).

## Rulings on its face, all Dann's, 2026-09-11 unless dated otherwise

1. **Read-only.** Never an input surface. Printed whitespace for a pen (the
   lesson-artifact foot) is the one permitted blank, and it is not a
   control.
2. **Computed or sourced.** Every line is computed from the singer's inputs
   or is a sourced advice string a predicate fired. Nothing hand-written.
3. **Measurement versus verdict** (2026-08-07) and **Fit forecasts, never
   declares** (`PRODUCT.md`) govern every sentence.
4. **The squircle.** The page's content sits inside a squircle inheriting
   the watch band's outline lineage
   (`VoiceProfilePane.svelte:1532-1533 (.watch-band)`), so the document is
   recognizable at a glance and easy to pass over.
5. **Governing colour: dusty rose**, the existing token `--dusty-rose:
   #A67B7B` (`app.css:38`), inks derived through the luminance-keyed system
   (S0 ruling). Colour identifies the document and never carries
   information alone (N.62's ratified posture). Desk observation, Dann may
   wave off: rose also keys Learn's surround (`app.css:131`).
6. **Page one is one page, fixed; a second page exists only when the piece
   earns it**, and fired advice prints there in full, because the paper
   travels to the practice room where the screen is not.
7. **Citations are footnotes.** Superscript in the body, citation in the
   footer; each footnote prints on the page that cites it. Attribution
   lives in Guide and the footer, both.
8. **Ordering serves the choosing moment.** Page one opens with the
   at-a-glance fit; study detail follows. Flags index into Score markup by
   measure.

## The curation criteria. A living list, refined against real repertoire

1. A predicate fired: every insight rests on a measured condition of this
   piece crossed with this voice.
2. Personal or silent: insights use the singer's own numbers, and a
   less-calibrated page says less, and says why.
3. Sourced or absent: every advice string carries a page-verified citation,
   rendered per ruling 7.
4. One entry per hazard, never a roster (Dann, 2026-09-11: "the object is
   to be helpful, not comprehensive"): the entry is anchored by its single
   weightiest instance, named in the Loupe's measure-tag grammar of
   measure, note, and vowel in words (`Loupe.svelte:981`), with the
   remainder as a count deferring to the score, where every event is
   already squircled in place (`Loupe.svelte:652`). Score markup answers
   where; Insights answers what, how much, and what to do.
5. Ranked by phonation mass, capped on page one; the earned second page
   takes the remainder in full.
6. Silence is a finding: nothing fired prints as one serene, truthful
   line. The page is designed to be beautiful when nearly empty.

## Page anatomy, for Design's hand

- **Identity head:** the calibrated voice's name (`VoiceProfilePane
  .svelte:552`, per the `profile.subtitleNamed` pattern with guillemets in
  French, `i18n.ts:1111`), composer, title. DESK DEFAULT: the calibration
  date joins the head, closing open N.19.
- **The centrepiece, engraved not charted:** the anthology-style range
  stave singers already read at the front of printed scores, grown: the
  piece's compass as noteheads, the computed tessitura as a shaded band,
  the singer's calibrated or typed range as the field behind, flags where
  they intersect. The duration-per-pitch histogram (the tessiturogram of
  the literature) supports it.
- **The fit line:** "This key seems like a good fit for you" prints only
  when true, lab-report style, with its terms flagged beneath it (range
  containment, crossings count, tessitura containment). Transposition
  options print adjacent when any exist that change those terms.
- **Flagged findings:** discovery versus confirmation is computed, not
  judged; departures from calibration take the visual weight, confirmations
  recede to quiet lines.
- **Advice:** per fired hazard, the sourced intervention in Dann's voice,
  full text on the earned page.
- **The foot:** footnoted citations; a ruled blank for the teacher's or
  student's hand; the method colophon.

## The model document

The page is a more beautiful, well-styled clinical lab report: measured
value, personal reference range, flag, narrative comment, reader draws the
conclusion. The 2024 Journal of Voice per-song profiling of Die schöne
Müllerin (range, quartile tessitura, directionality, dose metrics, density,
paired against a VRP) is queued for mining through the advice programme's
citation-verified pipeline.

## The pack that travels with this brief

Precedent: the N.108 pack (`docs/sessions/n108-design-pack/`). Assembled as
`docs/sessions/n127-design-pack/` at send time, one copy step. Contents:

- This brief, as struck by Dann.
- Fable's Studio ruling, quoted whole, and the S0 slate answers,
  excerpted verbatim from the record (`s0-slate-excerpt.md`; no
  standalone ruling document exists).
- `apps/web/src/app.css`: the tokens, including `--dusty-rose` and the
  derived tones.
- The paper family Insights must resemble:
  `apps/web/src/lib/components/Paper/TitleHeader.svelte`,
  `Paper.svelte`, `PageFooter.svelte`, `TitlePage.svelte`.
- The squircle being inherited: `apps/web/src/lib/shane/VoiceProfilePane.svelte`
  (the watch band, `:1532-1533 (.watch-band)`, and the subtitle pattern, `:552`).
- The selector gaining its third member: `apps/web/src/lib/components/DeskHead.svelte`.
- The Loupe's measure-tag grammar: `apps/web/src/lib/shane/Loupe.svelte`.
- ENVIRONMENT.md's typography section, extracted.
- One rendered Transcription page and one rendered Score markup page as
  images, so Design sees the siblings as the singer does, not as source.

## What Design owns

Composition, hierarchy, and type per the ruled system; the squircle's
carriage of the anatomy; both orientations; the selector's third segment.
Design does not choose content, does not name anything, and does not write
French.

## NOT ESTABLISHED

- The French strings, including the document's French name. Dann's eye,
  whole table, coined and adopted marked.
- Whether every engine value the anatomy needs is exposed where a third
  document can reach it; the desk read the watch band, profile, and Loupe
  seams this session, not the aggregation seams.
- The behaviour of the selector trio on the narrowest portrait widths.

NOT ESTABLISHED beats a complete invented answer.
