# Fable review: brief for Code, seat the Guide paragraph on the # break, r1 (2026-10-25)

Brief reviewed: `docs/sessions/brief-code-guide-break-paragraph_r1_2026-10-21.md`, md5 `1bb61a328603b061569814a1619ab6a9` (checked in the clone at `e0f4ad9`). The texts it seats: `ratified-guide-break-paragraph_2026-10-21.md` (md5 now `3727ed5d2de3b123b0921b6d71b2f818`, NOT the brief's `914620c152e11c549fbf257d64d8711f`; the file gained its 13:52 pointer after the brief quoted it) and `draft-guide-break-how-to-place_r1_2026-10-21.md` (md5 `2e6cc091b3f542fca94f4c38dd7fe0ab`, which the brief does not state).

Every `path:line` below was read by Fable this session; nothing was run. NOT ESTABLISHED beats a complete invented answer.

Batch C and N.194 have not shipped. This brief changes prose and a test, so its cites are to the tree as it stands; the dependence on the two builds is in its section 0 and is right.

## Verdict: SEND WITH AMENDMENTS

One amendment stops the brief from seating a sentence that is not true of the app as the N.194 brief builds it (1). One stops a NOT ESTABLISHED from being closed by a desk reading that the Guide sentence depends on (2). The rest correct a stale md5, a pin that cannot fail as written, and a style block that would fail a gate.

## Amendments, ranked

### 1. The Guide says "[#] on the IPA line" and the N.194 build writes a bare `#`

Evidence. The ratified route sentence (draft file `:15`, EN; `:19`, FR; `OPEN.md:3298`) ends "writes [#] on the IPA line after that word's last syllable" / « s’écrit alors [#] sur la ligne API ». The N.194 brief's design (r4 section 2, Dann 01:38) is "a visible, printing octothorpe after that syllable's IPA value just like an enclitic", and step 2 grafts `#` into the slot's `ipa` (`pairings.ts:235-245` is where a slot's IPA is composed; a clitic's IPA is appended bare at `:222`). Nothing in r4 or batch C r2 writes brackets. The bracketed form `[#]` is the dormant `phonationBreak` path's glyph (`staff-renderer.ts:3311-3313`, `<text data-analysis="phonation-break">[#]</text>`), which batch C r2 says not to wire ("Do not wire the typed # to `phonationBreak` or to the `[#]` path"). So after both builds the Guide would tell the singer to look for `[#]` and the IPA line would show `#`.

Cost if not amended. The Guide describes a glyph the app does not draw, which is the wall of Fable's batch C amendment 2 in a new place.

This is Dann's, not Code's: the sentence is ratified in both languages, and the choice between the bare `#` on the IPA line (his 01:38 words and the build) and `[#]` (the ratified Guide and the Guide's older sentence) is a choice about what the singer reads. Add to section 0:

> STOP before seating if the IPA line, after N.194 ships, shows a bare `#` and not `[#]`: report the glyph the engine wrote (read it from the seated slot's `ipa`) and leave the paragraph unseated until the desk brings Dann the two glyphs. Do not edit the ratified text.

### 2. The sentence "select a note, open Syllables" is marked NOT ESTABLISHED in the draft and closed by a reading in the brief

Evidence. `draft-guide-break-how-to-place_r1_2026-10-21.md:11`: "NOT ESTABLISHED: the order 'select a note, open Syllables'. Code reads the Loupe and reports it before the sentence is seated." The brief's section 8 closes it with a read: `+page.svelte:1410-1411` (`setCursor` then `loupeOpen = true`, the only `loupeOpen = true`, confirmed by grep this session), `:4580` (`{#if loupeAvailable && loupeOpen && cursor}`), `:1466` (the effect that closes it without a cursor), `:1026-1030` (`loupeAvailable`). All four read as stated. What the read establishes is that a note is selected BEFORE the Loupe opens. Fable read the rest this session: `LoupeSyllables` draws inside `{#if syllablesOpen}{#if mode === 'syllables'}` (`Loupe.svelte:2564-2567`), from `loupePanel.open` and `loupePanel.mode` (`+page.svelte:4603-4606`); `LoupePanel` starts with `mode = 'syllables'` and `open = false` (`loupe-panel.svelte.ts:74-75`), and `reset` returns it there when the Loupe closes (`:124-127`), so the panel is shut on every arrival and "open Syllables" (a press on the Syllables pill, `choose`, `:105-113`, or the chevron, `toggle`, `:117-121`) is a step the singer takes. So the sentence's second verb is right and its first is in the wrong place: the note is selected by a tap on Markup, which is what opens the Loupe (`:1408-1411`); nothing inside the Loupe selects a note (`:1411` is the only `loupeOpen = true`).

Cost if not amended. "In the Loupe, select a note" sends a singer who reads the Guide first to look for a way to select a note inside a Loupe they cannot open without one.

Replace the brief's section 8 second paragraph with:

> The order the code enforces (Fable, read 2026-10-25): a tap on a note on Markup sets the cursor and opens the Loupe (`+page.svelte:1408-1411`, the only `loupeOpen = true`); the Loupe draws only while a cursor exists (`:4580`, `:1466`); the panel arrives shut with Syllables as its mode (`loupe-panel.svelte.ts:74-75`, `:124-127`), so Syllables is opened by a press (`:105-121`). The ratified "In the Loupe, select a note, open Syllables" puts the selection inside the Loupe, where it does not happen. Do not seat that sentence as written. The rewording is Dann's; desk draft for his ruling, both languages, built from the ratified sentence's own words: EN "Tap a note on Markup to open the Loupe, open Syllables, and press <span class="guide-key">Break after this word</span>." FR « Touchez une note dans l’Annotation pour ouvrir la loupe, ouvrez Syllabes, puis appuyez sur <span class="guide-key">Frontière après ce mot</span>. » (« l’Annotation » adopted from `GuideContent.svelte:80`; « Touchez une note » adopted from « Touchez une voyelle pour la capter », `i18n.ts:1318`, against the ratified « appuyez sur » for a pill, since a note is tapped and a pill is pressed; « dans l’Annotation » is the desk's preposition, no glossary source; his call on both.) Seat the rest of the paragraph only once he has ruled on this sentence.

### 3. The negative pins cannot fail on the tree, and the positive pins decode a byte the file does not use

Evidence. (a) The brief's negative assertions: "`fr` no longer contains 'Une rupture de phonation s'écrit'". The tree's `:84` has an ASCII apostrophe in `s'écrit` (`od` this session: `s ' \303\251`), and the brief's string also carries ASCII (`od` on the brief: the same bytes), so this one matches; but the positive pins are asked for "with U+2019 apostrophes" and the brief's section 1 says the French "carries U+2019 apostrophes", so a Code that normalizes apostrophes while copying would silently make the negative pin vacuous. State the byte. (b) The decode step `decode(&#160;)`: the row 123 block (`ratified-lines.test.ts:149-152`) decodes the entity, but the Guide's French colons at `:38` are written as a LITERAL U+00A0 (`od` this session: `\302\240 :`), and the file has 35 lines with a literal NBSP against 6 with the entity (`:294-299`, the OQLF list). The ratified text carries `&#160;` (ratified file `:53`; draft `:19` has no colon). Either form passes `i18n.test.ts:148` (it decodes both). The pin passes either way after `decode`, so the brief's "the pins carry the literal characters, not escapes" is honoured by the test and not by what Code writes into the Guide.

Cost if not amended. A seat that writes `&#160;` into a file whose paragraphs write the literal character is inconsistent and a later grep for the literal misses it; the pin would not say so.

Add to section 2, item 1:

> Write the French colons as the file's own paragraphs do at `:38`: a literal U+00A0, not `&#160;` (35 lines carry the literal, 6 the entity, counted 2026-10-25). Write U+2019 apostrophes as the ratified text has them.

Replace item 2's negative assertions with:

> Two negative assertions, with the bytes the tree has today: `en` does not contain `A phonation break is written <strong>[#]</strong>` and `fr` does not contain `Une rupture de phonation s'écrit` (ASCII apostrophe U+0027, as `:84` is written; `od` it before you rely on it). Both fail on the unchanged file; the positive pins fail on the unchanged file because the paragraphs are absent.

### 4. The `guide-key` style would fail gate 3 or the OQLF test if written as the brief describes

Evidence. The brief asks for `white-space: nowrap` on an inline chip wrapped around « Frontière après ce mot » (four words). At a phone width inside a Guide paragraph, a 4-word non-wrapping chip overflows the line box, and the brief's own screenshot instruction would show it. The pill's rule (`LoupePlacementRow.svelte:51-95`, `.loupe-place-pill` `:58-68`) uses `line-height: 1` and `padding: 7px 12px`, which inside body text changes the line's height. The Guide's style block (`:600-640`) uses four tokens: `--border-light`, `--ink-secondary`, `--surface-subtle`, `--cobalt` (grep this session); the pill's `#4a4540` is the Guide's `--ink-secondary` fallback (`:618`), and its `rgba(74, 69, 64, 0.35)` is that colour at 35 percent.

Cost if not amended. A chip that overflows on a phone, or a line that jumps in height where the chip sits.

Replace the style bullets' first and fourth items with:

> - inline, `border-radius: 999px`, `border: 1px solid var(--border-light, #ddd9d4)` (the Guide's own border token, `:603`), `color: var(--ink-secondary, #4a4540)` (`:618`; the pill's `#4a4540` is this token's fallback), `padding: 0 0.5em`, `line-height: inherit`, `font-size: 0.9em`, so the line box does not grow;
> - `white-space: nowrap` only if the longest label fits at 320 px inside the Guide's paragraph measure; otherwise let it wrap and report the screenshot. Report the screenshot at 320 px and at 1024 px either way.

### 5. The label pin reads keys the N.194 brief does not name

Evidence. Section 8: "Add one test in `ratified-lines.test.ts` that reads the two labels from `i18n.ts` (the break's two keys are named in N.194 r4 ...)". N.194 r4 step 4 says "a new i18n key for each ... list the keys in your report" and names none. Fable's review of r4 (amendment 10) asks the desk to name them (`loupe.place.breakAfter`, `loupe.place.breakRemove`, DESK DEFAULT).

Cost if not amended. Code reads N.194's report for the names; if r4 ships before that amendment lands, the names are whatever Code chose.

Replace the parenthesis with: "(the two keys are `loupe.place.breakAfter` and `loupe.place.breakRemove`, DESK DEFAULT in Fable's review of r4; if N.194 shipped other names, read them from `i18n.ts` by their English values 'Break after this word' and 'Remove break' and report the names)".

### 6. Small cites and facts

- Section 1: the ratified file's md5 is stale (`914620...` in the brief; `3727ed...` now, the 13:52 pointer added). Section 8 cites the draft file by name without an md5; it is `2e6cc091b3f542fca94f4c38dd7fe0ab`.
- Section 2: `GuideContent.svelte:380` and `:84` hold the two paragraphs as stated; the `<strong>` around `[#]` is at both. The new text has no `<strong>`, and the ratified file says `<em>` for Russian words; `sources.test.ts:40-41` (`CITE`) accepts "Grayson 2012, p. 255" and "Grayson 2012" is registered (`sources.ts:49-55`), so the citation passes the registry gate.
- Section 3: `Loupe.svelte:1070`, `:1078`, and `loupe-ink.ts:219` are comments as stated; "junction of the two notes" is at `GuideContent.svelte:380` alone in `apps/web/src` (grep).
- Section 4: the six test files that read `GuideContent.svelte` are as listed (grep this session). `i18n.test.ts:141-153` also asserts the French branch holds more than five ` :` sequences; the new paragraph adds two and cannot lower it.
- Section 4: "the eight gates the ship script runs": in a cloud session the script is on Dann's Mac (`~/Downloads/ilya-ship.sh`); the in-tree copy of its gate lines is `docs/sessions/measure-4f-quadruplet_2026-10-12/gates-scratch.sh:78-82`, `:109-116`, with stale baselines. Name the in-tree file so cloud Code knows the eight commands.
- Section 8: `i18n.ts:503` is `loupe.syllables` (« Syllabes »), `:787` is `intake.view.lyrics` (« Paroles »), and `:1809` has « la loupe » lowercase, as the draft's glossary says.
- Section 8: "Ilya has no dark theme": grep for `prefers-color-scheme`, `color-scheme`, and `data-theme` in `apps/web/src`, `apps/web/static`, and `packages` finds nothing this session; as stated.
- Section 8: the Guide names none of the Loupe's existing pills (grep for "Clear placements", "Place from here", « Retirer le placement », « Placer à partir »: none), so the two break labels are the first `guide-key` uses, as the draft says.

## Checks that passed

- Section 0's dependence: the paragraph claims behaviour (a `#` stops voicing, the button exists) that only the two builds deliver; waiting is right.
- The ratified text to seat (ratified file `:49`, `:53`, as amended by the draft `:15`, `:19`) matches `OPEN.md:3298` word for word.
- `ratified-lines.test.ts:146-168` is the row 123 pattern the brief copies; the split at `{#if language === 'fr'}` (`GuideContent.svelte:16`) and `{:else}` (`:311`) is the file's one branch.
- Section 7 lists the French of the pill's label as not in this brief; it is ratified (13:42) and lives in N.194, so nothing is owed here.
- `GuideContent.svelte` has no ceiling in `ratchets.json`; at 640 lines it is under the 1000-line limit, and one `<style>` rule does not reach it.

## Where would this wall a singer in?

- The Guide says `[#]` and the IPA line shows `#` (amendment 1). A singer searches the IPA line for brackets that are not there.
- The Guide says "In the Loupe, select a note" and the Loupe cannot be opened without a note already selected (amendment 2). A singer who opens the Guide first looks for a way to select a note inside a Loupe they cannot yet see.
- A chip that reads as a button (the brief names it; the mitigation stands).

## Questions for Dann

1. Taste, and his text. The ratified Guide sentence says the break "writes [#] on the IPA line" (EN) / « s’écrit alors [#] sur la ligne API » (FR). The N.194 design and build write a bare `#` grafted after the syllable's IPA, as his 01:38 words describe. Which glyph does the IPA line carry: `#` or `[#]`? The Guide follows the answer, French included.
2. His text. The ratified route sentence says "In the Loupe, select a note, open Syllables"; the code selects the note by a tap on Markup, which is what opens the Loupe (`+page.svelte:1408-1411`), and the Syllables panel arrives shut (`loupe-panel.svelte.ts:74-75`). Amendment 2 carries a desk draft in both languages with its two open choices (« Touchez » against « appuyez sur »; « dans l’Annotation »). Ratify, amend, or keep the sentence as it stands.

## What I could not establish
- Whether the Guide's paragraph measure at 320 px fits a four-word non-wrapping chip (a render, not a reading).
- The eight gate baselines in the cloud lane after batch C and N.194 (the brief leaves them to the ship script's lines; right, with the in-tree copy named).
- Whether `french-italics.test.ts:99-106` is touched: the new French has no Italian musical term (read), so by reading no.
- Whether the sentence "At a syntactic break the voice makes a phonation break: a lift, an interruption of continuous phonation" will read against anything the Loupe's comments call a "phonation break" (`Loupe.svelte:1070`, `:1078`, analysis layers): by reading, those are code comments and the singer never sees them.
