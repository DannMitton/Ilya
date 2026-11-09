# Report: integration, final (step 6, updated after step 7), 2026-11-09

Branch `cloud-lane-38`, cut from `origin/Shane` (`4d73284b`). Pushed only `cloud-lane-38`; `Shane` and `main` untouched; no pull request; nothing under `docs/memory/` edited. Dann merges. This report adds no code; the tip below is the tip of the integration before it. Steps 1 to 5 each have a report: `report-code-integration-step1_r1_2026-11-09.md` to `step5`.

## The branch tip

The code and every gate below are at `53f05d7b` ("Integration step 7: e2e follow the quiet pause and the stricter key rule"). Two report commits follow it (the step 7 report and this update); they change no code. `git log -1 cloud-lane-38` names the tip. The branch is about 62 commits ahead of `origin/Shane`. Pushed only `cloud-lane-38`; `Shane` and `main` untouched; no pull request; nothing under `docs/memory/` edited. Dann merges. Each step has its report: `report-code-integration-step1_r1_2026-11-09.md` to `step5`, `step5b`, `step5c`, `step5d`, `step7`.

| Step | Source | Commits here |
|---|---|---|
| 1 | merge `origin/cloud-lane-35` (Corrections slice 3) | `d645d127`, report `fce12419` |
| 2 | merge `origin/cloud-lane-34` (row 181) | `e5c6c7d8`, report `d35567eb` |
| 3 | row 157 and Fable's amendments | six picks, `2f633daf`, report `5a233f89` |
| 4 | row 172 and the brief's steps 1 to 3 | five picks, `192df457`, `67033c4d`, report `255463eb` |
| 5 | row 71, the rule, the 43 strings | five picks, `58679982`, report `4e0f3f5d` |
| 5b | row 159, Guide HEIC sentences | `8d9b5c02` |
| 5c | Further reading, shared topic | `eeab1c8e` |
| 5d | LEARN letter-name IPA | `b409a1d0` |
| 7 | Fable's amendments 7a to 7g, e2e follow-ups | `e207d440`, `cbb35d0e`, `4f8c7415`, `922e9ed7`, `be73cc68`, `ba239d29`, `f30cb8c5`, `53f05d7b` |
| 6 | this summary | (reports) |

## The eight gates at the code tip `53f05d7b` (baseline on Shane)

| Gate | Baseline | At the tip | Move |
|---|---|---|---|
| 1 `pnpm test:phonology` | 407 passed (407) | 435 passed (435) | +28 (row 157) |
| 2 `pnpm test:dictionary` | 248 passed (248) | 248 passed (248) | none |
| 3 `pnpm --filter @ilya/web check` | found 0 errors and 12 warnings in 5 files | found 0 errors and 12 warnings in 5 files | none |
| 4 `pnpm --filter @ilya/web test` | 4198 passed, 1 skipped (4199) | 4694 passed, 1 skipped (4695) | +496: step 1 +34; 2 +183; 3 +32; 4 +8; 5 +139; 5b +2; 5c +8; 5d +75; 7 +15 |
| 5 `pnpm --filter @ilya/score-parser test` | 785 passed, 5 skipped (790) | 785 passed, 5 skipped (790) | none |
| 6 `pnpm test:blurb` | 148 passed (148) | 164 passed (164) | +16 (row 157) |
| 7 `pnpm test:integration` | 125 passed (125) | 125 passed (125) | none |
| 8 `pnpm ratchets` | ratchets: OK. | ratchets: OK. | none; it still offers five lowerings that are Shane's own (Drawer, LearnContent, pairings, CalibrationWizard, staff-renderer). I **lowered** the `+page.svelte` ceiling from 5549 to its line count, 5534, in step 7 |

All eight exited 0 on the final code. Steps 5b, 5c, and 5d were each also run on a clean worktree of their own commit (reports). No ceiling was raised; `+page.svelte` needed room in step 4, and `scrollToAnchor` was moved out first.

