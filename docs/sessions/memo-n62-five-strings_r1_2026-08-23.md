# MEMO. N.62: the five strings that still reached a screen reader in English

Written 2026-08-23 by Code (Opus 5), against branch `Shane` at floor `b54be1a`.
The tree was clean at the floor apart from the brief itself, which was
untracked. Nothing was committed and no git command that writes was run.

The brief is `docs/sessions/brief-n62-five-strings_r1_2026-08-23.md`. All five
rows are done, all five gates run for real on Dann's machine, and the bundle was
built clean twice.

## Gate 4's number, before the ship script runs

**Gate 4 (web-test) is now 725, up from the baseline of 724.** One test was
added. `~/Downloads/ilya-ship.sh:79` still expects `724 passed (724)` and will
abort gate 4 until Dann moves it.

All five, run here after every edit:

| gate | expected | got |
|---|---|---|
| 1 phonology | `216 passed (216)` | 216 passed (216) |
| 2 dictionary | `235 passed (235)` | 235 passed (235) |
| 3 web-check | `found 0 errors and 7 warnings in 4 files` | 0 errors, 7 warnings, 4 files |
| 4 web-test | `724 passed (724)` | **725 passed (725)**, 41 files |
| 5 score-parser | `444 passed \| 5 skipped (449)` | 444 passed, 5 skipped (449) |

Nothing failed on the way. Gate 3's warning count did not move.

## The anchors after the edit

Every line number below is the same as at the floor. Each edit replaced one
line with one line, so nothing shifted.

**The dictionary**, `apps/web/src/lib/i18n.ts:48-64`, a new
`── Accessible names (N.62) ──` block placed directly after `drawer.pull`,
which is the file's existing precedent for a key that exists only as an
accessible name:

| line | key | en | fr |
|---|---|---|---|
| `i18n.ts:61` | `a11y.drawer` | `Controls` | Commandes |
| `i18n.ts:62` | `a11y.tocToggle` | `Expand or collapse` | Développer ou réduire |
| `i18n.ts:63` | `a11y.tabs` | `Navigation` | Navigation |
| `i18n.ts:64` | `a11y.paper` | `Transcription` | Transcription |

Written as literal accented characters, not `é` escapes, matching the
`drawer.*` and `tab.*` entries they sit beside. No guillemets. Rows 3 and 4 are
keyed with identical `en` and `fr` values, the way `tab.transcription` is.

**The call sites:**

| row | anchor | now reads |
|---|---|---|
| 1 | `Drawer.svelte:299` | `aria-label={t('a11y.drawer', language)}` |
| 2 | `Drawer.svelte:365, 384, 401, 419, 435, 454, 473, 520, 542, 561, 571, 582` | `aria-label={t('a11y.tocToggle', language)}` |
| 3 | `DeskHead.svelte:98` | `aria-label={T('a11y.tabs')}` |
| 4 | `Paper.svelte:63` | `aria-label={t('a11y.paper', language)}` |
| 5 | `InspectorPanel.svelte:1039` | `'Modifier la glose'` |

`DeskHead.svelte` uses its own `T = (key) => t(key, language)` helper, declared
at `DeskHead.svelte:36` and already used by every other string in that file.
`Paper.svelte:4` changed from `import type { Language }` to
`import { t, type Language }`. `Drawer.svelte` and `DeskHead.svelte` needed no
import change. `InspectorPanel.svelte:1039` keeps its inline ternary, untouched
apart from the one character.

## Row 2 is twelve, and there is no thirteenth

`command grep -c 'aria-label="Toggle"' Drawer.svelte` at the floor returned
**12**, and the twelve line numbers matched the brief's list exactly, in order.
The brief's correction to the memo stands.

I then searched `apps/web/src` and `packages` for the word `Toggle` in any
`.svelte` or `.ts` file, discarding `toc.toggle` and `handleToggle` call sites.
What remains is `inspector.yoToggle` at `i18n.ts:192`, which is the `ё ↔ е`
key and already bilingual by identity. **No thirteenth chevron exists.** I did
not invent one.

## The test

**One file, one test.** `apps/web/src/lib/i18n.test.ts`, new. There was no
existing i18n test file to add to; the brief assumed one. I created it rather
than parking the assertion in an unrelated file.

- Describe: `N.62 accessible names`
- Test: `speaks the ratified French, and never [MISSING, for all four keys`

