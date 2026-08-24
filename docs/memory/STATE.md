# STATE — where we are

**Rewritten clean at the close of E.48, 2026-08-13. Again at E.51, 2026-08-15.
Again at E.52, 2026-08-16.** Updated at the close of every session. This is the
only file that changes often, and it is the handover.

Repository: branch `Shane`.

**THIS FILE NEVER NAMES HEAD, AND CANNOT.** The commit carrying this line cannot
name itself, which is why every previous attempt was stale within the hour and
cost a minute at the next session's open, twice.

What it names instead is a **FLOOR**: everything described below was true at or
before **`f3b257b`**, raised from `7f6a283` on the evening of 2026-08-24 when
the OMR day's three ships landed with five gates at baseline on each and the
pushes printed `b08bd86..b2a502c..bc2a026..f3b257b`; gate 4's baseline moved
725 -> 754 with the third ship and `ilya-ship.sh:79` was updated before it
ran. Before that `7f6a283`, raised from `1f4e268` late on 2026-08-24 when N.83's two reader ships landed with five gates at baseline and the pushes printed `1c97f6b..fe74ece..7f6a283`. Before that `1f4e268`, raised from `2440bf5` in the small hours of 2026-08-24 when N.62 shipped with five gates at baseline and the push printed `b54be1a..1f4e268`. Before that `2440bf5`, raised from `230cad3` at the close of 2026-08-23 night after N.81 shipped with five gates at baseline and the push printed `848059e..2440bf5`. Before that `230cad3`, raised from `9d314de` at the close of 2026-08-23 after two N.80 ships, pushes `d0a1895..d491d22..230cad3`, five gates at baseline on each. Before that `9d314de`, raised from `9cc68e5` late on 2026-08-23 when the colon audit shipped with five gates at baseline and the push printed `cc3b912..9d314de`. Before that, `9cc68e5`, because N.78 shipped with five gates at baseline and the push printed `0f034ab..9cc68e5`. Before that it was raised from `2b81f5a` at the close of 2026-08-21,
because N.77's six ships all landed with five gates at baseline and the pushes
printed `46ab5e2..0fcaa6e..9f11490..d079794`, so every build this file describes
is now in history. **The push range is the check, not the memo.**
A floor that predates
its own content is the stale number this paragraph exists to prevent. A floor cannot go stale, because further commits only
move HEAD forward and never make the floor false. If the tree is ahead of it,
that is expected and tells you only that work has landed since.

**Ask Dann for the state in one line. You do not run git.**

```
git -C ~/Desktop/ilya-rewrite --no-pager log -1 --format="%H %cI" && git -C ~/Desktop/ilya-rewrite --no-pager status --porcelain
```

**The night of 2026-08-16 built the save function.** N.67 steps 0, 1, 2, 3, 4a,
and step 5's single-song half; N.68, N.70, N.71 closed; N.55b repaired; N.72's
minimum shipped and walked; `bits-ui` removed; the Guide's false claim
corrected. Ilya keeps songs and score files in
IndexedDB, brings the score back on reload, cannot destroy a placement made by
hand, and now says so before a different piece replaces a song. **Every one of
those closures was walked by Dann on a real deploy**, which is the only reason
any of them count.

---

## THE ONE THING

