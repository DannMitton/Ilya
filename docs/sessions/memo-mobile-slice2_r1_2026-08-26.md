# Memo: mobile slice 2, the loupe and the dock

For Dann. Branch `Shane`, floor `bcab673`. No commits, no ship. The working
tree holds the four new files and the two modified ones named here, plus the
brief. `docs/memory/INBOX.md` was already modified when I arrived and I did not
touch it.

**Awaiting your eye: the strings table in §3.** Twenty-one new keys, four
coined words, three coined phrases, and the rest adopted from French the file
already carries.

## 1. The notation face, measured first

**The face is Finale Maestro**, and one file serves the page, the loupe, and
the dock's duration glyphs.

- The spec is `apps/web/src/lib/shane/engine/notation-fonts.ts:39`: file
  `/fonts/finale-maestro/FinaleMaestro.otf`, metadata
  `/fonts/finale-maestro/FinaleMaestro.json`, CSS family `Finale Maestro`. It
  is the product default at `:42`, per your rulings of 2026-07-12 and
  2026-07-13.
- It is registered as a **document-wide** `FontFace` at `:53`
  (`document.fonts.add`), which is why any element on the page can set that
  family, not only the score.
- `VoiceProfilePane.svelte:394` holds the prepared font and `:664` hands it to
  `paginateScore` as `font` and `fontFamily`.
- Every glyph on the paper is drawn at
  `packages/score-parser/src/staff-renderer.ts:502-505`. `glyphAt` emits an SVG
  `<text>` carrying that family and the character from the prepared metadata.
  Noteheads, clefs, accidentals, rests, and flags all come from there. Stems,
  beams, barlines, and ties are drawn geometry, sized from the font's own
  engraving defaults.
- With no font loaded the renderer falls back to primitive ellipses and paths
  (`staff-renderer.ts:1052`, `:1064`). That is the font-lab and sandbox path,
  not production, and it also fires if the fetch fails.

**The finding slice 3 needs.** The package's glyph registry
(`packages/score-parser/src/smufl-metadata.ts:71-109`) carries only what a
STAFF draws, so it has noteheads, flags, accidentals, rests, and
`augmentationDot` (`:88`), and **no combined duration glyph**, because a staff
never draws one. Finale Maestro itself carries all five: `noteWhole`,
`noteHalfUp`, `noteQuarterUp`, `note8thUp`, and `note16thUp` are present in
`FinaleMaestro.json`'s `glyphBBoxes`, verified this session. Their SMuFL
codepoints are U+E1D2, U+E1D3, U+E1D5, U+E1D7, and U+E1D9.

So slice 3 has a choice, and it is worth making deliberately. Adding those five
to `SMUFL_CODEPOINTS` gives their METRICS through `prepareSmuflFont`, which is
what a control that must size a glyph precisely wants, and it changes what
`REQUIRED_GLYPHS` validates, so it reaches gate 5. This slice did not need the
metrics, only the characters, so `CorrectionDock.svelte:106-125` writes the
five codepoints locally and sets `font-family: 'Finale Maestro'` on the cells.
The duplication is deliberate and the comment there says so.

**The loupe needed none of this**, and that is the point of it being a view
transform: it clones the page's own SVG, so its glyphs are the page's glyphs by
construction rather than by agreement.

## 2. What changed

### New, four files

- **`apps/web/src/lib/shane/loupe.ts`** (128 lines). The loupe's arithmetic, pure
  and DOM-free, the `note-picker.ts` discipline. `parseSystemRange`,
  `systemIndexOf`, `measureWindow`, `nearestTarget`, `isDismissSwipe`, and the
  56 px swipe threshold.
- **`apps/web/src/lib/shane/loupe.test.ts`** (126 lines, 14 tests). Every
  expectation is built from the renderer's own stated rule, not read back out
  of a rendered page.
- **`apps/web/src/lib/shane/Loupe.svelte`** (410 lines). The floating loupe: the
  measure tag, the magnified clone, and the sage rectangle it puts on the page.
