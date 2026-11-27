# The four singer's marks: the strings (DANN.md D5)

2026-11-26, drafted by the desk (Opus 5). **English drafted here for Dann's ratification. French NOT DRAFTED, with
its reason below.** Serves `DANN.md` D5 and `OPEN.md`, the after-release ruling item 8 (the four marks BEFORE the
release). Until these strings are ratified the marks lane cannot be briefed.

## Why the lane exists, in one line

N.188 shipped, so MELODY now draws the markings the reader found on the page. Corrections carries no verb for a mark
(`apps/web/src/lib/score/correction-verbs.svelte.ts:258-538`), so Ilya draws a marking it will not let the singer fix.

## The four, ruled by Dann 2026-09-17

Staccato, tenuto, fermata, and breath, on his test that each changes how long the voice sounds
(`spec-n92-edit-surface_r1_2026-09-17.md:81`). Accent and marcato are out, by the same ruling.

## The convention these follow, read from the tree this session

Every Corrections verb is an imperative naming what happens to the note in hand, in a musician's terms:
`correct.delete` "Remove this note" (`i18n.ts:367`), `correct.barlineAdd` "Add a barline after this note" (`:382`),
`correct.graceMake` "Make this a grace note" (`:567`), and, for a mark that is already a toggle,
`correct.graceSlash` "Add or remove the slash on this grace note" (`:570`).

All four marks are toggles, so they take `graceSlash`'s shape.

## The English drafts

| key | English | what it does |
|---|---|---|
| `correct.markStaccato` | Add or remove the staccato on this note | shortens the sounding note, leaving the beat where it is |
| `correct.markTenuto` | Add or remove the tenuto on this note | holds the note for its full written length |
| `correct.markFermata` | Add or remove the fermata on this note | holds the note beyond its written length, by the singer's judgement |
| `correct.markBreath` | Add or remove the breath after this note | a breath taken after the note, which shortens it |

**Two choices inside the drafts, both the desk's and both Dann's to overrule.**

1. **Breath says "after this note", not "on this note"**, because the mark stands between two notes and belongs to
   neither one alone. Every other verb that acts between notes already says "after this note"
   (`correct.barlineAdd`, `:382`; `correct.barlineRemove`, `:383`).
2. **The Italian names are kept** (staccato, tenuto, fermata) rather than translated into English descriptions,
   because they are what a singer reads in her score and `CONTRACT.md` tether 22 asks that every string speak a
   musician's terms about the notation. The alternative drafted and rejected: "Make this note short",
   "Hold this note full", "Hold this note", which name the effect and lose the mark.

**A group label may also be needed.** The length verbs sit under `correct.length` "Length" (`i18n.ts:369`). If the four
marks are grouped the same way, the group takes one more string; the desk proposes `correct.marks` "Marks". **This is
a build question the desk settles once the lane is briefed**, and it is listed here only so no string is discovered
late.

## The French: NOT DRAFTED, and why

`CONTRACT.md` section 7: the desk drafts the French from the French already in the file, names the glossary source,
and flags the choices; Dann rules on it. **Neither of those two conditions is met tonight.**

1. **The file holds no French for any of the four.** Searched this session across `apps/web/src/lib/i18n.ts` for
   staccato, tenuto, fermata, point d'orgue, and respiration: the only hit is `capture.part.breathe` « Respiration »
   (`:2605`), which names the act of breathing during a take, not the printed mark.
2. **The project's ruled French source does not cover these.** Roberge, *Guide des difficultés de rédaction en
   musique* is the source behind the pitch-naming ruling of 2026-10-11. Read this session: its plan
   (`https://roberge.mus.ulaval.ca/gdrm/00-plan.htm`) has no section on articulation signs; the nearest are
   "Ornements mélodiques" and "Indications de tempo et de dynamique" under
   `https://roberge.mus.ulaval.ca/gdrm/04-notes.htm`, neither of which is these four marks.

**So the French needs a source named before a word of it is written**, and the desk does that rather than translating
from memory. By Dann's ruling of 2026-11-22 19:14 the week's French drafts ride in the walk sitting, so that is where
this one goes.

**NOT ESTABLISHED:** which source governs French articulation-mark names for this project. The desk's next step is the
OQLF's *Grand dictionnaire terminologique*, which is already the ruled authority for Ilya's French typography
(`CONTRACT.md` section 7).

## What Dann is asked for

The English above, ratified or changed. Nothing else: the French is the desk's to bring to the walk sitting with its
source named.
