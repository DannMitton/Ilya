# Brief: N.146 step 2b, the guard waits for the dictionary

**This brief is the desk's. Do not edit, rename, or replace it.** Write your
account in the memo it asks for.

Revision 1, 2026-09-17. Written at the desk. Build in Claude Code, in the same
working tree as step 2, **before step 2 ships.**

**Read first, in full:** `docs/sessions/memo-n146-step2-ocr-guard_r1_2026-09-17.md`
(your own). The desk read it and accepts every decision in it. This brief adds
one thing.

---

## The fault, found by the desk in the tree

Your memo lists "whether the dictionary is guaranteed loaded before a photo
can be dropped" as NOT ESTABLISHED and calls it pre-existing. **It is not
pre-existing in its effect.** The desk read:

- `packages/phonology/src/engine.ts:122`: `STRESS_DICTIONARY` starts as `{}`.
  `lookupStress` reads it at `:741`, `:756`, and `:773`.
- `apps/web/src/lib/loader.ts:655`: `setStressDictionary` runs only after every
  dictionary file has been fetched and merged.
- `apps/web/src/routes/+page.svelte:2882-2887`: "A 'NOT YET' IS NOT A 'NO'. At
  boot the poem is restored before `loadDictionary` finishes, and a singer can
  type into the field while it is still loading."

So a singer who drops a real poem photo while the dictionary is still loading
(a first visit, or a slow device) gets every token looked up in an empty
dictionary. The guard sees 100% unknown and shows "No text recognised in
image." **That sentence is false**, and before step 2 the same drop worked.
The pipeline only degrades while it waits (VERIFY badges). The guard refuses.

## What to build

**The guard never judges against a dictionary that has not loaded.** If a
reading reaches the guard before the dictionary is ready, Ilya keeps the busy
state it is already showing and waits for the dictionary, then judges. Nothing
new is shown and no string is added.

- Find how the page already knows the dictionary is ready (`LoaderState`,
  `transcribeWhenDictionaryReady`, or whatever the tree uses) and bring that
  signal to `ScoreUploader.svelte` the way the tree already passes state to it.
  Do not open a second loader and do not start a second load.
- The text-layer path is unchanged: it is not guarded, so it does not wait.
- If the dictionary load **fails** outright, do not refuse the reading on that
  account: let the reading through as a poem, as before step 2, and say in the
  memo where that branch lives. DESK DEFAULT: a failed load is not evidence
  that the page is garble.
- Keep the decision testable: a pure test that a "not ready" dictionary never
  produces `unreadable`.

## Check it live

State your expectation first. In the dev app, with the dictionary not yet
loaded (a fresh browser profile, or network throttling, whichever the tree's
dev setup allows; say which), drop a PNG you render from page 1 of
`~/Downloads/walk-n146-poem-scan.pdf` (a picture, so it reaches OCR and the guard).
**Expected:** the busy state holds until the dictionary is ready, then the six
lines fill the field. Then repeat step 2's two checks with the dictionary
loaded: the scan PDF fills the field, and the photo shows "No text recognised
in image."

**Do not clear website data in Dann's own browser.** His readings live there.

## Definition of done

1. A real poem picture dropped before the dictionary is ready fills the field
   once it is ready.
2. Step 2's two checks still hold.
3. All five gates green. web-test baseline is now **1244**; report the new
   count.
4. Walked by Dann. **WRITTEN is not DONE.**

## What to return

Append a section headed `## Step 2b` to your step 2 memo, not a new memo:
what changed by file and line, your expectation before each check and the
result, the gate table, **what you could not establish** (NOT ESTABLISHED
beats a complete invented answer), and any decision this brief did not settle,
marked as yours and reversible. Update the memo's list of files to `git add`.

**No git command that writes: no `add`, `commit`, `push`, `checkout`, `reset`,
`restore`, `clean`, `stash`, `rm`, `mv`, `merge`, `rebase`, or `tag`.**
