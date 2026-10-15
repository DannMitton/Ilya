# Fable review of the N.27 brief (the voice profile's save tells the singer when it refuses), r1

Reviewer: Fable 5.1, 2026-10-15, independent of the drafting instance. Brief: `brief-code-n27-profile-save-reports_r1_2026-10-15.md`. Checked against a clone of `Shane` at `14e2ff8`; every `path:line` below read this session.

## Verdict

SEND WITH AMENDMENTS. The seam, the outcome type, the quota test, the runes-module pattern, and the notice rule are all as the brief says. Two paths in the brief are wrong (the files are under `lib/library/`), one citation into `STATE.md` points at a different line, and the `+page.svelte` edit needs a hard rule because cloud-lane-9's row 5 lowers that file's ceiling at the same time. No string is added; the two owed sentences are named correctly.

## Citations

| Citation | Status |
|---|---|
| `profileStore.ts:282-290` `saveStore` returns void, swallows the throw | CONFIRMED (`:283-290`) |
| `profileStore.ts:187-195` `storage()` returns undefined | CONFIRMED (`:187-195`) |
| `profileStore.ts:21-25` header "Every function is failure-silent by design" | CONFIRMED (`:21-25`) |
| `CalibrationWizard.svelte:374-376` `persistStore`, "called nine times" | CONFIRMED at `:374-376`; called eight times (grep of `persistStore()` minus the definition) |
| `library.ts:335-358` the standing recommendation; `:347-350` cites `profileStore.ts:217-225`; `:343` and `:355` "NOT BUILT" | CONFIRMED (`:336-358`; the stale citation at `:346-347`; "NOT BUILT" at `:345` and `:355`) |
| `library.ts:359-378` `Library.save` returns `Outcome` | CONFIRMED (`:359`) |
| `types.ts:157` `Outcome`; reasons `:138-143` | CONFIRMED (`:157`; `:138-143`) |
| `document.svelte.ts:263-288` sets `saveState` failed with reason; `:283` clears | WRONG PATH. The file is `apps/web/src/lib/library/document.svelte.ts`; the lines hold (`#write` `:263-289`, `saved` at `:283`, `failed` at `:287`) |
| `+page.svelte:3327-3333` `drawerNotices` call; `:3334-3342` the estimate effect; `:116` profileStore import | CONFIRMED (`:3326-3333`, `:3334-3342`, `:116` imports `hasAnyReadings` from `$lib/voice/profileStore`) |
| `notices.ts:181-203` `drawerNotices`; `:153-172` `saveNotice`; `:201-203` dedupe; `:84-88` `bootNotices` `storage.none` | WRONG PATH. The file is `apps/web/src/lib/library/notices.ts`; the lines hold (`drawerNotices` `:180-204`, `saveNotice` `:149-166`, dedupe `:202-203`, `storage.none` `:86-89`) |
| `driver.ts:186-190` `reasonFor` | CONFIRMED (`:186-190`) |
| `reading-wait.svelte.ts:25-32` runes-module instance; `scan.ts:18` imports it | CONFIRMED (`:25-32`; `scan.ts:18`) |
| `i18n.ts:1420` `storage.quotaFull`, `:1424` `storage.quotaNumbers`, `:1401` `storage.saveFailed.generic` names syllable placements | CONFIRMED |
| `STATE.md:117` "N.27 is the last silent save" | The line is the "visible list" bullet; its last sentences carry the N.27 note ("it is the last catch-and-drop of its kind", citing `profileStore.ts:281-289`). The citation holds as a lead; name the sentence, not the line |
| `ratchets.json:15` wizard 2124; `:8` page 6003 | CONFIRMED; `wc -l` 2124 and 6003 |
| `install-decline.test.ts` and `notices.test.ts` run in node with no DOM | CONFIRMED (`install-decline.ts:11-16` says so; `notices.test.ts` is under `lib/library/`) |
| `DOMException` present in the test runtime | CONFIRMED by precedent: `apps/web/src/lib/library/driver.test.ts:171` constructs `new DOMException('full', 'QuotaExceededError')` |

## Amendments

### 1. Paths

Replace every `notices.ts` with `apps/web/src/lib/library/notices.ts`, every `notices.test.ts` with `apps/web/src/lib/library/notices.test.ts`, and every `document.svelte.ts` with `apps/web/src/lib/library/document.svelte.ts`.

Reason: the brief's bare names resolve to nothing under `apps/web/src/lib/`; Code would search, and the imports in `+page.svelte:40` and `:48` give the real paths.

### 2. `+page.svelte`: net zero lines, and no change to `ratchets.json:8`

