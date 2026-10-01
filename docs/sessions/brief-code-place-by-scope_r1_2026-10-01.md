# Brief to Code: clear placements by scope, and place from here (N.179)

From the desk, 2026-10-01 02:50. No git writes. Gates before and after. **French RATIFIED by Dann 2026-10-01 02:44 ("ratified").**

**The ruling:** Dann, 2026-10-01 02:42: *"My instinct is to replicate Finale's functionality inasmuch as this is possible in a scaled-down form for Ilya."* The desk's design (Finale's clear-by-region, plus a place-from-here seat) was ruled ready for a brief at 02:43: *"I like your insights and yes, this is ready for a brief."* Who offered the design: the desk. Who ruled: Dann.

**The gap, read 2026-10-01:**
- `handleStartPlacementOver` (`apps/web/src/routes/+page.svelte:646-695`) has no call site; N.147 removed its pill (`:4745-4748`). It discards every placement and reseats from the poem with `firstPass(syllableTargetIds(parsed.vocalLine), queue)` and `seatCliticFolds`, or with `seatFilledPoem` when the poem is the score's own words (`:681-686`), and pushes `loupe.undo.startOver` (`:676`).
- The poem's Clear (`handleClear`, `:2516-2531`, with `resetSessionState`, `:2280-2287`) removes the words and word edits and leaves `doc.pairings` untouched, so it is not a way to start placement again.
- Placing a tray syllable on the selected note exists (`placeSyllableOnSelected`); shifting every syllable by one exists (the Lyric station's arrows, `loupe.undo.lyrics`).

**The work, in the loupe's Syllables mode (THE SYLLABLES LIVE IN THE LOUPE, `docs/memory/PRODUCT.md`):**
1. **Clear placements**, with a scope: the selected note's measure, from the selected note to the end, or the whole piece. Removes those notes' entries from `doc.pairings` only; the poem, glosses, and word edits are untouched; the cleared syllables return to the tray. One undo entry.
2. **Place from here.** Seats the tray's remaining syllables one per note in order from the selected note, with the same `firstPass` and `seatCliticFolds` the old handler used, leaving melismas to the singer. Skips notes that already hold a syllable. One undo entry.
3. Retire `handleStartPlacementOver` once both exist: whole-piece Clear followed by Place from here on the first note covers it. Keep `seatFilledPoem` for the score's-own-words case, as `:681-686` does.
4. **DESK DEFAULT placement, reversible, for Dann's walk:** a quiet row under the tray: a `Clear placements` pill that opens its three scopes in place, and a `Place from here` pill, disabled while the tray is empty or no note is selected. Rounded ends per the 2026-09-03 button ruling.

**Strings (English; French RATIFIED 2026-10-01 02:44, adopted from `i18n.ts:368-384` and `:661`):**
| key | English | French (ratified) |
|---|---|---|
| `loupe.place.clear` | Clear placements | Retirer le placement |
| `loupe.place.scope.measure` | this measure | cette mesure |
| `loupe.place.scope.toEnd` | to the end | jusqu'à la fin |
| `loupe.place.scope.all` | the whole piece | toute la pièce |
| `loupe.place.fromHere` | Place from here | Placer à partir d'ici |
| `loupe.undo.cleared` | placements cleared | placement retiré |
| `loupe.undo.placedFromHere` | syllables placed from here | syllabes placées à partir d'ici |

**Tests:** each scope clears exactly its notes and nothing else; the poem and word edits survive; the tray receives the cleared syllables; Place from here skips filled notes and stops at the end; both undo cleanly; the score's-own-words case reseats as today.

**Report:** `docs/sessions/report-code-place-by-scope_r1_2026-10-01.md`.
