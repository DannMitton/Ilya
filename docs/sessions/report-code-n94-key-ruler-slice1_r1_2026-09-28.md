# Report from Code: N.94, the Transposition ruler, slice 1

Written by Code (Claude Opus) 2026-09-28, about 21:30, against the brief
`brief-code-n94-key-ruler_r1_2026-09-28.md`. Read on branch `Shane` at HEAD
`03bed5a`. The working tree was dirty at the start only in
`docs/memory/STATE.md` and the brief itself. Nothing is committed, staged, or
pushed. Dann ships.

**Naming, ruled by Dann 2026-09-28 21:14:** the control is the Transposition
ruler. The code follows: `TranspositionRuler.svelte`, `transposition-ruler.ts`,
`transposition-ruler.test.ts`, `transpositionRulerStops`,
`transpositionRulerOpen`, `ontranspositionrulerclose`, and the CSS classes
`.transposition-ruler` and `.transposition-ruler-anchor`. Every comment that
said "key ruler" now says "Transposition ruler". The dated records keep their
names, as the ruling says: the drawings, the brief, and this report, whose
file name is the one the brief's §7 prescribes. The three remaining mentions
of `key-ruler` in code are those dated file names
(`i18n.ts:1767`, `transposition-ruler.ts:4`, `TranspositionRuler.svelte:4`).
Gates re-run after the rename, with the same numbers as the gate table.

## What the singer gets now

On a desk, with a score whose key declares a mode, the Piece band reads "Key:
**D major**, as printed" with a **Try another key** pill. The pill brings
Markup forward and floats the ruler over the page. The ruler opens on Ilya's
recommendation, and the engraved page underneath is already redrawn in that
key. Tapping another stop redraws the page again. **Use this key** keeps it:
the page's header prints "Transposed down a minor third from D major, at the
singer's choice.", and the band reads "Key: **B major**, transposed" with an
**As printed** pill that returns in one tap. **Cancel** and Escape put back
what was there. The printed score is never altered.

Test it on `http://localhost:5173` (the dev server that is already running).
The Vercel preview will not show this until you commit and push.

## What I built

### The engine, `packages/score-parser`

The package edit was not refused.

