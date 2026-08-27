# Memo: mobile slice 3, the entry grammar

For Dann. Branch `Shane`, floor `d9d1191`, which is slice 2 whole. No commits,
no ship. Six files are dirty: two new, four modified, plus the brief.

**Awaiting your eye: the strings table in §3.** Eleven new keys, three coined
French phrases.

**Gate 4 moves 822 to 862. Gate 5 does not move**, and §6 says why the glyph
codepoints your brief allowed were not needed.

## 1. How the diff schema grew

Additively, by four optional fields on `NoteCorrection`
(`correction.ts:76-96`). Nothing was removed, nothing was renamed, and
`VocalLineEvent` was not touched.

| field | what it says |
|---|---|
| `entered?: { after: string \| null }` | this entry is not in the read; the record IS the entry |
| `type?: 'note' \| 'rest'` | note or rest, overriding what the read said |
| `tied?: 'start' \| 'none'` | a tie to the entry that follows, or its removal |
| `tuplet?: TupletInfo` | the hand-defined group this entry belongs to |

**A map written by slice 1 or slice 2 carries none of them, reads back
identically, and behaves as it always did.** No new save site: N.27 stands, and
what changed is what a record may SAY, not where it lives.

### The four decisions inside that

**The anchor is an id, never an index** (`:76`). An index into the read moves
when the reader's next pass finds one more event, and the entry would land
somewhere else. `after` may name a reader event or another hand-entered one, so
several entries in one gap are a chain whose order cannot be ambiguous.

**The namespace is `hand:`, with a colon, and the colon is load-bearing**
(`entry.ts:146`). `migrateCorrectionIds` decides an id is the old four-segment
reader form by counting DASH-separated segments (`correction.ts:354`), so a
synthetic id carrying dashes could be re-keyed into nonsense at load. `hand:7`
has one segment and passes through untouched. A test asserts that, rather than
the comment carrying it alone.

**Numbers are never reused** (`entry.ts:161`). The highest ever issued sets the
floor, so an undone entry does not hand its name to the next one and leave a
stale reference pointing at a different note.

**`type`, `tied` and `tuplet` are overrides, not flags**, unlike `deleted`.
`deleted` is `true` or absent because absence has a natural meaning there. Here
three states are real for each: as read, forced one way, forced back. A boolean
could carry two of the three.

### What `applyCorrections` does with it

`correction.ts:305-360`. It gathers the entered records by the entry they
follow, emits the head chain first, then walks the read emitting each event and
the chain hanging off it. `synthesize` (`:411`) builds an event the renderer can
draw: **the measure is the anchor's, and the onset is the anchor's plus the
anchor's own length.** The renderer draws barlines off `measureIndex` and keys
its per-measure accidental state to it, and it spaces on durations rather than
on onsets, so `measureIndex` is the field that has to be right and the onset is
the field that has to be honest.

**Entries hung off a deleted note still stand.** The singer deleted the
reader's note, not their own work.

**`orphanIds` had to learn the difference** (`:564`). A hand-entered entry is
never in the read, so measuring it against the read would report every one of
them lost the moment it was made. It is judged by its ANCHOR instead, and a
chain is orphaned or kept whole.

**Slice 1's note about tuplet fractions is superseded, and the comment says so
where it stood** (`:391`). That ship kept the parser's fraction under a tuplet
because it could not change one and had no input to recompute from. This ship
defines tuplets, so the ratio IS the input.

## 2. What changed

### New, two files

- **`apps/web/src/lib/shane/entry.ts`** (359 lines). The grammar, pure and
  DOM-free: the cursor and its walk, the arrival pitch, entry, the rest
  conversion, the tie conditions, and the tuplet definition.
- **`apps/web/src/lib/shane/entry.test.ts`** (353 lines, 40 tests).

### Modified, four files

**`correction.ts`**: the four fields, the entered-entry branch in
`applyCorrections`, `tupletFraction` exported (`:448`), the pruning rule taught
that an entered record is never empty, and `orphanIds` taught about anchors.

**`i18n.ts:241-283`**, one block, 11 keys. No existing key was edited.

**`+page.svelte`**:

- `:469` `correctedLine`, and **every selection and every walk moved onto it**.
  They had to: an entry the singer entered exists nowhere in the read.
