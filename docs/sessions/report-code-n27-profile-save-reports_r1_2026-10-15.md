# Report: N.27, the voice profile's save tells the singer when it refuses (r1)

Code (cloud lane, Sonnet), 2026-10-15, branch `cloud-lane-10`. Brief: `brief-code-n27-profile-save-reports_r1_2026-10-15.md`, with the amendments of `review-fable-brief-n27-profile-save-reports_r1_2026-10-15.md` applied (the file paths under `lib/library/`, the net-zero `+page.svelte` rule, the placement inside `drawerNotices`, the microphone question, and the corrected counts). No string was written in either language.

## The answer in three lines

1. `saveStore` returns an `Outcome` for every branch, never throws, and publishes the reason to a new runes field, `profileSave.failure`. The drawer draws the existing `storage.quotaFull` (with `storage.quotaNumbers` where the browser gives figures) when the voice hit the quota, and clears it on the next good save.
2. Proved in Playwright on the built site: a refused voice write (a `QuotaExceededError` on `shane.profiles.v2`) draws the sentence, and the next successful write clears it. No recording or microphone was needed: the voice switcher's rename calls `saveStore`.
3. `+page.svelte` is net zero (6003 before, 6003 after), `ratchets.json` is untouched for it, and `CalibrationWizard.svelte` is untouched. `write-failed` and `no-storage` are returned and published but draw nothing, and the sentence for `write-failed` is owed to Dann.

## The branches of `saveStore`

`apps/web/src/lib/voice/profileStore.ts`, `saveStore` and the private `write` beneath it.

| condition | returned | `profileSave.failure` |
|---|---|---|
| `storage()` is undefined (no `window`, or reading `localStorage` throws) | `{ ok: false, reason: 'no-storage' }` | `'no-storage'` |
| `setItem` throws a `DOMException` named `QuotaExceededError`, or with `code === 22` | `{ ok: false, reason: 'quota-exceeded' }` | `'quota-exceeded'` |
| any other throw (including `JSON.stringify` failing on a circular value) | `{ ok: false, reason: 'write-failed' }` | `'write-failed'` |
| the write lands | `{ ok: true }` | `null` |

The quota test is copied from `reasonFor` in `apps/web/src/lib/library/driver.ts` (the comment says so), not imported, so the voice folder does not depend on the vault's driver. The file header's sentence "Every function is failure-silent by design" is rewritten to say that `saveStore` reports and the rest degrade.

`apps/web/src/lib/voice/profile-save.svelte.ts` holds the field. It is a runes module modelled on `score/reading-wait.svelte.ts`; nothing in the tree uses `svelte/store` and I added none. It imports only the `FailureReason` type.

## The notice rule, and why two reasons draw nothing

In `apps/web/src/lib/library/notices.ts`, `drawerNotices` takes an optional `profileSaveFailure` (I gave the field a default of absent rather than a required `null`, the smaller edit: every existing call keeps compiling and its test is unchanged). After the song's save-or-load `if/else` and before the dedupe, a `'quota-exceeded'` appends `saveNotice('quota-exceeded', reading)`. A song failure therefore keeps precedence and the dedupe collapses two `storage.quotaFull` into one, as review amendment 3 asked.

- **`no-storage` draws nothing.** `bootNotices` already says `storage.none` when the song side has no storage. A browser that keeps songs in IndexedDB while refusing `localStorage` would make "Nothing can be saved in this browsing mode" untrue.
- **`write-failed` draws nothing.** `storage.saveFailed.generic` (`i18n.ts:1401`) names syllable placements and would misreport a voice; no ratified sentence names the voice.

The rule's reason is written into the function in the file's own voice (a comment block above the new branch).

## The Playwright proof (the built site)

Instrument: `pnpm --filter @ilya/web build`, `python3 -m http.server 5199` over `apps/web/build`, and a Node script driving the sandbox Chromium (`/opt/pw-browsers/chromium-1194/chrome-linux/chrome`) at 1440 by 900. An init script (a) seeds `localStorage['shane.profiles.v2']` with one voice named Dann, and (b) replaces `Storage.prototype.setItem` with one that throws `new DOMException('full', 'QuotaExceededError')` for that key only, while `window.__fail` is true.

Steps and what the page showed:

1. Boot with `__fail` false. No "storage is full" text on the page (count 0).
2. Open the VOICE station, press Calibrate. The wizard opens with no microphone request.
3. Set `__fail` true. Open the voice switcher (the `Dann, options` header), press Rename, type a new name, press Save. `renameActiveVoice` calls `persistStore`, which calls `saveStore`. The patched `setItem` refused exactly once (`__refused` was 1).
4. The drawer's notice position now carries: "Ilya could not save: this browser’s storage is full. Your work is still on screen. Export your songs now to keep them, or free space and try again." and the figures line "Storage: 2.2 MB of 960 MB used." (the figures are the headless browser's own estimate).
5. Set `__fail` false and rename again. The notice is gone (count 0), and `localStorage` holds the new name.

