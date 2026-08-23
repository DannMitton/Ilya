# MEMO. N.81: the takeover's rule goes lavender

Built against `848059e`, branch `Shane`, working tree clean at the open. One
declaration changed and one comment added, in one file. Nothing committed.

**Exactly one match, asserted before the edit.** `.takeover-head` appears four
times in `Drawer.svelte`: once as a class on the markup (`:618`), twice inside
comments (`:795`, `:836`), and once as a CSS block opener (`:882`). A count of
block openers, `^\s*\.takeover-head\s*{`, returned 1. The edit was applied by
matching the whole eight-line block, and the script asserted a count of exactly 1
before writing.

That assertion was load-bearing. The string `border-bottom: 2px solid
var(--sage);` occurs **twice** in this file, at `:839` and at `:888`. `:839` is
`.drawer-anchor-top`, which is sage by ruling and is not mine to touch. A
find-and-replace on the declaration alone would have changed both.

## The diff

```diff
diff --git a/apps/web/src/lib/components/Drawer/Drawer.svelte b/apps/web/src/lib/components/Drawer/Drawer.svelte
index 207c9a1..3ac50c3 100644
--- a/apps/web/src/lib/components/Drawer/Drawer.svelte
+++ b/apps/web/src/lib/components/Drawer/Drawer.svelte
@@ -885,7 +885,11 @@
 		   is inset like every other. See `.drawer-anchor-top`. */
 		padding: 6px 0;
 		margin: 0 1rem;
-		border-bottom: 2px solid var(--sage);
+		/* Dann ruled 2026-08-23: the takeover's rule matches the lavender
+		   `.wizard-phase` border-top in CalibrationWizard.svelte, because the
+		   takeover is the calibration ritual, and lavender is kept to that and
+		   the voice anchor (S0 slate, ruling 3). */
+		border-bottom: 2px solid var(--deeper-lavender);
 	}
 
 	/* The ONE back affordance, E.27. Quiet by construction: this is the way
```

One file, 5 insertions, 1 deletion. No other rule, token, or file was touched.

## What I checked before writing, so the comment is not an invention

- **The token exists.** `app.css:120`, `--deeper-lavender: #8E7E9B;   /* captured
  outline */`.
- **The rule the comment says it matches exists.** `CalibrationWizard.svelte:1713`,
  `border-top: 2px solid var(--deeper-lavender);`, inside the second
  `.wizard-phase` block at `:1712`. The file contains no `@media` at all, so the
  rule is unconditional and there is no viewport at which the two disagree.
- **Ruling 3 says what the comment says it says**, as far as this repository can
  show. `docs/sessions/n73-s3-ship1_r1_2026-08-20.md:452`: "The S0 slate's ruling
  3 keeps lavender in Studio to the voice anchor and the calibration surfaces."
  `docs/sessions/brief-to-code-n73-s3_r1_2026-08-20.md:56`: "Lavender's only
  carriers in Studio are the voice anchor and the calibration surfaces". The
  ruling document itself is not in this tree; see NOT ESTABLISHED.
- **Lavender's second carrier is already in this same file.**
  `Drawer.svelte:866`, `.drawer-anchor-bottom`, the voice anchor, carries
  `border-top: 2px solid var(--deeper-lavender)` under the 2026-08-20 ruling
  recorded at `:852-865`. So the takeover head now joins a set that already
  existed here rather than importing a hue this file did not have.
- **After the edit, `--sage` survives twice in the file and only once as a live
  declaration**: `:839` in `.drawer-anchor-top`, plus one mention inside a comment
  at `:755` recording a rule that was sage before 2026-08-20. Both untouched.
- **Nothing else names this rule.** A grep for `takeover-head` across
  `apps/web/src`, `apps/web/e2e`, and `tests` returns `Drawer.svelte` and nothing
  else. No test, snapshot, or sibling component asserts its colour.

## One thing I found and did not fix, because you said not to

`Drawer.svelte:836`, inside `.drawer-anchor-top`'s comment, reads "Twinned on
`.drawer-anchor-bottom` and `.takeover-head`." That sentence is about the **1rem
inset**, which all three still share, so it is not false. But it now sits three
lines above a sage declaration whose two named twins are both lavender, and a
reader coming to it cold could take "twinned" to include the token.

I left it. Fixing it means editing another rule's comment, which the instruction
forbids. It is a one-sentence change if you want it.

## The five gates

Run on this machine on 2026-08-23, after the edit.

| gate | baseline | this build | verdict |
|---|---|---|---|
| phonology | 216 | 216 passed (216) | at baseline |
| dictionary | 235 | 235 passed (235) | at baseline |
| web-check | 0 errors, 7 warnings, 4 files | found 0 errors and 7 warnings in 4 files | at baseline |
| web-test | 724 | 724 passed (724) | at baseline |
| score-parser | 444 passed, 5 skipped | 444 passed \| 5 skipped (449) | at baseline |

**All five at baseline. No baseline moves and nothing for you to `sed`.** The
gate 4 baseline of 724 was read from `~/Downloads/ilya-ship.sh:79` and from
`ENVIRONMENT.md`'s gate table, which agree.

The working tree now holds this file, the changed `Drawer.svelte`, and nothing
else. Nothing was committed.

## NOT ESTABLISHED

- **What the rule looks like on screen. No live render was observed for this
  build.** The change is verified at source level only: the token exists, resolves
  to `#8E7E9B`, and the declaration that reads it is the one and only
  `.takeover-head` rule. `AGENTS.md` says to measure the live render and never
  infer visual values from source CSS, and I did not measure it. Starting a dev
  server here needs a `.claude/launch.json`, and you said not to touch any other
  file. If you want the pixels confirmed before you walk it, say so and it is a
  few minutes.
- **The S0 slate ruling document itself.** `fable-ruling-s0-slate-closed_2026
  -08-19.md` is not in this repository, and neither is
  `claude/ruling-lavender-marks-the-marked-score_2026-08-19.md`, which
  `Drawer.svelte:857` cites for the same principle. I verified ruling 3 through
  two documents that quote it, both listed above. **I did not read the ruling.**
  The comment I wrote says "S0 slate, ruling 3" on that second-hand basis.
- **Whether `.wizard-phase` at `:1712` is the rule you meant.** There are two
  `.wizard-phase` blocks in `CalibrationWizard.svelte`, at `:1626` and `:1712`.
  Only `:1712` carries a border, so only one can be the match, but I am naming
  the one that fits the description rather than one you pointed at by line.
- **Whether the two rules will look identical.** Both are `2px solid
  var(--deeper-lavender)`, so the ink is the same. They sit on different surfaces
  with different backgrounds, and I did not compare them side by side.
- **Whether anything outside `apps/web/src` styles this element.** I grepped
  `apps/web/src`, `apps/web/e2e`, and `tests`. I did not sweep `packages/` or
  `static/`.
- **The date.** This session's environment reports today as 2026-08-22. Your
  ruling, the comment I wrote, and this memo's filename all say 2026-08-23, which
  matches the day's other documents in `docs/sessions/` and your own dating of
  the ruling. I followed your date rather than the environment's, and I cannot
  tell you which is right.
