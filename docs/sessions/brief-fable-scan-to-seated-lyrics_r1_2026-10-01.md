# Brief for Fable: a scan in, a melody out, Russian seated under it, today

**Written by:** the desk (Opus), 2026-10-01 15:15, at Dann's request, closing the thread that began 14:28.
**For:** Fable, at the helm of a fresh thread the same day.
**Read this whole brief before your first reply. Part 1 comes first on purpose.**

---

## Part 1. How you work with Dann today. This was agreed this afternoon, and he must not have to go through it again

### What happened

In the 25 minutes between 14:28 and 14:53, the desk broke the behavioural contract three times. Dann then stopped all work and took the desk back through it, step by step:

1. **He asked for a URL. The desk gave him a Terminal command** (`open "https://…"`), and it had done the same twice before in that thread, for the IMSLP page and for a PDF. His words: *"I asked for an URL not a TErminal prompt. Why are you offering me something I explicitly did not ask for?"*
2. **The desk stacked asks.** Its first reply put the repository-state request and a design question together.
3. **The desk pressed for ratification while he was thinking.** He questioned a fact about text extraction (rightly, in part). Each time the desk answered, it put "do you ratify?" on top of the answer.

He then asked the desk to find the controls, read them, say what they tell it about him, and contrast them with its own actions. The desk's conclusion, which he accepted as the basis for continuing:

> I followed the controls as a checklist, not from your seat. The fenced-block rule exists to save you effort. I applied it against your explicit request, which made you work harder. When your words and the form of a rule disagree, your words win, because the rule exists to serve you.

And on the mechanism:

> Each time, I matched your words to a pattern I already had, such as "URL, so a fenced command" or "pending ratification, so ask", and acted on the match before reading what you actually said. That's the impulsiveness you're naming.

He said that writing another rule will not fix this. His words: *"I have been dancing this dance with you for almost a year. Nothing reigns in your impulsiveness."* He asked the desk to read the controls again, recommit, and keep them at the front for the rest of the work, and he appealed to its respect for his mental health. **The desk agreed. That agreement carries into your thread.** He asked, at 15:12, that this brief carry it, in his words: *"Please don't make me go through that again."*

### What that means for you, in practice

- **Read `docs/memory/README.md`, `CONTRACT.md`, and `STATE.md` as the opener says, and read them as a description of a person, not as a checklist.** Tether 20 comes first: take his position, then write. Every other rule is a consequence of that one.
- **Answer exactly what he asks, in the form he asks for it, and nothing more.** A URL is a URL. A yes-or-no question gets a yes or a no first.
- **One question at a time, and only taste, the irreversible, or French.** Decide everything reversible yourself and mark it `DESK DEFAULT`.
- **When he questions a fact, the question is the work.** Answer it, with its source, and stop. Do not attach the pending decision to the answer.
- **When he says a thing is bad, that is the finding** (tether 22). Today he said the scan result is *"abysmal"* and *"insufficient and wrong"*. Do not defend the reader. Lead with what would be better.
- **Never usher him away.** He stops when he stops.
- **Volume is a cost you spend on his behalf.** Short replies. Tables when comparing. Anything he must read or judge arrives rendered in the chat, never as a file to open.
- **Every claim carries its source** (`path:line`, a run, or NOT ESTABLISHED). No inference unless he asks for one (tether 21).

### His state this afternoon

He is frustrated and determined, and he has been explicit about both. His words at 15:11: *"Let's build somthing better."* and *"A simple scan of a pdf must work reasonably well before a public release. Without that basic capability Ilya is wasteful garbage."* He also said: *"It is clear to me that we cannot expect 100% accuracy and that is why we have designed the editing tools for the user. But we have GOT to do better than this."* He wants a collaborator who moves fast and well, not a gatekeeper.

---

## Part 2. The goal, in his words (15:11)

> By the end of day I want Ilya processing a scan, extracting a melody with respectable accuracy, and seating Russian lyrics underneath their corresponding notes predictably.

### Dann's clarifications, 15:22 to 15:24, in his words where quoted

