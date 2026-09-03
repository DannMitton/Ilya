# STATE — where we are

**Rewritten clean at the close of E.48, 2026-08-13. Again at E.51, 2026-08-15.
Again at E.52, 2026-08-16.** Updated at the close of every session. This is the
only file that changes often, and it is the handover.

Repository: branch `Shane`.

**THIS FILE NEVER NAMES HEAD, AND CANNOT.** The commit carrying this line cannot
name itself, which is why every previous attempt was stale within the hour and
cost a minute at the next session's open, twice.

What it names instead is a **FLOOR**: everything described below was true at or
before **`e347311`**, "N.104: the page shows every bar the singer counts",
established 2026-08-29 as the floor of
`docs/sessions/memo-n104-loupe-head_r1_2026-08-29.md`. A floor cannot go stale,
because further commits only move HEAD forward and never make the floor false.
If the tree is ahead of it, that is expected and tells you only that work has
landed since.

**The ten superseded floors that used to be listed here, `2b81f5a` through
`2d54185`, are in `../sessions/LOG.md`, block 5.** They are closed, and closed
things do not live in this file.

**The push range is the check, not the memo.**
A floor that predates
its own content is the stale number this paragraph exists to prevent. A floor cannot go stale, because further commits only
move HEAD forward and never make the floor false. If the tree is ahead of it,
that is expected and tells you only that work has landed since.

**Ask Dann for the state in one line. You do not run git.**

```
git -C ~/Desktop/ilya-rewrite --no-pager log -1 --format="%H %cI" && git -C ~/Desktop/ilya-rewrite --no-pager status --porcelain
```

---

## THE ONE THING

> **The history of this section moved to `../sessions/LOG.md` on 2026-09-01.**
> Every entry from 2026-08-23 to 2026-08-27 that used to sit here is in that
> file, verbatim and in order. Nothing was rewritten. This section now carries
> the current one thing and nothing else, which is what `README.md` sends you
> here for.