- `:495-520` the cursor. `selectedEventId` is still the entry selection,
  because the drawer, the page's own mark, and the keyboard all read it and
  none of them knows about gaps; `gapAfter` is the second state, where
  `undefined` means not in a gap and `null` means the gap before the first
  entry.
- `:527` the armed duration. A gap has no selection, so something has to be lit
  for Rest to enter "of the lit duration".
- `:761-830` the entry verbs: the duration cell, the dot, Rest, Tie.
- `:854` press-and-hold, 400 ms before the first repeat and 110 ms between,
  ending on `pointerup`, `pointercancel`, and `pointerleave` alike.
- `:884-915` the Nolet row's state, including the one that makes Undo behave.

**`CorrectionDock.svelte`**: the Nolet row (`:329` and `:345` are its two
snippets), the gap-aware station labels and disabled states, Rest and Tie made
live, and the hold wired to the stepper and the pitch verbs.

### One departure from the schematic, on purpose

The schematic's §4 reads Speedy strictly: a duration typed in a gap with no
pitch enters a REST. **Your brief rules the other way** for this surface, so a
duration enters a NOTE at the arrival pitch and Rest is the cell that enters a
rest. The brief is the later instruction and it is the one built. Named here
rather than buried, because the schematic is the document a later slice will
read.

## 3. The strings table, for your eye

| key | English | French | coined or adopted |
|---|---|---|---|
| `loupe.gap` | gap after %s · the next duration enters here | intervalle après %s · la prochaine durée s'inscrit ici | **« intervalle » COINED** for the place between two entries; the sentence's shape is the schematic's own |
| `loupe.gapHead` | before the first entry · the next duration enters here | avant la première entrée · la prochaine durée s'inscrit ici | « entrée » adopted from slice 2's « Saisie » register |
| `loupe.station.pitchTakes` | Pitch · takes the pitch of %s | Hauteur · prend la hauteur de %s | « Hauteur » adopted; **« prend la hauteur de » COINED** |
| `loupe.station.pitchMiddle` | Pitch · arrives on the middle line | Hauteur · arrive sur la ligne médiane | « ligne médiane » is the standard term, adopted |
| `loupe.station.lyricTake` | Lyric · take a note to shift its syllable | Texte · prenez une note pour décaler sa syllabe | every word adopted: « Texte », « note », « décaler », « syllabe » |
| `loupe.nolet.of` | of | de | adopted |
| `loupe.nolet.inSpaceOf` | in the space of | dans l'espace de | **COINED**, and it is the phrase the whole row turns on |
| `loupe.nolet.back` | Back to durations | Retour aux durées | « Durée » adopted (correct.length) |
| `loupe.nolet.more` | One more | Un de plus | adopted |
| `loupe.nolet.fewer` | One fewer | Un de moins | adopted |
| `loupe.nolet.step` | Next value | Valeur suivante | adopted |
| `loupe.undo.entered` | entry added | entrée ajoutée | adopted |
| `loupe.undo.rest` | rest changed | silence modifié | « Silence » adopted (upload.report.events) |
| `loupe.undo.tie` | tie changed | liaison modifiée | « Liaison » ratified by you 2026-08-26 |
| `loupe.undo.tuplet` | tuplet defined | nolet défini | « Nolet » ratified by you 2026-08-26 |

**Three coined French phrases: « intervalle », « dans l'espace de », « prend la
hauteur de ».** Everything else is adopted from French already in the file or
from your slice 2 ratification.

## 4. What I looked at with my own eyes

The walk subject is the brief's own: the Lamm page-read of Without Sun song 1,
read through the browser reader in the harness. **57 notes, 0 rests, 0 ties, 0
tuplets**, which is the read the record describes. Headless Chromium, 430 by
932 then 932 by 430, touch emulation on. Each step states its expectation and
its likeliest failure before the measurement, per the control rule.