It holds the four ratified pairs as a literal table copied from the brief, not
read back out of `i18n.ts`, and asserts for each key that `t(key, 'fr')` and
`t(key, 'en')` equal the ratified values and contain no `[MISSING`. The
`[MISSING` assertion is separate from the equality one on purpose: it is the
string `t()` prints for an absent language variant, and an `a11y.*` slot with no
French would be read aloud as that literal.

`vitest.config.ts` at the repo root only covers `tests/**`; the web lane's
include is `src/**/*.{test,spec}.{js,ts}` at `apps/web/vite.config.ts:14`, so
the new file is picked up by gate 4 and by nothing else.

**No existing test pinned any of the five English strings.** I searched every
`.test.ts` in the tree for `aria-label`, `Controls`, `Toggle`, `Navigation`,
`Transcription`, `Edit gloss`, and `glose`, and found nothing. So nothing was
updated; one test was added, and gate 4 moved by exactly one.

## The grep

```
command grep -rn 'aria-label="Controls"\|aria-label="Toggle"\|aria-label="Navigation"\|aria-label="Transcription"\|le glose' apps/web/src
```

**Returns nothing, exit 1.** Run with the real `/usr/bin/grep`, and again
through the session's shell function, with the same result.

One extra edit was needed to get there. `Drawer.svelte:324` sits inside the
N.73 S3 comment and quoted the markup verbatim as
`` `<aside aria-label="Controls">` ``. That is a source comment, not visible
text, but it both matched the grep and had just been made false by row 1. It now
reads `` `<aside>` named `a11y.drawer` ``, which is what the element says today.

## The bundle byte count

Clean rebuilds both times: `rm -rf apps/web/build apps/web/.svelte-kit/output`
before each. The before figure is a real build of the floor, taken before any
file was touched, not a figure from memory.

| measure | before | after | delta |
|---|---|---|---|
| all client JS under `build/_app` | 1,769,923 | 1,770,701 | +778 |
| whole `build/` tree | 203,307,542 | 203,308,320 | +778 |

The `CACHE_VERSION` stamp is thirteen digits in both builds, so it is not
confounding the delta. `build/` and `.svelte-kit/output` were deleted again
afterwards, so nothing from either build is in the tree.

The +778 is the four dictionary entries plus fifteen call sites, twelve of them
identical. I did not decompose it further. The chunk carries `a11y.tocToggle`
thirteen times, once as the key and twelve times as a call, and `a11y.drawer`
twice, once as the key and once as a call, which is the count the source
predicts.

## What Dann has to do

1. **Move the baseline at `~/Downloads/ilya-ship.sh:79` from 724 to 725.** The
   script aborts gate 4 otherwise, and stages nothing when it does.
2. **`git add` the two untracked files** before running the script, which
   refuses outright on any untracked file: `apps/web/src/lib/i18n.test.ts` and
   the two session documents, `brief-n62-five-strings_r1_2026-08-23.md` and this
   memo. The brief was already untracked when I opened.

## A trap worth recording

**This session's shell `grep` is a `ugrep` shim carrying `--ignore-files`, so it
honours `.gitignore` and silently skips `apps/web/build`.** Four separate
searches of the built bundle came back empty and looked like a real finding: the
French was apparently not in the build at all. It was. Every string was in
`_app/immutable/chunks/`, and a twenty-line Python walk over the same directory
found all of them at once.

**When the question is what is in the built bundle, do not use the shell's
`grep`.** Use `command grep`, or walk the tree in Python. An empty result over
an ignored directory is not evidence.

## What I could not establish

- **Whether a French screen reader actually speaks these four names well.** The
  gates prove the right string reaches the attribute. Nobody has listened. A
  render-and-read with VoiceOver in French is the only real test, and it is not
  a test this lane can run.
- **Whether `Transcription` is still the right name for the paper region.** The
  enumeration memo flagged that this region now also carries Fit, Learn, and
  Guide, and called the name a ruling rather than a translation. The brief
  ratified `Transcription` in both languages, so that is what shipped. The
  ruling is still open and is Dann's.
- **Whether any accessible name is built in script from an English literal on a
  different line.** The enumeration memo raised this and I did not close it. My
  work was confined to the five ratified rows.
- **Whether `watchEntryLine` prints English.** Out of scope by the brief, which
  put `watchlist.ts` and `VoiceProfilePane.svelte` off limits. Still open, still
  unnumbered.

NOT ESTABLISHED beats a complete invented answer.
