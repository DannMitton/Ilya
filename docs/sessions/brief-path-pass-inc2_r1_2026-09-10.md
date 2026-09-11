# Brief for Code: the path pass, increment 2

Desk, 2026-09-10 23:20, after Dann's walk of `a584ad8` on the branch alias at
1400 px and 390 px (fresh incognito profile) and Sonnet's anchor memo
`docs/sessions/memo-anchors-path-pass-inc2_r1_2026-09-10.md` (49 lines, read
in full; its line numbers are against HEAD `0f7e89d`). Serves THE DRAWER AS
A PATH, step 3. Returns `docs/sessions/memo-path-pass-inc2_r1_2026-09-10.md`.

## 0. Ground rules

- No git. Dann ships with `ilya-ship.sh`. Ask him to `git add` any new file.
- The five gates hold at baseline: phonology 216, dictionary 235, web-check 0
  errors and 7 warnings in 4 files, web-test 1103, score-parser 547 passed and
  5 skipped. Report any movement with its cause.
- Edit by anchor: assert each anchor matches once before you write. The memo's
  line numbers are a starting point, not a citation; re-read before editing.
- Do not touch `VocalLineEvent`, `apps/web/src/lib/shane/reconciliation/`, or
  `underlay-donor.ts`.
- No new strings. Every label this brief needs already exists in `i18n.ts`.
  If you find you need one, stop that item and list it under French owed.
- Do not build the phone landing, N.119, N.120, or N.122.
- Every claim in the memo carries a `path:line` you opened, or NOT
  ESTABLISHED. NOT ESTABLISHED beats a complete invented answer.

## 1. The goal, from the singer's seat

The four bands become three: PIECE, INPUT, SCORE MARKUP. The Notation toggles
and Analysis live inside INPUT, under the poem box, folded until the singer
opens them. Nothing under a closed band says anything unless there is
something to say. A closed band keeps its rounded corners. When a score is
waiting to be taken in, one button is filled, not two.

## 2. The changes, in order

### 2.1 Corners on a closed band (Dann's finding, twice)

Seen: at 1400 px, after closing INPUT by its chevron, the band's top corners
render square while the state line under it stays rounded; SCORE MARKUP at
rest showed the same; a reload clears it; not seen at 390 px.