| step | expected | got |
|---|---|---|
| 1. the bar steps into a gap | the readout stops naming a note | `E4 · Quarter` became `gap after E4 · the next duration enters here`, and the PITCH label read `Pitch · takes the pitch of E4` |
| 2. a duration in the gap | one more note, at the previous pitch | 57 notes became 58, readout `E4 · Eighth`, arrival confirmed, pill `↰ Undo: entry added`; one step up made it `F4 · Eighth` |
| 3. Rest in a gap | one more rest glyph | 0 became 1, readout `Rest · Eighth` |
| 4. a note converted and converted back | the note that was there, not the arrival guess | `G4 · Quarter` → `Rest · Quarter` → `G4 · Quarter` |
| 5. a tie | offered between two entered notes of one pitch, and drawn | Tie enabled, tie marks 0 became 1 |
| 6. the Nolet row | three quarters become a triplet, live | one bracket, reading `3`, the row reading `▲3▼ of ♩ in the space of ▲2▼ of ♩` |
| 7. a custom ratio | live re-application, still one Undo | the row read `5`, the page held one bracket, the pill still read `↰ Undo: tuplet defined` |
| 8. Undo, one class at a time | one tap reverses the whole tuplet | brackets went to 0 on one tap, then the tie on the next, then the entry |
| 9. the reload | every entered entry survives | 60 notes and 1 rest before, **60 notes and 1 rest after**, orphan notice absent |
| 10. landscape | the same sentences, the floor held | gap sentence and Nolet row identical, **zero 44 px breaches** |

**The reload is the one that matters most**, because it is the ship's own
constraint: the page is re-read from its stored bytes, the reader runs again,
and the hand-entered entries came back with it, unorphaned.

### Four defects the walk found, all fixed

**1. A converted rest forgot its pitch.** `G4` converted to a rest and back came
back as `D4`, which was the arrival guess. `applyCorrections` drops the pitch
from a converted rest, so the drawn event no longer carries one, and the record
had never held a pitch of its own to return to. `entry.ts:214` writes the pitch
down on the way out. Pinned by a test that goes through the drawn line, which
is the path that failed.

**2. The readout said nothing about the only change the singer had made.** A
rest read `Eighth` alone, and a rest converted back and forth read
`F4 · Eighth` both ways round. `+page.svelte:1093` leads with the word and
drops the pitch.

**3. A definition whose run crossed a barline drew TWO brackets.** The renderer
keys its grouping on the measure (`staff-renderer.ts:841`), so one definition
became two groups. `entry.ts:312` refuses a run that crosses one, which is also
the engraving answer: a tuplet is a division inside one measure.

**4. The triangle pairs broke the 44 px floor.** The first pass drew 22 px
targets, making a pair 60 px against the ruled 88, on the only control in this
slice that could break the floor. `CorrectionDock.svelte:907` gives each target
44 px with a small mark inside it, which is the schematic's own arrangement:
this is the one place on this surface where the target and the mark are not the
same rectangle.

### One regression a SHIPPED test caught, before the walk

`recognized-to-musicxml.test.ts:365` is N.97b's acceptance test on a real
captured page. A rest the READER read can carry a pitch correction: the id
resolves, the correction lands, and the pitch is inert because the renderer
draws the rest and never reaches it. My first pass dropped the pitch from every
rest and broke it. **Only the singer's own conversion drops one now**
(`correction.ts:377`), and the interaction is pinned in `entry.test.ts` rather
than left to the older test to catch again.

## 5. Gate results

| gate | expected | got |
|---|---|---|
| 1 phonology | `216 passed (216)` | `216 passed (216)` |
| 2 dictionary | `235 passed (235)` | `235 passed (235)` |
| 3 web-check | `found 0 errors and 7 warnings in 4 files` | same |
| 4 web-test | `822 passed (822)` | **`862 passed (862)`** |
| 5 score-parser | `461 passed \| 5 skipped (466)` | same |

**Gate 4 moves 822 to 862**: 40 in `entry.test.ts`, and every one of the four
walk defects and the one regression is pinned among them.
`~/Downloads/ilya-ship.sh:79` says 822 and **needs to say 862. I have not
touched it.**

**Gate 5 does not move, and your brief allowed it to.** The five duration
codepoints were not needed: slice 2 already measures glyph ink at runtime
through canvas `measureText` (`CorrectionDock.svelte:248`), and the Nolet row's
duration boxes draw through that same path at the same scale as the DURATION
station. Adding entries to `SMUFL_CODEPOINTS` would buy metrics nothing here
asks for. **The finding still stands for whoever needs the metrics rather than
the characters**, and `smufl-metadata.ts` is untouched.

