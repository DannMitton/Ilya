# CODE BRIEF. Findings from the 2026-09-24 walk: the vowel chart prints all ten vowels, and a saved song's score words fill Text

**Written by the desk 2026-09-24 09:55. For Claude Code, in `~/Desktop/ilya-rewrite` on branch `Shane`.** House rules: no git writes, gates before and after, Canadian spelling, no em dashes, `WRITTEN` is not `DONE`.

**NOT ESTABLISHED beats a complete invented answer.** Re-read every `path:line` cited here before relying on it; the tree wins.

## Why

Found on Dann's walk of `ccb790c` on the alias, 2026-09-24, on Kabalevsky "Cupid". The chart printed nine rows; [ʌ] had no row. **Ruled by Dann 2026-09-24 09:53:** *"print the whole ten-vowel lyric diction inventory in its decided sequence, and assign a value of 0 when a vowwel doesn't appear. That ensures that the user doesn't percevie an error or omission."*

The ruled order is `VOWELS`, `apps/web/src/lib/shane/engine/types.ts:26` (ruled 2026-09-23 03:07 to 03:13, `docs/memory/OPEN.md`).

## Where

- `apps/web/src/lib/shane/InsightsPane.svelte:337` to `:345`, `vowelChart`: builds rows only from `model.phonation.vowels`, so a vowel never sung has no row.
- `apps/web/src/lib/shane/InsightsPane.svelte:348`, `vowelValue`: prints seconds, a span, or a share.
- `apps/web/src/lib/shane/insights.ts:482` to `:490`: builds `vowels` from `totals.byVowel`. Leave the model alone unless the pane cannot do this without it; if you touch it, say why.

## The change

1. `vowelChart` emits one row for every entry of `VOWELS`, in that order. A vowel absent from the model gets share 0, no bar, not flagged. Any vowel outside `VOWELS` still follows, as now.
2. A zero row prints `0 s` where the chart prints seconds, and `0 %` (through the existing share formatter) where it prints shares. **DESK DEFAULT:** a zero row draws no bar at all, not a hairline. Use the existing formatters so French spacing comes out right.
3. Nothing else on the page changes. The chart is taller by the missing rows; page fit is by measurement already, so let it re-measure.
4. When `totals.byVowel` is absent (no resolver was asked, `score-metrics.ts:39`), keep today's behaviour: no chart. Ten zeros there would be false.

## Done when

- Gates at baseline, or moved only by named tests you added (a test that a piece with no [ʌ] still yields ten rows, [ʌ] at 0, in `VOWELS` order).
- Seen rendered in both languages on a piece missing at least one vowel, and described in the memo.
- Page one's end against the foot re-checked on Sunless 1, both languages.

## Second finding: a score's words always yield a transcription on Text

**Found on the same walk.** "Cupid" has a score with words, and Markup shows them, but Text shows `paper.empty` ("Enter your Cyrillic text in the drawer on the left."). N.134's fill runs on an upload only: `apps/web/src/routes/+page.svelte:3368`, `origin === 'upload'`. A restore skips it by a DESK DEFAULT of 2026-09-14 (the comment at `:3363` to `:3367`), whose reason was not to write a poem into a saved song at startup.

**Ruled by Dann 2026-09-24 09:57 and 09:59:** *"if there's text, it should appear in Text as a transcription too"*; *"Text in the system must yield a transcription if that text populates Markup. Please devise a way fopr this to happen seamlessly and without unwanted consequences"*.

**The design. DESK DEFAULT, offered by the desk 2026-09-24 10:00 at his request: show it, derived; write it only on the singer's first act.**

1. **Derived, never stored.** When the poem box is empty and the loaded score carries words, Text renders a transcription of the score's words (`scoreText`, `+page.svelte:395`), computed with the same `processText` options as `runPipeline` (`:2388`). Keep it in its own derived value. **Do not write it into `lines` or `doc.inputText`**: `lines` feeds `poemQueue` (`:390`), and a non-empty `poemQueue` would take over `slotQueue` from `scoreTextQueue` (`:391`) and could move placements. Nothing is written at startup, which keeps the 2026-09-14 reason intact. CONTRACT §6 (do not store anything derived) is met.
2. **The drawer agrees with the page.** The poem receipt shows as it does after an upload, with the `from score` tag (`meta.fromScore`). **DESK DEFAULT:** on a derived poem the receipt offers Replace but not Clear, because there is nothing stored to clear.
3. **The singer's first act makes it theirs.** The first act that changes the text (typing in the poem box, or a word-level change on Text: stress, ё, gloss) first writes the score's words into the poem box exactly as an upload does (`handleInput`, then the seat through `seatFilledPoem`, as at `:2559`), then applies the act. From then on it is an ordinary poem. **Kept from N.134, Dann's ruling of 2026-09-10:** a singer's own words are never overwritten.
4. An upload keeps today's behaviour (`:3368` to `:3371`).

