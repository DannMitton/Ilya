# Brief for Code: N.182, how Ilya suggests a key (r1, 2026-10-11)

Written by the desk (Opus) 2026-10-11 about 14:00 from the design agreed with Dann 13:38 to 13:55 (`draft-n182-suggesting-a-key_r1_2026-10-11.md`, read it whole). **Under review by Fable before it is sent.** For Code, cloud lane, Sonnet, after rows 69 and 34. It replaces row 66's single "better key" (`apps/web/src/lib/insights/singer-page.ts:174-205`, `searchBetterKey`) and carries row 66's ruled change (smallest move first, Dann 13:38).

## What the singer sees

On Insights, under "How this key sits for you", where the way forward is today:

- **No key suggested,** in one line, when the written key already suits the voice, or when no other key changes the challenges in a way that matters.
- **No workable key,** in one line, when every key within reach asks more than the singer's range allows: the singer decides whether to pursue the piece or choose other repertoire. (Relates to `isUnlikely`, `singer-page.ts:70`.)
- **Otherwise one to three keys,** each on one line: the key, the move, and only what differs for this singer; **Try this key** applies it on Markup.
- **"Show keys that reach higher"** (and lower, where that applies) reveals keys beyond the range margin, each with its range challenge named plainly.

## The rules

1. **Reach:** six semitones either way (`KEY_SEARCH_WINDOW`, unchanged).
2. **Two challenges, pitch-dependent only:**
   - **Range:** a note beyond the singer's typed range. Up to two semitones beyond is named as a challenge ("one note a tone above your range"); farther makes the key not workable by default (shown only under "Show keys that reach higher").
   - **Passaggio time:** time at or above the primo and at or above the secondo; the longest held note above the secondo is the example a line may name.
3. **Vowels past their turn are described, never counted as a challenge,** and never framed as unusual for a voice in which they are commonplace (`OPEN.md`, NO LOW-VOICE NORM). A line mentions them only where keys differ meaningfully.
4. **Grouping (DESK DEFAULT, the desk's codification of Dann's "the number of keys follows the data"):** each workable key gets a profile: range challenge (none, up to a semitone, up to a tone, above or below); primo time and secondo time, each in bands of 10 percentage points of sung time against the written key (less, about the same, more); and whether a held note above the secondo remains. Keys with the same profile form one group; the group is shown by its smallest move (then the lower key). Groups whose profile equals the written key's are not shown.
5. **At most three groups,** ordered by smallest move. Report how often the cap binds on the tree's fixtures.
6. **Data first, label second:** the typed range, tessitura, and passaggi decide; the declared voice type is not an input to the search.
7. **The experience stage changes only the wording** (N.172; a novice's line adds a clause of why; an expert's is terse). The same keys for every singer.

## Words

All new strings are PROPOSED: draft English in the musician's terms (`CONTRACT.md` tether 22, 2026-10-08), marked `PROPOSED, Dann to rule`, French left as `[FR: owed]`; list them all under "For Dann". No machine words (flag, gap, reading, share) in anything a singer reads.

## Tests and proof

Pure functions with tests: the profiles, the grouping, the cap, the none and not-workable cases, the margin, the reach-higher reveal, and the wording by stage. Pictures, English, desktop and 390 px: a voice for which the written key suits; one with one group; one with three; one with no workable key; the reveal. All eight gates. Commit and push to `cloud-lane` only; never `Shane` or `main`; no edits in `docs/memory/`. NOT ESTABLISHED beats a complete invented answer.

## Report

`docs/sessions/report-code-n182-suggesting-a-key_r1_2026-10-11.md`: state first; pictures; changes with `path:line`; gates; "For Dann"; **Could not establish**.
