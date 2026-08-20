# Brief to Code: N.73 portrait C3, the courtesy prompt and the keyboard

**Item: N.73 portrait C3. Serves N.45.** Floor `fa4e0c9`. Two changes, both
small. Re-derive every line number before you edit.

Both come from Dann's walk of `fa4e0c9` on his iPhone.

---

## 1. The keyboard opens every time he reaches the marked score

**Cause, read from the tree:** `ProfileSwitcher.svelte:138-141` declares a
`selectAll` action that calls `node.focus()` and then `node.select()` on the
profile-name input. On a phone, focusing a text input opens the software
keyboard, so arriving at the marked score summons it unasked. Transcription has
no equivalent call, which is why it behaves.

**Fix:** the pane must not take focus on arrival on a touch device. Geometry and
behaviour answer to modality in this project, so gate the focus on
`(pointer: fine)` or its scripted equivalent rather than on viewport width.

Keep the desktop behaviour: focused and pre-selected, so typing over the
prefilled name still works with no extra click.

**Do not** solve it by removing the prefilled name, and do not add `autofocus`
anywhere: `svelte-check` raises `a11y_autofocus` and the web-check gate moves.

Say in your memo how you detected the pointer and what happens on a device that
reports both.

## 2. The courtesy prompt on the marked score is dressed differently

**Ruled by Dann, 2026-08-19 on the walk:** both documents' empty states are
centred and italic.

- Transcription's, `paper.empty.mobile` on the sheet, is centred serif italic.
- The marked score's, `.profile-empty` at `VoiceProfilePane.svelte:938`, is
  serif regular at 1.05 rem, left-aligned by `.profile-content`'s
  `align-items: flex-start` at `:905-909`.

**Fix:** the marked score's empty state takes the transcription's treatment:
centred, italic, and the same size and leading. Match the transcription's, do
not invent a third set of values, and say which declaration you copied.

**Scope this to the empty state only.** `.profile-line`, the calibration plea's
sentences, stays left-justified with one sentence per line: that is Dann's
ruling of 2026-07-13 and this brief does not touch it.

## 3. What you do not build

- No other copy changes, no new strings, no French that is not ratified.
- No changes to the fit, the gutter, the aid, print, or the desktop layout.
- Do not run `git`. Dann ships.

## 4. Definition of done

Dann's walk, iPhone, portrait:

1. Reaching the marked score opens no keyboard.
2. Tapping the profile-name field still opens it, and the name is selected so
   typing replaces it.
3. On the desktop the field is still focused and selected on arrival.
4. Both documents' empty states read centred and italic, at the same size.

Run all five gates. Baselines: phonology 216, dictionary 235, web-check 0 errors
and 7 warnings in 4 files, web-test 682, score-parser 444 passed and 5 skipped.

Ship with `sh ~/Downloads/ilya-ship.sh "N.73 portrait C3: the courtesy prompt,
and no keyboard on arrival"`.

## 5. The memo

`docs/sessions/n73-portrait-c3_r1_2026-08-19.md`, same commit. Short.
