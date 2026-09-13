# Memo: colour story stage 3a, the one-word rename

**Answers:** `docs/sessions/brief-colour-token-rename_r1_2026-09-13.md`, read in full this session, with the three corrections in Dann's prompt of 2026-09-13, which win where they disagree with it.
**Date:** 2026-09-13.
**Status:** WRITTEN and walked in the browser at 1400 px, so DONE by CONTRACT §5. **Not committed.** No git command that writes was run.

| today | now |
|---|---|
| `--dusty-rose` | `--rose` |
| `--deeper-lavender` | `--lavender` |
| `--quiet-cobalt` | `--cobalt` |

**No hex value moved.** A word-level `git diff` over `apps` and `packages` shows only token names changing (§3).

---

## 1. One thing the prediction got wrong, and what I did about it

**The brief and the prompt both predicted that no gate could move, because the tests assert hex literals rather than token names. For `--deeper-lavender` that was false.**

The pacifier's contrast checker keys its palette by token name without the leading dashes: `'deeper-lavender': hexToRgb('#8E7E9B')` at `apps/web/src/lib/shane/pacifier/contrast.ts:128`, and `fgToken: 'deeper-lavender'` at `:283`. Rule R20 in `contrast.test.ts` reads `app.css` at test time and resolves every palette key to the token of the same name. If the token is missing, it throws (`contrast.test.ts:329`).

**Controlled run, after the `app.css` and component renames and before touching `contrast.ts`.** The prediction was that gate 4 would deviate with R20 throwing. The run gave `Tests 3 failed | 1120 passed (1123)`. All three failures read `R20: token --deeper-lavender is not declared in app.css`.

**The fix.** I renamed the key to `'lavender'` at `contrast.ts:128` and `:283`. DESK DEFAULT: the key names the token, so this is the same rename, and no value moves. Gate 4 returned to 1123 (§5).

The prompt's grep, `--deeper-lavender` with its dashes, could not have found this site. Any later rename of a pacifier token (`surround-shane`, `muted-lavender`, `light-lavender`, the inks, `paper-cream`) meets the same check.

---

## 2. Counts, confirmed before editing

Instrument: `grep -rnoE -- "--name\b"` over `apps/web/src` and `packages/*/src`, run on the untouched tree. `apps/web/.svelte-kit`, `apps/web/build`, and `node_modules` sit outside those paths.

| token | brief | desk's correction | this run | match |
|---|---|---|---|---|
| `--dusty-rose` | 25 sites, 12 files | 19 sites, 6 files | 19 sites, 6 files | desk |
| `--deeper-lavender` | 49 sites, 22 files | 43 sites, 13 files | 43 sites, 13 files | desk |
| `--quiet-cobalt` | 21 sites, 15 files | 12 sites, 6 files | 12 sites, 6 files | desk |

Each of the 74 sites sits on its own line, so the count is 74 lines as well. They fall in 16 distinct files; the per-token file counts overlap.

**Eight more lines named a token without its leading dashes.** These are the two `contrast.ts` keys from §1, and six code comments: `TitleHeader.svelte:14`, `:21`, `:27`, `PageFooter.svelte:13`, `Drawer.svelte:1938`, and `NotationFields.svelte:44`. I renamed those too, as DESK DEFAULT, so a comment names a token that exists. They add four files, for 20 in all.

Correction 2 held: `app.css:160` was `--lang-chip-guide: var(--quiet-cobalt);` and is now `var(--cobalt)`. `HeaderBar.svelte:219`, `var(--lang-chip-guide, #5C739E)`, was not touched.

---

## 3. How the edits were made

**Anchor.** Each anchor is `path:line` plus the exact current text of that line, read from the grep in §2. A script checked every anchor against the file before any file was written, and it would have refused the whole batch on one mismatch. Identical lines, such as `color: var(--deeper-lavender, #8e7e9b);` in `CorrectionSurface.svelte`, stay unambiguous because the line number is part of the anchor.

**Per line.** Only the token name was substituted. The script refused any line whose hex literals would differ after the substitution. No line had to be refused.

**Result, word-level diff** (`git diff --word-diff=porcelain` over `apps` and `packages`):

