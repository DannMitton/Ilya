# Report, N.199 Step 0: read and report, change nothing

2026-11-13, cloud lane, branch `cloud-lane-51`, cut from `origin/Shane` at `649fe492`. Working tree clean before and after (`git status --short` empty). This step changes no code; the only file written is this report.

## Tree

- `649fe492` is `db51cdf5` plus one commit, `git merge-base --is-ancestor db51cdf5 HEAD` true. The brief names `db51cdf5`. `git diff --name-only db51cdf5 HEAD` outside `docs/sessions/n199-calibrate/` lists nine files: `docs/memory/CONTRACT.md`, `ENVIRONMENT.md`, `INBOX.md`, `OPEN.md`, `STATE.md`, the brief, the Fable review, the handoff, and one source file, `apps/web/src/lib/voice/engine/stand-ins.ts`. The source diff is a comment only (the `fR1`/`fR2` sentence at `stand-ins.ts:14`). No logic differs from `db51cdf5`.
- Install: `pnpm install --frozen-lockfile` on a fresh clone, Node v22.23.4, pnpm 10.28.0.

## The eight gates against the baseline

Run by `scratchpad/gates.sh step0`; each exited 0.

| Gate | Baseline | Step 0 |
|---|---|---|
| phonology | 462 | 462 passed |
| dictionary | 248 | 248 passed |
| web-check | 0 errors, 12 warnings | 0 errors, 12 warnings (5 files) |
| web-test | 5252 passed, 1 skipped | 5252 passed, 1 skipped (285 files) |
| score-parser | 785 passed, 5 skipped | 785 passed, 5 skipped |
| blurb | 178 | 178 passed |
| integration | 155 | 155 passed |
| ratchets | OK | OK |

No deviation.

## Reads the brief asked for

1. **`Pacifier.svelte:700-972`.** Read in full. The file is 972 lines, at `apps/web/src/lib/voice/pacifier/Pacifier.svelte`, so the brief's `pacifier/` means `lib/voice/pacifier/`. Nothing in these lines contradicts the brief's account. Two things it does not say:
   - The wheel draws a sage "floor" polygon over the quadrilateral when the minimum is met (`Pacifier.svelte:741-753`). The prop `minimumMetOverlay` defaults to `true` (`:61`, `:93`), and the wizard does not pass it, so singers see it today. The brief's new screen has no counterpart and the brief does not say it goes. It is not mine to rule on; I will not build one.
   - The wheel's caption is `role="status" aria-live="polite"` (`:831`, class `pacifier-caption`) and is the wheel's own announcement. The brief's cue line takes that role.
2. **`engine/capture-file.ts`.** Read in full (69 lines). It exists. `captureFileEnabled()` is true only with `import.meta.env.DEV` and `?harness=1` (`:19-22`). `saveCapture` downloads a 16-bit mono WAV of exactly the buffer `runCapture()` received, plus a JSON sidecar (`:1-17`, `:54-62`). It is called from `engine/live.ts:688` and `:693`, both guarded by `import.meta.env.DEV`. Nothing contradicts the brief's M0 description.
3. **`ProfileSwitcher.svelte`.** Read the doc comment and the `disabled` handling (`:22`, `:40-41`, `:58`, `:125-129`). It is inert during capture, and the wizard drives that: `disabled={phase === 'capture'}` at `CalibrationWizard.svelte:1281`. Matches the review's reading. Not read in full (539 lines).
4. **Does `+page.svelte` pass `onProfileChange` to the wizard?** No. The wizard's mount at `routes/+page.svelte:3855-3877` passes `language`, `openRequest`, `onActiveProfileChange`, and `onOpenLearnNote`. A grep for `onProfileChange` across `apps/web/src` finds it only in `CalibrationWizard.svelte` (`:142` prop, `:220` destructure, `:854` call, `:1389` hands `handleProfileChange` to the wheel) and `Pacifier.svelte` (`:63`, `:68`, `:95`, `:464`, `:509`, `:596`). **Nothing outside the wizard reads it**, so the wizard's `onProfileChange` prop has no caller and `:854`'s `onProfileChange?.(profile)` calls nothing.
5. **Where `.visually-hidden` is defined.** There is no global definition: `app.css` and `app.html` carry neither `.visually-hidden` nor `.sr-only`. It is defined per component, five times: `CalibrationWizard.svelte:1650`, `components/Drawer/IntakePanel.svelte:880`, `components/Drawer/PoemLibraryCard.svelte:230`, `voice/NotePicker.svelte:375`, `score/TimeSignatureControls.svelte:341`. Svelte scopes each, so a new component in `voice/` needs its own copy.

## Other checks

- The seven `activateVowel` call sites match the brief's list: `CalibrationWizard.svelte:760, 805, 882, 950, 960, 969, 981`; the definition is `Pacifier.svelte:580`.
- The wheel's long-press skip is `LONGPRESS_MS = 500` (`Pacifier.svelte:298`), handler `onPointerDown` at `:606`.
- The ratchet output lists `CalibrationWizard.svelte: 2124 -> 2112`, matching the brief's "2,112 lines, ceiling 2,124".

## Discrepancies with the brief

1. **Interim drawings' size.** The brief (Step 4d) says 497,371 bytes. `wc -c` on the ten files in `docs/sessions/n199-calibrate/interim-sagittal/` sums to **555,071**. Step 4d reports the bytes as shipped; this is the number the files have now.
2. **Tree commit.** Above: `649fe492`, not `db51cdf5`; docs and a comment only.

## Could not establish

- Whether any line of the brief I did not check is stale. I checked only the lines named in Step 0 and the seven call sites. The rest of section 3's `path:line` list (`plausibility.ts`, `stand-ins.ts`, `derivations.ts`, `extract.ts`, `i18n.ts`, `app.css`, `Drawer.svelte`, `ratchets.mjs`) is NOT ESTABLISHED by me yet; each is read in the step that depends on it.
- The Drawer's pixel widths (484 px takeover body, 520 px Drawer) and the 1,400 px breakpoint: not read. They are read in Step 4b, with a live measurement, as the engraving rule asks.
- Whether saved takes of Dann's voice exist, and the M0 result: not in this repository and not mine (M0).
- Boards C and B3: not in the repository, as the task said.
