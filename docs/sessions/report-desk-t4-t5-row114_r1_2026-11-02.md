# Report: T4 (fallback floor) and T5 (what the reader returned), row 114 first file (Sonnet helper C, r1, 2026-11-02)

Measure only. Nothing committed or pushed; no clone branch touched. First file only, songs 1 to 5 (590 syllables). Tree: `/root/desk/B/tree-t2` (cloud-lane-28 5ee60a6 + Shane 83e8610, local merge 316ba59, plus T2 scratch) copied to `/root/desk/C/tree`, plus the T4/T5 scratch `/root/desk/C/scratch-t4.diff` (two files: `underlay-fallback.ts`, `underlay-page.ts`), built with `VITE_ARM=T2` (the same arm as the control; the build log is `build.log`). Port 4175, homr on wasm, Chromium from `/opt/pw-browsers`, driver `measure.mjs`, one song at a time.

## Answer first

**T4: 373 of 590 (b), unchanged. +0 against the +8 bar: NOT MET.** All five MusicXML files are byte-identical to the control captures (`/root/desk/B/cap/t2/s1..s5`) and `ledger-t4.tsv` is byte-identical to `/root/desk/B/ledger-t2.tsv`. The fallback newly seated no system anywhere. So the second half of the bar (no system newly written under half exact) holds vacuously.

Why it did nothing (from the dump, per M-a class A system, section 4): the MIN_WORDS gate was not the blocker in any of them.

**T5, one line per system:**
- Song 1 p2 s1 (class B, 15): row cut (2 rows); the reader returned only dashes and a lone `——-"` in row 1 and `.-`, `ттт""--`, `о` in row 2; no letters of the printed row read. Rows are not "refused", there is nothing to refuse.
- Song 4 p4 s1 (class B, 6): one row cut (y 1776..1825); the reader returned nothing (0 boxes).
- Song 5 p2 s1 (class B, 9): two rows cut; row 1 returned only dash and dot boxes (`|`, `-`, `..`, `——--`), row 2 returned nothing.
- Song 5 p4 s3 (class B, 12): row cut and read mostly well: «Е-ду-шу не-вин-ну-ю теп-лоп за-от-уш»; refused by `rowLanguage`: sewn words (Едушу, невинную, теплоп, заот, уш) hold 1 known of 5 counted, share 0.20 against 0.30. Hand count against the shipped dictionary file, not run through the app's `isWord`. The fallback cannot help: it calls the same `rowLanguage`.
- Song 2 p5 s1 = app page 3 sys 1 (junk system, 14): row cut but nearly empty: 3 letter tokens («ее», «і», «п») among dashes; chosen as Russian because the one counted word «ее» is known (1 of 1). 18 free notes against 3 tokens. Row 3 of the same system read «л. ш Мепно шояязо» (junk, not chosen).
- Song 2 p6 s1 = app page 4 sys 1 (junk system, 13): row 1 is chosen (Russian) and read well: «Ра-дость-мгно-вень пей-те до дна Гром-ки-е пес-ни», 13 units against 29 free notes (console "1: 29 against 13"). So the "junk" seen by M-a is not what this tree's reader returned here. The ledger's truth for this system begins «се лых ви дит за ря!», all 15 not exact (`letters (no token carries it)`). Whether ledger page 6 system 1 and app page 4 system 1 are the same system: NOT ESTABLISHED (see below).

## Control

`python3 /root/desk/B/score114b.py /root/desk/B/cap/t2` printed 373 (52, 137, 29, 84, 71). Matched exactly before any build. Run of the new build scored with the same scorer: 373, same per-song split.

## The change