- `KeyChoice` and `KeyStop`, `packages/score-parser/src/transposition.ts:235` and `:243`. A choice is two numbers: the tonic's move in semitones, and the first signature's new fifths. One number cannot tell B major from C flat major.
- `transpositionRulerStops`, `transposition.ts:282`. One stop per signature from seven flats to seven sharps in the printed mode. The move is the tonic's, folded to -6..+6. The tritone key appears at both ends. Enharmonic twins are separate stops, sorted side by side, sharp key first, as the drawing sets them. A source with no mode still gets stops, carrying no mode.
- `engraveInKey`, `transposition.ts:331`. It moves every `keySignatures` entry and every `measures[].keySignature` by the same fifths, keeping the mode, and folds a later key past seven accidentals to its twin. It moves every vocal pitch by the semitones. It returns the input itself at no move and the printed signature. It changes values only: `VocalLineEvent`'s shape is untouched.
- **One departure from the brief's wording, DESK DEFAULT.** §3.1 says to spell each pitch with `spellPitch` against the target key. Diatonic notes are spelled that way. Chromatic notes keep their printed spelling, moved by the tonic's interval (`letterShift` and `carrySpelling`, `transposition.ts:367` and `:378`), and fall back to `spellPitch` past a double accidental. The evidence is a census of Sunless 1 that I ran in the browser, counting accidentals with the renderer's own `advanceAccidentalState`:

  | Spelling of chromatic notes | Printed D major | Sharp-side stops | C major and flat-side stops |
  |---|---|---|---|
  | `spellPitch` tier 2 (the brief's wording) | 18 | 18 | 27 |
  | Carried by interval (shipped) | 18 | 18 | 18 |

  Tier 2 turns Mussorgsky's lowered degrees into the wrong notes. The flat sixth in bar 2, B flat, became G sharp in C major and B natural in E flat major. In E flat major the B natural then forces a flat back onto the next note in the same bar. Carried, the flat sixth stays a flat sixth: A flat and C flat. This also keeps any spelling the singer set by hand, which §3.1 asks for (see "What I could not establish", item 1). If you want tier 2 back, it is the four lines inside the `vocalLine` map in `engraveInKey`.
- `transposeScore` is unchanged, and so are its tests.
- `packages/score-parser/src/index.ts:80`: `engraveInKey`, `transpositionRulerStops`, `KeyChoice`, and `KeyStop` are exported. **This is a second package file**, beside the one §3 named. The app cannot import the function without it.

### The app

- `apps/web/src/lib/markup/transposition-ruler.ts`: the words and the numbers of the ruler, pure and tested. `printedKey` (`:47`), the stop labels (`:82`), the readout (`:100`), the band line (`:111`), the page header (`:127`), where the ruler opens (`openingStops`, `:147`; `rulerOpening`, `:185`), and the guard that applies a stored key only when the printed key offers it (`appliedChoice`, `:166`).
- `apps/web/src/lib/markup/TranspositionRuler.svelte`: the floating ruler of plate 2. The printed key is boxed, the selection circled, and the runner-up dotted. Pairs sit under a faint bracket. There are no tick marks. The arrow keys move the selection and Escape cancels. It carries its own zero-height sticky anchor, so it rides over the page in view and moves no page.
- `apps/web/src/lib/markup/PieceKeyLine.svelte`: the band line of plates 1 and 3.
- `apps/web/src/lib/markup/MarkupPane.svelte:574-583`: the seam §2 named. `printedReading` is the old octave derivation; `readingScore` is now that engraved in the drawn key (`drawInKey`). The analysis, the watch band, the render, and the loupe bundle all read `readingScore`, so they describe the key on the page. The drawn key is the ruler's selection while it is open, else the song's choice, so Cancel restores the page by construction. `:721-725` computes where the ruler opens, once per opening and untracked, against the printed key's sung order. `:1031` mounts the ruler. `:1047` passes the header line.
- `apps/web/src/lib/components/Paper/TitleHeader.svelte:44` and `:113`: an optional `note` line under the metadata, in the document's label ink. Absent, no page moves.
- `apps/web/src/routes/+page.svelte:1339-1356`: open state, the printed key, the song's key, and the handlers. `:3636` closes the ruler on a song switch. `:4379` mounts the band line. `:4924-4927` wires the pane.
- `apps/web/src/lib/analysis/watchlist.ts:569` and `:578`: `keyTonic` and `keyName` are exported rather than copied, so the ruler names keys exactly as the watch band does.

### Where the choice is stored, and why

On the song, as `SongRecord.transposition?: KeyChoice`
(`apps/web/src/lib/library/types.ts:127`). It follows `seatedText`'s pattern:
optional, absent means as printed, no schema bump. It rides the existing save
path, so no second save site was added: `SongFields` (`library.ts:60`),
`fieldsFromRecord` (`:87`), `recordFromFields` (`:100`, `:116`), and
`validateRecord` (`:204`), which accepts only whole numbers within -6..+6 and
-7..+7 and otherwise calls the record malformed without carrying the value.
`SongDocument.transposition` (`document.svelte.ts:90`) joins the snapshot, so
editing it autosaves.

Why the song: the key is a fact about this song as the singer sings it, and a
switch of song has to carry its own. Why two numbers: CONTRACT §6 forbids
storing anything derived, so the page engraves the key afresh from the printed
score on every render. Measured in the pane after **Use this key**: the
IndexedDB `songs` record held `{"semitones":-3,"fifths":5}` and nothing else
changed.

If the singer later replaces the score with one in another key, the stored
choice is not a stop of the new key, so the page opens as printed
(`appliedChoice`).

## Strings

All nine of §6's rows are in `i18n.ts:1768-1776`, verbatim, with the
no-break space before the French colon. The header's interval is the adopted
`watch.intervalPhrase.one` form, and key names come from `watch.key.*`.

The readout family that §6 instructed me to build, `i18n.ts:1777-1788`. Every
French word is adopted from `watch.interval.*` with « d’ » removed and a
capital added, plus the ruled « plus bas » and « plus haut ». I coined none.

| key | English | French |
|---|---|---|
| `key.ruler.down` | Down {a} | {a} plus bas |
| `key.ruler.up` | Up {a} | {a} plus haut |
| `key.ruler.interval.1` | a semitone | Un demi-ton |
| `key.ruler.interval.2` | a whole tone | Un ton |
| `key.ruler.interval.3` | a minor third | Une tierce mineure |
| `key.ruler.interval.4` | a major third | Une tierce majeure |
| `key.ruler.interval.5` | a perfect fourth | Une quarte juste |
| `key.ruler.interval.6` | a tritone | Un triton |

The stop labels are the `watch.key.letter.*` names with the drawing's ♭ and ♯
glyphs: « si♭ », « do♯ ».

## Desk defaults taken

1. Chromatic notes carry their printed spelling (see "The engine").
2. **The printed stop's readout is the key name alone**, "D major". The ruled table has no row for the zero move, and the grey box already says "as printed".
3. **The direction row under the stops** ("lower, as printed, higher") is not drawn. Its words are not in the ruled table.
4. **A source with no mode gets no ruler in this slice.** The engine gives it stops (§3.2's default holds there), but every ruled line names a key, starting with "Key: {key}, as printed", so drawing it needs copy you have not seen.
5. **On a phone, "Try another key" is not offered**, because the ruler's phone form is plate 4, which is slice 2. "As printed" stays, so a key chosen on a desk can be undone anywhere. Ilya treats any frame whose shorter side is under 768 px as a phone, and that includes the collapsed Browser pane.
6. **The header line prints whenever the page is drawn in another key**, including while the ruler is open. A transposed page never goes unlabelled.
7. **The octave is resolved in the printed key, and the new key is engraved over it.**
8. **Ratchets raised** (gate 8). `MarkupPane.svelte` 1358 to 1389 and `+page.svelte` 6028 to 6057, in `scripts/ratchets.json`. Both ceilings equalled the files' exact lengths. I moved the ruler, the band line, and the logic into four new modules first, which took the pane from +110 lines to +31. What remains is imports, props, and the one derivation, and it has to live in those files. Suggested commit line: "ratchets: MarkupPane +31 and +page +29 for N.94's props and seam; the ruler, band line, and logic are new modules."

## Gates

| Gate | Baseline | Now |
|---|---|---|
| 1 phonology | 251 passed | 251 passed |
| 2 dictionary | 235 passed | 235 passed |
| 3 web-check | 0 errors, 12 warnings in 5 files | 0 errors, 12 warnings in 5 files (the same 12; none in a touched file) |
| 4 web-test | 1666 passed | **1677 passed** (+7 `transposition-ruler.test.ts`, +4 `library.test.ts`) |
| 5 score-parser | 616 passed, 5 skipped (621) | **631 passed, 5 skipped (636)** (+15 `transposition.test.ts`) |
| 6 blurb | 145 passed | 145 passed |
| 7 integration | 55 passed | 55 passed |
| 8 ratchets | OK | OK, after the two ceilings in desk default 8 |

`ilya-ship.sh` needs its gate 4 and gate 5 strings moved to `1677 passed
(1677)` and `631 passed | 5 skipped (636)`, or it refuses. I did not edit it.

The staff-renderer approval tests pass unchanged:
`packages/score-parser/src/approval/staff-renderer.approval.test.ts` (6 of 6)
and `apps/web/src/lib/approval/staff-renderer-real-fixture.approval.test.ts`.

The §5 tests are in `transposition.test.ts:391` and `:486`. They check that
the signature and every measure snapshot move, and that D major down a minor
third lands in B major with no accidental on a diatonic note. They check that
the same move to C flat major spells every note with a flat, and that a zero
move returns the input itself. The file also tests every stop of D major
against the renderer's accidental rule, the flat sixth from Sunless 1 bar 2,
and the double-accidental fallback. `transposeScore`'s own tests are
unchanged.

## Screenshots

Sunless 1 (`sunless-01-engraved.musicxml`), taken in the Browser pane at
`http://keyruler.localhost:5173` with a 1440 by 1000 viewport. The test voice
had a range of A flat 2 to B3 and no measured vowels. Against Sunless 1's line
(C sharp 3 to D4), that range makes Ilya recommend down a minor third, with B
flat as the runner-up.

- `docs/sessions/n94-slice1-en-1-as-printed_2026-09-28.jpg`
- `docs/sessions/n94-slice1-en-2-ruler-open_2026-09-28.jpg`
- `docs/sessions/n94-slice1-en-3-after-use_2026-09-28.jpg`
- `docs/sessions/n94-slice1-fr-1-as-printed_2026-09-28.jpg`
- `docs/sessions/n94-slice1-fr-2-ruler-open_2026-09-28.jpg`
- `docs/sessions/n94-slice1-fr-3-after-use_2026-09-28.jpg`

Also walked in the pane: Cancel after sliding to E, "As printed", Escape, the
printed stop's readout, **Try another key** from the Text document (Markup
comes forward), and a reload (the song comes back in its stored key, ruler
closed). In French no stop label overflows its slot. Measured: no label wider
than its button and no two stops overlapping.

## §4, songs that change key

None. I scanned 57 score files in the tree that carry a key, MusicXML and MNX,
and none changes key within a part.

## What I could not establish

1. **Hand spellings from the corrections are not reachable in `score-parser`.** The corrections are applied in the page shell (`correctedScore`, `+page.svelte`) before the score reaches the package, and nothing on a `VocalLineEvent` says which spellings were set by hand. I did not route around that. The carried spelling keeps a hand spelling of a chromatic note anyway, because it carries every printed spelling. A hand spelling that respells a DIATONIC pitch class enharmonically (G flat for F sharp in D major) is respelled to the key by `spellPitch`'s tier 1. NOT ESTABLISHED whether that ever occurs in a singer's corrections.
2. **The correction dock while the page is transposed.** The loupe clones the page, so it shows the new key. The correction verbs edit the printed pitch (`correction.ts`, `currentPitch` over the read line), so a step made on a transposed page changes the printed note and the page redraws it transposed. I did not walk this. NOT ESTABLISHED whether the dock names the printed pitch or the drawn one, and whether a singer would read that as a jump.
3. **The watch band in the new key.** It reads `readingScore`, so it should describe the page's key, and its own range line then suggests from the new key. The test voice had no measured vowels, so the band was withheld on both keys and I saw neither. NOT ESTABLISHED live.
4. **Insights does not follow the chosen key.** It reads `correctedScore`, the printed key (`+page.svelte`, the `InsightsPane` props). That matches §3.7 ("Try this key" is slice 2), but after **Use this key** Markup and Insights describe different keys. This is yours to rule for slice 2.
5. **Printing.** The ruler's anchor carries `@media print { display: none }`, and I confirmed the rule is in the live stylesheet. I did not print a page. NOT ESTABLISHED on paper.
6. **Redraw speed.** I did not control a timing, so I report none.
7. **Legibility in the most remote keys.** Carried spelling writes C flat major's flat sixth as A double flat and E double flat (the census, stops -3/-7, -1/-5, and +4/-6). That is correct engraving and a real reading cost. Whether those three stops belong on a singer's ruler is taste, and yours.
8. **The zero-move twin.** A song printed in C sharp major gets a D flat major stop at no move. The page header for it would read "Transposed from C sharp major, at the singer's choice." with no interval. No fixture is in C sharp or C flat, so I have not seen it drawn.

## Two things in the tree that are not mine

- `ARCHITECTURE.md` was modified at 21:15 during this session, 21 lines added and 11 removed, on the dictionary package and `+page.svelte`. I did not write it and did not touch it.
- My first edit script for `MarkupPane.svelte` ended with a line that emptied the file. The file was clean at the start of the session, so I restored it from `HEAD` with `git show` (read-only) and reapplied my edits. Nothing of anyone else's was in it.

## Addendum, 2026-09-28 about 21:55: the brief's addendum of 21:40, carried out

Read on branch `Shane` at HEAD `03bed5a`, working tree dirty with slice 1 as
above. Nothing is committed, staged, stashed, or pushed. This section
supersedes three things above: desk default 1 (the spelling), desk default 8
(the raised ratchets), and the gate table.

### 1. The spelling rule, and its one exception

`engraveInKey` now carries EVERY note by the tonic's interval, diatonic or not
(`packages/score-parser/src/transposition.ts:330`; the doc comment at `:305`
quotes the ruling of 21:35). Before, a diatonic pitch class was spelled by
`spellPitch` against the new key. The two agree on every printed note that is
spelled as the key spells it, so Sunless 1 and every earlier test draw the same
page. They differ only on a note printed with an enharmonic spelling of a
diatonic pitch, which now moves by the interval like every other note.

The exception is `fewerAccidentals` (`transposition.ts:388`). A carried note
past a double accidental is respelled on the neighbouring letter it points to:
a triple flat on the letter below, a triple sharp on the letter above, at the
same pitch. Double sharps and double flats that result stay.

Tests, in `packages/score-parser/src/transposition.test.ts`:

- `:441`: the ruled case. B double flat, moved down a chromatic semitone
  (D major to D flat major, the same letter), comes out as A flat. The pitch is
  checked too. The same test takes C double sharp up a chromatic semitone (C
  major to C sharp major) to D sharp.
- `:455`: a composer's double accidental moved by a plain interval stays
  double. F double sharp up a major second is G double sharp; B double flat
  down a major second is A double flat.
- `:464`: replaces the old "falls back to the key speller" test. G double flat
  from D major to C flat major would be F triple flat; it is now E double flat.
  Before, it was D.

**One reading is mine, INFERENCE, and yours to overrule.** The ruling says "its
enharmonic with fewer accidentals". For B triple flat there is only one sensible
answer, A flat. For F triple flat there are two: E double flat (the neighbouring
letter, two accidentals) and D (no accidentals). I chose the neighbouring letter,
because it departs least from the interval's number, and the ruling keeps
doubles. If you want the fewest accidentals instead, the change is the one loop
in `fewerAccidentals`, and the test at `:464` changes with it.

### 2. Both ceilings restored

`scripts/ratchets.json` is back to HEAD exactly: `MarkupPane.svelte` 1358 and
`+page.svelte` 6028. No ceiling was raised. The files now measure 1312 and
6010. The ratchet script says both ceilings could be lowered to those numbers;
I left them where the addendum put them, so lowering is yours.

How the lines left:

- **The ruler's wiring moved into one object**,
  `apps/web/src/lib/markup/transposition-ruler-state.svelte.ts` (new, 101
  lines). It holds the open state, the ruler's selection, the printed key, the
  song's choice, and the drawn key. It also closes the ruler on leaving Markup
  or switching song. `+page.svelte` builds it once (`:1341`) and hands the one
  object to the band line (`:4336`) and to the pane (`:4880`). The four props,
  the handlers, the effect, and the extra line in `switchSong` are gone.
- **`MarkupPane.svelte` takes one prop**, `keyRuler` (`:256`). The seam is one
  line (`:553`), the opening search one effect (`:692`), the mount one line
  (`:954`), and the header one attribute (`:969`).
- **`TranspositionRuler.svelte` and `PieceKeyLine.svelte` take the object**
  instead of six and five props. `transposition-ruler.ts` gained only the
  `RulerOpening` type.
- **Two pieces of existing code moved out unchanged in behaviour**, because
  the wiring alone could not reach the ceilings:
  - The Markup profile's status words (`countWord`, `statusLine`,
    `provisionalParts`, `listSep`) went to
    `apps/web/src/lib/markup/profile-status.ts` (new), with their comments.
    The pane keeps two derived lines (`MarkupPane.svelte:920-921`).
    The test voice has no measured vowels, so these lines never render on
    the test origin. I pinned them with a new test,
    `profile-status.test.ts` (4 tests), against the English and French strings
    in `i18n.ts`.
  - `calculateDrawerWidth`, a pure function, went to
    `apps/web/src/lib/components/Drawer/drawer-width.ts` (new), unchanged.