> **N.80 IS DONE. Walked by Dann 2026-08-23 on `ilya-pmuwo7k1r`: [u] read
> `270 Hz 735 Hz Captured` on the roster, two of three takes captured
> through the best-window path, the third Provisional with its reason
> named.** N.78 and the colon audit closed earlier the same day. The
> blocking set is empty.
>
> **2026-08-23 NIGHT, LATER: N.81 DONE, N.79 RULED CLOSED, N.62 ENUMERATED.**
> N.81, the calibration takeover's rule goes lavender, shipped `2440bf5` and
> was walked by Dann on `ilya-2xbpbyyyv`: both rules read lavender. N.79 is
> ruled by Dann: **do nothing**; every transition stays as it is. N.62 is
> enumerated, nothing built:
> `docs/sessions/memo-n62-enumeration_r1_2026-08-23.md`. Five rows, two
> coined French words awaiting Dann's eye, and one finding bigger than N.62
> (the watch band's header prints English in French mode).
>
> **THE ONE THING: N.62, the accessibility sweep, at the step "Dann approves
> or strikes the French table in the memo."** Then one Code brief, one ship,
> one walk. Do not write the brief before he has seen the table.
>
> Usage when the session closed, 00:06 on 2026-08-23: all models 87%, Fable
> 77%, both resetting about 05:00. The enumeration was done on Fable because
> the shared pool was the scarcer one that night.
>
> **2026-08-24 SMALL HOURS: N.62 IS DONE.** Ratified, built by Code in one
> ship (`1f4e268`), and walked. Rows 1 to 4 read off the rendered DOM on
> `ilya-4f6fwt03u` in both languages by the desk driving Chrome; row 5's
> button needs a loaded song, so its evidence is the served bundle
> (`Modifier la glose` once, `le glose` zero, all 19 scripts), and **Dann
> accepted the walk on that**. Glance at the gloss button next time a song
> is open. Gate 4 is **725**; the ship script's line 79 already expects it.
>
> **2026-08-24, THE RELEASE SESSION: seven rulings, eight numbers, two Opus
> audits.** N.82 through N.89 numbered and ordered (section below). The two
> release re-audit memos are in `docs/sessions/`
> (`memo-release-audit-a_r1_2026-08-24.md` and `-b`). Footer C, the
> classification header, and the binder manifest fields are RATIFIED from
> rendered drawings (`footer-options_r1`, `header-proposal_r2`, both in
> `docs/sessions/`).
>
> ~~**THE ONE THING: N.83, walkthrough prep.** A colleague asked Dann for a
> walkthrough this week. First step: the IMSLP demonstration, one Russian
> piano-vocal PDF through the reader on a deploy, which doubles as the
> reader's first honest end-to-end accuracy datum. Accuracy judgement is
> Dann's eye against the paper, never a script's count.~~
>
> **2026-08-24 NIGHT: THE DEMONSTRATION RAN, AND THE DATUM IS IN DANN'S
> WORDS: "the notation rendered is totally incorrect but at least there is
> something output."** Mechanism end to end, accuracy no. Two ships
> (`fe74ece`, `7f6a283`, five gates at baseline each), Dann's walk on
> `ilya-9256h493b`: the Lamm scan of Without Sun song 1, as a 400 dpi PNG,
> reads in 6.1 s in the browser (3 systems, 9 staves, 57 notes, 50 duration
> abstentions, 0 rests) and renders. The whole account, five walls and
> their fixes, is `docs/sessions/memo-n83-scan-read_r2_2026-08-24.md`; the
> raw PDF stays unreadable (pdf.js cannot decode JBIG2, no newer pdf.js
> exists) and the walk-swallow defect in `beams.py` was ruled and repaired
> by the desk under Dann's "solve this tonight". N.90 and N.91 numbered.
>
> **THE ONE THING: N.83's remainder, the walkthrough itself.** The
> demonstration asset is the PNG on the deploy, shown honestly as
> mechanism-works-accuracy-poor, with a `.musx` score as the accurate
> contrast. Waiting on Dann: numbering for the JBIG2 ingest gap and for
> the accuracy decomposition (pitch against rhythm against count).
>
> **RULED THE SAME NIGHT, from the datum itself: N.92, notation editing
> tools, and N.93, easy text entry interfaces.** Dann: "tonight just
> proves the necessity of notation editing tools and easy text entry
> interfaces... There is no point in Score Markup without corresponding
> prescriptive vowel values to the correct pitches in the melody." Both
> in INBOX.md with N.90 (the photograph tier and its research map) and
> N.91 (the piano-doubling witness and the OpenScore Lieder benchmark),
> all four numbered 2026-08-24 and none yet placed in the release order.

>
> **2026-08-24 MORNING, WALKTHROUGH PREP: the run sheet is ready and the
> track order is ruled.** N.83's run sheet is
> `docs/sessions/runsheet-n83-walkthrough_r2_2026-08-24.md` (r1 superseded,
> beside it; both new to git). Ruled by Dann this session: the engraved
> anchor is Without Sun song 1; the call is Thursday, Dann's to schedule;
> part 1 runs in the colleague's own browser, because Zoom remote control
> moves their mouse and never carries their microphone; N.94 is numbered
> (transposition interface, Newzik model; the INBOX line cites the E.31
> rulings, 2026-08-07, amendments checked, none found); the track order
> after the walkthrough is OMR, then N.92, N.93, N.94. The desk's offer of
> a demo-minimum picker before Thursday was CUT by Dann as too much; beat 5
> uses the r2 fallback. Tree, read this session: no picker exists in
> `apps/web`; `transposeScore` is `transposition.ts:63`, the ranking `:214`,
> `INTERVAL_NAMES` `:136`, and `transposePitch` spells sharps only
> (`:41-56`).
>
> ~~**THE ONE THING: OMR refinement, in a new thread today.** N.90 and N.91,
> with the JBIG2 ingest gap and the accuracy decomposition still awaiting
> Dann's numbering. The walkthrough waits on Thursday with one open slot,
> the deploy URL, and the colleague needs that URL and the engraved file
> before the call.~~
>
> **2026-08-24 EVENING: THE OMR DAY IS CLOSED. Three ships, three walks,
> the morning goal met end to end.** Dann's goal, set at the open: a system
> that intakes a PDF, produces a monodic melody line, and can be altered
> inside Ilya where it diverges from its source. All three legs are DONE.
>
> **THE ONE THING: N.97, clef and key reading, ask becomes confirm, in a
> fresh thread.** Numbered by Dann this session. The reader learns clef and
> key glyphs by the same Leipzig template machinery as rests and time
> signatures; the payoff is measured (memo N.95: 11 of 13 false positives
> sit on clef and key ink), and the intake prompt becomes a confirmation of
> what was read. **Its brief must face correction-id stability**: hand
> corrections key to the reader's deterministic event ids (ship 3), and
> N.97 changes the event population, so old corrections can silently
> detach. The walkthrough waits on Thursday; its demonstration asset is now
> a live PDF read with correction, far past the r2 run sheet's fallback.
>
> The day, in order, every ship five gates at baseline, every DONE walked
> by Dann on a deploy:
> - **N.95 numbered and DONE** (decomposition): scan errors split by
>   channel against the engraved ground truth.
>   `docs/sessions/memo-n95-decomposition_r1_2026-08-24.md`. Pitch nearly
>   fine (36/41 exact after a corpus octave convention), barline detector
>   found 0 barlines (fixed-width fault), confident durations 0/28.
> - **N.96 numbered and DONE** (PDF ingest): pdf.js decodes JBIG2 only
>   when `wasmUrl` is set; Ilya never set it. Fixed, plus honest JBIG2
>   error (French ratified), per-page fault isolation (French ratified),
>   and the skew-split staff line merge (`LINE_MERGE = 1/3`, bound
>   anchored to line thickness over 2,245 corpus gaps; the defect side
>   rests on ONE measured instance, watch it).
>   `docs/sessions/memo-n96-pdf-ingest_r1_2026-08-24.md`.
> - **Ship 1 `b2a502c`**: wasmUrl door, scale-relative barlines with
>   Dann's span-and-overshoot rule, duration threshold re-derived
>   (0/28 wrong-confident became 20/27 exact, abstentions up on purpose),
>   `K_S` 0.2809 -> **0.2729** by the ratified derivation over a corpus
>   extended with the two pdf.js rasters (committed as corpus members).
> - **Ship 2 `bc2a026`**: per-page isolation and the line merge. Walked:
>   the Lamm PDF reads BOTH pages on `ilya-51w2ybdoo`, 6 systems, 97
>   notes.
> - **Ship 3 `f3b257b`, N.92 FIRST SLICE DONE**: Speedy Entry correction
>   in the drawer's NOTATION anchor. Corrections are a DIFF keyed by event
>   id, applied after every re-read, stored beside `pairings`, no new save
>   site. Finale digit mapping; 44 px floor, no exemption. Walked on
>   `ilya-nfnsfm5ht`: pitch changed, note deleted, three corrections
>   survived a reload. Gate 4 baseline is now **754** and
>   `ilya-ship.sh:79` already says so (desk edited it over the bridge,
>   before md5 cf342b88, after 8f64e050).
> - **RULED AT CLOSE, N.92's next slice: accidental control.** Dann: a
>   B natural cannot become B flat; down a semitone respells as A sharp.
>   The speller spells sharps only (`transposition.ts:41-56`). The slice
>   is direct accidental verbs (flat, natural, sharp) plus a real
>   enharmonic policy (Gould rule 66, spelling in harmonic context). A
>   design conversation first, not a patch.
> - **N.97 numbered** (above). **Adopt-versus-build retired with data**:
>   Audiveris measured arm's-length at 58/58 vocal notes and ~47%
>   Cyrillic syllables under `rus` OCR; AGPL keeps it unbundlable; its
>   lesson decomposes to Tesseract (Apache-2.0) plus our own knit. The
>   server-tier fork is recorded, unruled, costing nothing.
> - **Gould dimensional prior table extracted**: 98 rows in stave-spaces,
>   dimension-vs-meaning per the 2026-08-18 ruling.
>   `docs/sessions/memo-gould-dimensional-priors_r1_2026-08-24.md`. Gaps
>   that matter: notehead sizes (pp. 10-12) and rest geometry (pp. 34-38)
>   were never photographed; the reader found 0/10 rests and has no Gould
>   rest dimensions to lean on. A re-shoot closes every numeric flag.
> - **Metre ruled**: no third intake prompt; the metre READ joins the read
>   report as a display line (unbuilt, small); arithmetic audits at intake
>   and gets promoted to tie-breaker only after the duration channel is
>   proven, every promotion marked. Clef/key prompt dies into a confirm
>   when N.97 lands.
> - Open observations carried: `pdfjs400-2` reads 49 records vs page 1's
>   48, unscored; page 2 never scored against ground truth; the `g`
>   population has an unreproduced ratified count (reimplementation gets
>   784/18 vs recorded, monotonicity proved it inert at K_S); the 7
>   remaining wrong confident durations are uncharacterized; portrait
>   phone does not render the score document (pre-existing).
> - Usage at open: Fable 39%, all-models 23%, resets Sunday 05:00. Farm-out
>   quotes ran over three of three; the 1.5x correction is now in
>   `ENVIRONMENT.md`.


## 2026-08-24. THE RELEASE SESSION: SEVEN RULINGS, EIGHT NUMBERS, TWO AUDITS

**Dann opened the release question: what remains before a release, plus six
proposals of his own.** The desk ran the seven owed rulings one by one; all
seven are answered. Two Opus subagents re-audited the tree read-only
(ruled by Dann; the desk quoted ~150k worst case and the pair spent ~372k,
owned in-thread): `memo-release-audit-a_r1_2026-08-24.md` (behaviour clauses)
and `-b` (upload, residue, open source, provenance), both in `docs/sessions/`.

### The numbers, all ruled in by Dann 2026-08-24

| | item | state |
|---|---|---|
| **N.82** | the watch band's French | NUMBERED. Bigger than the enumeration knew: header, all eight `watchEntryLine` branches, `transpositionPhrase`, `joinIntervals`, and the advice sentences (`watchlist.ts:530-590`, `advice-resolver.ts:127`) print English in French mode on the Fit paper. Desk drafts the French table for Dann's eye before any brief |
| **N.83** | walkthrough prep | **THE ONE THING.** A colleague asked this week. Includes the IMSLP demonstration: one Russian piano-vocal PDF through the reader, the first honest end-to-end accuracy datum |
| **N.84** | the Guide redo | Three FALSE structural claims and the stale "Ilya does not save transcriptions" promise (privacy-adjacent, now false): memo A's twelve-claim table is the work list. Extract structure and prose worth keeping; images are stale |
| **N.85** | the open-source front door | README, CONTRIBUTING, code of conduct. Desk drafts; Dann sees every word. Must carry: free on purpose, well-built on purpose, made to help outside commercial concerns; Calm Authority with testable elements (whether the ratified slate is already testable is answered at drafting time). The `.env.example:1-4` stale instruction rides with this ship |
| **N.86** | dead-code and structure audit | One reading pass, two outputs: dead code to delete (first entries: `ACCEPTED_EXTENSIONS` at `format-detection.ts:54`, the `lib 2/` Finder artifact, and the `PUBLIC_INCLUDE_SHANE` wall, whose fate this audit rules) and structural intuitiveness for contributors |
| **N.87** | optimizations | Perceive, confer with Dann, then execute. Needs N.86's findings first |
| **N.88** | marketing materials | Last on purpose: describes the cleaned-up product |
| **N.89** | the document furniture | RATIFIED FROM DRAWINGS, NOT BUILT. Footer C (two-tier colophon, name in, "MIT licence" joins the secondary line, the real flag SVG unchanged); the classification header (page 1: today's title header plus a three-line right block, voice · printed date · document kind and language; pages 2+: running head plus one condensed line; sourced-or-silent, no voice profile means no voice line; lavender accent on the marked score); binder manifest gains `app`, `author`, `url`, `licence`, and `version.name: '2026a'` in `svelte.config.js` so the binder stops shipping a millisecond epoch. Drawings: `footer-options_r1_2026-08-24.html`, `header-proposal_r2_2026-08-24.html`. New French for Dann's eye is in the drawings' endnotes; « imprimé le » is the one coinage |

**The ratified order: N.83, N.84, N.85, N.86, N.87, N.88.** N.82 and N.89 are
ships that can ride between them.

### The other rulings, 2026-08-24

- **Learn and Guide print: REVERSED.** Dann: no native print for Learn or
  Guide "until a compelling reason emerges"; a singer prints Transcriptions
  and Score markups natively, and those bear the furniture. The tree already
  agrees (`+page.svelte:2396`, Studio-only Print). The 2026-08-20 "a printed
  Learn or Guide excerpt must identify its source" work is DEAD, not merely
  unnumbered.
- **Colour on paper: PARKED behind N.83.** No rule in the tree forces
  greyscale or preserves colour (memo A §4); the desk's predict-and-print
  table waits until walkthrough prep is done. Unexplained: turning noteheads
  are foreground SVG fill and should survive printing; Dann saw greyscale
  except the flag. A driver in greyscale mode would produce exactly that.
- **N.72 residue: CLOSED AS KNOWN, no build.** A singer on Chrome for iPhone
  uses Ilya fully in the browser; install exists only in Safari; no steering
  copy.
- **The `PUBLIC_INCLUDE_SHANE` wall: handed to N.86**, and the stale
  `.env.example` instruction is corrected with N.85.

### Audit findings not yet numbered, waiting on their tracks

Memo B carries the inventory: README omits half the product and names a
`test:e2e` that does not exist at root (N.85); CI's real gates (svelte-check
baseline 23, build) are unmentioned in CONTRIBUTING (N.85); no code of
conduct (N.85); the binder manifest carries no provenance (N.89); no
end-to-end reader accuracy rate exists anywhere, and the harness's 1.000
scorecard measures a stub, never to be quoted as the reader (N.83's
demonstration is the first datum); `updatedAt` written five times, rendered
nowhere (N.19, unchanged); `saveStore` still the last catch-and-drop (N.27,
unchanged); three `100vh` remain (N.17, unchanged).

**Inbox dispositions this session:** the six proposals became N.83 to N.88;
colour print parked; header/footer became N.89; the smartwatch formant
question remains in the inbox, unruled.

---

## 2026-08-24 SMALL HOURS. N.62 DONE: RATIFIED, ONE SHIP, WALKED

**The French, ratified by Dann 2026-08-23.** Row 2 changed under his eye: he
challenged « déplier », proposed « déployer » and « serrer », the desk gave
the platform pair, and he ruled **« Développer ou réduire »**, adopted. On
« serrer » the desk gave only the European sense (tighten) and Dann supplied
the Canadian one (stow); the word still lost, but the correction was his.
« glose » is feminine, so row 5 is « Modifier la glose ». Rows 1, 3, and 4
ratified as enumerated: « Commandes » coined, « Navigation » and
« Transcription » adopted.

**The ship, `1f4e268`, brief
`docs/sessions/brief-n62-five-strings_r1_2026-08-23.md`, memo
`memo-n62-five-strings_r1_2026-08-23.md`.** Four keys in `i18n.ts` (`a11y.*`),
four call sites moved to `t()`, one character at `InspectorPanel.svelte:1039`,
one new test file `i18n.test.ts`. Gate 4 **724 to 725**; the ship script's
line 79 moved before the ship. **Row 2 is twelve chevrons, not the memo's
thirteen**; the memo's own line list had twelve entries and Code confirmed no
thirteenth exists.

**The walk, desk-driven in Chrome on `ilya-4f6fwt03u` (`1f4e268`, READY,
sha checked via the Vercel connector).** Rows 1 to 4 read off the rendered
DOM in English, then in French after clicking « Français »: `Commandes`,
`Développer ou réduire` as the sole chevron label, `Navigation`,
`Transcription`. The twelve chevrons never render at once: Learn shows 7,
Guide shows 5. Row 5's button renders only with a placement selected in a
loaded song, predicted before the measurement; the served bundle carries
`Modifier la glose` once and `le glose` zero times across all 19 scripts.
**Dann accepted the walk on that evidence.** Residue: glance at the gloss
button next time a song is open.

**Code's own additions, from its memo:** `Drawer.svelte:324`'s comment
quoted the old markup and was updated so the done-when grep runs clean, and
this machine's `grep` is a `ugrep` shim that honours `.gitignore` and
silently skips `apps/web/build` (Code recorded it; see ENVIRONMENT).

---

## 2026-08-23 NIGHT, LATER. N.81 WALKED, N.79 RULED CLOSED, N.62 ENUMERATED

**N.81, numbered this session from `INBOX.md:29` on Dann's ruling.** The rule
under Back in the calibration takeover was `.takeover-head`'s
`border-bottom: 2px solid var(--sage)` (`Drawer.svelte:888`); the rule under
the voice selector is `.wizard-phase`'s `border-top: 2px solid
var(--deeper-lavender)` (`CalibrationWizard.svelte:1713`). One token changed,
one comment added. Code's assertion earned its keep: the sage declaration
occurs twice in the file (`:839` is `.drawer-anchor-top`, sage by ruling), so
the whole block was matched. Five gates at baseline, `848059e..2440bf5`,
memo `memo-n81-takeover-rule-lavender_r1_2026-08-23.md`. **Walked by Dann:
"both lines are lavender now."**

**N.79 transitions, RULED BY DANN: do nothing.** The memo's four paths were
put to him (leave, shorten 1,500 ms to 400 ms, move to `transform`, Svelte
`slide`), with the honest caveat that nobody has measured the 1,500 ms
drawer stuttering. He chose leave. Closed, nothing built.

**N.62, enumerated on Fable, nothing built.** The register's twenty-nine
strings were not reproduced in the tree; the Pacifier, NotePicker, and
wizard carry no English outside `t()`/`T()`, so N.35 and N.50's parts appear
done since. What remains: `Controls` on the drawer landmark, `Toggle` on
thirteen TOC chevrons, `Navigation` and `Transcription` on two landmarks, and
« Modifier le glose » at `InspectorPanel.svelte:1039`. Two coined French
words, « Commandes » and « Déplier ou replier », wait for Dann.

**Found, not numbered, Dann to rule:** `watchlist.ts:92` `WATCH_HEADER =
'Places to watch'` is visible and printed in English in French mode
(`VoiceProfilePane.svelte:791`), pinned by `watchlist.test.ts:262`. Whether
`watchEntryLine` prints English is NOT ESTABLISHED.

**Two visible-list items struck as already done:** the French colon spacing
(the colon audit, `9d314de`) and N.63's last residue, the interstitial's
gate, retired under N.73 portrait C ruling 4 (`+page.svelte:1865`).

**The desk's own fault this session:** it asked Dann for a deploy URL that
`ENVIRONMENT.md:1090` says the Vercel connector fetches. He had to say
"provide URL." Corrected in the same breath; the rule was already written.

---

## 2026-08-23 NIGHT. N.80 IS DONE IN TWO SHIPS, AND THE [u] QUESTION IS ANSWERED

**Numbered from the inbox on Dann's ruling, with N.79.** Dann's question:
is [u] failing on mic sensitivity, on a low cutoff, or on something else?

### Research, two subagents, both run from the desk on Dann's ruling

Opus read the whole capture chain and ran the tree's own `extract.ts`,
`guard.ts`, and `detector.ts` on synthetic fry:
`docs/sessions/memo-n80-u-capture-research_r1_2026-08-23.md`. Established:
the three browser flags are already off (`live.ts:339-341`, and Dann's
console confirmed `autoGainControl:false` and the other two); no highpass
anywhere; the F1 window `[150, 1200]` resolves a synthetic fR1 down to about
160 Hz, so **the cutoff is not the limit**; the fry detector cannot produce
a Provisional with numbers; plausibility passed 301 Hz. Its leading
diagnosis, level against the 12 dB SNR floor, **was refuted by Dann's
console the same hour**: every take sat 18 to 26 dB above the floor. The
control rule did its job.

### What the console said, and what each ship did

Dann's three takes on `9d314de`: two `reprompt c5_cv` (pulse regularity
over the whole 2.5 s buffer; the live gate only asked for one second), one
Provisional.

**Ship 1, `d491d22`: judge the fry on its best steady window.** `runCapture`
runs `guard()` first, slices to `segmentS`, and hands the slice to
`detect()` and `analyze()`; the confidence tier reads `fullWindow` from the
whole take so a slice never reaches `high`. `analyze.ts` only, thirteen
tests in the new `analyze.test.ts`, gate 4 705 to 718. Memo
`memo-n80-best-window_r1_2026-08-23.md`. **Code corrected the brief: the
buffer is 2.5 s, not 3.5; `live.ts:665` trims half a second from each
end.** Dann's three takes: all `segmentS: null`, so nothing to slice, and
the guard reports only pass or fail.

**Ship 2, `230cad3`: the guard reports its four measurements.**
`GuardResult.diag` carries `cv1`, `cv2`, `mincor`, `cvr`, `spanS`, and
`failed` for the full window and the best window; no threshold moved;
parity proven on 56 cases against the floor's `guard.ts`. Six tests, gate 4
718 to 724. Memo `memo-n80-guard-diag_r1_2026-08-23.md`.

### The answer, read off Dann's console on `230cad3`

Three takes, one name every time: **`fr1_cv`**, the steadiness of fR1
across the held fry, at 0.154, 0.095, and 0.080 against a ceiling of 0.08.
The other three tests were clear by a wide margin on every take. With ship
1 in place, takes 2 and 3 captured on sub-windows of 2.25 and 2.45 s;
take 1 had no passing window. **A [u] that failed and then succeeded in
one sitting without the singer changing anything is the N.49 document's
own test for a fix.** Six fR1 readings tonight: 290, 289, 301, 316, 306,
270. Scatter, not drift.

**Left alone, deliberately:** `T_FR1_CV = 0.08` (`guard.ts:4`). A move
needs the same `diag` numbers from the other vowels, and Dann has a
captured [u] without it. One take tonight read 764 / 2231, which is not a
[u]; why is NOT ESTABLISHED.

**Also verified tonight, on Dann's challenge:** the readiness step measures
a room SNR and a fry rate (`readiness.ts:312-335`), writes a provenance
record nothing reads back (`CalibrationWizard.svelte:665`), and feeds
nothing downstream. It cannot make a capture better or worse. Left as is.

### Inbox dispositions, ruled by Dann 2026-08-23

Struck as already done in the tree: NOTATION collapsed on arrival
(`+page.svelte:198-211`); metadata header retractable; the softened
borders (replaced by the text watermarks); the matching placeholders
(Dann's own screenshot). Parked: WCAG in marketing until an audit exists;
the hamburger menu. Numbered: **N.79 transitions** and **N.80 [u] capture**.
New in the inbox: the wizard's rule above the voice selector goes
lavender.

---

## 2026-08-23 LATE. THE COLON AUDIT AND THE SCORE MARKUP RENAME, `9d314de`, WALKED

**Ruled by Dann 2026-08-23:** the colon audit is the one thing, and the
English tab `Marked score` becomes `Score markup` while the French
`Partition annotée` stays. Both went to Code in one brief,
`docs/sessions/brief-colon-audit-and-score-markup_r1_2026-08-23.md`; memo
`memo-colon-audit-and-score-markup_r1_2026-08-23.md`.

**229 edits across `LearnContent.svelte`, `GuideContent.svelte`, and
`i18n.ts`, French only:** 121 colons gained or upgraded a hard space, 106
semicolons and 2 exclamation marks lost one. Code took a spelling census first
and found all five spellings, plus `&#8239;` before 29 semicolons, now gone.
English blocks byte-identical. Gate 4 stayed 705 after three expectations in
`analyze-score-adapter.test.ts` followed the string `fit.broad.body`. Bundle
up 108 bytes.

**Code's one judgement, ruled right by the desk:** the three bare colons left
in French prose are inside English book titles (`Russian Lyric Diction: A
Practical Guide` and two others). English titles keep English punctuation.

**Walked:** Dann on the desk, French Leçons on `ilya-lkhccn4lt`, no `:` or
`;` starting a line. **Not walked on a phone**; Code measured zero wraps at
360 px in the pane.

**The desk's survey in the brief was wrong where it said `GuideContent` had
no hard-space colons. It had 9.** The brief marked the survey rough and said
Code's census governs, which is the only reason it cost nothing.

---

## 2026-08-23. N.78 SHIPPED `9cc68e5` AND WALKED. TWO RESEARCH PASSES, ONE BUILD

**Floor raised to `9cc68e5`.** Five gates: 216, 235, 0 errors and 7 warnings
in 4 files, **705**, 444 passed and 5 skipped. Gate 4 moved 682 to 705 for
the 23 tests in the new `apps/web/src/lib/composers-poets.test.ts`, with
Dann's permission before the ship script ran. Bundle up 1,670 bytes.

### Ruled by Dann, 2026-08-23

- **The desk runs the research subagents itself**, rather than handing Dann a
  brief to paste. Two Sonnet subagents, one at a time, within the ceiling.
- **The French form is the French Wikipedia article title**, one source for
  all 62, converted to `Surname, Given` with the patronymic dropped. Ruled
  after pass 1 showed the BnF heading is ISO 9 transliteration for about a
  third of the list. Rachmaninov therefore reads `Sergueï`, the title, not
  the `Serge` of concert usage.
- **Display only stands**, per 2026-08-21. `SearchableSelect.svelte`'s
  `selectEntry` still writes the English form. Code verified storage
  byte-identical across both pill directions and a French reload.

### What shipped

`composers-poets.ts` carries an optional `french` field on 49 entries and a
language-aware display helper. `SearchableSelect.svelte` filters on the
French form too, so `Pouchkine` finds Pushkin in either language.
`TitlePage.svelte` passes the language. **`metadata-provenance.ts` stays
English by Code's own reading: its output reaches the persisted document
through `commitMetadataState` at `+page.svelte:1604`.** Memo:
`docs/sessions/memo-n78-build-french-display_r1_2026-08-23.md`. Brief:
`brief-n78-build-french-display_r1_2026-08-23.md`.

### Left as English in French, with the reason for each

No French article: Bulakhov, Titov, Golenishchev-Kutuzov (a red link on the
disambiguation page), Rathaus. Title is the bare surname: Goethe. Title is the
pen name doubled: Galina. Same in French: Cui, Rubinstein, Stravinsky,
Akhmatova, Heine, Pasternak, Shakespeare. **None of these was coined. The
do-nothing holds for all thirteen.**

### The desk's own faults this session

- The r2 brief told the agent the MediaWiki API works. It did not, in the
  agent's environment; direct page fetches did. Now in `ENVIRONMENT.md`.
- The build brief's done-when quoted the trigger's `Given Surname (dates)`
  format as though it were the row's. Rows draw `Surname, Given`. Code read
  the intent correctly and changed nothing; the loose wording was the desk's.
- The translator dropdown's list was `NOT ESTABLISHED` at the open. It draws
  on `POETS` (`MetadataFields.svelte:139`). Established by reading, not asked.

---

## 2026-08-21. N.77 IS DONE AND WALKED. SIX SHIPS, AND THE BLOCKING SET EMPTIED

**N.77, the Learn and Guide redesign, was numbered, designed, built, and closed
in one sitting.** Ruling 6 of 2026-08-18 had been ratified by Dann's eyes on
Fable's mockup and never built. Six ships, every one walked by Dann on a real
deploy, desk and phone.

| ship | commit | what |
|---|---|---|
| 1 | `2b85d13` | 24 chapter-opening bands, rose for Learn and cobalt for Guide |
| 2 | `e52b1c9` | every anchor clears the sticky chrome; a chapter lands on its band |
| 3 | `a1b5774` | the band's bleed tracks the sheet's padding; Repertoire moves up |
| 4 | `0fcaa6e` | one mark at every station boundary; Print takes the model's size |
| 5 | `9f11490` | no space before a question mark in French; the coda reads `Section 8` |
| 6 | `d079794` | nine decks in both languages; the band title scales with the sheet |

**Before it: `46ab5e2`, the `inferred` legend row dropped.**

### THE DESK'S OWN ERRORS, ALL FOUND BY CODE, ALL THE SAME FAULT

**Four of this desk's briefs carried a wrong count, and three share one cause:
THIS REPOSITORY WRITES A NON-BREAKING SPACE IN AT LEAST FIVE SPELLINGS.** The
desk counted two or three of them and reported the total as fact.

- Ship 5's brief said **24** question-mark sites. There were **47**, and 19 were
  `&#160;`, a spelling the desk never searched for. One more sat on its own
  source line, where HTML collapses the newline to a space; it matched no
  same-line search and Code found it only in the built bundle. **A fourth file,
  `Drawer.svelte`, was never in the brief at all.**
- The same brief said **15** guillemet pairs. There are **124**, in four
  spellings.
- The same brief asserted nothing precedes `!` or `;`. **3 exclamation marks and
  60 semicolons carry a space, all French.**
- Ship 6's brief said `&#160;:` appears **62** times. It appears **150**. The
  desk took Code's count of 62 `&#160;` GUILLEMETS from the ship 5 memo and
  reused it for COLONS without re-checking. **That is tether 3 exactly, and it
  is the second wrong count in one day.**
- Ship 4's brief claimed `New song` lacks the model's border. `.btn-ghost`
  supplies it; both buttons already measured 34.38 px and nothing needed doing.
- Ship 3's defect was the desk's too: the band's `-96px` bleed was passed along
  without ever asking what the sheet's padding is on a phone. It is `1rem`.

**The lesson, and it is now in `ENVIRONMENT.md`: before counting a typographic
character in this tree, enumerate its spellings first.**

### RULED BY DANN, 2026-08-21

**CANADIAN FRENCH TYPOGRAPHY, checked against both authorities before he
ruled.** No space before `?`, `!`, or `;`. **A hard space before `:`.** Canada
parts company with France here, and Ilya followed France. Sources: the
Government of Canada's `Clés de la rédaction`, and the OQLF's
`Vitrine linguistique`, which says *"pas d'espace ou une espace fine"* and
favours none. **47 sites repaired in ship 5. The 63 `!` and `;` sites are NOT
done and belong to the colon audit.**

**THE COLON AUDIT IS FLAGGED AND NOT RUN.** About 126 colon sites across the
French halves of `LearnContent.svelte`, `GuideContent.svelte`, and `i18n.ts`.
**Both Svelte files hold the English and the French in one file**, and English
takes no space before a colon, so roughly half must be left alone and telling
which is which means reading each one. Flagged as a Sonnet farm-out, 150k to
250k tokens worst case. **Dann never answered, because N.78 overtook it.**

**LEFT ALONE, DELIBERATELY, EACH WITH ITS MEASUREMENT.**

- **Learn's rose kicker is 3.54:1**, below the 4.5:1 floor for 10 px text.
  `--dusty-rose` `#A67B7B` against `#fdfbf6`. The 40 px title passes the 3:1
  large-text floor. Guide's cobalt is 4.61:1 and passes throughout. **A darker
  rose reaching 4.52:1 is `#996767`; `--lang-chip-learn` `#9A6A6A`, already in
  the palette, reaches only 4.37:1.** Dann: *"Leave it."* It joins the contrast
  items this file already records.
- **The sage rules print faint in greyscale.** `--sage` `#8B9A7D` is 2.99:1 on
  white and renders around grey level 146 of 255. **Closed on Dann's own
  evidence rather than on arithmetic:** he printed `В четырёх стенах` from
  `2b81f5a` on 2026-08-21 and said *"prints beautifully."*
- **N.63's honest residue: SAY NOTHING.** Asked in E.45, unanswered since, now
  answered. The keyboard clause was the only true one, and Dann's own E.41
  posture governs: the mobile paradigm serves the user rather than apologising
  to it. **The gate's deletion is still owed if it still ships**, and deleting
  it also removes desk-geometry scroll arithmetic running on a phone and a
  second redundant `loadDictionary()` call.
- **`Calibrate` does not match `Transcribe`'s width.** Built in ship 4 and
  reverted before it shipped. The grid truncated the voice status to
  `Voice: not …`, cut by 52.2 px in English and 57.9 px in French at 360 px.
  Dann: *"the colour contrast between it and the surrounding sage is
  sufficient."*
- **The band title's printed size.** `vw` resolves against the page box in
  paged media, so it is very likely under the ratified 40 px on paper. **Learn
  and Guide are offered no `Print` button at all**, by Dann's ruling of
  2026-08-20, so paper is not a supported route to these pages. Not worth the
  three lines.
- **`learn-unit-7`'s French deck runs three lines** where the rest run two,
  making that band 21.7 px taller. Bands are never seen beside each other.

### THE FINDING THAT IS NOT ABOUT THE BAND, AND IS NOT RULED

**Between 768 px and about 956 px with the drawer open, the drawer takes 520 px
and THE READING SHEET IS 192 px WIDE.** Measured by Code on `d079794`. The band
title paints 96.2 px off screen there, recovered from 125.8 px by ship 6's
clamp, and `vw` cannot clear it because the drawer owns 520 px of the window.

**The title is the symptom. A 192 px reading sheet is unusable whatever size the
title is.** Recorded as a question about the drawer at tablet widths, not about
the band. Code's remedy, unruled and untaken: `container-type: inline-size` on
`.chapter-band` and a `cqi` term instead of the `vw` term.

### EIGHTEEN DECK STRINGS, RATIFIED VERBATIM

Ship 1 gave decks to Learn's chapters 2, 3, and 4 by lifting a thesis sentence
already in the body. **Nine chapters had none.** Dann ruled *"Write the nine"*
and asked for drafts, **waiving the standing rule that the desk does not write
the French.**

**Eight of the nine English decks are Dann's own prose condensed, or Fable's
from mockup r2. One, `guide-contributors`, was coined by the desk.** Of the nine
French, four are effectively his own words and five carry a coined element, each
marked in the thread before he ratified. **All eighteen ratified without
edit.** They are in `LearnContent.svelte` and `GuideContent.svelte`; the brief
that carries the table is
`docs/sessions/brief-n77-ship6-decks-and-scaling_r1_2026-08-21.md`.

### N.72 IS CLOSED, AND HOW

**The last unwalked surface was Chrome on iPhone, on a stable URL.** Ship 4 was
made its own instrument: the rule between `REPERTOIRE` and `SOURCE` that ship 4
restored is visible, so no build marker was needed.

**Dann held the branch alias `ilya-git-shane-dannmittons-projects.vercel.app`
open on his phone, confirmed no rule between the two stations, ship 4 landed,
and ONE RELOAD delivered the new build.** The confound was named in advance and
did not fire: the alias had flipped, so the private-tab disambiguator was never
needed.

---

## 2026-08-21 LATE. THE NINE SHIPPED, AND THE BOUNDARY THAT WAS NOT ANALYSIS'S

**FLOOR RAISED TO `2b81f5a`.** Three ships after `afc45cb`, each pushed and each
walked by Dann on its own deploy: `7294b42` carried the nine items, `2b81f5a`
carried the boundary repair, and `502d571` carried the brief that produced them.

### What Dann walked, and in what order

**On the phone, `7294b42`:** the silhouette with no painted box and no visible
left edge; the desk strip showing above the handle and below it and nowhere
beside it; the sage tint in that strip; no white latch after a tap; and the
doubled handle. **Five items in one look.** Then, scrolled to the foot of the
sheet: *"Yes the print button appears just as you say. Perfect."*

**On the desk, `2b81f5a`:** every station shut, six headers on one rhythm.

### THE 40 px THAT WAS NEVER ANALYSIS'S, AND THE DESK PUT IT THERE

**The desk measured Dann's screenshot rule to rule and reported ANALYSIS as
68.8 px against siblings at 33.0.** Code measured the ANALYSIS station itself,
got the same height as REPERTOIRE from the same recipe, and correctly changed
nothing. **Both were right about their own object and the desk's object was the
wrong one.**

**Dann found it himself, in one sentence:** *"Maybe there's unexpected padding
above Shift Lyrics?"*

**It was `.root-panel { padding: 0 1rem 40px }`**, the bottom of the whole
Transcription panel, sitting between ANALYSIS and the Fit panel that opens with
SHIFT LYRICS. **Measured on `7294b42` at a 430 px viewport: NOTATION 58.0,
SOURCE 58.0, REPERTOIRE 58.0, ANALYSIS 98.0. The difference was 40.0 exactly.**

**THE CHECK THE BRIEF DEMANDED FOUND A LIVE CASE.** `INCLUDE_SHANE` gates the
whole body of the Fit panel, so a wall-closed build renders `.root-panel` with
nothing under it, and `.env.example` documents unset as the production build.
**Code built it genuinely closed rather than simulating it in the DOM**,
confirmed `.root-panel` becomes the last element child, restored `.env`, and
diffed it byte-identical. **The foot went to whichever panel ends the column:
`.shane-panel` keeps its 40 px wall-open, `.root-panel:last-child` carries it
wall-closed. Same value, no new one.**

**Verified on Dann's own walk screenshot, rule to rule at desk width: 27.2,
27.7, 27.2, 27.7.** Before the repair: 27.2, 33.0, 32.6, 68.8.

### The other correction the desk owed

**The brief said NOTATION sits in an anchor and is not a `.section`. It is.**
`MetadataFields.svelte`, `NotationFields.svelte`, and `RootPanel.svelte` each
declare their own scoped `.section`, because Svelte scopes CSS to the component
that authors the markup. **Three copies of one recipe, drifted. That is the same
defect `StationHeader` was built to end**, in a property `StationHeader` does not
own. Code's fix was 6 px rather than the desk's 0, and the desk's 0 would have
made the drawer irregular in the other direction.

### The « ou », and a ruling the desk overwrote

The desk told Dann the missing conjunction in the format line could stay
missing, taking the do-nothing. **`i18n.ts` records that he added that word by
hand on his walk of `39d60e0` on 2026-08-20.** A word he added is a ruling, and
nothing had reversed it. **The desk decided instead of searching. Tether 16.**
Restored in `7294b42`.

### Eleven stale anchors, and why briefs now carry names

Ship B moved `Drawer.svelte`, `RootPanel.svelte`, and `i18n.ts`. **Eleven line
numbers written into this file an hour before that ship were already wrong.**
Every anchor in `brief-to-code-handle-print-and-legend_r1_2026-08-21.md` was
re-read after `afc45cb` and **named as well as numbered, with the instruction to
trust the name.** Code hit two that were off by one, trusted the names, and the
build was unaffected.

---

## 2026-08-21. SHIP B SHIPPED AND WALKED. NINE RULINGS AND ONE NEW NUMBER

**FLOOR RAISED TO `afc45cb` AT THE CLOSE OF THIS SESSION.** Ship B is in
history: the push printed `2238e8b..afc45cb`, which is the check that caught
ship A's near miss the night before.

### What shipped, and what Dann walked

`afc45cb`, fourteen files, 1774 insertions. Five gates at baseline: 216, 235,
0 errors and 7 warnings in 4 files, 682, 444 passed and 5 skipped.

**WALKED AND ACCEPTED BY DANN on the `ilya-d0ygg24ga` deploy:** every header
retracts with a chevron; the SYLLABLES header is gone and the syllabified text
sits under SHIFT LYRICS; the counter reads `0 / 96` at the right of that header.

**SHIP A IS `DONE`, walked 2026-08-21.** No older-Finale disclosure anywhere in
the drawer, confirmed by Dann's own look, and the lavender rule above the voice
anchor confirmed from his screenshot with every other station rule still sage.

### Two things Code raised, and one of them was the desk's error

**THE BRIEF CONTRADICTED ITSELF AND THE DESK DID NOT NOTICE.** §B.6 told Code
to make the score box's gap to its action row equal the textarea's 6 px, and
§B.7 told it to put a line of type in the same space. **Code resolved it the
right way:** it built the sibling relationship, so every gap in SOURCE is
exactly 6.00 px, and it reported the visible 31.20 px rather than forcing a
number. The extra 25 px is the format line and its two 6 px gaps.

**THE DESK'S 270 px EXPECTATION WAS WRONG.** Shutting the metadata anchor
returns **227 px**, at all five phone sizes, and the middle still clears 365 px
everywhere. Code named the cause: the 44 px touch floor on Piece's and
NOTATION's new headers adds 27.20 px the anchor cannot hand back.

**CODE CAUGHT AN ERROR IN SHIP A's MEMO.** That gap was **26.00 px** on the
floor commit, not the 20.00 ship A reported. Ship A never named
`.output-section`'s own 6 px of top padding.

### THE COLOUR MISMATCH, AND HOW IT WAS FINALLY MEASURED

Dann: *"I insist that I am seeing two different colours."* **He was right, and
he had to insist.**

**MEASURED by sampling his own screenshots**, not by reading CSS: the drawer
surface is `#FAF8F5` at every sample and the tab interior is `#FFFFFF` at every
sample, in both the open and the closed state. Between them one hairline pixel
at `#F7F5F2` and the shadow at `#DDDCDA`.

**The cause:** `.drawer-lip:hover { background: #fff }` at `Drawer.svelte:1052`,
**with no `@media (hover: hover)` guard anywhere in that file**. A tap on iOS
latches `:hover`. The desktop cannot show it because
`.drawer-lip.silhouetted:hover` cancels it at `:1056-1058`, and `silhouetted` is
true only there.

**THE DESK'S FAULT, AND IT IS THE ONE WORTH KEEPING:** Dann had already sent the
screenshot. The desk asked him to go and run a test instead of measuring the
picture already in its hands. **See `ENVIRONMENT.md`.**

### Instrument faults Code recorded, both now in ENVIRONMENT

Reading a chevron's transform in the same call that clicks it returns the
pre-transition value; it reported all six inverted before a settled read showed
all six correct. And the Browser pane reports itself `hidden` even when fronted,
which clamps the dictionary loader's zero-delay yields to a second each.

---

## 2026-08-20 NIGHT. THE SURGERY, SHIP A, THE PILL, AND PRINT LEAVES THE DRAWER

**FLOOR RAISED TO `80c5e47` AT THE CLOSE OF THIS SESSION.** Everything in this
section is in history and the working tree is clean.

**THE CLOSE ALMOST LOST A BUILD, AND THE NEAR MISS IS WORTH MORE THAN THE
FLOOR.** The desk wrote this section claiming three builds had shipped. Two had.
**Ship A had not: its three files were still dirty**, its memo was untracked,
and its brief was untracked. The desk had recorded "shipped" from the existence
of a memo rather than from a commit. **A memo is written when the build ends,
not when it ships. Those are different events and only one of them is in git.**

Found by reading the push range on an unrelated memory commit: it ran
`1101d94..a2dc42d`, and `1101d94` is the floor at the top of the retraction
brief, written *before* ship A was built. **HEAD had not moved across the whole
build.** Ship A then shipped as `80c5e47`, five gates at baseline.

**THE RULE THIS EARNS:** never write `shipped` into `STATE.md` from a memo.
**Ask Dann for the one-line git status and read it.** Each item below is dated
by its memo, which carries `path:line` for everything it claims; the commits
are:

### What shipped after `b0a9860`, and NOT ONE OF IT IS WALKED

| what | memo | state |
|---|---|---|
| The language pill | `docs/sessions/language-toggle_r1_2026-08-20.md` | in history at or before `1101d94`. **`WRITTEN`, NOT WALKED** |
| The silhouette's lift, and the sage hover on the text intake | `docs/sessions/silhouette-lift-and-sage-hover_r1_2026-08-20.md` | in history at or before `1101d94`. Built from Dann's walk of `0e5ed6e`. **`WRITTEN`, NOT WALKED** |
| Ship A: the Finale disclosure deleted, six i18n keys gone, the bottom rule lavender | `docs/sessions/retraction-shipA_r1_2026-08-20.md` | **`80c5e47`**, shipped at the close of this session. **`WRITTEN`, NOT WALKED** |

**Five gates at baseline on every one of them.** 216, 235, 0 errors and 7
warnings in 4 files, 682, 444 passed and 5 skipped. Nothing moved.

### PRINT LEAVES THE DRAWER. RULED BY DANN 2026-08-20 NIGHT

His words, twice, and the second corrects a reading the desk had not made but
could have: *"Can we take Print out of the Drawer entirely and install a
consistent Print button on the right side of the Transcription / Score Markup
selector on the paper GUI side?"* Then: **"to be clear I dont want a control on
the paper. I want it to float next to the Transcribe / Score Markup selector."**

**`Print` goes to the DESK HEAD, beside the pair. Not on the sheet.**

**CONTRACT §6 LOOKS LIKE IT FORBIDS THIS AND DOES NOT.** "Do not put a control
on the paper" governs the sheet. `DeskHead.svelte:245-249` hides the desk head
under `@media print` with its own comment, *"The desk head is chrome. The page
prints; the desk does not."* The desk head already carries controls and always
has: the pair at `:43` and the Learn and Guide links at `:44`. **The full
reasoning and the test to apply next time are now in `ENVIRONMENT.md`.**

**WHERE IT SITS IS RULED, AND IT IS RULED FROM A DRAWING.** Dann drew it:
`docs/sessions/desk-head-print_r1_2026-08-20.html` is that drawing rendered.
**`Print` sits immediately to the RIGHT of the pair, separated by a gap, as its
own box in the pair's own idiom: same height, same hairline border, same
baseline.** It is not centred in the span between the pair and the links, and it
does not join the pair as a third segment. **The gap is what says it is a
different kind of thing.**

**IT IS ALWAYS LIVE. RULED BY DANN 2026-08-20 NIGHT.** His words: *"I think
folks can Print Learn and Guide if they want to? They'll have to specify the
page parameters in their print dialog box themselves."*

**So there is no disabled state, no greying, and no vanishing.** The desk had
put exactly that question to him, recommending grey-and-disabled on Learn and
Guide. **He answered it away instead: a singer may print any of the four
destinations, and the browser's own print dialog is where page parameters
belong.** The bar is therefore identical on all four destinations by
construction rather than by a condition, which is simpler than either path the
desk offered.

**THE CONSTRAINT THAT REMAINS.** The bar's ruled geometry puts the pair flush
with the sheet's left edge and Learn and Guide flush right. **`Print` takes the
space immediately right of the pair, which is empty, so it displaces nothing.**
Measure the desk head at 360 x 640 with `Print` added and report a collision
rather than shrinking anything.

### A PRINTED LEARN OR GUIDE EXCERPT MUST IDENTIFY ITS SOURCE. RULED 2026-08-20 NIGHT

Dann, the same minute: *"If folks Print Learn and Guide excerpts those excerpts
should bear header and footer information that identifies the source."*

**THIS NAMES WORK THAT DOES NOT EXIST. Measured tonight, not assumed.** Learn
and Guide render inside `ReadingPaper.svelte`, from `+page.svelte:2286-2300`.
**`ReadingPaper` has no header, no footer, and no page furniture of any kind.**
Its entire print block is `ReadingPaper.svelte:276-280`, which removes a box
shadow and nothing else. A Learn chapter printed today carries no title, no
attribution, no page number, and no wordmark.

**THE FURNITURE EXISTS, BUT IT IS THE OTHER PAPER'S.** `TitleHeader.svelte`,
`RunningHeader.svelte`, and `PageFooter.svelte` serve the transcription sheet
and the marked score. **`PageFooter` is not liftable as it stands:** its props
are `pageNumber`, `totalPages`, `legendItems`, `broadNote`, and a
`hairlineAccent`, and three of those are provenance concepts a Learn chapter
does not have. It does carry the one piece that transfers, `footer.attribution`.

**WHAT IS RULED:** a printed Learn or Guide excerpt identifies its source, in a
header and a footer.
**WHAT IS NOT RULED, AND THE DESK MUST NOT INVENT IT:** what those two lines
say, in English and in French. **Dann writes copy.** The desk's reading of
"identifies the source" is the chapter's own title, the Ilya wordmark, and the
build, but that is a reading rather than a ruling.

**NOT ESTABLISHED.** Whether a Learn chapter breaks legibly across pages at all.
Nothing in N.47 or N.69 was measured against `ReadingPaper`; both were done
against the transcription sheet and the marked score. **Settled by: one print of
a Learn chapter, on paper.**

**THIS IS ITS OWN PIECE OF WORK AND IT IS NOT SHIP B.** It arrived tonight
because Dann's `Print` ruling made Learn and Guide printable for the first time.
**Number it before building it.**

### RULED BY DANN, THIS SESSION, EVERYTHING ELSE

1. **The lip and the drawer are ONE SURFACE carrying the paper's own drop
   shadow.** Ratified from `docs/sessions/lip-handle-silhouette_r1_2026-08-20.html`,
   option C. Dann: "The look of C is exactly what I want."
2. **The layer order is Dann's own, given verbatim:** background deepest; drawer
   and paper GUI coexist at the next level; "whatever sorcery you need" highest.
   **He deferred the mechanism to the desk and ruled only the look.**
3. **Every header gets a retraction chevron.** "Every header begins a section
   that is retractable and expandable." Ship B.
4. **The bottom-most divider is lavender.** Done in ship A, `Drawer.svelte:844`,
   `--deeper-lavender` `#8E7E9B`, string-identical to the rule above SHIFT
   LYRICS. **No second lavender entered.**
5. **The older-Finale disclosure is deleted.** Done in ship A. Six i18n keys
   went with it, each checked for another consumer and each having exactly one.
   **`upload.err.mus` survives at `i18n.ts:377` and is now the only guidance a
   `.mus` user gets.**
6. **There is no Output station.** Dann dissolved the naming question rather
   than answering it: *"I do not think we need an Output section articulated."*
7. **The text intake gains a sage hover**, matching the score field's lavender
   one, **and it goes away once text is entered.** Dann's own correction.
8. **The two intakes' placeholders match.** The score drop zone's three stacked
   elements became one placeholder in the textarea's exact treatment. **He asked
   four times.** That failure is CONTRACT tether 18.

### THE SHADOW SEAM, AND WHY IT IS WORTH REMEMBERING

Code predicted an inward bloom before building it, and **the desk relayed the
prediction to Dann as a curiosity instead of solving it.** He got a build he had
not asked for: "Fucking awful Claude. This is not what you offered me."

**The fix was one move.** The `filter: drop-shadow()` sat on the silhouette
path, so the shadow fell inward across the drawer's own face. Moving the filter
to `.drawer`, which contains both the body and the handle SVG, means the opaque
body hides its own shadow and only the outside edge lifts. **One object, one
shadow, exactly as the paper does it.**

**The lesson is not about SVG.** A prediction handed over without a remedy is
not a warning, it is a pre-written excuse. **If the desk can see the defect
before the build, the brief solves it.**

---

## 2026-08-20 EVENING. THE DRAWER'S EDGE, THE CHEVRON, AND THE LANGUAGE TOGGLE

**Floor: `b0a9860`.** Five gates at baseline on both ships.

### THE SILHOUETTE, `1f201f2`, WALKED AND ACCEPTED

**The drawer's right edge and its handle are ONE path.** Dann's words on seeing
it: "it looks like exactly what i asked for. I am satisfied." The lip arrives
vertically, stops at the handle's top-left terminus, turns ninety degrees, runs
the handle's top, rounds only the RIGHT corners as a squircle, returns to the
bottom-left terminus, turns again, and continues down. **The handle has no left
wall.** Geometry ruled from a drawing:
`docs/sessions/lip-handle-silhouette_r1_2026-08-20.html`, and the drawing was
the specification Code built from.

**HOW THAT RULING WAS REACHED, and it is the method rather than the outcome
that matters.** Four rounds of prose had not settled it. One drawing of three
readings settled it in two exchanges. **CONTRACT tether 18's corollary: draw
it.**

**The whole silhouette is `#D2CFCC`**, measured off the handle's own painted
pixels rather than computed, because `.paper-handle` was deleted at N.73 S1 and
no memo, spec, or mockup records its hex. **The edge is now about half as
visible as the sage it replaced: 1.05:1 against the desk, where the sage was
2.02:1.** Built as ruled, and the number is recorded so Dann can rule again.
**The tab also gave up its fill, radius, and drop shadow on the desktop**,
because the desk's drawing showed an outline. That was the desk's specification,
not Code's choice.

### THE CHEVRON, `b0a9860`, WALKED AND ACCEPTED

Dann: "I love the colour of the chevron and it loks centreed thank you."

**`--ink-secondary` `#4a4540`**, down from `--ink-primary`, 8.94:1 on the
handle. **Chosen by family, not only by value:** this drawer spends the ink
scale on glyphs and the stone scale on borders, and a chevron is a glyph.
`--stone-700` measured almost identically and would have been the first stone
used as ink.

**The nudge needed the centroid Dann asked for and could not have been found any
other way.** The glyph's BOUNDING BOX is exactly centred, 1.75 to 12.25 in a
14-wide box. Rasterised at 40x and weighted by alpha, **the INK centroid sits at
6.666**, because the two round caps at the open end carry more ink than the
single round join at the apex. Two errors followed, and only one is constant:
the box centres in the button (centre 530) rather than the handle's interior
(centre 529), and the 0.334 px asymmetry REVERSES when the glyph flips. So each
state took its own value, **−0.67 px closed and −1.33 px open**. **Both fall
below the "pixel or four" Dann guessed and Code did not round them up to meet
his guess.**

### THE LANGUAGE TOGGLE. RULED 2026-08-20, BRIEF WRITTEN, **SINCE BUILT**

**Built the same night.** Memo:
`docs/sessions/language-toggle_r1_2026-08-20.md`. `WRITTEN`, not walked. What
follows is the ruling as it was made.

**Dann ruled the pair becomes ONE pill**, naming the language he is not in.
**Nothing in the project had ruled the two-button form; it was built, not
decided.**

**The pattern is Canada.ca's**, found by research at Dann's request: one control
labelled with the other official language, "Français" on an English page, top
right of the header, abbreviating to FR and EN below a breakpoint. Mandatory for
Government of Canada sites under the Policy on Official Languages. **Dann is not
bound by it and took it for convention and familiarity, not compliance.**
Sources: `design.canada.ca/common-design-patterns/language-toggle.html` and
`design-system.canada.ca/en/components/language-toggle/design`.

**THE SHAPE WAS ALREADY RULED and was not the desk's to invent.** Spec §3.2,
the three radii: "full-round only for toggle knobs and **the language pills**."
The control already draws `border-radius: 9999px`.

**THE MEASUREMENT THAT DECIDED THE TREATMENT.** The existing control fails 4.5
in BOTH states on ALL FOUR bands: active 2.47, 2.90, 3.58, 2.96; inactive 2.65,
3.21, 3.93, 3.50. **That is not something the toggle change introduces.** Dann
first ruled dark ink on legibility grounds, then said "I think the white is
beautiful but I do think it needs to be black." The desk offered a third path he
had not seen, because his reason was legibility rather than taste.

**RATIFIED: option D, "I love D. Ratified."** White text on a chip that is the
band's own hue one step down.

| destination | band | chip | white on it |
|---|---|---|---|
| Transcription | `#8B9A7D` | `#6C7A5F` | 4.58 |
| Learn | `#A67B7B` | `#9A6A6A` | 4.52 |
| Guide | `#5C739E` | the band itself | 4.77 |
| Marked score | `#8E7E9B` | `#806E8E` | 4.63 |

**Guide needs no darkening and takes a hairline instead.** He chose this over
one translucent declaration knowing it costs four values.

**Two things it clears on the way past.** Three hand-picked literals, `#8F6A6A`,
`#4D6387`, and `#74677F`, exist only to colour the option you are not on and get
deleted. And the `INBOX.md` item from the same day closes: "Français" sits
inside an English document at `HeaderBar.svelte:58` with no `lang`.

**NOT RULED, and the brief tells Code not to decide it silently:** whether the
pill abbreviates to FR and EN on small screens. Build the full word, measure at
360 x 640, report a collision rather than abbreviating.

**Brief:** `docs/sessions/brief-to-code-language-toggle_r1_2026-08-20.md`.
**The ratified drawing:** `docs/sessions/lang-toggle-options_r1_2026-08-20.html`.

---

## 2026-08-20 AFTERNOON. N.65 SHIP ONE, WALKED AND REPAIRED FOUR TIMES

**Floor: `39d60e0`.** Five gates at baseline on every ship: 216, 235, 0 errors
and 7 warnings in 4 files, 682, 444 passed and 5 skipped. Nothing moved all day.

**The four commits.** `96e3fff` ship one. `f59f7d2` the sage boundary and one
station recipe modelled on Analysis. `3c498aa` the second walk and the intake
watermarks. `39d60e0` the intake pair.

**RULED BY DANN TODAY.**

- **The scroll reads Source, Output, Songs, Analysis**, then Score work and
  notices, then the pinned Voice anchor. **This reverses the
  Analysis-above-Output order shipped in N.73 S3 ship two and walked.** His
  reason: the song comes in and goes out at the top, the performance sits
  together at the bottom, and Print stops being stranded across an empty
  Analysis from the fields it belongs with. The order it replaced came from a
  spec written before the anchors existed.
- **Every station matches Analysis** in spacing and dividing rule. One recipe:
  a 2 px sage line, 6 px, the label, its own 0.4 rem, the body, 12 px, the next
  station's line.
- **No `double` border survives anywhere in the drawer.** The 2 px double at
  the three anchor and takeover boundaries went sage on his ruling "I do not
  like the double line, replace it with a sage horizontal like the one above
  Analysis." **He gave up the frame-versus-station distinction knowingly.**
- **The intake watermarks.** `text` in `--light-sage` and `score` in
  `--light-lavender`, 40 px, weight 700, `-0.01em`, `--font-sans`, centred,
  visible only while the field is empty, `aria-hidden`. **The colour split is
  Dann correcting himself** after the desk raised that light sage in both would
  put a sage mark inside a lavender-bordered box against his own hue rule.
  **40 px and its three companions are adopted from
  `fable-gui-mockup_r2_2026-08-18.html:94`, `.room-band h2`, the only oversized
  sans this project has drawn.** `partition` measures 148.19 px in a 262.8 px
  box at 360 x 640, so the brief's binding constraint did not bind; the full
  table from 28 px to 60 px is in the memo if Dann wants a larger number.
  **This watermark now DEFINES the oversized-sans convention and the chapter
  bands must match it**, because the bands do not exist and the mockup that
  draws them says its typefaces are stand-ins.
- **The drop zone's three stacked lines became ONE placeholder** in the
  textarea placeholder's exact treatment. See the lesson below.
- **The drawer's edge and its handle become one silhouette in grey.** Geometry
  drawn at `docs/sessions/lip-handle-silhouette_r1_2026-08-20.html` and ruled
  by Dann from that drawing. In flight with Code.

**THE LESSON THAT COST HIM FOUR ASKS, now CONTRACT tether 18.** He asked four
times for the two intake fields' placeholder text to match. The desk searched
`::placeholder` rules every time; the score box's text was three ordinary
elements, so every search was incapable of returning it. **He said "make it
consistent with its twin" and the desk wrote back that it was reading the twin
as the metadata field "since the score box has body text rather than a
placeholder."** The answer was inside that sentence and a stylesheet
distinction was used to rule it out. **Name the thing by what he can see.**

**THREE CAUSES FOUND BY MEASURING RATHER THAN READING, all by Code.**
`app.css`'s N.23 focus-zoom rule names `input, select, textarea` and not
`button`, so `SearchableSelect`'s three triggers stayed 12.8 px on a phone
while the two inputs jumped to 16 px: that was Dann's "two sizes among five
fields." A `:global(.drawer-content textarea)` rule with `!important` outranked
`.text-input`'s own border. And the double line was `border-style: double`,
never a seam between two rules.

**ONE RULE INSET, and the cause was mechanical.** A border draws on the border
box, so the 1 rem padding on the three pinned blocks sat inside it and the rule
spanned the whole drawer. The same 1 rem is a margin now. All seven sage rules
start 16 px from the drawer's left edge.

---

## 2026-08-21 EARLY. N.65 SHIP ONE, `96e3fff`. SHIPPED, PART-WALKED

**Floor: `96e3fff`.** All five gates at baseline on the ship: 216, 235, 0 errors
and 7 warnings in 4 files, 682, 444 passed and 5 skipped. Nothing moved.

**What shipped.** One owner for the station label, `StationHeader.svelte`, and
four of the five declarations deleted. `SOURCE` is a labelled station in both
languages. `Clear` and `Transcribe` returned to Source's foot. `Print` joined
Export and Import. Both text intakes went from 3 px to 1 px, hues untouched.
The textarea's placeholder lost its italic. Memo:
`docs/sessions/drawer-stations-ship1_r1_2026-08-20.md`.

**TWO PLACES THE TREE BEAT THE BRIEF, both found by Code measuring the screen.**
The brief's §3.2 called the double line a seam between two rules;
`NotationFields` draws no border and never did. And §3.6 named `.text-input`'s
border in `RootPanel`, but a `:global(.drawer-content textarea)` rule in
`+page.svelte` carried `!important` and outranked it, so the first edit changed
the source and not the screen. **Both are the same fault by the coordinating
desk and `ENVIRONMENT.md` now names it: a `path:line` for a CSS declaration is
a claim about the SOURCE, never about the screen.**

**WALKED: one item of eight.** Dann looked under NOTATION and reported two
lines. That is the repair now sitting in THE ONE THING. **The other seven are
unwalked**, including the table of computed label values, `SOURCE` in place,
`Print` beside the binder, and both intakes at 1 px.

**THREE THINGS ON THAT WALK ARE UNRULED and are Dann's to settle by looking:**
both field perimeters at 1 px, which was the coordinating desk's proposal and
not his ruling; the Output row having no label, since his ruling 4 named Source
only; and `SOURCE` in French, which Code set to the identical string by identity
rather than coining, because `t()` prints `[MISSING: source.heading]` and an
empty slot was not available.

---

## 2026-08-20 LATE. N.73 S3 SHIP TWO IS DONE, `af995a9`, WALKED BY DANN

**Floor for this section: `af995a9`.** All five gates at baseline, before and
after: 216, 235, 0 errors and 7 warnings in 4 files, 682, 444 passed and 5
skipped.

**What shipped.** `TabId` split into `Destination` plus `StudioDocument`; the
`ilya:activeTab` migration with every stored value named and the wall-closed
case tested; NOTATION's accent unconditionally sage; Analysis moved above
Output; and the desk head at one position on all four destinations.

**WHAT DANN WALKED, four of four, on the deploy.** Analysis sits above Export,
Import, and Songs. Flipping the pair does not change NOTATION's colour. The
pair and the reading links hold one height across all four destinations. A
stored `shane` reloads to Studio showing the marked score.

**IT SHIPPED IN A COMMIT NAMED FOR THE MEMORY.** `git add -A` swept the build
into `af995a9`, whose message reads "STATE: desk-head height ruled...". The ship
script never ran, so its five gates never ran at ship time. **Nothing unsafe
went out**: Code had run the same five on the settled tree, twice, and reported
them at baseline. **Recorded because a later session reading that message would
look for ship two somewhere else.**

**The desk head's expectation held to the pixel, both directions.** Stated
before the measurement: desktop Learn and Guide move DOWN 16 px to meet Studio,
phone Studio moves DOWN 8 px to meet Learn and Guide. Measured: desktop 64 to
80, phone 56 to 64. All eight readings have `--desk-pad-top` equal to
`padding-top`.

**Two things came out bigger than the brief said, both measured by Code.**
`drawerWidth` was a live S2 invariant violation rather than a reliance: with a
word open, flipping to the marked score narrowed the drawer from 693 to 523 px
while the word stayed in the console. It holds at 720 now. And `aria-controls`
was broken on BOTH pair members, not just the inactive one, because since S2
neither has a panel of its own. Dangling references: 0.

**One free result.** Code closed ship one's open walk item 7 in its own harness:
the takeover survives a word click, 1002 px before and after, three regions
still stowed. No ship one code was touched.

**THE CORRIDOR WAS MEASURED AND NOT CUT.** See the corrected entry below. The
coordinating desk's named cause was false.

Memo: `docs/sessions/n73-s3-ship2_r1_2026-08-20.md`.

---

## 2026-08-20 NIGHT. N.73 S3 SHIP ONE, `f7975ca` AND `63c2bb4`, WALKED BY DANN

**Floor for this section: `63c2bb4`.** All five gates at baseline on every run,
five runs across the night: phonology 216, dictionary 235, web-check 0 errors
and 7 warnings in 4 files, web-test 682, score-parser 444 passed and 5 skipped.
Nothing moved, so no permission was needed.

**The drawer has two anchors.** Piece and NOTATION are pinned at the top, the
voice line is pinned at the foot, and Source, Songs, Analysis, and Shift Lyrics
scroll between them. NOTATION moved from the bottom, where E.29 put it, to the
top, where E.36 §1.4 ruled it and Dann ratified it on 2026-08-19.

**The voice line exists for the first time.** `VoiceAnchor.svelte` is new. It
reads `Voice: not yet calibrated` with a lavender `Calibrate`, drawn at
`docs/sessions/fable-gui-mockup_r1_2026-08-18.html:333-338` and styled at
`:108-109`. **The calibrated wording, `Voice: {name}` with `Re-calibrate`, is
the coordinating desk's inference and not a ruling.** So is the French
`Recalibrer`, which is COINED with no house precedent. Both are Dann's to
ratify or replace. `Voix : pas encore calibrée` and `Calibrer` are adopted from
`i18n.ts:531`.

**Calibration is a takeover, so S4 is absorbed into S3.** `Calibrate` gives the
ritual the whole drawer behind one back affordance, and backing out restores
the scroll position and the retract state. E.44 §PLAN S3 asked for a "voice
line pinned bottom" as though one existed; it never did, and the thing it named
is `CalibrationWizard.svelte`, 2,125 lines and five phases including the
Pacifier's quadrilateral. **Dann ruled on 2026-08-20 that the anchor gets built
and the ritual becomes the takeover, both in ship one.**

**NOTATION's collapsed default is built.** Ruled 2026-08-18
(`docs/sessions/fable-gui-session-record_2026-08-18.md:12-15`), never built
until tonight, and the coordinating desk's 300 px expectation for the phone
failed on the old default and holds on the ruled one. `.drawer-content`
`clientHeight`, arrival: 565 at 430x932, 477 at 390x844, 360 at 393x727, 300 at
375x667, 273 at 360x640. **It is short at 360x640 and exactly on the line at
375x667**, and no anchor was shrunk to make the number nicer.

### Three repairs, all from Dann's walk, all shipped in `63c2bb4`

- **NOTATION's chevron pointed the wrong way.** Its rule is that the chevron
  points the way the panel will grow, and its two rotations expressed that for
  a panel pinned at the foot. Moving the panel to the top inverted them. The
  rule was never wrong; its values became backwards.
- **The marked score's page did not centre.** See the corrected section below.
- **The ritual's Start button was sage.** Ruling 3 of
  `claude/fable-ruling-s0-slate-closed_2026-08-19.md` keeps lavender to the
  voice anchor and calibration surfaces. Ten buttons across three rules moved.
  **Four controls were left sage and named rather than guessed**: the roster's
  per-vowel Re-take, the hold banner's answers, the switcher's verb row, and
  the name field's focus ring. The Pacifier's functional tokens are untouched.
  Lavender has no darker partner, so hover borrowed the anchor's own
  `opacity: 0.85` rather than inventing a colour in a ruled palette.

### What Dann walked, and what he did not

**PASSED on `63c2bb4`:** both anchors hold under scroll on the desk AND on the
phone; NOTATION retracts and expands from its new position; the takeover fills
the drawer with one back affordance and no chevron enters it; backing out
restores; the French uncalibrated strings render; and all three repairs.

**NOT WALKED, and the reason ship one is `WRITTEN`:** brief items 6, 7, and 8.
They need a microphone and a real calibration. The French half of item 9 waits
on the same three.

### Owed, none blocking

- **The memo needs one amendment.** `docs/sessions/n73-s3-ship1_r1_2026-08-20.md`
  carries the walk items as NOT ESTABLISHED, because the list never reached
  Code before the ship. Amend it with the walk and the three microphone items
  in one pass, not two.
- **The plea copy survives the cure.** The takeover fixed F2's container, but
  "Please name your profile so we can map your voice..." still opens the
  ritual, and `fable-gui-audit-and-spec_r1_2026-08-18.md:44` says "Please"
  breaks the house style Dann ruled on 2026-08-18. **Dann writes copy.**
- **THE DRAWER'S STATIONS. RULED by Dann 2026-08-20 late, NOT STARTED, and it
  goes NEXT, ahead of the chapter bands.** Dann asked for "a cohesive,
  attractive, sensible organization for the Drawer" after finding uneven header
  padding and a double line under NOTATION.
  **NO COMMISSION YET.** The mechanism he ruled is described in
  `claude/fable-ruling-e27-four-tab-consolidation_2026-08-05.md`, read in full
  2026-08-20, and has been unbuilt for fifteen days. Same pattern as the voice
  line: the description was there and nobody looked.

  **BUT E.27 IS A SOURCE, NOT LAW, AND DANN RULED IT SO ON 2026-08-20:** "That
  ruling was three weeks ago and a lot has changed since then. Leave room to be
  malleable." **The coordinating desk quoted §3.3 as binding and was wrong to.**
  Three of its parts are already superseded:
  - **§3.2, the continuous three-sheet packet page**, overturned by Fable
    explicitly in E.44 §PERSPECTIVE.
  - **§3.3's inspector takeover**, overturned in the same document: the
    Inspector is resident in Analysis and calibration is the only takeover.
  - **§3.3's five scrolling stations**, superseded by E.36 §1.4 and ratified by
    Dann on 2026-08-19: Piece and NOTATION are pinned anchors, the voice is a
    pinned anchor, and only Source, Analysis, and Output scroll.

  **What survives of E.27 unamended, and it is only this:** "one mechanism for
  structure, one for asides" (§3.3), the closed-header status line (§3.6), and
  the per-device persistence of the open set (§3.4). **Build against those and
  treat the rest as history.**

  **Dann's four rulings, 2026-08-20:**
  1. **Every header retracts its section on click.** This is E.27 §3.3
     arriving: "The stations use the existing table-of-contents accordion
     mechanism, allow-list extended."
  2. **One consistent relationship between a header and its first section
     entry.** NOT in E.27. A spacing value, mechanical once chosen.
  3. **Horizontal dividers need a semantic function or they go.** E.27 §3.3
     specifies exactly two mechanisms, "one for structure, one for asides": the
     accordion, and the native disclosure element for micro-help. **A divider
     is neither, so by Dann's rule it goes.**
  4. **Source needs a label.** E.27 §3.3 station 2 already names it. Spec §3.3
     first bullet, "no orphan controls," is violated today by the textarea and
     the drop zone sitting bare.

  5. **THE ANCHORS RETRACT TOO, ruled 2026-08-20 late.** Every station with
     contents retracts: Piece, Notation, Source, Analysis, Output, Songs.
     **The voice anchor is NOT a station**: it is one line, a dot, a status,
     and a button, with no contents to retract, and collapsing it would hide
     `Calibrate`, the only entry to the ritual, for no height. **CONFIRMED by Dann in his own
     words, 2026-08-20: "I agree with you about the voice anchor, yes,
     Calibrate needs to be visible."**
  6. **THE OPEN SET PERSISTS PER DEVICE.** E.27 §3.4, one of the three parts
     nothing has amended. **Dann's workflow makes it a requirement, not a
     convenience:** his model is that a singer fills the metadata once, retracts
     it because it has done its job, and gives the space to the operands. If the
     drawer forgets, that one gesture becomes a chore every session.
     **EXCEPTION, taken as the do-nothing rather than put to Dann: NOTATION
     keeps its deliberate non-persistence.** `+page.svelte` states the reason in
     its own comment, "a remembered collapse hides the toggles from a singer
     who forgot they exist," and nothing ruled on 2026-08-20 touches it. One
     line to reverse if a session proves it wrong.
  7. **SOURCE'S ACTIONS COME WITH IT, and this replaces a separate repair.**
     Ship two moved Analysis above Output and left the
     `Clear / Print / Transcribe` grid where it was, so `Transcribe`, the
     app's primary action, now sits below a tall empty Analysis pane,
     separated from the textarea it acts on. The coordinating desk offered
     this as a ship two repair and Dann did not take it up. **It dissolves
     here instead:** once Source is a labelled station with its own contents,
     Clear and Transcribe sit at its foot by construction, and Print joins
     Export and Import in Output. The `1fr 1fr 2fr` grid does not need
     repairing because it stops existing. **This is why the brief's §3 item 5,
     "Print stays where it is," is now spent.**

  8. **NO AUTO-COLLAPSE ON POPULATE.** It is the obvious next thought and E.27
     §3.3 forbids it in advance: "Calm Authority means the drawer does not
     fidget. Nothing else ever moves without the user." The retraction is the
     singer's gesture. **Do not build a station that shuts itself.**

  **FROM THE INBOX, opened at Dann's request 2026-08-20. Five items, and this
  is where each landed.**
  - **I.01 is DONE by N.73 S3 ship one** and should leave the file: NOTATION is
    no longer bottom-anchored and no longer opens expanded.
  - **The retractable-headers line is RULED IN** and is ruling 1 above.
  - **The placeholder line is RULED IN, 2026-08-20.** One declaration causes
    it: `.text-input::placeholder` carries `font-style: italic` and
    `.meta-input::placeholder` does not. The italic goes, because a placeholder
    is instruction and belongs to the Instrument voice. **The textarea's serif
    BODY stays: its contents are a poem.** Dann: "just make it consistent with
    its twin." Brief §3.6.
  - **The border line is RULED IN PART.** Dann ruled the hues are correct and
    must not be neutralised: **sage names the text intake, lavender names the
    score intake, which is hue naming place.** The coordinating desk's
    counter-proposal to make both neutral was WRONG and Dann overruled it.
    **What is NOT ruled: how to make them subtler.** The desk proposes the
    dominance is weight rather than hue, 3 px against the metadata fields' 1 px,
    and put it in the brief as its own proposal for Dann to rule by looking on
    the walk. **Measured against the white field: `--sage` #8B9A7D is already at
    2.99 against WCAG's 3:1 for a control boundary, `--light-sage` 2.15,
    `--muted-lavender` 2.62, `--light-lavender` 1.86, `--deeper-lavender` 3.74.
    The white fill is barely above 1:1 on the drawer, so the border is the only
    thing identifying the field.** Every lighter tone makes an already-marginal
    number worse, and that bears on the WCAG line in the inbox.
  - **The WCAG marketing line is not a build item** and stays where it is.
  **Also found, not scoped:** `app.css:140` provides a global
  `outline: 2px solid var(--sage)` focus rule, so the drawer's inputs are not
  focus-less. That closes a question the desk had raised as NOT ESTABLISHED.

  **WHY THE ANCHORS RETRACTING MATTERS, measured.** The Inspector's placeholder
  reserves `min-height: 365px` (`RootPanel.svelte:628`, read in the tree
  2026-08-20). Against the drawer middles Code measured on `63c2bb4`, retraction
  of the scrolling stations alone cannot deliver a full Analysis pane on three
  of five phone sizes, because the middle is already shorter than the reserve:
  360, 300, and 273 px against 365. **Retracting the metadata anchor, 302.7 px,
  gives back roughly 270 and clears all five.** So Dann's ruling 5 is what
  closes the small-phone case, not ruling 1.
  **NOT ESTABLISHED: the POPULATED Inspector's height.** 365 is what the
  placeholder reserves. The figure it was chosen against sits in E.36 §2.2,
  which this desk has not opened.
  **A HOLE IN E.44 WORTH KNOWING BEFORE ANYONE REOPENS THIS.** E.44 overturned
  E.27's Inspector takeover on the grounds that the Analysis region "always has
  a truthful tenant, because its placeholder body carries the dictionary state
  and the empty-state copy." **That is an argument about the EMPTY state.**
  Nothing in it considered whether the populated state fits on a 375 px phone.
  By tether 17 that overturning is a source, not law.

  **NOT GRANTED, and the build must not assume it: phone exclusivity.** E.27
  §3.4 rules "Desktop: any number of stations open at once. Phone: exactly one
  open at a time." Opus flagged that on 2026-08-05 as a second override of
  Dann's standing "we leave this to the user," which Fable did not name as an
  override. **Dann has been asked and has not answered, twice. His standing
  rule governs: any number open, on both displays.** The override stays
  unbuilt and reversible.

  **The defects this closes, all measured 2026-08-20:**
  - **`.section-label` is declared five times**, in `RootPanel`,
    `MetadataFields`, `NotationFields`, `SongList`, and `Drawer`, because
    Svelte scopes styles per component. `SongList.svelte:177` admits it in its
    own comment. **That is the uneven padding, and it has no owner.**
  - **The double line under NOTATION is a seam**, not a decision: NOTATION is
    a pinned anchor whose wrapper draws a boundary AND a station that draws its
    own.
  - **Source is unlabelled.**

  **NOT BUILT AND STILL OWED, E.27 §3.6:** "Every closed station header carries
  a right-aligned quiet status that does the wayfinding: Notation 'defaults,'
  Voice 'no profile yet,' Output 'nothing to print yet.'" **Dann writes copy.**

  **THE COST WAS PRICED ON 2026-08-05 AND IT IS NOT SMALL.** Opus's correction
  §1 item 1: retiring the other collapse mechanisms "means reworking the
  profile switcher's mode enum, the wizard's hoisted collapse boolean, the
  uploader's local boolean, and the searchable select. **Four components, not
  a configuration change.**"

  **Sequenced ahead of the chapter bands by the coordinating desk**, because a
  singer touches the drawer every session and a chapter band is an arrival
  decoration. Dann may reverse it.

- **THE CHAPTER BANDS FOR LEARN AND GUIDE. RULED by Dann 2026-08-20,
  RESEQUENCED, not started.** Drawn in full at
  `docs/sessions/fable-gui-mockup_r2_2026-08-18.html`, Exhibit 2. One band
  grammar for both rooms: breadcrumb, oversized sans title, one-line lede, meta
  line, then the page drops into the serif reading measure untouched. Rose at
  full strength for Learn, cobalt for Guide, spent on arrival and nowhere else
  on the page.
  **RESEQUENCED: immediately after S3 ship two, NOT after S5 and S6.** The
  coordinating desk argued and Dann did not object: S5 is the wall re-plumb and
  S6 is consequences, and both are Studio's business, touching neither reading
  room. The bands need only ship two, because ship two moves `reading-mode`'s
  padding, which is where a band sits. Building them first would mean reworking
  them a day later.
  **DANN'S RULING ON THE META LINE, option B without citations.** Fable's own
  caveats say the mockup's meta figures are invented: "Chapter 3 of 8",
  "12 min", "3 sections", "7 min", and "Grayson §§4.1-4.9". Ilya holds none of
  it. **Ruled: compute what can be computed.** Chapter index and section count
  come from the heading structure the TOC already walks
  (`+page.svelte`'s reading-mode IntersectionObserver). Reading time is a word
  count over a stated rate, which is arithmetic rather than an invented number.
  **The Grayson citations are NOT built now.** They are scholarship, they come
  from Dann, and they are a later content pass. **Do not invent one.**
  **The brief is deliberately NOT written yet**, because it would be written
  against `reading-mode` and the desk head as they are about to change in ship
  two. Write it when ship two lands. **Also re-verify the mockup's rose and
  cobalt hexes against `app.css` before building: Fable read them by eye off a
  deploy and said so.**

- **THE `2026a` QUALIFIER. Dann is warming to removing it, NOT RULED,
  2026-08-20.** His words: "I think we will remove the 2026A qualifier from the
  Ilya sigil. All of them... Especially since I plan to chill once this is
  released." **He is leaning, he has not ruled, and nothing may be built on
  this.** Do not treat the lean as the ruling.
  **His argument, which the coordinating desk did not reach and endorses:** a
  year-letter promises an edition series. With no 2026b, the qualifier
  advertises a cadence that will not arrive, and a stale year reads as
  abandoned inside eighteen months.
  **Two arguments against, put to him:** the badge is the only on-screen thing
  that says which Ilya a singer has, and "I plan to chill" governs his effort
  rather than whether the software changes; and the badge carries the
  per-destination hue in four rules, so removing it drops a wayfinding echo a
  week after hue carriers were deliberately pruned.
  **The coordinating desk's recommendation, NOT a ruling:** strip the badge
  from both sigils, screen and paper, and leave `2026a` in the colophon, which
  prints on every page. Clean `[Ilya]` wordmark, build still identifiable from
  a photograph.
  **Cost, counted from the tree 2026-08-20, about a dozen mechanical edits with
  no judgement inside them:** `HeaderBar.svelte` the badge span, the
  `aria-label`, `.sigil-version`, and four per-destination colour rules;
  `TitleHeader.svelte` the badge span, `.logo-version`, and the `versionAccent`
  prop; `VoiceProfilePane.svelte` two call sites passing `#8E7E9B`;
  `i18n.ts:193-194` both colophons. **No `contrast.ts` obligations.**
  **Timing: before the beta this is invisible; after it, it is a visible change
  to something singers have already seen.**

- **THE DESK HEAD SITS AT TWO HEIGHTS. Found by Dann 2026-08-20, RULED by him
  the same minute, rides with ship two.** The pair and the reading links sit
  lower on Learn and Guide than on Studio's two documents, on the phone.
  **Dann's ruling: one position on all four destinations, at Learn and Guide's
  lower placement.**
  **The cause, established by reading the tree:** `.main-content.reading-mode`
  sets `padding-top` and `--desk-pad-top` itself, and two classes beat the one
  class the breakpoint's own rule uses. So it overrides in BOTH directions:
  phone Studio `0.5rem` against reading `1rem`, desk Studio `2rem` against
  reading `1rem`.
  **The fix: stop `reading-mode` setting vertical position at all**, and raise
  the phone's base to `1rem`. Two declarations deleted, one changed. All four
  then take one value per breakpoint, `1rem` on the phone and `2rem` on the
  desk. **`reading-mode` keeps `justify-content` and `transform`.**
  **The consequence, stated before the walk: on the DESKTOP, Learn and Guide
  move DOWN 16 px to meet Studio.** That follows from Dann's rule, not from a
  preference of the coordinating desk. If it looks wrong the answer is a
  different single value, never a return to two.

- **THE CORRIDOR AT THE DRAWER'S RIGHT EDGE. Found by Dann 2026-08-20, rides
  with ship two.** On the phone a strip of empty sits between the drawer's
  content and the pull, and every horizontal rule in the drawer stops short of
  the edge because of it. **The rules under NOTATION and above the voice line
  make it visible**, which is how Dann found it.
  **CORRECTED 2026-08-20 BY MEASUREMENT. THE COORDINATING DESK'S CAUSE WAS
  FALSE AND NOTHING WAS CUT.** The desk claimed the 44 px reserve was stale,
  set when the pull was wider, and left behind by Dann's 2026-08-19 ruling. The
  tree says otherwise and the tree wins. **The reserve has never measured the
  pull's paint. It measures the pull's touch target, was set to it at N.73 S1b,
  and the rule says so in its own words at `Drawer.svelte`, in the mobile
  block.** The pull paints 20 px and its coarse-pointer target measures 44 px;
  `elementFromPoint` confirms the pull owns the drawer's rightmost 44 px across
  its band and zero anywhere else. **A 24 px reserve would put 20 px of content
  under the pull.** The reserve is correct to the pixel.
  **The desk did state this failure mode before the measurement**, in these
  words: "if it measures near 44, my diagnosis is wrong and the corridor is a
  real space, which is when Design becomes worth asking." It measured 44.
  **What is true, and it is a real cost:** the reserve spends 44 px of the
  drawer's FULL height to protect an 88 px band. **Exempting the anchors is not
  safe either, and that is measured rather than reasoned:** at 360 x 640 the
  NOTATION disclosure button falls inside the band and would lose its right
  28 px.
  **CLOSING THE CORRIDOR IS THEREFORE A RULING, NOT A MEASUREMENT**, and by the
  desk's own stated condition it is now the thing worth putting to Design.
  **Dann proposed filling it instead**, with vertical lines from the pull to
  the top and bottom margins, to read as a file folder's spine. **The
  coordinating desk argued against and Dann did not overrule.** The grounds:
  `docs/sessions/ilya-lip-options_r1_2026-08-18.html` option B, the full-height
  seam rail, was drawn and rejected on 2026-08-18 partly because an edge that
  whispers is missed by a first-time singer, and a rail that looks like a
  handle along its whole length while only 76 px of it is tappable is a lie
  about what is tappable. Two new vertical regions would also need a hue, and
  hue names place in this system, one week after the lavender desk was killed
  to keep hue carriers few. **If Dann wants the spine anyway, it is a ruling
  and rulings of that kind are Fable's.**

- **The pinned metadata block is 302.7 px on the phone.** With NOTATION now
  contributing almost nothing, that block is what the top anchor costs. The
  mockup draws Piece as one line; the tree pins a heading and six fields.
  **Not ruled.** It is the same question as `INBOX.md`'s retractable-headers
  entry and should be answered with it.

---

## 2026-08-20. N.73 S2 IS DONE, `904df6e`, WALKED BY DANN

**Floor for this section: `904df6e`.** All five gates at baseline, nothing
moved, no permission needed: phonology 216, dictionary 235, web-check 0 errors
and 7 warnings in 4 files, web-test 682, score-parser 444 passed and 5 skipped.

**One Studio drawer exists.** `Drawer.svelte` renders `rootPanel` and
`shanePanel` both, always, on both of Studio's documents, rather than folding
one into the other. That shape was chosen over rewriting `RootPanel` to take
about twenty new props, because a failed walk on a fused component cannot say
which half broke.

**What shipped.** The second `MetadataFields` is deleted and `fromScore` and
`onrevert` are carried into the survivor. The second Print button is deleted
and the survivor's guard is keyed on the visible document, reusing both old
expressions verbatim. The twinned binder row is deleted. `ScoreUploader` and
the no-lyrics courtesy message moved under the textarea inside `RootPanel`,
through a `sourceScore` snippet, so text intake and score intake are one Source
region. Brief:
`docs/sessions/brief-to-code-n73-s2_r1_2026-08-20.md`. Memo:
`docs/sessions/n73-s2_r1_2026-08-20.md`.

**The walk, measured on the deploy rather than eyeballed.** Flipping the pair
leaves the drawer identical: same text at 901 characters, 140 visible elements,
`scrollHeight` 1684, on both documents. Only `data-tab` changes. **What Dann
first read as movement was the paper**, which is what the pair is supposed to
change.

**One thing S2 broke and Code fixed in the same commit.** `ProfileSwitcher`
focuses its profile-name field on mount on a desktop pointer. Under one drawer
that field sits at the foot of a column twice as tall, so the drawer opened
scrolled to its own bottom: `scrollTop` 1160.5 of 1161 merged, 0 unmerged. The
fix is `preventScroll: true` at `ProfileSwitcher.svelte:196`. **JUDGEMENT, one
word to reverse.**

### Left open by S2, on purpose

- **§4's station order cannot be reached by rendering two panels in sequence**,
  because Output lives in `RootPanel` and Voice lives in `shanePanel`. Reaching
  it needs Print split out of the Clear-Print-Transcribe grid. Code named the
  gap rather than invent a ruling, which was right. **S3 settles it.**
- **`NotationFields`' accent still follows `activeTab`** on a panel that no
  longer has a tab of its own. Left alone. S3's.
- **The no-lyrics courtesy message was not observed in its own state.** It needs
  a score without lyrics. Structurally it cannot move, because it sits in the
  drawer gated on `noLyricsFile` alone and both panels now render always, but
  nobody has watched it.
- **NOT WALKED: items 3 through 7 of the brief's done list.** Only the central
  test was walked. The rest waits for a day with more in the tank.

### FOUND THIS SESSION, NOT S2'S, NOT NUMBERED

**On the desktop the marked score's page does not centre. It sits flush left
while the transcription's page centres.** The desk head stays where the sheet
ought to be, so the two disagree by about the width of the empty desk to the
right.

**Controlled, and this is the whole reason it is not S2's:** the same defect is
present on `81438d4`, the build before S2, observed by Dann in the same Chrome
window minutes apart. **S2 did not cause it and reverting S2 would not fix it.**
It is somewhere in `VoiceProfilePane`'s empty-state branch, which renders a bare
`<article class="paper-page profile-page envelope-page">` outside `PageFit`,
rather than in `.main-content`, whose `align-items: center` is intact and does
centre the transcription. **The exact rule is NOT ESTABLISHED; nobody has read
the computed style.** Dann's to rule, and it may belong to N.75.

### CORRECTED AND CLOSED 2026-08-20 NIGHT. The marked score's centring

**The diagnosis above is wrong and the defect is fixed.** The envelope page is
NOT outside `PageFit`: `VoiceProfilePane.svelte` opens `PageFit`, renders the
article inside it, and closes it. The real cause, established by reading the
tree: `PageFit`'s `.paper-fit` is `width: 100%`, so `.main-content`'s
`align-items: center` has nothing to centre. `Paper.svelte` wraps the
transcription's stack in `.paper-container`, whose rule carries
`align-items: center`, and that is what centres it.

**`VoiceProfilePane` already had the equivalent**, `.fit-paper-container`,
byte-identical, on its score branch. Only the empty-state envelope branch was
bare, which is the state Dann was looking at. The repair is that existing
wrapper applied to the branch that never had it, one element, no new
mechanism. Shipped in `63c2bb4` and walked by Dann. Left edges measured before
and after: at 1920 the page went 552 to 812 against a desk head at 812, and
the 260 px gap was exactly half the empty desk.

**This is also why the desk had to be the instrument.** At 1400 with the
drawer open the desk is exactly the page's width, so the two agree by accident
and nothing shows.

### Hard-won, and now in ENVIRONMENT

**A "nothing moves in the drawer" test cannot be run on a phone.** The drawer
covers the whole screen there, so the pair sits behind it and the singer must
close, tap, reopen, and compare from memory. The desk is the instrument for
that class of test. The walk instruction was written for a desktop and handed
to Dann on a phone, and it cost him a confused look.

---

## 2026-08-19 EVENING. THE REDESIGN BUILDS. FIVE SHIPS, ALL WALKED

**Floor for everything below: `dca9de4`.** Gate 4 moved **671 to 682** with
Dann's permission, asked and granted before the ship, for
`reading-aid.test.ts`.

- **N.73 S1 is DONE, `9b2af02`, walked by Dann.** The tab bar is deleted from
  both mounts and `TabBar.svelte` is gone; `TabId` lives in
  `lib/destinations.ts`. `DeskHead.svelte` draws the pair flush with the
  sheet's left edge and Learn and Guide flush right. The three desks carry the
  ruled 60 percent tints. The drawer opens sideways on every display and one
  bookmark tab replaced three handles. **The N.42 assignment named three rules
  written in terms of the 56 px bar; the tree held six**, one of them in
  `InstallPrompt.svelte`.
- **N.73 S1b is DONE, `128bc29`, walked by Dann.** The paper's shadow, lavender
  for the marked score, a thinner pull, and matched margins for Learn and
  Guide. **The brief's diagnosis of the flat paper was wrong**: the phone had
  `box-shadow: none`, not a weak shadow, and three `+page.svelte` rules
  outranked each sheet's own declaration by two classes. There is one ruled
  shadow now, `0 3px 12px rgba(0, 0, 0, 0.35)`, declared by four sheets.
- **N.73 portrait C is DONE, `2f14d73`, walked by Dann.** The arrival view is
  the real page scaled, not a second drawing: measured aspect ratio 0.7727,
  which is 816 ÷ 1056. `ReadingAid.svelte` is new. **The interstitial is dead**
  and nothing replaced it. Four N.45 spike blocks were retired to get there:
  `TitleHeader` and `RunningHeader` hid the header blocks below 767 px,
  `PageFooter` rebuilt itself static, and both sheets reflowed to
  `width: 100% !important`.
- **N.73 portrait C2 is DONE, `fa4e0c9`, walked by Dann.** `PageFit.svelte` is
  new and both documents miniaturize through it. `--portrait-gutter: 24px` is
  declared once and shows on three sides; the page went 265.66 to 327 px, 23
  percent wider. All four destinations now measure a 327 px sheet on the phone.
- **N.73 portrait C3 is DONE, `dca9de4`, walked by Dann.** The marked score no
  longer summons the keyboard on arrival: `ProfileSwitcher`'s focus is gated on
  `matchMedia('(pointer: fine)')`, and the selection moved to a once-per-mount
  `focus` listener so a tap still lands on a selected name. Both empty states
  are centred italic at the same values.

### Ruled by Dann this evening. Both are in project knowledge

- **The drawer opens horizontally on every display, and its pull is a bare
  chevron with no visible word**
  (`claude/ruling-drawer-horizontal-motion-and-bare-chevron_2026-08-19.md`).
  This supersedes the mobile half of the 2026-08-18 ruling 7, so **ruling 5's
  labelled drawer pull is dead rather than unbuilt**. "Drawer" and « Tiroir »
  survive as the control's accessible name.
- **Lavender marks the marked score, banner and desk**
  (`claude/ruling-lavender-marks-the-marked-score_2026-08-19.md`). Amends S0
  ruling 3 and the app-bar half of ruling 6. Every distinct working surface
  carries its own hue. `--surround-marked: #D2CBD7`.

### N.75 IS NUMBERED, NOT STARTED. The page layouts

Dann numbered it mid-session to stop it derailing the build. **The scope: the
paper's own layout, and its coherence with the redesigned app.** He is not
reporting a failure; he wants more coherence. **The question he has NOT
answered, asked and deferred by him: which way the coherence runs**, the page
adopting the app's system, the app receding further, or the two sharing
measures while staying distinct objects. Ask it when N.73 is further along.

### Owed from this evening, none blocking

- **A score page in portrait is a whole letter-proportioned page with a
  deliberate hole where the notation is withheld**, mostly empty by
  construction. That is what N.46's surviving half and portrait C compose to.
  **Nobody ruled it and Dann has not seen it**; it needs an ingested score.
- **JUDGEMENT, tagged by Code and not ruled: a poem breaks where the singer
  left a blank line.** `LineData.endsStanza` is set in `processText` from the
  raw input, because nothing in the tree recorded stanzas. The aid's line rules
  and end marks depend on it. The revert is that field plus `reading-aid.ts`.
- **Learn and Guide took the phone's 24 px gutter** as a consequence of the
  token, not as a decision.
- **Tapping a word in the aid is not wired.** One prop if Dann wants it.
- **The language option's contrast is 2.96:1 on lavender**, 2.47 on sage, 2.90
  on rose, 3.58 on cobalt. White at 15 percent over the bar hue. Predates
  N.73 and is Dann's to rule.
- **NOT WALKED by anyone, and Code said so plainly:** the `Read` and
  `The page` switch inside the real app, the scroll position surviving it,
  print from the phone, the marked score with a score ingested, and landscape.
  Code's environment runs its tab hidden, so the dictionary's two 47 MB shards
  never finish parsing and `Transcribe` never enables.



## 2026-08-19 AFTERNOON. THE KEY TURNS: N.58 CLOSED, S0 CLOSED, FRENCH RATIFIED

- **N.58 is CLOSED by ruling: drop.** The scoping ran as a Fable-farmed Sonnet
  agent (the 2026-08-14 brief was never run and its text is unrecoverable);
  memo: `docs/sessions/sonnet-memo-n58-scope_r1_2026-08-19.md`, 136,545 tokens
  inside its stated bound. The finding: MIDI import is a third parser (~450 to
  700 lines plus tests plus fixtures from nothing), not the cheap adapter the
  2026-08-14 framing assumed; the old no-lyrics objection is dead (N.55b hand
  pairing exists); and anyone who can export MIDI from notation software can
  export MusicXML from the same menu. Dann ruled drop. **Outstanding Code
  task, small: remove the "Coming soon: MIDI" promise, the `.mid` accept, and
  the soon-copy** (`ScoreUploader.svelte:17-19`, `:79`, `:422-423`, `:515`,
  cited from the memo). MIDI may return as a fresh numbered item if a singer
  asks.
- **The E.44 S0 slate is CLOSED**, six rulings by Dann: anchors confirmed,
  the pair is Transcription | Marked score, the sage desk (lavender desk
  dies), luminance-keyed inks with the cream chip `#F0EBE0`, three document
  kinds designed and two built, and the name **Studio** ratified in his words.
- **The N.73 French strings table is RATIFIED**, every word seen by Dann,
  several improved by him (« partition annotée », « décaler », « permuter »,
  « couplet »): `docs/sessions/fable-n73-french-strings_r1_2026-08-19.md`.
- **N.72's iPhone walk is queued, step 1 pending Dann's phone**: install from
  the branch alias, then the first N.73 ship provides the second build the
  walk needs.
- Usage steering, read from Dann's screenshot 14:15: Fable 58 percent against
  all-models 46, both reset Sunday, so mechanical work rides Code and Sonnet
  this week.

---

## N.67 IS CLOSED WHOLE, 2026-08-18 NIGHT. THE SAVE FUNCTION EXISTS

**Step 6 is DONE, walked by Dann on two deploys** (`ilya-16yumobac`,
`ilya-qudmxhw07`), curated by Fable:
`docs/sessions/n67-6-dann-walk_r1_2026-08-18.md`. The two deploy-only items
settled: **Chrome does not auto-grant persistence on a Vercel origin** (the
eviction notice appears once, then never), and **a real score's bytes survive
the corrupt-record salvage end to end**: corrupted by hand, exported at 11.3 KB,
imported still-damaged on a second origin, repaired, and the Mussorgsky stave
drew from the transported bytes. New findings: **W6**, the neutral-song
discard can strand `ilya:activeSongId` and fire `storage.partialLoss` as a
false alarm (candidate one-look, unnumbered); W2 and W5 re-observed,
unchanged. One instrument error by Fable, named in the record: the first
import target ran pre-step-6 code; **check the commit under a deploy before
walking new behaviour on it.**

**Ilya now keeps songs plural in IndexedDB with their scores' bytes, survives
reload and update, migrates the localStorage era forward, exports and imports
one song or the whole library as one binder format, refuses to guess at
records it cannot read while preserving them for salvage, asks before every
destruction, and says so honestly in two languages when storage fails, fills,
or threatens to evict. Every step of it was walked by Dann on a real deploy.**

---

## N.67 STEP 6 IS SHIPPED, 2026-08-18, `cee4572`. NOT YET WALKED BY DANN

The failure-handling surface: the eviction notice, the corrupt-record salvage
path, the storage copy finalized in both languages, and the N.27 recommendation
recorded rather than built. Gate 4 moved **628 to 671** with Dann's permission,
asked and granted before the ship. Memo:
`docs/sessions/n67-6-the-sweep_r1_2026-08-18.md`.

**THREE THINGS THE DESIGN ASSUMED AND THE TREE DID NOT DO.** All three were
found by reading the tree first, which is what the brief asked for:

- **Nothing ever read a record's `schema`.** `validateRecord` rebuilt every field
  from `emptySongRecord`, whose `schema` is the literal `1`, so a record written
  by a future Ilya was silently DOWNGRADED and written back at this version's
  number. Only the binder MANIFEST schema was checked, which is a different
  number about a different object. Design §4's "a version from the future" was
  designed in E.52 and never built. It is built now.
- **A corrupt record was silently overwritten**, which is the brief's §3.8
  positive control and it came back positive. Three sites read a record, got the
  rebuilt stand-in with the damage already gone, and saved it: `backfillName` at
  boot, `renameSong`, and the document's autosave. Worse, the laundered record
  then validated CLEAN, so nothing downstream could tell a song had ever been
  damaged. `positive-control.test.ts` keeps the measurement.
- **One damaged record refused an entire binder on import**, so the export that
  design §4 calls the salvage path could be written and never read back.

**THREE REFUTATIONS ON CODE'S OWN WALK, each repaired with a regression test.**
Recorded because they are the argument for walking at all: every one passed the
five gates first.

1. **Export took the open song from the document without asking the vault**, so
   opening the damaged song and pressing Export all wrote the laundered record
   plus an edit that was never saved. The salvage path failed for exactly the
   song the singer is looking at.
2. **`storage.none` was produced twice** (boot and first write), the template
   keyed its `{#each}` on the notice key, and `each_key_duplicate` killed the
   notice region **in exactly the state it exists to describe**.
3. **A read-only song's list row drew an auto-name the page invented** and could
   never store, beside a sentence promising the record had been left untouched.

**WALK FINDING W1 IS CLOSED.** `collide.title` now names the song it is asking
about, in both languages, ratified by Dann before it entered the tree. W2, W3,
W4, and W5 remain open and unassigned.

**TWO RULINGS, GIVEN 2026-08-18 AFTER THE SHIP.** The typographic apostrophe
rather than the ratified table's straight one: **ratified**. The now-unused
`storage.saveFailed.quota`: **deleted**, after checking it had zero references in
code, tests, and components.

**WHERE THE TREE BEAT THE BRIEF, and the tree won each time.** Step 1 did ship
`persist()` and `estimate()`. Blocking IndexedDB does NOT put Ilya in memory: it
falls back to the localStorage legacy driver and work is genuinely saved, so
`storage.none` fires only when localStorage is unreachable too. And
`storage.partialLoss` deliberately stays SILENT on an empty vault, because a wipe
and a first visit are indistinguishable there, which is design §4's own honesty
rule.

**THE NAMED WEAKNESS, CONFIRMED AND NOT SOLVED.** The storage notices render in
the **Fit** drawer and the song list in the **Transcription** drawer. They are
different drawers, so the unreadable mark and the unreadable sentence are never
on screen together, and a singer who never opens Fit is never told their storage
is full.

---

## N.67 STEP 5 IS DONE, 2026-08-18, WALKED BY DANN ON THE DEPLOY

Code shipped it (`9892887`, memo `db54cff`); Dann's walk on `a8a979b` closed
it the same evening. Every path observed: export-all (1,454 bytes for two
scoreless songs, deterministic across a double click), clear-and-resurrect
whole, sequential collision dialogs correctly dressed and centred, **Escape
dismissing safely with no hang and nothing destroyed** (the path no instrument
could reach), Keep mine inert, Keep both minting independent `(2)` duplicates,
and exactly one reload, for the open id, after the dialog sequence completed.
Walk findings, none blocking: **W1** the collision dialog never names its song
(copy change, goes to Dann with the French table); **W2** the post-reload paper
arrives blank until Transcribe (arrival behaviour not established; candidate
one-look); **W3** binder filenames use local date while auto-names and dialog
dates use UTC; **W4** defect F7 did not reproduce (auto-name was correct;
re-verify rather than fix); **W5** an untouched neutral song is discarded on
switch-away (observed, not ruled).
Full record: `docs/sessions/n67-5-dann-walk_r1_2026-08-18.md`.

## RULED THIS EVENING, SECOND AND THIRD SITTINGS

- **N.73, the GUI overhaul**, is the umbrella item for the redesign: E.44's S1
  to S6, portrait C, and the aesthetic layer, with N.42, N.64, N.65, and N.66
  as its parts under their own names. Every future brief serves "N.73 Sx". It
  builds after the beta line closes or when Dann names the displacement.
- **N.74**, a one-look: whether `pendingConfirm` and `pendingArrival` have
  ever been cleared on close since step 4a, in real browsers (the close-event
  finding, ENVIRONMENT.md 2026-08-18).
- The census count is **93**, not 92: Export all songs joined the twinned
  binder rows after the census ran; it inherits their disposition (duplicates
  merge to one Output control under N.73).

---

## THE FABLE GUI SESSION, 2026-08-18 EVENING. RULED, RECORDED, NOTHING BUILT

Dann displaced N.67 step 5 for one session of GUI design work with Fable in
Cowork. Step 5 remains THE ONE THING. Full record with rulings, artifact md5s,
and instrument notes: `docs/sessions/fable-gui-session-record_2026-08-18.md`.
The short form:

- **Ratified:** the eleven-principle Calm Authority slate and operational spec
  (colour, shape, grouping, typography, motion, error copy).
  Doc: `docs/sessions/fable-gui-audit-and-spec_r1_2026-08-18.md`. Also filed to
  project knowledge as a ruling.
- **Ruled: portrait treatment C.** Fitted true page as portrait's arrival, one
  tap into a reading aid stripped of all paper dress, one tap back. The
  interstitial is retired. Amends PRODUCT.md's portrait accommodation;
  rotation-as-mode-switch stands.
- **Ruled: NOTATION opens collapsed** (toggles are departures from Grayson,
  intentionally accessed).
- **Ruled: error copy voice** (honest, non-patronizing, next step where
  warranted, case by case).
- **Ratified by eye:** Learn and Guide chapter-opening bands (full-strength
  hue, oversized sans, untouched reading measure below).
- **Mockups:** `docs/sessions/fable-gui-mockup_r1_2026-08-18.html` and
  `_r2_`. r2 supersedes r1's portrait exhibit (r1 wrongly carried the four-tab
  bar into portrait).
- **Audit findings F1 to F9** in the audit doc. Code one-looks, non-blocking:
  F7 auto-name produced the song title `Я` from `Я вас любил:...`; F8 the song
  row still reads as an input. The GUI track still builds nothing before the
  beta line closes unless Dann names the displaced item.
- Not walked: Print, Safari, Fit with a loaded score, calibration.

**Second sitting, same day.** The control census ran (Sonnet,
`docs/sessions/sonnet-memo-control-census_2026-08-18.md`: 92 control templates,
every one with a `path:line` and a disposition; cost overran its bound, stated
in its header). Its 14 open dispositions are now all closed:
`docs/sessions/fable-gui-rulings-2_2026-08-18.md`. The short form: app bar
keeps and re-keys to three destinations; mobile gets one labelled drawer pull,
desktop's lip becomes the bookmark tab
(`docs/sessions/ilya-lip-options_r1_2026-08-18.html`, option A); the pairing
work gets a fifth station named **Underlay** (French not ruled) between Source
and Analysis; the slide operations are kept but demoted to the
**contextual-sentences design** (click a paired note to select it, verbs appear
as plain sentences, one automatic scope, Rotate on multi-select only,
insert-with-ripple rejected, N.55b untouched). Five further dispositions were
taken as stated defaults under tether 13, vetoable by one word. **Before Code
builds:** the E.44 S0 slate needs verifying or ruling, the full French strings
table needs Dann's eyes, Dann owes voice-profile texts and the mobile AI-slop
thread, and Dann names the displacement or the build waits for the beta line.

---

## N.67 STEP 4b IS DONE, 2026-08-18, `cb7a15a`, WALKED BY DANN ON THE DEPLOY

**Songs are plural.** The list, New song, rename, delete with confirmation,
switching, auto-naming, and the neutral-state fingerprint prompt all ship and
were all observed by Dann on `ilya-hg5dr7kl3`, ten steps, every one of them
matching a stated expectation or refuting one on the record.

Memo: `docs/sessions/n67-4b-library-door_r1_2026-08-18.md`.
Brief: `docs/sessions/brief-to-code-n67-4b_r1_2026-08-18.md`.

**What Dann saw.** A song auto-named `Я тебя любил` from its poem alone; the
control fixture uploaded to `5 / 5`; `бил` clicked onto note one to make `4 / 5`;
New song emptying everything and the list growing to two; **the switch back
restoring the score, the metadata, and `4 / 5` with `бил` still on note one**;
a rename surviving a reload; the recognition prompt naming the song by the name
**he** gave it rather than the auto-name; and a delete that took the song and
stayed gone across a reload.

**The vault was already plural and nobody had noticed.** `LIBRARY_STORES`
(`driver.ts:290-301`) has carried `by-updated` and `by-fingerprint` since step 1,
and `driver.idb.test.ts:92-114` already proved two songs coexist. **Every
one-song assumption lived in the application layer**, which is why 4b was
smaller than its description.

**The switch mechanism was decided by measurement, not by argument.** Code
expected `.musx` to be too slow and to need `location.reload()`. It measured the
opposite: **a warm `.musx` switch is 343 ms against a 448 ms reload**, and the
reload additionally throws away the tab, the drawer, the scroll position, and the
loaded dictionary. **`close()` then `open()` with a reactive document slot.**
Whole-gesture, two real `.musx` songs, press to drawn stave including the 175 ms
tab animation: **852 ms**. All Chromium; **Safari is NOT ESTABLISHED**. This
closes design §9.3 for Chromium only.

**`+page.svelte` grew 2,578 to 2,857 lines, 94,571 to 105,544 bytes**, far past
the brief's thirty-line allowance and past the design's own 74 KB warning. The
reason is stated in the memo §3 and is partly real: the page owns the document
slot, the dialog, and the arrival path. **This file is now a standing debt and
the next thing that touches it should shrink it.**

**Four defects the gates could not reach, all found by Code driving a browser:**
an English placeholder under a French UI, a song row that read as a text input,
a New song button whose classes did not apply because Svelte scopes styles per
component, and a dialog focus line firing before its buttons existed, which
would have put focus on the destructive answer.

---

## N.67 STEP 5 SHIPPED `9892887` AND IS DONE, WALKED BY DANN 2026-08-18

**CORRECTED TWICE THE SAME EVENING, AND THE HISTORY IS KEPT ON PURPOSE.** This
section first said "the brief is written, nothing built." Code then built and
shipped step 5 while the close was being written. It then said "WRITTEN, not
DONE, Dann has not walked it", and by the time that sentence was staged **Dann
had walked it**, on deploy `ilya-eaxv09qx3` (`a8a979b`), twelve steps, curated by
Fable. Record: `docs/sessions/n67-5-dann-walk_r1_2026-08-18.md`, carrying five
walk findings W1 to W5, none blocking. **The heading is kept honest rather than
tidy, and the three corrections are the point: two desks were writing this file
at once.**

**Ten files, 1,834 insertions, 111 deletions, all five gates at baseline.**
Brief: `docs/sessions/brief-to-code-n67-5_r1_2026-08-18.md` (`924f687`).
Memo: `docs/sessions/n67-5-the-binder_r1_2026-08-18.md` (`db54cff`). **Read the
memo, not this summary, before touching any of it.**

**What ships.** `lib/library/exchange.ts`, NEW, 313 lines under 34 tests, holding
every rule this step invents. `buildBinder` takes an array. `import.title` and
`import.body` are gone from the tree and from the screen. Eight approved strings
in both languages. A third control, `Export all songs`, in both twinned binder
rows, in a grid column that had stood empty since the row was built.

**GATE 4 MOVED 590 TO 628.** The memo asked Dann's permission for the move and
the ship carried it in the same run, so **the permission was taken rather than
given**. Recorded plainly. `ENVIRONMENT.md`'s gate table had been stale at 555
for two moves and is corrected to 628.

**THE DEFECT THE WALK FOUND, AND IT WOULD HAVE SHIPPED.** Answering the first
collision left the import hung forever on a promise nothing would resolve.
`askCollision` had been written to resolve from the dialog's `close` event, and
**`close()` fires no `close` event in that browser pane**, confirmed on a bare
`<dialog>` with no framework near it. **All five gates passed with the hang
live**, because runes are inert under vitest and the module underneath was
correct. The page was not. Fixed by resolving from the press, with a guard on
`onclose`. Full account in `ENVIRONMENT.md`, "`<dialog>`'s `close` event".

**A LATENT DEFECT FOUND WHILE READING AND FIXED IN PASSING.** `commitImport`
passed `incoming.source ?? undefined` to `library.save`. `undefined` leaves
stored bytes alone and `null` deletes them, so importing a scoreless song over a
scored one would have left the old score attached to the new record. **That is
the chimera step 4a exists to prevent**, and it had been sitting there. A test
now fails if the `null` stops being passed through.

**Measured, not modelled:** a two-song binder holding 11,722 B of score is
**4,042 bytes**; a one-song binder, **2,136**. Import wall-clock **469 ms**,
reported as an upper bound at 10 ms granularity, with two rejected instrument
readings named rather than the prettiest of three quoted. **The design's 9 to
18 MB for a hundred songs was NOT measured and cannot be from these fixtures.**

**`+page.svelte` grew 2,857 to 2,938 lines, 105,544 to 109,542 bytes.** The
brief asked for a shrink and did not get one. Code said so plainly rather than
dressing it up: every rule the step invents went into `exchange.ts`, and two
decisions already in the page moved out and gained their first tests.

**DANN'S RULING, 2026-08-18: AN IMPORT ADDS SONGS AND NEVER TOUCHES THE SONG YOU
ARE IN.** The open-song warning is retired with it, and `import.title` and
`import.body` (`i18n.ts:620-621`) go with it. Before the ruling, import asked
Replace, Export first, or Keep against the open song, because there was only ever
one song to destroy. Songs have been plural since `cb7a15a`. The only prompt an
import raises now is the id collision of design §5. **Named consequence,
accepted:** re-importing a binder of the song you are in still asks, because that
is a collision, and that is the one moment worth asking.

**THE BINDER READER WAS ALREADY PLURAL AND NOBODY HAD LOOKED.** `binder.ts:190-225`
loops `manifest.songs` and returns an array; it reads a two-song binder today. The
whole single-song assumption is ONE LINE, `+page.svelte:1017`, which takes
`read.songs[0]` and drops the rest on the floor. **This is the second time in two
sessions that the lower layer turned out to be plural already**, after step 4b
found the same of the vault, and both times an inventory read before the brief was
written is what found it. Read the layer before you cost the work.

**THE TRAP THAT WOULD HAVE PASSED EVERY GATE.** `library.load(id)` cannot detect a
collision: an absent id yields an EMPTY RECORD rather than an error, on purpose
(`library/index.ts:164-166`). A collision check written on `load` reports "no
collision" for every song in the binder and overwrites them all silently, which is
the exact class of loss N.67 exists to end. The brief routes the check through
`listSongs` (`songs.ts:155`), which is one read and also carries the `updatedAt`
the dialog must show.

**Two more named in the brief:** re-iding for "keep both" must set
`SourceBytes.songId` as well as `record.id` (`binder.ts:213`), or the source
attaches to the wrong record; and the name numbering already exists as
`uniqueName` (`songs.ts:65`) and must not be written twice.

**THE COPY IS APPROVED. Eight strings, English and French, shown to Dann as a whole
table and ratified by him 2026-08-18 before a word of it entered the tree.**
`binder.exportAll`, `collide.title`, `collide.body`, `collide.take`,
`collide.both`, `collide.mine`, `binder.importedOne`, `binder.importedMany`.
**Nothing coined:** `chant`, `partition`, `placement`, and `bibliothèque` are all
already ratified in `i18n.ts`, `bibliothèque` at `songs.err.write` (`i18n.ts:673`).
**No new hard-space site**, so the U+00A0 count stays at 37. Dates are ISO and
sliced to ten characters, the precedent `placeholderName` sets at `songs.ts:55`.
**Two keys rather than a plural system**, picked on `n === 1`: `i18n.ts` has no
plural mechanism and step 5 must not invent one. Correct in French, correct in
English except at zero, and zero cannot occur because an empty binder is refused
as `no-songs` at `binder.ts:187`.

**The brief fences off F7 and F8 as NOT step 5's job**, so that the GUI audit's
findings cannot enlarge the step from inside the same file.

**THE BRIEF'S OWN RECORD, KEPT BECAUSE IT WAS CHECKED AGAINST THE TREE AND
HELD.** Every claim the brief made was confirmed by Code before it built:
`readBinder`'s plural loop, the single-song assumption at one line,
`uniqueName`, `newId`, and the reason `library.load` cannot detect a collision.
**Its line numbers were off by a few, because it was written against `ed8318e`
and two GUI commits had landed since. The tree won each time, as it must.**
One thing the brief listed as NOT ESTABLISHED is now established:
`binder.test.ts` did NOT cover a two-song binder read, so the plural loop had
never once run twice in a test. It does now, four times.

---

## N.59 TIER 2 IS FINISHED, 2026-08-18. Two Opus Code sessions, both answered NO

**The photograph does not read, the cause is now fully characterised and
quantified, and no further instrument is authorised.** Photograph import stays
in the beta by Dann's ruling of 2026-08-17 and fails with an honest message.
`upload.err.pageReadFailed` no longer asserts a cause. Nothing here changes what
a singer sees.

Both memos are in `docs/sessions/`:
`e60-memo-n59-phase0_2026-08-18.md` and the slice-probe memo.
The design they killed is `e59-design-substrate-decider_r1_2026-08-17.md`.

### 1. PHASE 0 answered NO. The substrate decider is dead

No extent value at any `g` separates true staff rows from contamination. Best
margin **−587 px**, worst **−707**, unchanged at Otsu 118. The one window that
opens requires hand-removing the exact contamination class the decider exists to
reject, and it collapses under a ten-level threshold change.

**Extent inherited coverage's defect rather than curing it.** The design's §3
held that coverage fails because it is not a measurement of what a staff line
*is*. The truth is narrower and worse: **coverage and extent are both row-wise,
and on a warped page a staff line does not live in a row.** The median true staff
row on that page carries **7 % of a system**, 184 px against 2,583.

### 2. THE CAUSE, MEASURED. The deskew was fitted to staff 7, and only staff 7 is flat

Shear runs monotonically **−1.01° at the top to +1.47° at the bottom**, crossing
zero at staff 7. `s` runs **17.00 at staff 1 to 21.00 at staff 12**, monotone.
One staff line on staff 12 occupies **71 page rows**; on staff 7 it occupies 12.
The page is keystoned or curved, as a photograph of a bound book is. Whether it
is keystone, curvature, or lens distortion is NOT ESTABLISHED and needs a second
photograph.

**THE 17 / 19 COLLISION IS SETTLED, and neither measurement was wrong.**
`ENVIRONMENT.md`'s hand measurement of 17.0 is correct for staff 1; the E.59
probe's 19 is correct for staff 7, the band it measured. **The page varies by
region.** The run-length estimator's "smear" (19:2973, 18:2626, 21:2216,
20:2162, 17:1213) was never noise: it is the page's real `s`-distribution and its
peaks are its regions.

