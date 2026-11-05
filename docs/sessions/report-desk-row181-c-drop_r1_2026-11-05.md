# Report: row 181, why word-exact (c) fell; three arms on row 114 f1 (Sonnet helper, r1, 2026-11-05; filed by the desk)

The helper's Write tool refused the file; the desk filed its report as returned, condensed. Brief `brief-desk-row181-c-drop_r1_2026-11-04.md`. Data in the desk's cloud workspace: `/root/c181/c-diff.tsv`, `ledger-{ctl,tip,armS}.tsv`, `pairings/song1..5.{json,musicxml,record.json}`, captures `work/cap/{ctl,tip,armS}/sN/`, scripts `work/`.

## Answer

1. **(c) fell 121 to 99 because 24 syllables that were one-syllable app words on the control became parts of longer app words on the tip** (class ii, all 24 kept (b)); 2 moved the other way. Reverting the long dash to a mark (`underlay-tokens.ts:55`) restores 23 of the 24.
2. **The (c) credit cannot judge this on row 114's truth.** In the scorer's truth every word is one syllable (truth word equals truth syllable on 590 of 590 rows; the truth JSON carries only `start` and `single`). So (c) credits a syllable only when Ilya's word is also one syllable: a correctly sewn «яс|на|я?» scores 0. The drop measures "more syllables sewn into longer words", not "more words wrong". Whether the longer words are right: NOT ESTABLISHED. Rebuilding the truth's words from the `.txt` hyphens failed on a count (f1-002 to f1-005: 181 against 189).
3. **Arm S (tip with the long dash split again): (b) 385, (c) 126.**

## Counts

| Arm | Tree | (b) of 590 | per song | (a) | (c) |
|---|---|---|---|---|---|
| Control | Shane `bfeb8e9d` | 369 | 48, 136, 29, 82, 74 | 408 | 121 |
| Tip | `cloud-lane-34` `05db2dac` | 376 | 48, 139, 33, 82, 74 | 416 | 99 |
| Arm S | tip, line 55 only | 385 | 48, 136, 33, 82, 86 | 425 | 126 |

(b) per syllable: control to tip +7, -0; control to arm S +16, -0; tip to arm S +12 (song 5 p21 sys3), -3 (song 2 p3 sys1, the tip's own gain). One capture per arm: whether these two systems are the joint or reader variance is NOT ESTABLISHED.

Examples of class ii (b right on all arms): «яс» control `яс`, tip `яс|на|я?`; «Шум» tip `Шум|но|раз|туль|но`; «яр» tip `яр|ким|я|ни|ем,|е` (this one looks wrong: two words sewn); «лю» tip `мо|лю`. The one not restored by arm S: «ноч» sewn `ноч|ЕруГроб` on tip and arm S, cause NOT ESTABLISHED. Reverse: «ный» `ѳѵ|ный` is a scorer artefact (`letters()` drops ѳ, ѵ).

Console: the tip's pages sum 200 hyphen and 278 long-dash tokens; no line names the token at a given join.

## Pairings (tip)

Held in IndexedDB `ilya-library`, store `songs`, field `pairings`, keyed by event id (`driver.ts:409-412`, `types.ts:105`, read by the helper). Dumped after the join line plus 8 s: 65, 155, 43, 107, 93 pairings, each with the run's MusicXML. Join counts as the evening's re-measure (songs 2 to 5: 1 repaired each, 1 filled in song 5, 77 offers, 0 faults).

## Control and conditions

Control reproduced 369, (a) 408, (c) 121, alone on the machine. Tip and arm S overlapped on 2 CPUs; arm S song 4 hung over 30 minutes, killed and re-run (songs 4 and 5 from the second attempt). Arm S and control ran without waiting for the join (the join does not change the scored MusicXML). Helper cost: 208,123 tokens against 220,000 stated.
