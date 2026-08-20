# Brief to Code: N.73 S3, the anchors and the voice line

**Serves N.65, the drawer architecture. Written 2026-08-20 by the coordinating
desk. Floor: `50cae37`, branch `Shane`, clean tree.**

You are building two ships, not one. Each ends in a deploy and a walk by Dann.
**Do not fuse them.** A failed walk on a fused ship cannot say which half broke,
which is the reasoning that shaped S2 and it holds here.

Read `docs/memory/CONTRACT.md` before you start. Every rule in it binds you.

---

## 0. What this closes, and why it is not optional polish

The drawer today pins NOTATION to the **bottom** and scrolls everything else,
which is the E.29 shape. E.36 §1.4 replaced it, and Dann ratified the
replacement on 2026-08-19
(`claude/fable-ruling-s0-slate-closed_2026-08-19.md`, ruling 1): **piece and
NOTATION pinned top, voice pinned bottom, Source, Analysis, and Output scrolling
between, one takeover.**

The voice anchor has never been built. In its place, `CalibrationWizard.svelte`
sits inside the scroll and opens on its `welcome` phase, which renders the plea
"Please name your profile so we can map your voice across the ten sung Russian
vowels." The GUI spec names that plea as defect F2
(`docs/sessions/fable-gui-audit-and-spec_r1_2026-08-18.md:41-44`): Reading voice
inside an Instrument panel, and "Please" breaks the house style Dann ruled on
2026-08-18. **The ruled cure is this brief: the bottom voice anchor plus the
calibration takeover.**

---

## 1. The drawn spec. Build what the mockup draws

`docs/sessions/fable-gui-mockup_r1_2026-08-18.html`. Open it in a browser and
look at it before you write anything. r2 does not touch the drawer stations, so
r1 governs here and the two do not disagree.

The bottom anchor, `:333-338`:

- A pinned region below the scroll.
- Inside it, one line: a lavender dot, the status text, and one primary action.
- Status text, uncalibrated, verbatim from the mockup: `Voice: not yet calibrated`.
- The action is a lavender primary button reading `Calibrate`.

Its styling, `:108-109`:

```
.voice-line { display:flex; align-items:center; gap:8px; padding:9px 12px; font-size:10.5px }
.voice-dot  { width:9px; height:9px; border-radius:var(--r-f); background:var(--lavender) }
```

Treat those as the drawn intent, not as tokens to paste. Use the project's own
lavender token. **Lavender's only carriers in Studio are the voice anchor and the
calibration surfaces** (`fable-ruling-s0-slate-closed_2026-08-19.md`, ruling 3).

The caption at `:368-371` states the whole architecture in one sentence: "Piece
and NOTATION are pinned top, the voice is pinned bottom with its lavender kept to
that one line, and Source, Analysis, Output, and Songs scroll between, in the
same order forever. Calibration leaves the scroll and becomes the app's one
takeover, reached from the voice anchor."

---

## 2. SHIP ONE. The anchors and the takeover

### 2.1 Where things are now

Read every one of these before you edit. **The tree beats this brief wherever
they disagree, and you say so in the memo when they do.**

| what | where |
|---|---|
| the drawer's flex column | `Drawer.svelte:142`, rule at `:474-481` |
| the one scrolling element | `Drawer.svelte:143-149`, rule at `:484-487` (`flex:1; overflow-y:auto`) |
| NOTATION's current bottom pin | `Drawer.svelte:424`, rule at `:501-509` (`flex-shrink:0`) |
| NOTATION's tab guard | `Drawer.svelte:423` |
| the `notationPanel` snippet | `+page.svelte:2005-2039` |
| `CalibrationWizard` render site | `+page.svelte:1983-2001` |
| its wrapper `.shane-panel` | `+page.svelte:2179-2187`, no height, content-driven |
| the wizard's opening phase | `CalibrationWizard.svelte:320` |
| the retract mechanism to reuse | `NotationFields.svelte:85-95`, state at `+page.svelte:154` |

`.drawer-anchor` already proves the pattern works: it is a `flex-shrink:0`
sibling of `.drawer-content` inside a `flex-direction:column` parent, and it
holds still today. **You are not inventing a pin. You are adding a second one and
moving the first.**

### 2.2 What to build

1. **Move NOTATION to the top.** It becomes the first child of the drawer's flex
   column, above `.drawer-content`, beside the metadata block. Its existing
   retract mechanism stays exactly as it is, including the deliberate decision
   not to persist the open state (`+page.svelte:152-153` says why; do not
   "improve" it).

2. **Build the voice anchor.** A new component, one line, pinned as the last
   child of the flex column, `flex-shrink:0`. Contents per §1. It renders only
   when `INCLUDE_SHANE` is true.

3. **Its status text has two states.**
   - No readings: `Voice: not yet calibrated`, action `Calibrate`.
   - Readings exist: `Voice: {name}`, action `Re-calibrate`.

   Derive "has readings" from the same predicate the wizard uses,
   `hasAnyReadings` at `CalibrationWizard.svelte:240`. **Do not write a second
   predicate.** Lift or export the existing one.