1. **The melody includes dynamics and tempo indications.** *"Ilya finds the voice staff on every system of every page and reads the melody with respectable accuracy: the metre, the barlines, the pitches, the rhythms, the rests, the dynamics, the tempo indications, and the pickup."* These are IN today's goal. N.177 and N.178 (numbered 02:39 this morning) are the record of that work, **not a fence around it.** When the desk proposed treating them as optional, Dann's words were: *"The builder sees a choice I made early this morning as an edict. The user sees useless garble. Please adopt my prioritization of building software that works, not software that slowly evolves at your pace."*
2. **Notation is data, not artwork.** *"I don't require duplication of the page layout or literal replication of system divisions. These should be controlled by Gould's engraving rules... The information conveyed can survive (proper, rules-based) re-engraving. The engraving layout will be able to be modified by the user anyway."* What must survive is the musical information, not the page's systems.
3. **The words come off the scan.** *"I want the words read off the scan, and I wonder what the most reliable method will be? It could be simply examining which syllable sits under the note on the stave and transcribing it directly? Although I feel like we have assets programmed into Ilya (dictionary and prose rules) that should be harnessed to improve accuracy? This is something Fable and I will solve today."*
4. **Guessing is not a modality for well-constructed software.** *"We should zoom in on any aspect that guesses and offer a better means of processing."* Today's read shows two guesses on its face: the voice staff (*"read the top one"*) and the rhythm (*"Length assumed on 33 notes"*).
5. **The octave drop is open.** *"Fable and I will talk this out, it may not be necessary to do this but I appreciate the effort."*

6. **Text is text, whatever the script.** Dann, 15:25: *"If we can get Ilya to recognize text on a page, I don't see the problem whether that text is in latin characters (English, French, Italian) or extended Latin characters (German) or Cyrillic characters (Russian)."* So lyrics, tempo words, and dynamics are ONE capability: reading text on the page. The desk's note, agreed in the exchange: what makes it reliable is position. Text under the voice staff is lyrics (checked against the Russian dictionary after syllables are rejoined); text above it is tempo and expression (checked against a small known Italian vocabulary; a fuzzy tempo-term resolver already exists, `f117532`); text between the staves is dynamics (mostly engraved glyphs, matchable like the reader's rest templates). The 2026-09-14 whole-page pass failed partly because it mixed Russian and German in one pass; region by region, each with its own language and vocabulary, removes that.

7. **The octave is a side problem, not today's.** Dann, 15:27: tenors and low voices read a plain treble clef as treble-8vb by habit, so a wholesale octave displacement may not matter. *"Please don't be preoccupied with this, we can add it as another problem to solve."* Park it; do not let it shape today's work.

8. **Two kinds of text, told apart by geometry.** Dann, 15:29: *"we may also be able to get Ilya to recognize a string of text on the horizontal axis at a regular/shared distance under the stave. These will be lyrics. Other text detected will seem to float in the stave. These will be dynamic markings, tempo alterations, and other artistic directives from the composer or the editor. We can teach Ilya to cognitively connect these elements in a way that produces a cogent data stream for analysis and representation in our melody construct. This is part of what we will build together today."* So the syllable-under-the-note reading is one part of a larger matrix: first find the lyric LINE as a horizontal band at a shared distance under the voice staff; everything else is directive text, placed by where it floats. The desk's note: a song with more than one verse, or a printed translation, has several such bands in order (Sunless 1's Lamm scan had Russian over German), and the printed hyphens and extender lines between syllables are boundaries the reader can use for segmentation.

### The desk's notes on those, offered as input, not rulings (DESK INFERENCE where not sourced)

- **On 2:** register is data, not layout. A treble clef sung by a baritone sounds an octave lower by convention, so the question is whether Ilya stores written or sounding pitch and how it shows the convention (an octave treble clef, or printed pitch marked). Today Ilya moved the notes instead; the Insights notice says its typed range triggered that.
- **On 3:** the 2026-09-14 measurement supports reading the syllable under each note: 10 of 12 cropped syllables read correctly against 47% whole-page. The dictionary did nothing on fragments, because almost any two to four Cyrillic letters begin some word; its leverage comes **after** the syllables are rejoined into words, which Ilya already does (`memo-the-text-problem` A8). Pre-reform spelling (ѣ, final ъ, «-аго») must be normalized before that check. N.163 is the risk to design against: a misread word shown with a confident gloss.
- **On 4:** the clef-and-key prompt (N.97) is the one place Ilya already reads, pre-fills, and asks. The voice staff has evidence available: the staff with text under it, the single staff above the braced pair, the PIANO label. Ask for a list of every place the reader assumes.

`CONTRACT.md` posture 6 still holds: quality over speed. The date never sizes the work. Plan for speed through parallel work (two subagents beside Code), never through doing less.

---

## Part 3. The test case

**The score.** Tchaikovsky, «Средь шумного бала», Op. 38 No. 3, poem by A. K. Tolstoy. First edition, Jurgenson, Moscow, 1878, plate 3343. IMSLP #1052590, marked Public Domain. Chosen 14:30 today as the Guide's example song, replacing Sunless 1 (the Lamm scan, 1931, may not be public domain in the US until 2027).