## 6. Not established

- **Whether an entered entry should re-time its measure.** It does not. An
  entry entered into a full measure makes that measure longer than its time
  signature says, and nothing here complains. Finale would beam and re-bar
  around it; this diff records what the singer entered and the renderer draws
  it. **The likeliest first complaint from real use**, and it wants a ruling
  rather than a guess.
- **A definition that cannot land says so only by greying.** Where the run does
  not fit, the row still reads and still steps and the page does not change.
  Principle 8 asks the sentence to carry the state; here the greying carries it
  alone. No string was invented for it.
- **The tuplet takes the run starting at the selection**, forward only, and
  applies the definition's value to every entry in it. That is a reading of
  "the selected entry and the following entries of matching total duration",
  and it is the reading that makes the drawn bracket agree with the notes under
  it. A definition that should instead adapt to what is already there is a
  different rule nobody has ruled.
- **Press-and-hold is unverified on glass.** The timings are Chromium's, and
  110 ms between repeats is a judgement rather than a measurement.
- **The dock scrolls in landscape while the Nolet row is open**, 504 against
  430, so `touch-action` relaxes to `pan-y` there and the swipe-to-dismiss is
  unavailable for as long as the row is open. The chevron still dismisses. That
  is one gesture out of three, in one state, in exchange for a station a thumb
  can reach.
- **The two lyric anchors still disagree on purpose**, and everything else
  carried from slice 2's list stands: the ink step, the 2.4 reading, the dense
  page, coarse-pointer behaviour, iOS Safari specifically, and the whole-note
  scale.
- **French.** Eleven keys and three coined phrases, none of which you have
  seen.

## 7. Housekeeping

The dev server on port 5174 is stopped. Nothing was copied into the
repository's static directories. Walk scripts and screenshots are in this
session's scratchpad, outside the tree.

---

## 8. Appended: the two amendments

Ruled by Dann after reading this memo. Both are built and walked on the same
Lamm page read.

### Amendment 1. « intervalle » is struck

`i18n.ts:262`. The gap sentence drops its noun in both languages and the
English is reshaped to match, so the two say the same thing in the same shape.

| key | English | French |
|---|---|---|
| `loupe.gap` | after %s · the next duration enters here | après %s · la prochaine durée s'inscrit ici |
| `loupe.gapHead` | before the first entry · the next duration enters here | avant la première entrée · la prochaine durée s'inscrit ici |

`loupe.gapHead` needed no change: it already named no object. **Two coined
French phrases remain in this slice, not three**: « dans l'espace de » and
« prend la hauteur de ».

Walked: the readout reads `after E4 · the next duration enters here` and
« après E4 · la prochaine durée s'inscrit ici ».

### Amendment 2. The overfull bar, and the tag that carries it

No blocking, no re-timing, the page silent: that is what the build already did
and it is unchanged. What is new is the tag.

`entry.ts:381` is `measureFill`, pure and tested: what a measure holds against
what its signature asks for, or **null where the two agree**, so a well-timed
measure says nothing and the tag does not become a running commentary on
arithmetic that is fine. `+page.svelte:554` reads the measure's OWN signature,
snapshotted per measure by the parsers, so a mid-score change of metre is
answered correctly rather than measured against the opening bar.
`Loupe.svelte:413` composes it.

`i18n.ts:293`: `m. %m · %a of %e`, « mes. %m · %a sur %e ». **« sur » is
adopted from `footer.of`**, which is already how this app says "of" between two
numbers in French. Nothing is coined.

**Both numbers are in the signature's own beat, and NOT reduced.** Your example
is `7 of 6`, which is seven eighths where six belong in 6 by 8: the second
number is the signature's own numerator, so the arithmetic reads against the
signature printed in front of the singer. My first pass reduced the ratio, and
the walk showed what that costs: a measure holding twenty-four quarters in
4 by 4 read `6 of 1`, which is true, unreadable, and names no number the page
shows. The unit is refined only where it must be, so four quarters and an
eighth in 4 by 4 reads `9 of 8` rather than `4.5 of 4`.

**A short measure counts too.** The rule you gave is disagreement, not
overfullness, and a measure a deletion left short is as much worth saying. The
arithmetic says which way it went without needing a second sentence.