Memo F1: rounding is only the parent's clip, `.group { border-radius: 20px;
overflow: hidden }` (`Drawer.svelte:1026-1030`); `.band-toggle` (`:1115`) and
`.band-state` (`:1167`) carry no radius; the only thing that moves on a state
change is `.band-body`'s entrance keyframe `translateY(-4px)` under
`animation: bodyIn` (`:1297-1309`). The memo's candidate cause, NOT proven: a
child transform promoting a layer under the parent's clip.

Do: reproduce first on a local production build (close a band at 1400 px,
screenshot). Then fix so the corners do not depend on the parent's clip
surviving a paint: give the first and last child of `.group` their own
radius, or isolate the group's stacking context, whichever you can show works
in the browser. Verify by screenshot after closing each of the three bands.
Report the cause you established and the fix, with lines.

### 2.2 TEXT folds into INPUT (RULED by Dann 2026-09-10 22:00, on trial)

Memo F2 names the sites: the four `<section class="group group-*">` in
`Drawer.svelte:1039-1059` with the shared `bandHead` snippet `:1024-1038`;
`BAND_IDS` in `sections.svelte.ts:93-99`; TEXT's contents in `+page.svelte`
`textGroup` `:4512-4606` (`NotationFields` `:4547-4559`, `AnalysisStation`
`:4560-4605`); INPUT's contents `inputGroup` `:4148-4246`, sole child
`IntakePanel`; `textStateLine` in `bandState.ts:138-150`, caller
`+page.svelte:2121`.

Do: remove the TEXT band. Render `textGroup`'s contents inside INPUT's open
body, under the poem box and its receipts, as one folded section whose
header row reads the existing `group.text` label with a chevron, closed by
default, and whose open and closed state joins the station store (a new
station id; the memo did not open `STATION_IDS`'s declaration, find it).
Notation and Analysis keep their own sub-stations inside it exactly as
today. `BAND_IDS.text` goes. Nothing else about INPUT moves.

DESK DEFAULT, wave-off is Dann's: the folded section sits below the receipts
and above `Transcribe and fit`, so the primary stays last in the band.

### 2.3 What the folded section says (RULED by Dann 2026-09-10 21:55)

Nothing at default. When one or more Notation toggles have moved, the
existing `text.state.changed` phrase (`i18n.ts:69`, `%s of %s changed`, count
from `notationDepartures()` `bandState.ts:119-128`) shows at the right end of
the section's header row, in the state-line style. `text.state.default`
(`i18n.ts:68`, `Grayson defaults`) is no longer shown anywhere; delete the
key in both languages and its French twin. `textStateLine` either goes or is
reduced to the changed case; say which.

### 2.4 One primary while a score waits (path rule: one primary)

Seen: after a `.musx` drop and before `Continue to analysis`, INPUT showed
`Continue to analysis` filled and `Transcribe and fit` filled, plus `Try
another file`.

Memo F7: `transcribeActs` is `canTranscribe && (doc.inputText !==
transcribedText || uploaderEl?.hasWaitingScore() === true)`
(`+page.svelte:3485-3487`); `Continue to analysis` renders only inside
`ui.kind === 'done'` (`ScoreUploader.svelte:804, 879`); `hasWaitingScore()`
is `ui.kind === 'done'` (`:546-548`). Both fill from the same fact.

Do, DESK DEFAULT: while a score is waiting (`ui.kind === 'done'`), `Continue
to analysis` is the one filled pill in INPUT and `Transcribe and fit` renders
unfilled; it fills again once the score is accepted if the text still needs
its act. Keep `handleTranscribe`'s behaviour unchanged (memo F7 lists its
four steps, `+page.svelte:2361-2394`); this is presentation only.

For N.121(c), in the memo and not in code: state in one paragraph what
`Transcribe and fit` still does for a singer now that text transcribes live
(N.112), given the memo's reading that step (2) runs `transcribeText()`
unconditionally and step (3) accepts a waiting score. Do not rename it.

### 2.5 INPUT's line after reload (Dann's finding)

Seen: after Cmd+R with Score markup active, INPUT's closed line read
`14 lines` alone; after switching to Transcription it read
`14 lines · 78 words · 0 / 146 placed`.

Memo F6: `inputStateLine` drops a part on its own zero (`bandState.ts:67-79`);
the caller passes `hasResults ? wordCount : 0` (`+page.svelte:2109-2117`);
`hasResults` is `lines.length > 0` (`:2048`), filled only when transcription
runs, which an effect does after the dictionary loads (`:2851-2858`). The
memo reads it as a timing race, not a tab-conditioned path, and could not
prove it.

Do: reproduce on a local production build (reload with Score markup active,
read the closed INPUT line, wait, read again). If the line completes on its
own once the dictionary-ready effect runs, report the timing and change
nothing. If it never completes until a tab switch, find what the switch
triggers and make the line follow the same signal. Report which.

### 2.6 `from score` on a `.musx` arrival (establish, do not build)

Seen: the Kabalevsky `.musx` arrival filled PIECE's five fields (title,
collection, composer, poet, translator) but PIECE's closed line carried no
`from score` tag; a `.musicxml` song shows the tag.

Memo F5: `pieceFromScore` is `doc.fromScoreFields.has('title')`
(`+page.svelte:4055`), set by `onScoreIngested(state, wm)` with
`wm = ingested.result.score.workMetadata` (`:3037-3039`,
`metadata-provenance.ts:164-171`); the MNX parser never sets `workMetadata`
(`mnx-parser.ts:743-755`), so a `.musx` arrival can never carry the tag.

NOT ESTABLISHED, and yours to settle: where the five filled PIECE fields
came from on that `.musx` arrival, if MNX carries no work metadata. Read the
arrival path and say. If the fields are filled from the file by another
seam, the tag should follow the same seam; propose the one-line fix in the
memo and do not build it. If they were filled some other way, say how.

## 3. Tests

`bandState.test.ts` and `sections.test.ts` exist (path pass, 27 tests).
Adjust them for the three-band grammar and the folded section; add one test
that the changed phrase is absent at default and present after one toggle.
Report the web-test count; the baseline moves, say to what.

## 4. The walk you run before you hand over, on a local production build

1. Fresh profile: INPUT open with the placeholder and the caption; the folded
   Text section closed under the box with nothing beside its header; PIECE
   and SCORE MARKUP closed with nothing under them.
2. Close INPUT at 1400 px: corners rounded. Same for the other two.
3. Paste a poem, drop `~/Downloads/Kabalevsky - Shakespeare - T05 Cupid laid
   by his brand, and fell.musx`: while it waits, one filled pill.
4. Open the folded Text section, flip one toggle, close it: `1 of 7 changed`
   beside its header. Flip it back: nothing.
5. Reload with Score markup active: INPUT's closed line, then after a few
   seconds, then after a tab switch.
6. 390 px: the same, and the bands persist across reload.

Record what you saw for each, with screenshots named in the memo.

## 5. Strings

None new. `text.state.default` deleted in both languages. French owed:
nothing, unless you had to stop an item under §0.

## 6. The memo

`docs/sessions/memo-path-pass-inc2_r1_2026-09-10.md`: what shipped, per
item, with lines; the cause established for 2.1; the timing finding for
2.5; the seam finding for 2.6; the N.121(c) paragraph; the walk record; gate
numbers; then a NOT ESTABLISHED section. Under 150 lines.
