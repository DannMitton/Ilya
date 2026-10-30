# Brief: N.135, a fallback when no row passes the word test, r3 (desk, Opus, 2026-10-29)

For an antagonistic review, then Dann's decision. Ruled in by Dann 2026-10-29 19:47 (*"yes, brief that fallback with an Opus review"*). Phase 0 measures only; Phase 1 becomes a Code brief after Phase 0 and Dann's yes. "Fallback" and "syllable-likeness" are the desk's coined terms.

## 0. Why, in the singer's terms

On U5 page 6, system 4 (`~/Downloads/_desk-2026-10-28/a2-inputs/pdfs/U5.pdf`), the reader read the Russian row exactly: «тейской ме ло чи неза. глу. шимый шо пот, У» against the print «тей- ской ме- ло- чи не- за- глу- ши- мый шо- пот, у-». Ilya threw it away and seated nothing, so the singer gets 13 empty notes under a row Ilya had read. The publisher sets wide-spaced syllables with low marks between them (measured by the desk at 400 dpi: the marks' centres about four-fifths of the way down the letter height, where a hyphen sits at mid-height), so the row reads as separate syllables, not words.

## 1. What the code does (read this session, `cloud-lane-21` `d6db949a`, identical in `apps/web/src/lib/omr/` to `Shane` `f6c8ae43`)

- `seatPage` (`apps/web/src/lib/omr/underlay-page.ts:152`), per system, per row in order: forms the row's words (`rowWordSpans(pageTokens(row, reads))`, `:177-180`), skips the row unless `rowLanguage(words, seams.isWord)` is `'russian'` (`:181`), and seats only the first row that passes (`if (seated) continue; seated = true;`, `:189-190`).
- `rowLanguage` (`omr/underlay-language.ts:56`): a row is Russian where at least `RUSSIAN_SHARE` = 0.3 (`:32`) of its words of `MIN_LETTERS` = 2 letters or more (`:25`) are dictionary entries (`wordKnown`, `:46`).
- A system with no row seated is reported to the singer by the unread-bars banner (`omr/underlay-song.ts:83-90`, `unread-bars.ts`), ratified EN and FR 2026-10-28.

## 2. What the desk measured (shipped code, A2's captures, 18 build songs)

Script `rows10.mjs` dumps every row's words, call, and seating with the build's own `pageTokens`, `rowWordSpans`, `rowLanguage`, and `wordKnown`; `rowcall2.py` matches each printed row (truth key `p<page>s<system>r<row>`) to the captured row of that system most like it (`difflib` ratio on letters) and sorts the printed syllables. Archive `~/Downloads/_desk-2026-10-29/drift-look_2026-10-29.tgz` (md5 `204c7d8b`).

| what happened to the printed row | syllables |
|---|---|
| the best-read row is the one seated | 2,316 |
| the best row is called other, and nothing is seated in its system (F) | 73 |
| the best row is called other, and a different row is seated (E) | 12 |
| the best row is called Russian, but a row above it is seated first (D) | 10 |
| no captured row resembles the print (ratio under 0.5) | 74 |
| the system was not captured | 53 |
| total | 2,538 |

Examples of F: U5 p6s4r1 (ratio 1.00, 2 of 9 words known), P p2s4r1 (0.91, 1 of 7: «сътъхъпоръвъмоенъсердцѣ»), B04 p2s3r1 (0.91, 1 of 7). Of D: S p1s1r2 (1.00, 3 of 3 known; a noise row «ѵ Му съпа, пту» above it seated first). Of E: B06 p3s3r1 (0.94, 0 of 7 known: «з вучат», «Б ыл», «н я», words broken by spaces; a noise row «ж ѣѣѣ з в в» seated). 19 of 239 captured systems seat no row (K 5, B10 3, U5 3, B07 2, B09 2, B04 1, B06 1, P 1, U6 1); how many of those are piano-only systems with nothing to seat is NOT ESTABLISHED.

## 3. The design

**R1, the fallback (targets F, 73).** Where no row of a system passes `rowLanguage`, choose the row with the highest syllable-likeness, and seat it only if that score clears a floor Phase 0 sets. Syllable-likeness of a row, from its tokens: the share of tokens made only of Cyrillic letters (modern and pre-reform) and marks; the share of those holding exactly one vowel letter (`CYRILLIC_VOWEL`, «й» a consonant, `CONTRACT.md` §0.1); and the ratio of the row's one-vowel tokens to the system's free notes (`freeNoteXs`, `omr/underlay-counts.ts:40`), near 1 where the row is the lyric. The fallback never seats a row with any Latin letter (the German row) and never seats in a system with no voice notes.

**R2, the best Russian row, not the first (targets D, 10).** Where two or more rows of a system pass `rowLanguage`, seat the one with the highest syllable-likeness instead of the first. Measured separately from R1.

**R3, sew across a broken word before the test (targets part of E, 12).** Before `rowLanguage`, also try joining adjacent tokens with no vowel or one letter («з»+«вучат», «Б»+«ыл»); a row passes if either form passes. Measured separately; the 2026-10-28 harness found a gap rule lost at every threshold for seating, but this joins only for the test, not for seating.

Each rule reports to the console which rule chose the row, and nothing is marked for the singer. The banner still names a system where nothing was seated. The Text view does not change.

## 4. Phase 0: measure first (desk helper, Sonnet)

On A2's captures through the replay at `f6c8ae43` (`replay-scripts_2026-10-29.tgz`, the README's commands; `real7.mjs` and `rows10.mjs` from the two desk archives), with the build's own functions:
1. Controls: the replay reproduces 1,880 / 1,710 / 1,870 / 640 / 79; `rowcall2.py` reproduces section 2's table.
2. R1, R2, R3 each alone, then together, as a copy of `underlay-page.ts` with the rule inserted where `:181-190` decide: read right, (b), (a), (c), vowelless alone, per song, and section 2's table again.
3. **Harm:** every system where a rule seats a different row than today, listed with the row seated, its words, and whether the print's row was the one chosen; and every system where the fallback seats a row of noise.
4. **Held out:** the floor of R1 and the weights of syllable-likeness set on half the songs and reported on the other half; B01 to B10 also held out as one group.
5. The 19 systems with no row seated: for each, whether it holds voice notes (`system.notes`), so a piano-only system is never counted as a loss.

