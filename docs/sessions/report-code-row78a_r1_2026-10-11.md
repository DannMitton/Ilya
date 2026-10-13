# Report: row 78a, the ratified strings (r1)

Code (Opus 5.5) on Dann's Mac, 2026-10-12, brief `brief-code-row78a-strings_r2_2026-10-11.md`, read whole.

- **Tree:** `9f9e896` on `Shane`, with the desk's own uncommitted edits in `docs/memory/` and `docs/sessions/LOG.md`. Rows 69 and 34 are in `Shane` (merged in `fd1c86a`), so the brief's cloud-lane prerequisites hold here.
- **Where the brief was set aside.** It was written for the cloud lane. As Dann directed, its git instructions were ignored: no git command that writes, and all work is left uncommitted in the tree.
- **Citations re-checked.** The brief's `path:line` citations were read at `b8b07f8`. Each was re-read on this tree before use, and the line numbers below are this tree's.

## What changed

All strings are verbatim from the brief, and each matches Dann's ruling in `OPEN.md` (lines 2950 to 2957, read this session). The apostrophes are U+2019.

1. **Ratified, marked so** (item 1).
   - `apps/web/src/lib/i18n.ts:1799-1804`: the comment over `placeholder.line.*` now says the French singular was RATIFIED 19:51, replacing DESK-DERIVED.
   - `:1810-1813`: one RATIFIED comment over `placeholder.comment` and `placeholder.turns.*`, replacing PROPOSED.
   - `apps/web/src/lib/analysis/placeholder-line.ts:8-13`, `:51`, and `:57`: the header and the two doc comments say RATIFIED.
2. **`placeholder.comment` gains its remedy** (item 2): `i18n.ts:1814`. The string now holds `{vowel}` twice, so `placeholderCommentSentence` uses `replaceAll` (`placeholder-line.ts:55`).
3. **"sung" leaves the frame** (item 3).
   - `i18n.ts:1850-1851`: `comment.working.where.above` and `.under` no longer say "sung" or « chanté ».
   - The two `…Placeholder` keys are gone, with a two-line comment in their place.
   - The choosing code is gone too: `RenderContext.placeholders` and `renderComments`'s option (`apps/web/src/lib/insights/comment-text.ts:339`, `:441-448`), and `InsightsPane.svelte`'s `placeholders: new Set(placeholders)` in the comments call.
   - `InsightsPane.svelte`'s other use of `placeholders` (`:388`, the singer blocks) stays.
4. **Tests** (item 4).
   - `apps/web/src/lib/insights/comments.test.ts`: the four whole-frame pins (`:148`, `:152`, `:363`, `:379`) are re-pinned without "sung" or « chanté ».
   - The test at `:428` is inverted: no frame says "sung" or « chanté » for any vowel, in either language.
   - Item 2's strings are pinned in `placeholder-line.test.ts` and `singer-blocks.test.ts:140-148`.
   - **One test the brief did not name also pinned the old comment sentence:** `apps/web/src/lib/analysis/gates.test.ts:195`. It is a finding line on a placeholder vowel, which now ends with the remedy too, and it is re-pinned.
5. **Markup's own top line** (item 5).
   - `i18n.ts:1808-1809`: the keys `placeholder.line.markup.many` and `.one`.
   - `placeholderLine` takes a third argument, `page: 'insights' | 'markup'` (`placeholder-line.ts:47`). `MarkupPane.svelte:726` passes `'markup'`; Insights keeps the existing keys.
   - All four Markup strings are pinned in `placeholder-line.test.ts`.
6. **The frame line** (item 6): `i18n.ts:1742`, with its ratification in a comment at `:1740-1741`. Both languages are pinned in a new test file, `apps/web/src/lib/insights/ratified-lines.test.ts`.
7. **`insights.r2.teacherA`** (item 7): `i18n.ts:1745`, with its comment at `:1743-1744`.
8. **`insights.r2.teacherC`** (item 8): `i18n.ts:1746`.
9. **Bozeman 2025** (item 9).
   - `apps/web/src/lib/sources.ts:207-212`: `place: 'New York'`, `publisher: 'Bloomsbury'`, `isbn: '979-8-7651-6228-6'`. The NOT ESTABLISHED comment is replaced by the source of each value. I recomputed the ISBN-13 check digit: it is 6.
   - It renders in both languages, pinned by tests:
     - en: `Bozeman, Kenneth. Practical Vocal Acoustics, 2nd ed. New York: Bloomsbury, 2025. ISBN 979-8-7651-6228-6.` (`comments.test.ts`)
     - fr: `BOZEMAN, Kenneth. Practical Vocal Acoustics, 2e éd., New York, Bloomsbury, 2025. ISBN 979-8-7651-6228-6.` (`sources.test.ts:132`)
   - `comments.test.ts`'s test "prints only what was read: no ISBN or publisher where none was recorded" used Bozeman as its unrecorded case. It now pins Bozeman's full entry and checks `challis2006`, which has neither, for no ISBN.
