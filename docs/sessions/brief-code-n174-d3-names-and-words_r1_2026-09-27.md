# Brief for Code, r1: N.174 slice D.3, the last names and the words

Written by the desk 2026-09-27 after D.2.6 shipped at `7f5b8e8`. Spec, plan, and module map
as in D.2.1's brief. Every `path:line` here was read by the desk at `7f5b8e8` this session.
If the tree has moved, the tree wins; say where.

**What this slice is.** The code now says Text, Markup, and Insights in its folders and ids.
What is left: six small renames the plan held back from D.2.6, one set of variables, the
comments, and the four top-level documents. After this slice, a search for `shane` or for
Fit as a name finds only the history line and the rows kept on purpose (the list is in
"Kept on purpose").

**What the singer sees must not change,** with one exception on a developer-only page
(item A4). The desk compares the 84 screenshots once you are done.

## Before you start

Fetch `Shane` and confirm HEAD is `7f5b8e8` or a descendant. One writer on `Shane` at a time.
Take the "before" readings first. No `git stash`, `checkout`, `restore`, `worktree`, or other
git command that writes. Do not serve a second copy of the app beside the dev server. Grep
with `-a`.

## Part A. Names in code

All paths are under `apps/web/src/` unless given in full.

1. **The voice variables in `routes/+page.svelte`.** `shaneFormants`, `shaneVoiceName`, `shaneCharacteristics`, `shaneVoiceUpdatedAt`, `shaneIntake` (declared `:345-352`) become `voiceFormants`, `voiceName`, `voiceCharacteristics`, `voiceUpdatedAt`, `voiceIntake`. Their uses: `:2284`, `:2368-2369`, `:4568-4572`, `:4883`, `:5051-5055`, `:5084-5086`. **Watch the prop shorthand:** `voiceName={shaneVoiceName}` becomes `voiceName={voiceName}`, which Svelte lets you write `{voiceName}`; either form is fine, but confirm `svelte-check` is clean and no prop now binds to the wrong name.
2. **CSS classes in `routes/+page.svelte`.** `.shane-provenance` (`:4550`, rule at `:5317`) becomes `.markup-provenance`. `shane-no-lyrics` (`:4681`) and `shane-storage-notice` (`:4926`, `:4934`, `:4941`, `:4948`, `:4968`, `:4976`) have no style rule and no selector anywhere in `apps/web` (module map, section 10); delete the class attribute from each element and leave the element. Search `apps/web` with `-a` for each old class first and confirm nothing reads it.
3. **The package attribute.** `data-fit-page` becomes `data-score-page`: `packages/score-parser/src/page-layout.ts:406` and `page-layout.test.ts:267`. Search `apps/web` for any reader of the old attribute first.
4. **The developer font page.** The route folder `routes/fit-font-lab/` becomes `routes/notation-font-lab/` (`git mv`). Its `<title>` and `<h1>` (`:50`, `:54`) change from "Fit font lab" to "Notation font lab". **This is the one shown-text change in N.174, on a page that exists only in development** (`docs/memory/ENVIRONMENT.md:994`: it 404s on the deployed build). The comment at `lib/score/notation-fonts.ts:7` and the two `ENVIRONMENT.md` lines (`:994`, `:1781`) follow.
5. **The Guide's section anchors.** `guide-fit-forecast`, `guide-fit-characteristics`, `guide-fit-notation` become `guide-markup-forecast`, `guide-markup-characteristics`, `guide-markup-notation`: `lib/components/Reading/GuideContent.svelte:58`, `:65`, `:71` (French) and `:335`, `:342`, `:348` (English); `lib/components/Drawer/Drawer.svelte:299`, `:749`, `:750`, `:751`. **The old anchors become a link a singer may have saved.** In `routes/+page.svelte`'s `handleHashNavigation` (`:4227`), map each old id to its new one before scrolling, and replace the address with the new hash so the address bar shows it. Add a unit test for the mapping if the function can be reached; if it cannot, say so. The headings' visible text does not change: "Fit forecasts…" and "Fit's notation conventions" are shown strings that N.154 owes Dann (`docs/memory/STATE.md`), not this slice's.
6. **The i18n keys `fit.witness.*`** become `witness.*`: `lib/i18n.ts:752-759`, eight keys. Values unchanged by one character. Readers: `lib/score/TextualWitnesses.svelte:44`, `:45`, `:50`, `:52`, `:53`, `:57`, `:79`, `:88`, `:93`, `:99`. The approval test `lib/approval/i18n-keys.test.ts` must pass.
7. **The local test's environment variable.** `SHANE_T08_MNX` becomes `MNX_T08_PATH` (`packages/score-parser/src/mnx-parser.test.ts:648`, and its comment at `:644`).
8. **The old gate name is retired.** `lib/wall.ts:12` stops reading `PUBLIC_INCLUDE_SHANE`; only `PUBLIC_INCLUDE_MARKUP_INSIGHTS` opens the gate. In `lib/wall.test.ts`, the case at `:26-27` becomes "the old name alone no longer opens it", and `:12` stubs the new name. Vercel has no setting of either name (desk read, 2026-09-27), so nothing outside the tree reads the old one.

