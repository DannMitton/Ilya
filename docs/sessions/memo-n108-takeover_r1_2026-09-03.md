# Memo: N.108 increment 3, the takeover in the new dress

Written 2026-09-03 by Code, from `docs/sessions/brief-n108-build_r1_2026-09-02.md`
§3 increment 3, with §4 and §5 applying. Floor: `2fe7ebd`, "N.108-2a: the
watermark retires".

Two riders ride in the same commit, both ruled by Dann on his walk of increment
2, 2026-09-03: the drawer stays still on a tab change, and Clear on the score
empties the Metadata fields that score filled.

Commit message: `N.108-3: the takeover in the new dress`.

**Read §2 before you ship.** The takeover's five phases do not fit their box
without an inner scroll at any of the three sizes, and that is not something
this increment caused or can fix. The numbers are there. It is Dann's to rule.

---

## 1. What changed

### 1.1 The takeover wears the new dress

`apps/web/src/lib/components/Drawer/Drawer.svelte:756-770` is the markup and
`:1137-1266` is the stylesheet.

| what | before | now |
|---|---|---|
| the frame | `.drawer-takeover` painted `--drawer-bg` edge to edge | `.takeover-frame` inside it, 20 px radius, `--drawer-bg`, on the drawer's own `0 16px 12px` inset |
| the head | `.takeover-head`, a 2 px `--deeper-lavender` rule with a quiet Back under it | `.takeover-band`, 40 px of `--lang-chip-marked` with white text |
| Back | ink on paper, 0.8 rem, its own row | reversed onto the band, 0.75 rem, weight 500, `opacity: .88` |
| the group's name | nowhere | `Score markup` on the right of the band |
| the station's name | nowhere | `.takeover-title`, `Voice`, the label recipe in `--ink-tertiary` |
| the body | no padding of its own; the wizard spent `12px 1rem 40px` | `4px 18px 16px`, the prototype's measure; `.takeover-panel` spends none |
| arrival | nothing | `bodyIn var(--motion)`, the same one motion a station body takes |

**Back is on the LEFT of the band**, brief §1.2 overriding the prototype. It is
first in the markup, which is the reversal the brief asks for. Measured on the
build: Back's box starts at x 34, the group name's at x 394, in a 1400 px
viewport.