**Say in the memo:** whether any placements change when step 3 materialises the poem on a song like Dann's Without Sun no. 1 (saved with an empty box and a full set of placements, per the comment at `:3364`). **If placements would change, stop and report before shipping.**

**Done when, added:** "Cupid" and Without Sun no. 1 opened from the library show their words on Text in both languages at once, with nothing written to the record at startup; one stress change on each then writes the poem, and the placement count is the same before and after (stated).

## Third finding: "1 lines"

**Seen on the same walk,** Sunless 2 uploaded: the poem receipt reads "1 lines". `intake.lines` (`apps/web/src/lib/i18n.ts:646`) is `'%s lines'` / `'%s lignes'` with no singular, and `intake.words` (`:647`) has the same shape. **DESK DEFAULT:** add singular keys (`intake.line`, `intake.word`: "%s line" / « %s ligne », "%s word" / « %s mot ») and choose by count at the call site (`IntakePanel.svelte:447` and `:449`). French: 0 and 1 take the singular. **The French was drafted by the desk and RATIFIED by Dann 2026-09-24 10:19** (*"Oh yes!"*): « %s ligne », « %s mot ». Adopted from the existing plural entries, not coined.

## Fourth finding: a flat in the fit table stands apart from its letter

**Seen on the same walk,** Sunless 2, Insights in French: the fit table's "Measured in this piece" column prints the flat with a space on each side, "Ambitus A2 à E ♭ 4" and "C♯3 à B ♭ 3". The sharp in the same cell is tight ("C♯3"), and the drawing's own labels are tight ("E♭4", "B♭3"). **Find the cause and say it in the memo, with its `path:line`;** whether English does the same is NOT ESTABLISHED. **DESK DEFAULT:** the fix makes the table's flat as tight as its sharp, in both languages.

## Fifth finding: a pickup bar prints its own length as a meter

**Seen on the same walk,** Sunless 2 (`~/Documents/Finale Files/Mussorgsky - Sunless 02 - You did not recognize me.musx`), Markup, both languages: bar 1 is a two-beat anacrusis (quarter rest, eighth rest, eighth) in a 4/4 song, and Ilya prints **2/4** on it, then **4/4** at bar 2. Dann's dissertation prints the song's 4/4 over the incomplete bar. **Ruled by Dann 2026-09-24 10:17:** *"The first bar is marked 2/4 incorrectly. Maybe the system doesn't allow incomplete measures at the beginning? this is standard practice. It should."*

**What the tree does now.** `packages/score-parser/src/mnx-parser.ts:691` to `:697` flags `measures[0].isPickup` only when bar 1's content is shorter than bar 1's OWN time signature. This file's bar 1 evidently arrives already carrying 2/4, so its content fills it and it is not flagged. **Establish first, and say in the memo, with evidence:** where the 2/4 comes from (the `.musx` itself, for example a Finale display meter that differs from the actual one, or denigma's MNX conversion). Do not guess.

**The change. DESK DEFAULT:** when bar 1 is shorter than bar 2's meter and bar 1's own meter differs from bar 2's, treat bar 1 as a pickup under bar 2's meter: print bar 2's meter at the start, print no meter change at bar 2, and set `isPickup`. Check every reader (MusicXML, `.mxl`, `.mnx`, `.musx`, `.mscz`) against the same rule and say which already handle a pickup correctly. Nothing in `VocalLineEvent` changes (CONTRACT §6). Phonation already excludes pickup bars from its metre check (`phonation.ts:274`); confirm the phonation-time headline does not move for Sunless 2, or state the change.

**Done when, added:** Sunless 2 on Markup shows 4/4 once, at bar 1, over the two-beat pickup, in both languages; the other five Sunless `.musx` files and Sunless 1's MusicXML are checked for the same shape and reported.

## Return

A memo of at most 200 words with a section headed "NOT ESTABLISHED", saved as `docs/sessions/memo-code-vowel-chart-all-ten_r1_2026-09-24.md`. List any new file for `git add`.
