# Brief for Code, r1: two small fixes to how a song saves

Written by the desk 2026-09-25 while Dann was away. **DESK DEFAULT: both are reversible and neither changes what a singer sees on the page. Run when Dann says go.** The evidence is `docs/sessions/memo-desk-code-reading_r1_2026-09-25.md`, sections 3 and 4.

## Fix 1. Opening a song must not save it

**The defect:** `keepSurvivingGlosses` (`apps/web/src/routes/+page.svelte:2927-2941`) always assigns two new `Map`s to `doc.glossOverrides` and `doc.glossAnchors`. It runs at the end of every `transcribeText()` (`:2619`), including the one at boot. The document's autosave effect (`apps/web/src/lib/library/document.svelte.ts:154-189`) sees a new `Map` as a change and schedules a write, which stamps `updatedAt` (`library.ts:342`). So every load saves an unchanged record with a new timestamp. This is the "`updatedAt` about seven seconds after every load" row in `docs/memory/OWED.md`.

**The change:** assign the two maps only when an entry was dropped. The function only removes entries, so comparing sizes is enough. Keep the existing comment, and add one line saying why the assignment is conditional.

**Also look:** does `transcribeText` reassign any other `$state` field with an equal value? Report each one you find and fix none of them in this brief.

**Done when:**
- A vitest shows that `keepSurvivingGlosses` leaves both maps as the same objects when every gloss survives, and replaces them when one is dropped. If the function cannot be reached from a test where it lives, say so and propose where it should move. Do not move it in this brief.
- On the alias, open a song, wait 15 seconds, and read its record's `updatedAt` from IndexedDB before and after. It must not change. **State your expectation before you measure**, per CONTRACT §5, THE CONTROL RULE.

## Fix 2. Another tab's save must not overwrite an edit made while it loads

**The defect:** `#onRemoteWrite` checks `this.#scheduler.isPending()` (`document.svelte.ts:303`), then awaits `this.#library.load(this.id)` (`:307`), then calls `this.#apply(loaded.record)` (`:312`) without checking again. An edit made during the await schedules a save. The remote record is then applied over the edit, and the scheduled save writes the remote content. The singer's edit is lost without notice.

**The change:** after the await, check `isPending()` again. If it is true, set `this.remoteChange` exactly as the first check does (`:304`) and return without applying.

**Done when:** a vitest with a fake library whose `load` resolves on demand shows the following. A local edit made between the message and the load's resolution survives, and `remoteChange` is set. With no local edit, the record is applied as before.

## Both

- All five gates at baseline.
- A memo of ten lines or fewer in `docs/sessions/`: the diffs, the tests, the IndexedDB before and after, and a section titled "NOT ESTABLISHED". **NOT ESTABLISHED beats a complete invented answer.**
