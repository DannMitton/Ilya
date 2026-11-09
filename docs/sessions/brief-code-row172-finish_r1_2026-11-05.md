# Brief: row 172, finish and bring onto today's Shane (Code, cloud, r1, 2026-11-05)

Written by the desk (Opus). Row 172 (TEXT follows INPUT's Poem | Lyrics pill) was built on `cloud-lane-29`, steps 0 to 4, commits `c4584256` to `89357814`, from brief r2 `docs/sessions/brief-code-row172-text-follows-input-pill_r2_2026-11-02.md`. That lane also carries rows 71 and 157, which are NOT part of this brief. **NOT ESTABLISHED beats a complete invented answer.**

## The singer's need

When she taps POEM or LYRICS in INPUT, TEXT transcribes that text, and a quiet line above the sheet names it. Typing a poem must not make TEXT stall by rebuilding on every key.

## Steps

**Step 0, the branch.** Create `cloud-lane-36` from `origin/Shane` (tip `2e3803da` or later). Cherry-pick row 172's five commits in order: `c4584256`, `3c7a93a`, `e359832`, `5628f27`, `89357814`. Resolve conflicts:
- `apps/web/src/routes/+page.svelte` (the desk's evaluation found it near `:4361-4367` on the merge): keep the lane's source line (`TextSourceLine`) AND Shane's `witness={shown}`. Read both sides and say in the report what each line does.
- `apps/web/src/lib/i18n.ts`: count lines and neighbouring keys; keep both sides' keys.
Run the eight gates (as step 0 of the original row recorded them) and both Playwright projects; record every red test and say whether it was red on `Shane` before the cherry-pick.

**Step 1, the quiet pause for POEM.** The phone test `apps/web/e2e/relining.test.ts:95` ("bb") fails because TEXT now transcribes the poem on every key (report `report-code-row172-step2_r1_2026-11-02.md`, "Decision for Dann"). The desk has decided, DESK DEFAULT: option 1. Give the poem witness the same quiet pause before TEXT transcribes it that LYRICS has (find where LYRICS's pause is applied and reuse it; do not write a second timer). The test passes unchanged. Name every other place that times a rebuild of TEXT and say whether it now agrees.

**Step 2, the stale tests.** `apps/web/e2e/text-header.test.ts:56` and `:59` point at the pair the row removed (desk evaluation 2026-11-05 01:3x). Change them to follow INPUT's pill, as step 2 of the row did for the other tests. Change no assertion about the TEXT: POEM / TEXT: LYRICS page header; that header and the quiet line both stay (DESK DEFAULT: the Guide sentence Dann ratified 2026-11-05 08:10 names "a line above the page").

**Step 3, the ratified French.** Seat exactly, with their pins in a test:
- `text.source.lyrics` FR « D’après PAROLES »; `text.source.poem` FR « D’après POÈME » (typographic apostrophe U+2019).
- `GuideContent.svelte`, the poem-and-lyrics paragraph, the last two sentences, EN and FR, replacing what the row wrote and the stale French with its `TODO-FR` comment:
  - EN: To review the authoritative poem itself anytime, choose POEM in INPUT: TEXT then transcribes the whole poem as published, including any words the composer has left out, and says so in a line above the page. Choose LYRICS in INPUT to return.
  - FR: Pour consulter à tout moment le poème qui fait autorité, choisissez POÈME dans ENTRÉE : TEXTE transcrit alors le poème entier tel que publié, y compris les mots que le compositeur a laissés de côté, et le signale par une ligne au-dessus de la page. Choisissez PAROLES dans ENTRÉE pour revenir.
  The FR space before the colon is U+00A0 (OQLF). Source: `docs/memory/OPEN.md`, the two sections "ROW 172" dated 2026-11-05 (on `Shane` after Dann's next commit; the text above is authoritative if they are absent).

**Step 4, gates and report.** Eight gates and both Playwright projects; every red test named with whether it is this row's.

## Rules

Push only `cloud-lane-36`; never `Shane` or `main`; no pull request; Dann merges. Commit and push after each step. One report per step: `docs/sessions/report-code-row172-finish-stepN_r1_2026-11-05.md`, with every claim about code carrying a file and line read.
