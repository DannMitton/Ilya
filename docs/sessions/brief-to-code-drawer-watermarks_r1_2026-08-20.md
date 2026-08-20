# Brief to Code: the intake watermarks

**Serves N.65. Written 2026-08-20 afternoon on Dann's ruling. This is the pass
AFTER the walk repairs (the reorder, the rule inset, the cramped row, the
placeholder measurement, and the last double line), which Dann issued
separately. Ship two, `brief-to-code-drawer-stations_r1_2026-08-20.md` §4, is
still NOT started.**

Read `docs/memory/CONTRACT.md` in full first.

---

## 1. What Dann asked for

A large centred word inside each of the two intake fields, **in addition to the
existing placeholder text, which stays exactly as it is.**

| field | English | French | colour |
|---|---|---|---|
| the textarea, `.text-input` | `text` | `texte` | `--light-sage` `#A8B5A0` |
| the score drop zone, `ScoreUploader` | `score` | `partition` | `--light-lavender` `#C4BACF` |

**`partition` is Dann's word. `texte` is the coordinating desk's proposal and he
has seen it. Do not ship any other French.** Key both like every other string.

**The colours are Dann's correction to himself.** He first asked for light sage
in both, the desk raised that it would put a sage mark inside a lavender-bordered
box against his own rule that hue names place, and he ruled: "Light lavender for
partition and score, my mistake." **Sage names the text intake, lavender names
the score intake, inside the field as well as at its edge.**

---

## 2. What is specified

- **Centred on both axes** inside its field.
- **`--font-sans`**, large. See §4.
- **Visible only while the field is empty.** Dann confirmed this in his own
  words: it never sits under a pasted poem or a loaded score.
- **Behind the placeholder and behind the drop zone's own text.** It must not
  cost either any legibility.
- **`aria-hidden`.** The placeholder already carries the instruction. The
  watermark repeats it decoratively and would only add noise to a screen reader.
- **Not selectable**, so a singer dragging to select a pasted poem never catches
  it.

---

## 3. One size, and the constraint is `partition`

**One size serves both fields in both languages.** The binding case is
`partition`, nine characters, in the narrower of the two boxes, at the smallest
viewport the project supports, **360 x 640**.

Size it so `partition` fits there without wrapping or clipping, then use that
size everywhere.

**The English words will sit smaller in their boxes than the French does. That
is the cost of Dann's "all watermarks are consistent" and he has accepted it.**

**Report the chosen size and the measured width of `partition` at 360 px.**

---

## 4. The typeface, and what Dann said about it

He asked for the watermark to match "the large sans-serif font we use in our
colour-blocked Learn and Guide meta headers."

**Those headers do not exist yet.** They are drawn in
`docs/sessions/fable-gui-mockup_r2_2026-08-18.html`, Exhibit 2, and Fable's own
caveat there says the typefaces are stand-ins.

**Dann's instruction, verbatim: "the mockup can inspire our choice. Let's see it
first and adapt if it needs tweaking."** So: take the cue from the mockup's
oversized sans, build it with the project's own `--font-sans`, and expect to
adjust after he looks at it.

**Record in the memo that this watermark now DEFINES the convention rather than
inheriting it, and that the chapter bands must match it when they are built.**

---

## 5. What is likely to go wrong, stated before you build it

**The drop zone already holds three lines of centred text**: "Drop a score
here", "or click to browse", and the accepted-formats line. They occupy the
middle of the box, which is exactly where the watermark goes.

**The coordinating desk expects a collision.** Report what it actually looks
like, with a measurement, and leave it. **Do not move the existing text to make
room unless Dann tells you to.** It is his to rule on the walk.

Second likeliest: the textarea is a real `<textarea>`, so a centred overlay
needs a wrapper that does not interfere with typing, resizing, or the OCR icon
already sitting in its top-right corner. **If the wrapper changes the field's
resize behaviour or the icon's position, say so rather than accepting it.**

---

## 6. Done when

Dann walks these on a deploy.

1. `text` sits centred in the textarea in light sage, and `score` sits centred
   in the drop zone in light lavender.
2. Both vanish the instant anything is typed or dropped, and return when the
   field is emptied.
3. The placeholder text and the drop zone's own lines are still readable.
4. In French they read `texte` and `partition`.
5. `partition` neither wraps nor clips at 360 x 640, and both fields use the
   same size.
6. Dragging to select pasted text does not catch the watermark.
7. All five gates at baseline: 216, 235, 0 errors and 7 warnings in 4 files,
   682, 444 passed and 5 skipped. **Ask Dann before moving any count.**

---

## 7. The memo

Append to `docs/sessions/drawer-stations-ship1_r1_2026-08-20.md`: what shipped
with `path:line`; the chosen size and the measured `partition` width at 360 px;
what the drop zone collision actually looks like; the gate counts; every
decision this brief did not rule, stated as a decision; and **NOT ESTABLISHED**,
with what would settle each. **NOT ESTABLISHED BEATS A COMPLETE INVENTED
ANSWER.**

---
*Written by the coordinating desk, 2026-08-20 afternoon. The colour split in §1
is Dann correcting his own first instruction after the desk raised it against
his hue rule; it is recorded as his ruling, not as the desk's.*
