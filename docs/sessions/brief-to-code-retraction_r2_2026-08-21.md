# Brief to Code: every header retracts, the score box says less, and the syllable text joins Shift Lyrics

**Serves N.65. Written 2026-08-21. Floor: `2238e8b`, branch `Shane`.**

**This supersedes `brief-to-code-retraction_r1_2026-08-20.md` whole. Build from
this document and do not open r1's §B.6, which is wrong.**

**SHIP A OF r1 IS IN HISTORY AT `80c5e47` AND IS NOT YOURS TO REBUILD.** The
older-Finale disclosure is deleted, six i18n keys went with it, and the rule
above the voice anchor is lavender. Its memo is
`docs/sessions/retraction-shipA_r1_2026-08-20.md`.

Read `docs/memory/CONTRACT.md` in full first, including tether 17 and tether 18.

**ONE SHIP.** Everything below is ship B. It ends in a deploy and a walk.

```
SEQUENCE POSITION
item:        N.65, the drawer's stations, ship B.
serves:      Dann's ruling that every header retracts, and two corrections he
             made on his walk of `2238e8b` on 2026-08-21.
blocked on:  Nothing.
done when:   §B.10.
displaces:   Nothing. `Print` moving to the desk head is the next ship after
             this one, and §B.6 explains why this ship leaves `Print` alone.
```

---

## B.0 What you cannot read, and what that costs you

**You cannot read `claude/`.** Every ruling this brief depends on is quoted
here verbatim rather than cited. Where you want more, `docs/memory/STATE.md`
is in the repository and you can read it.

---

## B.1 What retracts

Dann, on his walk: *"I'd like a retraction chevron applied to every header.
Every header begins a section that is retractable and expandable."*

**Every station that has a header.** As the tree stands that is Piece
(METADATA), NOTATION, SOURCE, REPERTOIRE, ANALYSIS, and SHIFT LYRICS.
**Including the pinned anchors:** a retracted anchor is still pinned, it is
just short.

**THE VOICE ANCHOR IS EXCLUDED AND THIS IS DANN'S EXPLICIT RULING.** It has a
header and no contents: a dot, a status, and a button on one line. There is
nothing to retract, and collapsing it would hide `Calibrate`, the only entry to
the ritual, for no height. His words: *"I agree with you about the voice anchor,
yes, Calibrate needs to be visible."*

**SYLLABLES IS NOT ON THIS LIST, AND AS OF §B.8 IT HAS NO HEADER TO PUT A
CHEVRON ON.** Its content becomes SHIFT LYRICS's content and retracts with it.

**One station has no header at all: Output.** See §B.6.

## B.2 One mechanism, and it already exists

`Drawer.svelte` holds `expandedSections` as a `Set<string>` with a
`toggleSection(id)`, driving Learn and Guide's table of contents through
`.toc-chevron` and `.toc-children`. **Extract it so the drawer has one
mechanism. Do not write a second.**

`NotationFields.svelte:96-106` already does exactly what this asks, correctly,
including `aria-expanded`. **It is the pattern, not the exception.** Every other
station gets the same chevron, in the same position, at the same size.

**The native `<details>` element stays for asides**: one mechanism for
structure, one for asides.

## B.3 The chevron's direction is already ruled and already cost a repair

**It points the way the panel will grow.** Down when shut, up when open, for a
panel that opens downward. Do not re-derive it. `NotationFields.svelte:256-272`
carries the rule in a comment above its two rotations, written after the N.73 S3
walk repair.

## B.4 The open set persists per device

One new key, `ilya:` namespaced like the others. **Say the exact key string in
the memo.**

**One exception, deliberate: NOTATION does not join the persisted set.**
`+page.svelte` states the reason in its own comment: "a remembered collapse
hides the toggles from a singer who forgot they exist." It keeps its ruled
collapsed-on-arrival default. **Do not tidy this away.**

**An unrecognised or corrupt stored value falls back to the first-run default
and does not throw.** N.73 S3 ship two established that pattern for
`ilya:activeTab`; follow it.

## B.5 First run

**Piece and Source open, everything else closed.** That is what stops a new
singer meeting a wall of shut headers.

## B.6 There is no Output station, and `Print` stays where it is this ship