**The first `persistStore()` call a singer reaches with no recording** (review amendment 4). There are eight call sites in `CalibrationWizard.svelte`: `setCharacteristic` (`:434`), `setOwn` (`:440`), `persist` (`:468`, formants after a capture), `createVoice` (`:512`), `selectVoice` (`:528`), `renameActiveVoice` (`:535`), `deleteActiveVoice` (`:549`), and `recordReadiness` (`:680`). The wizard asks for `getUserMedia` only inside `start()` and `startReadiness()` (`:215-217`). By reading the functions, six of the eight (`setCharacteristic`, `setOwn`, and the four voice verbs create, select, rename, delete) take a pick or a typed name and need no recording; `persist` and `recordReadiness` write measured data. I did not trace every caller of `persist`, so "sit behind a recording" is my reading, not a proof. I walked rename, the one the proof used, which needs a voice to exist (here seeded) and no other step. I did not walk the other five. A first-time singer with no voice at all reaches `createVoice` through `submitFirst` in the switcher's first-launch naming, also with no recording; I did not walk that either. The proof rests on the Playwright run and on the unit tests; no recording or stream was faked.

## Line counts of the two hotspots

| file | before | after | ceiling |
|---|---|---|---|
| `apps/web/src/routes/+page.svelte` | 6003 | 6003 | 6003, `ratchets.json` not edited |
| `apps/web/src/lib/voice/CalibrationWizard.svelte` | 2124 | 2124 | 2124, untouched |

`+page.svelte` gained an import line and an argument line and lost two comment lines in the `$effect` I touched (the three-line "A REAL FIGURE OR NONE" comment became a one-line comment), so it is net zero. The trimmed comment dropped a sentence: it explained that the notice appends "Storage: x of y used" only where the browser answered with numbers. That is still said in `saveNotice`'s own docblock (`notices.ts`, "TWO SENTENCES FOR QUOTA, NOT ONE"). The `$effect` now re-reads the estimate when either the song or the voice failed on quota.

The `library.ts` comment is repaired by naming the function, not a line: "`profileStore.saveStore`". "NOT BUILT" at both places now records that this row built it, dated 2026-10-15. (The brief's "`:343`" and "`:355`" were `:345` and `:355` in the tree, as the review found.)

## Tests

| gate | baseline | now | added by |
|---|---|---|---|
| 4 web-test | 2524 (2512 plus row 91's 2 and row 100's 10) | 2534 | +10: `voice/profileStore.test.ts` (7), `library/notices.test.ts` (3) |

`profileStore.test.ts` is new. It stubs `window.localStorage` on `globalThis` (node, no DOM), `afterEach` unstubs it and resets `profileSave.failure`. It covers: ok clears a prior failure; `QuotaExceededError`; the legacy `code` 22; a plain `Error` gives `write-failed` and `saveStore` does not throw; a circular store gives `write-failed`; no `window` gives `no-storage`; a throwing `localStorage` getter gives `no-storage`. `DOMException` exists in the node test runtime (`library/driver.test.ts` builds one the same way), so the code-22 branch is a second test, not a substitute. The three `notices.test.ts` tests: voice-only quota says `storage.quotaFull` and `storage.quotaNumbers` once; song plus voice on quota say them once; `write-failed` and `no-storage` leave the lines unchanged (empty).

## Owed to Dann (strings; none added)

- **A sentence for a voice that could not be saved for a reason other than space** (`write-failed`), English and French. Until one exists, `write-failed` is returned, published, and not drawn.
- **Whether `storage.none` may be drawn for a browser that refuses `localStorage` while IndexedDB works** (the profile's `no-storage` with the song side healthy). Not drawn in this row.

## What I could not establish

- **A real full disk.** The proof forces the refusal with a patched `setItem`. A browser that is genuinely out of space, in the state the brief opens with, was not available here.
- **The other five no-recording save sites**, as above, and the first-launch naming path.
- **`gates-scratch.sh:111`** is stale for gate 4 (2433); I did not edit the script.
- **Whether a profile write at boot, before any singer action, can set the failure.** I saw none in the walk (the notice count was 0 at boot with writes allowed). I did not test a refused write at boot.

## Gates

| # | gate | expected | result |
|---|---|---|---|
| 1 | phonology | 267 | 267 passed |
| 2 | dictionary | 248 | 248 passed |
| 3 | web-check | 0 errors, 12 warnings, 5 files | 0 errors, 12 warnings, 5 files |
| 4 | web-test | 2534 | 2534 passed |
| 5 | score-parser | 675 passed, 5 skipped | 675 passed, 5 skipped |
| 6 | blurb | 145 | 145 passed |
| 7 | integration | 55 | 55 passed |
| 8 | ratchets | OK | OK |