- **`apps/web/src/lib/shane/CorrectionDock.svelte`** (552 lines). The header row
  and the four stations.

### Modified, two files

**`apps/web/src/lib/i18n.ts:175-237`**, one block, 21 keys. No existing key was
edited or deleted.

**`apps/web/src/routes/+page.svelte`.**

- `:112-114` imports; `:20` the `PairingMap` type for the undo snapshot.
- `:463-487` the undo stack. A snapshot of `doc.corrections`, `doc.pairings`,
  and the selection, taken before each verb. **In memory only. No save site was
  added; N.27 stands.**
- `:489-498` `DURATION_KEY` and `durationWord`, so the readout and the Undo
  sentence speak the five duration words the app already ships.
- `:359`, `:513`, `:522`, `:552`, `:570`, `:578`, `:587`, `:607`, `:614` the
  nine `pushUndo` calls, one per correction verb. The verbs themselves are
  otherwise unchanged: same arguments, same functions, same results.
- `:693-695` `isPhone` and `phonePortrait`; `:2313` where they are set. **A
  phone is a smallest-side test**, not a width test. `isMobile` asks whether
  this frame is narrower than the page, and rotation flips it; the loupe is
  ruled for a phone in both orientations, and 932 by 430 is over the width
  breakpoint while being the same hand holding the same glass.
- `:708-782` the loupe's state and derivations: `loupeOpen`, `dockHeight`,
  `loupeAvailable`, the held measure and its label, the entry ids the loupe
  needs, the readout, and the Undo sentence.
- `:785-840` the three gestures: `handlePageTap`, `dismissLoupe`, and the swipe
  pair. `:2350-2353` binds them at the window beside the correction keys.
- `:2795` `class:loupe-up`; `:3548-3570` the page's two states in CSS.
- `:2940-2971` the two components, outside `.app-content`, beside the update
  toast.

### Untouched, deliberately

`VocalLineEvent`; everything in `apps/web/src/lib/shane/reconciliation/`;
`correction.ts`; `pairings.ts`; `CorrectionControls.svelte`;
`ShiftLyricsControl.svelte`; `Drawer.svelte` and the E.36 §1.4 anchors;
`PageFit.svelte`; `staff-renderer.ts`; `page-layout.ts`; `app.html`'s viewport
tag, which still carries no `maximum-scale` and no `user-scalable`, so the
browser's own pinch is intact.

### How the loupe magnifies

It finds the held measure's hit rectangles in the page that is already on
screen, takes the x window from the midpoint before its first note to the
midpoint before the next measure's first note, clones the system's own nested
`<svg>`, and shows it through a viewBox cropped to that window. **The page's
on-screen scale is measured**, not recomputed: the system element's own
`getBoundingClientRect().width` divided by its `width` attribute already
carries PageFit's transform and any browser pinch.

**2.4 times is applied to what is on screen**, not to the engraved page, and
that reading is a judgement I made because no source settles it. The phone
shows the true page as an oversized thumbnail and the loupe supplies the
readable zoom, so the multiplier that means anything is the one against what
the eye is failing to read. In portrait that gives 1.12 times the engraved
page, which is what the schematic's own arithmetic implies when it says a
three-entry measure fills 354 px. In landscape the page is not fitted at all,
so the same 2.4 is 2.4 times the engraved page, and the loupe is large. See §6.

## 3. The strings table, for your eye

Every row is new. Nothing existing was changed. `%m`, `%s`, `%t` are
substitutions.