**The cost of the ruled text, named rather than hidden**: on a disagreeing
measure the tag says the arithmetic INSTEAD of the system, because the tag you
wrote is the whole tag. So `m. 10 · system 3 of 6` becomes `m. 10 · 7 of 6` and
the singer loses the system clause exactly where the bar is wrong. Both
clauses together would be one more string.

### What I looked at, both amendments

| check | expected | got |
|---|---|---|
| the gap sentence | no noun, both languages | `after E4 · …` and « après E4 · … » |
| an untouched measure of the read | the tag names the system | **`m. 2 · 6 of 1`**, see below |
| a whole note entered into it | the tag says what the bar holds | `m. 2 · 10 of 1` |
| undoing back to the read | the tag stops latching | back to `m. 2 · 6 of 1` |
| French | « sur », not « de » | « mes. 2 · 10 sur 1 » |

### The finding that matters, and it is the risk I named before the measurement

**On the Lamm page read the tag shows arithmetic on an untouched measure**, so
it will rarely name the system on that document. The read's own durations
disagree with the metre it read, before the singer touches anything. That is
not a defect in the ruling or in the arithmetic: it is the read being wrong
about itself, which is what N.95 measured when it found 0 of 28 durations
confident and what this whole track exists to let a singer fix.

I can derive the signature's numerator from the numbers and I did not measure
the signature itself. `expected` is `beats × unit ÷ beatType` with `unit` at
least `beatType`, so `expected = 1` forces **`beats = 1`**: the reader gave
that measure a one-beat metre. The denominator I cannot name from here, and the
metre READ is recorded in STATE as unbuilt, so **NOT ESTABLISHED** rather than
guessed. Worth your eye, because it decides whether the tag reads as a useful
alarm or as noise on any page-read document.

### Gates, re-run after both amendments

| gate | expected | got |
|---|---|---|
| 1 phonology | `216 passed (216)` | `216 passed (216)` |
| 2 dictionary | `235 passed (235)` | `235 passed (235)` |
| 3 web-check | `found 0 errors and 7 warnings in 4 files` | same |
| 4 web-test | `822 passed (822)` | **`871 passed (871)`** |
| 5 score-parser | `461 passed \| 5 skipped (466)` | same |

**Gate 4 is now 871**, up from the memo's 862: nine more in `entry.test.ts` for
`measureFill`, including your own `7 of 6` read back as a test.
`~/Downloads/ilya-ship.sh:79` says 822 and **needs to say 871. I have not
touched it.** Gate 5 still does not move.

### One more defect the amendment walk found, fixed

**Undoing an entry dismissed the loupe.** The undo snapshot recorded
`selectedEventId` and not the gap half of the cursor, so restoring it set the
selection to null while leaving `gapAfter` alone, which is no cursor at all,
and the effect that keeps the loupe standing took it down. Every entry is made
from a gap and every gap pushes a null selection, so this fired on the most
ordinary undo there is. `+page.svelte:607` snapshots the whole cursor now.

---

## 9. Appended: the tag carries both clauses

**The floor moved while this was being built: §1 through §8 shipped as
`320bf3a`**, "N.92: mobile slice 3, the entry grammar", nine files including
the brief and this memo. So everything above is in history, and this section's
change is the only slice 3 work still in the working tree: `i18n.ts` and
`Loupe.svelte`, plus this memo. `docs/memory/INBOX.md` is also dirty and is not
mine.

Ruled by Dann after reading §8, amending his own ruling of the same day: where
the arithmetic fires the tag says the system AND the count. It answers the cost
§8 named, which was that a tag dropping the system exactly where the bar is
wrong takes the singer's place away at the moment they most need it.

### The one new string, for your eye

| key | English | French |
|---|---|---|
| `loupe.measureTagBoth` | m. %m · system %s of %t · %a of %e | mes. %m · système %s sur %t · %a sur %e |

`i18n.ts:300`. **Nothing is coined**: every word is already in the file.
« système » is adopted from `upload.report.systems`, and « sur » from
`footer.of`, which is how this app says "of" between two numbers in French.

