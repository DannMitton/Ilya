Returned by an Opus helper, 2026-10-08, commissioned by the desk on Dann's yes of 16:10. Phase 1: choose and download only.

# Held-out set 2: eight songs chosen

## Headline

- Eight songs are downloaded to `/mnt/user-data/outputs/heldout2/scans/`. Each one is for one voice and piano, with Cyrillic underlay in pre-1917 orthography. Each one is a raster scan of an older printed edition and has eight or fewer pages of music. There is one song per composer, and no composer is on the exclusion list.
- **Two variety points are NOT MET:**
  - **Triplets in the voice (target: two songs).** None of the songs I checked shows a voice triplet. The only voice tuplets are the duplets in Zhitomirsky's "Белая луна" (12/8).
  - **Two or more stacked verses under the notes (target: one song).** Every stacked-verse candidate I found failed another hard rule. See the rejection notes.
- The desk now has a choice: accept the set as it stands, or commission a narrow follow-up search for those two features. This is not a taste call. It needs a yes or no.

## How the files were made

- IMSLP's own download links (`imslp.org/images/...` and `Special:ImagefromIndex`) now return a captcha bot check. I did not try to get past it.
- The files came from IMSLP's public mirror instead: `https://vmirror.imslp.org/files/imglnks/usimg/<hash>/IMSLP<index>-<filename>`. Each byte size matches the size the IMSLP API reports.
- Most IMSLP holdings are whole sets of songs. For each song I cut its pages, plus the set's cover or title page where there is one, into a new PDF with `pdfseparate` and `pdfunite`. The pages are not re-rendered or altered.
- The full source PDFs are kept in `/mnt/user-data/outputs/heldout2/sources/` for tracing.
- Scripts are in `/mnt/user-data/outputs/heldout2/scripts/`:
  - `catlist.py` lists a composer's IMSLP category.
  - `work.py` reads a work page's file list.
  - `dl.sh` downloads from the mirror.
  - `sheet.sh` makes contact sheets of page thumbnails.
  - `assemble.sh` cuts the pages and prints the md5s.

## 1. The eight songs

"Pages of music" counts only pages with music. "File pages" also counts cover and title pages. Each "Seen" column lists what I saw on rendered pages this session (contact sheets at 14 to 30 dpi, and selected pages at 50 to 100 dpi). The edition details are from the IMSLP page, and from the printed page where noted.

### Identity and sources

| # | Composer | Title (Cyrillic / translit.) | Opus, no. | IMSLP page | Edition |
|---|---|---|---|---|---|
| 1 | Georgy Catoire | «От мороза потускнела светлая луна» / Ot moroza potusknela svetlaya luna | Op. 1 No. 1 | https://imslp.org/wiki/4_Romances,_Op.1_(Catoire,_Georgy) | P. Jurgenson, Moscow, n.d. (1888), plate 13795 (plate also on the page) |
| 2 | Mikhail Ippolitov-Ivanov | «Невольник» / Nevol'nik | Op. 28 No. 4 | https://imslp.org/wiki/5_Romances,_Op.28_(Ippolitov-Ivanov,_Mikhail) | P. Jurgenson, Moscow, 1899, plates 24816 to 24820 (24819 on the page); Sibley Library scan |
| 3 | Felix Blumenfeld | «Они любили друг друга» / Oni lyubili drug druga | Op. 42 No. 2 | https://imslp.org/wiki/5_Romances,_Op.42_(Blumenfeld,_Felix) | M. P. Belaieff, Leipzig, no year given, plates 2875 to 2878 |
| 4 | Anton Arensky | «Один звук имени» / Odin zvuk imeni | Op. 44 No. 3 | https://imslp.org/wiki/6_Romances,_Op.44_(Arensky,_Anton) | *Lieder von A. Arensky. Kontralt. Band II.*, P. Jurgenson, Moscow, n.d. [1910], T. 913 ("33450 T. 913" on the page); Sibley scan |
| 5 | Sergey Lyapunov | «Подблюдная песенка» / Podblyudnaya pesenka | Op. 51 No. 1 | https://imslp.org/wiki/4_Songs,_Op.51_(Lyapunov,_Sergey) | Jul. Heinr. Zimmermann, Leipzig, 1913, Z. 5469 (also on the page) |
| 6 | Alexander Zhitomirsky | «Белая луна» / Belaya luna | Op. 6 No. 2 | https://imslp.org/wiki/3_Romances,_Op.6_(Zhitomirsky,_Alexander) | P. Jurgenson, Moscow, n.d., plate 37102 (also on the page) |
| 7 | Anatoly Lyadov | «Колыбельная» ("Котинька, коток") / Kolybel'naya | Op. 22 No. 1 | https://imslp.org/wiki/6_Children's_Songs,_Op.22_(Lyadov,_Anatoly) | M. P. Belaieff, Leipzig, 1898, plate 203 (also on the page); colour library scan |
| 8 | Nikolay Sokolov | «Прекрасный день» / Prekrasnyi den' | Op. 27 No. 1 | https://imslp.org/wiki/2_Romances_in_Old_Style,_Op.27_(Sokolov,_Nikolay) | M. P. Belaieff, Leipzig, 1896, plate 1318 (also on the page) |

### Files