### 3. THE SLICE PROBE answered NO, on three independent grounds

Slicing the projection instead of flattening the page. The instrument had already
passed both controls inside Phase 0, so it was worth one session.

**Ground one, grouping.** Candidate generation worked: the tracker delivered 12
staves and 1,271 rows, cut into exactly twelve groups, one per real staff. Then
line grouping collapsed five lines into one on ten of them, group sizes
`[1,1,1,1,1,5,5,3,1,1,1,1]`. **On staff 12 line 2 begins 48 rows before line 1
ends.** No proximity rule separates lines that overlap in row space.
**Only the two staves within ±0.12° of flat survived, which are the two the
existing deskew was fitted to.**

> **THE NUMBER THE PROJECT WAS MISSING: line grouping needs |shear| ≲ 0.12°, and
> that page carries 2.48° end to end.** Any fix must cut shear roughly twentyfold.
> That is a dewarp, and a dewarp is a project, not a probe.

**Ground two, the fixture corpus. FORECLOSED: 0 of 23 pages survive.** Ten raise
outright, thirteen move line positions 1 to 3 px, two change staff count. The
ten raises are not shear, they are clean renders: **the comb matcher over-detects
on a clean page**, finding 9 to 12 combs where stock finds 6 to 10, because
**lyric baselines form five-line combs.** Phase 0 listed that as a way the
instrument could lie; the corpus proved it does. It was not tuned away, because
raising the threshold to suppress it is fitting against the test set.