**One thing to look at rather than a defect.** The French line carries « sur »
twice, once for the system count and once for the ratio: « mes. 2 · système 2
sur 4 · 10 sur 1 ». Both are correct and both are the adopted word, and the
English does the same thing with "of". It reads a little repetitively in
French, and the alternative would be coining a second word for one of the two
senses, which costs more than the repetition does. **Left as it is, and named
so you can overrule it.**

### The four forms, which is what this makes

`Loupe.svelte:413`. The short form is not retired: it is what a page whose
systems cannot be read still says, and that is the same relationship
`measureTagShort` has always had to `measureTag`.

| the measure | the systems | the tag |
|---|---|---|
| agrees | known | `m. 10 · system 3 of 6` |
| agrees | unknown | `m. 10` |
| disagrees | known | `m. 10 · system 3 of 6 · 7 of 6` |
| disagrees | unknown | `m. 10 · 7 of 6` |

Each form says everything it knows and no form invents what it does not.

### What I looked at

Same Lamm page read, 430 by 932.

| check | expected | got |
|---|---|---|
| the first measure | both clauses | **`m. 1 · system 1 of 4 · 29 of 8`** |
| mid page | both clauses | `m. 2 · system 2 of 4 · 6 of 1` |
| after entering a whole into it | the count moves, the system holds | `m. 2 · system 2 of 4 · 10 of 1` |
| French | « système … sur … · … sur … » | « mes. 2 · système 2 sur 4 · 10 sur 1 » |

**The first measure is your own example back**, give or take the page: you
wrote `m. 1 · system 1 of 6 · 29 of 8` and this read has four systems rather
than six, so it says `m. 1 · system 1 of 4 · 29 of 8`. The `29 of 8` is the
same.

The line fits the loupe's width at 430 px without wrapping, which was the thing
worth checking about a tag that just grew a clause.

### Gates, re-run

| gate | expected | got |
|---|---|---|
| 1 phonology | `216 passed (216)` | `216 passed (216)` |
| 2 dictionary | `235 passed (235)` | `235 passed (235)` |
| 3 web-check | `found 0 errors and 7 warnings in 4 files` | same |
| 4 web-test | `871 passed (871)` | `871 passed (871)` |
| 5 score-parser | `461 passed \| 5 skipped (466)` | same |

All five at the baseline the ship script now holds. **Gate 4 holds at 871** and no test was added: this is one string and one
branch in a Svelte component, and the arithmetic underneath it was already
pinned by the nine `measureFill` tests §8 added.

`~/Downloads/ilya-ship.sh:79` **already says 871**, moved with the `320bf3a`
ship. I read it rather than edited it, and nothing in this section moves it
again.

**§8's own open item stands**: on this read the arithmetic fires on measures
nobody has touched, because the read's durations disagree with the metre it
read. The tag now keeps the system clause while saying so, which makes that
noise cheaper, but it does not make it quieter. Still worth your eye.

---

## 10. Appended: the clef and key in the loupe, and the wandering unit

Both from Dann's deploy walk. One ruling, one defect.

**§9 shipped as `90ab413`**, "N.92: the measure tag carries both clauses", so
everything above this section is in history. This section's work is what is
dirty: `entry.ts`, `entry.test.ts`, `Loupe.svelte`, and this memo.
`docs/memory/INBOX.md` is also dirty and is not mine.

### The defect: the beat unit wandered, and here is why

`entry.ts:402`. You watched one measure read `29 of 8`, then `15 of 4` after a
note entry, then `31 of 8` after a rest, and called it: all three true, the
unit moving between them.

**The cause was mine and it was one expression.** The unit was
`lcm(den, beatType)`, where `den` is the denominator of what the measure HOLDS.
So it was derived from the CONTENT and re-derived on every change to it, and
adding one eighth to a bar of quarters silently halved the beat the tag counted
in. §8 wrote that expression to keep both numbers whole, and keeping them whole
is exactly what made the unit move.

**Pinned to the signature's own denominator**, as ruled. The second number is
now always the signature's numerator, so a bar in 4 by 4 reads `N of 4` from
the first correction to the last and two readings can be held against each
other.

**The cost, and it is the right one to pay**: `actual` can now be fractional,
because a bar of eighths in 4 by 4 is not a whole number of quarters. Four
quarters and an eighth reads `4.5 of 4` where it used to read `9 of 8`. The old
form had two integers and a moving unit; this one has a fixed unit and
sometimes a half. **Only the second can be compared with itself.**