**Decision gate for Dann:** a rule goes to Phase 1 if it gains on the held-out half and seats a noise row in no more than one system in twenty of those it changes (DESK DEFAULT).

## 5. Phase 1 (Code, cloud lane, after Phase 0 and Dann's yes)

The rules that pass, in `omr/` beside `rowLanguage`, pure, with tests and mutants (a mutant that drops the Latin-letter guard must fail); `UNDERLAY_READER` raised one version (`omr/stamp.ts`); behind `?words=read` (`underlay-switch.ts:20-27`, per the browser report).

## 6. Cross-site line (`CONTRACT.md` §4)

Phase 1 changes which row a system seats. Other sites that judge a row or depend on that choice: `rowLanguage` (`underlay-language.ts:56`, which follows the pattern of `ocr-guard.ts`'s `unknownWordShare`), the unread-bars banner (`underlay-song.ts:83-90`), step 2's per-system failure and step 7's counts (`underlay-page.ts`, `underlay-counts.ts`), and the browser measure's per-row figures. The Phase 1 brief says what depends on them agreeing.

## 7. NOT ESTABLISHED

Every yield; how many of the 19 empty systems hold voice notes; whether the low syllable marks are read as periods elsewhere in this publisher's songs (U5's «неза. глу.» suggests so); whether the 74 "no row resembles the print" are strips cut in the wrong place or letters too damaged; the 53 "not captured" by cause.

