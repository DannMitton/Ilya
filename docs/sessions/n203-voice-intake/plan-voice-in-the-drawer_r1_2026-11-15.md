# Plan: VOICE in the Drawer, and the intake it leads to (N.203)

**r1, 2026-11-15.** Written by the desk (Fable 5.2) at Dann's instruction of 20:05 and 20:26. **Status: for review by a Fable subagent. Nothing in it is built.** Tree read: branch `Shane` at `2c07ab75`. Paths are under `apps/web/src/` unless they begin with `docs/`. "Packet" means `docs/sessions/n203-voice-intake/packet-sonnet-n203-voice-intake_r1_2026-11-15.md`, a scout's citations that the desk has read and has not re-verified line by line; a fact marked "(packet X)" rests on it.

## 0. How to read this

- **Dann:** section 1 is the whole plan in plain words. Section 8 holds the decisions that are still yours, each with the default the build uses until you rule.
- **The fresh thread:** sections 2 to 7 and 9 to 11.
- **The reviewer:** all of it.

Terms. Adopted from the build or from Dann: band, station, takeover, take, placeholder, vowel space, vowel space detail (Dann 19:45, for the chart square on the capture screen), stage (the build's class name). Coined by the desk, for this document only, and Dann's to rename: the voice's home (the VOICE band's body at rest), take line, closing view, door, slice.

## 1. The plan on one page

What a singer finds when this is built:

1. **Opening the VOICE band shows the voice.** Its name, its voice type, and one line that says what Ilya holds for it. Tapping the name changes voices, or adds, copies, renames, or deletes one.
2. **A voice type alone is enough to begin.** For five types Ilya starts from a typical voice, and the band says so.
3. **Four doors, each named for what it opens:** sing your vowels; your vowel space; describe your voice; how INSIGHTS speaks to you.
4. **Singing a vowel:** a tap looks, and Start sings. A breath comes first. A line of four parts shows where you are: Breathe, Sing, Shape, Fry. The side view and the vowel space detail stay in view, and the detail glides to each vowel you choose.
5. **Your vowel space:** the chart and one table of the ten readings in one view, with a small mark where a reading is less certain or is Ilya's own working, your footnote, and Print.
6. **Describing your voice needs no microphone** and no sung vowel.
7. **INSIGHTS' settings stay in the Drawer,** as NOTATION does for TEXT, and the INSIGHTS page links to them.
8. **The storage and import notices leave the VOICE band.**

What stays as it is: the accordion; the takeover for the sung intake; Welcome and the test fry; the ten buttons in two rows of five; every ratified string that still says what happens.

## 2. Dann's rulings, in his words

All of 2026-11-15, America/Toronto. Transcribed as written; the full messages are in `docs/memory/INBOX.md`.

| Time | His words | What it rules |
|---|---|---|
| 18:13 | "Can you consolidate these two elements into a single, stereamlined yet information-rich element for display? … (but preseving its footnote) … featuire4 the vowel space chart in the same view as the vowel data" | One readings table; the footnote stays; chart and table share a view. |
| 18:13 | "The intake itslef needs some kind of timed pacifier along a linear route to mshow the singer what to sing and when." | The take line. |
| 18:44 | "Yes and the retake buttons are redundant in the new Gui we designed so tayt works" | One compact table; no Re-take buttons in it. |
| 18:45 | "during a take we should see the sagital lline drawing as a guide for the tongue" | The drawing is in view through a take. |
| 18:45 | "Yes the change you made to the INsights language is exactly what I want" | English ratified: "INSIGHTS measures a piece from its score. Choose one under INPUT to begin." |
| 18:54 | "Can the Breath and Keep the shape segments be the same shorter length while the Sing and Fry match a lottle longer? … Let's stick with thatbaspect of the current design [two rows of five] … the Pacifier has been made obsolete. This process that we are rifining right now its its replacement" | A counted breath first; Breathe equals Shape, shorter; Sing equals Fry, longer; two rows of five stay. |
| 19:16 | "I LOVE the chart’s zoom toward the vowel during a take, abnd I wanted to ask if we could have that zoom-in animation for the switch to every vowel? … I want also for the user to bne able to swtich quickly bnetween vowels so they can really notiocie the diffenreces in the line draeings." | The detail glides on every switch; switching is quick. |
| 19:23 | "yes" | A tap selects and Start sings, in place of his 2026-11-12 rule that a tap starts the take. |
| 19:45 | "sewap the position of the vowel space detail and the line drawing" | On the stage the drawing is first and the vowel space detail second. |
| 19:50 | "this is looking really good." | The capture screen of prototype r3 is the reference. |
| 20:03 | "in Voice there is a whol intakle apparatus for self-reposted voice qualities. We need that in our plan" | Sections 3 and 4 are in scope. |
| 20:05 | "Once we have worked out a terrific plan ana Fable subagent has okd it, we will close this thread and resume in a fresh on" | This document, its review, then a fresh thread builds. |
| 20:10 | "Yes" | VOICE is four sections: whose voice, measure it, describe it, how INSIGHTS speaks to you. |
| 20:12 | "bless you for catching this, lets fix it / yes" | Whose voice moves to the VOICE band at rest; the singer is told that a voice type alone gives a working profile. |
| 20:16 | "yes" | The roster's marks move into the one table. |
| 20:18 | "yes" | "Describe it" gets its own door in the VOICE band, open at any time, with no microphone. |
| 20:20 | "Yes keep them in the Drawer, they are analogous to text;'s Notation section. … yes section 4 gets its own door in the VOICE band, and a link from the INSIGHTS page" | Section 4 stays in the Drawer, with a door and a link. |
| 20:20 | "I lkike the practice of linking parts of the complex app to one another … I'm open to other such opportunities for helpful connectivity" | More links may be proposed (section 4.7). |
| 20:26 | "c. We build this now. … Er csan merge lanes inm the new thread after this plan is settled." | All of it builds for the 2026-11-20 release; lanes 56 to 58 merge in the fresh thread. |