| key | English | French | coined or adopted |
|---|---|---|---|
| `loupe.dockAria` | Drawer | Tiroir | adopted, `drawer.collapse` already says « tiroir ». Your ruling of 2026-08-26: one name for both containers |
| `loupe.measureTag` | m. %m · system %s of %t | mes. %m · système %s sur %t | **« mes. » COINED** as the abbreviation of « mesure ». « système » adopted (`upload.report.systems`), « sur » adopted (`footer.of`) |
| `loupe.measureTagShort` | m. %m | mes. %m | same coinage |
| `loupe.undo` | Undo: %s | Annuler : %s | adopted, `correct.restore` already opens « Annuler » |
| `loupe.undo.deleted` | note removed | note supprimée | adopted, `correct.delete` says « Supprimer » |
| `loupe.undo.dotOn` | dot added | point ajouté | « point » adopted (`correct.dot`); **« ajouté » coined here** |
| `loupe.undo.dotOff` | dot removed | point retiré | **« retiré » coined here** |
| `loupe.undo.lyrics` | syllables shifted | syllabes décalées | adopted, `shiftLyrics.title` is « Décaler les paroles » |
| `loupe.undo.restored` | corrections cleared | corrections effacées | « corrections » adopted (`correct.count`); « effacées » adopted (`input.clear` is « Effacer le texte ») |
| `loupe.station.duration` | Duration | Durée | « Durée » adopted (`correct.length`). The English is a relabel: the shipped word is `Length` |
| `loupe.station.pitch` | Pitch | Hauteur | adopted (`upload.report.pitchSubs`) |
| `loupe.station.accidental` | Accidental · Entry | Altération · Saisie | « Altération » adopted (`notePicker.accidentalAria`); **« Saisie » COINED** |
| `loupe.station.lyric` | Lyric | Texte | adopted (`station.textChanged`, `shiftLyrics.toEndOfLyric`) |
| `loupe.tuplet` | Tuplet | Nolet | **COINED.** Renders disabled |
| `loupe.rest` | Rest | Silence | adopted (`upload.report.events` says « silences »). Renders disabled |
| `loupe.tie` | Tie | Liaison | **COINED.** Renders disabled |
| `loupe.delete` | Delete | Supprimer | adopted (`correct.delete`). Visible word only; the accessible name stays « Supprimer cette note » |
| `loupe.pitch.step` | step | degré | adopted (`correct.stepUp` says « Un degré vers le haut ») |
| `loupe.pitch.octave` | octave | octave | adopted (`correct.octaveUp`) |
| `loupe.lyric.toEnd` | Syllables, to the end of the lyric | Les syllabes, jusqu'à la fin du texte | the clause after the comma is `shiftLyrics.toEndOfLyric` verbatim; **« Les syllabes, » coined** |
| `loupe.lyric.toNextOpen` | Syllables, to the next open note | Les syllabes, jusqu'à la prochaine note libre | the clause after the comma is `shiftLyrics.toNextOpenNote` verbatim; same coinage |

**Four coined words, in one list: « mes. », « Saisie », « Nolet »,
« Liaison ».** Plus three coined phrases: « ajouté », « retiré », and « Les
syllabes, ».

**No new string was written for four controls, on purpose.** The stepper arrows
speak `correct.prev` and `correct.next`; the dismissal chevron speaks
`drawer.collapse`; the duration glyphs speak `correct.len16th` and its four
neighbours; the accidental glyphs speak `notation.tool.flat` and its two.

**One collision you should know about.** Your ruling gives `Drawer` /
« Tiroir » to both containers. The desktop drawer's accessible name is still
`a11y.drawer`, which is `Controls` / « Commandes », ratified 2026-08-23 under
N.62 and asserted by `i18n.test.ts` against your own table. The dock says
`Drawer` and the drawer says `Controls`, so **the two containers do not agree
yet**. I did not change the ratified string: that is a desktop edit, and
desktop is untouched this slice. One line and one test line when you rule it.

## 4. What I looked at with my own eyes

Headless Chromium through Playwright against the dev server, viewport 430 by
932 and then 932 by 430, `isMobile` and `hasTouch` set, an iPhone Safari user
agent. The score is your engraved
`~/Downloads/Mussorgsky - Sunless 01 - Within Four Walls (engraved).musicxml`,
fed through the uploader and accepted. Every number below is a measurement.

### Portrait, 430 by 932

