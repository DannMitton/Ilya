# Fable review of the consistency plan and its audit brief, r1, 2026-11-01

Reviewed: `docs/sessions/plan-desk-consistency_r1_2026-11-01.md` and `docs/sessions/brief-desk-consistency-audit_r2_2026-11-01.md`, against the tree at `cab8d205` on `Shane` (read only, through the bridge) and the Vercel project `ilya` (read only). Every `path:line` was read this session. NOT ESTABLISHED beats a complete invented answer. The ruling of 2026-11-01 12:13 (`docs/memory/CONTRACT.md:26`, item 11a: ratification is approval at a moment, and a pin changes with its text) governs this review; nothing below works around ratified text.

**Verdict: PROCEED WITH AMENDMENTS.** The order is sound and the census is the right first step. Three things change: the plan's premise that nothing is live is contradicted by Vercel (question 6: keep the one-time read); the names list needs one home in code, with the legend's table checked against it rather than being a second copy; and the audit brief as written will spend its budget on slow single greps and on two sections no one can act on.

## Question 6 first: is `main` served to the public

Established, yes.

- `vercel.json:42-47` enables Git deployments for `Shane` and `main` and nothing else.
- Vercel project `ilya` (`prj_oOvEOXnovbEkVBAOQRmTmgxJK0DB`, team `dannmittons-projects`) lists the domains `dannmitton.com`, `ilya.dannmitton.com`, `ilya-mauve.vercel.app`, `ilya-dannmittons-projects.vercel.app`, and `ilya-git-main-dannmittons-projects.vercel.app`. Password, SSO, and trusted-IP protection are all off.
- The project domain `ilya.dannmitton.com` is verified and has `gitBranch: null`, so it follows the production branch.
- The one production deployment, `dpl_J14bV1A9e4wvt9KFsdQbkpXhbCe7`, is `READY`, `target: production`, built from `githubCommitRef: main` at `2b980e7b` ("N.153 stage 3b"), created 2026-09-21 03:17 UTC, and its alias list includes `ilya.dannmitton.com`. The project's latest deployment (2026-11-01, `CANCELED`, `target: null`) did not replace it.
- `README.md:15` sends the public to `ilya.dannmitton.com` to install the app.
- `apps/web/.env` is tracked on both branches (`git ls-files`; `git ls-tree origin/main apps/web/.env`) and on `main` reads `PUBLIC_INCLUDE_SHANE=true`, so the public build draws the voice work and writes its keys.

So the public build is `main` at `2b980e7b`, with the Shane wall open. Whether anyone has used it is NOT ESTABLISHED: Web Analytics is not enabled on the project (the pageview query returns 404 "Web Analytics not found"). Dann's 12:00 premise ("the work is not live yet") is false in fact; what remains true is that no release was announced, and the singer with saved data is hypothetical until counted.

