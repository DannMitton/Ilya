# PRODUCT — what Ilya is

Open this before forming any opinion about what Ilya should do or look like.

---

## Why Ilya exists: a legacy others can build on. Stated by Dann 2026-09-17

**His words:** *"This is my legacy. I want it to be good, to be useful, and to help
future folks innovate to other language bases."*

Three tests for any choice, in his order: is it good, is it useful, and does it
leave a path for someone building the same thing for another language.

**What the tree says today, read 2026-09-17:** the licence is MIT (`LICENSE:1`).
`CONTRIBUTING.md:9` closes Ilya itself to any phonological authority but
Grayson's, which is right for Ilya, and says nothing about how to build a sibling
for another language. Which parts of the tree are Russian-specific and which
would carry over is NOT ESTABLISHED. **Not release work** under the freeze rule;
caught in `INBOX.md` for after 2026-10-30.

---

## Ilya is already public. Stated by Dann 2026-09-16

**His words:** *"a first public Ilya already exists and has been available since
January. We are working on its next iteration."*

The work on branch `Shane` is the NEXT iteration of a public tool. **"The release"
in any file here means shipping that iteration, never a first release.** The desk
called it "a first public Ilya" on 2026-09-16, copying `STATE.md`, and he had to
correct it.

---

## Ilya reads the text AND the singer. Added 2026-09-16 after Dann caught the omission

**Why this section exists:** on 2026-09-16 the desk summarized Ilya from the
section after this one and left out the voice profile entirely, because that
section does not mention it. Dann asked whether that was a reasonable omission. It
was not.

**The two halves:**

1. **The text.** Ilya transcribes Russian into IPA in Grayson's ten vowels, sets
   the syllables under the notes, and prints a study page.
2. **The singer.** Through the device's microphone, the calibration wizard (named
   "Your Resonances" for the singer, `apps/web/src/lib/shane/CalibrationWizard.svelte:2-4`)
   records the singer sustaining each vowel over a fixed 3.0 s arc (`:13`), from
   live audio (`:22-24`), and keeps a profile per named voice (`:33-35`). The
   measured formants give an fR1 per vowel
   (`apps/web/src/lib/shane/analyze-score-adapter.ts:98-125`).

**Shane joins them.** Dann's words, 2026-09-16: *"Ilya performs transcriptions
automatically whener text is input, and it only uses Grayson's ten-vowel schema.
This is the data that interfaces with the user's formant profile and range
data."*

**Who says what. Corrected by Dann 2026-09-16:** *"Markup reports what that
shows, and Insights offers helpful advice for the user."* **Markup** (the ruled
name for Score markup) reports the crossing on the page. **Insights** offers the
singer helpful advice, as insight and not intervention (section of that name).
The desk had first given the reporting job to Insights.

**So a summary of Ilya that names only the text half is wrong.** The desk wrote
the description in this section from the code (DESK DEFAULT, 2026-09-16); the
quotation is Dann's.

---

## Once there is data to process, Ilya processes it. Stated by Dann 2026-09-16

**His words:** *"once there is data to process, Ilya should process it."* And, on
removing **Continue to analysis** and **Transcribe and fit**: *"By getting rid of
the two buttons I think we are establishing Ilya's robust response and I like
that very much, the appearance of instantaneity."*

