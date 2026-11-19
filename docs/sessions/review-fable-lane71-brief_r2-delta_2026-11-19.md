# Delta review of the lane 71 brief, r2 (blank states, and QUEUE row 167)

Reviewed 2026-11-19 against the clone at `/home/claude/dannmitton/ilya`, `f7e03836` (`git rev-parse HEAD`). Brief md5 `2bf8cd44e6951e095fdb046c5643e44c`, companions `a8875d7ecc96e1a39ba9055b158f2085` and `770ddf03d110828a535cd1e6ace63b72` (`md5sum`, all three match). Paths are relative to `apps/web/src/lib/` unless they begin with `apps/`, `e2e`, `routes/`, or `docs/`. "r2:n" is a line of the brief. No test and no browser was run; every "breaks" below is read from source.

Verdict, stated first: **DO NOT SEND.** Three blockers, in section 6. Two need Dann; one needs a paste from the desk.

## 1. The seventeen amendments

| # | Status | Evidence in r2 |
|---|---|---|
| 1 | Applied | r2:109-112 |
| 2 | **Partly** | r2:96-107 cites all four sites. r2:176-180 puts `InsightsPane.svelte:328-341` in the lane and hands its design (withheld list kept or replaced) to Code. |
| 3 | **Partly** | r2:68-72 states the three values. r2:256 asks Code to "say what `'loading'` does" where the amendment asked the brief to state it. |
| 4 | Applied, one wrong citation | r2:164-167, r2:304-308. `hasPlaceholderProfile` is at `voice/engine/stand-ins.ts:76-79`, not `:78-81`. |
| 5 | Applied | r2:169-171 |
| 6 | **Partly** | r2:176-180 asks Code to report the table. The brief gives no state list, and no MELODY row for a score with no voice (section 4 below). |
| 7 | Applied | r2:188-191 |
| 8 | Applied, with a new fault | r2:198-209. The fault is the 18 to 16 instruction (section 5). |
| 9 | Applied | r2:193-196 |
| 10 | Applied | r2:211-215 |
| 11 | Applied | r2:222-229, r2:237 |
| 12 | **Partly** | r2:233-235 rules the door as a DESK DEFAULT, on a citation that does the opposite (section 5). Whether the two links under NOTES (`insights/SingerBlock.svelte:178-182`) stay on the blank page is not stated anywhere in r2. |
| 13 | Applied | r2:230-232, r2:313 |
| 14 | **Partly** | r2:241-253 hands the table to Code. r2:245-247 does state that `profile.statusSet*` do not change, on a false ground (section 2, blocker 5). |
| 15 | **Partly** | r2:14-16 says all French is ratified. Two French items are in neither companion (section 6, blocker B). |
| 16 | Applied | r2:264-266, r2:231 |
| 17 | Applied, not extended | r2:268-284. The tests row 167 breaks are not listed (section 3). |

## 2. The five r1 blockers

1. **The voice test. Closed for the blank pages.** With all nine ids in the list, `generic = !anySung && hasPlaceholderProfile(voiceType)` is true for any chosen type with nothing sung (`voice/engine/resolve-values.ts:153-154`), the stand-ins fill every vowel (`:155-156`), `completeness.formants` is true (`analysis/analyze-score-adapter.ts:93`), and INSIGHTS' `measured` follows (`insights/InsightsPane.svelte:204-205`). "Anything sampled, or any type chosen" is then the same test as `adapted.completeness.formants`, which both panes already hold; the brief could name it. The closure opens a new hole on the pages that are not blank (blocker A).
2. **Table and forms. Partly closed.** INSIGHTS' third-form site is cited (r2:104-107, r2:177-178). MELODY's is not (section 4).
3. **The wrong citation. Closed** (r2:109-112).
4. **French. Partly closed.** The five blurbs and the stand-in lines are ratified (first companion `:85-106`, second `:74-76`, `:120-124`). The French Guide passage and one French phrase are not in the files (blocker B).
5. **English. Partly closed.** Still open:
   - r2:246 says "the first companion quotes the live plural sentence". It does not: the companion has "Your profile is set, with ten vowels measured." (first companion `:66`) and the tree has "Your profile is now set with {count} vowels measured." (`i18n.ts:1502`). r2:9 says take every string from the companions verbatim, and r2:261 says pin every ratified sentence. Code has two instructions that disagree.
   - The singular provisional sentence. r2:248-249 cuts the tail of `i18n.ts:1503`, giving "Your {vowels} is provisional, and you can update this value anytime.", beside the ratified plural "... are provisional; set them in VOICE." (first companion `:66-67`). The cut sentence is in neither companion, in either language.
   - MELODY's NOTES body for a type chosen and nothing sampled, for the five published types. Today that state draws `profile.emptyState` (`markup/MarkupPane.svelte:1111-1113`, `i18n.ts:1514`), which the ask replaces. r2:245-253 names no key for it. The only candidate in the tree begins "Method:" and is INSIGHTS' (`i18n.ts:1905`).
   - r2:252 keeps `insights.method.noScore.none` (`i18n.ts:1906`) as a NOTES body. The first companion's table gives no NOTES for a page with no voice (`:36`), and the line repeats the ask ("record your vowels in VOICE").

