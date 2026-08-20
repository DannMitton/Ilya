# STATE — where we are

**Rewritten clean at the close of E.48, 2026-08-13. Again at E.51, 2026-08-15.
Again at E.52, 2026-08-16.** Updated at the close of every session. This is the
only file that changes often, and it is the handover.

Repository: branch `Shane`.

**THIS FILE NEVER NAMES HEAD, AND CANNOT.** The commit carrying this line cannot
name itself, which is why every previous attempt was stale within the hour and
cost a minute at the next session's open, twice.

What it names instead is a **FLOOR**: everything described below was true at or
before **`63c2bb4`**, raised from `904df6e` at the close of 2026-08-20 night,
because N.73 S3 ship one, its three walk repairs, and its memo all shipped in
`63c2bb4`, and a
floor that predates
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

> **N.73, THE GUI OVERHAUL, CONTINUES. Next is S3 SHIP TWO.**
> S1, S1b, portrait C, C2, C3, S2, and **S3 SHIP ONE** shipped and were walked:
> `9b2af02` S1, `128bc29` S1b, `2f14d73` portrait C, `fa4e0c9` portrait C2,
> `dca9de4` portrait C3, `904df6e` S2, `f7975ca` S3 ship one, `63c2bb4` its
> three walk repairs. **Every one was walked by Dann on a real deploy**, which
> is the only reason any of them count.
> **S3 SHIP ONE IS `WRITTEN`, NOT `DONE`.** Eight of the brief's nine walk
> items passed on `63c2bb4`, plus all three repairs. **Items 6, 7, and 8 are
> unwalked and need a microphone and a real calibration**: re-entering the
> ritual loses no captured vowel, a word click during the ritual does not
> destroy it, and the anchor reads the voice's name with `Re-calibrate`. The
> French half of item 9 waits on the same three.
> **S3 SHIP TWO, which is next and is specified in full:**
> `docs/sessions/brief-to-code-n73-s3_r1_2026-08-20.md` §3. The `TabId` split
> into destination plus document, the `ilya:activeTab` migration, the
> `NotationFields` accent made unconditionally sage, and Analysis moved above
> Output. Print stays in the Clear-Print-Transcribe grid; the brief says why.
> **After S3: S4 is absorbed.** Ship one built the calibration takeover, so
> the build order from here is S3 ship two, S5 (the wall re-plumb), S6
> (consequences), then the chapter bands and the aesthetic layer.
> **The governing documents, all current:** the census
> (`docs/sessions/sonnet-memo-control-census_2026-08-18.md`), the rulings
> (`docs/sessions/fable-gui-rulings-2_2026-08-18.md` and the session record),
> the spec (`docs/sessions/fable-gui-audit-and-spec_r1_2026-08-18.md`), the
> mockups (**r1 governs the drawer; r2 does not touch the stations**), the lip
> (`docs/sessions/ilya-lip-options_r1_2026-08-18.html`, option A), and the
> ratified strings (`docs/sessions/fable-n73-french-strings_r1_2026-08-19.md`).
> **CORRECTED 2026-08-20 night.** This block used to send the next session to
> "§4's station order." The station order is at
> `fable-gui-audit-and-spec_r1_2026-08-18.md:119-121`, under **§3.3**. The §4
> in the S2 brief is a provisional list that says twice, in its own words,
> that S3 rules the stations.

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
- **THE CORRIDOR AT THE DRAWER'S RIGHT EDGE. Found by Dann 2026-08-20, rides
  with ship two.** On the phone a strip of empty sits between the drawer's
  content and the pull, and every horizontal rule in the drawer stops short of
  the edge because of it. **The rules under NOTATION and above the voice line
  make it visible**, which is how Dann found it.
  **The cause, not yet measured but named:** `.drawer-body` carries
  `padding-right: 44px` under `@media (max-width: 767px)`, whose only job is to
  keep content out from under the pull. That reserve was set when the pull was
  wider. Dann's ruling of 2026-08-19 made the pull a bare chevron and thinner,
  and nobody re-measured the reserve.
  **The fix is to stop reserving it, not to fill it:** measure the pull's real
  width, cut the reserve to that plus a margin, and let the rules run to it.
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