**State 1.** One page, six systems, 382 by 494.4 px at y 120.2, page opacity
`1`, `pointer-events: auto`. `document.body.scrollWidth` is 430.

**The tap.** A deliberately sloppy tap, 9 px right and 14 px below a
notehead's target centre, resolved to entry `m8-1-4` and raised the loupe.

**State 2.** The page is at **exactly the same box**, 24 / 120.2 / 382 / 494.4,
opacity `0.78`, `pointer-events: none`. Nothing reflowed, nothing resized,
nothing panned. The loupe stands at 24 / 143.2, 382 wide, 160 tall, with the
magnified measure 213 px wide centred inside it. 213 is 189.62 user units times
0.468 times 2.4 to the pixel. The tag reads **`m. 9 · system 3 of 6`**. The
readout reads **`D3 · Quarter`**. The dock is at the bottom edge, 430 by 429.
Its accessible name is `Drawer`. Four station labels: DURATION, PITCH,
ACCIDENTAL · ENTRY, LYRIC, in that order. Three cells render disabled: Tuplet,
Rest, Tie.

**Every control on the dock clears 44 by 44** in both orientations. I measured
each button's box and the failure list is empty.

**The sage rectangle.** 189.62 by 22 user units, stroke `rgb(139, 154, 125)`,
which is `--sage`. 22 units is exactly the four line gaps of the engraved
staff. It draws around the held measure and prints nothing.

**Stepping across a barline.** Four taps of the forward stepper carried the
insertion point from the last entry of m. 9 into m. 10. The tag changed to
`m. 10 · system 3 of 6`, the loupe re-drew on the new measure, and **the sage
rectangle moved with it**, from x 250.15 to x 439.77 in the same system.

**A duration, changed under the loupe.** Tapping the eighth cell changed the
readout from `B♭3 · Quarter` to `B♭3 · Eighth`, the loupe re-drew, and the
sage rectangle's width changed from 184.23 to 181.78 units, which is the page
re-engraving itself under the loupe with the shorter note. The pill appeared
reading **`↰ Undo: Quarter → Eighth`**.

**Undo.** One tap put the readout back to `B♭3 · Quarter`, put the rectangle
back to 184.23, and **the pill disappeared**, because nothing remained to
undo.

**The swipe.** A drag of 120 px down starting on the loupe sent both away in
one motion. The page returned to opacity `1` and `pointer-events: auto`. A tap
on another measure raised them again on `m. 14 · system 5 of 6`.

### Landscape, 932 by 430

**The dock moves to the left edge, 380 px wide, full height.** The chevron
turns to point left. The stations keep their order, their labels, and their 44
px floor.

**The dock measures 430 px tall against a 430 px screen with the Undo pill
present**, so nothing scrolls and nothing is out of reach. That took three
landscape-only values (`CorrectionDock.svelte:357-374` and `:521-523`) and
the reason is in §6.

**The page in landscape is 816 by 1056, unfitted**, because `isMobile` is a
width test and 932 is over the breakpoint. That is the shipped behaviour and
slice 1 measured the same. The consequence for the loupe is in §6.

A pitch verb in landscape: `A3 · Eighth` became `B3 · Eighth` and the pill read
`↰ Undo: A3 → B3`. The chevron sent both away.

### The reload

Two corrections on one entry in portrait, a step up and a duration change:
`C♯3 · Quarter` became `D♯3 · Eighth`. After a reload, the loupe and the dock
are absent, and raising the loupe on the same entry `m8-1-4` reads
**`D♯3 · Eighth`**. The corrections survived. **The Undo pill is absent after
the reload**, which is the ruled behaviour: the stack is in memory and the
corrections are the stored diff.

### Print

With the loupe up and the dock open, under print media: the loupe is `none`,
the dock is `none`, the sage rectangle is `none`, the selection outline is
`none`, and the page's opacity is `1`. **Nothing this slice added reaches the
sheet.**

I found and fixed one defect here on the way. The page's fade was still
animating when print laid out, so the sheet took the mid-flight value,
measured at 0.813. The print rule now kills the transition as well as the
opacity (`+page.svelte:3561-3570`).

