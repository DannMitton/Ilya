# BRIEF. N.153 stage 1. Extract the squircle's box arithmetic

**Item:** N.153, stage 1 of 5.
**Written:** 2026-09-19, against HEAD `55382d3`, branch `Shane`, tree clean.
**Spec:** `docs/memory/OPEN.md` §N.153, stage 1.

---

## 1. What was observed

Nothing is broken. This stage changes no behaviour and fixes no defect.

The observation that produced N.153 is measured and recorded, and it belongs to
stage 3, not to this one: at phone width the separation between a caret's hit
centre and its neighbour's runs 1.13 px to 7.89 px on all 17 held-able measures,
against a 44 px floor (`docs/memory/OPEN.md` §N.153).

## 2. What is established, each line carrying its `path:line`

All line numbers were read on 2026-09-19 at `55382d3`.

**The arithmetic and its helpers live in one component and are called from
nowhere else.**

- The ring is built inside one `$effect`, `apps/web/src/lib/shane/VoiceProfilePane.svelte:461-630`.
- Five helpers and one module-level cache serve it and nothing else in the file:
  `glyphInk` `:347-374`, `inkCanvas` `:375`, `markBox` `:378-397`, `eventInk`
  `:398-429`, `ipaBaselineOf` `:430-452`, `ipaFaceDescent` `:453-459`.
- Their only call sites are `:348`, `:379`, `:412`, `:454`, `:514`, `:541`,
  `:556`, `:576`, `:579`. Every one of those is inside the helpers themselves or
  inside the effect.
- A tree-wide grep for `eventInk`, `glyphInk`, and `ipaBaselineOf` across
  `apps` and `packages` returns hits in `VoiceProfilePane.svelte` and nowhere
  else.

**The four segments of the effect.**

| lines | what it does |
|---|---|
| `:462-489` | clears the previous mark across `.fit-paper-container`, resolves `id` to `hit` and `group`, sets `data-note-selected` |
| `:495-500` | recovers the stave off the tap rectangle: `gap = hitH / 11`, `staffTop`, `staffBottom` |
| `:502-503` | finds `sysEl` through `group.closest('[data-system]')` |
| `:505-594` | the box: width from ink and IPA reach, top from the system's highest ink, bottom from the IPA baseline, then the viewBox clamp. Ends at `const height = bottom - top;` `:594` |
| `:596-629` | creates the `<rect>`, sets its six attributes, inserts it at `afterGround(sysEl)` |

**The constants already live in a shared module.**
`apps/web/src/lib/shane/selection-ring.ts` exports `RING_PAD_X`, `RING_PAD_Y`,
`RING_MIN_W`, `RING_RADIUS`, `RING_STROKE`, and `RING_REACH`. Its own docstring
says it exists so the page and the loupe read one source. `VoiceProfilePane.svelte:90`
imports five of them; `Loupe.svelte:24` imports two.

**The second caller this extraction is for.** `Loupe.svelte:1223` reads the
page's ring element off the live page, `sysEl.querySelector('[data-selection-ring][data-note-selected]')`.
Stage 3 replaces the loupe's clone with its own render, at which point no page
ring exists inside it and the loupe has to build the box itself.
**Stage 1 does not touch `Loupe.svelte`.**

**The imports the helpers depend on.** `IPA_FONT_FAMILY`, `IPA_FONT_SIZE`, and
`IPA_TO_CYR_BASELINE` from `@ilya/score-parser`, at `VoiceProfilePane.svelte:70-72`,
used at `:443` and `:456`.

**A lead, not a fact.** `docs/memory/STATE.md` records that `apps/web`'s vitest
has no DOM environment, which is why `MUSIC_MARK` is pinned by no test. The desk
did not verify this against the vitest config this session. **Check it before you
plan the verification in section 6.**

## 3. Measure before you change anything

Before you move a line:

1. Confirm the vitest lead above against `apps/web`'s own vitest configuration,
   and report what you find.
2. Record the ring's four numbers for every selectable event on the document your
   whole-fixture scan of 2026-09-17 and 2026-09-18 already runs on: `x`, `y`,
   `width`, `height`, keyed by event id. **The desk did not establish which
   document that is.** Name it in your report.
3. Report that baseline before writing code.

## 4. The rulings this serves

- **Clause 6, Dann 2026-09-18** (`docs/memory/OPEN.md`, section THE CARET): the
  loupe's spacing is its own, temporary and situational, and does not bind the
  page. Nothing has amended it.
- **N.141, Dann 2026-09-14 and 2026-09-15**: the width follows the taken note's
  ink and its IPA syllable; the height runs from the system's highest ink to the
  IPA face's descent below the IPA baseline. Recorded at
  `VoiceProfilePane.svelte:505-513` and `:560-573`. `RING_ASPECT` was ruled out on
  2026-09-15. **The extraction preserves this arithmetic exactly. It does not
  revisit it.**
- **N.153's five stages, from your own plan** of 2026-09-18
  (`docs/sessions/memo-n92-loupe-reengraves_r1_2026-09-18.md` §1): each stage
  lands and is verified on its own.

## 5. Constraints

**DESK DEFAULT, reversible, wave it off if you disagree and say why in the memo:**

- **Home: `apps/web/src/lib/shane/selection-ring.ts`.** It already exists, it
  already holds the numbers, and both surfaces already import it. Its character
  changes: it becomes a module that reads the DOM rather than one that only
  exports constants. If you would rather have a new `selection-ring-box.ts`
  beside it, take that and say so.
- **Signature:** a single exported function taking the elements it reads and the
  event id, returning the box or `null`. It returns `null` wherever the effect
  returns today.
- **`sysEl` is the function's to find**, through `group.closest('[data-system]')`,
  so the caller passes the elements it already has.

**Not negotiable:**

- **Behaviour-preserving. Not one number changes.** No renaming of a ruled
  quantity, no tidying of the arithmetic, no fixing of anything you notice on the
  way. If you find a defect, report it and leave it.
- **The comments move with the code they document**, including the block at
  `:281-346`. They carry Dann's rulings and their dates, and a ruling that loses
  its comment loses its source.
- **`Loupe.svelte` is not touched.** It is stage 3's.
- **`staff-renderer.ts` is not touched.**
- **Out of scope:** the 27 collisions, the 44 px floor, the derived spacing, the
  control loop, and `loupe.ts`'s crop helpers. Those are stages 3, 4, and 5.
- **No agent writes with git.** No `add`, no `commit`, no `stash`. Dann commits.

## 6. Done when

1. The ring's four numbers, for every selectable event on the document named in
   section 3, are **identical** before and after. Not close: identical.
2. The five helpers and `inkCanvas` no longer appear in `VoiceProfilePane.svelte`,
   and a tree-wide grep for them returns hits in their new home and its callers
   only.
3. `VoiceProfilePane.svelte:596-629` still creates and inserts the `<rect>`, and
   `afterGround` is still its insertion point.
4. `svelte-check` and `tsc` are clean, and the gate baselines do not move.
5. **`WRITTEN` on the code. `DONE` is Dann's walk.**

## 7. Report back

The commit, the results against every item of section 6, the document your scan
ran on, what the vitest check in section 3 found, and **what you could not
establish.**

**NOT ESTABLISHED beats a complete invented answer.**

Name any new file you create, so Dann can `git add` it before the ship script
refuses.
