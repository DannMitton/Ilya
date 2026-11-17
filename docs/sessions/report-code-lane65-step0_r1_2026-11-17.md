# Report: lane 65, Step 0 (read and report; nothing changed)

2026-11-17, Code (cloud session). Brief: `brief-code-lane65-walk-fixes_r2_2026-11-17.md`. Branch `cloud-lane-65`, cut from `Shane` at `55be2629` (the brief's commit). Working tree clean when read. A fresh clone with `pnpm install --frozen-lockfile`; Python 3.13 with numpy and scipy 1.18.1 (scipy installed with pip for this run).

## The eight gates at 55be2629

The list of eight is the one in `docs/sessions/measure-4f-quadruplet_2026-10-12/gates-scratch.sh:78-117`.

| Gate | Command | Result |
|---|---|---|
| 1 phonology | `pnpm test:phonology` | 462 passed (462) |
| 2 dictionary | `pnpm test:dictionary` | 248 passed (248) |
| 3 web-check | `pnpm --filter @ilya/web check` | 0 errors, 12 warnings in 5 files |
| 4 web-test | `pnpm --filter @ilya/web test` | 6560 passed, 1 skipped (6561): the brief's baseline, with Python, numpy, and scipy |
| 5 score-parser | `pnpm --filter @ilya/score-parser test` | 904 passed, 5 skipped (909) |
| 6 blurb | `pnpm test:blurb` | 178 passed (178) |
| 7 integration | `pnpm test:integration` | 159 passed (159) |
| 8 ratchets | `pnpm ratchets` | OK |

The gate script's old literals (251, 2433, 675/680, 145, 55) are stale; the counts above are what this tree gives. Only gate 4's baseline was named by the brief, and it matches.

## Ratchets

None of my owned files has a ceiling in `scripts/ratchets.json`. Line counts today: `VoicePane.svelte` 192, `capture-file.ts` 222, `stub-switch.ts` 36. The ratchet run lists ten ceilings that could be lowered (for example `+page.svelte` 5534 to 5530); lowering them is not mine to do and I did not.

## Cited lines re-read on this tip

Read and matching: `VoicePane.svelte:59-121` (and `:53`, `:73-78`, `:132-143`, `:87-92`); `i18n.ts:1339` (and `:1335-1336`); `capture-file.ts:203`, `:27`; `stub-switch.ts:31`; `routes/+page.svelte:1697`; `reveal-scroll.ts:32`; `i18n.test.ts:111-112`; `voice/outside.test.ts:59`; `capture-file.test.ts:104`, `:108-117`; `PRODUCT.md:522`, `:1271`; INBOX lines 823 and 825 (the 15:46 English and 15:47 French).

Drifted or loose, none blocking:
- `capture-file.ts:21`: the brief cites it for `__ILYA_RECORDER__`; line 21 is header comment text. The check itself is in `captureFileEnabled` (`:24`).
- `capture-file.ts:192`: the brief cites it for the panel's English-only words; the panel's words are at `:192` (the Save label, in `refreshPanel`) and `:196-:222` (the mount).
- The INBOX 15:46 line writes "doesn't" with a straight apostrophe. The brief says U+2019 in both languages; I follow the brief.

## Section 7: what the desk could not establish

**Why `?measure=shipped` did not select the shipped picker on Dann's iPhone: NOT ESTABLISHED.** What the code at `55be2629` shows:
- `measure-switch.ts:10-12` returns `'open'` for `open`, `'path'` for `path`, and `'shipped'` for everything else, so `?measure=shipped` and no parameter give the same value, `'shipped'`. No line in this tree makes `?measure=shipped` yield `'path'`.
- `LiveCaptureSession` takes the picker once in its constructor (`live.ts:200`) and stamps every held take with it (`live.ts:743`, `:748`); the sidecar writes `picker: rec.picker ?? 'shipped'` and then `...rec` (`capture-file.ts`, `holdCapture`).
- The wizard builds its session once, as a default parameter (`CalibrationWizard.svelte:205`), reading `location.search` at that moment.
So a take stamped `path` after an address of `?measure=shipped` is not explained by this tree. Candidates the desk can test, none shown by me: the deployment Dann used was built from a commit other than this one (for example one where the default is already `path`); or the address had no `measure` when the wizard mounted. Step 3's panel label will show the picker in use and settle it on the next walk.

## Step 1 notes carried from reading

- `reveal-scroll.ts:32` says "a station under the VOICE pane's doors". Stale after Step 1; I will list it, not edit it.
- The station tier's one-at-a-time rule is in `sections.svelte.ts` (`:365`, `:404`); I leave it alone and will report what a phone does.