What `main` writes that a rename would touch (every line read on `origin/main`): `shane.profiles.v2` (`apps/web/src/lib/shane/profileStore.ts:66`, written at `:215`, `:234`), the `ilya:activeTab` value `transcription` (`routes/+page.svelte:2633`, `:3887`), `ilya:openStations` holding the band id `scoreMarkup` (`sections.svelte.ts:37`; the id at `Shane`'s `sections.svelte.ts:106`), and the databases `ilya-data` (`loader.ts:58`) and `ilya-library` (`library/driver.ts:397`). The other `ilya:*` keys (`notationPrefs`, `showStressDiacritics`, `language`, `activeSongId`, `evictionNoticeShown`, `pairings`, the five `LEGACY_KEYS` at `driver.ts:162-166`) carry no retired term and need no rename.

**Recommendation: keep the one-time read, and narrow it.** It applies to exactly the keys above whose name or stored value changes: `shane.profiles.v2` (a singer's measured voices; losing them is the one irreversible loss here), the `ilya:activeTab` value (already migrated at `destinations.ts:111-114`, so nothing new), and the `scoreMarkup` band id (already handled by `migrateOpenStations`, `sections.svelte.ts:190`). The cost is one `getItem` of the old key in `profileStore.loadStore` (`profileStore.ts:224`), which already migrates `shane.profile.v1` the same way (`:72`, `:242-271`); the pattern is in the file. Drop it only if Dann rules that data saved on `ilya.dannmitton.com` since 2026-09-21 may be lost; that is his to say, and it is irreversible for whoever saved it, so it goes in Questions for Dann as a yes or no with "keep" as the default.

## Answers to questions 1 to 8

**1. Order.** Right, with one hazard and one addition. Hazard: renaming the folder `apps/web/src/lib/markup/` (15 files) breaks `pnpm ratchets` unless the same commit edits `scripts/ratchets.mjs:78-85` (`MODULES` hard-codes `markup`) and `scripts/ratchets.json` (ceiling keyed by `apps/web/src/lib/markup/MarkupPane.svelte`; a ceiling whose file is gone is a breach, `ratchets.mjs:72-74`), and updates `ARCHITECTURE.md:120` and `:185-188` (invariant 13 names the module). Identifiers and screen names in one release: nothing breaks for singers; for a reviewer, one commit mixing a ratified wording change with a mechanical rename is harder to check, so land them as separate commits in the same release: (i) screen words and their pins, (ii) identifiers, folders, and ratchet config (tests unchanged except pins), (iii) persisted keys with their one-time reads. After is fine too; before is not, because the guard (step 4) would then flag identifiers that still match the old screen word. Addition: regenerate the key-prefix index at `i18n.ts:7-85` in commit (ii); it is dated 2026-10-02 and says of itself "nothing enforces it" (`i18n.ts:13`), and after the rename its "THREE LEGACY KEYS" paragraph (`:76-85`) is false.

**2. Where the names list lives.** One TypeScript module, `apps/web/src/lib/names.ts`, with the legend checked against it. Not both as peers: two copies drift, and the house rule is one term per concept (`docs/house-style/SKILL.md:128`). The module exports one array of records: concept, i18n key of the on-screen name (the English and French are then read through `t()`, never copied), code identifier, folder, persisted key, retired names (screen words, identifiers, keys), and one sentence on why any old key is still read. The guard imports it. A second test parses the names table in `ARCHITECTURE.md` and asserts each row matches the module, as `ratified-lines.test.ts` pins prose today; the table stays readable to a contributor and cannot drift. Comments on each record are why this is TypeScript and not JSON. `scripts/ratchets.mjs` cannot import TypeScript, so the file-name check (no path containing a retired identifier) lives in the guard test, which can walk `git ls-files` output or `readdirSync`, not in ratchets.

**3. Longer-term mechanisms, ranked by value per line of code.**
1. The guard (step 4) widened as the plan says, reading `names.ts`, over: `i18n.ts` values, `GuideContent.svelte`, `LearnContent.svelte`, `README.md`, `ARCHITECTURE.md`, `CONTRIBUTING.md` (history lines exempt by anchor, not by line), source identifiers, and file names. Rename the test from `no-fit-name.test.ts` (a retired name in a file name) to `retired-names.test.ts`.
2. An unread-key test, the mirror of `approval/i18n-keys.test.ts` (which checks only that every literal key used exists, `i18n-keys.test.ts:1-9`; no test checks the reverse, grep over both i18n tests for "unread" returns nothing). The `i18n.ts` index already lists prefixes with "no consumer found" (`i18n.ts:20`, `:23`, `:30`, `:32`, `:50`, `:53`, `:61`, `:68`) and row 155 left 24 `upload.*` keys unread (`QUEUE.md:100`). Start with an allow-list of today's unread keys so the test is green, then shrink it.
3. A Guide-controls test, narrow: every `<strong>` and every button chip in each language branch of the Guide must equal some `i18n.ts` value in that language. It is mechanical and catches a renamed control the Guide still names the old way. "Every control named is drawn" in general needs a rendered app and is not worth it.
4. A CONTRIBUTING section "Naming" of five lines pointing at `names.ts` and the table.
5. No separate French terminology list: the `fr` column reached through the i18n keys is the list.

**4. What a first-time contributor trips on, not in the plan or brief.**
- `CONTRIBUTING.md:38` points to "the project's voice instruction"; no such file exists (`git ls-files` grep for voice-instruction, VOICE.md: none).
- `README.md:13` and `CONTRIBUTING.md:62` say "LEARN module" and "LEARN content"; the tab is keyed Learn (`i18n.ts:187`) and capitalised by CSS only (row 171 review, item B-11). The legend uses a third spelling for one concept.
- `README.md:33` and `package.json:21-23` say Node 18 or later; the Vercel project builds on `nodeVersion: 24.x`. A contributor on Node 18 may hit a different result from production. NOT ESTABLISHED whether the build passes on 18.
- `apps/web/.env` is a tracked file that flips the wall (`wall.ts:9-10`); `ARCHITECTURE.md:132-133` names the variable but not the file, and nothing says the public build has it open.
- README "Project Structure" (`README.md:56-68`) omits `third_party/` (homr, named at `README.md:105`) and `docs/`.
- 174 comments in non-test source cite `file.ts:NNN` (grep `[A-Za-z+_-]+\.(ts|svelte|mjs):[0-9]+` over `apps/web/src`, `packages/*/src`). At least one is already false: `library/driver.ts:432` says `loader.ts:105` opens `ilya-data`; the open is at `loader.ts:141`.
- 25 of 301 non-test source files begin with no comment in their first six lines (loop over `git ls-files`), among them `routes/+page.svelte`, `Drawer.svelte`, `InspectorPanel.svelte`, `GuideContent.svelte`, `LearnContent.svelte`, and the five files of `voice/engine/`.
- `ARCHITECTURE.md:218` sends the reader to a dated memo in `docs/sessions/` for "the code behind something on screen", which `ARCHITECTURE.md:230-231` then says is never authoritative.

**5. Defaults to overrule.** One, in part. The ruling of 12:00 rests on "the work is not live yet"; question 6 shows a public production build. The ruling's effect (rename everything) stands because Dann owns the data risk and said so, but the plan's record of it must carry the fact, and the one-time read becomes a default to keep, not an exception to defend. Everything else stands: history in `docs/` keeps old names; the census sizes the rename. One DESK DEFAULT to add: the code identifier for the Melody document is the English screen word lowercased (`melody/`, `MelodyPane.svelte`, `StudioDocument = 'text' | 'melody' | 'insights'`, `destinations.ts:38`), so a contributor reaches code from the screen word without a lookup; two competent people would not differ.

**7. Keeping comments true.** Three rules, two of them tested. (a) Every non-test source file begins with a comment that says what the file is for and what it must agree with; a test asserts the comment exists (25 files fail today; it checks presence, never wording). (b) No `file.ts:NNN` citation in a source comment; the same test flags the pattern (174 today, so this lands with the comment pass, not before). Cite the function or constant name. (c) "Called by" lists do not go in headers; they go in the generated map (question 8), because they are the comment most likely to go stale. Also stale by nature: counts ("881 keys", `i18n.ts:11`), ticket-only citations ("N.174" with no words), and any "three legacy keys" sentence after a rename. A comment helps most where two sites must agree (`loader.ts:141` and `driver.ts:430-434` on the two databases), where a value crosses a package boundary, and where a wall or migration hides a branch (`destinations.ts:100-121`).

**8. The generated map.** The split is right. Generator: `scripts/module-map.mjs`, reusing the `IMPORT` regex already in `scripts/ratchets.mjs:103` and the same `walk`; zero dependencies, Node only, and a contributor who has read `ratchets.mjs` has read this. Output: a Markdown table per folder under `apps/web/src/lib/` and per package, listing which folders import it, written between two markers in `ARCHITECTURE.md` (or to `docs/MODULE-MAP.md`; the first keeps one legend). Check: `pnpm ratchets` regenerates into memory and fails if the committed text differs, with the message "run node scripts/module-map.mjs". Granularity: folder to folder everywhere, file to file only inside the six checked modules; file level across the whole app is noise.

## Amendments to the plan

1. Replace the DESK DEFAULT paragraph's clause "because whether `main` is served to the public is NOT ESTABLISHED" with: "because `ilya.dannmitton.com` serves `main` at `2b980e7b` (Vercel deployment `dpl_J14bV1A9e4wvt9KFsdQbkpXhbCe7`, production, 2026-09-21; `vercel.json:42-47`); whether anyone has saved data there is NOT ESTABLISHED (no Web Analytics). The read applies to `shane.profiles.v2` only; the `ilya:activeTab` value and the `scoreMarkup` band id already migrate (`destinations.ts:111-114`, `sections.svelte.ts:190`)."
2. Step 2: the names table in `ARCHITECTURE.md` is checked by a test against `apps/web/src/lib/names.ts`, which the guard imports (question 2).
3. Step 3(d): the folder rename lands with `scripts/ratchets.mjs:78-85`, `scripts/ratchets.json`, `ARCHITECTURE.md:120`, `:185-188`, and the regenerated `i18n.ts:7-85` index in the same commit, or ratchets fail.
4. Step 4: under item 11a the row 171 review's lead finding (patterns colliding with pinned passages) no longer blocks; a pinned passage that says Markup changes with its pin in row 170. What remains are ordinary-word collisions, and those still need phrase patterns: « poignée » meaning a handful at `GuideContent.svelte:67`, lowercase "metadata" as the noun, « Transcrire » as a heading (`:144`, `:440`). Add: "Each pattern in `names.ts` carries a comment saying whether it is a bare word or a phrase and why."
5. Step 4: rename `no-fit-name.test.ts` to `retired-names.test.ts`; move the three ratified-passage pins (`:97-127`) with it or into `ratified-lines.test.ts`, and drop `KNOWN_FIGCAPTIONS`, `stripFigcaptions`, and the test at `:73-77` (row 171 review, amendment 3).
6. Add step 3g, legend hygiene, from question 4: `CONTRIBUTING.md:38`, `README.md:13`, `README.md:33`, `README.md:56-68`, `ARCHITECTURE.md:132-133`, `:218`.
7. Add to step 3a the two tests of question 7 and the generator of question 8, each a few dozen lines, so the comment pass leaves a mechanism and not only prose.

## Amendments to the audit brief

**1. Replace the paragraph "Where the tree is" from "Read only:" to its end with:**

"Read only: `cat`, `sed -n`, `grep`, and `git --no-optional-locks --no-pager grep|log|show|ls-files`. Never write with git. Each `device_bash` call costs several seconds and returns at most 180 s of work, so batch: one call per section, a shell loop over a name list, output written to a scratch file in the session home (`$HOME/audit-A.txt`), then one `cat` of that file. Use `git --no-optional-locks --no-pager grep -nwE 'Fit|Shane|Transcription|Transcribe|Markup|Annotation|Metadata|Ribbon|Inspector|MSR|Pyodide' -- apps/web/src packages scripts tests '*.md'` once and sort the hits by category afterwards; never one grep per name per folder. Write only the one report file named below. If the tool is unreachable, stop and say so in one line."

**2. Section A, item 7, replace the sentence beginning "Mark each key" with:**

"The keys `origin/main` also writes are already established (`review-fable-plan-consistency_r1_2026-11-01.md`, question 6): `shane.profiles.v2`, the `ilya:activeTab` value `transcription`, the `scoreMarkup` band id in `ilya:openStations`, and the databases `ilya-data` and `ilya-library`. Do not re-derive them; list any other persisted key whose name or stored value carries a retired term, with its `Shane` line."

**3. Section C, item 1, delete "CSS classes nothing uses, where cheap to establish"** (a Svelte component's scoped classes are compiled away and the finding is not actionable from grep) **and add:** "Comments citing `file.ts:NNN` in non-test source: count them per file (174 at `cab8d205` by `grep -rnoE '[A-Za-z+_-]+\.(ts|svelte|mjs):[0-9]+'`), and for any ten, say whether the cited line still holds what the comment says."

**4. Section F, item (1), replace with:** "Non-test source files that begin with no comment in their first six lines: 25 of 301 at `cab8d205` (loop over `git ls-files` for `apps/web/src/**/*.{ts,svelte}` and `packages/*/src/**/*.ts`, excluding `.test.`, `.d.ts`, `vendor/`). Verify the count, list the files, and for each say in one clause what the header must name (what it is for, what it must agree with). Do not write the header."

**5. Section A2, item 1, add one sentence:** "Row 171's review (`review-fable-brief-row171_r1_2026-11-01.md`, 'Labels confirmed drawn') already confirmed the Guide's control labels against the components; take those lines as read and spend the budget on Learn and `i18n.ts`."

**6. Section B, add:** "Include `apps/web/.env` (tracked, sets the wall), `scripts/ratchets.json` (every ceiling path exists), and the key-prefix index at `apps/web/src/lib/i18n.ts:7-85` (each prefix's files still use it)."

**7. Rules, add after the budget line:** "Order of work, so a budget stop still leaves the useful part: A, A2, B, F, C, D, E. Write each section to the report as it finishes, not all at the end."

**8. Output, replace the reply shape with:** "Then reply in under 200 words: the counts per retired name in singer-facing text, the count of persisted keys needing a rename, the top three findings, and the file path."

## Questions for Dann

1. Irreversible: `ilya.dannmitton.com` has served the `main` build with the voice work open since 2026-09-21. Keep the one-time read of `shane.profiles.v2` so a singer who saved a voice there keeps it (default, one `getItem`), or drop it and accept that loss? Yes keeps it.

## Not established

- Whether anyone has visited or saved data on `ilya.dannmitton.com` (Web Analytics is off; the pageview query returns 404).
- Whether the `apps/web` build passes on Node 18, which `README.md:33` and `package.json:21-23` permit while Vercel builds on 24.x.
- Which of the 174 `file.ts:NNN` comment citations are stale beyond the one checked (`library/driver.ts:432` against `loader.ts:141`).
- The size of the identifier rename: 71 files match `Markup` as a word and 63 match `markup` under `apps/web/src` and `packages/*/src` (file counts from `grep -rlw`), before the census separates screen words, identifiers, and comments.
