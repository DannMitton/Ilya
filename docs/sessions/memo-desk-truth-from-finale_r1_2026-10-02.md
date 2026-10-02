# Memo: truth for sixteen songs, taken from Dann's own engravings

**Written by:** the desk (Fable), 2026-10-02 about 09:00. **What it answers:** plan r4, phase 0, "truth files", and Dann at 08:52: *"all six Sunless songs are in my Finale Files, so is Kabalevsky's op 52 which are ten Shakespeare sonnets... Please use these for our benefit!"*

## What was done

The desk staged sixteen `.musx` files from `~/Documents/Finale Files` and ran the harness's own extractor on each: `musxToMnxJson` (`tools/e16-harness/src/denigma-convert.ts`), then `extractGroundTruth` (`tools/e16-harness/src/ground-truth.ts`), which is the product's own parse path. It ran in the desk's workspace on a clone of `cloud-lane` at `a3dde11`, under Node 22.22.0.

**The files are on the Mac at `tools/e16-harness/output/truth/`,** sixteen `*.truth.json`. That folder is git-ignored (`tools/e16-harness/.gitignore:2`), so nothing here ships. Each file holds every note and rest of the vocal line: bar, onset, written length, MIDI pitch, and the syllable with its place in the word.

## What each file holds

Read from the files themselves. Verse 1 is the Cyrillic line; each file also carries a verse 2.

| File | Clef | Key (sharps +, flats -) | Bars | Notes | Rests | Syllables | MIDI range | Parser errors, warnings |
|---|---|---|---|---|---|---|---|---|
| `mussorgsky_sunless-01_within-four-walls` | F4 | 2 | 18 | 96 | 19 | 96 | 49 to 62 | 0, 0 |
| `mussorgsky_sunless-02_you-did-not-recognize-me` | G2 8vb | 2 | 12 | 68 | 13 | 68 | 45 to 63 | 0, 0 |
| `mussorgsky_sunless-03_finished-is-the-noisy-idle-day` | G2 8vb | 0 | 41 | 222 | 40 | 204 | 47 to 64 | 0, 1 |
| `mussorgsky_sunless-04_be-bored` | G2 | 2 | 29 | 116 | 29 | 108 | 59 to 75 | 0, 0 |
| `mussorgsky_sunless-05_elegy` | G2 8vb | 0 | 61 | 258 | 48 | 251 | 49 to 64 | 0, 0 |
| `mussorgsky_sunless-06_on-the-river` | G2 8vb | 7 | 55 | 161 | 26 | 144 | 49 to 62 | 0, 0 |
| `kabalevsky_shakespeare_t01-or-i-shall-live-your-epitaph-to-make` | F4 | -1 | 67 | 152 | 10 | 146 | 45 to 64 | 0, 0 |
| `kabalevsky_shakespeare_t02-weary-with-toil-i-haste-me-to-my-bed` | F4 | -4 | 70 | 157 | 11 | 146 | 46 to 63 | 0, 0 |
| `kabalevsky_shakespeare_t03-my-love-is-strengthend-though-more-weak-in-seeming` | F4 | -2 | 52 | 157 | 18 | 146 | 48 to 62 | 0, 0 |
| `kabalevsky_shakespeare_t04-when-to-the-sessions-of-sweet-silent-thought` | F4 | -3 | 39 | 151 | 14 | 146 | 48 to 64 | 0, 0 |
| `kabalevsky_shakespeare_t05-cupid-laid-by-his-brand-and-fell` | F4 | 1 | 90 | 160 | 10 | 146 | 47 to 64 | 0, 5 |
| `kabalevsky_shakespeare_t06-o-that-you-were-yourself` | F4 | -6 | 37 | 153 | 16 | 140 | 46 to 63 | 0, 0 |
| `kabalevsky_shakespeare_t07-music-to-hear-why-hearst-thou-music-sadly` | F4 | 0 | 53 | 163 | 19 | 148 | 47 to 62 | 0, 0 |
| `kabalevsky_shakespeare_t08-no-longer-mourn-for-me-when-i-am-dead` | F4 | -4 | 32 | 154 | 10 | 140 | 46 to 61 | 0, 0 |
| `kabalevsky_shakespeare_t09-then-hate-me-when-thou-wilt` | F4 | 5 | 39 | 149 | 19 | 146 | 47 to 63 | 0, 0 |
| `kabalevsky_shakespeare_t10-why-is-my-verse-so-barren-of-new-pride` | F4 | -1 | 83 | 156 | 10 | 146 | 48 to 64 | 0, 0 |

## What the two sets are for

- **The six *Sunless* files** are truth for the scan reader: pitch, written length, and syllable for every note. The scan is `~/Downloads/IMSLP113877-PMLP232488-Mussorgsky_-_Without_Sun.pdf`, 23 pages, Russian over German. By the desk's look at every page at 40 dpi: song 1 is pages 1 to 2, song 2 pages 3 to 4, song 3 pages 5 to 8, song 4 pages 9 to 10, song 5 pages 11 to 17, song 6 pages 18 to 23.
- **The ten sonnets** are the measuring set for lines restored (plan r4, track B2): a sonnet has fourteen lines, and seven of the ten files hold 146 syllables. They are not scan-reader truth. No scan of them is in hand.

## What could not be established

- **Whether each engraving matches its scan.** The keys the files hold (2, 2, 0, 2, 0, 7 sharps) look the same as the scan's at 40 dpi; that is a glance, not a reading. Bar counts, the edition each engraving follows, and any note the editions differ on are not checked.
- **The octave.** Five of the six *Sunless* files sound in a bass's octave (F clef, or G clef an octave down). The scan's voice staff is not read here. The scorer has to compare pitch by letter and octave relative to the clef, or by a fixed octave shift for each song.
- **Kabalevsky's music is in copyright in Canada to the end of 2057** (he died in 1987; life plus 70 since 2022-12-30). **Marshak's translations have been public domain in Canada since 2015** (he died in 1964; life plus 50, and the extension is not retroactive). Corrected 09:05 against the Canadian Association of Research Libraries' FAQ; the first version of this line called both "in copyright". Dann ruled at 09:00 that the work plans as if the sonnets are cleared for scholarly use (`../memory/OPEN.md`, "N.178 AND THE SCAN READER", item 17). A DESK DEFAULT keeps their truth in the git-ignored folder and out of the public repository.
- **The line breaks of the ten sonnets.** The files hold syllables on notes, with no line ends. The fourteen lines of each have to come from the poem.

## A defect found on the way

**The harness's truth path no longer runs under plain Node.** `packages/score-parser/src/mnx-parser.ts` imports `./pickup` with no file extension, and Node refuses it: `ERR_MODULE_NOT_FOUND ... packages/score-parser/src/pickup`. The harness README says the path needs no build step. It ran through `npx tsx`, which resolves the import. The scorer brief repairs or records this.
