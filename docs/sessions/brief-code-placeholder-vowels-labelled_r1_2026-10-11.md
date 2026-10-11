# Brief for Code: placeholder vowels are labelled (QUEUE row 69, r1, 2026-10-11)

Written by the desk (Opus) 2026-10-11 about 12:45. For the cloud lane, Sonnet. Rulings: `docs/memory/OPEN.md`, "STAND-INS ARE LABELLED" (Dann 12:28 to 12:42).

## What the singer sees

Since row 17 (`4bc9bcd`), a vowel the singer has not sampled carries a stand-in value, and Markup and Insights draw findings from it with nothing to say so. Dann: *"We must not propose synthetic values as if they were actual readings."* After this row:

1. **A line at the top of Insights and of Markup**, only when at least one vowel the page uses is a placeholder. RATIFIED wording:
   - EN, several: "Your [ɛ], [o], and [u] use placeholder values until you sample them in vocal fry, which you can do anytime through the drawer on the left. Findings that rest on a placeholder are drawn dashed."
   - EN, one: "Your [ɛ] uses a placeholder value until you sample it in vocal fry, which you can do anytime through the drawer on the left. Findings that rest on it are drawn dashed."
   - FR, several (term RATIFIED 12:42, « valeur par défaut »): « Vos voyelles [ɛ], [o] et [u] reposent sur des valeurs par défaut jusqu'à ce que vous les échantillonniez en friture vocale, ce que vous pouvez faire à tout moment depuis le tiroir de gauche. Les constats qui en dépendent sont tracés en pointillé. »
   - FR, one (desk-derived from the ratified plural; mark it so in a comment): « Votre voyelle [ɛ] repose sur une valeur par défaut jusqu'à ce que vous l'échantillonniez en friture vocale, ce que vous pouvez faire à tout moment depuis le tiroir de gauche. Les constats qui en dépendent sont tracés en pointillé. »
   - The vowel list uses the existing list separators (`profile.provisional.listSepPair`, `listSepFinal`, `listSepMedial`). OQLF spacing: the drift test must pass.
2. **Markup:** a crossing squircle (`data-analysis="crossing"`) on a note whose vowel's fR1 is a placeholder is drawn with a dashed stroke. Any other analysis mark that rests on a placeholder value is dashed or otherwise marked the same way; list each in the report.
3. **Insights:** a comment or figure that rests on a placeholder says so in its own sentence or caption. Where new words are needed beyond the line above, draft them in both languages, mark them `[FR: desk draft for Dann]` / PROPOSED, and list them under "For Dann"; do not invent ratified text.
4. **Print:** the line and the dashed marks print as they show (WYSIWYG).

## The data

Row 12 records where each value came from: `fR1Source` and `fR2Source` on `VoiceProfileSnapshot` (`packages/score-parser/src/analysis-types.ts`), `'sung' | 'derived' | 'surrogate'`. A placeholder is `'surrogate'`. `'derived'` is the existing "Estimated" kind (`calib.roster.reading.estimated`) and is NOT labelled by this row.

## Constraints

- Row 34 (`brief-code-markup-crossing-takes-the-loupe-squircle_r1_2026-10-11.md`) also changes the crossing squircle. If row 34 is not built yet, build this row against today's squircle and say so; the dashed rule must survive row 34's reshaping.
- Commit and push to `cloud-lane` only; never `Shane` or `main`; no pull request; no edits in `docs/memory/`.
- All eight gates; say if a count moves. Before and after pictures, English and French, desktop and 390 px, of a voice with three vowels sampled.
- NOT ESTABLISHED beats a complete invented answer.

## Report

`docs/sessions/report-code-placeholder-vowels-labelled_r1_2026-10-11.md`: state line first; pictures; each change with its `path:line`; gates; "For Dann"; **Could not establish**.