`/root/desk/C/scratch-t4.diff`. `fallbackRow(rows, isWord, minWords?)` takes a per-row minimum; at the call (`underlay-page.ts`, before `rescue`) each row gets 2 where its letter-bearing token count (after `pageTokens`, so after `splitTokens`) is at most `free.length` (the tie-based free count at that point, before T2's slur-aware recount), else 3. Plus the `[t5]` dump, which only calls `console.info` (page counter, per system: notes, free, rows, rescue, minWords; per row: y range from `offsetY` and `transform.height`, `rowLanguage`, the row's words, tokens with page x, and the reader's raw boxes in the row frame). The dump changes no output: all five songs byte-identical, including the song-3 systems the fallback already seated in the control (page 2 sys 1 rescue=1, page 4 sys 1 rescue=0).

## Per song

| song | printed | (b) T4 | (b) control | changed |
|---|---|---|---|---|
| 1 | 81 | 52 | 52 | none |
| 2 | 189 | 137 | 137 | none |
| 3 | 68 | 29 | 29 | none |
| 4 | 121 | 84 | 84 | none |
| 5 | 131 | 71 | 71 | none |
| all | 590 | 373 | 373 | none |

Gained rows: 0. Lost rows: 0. Changed rows: 0 (ledgers byte-identical).

## The class A systems (T4's target) in the dump

| System | free notes | what the reader returned | why still unseated |
|---|---|---|---|
| song 2 app p1 s1 (3: «Дайте бо-») | 3 | row 1 `І эоъ дь пи ъѵ ът п`, row 2 nothing, row 3 `ѣа` and dashes | junk; the words are not read at all |
| song 3 p2 s3 (1: «-рой.») | 1 | row 1 nothing, row 2 `м м»` | no row with words |
| song 3 p2 s4 (3: «Гроб о-пу-») | 3 | row 1 `--——еу———- гроо у »л` | counted words 2, known 0 («еугроо» not a word); `rowLanguage` other. Row 1 min stayed 3 (4 letter tokens > 3 notes) |
| song 3 p3 s1 (4: «-сти-ли в мо-ги-») | 4 | row 1 `ы-ы в--- оо рььы ь-——` | letters glued with dashes; no dictionary word |
| song 3 p3 s4 (1: «гроб,») | 1 | row 1 `г—— гроб, І`; words «ггроб,», «І» | one counted word (min 3 kept: 3 letter tokens > 1 note), and the g-prefix breaks the lookup |
| song 3 p5 s4 (3: «лист-я шу-») | 3 | row 1 `л и сть - я шу` | **sewn «листья» + «шу»: 2 counted, 1 known (0.5), would qualify at 2**; kept at min 3 because the row has 5 letter tokens against 3 free notes |

So the gate "tokens at most free notes" excluded the one system that a lower floor would have seated. Not measured: a gate counting sewn words instead of tokens, and what seating 5 tokens on 3 notes would score. NOT ESTABLISHED; it is at most 3 syllables.

## What I could not establish

- Whether the rows' y ranges hold the printed text. I tried to look at song 1 page 2 at a guessed raster scale and my crop showed the piano staff, so I could not tie the dump's y ranges to the page. The app's raster scale is not in the dump (a page width/height line would fix it). So for "reader returned dashes only" I know what came back, not whether the crop was on the lyric line or beside it. The row heights are small (29 to 52 px for most rows) which might fit a cut that is too thin; NOT ESTABLISHED.
- Whether `rowLanguage`'s 0.20 for song 5 p4 s3 matches the app's `isWord` (modern form via `modernisePreReform` not applied in my hand count).
- The mapping between the ledger's page/system numbers and the app's page/system for song 2 (the ledger pages 3 to 6 are app pages 1 to 4; systems matched by order only). For song 2 p6 s1 the row text and the ledger truth differ (a repeat or a different verse); not resolved.
- Class B in songs 1, 4 and 5: the dump shows the reader's output, not why it was empty. Nothing here tests a different row cut.

## Files

`/root/desk/C/cap/s1..s5` (MusicXML, lyrics, console with `[t5]` lines), `/root/desk/C/ledger-t4.tsv`, `/root/desk/C/scratch-t4.diff`, `/root/desk/C/run.sh`, `/root/desk/C/dict.py` (dictionary lookup used for the hand counts). About 115,000 tokens used.