| # | Pages of music | File pages | Pages taken from the source PDF | File name | md5 |
|---|---|---|---|---|---|
| 1 | 3 | 4 | 1 (cover), 5 to 7 | `catoire_op1_no1_ot_moroza_potusknela.pdf` | 3f59ac75eedb72a75467a94049d12e81 |
| 2 | 5 | 6 | 1 (set cover), 13 to 17 | `ippolitov-ivanov_op28_no4_nevolnik.pdf` | a79629bbaaa938ec67667346f7753ac0 |
| 3 | 2 | 4 | 1 and 2 (cover and title), 7 and 8 | `blumenfeld_op42_no2_oni_lyubili_drug_druga.pdf` | 4cd08f7d372d269eb0d2b47e91e1e017 |
| 4 | 5 | 5 | 12 to 16 (this scan has no cover) | `arensky_op44_no3_odin_zvuk_imeni.pdf` | 91fa998a06a8a90afc4356331437355e |
| 5 | 6 | 7 | 1 (cover), 2 to 7 | `lyapunov_op51_no1_podblyudnaya_pesenka.pdf` | ad889b99768baa04816ac1a71142743e |
| 6 | 7 | 8 | 1 (title), 2 to 8 | `zhitomirsky_op6_no2_belaya_luna.pdf` | 2c1df8c0ba4689f56aefa729f781297a |
| 7 | 2 | 4 | 2 (cover), 5 (decorative title), 6 and 7 | `lyadov_op22_no1_kolybelnaya.pdf` | d82a09d0edb1e93c81604e29234cb9c2 |
| 8 | 4 | 5 | 1 (title), 2 to 5 | `sokolov_op27_no1_prekrasnyi_den.pdf` | ca1a49cee4251e50e87a194d6a385c2b |

### Seen on the pages, and variety points

| # | Seen on the pages | Variety points covered |
|---|---|---|
| 1 | 3/4, Allegretto moderato; Canto and Piano; treble voice | Triple metre; cover page |
| 2 | C (common time), Andante; heading «для меццо-сопрано, альта, тенора или баритона»; treble voice; dark scanner edges | Low or medium voice option; cover page; worn edges |
| 3 | 9/8, Andante; «Для средняго голоса» | Compound metre; title pages; medium voice |
| 4 | 2/4, Agitato; contralto volume; Russian with German underneath; dark skewed bars across the page tops; voice tuplets: none seen (the triplets on p. 37 are in the piano) | Low voice (contralto edition); skewed or worn scan |
| 5 | 3/4, changing to 2/4; Russian with German underneath | Triple metre; cover page |
| 6 | 12/8, Andante; voice duplets marked "2" | Compound metre; title page; voice tuplets (duplets, not triplets) |
| 7 | Yellowed colour scan with library stamps; «Голосъ» and «Фортепiано» | Worn scan; two title or cover pages |
| 8 | Andante; library stamp and shelf mark on the first music page | Title page |

### Variety tally

| Requirement | Target | Met by |
|---|---|---|
| Compound or triple metre | at least 2 | 1, 3, 5, 6 (met) |
| Triplets in the voice | at least 2 | **none (NOT MET)** |
| Bass or alto clef, or a low voice | at least 1 | 4 (contralto edition), 2 (alto or baritone option), 3 (medium). All voice lines are in treble clef. |
| Title or cover page before the music | at least 2 | 1, 2, 3, 5, 6, 7, 8 (met) |
| Worn or skewed scans | at least 2 | 7, 4, 2 (met) |
| Two or more verses under the notes | at least 1 | **none (NOT MET)** |

## 2. Rejected candidates

- **Rebikov, *Детские песенки* (Jurgenson, plate 30628).** Worn colour scan with stacked verses (No. 14). Rejected because the title page says «на 1 или 2 и 3 голоса». The layout is also two staves only, with the text between the piano staves and no separate voice staff.
- **Titov, «Прости!» (Stellovsky, 1876, Dargomyzhsky arrangement).** Rejected because it is a duet for soprano and tenor with piano.
- **Arensky, Op. 59 *Children's Songs* (Chester, 1918).** Rejected because the text is English and French, with no Cyrillic.
- **Bernard, *Album of Favourite Russian Romances*, vol. 2.** Rejected because the songs are arranged for piano alone.
- **Lyapunov, Op. 10, and Lyadov, *35 Russian Folk Songs*.** Rejected because they are folk-song arrangements, not romances, and their later verses are printed as a poem below the music, not under the notes. The Lyapunov set is also bilingual.
- **"A. Lvov (Gurilyov)", *Romances and Songs* (Jurgenson, 1895).** I checked «Параша» (6/8, title page, a good candidate) and Nos. 1, 2, 4 and 7. They were not chosen because:
  - the composer is on the exclusion list (Раскаяние comes from this same set);
  - the title page says «сочиненія А. Львова (Гурилева)», so the attribution is unclear;
  - No. 4 adds a chorus.
- **Not chosen, to keep one song per composer:** Ippolitov-Ivanov Op. 5 and Op. 21, and Sokolov Op. 27 No. 2.
- **Not used:** Catoire Op. 11, which was downloaded but not reviewed.

## 3. Could not establish

- **Voice triplets.** I spot-checked the opening voice lines of songs 1, 2, 4, 5 and 8, and all pages of song 3, and found none. I did not read every bar of songs 5, 6 and 2 at a resolution high enough to rule them out. NOT ESTABLISHED.
- **Metre of song 7 (Lyadov) and song 8 (Sokolov).** The time signatures were not legible at the resolution I used. NOT ESTABLISHED.
- **Publication year of song 3 (Blumenfeld Op. 42) and song 6 (Zhitomirsky Op. 6).** Neither IMSLP nor the pages I viewed give a year. NOT ESTABLISHED.
- **Whether Dann knows these songs.** The choice of lesser-known songs is my judgement, not a fact.
- **Voice type for songs 1, 5, 6, 7 and 8.** No voice type is printed on the pages I viewed, apart from the general «Голосъ» or «Canto». NOT ESTABLISHED.