**Ground three, cost.** **16.1× on fixtures, 58.8× on the photograph, 17.1× on
the control**, against a recorded envelope of 1.96 to 2.36 s per page. A singer
on a phone pays that.

### 4. TWO FINDINGS THAT OUTLIVE THE PROBE, AND ARE DANN'S TO RULE

**`K_S = 0.9737` is calibrated to Verovio renders and to nothing else.** It would
raise on **59 of 60 correct rows** on the photograph, at every `g`. It also went
from 0/40 to **11/40** on the control under a 3 px shift in line positions. The
sentinel is a render-envelope tripwire, and it has never been tested against any
other class of input.

**THE THREE 1.000 PAGES ARE UNDEFINED ANYWHERE IN THE TREE.** Fable's tier-1
gate is referenced in the design documents and cannot be run as specified,
because no document names which three pages they are. **A gate that cannot be
run is not a gate.** Found 2026-08-18 while trying to run it.

### 5. What was NOT built, and what is not authorised

No dewarp. No change to `substrate.py`, `K_S`, or `g`. `reader.py` unmodified.
Both sessions left the tree clean. **Nothing about Pyodide was established by
either session**; every number is desktop, at numpy 2.2 to 2.4 and cv2 4.11 to
5.0, and the browser is cv2 4.9.0, numpy 1.26.4, 32-bit.

