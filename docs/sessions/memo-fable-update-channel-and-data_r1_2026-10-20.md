# Memo: the update channel and off-device data, r1, 2026-10-20

Consulted at Dann's request (2026-10-20 22:27). Read-only. One file created (this one). Evidence is `path:line` read this session, or NOT ESTABLISHED.

## Lead

The desk's default, "no runtime data fetch; the spelling table rides the build," misreads the tree: Ilya already fetches its data at runtime, apart from the build (`apps/web/src/lib/loader.ts:58-64`, `:283-289`, `:672-673`), so the table belongs in that channel and the live risks are staleness and a code and data version mismatch. Separately, the binder's header and the save design deliberately rule out any sharing affordance (`apps/web/src/lib/library/binder.ts` header; `docs/sessions/e52-fable-save-design_r1_2026-08-16.md:184`), so the teacher export of formant profiles reverses a recorded design rule and needs Dann's ruling by name.

## Findings, ranked

### 1. CHANGES. A runtime data channel exists; the spelling table is its fourth file
Point: the loader fetches `/data/dictionary-manifest.json` with `cache: 'no-cache'` on each load (`loader.ts:283-289`), caches the dictionary in IndexedDB under the manifest's content hash (`:631`, `:65`), and loads `singer-supplement.json`, `homographs.json`, and `blurb-composer.json` from `/data/` at runtime (`:61-64`, `:509`, `:672-673`). `apps/web/static/data` is a symlink to a `data/` directory outside `apps/web`. The manifest I read holds `version`, `hash`, `files`, and `glossFiles` (`data/dictionary-manifest.json`).
Better: ship the table as a `/data/` file listed in the manifest with its own hash, curated by Dann; a data fix then needs no code change.
Cost: one manifest field and a small loader branch. The supplement's shape is word to stress and gloss (`data/singer-supplement.json`, first 500 bytes), so the table needs its own shape, keyed by the pair (poem word, scan word).

### 2. CHANGES. A plain `/data/` file is one load stale after a deploy
Point: `loadJsonFile` is a plain `fetch` (`loader.ts:340-346`). The service worker answers every other request stale-while-revalidate, returning the cached copy first (`apps/web/static/sw.js:74-87`); only `version.json`, the manifest, `dictionary.*.json`, and `/omr/` take other paths (`:54-72`). By that reading, a corrected spelling reaches a singer on the second load, not the first. Read, not run.
Better: list the table in the manifest by hash, as the dictionary is, or add its path to the network-first branch (`sw.js:68-72`).
Cost: one line or one manifest field.

### 3. CHANGES. A new data schema can reach an older build
Point: data files sit at fixed URLs (`loader.ts:61-64`) and the page keeps running its loaded code until reloaded (`apps/web/svelte.config.js:18-21`; the toast is dismissible, `+page.svelte:4636`). A table whose shape changes would meet old code in an open tab or an installed app. NOT ESTABLISHED: whether any data file carries a schema field (none in the first 500 bytes of the supplement).
Better: a schema number in each data file, and a loader that ignores a file newer than it knows.
Cost: one field and one check.

### 4. CONSIDER. The desk's poll recommendation holds, with the foreground check made required
Point: pollInterval 0, one check on opening, one on return to the foreground. An installed iOS home-screen app resumes from suspension without reopening, so "on opening" may not fire for days (DESK INFERENCE; general platform behaviour, not tested here). Add the `online` event for a studio that regains wifi.
Evidence on the notice: its action deletes the `ilya-` caches and reloads (`+page.svelte:4622-4634`), so the sw.js header's "may need to close the tab" (`sw.js:16-19`) is out of date for that route. NOT ESTABLISHED: that an unsaved edit survives that reload.
Cost: about ten lines for the three triggers.

### 5. CONSIDER. Offline first open may fail, read from the code
Point: the manifest branch falls back to `caches.match` (`sw.js:68-72`) but never writes the manifest into the cache (no `cache.put` in that branch); the loader calls a failed manifest fetch fatal (`loader.ts:45`, `:623-628`). Whether a studio with no wifi can open Ilya on a first load of the day is NOT ESTABLISHED. Read, not run.
Better: test it before relying on any data channel in a lesson.
Cost: one measured check.

### 6. CONSIDER. Teachers on older builds cannot open newer students' files
Point: a binder carries `appVersion` and `schema` (`binder.ts`, `BinderManifest`), and a newer file is refused with "Open it in the newest Ilya" (`apps/web/src/lib/i18n.ts:1565`). The update check is therefore the teacher's route to reading a student's file, which supports the foreground trigger in finding 4.
Cost: none; a reason, not a change.

### 7. BLOCKS. A teacher export reverses a recorded design rule
Point: `binder.ts`'s header says there is no sharing affordance and must not be one, no recipient, no `navigator.share`, and that adding one "is a change to the legal character of the product"; the design file says "no share integration, which §8 rules out deliberately" (`e52-fable-save-design_r1_2026-08-16.md:184`); `+page.svelte:2946` repeats it. Dann's 2026-10-20 22:19 ask (email or text a formant profile, with an identifier) is that affordance.
DESK INFERENCE: the stated reason concerns copies of scores leaving the device (`e52:250`); a profile-only file holds no score, so the copyright reason may not apply, and a privacy reason replaces it. For Dann to confirm.
Better: ratify by name a second artifact, a voice profile card holding only the profile, with its own header and consent screen, so the binder keeps its backup character.
Cost: a second format and a consent flow, and one recorded amendment to §8.