## Playwright

Run twice, as the desk ordered: at step 1 (the merge of `cloud-lane-35`), and after step 7.

- **Step 1:** 142 passed, 14 failed, 2 skipped. The same 14 were red on `origin/Shane`.
- **After step 7** (both projects, Chromium `/opt/pw-browsers/chromium`, `--trace off`): **155 passed, 16 failed, 2 skipped** (37.7 min). Of the 16, **11 are red on Shane** and are unchanged from step 1; **5 are new** and are this integration's:
  - `insights-key-lines` ×4 (desktop and phone: "one group", "three groups"): from step 5's stricter key rule. I rewrote the two tests to the new states; the file now passes 15 of 15.
  - `typed-hyphens.test.ts:26` (green on Shane): from step 4's quiet pause (bisected to my pause commits; row 172's own commits are green). I changed the spec to wait for the page to show the new text; it passes.
- **Newly green:** the three phone `text-witness` tests, red on Shane, pass now.
- **The 11 still red, all red on Shane:** `glue-typed-marks` ×2, `heic-reader-path`, `insights-page`, `loupe-header`, `print-pages`, `singer-paths`, phone `input-views:134`, `phrase-ends:26`, `relining:70`, `relining:95` ("bb"). "bb"'s first assertion (no rebuild of TEXT while the poem is typed) passes; it fails at its second, the lines of Lyrics, on Shane and here alike.
- The two specs I changed were re-run after the fix (both pass); I did not re-run the full suite after those two edits.

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

### Step 5b, the Guide's licences (row 159)

The Licences section now names libheif, libde265, and Kiril Vatev's libheif-js with their copyright holders under the GNU LGPL version 3, and says that HEVC, the compression inside a HEIC photograph, is covered by patents licensed through pools and that Ilya holds no licence from them. English and French, as ratified.

### Step 5c, INSIGHTS Further reading

When every work in the list is cited for the same vowel, pitch, and bar, that topic line appears once under the heading after the teacher line, and each work shows its reference and its pages and passages without repeating it. With two or more topics, nothing changes.

### Step 5d, LEARN's letter names

The glyph table shows the first word of «и краткое» and of «и десятеричное» (the English copy lacked it), the inventory's ɡ for «гэ», and the engine's form for nine other names. One of them, «мягкий знак» as `[ˈmʲɑk kɨj ˈznɑk]`, I doubt (step 5d's report).

### Step 7, amendments to the joins

- The join takes itself back when a melisma note would leave a syllable without a note, and says which bar in the console (so a receipt cannot claim a note is filled that is blank). It runs only on a song read from a scan with a kept reading. A hand-typed word is no longer counted as a fault. On a scan's words the long dash splits a word again. A strip that cannot be cut is named in the console.
- Corrections slice 3: nothing visible.

## What I could not establish

- **Anything seen by a person.** Every singer-facing line above comes from code, tests, and the lane reports, and from the two Playwright runs, which assert words and layout, not how a page looks.
- **Why the 11 Playwright reds are red on Shane** (step 1 and step 7 reports).
- **What a singer without `?words=read` gets from row 181's reader changes** (step 2's report).
- **How often a key is now offered** on real songs and voices under the stricter rule (step 5); and the lane's seven pictures are stale for the states that moved.
- **The one-pause staleness of TEXT** after a typed or filled Poem, now visible in `typed-hyphens` (step 7); and the first key into an empty Poem may blank TEXT for one pause.
- **7a and 7c on real songs:** how often the seating check reverts, and the 385 against 376, which the desk measured and I did not.
- **The seven-versus-five English strings** in `OPEN.md` (step 5), and the plain space in `OPEN.md`'s French Guide sentence (step 4).
- **The teacher line** that does not follow "No better key" (step 5).
- **Whether the engine is right** on three letter names (step 5d).

Waiting for the desk.