Earlier rulings this plan keeps: the accordion and the takeover (Fable's E.27 ruling of 2026-08-05 on Dann's own proposal; N.114a, Dann 2026-09-09: Calibrate opens the Drawer's takeover); two rows of five (Dann 2026-11-12 22:36); the voice type asked before the first vowel when the voice has none (Dann 2026-09-30 12:43 to 12:44); INSIGHTS' "Add your range" opening the range fields (N.164, Dann 2026-09-25).

## 3. What is built today

VOICE holds ten parts. Read by the desk at `2c07ab75`.

**In the Drawer at rest**

1. The closed band's state line: the voice's name and its count of ten (`routes/+page.svelte:1717`).
2. The open band's body: one line, `VoiceAnchor`: a dot, "Voice: {voice}" or "Voice: not yet calibrated", and one button, "Calibrate" or "Re-calibrate" (`lib/components/Drawer/VoiceAnchor.svelte`; mounted `routes/+page.svelte:4160`; `lib/i18n.ts:1216-1219`).
3. The group's notices, inside the same body: a score re-read's orphans, export and import errors and notices, placements with no note, the storage lines, the other-tab notice (`routes/+page.svelte:4196-4256`). The code's own comment says where a notice belongs "IS NOT RULED" (`:4189-4195`). The body renders only while the band is open (`lib/components/Drawer/Drawer.svelte:553-557`); whether anything opens the band for a notice is NOT ESTABLISHED.

**In the takeover** (`lib/voice/CalibrationWizard.svelte`, 1,726 lines; the one mount is `routes/+page.svelte:3881`; the takeover frame is `Drawer.svelte:845-859`)

4. The voice switcher (`lib/voice/ProfileSwitcher.svelte`; mounted `CalibrationWizard.svelte:1032`): with no voice saved it asks for a name first and the wizard waits behind it (`ProfileSwitcher.svelte:225-253`); after that, the name opens the list of voices, New, Duplicate, Rename, and Delete (`:255-340`). Inert during a take (`CalibrationWizard.svelte:1035`).
5. Welcome, "Finding Your Resonances" (`:1046-1065`): the lede, "What is vocal fry?", the voice type when the voice has none (`VoiceTypeFirst`, `:339-340`, `:1063`), Begin.
6. "Getting ready" (`:1066-1121`; logic `:646-714`): the room is heard, then a counted test fry with a bar, then its result. It runs for a fresh voice; a voice with any reading opens on the summary (`:319`).
7. The capture screen (`:1122-1140`; `lib/voice/VowelCapture.svelte`, 817 lines), with a notice when the room read lively.
8. "Profile summary" (`:1141-1195`): the note on readings outside Ilya's values (`OutsideNote`); the roster (`:916-1002`), each vowel marked Captured, Provisional, or Estimated, with "Beyond Ilya's reference values", "Noise floor: Unmeasured", the [o] note that opens LEARN, and Re-take; the vowel space sheet with Print (`lib/voice/chart/SummarySheet.svelte`, `VowelSpaceSheet.svelte`); Continue; "Sing the three Ilya derived for you"; Finish; Add or Edit voice characteristics; Start over.
9. "Voice characteristics" (`:1196-1280`): the voice type in nine types, 29 finer labels, and the singer's own words (`VoiceTypeIntake.svelte`); six notes, two each for the range, the comfortable working zone, and the passaggio (`NotePicker.svelte`); seven INSIGHTS questions, five on the voice, the topics, and one on acoustics terms; "How comments appear" (`InsightsIntake.svelte:86-130`). Every answer is optional and saves on change.

**From the page**

10. INSIGHTS' "Add your range" (`lib/i18n.ts:1800`) opens the takeover at the range fields (`routes/+page.svelte:1650-1660`; the wizard's `openRequest`, `CalibrationWizard.svelte:202`, `:321-332`).

**The rough spots this plan mends**

- The open band says less than the closed one, and its one button is named for none of the five errands behind it. For a voice with readings it opens a summary (`CalibrationWizard.svelte:319`).
- Changing whose voice Ilya uses is Re-calibrate, the name, the voice, and Back.
- A declared type with nothing sung already gives a working profile for soprano, mezzo-soprano, tenor, baritone, and bass (`lib/voice/engine/stand-ins.ts:81`; `resolve-values.ts:210`). Nothing tells the singer.
- From inside VOICE, part 9 opens from the summary's last button alone (`:910-914`), and the summary is reached from the capture screen only once a vowel is sung (`VowelCapture.svelte:265`). Describing a voice waits behind the microphone.
- INSIGHTS' settings sit at the foot of part 9.
- The capture screen is about 975 px tall in a desk Drawer and about 893 to 920 px on a 390 px phone (packet E4, arithmetic from the CSS). The large symbol and the side view sit outside its sticky stage (`VowelCapture.svelte:280-294`, `:504-506`) and scroll under the band.
- The take has no breath and one bar.
- The summary shows the ten readings twice, in the roster and in the sheet's table.
- The invitation "Sing the three Ilya derived for you" shows even with all ten sung (`:894-903`; packet F, "Defect 1").
- INSIGHTS' method note says "no voice has been measured" to a measured voice with no score (`lib/insights/InsightsPane.svelte:284-293`; packet H, "Defect 2").