10. **`comment.tap`** (item 10): `i18n.ts:1897`, with its comment at `:1896`. `singer-blocks.test.ts:104` reads the key through `t()`, so it did not need changing.
11. **`insights.r2.cycles`** (item 11): `i18n.ts:1784`, with its comment at `:1782-1783`.
12. **The running head** (item 12): `apps/web/src/lib/page-config.ts:206` joins with ` | `, and the comment at `:182-183` says why. The test is `one-head-one-foot.test.ts:45`, which now pins `MUSSORGSKY | GOLENISHCHEV-KUTUZOV | WITHOUT SUN, NO. 1`.

**The "done when" grep.** In `i18n.ts`, no key ends in `Placeholder'`, and `comment.working.where.above` and `.under` contain no "sung". Other uses of "sung" (`calib.roster.oNoteAria`) and of « chanté » (`insights.figure.halfMass`) are out of scope and untouched.

## The pictures

In `docs/sessions/rows-78-79-shots/78a/`. They were taken with `docs/sessions/rows-78-79-shots/shoot.mjs` (headless Chrome, 1440 px, the dev server at localhost:5173, a stored bass voice).

| Picture | What it shows |
|---|---|
| `after-tchaikovsky-insights-en-p2.png` | Two comments on [ɛ], a placeholder vowel (sampled: [a], [ɑ], [o], [u], [ʌ]): "This finding rests on a placeholder value for [ɛ]. To replace it with your own value, sample [ɛ] in vocal fry." The [u] comments read "of your [u]", with no "sung". "Discuss this approach with your voice teacher." |
| `after-tchaikovsky-insights-fr-p2.png` | The same in French: « Ce constat repose sur une valeur par défaut pour la voyelle [ɛ]. Pour obtenir votre propre valeur, échantillonnez [ɛ] en friture vocale. », « de votre [u] », and « Discutez de cette approche lors de vos cours de chant. » |
| `after-sunless-insights-en-p1.png`, `after-sunless-insights-fr-p1.png` | The frame line in each language |
| `after-sunless-insights-fr-p2.png` | `insights.r2.cycles` in French at print width |
| `after-sunless-markup-en-p2.png` | Markup page 2's running head, `MUSSORGSKY \| WITHOUT SUN, NO. 1: WITHIN FOUR WALLS` |

- **The French cycles line does not fit one line** at print width, inside the totals box. It wraps after « pendant que vous » (`after-sunless-insights-fr-p2.png`). The English fits one line (`after-sunless-insights-en-p1.png`, in the totals box at the foot of the page).
- **No placeholder comment on Sunless.** With only [i], [a], and [ɑ] sampled, the one comment the full voice draws (on [u], bar 6) no longer fires, so it does not appear. The placeholder fR1 does not put that note near the resonance. I found a placeholder comment on the Tchaikovsky song by trying four sampled sets.
- **The head has no poet in the picture.** The fixture's MusicXML names no poet, so the picture shows composer and title. The three-part form is pinned by the unit test.
- **Seen in passing, not this row's work.** The French Insights page 1 prints English inside French sentences: « This key suits your voice. Une tierce mineure lower would keep… » and « A key Une tierce mineure lower would bring… ».

## The gates

From a scratch copy of `~/Downloads/ilya-ship.sh` that skips the untracked-file refusal and stops before staging. A per-file census (`vitest list --json`) names the moving tests.

| Gate | Before the run | After 78a |
|---|---|---|
| 1 phonology | 251 | 251 |
| 2 dictionary | 242 | 242 |
| 3 web-check | 0 errors, 12 warnings, 5 files | the same |
| 4 web-test | 2448 | **2457**, all passed |
| 5 score-parser | 663 passed, 5 skipped (668) | the same |
| 6 blurb | 145 | 145 |
| 7 integration | 55 | 55 |
| 8 ratchets | OK | OK |

**Gate 4: +9.**
- `analysis/placeholder-line.test.ts` 8 to 13 (+5: the four Markup strings and the comment's two sentences).
- `insights/ratified-lines.test.ts` 0 to 4 (+4, a new file).
- The script's baseline is the desk's to move, 2448 to 2457.

## Could not establish

NOT ESTABLISHED beats a complete invented answer.

- **A placeholder comment on *Without Sun*, no. 1.** None appears with the sets tried ([i], [a], [ɑ]; and four others). The picture is of the Tchaikovsky song instead.
- **The three-part head on the page.** Neither fixture's MusicXML carries a poet, so the page shows two parts. Only the unit test shows all three.
- **Dann's own voice.** The pictures use a built bass voice; his profile is in his browser.

## For Dann

- Walk on **http://localhost:5173** (uncommitted; Vercel will not show this until you commit and push).
- **The French cycles line wraps** to two lines at print width. You cut "from beginning to end" so it would sit on one line, and in English it does.