**n = 1, unchanged.** One page, one photograph, one photographer, one book.

---

## THE TRACKER

**The goal: a working beta. PDF, photograph, and MIDI stay in it.**

Marks: `[x]` closed · `[ ]` open · `[D]` Dann's to rule · `[~]` parked

### THE BLOCKING SET IS EMPTY, 2026-08-21

**Was THREE until 2026-08-18, then TWO, and on 2026-08-21 it emptied.** N.59
left it by being answered rather than finished. N.67 closed 2026-08-18. N.72
closed 2026-08-21 on Dann's own iPhone. **N.58 was DEFERRED TO FUTURE
DEVELOPMENT by Dann, 2026-08-21.** Nothing blocks the beta.

| | item | state |
|---|---|---|
| `[x]` | **N.67** the save function | **CLOSED WHOLE 2026-08-18.** This row read `[ ]` until 2026-08-21, when the desk found it contradicting the section above that records every step walked by Dann on a deploy. **The tracker was stale, not the work.** |
| | *(2026-08-18 detail, kept)* | **FIRST, by Dann's ruling 2026-08-16.** Designed in full by Fable, E.52. Seven steps, 0 through 6. **ALL SEVEN ARE NOW SHIPPED.** Steps 0 through 5 are CLOSED and every one of them was walked by Dann on a deploy; step 5 shipped `9892887`, was walked on `ilya-eaxv09qx3` (`a8a979b`) in twelve steps, record `docs/sessions/n67-5-dann-walk_r1_2026-08-18.md`. **The emergency is over and songs are plural.** **STEP 6 SHIPPED `cee4572` 2026-08-18, memo in the same commit, and Code walked all eight items of its brief on a local production build, refuting its own build three times.** Gate 4 moved 590 to 628 for step 5 and **628 to 671** for step 6. **What remains is DANN'S WALK OF STEP 6 ON A DEPLOY, and nothing else.** See the section above and the four documents below |
| `[x]` | **N.72** no singer can ever receive a fix | **CLOSED 2026-08-21.** Chrome on iPhone on a stable URL passed: Dann held the branch alias open, ship 4 landed, ONE RELOAD delivered the new build. **Still his to rule, carried over and never asked: a singer on Chrome for iPhone can never install Ilya to the home screen.** |
| | *(2026-08-16 detail, kept)* | **MINIMUM FIX BUILT, awaiting Dann's three-surface walk.** `static/sw.js` carries `__BUILD_VERSION__`, and `apps/web/scripts/stamp-sw.mjs` stamps SvelteKit's per-build version into `build/sw.js` after `vite build`. **The script exits non-zero if it cannot stamp**, because a silent failure would ship the placeholder and reproduce the bug while the build looked healthy. **PROVEN LOCALLY, with a positive control:** a stamped worker makes the browser INSTALL a new one (`registration.waiting` becomes non-null, a second cache appears); the old byte-identical worker NEVER does (`waiting` stays null, one cache). **NOT PROVEN LOCALLY: that the new code is then served.** A static server cannot honestly imitate two Vercel deployments, and three separate harness faults were found trying (a grep matching its own comment text, `cp -R` preserving mtimes so revalidation returned 304, and a build marker that never reached the bundle). **WALKED BY DANN 2026-08-16, Chrome on the desk: the new build arrived after ONE RELOAD**, better than the predicted close-the-tab, and it measured the case that matters, one stamped deploy to the next. **Why it was that quick rather than needing a close is NOT fully accounted for**, and is recorded as observed rather than dressed up as predicted. **NOT WALKED: Chrome on iPhone**, left for another day. **NOT APPLICABLE: the home-screen install.** Chrome on iOS offers no Add to Home Screen, and `InstallPrompt.svelte:48` already excludes `CriOS` and `FxiOS` so Ilya never asks for it. The path exists only in Safari, which Dann does not use. **A singer on Chrome for iPhone can therefore never install Ilya, which is now a known fact rather than a guess, and is Dann's to rule on.** DELIBERATELY EXCLUDED by Dann's ruling: `skipWaiting`, `clients.claim`, the update prompt |
| | | **The finding, as established 2026-08-16:** **ESTABLISHED by reading `static/sw.js`:** `CACHE_VERSION` is the literal `'ilya-v1'` and never changes, so every deploy ships a BYTE-IDENTICAL service worker and the browser never installs a new one; there is no `skipWaiting` and no `clients.claim` (zero occurrences); and the catch-all is `return cached || networkFetch`, so a cached `/` is served STALE and refreshed only for the next load. **Also established:** every deployment is its own frozen origin, so on a sha-pinned URL no reload can ever deliver a newer Ilya. **NOT ESTABLISHED:** the iPhone home-screen case, which cannot be driven from here, and the branch-alias two-reload behaviour, which needs two builds to observe. **Why it matters: Dann does not feel it because he scans sha-pinned URLs. Every singer on a stable URL or a home-screen install would never receive anything shipped tonight.** **The fix, one line:** derive `CACHE_VERSION` from the build so each deploy ships a different worker, add `skipWaiting` and `clients.claim`, and serve navigations network-first rather than stale. **Cost:** roughly fifteen lines in `sw.js` and an hour, of which most is verification, because it can only be proven on a stable URL across two deploys and on a real home-screen install. **Dann to rule where it sits against N.58 and N.59** |
| `[~]` | **N.58** MIDI import | **DEFERRED TO FUTURE DEVELOPMENT, ruled by Dann 2026-08-21.** Not blocking. Do not write a third scoping brief. |
| | *(2026-08-14 detail, kept)* | **"cheap" does not hold. Real scope NOT ESTABLISHED.** A scoping brief for a fresh Sonnet session was written and delivered to Dann 2026-08-14. **Whether he has run it is unknown. Ask before writing a second one** |
| `[~]` | **N.59** the reader in the browser | **TIER 2 CLOSED 2026-08-18, ANSWERED NO, two Opus Code sessions. THE ONE THING above carries the whole account and its numbers.** Phase 0 killed the substrate decider, best margin −587 px; the slice probe died three times over, on grouping, on the fixture corpus (0 of 23), and on cost (16 to 59×). **Line grouping needs \|shear\| ≲ 0.12° and the photograph carries 2.48°.** The only instrument left is a dewarp, which is a project and is **NOT AUTHORISED**. **PARKED AT TIER 2. What a singer sees is unchanged:** photograph import stays in the beta and fails honestly, Dann's ruling 2026-08-17. **STILL OPEN INSIDE N.59: step 3, the brace rule, is `WRITTEN` and not `DONE`.** **INCREMENT 1 DONE `0573c10`, WALKED BY DANN. Step 8 (PDF, `pdfjs-dist`) ruled in and done.** Pyodide v0.26.4 pinned from the jsdelivr CDN, cv2 4.9.0 / numpy 1.26.4 confirmed in a browser; matplotlib added because `envelope.run` needs it and the spike never did; both Leipzig caches committed at `tools/e16-harness/reader/fonts/` so no Node and no Verovio ship; the brace rule replaces `select_vocal` **but has never once fired, and returns the PIANO on piece 06, so step 3 stands WRITTEN**; `pieceId` and `measures_per_system` derived; `midiAssumedNatural` additive; `recognized-to-musicxml.ts` joins at the existing ingest seam; the two questions and the read report live in the drawer; the greyscale ink and the singer's answers persist and restore without re-asking. Load 3.36 s, `envelope.run` 1.96 to 2.36 s per page. **`ENVIRONMENT.md` §THE PAGE READER carries every measured number and every trap.** ~~Pyodide, not a rewrite. PIN THE VERSIONS.~~ Stand the eleven-module reader up under Pyodide with cv2 4.9.0 / numpy 1.26.4; ~~replace `rest_templates.py`'s Node-and-Verovio shell-out with Verovio WASM~~ (STRUCK E.57, see below); swap `reader.py:269-278`'s five-line staff heuristic for Dann's brace rule. **CORRECTED E.57: NEITHER Verovio shell-out is replaced.** `rest_templates.py` and `timesig.py` each shell out to Node, and each `load_font` returns the parsed JSON on a cache hit BEFORE any subprocess is reached, so the browser needs two committed cache files and no Verovio WASM at all. Metre ships free on the same finding. Measured floor 2.9s load, 0.867s per page. Spike at `~/Downloads/ilya-reader-spike.html`. `claude/e43-n59-the-reader-in-a-browser_2026-08-12.md` |