### Desktop, 1400 by 900

**Untouched, verified rather than assumed.** No loupe, no dock, no sage
rectangle, page opacity `1` and `pointer-events: auto`, the page at its own 816
by 1056, a click still selects a note, and the drawer's correction station
still carries its full row list including both semitone verbs.

### The lyric station

Exercised on a separate run, with your text transcribed and syllables placed.
With the drawer's station cursor sitting on a placed syllable, all four lyric
cells go live, a forward shift moved the syllable off the held note (the
readout lost its `Ком` segment), the pill read `↰ Undo: syllables shifted`, and
one tap of the pill put the syllable back. See §5 for why the cells are usually
disabled.

## 5. Two findings about taps, both measured, neither fixed

**1. A page tap both raises the loupe and spends a syllable.** The shipped
delegated listener in `VoiceProfilePane` calls `handleNotePick`, which places
the pending syllable on the tapped note and advances the station cursor. That
is unchanged from before this slice. But the ruled tap grammar gives a page tap
one meaning, which is choose the measure, and no placement verb appears in it
anywhere. So on a phone with lyrics waiting, a tap meant to pick a measure
silently consumes a slot. **I did not remove it**, because removing shipped
function is not "the shipped verbs re-homed", and because placement would then
have no gesture at all on a phone. It wants your ruling.

**2. The lyric verbs' anchor did not travel with them.** Both shift scopes
anchor on the note holding the syllable under the DRAWER's station cursor
(`+page.svelte:325`, confirmed with you 2026-08-14), and the dock carries no
cursor control. Combined with finding 1, every page tap re-places a slot and
advances that cursor onto an unplaced one, so **the LYRIC cells read disabled
in the ordinary phone flow**, and going live means opening the drawer, moving
the cursor, and coming back without touching the page.

The schematic answers this on its own, in §4: it labels the station
`LYRIC · TAKE A NOTE TO SHIFT ITS SYLLABLE`, which reads as the taken entry
being the anchor on this surface. That is a behaviour change rather than a
re-homing, so I did not make it. **It is the single thing that would most
improve this dock**, and it is one line.

## 6. Where I departed from the schematic, and why

**The DURATION and ACCIDENTAL cells carry glyphs, not words.** The schematic
draws glyph cells and the arithmetic requires them: seven word cells at
"Sixteenth" width wrap to two rows, and four wrapped stations do not fit 430 px
of landscape height. The glyphs come from the page's own face, which is what
the design's own NOT ESTABLISHED note asks for, and the shipped word is the
accessible name of each cell. Where the font has not loaded, the words draw
instead.

**The LYRIC station is two rows, not one.** The shipped shift verbs are a
label with two arrows, and re-homing them faithfully brings that shape. The
schematic's single five-cell row belongs to a different set of verbs, two of
which (Extend, Release) the brief struck. This costs 48 px of landscape height,
which is exactly the Undo pill's row, and it is why the dock needed the three
tightened landscape values.

**The loupe stands clear of the measure it holds.** Centring it in the free
space put it over system 3 whenever system 3 was the system being worked on,
which hid the sage rectangle behind the loupe most of the time. It now takes
the room below the mark, then the room above, then the centre
(`Loupe.svelte:234-258`). Nothing on the paper moves; this places a floating
object.

**The loupe and the dock sit above the install prompt.**
`InstallPrompt.svelte:114` is z-index 9000 and raises itself six seconds into
every iOS Safari session, and at any lower value it lands on the LYRIC station
where a thumb cannot reach it. I measured that happening. The loupe and dock
take 9100. The prompt is untouched and returns the moment the loupe goes away.
**Say the word and I will invert it**, but a dock a thumb cannot reach is not a
dock.