4. **Move the wizard into a takeover.** `Calibrate` replaces the drawer's whole
   interior with the ritual, exactly as E.27 defines a takeover: "replaces the
   entire drawer, shows a single back affordance at the top, restores the station
   accordion in its prior state on exit, and is never entered by a chevron"
   (`claude/fable-ruling-e27-four-tab-consolidation_2026-08-05.md`). The anchors
   go with it: a takeover replaces the entire drawer, so NOTATION and the voice
   line are not visible during the ritual.

5. **Exit restores the scroll position and the retract state exactly.** Record
   `scrollTop` on entry and put it back on exit. `ProfileSwitcher.svelte:196`
   already carries `preventScroll: true` for a related reason; do not remove it.

6. **The wizard itself is not rewritten.** It moves. `ProfileSwitcher`, the
   Pacifier, the roster, and all five phases ride along untouched. If you find
   yourself editing wizard internals beyond the mount point and the back
   affordance, stop and report it instead.

### 2.3 Copy and strings

English is ratified by the mockup for the uncalibrated state. The calibrated
state's wording is **the coordinating desk's inference, not a ruling**, and the
memo must say so.

French, drafted and shown to Dann in the session that wrote this brief:

| key | en | fr | provenance |
|---|---|---|---|
| voice anchor, uncalibrated | `Voice: not yet calibrated` | `Voix : pas encore calibrée` | *calibrée* ADOPTED from `i18n.ts:531` (`Calibrez votre voix pour commencer.`) |
| voice anchor, calibrated | `Voice: {name}` | `Voix : « {name} »` | guillemets ADOPTED from `profile.subtitleNamed` |
| primary action, first time | `Calibrate` | `Calibrer` | ADOPTED, same stem as `i18n.ts:531` |
| primary action, thereafter | `Re-calibrate` | `Recalibrer` | **COINED. No house precedent.** |

Use a no-break space before every French colon, matching `i18n.ts:356`. **Do not
write any French string not in this table.**

### 2.4 Constraints

- **Touch.** The `Calibrate` button is a control on a coarse pointer and takes
  the 44 by 44 px floor. Two touch-geometry exemptions exist and Dann has ruled
  there is no third. The mockup's 10 px type is the drawn look, not the hit area:
  grow the target, not the type.
- **Do not put a control on the paper.** Drawer manipulates, page displays and
  prints.
- **Do not add a second silent save site** while N.27 is open.
- **Do not change `VocalLineEvent`** and do not rebuild anything in
  `apps/web/src/lib/shane/reconciliation/`.
- **Edit by anchor.** Assert every anchor is unique before you write. Refuse on
  anything but exactly one match unless you can say in advance why two.
- **Do not run the ship script yourself.** Ask Dann to `git add` the new
  component and the memo, then ask him to ship.

### 2.5 Done when. Every test is a browser observation

Dann walks these on a real deploy. **Write the walk for a desktop where a test
needs two things compared: the drawer covers a phone's whole screen, so a
"nothing moves" comparison there costs him a close, a tap, a reopen, and a
memory.** That cost was paid once already and it is now in `ENVIRONMENT.md`.

1. On the desk, with the drawer scrolled: the metadata block and NOTATION hold
   still at the top, the voice line holds still at the bottom, and Source,
   Analysis, and Output move between them.
2. On the phone, same three observations.
3. NOTATION retracts and expands from its new position, and the middle grows and
   shrinks accordingly.
4. `Calibrate` fills the drawer with the ritual. One back affordance is visible
   at the top. No chevron enters it.
5. Backing out lands on the same scroll position, with NOTATION in the same
   retract state.
6. Entering, backing out, and re-entering loses no captured vowel.
7. A word click during the ritual does not destroy it.
8. With a calibrated profile, the line reads the voice's name and the action
   reads `Re-calibrate`.
9. In French, all four strings render as the table above says.

**Report the phone's remaining scroll height as a number.** With two anchors
pinned, measure `.drawer-content`'s `clientHeight` on the phone and put it in the
memo. **The coordinating desk's stated expectation, recorded before the
measurement: the middle still scrolls and clears 300 px.** If it does not, that
is a finding for Dann, not something you solve by shrinking an anchor.

---

## 3. SHIP TWO. `TabId`, the migration, the accent, and the order

Smaller, mechanical, and independent of ship one. Ship it second so a failed walk
is unambiguous.

1. **Split `TabId` into destination plus document.** `lib/destinations.ts:24`
   carries the whole account of why this is S3's and not S2's; read its header
   before you touch it. The ambiguous consumers are listed below; each needs a
   decision recorded in the memo, not a silent choice.
   - `+page.svelte:156`, the single `$state` carrying both meanings.
   - `+page.svelte:434-437`, `drawerWidth`, which checks `activeTab` but relies
     on `selectedWord` being unreachable elsewhere.
   - `+page.svelte:304` and `:1511-1516`, `TAB_ORDER`, used only for slide
     direction.
   - `Drawer.svelte:146-147` versus `DeskHead.svelte:98`: the drawer renders one
     `role="tabpanel"` whose id is `tabpanel-{activeTab}`, while each pair member
     claims `aria-controls` for its own id. Since S2 merged the panels, the
     inactive member points at an id that is not in the DOM. **Fix it as part of
     the split, and say in the memo what you chose.**
   - `Drawer.svelte:140`, `data-tab`, consumed by no selector or script in the
     tree. Say whether it stays.

