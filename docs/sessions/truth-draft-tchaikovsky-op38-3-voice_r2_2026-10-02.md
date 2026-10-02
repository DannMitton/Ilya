# Draft truth, r2: Tchaikovsky Op. 38 No. 3, voice staff, every bar with pitch and length

**Read by the desk (Fable) on 2026-10-02, about 09:33 to 09:42, by eye, from `~/Downloads/Tchaikovsky_Op38-3_Sred-shumnogo-bala_Jurgenson-1878.pdf` (md5 `3d3d4684a1180bd4d4904ccbaca15bfb`, checked this session). DRAFT. Not proofed by Dann.** r1 (`truth-draft-tchaikovsky-op38-3-voice_r1_2026-10-02.md`) holds counts only and stays as the record of the count. This file adds the pitch, the written length, and the syllable of every head, and every printed rest inside a bar.

**The same reading as data:** `truth-draft-tchaikovsky-op38-3-voice_r2_2026-10-02.json`, beside this file, in the shape of `tools/e16-harness/src/ground-truth.ts:28-78` (one verse; `measureIndex` counts from 0; lengths in whole-note fractions; a whole-bar rest has no event, as in the *Sunless* truth files). It adds one field the Finale truth does not have: `tiedFromPrevious` on the second head of a tie. How the Finale truth files show a tie is NOT ESTABLISHED; the desk did not look.

## How it was read

1. **The sheets.** The eleven sheets cut at the close of the last thread, one per system, `apps/web/test-results/_desk-heads/tchsys-1-1.png` to `tchsys-3-4.png` (400 dpi Poppler raster, each system in three stacked parts). The desk read every sheet.
2. **Pitch, measured.** A script found each filled head and placed it against the five staff lines of its own part. On eight of the eleven systems the measured letter names equal this draft's in every head (on page 1, system 1 the script also takes the curl of the clef for a head). The three exceptions, each looked at in an enlargement:
   - Page 1, system 3: the script does not find two heads whose ink has a white speck (bar 20, B4; bar 23, D4). Both are read by eye.
   - Page 2, system 3, bar 53: the script found no staff beside the C♯5. Measured by hand: the head lies between the second and third lines from the top.
   - Page 2, system 4, bar 60: with one staff for the whole part the script reads A4 for the G4, because the staff tilts. With the staff measured beside the head it reads G4, and the bar rises by step, G4, A4, B4.
3. **Length, by eye.** Flags, dots, and rests were read on the sheets, and the bars with sixteenths were read again in enlargements. **Every bar adds up to 3/8,** checked by script.
4. **Against r1.** The number of heads in each of the 99 bars equals r1's count, checked by script.
5. **Accidentals, by eye,** each in an enlargement: bar 40 (G♯4, then G♮4), bar 53 (G♯4), bar 56 (A♯4), bar 83 (D♯4), bar 87 (A♯4 on the first head; the third head carries no sign and is A♯4 by the rule of the bar).

Octaves are as printed in the treble clef, with middle C as C4. The key signature is two sharps, so every F and C is sharp unless marked.

## A second witness, added 2026-10-02 10:22

The desk ran the outside engine homr 0.7.0 on the three pages and scored its output against this draft with `tools/e16-harness/src/scan-scorer.ts` (`memo-desk-yardstick-homr-on-seven-songs_r1_2026-10-02.md`). **In 90 of the 99 bars homr and this draft agree in every pitch, every length, and every rest,** bar 83's D♯4 among them. Every difference lies in bars 45 to 53 (page 2, system 3), where homr's first staff holds eighth rests and pitches a fifth to an octave under the printed voice. What homr read there is NOT ESTABLISHED, so those nine bars rest on the desk's eye and the head measurements alone.

## Against Ilya's reader, added 2026-10-02 13:41

Code scored the reader against this draft (`report-code-length-is-read-from-shape_r1_2026-10-02.md`, step 3.1). The two differ in ten pitches: bars 20, 22, 40, 53, 56, 76, 80, 83, and 87 twice. Code judged seven to be reader errors, because an accidental stands beside the head, and left bars 20, 22, and 76 to the desk. The desk looked at `measure-length_r1_2026-10-02/crops.files/tch-pitch.png`: in bar 20 the ledger line passes through the head (C♯4), and in bars 22 and 76 the head lies in the first space (F♯4). homr reads all three as this draft does. **All ten are the reader's errors, and the draft is unchanged.** Code found no place where the scan disagrees with the draft's written length.

## Two readings the desk is least sure of