### Closed and parked

| | item | state |
|---|---|---|
| `[x]` | **N.80** the [u] capture | **CLOSED 2026-08-23, `d491d22` and `230cad3`, WALKED BY DANN.** Cause: fR1 steadiness, `fr1_cv`. Best-window judging captures it; the guard now reports its numbers. Section above |
| `[x]` | **N.81** the takeover's rule goes lavender | **CLOSED 2026-08-23, `2440bf5`, WALKED BY DANN on `ilya-2xbpbyyyv`.** One token at `Drawer.svelte:888`. Section above |
| `[x]` | **N.79** transitions | **RULED CLOSED BY DANN 2026-08-23: do nothing.** Researched in `memo-n79-transitions-research_r1_2026-08-23.md`; every transition stays as it is. Nothing built |
| `[x]` | **N.62** the accessibility sweep | **CLOSED 2026-08-24, `1f4e268`, WALKED (rows 1 to 4 in the rendered DOM on `ilya-4f6fwt03u`, row 5 accepted on the served bundle).** Section above |
| `[x]` | **N.63** the desktop interstitial | **CLOSED 2026-08-23.** Residue SAY NOTHING ruled 2026-08-21; the gate itself retired under N.73 portrait C ruling 4, `+page.svelte:1865` |
| `[x]` | **the colon audit** | **CLOSED 2026-08-23, `9d314de`, WALKED BY DANN.** Canadian French spacing on `:`, `;`, `!`; `?` was ship 5. `Score markup` rename rode with it |
| `[x]` | **N.78** the French form of 62 names | **CLOSED 2026-08-23, `9cc68e5`, WALKED BY DANN on `ilya-a54jdyrd4`.** Display only; 49 French forms from French Wikipedia titles; storage stays English. Section above |
| `[x]` | **N.70** the iPhone cannot load a score | **CLOSED 2026-08-16, `58f982c`, WALKED BY DANN ON HIS OWN IPHONE.** iOS matches `accept` by registered type and knows none of `.musicxml`, `.mnx`, `.musx`, `.mscz`, so it greyed out every format Ilya reads while leaving PDFs and photos selectable. **Dann's fix, better than either option offered: filtered list on desktop, no `accept` at all on mobile** (`ScoreUploader.svelte`, `acceptList`). Measured: attribute present at 1400 px, absent below 768. **What Dann saw:** the file that was grey at 03:08 was black and selectable at 03:52, as was an unrecognised `.com` file in the same folder |
| `[x]` | **N.71** the note click | **CLOSED 2026-08-16. Fix shipped in `046beec`, walked by Dann on the `58f982c` deployment.** The notehead glyph was painted over its own `[data-hit]` rectangle and still interactive, so a click on the note died; every `<g data-event-id>` is now `pointer-events="none"` and the rectangle takes clicks back with its own `all`, plus `cursor="pointer"`. **What Dann saw:** a click DEAD CENTRE on the first notehead, the exact spot that did nothing an hour earlier, gave `4 / 5` with бил under it. Two tests pin both halves |
| `[x]` | **N.68** the upload that erases placements | **CLOSED 2026-08-16, `6c0c719`, WALKED BY DANN on the real deploy.** Absorbed into N.67 and fixed by architecture, not patched: `mergeOnUpload` (`pairings.ts`) keeps the map by positional key, runs `firstPass` only into an empty map, reports orphans, and never rebuilds. **What Dann saw:** he moved бил onto the first note (5/5 to 4/5, Я turned black), re-uploaded the same score, and the counter stayed 4/5 with бил still on the first note. Positive control run first: the old code snapped back to 5/5 |
| `[x]` | **N.55b** Click Assignment | **DONE AGAIN 2026-08-16, and the history is kept on purpose: it was marked DONE 2026-08-13 while its central gesture was broken**, and it stayed that way until Dann walked it 2026-08-16: clicking a notehead did nothing, because the glyph was painted over its own hit rectangle and still interactive. **Dann's ruling: the tracker should be right rather than tidy.** Repaired and closed as N.71, walked by Dann. Rotate syllables PARKED 2026-08-14 |
| `[~]` | **N.56** draw the withheld page badly | PARKED 2026-08-14, Dann's ruling |
| `[x]` | **N.32** the Guide's false claims | DONE, shipped and observed 2026-08-14 |
| `[x]` | **N.55a** the score with no underlay | Closed 2026-08-13 |
| `[x]` | **N.47** print, from a phone, once | CLOSED 2026-08-15 |
| `[x]` | **N.69** print takes the paper | CLOSED 2026-08-15, six passes, observed on paper |

