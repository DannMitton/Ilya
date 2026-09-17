# Memo: N.146 step 2, Ilya refuses a reading that is not Russian

Reply to `brief-n146-step2-ocr-guard_r1_2026-09-17.md`, read in full. Built in
Claude Code, 2026-09-17.

---

## Step 0. Measurement and the signal chosen

**Expectation before measuring:** the clean scan would read almost perfectly
(the brief already named its one wrong letter) and the photo would read as
the walk's own garble; the open question was only whether a single, uniform
"share of tokens the dictionary can't find" would separate the two with
enough room to trust, or whether short one- and two-letter tokens would blur
that line by matching real short Russian words at random.

**What was measured.** `tesseract.js`'s `createWorker('rus')` /
`worker.recognize()` -- the exact call at `ScoreUploader.svelte:392-396` --
was run in Node on both walk files. The photo went in as-is; the PDF was
rasterized to a 3400x4400 PNG at 400 DPI first (`pdftoppm -r 400`, not the
app's own `pdfjs-dist` rasterizer -- see "Not established" below), matching
the app's own `TARGET_DPI` (`page-pdf.ts:47`).

| file | time | reading |
|---|---|---|
| `walk-n146-poem-scan.pdf` (rasterized) | 865ms | The six Pushkin lines, one wrong letter: `Го` for `То` (line 6) -- exactly as the brief reported from the walk. |
| `walk-n146-poem-photo.jpg` | 2348ms | 82 lines, 308 whitespace-split words, beginning `ОАК ИИ ае ОЕ` -- the walk's own garble, reproduced. |

Both raw OCR outputs are now real fixture files in the repo (see "What
changed," below); this table's readings are exactly what is in them.

**The signal.** Ilya's real dictionary (`data/dictionary.86d83340-{a,b}.json`,
943,106 entries; `data/singer-supplement.json`, 271 entries) was loaded into
a real `GraysonEngine` in Node (`setStressDictionary` / `setSingerSupplement`,
the same injection `loader.ts` performs at app startup), and every reading was
tokenized as **maximal runs of Cyrillic letters** (`/[а-яёА-ЯЁ]+/g` --
punctuation, digits, and Latin OCR noise are not word tokens at all) and
checked with `GraysonEngine.lookupStress(token) !== null`. This is the same
first lookup `pipeline.ts`'s own `processText` makes (`pipeline.ts:601`),
before its further poetic-forms retry -- see "Decisions," below, for why that
retry was not replicated here.

This is a stronger, more honest test than `stressSource`: the brief's own
reading of `pipeline.ts:644` and `:656-661` is right that `'inferred'` fires
on two different paths (an unresolved pre-reform spelling, and no lookup and
no `ё`), and neither is "not a word in the dictionary" on its own --
`findYoSyllable` can mark a word as having dictionary-grade stress
(`yoSource`) without `lookupStress` ever having matched it. A direct
`lookupStress(token) !== null` has no such conflation: it says only what it
is asked, whether the token is an entry (or resolves to one via the
dictionary's own е-restoration) at all.

**Watching the short tokens**, per the brief: every reading was also scored
counting ALL tokens (no length filter), and by minimum token length 1
through 5:

| min length | scan: unknown | photo: unknown |
|---|---|---|
| >= 1 (every token) | 0/36 = 0.0% | 156/291 = **53.6%** |
| >= 2 | 0/32 = 0.0% | 156/243 = 64.2% |
| >= 3 | 0/26 = 0.0% | 114/167 = **68.3%** |
| >= 4 | 0/20 = 0.0% | 82/101 = 81.2% |
| >= 5 | 0/16 = 0.0% | 61/65 = 93.8% |

The scan is 0% unknown at every threshold. The photo's unknown share climbs
monotonically as short tokens are dropped -- direct evidence that short
tokens dilute the signal rather than sharpen it: among the photo's own
one- and two-letter fragments, 66.1% still landed on a real dictionary
entry by the alphabet's own letter frequency (`о`, `и`, `с`, `ы`... are
themselves words), not because the garble was secretly readable. `го`, for
instance -- the misread `Го` in the clean scan's own line 6 -- is itself a
real dictionary entry (`{"s":0,"e":"go","f":"go","p":"noun","l":"го"}`,
Russian gamer slang for "go"), which is exactly the kind of accident a
length filter is protecting the signal against, not a sign that stress
lookup is broken.

**Chosen: word tokens of at least 3 Cyrillic letters; tokens shorter than
that count for nothing, in neither direction.** They are extracted (so a
picture that is nothing but short noise still tokenizes to nothing checkable)
but excluded from both the numerator and the denominator of the share.

**The cutoff is Dann's own word for the ruling: "mostly not Russian words."**
A reading is refused only past a **strict majority unknown** among its
length->=3 word tokens -- `unknownShare > 0.5`, not `>=`. Exactly half known
and half not is not "mostly" anything, and passes; this is stated and
tested (`ocr-guard.test.ts`, "exactly half known, half not: passes").

**The margin**, on the >=3 signal: the scan sits 50 percentage points below
the cutoff (0.0%), the photo sits 18.3 points above it (68.3%). Counting
every token instead (no length filter) would have left only an 8-point
margin on the photo's side (53.6% against a 50% cutoff) -- the length filter
is not cosmetic, it is what makes this cutoff safe to trust rather than a
coin flip on this one photo.

---

## Step 1. What changed, by file

- **`apps/web/src/lib/shane/ingestion/ocr-guard.ts`** (new, 75 lines).
  `wordTokens` (the >=3-Cyrillic-letter tokenizer), `unknownWordShare` (the
  share, or `null` where there is nothing to check), and
  `passesRussianGuard` (the cutoff, `false` when `unknownWordShare` is `null`
  -- a reading with not one checkable word is not evidence of Russian text,
  it is the absence of any, so it is refused rather than passed by default).
  Pure: `isKnownWord` is a parameter, not a dependency.
- **`apps/web/src/lib/shane/ingestion/poem-or-score.ts`**: `decidePoemOrScore`
  (`:48`) takes a new second parameter, `isKnownWord: (token: string) =>
  boolean`. The OCR branch (`:58`) now reads
  `outcome.ocrText.trim() !== '' && passesRussianGuard(outcome.ocrText,
  isKnownWord)`; a reading that fails the guard falls through to the
  existing `{ kind: 'unreadable' }`, coining nothing new. The text-layer
  branch is untouched -- not guarded, per the brief.
- **`apps/web/src/lib/pipeline.ts`** (`:254-262`, new `isKnownWord` export).
  `ScoreUploader.svelte` has no door of its own to `@ilya/phonology` --
  `pipeline.ts`'s own header names it "the ONLY place in the app that
  imports from @ilya/phonology" -- so the guard's real dictionary connection
  is one line in the file that already owns that import:
  `GraysonEngine.lookupStress(word) !== null`. No new architectural door was
  opened; the existing one grew one more export.
- **`apps/web/src/lib/shane/ScoreUploader.svelte`**: imports `isKnownWord`
  from `$lib/pipeline` (`:78`); the one call site (`:410`,
  `readAsPoemByOcr`) now passes it as `decidePoemOrScore`'s second argument.
  One doc comment (`:366-368`) gained one clause naming the guard; nothing
  else in that function changed.
- **`apps/web/src/lib/shane/ingestion/ocr-guard.test.ts`** (new, 89 lines,
  14 tests): `unknownWordShare` and `passesRussianGuard` against hand-built
  stubs for every branch (all known, all unknown, short tokens excluded in
  both directions, no checkable token at all, punctuation/Latin/digit noise
  is not a token), AND against the walk's own two real readings (below).
- **`apps/web/src/lib/shane/ingestion/poem-or-score.test.ts`** (existing 11
  tests updated to the new signature, 3 new): a text layer is never guarded
  even against a stub that knows nothing; an OCR reading the guard refuses
  is `unreadable`; an OCR reading the guard passes is a poem, as before.
  Five pre-existing cases used placeholder English text (`'ocr text'`) as
  OCR content for branches unrelated to the guard itself; since the guard's
  tokenizer only recognises Cyrillic, these were changed to a short Cyrillic
  placeholder (`'слова'`) so they still reach the branch they are testing.
- **`apps/web/src/lib/shane/ingestion/__fixtures__/`** (new directory, 3
  files): `walk-scan-ocr.txt` and `walk-photo-ocr.txt`, the ACTUAL
  `tesseract.js` output captured in step 0 (not retyped by hand, per the
  brief -- copied by a script directly from the OCR call's own return value);
  and `walk-lookup.json`, every token from both readings' REAL verdict from
  `GraysonEngine.lookupStress` against the live dictionary, generated once by
  a throwaway script and frozen so `ocr-guard.test.ts` needs neither the
  90MB dictionary nor a live lookup to test against the walk's real garble.

**No new i18n strings.** No mark, label, or notice was added to the page.
The picture's existing two-language refusal (`ScoreUploader.svelte:419-420`)
is the only thing a refused reading now shows, exactly as before N.146 step
2 -- the guard changes when that message can fire, never its wording.

---

## Expectation before each check, and the result

1. *`walk-n146-poem-scan.pdf` still fills the input field.* Expected yes:
   its own reading is 0% unknown at every token-length threshold, nowhere
   near the 50% cutoff. **Confirmed live**: dropped onto the running app
   (`pnpm --filter @ilya/web dev`), it filled the input field with the six
   Pushkin lines (36 words, 6 lines), unchanged from N.146.
2. *`walk-n146-poem-photo.jpg` shows "No text recognised in image.", and
   neither the input field nor Repertoire changes.* Expected yes: its own
   reading is 68.3% unknown on the >=3 signal, past the cutoff. **Confirmed
   live**, same running app: the drop showed exactly "No text recognised in
   image.", the input field stayed empty, and Repertoire kept its one
   existing song (from the scan drop moments before) with no second,
   garbled entry added.
3. *The step 0 table and the cutoff, with its margin, are in the memo.*
   Done, above.
4. *All five gates green.* See below.
5. *Walked by Dann.* Not this session's to do.

---

## Gates

| gate | baseline | this ship |
|---|---|---|
| phonology | 216 passed (216) | 216 passed (216), unchanged |
| dictionary | 235 passed (235) | 235 passed (235), unchanged |
| web-check | 0 errors, 8 warnings, 5 files | 0 errors, 8 warnings, 5 files, unchanged |
| web-test | 1227 passed (1227) | **1244 passed (1244)**: +17, all new (14 in `ocr-guard.test.ts`, 3 in `poem-or-score.test.ts`) |
| score-parser | 567 passed, 5 skipped (572) | 567 passed, 5 skipped (572), unchanged |

Only web-test moved, and only by the tests this ship added. `ilya-ship.sh`'s
baseline (per the N.146 memo, its own `:82` line) needs moving from
`"1227 passed (1227)"` to `"1244 passed (1244)"` before the next ship -- the
desk's own to move, per the brief.

The ship script itself was not run (untracked files are present: this brief
and memo, and this file's own new fixtures); each gate above was run
directly: `pnpm test:phonology`, `pnpm test:dictionary`, `pnpm -C . --filter
@ilya/web check`, `pnpm -C . --filter @ilya/web test`, `pnpm -C . --filter
@ilya/score-parser test`.

---

## NOT ESTABLISHED

- **The PDF's rasterization tool, in step 0's OFFLINE measurement, was not
  the app's own.** `pdftoppm` (poppler) was used to turn the scan PDF into a
  PNG at the app's own 400 DPI, rather than driving `pdfjs-dist` headlessly
  in Node (which needs a DOM canvas and was judged not worth building for a
  one-page measurement). The OCR call itself -- `tesseract.js`,
  `createWorker('rus')` -- was identical. This caveat does not reach item 1
  of the definition of done: the LIVE walk in the running app used the
  app's own real `rasterizePdf`, end to end, with no substitution.
- **Only two real readings were available**, one clean and one the walk's
  own worst case. No further real photographed poems (different tilt,
  lighting, or camera) and no further clean scans were available to test
  where, between 0% and 68.3% unknown, a real borderline case would land.
  The cutoff and its margin are real numbers against real fixtures, not
  invented ones, but they rest on two points, not a corpus.
- **The guard's `isKnownWord` does not replicate `pipeline.ts`'s own
  poetic-forms retry** (`normalizePoetic` candidates, tried when a direct
  `lookupStress` misses) -- see "Decisions," below. Neither fixture needed
  it; whether a real archaic-orthography poem would trip the guard on this
  account is not established.
- **Whether the dictionary is guaranteed loaded before a photo can be
  dropped in a freshly opened tab** was not independently tested this
  session. This is not a new risk the guard introduces: `pipeline.ts`
  already depends on the same injected dictionary state for every stress
  mark it draws, so a cold-load race would already be a pre-existing
  question for the whole app, not a new one for this guard.

---

## Decisions this brief did not settle, marked as mine and reversible

- **The minimum token length, 3.** The brief asked for a decision on short
  tokens and a stated reason; 3 was chosen because it is where the photo's
  own unknown share (68.3%) first clears the cutoff (50%) with a
  double-digit margin (18.3 points), while the scan stays at 0% unknown at
  every length tried. Reversible: `MIN_TOKEN_LENGTH` in `ocr-guard.ts`.
- **The cutoff, exactly 0.5, and its tie-break (a tie passes).** Chosen to
  track Dann's own word, "mostly," literally: a strict majority, not a
  simple majority-or-tie. Reversible: `MAX_UNKNOWN_SHARE` in `ocr-guard.ts`.
- **No checkable word at all (`unknownWordShare` returns `null`) refuses,
  rather than passing by default.** The brief did not name this case. I
  judged that a reading with zero tokens of 3 Cyrillic letters or more is
  not weak evidence FOR Russian text, it is no evidence at all, and treating
  "nothing to check" as "nothing wrong" would leave a hole exactly where an
  all-noise photo (all fragments under 3 letters) would otherwise slip past
  the guard untested. Reversible: one line in `passesRussianGuard`.
- **`isKnownWord`'s wiring goes through `pipeline.ts`, not a new import in
  `ScoreUploader.svelte`.** `pipeline.ts`'s own header names it the app's
  sole importer of `@ilya/phonology`; I read that as a standing rule the
  brief did not ask me to revisit, and added one function there rather than
  a second door into the package. Reversible if the desk disagrees:
  `ScoreUploader.svelte` could import `GraysonEngine` directly instead, at
  the cost of that guardrail.
- **Token definition: maximal Cyrillic-letter runs by regex, not a
  whitespace split with punctuation stripped.** This means punctuation fused
  to a word by OCR (`«Кан`, `д?`) still yields a clean token (`Кан`, `д`) at
  the boundary, rather than a token still carrying the mark. Reversible:
  `wordTokens`'s own regex in `ocr-guard.ts`.

---

## Files to `git add` before shipping (new, not yet tracked)

- `apps/web/src/lib/shane/ingestion/ocr-guard.ts`
- `apps/web/src/lib/shane/ingestion/ocr-guard.test.ts`
- `apps/web/src/lib/shane/ingestion/__fixtures__/walk-scan-ocr.txt`
- `apps/web/src/lib/shane/ingestion/__fixtures__/walk-photo-ocr.txt`
- `apps/web/src/lib/shane/ingestion/__fixtures__/walk-lookup.json`
- `docs/sessions/memo-n146-step2-ocr-guard_r1_2026-09-17.md` (this file)
- `docs/sessions/brief-n146-step2b-wait-for-dictionary_r1_2026-09-17.md` (the
  desk's own, named here only so it ships alongside; not mine to add on its
  own account)

---

## Step 2b

Reply to `brief-n146-step2b-wait-for-dictionary_r1_2026-09-17.md`, read in
full. Built in Claude Code, 2026-09-17, in the same working tree as step 2,
before it ships.

### The fault, confirmed

The desk is right, and the tree bears it out exactly as read:
`STRESS_DICTIONARY` starts as `{}` (`packages/phonology/src/engine.ts:122`),
`setStressDictionary` runs only once `loadDictionary` has fetched and merged
every file (`loader.ts:655` in the pre-step-2b tree), and `+page.svelte`
already has a private mechanism for this exact problem
(`transcribeWhenDictionaryReady`, a local `$state` flag spent by an `$effect`
watching `loaderState` alone) that nothing outside `+page.svelte` could
reuse -- confirmed by grep: no exported store, no promise, no
`dictionaryReady` signal anywhere in the tree. Every consumer that needs to
know is handed a `LoaderState` as a prop instead (`IntakePanel`,
`AnalysisStation`); `ScoreUploader.svelte` was not one of them before this
step.

### What changed, by file

- **`apps/web/src/lib/shane/ingestion/ocr-guard.ts`** (`:87-133`, two new
  exports, no change to step 2's own three). `DictionaryGuardMode` (`'wait' |
  'skip' | 'judge'`) and `dictionaryGuardMode(state)` (`:102-109`): `state`
  is kept structural -- `{isLoading, error, entryCount}` -- rather than
  importing `loader.ts`'s own `LoaderState`, so this file still has no
  dependency on the loader, only on the three fields its decision needs.
  `isKnownWordForGuard(mode, isKnownWord)` (`:128-133`): the `isKnownWord` to
  actually call `decidePoemOrScore` with, for a given mode -- `isKnownWord`
  unchanged for `'judge'`, an always-true stub for `'skip'` (the DESK
  DEFAULT: a failed load is not evidence of garble) AND for `'wait'` (the
  pure safety net named below).
- **`apps/web/src/lib/shane/ScoreUploader.svelte`**:
  - New prop, `loaderState: LoaderState` (`:129`), imported from `$lib/loader`
    (`:61`) -- the SAME object `+page.svelte` already owns and already hands
    to `IntakePanel` / `AnalysisStation`. No second loader, no second load.
  - `dictionaryWaiters` (`:312`, new), a persistent top-level `$effect`
    (`:314-321`) that watches `loaderState` and, the moment
    `dictionaryGuardMode` stops reading `'wait'`, spends every parked
    resolver (inside `untrack`, matching `+page.svelte`'s own
    `transcribeWhenDictionaryReady` effect's own use of `untrack` for the
    identical reason: reading `loaderState` is the effect's only real
    dependency). `waitForDictionaryGuard()` (`:326-334`): resolves at once
    if the dictionary already has a verdict, otherwise resolves the moment
    it does.
  - `readAsPoemByOcr` (`:454-467`): once OCR returns non-empty text, it now
    `await waitForDictionaryGuard()` BEFORE computing `mode` and calling
    `decidePoemOrScore` with `isKnownWordForGuard(mode, isKnownWord)` in
    place of the bare `isKnownWord` step 2 passed. Empty OCR text skips the
    wait entirely -- `decidePoemOrScore`'s own empty check refuses it either
    way, with no guard verdict worth waiting for. `ui` is untouched
    throughout: the busy label already showing (`intake.picture.reading`)
    is the only thing on screen for the whole wait, exactly the brief's
    "nothing new is shown."
  - Two doc comments gained one clause each (`:123-128` on the new prop,
    `:415-416` on `readAsPoemByOcr`'s own header) naming the new wait;
    nothing else in either comment changed.
- **`apps/web/src/routes/+page.svelte`** (`:4408`, one line): the
  `<ScoreUploader>` instantiation gained `{loaderState}`, the same shorthand
  `IntakePanel` and `AnalysisStation` already receive it with. Nothing else
  in this 4000-plus-line file was touched.
- **`apps/web/src/lib/shane/ingestion/ocr-guard.test.ts`** (89 -> 136 lines,
  9 new tests): `dictionaryGuardMode` against every state combination named
  in the brief, including the impossible-today `!isLoading, !error,
  entryCount === 0` case (treated as `'wait'`, the safe default); and
  `isKnownWordForGuard` against `'judge'`, `'skip'`, and `'wait'`. The LAST
  of these is the brief's own required pure test, and it is genuinely
  callerless: **`passesRussianGuard(photoOcr, isKnownWordForGuard('wait',
  NEVER_KNOWN))` is `true`** -- the walk's own garble, fed through the
  `'wait'` mapping, still cannot make the guard refuse. This holds
  independent of whether `ScoreUploader.svelte`'s own wait is ever reached
  at all: a caller that mistakenly judged during `'wait'` would still fail
  OPEN, not closed.

**No new i18n strings, no new mark or label** -- the brief's own
requirement, held: the busy state already on screen before this step is the
only thing a singer sees while the guard waits.

### Expectation before each check, and the result

**Method, stated as the brief asked**: neither a fresh browser profile nor
network throttling was used. `loader.ts`'s own `loadDictionary` was given a
TEMPORARY `await new Promise(r => setTimeout(r, N))` right after its first
`onStateChange` call (still `isLoading: true`, so `dictionaryGuardMode` reads
`'wait'` for the whole delay), for exactly as long as it took to observe the
behaviour, then reverted -- confirmed by `git diff apps/web/src/lib/loader.ts`
showing no change before any gate below was run. A fresh-profile or
throttled test was tried first and abandoned: this dev server's own
`copy-reader.mjs` (run by `pnpm dev` at every restart) wipes and
regenerates `apps/web/static/reader/`, clobbering a staged test fixture
placed before the server starts; and `indexedDB.deleteDatabase('ilya-data')`
kept coming back `'blocked'` against the same tab's own open connection to
its dictionary cache, so a genuinely cold IndexedDB was not reliably
reachable inside one browser tab without closing and reopening it in ways
this session's tools do not cleanly support. A stated, reverted delay in the
one function that owns this timing answered the same question honestly and
was verifiable by diff.

1. **Expected**: with the delay in place, dropping a picture (a PNG
   rendered from the scan PDF's own page 1, via `pdftoppm`, since the brief
   asked for a picture so the drop reaches OCR and the guard directly)
   would show the SAME busy label OCR already shows, with no change and no
   error, for as long as the delay ran -- then resolve to the six lines.
   **Result, confirmed live**: with the delay set to 300 seconds, the drop
   showed `"Reading the words out of the picture…"` at ~39 seconds after
   page load and STILL showed it, unchanged, with no `"No text
   recognised"` and no `"OCR processing failed"`, at ~60 seconds -- 21
   seconds of continuous, unresolved busy state under a delay nowhere near
   done. With the delay set to 6 seconds, the same drop showed the six
   lines within ~6 seconds of the wait's own resolution, matching the field
   before OCR ever needed to wait for anything.
2. **Expected**: step 2's own two checks, unchanged, once the temporary
   delay is reverted and the dictionary loads at its normal speed.
   **Result, confirmed live**: the scan PDF filled the field (6 lines, 36
   words); the photo showed `"No text recognised in image."`, with the
   input field staying empty and Repertoire gaining no garbled entry (two
   real "Я вас любил: любовь" entries from this session's own two
   successful scan drops, disambiguated `(2)`; nothing from the photo).
3. All five gates green, web-test's new baseline of 1244 reported below.
4. Walked by Dann. Not this session's to do.

### Gates

| gate | baseline | this ship |
|---|---|---|
| phonology | 216 passed (216) | 216 passed (216), unchanged |
| dictionary | 235 passed (235) | 235 passed (235), unchanged |
| web-check | 0 errors, 8 warnings, 5 files | 0 errors, 8 warnings, 5 files, unchanged |
| web-test | 1244 passed (1244) | **1253 passed (1253)**: +9, all new in `ocr-guard.test.ts` |
| score-parser | 567 passed, 5 skipped (572) | 567 passed, 5 skipped (572), unchanged |

Run directly, same five commands as step 2 (the ship script still refuses on
untracked files, now including this brief and its own step 2b addendum).

### NOT ESTABLISHED

- **Whether a real singer's own device would ever actually show this
  window.** Nothing here measures how long a real first-visit dictionary
  load takes on a slow connection or an old device; the brief's own fault
  report was about the EXISTENCE of the window, not its real-world size, and
  that is what this step closes.
- **The dev server's IndexedDB-cache-clearing path was not made to work
  cleanly** inside this session's own browser tooling (see "Method,"
  above). Whether a genuinely cold first-visit profile behaves identically
  to the stated-delay simulation is inferred from reading `loadDictionary`
  and `dictionaryGuardMode` together, not independently observed.
- **A second, truly concurrent reading dropped while the first is still
  waiting** (two pictures dropped in quick succession before the dictionary
  is ready) was not tested. `dictionaryWaiters` is an array, built to hold
  more than one resolver, but no test exercises two real waiters at once.

### Decisions this brief did not settle, marked as mine and reversible

- **A failed load (`'skip'`) and a load in progress (`'wait'`) share the
  same `isKnownWordForGuard` mapping (always-true), but NOT the same
  call-site behaviour.** `'skip'` judges NOW, with the guard bypassed;
  `'wait'` waits, then re-derives `mode` (now `'judge'` or `'skip'`) and
  judges with THAT. The shared mapping is a pure fallback for `'wait'`,
  never the mechanism -- a correctly wired caller never calls
  `decidePoemOrScore` while `mode` is `'wait'` at all. This is stated
  plainly in `ocr-guard.ts`'s own doc comment so a future reader does not
  mistake the fallback for the design.
- **A finished load with no error and zero entries** (`!isLoading, error:
  null, entryCount: 0`) -- not a state `loader.ts` produces today, since it
  sets one or the other on every exit path -- is treated as `'wait'`, not
  `'skip'`. The brief did not name this combination. I judged `'wait'`
  (never resolving, since nothing will ever change `loaderState` again)
  the safer failure than `'skip'` (silently trusting ungoverned garble)
  for a state that should not occur. Reversible: one branch in
  `dictionaryGuardMode`.
- **The wait is implemented as a promise-resolver queue behind a single
  persistent `$effect`, not a poll.** This was chosen to match
  `+page.svelte`'s own established idiom for the identical problem
  (`transcribeWhenDictionaryReady`) rather than invent a second pattern,
  and to avoid a magic poll interval. Reversible: `waitForDictionaryGuard`
  and the effect above it are the whole of it, in one file.
