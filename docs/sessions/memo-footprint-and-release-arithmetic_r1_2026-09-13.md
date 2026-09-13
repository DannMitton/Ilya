# Memo: Ilya's footprint, and the arithmetic behind the release estimate

**Answers:** Dann's two questions of 2026-09-13, asked at the close of the prune
session: how big is Ilya, and how close is a fully working app.
**Instrument:** `du`, `stat`, `find`, and `gzip` run on the working copy at
`f2846db` through the device bridge, 2026-09-13. No build was run. Git was not
run except `ls-files` and `check-ignore`.
**Status:** measured, except where a line says NOT ESTABLISHED.

---

## 1. The three sizes, each answering a different question

| question | answer |
|---|---|
| what the deploy weighs on disk | **about 196 MB** |
| what a singer's first session costs | **roughly 12 to 22 MB over the wire** |
| what Dann has written | **5.6 MB** of app source, about 18 MB with `packages` and `docs` |

**The deploy, broken out.** App code and CSS 21 MB raw across 38 chunks, which
is **607,546 bytes gzipped**, measured by concatenating every `.js` and `.css`
under `build/_app` and piping through `gzip -c`. Static assets 9.8 MB:
`denigma_wasm_mnx.wasm` 4.4 MB, the four music fonts 2.0 MB, `pdfjs-wasm`
1.6 MB, the Guide's step images 1.3 MB, `reader` 312 KB, `images` 284 KB,
`icons` 32 KB. Dictionary JSON 166 MB.

**The dictionary compresses about fifteen to one**, which is why the wire figure
is two orders of magnitude under the disk figure.

| shard | raw | gzipped |
|---|---|---|
| `dictionary.86d83340-a.json` | 47,485,378 | 3,184,175 |
| `dictionary.86d83340-b.json` | 48,896,620 | 2,675,890 |
| `dictionary.86d83340-gloss-a.json` | 36,869,100 | 2,994,019 |
| `dictionary.86d83340-gloss-b.json` | 37,970,717 | 2,245,526 |
| `homographs.json` | 2,004,513 | 221,249 |

The English pair alone is **5.6 MB gzipped**; all four are **11.1 MB**.

**NOT ESTABLISHED, three things.** What the first paint actually pulls, because
the entry graph was not read, so 607 KB is a ceiling and not a first-load
figure. Whether the gloss pair is withheld in English mode: the manifest
separates `files` from `glossFiles`, which is suggestive and is not a reading of
the loader. What Vercel serves and at what compression, which cannot be measured
from here.

**A caution on comparison.** The record carries a bundle figure of 392,547 to
411,292 bytes gzipped from the `bits-ui` measurement of 2026-08-16. **Do not
read 607,546 against it as growth.** That measurement's basis is not stated in
the record and this one concatenates all 38 chunks, so the two may not be
measuring the same thing.

## 2. The dictionary exists four times on Dann's disk

Found with `find . -name 'dictionary.86d83340-a.json' -type f`, all four at
exactly 47,485,378 bytes.

| path | size | what it is |
|---|---|---|
| `data/` | 166 MB | the real one, tracked in git |
| `apps/web/build/data/` | 166 MB | build output, gitignored |
| `apps/web/.svelte-kit/output/client/data/` | 166 MB | build intermediate, gitignored |
| `.claude/worktrees/objective-wright-7aea5b/data/` | 166 MB | a leftover agent worktree |

**CORRECTION, recorded because the desk got it wrong first.** `build/data` was
reported to Dann as the symlink resolved rather than a copy. It is a real
directory: `ls -ld` shows `drwx`. What IS a symlink is
`apps/web/static/data`, pointing at `../../../data`, and SvelteKit dereferences
it at build time, which is how each build output comes to hold its own 166 MB.

**The leftover worktree is 167 MB and nothing needs it.** No agent can remove
it: `git worktree remove` is a write and the bridge refuses `rm`. It is Dann's
to delete, and whether it holds uncommitted work was not checked.

## 3. The whole 1.2 GB, accounted for

| | |
|---|---|
| `apps/web/.svelte-kit` | 218 MB |
| root `node_modules` | 239 MB |
| `apps/web/build` | 196 MB, of which 166 MB is the dictionary copy, so 31 MB of its own |
| `.claude/worktrees` | 167 MB |
| `data` | 166 MB |
| `tools` | 91 MB |
| `.git` | 90 MB |
| `docs` | 11 MB |
| `apps/web/static` | 9.8 MB |
| `apps/web/node_modules` | 5.0 MB |
| `apps/web/src` | 3.9 MB |
| `packages` | 1.7 MB |

**Sum: about 1,199 MB, which is the whole working copy.** Nothing is
unaccounted for. **664 MB of it, 55 %, is four copies of one dictionary, and
498 MB of that is recoverable.**

**Why 0.6 GB is not a fair figure for Ilya**, which is what Dann asked: it
matches `apps` at 432 MB plus `data` at 166 MB, and that sum double counts the
dictionary, because `apps/web/build` already holds a copy. No honest definition
of Ilya lands at 0.6 GB.

## 4. The release arithmetic

**A beta is available now and has been since 2026-08-21**, when the blocking set
emptied. That is `STATE.md` §THE TRACKER, not an estimate.

### 4.1 What is ruled and unbuilt, as counted off the record 2026-09-13

**This is a desk count, not a ruling, and the unit is loose:** an "item" here is
anything from one increment to several. Thirteen numbered items with specs and
no build (N.94, N.117 through N.124, N.125, N.126, N.127 increment 2, N.129).
Five remaining colour-story stages. Six release-order items, N.83 through N.88,
with N.82 and N.89 riding between. Four French strands: the table owed after
N.114, the 63 `!` and `;` sites, the three copy gaps needing new strings in both
languages, and N.82. Five known defects, of which the page printing white and
N.129's metrics both have their causes found. **Call it thirty-five units.**

### 4.2 The rate, which is the part that matters

**Fifteen new numbers arrived in seven days**, N.115 and N.116 on 2026-09-07,
N.117 on 2026-09-07 late, N.118 on 2026-09-09, N.119 to N.124 on 2026-09-10,
N.125 to N.127 on 2026-09-11, N.128 on 2026-09-12, and N.129 on 2026-09-13.

**Nine units closed in the same seven days**, counting increments as units:
N.113 walked 2026-09-07, N.114, N.114a, N.114b, the three path-pass increments,
N.128, and N.127 increment 1.

**Of the fifteen new numbers, exactly one closed inside the window**, N.128. So
the week ran roughly fourteen new against nine closed. **The queue grew faster
than it drained**, and the same is visible in the weeks before it.

### 4.3 The estimate. DESK INFERENCE, asked for expressly

Recent throughput is two to three units per session: four ships on 2026-09-12,
three path-pass increments across two days, N.114b's nine items across two.
Against thirty-five units that is **twelve to eighteen working sessions, so
three to six weeks at the current rate**. It is a range and it should be quoted
as one.

**The assumption that range rests on is that nothing new is numbered, and
§4.2 shows that assumption is false.** At last week's rate the project does not
converge on "done" regardless of how fast Code builds. **The release date is set
by when Dann stops numbering, not by throughput.**

### 4.4 The recommendation, from the singer's side

**Name a cut:** the list of items a first public Ilya contains. Freeze it. Move
every other number to a post-release file, the way `OPEN.md` now holds the
unstarted specs. At that point the three-to-six-week range becomes a real
forecast instead of an arithmetic exercise, and a singer gets a finished thing
rather than a better one later.

**Ilya forecasts, never declares.** The same discipline applies to its own
release: a date quoted without a frozen cut is a declaration.