| removed | added |
|---|---|
| `--dusty-rose` ×19 | `--rose` ×19 |
| `--deeper-lavender` ×43 | `--lavender` ×43 |
| `--quiet-cobalt` ×12 | `--cobalt` ×12 |

The dashless lines changed only `deeper-lavender` to `lavender` and `quiet-cobalt` to `cobalt`. `git diff --stat`: 20 files, 82 insertions, 82 deletions. No line was added or removed, so no `path:line` citation into these files moved.

**`app.css` comments.** The derivation prose now names `--rose`, `--cobalt`, and `--lavender` at `:150`, `:159`, and `:161`, with nothing else in it changed. The section headings "Dusty Rose accent" (`:37`) and "Quiet Cobalt accent" (`:41`) name colours, not tokens, so I left them, as DESK DEFAULT.

**Left alone as instructed:** `--muted-lavender` and `--light-lavender` (`app.css:169`, `:170`; `contrast.ts:126`, `:127`), every derived token (`--surround-*`, `--lang-chip-*`), every fallback hex, and everything under `docs/`.

---

## 4. Every file touched

1. `apps/web/src/app.css`
2. `apps/web/src/lib/components/Drawer/Drawer.svelte`
3. `apps/web/src/lib/components/Drawer/IntakePanel.svelte`
4. `apps/web/src/lib/components/Drawer/NotationFields.svelte`
5. `apps/web/src/lib/components/Drawer/StationHeader.svelte`
6. `apps/web/src/lib/components/Drawer/VoiceAnchor.svelte`
7. `apps/web/src/lib/components/HeaderBar.svelte`
8. `apps/web/src/lib/components/Paper/PageFooter.svelte`
9. `apps/web/src/lib/components/Paper/ReadingPaper.svelte`
10. `apps/web/src/lib/components/Paper/TitleHeader.svelte`
11. `apps/web/src/lib/components/Reading/GuideContent.svelte`
12. `apps/web/src/lib/shane/CalibrationWizard.svelte`
13. `apps/web/src/lib/shane/CorrectionSurface.svelte`
14. `apps/web/src/lib/shane/InsightsPane.svelte`
15. `apps/web/src/lib/shane/ProfileSwitcher.svelte`
16. `apps/web/src/lib/shane/VoiceProfilePane.svelte`
17. `apps/web/src/lib/shane/pacifier/Pacifier.svelte`
18. `apps/web/src/lib/shane/pacifier/contrast.ts`
19. `apps/web/src/routes/+page.svelte`
20. `packages/score-parser/src/staff-renderer.ts`

Plus this memo, the one new file. `git status` also shows `docs/memory/STATE.md` modified, and `Claude outputs/` and `docs/sessions/paste-colour-3a_r1_2026-09-13.md` untracked. All three were already so when this session first read `git status`, before any edit, and none is mine. **The ship script refuses on untracked files**, so those two must be added or moved before a ship.

---

## 5. Definition of done

**1. Source grep.** `grep -rn -- "--dusty-rose\|--deeper-lavender\|--quiet-cobalt" apps/web/src packages/*/src` returns **0 lines**. A second grep for the dashless forms over the same paths also returns **0**.

**2. Docs grep.** The same grep over `docs/` returned **205 lines** before this memo was written, and `git diff -- docs` shows only the `STATE.md` change that predates the session. **This memo adds its own mentions of the old names**, and the count after writing it is in §7.

The generated directories, not edited, still carry the old names until they regenerate: 8 files under `apps/web/.svelte-kit` and 4 under `apps/web/build`.

**3. Gates.** I ran the five commands from `~/Downloads/ilya-ship.sh` directly, with its exact match strings and its ANSI stripping. The script itself refuses to run while untracked files exist. I read the baselines from the script (`ilya-ship.sh`, the five `gate` lines), not from ENVIRONMENT's table, and changed no baseline.

| gate | script's baseline | untouched tree | after CSS rename only | after the `contrast.ts` key | prediction for the final run |
|---|---|---|---|---|---|
| 1 phonology | 216 passed (216) | OK | not run | **OK** | no move |
| 2 dictionary | 235 passed (235) | OK | not run | **OK** | no move |
| 3 web-check | 0 errors and 7 warnings in 4 files | OK | not run | **OK** | no move |
| 4 web-test | 1123 passed (1123) | OK | **3 failed, 1120 passed (1123)**, as predicted in §1 | **OK** | no move |
| 5 score-parser | 547 passed, 5 skipped (552) | OK | not run | **OK** | no move |