### The blocking set: TWO, plus one ruling

**Was THREE until 2026-08-18. N.59 left the blocking set by being answered, not
by being finished.** Its tier 2 is parked with a measured reason; see above.

| | item | state |
|---|---|---|
| `[ ]` | **N.67** the save function | **FIRST, by Dann's ruling 2026-08-16.** Designed in full by Fable, E.52. Seven steps, 0 through 6. **ALL SEVEN ARE NOW SHIPPED.** Steps 0 through 5 are CLOSED and every one of them was walked by Dann on a deploy; step 5 shipped `9892887`, was walked on `ilya-eaxv09qx3` (`a8a979b`) in twelve steps, record `docs/sessions/n67-5-dann-walk_r1_2026-08-18.md`. **The emergency is over and songs are plural.** **STEP 6 SHIPPED `cee4572` 2026-08-18, memo in the same commit, and Code walked all eight items of its brief on a local production build, refuting its own build three times.** Gate 4 moved 590 to 628 for step 5 and **628 to 671** for step 6. **What remains is DANN'S WALK OF STEP 6 ON A DEPLOY, and nothing else.** See the section above and the four documents below |
| `[ ]` | **N.72** no singer can ever receive a fix | **MINIMUM FIX BUILT, awaiting Dann's three-surface walk.** `static/sw.js` carries `__BUILD_VERSION__`, and `apps/web/scripts/stamp-sw.mjs` stamps SvelteKit's per-build version into `build/sw.js` after `vite build`. **The script exits non-zero if it cannot stamp**, because a silent failure would ship the placeholder and reproduce the bug while the build looked healthy. **PROVEN LOCALLY, with a positive control:** a stamped worker makes the browser INSTALL a new one (`registration.waiting` becomes non-null, a second cache appears); the old byte-identical worker NEVER does (`waiting` stays null, one cache). **NOT PROVEN LOCALLY: that the new code is then served.** A static server cannot honestly imitate two Vercel deployments, and three separate harness faults were found trying (a grep matching its own comment text, `cp -R` preserving mtimes so revalidation returned 304, and a build marker that never reached the bundle). **WALKED BY DANN 2026-08-16, Chrome on the desk: the new build arrived after ONE RELOAD**, better than the predicted close-the-tab, and it measured the case that matters, one stamped deploy to the next. **Why it was that quick rather than needing a close is NOT fully accounted for**, and is recorded as observed rather than dressed up as predicted. **NOT WALKED: Chrome on iPhone**, left for another day. **NOT APPLICABLE: the home-screen install.** Chrome on iOS offers no Add to Home Screen, and `InstallPrompt.svelte:48` already excludes `CriOS` and `FxiOS` so Ilya never asks for it. The path exists only in Safari, which Dann does not use. **A singer on Chrome for iPhone can therefore never install Ilya, which is now a known fact rather than a guess, and is Dann's to rule on.** DELIBERATELY EXCLUDED by Dann's ruling: `skipWaiting`, `clients.claim`, the update prompt |
| | | **The finding, as established 2026-08-16:** **ESTABLISHED by reading `static/sw.js`:** `CACHE_VERSION` is the literal `'ilya-v1'` and never changes, so every deploy ships a BYTE-IDENTICAL service worker and the browser never installs a new one; there is no `skipWaiting` and no `clients.claim` (zero occurrences); and the catch-all is `return cached || networkFetch`, so a cached `/` is served STALE and refreshed only for the next load. **Also established:** every deployment is its own frozen origin, so on a sha-pinned URL no reload can ever deliver a newer Ilya. **NOT ESTABLISHED:** the iPhone home-screen case, which cannot be driven from here, and the branch-alias two-reload behaviour, which needs two builds to observe. **Why it matters: Dann does not feel it because he scans sha-pinned URLs. Every singer on a stable URL or a home-screen install would never receive anything shipped tonight.** **The fix, one line:** derive `CACHE_VERSION` from the build so each deploy ships a different worker, add `skipWaiting` and `clients.claim`, and serve navigations network-first rather than stale. **Cost:** roughly fifteen lines in `sw.js` and an hour, of which most is verification, because it can only be proven on a stable URL across two deploys and on a real home-screen install. **Dann to rule where it sits against N.58 and N.59** |
| `[ ]` | **N.58** MIDI import | **"cheap" does not hold. Real scope NOT ESTABLISHED.** A scoping brief for a fresh Sonnet session was written and delivered to Dann 2026-08-14. **Whether he has run it is unknown. Ask before writing a second one** |
| `[~]` | **N.59** the reader in the browser | **TIER 2 CLOSED 2026-08-18, ANSWERED NO, two Opus Code sessions. THE ONE THING above carries the whole account and its numbers.** Phase 0 killed the substrate decider, best margin −587 px; the slice probe died three times over, on grouping, on the fixture corpus (0 of 23), and on cost (16 to 59×). **Line grouping needs \|shear\| ≲ 0.12° and the photograph carries 2.48°.** The only instrument left is a dewarp, which is a project and is **NOT AUTHORISED**. **PARKED AT TIER 2. What a singer sees is unchanged:** photograph import stays in the beta and fails honestly, Dann's ruling 2026-08-17. **STILL OPEN INSIDE N.59: step 3, the brace rule, is `WRITTEN` and not `DONE`.** **INCREMENT 1 DONE `0573c10`, WALKED BY DANN. Step 8 (PDF, `pdfjs-dist`) ruled in and done.** Pyodide v0.26.4 pinned from the jsdelivr CDN, cv2 4.9.0 / numpy 1.26.4 confirmed in a browser; matplotlib added because `envelope.run` needs it and the spike never did; both Leipzig caches committed at `tools/e16-harness/reader/fonts/` so no Node and no Verovio ship; the brace rule replaces `select_vocal` **but has never once fired, and returns the PIANO on piece 06, so step 3 stands WRITTEN**; `pieceId` and `measures_per_system` derived; `midiAssumedNatural` additive; `recognized-to-musicxml.ts` joins at the existing ingest seam; the two questions and the read report live in the drawer; the greyscale ink and the singer's answers persist and restore without re-asking. Load 3.36 s, `envelope.run` 1.96 to 2.36 s per page. **`ENVIRONMENT.md` §THE PAGE READER carries every measured number and every trap.** ~~Pyodide, not a rewrite. PIN THE VERSIONS.~~ Stand the eleven-module reader up under Pyodide with cv2 4.9.0 / numpy 1.26.4; ~~replace `rest_templates.py`'s Node-and-Verovio shell-out with Verovio WASM~~ (STRUCK E.57, see below); swap `reader.py:269-278`'s five-line staff heuristic for Dann's brace rule. **CORRECTED E.57: NEITHER Verovio shell-out is replaced.** `rest_templates.py` and `timesig.py` each shell out to Node, and each `load_font` returns the parsed JSON on a cache hit BEFORE any subprocess is reached, so the browser needs two committed cache files and no Verovio WASM at all. Metre ships free on the same finding. Measured floor 2.9s load, 0.867s per page. Spike at `~/Downloads/ilya-reader-spike.html`. `claude/e43-n59-the-reader-in-a-browser_2026-08-12.md` |

### Closed and parked

| | item | state |
|---|---|---|
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

**N.62** · **N.63** · **N.45's remainder** · the **French colon spacing** (eight
sites, mechanical) · **N.51** · **N.17** · **N.19** · **N.61** · **N.6**.
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

- **The sage rules print faint in greyscale.** `--sage` is `#8B9A7D`
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
- **N.63.** Killing the interstitial is ruled; **where the honest residue goes is
  not.** Asked in E.45, still unanswered.
- **N.45's remainder.**
- **The French question mark.** Eleven strings carry U+00A0 before `?`.
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
