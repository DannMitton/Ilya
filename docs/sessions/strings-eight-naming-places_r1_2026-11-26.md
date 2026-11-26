# The eight naming places, as one table: what Ilya says when the file states no mode

Drafted by the desk 2026-11-26 at Dann's ask. **English to ratify, French to rule.**
Every current string below was read by the desk from `i18n.ts` in this session; the place-by-place
shape is Fable's, from section 4 of `review-fable-plan-transposition_r1_2026-11-25.md`.

**Drafting is not adopting.** Dann ruled on 2026-11-25 02:16 that research into how others solve
this comes before Ilya takes the interval-and-signature route (*"LEt's see how others have achieved
this and learn from them before we adopt the easy route of interval versus mode"*). This table is
what that research will test, and the Sonnet research pass is still owed. Nothing here is a
commitment to the form.

## The finding to settle first, because it reaches strings already ratified

**French calls a key a « tonalité » and a key signature an « armure », and Ilya's own file keeps them
apart:** `loupe.keySignature` is "Key signature" / « Armure » (`i18n.ts:575`), and the whole
Corrections card speaks of « armure » (`:576-580`, `:587-589`).

**But the transposition strings say « tonalité », and when no mode is stated the thing they show is
an armure.** So these ratified strings would read wrongly in French:

| key | line | what it becomes with no mode | why it is wrong |
|---|---|---|---|
| `key.dock.asPrinted` (`:2391`) | « Tonalité imprimée · {tonic} » | « Tonalité imprimée · 2♯ » | 2♯ is an armure |
| `key.band.asPrinted` (`:2362`) | « Tonalité : {key}, telle qu'imprimée » | « Tonalité : 2 dièses, … » | same |
| `key.band.transposed` (`:2364`) | « Tonalité : {key}, après transposition » | « Tonalité : 2 dièses, … » | same |
| `intake.key.label` (ruled 2026-11-26) | « TONALITÉ » | the row shows 2 dièses | same |

`key.dock.asPrinted` and `key.band.*` were ratified by Dann 2026-09-28 19:28, and
`intake.key.label` on 2026-11-26, all before this case was visible. **The English does not have the
problem:** "Key" covers both in ordinary musical English, and "As printed · 2♯" reads correctly.

**RULED by Dann 2026-11-26 09:4x on the desk's three routes and its recommendation: ROUTE 1.** The French switches to « armure » only where the score states no mode, so the same place reads « Tonalité imprimée · ré » with a mode and « Armure imprimée · 2♯ » without. **Four ratified strings therefore gain a no-mode twin rather than being revised:** `key.dock.asPrinted`, `key.band.asPrinted`, `key.band.transposed`, `intake.key.label`. The English is unchanged at every place. The three routes as offered:

1. **Switch to « armure » only in the no-mode case**, so the same place reads « Tonalité imprimée ·
   ré » with a mode and « Armure imprimée · 2♯ » without. Truest in both cases. Costs a second
   string at each of the four places and makes the French label move while the English stays put.
2. **Keep « tonalité » everywhere** and accept that it is loose when no mode is stated. Costs
   nothing and revises nothing. A French-speaking musician would notice.
3. **Use « armure » everywhere**, since the signature is what Ilya is certain of in both cases.
   Revises four ratified strings and loses the right word where the mode IS stated.

**The desk recommends 1.** Ilya's whole posture in French is one term per concept, and this is two
concepts, not one term stretched. The cost is four extra strings, which is small beside a French
label that says the wrong word on every modal song in the repertoire this app serves. **Route 2 is
the one to take if the extra strings are not worth it to you**; it is defensible and it is cheap.

## The eight places

Mode stated is what ships today. No mode stated is the draft.

| # | place | string | mode stated | no mode stated |
|---|---|---|---|---|
| 1 | ruler stop face | glyph, no string | C | **TO BE DRAWN**, not asked: `0` or `♮` |
| 2 | stop face, enharmonic twins | glyph, no string | B and C♭ | 5♯ and 7♭ |
| 3 | readout, away from the print | `key.ruler.readout` (`:2369`) | Down a whole tone · C major / « Un ton plus bas · do majeur » | Down a whole tone · No sharps or flats / « Un ton plus bas · aucune altération » |
| 4 | readout, on the printed stop | same | D major / « ré majeur » | 2 sharps / « 2 dièses » |
| 5 | dock chips | `key.dock.asPrinted`, `key.dock.pick` (`:2391-2392`) | As printed · D / « Tonalité imprimée · ré » | As printed · 2♯ / **route 1:** « Armure imprimée · 2♯ » |
| 6 | KEY row, INPUT receipt | `intake.key.*` (ruled 2026-11-26) | D major, printed / « ré majeur, imprimée » | 2 sharps, printed / **route 1:** « 2 dièses, imprimée », label « ARMURE » |
| 7 | page header | `key.page.header` (`:2370`) | Transposed down a whole tone from D major, at the singer's choice. / « Transposition d'un ton plus bas à partir de ré majeur, au choix de l'interprète. » | Transposed down a whole tone from the printed key, at the singer's choice. / « Transposition d'un ton plus bas à partir de l'armure imprimée, au choix de l'interprète. » |
| 8 | INSIGHTS key line | `key.ruler.readout` via `insights/key-lines.ts:153` | Down a whole tone · C major | Down a whole tone. **Already built this way**: `readout` falls back to the interval alone where `keyName` is null |

**The signature words are not coined and a singer who has corrected a key has already read them:**
`correct.keyNone` "No sharps or flats" / « Aucune altération » (`:582`), `correct.keySharp` "1 sharp"
/ « 1 dièse » (`:583`), `correct.keySharps` "%s sharps" / « %s dièses » (`:584`), `correct.keyFlat`
(`:585`), `correct.keyFlats` (`:586`).

**Place 7 needs a new string, not a filled `{key}`.** `key.page.header` takes a key name, and "the
printed key" is not one. DESK DEFAULT: a `key.page.header.noMode` variant with the clause written
in, rather than passing a phrase through `{key}`, which would read as a key name to any later
developer.

**Place 8 is already correct and needs nothing.** Worth saying plainly: one of the eight is done.

## Two small open choices, with the desk's recommendation

**(a) Capitalization in place 3.** `correct.keyNone` opens with a capital, « Aucune altération »,
because it is a card label. Mid-line after a middle dot it would read « Un ton plus bas · Aucune
altération ». **The desk recommends the lower-case form mid-line**, which needs its own string;
French does not capitalize mid-sentence and the capital would read as a proper name.

**(b) Place 1's empty-signature face.** Tether 18 applies: this is taste and is to be DRAWN, not
asked in words. The desk draws `0` and `♮` at desktop and at dock width and Dann rules from the
drawing. Fable's runner-up for the faces generally, the circle-of-fifths pair "C/a", costs width on
every stop, most on the phone dock, and has no settled French form; the desk is not drawing it
unless Dann asks.

## NOT ESTABLISHED

- Whether the field or published software has a better answer than interval-and-signature. **That
  is the research Dann ruled must come first, and it is not done.** This table is its test, not its
  conclusion.
- Whether `nameKey` returns null for a modal score today, or returns a major-or-minor guess. The
  desk read `key-lines.ts:153`'s fallback but not `nameKey` itself.
- What the dock chip does for width when `{tonic}` becomes « Armure imprimée · 2♯ », which is longer
  than any present value.