## 4. The design

### 4.1 The VOICE band at rest: the voice's home

The closed band keeps its state line as built. The open band's body holds, in order:

1. **The voice line.** The voice's name with its chevron, which is the built switcher moved here with its list, New, Duplicate, Rename, and Delete. Beside it, the voice type: the type's name, or "Choose a voice type". Tapping the type opens the built voice type control in place (nine types, then the finer labels and the singer's own words).
2. **The state line,** one sentence that says what is there (drafts in section 5):
   - nothing sung, no type: what singing gives, and that a voice type alone is a way to begin;
   - nothing sung, a type with a typical voice: Ilya is using a typical voice of that type until the singer sings;
   - nothing sung, a type with none (contralto, countertenor, bass-baritone, "Not sure"): decision D3;
   - one to nine sung: the count, and that Ilya keeps a placeholder for the others;
   - ten sung: all ten are the singer's own.
3. **The doors.** Two buttons: the door to singing, named for the voice's state ("Sing your vowels", "Carry on singing", "Sing a vowel again"), and "Your vowel space", shown once there is a type or a reading. The Drawer's grammar fills exactly one pill in the whole Drawer at rest, the one thing that is next (`docs/memory/PRODUCT.md:522`). The door to singing is filled only when it is that one thing; otherwise both doors are quiet. The lane reads the path's rule and applies it.
4. **Two stations, closed on arrival:** "Describe your voice" and "How INSIGHTS speaks to you" (sections 4.5 and 4.6; their form is decision D1).

With no voice saved, the voice line is the built first-launch form: the naming sentence, the field holding "Voice 1", and Start (`ProfileSwitcher.svelte:225-253`). The rest of the body waits for a voice.

The notices are not in the band (section 4.8).

### 4.2 Section 1, whose voice

- The switcher and the voice type live in the voice line (section 4.1). Inside the takeover the voice's name is a plain label at the head of each screen.
- Changing the active voice from the band re-publishes it to the page as today (`CalibrationWizard.svelte:836-850`), so MELODY and INSIGHTS follow.
- **The quick start is told.** Choosing a type with nothing sung changes the state line at once (section 4.1, item 2).
- Welcome still asks the voice type when the voice has none (Dann 2026-09-30; decision D4). The answer is the same stored value.

### 4.3 Section 2, measure it: Welcome and the test fry

Unchanged in content. "Sing your vowels" on a voice with no reading opens Welcome, then "Getting ready", then the capture screen, as Calibrate does today. On a voice with readings it opens the capture screen on the next vowel in Ilya's order that is still a placeholder (`lib/voice/chart/opening.ts`, `openTour`), or on [i] when all ten are sung.

### 4.4 Section 2, measure it: the take

The reference is `docs/sessions/n203-voice-intake/prototype-synchronized_r3_2026-11-15.html`: the built capture screen with the take laid into it, using the ten drawings in `lib/voice/chart/sagittal/` and the app's own chart code. Its words on a yellow ground are drafts. Its axis numbers, fonts, and exact sizes are the sketch's.

**The screen, in order**

1. The head, "Your resonances", and the count (as built, `VowelCapture.svelte:275-278`).
2. The vowel's row: the large symbol in its circle at the built 6rem; the vowel's name and the drawing's credit; the readout of the two resonances, moved here from the cue's row.
3. The stage: two equal squares. The side view first, the vowel space detail second (Dann 19:45).
4. The take line: four parts in the proportion 2, 4, 2, 4, named Breathe, Sing, Shape, Fry.
5. The cue, in serif, alone in its row.
6. The first-time explanation, until a take has begun (as built, `:211`, `:324-326`, with new words).
7. The ten buttons, two rows of five, as built (`:328-344`).
8. The main button and the second button, with their built labels (`lib/voice/chart/screen-logic.ts:74-87`).
9. The hint; the sentence on the dots; the folded "Your readings"; the hide toggle; the way to the closing view (as built, `:352-399`, with new words where a tap is described).

**What a tap and a button do**

- A tap on a vowel selects it. Nothing starts. `tapVowel` ends at `selected = v` (`:237`); `startTake(v)` at `:238` goes.
- The main button sings the selected vowel, as `pressMain` already does (`:240-244`).
- While a take runs, a tap on any vowel does nothing, and Stop or Escape ends the take (DESK DEFAULT; the second tap that ends a take, `:234`, goes).
- The second button is Stop during a take, and Start over then Clear all at rest, as built (`:245-258`).

**The take, part by part**

| Part | Length | The singer | The line | The cue |
|---|---|---|---|---|
| Breathe | 2.0 s | breathes | part 1 fills | "Breathe." (draft) |
| Sing | 4.0 s | sings the vowel as usual | part 2 fills | "Sing {v} as you usually do." (the built line less "Three.") |
| Shape | 2.0 s | stops, and keeps the shape | part 3 fills | a short line (draft), in place of the 13-word `pacifier.pause` |
| Fry | 1.0 s to begin, then 3.0 s measured | begins again in vocal fry, and holds | the first quarter of part 4 fills as the fry is awaited; the rest fills over the measured 3.0 s | "Now {v} in vocal fry.", then "Now sustain. Sample recording." (both built) |

- The measured part is the engine's own 3.0 s sweep, unchanged (`lib/voice/capture-ritual.svelte.ts:36`; packet A2). The engine waits up to 10 s for a stable fry (packet A2); while it waits, the line holds at the first quarter of Fry and the cue stays.
- The ritual reports progress for the sweep and the landing alone today (packet J10). It gains a report of the part and of the progress within it, and the line reads that. The line is one `role="progressbar"` for the whole take.
- The count in words, "Three. Two. One.", leaves the take. Four ticks sound on the four seconds of Sing (DESK DEFAULT; today three ticks sound, packet J11). No tick sounds in Breathe, Shape, or Fry.
- **The microphone.** Today it is first asked for at the fry step, 6 s after the tap (packet J1). With a breath it is 8 s after Start. The take prepares its audio at the Start tap and opens the microphone at the Fry part, as today, so the microphone is live only for the fry. Whether that holds on an iPhone is NOT ESTABLISHED: the lane proves it on a real iPhone or says plainly that it could not. If it fails, the choice goes to Dann (decision D9).
- After a capture, the detail stays on the new dot for about 1.4 s, then the selection moves by Ilya's own rule (`lib/voice/chart/tour.ts:23-37`) and the detail glides there (DESK DEFAULT; the build's landing is 900 ms).
- The re-take rule, the rollback, the uncertain reading, the errors, and the take record are unchanged (`capture-ritual.svelte.ts`; packet A3, A4, A6).