| file | md5 |
|---|---|
| `~/Downloads/Tchaikovsky_Op38-3_Sred-shumnogo-bala_Jurgenson-1878.pdf` (3 pages, No. 3 alone, extracted by the desk with `qpdf` from pages 11 to 13 of the set) | `3d3d4684a1180bd4d4904ccbaca15bfb` |
| `~/Downloads/IMSLP1052590-PMLP44986-Op38_F.pdf` (all six songs, 27 pages, 2,691,218 bytes) | `d42d5856f52822922c29b1e3d6ac138b` |

**What the page shows**, read by the desk at 110 dpi this session:

- Voice staff over a piano grand staff, three staves per system. Three systems on the first page; the second and third pages are full of systems too (the desk did not count them).
- Treble clef, two sharps, **3/8**, *Moderato*, *con tristezza* over the voice entry.
- **Seven bars of voice rest** under the piano introduction, then the pickup «Средь шум-на-го» at the end of the first system.
- **Pre-reform orthography in the underlay:** «шумнаго», «вѣтре…», «увидѣлъ», with ѣ and the final ъ. A reader or a dictionary that expects modern spelling will miss these. The words are printed hyphenated by syllable, with some hyphens crowded together.

**What Ilya produced**, from Dann's screenshots, first read (about 15:05):

| | The page | Ilya |
|---|---|---|
| Metre | 3/8 | 4/4 |
| Opening | Seven bars of voice rest | Notes from the first beat |
| First page | 3 systems, 9 staves | "2 systems, 4 staves" |
| Length | 3 pages of music | "47 notes, 7 rests, 5 measures"; "Ilya could not read page 3" |
| Barlines | Every bar | None in the second system drawn |
| Voice staff | The top staff of each system | "could not tell which staff carries the voice in 2 systems, and read the top one" |
| Rhythm | | "Length assumed on 33 notes (measures 1, 4, 5)" |
| Pitch | Treble, as printed | Drawn an octave down, hanging on ledger lines (the Insights page says why: the line sat an octave above his typed range) |
| Words | Printed under every note | None (expected today; the banner says to type them) |

**Second read (about 15:10).** Dann suspected he had skipped an input step and read again. The clef-and-key prompt (N.97) pre-filled **Treble** and **2 sharps**, both correct. His verdict on the result: *"This is what we get and it is insufficient and wrong."* The desk did not see the second result's details. **NOT ESTABLISHED** how it differs from the first.

---

## Part 4. What exists, with sources

### The page reader

- **The E.16 reader: about 5,740 lines of Python** in `tools/e16-harness/reader/` (`wc -l *.py`, this session). That directory is authoritative, ratified by Dann 2026-07-27 (`tools/e16-harness/reader/README.md`, md5 `bd0bf6614ac362a404c5ddfe5f730500`). It is copied to `apps/web/static/reader/` by `scripts/copy-reader.mjs`.
- **It is classical computer vision with no machine learning**, by its own charter: *"There is no machine learning anywhere in it (charter tripwire T3)"* (`README.md`, "What this is"). **Tether 17 applies: that tripwire is dated 2026-07-27 and the desk did not check what has amended it.** Whether it binds today's choices is a question for Dann, and it bears directly on the options in Part 5.
- **It runs in the browser** under Pyodide v0.26.4 (cv2 4.9.0, numpy 1.26.4, matplotlib) in a Worker, lazily, on the first picture (`apps/web/src/lib/reader/page-reader.worker.ts:1-31`, `page-reader.ts:1-21`).
- **Its stages:** staff detection, vocal-staff selection, noteheads, pitch, accidentals, barlines, dots (`reader.py`); beams and stems (`beams.py`); hollow heads (`hollow.py`); rests (`rest_templates.py`); time signatures (`timesig.py`); durations and measures (`run_page2.py`); metre (`metre.py`); the piece-level envelope across pages (`envelope.py`). Table from `README.md`.
- **The route into it:** a PDF or picture is rasterized; `hasStaves` decides score or poem (`apps/web/src/lib/score/ScoreUploader.svelte:266-291`). Staves found means the score route; no staves means the poem route, by text extraction and then Russian OCR (`:290`, `:405`).

### Prior measurements, all on the Sunless 1 Lamm scan, none on this one