**AMENDED 2026-08-21. r1's §B.6 is wrong in one respect and you must not follow
it.** It told you to move `Print`, `Export this song`, and `Import a song` into
SOURCE together, and to accept that collapsing SOURCE hides `Print`. Dann ruled
that consequence away on 2026-08-20 night by moving `Print` off the drawer
altogether. His words: *"Can we take Print out of the Drawer entirely and
install a consistent Print button on the right side of the Transcription / Score
Markup selector on the paper GUI side?"* Then, correcting a reading he had not
been given: *"to be clear I dont want a control on the paper. I want it to float
next to the Transcribe / Score Markup selector."*

**THAT MOVE IS THE NEXT SHIP, NOT THIS ONE, AND THE REASON IS A REGRESSION YOU
WOULD OTHERWISE SHIP.** `RootPanel.svelte:338-344` is the only `Print` control
in the application. `DeskHead.svelte` does not have one yet. If this ship
deletes `Print` from the row, no singer can print anything between this deploy
and the desk-head build. **So `Print` stays in the row exactly as it is today,
and the desk-head ship removes it.**

**What this ship does instead.** The row moves into SOURCE and becomes the score
field's action row, exactly as `Clear text` and `Transcribe` are the textarea's.
Dann dissolved the naming question rather than answering it: *"I do not think we
need an Output section articulated. What I want is the appearance that the
Print/Export/Import row shares the same relationship to the score field as the
Clear text/Transcribe row does to the text field above it."*

**So: no label, no heading, no chevron, and no orphan-control problem.** Both
pairs belong to SOURCE.

**BUILD THE RELATIONSHIP, NOT A STATION.** The gap from the score box to that
row matches the gap from the textarea to `Clear text` and `Transcribe`.
**Report all four measurements: each field's bottom edge and each row's top
edge.** They must differ by the same number.

**The measurement you already made says this is now possible.** On `80c5e47`
you measured 6.00 px from the textarea to its row and 20.00 px from the score
box to the Print row, and you correctly refused to force them equal while they
sat in different stations. Inside one station they are the same quantity.

**CONSEQUENCE, AND IT IS TRANSIENT.** Collapsing SOURCE takes `Print` with it
until the desk-head ship lands. SOURCE is open on first run, so a singer meets
this only by collapsing it themselves. **Build it that way, say so in the memo,
and do not solve it.**

**The line that goes between them is §B.7. Read that before you set the gap.**

## B.7 The score box says one sentence. RULED BY DANN 2026-08-21

Dann, walking `2238e8b`: *"I would like the text inside the score input field to
include only that first sentence 'Drop a score here or click to browse...' with
an ellipsis just like its sister box above. The text 'MNX, MusicXML, etc..' can
exist outside the input field just underneath it."*

**Inside the box:** `Drop a score here or click to browse…`, with the ellipsis
character `…`, which is the character its sister already uses at
`i18n.ts:49` (`input.placeholder`, `Paste Russian text here…`). Nothing
else changes about the placeholder: same one element, same treatment, same
position, per Dann's ruling of 2026-08-20 that these two fields look like each
other.

**Outside the box:** the format list, as its own line, immediately below the box
and above the action row of §B.6.

**Today it is one string in one element.** `i18n.ts:306`
(`upload.drop.placeholder`) carries both sentences, rendered at
`ScoreUploader.svelte:531-533` as a single `<p class="dz-placeholder">`.

**NO NEW FRENCH IS NEEDED AND YOU MUST NOT WRITE ANY.** Contract §6: do not
write French Dann has not seen. Three retained keys already carry both halves in
both languages, orphaned when the three-paragraph version was collapsed:

| key | line | en | fr |
|---|---|---|---|
| `upload.drop.title` | `i18n.ts:310` | Drop a score here | Déposez une partition ici |
| `upload.drop.browse` | `i18n.ts:311` | or click to browse | ou cliquez pour parcourir |
| `upload.drop.acceptedNow` | `i18n.ts:312` | Accepted now: MNX, MusicXML, .mxl, Finale (.musx), MuseScore (.mscz), PDF, a photograph | Acceptés maintenant : MNX, MusicXML, .mxl, Finale (.musx), MuseScore (.mscz), PDF, une photographie |

**Assemble from these rather than writing new English or new French.** Whether
you join `.title` and `.browse` at the render seam or fold them into one new key
is yours; if you make a new key, its two strings are the existing two joined by
a space with the ellipsis appended, and nothing else.