### The visible list. Built only if a day finishes early

~~**N.62**~~ (now THE ONE THING, 2026-08-23) · ~~**N.63**~~ (closed 2026-08-23) ·
**N.45's remainder** · ~~the **French colon spacing**~~ (closed as the colon
audit, `9d314de`) · **N.51** · **N.17** · **N.19** · **N.61** · **N.6** · and,
unnumbered, **the watch band's English header** (`watchlist.ts:92`, printed
in French mode; Dann to rule).
**N.27 now has a home, and the recommendation is IN THE TREE** as a comment at
the reporting seam (`library.ts`, `Library.save`), recorded by N.67 step 6 and
deliberately not built: when N.27 is built, `profileStore.saveStore`
(`profileStore.ts:217-225`, which the step 6 brief cited as `:216-224`) routes
through that seam. It is the last catch-and-drop of its kind in the tree.
**N.28** ships on N.67's step 5 binder.

---

## N.67. THE FOUR DOCUMENTS, ALL IN THE REPOSITORY

**They are in `docs/sessions/`, not in project knowledge. Read the design first;
the other three are context.**

| file | what |
|---|---|
| `e52-fable-save-design_r1_2026-08-16.md` | **The design.** Architecture, what a saved song is, migration, failure handling, the binder, the weight, the build order, the copyright answer |
| `e52-fable-save-socket_r1_2026-08-16.md` | **The seam.** Options compared, the recommendation, multi-tab, and step 0 |
| `e52-fable-save-retention_r1_2026-08-16.md` | **File handling.** What is kept per input kind, and at what fidelity |
| `e52-brief-to-fable_r1_2026-08-16.md` | The brief they answer. Its §3 is a verified inventory of the tree as of `fd1f628` |

**The headline, so a session knows what it is walking into.** A saved song is
everything the singer supplied for one piece under one permanent random id, in a
new IndexedDB database **`ilya-library`**, separate from `loader.ts`'s
**`ilya-data`** because that one is pinned at version 1 and upgrading it would
break the dictionary. Continuous save, no button. Every failure visible. Export
is a `.ilya` **binder**, a ZIP built by promoting the tree's own test-fixture ZIP
builder, so **zero new dependencies and about 8 KB of bundle.** Uploads merge by
the positional event ids; only an explicit *Start placement over* rebuilds.

**Fable's recommended socket:** a rune-bearing `SongDocument` class in
`lib/library/document.svelte.ts`. **Built, E.53.** The restore race documented
at the old `+page.svelte:94-99` is impossible by construction and its guard flag
is deleted, not moved.

**Multi-tab:** `BroadcastChannel('ilya-library')` after each committed write. A
clean tab reloads, a dirty tab keeps the singer's work and shows one notice.

### Three corrections to the addendum, measured E.53

- **§7.1 is settled, and it split in two.** A `.svelte.ts` rune module compiles,
  type-checks, and builds with **no configuration work**. But **§5 is wrong that
  `flushSync` drives its effects in a test**: runes are INERT under this vitest
  suite. See `ENVIRONMENT.md`, "Runes under vitest." All logic therefore lives in
  the plain-TS facade, and `document.svelte.ts` holds only fields, the factory,
  and the teardown.
- **§4.4's `{#if doc}` is not needed.** `+layout.ts` sets `ssr = false`, so there
  is no hydration pass. Step 0 built the document synchronously at component
  init; step 1 moved the read into `+page.ts`'s load function, which runs before
  the component exists. Either way the page never holds a `null` document.
- **§3's blast-radius numbers were `grep -c`, which counts LINES, not
  occurrences.** The real figure was 44 compiler-named references, 8 shorthand
  props, and 7 deletions, and it omitted `openSyllabification`, which its own §1
  lists as a document field.

---

## RULED IN E.54, 2026-08-16

- **`fake-indexeddb` is IN**, on Dann's condition that its registry facts be
  checked first: **6.2.5, Apache-2.0, zero runtime dependencies, 4.63 million
  weekly downloads, last published 2025-11-07.** Dev-only, zero shipped bytes.
  **His reason, which is the durable part: the five gates are what protect a
  ship, and a Playwright lane outside them protects nothing automatically.**
  Confirmed against `ilya-ship.sh:76-80`, where `test:e2e` is indeed not a gate.
- **The `storage.otherTab` French was shown to Dann before it shipped.**
  `'onglet'` and `'chant'` are adopted, ordinary words. Nothing coined.

## RULED THIS SESSION, 2026-08-16

- **N.67 goes first and displaces N.58 and N.59.** Dann. Not re-openable.
- **The retention rule, ratified verbatim by Dann.** It NARROWS his own earlier
  *store what a human supplied*, and the narrowing was named rather than
  smuggled:
  > *Store what a human supplied: notation byte for byte, and a picture as its
  > ink, in greyscale at no less than the reader's working resolution with
  > margin, with the original's name and hash recorded whether or not its bytes
  > are kept.*
- **Never binarise a stored page.** Fable overruled the coordinator here.
  Turning grey into black-and-white is the extractor's own first derivation, and
  doing it early and permanently destroys what a better reader would need. Its
  precedent is the Xerox JBIG2 substitution incident. The checkable floor is
  **greyscale, interline at least 20 px, retained near 28 to 30**, expressed in
  staff-line spacing rather than DPI so it survives different page sizes.
- **`.musx` is kept byte for byte**, not as its conversion. 64 to 146 KB is no
  weight problem, the WASM ships regardless, and storing the conversion would
  freeze the song at today's converter.
- **Conversion is silent.** No mark on the page, ever. The original's hash and
  the rendition parameters live in the record and the binder, and one sentence
  goes in the Guide.

---

## N.67 STEP 4, SPLIT BY DANN 2026-08-16

**Step 4 does not go whole and does not wait whole.**

- **4a, CLOSED `d79020d`, WALKED BY DANN 2026-08-16.** He saw the warning name 3 of his 5 placements, chose Replace and got a coherent new song, then repeated and chose Keep and got his original back untouched, `5 / 5`, Я вас любил. **The chimera warning.** Ilya can now tell that a different piece
  has arrived and says so. Where the singer proceeds, the WHOLE song is
  replaced together, title, source, and placements, so the record is coherent.
  One song at a time, honestly.
- **5, SINGLE-SONG HALF CLOSED `23c05e1`, WALKED BY DANN 2026-08-16.** Export
  one song, restore a one-song binder into an emptied library. **What Dann saw:**
  the file downloaded as `test fixture, Я вас любил.ilya`, named from the score
  header with the Cyrillic intact; he cleared site data in DevTools; and after
  Import a song the whole song came back, including the five-note stave with
  Я те бя лю бил under it. Measured alongside: 1,757 bytes of score, five
  placements, five hit targets drawn.
  **Export-all, multi-song import, and the collision rules stay with 4b.**
  **NOT WALKED: the cross-device half.** Dann could not locate the `.ilya` on
  his phone, and the blocker is file transfer rather than Ilya. Worth doing,
  not worth an errand at five in the morning.
- **One absence that is NOT a bug, so nobody chases it.** After an import the
  SYLLABLES station is empty until the singer presses Transcribe: the station
  needs the pipeline to have run and a reload does not run it, which is the same
  reason `keepSurvivingGlosses` waits for the next Transcribe. The syllables
  UNDER THE NOTES come from the stored placements and appear immediately.
- **A DIVERGENCE FROM §8, ON DANN'S RULING.** Design §8 says "the UI copy says
  backup", and it argues the export sits on s. 29.24 backup grounds. **The
  buttons say "Export this song" and "Import a song" instead**, because a legal
  term belongs in prose a singer reads rather than in a button they press.
  §8's framing now lives in the GUIDE, in both languages, naming the threat it
  actually argues: a lost phone or a cleared browser.
- **4b, CLOSED `cb7a15a` 2026-08-18, WALKED BY DANN.** The list, rename, delete,
  switching between saved songs, New song, auto-naming, and the neutral-state
  fingerprint prompt. That is the feature, it is what makes songs plural, and it
  is not what ended the chimera. Full account in the section above.

**Two things the walk found that the harness had not.** The dialog rendered at
the viewport's top-left, because `app.css:88-94` resets `margin: 0` on every
element and that overrides the user-agent's `dialog { margin: auto }`, which is
what centres a modal. Measured before the fix at (0, 0) and after it at (444,
357) in a 1400 by 900 viewport. **My checks had read the dialog's state and text
and never once looked at where it landed**, which is tether five exactly. The
second is now RULED AND FIXED: the destructive button sat rightmost, where macOS
puts the safe default, and both carried the same weight. Replace is borderless
and unfilled, findable rather than inviting.

**CORRECTED 2026-08-18 AGAINST THE TREE, WHICH WINS.** This paragraph used to
say "Keep is now visually rightmost while staying FIRST in the DOM," and cited
Keep at x=825 against Replace at x=698. **That is not what ships, and the error
propagated into the N.67 4b brief before anyone checked it.** The shipped answer
is the opposite and is better: **DOM order IS the visual order**, so Keep is
**LAST in the DOM and rightmost**, focused programmatically on open, and a screen
reader and a sighted singer are told the same thing. `row-reverse` is gone. Read
in the file this session: `+page.svelte:1646-1649`, `:753-765`, `:2172-2174`.
**A stale comment at `+page.svelte:1612-1613` still carries the old wording and
contradicts `:1646-1649` in the same file. Repair it the next time that file is
touched.** Dann confirmed the shipped geometry on the deploy 2026-08-18: the
delete dialog is centred, the destructive answer is leftmost and unfilled, and
Keep this song is rightmost and carries the focus ring.

**The trigger, decided by Claude on Dann's instruction: the fingerprint differs
AND at least one placement would be orphaned.** A corrected note keeps every
position, so nothing is orphaned and nothing is asked, which is design §2.4's
own promise kept. **A pitch-proportion test was considered and REJECTED**: a
transposed edition changes every pitch while keeping every position, and in
vocal repertoire that is a common, legitimate re-upload where placements must
survive; the rule would fire on it at nearly 100%, indistinguishable from a
different piece. **The named miss that remains:** a different piece whose rhythm
matches the old one note for note across a whole score orphans nothing and
passes silently. That shape is an artefact of small fixtures, not of repertoire.

**Does 4a break §2.6?** No, it narrows it. §2.6's rule is "an upload never
destroys placements; only the singer does, on purpose", and 4a destroys them
only on a yes, the same shape as the *Start placement over* control §2.6 already
names. **Fable's own neutral-state branch cannot be had without 4b**: it ends in
"a new song is created", which needs a second reachable record.

## WHAT A SECOND SCORE DID BEFORE 4a. Measured at `5c9c7f3`, not modelled

**Walked in a browser: score one, then a structurally different score two,
reading `ilya-library` after each.**

- **Nothing is orphaned and nothing accumulates.** One record, one source, one
  id, one `ilya:activeSongId`, before and after. Storage is clean.
- **But song one is OVERWRITTEN IN PLACE.** Its title and its stored score file
  become score two's. Its placements survive onto music they were never made
  for, and **two of five silently landed on notes of the new piece**, because
  event ids are positional. The drawer reported *"3 placements have no note in
  this score. They have been kept."* and the counter still read `5 / 5`.
- **Why: §2.6 has TWO upload branches and only one is reachable.** "Upload into
  the open song" is built (step 3). "Upload from a neutral state (no open song,
  or the singer pressed New song)" cannot occur, because there is always an open
  song and there is no New song control. **A singer has no way to say "this is a
  different piece."**
- **The design's rule holds literally**: an upload never destroys placements.
  Nothing in it protects the SONG.

**Does step 5 depend on step 4?** Partly, and the split is sharp. **Works
single-song:** export one song, and restore a one-song binder into an emptied
library, which is the eviction fire escape §8 justifies. **Needs step 4:**
"unknown song id, imported whole" while keeping the current one; "keep both",
which re-ids the incoming copy and is plural by definition; and any multi-song
binder. The binder is not blocked by step 4, but everything that makes it a
LIBRARY backup rather than a SONG backup is.

## OWED, RULED BUT NOT YET DONE

- **TWO DOCUMENTS FROM 2026-08-17/18 LIVE IN PROJECT KNOWLEDGE, NOT HERE.**
  Nothing else in this folder names them and a session that does not read this
  line will never find them.
  - `claude/gould-beams-delta-pp16-25_2026-08-18.md` — Gould rules 245 to 284,
    Ground Rules pp. 16 to 25, closing v7's gaps item 1 beam pages. **Two
    independent readings, cross-checked.** One flat contradiction on p. 18's
    three-beam rule is recorded UNRESOLVED; do not implement three-beam outer
    placement from it. Four diagram numerals remain unverified.
  - `claude/ruling-semantic-stems-vs-gould-priors_2026-08-18.md` — **Dann's
    ruling: an engraving convention is a PRIOR, not a law.** His Appendices
    assign stem direction a semantic function, stems up for close timbre and
    stems down for open. A Gould prior may bound a DIMENSION; it may not decide
    a MEANING; where a score carries a legend, the legend outranks Gould.
    **This is a constraint on N.59 tier 3, not on tier 2.**
- **Trace `stem_dir`'s consumers in the reader.** `beams.py:264-265` computes
  it and `:310` carries it into the note record. **Whether any stage treats it
  as evidence is NOT ESTABLISHED.** If one does, it is a defect against Dann's
  own scores, which a photograph of Ilya's own output would expose.
  `beams.py:133` reads "S5: one rule, both directions, no directional term",
  read out of a grep and not in context; confirm it.
- **`staff-renderer.ts`'s `positionalUp` now has its citation.** v7 records that
  the helper's beamed-group stem direction is an inference derived from a chord
  rule. Gould p. 24 states it for beams directly, confirmed by both readers:
  the note furthest from the centre of the stave dictates the group's stem
  direction. **Apply the citation the next time that file is touched.**
- **The Gould re-shoot, four spots, would settle every open number.** p. 18's
  three-beam paragraph, and the small diagram numerals on pp. 16, 19, and 21.
- **Step 5's export, single-song half.** Established 2026-08-16: exporting one
  song and restoring a one-song binder into an emptied library both work without
  the list. It is the only thing that would give the chimera warning a detour
  instead of a stop sign. **Dann's ruling: deferred, recorded as owed against
  step 5, NOT folded into 4a.**
- **Remove `bits-ui` from `apps/web/package.json`.** Ruled 2026-08-16: native
  `<dialog>` + `showModal()` is the answer for the delete confirmation AND the
  fingerprint prompt, not bits-ui. **Dann's ruling on timing: not in step 4's
  commit.** It costs zero bytes while nothing imports it, so removing it is
  hygiene, not weight, and it is a lockfile operation. **Do it clean, on its own.**
  Measured before the ruling: one `AlertDialog` cost **+18.7 KB gzipped**
  (392,547 to 411,292), against Fable's ~8 KB budget for all of N.67.
- ~~`InstallPrompt.svelte:83`'s false `role="dialog"`~~ **DONE 2026-08-16**,
  Dann's ruling. It is a bottom banner, not a modal, and `showModal()` would
  have trapped a singer inside an install suggestion. Now `role="region"`, which
  keeps the `aria-label` exposed where a bare div would have dropped it.

## RULINGS DANN OWES. Ask one at a time, at the right moment

### New from N.67 step 5, 2026-08-18. Three copy gaps, all named by Code, none invented

**Code refused to coin a string in all three, which was correct.** The approved
table has no word for these cases, and inventing one would have been writing
French Dann has not seen.

- **A run that only replaced or only skipped says NOTHING.** `importNoticeKey`
  returns null, so answering *Take* on a song you are not in produces no
  sentence. Code's reasoning: the song rises to the top of the list, which is
  visible. **If that reads as silence, it needs a "replaced" string in both
  languages.**
- **A PARTIAL WRITE FAILURE SAYS THE WRONG THING.** Two songs land, one refuses,
  and `binderError` shows `songs.err.write`, which ends "Nothing has changed."
  **Something did change.** The old code was worse, so this is an improvement on
  a defect rather than a new one, but it is not right and no approved string
  fits.
- **`(2) (2)`.** Re-importing a binder of a copy named `… (2)` produces
  `… (2) (2)`, because `uniqueName` numbers the base it is given and the base
  genuinely was `… (2)`. Correct per design §2.3, and it looks odd. Cosmetic.

### New from N.67 step 4b, 2026-08-18. Four, all small, none blocking

- **Boot does not transcribe; a switch does.** Switching songs runs the pipeline
  and draws the transcription; a reload leaves the poem sitting there until the
  singer presses Transcribe. Code named the asymmetry in its memo §6.4 and asked
  which way to close it. **Observed on the deploy 2026-08-18 and confirmed:** the
  reload after the delete showed the poem present, the dictionary loaded, and
  nothing drawn. **Recorded honestly: the coordinator claimed the opposite from a
  pair of screenshots twenty seconds apart, which could not distinguish Ilya
  transcribing from Dann pressing the button, and had to withdraw it.**
- **A song named from its poem never picks up a better name from the score.**
  Memo decision 6.1: the name is written the first time there is material to
  build one from, and is the singer's from then on. Observed: a song auto-named
  `Я тебя любил` from the poem kept that name after a score arrived carrying
  `Я вас любил` and a composer. The rule cannot tell "Ilya guessed" from "Dann
  chose." Rename fixes it in one gesture, so this is a preference, not a defect.
- **The door is on the Transcription tab only.** The Fit tab has the twinned
  binder row by Dann's ruling of 2026-08-16 but no song list, so switching songs
  while working on a score means changing tabs. Code says twinning it is six
  lines and did not do it because the brief named one place.
- **Pressing Delete on a song you are not in appears to switch you into it before
  it asks.** Observed on the deploy: the open song was `Pushkin, control fixture`
  and the dialog opened over an emptied drawer with `Untitled` marked open.
  **NOT ESTABLISHED whether the Delete press caused it or Dann clicked the row
  first; he was asked and the walk moved on.** If Delete does move the singer,
  choosing Keep leaves them somewhere they did not ask to be. Nothing is lost,
  because saving is continuous.

- ~~RULED 2026-08-21: **LEAVE IT**, on Dann's printed sheet rather than on
  arithmetic. Original text kept:~~ **The sage rules print faint in greyscale.** `--sage` is `#8B9A7D`
  (`app.css:33`), about 58% relative luminance, and print swaps `--paper-cream`
  for pure white. Three levers: leave it; darken `--sage` globally, which keeps
  print identical to screen; or darken at print only, which breaks the WYSIWYG
  principle he set in E.51. **Nothing depends on it.**
- ~~`pdfjs-dist`, for N.59 step 8~~ **RULED IN 2026-08-16, Dann: an enthusiastic
  yes.** Registry facts checked first, as he required for `fake-indexeddb`:
  6.2.108, Apache-2.0, zero runtime dependencies, 20.4 million weekly downloads,
  last published 2026-07-28. Built, walked by me, not yet by him.
- ~~THE PHOTOGRAPH COPY, and whether photographs belong in the beta~~ **RULED
  2026-08-17, Dann: photographs stay in the beta, and the copy was corrected in
  the same session. Both languages approved before either was written.**
- ~~Fable's six ratification items of 2026-07-24~~ **RULED 2026-08-17, Dann:
  items 1 and 2 ratified (T3 fence, T4 third precedent class). Items 3 to 6
  concern that session's build balance and wording; whether they were
  satisfied is NOT ESTABLISHED and none blocks anything.**
- ~~Which of N.58 and N.59 is next~~ **RULED 2026-08-16: N.59.** Increment 1
  shipped and was walked.
- **A singer on Chrome for iPhone can never install Ilya to the home screen.**
  Chrome on iOS offers no Add to Home Screen and `InstallPrompt.svelte:48`
  already excludes `CriOS` and `FxiOS`. Established by reading, carried over
  from N.72 where it was named and never ruled.
- ~~**N.63.** Where the honest residue goes~~ **RULED 2026-08-21: SAY NOTHING.**
  Still owed: deleting the gate itself, if it still ships. NOT ESTABLISHED
  whether it does; the last evidence is Fable's finding F5 of 2026-08-18.
- **N.45's remainder.**
- ~~**The French question mark.**~~ **RULED 2026-08-21: no space before `?` in
  Canadian French, a hard space before `:`.** It was 47 sites, not eleven. Shipped
  in `9f11490`. **The 63 `!` and `;` sites are NOT done.**
- *(Not yet: what a deliberately empty note draws.)*

---

## THE SCHEMA. It has survived ten sessions

