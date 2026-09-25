# Memo, r1: four open questions settled by reading the code

Written by the desk 2026-09-25, about 05:10, while Dann was away. **Read-only.** Every `path:line` below was read this session from a snapshot of the tree at `b2fde8f` (clean, per Dann's `git status` at 03:33). Nothing was run in a browser, so anything that needs a render is NOT ESTABLISHED.

## 1. N.164: Insights states two things that cannot both hold

**Answer: the contradiction is real, and the code shows it every time.** Whenever the singer has not typed a range and the watch list is empty, both lines print, one after the other.

- The verdict is `cannot-say` whenever the range row has no flag (`insights.ts:342-343`). The row has no flag when the singer typed no range (`insights.ts:272-280`).
- The findings line reads `insights.findings.none` whenever page one has no findings (`InsightsPane.svelte:612-614`). That test never looks at the verdict.
- The two render in sequence (`InsightsPane.svelte:598-614`).

**Why it misleads:** "Nothing is flagged" is true of the findings Ilya can compute without a range: crossings, turns, and sustains. The range findings (`insights.finding.rangeAbove`, `rangeBelow`) cannot exist without a typed range. So "nothing flagged" includes checks that never ran, straight after a sentence saying they could not run.

**The fix is small and it is taste, so it is Dann's.** Three shapes, from the singer's side:

1. **Recommended:** with no range, the findings line says what it did check: "Nothing else in this piece is flagged for your voice." That needs one new string in each language.
2. Suppress the findings line when the verdict is `cannot-say`. That is simpler, but the singer loses a true statement about the turns.
3. Build neither. The contradiction stays on screen.

**The compass of A3 to F♯6: NOT ESTABLISHED, with one candidate from the code.** The compass is the lowest and highest pitched note of the vocal line, with no filter for grace notes or ossia (`insights.ts:225-229`, `263-270`). With no range typed, a score in plain treble clef is read at its written octave. `resolveVocalReadingOctave` returns 0 and says so: "plain treble, no range: do not guess" (`packages/score-parser/src/vocal-octave.ts:73`). A low voice's line engraved in plain treble would then read an octave high. **Which song produced it is not recorded** in STATE.md's N.164 row, so the desk cannot check it. An OCR misreading is the other candidate. Settling it takes the song's name and one render.

**The tall empty region: NOT ESTABLISHED.** It needs a render.

## 2. N.128's two other consumers (OWED.md)

**Answer: both already read the corrected line. No fix is needed.**

- The page builds `correctedLine` from the corrections (`routes/+page.svelte:793`). `applyCorrections` ends in N.128's pass, `reflowOnsets` (`correction.ts:356`, pass at `:382-433`), which returns events with corrected `rhythmicPosition` (`:431`).
- `correctedScore` swaps that line into the score (`routes/+page.svelte:1474-1490`). Both panes receive it as `ingested={correctedScore}` (`routes/+page.svelte:5040`, `:5070`).
- In each pane, `parsed` is `ingested.result.score` (`InsightsPane.svelte:107`; `VoiceProfilePane.svelte:496`). `buildWatchList` reads `readingScore` built from it (`InsightsPane.svelte:128`; `VoiceProfilePane.svelte:725`), so `watchlist.ts:229`'s `activeTempoAt` sees corrected onsets. `analyzeScore` reads `analysisScore` from the same chain (`InsightsPane.svelte:111`, `:123`; `VoiceProfilePane.svelte:709`), so `sustain.ts:61`'s copy does too.
- `analyzePerVerse` is the only other caller of `analyzeScore`, and nothing live calls it (grep, this session).

**What stays true:** the function is duplicated, one copy in each package (`packages/score-parser/src/sustain.ts:61`, `apps/web/src/lib/shane/watchlist.ts:229`), and `tempo-seam.ts:6-7` records that the single seam was never built. That is tidiness, not a defect.

## 3. "Something writes `updatedAt` about seven seconds after every load" (OWED.md)

**Answer: the chain is established from the code, and Code's lead was right.** The timing is not measured.

1. At boot, once the dictionary is ready, the page transcribes the stored poem (the boot path and its ruling are described at `routes/+page.svelte:4321-4335`; `joinText` at `:3172` calls `transcribeText()` at `:3182`; the ruling is also quoted at `:3161-3163`).
2. `transcribeText` ends by calling `keepSurvivingGlosses()` (`:2619`).
3. `keepSurvivingGlosses` always builds two new `Map`s and assigns them to `doc.glossOverrides` and `doc.glossAnchors`, **even when every entry survives** (`:2927-2941`).
4. The document's autosave effect reads every field through `#snapshot()` (`library/document.svelte.ts:154-160`), so a new `Map` counts as a change, and the effect calls `this.#scheduler.schedule()` (`:189`).
5. The scheduler writes after an 800 ms debounce (`library.ts:413`), and the write stamps `updatedAt` (`library.ts:342`).

So the record is saved unchanged except for its timestamp. "About seven seconds" is the dictionary's load time plus 800 ms. **That is a DESK INFERENCE**, because the load time was not measured.

**The fix, for a Code brief (reversible, so DESK DEFAULT):** in `keepSurvivingGlosses`, assign the new maps only when something was actually dropped. That is one comparison of sizes, because the function only removes entries. `transcribeText` may reassign other fields the same way. Only this one was traced.

**Why it matters to a singer:** every load moves the song's "last changed" time, so a library sorted by recent change reorders itself when songs are merely opened. **Whether the library view sorts by `updatedAt` is NOT ESTABLISHED.**

## 4. The `#onRemoteWrite` guard (OWED.md)

**Answer: the same-tick race the sweep worried about cannot happen. A different gap exists, and the code shows it.**

- **No same-tick gap.** A local edit assigns a field synchronously. Svelte then runs the effect that calls `schedule()` in a microtask. Another tab's announcement arrives as a message event, which is a task, and a task cannot run between a synchronous assignment and its microtask. **DESK REASONING from the event loop's rules, not from a run.**
- **An await gap.** `#onRemoteWrite` checks `isPending()` (`document.svelte.ts:303`), then awaits `this.#library.load(this.id)` (`:307`), then applies the loaded record (`:312`) **without checking again**. If the singer edits while the load is in flight, the edit schedules a save. The remote record is then applied over it, and the scheduled save writes the remote content. The singer's edit is lost silently.
- **How likely:** it needs a second tab to save this same song and the singer to edit within the milliseconds an IndexedDB read takes. That is rare, but it loses work without telling anyone. The fix is to check `isPending()` again after the await and, if it is true, show `remoteChange` instead of applying. **Reversible, so DESK DEFAULT, for a Code brief.**

## 5. N.162: must a note stay tappable inside Corrections? A fact for the ruling, not the ruling

In the loupe, notes and carets share one pool. The nearest centre wins, and a note tap calls `onpick` (`Loupe.svelte:2274-2294`). **A note tap is how a singer chooses which note to correct.** The other path is the keyboard stepper, and the comment at `Loupe.svelte:2301-2303` names it as the keyboard route to every entry. So removing note taps inside Corrections would leave touch users only the stepper. **That is a design question for Dann** (N.162, clause 3), and nothing here settles it.

## What the desk could not establish

- Which song produced N.164's A3 to F♯6 compass, and what makes the empty region.
- The real delay before the `updatedAt` write, and whether any view sorts by it.
- Whether `transcribeText` reassigns other `$state` fields unchanged.