## 3. Row 167, judged fresh

### What the code holds

- All `stand-ins.ts` citations in r2 and in the second companion are three lines high. Actual: `standInBucket` `:55-62`; the comment `:64-72`; `PLACEHOLDER_PROFILE_TYPES` `:73`; `hasPlaceholderProfile` `:76-79`; "COUNTERTENOR BY THE TRACT" `:52`; `template` `:89-98`. r2's `:76` is the function, not the list.
- `standInBucket` maps all nine: soprano (`:57`); mezzo-soprano, contralto, tenor, countertenor to `tenor-mezzo` (`:58`); baritone (`:59`); bass and bass-baritone to `bass` (`:60`); anything else, so "Not sure", to `middle` (`:61`). `template('middle')` is defined: the geometric mean of five staves (`:91`, `:93`).
- The "Not sure" id exists and is `not-sure` (`voice/voiceTypes.ts:28`).
- `PLACEHOLDER_PROFILE_TYPES` has one reader (`stand-ins.ts:78`). `hasPlaceholderProfile` has three: `voice/engine/resolve-values.ts:154`, `components/Drawer/voice-pane.ts:43`, and `voice-pane.ts:82` (`grep -rn` over `apps`, `packages`, `scripts`). No source reads the list's length or spells the five out; only tests and comments do.
- The other five types: nothing moves. Each is already in the list, and no reader depends on what else is in it. Not run; `analysis/adapter-golden.test.ts` is the proof Code owes.

### What changes for the four types, reader by reader

| Reader | Contralto, countertenor, bass-baritone | "Not sure" |
|---|---|---|
| `resolve-values.ts:154` | `generic` true; findings and marks draw from the borrowed staff | `generic` true; draws from `middle` |
| `voice-pane.ts:43` | `typed-none` becomes `typed-generic`: "Ilya is using generic values for a contralto voice until you record your own." (`i18n.ts:1432`). `calib.pane.typedNone` (`:1433`) becomes unreachable. | No change: `:42` returns first, so the pane still says "Ilya builds your resonance profile from your own vowels" (`i18n.ts:1434`) while Ilya now uses the averaged profile. |
| `voice-pane.ts:82` | "Your vowel space" door now shows | Now shows |

### What `generic` then prints, which r2 does not mention

r2's step 1 seats the ratified line in one place, the no-score Method line (r2:156-158). `generic` feeds six more sentences, all ratified and pinned (`insights/ratified-lines.test.ts:406-438`, `n200-strings.test.ts:20-21`):

- MELODY's subtitle: "placeholder values for a generic contralto" (`markup/subtitle.ts:11-12`, `i18n.ts:1487`).
- INSIGHTS' lede: "These findings use placeholder values for a generic contralto" (`insights/identity.ts:50-52`, `i18n.ts:1895`).
- INSIGHTS' vowel heading: "in a generic contralto" (`insights/singer-blocks.ts:337`, `i18n.ts:2040`).
- The Method line with a score: "placeholder values for your voice type" (`insights/identity.ts:68-69`, `i18n.ts:1897-1898`).
- The broad note: "placeholder values for your voice type" (`analysis/analyze-score-adapter.ts:195`, `i18n.ts:1075`).
- The VOICE pane sentence above.

Each tells a contralto that the values are a contralto's. The ruling is the reverse: "use the mezzo values and say so", "Ilya will not invent them" (second companion `:17-23`), stated "on the page, in the line itself" (`:13-15`), "every time" (`:98`).