**The vowel space detail**

- At rest it is moved in on the selected vowel, by the built `zoomTarget` (`lib/voice/chart/geometry.ts:93`). It glides on every change of selection, in about 800 ms (DESK DEFAULT). Under reduced motion it jumps.
- Today the view moves only when the ritual's phase changes (`VowelCapture.svelte:141-164`) and rests on the whole chart (`:156-172`); the selection gains a trigger, and the idle branches rest on the selection's view (packet D, J4, J5).
- The chart is drawn square here. The built frame is 484 by 280 (`lib/voice/chart/model.ts:12-13`). The lane decides how a square frame takes the built view.
- The selected vowel's zone deepens while a take runs, as built.
- The hide toggle hides the detail and the readout through a take. The side view stays (DESK DEFAULT).

**The side view**

- The built `SagittalDrawing`, in a square of the stage's half width: about 220 px in a desk Drawer and 155 px on a 390 px phone (the sketch's measure). Its line is re-weighted for that size; the built 7 and 6 units suit 132 px (`lib/voice/chart/SagittalDrawing.svelte:1-6`).

**Height**

- The sticky stage goes (`VowelCapture.svelte:504-517`). Done when, with Ilya's own fonts, everything from the VOICE band to the Start row is in view with no scrolling at 390 by 844 and in a desk Drawer at 900 high, on a first visit and after. The sketch measured 735 px, 652 px, and 717 px with fallback fonts.

**Last, and first to cut:** a tap on a vowel's zone in the detail selects that vowel, as its button does.

### 4.5 Section 2, measure it: the closing view, "Your vowel space"

The summary becomes the sheet. In order:

1. The note on readings outside Ilya's values, when it applies, with Keep them and Re-take, as built (`lib/voice/OutsideNote.svelte`).
2. The sheet's title, subtitle, and the voice's name (as built, `VowelSpaceSheet.svelte`).
3. The whole chart.
4. **The one table:** ten rows. Each row: a mark, the symbol, the vowel's name, the first resonance in Hz with its note, the second resonance in Hz with its note. A sung vowel has a filled mark. A vowel not yet sung has a hollow mark and Ilya's placeholder values in lighter ink.
5. **The roster's marks, in the table** (Dann 20:16): the word shows only where it applies, beside the vowel: "Provisional"; "Beyond Ilya's reference values"; "Noise floor: Unmeasured"; and the ⓘ beside [o] that opens LEARN. "Try again" stays where a sung vowel has no second resonance. The roster's "Estimated" and the chart's "placeholder" name the same thing, a value Ilya worked out for a vowel not yet sung; the table uses one word (decision D2).
6. The legend's four lines, then the footnote on sources (`lib/i18n.ts:2478-2485`), then Print.
7. A way back to the ten vowels; Finish; Start over with its confirmation.

Gone from this screen: the title "Profile summary" and its two ledes; the roster (`CalibrationWizard.svelte:916-1002`); Continue; the invitation to sing the three; Add or Edit voice characteristics. Finish returns to the Drawer at rest (decision D5).

Done when the chart and all ten rows are in one view at 390 by 844 and in a desk Drawer. The sketch measured the table's end at 698 px and 757 px from the band.

A re-take of one vowel is: back to the ten vowels, tap the vowel, Re-take. The note's own Re-take walks its vowels as built (`CalibrationWizard.svelte:777-783`).

### 4.6 Sections 3 and 4: describe your voice, and how INSIGHTS speaks to you

Part 9 is divided along Dann's four sections:

- **The voice type** goes to the voice line (section 4.2).
- **"Describe your voice"** holds the six notes (range, comfortable working zone, passaggio) and the five questions on how the voice is doing (top, bottom, passaggi, sustained notes, soft singing up high).
- **"How INSIGHTS speaks to you"** holds the topics, the acoustics-terms question, and "How comments appear".

Both are stations of the VOICE band that open in place, as NOTATION opens in ANALYSIS (`Drawer.svelte:540-548`), closed on arrival, each with a state line when closed (decision D1). Neither needs the microphone or a sung vowel. Every answer saves on change, as built.

The intro sentence that counts the questions (`lib/i18n.ts:2110`) counts five in "Describe your voice". `InsightsIntake.svelte` becomes two components along the same line.

The takeover loses the "Voice characteristics" screen (`CalibrationWizard.svelte:1196-1280`) and its two buttons.

**The floor, if slice 4 is cut (section 7):** the two doors are buttons in the band that open the built "Voice characteristics" screen in the takeover, by the built `openRequest`, at any time; Done returns to the Drawer at rest.

### 4.7 Links between parts

Ruled or built:

- L1. The INSIGHTS page links to "How INSIGHTS speaks to you" (Dann 20:20). The link's words are the station's name. It opens the VOICE band, opens the station, and brings it into view; on a phone it raises the Drawer first, as "Add your range" does (`routes/+page.svelte:1655-1660`).
- L2. "Add your range" opens "Describe your voice" at the range.
- L7. The ⓘ beside [o] opens the LEARN note (built).

Proposed, Dann's to pick (decision D6):

- L3. On the INSIGHTS page, the voice's name in the identity line opens the VOICE band, where the voice can be changed.
- L4. Where INSIGHTS says its findings use a typical voice (`lib/i18n.ts:1827`), a link to "Sing your vowels".
- L5. Where INSIGHTS has no voice to compare (`lib/i18n.ts:1831`), a link to the VOICE band.
- L6. In "INSIGHTS measures a piece from its score. Choose one under INPUT to begin.", INPUT opens the INPUT band.

`InsightsPane.svelte` stands at its ceiling of 744 lines (packet I). A link there needs lines freed first.

### 4.8 The notices leave the VOICE band

The notices block (`routes/+page.svelte:4196-4256`) moves out of the VOICE band's body to the foot of the Drawer's stack, after the last band and in view whatever is open (DESK DEFAULT; which band each notice belongs to stays unruled). `Drawer.svelte` has 9 lines of headroom and `routes/+page.svelte` 26 (packet I, before lanes 56 to 58 merge).

### 4.9 Two small items already ruled

- INSIGHTS' sentence for a piece with no score: the ratified English replaces `insights.silence.noScore` (`lib/i18n.ts:1833`). The French is a draft (section 5).
- INSIGHTS' method note for a measured voice with no score says what is there (draft in section 5). The test at `InsightsPane.svelte:289` reads the voice, where today it reads the model.

## 5. Words

Every new or changed string, as a draft. English is Dann's to ratify. French is Dann's alone: each French line is built from French already in `lib/i18n.ts` (the source is named), and open choices are flagged. Typography follows the file's rule (U+2019, and U+00A0 before a colon; `lib/i18n.test.ts:155`).

**The band**

| Where | English draft | French draft | Built from |
|---|---|---|---|
| State line, nothing sung, no type | Sing ten vowels, and Ilya maps where your voice resonates. Or choose a voice type, and Ilya starts from a typical voice. | Chantez dix voyelles, et Ilya situe les résonances de votre voix. Ou choisissez un type de voix, et Ilya part d’une voix type. | « voix type » `:1827`; « type de voix » `:2174`. OPEN: « situe » or « cartographie ». |
| State line, a typical voice | Ilya is using a typical {type} until you sing. | Ilya utilise une voix type de {voiceType} jusqu’à ce que vous chantiez. | `:1827` |
| State line, one to nine sung | {n} of 10 vowels sung. Ilya keeps a placeholder for the other {m}. | {n} voyelles chantées sur 10. Ilya garde une valeur par défaut pour les {m} autres. | « sur » `:181`; « valeur par défaut » `:2479` |
| State line, ten sung | All ten vowels are your own. | Les dix voyelles sont les vôtres. | « Les dix voyelles sont captées. » `:2491`. OPEN: keep « captées ». |
| Door | Sing your vowels | Chanter vos voyelles | infinitives as « Commencer » `:1282` |
| Door | Carry on singing | Continuer à chanter | « Continuer » `:1225` |
| Door | Sing a vowel again | Reprendre une voyelle | « Reprendre » `:1235` |
| Door | Your vowel space | Votre espace vocalique | `:2472`, unchanged |
| Type, when none | Choose a voice type | Choisir un type de voix | `:2174` |
| Station | Describe your voice | Décrire votre voix | new |
| Station and link | How INSIGHTS speaks to you | Comment les APERÇUS vous parlent | « les APERÇUS » `:2110` |

**The take**