**All five at baseline. Gate 4 has not moved.**

**4. The walk, 1400 × 900, `pnpm --filter @ilya/web dev` on port 5173**, which serves source and so cannot be a stale build.

*Stated before looking:* every desk, header band, and language chip computes to the colour its unchanged hex declares, and the old names compute to nothing.

**Tokens on `:root`, computed:**

| name | value |
|---|---|
| `--rose` | `#A67B7B` |
| `--lavender` | `#8E7E9B` |
| `--cobalt` | `#5C739E` |
| `--lang-chip-guide` | `#5C739E` |
| `--dusty-rose`, `--deeper-lavender`, `--quiet-cobalt` | empty |

**Each document, clicked from the desk head and read with `getComputedStyle`:**

| document | desk | header band | language chip | expected | result |
|---|---|---|---|---|---|
| Score markup | rgb(210, 203, 215) | rgb(142, 126, 155) | rgb(128, 110, 142) | `#D2CBD7`, `#8E7E9B`, `#806E8E` | match |
| Insights | rgb(219, 202, 202) | rgb(166, 123, 123) | rgb(154, 106, 106) | `#DBCACA`, `#A67B7B`, `#9A6A6A` | match |
| Learn | rgb(219, 202, 202) | rgb(166, 123, 123) | rgb(154, 106, 106) | `#DBCACA`, `#A67B7B`, `#9A6A6A` | match |
| Guide | rgb(190, 199, 216) | rgb(92, 115, 158) | rgb(92, 115, 158) | `#BEC7D8`, `#5C739E`, `#5C739E` | match |
| Transcription (control, sage) | rgb(209, 215, 203) | rgb(139, 154, 125) | rgb(108, 122, 95) | `#D1D7CB`, `#8B9A7D`, `#6C7A5F` | match |

**The drawer's bands**, on every document that shows the drawer: Piece rgb(92, 115, 158), Input rgb(108, 122, 95), Score markup rgb(128, 110, 142). The Piece band reads `--cobalt` through `--lang-chip-guide` with no fallback (`Drawer.svelte:1179`), so a broken `--cobalt` would show there as no fill.

I took screenshots of Score markup, Insights, Learn, and Guide at 1400 px. They show the lavender, rose, and cobalt header bars and desks, and Guide's cobalt chapter band.

---

## 6. WHAT I COULD NOT ESTABLISH

- **A lavender or rose use site with no fallback, on screen.** Every `--rose` use in the tree carries a fallback hex. The no-fallback `--lavender` sites (the voice anchor's dot, the calibration takeover, the wheel's captured ring, focus rings) were not on screen in the states walked, and `.voice-dot` was absent from the DOM. For these two tokens, the evidence that the name resolves is the computed `:root` value in §5, not a painted pixel. That value is also what every use site reads.
- **A visual comparison against the pre-rename build.** The walk compares computed colours with the declared hex values, which did not change. There was no side-by-side against a screenshot taken before the edits.
- **Whether other tooling reads these names.** ESLint and Prettier are not gates and were not run. Nothing outside `apps/web/src`, `packages/*/src`, `apps/web/e2e`, `apps/web/scripts`, `apps/web/static`, `tests`, `scripts`, and `tools` was searched. Those extra paths returned no hits.

**Noticed and not acted on:**

- **Three comments now read ambiguously.** `ReadingPaper.svelte:108` and `:109` contrast "the app's own tokens" with "the mockup's `--rose` and `--cobalt`". `VoiceAnchor.svelte:14` cites the mockup's `--lavender: #9B8AA6`. Both describe a mockup and stay literally true, but the app's tokens now carry the same names.
- **`staff-renderer.ts:75` cites `app.css:69`** for the lavender token, which is declared at `app.css:171`. The citation was stale before this pass. I renamed only the token name.

---

## 7. Docs count, after this memo

The source grep over `docs/` now returns **221 lines**: the 205 that were there before this session's rename, plus 16 in this memo. No other file under `docs/` was edited by this pass.

**NOT ESTABLISHED beats a complete invented answer.**
