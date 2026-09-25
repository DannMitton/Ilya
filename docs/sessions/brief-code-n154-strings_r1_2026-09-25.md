# Brief for Code, r1: N.154's four string fixes

Written by the desk 2026-09-25, 13:55. **Go-ahead from Dann 13:53.** Evidence: `docs/sessions/memo-sonnet-n154-audit_r1_2026-09-25.md`, "Live stale strings". Line numbers read at `ed2dde1`. Strings only; no logic changes.

## 1. `calib.welcome.lede` (`i18n.ts:1056`)

Replace the actor "Fit", a surface that no longer exists, with "Ilya". Change nothing else in either language.
- EN: "Ilya will measure your voice to build a formant profile, …" (rest unchanged)
- FR: « Ilya mesurera votre voix afin de constituer un profil de formants, … » (rest unchanged)

## 2. `calib.welcome.fryAnswer` (`i18n.ts:1058`)

- EN: "… Ilya reads its resonances rather than your sung pitch, …"
- FR: « … Ilya en lit les résonances plutôt que la hauteur de votre chant, … »

## 3. `a11y.paper` (`i18n.ts:145`)

- EN "Transcription" becomes "Text"; FR « Transcription » becomes « Texte », matching `tab.transcription` (`:105`). Update the comment at `:138` if it no longer holds.

## 4. Remove "Nothing on this page is hand-written." Ruled by Dann 2026-09-25 12:44: "Get rid of it."

From both `insights.method.typed` and `insights.method.untyped` (`i18n.ts:1517-1518`): delete the English sentence and the French « Rien sur cette page n'est écrit à la main. », with the space before each. Then grep the tree, including the Guide, for any other rendering of the sentence and report it; remove only those in `i18n.ts`.

## Not in scope

- `GuideContent.svelte`'s hand-written "Fit's analysis model…" (the audit's out-of-scope note): report its lines, do not change it.
- « facile à tenir » in item 2 stays; the "sustained" ruling's French is for a note, not a register.
- The 62 dead keys: untouched.

## Done when

- All five gates at baseline.
- A grep of `i18n.ts` for `Fit ` in a value, for `hand-written`, and for `écrit à la main` returns nothing.
- On the alias, in French and English: the calibration welcome page names Ilya; the Insights method line ends without the sentence. **State your expectation before you measure**, per CONTRACT §5, THE CONTROL RULE.
- A memo of ten lines or fewer in `docs/sessions/`: the diff, what was walked, and a section titled "NOT ESTABLISHED". **NOT ESTABLISHED beats a complete invented answer.**
