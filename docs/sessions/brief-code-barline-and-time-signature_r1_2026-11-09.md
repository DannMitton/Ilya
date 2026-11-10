# Brief: the barline and time signature corrections (QUEUE row 138, and the time signature control) (Code, cloud lane, r1, 2026-11-09)

Written by the desk (Opus) 2026-11-09 21:5x. For Fable's review with the word-marks brief and the aria brief r2, then Code. Built on Fable's barline review (`docs/sessions/review-fable-barline-correction_r1_2026-11-10.md`, PROCEED WITH CHANGES; read it in full: its findings 1 to 11, its table of every site keyed by bar, and its build plan are part of this brief) and two surveys of established notation software (`docs/sessions/survey-barline-handling_r1_2026-11-09.md`, `survey-metre-change_r1_2026-11-09.md`; Finale is the primary model, at Dann's request). NOT ESTABLISHED beats a complete invented answer.

## 1. What the singer gets

The scan reader can misread a time signature (the Gretchaninov reading states 4/8 over bars that hold three quarters), miss a barline, or invent one. She can fix each, in the moment, in the order she chooses:

1. **Barline.** In the Loupe's CORRECTIONS pane, beside Rest and Tie: "Add a barline after this note", or, where one follows, "Remove the barline after this note".
2. **Time signature.** In the same pane, and by tapping the time signature on the score (as the clef works today): change it from this bar to the next time signature change, or to the end of the song, keeping the barlines or rebarring the notes.
3. **The offer.** On a bar that holds an exact number of bars of its time signature: "This bar holds %k bars of %m." with a button, "Divide it by the time signature".

Every fix shows at once, is undoable, and is saved with the song. After any fix, the bars that still do not add up are marked as they are today.

## 2. The rulings (Dann, 2026-11-09)

- 21:17: the barline correction ships with the share. 21:35: a time signature control ships with it.
- 21:30: a note that crosses a new barline is tied across it (Sibelius and Dorico do the same), in every path.
- 21:31 (deferring to the desk): the arithmetic division is a one-tap offer, never automatic. Opening bar counted backward from its last note (the remainder becomes the pickup, Dann's idea, 21:29); closing bar counted forward (the remainder becomes a short final bar); a bar between them only when it holds an exact number of full bars; offered only when the excess is at least one full bar; and the time signature is "kept by its neighbours" (Fable finding 1: at least two other bars under the same signature add up exactly, and they outnumber the bars that would be divided).
- 21:38: a time signature change applies from that bar until the next change (Finale's "to next time change"); Finale is the primary model; fixes take effect in the moment, in her order.
- 21:44 and 21:47: the default follows the evidence, not the rule, and the controls fix either case: "This isn't an either/or, it's a when." So the time signature change offers both: keep the barlines (default, because on 37 stored readings the reader fused no bar and its misreads were signatures and durations) or rebar the notes (Finale's "Rebar Music").
- Ratified English (21:35, 21:44): `loupe.barline` "Barline"; `correct.barlineAdd` "Add a barline after this note"; `correct.barlineRemove` "Remove the barline after this note"; `loupe.divideOffer` "This bar holds %k bars of %m."; `loupe.divide` "Divide it by the time signature". French: Dann's, pending.

## 3. The design

### Storage: a layer over the reading, never a change to the kept MusicXML

Fable findings 4 and 5: a reading-time change renames every later event id (`musicxml-parser.ts:732-734`) and orphans every stored correction; the layer changes no kept byte and needs no stamp bump. So:

- `NoteCorrection` gains `barline?: 'before' | 'none'` (Fable finding 6), on the entry that opens the new bar; it joins the prune list (`correction.ts:317-328`, finding 7).
- The time signature change is a correction on the bar's first entry: `timeSignature?: { beats: number; beatType: number; through: 'next' | 'end' }` (coined; Code confirms where it is stored against `correction.ts` and `library/types.ts:107-115`).
- **Rebar the notes** is not a stored mode. At the moment she chooses it, Ilya computes the barline and tie marks it implies and writes them as ordinary `barline` and tie corrections in one Undo step. Revert of the change removes them together. So every path ends in the same few stored fields.
- `rebar(score, line, map)` (Fable finding 8) applies the layer after `applyCorrections`: time signatures first, then barlines, then the rebuilt measures, onsets, change lists, and the two-way map between reading bars and song bars.

### Rebar the notes (on the Finale model)

From the bar she chose, walk the notes forward and fill bars of the new time signature, tying any note that crosses a boundary (21:30). Stop, as Finale's Rebar Options stop, at the end of the scope ("to the next time signature change" or "to the end of the song"), at a key or clef change, and at a repeat or special barline (`types.ts:286-288`). The last bar before the stop may be short; Ilya adds no rests (it invents nothing) and the bar is marked as not adding up. Dorico's pitfall (survey): a rebar overwrites manual barlines. Ilya's rebar replaces only barlines inside its scope, and Undo restores them.

### Keep the barlines

The default. The new time signature applies to the existing bars; bars that now add up lose their flag; bars that do not keep it; any bar that now holds an exact multiple shows the offer.

### Every site keyed by bar

As Fable's table (review §4): each row's verdict holds and its CHANGE rows are steps here. Bar answers degrade safely (re-keyed after the share).

## 4. Build plan

Lane: the desk names it in the prompt. One commit and one report per step, at `docs/sessions/report-code-barline-ts-step<n>_r1_2026-11-10.md`. Fable's steps B0 to B5 and A1 to A2 stand, with these additions:

| step | work | done when |
|---|---|---|
| B0 | Fable's fixtures, plus a fixture whose stated time signature is wrong (the Gretchaninov reading's shape: 4/8 over 3/4 bars) | fixtures in `omr/fixtures/` |
| B1 | `rebar.ts` as Fable's B1, plus the `timeSignature` field and its application before barlines | Fable's tests, plus: a time signature change re-flags bars; "to next" stops at the next change; "to end" overrides later ones; Undo restores |
| B2 | Fable's B2 (wiring and every CHANGE row) | as Fable's B2 |
| B3 | The Barline verb (Fable's B3) | as Fable's B3 |
| T1 | The time signature card: beats and beat type (common values listed, any value typed), the two scopes, and "Rebar the notes" (off by default); in the CORRECTIONS pane on the held bar, and on a tap of the time signature on the score, on the `ClefControls.svelte` pattern (fixed overlay buttons, 44 px on a coarse pointer, a menu on a fine pointer, a sheet on a coarse one) | Playwright: on the Gretchaninov-shape fixture, change 4/8 to 3/4 keeping the barlines and every bar adds up; on a fused fixture, rebar and the bars come right with ties; Undo restores each |
| B4 | Persistence (Fable's B4), for both fields | save, reload, binder out and in |
| B5 | Fable's B5 (the head caret) | as Fable's B5 |
| A1, A2 | The offer, with the 21:31 counting rules and condition 5 | Fable's tests plus: an opening bar counts backward to a pickup; a closing bar counts forward; an interior inexact bar gets no offer; a straddling note is tied |

**Cut order:** A2 and A1, then the on-score tap of T1 (the pane entry stays), then B5. B1 to B4 and the pane's time signature card are never cut.

## 5. Strings still needed (EN drafts for Dann, then French)

| key (coined) | EN draft | note |
|---|---|---|
| `loupe.timeSignature` | Time signature | button face; the object's name in every app surveyed |
| `correct.tsChange` | Change the time signature from this bar | "change" is Finale's verb |
| `correct.tsToNext` | To the next time signature change | Finale's "to next time change" |
| `correct.tsToEnd` | To the end of the song | Finale's "through end of piece" |
| `correct.tsRebar` | Rebar the notes | Finale's "Rebar Music"; off by default |
| `correct.tsRebarHelp` | Moves notes across barlines to fill bars of the new time signature, tying any note that crosses one. | one line under the checkbox |

## 6. What Code could not establish

Every report carries a section of this name.