### Gates, re-run after both changes

| Gate | Baseline (`ilya-ship.sh`) | Now |
|---|---|---|
| 1 phonology | 251 passed | 251 passed |
| 2 dictionary | 235 passed | 235 passed |
| 3 web-check | 0 errors, 12 warnings in 5 files | 0 errors, 12 warnings in 5 files (the same 12; none in a file this work touched except `+page.svelte:4767`, the old tabindex warning) |
| 4 web-test | 1666 passed | **1681 passed** (slice 1's +11, and +4 `profile-status.test.ts`) |
| 5 score-parser | 616 passed, 5 skipped (621) | **633 passed, 5 skipped (638)** (slice 1's +15; this addendum +3, -1) |
| 6 blurb | 145 passed | 145 passed |
| 7 integration | 55 passed | 55 passed |
| 8 ratchets | OK | **OK with no ceiling raised** |

`ilya-ship.sh` needs its gate 4 and gate 5 strings moved to `1681 passed
(1681)` and `633 passed | 5 skipped (638)`, or it refuses. I did not edit it.

### Walked again in the Browser pane, after the rewiring

On `http://keyruler.localhost:5173`, Sunless 1, 1440 by 1000:

- The band read "Key: **D major**, as printed". **Try another key** opened the
  ruler on B, with B flat dotted, and the page header was already drawn.
- Tapping E redrew the header as "up a whole tone"; **Cancel** closed the
  ruler, removed the header, and left the band as printed.
- **Use this key** kept B major: the page drew five sharps, the band read
  "Key: **B major**, transposed", and the IndexedDB record held
  `{"fifths":5,"semitones":-3}`.
- **As printed** returned in one tap. **Try another key** from the Text
  document brought Markup forward with the ruler open. Going to Insights and
  back closed it. The arrow key moved the selection to C flat, and Escape
  cancelled.
- A reload came back in B major with the ruler closed. In French, the band,
  header, readout, and both pills read as ruled.
- No console error and no uncaught exception during the walk.
- I left the test origin as I found it: as printed, in English.

I did not retake the six screenshots. The page is drawn the same, so the
captures above still show it.

### What I could not establish, for this addendum

- **Whether any real score reaches the triple-accidental exception.** The
  exception needs a double accidental in the print and a stop that adds one
  more. I did not search the fixtures for printed double accidentals. NOT
  ESTABLISHED.
- **Whether the change from spellPitch to carrying moves any diatonic note on
  a real score.** It can only change a note printed with an enharmonic
  spelling of a diatonic pitch. The unit tests and the Sunless 1 walk show no
  change, but I did not run the stop-by-stop census across the other fixtures
  again. NOT ESTABLISHED beyond Sunless 1.
