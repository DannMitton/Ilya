# Report: French pitch names become letters with the American index (QUEUE row 68, r1)

**QUEUE row 68, state: WRITTEN, pushed to `cloud-lane`. Ilya's French writes a pitch as English does (A4 = 440 Hz, C4 = middle C, D♯4). The solfège with the French index that row 66 seated is gone. The key line stays, as « (A4 = 440 Hz) ».** The desk carries this line into `QUEUE.md`; this session does not edit `docs/memory/`.

Written by Code (cloud lane) 2026-10-12, for `docs/sessions/brief-code-french-pitch-letters_r1_2026-10-11.md` with its amendments of 2026-10-11 19:30, on `cloud-lane` after row 73 (`7b7ec126`), clean tree before the first edit. Both of the brief's holds are met, as the amendments confirm.

## Step 1: every place Ilya's French writes a pitch

Searched before any change:

- `apps/web/src/lib/i18n.ts`, every `fr:` value, for a letter or a solfège syllable followed by a digit.
- The French branches of Learn (`LearnContent.svelte:15-2051`) and the Guide (`GuideContent.svelte:16-294`), the same way.
- Every `.ts` and `.svelte` under `apps/web/src` and the packages' `src`, for a solfège table or an `octave - 1`.

Found:

1. **The formatter, `pitchName`** (`apps/web/src/lib/voice/note-picker.ts`, then at `:141-153`). French returned fixed-do solfège with the French octave index (`la2` for A3). Its callers, which the amendments name, are all Insights:
   - `comment-text.ts:337`, `:349`, `:397`: a comment's pitch and turn;
   - `PitchSeconds.svelte:33`: the pitch chart's axis;
   - `singer-blocks.ts:134`: the conclusion, the reasons, and the vowel figure;
   - `InsightsPane.svelte:276`: the model's words;
   - `compass-stave.ts:86`: the compass under the header stave.
2. **The key line, `insights.r2.pitchKey`** (`i18n.ts:1807`). French « (la3 = 440 Hz) », appended to the method line of a French Insights page (`InsightsPane.svelte:272`).
3. **No pitch is written in Learn's or the Guide's French prose.** The search found none.

Not pitches, so not changed:

- **Key names** (`watch.key.letter.*`, « do majeur » in the ruler's readout). They name a key, not a pitch, under N.82's separate ruling (2026-09-28: « French keys are solfège, lowercase »). Whether that ruling should follow this one is Dann's; see "For Dann".
- **The note picker's own labels** (`pitchLabel`), which were already letters in both languages.

## The changes

- **`apps/web/src/lib/voice/note-picker.ts:150`.** `pitchName` returns `pitchLabel(p)` in both languages. The `SOLFEGE` table is removed. The doc comment names the ruling (Dann 2026-10-11 04:58, `CONTRACT.md` §6) and Roberge's *GDRM*. The language parameter stays (`_language`), so the seven call sites are unchanged.
- **`apps/web/src/lib/i18n.ts`, key `insights.r2.pitchKey`.** French becomes `(A4 = 440 Hz)`, the same as the English. **The key line stays (DESK DEFAULT).** French prose now writes A4, while a French reader's own octave index puts 440 Hz at la3. So without the key, « A3 » could be read an octave off. The comment above the key says so.
- **`apps/web/src/lib/insights/InsightsPane.svelte:267`.** The comment says what the key now names.

## Tests

- **Changed (3), each because it asserted the superseded solfège:**
  - `apps/web/src/lib/insights/singer-page.test.ts` now asserts A4, C4, D♯4, and E♭3 in both languages, and that the French path carries no « la » and no French index. It was the test the amendments name (formerly `:250-254`).
  - `apps/web/src/lib/insights/comments.test.ts`, the three ratified French comments `FR_E4`, `FR_EB4`, and `FR_D4`: « mi3 » → « E4 », « mi♭3 » → « E♭4 », « ré3 » → « D4 » (twice). Their comment now names this row's ruling.
  - `apps/web/src/lib/insights/compass-stave.test.ts`: « Ambitus do♯2 à ré3 » → « Ambitus C♯3 à D4 ».
- **No test added or removed.**

## Seen rendered

`docs/sessions/french-pitch-letters-shots/after-insights-fr-p1.png` and `-p2.png` show the French Insights page:

- the compass reads « Ambitus C♯3 à D4 »;
- the comment reads « Ce [u] sur A3 »;
- the cycle legend reads « B2 à A3 »;
- the method line ends « (A4 = 440 Hz) ».

For before, `docs/sessions/working-zone-shots/insights-zone-fr.png` (row 73) shows « si1 à la2 ».

## The eight gates

All pass. Gate 4 is **2341**, unchanged.

1. `pnpm test:phonology`: 251 passed (251)
2. `pnpm test:dictionary`: 242 passed (242)
3. `pnpm --filter @ilya/web check`: 0 errors and 12 warnings in 5 files
4. `pnpm --filter @ilya/web test`: 2341 passed (2341)
5. `pnpm --filter @ilya/score-parser test`: 663 passed, 5 skipped (668)
6. `pnpm test:blurb`: 145 passed (145)
7. `pnpm test:integration`: 55 passed (55)
8. `pnpm ratchets`: OK

## For Dann

1. **The key line kept.** « (A4 = 440 Hz) » still ends a French Insights method line. To drop it, delete the French branch at `InsightsPane.svelte:272`.
2. **Key names stay solfège** (« do majeur »), under N.82's ruling. If the 04:58 ruling should reach key names too, that is a further row.
3. **English on French pages, from row 66.** The picture shows English sentences on the French Insights page ("In this key, 58 percent of the singing lies above your *primo passaggio*…"). These are row 66's strings whose French is owed: `[FR: desk draft owed]` in `i18n.ts`, which fall back to English. This row did not cause it, and nothing here changes it.

## Could not establish

- **Printouts other than Insights'.** Markup's pages print no pitch name in prose. The Text page was not read for one.