| Where | English draft | French draft | Built from |
|---|---|---|---|
| Take line | Breathe · Sing · Shape · Fry | Respirez · Chantez · Forme · Friture | « friture vocale » `:1367`. OPEN: four verbs, four nouns, or the mix shown. |
| Cue, Breathe | Breathe. | Respirez. | new |
| Cue, Sing | Sing {v} as you usually do. | Chantez {v} comme d’habitude. | `:1364`, less the count |
| Cue, Shape | Stop. Keep that shape. | Arrêtez. Gardez cette forme. | « arrêtez, gardez cette forme » `:1304` |
| First time | Start gives you a breath, then {v}. First sing it as you usually do, to set the shape of your vocal tract. Then stop, keep that shape, and begin again in vocal fry. Ilya measures only the fry. | Commencer vous laisse le temps d’une respiration, puis vient {v}. Chantez-la d’abord comme d’habitude, pour régler la forme de votre conduit vocal. Puis arrêtez, gardez cette forme et recommencez en friture vocale. Ilya ne mesure que la friture. | `:1304`; the first sentence is new |
| Hint, first | Start follows Ilya’s order. Or tap any vowel to look at it first. | Commencer suit l’ordre d’Ilya. Ou touchez une voyelle pour la regarder d’abord. | `:2500` |
| Hint, during a take | Stop ends this take. Nothing is saved from it. | Arrêter met fin à cette prise. Rien n’en est conservé. | `:2501` |
| Hint, ten sung | Tap any vowel to look at it. Re-take sings it again. | Touchez une voyelle pour la regarder. Reprendre la chante de nouveau. | `:2506` |
| To the closing view | See your vowel space | Voir votre espace vocalique | `:2472` |

**The closing view**

| Where | English draft | French draft | Built from |
|---|---|---|---|
| Way back | Back to the ten vowels | Retour aux dix voyelles | « Retour au sommaire » `:1329` |
| Marks | Provisional; Beyond Ilya’s reference values; Noise floor: Unmeasured | Provisoire; Au-delà des valeurs de référence d’Ilya; Bruit de fond : non mesuré | `:1267`, `:1316`, `:1272`, unchanged |

**INSIGHTS**

| Where | English | French draft | Built from |
|---|---|---|---|
| No score (RATIFIED 18:45) | INSIGHTS measures a piece from its score. Choose one under INPUT to begin. | Les APERÇUS mesurent une pièce à partir de sa partition. Choisissez-en une sous ENTRÉE pour commencer. | « les APERÇUS » `:2110`; « ENTRÉE » `:166`. OPEN: « L’onglet APERÇUS mesure… »; « sous ENTRÉE » or « dans ENTRÉE ». |
| Method, a measured voice and no score (draft) | Method: your voice is measured. Add a score, and this page computes from both. | Méthode : votre voix est mesurée. Ajoutez une partition, et cette page calcule à partir des deux. | « Méthode : calculé à partir de… » `:1823` |

**For a type with no typical voice (decision D3)**

| English draft | French draft |
|---|---|
| For a {type}, Ilya works from your own vowels. Sing them to begin. | Pour une voix de {voiceType}, Ilya travaille à partir de vos propres voyelles. Chantez-les pour commencer. |

**Strings that leave use.** The tree marks a retired string UNUSED and keeps it. These leave use: `calib.anchor.uncalibrated`, `.named`, `.calibrate`, `.recalibrate` (`:1216-1219`); `capture.hint.first`, `.active`, `.finished` in their built words (`:2500`, `:2501`, `:2506`); `pacifier.singFirst` in its built words and `pacifier.pause` within the take (`:1364`, `:1366`); `calib.capture.cuePrefix` and `.cueSuffix` (`:1300`, `:1304`); `calib.capture.returnToSummary` (`:1329`); `calib.summary.title`, `.savedLede`, `.progressLedeSuffix` (`:1389-1391`); `calib.challengingInvite.button` and `.caption` (`:1274-1275`); `calib.characteristics.addButton`, `.editButton`, `.title`, `.doneButton` (`:1276-1277`, `:1397`, `:1412`); `calib.roster.actionsHeader` and `calib.roster.reading.estimated` if D2 goes as the default (`:1269`, `:1268`); `insights.silence.noScore` in its built words (`:1833`). Each brief lists its own with the tests that pin them.

## 6. Facts that constrain the build

- **Line ceilings** (`scripts/ratchets.json`; packet I, at `2c07ab75`): `CalibrationWizard.svelte` 1,726 of 1,727; `InsightsPane.svelte` 744 of 744; `Drawer.svelte` 1,981 of 1,990; `routes/+page.svelte` 5,508 of 5,534; a new file 1,000. Lanes 56 to 58 change these when they merge; lane 58's brief adds to `Drawer.svelte`.
- **The key index** at the head of `lib/i18n.ts` and `i18n-index.test.ts`: 1,270 keys at `2c07ab75` (packet I). Every new key moves a count.
- **Pinned words:** `lib/voice/chart/ratified-strings.test.ts` pins all 48 keys under `capture.` and `sheet.` and their number; `lib/insights/ratified-lines.test.ts` pins four method lines (packet C, H).
- **Pinned timings and gestures** (packet C): `count-in.test.ts` (all of it); `capture-ritual.test.ts` (the literals 1000, 3000, 3000, 900, and 6000); `screen-logic.test.ts` (hints, the first-time sentence); `VowelCapture.test.ts` (the progress bar, the first-time sentence); `e2e/calibrate-new.test.ts` items 2, 3, 4, 5, 6, 8, 9, and 14 break, and items 1, 7, 10, 12, 13, 15, and 16 depend on how it is built; `e2e/singer-paths.test.ts:92-110`, `:182-204` pin the Calibrate button and "Calibrate your voice to begin."
- **No unit test mounts the wizard** (packet C). The end-to-end suite is its only net.
- **Widths:** the capture screen has 452 px in a desk Drawer and 322 px at 390 px, by the CSS (packet E3; arithmetic, not measured). The component's own comment says 484.
- **The store.** The voices live in the wizard: `store` (`CalibrationWizard.svelte:237`) and every write (`:404-422`, `:444-450`, `:473-524`, `:631-643`, `:737-763`, `:792-798`). A change of voice also resets the wizard's screen (`:485`, `:501`, `:522`). The page hears of the active voice through `onActiveProfileChange` (`:836-850`; `routes/+page.svelte:3884-3891`). The wizard is always in the tree in Studio and hidden until entered (`Drawer.svelte:819-823`).
- **The components that move are stateless:** `ProfileSwitcher`, `VoiceTypeIntake`, `NotePicker`, and `InsightsIntake` take a value and call back (their header comments say so).
- **French:** every new French value must pass the OQLF spacing sweep (`lib/i18n.test.ts:155`).
- **Behind the wall** (`INCLUDE_MARKUP_INSIGHTS` false) VOICE shows its band and nothing under it (`routes/+page.svelte:1714-1716`). That holds.

