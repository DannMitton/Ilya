# Brief: N.27, the voice profile's save tells the singer when it refuses (r1)

Desk (Fable 5.1 drafting for Opus), 2026-10-15. For Code (cloud lane, Sonnet), on `cloud-lane-8`, after row 91. Row 2 of 5. N.27 is the last silent save in the tree (`docs/memory/STATE.md:117`; the standing recommendation at `apps/web/src/lib/library/library.ts:335-358`). Every `path:line` here was read in a clone of `Shane` at `14e2ff8` on 2026-10-15.

## What the singer sees and gains

A singer finishes calibrating a voice on a device whose storage is full. Today the wizard shows the voice as saved, and on the next visit the voice is gone, with no word from Ilya. After this row, the drawer's notice position shows the same sentence it already shows when a song cannot be saved for want of space: "Ilya could not save: this browser's storage is full. Your work is still on screen. Export your songs now to keep them, or free space and try again." (`apps/web/src/lib/i18n.ts:1420`, `storage.quotaFull`, with its ratified French), followed by the storage figures where the browser gives them (`storage.quotaNumbers`, `:1424`). The voice stays usable for the session, as it does today. Nothing new is said for any other failure, because no ratified sentence fits one (see "Owed").

## What the tree does today

- `apps/web/src/lib/voice/profileStore.ts:282-290`: `saveStore` writes `JSON.stringify(store)` to `localStorage` under `KEY` and, on any throw, returns `void` with the comment "Quota or serialization failure: the in-memory session store stands." The caller cannot know the write refused.
- `profileStore.ts:187-195`: `storage()` returns `undefined` where `window` is absent or `localStorage` itself throws; `saveStore` then returns at once (`:284`).
- One writer: `apps/web/src/lib/voice/CalibrationWizard.svelte:374-376`, `persistStore()`, called nine times in that file.
- The song's seam: `library.ts:359-378`, `Library.save` returns an `Outcome` (`apps/web/src/lib/library/types.ts:157`, `{ ok: true } | { ok: false; reason: FailureReason }`, reasons at `:138-143`). `document.svelte.ts:263-288` sets `saveState` to `failed` with the reason, and `+page.svelte:3327-3333` hands `doc.saveFailure` to `drawerNotices` (`notices.ts:181-203`), which renders `saveNotice` (`notices.ts:153-172`): quota gives `storage.quotaFull` plus `storage.quotaNumbers`; `+page.svelte:3334-3342` re-reads `navigator.storage.estimate()` the moment a quota failure appears. `drawerNotices` says no key twice (`notices.ts:201-203`).
- Quota detection the tree already uses: `apps/web/src/lib/library/driver.ts:186-190`, `reasonFor`, `err instanceof DOMException && (err.name === 'QuotaExceededError' || err.code === 22)`.
- `library.ts:347-350` cites `profileStore.ts:217-225` for `saveStore`; the function is at `:282-290` now.

## The shape

Keep the profile where it is (`library.ts:355-358`: "the voice profile is not a song, it does not live in this vault"). Give `saveStore` an outcome, and give the page one reactive place to read it, with the fewest lines in the two hotspots.

1. **`profileStore.ts`.** `saveStore` returns `Outcome` (import the type from `$lib/library/types`): `{ ok: false, reason: 'no-storage' }` where `storage()` is undefined; `{ ok: false, reason: 'quota-exceeded' }` where the throw matches `reasonFor`'s test (copy the test; do not import `driver.ts` into the voice folder, and say in the comment where it came from); `{ ok: false, reason: 'write-failed' }` for any other throw; `{ ok: true }` otherwise. Publish the last outcome's reason through the tree's own pattern for shared reactive state, a runes module: new `apps/web/src/lib/voice/profile-save.svelte.ts` exporting one instance with a `failure = $state<FailureReason | null>(null)` field, modelled on `apps/web/src/lib/score/reading-wait.svelte.ts:25-32` (set from plain TypeScript at `apps/web/src/lib/omr/scan.ts:18`, read by components, tested in `reading-wait.test.ts`). Nothing in the tree uses `svelte/store`; do not introduce it. `saveStore` sets `failure` on every call (`null` on success, so the notice clears the next time a save lands, the way `document.svelte.ts:283` clears the song's). Rewrite the file header's sentence "Every function is failure-silent by design" (`profileStore.ts:21-25`) to say that `saveStore` reports and the rest degrade.
2. **`CalibrationWizard.svelte:374-376`.** Unchanged if `persistStore` can stay as it is: `saveStore` still takes the snapshot and the return value may be ignored there, because the store publishes it. The file is at its ratchet ceiling (`scripts/ratchets.json:15`, 2124); add nothing to it.
3. **`notices.ts`.** `drawerNotices` takes one more input, `profileSaveFailure: FailureReason | null`. Rule: after the song's lines, where `profileSaveFailure === 'quota-exceeded'`, append `saveNotice('quota-exceeded', reading)`; the dedupe at `:201-203` makes a full origin say it once whether the song or the voice hit it first. Where it is `'no-storage'`, append nothing new: `bootNotices` already says `storage.none` when the song side has no storage (`notices.ts:84-88`), and a browser that keeps songs in IndexedDB while refusing `localStorage` would make "Nothing can be saved in this browsing mode" untrue. Where it is `'write-failed'`, append nothing (owed, see below). Write the rule's reason in the function comment in the file's own voice.
4. **`+page.svelte`.** Two lines: import the instance from `profile-save.svelte` beside the existing `profileStore` import (`:116`), and pass `profileSaveFailure: profileSave.failure` in the `drawerNotices` call (`:3327-3333`); `storageLines` is a `$derived`, so the runes field re-runs it. Extend the `$effect` at `:3334-3342` so the estimate is re-read when either failure is `quota-exceeded`. The file is at its ceiling (`ratchets.json:8`, 6003 lines); pay for the added lines by trimming a comment you touch, or raise the ceiling by the exact count with the reason in the commit message (`ratchets.json:2` permits it) and say so in the report.
5. **`library.ts:347-350`.** Repair the citation by naming the function, not a line: "`profileStore.saveStore`". Rewrite "NOT BUILT" at `:343` and `:355` to record that this row built it, with the date.