## Amendments, applied (r2, desk, 2026-10-29 20:2x). Where this section and anything above it differ, this section wins.

The Opus review standing in for Fable (`review-opus-brief-row-fallback_r1_2026-10-29.md`, SEND WITH AMENDMENTS, 9, 183k tokens) is applied in full below, verbatim from its "Amendments" section. The desk re-totalled the prototype's three scored runs (`total.py` on `rev-rf/sc-off`, `sc-syl`, `sc-dp`: 1,880 / 1,710, 1,958 / 1,762, 1,939 / 1,750) and confirmed that `apps/web/src/lib/omr/` is identical at `d6db949a` and at `Shane` `f6c8ae43` (`git diff --stat`, empty), which closes the review's first NOT ESTABLISHED.

**Ruled by Dann 2026-10-29 20:13 (*"A"*), on the desk's offer of three (A leave, B stay, C a new gentler line):** a system the fallback seats leaves the unread-bars banner; the singer reads and corrects the words directly. Paired with that ruling, **DESK DEFAULT: DS (dictionary sewing) is the form preferred**, because it seated no known noise row and a noise seat now leaves the banner silently; S+V is still measured beside it, and S only as the reference.

## Amendments

### 1. Strike R2. It costs eight times what it gains

Evidence: I applied R2 as briefed (syllable-likeness from the brief's three shares; `a5.py`) to the 86 systems that hold two or more Russian-called rows. It keeps today's row in 76. It moves 2 systems to the lyric row (S p1s1, S p2s3: 8 syllables) and 7 away from it (B07 p3s1, S p4s3, S p5s1, U5 p2s3, U5 p3s1, U5 p5s2, U6 p5s4: 66 syllables). Noise rows of one-vowel tokens are what syllable-likeness rewards («а а а ао а а а а о а»). By dictionary count it loses 21 against 8; by share, 512.

Replace section 3's R2 paragraph and section 4 item 2's "R2" with:

> **R2 is not built.** Measured on the review's prototype, choosing the most syllable-like Russian row instead of the first moves 7 systems away from the lyric row (66 printed syllables) and 2 toward it (8); choosing by dictionary count moves 3 away (21) and 2 toward (8). The first row that passes stays the rule. D (10 syllables, all on S) stays open.

### 2. Strike R3 as briefed. Fold its idea into R1 as dictionary sewing, used only as a fallback

Evidence (`alt.mjs`, `a8.py`): with "either form passes", 4 systems change. B06 p3s3 gains its lyric row; U5 p5s3 seats the noise row «а (о» above its lyric row and loses it; K p4s3 and U6 p3s3 seat noise. Lyric-row syllables fall from 2,316 to 2,312. A looser test on every row lets noise above the lyric pass first.

Replace section 3's R3 paragraph with:

> **R3 is not built as a second test on every row.** Measured: applied to every row it seats a noise row above the lyric row (U5 p5 s3) and two noise rows in systems with no lyric, for one gain (B06 p3 s3). Joining survives only inside R1, as the form "dictionary sewing" in amendment 3.

### 3. R1: measure three fixed forms, with every number written before the run

Evidence, on the 15 voice-page systems with nothing seated plus K p5 (`proto/run.mjs`; choices in `out-syl/fallback-log.json`):
- **Syllable-likeness, as briefed, no floor:** read right goes from 1,880 to 1,958, (b) from 1,710 to 1,762, (a) from 1,870 to 1,935, and (c) from 640 to 651. Vowelless alone rises from 79 to 88. It seats the lyric row in 6 systems (U5 p6s4, U5 p7s1, P p2s4, B04 p2s3, B06 p2s3, B07 p3s2). It seats noise in U6 p3s3, B10 p1s1 («і»), B10 p1s2 («у»), and K p4s3, and seats B09 p1s1 «м е» on one note, where read right drops by 1. It also seats 3 noise rows on K p5, a page of the piano alone. On U5 p1s3 and B07 p4s4 there is no truth key, so whether the row it seats is lyric is unknown.
- **No floor separates them:** lyric rows score 0.307 to 0.857, noise rows 0.014 to 1.0 (B07 p4s4 «і» 1.0, U6 0.36).
- **What does separate them is the notes count.** In the 6 lyric rows the vowel letters run 0.8 to 1.17 of the system's free notes, and each row has 6 to 9 tokens of 2 letters or more. In every noise row on a voice page, either the vowels run 0.06 to 0.11 or 1.5 to 1.67 of the free notes, or the row has 0 tokens of 2 letters or more. I found this rule on these same 15 systems, so it is a fit, not a validation.
- **Dictionary sewing** (defined below): 1,939 / 1,750 / 1,916 / 651, vowelless 83; 5 lyric rows, no known noise row (U5 p1s3 unknown). It misses P p2s4, which needs splitting, and U5 p7s1.

Replace section 3's R1 paragraph with:

> **R1, the fallback (targets F).** Only where no row of a system passes `rowLanguage`, and only on a page that `pianoAlonePages` (`join-pages.ts:421`) does not call piano-only. Three forms, each measured alone; none has a tuned parameter:
> - **S**: the brief's syllable-likeness, highest row seated, no floor.
> - **S+V**: S, seated only if the row has at least 3 tokens of 2 letters or more and its vowel letters (`CYRILLIC_VOWEL`) are between 0.7 and 1.3 of the system's free notes (`freeNoteXs`). The veto's numbers are fixed here, before the run, and are not changed after it.
> - **DS**: dictionary sewing. Join adjacent tokens (up to 4) where the joined word is a dictionary word (`wordKnown`), choosing the joins that give the most known letters. Seat the first row whose sewn words pass `rowLanguage` with at least 3 counted words.
>
> The review's prototype measured, before Phase 0: S 1,958 / 1,762 / 1,935 / 651, vowelless 88, with 4 noise rows on voice pages and 1 one-note seat; DS 1,939 / 1,750 / 1,916 / 651, vowelless 83, with no known noise row. Phase 0 reproduces these within 2 or reports why. The review expects S+V to keep S's 6 lyric rows and drop its voice-page noise; that is a fit on the same systems and is reported as such.

### 4. Drop the Latin guard. Reading the German row is the real hazard

Evidence: the model is `rus_prereform_r2_29000` (`underlay-recognize.ts:31`). None of the 11,961 letters in `rows10.json`'s 960 rows is Latin. The German row comes out as Cyrillic noise («оѵп, >ѣау, пп дег пеге», S p1s2r1), and some such rows already pass `rowLanguage` (S p2s1r3). The guard cannot fire, and section 5's mutant tests a condition the code never meets.

In section 3, replace "The fallback never seats a row with any Latin letter (the German row) and never seats in a system with no voice notes." with:

> The reader writes Cyrillic only (`underlay-recognize.ts:31`), so a German row arrives as Cyrillic noise and no Latin-letter test can catch it. The fallback is guarded by the notes count and the token floor (S+V) or by the dictionary (DS), and it never runs on a page `pianoAlonePages` calls piano-only.

In section 5, replace "(a mutant that drops the Latin-letter guard must fail)" with:

> (a mutant that drops the vowels-to-notes veto, or the piano-alone skip, must fail on a fixture built from U6 p3 s3 and K p5)

### 5. Phase 0 step 5 asks a question `system.notes` cannot answer

Evidence: systems take the notes of the page's first part (`underlay-prepare.ts:101`, `:111-113`); on a piano-only page that part is the piano (`join-pages.ts:416-424`). K p5's empty systems hold 57 to 71 "voice" notes, and `pianoAlonePages` calls K p5 piano-only (`alone.mjs`). The join strips those notes (`join-pages.ts:530`), so noise there never reaches the singer but inflates the counts. Of the 19, 4 are on K p5 and 15 on voice pages, 3 of which have no truth key (U5 p1s3, B07 p4s4, B09 p1s1).

Replace section 4 item 5 with:

> 5. The 19 systems with no row seated: for each, `pianoAlonePages` for its page, its free-note count, and whether a truth key names it. Expected from the review: 4 on K p5 (piano-only), 15 on voice pages, 3 of them with no truth key. Those 3 are looked at in the page image and called lyric, noise, or NOT ESTABLISHED by eye, never by a ratio.

### 6. A noise seat goes silent in the banner. State the cost and ask Dann

Evidence: a seated system is pushed with `written: true` (`underlay-page.ts:215-219`) and so is never added to `unread` (`underlay-song.ts:93-96`). On today's code, U6 p3s3, B10 p1s1, B10 p1s2, and K p4s3 are named in the banner as unread. Under S as briefed, they would carry noise and the banner would no longer name them. That is the forbidden case: bars the banner calls unread silently get noise.

Replace section 3's last paragraph ("Each rule reports... The Text view does not change.") with:

> R1 reports to the console which form chose the row. A system the fallback seats leaves the unread-bars banner (`underlay-song.ts:93-96`), so a noise seat there is silent: the banner named those bars and then stops naming them. Phase 0 lists every system that leaves the banner. The Text view does not change.

Add to section 4's gate:

> **Decision gate for Dann:** a form goes to Phase 1 only if it seats **no** noise row in a voice system on the full build set and on any song added after this run, and it gains read right and (b). With about 15 changed systems, a rate of "one in twenty" allows zero, so the gate says zero.

The one open question for Dann, which is a taste call: whether a system the fallback seats leaves the banner, or stays in it marked as a guess. `CONTRACT.md` §8 forbids a mark of doubt on the page.

### 7. Replace the held-out design with eyes on every change

Evidence: 6 positive systems in 6 songs. A half split leaves about 3 to tune on and 3 to test, which supports no statement.

Replace section 4 item 4 with:

> 4. **No fitted parameter.** S, S+V, and DS carry their numbers fixed before the run (amendment 3), so nothing is tuned and nothing needs holding out. In its place: every system any form changes (about 15) is listed with a crop of its page image, the row seated, and its words, and the desk calls each one lyric or noise by eye. The B01 to B10 group is reported apart from the rest. The next new song scanned (not one of the 18) is the held-out test before Phase 1 merges.

### 8. Phase 0 is mostly done. Tell the helper how to run it

Evidence: my prototype (imports made absolute, one hook at `:175` and `:181`) ran through `reg-ilya.mjs` in about a minute per form, and A2's scorer read its output without change.

Append to section 4 item 2:

> The copy lives outside the tree, with its `./` imports rewritten to absolute paths into `wt-d6db949a/apps/web/src/lib/omr/`; the review's `scratchpad/rev-rf/proto/page-r1.ts` and `run.mjs` (`MODE=off|syl|dp`) are a working start, and `MODE=off` reproduces 1,880 / 1,710 / 1,870 / 640 / 79.

### 9. Corrected file and line references

- In section 1, replace "`MIN_LETTERS` = 2 letters or more (`:25`)" with "(`:26`)", and "`RUSSIAN_SHARE` = 0.3 (`:32`)" with "(`:33`)".
- In sections 1 and 6, replace "`omr/underlay-song.ts:83-90`" with "`omr/underlay-song.ts:93-96` (a system), `:85-91` (a whole page)".
- In section 7, strike "the 53 'not captured' by cause" and "how many of the 19 empty systems hold voice notes" (amendment 5).


## Phase 1 for Code (r3, desk, 2026-10-29 20:3x). This section is the build order; it wins over everything above it where they differ.

**Phase 0 is closed by the review's prototype and the desk's eye check.** DS (dictionary sewing) measured 1,939 / 1,750 / 1,916 / 651, vowelless alone 83, against 1,880 / 1,710 / 1,870 / 640 / 79 (desk re-total of `rev-rf/sc-dp`). DS seated a row in 5 systems: U5 p6 s4, B04 p2 s3, B06 p2 s3, and B07 p3 s2, each the song's printed lyric; and U5 p1, a system that is an editor's footnote (the autograph's first draft of the opening, printed small with its own words), seen by the desk in the page image. No noise row. S and S+V are not built (DESK DEFAULT, per the review's "If S+V leads DS only through P and U5 p7, prefer DS"). Reading a footnote's staves as part of the song is older than this row and is not touched here (a lead for the desk).

**Build, on branch `cloud-lane-22` cut from `Shane` (`f6c8ae43` or later); push only that branch, never `Shane` or `main`; one commit, one report.**

1. **Where:** in `apps/web/src/lib/omr/underlay-page.ts`'s `seatPage`, per system, before the row loop (`:175-190`): if no row of the system passes `rowLanguage` (`omr/underlay-language.ts:56`) and the system has free notes (`freeNoteXs`, `omr/underlay-counts.ts:40`), choose a fallback row; in the loop, treat that row as passing. Put the choice in a new pure module `omr/underlay-fallback.ts`, not in `underlay-page.ts`, so the page file does not grow past its ratchet.
2. **The rule (DS), exactly as the review's prototype ran it** (`run.mjs`, function `dp` and the `else` branch of `__fallback`): for each row's words (`rowWordSpans(pageTokens(row, reads)).map(w => w.text)`), sew left to right by dynamic programming: from each position try joining 1 to 4 consecutive words; a join of 2 or more is allowed only where `wordKnown(joined, isWord) === true`; a piece scores its letter count when `wordKnown` is true, else 0; keep the sewing with the most known letters. The row qualifies when its sewn words hold at least 3 words of 2 letters or more and `rowLanguage(sewn, isWord) === 'russian'`. Seat the first qualifying row (top to bottom). If none qualifies, seat nothing, as today. Sewing is for this test only; the row's tokens are seated as they are.
3. **Never on a piano-only page:** skip the fallback on a page `pianoAlonePages` (`omr/join-pages.ts:421`) calls piano-only, if that call is available at `seatPage`; if it is not, say so in the report and do not invent one.
4. **The banner:** a system the fallback seats leaves the unread-bars banner (Dann's ruling of 20:13, "A"); this follows from today's code (`underlay-page.ts:215-219`, `underlay-song.ts:93-96`) and needs no change. Test that it does.
5. **Console:** the reader's console line says how many systems the fallback seated, per page.
6. **Stamp:** `UNDERLAY_READER` (`omr/stamp.ts:47`) from `underlay@2` to `underlay@3`, with a test that a reading kept as `underlay@2` is read again.
7. **Tests:** the sewing on «тейской ме ло чи неза. глу. шимый шо пот» qualifies; a row of one-letter noise («і», «у», «т т ь») never qualifies; a row that already passes `rowLanguage` is not changed by the fallback (it never runs); a system with no free notes is skipped. Mutants: allowing a join that is not a known word must fail a test; dropping the 3-word minimum must fail a test.
8. **Gates:** all eight (`pnpm test:phonology`, `test:dictionary`, `--filter @ilya/web check`, `--filter @ilya/web test`, `--filter @ilya/score-parser test`, `test:blurb`, `test:integration`, `ratchets`); baselines 291, 248, 0 errors and 12 warnings, 3705 passed and 1 skipped, 775 and 5 skipped, 145, 55, ratchets OK. Gate 4 will move; say by how much.
9. **Report:** `docs/sessions/report-code-n135-row-fallback_r1_2026-10-29.md` on the lane: the answer first, then each item, then NOT ESTABLISHED. The desk replays the build on A2's captures and expects 1,939 / 1,750 within 2.

Do not commit this brief. NOT ESTABLISHED beats a complete invented answer.