## 7. The build

### 7.1 The seam

The band at rest needs the voices and their writes, which live in the wizard. Two ways:

- **B, the default for this release:** the wizard keeps the store and hands the page one more publication (the list of voices and the active id) and one object of commands (select, create, duplicate, rename, delete, set a characteristic, set an own answer). The band's components call those. The wizard is already mounted whenever VOICE is shown, so the band has them from first paint.
- **A, the cleaner end state:** the store and its writes leave the wizard for a module both import.

B is the smaller change against a file with no unit test. Lane 60's Step 0 reads the wizard and says whether B holds; if it does not, it stops and reports.

The wizard's `openRequest` (`:202`) grows from one screen to the doors' three: sing (Welcome for a voice with no reading, else the capture screen by `openTour`), the closing view, and, until slice 4 lands, the built characteristics screen. A capture in flight is never interrupted, as today (`:321-332`). A new callback closes the takeover from Finish.

### 7.2 Slices and lanes

| Slice | What | Lane | Files it owns |
|---|---|---|---|
| 1 | The take (section 4.4) | 59 | `voice/VowelCapture.svelte`, `voice/capture-ritual.svelte.ts`, `voice/count-in.ts`, `voice/chart/screen-logic.ts`, the chart's frame, their tests, `e2e/calibrate-new.test.ts` |
| 2 | The voice's home (sections 4.1, 4.2, 4.8), with the floor of section 4.6 | 60, first | `components/Drawer/VoiceAnchor.svelte` (replaced by a new component), `voice/CalibrationWizard.svelte` (the seam, the switcher's mount), `routes/+page.svelte` (the VOICE group, the notices), `e2e/singer-paths.test.ts` |
| 3 | The closing view (section 4.5) | 60, second | `voice/CalibrationWizard.svelte` (the summary), `voice/chart/VowelSpaceSheet.svelte`, `voice/chart/readings.ts`, their tests |
| 4 | The two stations and links L1 and L2 (sections 4.6, 4.7) | 61, after lane 60 merges | `voice/InsightsIntake.svelte` (divided), `voice/CalibrationWizard.svelte` (the characteristics screen goes), the VOICE group, `insights/InsightsPane.svelte` |
| 5 | The two INSIGHTS items (section 4.9) | 59, last step, or lane 61 | `insights/InsightsPane.svelte`, `lib/i18n.ts` |
| 6 | The tap on the detail; links L3 to L6 as picked | whichever lane is free | as each needs |

Every lane touches `lib/i18n.ts` and its index. Lanes 59 and 60 run side by side: they share no other file, and the capture screen's props do not change in slice 2.

### 7.3 Order in the fresh thread

1. Open as `docs/memory/README.md` says. Read `STATE.md`, then this plan and its review.
2. Read lanes 56, 57, and 58 as they now stand on GitHub (section 11), and merge them with Dann, so the new lanes branch from a `Shane` that holds them.
3. Put decisions D1 to D9 to Dann, one in each message, then the words of section 5, English first.
4. Brief lane 59, have Fable review the brief, start the lane. The same for lane 60.
5. For each lane as it reports: a Fable review as built, the fixes, pictures for Dann's eye, his walk, the merge, the ship.
6. Brief and start lane 61 when lane 60's seam is on `Shane`.
7. The freeze, then the 2026b release ritual (`docs/memory/OPEN.md`, N.202).

Each Code brief gets a Fable review before Code has it, and each lane a Fable review as built (standing rule). At this session's measured costs, about 370k tokens for a brief and 400k for a lane as built, three lanes are about 2.3 million Fable tokens. Dann's usage screenshot of 18:15 showed two Fable resets in hand.

### 7.4 If the freeze nears

Cut in this order, first to last: slice 6; slice 4 (the floor of section 4.6 already meets the rulings of 20:18 and 20:20); slice 5's method note. Slices 1, 2, and 3 are the release's VOICE. A slice that is not merged and walked by Dann at the freeze ships in the next letter, whole. No slice ships half-walked.

The freeze was proposed for Tuesday 2026-11-17 and is not ratified (decision D10).