## Tests

- New `apps/web/src/lib/voice/profileStore.test.ts`: a fake `Storage` on `globalThis.window.localStorage` (the voice tests have no DOM; see how `install-decline.test.ts` and `notices.test.ts` stay in node) whose `setItem` throws a `DOMException('full', 'QuotaExceededError')`; assert `saveStore` returns `{ ok: false, reason: 'quota-exceeded' }` and `profileSave.failure === 'quota-exceeded'` (runes are inert under vitest but the field holds its value, as `reading-wait.test.ts` relies on); a `setItem` that throws a plain `Error` gives `write-failed`; a missing `window` gives `no-storage`; a store that accepts gives `{ ok: true }` and sets `failure` back to `null`. If `DOMException` is absent in the test runtime, say so and construct the error by the `code === 22` branch.
- `notices.test.ts`: `drawerNotices` with `profileSaveFailure: 'quota-exceeded'` and no song failure yields `storage.quotaFull` once (plus `quotaNumbers` where the reading has figures); with both the song and the profile on quota, `storage.quotaFull` appears once; with `profileSaveFailure: 'write-failed'` or `'no-storage'` and nothing else, the lines are unchanged.
- Every existing test keeps passing; `pnpm --filter @ilya/web check` stays at 0 errors.

## Owed to Dann (strings; do not add any)

- A sentence for a voice that could not be saved for a reason other than space (`write-failed`). `storage.saveFailed.generic` (`i18n.ts:1401`) names "syllable placements" and would misreport; no ratified sentence names the voice. Until one exists, `write-failed` is returned, published, and not drawn. Put this in the report under owed.
- Whether `storage.none` may be drawn for a browser that refuses `localStorage` while IndexedDB works (the profile's `no-storage` with the song side healthy). Not drawn in this row.

## Done when

1. In a browser whose `localStorage.setItem` throws `QuotaExceededError`, finishing a calibration step draws `storage.quotaFull` in the drawer's notice position, and the next successful save clears it. Prove it in Playwright on the built site: register an init script that replaces `localStorage.setItem` with one that throws that `DOMException` for the key `profileStore.ts` writes (read `KEY` off the file), walk to the wizard, save a voice, and assert the notice's English text is on the page. If the wizard cannot be reached without a microphone in headless Chromium, say so, name the step you reached, and rest the claim on the unit tests; do not fake a recording.
2. `saveStore` never throws, and returns an `Outcome` for every branch.
3. Neither hotspot grows past its ceiling, or the raise is exact and explained.
4. All eight gates pass; gate 4 rises only by the tests you added, named.

## Gates

The eight commands in `docs/sessions/measure-4f-quadruplet_2026-10-12/gates-scratch.sh:78-117`. Baselines after row 98: phonology 251, dictionary 248, web-check 0 errors 12 warnings, web-test 2512, score-parser 675 passed 5 skipped, blurb 145, integration 55, ratchets OK, plus whatever row 91 added. Cloud notes: `docs/memory/ENVIRONMENT.md`, "THE GATES RUN IN A CLOUD CLONE".

## Constraints

- Commit to `cloud-lane-8` only; no pull request; `docs/memory/` untouched.
- No new string in `i18n.ts` or in any component; no French. Existing keys only.
- Do not move the profile into the vault; do not change its storage key or shape.
- Do not add a second silent save site (CONTRACT §8).

## Report

`docs/sessions/report-code-n27-profile-save-reports_r1_2026-10-15.md`: the answer in three lines; the branches of `saveStore` and their reasons; the notice rule and why `no-storage` and `write-failed` draw nothing; the Playwright proof or why it stopped; the line counts of the two hotspots before and after; the gates; the owed strings; what you could not establish.

## What you could not establish

NOT ESTABLISHED beats a complete invented answer.
