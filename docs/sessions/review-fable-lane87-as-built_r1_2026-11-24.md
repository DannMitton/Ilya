# Review: cloud lane 87 as built (Fable), r1

2026-11-24. Reviewer: Fable 5.2, on the desk's brief `docs/sessions/brief-fable-lane87-as-built_r1_2026-11-24.md`. Read from a shallow clone of `cloud-lane-87` at `a2642dde` in the reviewer's own scratch space, deepened to reach the base `50315f2e`. Nothing was fetched into, merged in, or written to `~/Desktop/ilya-rewrite` except this file. No suite was run and nothing was built. Every `path:line` below is a line of the lane's tree at `a2642dde`, read this session.

## Verdict

**MERGE.** No blocker and no fix owed before the merge. One finding for the desk's rendered look, under "The one thing most worth the desk's attention".

## What the lane changed, whole

`git diff --name-status 50315f2e a2642dde` lists five files and no others: `GuideContent.svelte` (M, 8 lines added), `i18n.ts` (M), `ratified-lines.test.ts` (M, 57 lines added), `lane68-strings.test.ts` (M), and the lane's report (A). A line-by-line comparison of `i18n.ts` at the base and at the lane's head finds three changed lines and no others: 158, 2051, and 2052, in a file of 2,730 lines on both sides.

## The seven checks

### 1. The four passages equal the ratified draft: PASS

The draft in the clone has md5 `a46601e6`, equal to the Mac's copy. The comparison was made by script, not by eye: each of the draft's four quoted paragraphs was turned from markdown to markup (`**…**` to `<strong>`, `*…*` to `<em>`), and compared as a whole string against the seated paragraph's inner markup.

- Paragraph 1, French (`GuideContent.svelte:89`): equal, 493 characters, with no change applied to the draft.
- Paragraph 2, French (`GuideContent.svelte:300`): equal, 240 characters, with no change applied to the draft.
- Paragraph 1, English (`GuideContent.svelte:399`): equal, 443 characters, after the one change r4 ordered, *Ilya* in italics (three places, the lead included).
- Paragraph 2, English (`GuideContent.svelte:610`): equal, 217 characters, after the two changes r4 ordered: *Ilya* in italics, and the draft's one U+0027 in "Ilya's" seated as U+2019.

No seated paragraph holds a U+0027. No seated paragraph holds a no-break space, and the draft holds none. All four are NFC. The only apostrophe in the four is the U+2019 in English paragraph 2. The bold lead ends where the draft's bold ends in all four.

### 2. Placement: PASS

- Paragraph 1, French: `:89`, after the typed-values paragraph at `:87` (« Ces valeurs se saisissent au clavier… »), under `guide-markup-characteristics` at `:83`, and before the notation heading at `:91`.
- Paragraph 1, English: `:399`, after the typed-values paragraph at `:397` ("These values are typed, not sung, by design…"), under `guide-markup-characteristics` at `:393`, and before the notation heading at `:401`.
- Paragraph 2, French: `:300`, after « Recherche savante. » at `:298`, before « Données de dictionnaire. » at `:302`, under `guide-licences` at `:292`.
- Paragraph 2, English: `:610`, after "Scholarship." at `:608`, before "Dictionary data." at `:612`, under `guide-licences` at `:602`.

The brief's `:602` and `:296` for Scholarship are the base's numbers. In the lane the two paragraphs sit at `:608` and `:298`, moved by the lines seated above them. Scholarship at `:608` names the methods ("an open and close timbre markup, your pitches of turning, an *f*R1/*f*o crossing analysis, and sung-vowel modification advice"), so the lane's reading stands.

The file has one `{#if language === 'fr'}` (`:17`) and one `{:else}` (`:326`), so each paragraph is on the side its language names.

### 3. No `h4` and no drawer change: PASS, with the finding below

Both paragraphs are `<p id="…"><strong>…</strong> …</p>`. `Drawer.svelte` is not in the diff and stands at 1,986 lines. The diff to `i18n.ts` holds no `toc.` line. The parent list at `Drawer.svelte:282` and the three contents buttons at `Drawer.svelte:758-760` are unchanged.

### 4. Item 3 changed only the two keys: PASS

`i18n.ts:2051` and `:2052` equal the base's lines with "through the DRAWER on the left." replaced by "in VOICE." and « depuis le TIROIR de gauche. » replaced by « dans VOIX. », and nothing else (checked by script). `:2048`, `:2049`, `:2056`, and `:2057` are byte-identical to the base. **The MELODY twins at `:2058` and `:2059` still read "DRAWER on the left" and « TIROIR de gauche ».**

### 5. The pins pin: PASS

- `ratified-lines.test.ts:596-615`: four `toBe` comparisons of the whole stripped paragraph, each found by its id on its own side of the split (`:584-594`). Any drift in a word, an apostrophe, or a space fails one of them. The helper also fails if an id appears twice on a side (`:591`).
- `:616-621` fails if either id lands on a heading tag or loses its `<strong>` lead.
- `:622-632` fails if either paragraph leaves its place between its two named neighbours.
- That is six `it(` blocks added, counted in the diff.
- `lane68-strings.test.ts:10-11`: `INS_EN` and `INS_FR` take a third argument that defaults to the old phrase. `:16-17` pass "in VOICE" and « dans VOIX ». `:18-19`, the two MELODY pins, pass no third argument, so they still assert DRAWER and TIROIR.

