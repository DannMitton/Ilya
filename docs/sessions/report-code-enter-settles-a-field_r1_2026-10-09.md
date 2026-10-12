# Report: Enter, or leaving the field, settles a one-line field (QUEUE row 62, r1)

**QUEUE row 62, state: WRITTEN, pushed to `cloud-lane`. In the four one-line fields that save as the singer types, pressing Enter or leaving the field now settles it: the caret leaves, and a quiet "Saved" / « Enregistré » stands by it for two seconds, announced to screen readers. `DONE` is Dann's walk.** The desk carries this line into `QUEUE.md`; this session does not edit `docs/memory/`.

Written by Code (cloud lane) 2026-10-12, for `docs/sessions/brief-code-enter-settles-a-field_r1_2026-10-09.md` with its amendments of 2026-10-11 19:30, on `cloud-lane` after row 75 (`6abadb55`), clean tree before the first edit.

The brief's "No git command that writes" is superseded by the desk's instruction for this session (commit and push to `cloud-lane`). The amendments replace step 4: `field.saved` is RATIFIED, and its comment says so.

## The inventory

Every `<input>` in `apps/web/src/` that is not a radio, checkbox, file, range, hidden, or number input:

| Field | Where | Saves as the singer types? | This row |
|---|---|---|---|
| Voice type "Other" | `lib/voice/VoiceTypeIntake.svelte:106` | Yes (`oninput` → `setOther`) | **Settled** |
| Markup metadata, title | `lib/components/Drawer/MetadataFields.svelte:92` | Yes (`oninput` → `handleMetaField`) | **Settled** |
| Markup metadata, opus | `lib/components/Drawer/MetadataFields.svelte:103` | Yes | **Settled** |
| The inspector's gloss | `lib/components/Drawer/InspectorPanel.svelte:1038` | Yes (`oninput` → `handleGlossInput` → `onglossoverride`) | **Settled** |
| Composer and poet search | `lib/components/Drawer/SearchableSelect.svelte:207` | No. It filters a list; choosing an entry saves | Left alone |
| A song's new name | `lib/components/Drawer/SongList.svelte:135` | No. A draft that Enter commits (`onRenameKey`) | Left alone |
| A voice's name (first and rename) | `lib/voice/ProfileSwitcher.svelte:240`, `:324` | No. A draft that Enter submits | Left alone |

No other single-line text field was found. Textareas are not single-line and were not considered.

## What changed

- **`apps/web/src/lib/components/Field/settle-field.ts` (new).** Two pieces:
  - `settle`, a Svelte action. On Enter (not while composing) it prevents the key's default and blurs the field. On blur it calls `onsettle`, but only when the value differs from the last one settled, or from the one the field opened with. Enter never submits or moves the page.
  - `savedFlag`, the note's two seconds (`SAVED_MS = 2000`). A second settle restarts the count.
- **`apps/web/src/lib/components/Field/SavedNote.svelte` (new).** The note:
  - an always-present `<span aria-live="polite">`, whose words appear and go, so a screen reader hears them;
  - quiet type at 0.8 em, inheriting the field's label colour at 75% opacity, with no colour that means error or success;
  - `display: none` in print, since no control prints (`CONTRACT.md` §6).
- **`apps/web/src/lib/i18n.ts`, key `field.saved`:** "Saved" / « Enregistré », RATIFIED by Dann 2026-10-11 05:11, as its comment says.
- **The four fields:**
  - each gains `use:settle={{ onsettle: … }}` and a `SavedNote` after it (`VoiceTypeIntake.svelte`, `MetadataFields.svelte`);
  - in the inspector the note stands inside the capacity line under the gloss field;
  - `InspectorPanel.svelte` stays at 2432 lines, its ceiling, because its additions share existing lines.

## Tests (`apps/web/src/lib/components/Field/settle-field.test.ts`, new, 7)

The field is a stand-in built on Node's `EventTarget`, since the unit suite has no DOM.

1. Enter blurs the field, is not passed on, and settles a changed value.
2. Leaving the field settles it too.
3. An unchanged value does not show: neither the opening value nor the last settled one, by blur or by Enter.
4. Other keys, and Enter while composing, do nothing.
5. `destroy` removes both listeners.
6. The note shows, disappears after 2,000 ms, and a second show restarts the count (fake timers).
7. The live region carries the word in both languages: "Saved", « Enregistré », and `aria-live="polite"`.

## Seen rendered

In voice setup on the live page (desktop):

1. "Other" was chosen and "Seriöserbaß" typed, then Enter pressed.
2. The field lost focus, and "Saved" appeared at once.
3. 2.3 seconds later the note was empty.
4. French: the same, with « Enregistré ».

Pictures: `docs/sessions/settle-field-shots/saved-en.png`, `saved-fr.png`.

**Placement.** The note stands directly under the Other field, not to its right, because the field fills its line. The brief says "beside". Putting it on the same line would mean narrowing the field. That is left for the walk.

## The eight gates

All pass.

1. `pnpm test:phonology`: 251 passed (251)
2. `pnpm test:dictionary`: 242 passed (242)
3. `pnpm --filter @ilya/web check`: 0 errors and 12 warnings in 5 files
4. `pnpm --filter @ilya/web test`: 2343 → **2350** passed (+7)
5. `pnpm --filter @ilya/score-parser test`: 663 passed, 5 skipped (668)
6. `pnpm test:blurb`: 145 passed (145)
7. `pnpm test:integration`: 55 passed (55)
8. `pnpm ratchets`: OK

## Could not establish

- **A screen reader's actual announcement.** The live region is in place and its words change; no screen reader was run.
- **The metadata and gloss fields, seen.** Only the Other field was walked in the browser. The other three use the same action and note.
- **Whether "beside" should be literal.** See "Placement".
