# Strings owed to Dann: the KEY row and the Loupe arrows, r1

Drafted by the desk 2026-11-25. **English to ratify, French to rule** (`CONTRACT.md` §7).
The French is built from the file's existing French, not translated fresh; the source key for each
is named. Open choices are marked OPEN and are Dann's.

## Set 1: the KEY row in the INPUT receipt (transposition lane A)

**Why it exists:** ruled by Dann 2026-11-25 01:45, *"Both doors sounds good, thank you for the
option."* KEY joins TEMPO and CLEF in the INPUT receipt, because the receipt is where Ilya lists
what it read off the score and lets the singer override it (`OPEN.md`, N.94 TRANSPOSITION ON DEMAND).

**Built from:** `intake.tempo.label`, `intake.tempo.printed`, `intake.tempo.yours`
(`i18n.ts:1912-1915`), which are the row this one sits beside. The French noun for a musical key is
« tonalité » throughout the file (20 occurrences, no competing term: `insights.verdict.heading`
`:1846`, `insights.r2.unlikely.share` `:2000`, among others). Nothing is coined.

| key | English | French | note |
|---|---|---|---|
| `intake.key.label` | KEY | TONALITÉ | parallel to `intake.tempo.label`, which is TEMPO in both |
| `intake.key.printed` | printed | imprimée | **feminine**, agreeing with « tonalité » |
| `intake.key.transposed` | transposed | transposée | **feminine**, same reason |

**The agreement is the trap.** `intake.tempo.printed` is « imprimé » because *tempo* is masculine.
A copy of that row into this one would read « imprimé » and be wrong. Flagged so it is not repeated
in the brief.

**RATIFIED by Dann 2026-11-26 09:35, one word: “transposed”.** So `intake.key.transposed` is “transposed” / « transposée », and the `yours` form is not taken. The desk's reasoning he ruled on stands below. **The French of this set is still the desk's draft and is his to rule whenever he wants it; it blocks nothing, because lane A's Code brief is not written.** Was OPEN: `transposed` or `yours`. The TEMPO row's third state is
`intake.tempo.yours`, "your tempo" / « votre tempo », which names the singer rather than the
operation. The parallel here would be "your key" / « votre tonalité ». **The desk recommends
`transposed`**, because the singer did not choose a key in the abstract: she moved the printed one,
and the receipt's job is to say what Ilya is now reading. "Your key" would also read oddly beside a
key she may be trying rather than keeping. Both forms are defensible and the choice is taste.

## Set 2: the Loupe's stepper arrows

**Why they change:** ruled by Dann 2026-11-25 18:10, *"we need to accommodate my use, not try to
force the user to adopt our expected path."* The arrows walk every measure rather than only the
bars the banner flagged, so the words "to check" become false.

**Built from:** the strings already there, `loupe.checkPrev` and `loupe.checkNext`
(`i18n.ts:738-739`). **The change is a deletion, not a rewrite:** the false clause goes and the rest
stands, in both languages.

| key | English now | English drafted | French now | French drafted |
|---|---|---|---|---|
| `loupe.checkPrev` | Previous bar to check | Previous bar | Mesure précédente à vérifier | Mesure précédente |
| `loupe.checkNext` | Next bar to check | Next bar | Mesure suivante à vérifier | Mesure suivante |

**The key names keep the word `check` even though the strings no longer say it.** Renaming them to
`loupe.stepPrev` / `loupe.stepNext` would be tidier and would touch `LoupePrintStrip.svelte:136-137`
and the French parity gate. **DESK DEFAULT: leave the key names alone in this lane** and rename
them, if ever, in a pass that touches nothing else. A key name is not user-visible and a rename
inside a behaviour change is how a string goes missing.

**RULED by Dann 2026-11-26 09:36: “Sure, use bar in Engligh”** (transcribed as written). So `bar` stays in both arrow strings, and the only change is striking “to check” and « à vérifier », which follows from his 18:10 ruling. **This is his ruling, not a desk default, and it governs these two keys only:** settling the English noun across the app stays its own pass, and nothing here licenses changing `measure` where the app already says it (`loupe.place.scope.measure`, `i18n.ts:517`). Was OPEN: `bar` or `measure` in English. The file uses both. These two keys say
"bar"; `loupe.place.scope.measure` says "this measure" (`:517`); `loupe.printAlt` says "Bar {bar}"
(`:741`); `loupe.measureTag` abbreviates to "m." (`:472`). The French is settled either way: it is
« mesure » everywhere. **The desk recommends keeping `bar`** in these two, because it is what they
say today and because the change then carries no risk beyond striking three words. Settling the
English noun across the whole app is its own pass and is worth more than this lane.

## What is NOT drafted, and why

**The eight naming forms table is not here.** Dann ruled it out of reach on 2026-11-25 02:16
(transcribed as written): *"My first tactice would be to resarch who has done this successfully,
then adopt their method. ... LEt's see how others have achieved this and learn from them before we
adopt the easy route of interval versus mode"*. **So the research comes before the table**, and
putting the eight forms to him now would be the easy route he declined. `INBOX.md:1040`;
`OPEN.md:4849`.
