# Brief to Code: sing the vowel first, pause, then fry (row 2d, part 3)

From the desk, 2026-09-30 21:03. No git writes. Gates before and after. Canadian spelling, no em dashes.

## The ruling

`docs/sessions/draft-sing-first-cue_r1_2026-09-30.md`, section "REVISION 21:05", **RATIFIED by Dann 2026-09-30 21:00**. His reason (20:59): *"Most singers will not feel comfortable going from modal singing into fry. ... give them a moment between sung and fry."* The sung vowel is for the singer to set the vocal tract; only the fry is recorded and processed.

## The flow, in `pacifier/Pacifier.svelte` (locations from your report: `beginPrepare()` `:371`, `startListening()` `:390`, `COUNT_INTERVAL` `:293`)

1. **One tap begins** (desk-offered, ratified 21:00). Remove the arm step; a tap during steps 2 and 3 cancels; long-press still skips. Retire `pacifier.armed`, `pacifier.armedRetake`, `pacifier.selected` only if nothing else reads them; report what you found.
2. **Sung, not recorded:** announce `pacifier.singFirst`, then `calib.readiness.countTwo`, `countOne`, at **1000 ms a beat** (DESK DEFAULT; was 700 ms; keep the readiness step's own count at `CalibrationWizard.svelte:697-718` unchanged unless it shares the constant).
3. **The moment:** announce `pacifier.pause`, then **2000 ms** (DESK DEFAULT) with no capture running.
4. **Fry:** `startListening()` as today with `pacifier.beginPhonating`. The live gate, the sweep, and the engine are unchanged.

## Strings, verbatim, with a comment carrying the ratification

| Key | English | French |
|---|---|---|
| `calib.capture.cueSuffix` | vowel to begin. First sing it as you usually do, to set the shape of your vocal tract. Then stop, keep that shape, and begin again in vocal fry. Ilya measures only the fry. | pour commencer. Chantez-la d’abord comme d’habitude, pour régler la forme de votre conduit vocal. Puis arrêtez, gardez cette forme et recommencez en friture vocale. Ilya ne mesure que la friture. |
| `pacifier.singFirst` (new; replaces `pacifier.preparing`) | Sing {v} as you usually do. Three. | Chantez {v} comme d’habitude. Trois. |
| `pacifier.pause` (new) | Stop, and keep the shape. | Arrêtez, et gardez la forme. |
| `pacifier.beginPhonating` | Now {v} in vocal fry. | Maintenant, {v} en friture vocale. |

`calib.capture.cuePrefix` is unchanged. Use the file's apostrophe convention (`’`).

## DONE

- Tests for the new sequence: one tap starts it; the beats and the pause fire in order at the stated intervals; a tap during the count or the pause cancels; no capture session starts before `startListening()`.
- `pacifier.wheelAria` matches the one-tap flow; propose its English and French in the report and do not ship them until the desk sends them ratified.
- Seen in the dev server, English and French. Gates pass; report the new gate 4 count.

## Report

`docs/sessions/report-code-sing-first-then-fry_r1_2026-09-30.md`. NOT ESTABLISHED beats a complete invented answer.
