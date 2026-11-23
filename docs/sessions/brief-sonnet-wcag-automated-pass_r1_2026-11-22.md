# Brief: the WCAG 2.2 automated pass over every view (QUEUE row 140, step 1)

r1, 2026-11-22, written by the desk. Model: Sonnet. Cap: 350,000 tokens. This brief MEASURES AND KEEPS NOTHING: it changes no code, opens no pull request, and writes one report. It runs before its Fable review under `CONTRACT.md` section 1 item 19's condition; Fable reviews the report.

**NOT ESTABLISHED beats a complete invented answer.**

## 1. Why this exists, and what it is for

Dann ruled QUEUE row 140 BEFORE the release on 2026-11-22 19:56. His gate, ruled 19:55: Ilya is fully functional before colleagues see it. A barrier that stops a keyboard-only or screen-reader colleague is an app that does not work for her, not one that is merely unenhanced. This pass answers one question: are there such barriers, and where.

Ilya is a free, open-source Russian lyric diction app for classical singers, English and French. Its users are voice teachers and singers, not programmers. Write the report for a reader who is a musician.

## 2. The target

Repository `DannMitton/ilya`, branch `Shane`, at `c233daad` or later.

Get it running in your own container, not on Dann's machine:

```
git clone --depth 1 --branch Shane https://github.com/DannMitton/ilya
```

then `pnpm install --frozen-lockfile`. Known traps, from `docs/memory/ENVIRONMENT.md`:

- pnpm 12 writes placeholder `allowBuilds` lines into `pnpm-workspace.yaml` on install. Do not commit anything, so this only matters if it breaks the install.
- Playwright: the sandbox Chromium is revision 1194 and the pinned Playwright wants 1208. Set `PW_CHROMIUM_PATH=/opt/pw-browsers/chromium-1194/chrome-linux/chrome`. Never run `playwright install`.
- The desk layout needs a viewport of at least 1,400 px. Playwright's default 1,280 silently runs the phone layout. Use 1,440 for desktop and 390 by 667 for phone.
- `pnpm dev` can die in `copy-underlay-model.mjs` when a lockfile dependency is missing from `node_modules`.

If the dev server will not start after two attempts, say so, then fall back in this order and name which one you used: (a) `pnpm build` in `apps/web` and serve the static output; (b) the live site at `https://ilya.dannmitton.com`, noting in the report that it is a production build of 2026-09-20 and so older than `Shane`.

## 3. The work

1. Install `axe-core` and drive it with Playwright. Use WCAG 2.2 A and AA tags.
2. Audit every view a colleague can reach, at 1,440 and at 390 by 667, in BOTH languages. The views, at minimum: the first-visit welcome sheet; the empty app; the upload and input receipt; TEXT; MELODY; INSIGHTS; the DRAWER and each of its bands; the Loupe; Corrections; the Calibrate or VOICE intake including the vowel capture screen; GUIDE; LEARN; the blank states of all three documents; and the print view of each document.
3. For each violation record: the rule id, the WCAG 2.2 success criterion, the impact as axe reports it, the view, the language, the viewport, the selector, and one sentence in plain words saying what a person using a keyboard or a screen reader actually hits.
4. Separately from axe, do a keyboard-only pass over one complete singer's path: open the app, load a score, open the Loupe on a note, make one correction, switch to MELODY, switch to INSIGHTS. Report every place where focus is lost, where a control cannot be reached by Tab, where focus order contradicts the visual order, or where no visible focus indicator appears.
5. Do not fix anything. Do not change a line of code.

## 4. Constraints

- Read-only. No commit, no push, no branch, no pull request.
- Do not touch Dann's machine. Everything happens in your own container.
- Do not run the eight gates. They are not part of this.
- If a view cannot be reached, say which and why, and do not guess at its result.
- Ilya loads nothing from outside services at run time. If your run shows an outbound request to a host that is not Ilya's own origin, report it; the desk owes a separate sweep on exactly that question.

## 5. Definition of done

A report at `/mnt/user-data/outputs/report-sonnet-wcag-pass_r1_2026-11-22.md` that contains:

1. **The headline:** how many distinct violations, how many views carry at least one, and whether any of them stops a colleague from completing the singer's path in section 3 item 4.
2. **The barriers, ranked by whether they stop a person**, worst first. Each with its view, language, viewport, criterion, selector, and the plain sentence from section 3 item 3.
3. **The rest**, grouped by rule id with a count and one example each.
4. **The keyboard walk**, as a numbered path with what happened at each step.
5. **The measured level**: which of WCAG 2.2 A and AA Ilya currently meets on the views you reached, and exactly which criteria stand in the way of the next level up.
6. **What you could not establish**, as its own section. Every view you could not reach, every check axe cannot automate, and anything the fallback in section 2 made uncertain. NOT ESTABLISHED beats a complete invented answer.
7. **Your actuals**: tokens used against the 350k cap, tool uses, wall-clock minutes, and which route of section 2 you used.

Write that file yourself before you hand back. Your hand-back in the thread is a summary of at most 20 lines; the report is the deliverable.

## 6. What the desk does with it

The desk reads the report in full, sends it to Fable for review under `CONTRACT.md` section 1 item 19, and turns the barriers into one Code brief. Nothing from this report reaches Dann as a task; it reaches him as what it costs a singer.