> **N.104 CLOSED 2026-09-02, WALKED BY DANN on the branch alias.** Ship
> `ea300ef`, "N.104: the loupe's window opens where its head stops", five gates
> at baseline, gate 4 now **914**. He raised the loupe on m. 4, system 2 of 7,
> and saw clef, F sharp, C sharp, once each; his words: "There!" Memo:
> `docs/sessions/memo-n104-head-window-overlap_r1_2026-09-01.md`, whose §8
> lists six moved anchors, applied in this file below. The N.104 history that
> stood here is in `../sessions/LOG.md`, block 6. **N.102 and N.103 stay open
> and unplaced.**
>
> **N.105 CLOSED 2026-09-02, WALKED BY DANN on the branch alias.** Ship
> `21e9ce2`, 'N.105: "Not now" lasts thirty days', five gates at baseline,
> gate 4 now **920** and `ilya-ship.sh:79` already carries it. One key,
> `ilya:installDeclinedAt`; thirty days is a DESK DEFAULT he has not waved
> off; a dismissed native prompt counts as a decline. Memo:
> `docs/sessions/memo-n105-install-decline_r1_2026-09-02.md`. Its NOT
> ESTABLISHED: the iOS path was never entered. His words: "The banner is
> successfully dismissed."
>
> **N.102 INCREMENT 1 DONE 2026-09-02, WALKED BY DANN on the alias.** Ship
> `0ed0fd8`, "N.102: the courtesy accidental across a barline". Gate 5 now
> **493 | 5 skipped (498)** and `ilya-ship.sh:80` carries it. Two courtesies
> drawn on Without Sun song 1 (bar 3 natural, bar 6 sharp); he saw the bar 3
> natural: "Yes! Success!" Memo:
> `docs/sessions/memo-n102-courtesy-accidentals_r1_2026-09-02.md`. Its three
> flags, all desk calls: a courtesy is never drawn on a system-opening
> measure (increment 1b, below); primitive mode collides at a measure opening
> (fallback only, left); Gould 121's words matched the brief's paraphrase.
>
> **RULED BY DANN 2026-09-02, HIS EYE: the parenthesis gap is 0.2 stave-spaces
> each side**, chosen from a four-column drawing of Maestro's outlines. His
> caveat, his words: "I'm concerned about this being a hard rule. In scores
> where very short rhythms bear courtesy accidentals we can be more fluid."
> DESK DEFAULT built from that: 0.2 sp preferred, the gap closes toward 0
> before the cluster moves when the measure-opening floor binds. The general
> tight-rhythm case is N.103's.
>
> **N.102 INCREMENT 1a DONE 2026-09-02, WALKED BY DANN on the alias.** Ship
> `3dd37e4`, "N.102: the courtesy's parentheses breathe". `COURTESY_GAP_SP =
> 0.2` exported at `staff-renderer.ts:153`; the gap is the first thing to
> give at the measure-opening floor. Gate 5 now **496 | 5 skipped (501)**,
> `ilya-ship.sh:80` carries it. His words: "yes to my eye that reads
> better." Memo: `docs/sessions/memo-n102-gap_r1_2026-09-02.md`.
>
> **N.102 INCREMENT 1b DONE 2026-09-02.** Ship `e7c2e43`, "N.102: the
> courtesy survives the system break". The accidental rule lives once, in
> `advanceAccidentalState` (`staff-renderer.ts:348`), shared by the draw loop
> and `accidentalStateAtEndOf`; `incomingAccidentals` on `StaffRenderOptions`
> seeds each slice. Gate 5 now **504 | 5 skipped (509)**, `ilya-ship.sh:80`
> carries it. Without Sun song 1 has no case, so nothing changed on the
> page; Code proved it on a two-system probe in the browser. Memo:
> `docs/sessions/memo-n102-system-opening_r1_2026-09-02.md`.
>
> **N.102 INCREMENT 1 IS WHOLE.** Four ships tonight: `0ed0fd8`, `3dd37e4`,
> `e7c2e43`, and N.105's `21e9ce2` before them. **Increment 2**, the singer's
> own control with its French, waits on Dann.
>
> **OWED, from the 1b memo: eight `path:line` citations in the loupe's source
> were stale before any N.102 work.** Code listed them and left them rather
> than guess. Repair by naming the thing, not by writing a new number.
>
> **N.106 DONE 2026-09-02, WALKED BY DANN on the alias.** Ship `bb73488`,
> "N.106: the turning unit keeps to the right of the sung unit". Rule at
> `staff-renderer.ts:1796-1871`, `TURNING_CLEARANCE_SP = 0.25` exported.
> 22 of 95 turning heads on Without Sun song 1 displaced right, 2.97 units
> of clearance, nine of them seconds below that used to go left. He saw the
> dotted case on system 2: flat, head, dot, then the lavender natural and
> head clear to the right. His words: "Yes! :)" Gate 5 now **511 | 5 skipped
> (516)**, `ilya-ship.sh:80` carries it. Memo:
> `docs/sessions/memo-n106-turning-right_r1_2026-09-02.md`. The rulings
> behind it (semantic units, biglyph and triglyph, always right, the
> departure from Gould 103) are in `PRODUCT.md` §The turning layer.
>
> **N.103 DONE 2026-09-02, WALKED BY DANN on the alias.** Ship `62967a7`,
> "N.103: the spacer sees ink". `columnAdvance` has a fourth term, ink, from
> one shared `columnInk`; `INK_CLEAR_SP = 0.5` and `TURNING_TRAIL_SP = 1.0`
> exported, the second carrying his ruling verbatim. «лё ко» went from
> -4.38 to 18.92 units; the page's narrowest ink clearance from -4.38 to
> 4.05; systems 7 to 8, pages held at 2. Packing now takes the resolved
> clef, a latent bug Code found. Gate 5 now **528 | 5 skipped (533)**,
> `ilya-ship.sh:80` carries it. **His words: "Claude I find it absolutely
> gorgeous."** `TURNING_TRAIL_SP` stays at 1.0 on that; the cost is a bar
> per system from bar 7 on, accepted. Memo:
> `docs/sessions/memo-n103-ink-spacing_r1_2026-09-02.md`. The rulings
> behind it are in `PRODUCT.md` §The turning layer.
>
> **N.107 DONE 2026-09-02, WALKED BY DANN on the alias.** Ship `d22084c`,
> "N.107: the turning head counts its ledger lines". One shared
> `drawLedgerLines` (`staff-renderer.ts:1996`) serves the sung line and the
> turning block; the sung line's markup proven byte-identical over 9,408
> rendered scores. 37 of 95 turning heads on Without Sun song 1 sit outside
> the stave, all 37 with their lines; the below-stave case proved on a
> deliberately lowered profile, 1 to 5 lines. His words: "Yes, I see exactly
> that!" Gate 5 now **534 | 5 skipped (539)**, `ilya-ship.sh:80` carries it.
> Memo: `docs/sessions/memo-n107-turning-ledgers_r1_2026-09-02.md`.
>
> **THE ONE THING: N.108 increment 1, the frames.** RULED BY DANN 2026-09-02:
> "N.108 comes before the release and the release waits for it." That is the
> named displacement CONTRACT §6 requires; the release order N.85 to N.88
> waits behind N.108. Design's revision 3 returned as a working prototype
> (`docs/sessions/n108-drawer-prototype_r2_2026-09-02.html`, memo
> `n108-design-return_r3_2026-09-02.md`), both written by Design straight
> into the tree. Two desk overrides of it, recorded in the build brief: one
> map at every size (Metadata on the Piece band everywhere), and Back on the
> left of the takeover band. Build brief, three increments each ending in a
> ship and a walk: `docs/sessions/brief-n108-build_r1_2026-09-02.md`.
> Status: increment 1 BRIEFED, not built. Usage read 2026-09-02 evening:
> Fable 29%, shared pool 21%, both reset Sunday; nothing scarce.
>
> Nine ships this session before N.108, all walked or proved: N.104, N.105,
> N.102 (three), N.106, N.103, N.107.
>
> **N.108. RULED BY DANN 2026-09-02, from the three-choice drawing
> (`docs/sessions/drawing-n108-three-choices_r1_2026-09-02.png`): CHOICE 2,
> "frames, no fold".** Three frames as Design drew them; an open station
> grows inside its group; the other groups stay where they are; the drawer
> scrolls once something is open. Design's fold (open one station, fold the
> other two groups) is REJECTED: the drawer must not rearrange under the
> singer's hand. Design's return filed: `docs/sessions/n108-design-return_r1_2026-09-02.md`,
> `n108-design-mockups_r1_2026-09-02.html`, `n108-design-sources_r1_2026-09-02.md`
> (all untracked until added). **Still his to rule: the fourth radius** (the
> ruled three cannot draw a divot; Design's candidate is 20 px). Not built;
> the GUI track still waits on the beta line or a named displacement.
>
> **RULED BY DANN 2026-09-02, later the same day, on drawings:**
> - **The fourth radius is 20 px**, a surface radius, from
>   `docs/sessions/drawing-n108-radius_r1_2026-09-02.png` (16, 20, 24). His
>   words: "20 looks terrific." Amends "three radii, no fourth" (2026-08-18).
> - **Group headers are option A of
>   `docs/sessions/drawing-n108-group-headers_r1_2026-09-02.png`:** a band of
>   full-strength colour with reverse text in a light neutral; File borrows
>   Guide's cobalt `--quiet-cobalt`, Text sage, Score markup lavender. His
>   words: "I honestly prefer mine." Two facts ride with it, for Design to
>   solve inside A: cream on the ruled sage measures 2.7:1 and on lavender
>   3.3:1 at label size, under WCAG's 4.5:1; and cobalt on File overrides
>   "hue names place" for Guide, on purpose.
> - **The first group is named PIECE**, not File. His words: "not every
>   *piece* will be a song: some will be arias." Working names now: Piece,
>   Text, Score markup. French deferred by his ruling; when it comes, the
>   "song" strings ("New song", "songs", the binder copy, N.67's ruled French)
>   move to "piece" wording, shown as a table first.
> - **Design's second brief is written and packed:**
>   `docs/sessions/n108-design-pack/` holds the r2 brief (a working HTML
>   prototype is the deliverable), its README, and copies of E.27, E.44, the
>   2026-08-18 dispositions ruling, and N.70, the four things Design could
>   not read the first time. All untracked until Dann adds them. Design reads
>   the connected repository, so Dann pushes before pasting.

> **DESIGN'S REVISION 2 RETURNED AND RULED ON, 2026-09-02 evening.** A
> working prototype: `docs/sessions/n108-drawer-prototype_r1_2026-09-02.html`,
> memo `n108-design-return_r2_2026-09-02.md`. Ruled by Dann on the desk's
> critique:
> - **Bands take the language-chip tokens with white text** (Design's fix
>   inside A; the ruled hues fail contrast with cream, cobalt included at
>   4.23:1): Piece `#5C739E` 4.77:1, Text `#6C7A5F` 4.58:1, Score markup
>   `#806E8E` 4.63:1.
> - **The slab takes the desk's surround and the groups carry the drawer
>   paper**, as built; the bookmark tab belongs to the slab.
> - **The Transcribe station in Text is dissolved**: the Transcribe action
>   stays under the intake in Piece; the word count and Clear move onto the
>   receipt line. Text holds Notation and Analysis only.
> - **Calibration stays a takeover**, entered from Calibrate in the Voice
>   station, restore-on-exit as today; Design restyles it in the new dress
>   (Score markup band, 20 px surface). In-place ritual is NOT built; it may
>   return as its own item.
> - Owed to Design in revision 3: no self-scroll on opening a station (only
>   on ritual entry); the opening state measured at 1366 × 768 with Metadata
>   giving first; the labelled mobile pull (2026-08-18); the contrast readouts
>   out of the bands; the takeover restyled.

> *(Earlier record, kept:)* Numbered by Dann 2026-09-02, briefed to Design. File (open at open state,
> holding Repertoire, Metadata, one unified intake, import and export), Text
> (Transcribe, Notation, Analysis), Score markup (Underlay, Corrections,
> Voice). Principle ruled by him: "the opening state is the map of
> everything, and it fits without scrolling." Departs on purpose from E.27
> §3.3/§3.6 and from the 2026-08-18 "one takeover" and "one accent per
> surface"; the brief names each. Group names and all French are his and
> owed. Brief:
> `docs/sessions/brief-to-design-n108-drawer-three-groups_r1_2026-09-02.md`,
> untracked until he adds it. **GUI track: builds only after the beta line
> closes or he names what it displaces (CONTRACT §6).**
>
> **Open and unplaced:** N.102 increment 1c (turning-layer courtesies), N.94, N.84 the Guide redo, N.83's call, and
> the release order N.85 through N.88.
>
> **Also this session, ruled: CONTRACT.md tether 20**, put yourself in his
> position first. Transcribed with his ratified words, `CONTRACT.md` §1.20.
> Project knowledge:
> `claude/ruling-tether-20-put-yourself-in-his-position_2026-09-02.md`.
>
> **Waiting, all Dann's to order:** N.83's walkthrough call (his to
> schedule), N.84 the Guide redo (deferred so it reflects the finished
> build), N.94, N.102, N.103, and the release order N.85 through N.88.

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


> **Five sections moved to `../sessions/LOG.md` on 2026-09-01, Dann's ruling.**
> The N.67 document list, the E.54 and 2026-08-16 ruling records, the N.67
> step 4 split, and the second-score measurement. All verbatim, block 4.

## OWED, RULED BUT NOT YET DONE

- **`columnAdvance` reserves no room for the turning layer**, and N.106
  widens what a turning unit can occupy on the right. Nothing crowds on
  Without Sun song 1. Closing it means teaching the layout pass an
  analysis-layer measurement; it belongs with N.103's spacing work. Source:
  `docs/sessions/memo-n106-turning-right_r1_2026-09-02.md`, NOT ESTABLISHED.
- **A third was being read as a second by the desk's own predicate**
  (`gap > o.lineGap`), caught by Code in N.106: a stave step is half a
  space, so intervals are counted in steps, never in `lineGap`. The old rule
  had the same flaw. Do not write that predicate again.
- **THREE RESIDUES OF N.104's LOUPE FIX. None is a regression, all three predate
  it, and all three want numbers.** (1) `Loupe.svelte:276-277` still bounds
  `pageMetrics`' head on `[data-hit]`, which is a different question from the
  head's crop: bringing it onto `MUSIC_MARK` makes system 1's tacet measure a
  candidate measure and resizes the loupe's window on every system of the page.
  (2) `Loupe.svelte:218` skips a whole system from the page's ink survey when it
  carries no notes, so a system of nothing but a tacet run draws a numeral the
  survey never sees. **Cannot bite on this document**, where every system with a
  run also carries notes. (3) **`MUSIC_MARK` is pinned by no test.**
  `headBound`'s arithmetic is pinned eight ways; the selector is not, because
  `apps/web`'s vitest has no DOM environment. Source:
  `docs/sessions/memo-n104-loupe-head_r1_2026-08-29.md` §4 and §9.

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

### New from N.104, 2026-08-29. Three, none blocking the walk

- **THE BAR-NUMBERS DRAWING IS WAITING ON HIM.** Thirty-two plates in
  `docs/sessions/drawing-bar-numbers_r1_2026-08-29.html`, built on
  `docs/sessions/gould-bar-numbers-p484_2026-08-29.md`. **Gould gives which bars
  are numbered, where, what slope and what framing, and gives no size, no
  weight, no clearance and no horizontal offset**, so five things are his and
  are all convention: size, weight, clearance, the post-rest anchor, and bare
  against parenthesized. **Sections B and C are not independent**: the
  parenthesis crosses back over the barline at two of the three anchors and is
  clear at the third, so width and placement have to be ruled together. Ilya
  draws no bar number today; nothing here is built or proposed.
- **The loupe draws the singer's words in a different typeface than the page
  does**, and has since before N.104. The loupe declares Source Serif 4, which
  is the renderer's own intent; the page's container overrides it to Source
  Sans 3. Measured on «тень»: the clone lays that text out 1.99 units further
  left than the head bound allows, on systems 2, 5, 6 and 7. **Looked at at 9×
  on all four: no ink enters the head**, the overlap falling inside the first
  letter's side bearing. A measured near-miss, not a guarantee. **The fix is
  either which face the loupe draws words in, which is his eye, or measuring
  the bound on the clone, which needs two passes.** Not built.
- **What the correction surface does over a tacet run.** Three proposals in
  `docs/sessions/memo-n104-tacet_r1_2026-08-27.md` §7, unruled since
  2026-08-27. The ship changed nothing there **on desk inference rather than on
  his word**, which is stated so he can wave it off.

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


---
*Split 2026-09-01. `STATE.md` was 3,089 lines and 207 KB. The session history,
the `## Log` table, and three stale colophons moved to `../sessions/LOG.md`.
What stays is what `README.md` asks a new session to read: the one thing, the
tracker, and the rulings Dann owes. Backup of the pre-split file:
`STATE.md.bak-2026-09-01`.*