**The default:** text transcribes when it arrives, a score draws when it is
dropped, and a poem and a melody are paired as soon as both exist, in either
order. No button stands between the singer's material and the result. **The
condition for departing from it:** Ilya still stops to ask where it needs an
answer only the singer has (a picture's clef and key), or before it would
destroy the singer's own work (the replace dialog).

**This supersedes** his ruling of 2026-09-07 that the Transcribe button "keeps its
explicit act", and it leaves the drawer grammar's filled-pill row (section "The
drawer grammar and the path") without **Transcribe and fit**; the Input surface
now has no primary pill.

---

## What Ilya produces. SETTLED. Do not reopen

**A study edition whose paper is a GUI.**

- **Transcribe owns every text operation. Fit owns every notation operation.**
- Verse 1 only.
- **Fit reads ONE line, never the harmony.**
- Desktop keeps WYSIWYG. Portrait mobile does not. **Rotating is the mode switch on
  both.**
- **The portrait scroll is never printed. Print renders the paper.**
- **Portrait treatment C, ruled 2026-08-18.** Portrait's arrival view is the
  fitted true page (whole, shadowed, owning its header block and colophon; the
  attribution lives in that colophon). One tap enters a **reading aid** that
  wears no paper dress and is labelled as an aid; one tap returns. The
  "designed for desktop" interstitial is retired. Rotation stays the mode
  switch. Record: `docs/sessions/fable-gui-session-record_2026-08-18.md`.
- **DRAWER MANIPULATES. PAGE DISPLAYS AND PRINTS.**
- **THE NOTES NEVER MOVE; THE SYLLABLES SLIDE ALONG THEM.** Ruled by Dann,
  2026-08-13, adopting Finale's grammar. The engraving is the composer's and
  is never a function of the text. This is why the pairing is a correction
  layer keyed by event id and never writes to `ParsedScore`, and it is why
  every Shift Lyrics operation is a permutation of a map: free to undo, and
  testable without a browser.

  **AMENDED 2026-09-14 BY DANN, and the amendment is load-bearing.** His
  words: *"Sometimes I want the notes to move to accommodate legibility in the
  text underlay. The engraving is not the composer's; it is a highly edited
  aspect of the musico-textual object that is subject to our scholarly
  intervention. We can freely rearrange the page layout and measure
  distribution to accommodate legibility and logic. We don't want to interfere
  with these elements without justification."*

  **So page layout, measure distribution, and horizontal spacing are editorial
  and may be changed for legibility. The standard is justification, not
  prohibition.** What the 2026-08-13 ruling still carries is the mechanism it
  was written to explain: the pairing remains a correction layer keyed by
  event id and never writes to `ParsedScore`.

  **Do not quote the 2026-08-13 sentence as a wall.** Dann's words the same
  night: *"this is why I hate these absolute edicts as rulings."*

  **AGENCY IS ITSELF THE JUSTIFICATION. Ruled by Dann 2026-09-14, closing the
  question the amendment above opens.** His words: *"the standard for the
  respacing is your eye, not merely correctness, and that is enough
  justification. We are giving the user agency."* And, on the layout control
  he numbered as N.115: *"you could achieve some unholy collisions that way,
  but that was part of offering the user control."*

  So where a layout intervention is the singer's own act, the justification
  the amendment asks for is the act itself. **Ilya does not refuse it, does not
  mark it, and does not ask.** The no-unsure-mark rule of CONTRACT §6 applies
  here as it does everywhere else.

The portrait HTML scroll is an accommodation to a phone's form factor. In Dann's
words: *"Let's not confuse our GUIs with the actual musico-textual object."*

---

## The tabs

**NAMES CORRECTED 2026-09-21, transcribed from Dann's ratification of 2026-09-13 and
built in `5f7be82`.** This table had read `Transcribe · Fit · Learn · Guide` since it was
written, which was three names out of date and named a Fit tab that does not exist.

| tab | French | what it is |
|---|---|---|
| **Text** | « Texte » | Russian text to Grayson-faithful IPA. Photographed Cyrillic text ships too, via tesseract.js. |
| **Markup** | « Annotation » | The score carrying the singer's words and marks. Wire id `shane`. |
| **Insights** | « Aperçus » | Does this piece suit my voice? Forecasts, never declares. |
| **Learn** | « Leçons » | Seven sections, Grayson throughout. Shipped. |
| **Guide** | « Guide » | How to use it, and why it chose that. |

**The drawer band is `Voice` / « Voix »** (N.150, ruled 2026-09-20 and ratified by Dann on
screen). **`Melody` / « Mélodie » was ratified 2026-09-13 and never built**; the newer
ruling stands and nothing should build Melody.

**Fit is the tool's name, not a tab.** Ruled by Dann 2026-07-13, invariant in French, and
restated as current at `i18n.ts:115`. It folded into Voice and Markup, so a string sending
a singer *to* Fit is wrong while a string saying Fit measures their voice is not.

**THE TAB PADDING IS ONE VALUE AT EVERY WIDTH. Ratified by Dann 2026-09-21** when he asked
*"We will have consistenct etween desktop and miobile, right?"* and accepted that it is.
`.pair-member`'s `padding: 0.3rem 0.5rem` sits in `DeskHead.svelte`'s base rule and **no
media query may narrow it per breakpoint.** At a 390 px viewport the 0.5 rem is what makes
French fit at all: at the previous 0.7 rem the French pair ran 4.31 px over a 342 px head,
and before the rename it overflowed by 107 px with `Insights` clipped off the screen
entirely. **The padding is load-bearing, not cosmetic.**

---

## Closed and not to be reopened

- The mobile-versus-desktop asymmetry.
- The portrait attribution.
- Three desks.
- Full-ink.
- The 44 px handle.
- The boxed pair.
- **That print renders the paper.**
- **A mark on the page saying Ilya is unsure.** Struck in E.47. A mark that appears
  on everything says nothing, and a misplaced syllable is something Dann can see.

---

## Ten vowels, Grayson's, and no others. Ruled by Dann, restated 2026-09-16

**Ilya works in Grayson's ten prescriptive sung vowels and meets no other vowel.** Dann's words, 2026-09-16: *"Ilya will never encounter [ɔ] because it is not one of the ten prescriptive vowel targets devised by Grayson. Ilya is constrained to Grayson's ten-vowel schema, and will only ever encounter these ten vowels and no others."* The set is `VOWELS` in `apps/web/src/lib/shane/engine/types.ts:26`. The vowel resolver drops any other glyph (`vowel-resolver.ts:105-116`, `:314`).

**He had to say this twice.** On 2026-09-16 the desk wrote that an [ɔ] advice case "can never fire on a Russian score", as if that were a finding. It is the design. **How it holds, in Dann's words, 2026-09-16:** *"Ilya performs transcriptions automatically whener text is input, and it only uses Grayson's ten-vowel schema. This is the data that interfaces with the user's formant profile and range data."* So no later stage needs its own guard. This changes only if Dann changes the schema.

**Why the glyph for Russian stressed <o> is [o]:** Grayson, *Russian Lyric Diction* (2012), Appendix K, "The Story of /o/", pp. 359 to 397. On pp. 395 to 396 he describes Russian /o/ as a fusion vowel: the lips and back of the tongue form a closed /o/, and the front of the tongue shapes an open /ɔ/. On pp. 396 to 397 he chooses [o], because in his view the [ɔ] symbol makes singers widen the lip rounding far too much. He names the compromise: a singer may not lower the tongue enough to sound authentically Russian, and erring too closed is better than too open. On p. 397 he adds the concession: /o/ is mono-phonemic in Russian, so a singer may shape it rounder or less round, and with a higher or lower tongue, for tone, as long as it stays somewhat rounded and does not sound like /ɑ/. The extremes of the range open up, and the highest notes are often sung essentially as /ɑ/ by singers of any nationality. Read by the desk 2026-09-16 from the text layer, where the IPA font is keyboard-mapped; the /ɑ/ reading of p. 397 matches a rendered read of 2026-07-21 (`claude/sonnet-memo-grayson-boa-cover-sourcing_2026-07-21.md`).

## Insights gives insight, not intervention. Stated by Dann 2026-09-16

A vowel an Insight names is a conceptual target, reached with subtlety, and the teacher's informed ear decides. Dann's words: *"The informed ear of a teacher should be the decising factor, and obviously that lies beyond Ilya's capabilities. We are not looking for Insights to replace informed pedagogical intervention. we are looking for Insights to provide.... insght."* A named target may be any vowel on Jones's quadrilateral, not only Grayson's ten, because the prescription follows Grayson and the performance does not have to. Record: `~/Documents/Voice Pedagogy Library/Insights Research/_synthesis/review-01b.md` S3.

**AMENDED BY DANN 2026-09-23 00:49: CITED ADVICE IS ALLOWED.** His words: *"It is justifiable for Insights to offer cited advice where the literature supports it. We do not want one baseless claim in Ilya. Users (singers) are wildly opinionated, and many users will feel challenged by what Ilya offers in Insights. We prepare for this with unassailable attribution whenever Ilya offers advice."* **The default is now:** Insights may advise where a source supports it, and every piece of advice carries its attribution on its face. **The condition for departing from it:** no source, no advice. The 2026-09-16 principle that the teacher's informed ear decides is not revoked by this amendment. Model register, his sentence of 2026-09-23 00:43: *"This leap can be exploited to camouflage the timbral differences between these two pitch/vowel combinations."* Record: `../sessions/method-leaps_r1_2026-09-22.md`, addenda 5 to 7.

## No belting. Ruled by Dann 2026-09-16

Ilya gives no belting advice. Dann's words: *"No belting voice, this is not a colour that is recruited for classical vocal rep."* A default for classical repertoire. It would change only if Ilya served repertoire that recruits the colour.

---

## The turning layer. Ruled by Dann 2026-09-02

A turning pitch marks where the voice turns, not how long it stays. It has a
pitch and nothing else, so it carries no stem, no flag, no beam, and no dot,
ever. Its whole extent is an accidental and a head, which Dann calls a
"biglyph" against the sung note's "triglyph" of accidental, head, and dots.
Each is a semantic unit; no mark from one may sit inside the other. A turning pitch is a property of the vowel that corresponds to the note it
follows (his words, 2026-09-02); that
relation is semantic, and the page shows it by proximity: a displaced
turning unit sits close after its parent and visibly further from what
follows (his ruling, 2026-09-02). At a
unison or a second the turning unit is always displaced to the right of the
sung unit, never left; at a third or more it aligns vertically. This departs
from Gould 103 on purpose; his words: "I realize this may be at odds with
Gould, but I find this acceptable for our purposes." Built under N.106.

## Ilya does the correct work up front. Ruled by Dann 2026-09-15

**His words:** *"This is also why we invested so much energy in creating controls
for the user to correct such errors. The infrastructure is already in place. I just
want Ilya to do the correct work up front; to my mind this reinforces user
confidence in Ilya rather than undermining it while requiring manual
intervention."*

**THE CORRECTION SURFACE IS A SAFETY NET, NOT THE PLAN.** Ilya already tells the
singer that its placements are proposals, and it already gives them the means to
change every one. **That is not a licence to propose badly.** A singer who has to
repair the same class of error on every score learns that Ilya does not understand
the music, and no amount of correctability buys that back.

**HOW TO APPLY IT.** Where Ilya can know the right answer from the score, it does
the right thing rather than proposing a plausible one and relying on the
correction path. **A rule Ilya can read out of the notation is not a matter of
taste and should not be delegated to the singer.** Where Ilya genuinely cannot
know, it proposes, says so once, and leaves the controls to hand.

**What prompted it, 2026-09-15:** N.142, where Ilya seats syllables on tied
continuations because it counts noteheads rather than reading ties. The controls to
fix that by hand already exist. Dann's point is that they should not be needed.

## The page and the loupe answer to different things. Ruled by Dann 2026-09-15

**His words, and they are the principle:** *"I can accept that a measure in the
Loupe could be drawn differently to accommodate our requirements while its
counterpart on the page obeys the page's music spacing and layout. That seems
proper and good to me. The page needs to serve the demands of the piece, while
the Loupe needs to juggle the vagaries of the individual measure."*

**THE PAGE SERVES THE PIECE.** Its spacing, its measure distribution and its
system breaks answer to the whole work. They are editorial and may be changed with
justification (his ruling of 2026-09-14, recorded above), but they are changed for
the sake of the piece.

**THE LOUPE SERVES ONE MEASURE.** It may space that measure differently from the
page, to make the measure readable and to make Ilya's own marks fit around it.

**WHAT THIS GIVES UP, recorded so the trade is on its face.** The loupe is
currently a CROP of the page's SVG, which guarantees that what the singer examines
is exactly what prints. **Where the loupe re-spaces, that guarantee goes.** Dann
ruled it knowing that; the desk had argued the other way, treating the guarantee
as the thing to protect, and his division of labour is the better account: two
jobs, two drawings.

**IT IS PERMISSION, NOT AN INSTRUCTION. The cheap route is still tried first.**
Nothing should be re-spaced that can be solved by moving Ilya's own marks. **As of
2026-09-15 nothing requires it:** N.141's step 2 reached zero collisions and zero
truncations on both scores by giving the loupe its own selection mark, so its step
3 was not built.

**Where it bears on open items:** N.141 step 3, and N.140, whose scroll-below-a-floor
design has a second answer under this principle, namely re-spacing the measure for
the width available.

## The squircle. Ruled by Dann 2026-08-27 and 2026-09-15

**IT IS IDENTITY, NOT DECORATION.** Ruled 2026-08-27: the squircle is a key germ
of Ilya's visual vocabulary. It is not one marker's shape, and it is not
ornament. **It governs where rounded forms appear across the product.** This
REFINES the three-radii rule in the drawer grammar table rather than contradicting
it; the radii say what values exist, this says what the shape means.

**ITS PURPOSE IS ARRESTING FOCUS.** Ruled 2026-09-15, in his words: *"The purpose
of the squircle is to create arresting focus for the user, something they can't
ignore and that focuses their attention. The negative space inside a squircle
gives breath, and as long as it reads proportionately, I believe it still aligns
with Calm Authority."*

**IT CARRIES NO FILL, AND THAT IS DELIBERATE.** Dann, 2026-09-15: *"Ilya is a
grandchild of my dissertation and I decided arbitrarily not to fill the squircles
in Ilya. I think it reads cleanly and aligns with Calm Authority."* The mark in his
doctoral edition is a red stroke with a light red fill; Ilya's is
`fill: none` with a `--lavender` stroke (`VoiceProfilePane.svelte`,
`rect[data-selection-ring]`).

**The two marks do different jobs, which is the justification even though he
reached it by eye.** His annotates a region on a static page, where a wash reads as
commentary laid over the music. **Ilya's sits on live notation the singer is
working in**, and a fill of any weight tints the notation inside it, so the mark
would compete with the ink it exists to point at. An outline points without
colouring.

**SO THE NEGATIVE SPACE IS THE POINT, AND IT IS NOT WASTE.** A squircle that looks
larger than its contents require is doing its job. **The condition he attached is
PROPORTION, and it is judged by his eye, not by a number.** Per CONTRACT §1.19
this is a stated default with its condition, not an edict: a squircle that stops
reading proportionately is a case to bring him, not a rule to enforce against
him.

**WHAT THIS SETTLED, the same day.** The selection squircle takes its top from the
highest note on its system, so **one tall stem raises every box on that system**.
Dann ruled that acceptable on the reasoning above rather than as a concession.

**The selection squircle's own grammar is an item, not a product rule**, and lives
in `OPEN.md` §N.141: what it encloses, that it is never truncated, what may
collide with it, and the difference between its behaviour on the page and in the
loupe.

## Naming, ruled

`Russian-o` / `o russe`. `cardinal-u` / `u cardinal`. **The French is LOWERCASE.**
Do not rename a vowel.

---

## Where the code lives

There is exactly **one route**, `apps/web/src/routes/+page.svelte`, and it is 1,948
lines.

| file | folder |
|---|---|
| `Paper.svelte`, `WordStack.svelte` | `apps/web/src/lib/components/Paper/` |
| `InspectorPanel.svelte`, `Drawer.svelte`, `TabBar.svelte` | `apps/web/src/lib/components/Drawer/` |
| `VoiceProfilePane.svelte`, `ScoreUploader.svelte`, `vowel-resolver.ts`, `pairings.ts`, `SyllableStation.svelte`, `profileStore.ts` | `apps/web/src/lib/shane/` |

`apps/web/static/data` is a symlink to the repository root's `data/`.

---
*SOURCED from `claude/e48-thread-opener_v1_2026-08-13.md`, read in full 2026-08-13.*


## The drawer grammar and the path. Ruled 2026-09-09 and 2026-09-10

### The grammar. Ratified from `docs/sessions/drawing-calibration-surface_r1_2026-09-10.html`, Plate 1

| measure | value | source, read 2026-09-10 |
|---|---|---|
| The left edge of everything | `--band-inset`, 18 px | `app.css` token (N.114b); `.group-band { padding: 0 18px }` `Drawer.svelte:980-994`; `.band-body { margin: 0 18px }` `:1064-1066` |
| Air under a band | 0.35rem, the fields' own gap | `MetadataFields.svelte:176-180`; the band's next sibling, N.114b item 2 |
| Air between rows | 8 px | `IntakePanel.svelte:779-783`, `:853-857` |
| A band | 40 px, full-strength hue, white 0.7rem 600 uppercase 0.12em | `Drawer.svelte:980-994`, Dann's option A of 2026-09-02 |
| A station row that opens | sentence-case name left, count and chevron right, hairline below | `StationHeader.svelte`; the syllable line's row, N.114 |
| A pill, ghost | outlined, pill ends, horizontal padding = band inset | `IntakePanel.svelte:753-768`; `.head-pill` N.114b item 5 |
| A pill, filled | one per surface, the primary, last | Transcribe and fit; Finish; Re-calibrate |
| Text verbs | receipt-scoped only: Clear, Replace, Revert, Reset | `.receipt-btn`, `.btn-reset` |
| Alignment | flush left on the inset; nothing centred | every band on the front side; desk inference as a rule, since no document states it |
| Radii | three: 0 paper, small controls (3 to 4 px), pills 999 | slate, 2026-08-18 |
| Accent | one per surface; lavender on Score markup and its takeover | slate; `--lang-chip-*` tokens |
| Alignment, ratified | flush left on the inset, nothing centred, drawer-wide | Dann, ruled 2026-09-10 |

The last row ratifies Plate 1's own alignment row, which the drawing itself had entered as desk inference and put to Dann as Plate 5's first question.

### The path

The drawer is a path read top to bottom: Piece, Input, Text, Score markup, Voice.

The state line a band shows closed is the collapsed form of that band; open, the content itself is the state. This corrects the desk's earlier rule and was accepted from Design's reply, ruled 2026-09-10.

At rest, nothing in the drawer is filled; exactly one thing is next, and only that one thing is filled, one primary pill per surface, last in its row.

Once a syllable is placed, the singer's content stays black; unplaced content sits in tertiary ink, and the count beside it, not a per-syllable word, carries its state on the page. Ruled 2026-09-10: no word on every unplaced syllable, because annotating everything says nothing; per-syllable state lives in the accessible label only.

An empty drawer opens Input alone; Piece and Score markup show their band and nothing else. Ruled 2026-09-10, accepted from Design's reply.

On a phone, a step's primary action lands the singer on the page itself, and Back brings them home. Ruled 2026-09-10, from Design's reply; marked to be read against the portrait C ruling of 2026-08-18 before it is built.

Whether "done" goes quiet once a step completes is NOT ESTABLISHED in the sources read for this transcription.

### The two sets of words. N.121, ruled in part 2026-09-10

The singer must never be surprised by which words end up under the notes.

A score that arrives carrying words, into an empty poem box, fills that box and tags the poem receipt "from score", the Piece fields' own pattern.

Ilya asks no question when this happens.

A singer's own words are never overwritten.

There is no difference reporting, ever, and no narration on a score's arrival.

Dann's earlier sketch of an in-place question asking which words to keep is withdrawn.

**A score that arrives carrying words seats them on its own notes. Ruled by Dann
2026-09-14.** This overturns the desk inference at `+page.svelte:3004-3008`,
which held that Ilya must not place where the score already speaks, and which
labelled itself an inference rather than a ruling. Ilya copies the mapping the
file already states, note by note, rather than counting syllables from the top.
Dann's words: *"this saves the user the manual labour while they retain control
of small inevitable fixes."* The singer's corrections remain the authority over
anything Ilya seats.

**A NOTE DEMANDS A VOWEL, AND ILYA'S RULE SUPERSEDES THE FILE. Ruled by Dann
2026-09-14.** His words: *"in Russian, no note can be set without a vowel to
sing it on. Since that clitic has no vowel, it can never be assigned alone to a
note. A note predicates a vowel."* And: *"Ilya's rule needs to supersede this
kind of latent nonsense."*

**Stated generally, in his words 2026-09-14:** *"a vowelless clitic can never
hold a note alone. By itself. Because it has no vowel. That clitic and all other
vowelless clitics will always concatenate to a parent syllable WITH a vowel.
Because we sing on vowels."* The rule is about every vowelless clitic, not about
`в`.

So a file that puts any vowelless clitic on a note of its own is wrong, and Ilya
concatenates it to its vowel-bearing parent without asking and without a mark.
This is not Ilya second-guessing an engraving. It is Ilya refusing to draw
something that cannot be sung.

**Measured on his own engraving, 2026-09-14**, `Mussorgsky - Sunless 01 - Within
Four Walls (engraved).musicxml`: verse 1, the Cyrillic, gives `в` its own note
36 and is one note ahead of verse 2, the IPA, which folds the same clitic into
`ˈvʲbʲu` on note 37 and is correct. The two underlays in one file disagree for
at least notes 30 to 36, visible in Dorico's own render of the file.

### Rulings on the drawer's surfaces, 2026-09-09 and 2026-09-10

- 2026-09-09: the Voice station in Score markup stays expanded always; its chevron is struck.
- 2026-09-09: the intake hint moves to sit directly under the textarea, above the receipts, as the field's caption, its wording unchanged.
- 2026-09-09 and 2026-09-10: Undo and Redo move to the top bar, right end, fixed, as two pills tangent to the card, horizontal padding equal to the band inset; the dock's own Undo row goes.
- 2026-09-10: Start placement over is a ghost pill in the open syllable line's row.
- 2026-09-10: Export and import order is Export all songs, Export this song, Import a song.
- 2026-09-10: the calibration surface's collapse row is removed.
- 2026-09-10: on the calibration summary, Start over is a ghost pill beside the filled Finish pill.
- 2026-09-10: lyric hands sit first in Corrections, always, in fixed order; Design's proposal to swap their position by state was rejected.
- 2026-09-10: the METADATA label on the Piece band is struck; the metadata body shows whenever Piece is open, and collapsing Piece is the collapse.
- 2026-09-10: no word is drawn on every unplaced syllable; the count plus black-or-grey ink carries it on the page.

### Named exemptions

The ⓘ on the Russian-o roster row is the one named exemption to slate rule 11, "siblings behave identically." It opens the sung-[o] Learn note, ruled 2026-07-11, and was kept against Design's proposed removal, ruled 2026-09-10.

The drawer also carries two existing 44 px touch-target exemptions, ruled in E.36: the table-of-contents rows and the stress circles. These are cited here as already settled, not restated or reopened.

### Strings ruled with their French, 2026-09-10

Shown to Dann as the FRENCH TABLE. He approved « saisir » explicitly ("that's what I was reaching for"); every other row stands unless he names it.

| English | French | source |
|---|---|---|
| Calibrate | Calibrer | adopted, from Recalibrer |
| 37 / 94 placed | 37 / 94 placées | coined |
| 2 of 7 changed | 2 sur 7 modifiés | NOT ESTABLISHED (adopted or coined) |
| 2 notes corrected | 2 notes corrigées | NOT ESTABLISHED (adopted or coined) |
| Type or paste the poem. | Saisissez ou collez le poème. | adopted, « saisir » and « coller » from the tree; « saisir » explicitly approved |
| Drop the score here. | Déposez la partition ici. | adopted, « déposer » from the tree |
| Voice: Dann · 10 of 10 | Voix : Dann · 10 sur 10 | NOT ESTABLISHED (adopted or coined) |

*Section appended 2026-09-10 from `docs/sessions/product-addition-drawer-grammar_r1_2026-09-10.md`, transcribed by Sonnet from STATE.md, INBOX.md, the desk critique, and the drawing r1 Plate 1; three gaps the agent flagged were filled by the desk from the session record.*

## THE TEXT AND THE NOTES. Ruled by Dann 2026-09-17. Binds every item that touches either

Dann's own framing, the same night: *"the text is linear and inviolable... we'd
like to keep the Input field's text intact through our Loupe machinations."*
These three rules are what that means, and they are already how the tree behaves:
the syllable queue is derived from the poem on every render and a placement never
consumes a syllable.

1. **The poem in Input is the text, and only Input changes it.** No action in the
   loupe writes, deletes or reorders a syllable of the poem. A loupe edit
   therefore cannot leave the poem with a gap or a non sequitur.
2. **A syllable on a note is a placement, not a copy.** Delete the note and the
   placement goes with it; the syllable is still in the poem, unplaced, and the
   row draws it grey. Unplaced is grey and placed is black (N.114 ruling 4,
   2026-09-07).
3. **Deleting text happens in Input, and the notes it sat on go quiet.** Ruled
   2026-09-07 and built: a deleted word vacates its notes rather than sliding the
   rest of the line along.

**Where the protection goes.** One act in this model destroys work: deleting text
in Input that carries placements. That act says how many placed syllables it will
free before it happens. Everything in the loupe is a placement, and Undo restores
it.

**And the protection stops there. Ruled by Dann 2026-09-17:** *"a syllable on the
wrong note should be user error. At some point we have to allow the user to be
human and make mistakes. We can't save the user from their own calamity."* So
Ilya does not warn about a placement that is merely wrong, does not second-guess
a singer's edit, and does not mark uncertainty it cannot justify.

## WHAT THE STRESS ACUTES ARE FOR. Ruled by Dann 2026-09-21, and it is his

His words, given while N.119 was being briefed:

> *"the acute accent only applies to orthographic renderings; the IPA line features stress
> marks on stressed syllables for this purpose. The acutes are a courtesy for those who
> are trying to master their Cyrillic literacy. They help non-native users know without a
> doubt which syllable is stressed, simply by paying attention to the Cyrillic."*

**Three things follow, and they are the reason the build has the shape it has.**

1. **The acute belongs to the Cyrillic and never to the IPA.** The IPA already carries the
   engine's own stress mark. A toggle that marks both would be saying the same thing
   twice, and a toggle that marks the IPA instead is marking a row that already says it.
2. **The mark is read on its own.** A singer builds Cyrillic literacy by attending to the
   Cyrillic alone, so the acute has to be right without the IPA beside it. On the score,
   where the Cyrillic is drawn per syllable, an acute on the wrong syllable does not
   merely fail to help; it teaches the wrong thing.
3. **This is why the suppressions are not an optimization.** `WordStack.svelte:55-61`
   withholds the acute on a clitic and on a word whose stress is inferred, and its comment
   calls the acute *"a confidence signal"*. Under this ruling that comment is the product
   rule: Ilya marks stress where it knows, and stays silent where it is guessing, because
   a learner cannot tell a confident mark from a hopeful one.

**`ё` never takes an acute**, being inherently stressed (`WordStack.svelte:70-71`).

## WHAT RECONSTITUTION IS. Stated by Dann 2026-09-21, and the account is his

**His words, given while N.158 was being written:**

> *"Reconstitution has to do with vowel reduction. Grayson offers rules for vowel reduction
> (i.e. akanye, ekyane, and ikanye; the reduction of unstressed vowels in relation to their
> stressed counterpart). Reconstitution rolls back that layer of reduction to restore more
> distinct vowel values."*

**Two things bound it, and both are already in LEARN.**

1. **The one-way door** (`LearnContent.svelte:3023`): `[ʌ]` reconstitutes to `/ɑ/` and never
   to `/o/`.
2. **Ilya departs from Grayson on exactly one point**, ruled by Dann and argued in LEARN at
   `:3029-3031`: unstressed ⟨е⟩ after ⟨ж⟩, ⟨ш⟩ or ⟨ц⟩ reconstitutes to `[ɛ]`.

**Whoever builds anything that touches reconstitution reads that passage first.**

**Transcribed here at the close of 2026-09-21**, out of `OPEN.md` §N.158, before that section
moved to the archive. It is a statement about what Ilya does, so it belongs in this file
rather than in a closed item.

## THE WORK, AND ITS TWO VIEWS. Ruled by Dann 2026-09-21, and it is the frame for the rest

**This is Dann's model, in his own words, and it is his invention rather than the desk's.**
The desk had been trying to reconcile two documents. He replaced the problem.

> *"this gets simpler when we consider the Platonic musico-textual creation that both
> surfaces (Transcription and Markup) are reflections of. Why don't you conceptually start
> there instead of trying to fuse two disparate sources?"*

And, extending it the same minute:

> *"Thinking of it as reflections of a musico-textual object will allow us to easily process
> different text underlays for familiar melodies, and new melodies for familiar texts. There
> is no conflict here, just a bunch of musico-textual objects that need careful profiling."*

**THE MODEL. There is one work: a text joined to a music. Transcription and Score markup are
two views of it. Neither view owns anything; both render.** A text and a music are separately
reusable: two verses are one music with two texts, and a poem set by two composers is one
text with two musics.

**Three things follow, and they are why this is a product statement and not an architecture
note.**

1. **A setting is a decision about the work, not about a page.** "This syllable sings on this
   note" is true whether or not anyone is looking at a score.
2. **The Notation toggles belong to the work.** They are decisions about how the song is
   sung. **So a view that ignores them is not rendering the work.** Score markup obeying them
   is correctness, not a feature. **Ruled by Dann 2026-09-21, 01:37:** *"We must have Score
   Markup respond instantaneously to the Notation toggles just like Transcription does."*
3. **The work has one text, now.** **Ruled by Dann 2026-09-21, 02:12:** *"I don't think the
   user cares about which syllable was seated in another poem? That is irrelevant to their
   need for accurate representation of the poem they arrive with now."* So there is no
   category called "seated under an older poem". A seat resolves against the work's current
   text or it does not.

**WHAT DANN ASKED FOR, and it is the measure this work is held to.** His words, 2026-09-21:
*"Seamlessness, instantaneous correct information, carefully rendered and defensible."*

**THE EVIDENCE THAT THE TREE ALREADY WANTS THIS**, read 2026-09-21 at `b543620`. The engine
is verse-aware in seven places (`analyzePerVerse`, and a `verseNumber` parameter on
`buildUnderlayResolvers`, `collectScoreWords`, `readScoreText`, `findCliticFolds`,
`seatScoreWords` and `watchlist.ts:333`), and `analyze-per-verse.ts` states the model in its
own header: *"Each verse sings the same notes with different text."* **The stored song record
contains the word "verse" zero times**, and every one of those calls takes the default of 1.
The model is in the engine and flattened at the storage layer.

**The item that acts on this is N.160**, specified in `OPEN.md`, with the converged plan in
`../sessions/memo-n160b-the-approach_r1_2026-09-21.md`.

---

## WHAT THE SINGER MAY DO TO A SCORE, AND WHAT COMES OUT. Ruled by Dann 2026-09-17

**TRANSCRIBED HERE 2026-09-22, and this is a move, not a new ruling.** All four lived only
inside `OPEN.md` §N.151, a 695-line spec that nothing in the read order pointed at, so four
rules governing the whole app were reachable only by opening one item. **They are Dann's
own words and his own rulings; the desk offered none of them.**

### 1. WYSIWYG means what it says

**Dann, 2026-09-17:** *"Ilya's WYSIWYG GUI is exactly that: if it appears on Ilya's page,
it can be printed."*

So a mark that draws on the page prints, and anything that cannot print does not belong on
the page. This is the same rule as `CONTRACT.md` §6's *"do not put a control on the
paper"*, read from the other side.

### 2. There is no stopping rule, and that is deliberate

**Dann, 2026-09-17:** *"I don't see a stopping rule or boundary for the user. They should
be able to intentionally break a score or even recompose one... they maybe able to enter a
melody from scratch using Ilya only as the composition device! Why not?"*

**So the edit set is NOT fenced by "repair only."** Any design that refuses an edit because
it is not a repair is arguing with this ruling.

**The desk's note, carried with it and marked as the desk's:** composing from scratch needs
measures and a meter to exist before a note can be placed, and **nothing in the tree creates
an empty song's first measure.** That gap is named, not solved.

### 3. The edited score comes back out, as an edited copy, and the singer's own tempo counts

**Dann, 2026-09-17:** *"Ideally a corrected score comes back out of Ilya, but we conceded
that it is an edited copy. The user may decide to impose tempo markings that reflect their
personal performance practice but are not strictly attributable to the composer. This is
permissible, and it will affect their (the user's) phonation time computation so we allow
it, as a nod to the actual performance as opposed to the Platonic ideal high-fidelity
composition."*

- **Ilya exports what the singer corrected, and the export says it is an edited copy.** It
  is never presented as the composer's text.
- **A tempo the singer imposes is legitimate input**, even where no composer wrote one,
  because Ilya is describing the performance the singer intends.
- **Consequence, and it follows from "Why Ilya exists":** every phonation-time figure
  resting on a singer's own tempo says so where the figure is read, and the export carries
  the same statement in its file. An uncited number is the thing Ilya exists to refuse.
- **Tempo is a first-class, singer-editable fact, not an import-only one.** Dann the same
  day: *"I think the user needs to be able to go in and apply tempo markings anywhere in
  the score, whether the composer placed them or not."*

### 4. Files: deliberate destruction only

**Dann, 2026-09-17:** *"if the singer wants to overwrite the file, they should be able to.
Or even delete it and start again. What we don't want is the unwitting deletion or
overwriting of files the user still wants."*

Replace and Delete stay, each behind a clear act. **The bar is on the UNWITTING loss, never
on the deliberate one.**

### What stays in N.151 rather than here

The measure-edit surface's own design, the over-full measure tolerance and its flag, the
caret rulings, and the composer's-notation constraint. **Those bind one item. These four
bind Ilya.**

---

## ILYA SORTS WHAT IT IS GIVEN, AND NEVER SAYS SO. Ruled by Dann 2026-09-16

**TRANSCRIBED HERE 2026-09-22 from `OPEN.md` §N.146 before that spec was archived.** Dann's
words, his rulings; the design they produced was the desk's, adopted on his instruction.

**The principle.** *"can we make it so that Ilya autodetects content? I want to remove this
cognitive burden from the user and lay it on Ilya instead. Help!"*

**And Ilya does not narrate the sorting.** He struck the desk's proposed receipt switch the
same night: *"Why do we need these labels at all? Why doesn't Ilya just process whatever it
can without advertising that it is changing tactics mid-process?"* **So: no switch, no
label, no question.** Ilya tries the likelier reading first and falls back silently.

**A PAGE WITH A POEM ABOVE THE MUSIC IS A SCORE.** *"the house style for many International
scores format it this way, with the poem under the title followed by the score. Ilya should
be prepared for this and treat it as a score because the text underlay sometimes varies
slightly (repetition, omission) from the poem."* **Staves anywhere on the page decide it,
whatever text sits above them.**

**The accepted risk, in his own reasoning:** *"if Ilya misjudges a page, I suspect the user
will try again? I don't see how the user can make Ilya process something it can't
process?"* The same file gives the same answer, so the singer's real exits are the existing
ones: paste or type the poem, or drop the score in another format.

**This is the intake half of "Once there is data to process, Ilya processes it", above.**

---

## THE SYLLABLES LIVE IN THE LOUPE, NOT THE DRAWER. Ruled by Dann 2026-09-17

**TRANSCRIBED HERE 2026-09-22 from `OPEN.md` §N.147 before that spec was archived.** N.147
shipped in `55c04d9` and Dann walked it, **so these are built, not pending.** They are here
because they bind anything that later touches the loupe or the drawer's Input section.
**Read with "The page and the loupe answer to different things", above.**

**The finding that produced them, Dann 2026-09-16, "unacceptable":** a tap on a note in the
loupe both selected it and placed the armed syllable, so moving around the loupe reassigned
syllables by accident.

**The five ruled defaults:**

1. **The syllable line leaves the drawer entirely and lives in the loupe.** The drawer's
   Input section keeps the source text only, in the input field. **His reason: two copies of
   the syllabified text confuse the singer**, and moving between drawer and loupe to place
   syllables is inconvenient, worst on a phone. **This REVERSES N.114's placement**, ruled
   2026-09-07 and 2026-09-09. **Revisit only if singers lose an overview they need.**
2. **In the loupe it is an accordion expansion under the notes**, and the loupe is a
   satellite of the drawer: a control surface. **It departs from the loupe's one constant
   height when open**, which is a named exception to that rule, not an oversight.
3. **No syllable is focused or armed by default**, so nothing can be placed by accident.
   This is the cure for the finding above and must survive any redesign.
4. **The syllables scroll when height is short.**
5. **The loupe's notation keeps its IPA under the notes**, on the underlay's near line above
   the Cyrillic. **His reason, and it is the substantive one: the interface ties pitch to
   vowel, and IPA, not spelling, gives the vowel.** The Syllables row itself stays Cyrillic
   only, and a placement brings the syllable's correct, in-context IPA to the note.

**Ratified by Dann on the drawings, 2026-09-17:** treatment 1, Hairline. A hairline under
the notes, then a SYLLABLES disclosure row in the loupe's tag style with a chevron, then the
syllables on the loupe's paper.

**French: « Syllabes », ruled by Dann 2026-09-17.** "Syllables" is the desk's coined English
label and he ruled its French. **Belongs with "Strings ruled with their French", above.**

**Still true and carried from the spec:** placed syllables are black and unplaced are
tertiary grey, per N.114 ruling 4 (Dann 2026-09-07, *"Committed is black"*). The desk's
first draft said the reverse and he corrected it the same day.

---

## BOTH LANGUAGES, START TO FINISH. Stated by Dann 2026-09-22

**His words:** *"I know you're aware of thew importance of French parity, and that French
users aren't jsut capricious humans who insist on imposing French when they can really
speak English. Some can, some can't. We render our app in both of Canada's official
languages from start to finish."*

**What this settles, and it is a weighting, not a new feature.**

- **A French string is not a convenience for someone who could have read the English.** Some
  singers cannot. **So an English string reaching a French session is a singer receiving
  nothing**, not a singer receiving something slightly wrong.
- **"Start to finish" includes the screens nobody designs:** waiting lines, status text,
  error messages, accessible names. **A minute of English on a loading screen is a minute of
  silence for that singer.**
- **It bears directly on how N.131 is weighed.** French parity items are not cosmetic, and
  a parity failure whose cause is timing rather than a missing translation is the same
  failure to the singer.

**What it does NOT do:** it does not make every untranslated string release-blocking.
`SEQUENCE.md` dependency 6 still holds, N.130 inside the release and N.131 outside it, and
Dann has not moved that. **It raises the weight of a parity failure, not the schedule.**

---

## CLARITY FOR A RECEPTIVE USER, NOT COMPACTNESS. Ruled by Dann 2026-09-22

**His words:** *"The riegister we are looking for is not compactness for the sake of
comprehension. It is clarity for a receptive user."*

**And the test he applied to reach it:** *"Because 'phonation mass' is not a term from the
literature and it's not a familiar term in the field, we can't justify it."*

**So, for every string a singer reads:**

- **A term Ilya cannot justify does not go on the page.** Not from the literature and not
  current in the field means it is jargon, whoever coined it. **This binds the desk's own
  coinages hardest**, because they arrive dressed as precision.
- **Length is not the enemy. Obscurity is.** Given a short phrase the singer must decode and
  a longer one they simply understand, **take the longer one.** He chose "What is flagged,
  by how much of the piece you spend on it" over "longest first", which was four words
  shorter and which the desk had recommended.
- **The reader is receptive, not impatient.** A singer reading their own results has come to
  understand something. Write for that person.

**This is not licence to pad.** The same ruling struck a clause entirely: "lighter by
phonation mass" left the remainder sentence rather than being reworded, **because the
sentence did not need the measurement at all.** Say the thing that is needed, in words that
are understood, and stop.

**Where it came from:** the desk coined "phonation mass" in the N.127 design brief of
2026-09-11, a code comment then attributed it to Dann's ruling, and he did not recognize the
phrase when he met it on 2026-09-22. **The metric is real and unchanged; only its name was
invented.** See `OWED.md`.

---

## THE CODE IS NOT A CONSTRAINT ON THE PRODUCT. Ruled by Dann 2026-09-22

> *"If she has a compelling idea, we will figure out how to assimilate it into Ilya.
> Prioritize the needs of the user rather than the needs of the programmer or the code.
> There is always a way to accomplish an objective with the code."*

**Said of the St-Pierre research, and it generalizes.** Dann amended the desk's own sentence
— *"so the proposal does not promise things the tree cannot compute"* — to read **"cannot
compute YET."**

### What this binds

**"The tree does not do that" is a cost, not a verdict.** When the desk weighs an idea, the
question is whether the user needs it, not whether the parser already carries it. If the
answer is yes and the parser does not, **the parser is the thing that moves.**

**This does not license promising the user anything.** WRITTEN and DONE are unchanged, and
nothing ships on an intention. It changes what the desk is allowed to *refuse*: a refusal
must rest on the product, not on the build.

### The three refusals that survive it

1. **The element is about somebody other than the singer** — the pianist's difficulty, the
   reader's difficulty.
2. **The element pronounces on the singer** rather than forecasting. `PRODUCT.md`
   §"Insights gives insight, not intervention" and §"What Ilya produces".
3. **Dann has ruled against its shape.** The summed difficulty grade, for one.

### The refusal it struck on the day it was made

**Dynamics**, refused in `proposal-st-pierre-elements-for-ilya_r1` partly because
`ParsedScore` carries no dynamics at all. **That is a parser gap and is now a build cost.**
Re-opened in r2 as a question of worth. **Not ruled either way.**

### It may want a tether number

**This is a rule about how the desk reasons, which is `CONTRACT.md`'s subject, not this
file's.** It is transcribed here because it was ruled about the product. **Dann's to decide
whether it becomes tether 23.**