## Part B. Words

1. **Comments.** About 230 comment lines still say `Shane` or use `Fit` as a name. Reword each by what it means now:
   - `Shane` as the whole feature: "Markup and Insights", or the module the comment is about (`score/`, `voice/`, `reader/`, `analysis/`).
   - `Fit` as the document: "Markup". `Fit` as the drawer or panel: say what the drawer holds now.
   - A comment about a thing that was deleted or renamed may keep the old name once, marked as history: "(then called Fit)" or "(the old `shanePanel`)".
   - **A quotation of Dann stays verbatim.** Reword the sentence around it, or add its date, and never the words inside the quotation marks. Examples: `lib/voice/CalibrationWizard.svelte:1122`, `:1745` (module map, section 10).
   - `fit` in its ordinary sense (fitting to the page, "a good fit", `fitPageOne`, `fitWidth`, `PageFit.svelte`) stays. Step A's inventory (`docs/sessions/n174-A-inventory_r1_2026-09-27.md`) and the module map's section 10 give a verdict for most lines; where they disagree with the source, the source wins.
2. **`app.css:9`**, "so Shane self-hosts a verified subset": the fonts are the app's; say so.
3. **`ARCHITECTURE.md`**: add the one history line the spec names, near the top: "Developed under the codename Shane; shown on screen as Fit until 2026-09. N.174 (2026-09-27) renamed the code to Text, Markup, and Insights." Every other mention of Shane or Fit as a name goes.
4. **`AGENTS.md`, `README.md`, `CONTRIBUTING.md`**: the same treatment. `AGENTS.md` said "the user-facing tab is Fit… never translated" (`e2e/singer-paths.test.ts:93-95` quotes it); that sentence is false and goes. The comment at `e2e/singer-paths.test.ts:93` follows.
5. `docs/memory/` files outside `docs/sessions/`: paths and names in present-tense descriptions follow. Dated records, rulings, and plans keep their words as written.
6. `tools/e16-harness/` prose last and lightest: it is not product code (`tools/e16-harness/package.json:5`).

## Kept on purpose

These stay and are the only hits step E may find:

- The `ARCHITECTURE.md` history line.
- `'shane'` and `'transcription'` as the migration cases in `lib/destinations.ts` (`:111`, `:113`) and their test.
- The storage keys `shane.profile.v1` and `shane.profiles.v2` (`lib/voice/profileStore.ts:68-69`) and their comment.
- The ratchet's `SHANE_FOLDER_IS_GONE` and its message (`scripts/ratchets.mjs:100-106`).
- `wall.test.ts`'s case that the old gate name no longer opens the gate.
- The Guide headings' shown text, owed to N.154.
- History comments marked as history, and quotations of Dann.
- Anything under `docs/sessions/`, `docs/memory/` records, and the git branch `Shane`.

## Done when

- A search of `apps`, `packages`, `scripts`, `tools`, and the four top-level documents for `shane` (any case) and for `Fit` as a name finds only the "Kept on purpose" rows. List every remaining hit in the memo by file and line, each with its reason.
- `node scripts/ratchets.mjs` passes. All eight gates pass; state the web-test count (the anchor test may add one or more). The score-parser count stays `615 passed | 5 skipped (620)`.
- Playwright desktop 28 and phone 2 stay green.
- On localhost: open the address with `#guide-fit-forecast` on it; the Guide opens at that section and the address bar shows `#guide-markup-forecast`. State your expectation first.
- On localhost: the Textual witnesses section reads as before, in English and French, on a score whose words differ from its poem (if no such score is at hand, say so).
- On localhost: `/notation-font-lab` opens; `/fit-font-lab` does not.
- A memo of fifteen lines or fewer in `docs/sessions/memo-code-n174-d3_r1_2026-09-27.md`, with the remaining-hits list attached below it (the list does not count toward the fifteen), and a section titled "NOT ESTABLISHED". **NOT ESTABLISHED beats a complete invented answer.**

## Do not

- Do not change a shown string except the two on the developer font page.
- Do not edit inside a quotation of Dann, or any file under `docs/sessions/`.
- Do not rename a storage key or `InsightsIntake.svelte`.
- Do not use `git stash`, `checkout`, `restore`, `worktree`, or any other git command that writes. Do not commit. Dann ships with `ilya-ship.sh`; `git add` the new paths first.
