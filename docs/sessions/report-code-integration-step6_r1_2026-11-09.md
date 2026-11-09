# Report: integration, final (step 6), 2026-11-09

Branch `cloud-lane-38`, cut from `origin/Shane` (`4d73284b`). Pushed only `cloud-lane-38`; `Shane` and `main` untouched; no pull request; nothing under `docs/memory/` edited. Dann merges. This report adds no code; the tip below is the tip of the integration before it. Steps 1 to 5 each have a report: `report-code-integration-step1_r1_2026-11-09.md` to `step5`.

## The branch tip

`4e0f3f5d` ("Integration step 5: report, row 71"), 41 commits ahead of `origin/Shane`, 140 files changed against it (9,350 insertions, 624 deletions; this includes the lane reports, 14 pictures from row 71, and the tests). The working tree was clean when I ran the gates below.

| Step | Source | Commits here |
|---|---|---|
| 1 | merge `origin/cloud-lane-35` (Corrections slice 3) | `d645d127`, report `fce12419` |
| 2 | merge `origin/cloud-lane-34` (row 181) | `e5c6c7d8`, report `d35567eb` |
| 3 | row 157 (`c16b9b81` to `0ceeb22a`) and Fable's amendments | six picks, amendments `2f633daf`, report `5a233f89` |
| 4 | row 172 (five commits) and the brief's steps 1 to 3 | five picks, `192df457`, `67033c4d`, report `255463eb` |
| 5 | row 71 (`2788cc88` to `930ba192`), the rule, the 43 strings | five picks, the integration commit, report `4e0f3f5d` |

## The eight gates at the tip (baseline on Shane)

| Gate | Baseline | At the tip | Move |
|---|---|---|---|
| 1 `pnpm test:phonology` | 407 passed (407) | 435 passed (435) | +28 (row 157) |
| 2 `pnpm test:dictionary` | 248 passed (248) | 248 passed (248) | none |
| 3 `pnpm --filter @ilya/web check` | found 0 errors and 12 warnings in 5 files | found 0 errors and 12 warnings in 5 files | none |
| 4 `pnpm --filter @ilya/web test` | 4198 passed, 1 skipped (4199) | 4594 passed, 1 skipped (4595) | +396: step 1 +34; step 2 +183; step 3 +32; step 4 +8 (5 mine, 3 the lane's net); step 5 +139 (49 the lane's, 90 mine) |
| 5 `pnpm --filter @ilya/score-parser test` | 785 passed, 5 skipped (790) | 785 passed, 5 skipped (790) | none |
| 6 `pnpm test:blurb` | 148 passed (148) | 164 passed (164) | +16 (row 157) |
| 7 `pnpm test:integration` | 125 passed (125) | 125 passed (125) | none |
| 8 `pnpm ratchets` | ratchets: OK. | ratchets: OK. | none; it offers six lowerings, of which five are Shane's own and one is `+page.svelte` 5549 to 5534 (my steps 2 and 4); I raised nothing and lowered nothing myself |

All eight exited 0. Every move is explained in the step reports. **Ceilings:** none was raised. `+page.svelte` was at its ceiling (5549) when step 4 needed room, so I moved `scrollToAnchor` out into `lib/scroll-to-anchor.ts` first (step 4).

## Playwright

**Not run for steps 2 to 6**, by the desk's order. The one run, at step 1 (on the merge of `cloud-lane-35`), gave 142 passed, 14 failed, 2 skipped; the same 14 fail on `origin/Shane` (step 1's report lists them). The second run is after step 7.

Expect movement at that run, from steps 2 to 5: the "bb" phone test and the `text-header` tests (step 4), and the lane's `insights-key-lines` states (step 5), which I could not recompute.

## What a singer would now see that she did not see on Shane

### Step 1, the answers she gave a bar

Nothing. The lane added the storage and the pure rules for remembering what she answered about a bar, and wired them to no page.

### Step 2, joining her poem to her scan's words (row 181)

1. A scan whose printed words Ilya read only partly now shows a banner whose bar numbers can be tapped; a tap opens the Loupe on that bar.
2. The Loupe shows her own scan's print for the bar, as a picture, on every bar of a scan read this way, with a pinch to enlarge, and Previous and Next through the bars still to check. It opens by itself once on the first such bar after a scan is read.
3. A "Fill from the poem" button on a bar where her poem has the words.
4. When she pastes or types a poem into a scanned song, Ilya repairs and fills the lyrics from it after a short pause, underlines what it wrote with a dotted line, and shows a line such as "6 syllables filled from your poem" with Revert. Tapping a repaired word shows what the print read. The poem is never changed.
5. The banner's middle sentence changes ("Choose a bar to see your score's print there and fill the missing words.").
6. Under the `?words=read` switch, the way a scan's lyrics are read changes (the long dash is a joint again, extender marks only where the counts come out equal), and a scan kept under that switch is read once more on next opening. I did not establish what a singer without the switch gets.

### Step 3, «бог» and kept voicing (row 157)

1. «Бог» is sung [box], and [boɣ] before a voiced obstruent («Бог даст», «Бог в доме»).
2. A voiceless final before «в» takes the voicing through the «в» («лес вдали» gives [ˈlʲɛz]).
3. The Inspector explains a final consonant that keeps its voicing, in English and French, citing Grayson pp. 251 to 252, in place of the final-devoicing sentence. The French has a no-break space before the colon and none before the semicolon.

### Step 4, TEXT follows INPUT's pill (row 172)

1. Tapping POEM or LYRICS in INPUT decides what TEXT transcribes. The choice control that sat on TEXT is gone.
2. A quiet line above the sheet names the source («From LYRICS» or «From POEM»; « D’après PAROLES » or « D’après POÈME »), only while the two texts differ, and it does not print.
3. Typing a poem no longer rebuilds TEXT on every key; TEXT takes it after the same 600 ms pause as Lyrics. The first key into an empty Poem may leave TEXT blank for one pause (read from the code, not seen).
4. The Guide's poem paragraph ends with the two ratified sentences, English and French.

### Step 5, how Ilya suggests a key (row 71)

On INSIGHTS, for a voice with a typed range (behind the Insights flag):
1. One search for a key replaces the old "better key" block.
2. A key is offered only if it has fewer challenges than the one she is reading; a swap is never offered.
3. Each key line names bars (never pitches or counts) and fractions of the singing, with a "Try this key" chip.
4. Where the key suits: "No alternate key suggested: as it stands, the song stays inside your range …".
5. Where no key helps: "No better key: …"; where none reaches her range: "No key within a tritone brings this song inside your range. Taking it on as a technical project, or choosing other repertoire, is your decision." The teacher line follows both.
6. A screen-only "Show keys that reach higher" disclosure for the rest.
7. All of it in French as ratified.

## What I could not establish

- **Anything in a browser** beyond step 1's run. Every singer-facing line above comes from code, tests, and the lane reports, not from seeing a page.
- **Whether the 14 red Playwright tests of step 1 moved**, and whether steps 2 to 5 added reds.
- **What a singer without `?words=read` gets from row 181's reader changes** (step 2, item 6).
- **How often a key is now offered on real songs and voices** under the stricter rule (step 5).
- **The seven-versus-five English strings** in `OPEN.md` (step 5), and the plain space before the colon in `OPEN.md`'s French Guide sentence (step 4): both seated per the ratification's intent, not its copy.
- **The one place the teacher line's meaning does not follow** its new neighbour (step 5, "No better key").
- **Why the 14 tests are red on Shane** (step 1).

Waiting for step 7 (Fable's amendments for steps 1 and 2).