1. Only blocking work gets built.
2. **A new cardinal displaces a named one or waits. Say which.**
3. Half of every build day is reserved for what the previous day's walk found.
4. Every build day ends in a deploy and a walk.
5. N.48 may be unclosable; it needs a `[u]` that fails.

---

## THE FIXTURE. Read out of the file, do not re-derive it

`~/Downloads/no-lyrics-control.musicxml` is the only instrument that exercises
the no-underlay path; all three of Dann's own scores carry lyrics.

**It holds five pitched notes and one half rest:** C4 D4 E4 F4 quarters, G4 half,
then a half rest. **It is NOT six notes.** Its stripped lyric line was five
syllables, «Я тебя любил». **Its header title is a different text from its lyric
line.**

**The walk, four steps.** Transcribe some Russian, or the queue is empty and
nothing draws. Switch to Fit **before touching any file input.** Upload the
control, press *Continue to analysis*. **Expect `5 / 5`, syllables under the
notes, the rest bare, no dashed boxes.** Walked and confirmed 2026-08-13.

**This same walk is N.67 step 3's observation**, with the expectation stated
before the walk: re-uploading the control over placed syllables no longer erases
them.

**The print fixture, E.51.** Marshak's Russian of Shakespeare's Sonnet 90, under
Kabalevsky op. 52 no. 9, fourteen lines. **It fills exactly two letter sheets.**

---

## RULED 2026-08-16, ON E.55'S WALK FINDINGS

- **The walk's findings come before N.67 step 4**, per the schema's own rule
  that half of every build day is reserved for what the previous walk found.
- **N.70 and N.71 are numbered. The third finding, no cursor on a note, is
  FOLDED INTO N.71** rather than tracked: one CSS declaration on the same
  element as N.71's fix.
- **N.55b's row is corrected rather than left tidy**, Dann's words.
- **The N.70 fix is Dann's own third option**, better than either I posed:
  filtered on desktop, no `accept` at all on iOS. Named consequence, accepted:
  the tree's `isMobile` is a WIDTH test, so a narrow desktop window also gets
  the unfiltered picker.

## STILL UNSETTLED. Not yours to settle alone

- **Where the storage notices belong.** They render in the FIT drawer only, so a
  singer working in Transcription never sees a save failure or the two-tab
  notice. Inherited from when they were pairing notices; not moved in E.54
  because moving them is a placement decision, not a build step.
- **The three storage strings still say "syllable placements"** and the save is
  now the whole song. Design §7 puts that copy in step 6, with the French shown
  to Dann first, so it was left alone rather than rewritten twice.

- "The page carries no chrome." · "Do not introduce a slider."
- **N.51:** whether per-tab colour may propagate past the tab bar.
- Whether `claude/shane-project-map_2026-07-25.md` is stale. **Unopened for
  twelve sessions.**
- **D3's Job A**, per-verse reprints, ruled in E.36 and still unnumbered.
- **The per-format score arrival audit**, asked for in E.45 and never written.
- **`stripBackingRect` matches `fill="#FFFFFF"` while `staff-renderer.ts` paints
  `#F0EBE0`.**
- **The marks on the printed page.** E.51's prints carry a dashed `VERIFY` box
  and a `USER OVERRIDE` badge on paper. CONTRACT §6 forbids a mark that says Ilya
  is unsure. **Whether these are the ruled exception was not checked.**
- **`VoiceProfilePane.svelte:295-313` duplicates the old header arithmetic.**
  Fit's paper does not yet share the Transcribe paper's single `HEADER_GAP`.
- **Whether `.mscz` ingest actually succeeds in a browser.** The path is live in
  code (`ScoreUploader.svelte:106-137`) but `i18n.ts:272` still carries a
  "coming soon" string for it. Nobody has run it.

---

## Register corrections owed

`claude/ILYA-REGISTER_2026-08-11.md` is at revision 10 and needs revision 11.
Its N.55a row is FALSE (N.55a is CLOSED). It says "ten cardinals" over a list of
twelve; **five actually remain and none is in the tree: N.1, N.2, N.3, N.18,
N.21.** Its N.55b row is stale. **The blocking number is now THREE.**

**Or fold the register into this file and retire it.** It is the last piece of
canon still living in project knowledge.

---

## Log

| date | what changed |
|---|---|
| 2026-08-18 | **`cee4572`: N.67 STEP 6 SHIPPED, with its memo in the same commit.** The sweep: the eviction notice once per device, the corrupt-record salvage path, the storage copy finalized in both languages, and the N.27 recommendation recorded at the reporting seam and NOT built. Twenty files, 1,985 insertions, `notices.ts` new at 216 lines, gate 4 **628 to 671** with permission asked and granted first. **Three things the design assumed and the tree did not do:** nothing had ever read a record's `schema`, so a record from a newer Ilya was silently downgraded; a corrupt record was silently overwritten AND then validated clean, so the evidence died with the work; and one damaged record refused an entire binder on import, so the salvage export could be written and never read. **Code's own walk refuted its own build three times**, each repaired with a regression test, and every one had passed all five gates first. **W1 closed. NOT YET WALKED BY DANN ON A DEPLOY.** |
| 2026-08-18 | **`9892887`: N.67 STEP 5 SHIPPED. `db54cff`: its memo.** Export-all, multi-song import, and the collision rules. Ten files, 1,834 insertions, `exchange.ts` new at 313 lines under 34 tests, gate 4 590 to 628. **DONE the same evening: Dann walked it on `ilya-eaxv09qx3`, twelve steps, record `n67-5-dann-walk_r1_2026-08-18.md`.** |
| 2026-08-18 | **A DIALOG THAT WAITS FOR ITS `close` EVENT WAITS FOREVER, AND ALL FIVE GATES PASSED WITH THE HANG LIVE.** `close()` fires no `close` event in the browser pane Code drives, confirmed on a bare `<dialog>` with no framework near it. The collision dialog hung the whole import on the first colliding song. **Runes are inert under vitest, so the module was correct and the page was not, and only a browser could see it.** Resolve a dialog from the press, never from the event. |
| 2026-08-18 | **THE TREE MOVED UNDER THIS DESK TWICE IN ONE SESSION.** First a parallel GUI session added 2,955 bytes to `STATE.md` while a brief was being written against it. Then Code shipped step 5 while the close was being written, so a section that said "nothing built" was false within the hour and the memory edits were swept into Code's own commit. **Both were caught by comparing a kept copy, not by trusting a session-open `git status`.** |
| 2026-08-18 | **`924f687`: N.67 STEP 5's BRIEF WRITTEN AND COMMITTED. No code shipped from this desk, which does not build.** Dann ruled that **an import ADDS songs and never touches the song you are in**, which retires the open-song warning and leaves the id collision as the only prompt. Eight new strings approved by him as a whole table before any entered the tree. **Two findings that shrank the work: `readBinder` was already plural (`binder.ts:190-225`), so multi-song import is one line at `+page.svelte:1017`; and `library.load` cannot detect a collision, because an absent id yields an empty record on purpose (`library/index.ts:164-166`), so a check written on `load` would have overwritten every song in the binder silently.** |
| 2026-08-18 | **A CLEAN `git status` AT SESSION OPEN DOES NOT STAY TRUE.** This session opened on a clean tree at `ed8318e` and wrote a brief against `STATE.md`. Eleven hours later another session had added 2,955 bytes to that same file. **It was caught only because the session-open copy had been kept and the two were compared**, which is a file comparison and not a git operation. THE ONE THING was unchanged, so the brief held, but it need not have been. Recorded in `ENVIRONMENT.md`. |
| 2026-08-18 | **`cb7a15a`: N.67 STEP 4b SHIPPED AND WALKED BY DANN. SONGS ARE PLURAL.** `songs.ts` (227 lines, 35 tests), `SongList.svelte` (265), a `PluralStore` hung off `StorageDriver` as an optional property so the legacy driver can decline it, `name` made `$state` so a rename reaches the vault, and `backfillName` at boot because `SongRecord.name` had existed since step 0 with **nothing ever writing it**. Gate 4's baseline moved 555 to 590 with Dann's permission. Ten walk steps on the deploy, all matching a stated expectation or refuting one on the record. |
| 2026-08-18 | **THE SWITCH MECHANISM WAS SETTLED BY MEASUREMENT AND THE PREDICTION WAS WRONG.** Code expected `.musx` to be too slow to switch in place and to need `location.reload()`. Measured: **warm `.musx` switch 343 ms against a 448 ms reload**, `.musicxml` 49 ms against 97, vault read 0.2 ms. The reload is both slower and loses the tab, the drawer, the scroll position, and the dictionary. **`close()` then `open()`.** Design §9.3 is closed for Chromium and **still open for WebKit**. |
| 2026-08-18 | **THE VAULT HAD BEEN PLURAL SINCE STEP 1 AND NOBODY HAD LOOKED.** `by-updated` and `by-fingerprint` were defined at `driver.ts:290-301` and `driver.idb.test.ts:92-114` already proved two songs coexist and that a song is findable by fingerprint. **Every one-song assumption lived above the vault**, in `index.ts`, `document.svelte.ts`, and `+page.svelte`. An inventory read before the brief was written is what found it, and it made 4b smaller than its own description. |
| 2026-08-18 | **A MEMO'S SUBSTANCE CAN BE RIGHT WHILE ITS CITATIONS ARE WRONG.** The 4b memo correctly reported that the shipped dialog puts the safe answer last in the DOM, and cited `+page.svelte:1381-1384` and `:1347` for it. Those lines are the tab-change handler and a metadata function. **The real citations are `:1646-1649`, `:753-765`, and `:2172-2174`, found only by opening the file.** The same check found that `STATE.md` itself had carried the false version, and that a stale comment at `:1612-1613` still does. |
| 2026-08-18 | **`+page.svelte` 2,578 to 2,857 lines, 94,571 to 105,544 bytes.** Far past the brief's thirty-line allowance and past the design's own 74 KB warning. Recorded as a standing debt rather than argued away. |
| 2026-08-16 | **E.58: N.59 step 8 built, and the NaN that crashed Dann's own photograph guarded.** `pdfjs-dist` 6.2.108 ruled in by Dann, pinned exactly, lazy: **up-front JS for a singer who never drops a PDF is 30,546 bytes gzipped**, and pdf.js's 612 KB sits entirely in chunks that load on demand. A true vector PDF reads end to end at s = 29.0. `detect_staves` now raises its own `RuntimeError("no staff lines")` instead of leaking a NaN four frames into `beams.py`, and a Cardoso and Rebelo run-length fallback supplies a finite `s` on a rotated page. Gates 552 to 555. |
| 2026-08-16 | **A BUG IN MY OWN FIX THAT NO LOCAL RUN COULD SEE.** `np.bincount` on an int64 array works on 64-bit desktop numpy and **throws under Pyodide, because WASM is 32-bit and `np.intp` is int32**. Every Python proof passed; the browser found it on the very page the fallback exists to rescue. **The lesson is E.54's again: drive a real browser, the gates and the local runs structurally cannot reach this class.** |
| 2026-08-16 | **THE SAME MUSIC READS DIFFERENTLY AT DIFFERENT RESOLUTIONS, measured.** Musorgsky 01 page 1 gives 78 notes at s = 21 from a PNG and 79 notes with one pitch abstention at s = 29 from a PDF of the same engraving. E.43's 37-against-36 precedent, seen again from the other direction. A read is not reproducible across resolutions and must not be described as if it were. |
| 2026-08-16 | **The run-length estimator is sharp on a render and soft on a photograph, and the difference is the finding.** The fixture gives a single peak at 21 (6,895 against 2,090). Dann's photograph gives a smear across 17 to 22 with no dominant peak, mode 19, against a hand measurement of 17.0. Reported rather than reconciled. |
| 2026-08-16 | **E.58: `0573c10`. N.59 INCREMENT 1 SHIPPED AND WALKED BY DANN.** Steps 1 through 7. A photograph now becomes a score: Pyodide runs the eleven-module E.16 reader in a Worker, the brace rule replaces the struck gap heuristic, the recognized output becomes MusicXML and enters at the existing ingest seam, the singer answers clef and key in the drawer before the read, the read report counts every substitution without marking the page, and the greyscale ink persists so a reload restores without re-asking. **What Dann saw: thirteen syllables sitting on notes Ilya read off ink, `13 / 13`.** Gates 537 to 552. |
| 2026-08-16 | **A DEFECT OLDER THAN N.59, found by it: `validateRecord` never carried `source` through**, and had not since N.67 step 1. It returned `record.source === null` on every load. **Consequence nobody had noticed: step 4a's chimera warning cannot fire on the first upload after a reload**, because the stored fingerprint was always absent. It works within one session, which is exactly why Dann's own 4a walk passed. Fixed, four tests. **The lesson: a walk that never reloads cannot test anything that depends on what was stored.** |
| 2026-08-16 | **Three corrections to Fable's E.57 brief, all measured, none of them reopening a ruling.** (1) `measures_per_system` is `len(barlines)`, not `len(barlines) + 1`: the `+1` form is wrong on all six Musorgsky pieces by exactly the number of systems. (2) The spike's `loadPackage` list is `['numpy','opencv-python']` with no matplotlib, and it never writes the Leipzig caches, because it calls `read_page_pitch` rather than `envelope.run`; every matplotlib and leipzig string it contains is inside its embedded module blob. (3) `~/Downloads/ilya-test-page.png` is byte-identical to a repository fixture and is 8 staves at s = 21, not E.43's 12 at s = 17. |
| 2026-08-16 | **DANN'S BRACE RULE IS BUILT BUT ITS CENTRAL CASE IS UNPROVEN, and that is recorded rather than dressed up.** No fixture in this repository contains a brace at all: every Verovio render joins voice and piano with the system barline alone. The rule therefore falls back to staff 0 on every fixture system and COUNTS the fallback, which the read report declares out loud. On the Piano-first piece 06 that fallback picks the piano. **The old heuristic picked the piano too; the difference is that this one says so.** |
| 2026-08-16 | **E.57: `1e4081a`. No code shipped. N.59 briefed and nine environment traps recorded.** A Sonnet inventory read the eleven reader modules and found four things the E.43 summary did not carry: `select_vocal` is the ONLY staff-selection site (`reader.py:269-278`, one call site at `:400`); `timesig.py` carries a SECOND Node-and-Verovio shell-out; losing `rest_templates`' shell-out aborts the whole page rather than dropping rests; and **the reader detects neither clef nor key**, passing both through from a ground-truth file that does not exist in a browser. Fable then ruled all five open questions and wrote the build brief. |
| 2026-08-16 | **The scope enlargement reported at E.57's midpoint was WRONG, and the record keeps it.** "Two shell-outs, not one" was read as a doubling of the work. Fable opened both `load_font` functions and found the cache-hit early return, so the true cost is two committed JSON files and zero new WASM. **The lesson is tether 10: the inventory read the imports and not the function bodies, and a summary of a summary got one more layer wrong.** |
| 2026-08-16 | **Nine environment traps recorded that no gate could have found**, all learned across E.53 to E.56 and none previously written: `pnpm --filter` from `~` is destructive; the bundle-size instrument is noisy to 443 bytes; `autofocus` moves web-check to 8 warnings; `app.css:93` breaks native modals; service workers cannot be tested locally without patching the build; `cp -R` preserves mtimes so a local server lies about caching; the Vercel branch alias lags READY; there are two file inputs now; and Dann uses Chrome on his iPhone, not Safari. |
| 2026-08-16 | **E.56: `046beec` and `58f982c`. N.71 and N.70, both found by Dann walking and both closed by Dann walking.** The notehead swallowed its own click for three days behind a DONE mark; iOS silently refused every score format Ilya can read. **Neither was reachable by a gate, and both were found by a musician using the thing.** score-parser 442 to 444. |
| 2026-08-16 | **E.55: `6c0c719`, N.67 step 3 shipped and WALKED BY DANN. N.68 closed.** `mergeOnUpload` keeps the map by positional key, proposes only into an empty map, reports orphans, and never rebuilds; *Start placement over* is the singer's own and only destructive act. Seven new tests, gates 504 to 511. |
| 2026-08-16 | **The walk was built to be able to FAIL, and that is why it is worth anything.** Re-running the first pass over an unchanged transcription produces the same layout either way, so the walk needs one deliberate change in the middle. Positive control: the old code was temporarily restored and the identical walk snapped back to 5/5; the merge rule held at 4/5. |
| 2026-08-16 | **Three defects found by Dann walking, none by a gate.** The notehead swallows its own click, notes have no cursor affordance, and no iPhone can load a `.musicxml` at all. See the section above. **The instrument lesson: my Playwright harness had to DISPATCH the note click because a real click was intercepted, and I read that as a test artifact instead of as the bug it was.** |
| 2026-08-16 | **E.54: N.67 steps 1 and 2. The vault and the source.** `ilya-library` v1 with `songs` / `sources` / `meta`; the §3 migration, write-verify-then-remove; `persist()` and `estimate()` called for the first time in this project's life (Dann's Mac reports a **1.9 GB** quota against 3.4 KB used); `BroadcastChannel` for two tabs; the score kept byte for byte and re-ingested at boot. **34 new tests, gates 470 to 504.** |
| 2026-08-16 | **TWO BUGS THAT ALL FIVE GATES PASSED, both found only in a real browser.** (1) `$state` proxies cannot be structured-cloned, so **every IndexedDB write failed** until `$state.snapshot()` was applied; localStorage never showed it because `JSON.stringify` reads a proxy happily. (2) The effect's guards were in the wrong order, so **the singer's first edit was swallowed** as though it were the load echo. Both are in `ENVIRONMENT.md`. **The lesson is the instrument: drive Playwright yourself, it is installed and it takes thirty seconds.** |
| 2026-08-16 | **E.53: `4568e01`, N.67 step 0 shipped and observed.** The song document, the facade, the legacy driver, 32 new tests. `+page.svelte` 2,095 to 2,009 lines, its per-song localStorage sites to **zero**, 1,324 lines added under `lib/library/`. **Observed in a browser on Dann's Mac, not merely written:** a seeded pairing map survived an idle reload byte for byte, which is the race the deleted guard flag existed to prevent. **web-test baseline moved 438 to 470 with Dann's permission** (`ilya-ship.sh:79`). |
| 2026-08-16 | **The rename method worth reusing.** Delete the declarations FIRST, let `svelte-check` name every surviving reference, then insert at exactly the reported `line:col` after asserting the identifier is there. The compiler cannot report a comment, a string, or an import path, so nothing else can be hit, and 0 errors at the end is the proof. 44 of 44 applied, zero mismatches. |
| 2026-08-16 | **E.52 closed. No code shipped.** N.67 ruled first, displacing both blockers. Fable commissioned three times and returned the design, the socket, and the retention policy, all in `docs/sessions/`. The retention rule ratified. **The build moves to Claude Code in the desktop app's Code tab**, folder associated; see `ENVIRONMENT.md`. |
| 2026-08-16 | **Corrections to `claude/e45-n67-storage-architecture_2026-08-13.md`, measured:** Ilya already uses IndexedDB (`loader.ts:103-115`, `ilya-data` v1, store `cache`); `.musx` does not compress, so sources are 64 to 146 KB and stay there, not 15 to 25 KB. `navigator.storage.persist()` has never been called. |
| 2026-08-16 | **A process failure worth keeping.** Half an hour was spent measuring that no gate runs on the device VM. `ENVIRONMENT.md` already said so. Its read rule is "before you touch a tool, a path, or a gate," and it was not followed. |
| 2026-08-15 | **E.51 closed. N.69 and N.47 both CLOSED.** `STATE.md` rewritten, `ENVIRONMENT.md` gained the print, Vercel, container-renderer, and measurement sections. |
| 2026-08-15 | **`8af064e`: N.69 settled.** `HEADER_GAP = 16` on both pages; `HEADER_HEIGHTS_AT_LETTER` measured in headless Chromium. Verified in a container render before Dann printed it. Dann on paper: *"the spacing is correct."* |
| 2026-08-15 | **`bd811d3`: a wrong turn, recorded.** Generalised the broken mechanism instead of the working one. Also hid `vercel-live-feedback` at print, which survives. |
| 2026-08-15 | **`3187c40`: print stops re-typesetting the page.** |
| 2026-08-15 | **Vercel SSO turned OFF for project `ilya`.** Reversible in Settings, Deployment Protection. |
| 2026-08-15 | **Asked and answered from the code, no change made: is `с` in «если» regressively palatalized by `лʲ`?** No, by two independent mechanisms (`engine.ts:295`, `:898`, `:303`, `:998-999`). The code records that Grayson p. 209 and D&P pp. 76-87 disagree and that **Ilya follows D&P**. Changing it would reverse a ruling. |
| 2026-08-14 | **`aee9f4a`, `99ab8c5`, `55291e7`: N.69 passes one to three.** |
| 2026-08-14 | **N.47's gate RUN and it found N.69.** The tree wins. |
| 2026-08-14 | **N.59 explained in full. N.58's scoping brief written and delivered.** |
| 2026-08-14 | **`I.01` caught in `INBOX.md`.** |
| 2026-08-14 | **`b5e8777`: N.32 closed**, walked and observed. |
| 2026-08-13 | **STATE.md rewritten clean.** **A log that only appends drifts; rewrite this file at the close.** |
| 2026-08-13 | **RULED, Dann: the notes never move; the syllables slide along them.** In `PRODUCT.md`. |
| 2026-08-13 | **This folder created.** |

---
*Updated at the close of 2026-08-18, THIRD session, and CORRECTED the same
evening against `db54cff` after Code shipped step 5 mid-close. The desk ruled
the shape of step 5, approved its copy, and wrote its brief; Code built it. The
shipped account here is summarised from
`docs/sessions/n67-5-the-binder_r1_2026-08-18.md`, read in full. Previously,
and still true of the brief:*

*Updated at the close of 2026-08-18, THIRD session, against `924f687`. That
session ruled the shape of N.67 step 5, approved its copy, and wrote its brief.
It shipped no code, and it read the tree rather than trusting the summary of it.
Read in full: `README.md`, `CONTRACT.md`, this file, `binder.ts`,
`library/index.ts`, `songs.ts`, `types.ts`, and design §5 and §7. Read in part:
`+page.svelte`, `library.ts`, `zip-writer.ts`, and `i18n.ts`, all at the lines
cited. Previously, and still true:*

*Updated at the close of 2026-08-18, second session, against `cb7a15a`. Facts
added this session were read in the working tree, measured by Claude Code on
Dann's machine, or observed by Dann himself on the `ilya-hg5dr7kl3` deploy.
Read in full this session: `README.md`, `CONTRACT.md`, this file,
`e52-fable-save-design_r1_2026-08-16.md`, and
`n67-4b-library-door_r1_2026-08-18.md`. Read in part: `+page.svelte` and
`ilya-ship.sh`, both at the lines cited. The four N.67 documents are summarised
here; **read the design itself before building from this summary**, and read the
three corrections above with it.*