Replace the last two sentences of shape item 4 ("The file is at its ceiling ... say so in the report.") with:

> `+page.svelte` is at its ceiling (`ratchets.json:8`, 6003) and a parallel session on `cloud-lane-9` (row 5) is shrinking this file and lowering that same ceiling line. Do not raise the ceiling and do not edit `scripts/ratchets.json` for `+page.svelte`. Pay for the import line and the argument line by trimming comment lines you touch in the `$effect` at `:3334-3342` so the file's `wc -l` after your commit is 6003 or less. If you cannot, stop this row, leave the other files committed, and write in the report that the `+page.svelte` wiring waits for row 5's merge.

Reason: two branches changing `ratchets.json:8` conflict on merge, and a raise here would fail the ratchet after row 5's lower number lands.

### 3. Shape item 3: the notice rule's placement in `drawerNotices`

Append to shape item 3:

> `drawerNotices` (`library/notices.ts:180-204`) pushes the song's save lines, else the song's load line, then dedupes. Append the profile's quota lines after that `if/else` and before the dedupe, so a song failure keeps precedence and the dedupe still collapses two `storage.quotaFull` into one. The function's `input` type gains `profileSaveFailure: FailureReason | null`; `notices.test.ts`'s existing calls must pass `null` for it, or give the field a default of `null`. Say which.

Reason: the brief says "after the song's lines"; the function has two branches and a filter after them, and the test file's existing calls will fail to type-check without one of the two choices.

### 4. The Playwright proof: name the microphone stop before Code reaches it

Replace the second sentence of "Done when" item 1 from "If the wizard cannot be reached" to the end with:

> The wizard requests `getUserMedia` only inside `start()` and `startReadiness()` (`CalibrationWizard.svelte:215-217`), and every `persistStore()` call is in that file. Before writing the Playwright test, read the eight call sites and name in the report the first one a singer reaches with no recording (a voice-type choice or a save of characteristics, if one exists). If each call sits behind a recording, say so, rest the claim on the unit tests, and do not fake a recording or a stream.

Reason: the brief leaves Code to discover whether a save is reachable without a microphone; the file says where the microphone is requested, and the report needs the answer either way.

### 5. Branch

Replace every `cloud-lane-8` with `cloud-lane-10`.

### 6. Citations to fix in the brief's own text

- "`STATE.md:117`" becomes "`STATE.md:117`, the sentence beginning **N.27** has a home in the tree".
- "called nine times" becomes "called eight times".

Reason: a citation re-used is a citation re-checked (tether 3).

### 7. Gate baselines

Add after the baselines: "`gates-scratch.sh:111`'s expected string for gate 4 is stale (2433); compare against 2512 plus what row 91 added, and do not edit the script."

## Strings

No new string in either language; the brief says so and the tree confirms the two keys it draws exist with French. Owed to Dann, as the brief lists: a sentence for a voice that could not be saved for a reason other than space (`write-failed`), EN and FR; and the question whether `storage.none` may be drawn when `localStorage` refuses while IndexedDB works. Both correctly held, not drawn.

## Executability

Everything runs in node and in the cloud: the unit tests need no DOM (a fake `window.localStorage` on `globalThis`, as the brief says), the runes module follows `reading-wait.svelte.ts`, and Playwright on the built site is the same harness row 98 used. No Mac file, no WebGPU, no held-out song.

## Collision with cloud-lane-9

`+page.svelte`: this brief edits `:116` (an import) and `:3326-3342`. Row 5's brief (`docs/sessions/brief-code-audit-correction-station_r2_2026-09-27.md`) cites `+page.svelte` lines between 710 and 1332 and lowers `ratchets.json:8`. The hunks are far apart; the ceiling line is the collision, and amendment 2 removes it. Row 47's brief cites no `+page.svelte` line; row 13 measures only. The lane-9 diff itself is NOT ESTABLISHED (branch not in this clone). N.27 need not wait for row 5 under amendment 2. The lane-9 reviews in this folder confirm the collision point: `review-fable-brief-row5_r1_2026-10-15.md` amendment 11 has row 5 lowering `ratchets.json:8` and rows 47 and 48 raising it by their props' lines, at `+page.svelte:4826-4874` and `:862-878`; none of those regions is one this brief edits.

## What I could not establish

- Whether any `persistStore()` call is reachable without a recording; amendment 4 makes Code report it.
- Whether `notices.test.ts`'s existing `drawerNotices` calls are many; adding a default of `null` is the smaller edit either way.
- What cloud-lane-9 has changed in `+page.svelte` today.