2. **The `ilya:activeTab` migration.** Reads at `+page.svelte:1678-1681`, writes
   at `:567` and `:1519`. Today an unrecognised stored value is silently ignored
   and `activeTab` stays at its default. Map both old Studio values explicitly to
   Studio plus a document, per E.27 §3.4: "stored active-tab values
   `transcription` and `shane` both map to Studio, explicitly, so nothing falls
   through silently." **A browser that saved either value lands where it did
   before.**

3. **The `NotationFields` accent.** `+page.svelte:2033` keys it on `activeTab`,
   so NOTATION changes colour when the pair flips, which contradicts S2's own
   walk item "nothing in the drawer appears, disappears, or moves." S2 named it
   and left it. Under the ratified architecture NOTATION is sage and lavender
   belongs to the voice anchor alone, so **the accent becomes sage, unconditionally.**

4. **The station order inside the scroll.** The spec rules Source, Analysis,
   Output (`fable-gui-audit-and-spec_r1_2026-08-18.md:119-121`). The tree renders
   Output at `RootPanel.svelte:290-322` **before** Analysis at `:324-352`. Swap
   them. **The §4 list in the S2 brief is provisional and says so twice; do not
   build against it.**

5. **Print stays where it is.** Lifting it out of the Clear-Print-Transcribe grid
   (`RootPanel.svelte:544-550`, `grid-template-columns: 1fr 1fr 2fr`) would strand
   Transcribe in a `1fr` column and break `.binder-row`'s deliberate column
   alignment at `:552-556`. **Not this ship. Name it in the memo and leave it.**

### 3.1 Done when

1. A browser with `ilya:activeTab` set to `transcription` lands on Studio showing
   the transcription. One set to `shane` lands on Studio showing the marked
   score. One set to garbage lands on Studio showing the transcription.
2. Flipping the pair does not change NOTATION's colour.
3. In the drawer, Analysis appears above Output.
4. All five gates at baseline: phonology 216, dictionary 235, web-check 0 errors
   and 7 warnings in 4 files, web-test 682, score-parser 444 passed and 5 skipped.
   **Ask Dann's permission before moving any gate count.**

---

## 4. The return memo

One file per ship, `docs/sessions/n73-s3-ship1_r1_2026-08-20.md` and
`docs/sessions/n73-s3-ship2_r1_2026-08-20.md`, each committed with its own ship.

Each memo carries:

1. What shipped, by name, with `path:line` for every anchor you wrote.
2. Every place the tree disagreed with this brief, and which you followed.
3. The five gate counts, before and after.
4. The phone's `.drawer-content` `clientHeight`, measured, against the 300 px
   expectation stated in §2.5.
5. Every decision you made that this brief did not rule, stated as a decision.
6. **NOT ESTABLISHED.** Everything you could not determine and what would settle
   it. **NOT ESTABLISHED BEATS A COMPLETE INVENTED ANSWER.**

---

## 5. NOT ESTABLISHED at the time of writing

1. **The calibrated line's exact wording.** `Voice: {name}` with `Re-calibrate`
   is the coordinating desk's inference from E.27 §3.3 item 4 and the mockup's
   uncalibrated state. The mockup draws only the uncalibrated state. Settled by:
   Dann, who writes copy.
2. **Whether the roster counts belong on the line.** E.27 §3.3 item 4 specifies
   "profile name, roster state counts, and the six pitch fields" for the Voice
   *station*; the mockup's *anchor* shows a name and a status only. This brief
   builds the mockup, because the mockup is the later ratified artifact.
   Settled by: Dann, if he wants the counts back.
3. **Whether any takeover machinery exists.** The Inspector is resident in
   Analysis, not a takeover (`RootPanel.svelte:212-217`), so no full-drawer
   replacement exists in the tree to copy. Settled by: your own search before you
   build one.
4. **Where "Score work" (`SyllableStation`, `ShiftLyricsControl`) and the notices
   block belong.** No document names a station for them. They stay where they are
   in this ship. Settled by: a ruling from Dann naming a station.
5. **`Recalibrer`.** Coined. No house precedent. Settled by: Dann.

---
*Written by the coordinating desk, 2026-08-20, on Dann's ruling that a missing
component gets its spec found and built the same day. Sources read in full this
session: `docs/memory/README.md`, `CONTRACT.md`, `claude/e44-fable-ruling-studio-architecture_2026-08-13.md`,
`claude/fable-ruling-s0-slate-closed_2026-08-19.md`. Read in part:
`docs/memory/STATE.md`, `fable-gui-mockup_r1_2026-08-18.html`,
`fable-gui-audit-and-spec_r1_2026-08-18.md`, `CalibrationWizard.svelte`,
`i18n.ts`. Coordinates in §2.1 and §3 come from a Sonnet census of the tree at
`50cae37`, re-checked by this desk at the lines cited.*