**ONE DIFFERENCE YOU MUST REPORT RATHER THAN SILENTLY RECONCILE.**
`upload.drop.acceptedNow` ends `PDF, a photograph` with no full stop, while the
sentence on screen today ends `PDF, or photograph.` with one. **Use the retained
key as written, name the difference in the memo, and leave it for Dann.**

**`upload.drop.release`** (`i18n.ts:313`) is the drag state and keeps its own
sentence in the same one treatment. Nothing here touches it.

**A CONSEQUENCE WORTH MEASURING, NOT A BLOCKER.** The watermark behind this
placeholder is known to collide on a 360 px phone: the current sentence wraps to
five lines and fills 120 px of a 152 px box, over the whole 41.6 px glyph band.
**A one-sentence placeholder is shorter, so re-measure that overlap at 360 x 640
and report the number.** Do not change the watermark.

## B.8 The syllable text joins Shift Lyrics. RULED BY DANN 2026-08-21

Dann, walking `2238e8b`: *"I'm bothered by the elements here. I think we should
eliminate the Syllables header and make the boxed syllabified text the first
element under the Shift Lyrics header followed by the 'to the End of the Lyric'
row."*

**And, ratified the same minute, on the desk's recommendation and named as the
desk's:** the `0 / 4` counter moves to the right end of the SHIFT LYRICS header
row, which is where it sits now relative to its own header, so nothing moves in
his eye except the word beside it.

**The order he wants, top to bottom:** the lavender rule, then the SHIFT LYRICS
header carrying the counter, then the boxed syllabified text, then `to the End
of the Lyric`, then `to the Next Open Note`.

**What is where today.**

- `SyllableStation.svelte:106` gates the whole station on `slots.length > 0`.
- `:108-111` is the `.station-head` div: an `<h3>` from `station.syllables`
  (`i18n.ts:630`) and the `.station-count` span at `:110`.
- `:112-117` is the `.station-drift` line, which renders only when `drift > 0`.
- `:118-128` is the `.station-text` paragraph, which is the boxed text he
  points at, with its `.slot` buttons and its cursor.
- `ShiftLyricsControl.svelte:63` draws its header through `StationHeader`.
- **The lavender rule is `ShiftLyricsControl.svelte:119`, a `border-top` on
  that component's own root.** Move the text inside that component and the rule
  ends up above the whole merged station with no work.
- The two are adjacent siblings at `+page.svelte:2086-2094`.

**Delete `station.syllables` only if it has no other consumer. Check, and report
what you found.** Ship A's memo records that the six keys it deleted each had
exactly one consumer, and that check is the reason it was safe.

**WHERE THE COUNTER GOES, AND THE TREE ALREADY ANSWERED THIS.**
`StationHeader.svelte` documents the slot in its own header comment: "a second
child of the `<h3>`, with `.station-label` taking `display: flex;
justify-content: space-between; align-items: baseline`." **That is the counter's
home. Use it rather than inventing a second arrangement.**

**THE COLLISION YOU WOULD OTHERWISE HIT, SOLVED HERE.** §B.1 puts a chevron on
the SHIFT LYRICS header, and `.notation-disclosure` takes the full width with
`justify-content: space-between`, so the chevron wants the right end and so does
the counter. **The chevron stays outermost right, because a chevron that sits in
a different place on one header than on every other breaks the pattern Dann
ruled.** The counter sits immediately to its left. Left to right:
`SHIFT LYRICS`, then space, then the counter, then the chevron.

**TWO DEFECTS THAT FOLLOW FROM THE MOVE, AND BOTH ARE YOURS TO SOLVE.**

1. **`0 / 0` on an empty drawer.** `SyllableStation` renders only when
   `slots.length > 0`, and `ShiftLyricsControl` always renders. Moving the
   counter onto a header that is always there would show `0 / 0` before a
   singer has pasted anything. **Render the counter only when the total is
   greater than zero.**
2. **The drift line.** `.station-drift` uses `.station-count` too and is not
   part of what Dann named. **Keep it with the text, not with the header**, and
   say in the memo where it landed.

**The count is derived inside `SyllableStation` from `pairings` and `slots`.**
Whichever component owns the header now needs those two numbers. Deriving them
once in `+page.svelte` and passing them down is the obvious route; if you find a
better one in the tree, take it and say why.

## B.9 What NOT to build