### 7.5 Done, for the plan as a whole

- Every ruling in section 2 is true in the built app, in English and in French.
- Each of the ten parts of section 3 has a place in section 4, or is named as gone.
- The gates pass at the baselines measured on the merged tree, and the ship script's recorded baselines match.
- Dann has walked each screen on his own machine and on a phone, and has said what he sees.

## 8. Decisions that are still Dann's

Each has the default the build uses until he rules. One is put to him in each message.

- **D1. The form of sections 3 and 4.** Default: stations that open in place in the VOICE band, as NOTATION does. Other: screens that fill the Drawer.
- **D2. One word in the table for a vowel not yet sung.** Default: "placeholder", the chart's word, with a hollow mark; the roster's "Estimated" leaves use. Other: keep "Estimated" for the values Ilya derives from the singer's own anchors.
- **D3. The four types with no typical voice.** Default: the draft of section 5, and INSIGHTS behaves as today. Other: rule their values (QUEUE row 167) before the release.
- **D4. Welcome asks the voice type when the voice has none.** Default: it stays, as ruled 2026-09-30.
- **D5. Finish.** Default: it closes the takeover and returns to the Drawer at rest.
- **D6. Links L3 to L6.** Default: L4 and L6 in slice 6; L3 and L5 after the release.
- **D7. The words of section 5,** English and French.
- **D8. The take's small numbers.** Defaults: four ticks, on the seconds of Sing; the detail rests 1.4 s on a new dot; a glide of 800 ms.
- **D9. The microphone, only if the iPhone proof fails.** The choice then: open the microphone at Start, so its indicator shows through the whole take, or keep it at the Fry part and tell the singer to tap again there.
- **D10. The freeze.** Proposed Tuesday 2026-11-17. The desk's leaning: the VOICE lanes freeze Wednesday 2026-11-18 at 18:00, and the cut order of section 7.4 applies then.

## 9. NOT ESTABLISHED

- Whether audio prepared at the Start tap still runs 8 s later on an iPhone (packet J1).
- Whether anything opens the VOICE band when a notice appears (section 3, part 3).
- Who passes the wizard's `onComplete`, and what Finish must still tell the page (packet F).
- The declared voice type of Dann's own profile; prototype r3's zones are a bass's.
- What lanes 56, 57, and 58 pushed after their reviews (section 11).
- Whether the HTML prototypes failed to run where Dann opened them, or ran and failed to explain. He said at 20:02 that they "don't work". The desk has not asked. Until it is known, a sketch goes to him as words or as a still picture.
- How the built view fits a square frame without distortion; the sketch's answer is one of several.
- Whether Dann's recorder holds takes beyond the 13 in the one file in his Downloads (section 11).

## 10. Errors the desk made tonight, corrected

- Told Dann a scout would cost at most 250k tokens; it cost 349,734.
- Called prototype r4 "as built" when it drew three of VOICE's ten parts.
- Told him at 19:43 that it had read the wizard's five screens; it had read four, and none of the components they mount. The read was finished after he asked at 20:03.
- Dropped the roster's five marks from the closing view of r2 to r4 without saying so.
- Built r2, r3, and r4 on a plan it had not told him.
- Told him at 20:20 that his microphone takes were still owed, from a reading of 18:23.
- Wrote clock times it had not read, twice.
- Held as a default that the voice type question leaves Welcome; reversed here (D4), because the type steers the guard from the first take.

## 11. The state of things for the fresh thread

Read 2026-11-15 at 20:27 Toronto.

- **Dann's tree:** `Shane` at `2c07ab75`, as on GitHub. Modified and uncommitted: `docs/house-style/SKILL.md`, `docs/house-style/interface-text.md`, and `docs/memory/` `ENVIRONMENT.md`, `INBOX.md`, `OPEN.md`, `QUEUE.md`, `STATE.md`. Untracked: `docs/sessions/n203-voice-intake/` (this plan, its review, the packet, prototypes r1 to r4), `docs/sessions/review-fable-lane56-strophic-a_r1_2026-11-15.md`, `docs/sessions/review-fable-lane57-welcome-sheet_r1_2026-11-15.md`. A ship of these is owed.
- **Lanes on GitHub:** `cloud-lane-56` at `590a3655`, `cloud-lane-57` at `70449563`, `cloud-lane-58` at `0b4b5517`. Each has moved since the desk last read it (56 was `3ada754`, 57 was `2463d03`, 58 was unread). The reviews of 56 and 57 and the fixes asked of them are in `docs/memory/QUEUE.md`, rows 191 to 193.
- **N.200 Step 4:** Dann said at 20:26 that his microphone takes are complete. His Downloads holds one capture file, `ilya-captures-58b6f3eb-2026-11-15T23-23-04-830Z.zip`, with 13 takes covering the ten vowels. The scoring starts from what is there.
- **The reference files** are in `docs/sessions/n203-voice-intake/`: `prototype-synchronized_r3_2026-11-15.html` (the take and the closing view; md5 `20139bc0`), `packet-sonnet-n203-voice-intake_r1_2026-11-15.md` (md5 `46bb4dfe`). Prototype r4's band is superseded by section 4.1.
- **How Dann is to be worked with on this:** one thing in each message; the plan said before any act; `docs/memory/OPEN.md`, N.203, "HOW N.203 IS WORKED FROM 20:02" and "HOW THIS THREAD ENDS".
