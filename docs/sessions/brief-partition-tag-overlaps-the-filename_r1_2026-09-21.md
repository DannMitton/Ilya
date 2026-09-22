# BRIEF. « PARTITION » overlaps the filename on the score receipt

**Written 2026-09-21 by the desk, on Dann's instruction. Shape from `BRIEF-TEMPLATE.md`.**
**ONE DECLARATION. Do not widen it.**

---

## 1. What was observed

- **Dann, 2026-09-21 at 23:26, on his own screen in French mode:** *"« PARTITION » must
  not collide with the filename, I'm surprised this is happening. Please fix it now."*
- **His screenshot shows the tag's last letter and the filename's first letter drawn on
  top of each other**, reading as `PARTITI0Nsunless-01-v-chetyryokh-stenakh_lam…`.
- **It was recorded five days earlier and nothing tracked it.** `INBOX.md`, 2026-09-16,
  seen on the N.144 walk: *"the drawer's SCORE receipt draws its label « PARTITION » run
  into the file name (« PARTITIONKabalevsky… »), no gap."* **The note says "no gap"; the
  screen shows overlap. The note understated it.**
- **English is unaffected**, which is why it survived five days of walks.

## 2. What is established, each line carrying its `path:line`

**Read in the tree 2026-09-21, and measured the same evening in Dann's own Chrome on the
live alias build `8bd1aff`.**

- `IntakePanel.svelte:641-651`, `.intake-receipt .tag`: `flex: none`, **`width: 40px`**,
  `font-family: var(--font-mono)`, `font-size: 10px`, `letter-spacing: 0.08em`,
  `text-transform: uppercase`. **There is no `overflow` rule**, and the computed value is
  `visible`.
- `IntakePanel.svelte:633-640`, `.intake-receipt`: `display: flex`, **`gap: 10px`**,
  `min-height: 44px`.
- `IntakePanel.svelte:653-664`, `.intake-receipt .line`: `flex: 1`, `min-width: 0`,
  `overflow: hidden`, `text-overflow: ellipsis`, `white-space: nowrap`. **The filename
  already ellipsises correctly; it is being painted over, not mis-sized.**
- `IntakePanel.svelte:460-461`: the score receipt's tag is `t('upload.watermark')` and the
  filename is `score.fileName`, adjacent flex children.
- **MEASURED in Dann's Chrome, canvas `measureText` with the tag's own computed font
  (`10px Menlo, Consolas, monospace`, letter-spacing `0.8px`):**

  | word | rendered width | against the 40px box |
  |---|---|---|
  | `SCORE` | 34.10 px | fits, 5.90 px spare |
  | `POEM` | 27.28 px | fits |
  | « POÈME » | 34.10 px | fits |
  | **« PARTITION »** | **61.38 px** | **overflows by 21.38 px** |

- **After the row's 10px gap, « PARTITION » overlaps `.line` by 11.38 px.** That is the
  collision, and it accounts for exactly the one-character overlap in the screenshot.

## 3. Measure before you change anything

Report these before writing code.

1. **Confirm `upload.watermark` and `input.watermark`'s values in both languages**, and
   report the widest of the four at the tag's computed font. The desk measured
   « PARTITION » at 61.38 px. **If any is wider than 62 px, say so and stop**, because the
   chosen value would not fit it either.
2. **Report whether any other element in the tree uses `.intake-receipt .tag`**, or a
   fixed-width tag beside an ellipsising line, and so carries the same latent bug.
   **Report only. Do not fix it here.**
3. **Report whether a test asserts the tag's width or the receipt's layout**, searching
   every test directory **including `apps/web/e2e-phone/`**.

## 4. The rulings this serves

- **Dann's instruction of 2026-09-21 at 23:26**, quoted in section 1. **The design is the
  desk's and he ruled it in by asking for the fix now**, so authorship of the 62px value
  is the desk's, not his (CONTRACT §3, a ratification is not an authorship).
- **The 44px row and the tag's typography are the prototype's**, per
  `IntakePanel.svelte:628-632`. **Nothing about them changes here.**

## 5. Constraints

- **CHANGE ONE DECLARATION:** `.intake-receipt .tag`'s `width: 40px` becomes `62px`.
- **Do not touch `.line`.** It is correct: it already ellipsises and its `min-width: 0` is
  what lets it shrink. The bug is the tag painting over it.
- **Do not add `overflow: hidden` to the tag.** That would clip « PARTITION » to
  « PARTITI », which trades a collision for a truncated word.
- **Do not change `gap`, `min-height`, the font, the tracking, or the uppercase.**
- **Do not restructure the receipts into a grid.** That is the durable fix and it is a
  markup change; it is recorded in `OWED.md` for whenever the drawer is next opened.
- **Do not rename `upload.watermark` or `input.watermark`.** `IntakePanel.svelte:440-443`
  records both as ratified words.
- **What this displaces: nothing.** It is one value, and `SCHEDULE.md` week 2 is closed.

## 6. Done when

**WRITTEN:**

- `.intake-receipt .tag` is `width: 62px`.
- Five gates at baseline.
- The three readings from section 3 are reported.

**DONE is Dann's walk:** the score receipt in French mode, with a file loaded, showing
« PARTITION » clear of the filename, and the English receipt unchanged with its filename
still starting at the same x as the poem receipt's.

## 7. Report back

The commit, the results against section 6, the three readings, and **what could not be
established.**

**NOT ESTABLISHED beats a complete invented answer.**
