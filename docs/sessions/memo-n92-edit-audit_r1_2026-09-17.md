# Memo: the tree against the edit-surface spec

Revision 1, 2026-09-17. A Sonnet agent's audit, run by the desk against
`spec-n92-edit-surface_r1_2026-09-17.md`, read in full by the desk and condensed
here with its own citations. Read only; nothing was built. The agent read
`correction.ts`, `correction.test.ts`, `entry.ts`, `CorrectionSurface.svelte`,
`Loupe.svelte`, `LoupeSyllables.svelte`, `pairings.ts` (to line 120),
`note-picker.ts`, `i18n.ts` and `staff-renderer.ts` by grep, and `+page.svelte`
by targeted read. It did not open `IntakePanel.svelte`, `exchange.ts` or the
storage site, and says so.

## The headline

**Insertion is built.** It is N.92 slice 3, and the singer reaches it by walking
the stepper beside the readout into a GAP, where a duration cell enters a note.
The capability Dann asked for tonight already exists; what is missing is a way
to reach it that a singer would find.

## 1. Capability table

| Capability | State | Evidence | Gap |
|---|---|---|---|
| Reach a note | BUILT | `Loupe.svelte:1310-1321`, `+page.svelte:710-712` | The chip row does not exist; selection happens on the notation. |
| Reach a gap | PARTIAL | Data `entry.ts:35`, `:52-78`; `+page.svelte:760-770`. Control: stepper only, `CorrectionSurface.svelte:492-507`, arrow keys `+page.svelte:1381-1386` | **No hit target for a gap.** Only entries carry `data-loupe-hit` (`Loupe.svelte:1162-1166`). No caret, no chips, anywhere in the snapshot. |
| Length, dot, tuplet | BUILT | `correction.ts:49-51`, `:145-151`, `:96`; `CorrectionSurface.svelte:565-593`, `:544-563` | None. Tuplets cannot cross a barline, deliberately (`entry.ts:320-326`). |
| Pitch by step, octave | BUILT | `correction.ts:164-174`; `CorrectionSurface.svelte:604-639` | None. |
| Pitch by semitone | PARTIAL | `correction.ts:189-195`, `+page.svelte:1007-1014`, keys at `:1371-1380` | **Keyboard only.** The cells were retired by Dann's ruling of 2026-08-24 (`CorrectionSurface.svelte:596-598`). A phone singer cannot nudge a semitone. |
| Accidental | BUILT | `correction.ts:213-225`; `CorrectionSurface.svelte:648-658` | None. |
| Rest | BUILT | `correction.ts:87`, `entry.ts:214-234`; `CorrectionSurface.svelte:662-668` | None. |
| **Insert** | **BUILT** | `correction.ts:66-76`, `:305-357`, `:496-526`; `entry.ts:161-198`; control `+page.svelte:1122-1137`, `:1172-1184` | Only the reach. See §2. |
| Remove | BUILT | `correction.ts:52`; `CorrectionSurface.svelte:671-677` | The syllable's return to the queue is derived rather than explicit; not traced past `+page.svelte:415-504`. NOT ESTABLISHED. |
| Tie | PARTIAL | `correction.ts:89-93`, `entry.ts:237-268`; `CorrectionSurface.svelte:681-688` | Ties forward only (`entry.ts:252-262`). "Tie to the note before" has no verb. |
| Staccato, tenuto, fermata, breath | ABSENT | No field, no cell, no string. Grepped case-insensitively across the snapshot. | Both layers. |
| The fill line | PARTIAL | `measureFill` (`entry.ts:381-431`) is built and already reaches the loupe's tag (`+page.svelte:822-825`, `Loupe.svelte:1337-1369`, `i18n.ts:516`, `:523`) | The wording is raw arithmetic, "m. 3 · 4.5 of 4", not short / adds up / over. |
| The "left over" flag on the page | ABSENT | `staff-renderer.ts` has no fill-related code | The loupe re-announces it whenever that measure is raised; the page marks nothing. |
| Tempo anywhere | ABSENT | No tempo type in `correction.ts`, `entry.ts`, `i18n.ts` | Whole capability, and it needs a record that can hang at a gap, which the map has no shape for. |
| Rit., accel., caesura | ABSENT | Nothing in the codebase expresses a span | Whole capability. |
| Print | BUILT, with a caveat | `correctedScore` (`+page.svelte:1407-1425`) is what the sheet renders; print CSS hides the chrome (`+page.svelte:5645-5668`, `CorrectionSurface.svelte:1208-1214`) | Whether the analysis layer (`data-analysis`) prints is NOT ESTABLISHED. |
| Export as an edited copy | NOT ESTABLISHED | `+page.svelte:3308-3356` writes a binder zip through `exportBinder` | `exchange.ts` was not in the snapshot; whether the zip holds a re-notated score or a backup of Ilya's own record is unknown. |
| The conditional printed line | ABSENT | No such string | `correctedCount` already exists (`+page.svelte:736`). |