- **No phone exclusivity.** Any number of stations open, on both displays.
  Dann's standing position is "we leave this to the user," he has been asked
  twice, and he has not granted an override.
- **No auto-collapse on populate.** "Calm Authority means the drawer does not
  fidget. Nothing else ever moves without the user." The retraction is the
  singer's gesture.
- **No closed-header status line.** A right-aligned quiet status on every shut
  header ("defaults", "no profile yet") is wanted eventually, but **that copy is
  Dann's and he has not written it.** Build the structure so the slot can be
  added later without rework, and say where it would go. **Do not invent the
  strings.** Note that §B.8 now puts the counter in that slot on one header;
  say whether the two can coexist there or whether a decision is owed.
- **Do not move `Print` to the desk head.** That is the next ship. See §B.6.
- **Do not touch the watermark**, only measure it. See §B.7.
- **Do not write French Dann has not seen.**

## B.10 Ship B done when

Dann walks these on a deploy.

1. Every station listed in §B.1 opens and shuts on a click of its header, on
   the desk and on the phone, and every one shows a chevron.
2. Every chevron points down when shut and up when open.
3. **Shutting the metadata anchor gives the middle its height back. Measure
   `.drawer-content`'s `clientHeight` with metadata open and shut, at 430x932,
   390x844, 393x727, 375x667, and 360x640. Ten numbers.**
   **The coordinating desk's expectation, stated before the measurement: shut
   returns roughly 270 px, and the middle clears 365 px at every one of the five
   sizes.** 365 is `RootPanel.svelte`'s `.console-placeholder-body` reserve.
4. A reload restores the open set exactly, except NOTATION, which is collapsed
   again by design.
5. A fresh browser opens with Piece and Source open and everything else shut.
6. Any number of stations can be open at once on the phone.
7. The voice anchor has no chevron and `Calibrate` is visible at all times.
8. The score box shows one sentence ending in an ellipsis, and the format list
   is a line of its own between the box and the action row. **Both languages.**
9. The gap from the score box to its action row equals the gap from the textarea
   to `Clear text` and `Transcribe`. **Report all four edges.**
10. There is no SYLLABLES header anywhere. The boxed syllabified text is the
    first thing under the SHIFT LYRICS header, and `to the End of the Lyric`
    follows it.
11. The counter sits at the right of the SHIFT LYRICS header, left of its
    chevron, and does not appear at all before a singer has pasted text.
12. Clicking a syllable still moves the cursor, and clicking a notehead still
    places it. **The move must not cost the gesture.**
13. The 360 x 640 watermark overlap is re-measured and reported.
14. Five gates at baseline: 216, 235, 0 errors and 7 warnings in 4 files, 682,
    444 passed and 5 skipped. **Ask Dann before moving any count.**

---

## The memo

`docs/sessions/retraction-shipB_r1_2026-08-21.md`, committed with the ship.

It carries: what shipped with `path:line`; every place the tree disagreed with
this brief and which you followed; the measurements each done-list item asks
for; the gate counts; every decision this brief did not rule, stated as a
decision; and **NOT ESTABLISHED**, with what would settle each.
**NOT ESTABLISHED BEATS A COMPLETE INVENTED ANSWER.**

---

## NOT ESTABLISHED at the time of writing

1. **Whether the closed-header status slot and the syllable counter can share
   one header.** §B.8 puts the counter in the slot `StationHeader` reserves for
   the status line. Only SHIFT LYRICS is affected. Settled by Dann, once he
   writes the status copy.
2. **The populated Inspector's height.** 365 px is what the placeholder
   reserves. The figure it was chosen against sits in a document this desk has
   not opened.
3. **Whether the metadata anchor collapses to exactly its header.** The
   302.7 px figure is the open block on a phone, measured on `63c2bb4`. The
   collapsed height is not established. Settled by §B.10 item 3.
4. **Whether a real window resize leaves `bind:clientHeight` stale**, which you
   raised on the silhouette pass. Not this brief's to settle, but if you see it
   while working, say so.
5. **Whether the full stop belongs at the end of the format line.** See §B.7.
   Dann's, one character.

---
*Written by the coordinating desk, 2026-08-21. Supersedes
`brief-to-code-retraction_r1_2026-08-20.md` whole, whose ship A is in history at
`80c5e47` and whose §B.6 is wrong.*