- **`docs/sessions/memo-n96-pdf-ingest_r1_2026-08-24.md`** (md5 `e7e526ccf7fe3903a7869539a85d5554`). Audiveris 5.9.0, built and run at arm's length, page 1: **55 of 58 ground-truth notes aligned with identical pitch letters**. It attaches lyric syllables to notes positionally. Its OCR is English by default; forced to Russian, the text is usable only in part. Audiveris logs rhythm trouble on both pages. **Audiveris is AGPL; Ilya is MIT** (`LICENSE`, `package.json:5`). Nothing from Audiveris is bundled.
- **`docs/sessions/memo-n135-ocr-measurement_r1_2026-09-14.md`** (md5 `fbe80e59486bb3893f5b7bb7fb7a689c`). Whole-page Tesseract on the Russian underlay: **47%**. Adding German or English didn't help. **Cropped one syllable at a time: 10 of 12 (83%)**, on one system cut by hand. Its bottom line: the lever is segmentation, not the OCR engine. Not established: whether Ilya's notehead geometry yields good crops automatically. A whole-word dictionary does not constrain 2-to-4-letter fragments. The tesseract.js first-use wire cost is about 3.9 MiB, from a CDN.
- **`docs/sessions/memo-the-text-problem_r1_2026-09-14.md`** (md5 `8eacdbf5014f00aaed3cbc118f25623a`). Its A8: Ilya already rejoins a syllabified underlay into words and knows which note each vowel nucleus sits on (`vowel-resolver.ts:198-235`, as cited there; not re-read today).

### What seats words today

- A score **file** that carries its words fills the poem box and seats them (N.134, `e973afc`; `+page.svelte:3259` per this morning's `OPEN.md` addendum).
- A pasted poem is seated one syllable per note (the Input field's own line: "Your text is under the notes, one syllable per note").
- **N.135**, *"The page reader reads the text underlay"*, ruled by Dann 2026-09-14, is open. `OPEN.md` holds only today's addendum under it, which records the risk on file: **N.163**, an OCR misread («То» as «Го») reached a singer as a false word with a confident gloss.

### Architecture on record (dated; check amendments per tether 17)

Ilya is a static site (`@sveltejs/adapter-static`) with one precedent for a server-side function: the ephemeral Vercel function for `.musx` conversion at `ilya.dannmitton.com/api/shane/convert` (project memory, "architecture-decisions", updated 2026-09-11). Any option that reads scans on a server meets the licence question and the offline-capable stance.

---

## Part 5. What Fable is for, today

Your job is the ruling the desk could not make: **which road gets a respectable melody and predictably seated Russian off this scan, today, and how we will know.**

The roads the desk can see, **not ranked and not measured on this score**:

1. **Repair the E.16 reader** where this page breaks it: system grouping, the voice staff, 3/8, barlines, multiple pages. It keeps the no-ML charter and runs in the browser.
2. **Read scans with an established OMR engine** (Audiveris measured best on Sunless; others, such as oemer or homr, are **NOT ESTABLISHED** here). That raises the AGPL question against Ilya's MIT licence, a server or a WASM build, and the no-ML tripwire.
3. **A hybrid:** keep E.16 for notes and add per-syllable crops under the found noteheads for the words (memo-n135's 83%), with pre-reform spelling normalized before the dictionary.
4. **Build none of these today** and say so, if that is what the evidence supports. (Tether 13.)

**What "done today" has to settle with Dann, in your first exchange, one question at a time:**

- ~~Where the words come from.~~ **Settled by Dann 15:22: off the scan.** The method is what he and Fable solve.
- **"Respectable accuracy" as a number** we can measure, and against what truth. **There is no ground-truth MusicXML for this song in the tree or in `~/Downloads`** (searched this session). Making one is the first piece of mechanical work and a clear farm-out.
- Whether the no-ML tripwire of 2026-07-27, and the browser-only stance, still bind.

### The working arrangement

- **The desk does not build** (`CONTRACT.md` §5). Code builds on Dann's machine. Briefs go in `docs/sessions/brief-code-*.md` and enter `docs/memory/QUEUE.md` the moment they are written.
- **Two subagents at most, cost stated first.** The desk spawns them itself. Usage, from Dann's screenshot at 15:11: current session 8%, this week 63%, Fable this week 27%. **Usage does not determine the work** (Dann, 2026-09-24).
- **No agent writes with git.** Read-only git from the bridge as `git --no-optional-locks`.
- Folder grants do not carry between sessions: request `/Users/dannmitton/Desktop/ilya-rewrite` and `/Users/dannmitton/Downloads` first.

---

## Part 6. What the desk could not establish

- What the second read (about 15:10) produced in detail.
- Whether the charter's no-ML tripwire has been amended since 2026-07-27.
- How many systems and bars pages 2 and 3 hold.
- Which stage of E.16 fails first on this page. A staged trace (staves, systems, voice staff, metre, barlines) is the cheapest way to find out.
- Whether any OMR engine other than Audiveris has been measured on this project.

NOT ESTABLISHED beats a complete invented answer.
