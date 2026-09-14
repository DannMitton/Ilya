# Brief: what Cyrillic underlay OCR costs and achieves, for N.135

**For:** a fresh Sonnet session. **Written:** 2026-09-14 by the coordinating desk.
**Serves:** N.135, the page reader reads the text underlay from a PDF or a
photograph. Ruled by Dann 2026-09-14. It cannot be costed until these three
numbers exist.

**NOT ESTABLISHED beats a complete invented answer.**

---

## What you are NOT doing

- Not writing application code. Not modifying anything under `apps/` or
  `packages/`.
- **Not running any git command that writes.** No `add`, no `commit`, no
  `stash`, no `checkout`. Read-only `status`, `log`, `diff`, `show`,
  `ls-files` is allowed and mostly unnecessary here.
- Not installing anything on Dann's Mac. Stage the files you need into your own
  cloud workspace and run the tools there.

## Standing rules

- Every claim carries a `path:line`, a command with its actual output, or
  `NOT ESTABLISHED`. There is no fourth form.
- Disk bytes and wire bytes are different numbers and are never swapped. The
  cautionary case is `claude/e22-0.2-audit-returns_2026-08-03.md`, where a
  171 MB disk figure was one inference away from being reported as a wire
  figure.
- Do not trust a number your own script printed without a control.
- Read the primary source, not a memo about it.

---

## Q1. What does the OCR Ilya already ships cost over the wire?

**Established, so you do not need to re-derive it:** `tesseract.js` at `^7.0.0`
is declared at `apps/web/package.json:25` and dynamically imported at
`apps/web/src/lib/shane/ScoreUploader.svelte:303`, which calls
`createWorker('rus')` and `worker.recognize(file)` inside `readPictureAsPoem`
(`:300-326`). The same call previously lived in `RootPanel.svelte`.

**Answer:** what bytes a singer downloads the first time that function runs.
Specifically the tesseract.js worker script, its core WASM, and
`rus.traineddata`. Say for each one whether it is bundled into the build or
fetched from a CDN at runtime, name the origin, and give both its raw size and
its size as actually served.

**Also answer:** whether any of it is already counted inside the "roughly 12 to
22 MB over the wire" first-session figure in
`docs/sessions/memo-footprint-and-release-arithmetic_r1_2026-09-13.md`. That
memo's static-asset breakdown lists denigma, fonts, pdfjs, Guide images,
`reader`, `images` and `icons`, and no OCR line at all, which is the reason this
question exists.

**Done when:** three sizes, each with the command or HTTP response that produced
it, plus a yes or no on whether they are inside the existing footprint figure.

## Q2. Does a multi-language spec lift the 47%?

**The baseline, and read it before you start:**
`docs/sessions/memo-n96-pdf-ingest_r1_2026-08-24.md`. Audiveris 5.9.0 with
Tesseract 5.5.1, `-constant org.audiveris.omr.text.Language.defaultSpecification=rus`,
matched 36 of 76 non-empty OCR tokens against the Cyrillic ground truth, about
47%. That memo records the cause of most of the loss: the page is a bilingual
Russian and German libretto, and one global `rus` pass garbles the German line
rather than skipping it. It names `rus+deu` and `rus+eng` as untried.

**Answer:** the same exact-match count under `rus+deu` and under `rus+eng`,
against the same ground truth, by the same matching method, so all three
numbers are comparable. If you cannot reproduce the 47% baseline first, stop and
report that. **A new number that does not reproduce its own control is not a
measurement.**

**Done when:** three counts, one method, one ground truth, and a statement of
whether the baseline reproduced.

## Q3. Does Tesseract on syllable-sized crops beat whole-page OCR?

**Why this is the question N.135 turns on.** Ilya's page reader already locates
pages, systems, staves, staff-line spacing and every notehead
(`apps/web/src/lib/shane/ingestion/recognized.ts:29-90`). A lyric underlay sits
in a band beneath the stave with its syllables horizontally aligned to those
noteheads. So segmentation is free, and the open question is only whether
Tesseract reads a short Cyrillic fragment in a known box.

**Answer, in two parts:**

1. Crop the underlay band per syllable from a real page and run `rus` on each
   crop alone. Report matches out of the 96-syllable ground truth.
2. Repeat with a dictionary constraint: snap each raw result to the nearest
   plausible Russian syllable fragment. `packages/dictionary` holds the Russian
   data; read it rather than assuming its shape. Report matches again.

If per-syllable cropping is not feasible without the reader's own geometry, say
so and report what you did instead. A hand-drawn crop grid on one system is an
acceptable substitute if you declare it.

**Done when:** a match count out of 96 for raw crops, a match count for
dictionary-corrected crops, and the crop method stated plainly enough to repeat.

---

## Inputs, all on Dann's Mac

| what | path |
|---|---|
| ground truth, verse 1, 96 Cyrillic syllables | `~/Downloads/Mussorgsky - Sunless 01 - Within Four Walls (engraved).musicxml` |
| a scan of the same song | `~/Downloads/sunless-01-v-chetyryokh-stenakh_lamm-scan.png` and `.pdf` |
| the IMSLP source | `~/Downloads/IMSLP113877-PMLP232488-Mussorgsky_-_Without_Sun.pdf` |
| the 47% memo | `docs/sessions/memo-n96-pdf-ingest_r1_2026-08-24.md` |
| the footprint memo | `docs/sessions/memo-footprint-and-release-arithmetic_r1_2026-09-13.md` |
| the engine survey | project knowledge, `claude/e16-phase0-options-memo_2026-07-22.md` |

**One thing to confirm before you rely on it:** whether the lamm scan is the same
page `memo-n96` measured. That memo describes a bilingual Russian and German
page. If the lamm scan is Russian only, say so, because it changes what Q2 means.

The ground truth is extracted from the MusicXML by reading `<lyric
name="verse" number="1">` in document order and joining `begin`/`middle`/`end`
runs by their `<syllabic>` marks. Verse 2 is IPA and is not ground truth.

## Return

Write one memo to
`docs/sessions/memo-n135-ocr-measurement_r1_2026-09-14.md`, in these sections:

1. **Instrument.** What you ran, where, on what versions.
2. **Q1**, with its three sizes.
3. **Q2**, with its three counts and whether the baseline reproduced.
4. **Q3**, with its two counts and the crop method.
5. **What could not be established**, as a list. This section is required and
   must not be empty unless everything above is fully measured.
6. **Bottom line**, one paragraph: whether underlay OCR is worth building, on
   the numbers, with no recommendation about schedule.

House style: Canadian spelling, no em dashes, one idea per sentence, ISO dates.
No aphorisms and no billing a finding before it is read.
