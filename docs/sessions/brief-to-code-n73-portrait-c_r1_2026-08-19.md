# Brief to Code: N.73 portrait C, the fitted page and the reading aid

**Item: N.73 portrait C. Serves N.45 and N.63.** Floor `128bc29`. Re-derive every
line number before you edit.

**What Dann sees now and why this exists.** On the phone the sheet is a short
card at no particular proportion. He expects a miniature of the real page.
Portrait C is the ruled cure.

---

## 1. The ruling, quoted

**Ruled by Dann, 2026-08-18** (`docs/sessions/fable-gui-session-record_2026-08-18.md`,
rulings 4 and 5):

> Portrait treatment C is ruled. The fitted page is portrait's arrival view: the
> true paper, whole, with its header block, shadow, and colophon. One tap (Read)
> enters a reading aid; one tap (The page) returns. The interstitial is retired.
> Treatment B, a dressed scroll as the sole portrait representation, is rejected.

> The reading aid wears no paper dress: no shadow, no page edges, no header
> block, no colophon, a "reading aid, not the page" label, line rules at poem
> breaks, an end-of-verse mark. Nothing on it prints. The page owns its dress
> exclusively.

Rotation as mode switch stands. Landscape is unchanged.

The drawn reference is `docs/sessions/fable-gui-mockup_r2_2026-08-18.html`,
exhibit 1. Read it. Its hues are stand-ins; the tree's tokens govern.

## 2. The arrival view: the true page, fitted

**Scale the real page. Do not draw a lookalike.** The page is
`816 × 1056` px, letter at 96 dpi (`page-config.ts:18`). Take the existing
`.paper-page` and scale it to the available width with
`transform: scale(k)` and `transform-origin: top center`, where `k` is the
available width divided by 816. Reserve `1056 × k` of layout height so nothing
below it collapses.

This is the whole point of the step: what the singer sees is the printed artefact
at a smaller size, not a phone rendering of the same content. If you build a
second representation, WYSIWYG is lost and the item fails.

- Keep the header block, the shadow, and the colophon. They are the page's dress.
- Leave desk visible on both sides. The mockup insets the page to roughly 70
  percent of the screen width.
- The page stays untouchable: no controls on it, nothing floating over it.
- The desk head (the pair, Learn, Guide) stays above it, as it is today.

**One labelled action under the page: `Read`.** The ratified strings are `Read`
and `Lire` (`docs/sessions/fable-n73-french-strings_r1_2026-08-19.md`).

## 3. The reading aid

One tap on `Read` replaces the page with the aid. One tap on `The page` returns.

The aid carries:

- A top action reading `The page` / `La page`.
- A label reading `Reading aid, not the page` / `Aide à la lecture, non la page`.
- The word stacks at readable size, scrolling.
- A line rule where the poem breaks.
- An end mark, `· end of verse 1 ·` / `· fin du couplet 1 ·`, where `1` is the
  verse number.

The aid carries none of the page's dress: no shadow, no page edges, no header
block, no colophon. **Nothing on the aid prints.** Print emits the page, as it
does today.

The drawer's side tab works on both the page and the aid. It is unchanged from
S1b and you do not touch it.

## 4. The interstitial dies

Ruling 4 retires it. Delete the "Ilya is designed for desktop / Continue anyway"
gate. It is Fable's audit finding F5 and the mobile gate on every phone visit.

**If you believe some honest residue must survive**, say so in the memo and
build nothing. Dann has never ruled where a residue goes, and inventing one is
worse than leaving the question open.

## 5. The copy that is now false

`i18n.ts:173`, `paper.empty.mobile`, reads "Tap the chevron at the bottom to open
the drawer" and « ... en bas ... ». The pull moved to the side in S1.

Ship this, ratified by Dann 2026-08-19:

| key | en | fr |
|---|---|---|
| `paper.empty.mobile` | Tap the chevron on the left to open the drawer. | Appuyez sur le chevron à gauche pour ouvrir le tiroir. |

**Write no other French.** If any string this step needs is missing from the
ratified table, leave it in English, name it in the memo, and let Dann rule.
Specifically, the mockup's caption "The page · rotate for full size" is **not
ratified**. Do not ship it in either language.

## 6. What you do not build

- No changes to landscape, to print, or to the desktop.
- No changes to the drawer, its stations, or its pull.
- No new gestures. `Read` and `The page` are taps.
- Do not put a control on the paper.
- Do not run `git`. Dann ships.

## 7. Definition of done

Your local walk, then Dann's on the deploy, on his iPhone in portrait:

1. The sheet is letter-proportioned, whole, with its header block, colophon, and
   shadow, and desk visible either side.
2. What is on the small page is what prints. Measure it: the scaled page's
   aspect ratio is 816 to 1056.
3. `Read` enters the aid; `The page` returns; neither loses the singer's place.
4. The aid carries no shadow, no page edges, no header block, and no colophon.
5. Printing still emits the page, not the aid.
6. No interstitial on any phone visit.
7. Both languages.

Run all five gates and report the numbers. Baselines: phonology 216,
dictionary 235, web-check 0 errors and 7 warnings in 4 files, web-test 671,
score-parser 444 passed and 5 skipped.

Ship with `sh ~/Downloads/ilya-ship.sh "N.73 portrait C: the fitted page and the
reading aid"`.

## 8. The memo

`docs/sessions/n73-portrait-c_r1_2026-08-19.md`, same commit. Short: what
shipped, the measured aspect ratio, where the tree beat this brief, anything you
refused to invent with `NOT ESTABLISHED` against it, the gate numbers, and what
Dann must walk.