## 2. How a singer inserts a note today

1. Raise the loupe on the measure.
2. Tap a note next to the gap; it becomes the selection.
3. Tap the stepper's arrow beside the readout, once or more, until the bar sits
   in the gap (`CorrectionSurface.svelte:492-507` → `entry.ts:68-78`).
4. The surface says "after X · the next duration enters here" (`i18n.ts:469`,
   `:473`) and the duration cells now show the ARMED value
   (`+page.svelte:792-793`).
5. Tap a duration, or Rest. `enterEntry` (`entry.ts:183-198`) writes one record,
   `{ entered: { after }, base, dots, type, pitch }`, with a fresh `hand:N` id
   (`entry.ts:161-169`) and the arrival pitch from `arrivalPitch`
   (`entry.ts:111-127`): the previous pitched note, or the clef's middle line.
6. `applyCorrections` splices it in after its anchor (`correction.ts:305-357`),
   `synthesize` builds the event (`:496-526`), and `reflowOnsets` re-times the
   measure (`:382-433`). **Beams and spacing follow for free**, because the
   renderer lays out from onsets and groups beams by measure and beat
   (`staff-renderer.ts:2117`).

Tests: `correction.test.ts:421-513` covers `reflowOnsets`, one insertion case at
`:454-461`, and a beam regression at `:483-513`. `entry.ts`'s own exports have no
test file in the snapshot.

## 3. Where new facts would live

`NoteCorrection` (`correction.ts:48-97`) carries pitch, base, dots, deleted,
entered, type, tied, tuplet, every field optional, and its head comment records
the rule: *"NO NEW SAVE SITE... What changed is what a record may say, not where
it lives"* (`correction.ts:54-64`).

- **Marks fit the shape** as another optional field, and `migrateCorrectionIds`
  needs no change (`correction.ts:622-636`).
- **They do not fit the renderer.** `applyCorrections` returns
  `VocalLineEvent[]`, `VocalLineEvent` may not change (`correction.ts:23-26`),
  and `staff-renderer.ts` draws only from it. **A mark would be the first fact
  in this system with no home on the event object**, so it needs a second,
  correction-aware channel into the renderer.
- **Tempo is harder.** The map is keyed by event id; a gap has none. A tempo at
  a bare gap needs a new record kind, not a new field.
- **Rit., accel. and caesura are harder still**: nothing here expresses a span.

## 4. Cost, in the audit's own units

S is an hour or less, M is an evening, L is more than one evening.

| Work | Cost |
|---|---|
| The fill line's wording: short / adds up / over | S |
| Semitone cells on the surface (data and keys exist) | S |
| A "tie to the note before" affordance | S |
| Chips and carets: a direct tap target for a gap | **L** |
| The quiet page flag for a measure left over | M |
| The first mark (builds the renderer channel) | M |
| Each further mark after the first | S |
| Tempo anywhere | **L**, and it reaches Insights, which is outside the audited files |
| Rit., accel., caesura | Cannot size: no precedent for a span |
| Print fidelity, export, the printed line | Cannot size until `exchange.ts` and the print trigger are read |

## 5. The traps, in one line each

1. `VocalLineEvent` may not change (`correction.ts:23-26`, `entry.ts:19-21`);
   marks collide with this the moment they must be drawn.
2. `canTie` checks only `line[i+1]` (`entry.ts:252-262`); there is no backward
   branch to extend.
3. Beams regroup only because `reflowOnsets` fixes onsets first
   (`staff-renderer.ts:2117`, `correction.ts:360-370`).
4. A tuplet run may not cross a barline (`entry.ts:320-326`); any span mark meets
   the same renderer assumption.
5. `amend` tests `c.type`, not the derived type (`correction.ts:461-468`), pinned
   by a named regression test.
6. The fill line's wording is a string Dann has ruled on twice
   (`entry.ts:402-422`); a third change goes past him, not around him.
7. `hand:N` ids are never reused (`entry.ts:161-169`); a new record kind must not
   share that namespace.
8. Whether the analysis layer prints is unsettled (`+page.svelte:5645-5668`, no
   `data-analysis` handling found).

## 6. What the audit could not establish

Whether Remove explicitly clears the pairing or the syllable returns by
derivation; whether `entry.ts` has tests elsewhere; whether the analysis layer is
stripped for print; what `exportBinder` writes; where `doc.corrections` is
persisted; anything about `IntakePanel.svelte`.