For "Not sure" it is worse. `voiceTypePrint` returns nothing for `not-sure` (`voice/voiceTypes.ts:90`), so the subtitle falls through to "a map of your voice's resonances" (`markup/subtitle.ts:13`, `i18n.ts:1485`), the lede is null (`insights/identity.ts:52`), and the heading reads "in your voice" (`singer-blocks.ts:337`, `i18n.ts:2039`), for the profile the ratified line calls "unlikely to reflect your voice" (second companion `:71`).

The ratified rulings and the ratified sentences cannot both be built as written. This is blocker A.

### Smaller gaps in step 1

- `{type}`: r2:149-152 does not say which label fills it. `voiceTypePrint` gives a finer label or the singer's own text when one is stored (`voiceTypes.ts:85-96`), so "for a haute-contre" or "for a Russian Bass". The French template holds only for the three Tier 1 names (second companion `:129-130`). `voice-pane.ts:65-66` already fills with the Tier 1 name alone, for this reason.
- The record door under NOTES shows only when `isGenericMethodKey` knows the key (`insights/identity.ts:72-75`, `SingerBlock.svelte:181`). New keys are not in it; r2 does not say whether the door stays.
- "Why these values": no link from MELODY or INSIGHTS into the Guide was found (`grep` for `#guide-` and `guide-markup-` outside `GuideContent.svelte` found only the Drawer's contents list, `components/Drawer/Drawer.svelte:282`, `:758-760`). r2:153-155 names no section, no anchor, and no handler. A new Guide heading would be a new string in two languages. `routes/+page.svelte` has two lines of headroom (r2:212-214).
- r2:4 cites `review-fable-lane71-brief_r1_2026-11-19.md`. It is not in `docs/sessions/` at this commit (`ls`).

### Tests that assert today's behaviour for the four types

Break:
- `voice/engine/resolve-values.test.ts:14-23` (the `WITHHELD` list).
- `analysis/stand-ins-snapshot.test.ts:37-42`, `:72-80`, `:99-100`.
- `insights/identity.test.ts:96`.
- `components/Drawer/voice-pane.test.ts:15`, `:35`, `:126`.
- `e2e/voice-pane.test.ts:94-95`.
- `e2e/insights-no-score.test.ts:55-62` (already in r2:278).
- `i18n-index.test.ts`, whenever a key is added or retired (`:9-12`).

Hold, with stale titles or comments: `voice/engine/stand-ins.test.ts:179`, `resolve-values.test.ts:96-103`, `insights/identity.test.ts:68`, `voice-pane.test.ts:16`. Unaffected: `voice/chart/zones.test.ts:184-185` (the chart asks for `'always'`). Stale comments in source: `resolve-values.ts:14-18`, `:148-152`; `insights/identity.ts:61-64`; `voice-pane.ts:76-79`; `analyze-score-adapter.ts:66-72`. Whether `e2e/tempo.test.ts:183-197` breaks (r2:280) is not established.

## 4. The reworded rule

The three forms and the code agree on INSIGHTS: no score goes to `noScoreBlocks` (`InsightsPane.svelte:327`), and a score with no voice goes to `:328-341`, which after row 167 means no type and nothing sampled.

They do not agree on MELODY. r2:44-46 says a voiceless MELODY asks for the voice. MELODY's blank page draws only when there is no score: the score branch is `markup/MarkupPane.svelte:961`, and with a score and no voice it draws the score with the withheld statement (`:831`, `:1015`; "Ilya has read your score, but no voice has been measured", `i18n.ts:1534`). No step of r2 says where the third form appears on MELODY, or whether the drawn score gives way to the squircle. A singer who loads a score before setting a voice lands here.

The first companion still carries the struck rule and its four-row table (`:29-39`), under a heading that says RATIFIED. r2:8-9 makes that file the authority; r2:43 strikes it. The file needs the 09:35 wording.

## 5. New in r2 and wrong

1. **VOICE opens the VOICE pane (r2:233-235).** The citation, `routes/+page.svelte:1660-1668`, is `openVoice`. With a voice saved it enters the calibration takeover (`:1666-1667`); only with none does it reveal the band (`:1662-1664`). A saved voice with no type and nothing sampled is a real state (`e2e/voice-pane.test.ts:87`), and it is the one the ask addresses. The default as cited opens the recording screen. The behaviour it wants is `sections.reveal(BAND_IDS.scoreMarkup)` inside `leaveThen` (`:1677-1681`, `:1694`), written inline in the props, since no function fits.
2. **Make the 18 agree with the 16 (r2:202-203).** MELODY's 18 is `TITLE_HEADER_GAP` (`MarkupPane.svelte:472`), and `contentTop` (`:474`) also sets the score's first-page window (`:795`) and the score's position (`:1004`). Changing it moves every MELODY score page by 2 px and can change pagination, against r2:354. The blank state can take its own top.
3. **Only the ask is linked (r2:227-229).** Sound as a mechanism. The reason given does not cover the new lines: both stand-in lines invite the singer to sample "in VOICE" (second companion `:59`, `:72`), and the word there is plain text.
4. **No blank state prints (r2:264-266).** Sound for the no-score pages. Its reach is not stated for `InsightsPane.svelte:328-341`, whose withheld list prints today and is the page's content.
5. **The midpoint test (r2:208-209).** The three headers are measured and differ in content (r1 review, section 3b). If their heights differ, "centred in each page's window" and "the same midpoint" cannot both hold; r2 does not say which wins.

## 6. Verdict

**DO NOT SEND.**

**Blocker A. Row 167 reaches six ratified sentences r2 does not name** (section 3). After the widening they tell a contralto, countertenor, or bass-baritone the values are their own type's, and tell a "Not sure" singer the page is a map of their voice. Dann's ruling is needed on what each site says; Code cannot reword ratified lines.

**Blocker B. French that is in neither file.** The French Guide passage is named, not given ("on the draft sheet of 09:47", second companion `:125-127`; `grep` for its words in `docs` and `apps` finds nothing). The French of `{borrowed}` "mezzo and tenor" is in neither file. r2:14-16 is false until both are pasted in, and step 1 item 5 stops there.

**Blocker C. MELODY with a score and no voice** (section 4). The rule and the code disagree, and the page's design is left unsaid.

Once those are ruled, these edits:

1. Correct every `stand-ins.ts` citation in r2 and the second companion to the lines in section 3.
2. Step 1: list the three readers of `hasPlaceholderProfile` and the per-type table of section 3. State what the VOICE pane says for the three borrowing types and for "Not sure", and that `calib.pane.typedNone` retires.
3. Step 1 item 4: fill `{type}` with the Tier 1 name, as `voice-pane.ts:66` does.
4. Step 1 item 5: name the Guide section and its existing anchor, add no heading, and name the handler.
5. Step 1 item 6: say whether the new keys join `isGenericMethodKey` (`insights/identity.ts:72-75`), and name MELODY's NOTES key for a published type with nothing sampled.
6. Step 2: name `adapted.completeness.formants` as the voice test, and give the state table in the brief, per page, with MELODY's third row as ruled.
7. Step 4: replace the `:1660-1668` citation with the band reveal of section 5, item 1. Say whether the two NOTES links stay.
8. Step 3: strike "make the three agree". The blank state takes a top of header plus 16 on MELODY, and `TITLE_HEADER_GAP` is not touched. Say that if header heights differ, Code reports the difference and does not force the midpoint.
9. Step 5: strike "the first companion quotes the live plural sentence"; say the tree's `i18n.ts:1500-1502` win over the first companion's `:66`, and correct the companion. Say whether `.none` draws. Say `profile.emptyState` retires.
10. Step 5: limit the no-print default to the no-score pages.
11. Step 6: add the tests of section 3.
12. First companion `:29-39`: record the 09:35 rule and a table with the score-present rows.
13. Step 5: state what `'loading'` does (r1 amendment 3, still owed).

## For Dann's eye

1. A contralto, countertenor, or bass-baritone who adds a score would read "placeholder values for a generic contralto" on MELODY, on INSIGHTS, and in the VOICE pane, which is what you ruled Ilya must not say.
2. A "Not sure" singer who adds a score would see MELODY call the page "a map of your voice's resonances", with no line saying the values are an average.
3. MELODY with a score and no voice draws the score today under "Nothing is claimed about your voice"; whether it asks for the voice there, and whether the score still draws, is yours.
4. With one provisional vowel the line would read "... is provisional, and you can update this value anytime.", beside your ratified plural "... are provisional; set them in VOICE."
5. In the two stand-in lines the word VOICE is not a link, though both lines invite the singer to sample there.
