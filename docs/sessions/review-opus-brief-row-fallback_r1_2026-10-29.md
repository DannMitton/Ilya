# Review: brief-n135-row-fallback_r1_2026-10-29 (Opus, standing in for Fable, 2026-10-29)

Read only. Code at `d6db949a`. My scripts are in `scratchpad/rev-rf/` (`a1.py` to `a11.py`, `alt.mjs`, `proto/page-r1.ts`, `proto/run.mjs`); the prototype is a copy of `underlay-page.ts` outside the tree with one hook, replayed through the build's own `seatPage`, `applyUnderlay`, and `joinPages` and scored with A2's `score_app.py`. My figures are measurements on the build set, not yields. "Veto", "dictionary sewing", and "inert guard" are my coinages; "fallback", "syllable-likeness", "read right", "vowelless alone" are adopted.

## Verdict

**SEND WITH AMENDMENTS**, cut to R1. Strike R2 and R3.

## Lead finding

The sorter holds up, and R1 does recover the singer's syllables: as briefed, with no floor, it moves read right from 1,880 to 1,958 and (b) from 1,710 to 1,762. It also seats noise in at least four voice systems, and that takes those systems out of the unread banner. R2 and R3 as briefed are net losses: R2 moves 7 systems away from the lyric row for 66 syllables lost against 8 gained, and R3 seats noise above a lyric row. The brief's "never seats a Latin row" guard can never fire, because the reader writes only Cyrillic.

## Spot-check of the brief

Reproduced exactly: `rowcall2.py` gives section 2's table (53 / 74 / 2,316 / 10 / 12 / 73), and its examples match. 239 captured systems, 19 with no row seated, and the per-song list (K 5, B10 3, U5 3, B07 2, B09 2, B04 1, B06 1, P 1, U6 1) are all right. The control figures 1,880 / 1,710 / 1,870 / 640 / 79 are what `sc/d6db949a` gives (`total.py`), and my unmodified prototype run (`MODE=off`) gives the same figures.

Right: `seatPage` at `underlay-page.ts:152`; the row words at `:177-180`; the test at `:181`; the first-wins rule at `:189-190`; `rowLanguage` at `underlay-language.ts:56`; `wordKnown` at `:46`; `freeNoteXs` at `underlay-counts.ts:40`; `UNDERLAY_READER` = `'underlay@2'` at `omr/stamp.ts:47`; the switch at `omr/underlay-switch.ts:20-27`.

Wrong:
- `MIN_LETTERS` is at `underlay-language.ts:26`, not `:25`. `RUSSIAN_SHARE` is at `:33`, not `:32`.
- `underlay-song.ts:83-90` is the whole-page case. A system goes into the banner at `:93-96` (`else if (system.bars) unread.push(...)`).
- `CYRILLIC_VOWEL` is at `score/vowel-resolver.ts:158` in `d6db949a`. `CONTRACT.md` §0.1 says `:159`.
- The brief calls the code "identical in `omr/` to `Shane` `f6c8ae43`". My `wt-shane` clone is at `1ee2c0aa` and does not hold `f6c8ae43`. NOT ESTABLISHED.

## Is the sorter sound?

Mostly yes, with three limits that Phase 0 needs to state.
1. **Two verses.** None of the 228 truth systems has two printed rows (`a1.py`), so this set cannot test R2's handling of a second verse. On a two-verse song, "best" would choose between verses, while today "first" gives verse 1.
2. **Mismatched systems.** On 7 pages the capture and truth disagree on the system count (`a2.py`). M p1 and p2 have 0 captured systems: exactly the 53 "not captured". B02 p2, B06 p3, B07 p4, and B09 p2 each have an extra fourth system with no truth key, and U5 p1 has 3 against 2. Rows that match better in another system (35 syllables) all score under 0.34, so they sit in "no row resembles". C, D, E, and F are not distorted.
3. **A ceiling of printed syllables, not read right.** A row that scores 0.5 counts all its syllables as "the lyric row". So 73 is a ceiling on syllables of rows, not on syllables read right.

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

## Better or simpler

Judging syllables inside `rowLanguage` for every row fails as R3 fails (U5 p5 s3). The notes count is the best discriminator found, and `freeNoteXs` already carries it. Simplest honest version: DS alone, with no weight, 59 of S's 78, and no known noise row. If S+V leads DS only through P and U5 p7, prefer DS.

## Ceiling

F is 73 printed syllables. R1 recovers 59 to 78 read right and 40 to 52 exact seats of 2,385, before noise is removed. D (10) and E (12) are not recoverable by R2 or R3 without a net loss.

## NOT ESTABLISHED

- Whether `f6c8ae43` holds `omr/` identical to `d6db949a`: the commit is not in my clone.
- Whether U5 p1s3, B07 p4s4, and B09 p1s1 are lyric or noise; no truth key names them, and I did not inspect their images.
- Whether S+V's veto holds on any song outside the 18; it was found on the same 15 systems it is meant to judge.
- How the forms behave on a song with two printed verses; the build set has none.
- Section 0's 400 dpi mark measurement and the 19:47 ruling time; not checked.

NOT ESTABLISHED beats a complete invented answer.
