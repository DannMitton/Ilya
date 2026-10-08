# Brief for Code: the tessituragram names every sung pitch (r1, 2026-10-08)

Written by the desk (Opus) 2026-10-08 about 00:05. Model: Sonnet. For Code on the Mac. QUEUE row 43. Builds on QUEUE row 42 (shipped `9cfcd17`).

## What the singer sees, and why

Today the tessituragram's left column names every stave line, sung or not, and the right column names only sung sharps and flats (`apps/web/src/lib/insights/tessituragram-layout.ts:330`, `:383`). A natural on a space has no name. In Tchaikovsky's *Средь шумного бала* that leaves B3 unnamed, though it holds 19.6 percent of the singing (the second-longest bar), along with D4, G3, and E3; and it names C4 and F3, which the song never sings. Only 63 percent of the sung time carries a name.

After this brief, every bar carries the name of its pitch, and nothing else is named. Dann, 2026-10-08 00:02: *"Users already know how to read the staff. I think every sung pitch named has more of a bespoke quality."* Drawing: `docs/sessions/drawing-tessituragram-pitch-names_r1_2026-10-07.png`, panel C (a desk drawing of the labels only).

## Ruled

Who offered it: the desk (panel C); ruled in by Dann 2026-10-08 00:02.

1. **The left column names each sung natural**, level with its bar, whether it sits on a line or a space.
2. **The right column names each sung sharp or flat**, as now.
3. **A stave or ledger line the song does not sing gets no name.** The faint lines themselves stay as they are.
4. Both columns keep the row 42 treatment: same face and weight; `--rose-ink` for every name now, since every name is a sung pitch. (The grey `--ink-tertiary` line-name ink is no longer used here.)

## Desk defaults (reversible)

- **Spelling:** a name uses the score's own spelling of that pitch. Where enharmonic spellings share a row, name the spelling with more sung time; on a tie, the less altered one.
- **No new strings.** Names come from the existing pitch-label code (`pitchLabel`, `apps/web/src/lib/voice/note-picker.ts`, or whatever row 42 uses); the French figure uses the same names it uses today.
- **Collision check:** keep row 42's rule that no label touches a line, bar, or label, now with names one diatonic step apart (11 px at 10 px type, for example B3, A3, G3 in the Tchaikovsky song). If two names in one column would touch, report it rather than shrinking the type.

## Tests, screenshots, gates

- Unit tests: a natural on a space is named; an unsung line is not named; enharmonic spelling choice; the Tchaikovsky rows produce exactly these names, left E4, D4, B3, A3, G3, E3, D3, B2 and right C♯4, A♯3, G♯3, F♯3, D♯3, C♯3 (an octave down, as on the alias).
- Screenshots of the Tchaikovsky figure, English and French, desk and print, into `docs/sessions/tessituragram-shots/` with `-sung-names` in the file names.
- All eight gates. Gate 4 baseline `1977`. Name any number that moves and the tests that move it.

## Report

`docs/sessions/report-code-tessituragram-sung-names_r1_2026-10-08.md`: every change with `path:line`, each gate, the screenshots, and a section **Could not establish**. NOT ESTABLISHED beats a complete invented answer. WRITTEN is not DONE: DONE is Dann's look on the alias.

No git writes of any kind. Dann ships.
