# Brief for Code: four small fixes, in the same uncommitted slice, before Dann ships

Written by the desk 2026-09-30 11:05. Draft r1. Land these in the working tree you already have (voice type slice A and the 2026-09-28 intake brief, both uncommitted), then report. No git writes.

## 1. Insights comment strings: French, and "try" retired

`apps/web/src/lib/i18n.ts:1644-1646` carry English in the `fr` field, and "try" was retired 2026-09-29 (Dayme, pp. 21 to 22; `docs/memory/OPEN.md` §N.168). A French singer sees English on every Insights comment (`InsightsPane.svelte:518`, `insights/comment-text.ts:340`). **Ratified by Dann 2026-09-30 11:02**, English and French, exactly:

| key | en | fr |
|---|---|---|
| `comment.tap` | More to explore, and why | D'autres pistes à explorer, et pourquoi |
| `comment.count.one` | 1 more thing to explore | 1 autre piste à explorer |
| `comment.count.many` | {n} more things to explore | {n} autres pistes à explorer |

Use the typographic apostrophe (U+2019) in « D'autres », as the rest of `i18n.ts` does. Then grep the whole of `apps/web/src` for any other singer-facing "try" in an Insights or Markup comment string and report each hit with `path:line`; change none of them without the desk.

## 2. A doubled narrow no-break space

`i18n.ts:1547`, `:1563`, `:1564`: each French string carries `  ` before « ; ». Make each a single ` `. Grep `i18n.ts` for any other `  ` and fix those the same way; report the count.

## 3. Voice type: Other under "Not sure"

Today "Not sure" hides the More specific group, so a singer who is not sure of a broad type but has a label of their own cannot print it (your slice A report, "For Dann", item 2). **DESK DEFAULT, 2026-09-30 10:46:** under "Not sure", show only **Other (type your own)** and its text field, no finer labels. If Other has text, it prints after the name as any label does. Routing stays `union`. Add a test to `identity.test.ts` and `voiceTypes.test.ts`.

## 4. The Keep my reading strings are ratified

`i18n.ts:1089-1093`: the comment says the French is "NOT RATIFIED". **Ratified by Dann 2026-09-30 10:48**, exactly as in the tree: « Garder ma lecture », « Hors de la plage habituelle ». Rewrite the comment to say so, with the date.

## Prove it

- Gates as before, with counts; gate 4 moves by the tests you add. Ratchets OK, no ceiling raised.
- In the browser, French: an Insights comment shows « D'autres pistes à explorer, et pourquoi »; a phonation string shows one narrow space before « ; »; Voice type "Not sure" offers Other, and a typed label prints.

## Report

Append to `docs/sessions/report-code-voice-type-slice-a_r1_2026-09-30.md` as a second addendum, with **What I could not establish**. NOT ESTABLISHED beats a complete invented answer.
