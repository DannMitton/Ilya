# Brief for Code: Enter, or leaving the field, settles a one-line field (r1, 2026-10-09)

Written by the desk (Opus) 2026-10-09 about 13:15. For Code, Sonnet. QUEUE row 62.

## What the singer does, sees, and feels

Dann, 2026-10-09 13:10, in his voice characteristics: he typed « Seriöserbaß » into the field beside "Other", pressed Enter, and nothing happened. *"Hard returns are unspoken grammar for the user... The user wants to be confident that their input has been registered."* The text had been saved on every keystroke (`apps/web/src/lib/voice/VoiceTypeIntake.svelte:106-112`, `oninput` → `setOther`), and nothing said so.

**Ruled by Dann 13:11, design 1 of three the desk offered:** pressing Enter, or leaving the field (blur), settles it. The caret leaves the field, and a small "Saved" appears beside it for about two seconds, announced to screen readers (`aria-live="polite"`). Who offered it: the desk. Who ruled it in: Dann.

## The work

1. **Inventory first.** List every single-line text field in `apps/web/src/` that saves as the singer types (no Save button), with file and line. Report the list before changing anything beyond the first field.
2. **Build it once:** a small shared piece (an action or component) that, on Enter or blur, blurs the field when Enter was pressed, and shows the "Saved" note for about two seconds. It does not show when the field's value did not change since it last showed. Enter never submits a form or moves the page.
3. **Apply it** to the Other field first, then to every field on the list whose save-as-you-type behaviour is the same. A field that does not save as you type is left alone and named in the report.
4. **Strings:** `field.saved`: English "Saved"; French « Enregistré » (PROPOSED by the desk 13:11, masculine for an implied « ce qui est »; Dann rules it at the walk; mark it PROPOSED in a comment). Quiet type, the field's own label colour; no colour that means error or success elsewhere in Ilya.
5. **Tests** for the shared piece: Enter blurs and shows; blur shows; unchanged value does not show; the note disappears; the live region carries the word.

## Constraints

No git command that writes. Gates at baseline; say gate 4's new count. Nothing on the printed page changes (`CONTRACT.md` §6: no control prints). DONE is Dann's walk.

## Report

`docs/sessions/report-code-enter-settles-a-field_r1_2026-10-09.md`: the inventory, what changed where, the tests, gate counts, and **Could not establish**. NOT ESTABLISHED beats a complete invented answer.