- **Bar 83, «сплю...»: D♯4.** Measured on the 400 dpi page, the head's centre is 12.7 px under the bottom line, where a half space is 14.5 px; the two heads before it (bar 82, E4 and E4) sit within 2 px of the line. The sharp sign is centred under the line too. So the print says D♯4. The desk has not established the piano's harmony in that bar and cannot say from the music whether E♯4 was meant.
- **Bar 53, «-кій»: G♯4.** The head's centre is 1.5 px from the second line from the bottom, and a sharp stands before it.

## The 99 bars

| Bar | Page | System | Bar in system | Heads | What is printed |
|---|---|---|---|---|---|
| 1 | 1 | 1 | 1 | 0 | whole-bar rest |
| 2 | 1 | 1 | 2 | 0 | whole-bar rest |
| 3 | 1 | 1 | 3 | 0 | whole-bar rest |
| 4 | 1 | 1 | 4 | 0 | whole-bar rest |
| 5 | 1 | 1 | 5 | 0 | whole-bar rest |
| 6 | 1 | 1 | 6 | 0 | whole-bar rest |
| 7 | 1 | 1 | 7 | 0 | whole-bar rest |
| 8 | 1 | 1 | 8 | 1 | rest (8th); rest (8th); F♯4 8th «Средь» |
| 9 | 1 | 1 | 9 | 3 | G4 8th «шум-»; A4 8th «-на-»; B4 8th «-го» |
| 10 | 1 | 2 | 1 | 2 | C♯5 quarter «ба-»; F♯4 8th «-ла» |
| 11 | 1 | 2 | 2 | 1 | rest (8th); rest (8th); D5 8th «слу-» |
| 12 | 1 | 2 | 3 | 2 | C♯5 quarter «-чай-»; F♯4 8th «-но,» |
| 13 | 1 | 2 | 4 | 1 | rest (8th); rest (8th); F♯4 8th «въ тре-» |
| 14 | 1 | 2 | 5 | 3 | B4 8th «-во-»; C♯5 8th «-гѣ»; D5 8th «мір-» |
| 15 | 1 | 2 | 6 | 3 | E5 8th «-ской»; C♯5 8th «су-»; B4 8th «-е-» |
| 16 | 1 | 2 | 7 | 2 | A4 quarter «-ты,»; A4 8th «те-» |
| 17 | 1 | 2 | 8 | 3 | G4 8th «-бя»; F♯4 8th «я»; E4 8th «у-» |
| 18 | 1 | 2 | 9 | 2 | B4 quarter «-ви-»; D4 8th «-дѣлъ,» |
| 19 | 1 | 3 | 1 | 1 | rest (8th); rest (8th); D4 8th «но» |
| 20 | 1 | 3 | 2 | 2 | B4 quarter «тай-»; C♯4 8th «-на» |
| 21 | 1 | 3 | 3 | 1 | rest (8th); rest (8th); C♯4 8th «тво-» |
| 22 | 1 | 3 | 4 | 3 | F♯4 8th «-и»; F♯4 8th «по-»; F♯4 8th «-кры-» |
| 23 | 1 | 3 | 5 | 3 | E4 8th «-ва-»; C♯4 8th «-ла»; D4 8th «чер-» |
| 24 | 1 | 3 | 6 | 1 | B3 dotted quarter «-ты;» |
| 25 | 1 | 3 | 7 | 1 | rest (8th); rest (8th); F♯4 8th «лишь» |
| 26 | 1 | 3 | 8 | 3 | G4 8th «о-»; A4 8th «-чи»; B4 8th «пе-» |
| 27 | 1 | 3 | 9 | 2 | C♯5 quarter «-чаль-»; F♯4 8th «-но» |
| 28 | 2 | 1 | 1 | 1 | rest (8th); rest (8th); D5 8th «гля-» |
| 29 | 2 | 1 | 2 | 2 | C♯5 quarter «-дѣ-»; F♯4 8th «-ли,» |
| 30 | 2 | 1 | 3 | 1 | rest (8th); rest (8th); F♯4 8th «а» |
| 31 | 2 | 1 | 4 | 3 | B4 8th «го-»; C♯5 8th «-лосъ»; D5 8th «такъ» |
| 32 | 2 | 1 | 5 | 3 | E5 8th «див-»; C♯5 8th «-но»; B4 8th «зву-» |
| 33 | 2 | 1 | 6 | 2 | A4 quarter «-чалъ»; A4 8th «какъ» |
| 34 | 2 | 1 | 7 | 3 | G4 8th «звонъ»; F♯4 8th «от-»; E4 8th «-да-» |
| 35 | 2 | 1 | 8 | 2 | B4 quarter «-лен-»; D4 8th «-ной» |
| 36 | 2 | 1 | 9 | 1 | rest (8th); rest (8th); D4 8th «сви-» |
| 37 | 2 | 2 | 1 | 2 | B4 quarter «-рѣ-»; D4 8th «-ли,» |
| 38 | 2 | 2 | 2 | 1 | rest (8th); rest (8th); B4 8th «какъ» |
| 39 | 2 | 2 | 3 | 3 | D5 8th «мо-»; C♯5 8th «-ря»; B4 8th «иг-» |
| 40 | 2 | 2 | 4 | 3 | A4 8th «-ра-»; G♯4 8th «-ю-»; G♮4 8th «-щій» |
| 41 | 2 | 2 | 5 | 1 | F♯4 dotted quarter «валъ.» |
| 42 | 2 | 2 | 6 | 1 | rest (8th); rest (8th); D5 8th «Мнѣ» |
| 43 | 2 | 2 | 7 | 3 | C♯5 8th «станъ»; B4 8th «твой»; C♯5 8th «пон-» |
| 44 | 2 | 2 | 8 | 3 | D5 8th «-ра-»; B4 8th «-вил-»; C♯5 8th «-ся» |
| 45 | 2 | 3 | 1 | 2 | B4 quarter «тон-»; A4 8th «-кій» |
| 46 | 2 | 3 | 2 | 1 | rest (8th); rest (8th); D5 8th «и» |
| 47 | 2 | 3 | 3 | 3 | C♯5 8th «весь»; B4 8th «твой»; C♯5 8th «за-» |
| 48 | 2 | 3 | 4 | 3 | D5 8th «-дум-»; B4 8th «-чи-»; C♯5 8th «-вый» |
| 49 | 2 | 3 | 5 | 1 | A4 dotted quarter «видъ,» |
| 50 | 2 | 3 | 6 | 1 | rest (8th); rest (8th); D5 8th «а» |
| 51 | 2 | 3 | 7 | 3 | D5 8th «смѣхъ»; D5 8th «твой,»; D5 8th «и» |
| 52 | 2 | 3 | 8 | 3 | D5 8th «груст-»; G4 8th «-ный,»; B4 8th «и» |
| 53 | 2 | 3 | 9 | 2 | C♯5 quarter «звон-»; G♯4 8th «-кій» |
| 54 | 2 | 4 | 1 | 1 | rest (8th); rest (8th); C♯5 8th «съ тѣхъ» |
| 55 | 2 | 4 | 2 | 3 | E5 8th «поръ»; D5 8th «въ мо-»; C♯5 8th «-емъ» |
| 56 | 2 | 4 | 3 | 3 | B4 8th «серд-»; A♯4 8th «-цѣ»; B4 8th «зву-» |
| 57 | 2 | 4 | 4 | 1 | C♯5 dotted quarter «-читъ!» |
| 58 | 2 | 4 | 5 | 1 | C♯5 8th (tied from the bar before); rest (8th); rest (8th) |
| 59 | 2 | 4 | 6 | 1 | rest (8th); rest (8th); F♯4 8th «Въ ча-» |
| 60 | 2 | 4 | 7 | 3 | G4 8th «-сы»; A4 8th «о-»; B4 8th «-ди-» |
| 61 | 2 | 4 | 8 | 3 | C♯5 dotted 8th «-но-»; F♯4 16th «-кі-»; F♯4 8th «-е» |
| 62 | 2 | 4 | 9 | 0 | whole-bar rest |
| 63 | 3 | 1 | 1 | 2 | C♯5 quarter «но-»; F♯4 8th «-чи» |
| 64 | 3 | 1 | 2 | 1 | rest (8th); rest (8th); F♯4 8th «люб-» |
| 65 | 3 | 1 | 3 | 3 | B4 8th «-лю»; C♯5 8th «я»; D5 8th «ус-» |
| 66 | 3 | 1 | 4 | 3 | E5 8th «-та-»; C♯5 8th «-лый»; B4 8th «при-» |
| 67 | 3 | 1 | 5 | 2 | A4 quarter «-лечь,»; A4 8th «я» |
| 68 | 3 | 1 | 6 | 3 | G4 8th «ви-»; F♯4 8th «-жу»; E4 8th «пе-» |
| 69 | 3 | 1 | 7 | 3 | B4 dotted 8th «-чаль-»; D4 16th «-ны-»; D4 8th «-я» |
| 70 | 3 | 1 | 8 | 0 | whole-bar rest |
| 71 | 3 | 2 | 1 | 2 | B4 quarter «о-»; C♯4 8th «-чи,» |
| 72 | 3 | 2 | 2 | 1 | rest (8th); rest (8th); C♯4 8th «я» |
| 73 | 3 | 2 | 3 | 3 | F♯4 8th «слы-»; F♯4 8th «-шу»; F♯4 8th «ве-» |
| 74 | 3 | 2 | 4 | 3 | E4 8th «-се-»; C♯4 8th «-лу-»; D4 8th «-ю» |
| 75 | 3 | 2 | 5 | 1 | B3 dotted quarter «рѣчь,» |
| 76 | 3 | 2 | 6 | 1 | rest (8th); rest (8th); F♯4 8th «и» |
| 77 | 3 | 2 | 7 | 3 | G4 8th «груст-»; A4 8th «-но»; B4 8th «я,» |
| 78 | 3 | 2 | 8 | 3 | C♯5 dotted 8th «груст-»; F♯4 16th «-но»; F♯4 8th «такъ» |
| 79 | 3 | 2 | 9 | 2 | rest (8th); G4 8th «за-»; G4 8th «-сы-» |
| 80 | 3 | 3 | 1 | 3 | F♯4 8th «-па-»; F♯4 8th «-ю,»; rest (16th); F♯4 16th «и» |
| 81 | 3 | 3 | 2 | 3 | F♯4 8th «въ гре-»; G4 8th «-захъ»; A4 8th «не-» |
| 82 | 3 | 3 | 3 | 3 | B4 dotted 8th «-вѣ-»; E4 16th «-до-»; E4 8th «-мыхъ» |
| 83 | 3 | 3 | 4 | 1 | D♯4 8th «сплю...»; rest (8th); rest (8th) |
| 84 | 3 | 3 | 5 | 0 | whole-bar rest |
| 85 | 3 | 3 | 6 | 1 | rest (8th); rest (8th); B4 8th «Люб-» |
| 86 | 3 | 3 | 7 | 3 | D5 8th «-лю»; C♯5 8th «ли»; B4 8th «те-» |
| 87 | 3 | 3 | 8 | 3 | A♯4 8th «-бя»; F♯4 8th «я»; A♯4 8th «не» |
| 88 | 3 | 3 | 9 | 2 | C♯5 quarter «зна-»; B4 8th «-ю,» |
| 89 | 3 | 4 | 1 | 1 | rest (8th); rest (8th); B4 8th «но» |
| 90 | 3 | 4 | 2 | 3 | B4 dotted 8th «ка-»; F♯4 16th «-жет-»; F♯4 8th «-ся» |
| 91 | 3 | 4 | 3 | 3 | F♯4 8th «мнѣ»; F♯4 dotted 8th «что»; F♯4 16th «люб-» |
| 92 | 3 | 4 | 4 | 1 | F♯4 dotted quarter «-лю!» |
| 93 | 3 | 4 | 5 | 1 | F♯4 8th (tied from the bar before); rest (8th); rest (8th) |
| 94 | 3 | 4 | 6 | 0 | whole-bar rest |
| 95 | 3 | 4 | 7 | 0 | whole-bar rest |
| 96 | 3 | 4 | 8 | 0 | whole-bar rest |
| 97 | 3 | 4 | 9 | 0 | whole-bar rest |
| 98 | 3 | 4 | 10 | 0 | whole-bar rest |
| 99 | 3 | 4 | 11 | 0 | whole-bar rest |

## Totals

- **99 bars, 174 heads, 172 syllables, 2 ties** (bars 57 to 58, C♯5; bars 92 to 93, F♯4). 48 printed rests inside bars, and 16 bars of whole-bar rest (bars 1 to 7, 62, 70, 84, and 94 to 99; bar 84 is the fifth bar of page 3, system 3).
- Lowest printed head B3 (bars 24 and 75), highest E5 (bars 15, 32, 55, 66).

## What is not established

- **The syllables' punctuation and spelling.** The syllables are the desk's reading of the 1878 orthography on the sheets. The letters under each head were read; commas, the semicolon, and the hard signs were not checked glyph by glyph.
- **«въ» and «съ»** are written with the syllable that follows them (bars 13, 54, 55, 59, 81), because neither holds a vowel. Whether the scorer wants them apart is not settled.
- Whether the scan scorer of `QUEUE.md` row 22 accepts this file's extra fields. It was being written while this draft was made.
- Dann has not checked any bar.