### 8. BLOCKS. A voice profile is personal information, and some of it may be sensitive
Point: consent must be specific, in plain language, and in French for a French reader (for Dann to confirm: PIPEDA; Quebec's Law 25, including its treatment of biometric characteristics and of minors, a student may be under 14 or 18). I read no statute this session.
Better: the student makes and sends the file; Ilya transmits nothing. The consent screen lists what the file holds. The file is plain readable text, so the student can open it and see it before sending. The text states that a teacher's copy cannot be recalled.
Cost: format choice and consent wording (EN and FR, Dann's).

### 9. CHANGES. The identifier needs a rule for re-sent profiles
Point: Dann asked for an identifier. A student remeasures after a cold or a year; the teacher then holds two files. Give the card a student-chosen label, a random file id, and the measure date; no device id, no email address. Rule: a card with a known label and a newer date adds a version, never overwrites. NOT ESTABLISHED: what a profile stores (the profile store was not read).
Cost: three fields and one rule.

### 10. CONSIDER. Transfer over text and email loses files
Point: messaging apps and mail clients rename or block unknown extensions. A pasteable text block with a checksum survives any chat, in addition to the file.
Cost: one more output of the same data.

### 11. CONSIDER. A pre-typed email to Dann fails for webmail users
Point: a `mailto:` link needs a configured mail app, and long bodies are cut by some clients (general knowledge, for Dann to confirm); many phone users read Gmail in a browser. A grep of `apps/web/src` found no `mailto:`, `sendBeacon`, or `navigator.share` (the hits were the word "plausible"), so no precedent exists.
Better: show the pair as a short line with a Copy button beside the mail link. Use a forwarding alias on Dann's own domain: an address shipped in a build stays in old builds' caches.
Cost: one control.

## Use cases nobody has named, ranked

1. A teacher and student in one lesson on different builds (finding 6).
2. A teacher importing a student's profile: Ilya must show whose profile is active, so the teacher's own measures are never overwritten. NOT ESTABLISHED how the profile store keys profiles.
3. A student under the age of consent, with a parent or guardian giving it.
4. A shared studio or school computer holding several students' profiles in one IndexedDB.
5. An installed app resumed after days (finding 4).
6. A first open of the day with no wifi (finding 5).
7. Withdrawing consent after a teacher holds a copy (finding 8).
8. A student who remeasures (finding 9).

## Could not establish

- What a voice profile contains, and how the store keys profiles (`profileStore.ts` not read).
- Whether any data file carries a schema field.
- Whether `vercel.json` or the host sets cache headers on `/data/` (not read), which changes finding 2.
- Whether a reload from the update notice keeps unsaved edits.
- Offline first open (finding 5), read and not run.
- Every legal point: PIPEDA, Law 25, minors, and biometrics, for Dann to confirm.

Tokens used: about 110k by my estimate; the runtime gave no counter. Stated cap 150k.

## Addendum, desk, 2026-10-20 22:3x: what the agent's returned text holds that the body above does not

The file on disk and the text the agent returned at completion differ; the runtime reports 118,890 subagent tokens against a stated cap of 150k (the returned text claimed about 40k). The additions, each with the evidence the agent gave, the desk having re-read the first two on this session's own earlier reads:
- CHANGES. A check on opening is not what `pollInterval: 0` gives: SvelteKit arms its first check only after one interval (`node_modules/@sveltejs/kit/src/runtime/client/utils.js:268`, `:297`), and with 0 no timer exists; app code must call `updated.check()` on mount and on return to the foreground (`updated` is imported at `apps/web/src/routes/+page.svelte:3`).
- CHANGES. The update notice's button deletes every `ilya-` cache and then reloads (`+page.svelte:4625-4633`); with no cache and no network, the worker's `cached || networkFetch` (`apps/web/static/sw.js:74-87`) has nothing to serve. Offline Refresh may blank the app. Read, not run. Recommendation: fetch the new shell first, delete caches only on success.
- CHANGES. Code and data already drift both ways: the manifest and dictionary files bypass the stale-while-revalidate branch (`sw.js:54`, `:68-71`) so an old build can load a NEW dictionary; the supplement lags one open.
- CONSIDER. Foreground checks fire on every app switch; limit to one per hour and never raise the toast during a calibration take or a reading (`PRODUCT.md:533`). A data-only release shows "A new version of Ilya is ready" (`apps/web/src/lib/i18n.ts:926`).
- CHANGES, Q2b. A stored voice carries name, formants, voice type, readiness, and the singer's intake answers (`apps/web/src/lib/voice/profileStore.ts:75-110`); an export is an allow-list shown field by field, with the existing name as the identifier. Imported voices on a teacher's device are marked "from <name>, received <date>", never active without a tap, and carry their own delete.
- Use cases named: an online lesson on the student's own microphone (conference audio distorts formants, so export is the only route); two teachers; a choir class of ten profiles on one device; a lost phone; a reverse flow (teacher sends a correction); recital week with no wifi, where Ilya must never ask the singer to update.
- Legal, for Dann to confirm, none read: the teacher becomes the collector and Ilya's consent text cannot bind them; Law 25 consent requested separately, parental consent under 14.
- NOT ESTABLISHED: `kit.version.name` default and whether a no-change redeploy toasts; Safari's eviction rules for home-screen apps; the 60-second poll's measured phone cost; whether any profile export exists today (none found beyond a dev-only harness download, `apps/web/src/lib/voice/capture-file.ts:5-17`).
