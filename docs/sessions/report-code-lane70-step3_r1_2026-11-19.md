# Report, lane 70, step 3: the pictures and three measurements

2026-11-19. Branch `cloud-lane-70`, on top of the step 2 commit (`ab0733e3`). Brief section 3, step 3. This step changes no source file. It adds only the pictures and this report.

## 1. How it was measured

- Tree: `cloud-lane-70` after steps 1 and 2, dev server (`pnpm dev`) on `:5173`, system Chromium (`/opt/pw-browsers/chromium`), Playwright.
- Fixture: `apps/web/src/lib/score/ingestion/fixtures/sunless-01-engraved.musicxml`, uploaded the way `e2e/insights-key-lines.test.ts` uploads it. Stored voices: the six named voices of that file, copied as they are, plus two I added to find states (`NORANGE`: a baritone with no range, so the range offer shows; `TIGHT`: a bass with range C3 to E3).
- The measuring script is in the session scratchpad, not in the repository, and is not a test (the brief says to write none).
- Pictures at a device scale factor of 2, so a person can read them. All box sizes below are CSS pixels.

## 2. Which voice

The brief asks for a stored voice whose INSIGHTS runs to at least two pages. Page counts at 390 by 844 (count of `.insights-container .paper-page`):

| Voice | English | French |
| --- | --- | --- |
| TENOR_T | 3 | 3 |
| BASS_B1 | 2 | 3 |
| BASS_B2 | 3 | 3 |
| NOVICE_N | 3 | 3 |
| SOPRANO_S | 3 | 3 |
| BARITONE | 3 | 3 |
| TIGHT (mine) | 3 | 3 |
| NORANGE (mine) | 2 | 2 |

Every voice runs to at least two pages. **I used BASS_B2**, which has two key lines and a "Try this key" on each, and three pages in both languages.

## 3. The pictures

All in `docs/sessions/lane70-shots/`, BASS_B2:

1. Page 1, whole: `insights-p1-390x844-en.png` and `insights-p1-390x844-fr.png`.
2. The foot of page 1 and the head of page 2, English: `insights-break-390x844-en.png`. A band 90 CSS px above and below the break.
3. English, at the tablet sizes: `insights-viewport-768x1024-en.png` and `insights-viewport-1024x768-en.png` (the whole viewport, with the app furniture), and `insights-p1-768x1024-en.png` and `insights-p1-1024x768-en.png` (page 1 alone).

I looked at the French page 1 and the 768 by 1024 viewport pictures. Both show the 816 px page with its header, wordmark, staff figure, key lines, the rose squircle, and the footer ("PAGE 1 SUR 3" in French). I looked at the 390 break picture at an earlier, lower resolution only; I did not re-read it after the re-run at scale 2.

## 4. The measurements

**The scale.** `.paper-scale` carries `scale(0.419118)` at 390 px in English and in French: 342 / 816, as the brief and step 0 computed. At 768 by 1024 it is `scale(0.882353)` (720 / 816). At 1024 by 768 it is `scale(1)` with `translateX(80px)`: the desk is wider than the page, so `PageFit`'s clamp at 1 holds and the page is centred, not enlarged. (Source: `.paper-scale` inline `transform`, read in the page.) Page 1's box at 390 px is 342 by 442.6, at x = 24.

**Item 4. Page count at 390 by 844.** English 3, French 3 (BASS_B2). The 768 by 1024 and the 1024 by 768 layouts also show 3.

**Item 5. Printed page count.** `page.emulateMedia({ media: 'print' })` then `page.pdf({ format: 'Letter', printBackground: true })`, counting `/Type /Page` objects in the PDF. Same song and voice (BASS_B2):

| Language | Printed at 390 by 844 | Printed at 1440 by 1300 |
| --- | --- | --- |
| English | 3 | 3 |
| French | 3 | 3 |

The screen page count was 3 in every one of those four cases, so the printed count equals the screen count. **What a narrow layout printed before the repair was not measured** (see NOT ESTABLISHED).

**Item 6. The scroller against the bottom of `.paper-fit`, at 390 by 844, English.** The scroller is the nearest ancestor of the visible `.paper-fit` with `overflow-y` of auto or scroll; it is `.main-content` in both cases.

| Pane | `scrollHeight` | `.paper-fit` bottom, in the scroller's content | Difference | Scroller bottom padding |
| --- | --- | --- | --- | --- |
| INSIGHTS | 1551 | 1440.2 | 110.8 | 52px |
| MELODY | 1108 | 997.6 | 110.4 | 52px |

INSIGHTS overscrolls 0.4 px more than MELODY. I read that as no difference, not as the failure the brief names: the two figures agree to within a sub-pixel. So I did not stop before step 4. What makes up the other 58 px beyond the 52 px of padding, I did not trace (see NOT ESTABLISHED). The measurer, at `left: -20000px`, did not add to the scroll height.

## 5. Things seen that the brief did not ask about

- **French key lines show literal asterisks.** On `insights-p1-390x844-fr.png` the two key lines read "votre *primo* ou au-dessus" and "votre *secondo*". The strings carry asterisk-italic markup (`apps/web/src/lib/i18n.ts:2432` `'votre *primo*'`, `:2435` `'votre *secondo*'`; the comment at `:2394` says the French uses asterisk italics). The key lines are drawn through the `prose` snippet and the other paragraphs through `rich` (`SingerBlock.svelte:69`, `keyLine`), which is where I would look first. I did not read the two snippets to confirm. This is outside the lane: the same text was drawn the same way in the old column. I changed nothing and I did not check the old column in French.
- On the 768 by 1024 picture, page 1 ends with a large empty band between the squircle and the footer, because the squircle continues on page 2 (open at the break, as the file's header comment describes). I read that as the pagination working, not a defect, but I did not check it against the pagination rule.

## NOT ESTABLISHED

1. What a narrow layout printed before the repair. Not measured: it would have meant reverting the source. The brief asks for the comparison of 390 against 1440 after, which is item 5 above.
2. Whether `page.pdf()` in print emulation at 390 px behaves like a real phone's print dialogue. The component's `isMobile` flag stays what it was when the page loaded, which is the situation the print rules in `PageFit.svelte:107-128` are written for, but a real device's print path was not exercised.
3. What the extra 58 px of scrollable height below the fit is, on either pane.
4. The break picture at scale 2 was not re-read by me (section 3).
5. Anything about the other voices' pictures: only BASS_B2 was photographed.
6. Whether the French asterisks are intended (section 5).