One limit, not a defect: the placement test at `:622-632` proves order, not adjacency. A paragraph inserted later between Scholarship and the new paragraph would pass it.

### 6. Nothing forbidden: PASS

The five-file list above holds no approval file, no golden file, no `.bak`, and nothing under `docs/memory/`. No ratchet figure is in the diff. No squircle, dash, or placeholder-drawing file is in the diff.

### 7. The item 1 comment states a fact: PASS

`i18n.ts:158` now reads "and Dann ratified the French « Voix » on 2026-11-23 at 22:10." `docs/memory/INBOX.md:1009` (as committed at `50315f2e`) records exactly that: the date, the time, and his words. The comment claims nothing else. The key and both values at `i18n.ts:163` are unchanged.

## The gate arithmetic

**The desk's reconciliation holds on what the tree shows.** The lane adds six tests and removes none, so the total moves from 6,805 to 6,811, which is the lane's total. `burg.test.ts:30`, `:31`, `:59`, and `:80` are four `it.skipIf(!havePython)` tests, and `heic-decode.test.ts:130` is one `describe.skipIf(!REAL)`: four that skip where Python is missing and one that skips unless a real photograph is supplied. That fits five skipped in the sandbox and one on the Mac. **The figure to expect from Dann's ship run is `6810 passed | 1 skipped (6811)`.** NOT ESTABLISHED: that those four are the four that skipped in the lane's sandbox, since the lane's run output was not read and no suite was run here. The heic block's test count was not read either; one is inferred from the Mac's floor.

The lane's own report says the base "should have been 6800 passed" and cites a floor of 6,801. Both are the lane's confusion over the skip counts; the totals agree with the desk.

## The one thing most worth the desk's attention

**The two new ids are watched by the scroll spy, and the contents have no entry for them.** `+page.svelte:3558` observes every element whose id begins `learn-` or `guide-`, not headings only, and `:3568` makes the topmost one in the band the active heading. The two new paragraphs carry `guide-` ids. When one of them is the element that enters the band, the active id becomes `guide-markup-how-ilya-reads` or `guide-licences-method`. No contents button carries either id, so `isActive` (`Drawer.svelte:421-423`) is false for every entry, and `getParentIds` returns an empty list for both (`Drawer.svelte:287`), so the "How Ilya works" chevron loses its contains-active mark (`Drawer.svelte:743`).

**This is an inference from the code, not a thing seen.** Nobody has looked at the render. It is also not new in kind: `guide-markup-stand-ins` at `GuideContent.svelte:405` is a `<p id>` with the same standing, absent from `Drawer.svelte:282`, and it has shipped. The lane did what r4 ordered, and the ids are the pins' handles. So it is not a fix owed before the merge.

**For the rendered look, the desk checks two things:** scroll the GUIDE slowly past each new paragraph in both languages and watch whether the contents highlight drops; and read paragraph 1 in place, because "These values are typed, not sung, by design" (`:397`) is now followed directly by "You sing each vowel in vocal fry" (`:399`) under a heading about range, tessitura, and passaggio (`:393`). Whether that neighbouring reads well is taste, and it is Dann's. If the highlight does drop and it matters, the repair with the smallest reach is the two ids added to the list at `Drawer.svelte:282`, which adds no line to the file; it would keep the chevron's mark and not the entry's highlight.

## Smaller notes, none a fix

1. The comment at `ReadingPaper.svelte:254-255` says no `<p id>` survives in either content file. It was already untrue at the base (`guide-markup-stand-ins`), and the lane adds two more. The rule under it, `[id]` at `ReadingPaper.svelte:257`, covers the new paragraphs, so a deep link to either clears the sticky chrome.
2. The French typed-values paragraph at `GuideContent.svelte:87` holds U+0027 apostrophes (« d'ambitus », « l'analyse »). Pre-existing, not the lane's, and outside this lane's brief.
3. The lane's report says the branch was "cut from `origin/cloud-lane-87` at `50315f2e`". The history confirms the base: `07fc9c0b`'s parent is `50315f2e`.
4. `placeholder.line.many` and `.one` (`i18n.ts:2048-2049`) and `placeholder.line.markup.many` and `.one` (`:2056-2057`) carry the same DRAWER phrase. The lane raised them; whether they follow with the MELODY twins is the desk's ruling, not this review's.

## What I could not establish

1. How the two paragraphs render, and whether the contents highlight drops in a browser. Code reading only.
2. Any gate figure. No suite was run, as the brief ordered.
3. Which four tests skipped in the lane's sandbox. See the gate arithmetic.
4. The French copy's correctness as French. The draft is ratified and was treated as the authority; it was compared, not reviewed.
5. The state of the Mac's clone beyond one read-only `git status`, which showed uncommitted changes under `docs/memory/` and three untracked briefs. They are not this review's and were not touched.

## Terms

Adopted from the tree and the briefs: scroll spy (the tree's comment at `+page.svelte:3550` calls it the scroll-based active heading), contents, pins, seating, twins. Coined here: none.

## Cost

Approximately 110,000 tokens against the 300,000 cap. An estimate, not a measured figure. No subagent, no artifact, no `.bak`.