**The insertion bar is the shipped selection mark, not Speedy's bar.** The
schematic draws an insertion bar bisecting the notehead with a pitch crossbar
and inward triangle termini. What the loupe shows is the sage outline the page
already draws on a selected note, magnified. Drawing Speedy's bar is new
geometry that no ruling required this slice, and the brief's own line is that
the verbs are re-homed rather than new. Magnified, the shipped mark reads as a
tall capsule around the entry, because the note's group box includes the
transparent hit rectangle that makes a 7 px notehead tappable. **You will
notice it. It is the one thing on this surface I would redraw next.**

**Landscape's loupe is large, and the cause is upstream of this slice.** The
page is not fitted in landscape, so 2.4 times is 2.4 times the engraved page
rather than 2.4 times a thumbnail: 504 by 294 on a 430 px screen. Making
landscape miniaturize means changing `isMobile`, which drives PageFit on both
Studio documents and is a width test that desktop shares. Out of scope, and
named here rather than nudged.

## 7. Gate results, run just now

Gate 4 moved, and it moved because I added tests.

| gate | baseline | got |
|---|---|---|
| 1 phonology | `216 passed (216)` | `216 passed (216)` |
| 2 dictionary | `235 passed (235)` | `235 passed (235)` |
| 3 web-check | `found 0 errors and 7 warnings in 4 files` | same |
| 4 web-test | `800 passed (800)` | **`814 passed (814)`** |
| 5 score-parser | `461 passed \| 5 skipped (466)` | same |

**The fourteen are `loupe.test.ts`, all new, none of them touching an existing
test.** `~/Downloads/ilya-ship.sh:79` says 800 and will refuse until it says
814. **I did not edit it.** The four new files and the brief are untracked, so
the script refuses on those first in any case.

## 8. Not established

- **The right ink step between the page's two states.** 0.78 is a first
  reading, not a derivation. The schematic draws roughly one value of contrast
  and settles no number, and its own note says too little makes the state
  change invisible while too much makes the page look disabled.
- **Whether 2.4 should multiply the thumbnail or the engraved page.** I chose
  the thumbnail and gave the reasoning in §2. No source settles it, and the
  landscape case in §6 is what the choice costs when the page is not
  miniaturized.
- **Coarse-pointer behaviour.** Every number here is CSS geometry in a
  fine-pointer browser with touch emulation on. The 44 px floor is verified in
  the DOM and unverified on glass, and whether a thumb picks the right measure
  out of six systems is still the first thing a phone walk should test.
- **The dense-page case.** One Mussorgsky song at six systems on one page. A
  plate of twelve dense systems is the case that would break the whole
  treatment, and it remains untested.
- **Thumb reach for a left-anchored dock in landscape.** The schematic says so
  and nothing here changes it.
- **Whether the loupe's own placement rule reads well in motion.** The loupe
  moves when the dock grows, which it does when the Undo pill appears: measured
  at 25 px in portrait. The page never moves. Whether the loupe shifting under
  its own furniture is restless is a judgement I cannot make from a
  screenshot.
- **A long Undo sentence in landscape.** The dock fits 430 px exactly with a
  short pill. A sentence long enough to wrap the pill onto a second line adds
  a row and the dock scrolls, which it handles, but I did not measure the
  French worst case (« Annuler : Double croche → Ronde »).
- **iOS Safari specifically.** Everything here is Chromium. Two things I would
  want a real Safari to confirm: that `pointerup` gives the swipe the same
  numbers, and that a `position: fixed` dock behaves under Safari's collapsing
  toolbars.
- **Whether the semitone verbs are meant to be retired everywhere.** The
  desktop-adaptation note says they stay retired; the shipped drawer still
  carries them (`CorrectionControls.svelte:135-142`), and I confirmed they are
  still there on a 1400 px desk. The dock does not carry them, per the brief.
  Desktop was out of scope, so I left the discrepancy alone.
- **French.** Ten new rows and four coined words, none of which you have seen.

## 9. Housekeeping

I started a dev server on port 5174 for the walk and **stopped it**. Nothing
was copied into the repository's static directories. The walk scripts and
screenshots live in this session's scratchpad, outside the tree.