**No hex was invented.** `--lang-chip-marked` is `app.css:124`, ratified
2026-08-20, and it is `--deeper-lavender` one step down. Dann's ruling of
2026-08-23, that the takeover's rule is lavender because the takeover is the
calibration ritual, is carried rather than reversed: the band is that hue at
full strength. The 20 px is the fourth radius he ruled on 2026-09-02 ("20 looks
terrific"), written as a literal because `app.css` has no `--radius-surface`;
`.group` at `:932` writes the same literal for the same reason.

**No new string.** The band reuses `group.scoreMarkup`, Back reuses
`inspector.back`, and the title reuses `voice.heading`, all three already in
`i18n.ts` in both languages. **This increment writes no French and no English.**

### 1.2 The prototype's Back chevron was drawn and then removed

The prototype puts a 10 x 10 polyline chevron before the word. `inspector.back`
is `'← Back'` (`i18n.ts:381`), ratified with its arrow in both languages,
so the first build showed **two left-pointing marks side by side** on the band.
The SVG went rather than the string, because editing that string would rewrite
ratified French. Observed on the build before it was removed; the comment at
`Drawer.svelte:1203-1208` records it.

### 1.3 The one self-scroll, and why it is written on the way out

`Drawer.svelte:341-375`. N.108 §2 allows exactly one self-scroll: on entry to
the takeover, the ritual is parked at its top. **It is implemented on the way
OUT, and that was measured rather than chosen.**

The prototype writes `takeoverBody.scrollTop = 0` on entry (`:602`), where its
element is already showing. Here the takeover is `display: none` until the DOM
update lands, so an entry write has to be deferred to `requestAnimationFrame`,
and **a deferred write loses**: `display: none` does not discard this box's
scroll offset, Chrome restores it when the box gets its layout back, and that
restoration happens after the rAF callback. Observed on the production build:
scroll the ritual to 200, back out, re-enter, and it came back at 200 with the
rAF write already spent.

Written in the pre-effect on exit, the box still has its layout, so it is one
synchronous write with nothing to race. Nothing is painted scrolled: the reset
and the `stowed` class land in the same frame. Proved below, §3.4.

Isolated in the page, which is what ruled the two mechanisms apart:

| experiment | result |
|---|---|
| write `scrollTop = 0` while visible, then hide and show | 0 |
| hide, write `scrollTop = 0`, then show | 150, the pre-hide value |

### 1.4 Rider one: the tab slide leaves the drawer

**Ruled by Dann 2026-09-03 on his walk of increment 2.** Removed from
`Drawer.svelte`: the two keyframes, the two `.drawer-content.tab-enter-from-*`
rules, the two `:global` rules for descendants, the reduced-motion block that
turned them off, the `tabTransitionClass` prop, and the class expression on
`.drawer-content`. `+page.svelte:3146`'s `{tabTransitionClass}` went with them.

**The paper keeps it.** `+page.svelte:3697` still carries the class and
`:4462-4469` still runs the 175 ms slide. The state and the 200 ms timer in
`handleTabChange` (`:2782`) are untouched, because `.main-content` reads them.

Where the comment now stands: `Drawer.svelte:1274-1292`.

### 1.5 Rider one exposed two dead CSS rules

`.placeholder-panel` and `.placeholder-text` had no markup in `Drawer.svelte`
and `svelte-check` had never said so. **The dynamic class was masking them**:
`class="drawer-content {tabTransitionClass}"` makes Svelte treat that element as
possibly carrying any class, so every bare class selector in the file counted as
reachable. Removing the slide's class removed the mask and gate 3 went from 7
warnings in 4 files to 9 in 5 the same minute.

**Both deleted**, so gate 3 returns to its recorded baseline. The mechanism is
recorded at `Drawer.svelte:1370-1381`, because it can hide anything.

### 1.6 Rider two: Clear on the score takes the header fields with it

**Ruled by Dann 2026-09-03 on his walk of increment 2.** `handleClearScore`
(`+page.svelte:1780-1809`) gains one call:

```
commitMetadataState(
  clearScoreFilled({ metadata: doc.metadata, fromScore: doc.fromScoreFields }),
);
```

`clearScoreFilled` (`metadata-provenance.ts:153`) is **the rule already
written**, not a second copy of it: it is what an arriving score calls through
`onScoreIngested` to drop the last score's identity, and its transitions are
covered by `metadata-provenance.test.ts`. The Q1 refinement (Kimi, 2026-07-13)
is what makes it safe here: a "from score" tag fades on the field's first hand
edit, so a field the singer has touched is not tagged and is not reached.

It answers E.23's fault from the other end. A score that ARRIVES has cleared
what the last one filled since 2026-08-04, so a printed page cannot name the
wrong work. A score that LEFT cleared nothing, so the drawer and the page header
kept the departed score's title and composer, still wearing a badge naming a
file that is no longer there.

One comment repaired by naming rather than by number:
`RootPanel.svelte:485-491`, which said the score's Clear "detaches the source"
and now says what else it does.

---

## 2. The five phases do not fit. This is the increment's one open thing

The brief's done-when reads: "all five phases fit their box at 1366 x 768
without an inner scroll (Design measured summary, the tallest, clearing by
113 px; confirm on the real Pacifier, which Design did not read)."

**Confirmed, and the answer is no.** Every number below is `scrollHeight` and
`clientHeight` read off `.takeover-body` on the production build.

| phase | 1366 x 768, box 672 | 1400 x 900, box 800 | 430 x 932, box 836 |
|---|---|---|---|
| welcome | 672, fits | not measured | not measured |
| readiness | 672, fits | not measured | not measured |
| capture, first run (vowel 1 of 7) | 1295, over by 623 | not measured | not measured |
| capture, re-take (vowel 1 of 1) | 1470, over by 798 | 1294, over by 494 | 1224, over by 388 |
| summary, ten of ten | 1042, over by 370 | 1042, over by 242 | 1042, over by 206 |
| characteristics | not measured | 1485, over by 685 | not measured |

**The dress is not the cause, and here is the reading that settles it.** At
1400 x 900 the whole drawer is 852 px and `.takeover-panel`, the wizard's own
column with no chrome around it at all, is **995 px on the summary phase**. The
wizard is taller than the drawer before the band, the title and the frame are
added. No arrangement of 40 px of chrome makes that fit.

**What overflows is the readings table, not the ritual.** On the capture phase
the prompt and the vowel wheel are above the fold; below it are the ten-row
readings table and Pause. On the summary phase the sentence and the first nine
rows are above the fold. The ritual has scrolled inside itself since N.73 S3
and still does; nothing regressed.

**What Design measured was a placeholder.** The prototype's summary is not the
shipped table of ten vowels with a Re-take button on each row, and its capture
phase is a placeholder meter, not the Pacifier and not the readings table. The
brief anticipated exactly this by asking for the confirmation.

**NOT DECIDED, AND IT IS TASTE.** Making ten readings fit 672 px means changing
what the summary shows, and that is a design ruling, not a build's call. Nothing
is broken as it stands. Three things it could be, none of them chosen: the
readings table folds behind a disclosure; the rows lose the per-row Re-take in
favour of one control; the "fits without scrolling" rule is declared to govern
the drawer's map and not the ritual, which is a takeover with its own scroll by
construction.

---

## 3. The walk, on a local production build

`PUBLIC_INCLUDE_SHANE=true pnpm --filter @ilya/web build`, served by the
`ilya-prod` entry in `.claude/launch.json` on `:4173`. Every readout is from the
live DOM.

**One instrument fault, named because it cost twenty minutes and will cost them
again.** `vite preview` builds its file table at boot, and the page had been
served a **stale bundle** after a rebuild: the loaded script was
`app.6Zv7ohfh.js` while the disk held `app.D7six769.js`. The first reading of
the self-scroll was taken on that stale build. **Restart the preview server
after every rebuild and check the loaded entry hash against `build/` before
believing a null result.** Added to `ENVIRONMENT.md`.

The voice was seeded (`shane.profiles.v2`, ten captured vowels) so the wizard
opens on the summary phase, which is `hasAnyReadings`'s own branch
(`CalibrationWizard.svelte:319`). The microphone was shimmed as
`ENVIRONMENT.md` describes, so readiness and capture ran for real; the readiness
gate reported "We did not hear a fry", which is what a synthetic source does and
what the memory note predicts.

### 3.1 The dress, measured

| what | reading |
|---|---|
| frame radius | `20px` |
| frame fill | `rgb(250, 248, 245)` = `--drawer-bg` |
| band fill | `rgb(128, 110, 142)` = `#806E8E` = `--lang-chip-marked` |
| band text | `rgb(255, 255, 255)` |
| band height | 40 px |
| band order | `takeover-back` at x 34, `band-name` at x 394 |
| Back | min-height 40 px, weight 500, `text-transform: none`, opacity .88, text `← Back` |
| title | `Voice`, 11.2 px, 600, 1.344 px tracking, uppercase, `rgb(106, 101, 95)` = `--ink-tertiary` |
| body padding | `4px 18px 16px` |

### 3.2 Entering stows the drawer

`.drawer-content` takes `stowed` and computes `display: none`;
`.drawer-takeover` loses it. The groups, their bands and the voice line are all
gone, which is E.27's "replaces the entire drawer".

### 3.3 Backing out restores the open set and the scroll

At 1400 x 900 with Metadata, Repertoire and Voice open and the drawer scrolled
to `scrollTop` 103:

| step | reading |
|---|---|
| enter | ritual at scrollTop 0, drawer stowed |
| exit | drawer scrollTop **103**, open set still `["voice","repertoire","metadata"]`, wizard still mounted, anchor still `Voice: Walk voice` |

### 3.4 Re-entering lands at the top, and nothing is lost

| step | reading |
|---|---|
| enter | ritual scrollTop 0 |
| scroll the ritual to 200, exit, re-enter | ritual scrollTop **0**, summary table intact |

Also read at 1366 x 768 and 430 x 932: entry scrollTop 0 on both.

### 3.5 A word click during the ritual does not destroy it

Poem transcribed to 13 word stacks, ritual entered and left mid-capture on
vowel 1 of 7, paused. Clicked `любил:` on the paper. After the click: takeover
still active, still `VOWEL 1 OF 7 — [I] CARDINAL-I`, still paused, and the word
selected behind it.

### 3.6 Rider one, measured on a tab change

Pressed `SCORE MARKUP` on the desk head and read both boxes in the same frame:

| element | classes | `animationName` |
|---|---|---|
| `.main-content` | `main-content tab-shane tab-enter-from-right` | `tabSlideFromRight` |
| `.drawer-content` | `drawer-content` | `none`, `transform: none` |

The paper still enters from the side the singer travelled. The drawer does not
move.

### 3.7 Rider two, walked end to end

Typed `Op. 999, the singer's own` into Opus, left title, composer and poet
blank, then ingested a MusicXML carrying `work-title` `Я вас любил`, composer
`test fixture` and poet `Aleksandr Pushkin`.

| step | title | opus | composer | poet | tags |
|---|---|---|---|---|---|
| after ingest | `Я вас любил` | `Op. 999, the singer's own` | `test fixture` | `Aleksandr Pushkin` | 3 |
| after editing the title by hand | `Я вас любил (mine)` | unchanged | unchanged | unchanged | **2** |
| after Clear on the score | `Я вас любил (mine)` | `Op. 999, the singer's own` | **empty** | **empty** | **0** |
| after a reload | same | same | empty | empty | 0 |

The score receipt went, the poem receipt and the poem stayed, `Revert to score
header` went with the score, and the printed page header kept the singer's own
title. **Every field the score filled and the singer never touched was emptied;
nothing the singer typed or edited was.**

---

## 4. Gates

Run before the work and again after every edit. **All five at their recorded
baselines, and NO LINE OF `~/Downloads/ilya-ship.sh` NEEDS TO CHANGE.**

| gate | baseline, read from the script | before | after |
|---|---|---|---|
| 1 phonology | `216 passed (216)` | 216 | 216 |
| 2 dictionary | `235 passed (235)` | 235 | 235 |
| 3 web-check | `found 0 errors and 7 warnings in 4 files` | 0 / 7 / 4 | 0 / 7 / 4 |
| 4 web-test | `959 passed (959)` | 959 | 959 |
| 5 score-parser | `534 passed \| 5 skipped (539)` | 534 / 5 | 534 / 5 |

`sh ~/Downloads/ilya-ship.sh` was not run by this session; the five commands
inside it were run one at a time with `NO_COLOR=1` and matched against the same
strings the script matches, read out of the script at `:76-:80`.

Gate 3 moved to 9 warnings in 5 files partway through and was brought back by
deleting the two dead rules §1.5 names. No warning belongs to a file this
increment touched.

**No new test was written.** `vitest` never compiles a `.svelte` file in this
repository. Rider two's logic is `clearScoreFilled`, which
`metadata-provenance.test.ts` already covers; everything else here is markup,
CSS, or one scroll write that only a browser can exercise. The proof is §3.

---

## 5. New strings

**None.** Three keys were reused and no key was added:

| where | key | English | French |
|---|---|---|---|
| the band | `group.scoreMarkup` | Score markup | Score markup |
| Back | `inspector.back` | ← Back | ← Retour |
| the title | `voice.heading` | Voice | (as shipped) |

---

## 6. Citations this edit moved

`Drawer.svelte` grew by about 120 lines and every line below `:340` shifted.
Repaired by naming rather than by number:

- `StationHeader.svelte`'s header cites the group band's label recipe. It names
  the band, not a line, and is still correct.
- `RootPanel.svelte:485-491` cites `onclearscore` by name; amended in §1.6 to
  say what that handler now does.
- The build brief's §1.2 cites `Drawer.svelte:619` for where Back sits today.
  That number is now `:759`. **The brief is an archive document and was not
  edited**; this memo is the amendment.
- `STATE.md`'s finding "the drawer takes the 175 ms tab slide
  (`Drawer.svelte:1148-1162`)" is spent: those rules are deleted. Recorded in
  `STATE.md` at the close.

Nothing in the tree cites a line number inside the block that moved. Checked by
grep for `Drawer.svelte:` and `+page.svelte:1779`.

---

## 7. Desk defaults, marked so Dann can wave them off

1. **Back's target is 40 px, not 44.** The `@media (pointer: coarse)` block that
   raised the old Back to 44 px is gone with the row it sat in: 44 px inside a
   40 px band is a target taller than the thing it is in. It matches
   `.band-link`, Metadata's affordance, which increment 1 shipped at 40 px in a
   40 px band and Dann walked. **This creates no third touch-geometry
   exemption; it joins the existing band geometry.**
2. **The frame arrives on `bodyIn`**, the drawer's one motion, as the prototype
   animates it. Off under `prefers-reduced-motion`.
3. **`.takeover-panel` keeps its 6 px gap and loses its padding**, so the ritual
   is inset once, by the body, at the 18 px every station in the new dress
   takes.
4. **The self-scroll is written on exit**, per §1.3. The observable behaviour is
   the ruling's: entry is always at the top.

---

## 8. NOT ESTABLISHED

**"NOT ESTABLISHED beats a complete invented answer."**

- **Whether the old dress fit any better.** The comparison would need the
  previous build measured beside this one, and it was not. What IS established
  is that the wizard's own column is 995 px on the summary phase in an 852 px
  drawer at 1400 x 900, which no chrome height can absorb.
- **The welcome and readiness phases at 1400 x 900 and 430 x 932.** Measured at
  1366 x 768 only, where both fit exactly. They are the two shortest phases and
  the box is larger at both other sizes, so they are expected to fit; that is a
  prediction, not a reading.
- **The characteristics phase at 1366 x 768 and on the phone.** Measured at
  1400 x 900 only: 1485 px in 800.
- **The Pacifier's own height during a live capture.** A capture ran with the
  shimmed microphone and reached "Begin phonating now", but the meter sits below
  the fold and the live frame was not caught. The capture phase's total was
  1295 px either way, so the fit answer does not depend on it.
- **Whether a real singer's summary is 1042 px.** The seeded voice is ten
  `captured` readings at high confidence, which is the fullest ordinary case. A
  summary carrying provisional or implausible rows would be taller, not
  shorter.
- **Anything about a real phone.** Every phone reading is a 430 x 932 emulation
  in the browser pane. Dann's walk is the instrument for the phone.
- **Whether the takeover's band should carry the group's name at all on a
  430 px screen.** It fits and it reads, but nobody has ruled that two labels,
  `SCORE MARKUP` and `VOICE`, are what he wants there.

---

## 9. Seen on the walk, not acted on

- **"Tap the chevron on the left to open the drawer."** The empty-paper hint at
  1366 x 768 still says the chevron is on the left. The pull has been a
  horizontal bar on the bottom edge since increment 1a. One string, wrong on
  every phone-layout screen.
- **The service-worker update toast** fires on a local production build after a
  rebuild, which is correct and worth knowing before a walk: dismissing it
  leaves the old page running.
