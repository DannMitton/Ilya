# Brief: build the loupe's ruled French

Revision 1, 2026-09-16. Written at the desk. Build in Claude Code, AFTER N.142.

**Source:** `docs/sessions/spec-loupe-french_r1_2026-09-14.md`. **Read it in
full.** Every string in it is Dann's ruling, dated. Nothing here is new French.

---

## The goal

A singer using Ilya in French sees English in the loupe today: the undo and redo
line, the melisma control, and the beat position. After this build, every loupe
string is French in French mode.

---

## STEP 1. Replace the English in these French slots, `apps/web/src/lib/i18n.ts`

| key | fr, RULED |
|---|---|
| `loupe.redo` | `Refaire : %s` |
| `loupe.undo.placed` | `syllabe placée` |
| `loupe.undo.melisma` | `mélisme défini` |
| `loupe.undo.melismaOff` | `mélisme effacé` |
| `loupe.melisma` | `Mélisme` |
| `loupe.lyric.melisma` | `Cette note prolonge la syllabe` |
| `calib.common.retake` | `Réessayer` |
| `loupe.beat` | `temps %b` |
| `loupe.beatPulse` | `temps %b, division %p` |

Copy the characters from the spec, not from this table, and keep the hard space
as the escape ` `, matching `loupe.undo`. Update the "FRENCH OWED" comments
beside each key to say it was ruled, with the date.

---

## STEP 2. The undo line for Start placement over

Ruled 2026-09-16: `loupe.undo.startOver`, en `placement started over`, fr
`placement recommencé`. The key name is a DESK DEFAULT.

**First establish whether pressing Start placement over
(`handleStartPlacementOver`, `+page.svelte`) can be undone today, and what the
Undo pill reads right after it.** Read the undo stack in
`apps/web/src/lib/components/Drawer/bandState.ts` (the verb is built near
`:173-192`).

- If it is undoable and the pill shows a wrong or missing clause, add the key
  and wire it.
- **If it is not undoable, add the key only, do not make it undoable, and report
  it.** Making it undoable is a design change that is not in this brief.

---

## Tests

Add or extend a test so every key in the step 1 table has a French value that
differs from its English, apart from any key the spec lists as identical on
purpose (`loupe.pitch.octave`, `loupe.station.corrections`).

---

## Definition of done

1. The nine French slots carry the ruled strings.
2. Step 2 is wired, or its key is added and the reason it is not wired is in the
   memo.
3. All five gates green. Baselines: read `docs/memory/ENVIRONMENT.md` §`Gate
   baselines` at the time you start, since N.142 may have moved them.
4. Walked by Dann in French mode. **WRITTEN is not DONE.**

---

## What to return

A memo at `docs/sessions/memo-loupe-french-build_r1_<date>.md`: what changed by
file and line, the step 2 finding, the gate results with any baseline movement,
**a section listing what you could not establish** (NOT ESTABLISHED beats a
complete invented answer), and any decision this brief did not settle.

**No git command that writes: no `add`, `commit`, `push`, `checkout`, `reset`,
`restore`, `clean`, `stash`, `rm`, `mv`, `merge`, `rebase`, or `tag`.** If you
create a new file, name it in the memo so Dann can `git add` it before he ships.