Walked, three interactions on one measure, entering a note and then a rest:

```
m. 1 · system 1 of 4 · 14.5 of 4
m. 1 · system 1 of 4 · 15 of 4
m. 1 · system 1 of 4 · 15.5 of 4
```

**The unit held at 4 through all three.** Your own three readings are a test
now (`entry.test.ts`), asserting the second number does not move while the
measure changes under it.

### The ruling: the loupe carries a clef and a key signature

`Loupe.svelte:213`. A musician cannot read a stave without them, and an
engraved excerpt carries them however short it is.

**They are a second crop of the same clone, not a second drawing.** The
renderer already puts the clef and the key at the head of every system
(`staff-renderer.ts:739` and `:770`), so the head is in the system the loupe is
showing; it is simply outside the x window of every measure but the first. One
clone, two viewports, one scale, one coordinate space. The glyphs in the head
are the page's glyphs for the same reason the measure's are: **they ARE the
page's**, which is what the brief asked for when it said the same sources.

**The head ends where the first column begins.** The renderer tiles a system
with hit rectangles from the midpoint before each note, so the smallest of them
in the whole system bounds everything drawn before the music starts. Measured
off the DOM rather than recomputed from `leftMargin`, which is an option a
caller can change.

Walked at 430 by 932:

| | head | body | gap between them | one clef | key accidentals |
|---|---|---|---|---|---|
| mid page | 57.7 px | 324.3 px | **0.0** | 1 | 3 |
| first measure of a system | 34.3 px | 347.7 px | **0.0** | 1 | 4 |

They sit flush at one scale, the staff lines run through both, and the pair
reads as one stave rather than two pictures. On the first measure of a system
the head and the body abut exactly, with no overlap and no second clef, because
the body's window begins where the head's ends.

**The head takes no taps.** The entries live in the body, and a hit rectangle
reaching into the head belongs to a note the loupe is not showing.

### What it costs, measured rather than estimated

The head shares the fit, so it takes room the measure used to have. On this
document, measured:

| | applied magnification |
|---|---|
| before this change | 1.54 times the thumbnail |
| after it | **1.31 times** |

**The clamp was already dominant before the head existed.** On the Lamm read a
single measure fills most of a system, so it wanted 595 px of a 382 px frame
and was already being shown whole at less than 2.4 rather than clipped at 2.4.
The head cost about fifteen percent of what was left. On a document whose
measures fit inside the frame, the head costs nothing until head plus measure
exceeds it.

I did not give the head its own scale to protect the magnification: the two
must share one or the staff lines do not meet, and a clef drawn at a different
size from the notes beside it is a worse lie than a smaller loupe. **Showing
the measure whole stays the ruled priority.**

### Gates, re-run

| gate | expected | got |
|---|---|---|
| 1 phonology | `216 passed (216)` | `216 passed (216)` |
| 2 dictionary | `235 passed (235)` | `235 passed (235)` |
| 3 web-check | `found 0 errors and 7 warnings in 4 files` | same |
| 4 web-test | `871 passed (871)` | **`872 passed (872)`** |
| 5 score-parser | `461 passed \| 5 skipped (466)` | same |

**Gate 4 moves 871 to 872.** Two tests were added for the pinned unit, one was
removed: the case that asserted `9 of 8` for four quarters and an eighth
asserted the very behaviour this ruling strikes, so it is replaced by one
asserting `4.5 of 4`. `~/Downloads/ilya-ship.sh:79` says 871 and **needs to say
872. I have not touched it.**

No test was added for the clef and key: it is two viewports over one clone in a
Svelte component, and the numbers that matter are the walk's.

### Not established, new with this round

- **Whether 1.31 times is enough of a magnifier on a document like this one.**
  It is the read's own doing rather than the head's, and the honest fix is
  upstream: a read that puts a whole system in one measure is a read to
  correct, which is what this track exists for. Worth your eye on a document
  whose measures are ordinary.
- **What the head should show where a system carries a mid-score clef or key
  change.** It shows the system's own head, which is what the renderer drew,
  and a change occurring partway along that system is not repeated in it. No
  source rules that case and this build does not invent one.
