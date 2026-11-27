# Amendment r1 to brief r3: the French abbreviations, and the pair row's ends

2026-11-26, desk. Amends `brief-code-n94-ribbon-slider_r3_2026-11-26.md` for the lane as built in
`report-code-n94-ribbon-slider_r1_2026-11-26.md`, branch `mac-n94-ribbon-slider`. Nothing in that lane is
committed. Two items, and a measurement that keeps nothing and may run before the review lands.

## Item 1. The French interval abbreviations. RULED by Dann 2026-11-26 18:54 ("A")

The row under the track. The six `fr` values at `i18n.ts:2401-2406` ship the English forms today. They become:

| key | en, unchanged | fr, new | the French noun it shortens |
|---|---|---|---|
| `key.ruler.short.1` | `m2` | `2de m` | seconde mineure |
| `key.ruler.short.2` | `M2` | `2de M` | seconde majeure |
| `key.ruler.short.3` | `m3` | `3ce m` | tierce mineure (`i18n.ts:2377`, « Une tierce mineure ») |
| `key.ruler.short.4` | `M3` | `3ce M` | tierce majeure (`i18n.ts:2378`) |
| `key.ruler.short.5` | `P4` | `4te J` | quarte juste (`i18n.ts:2379`) |
| `key.ruler.short.6` | `TT` | `TT` | triton (`i18n.ts:2380`) |

**Coined and adopted, as Dann's rule requires.** `2de`, `3ce`, and `4te` are the standard French ordinal
abbreviations, adopted. `m` and `M` follow the readout's own « mineure » and « majeure », adopted from the file.
**`J` for « juste » is the desk's coinage on this control.** `TT` is kept unchanged because « triton » carries the
same two letters as "tritone". NOT ESTABLISHED: whether Roberge's *GDRM*, the source behind Dann's pitch-name
ruling, gives an abbreviation form. It was not opened this session.

**Typography, desk defaults.** Plain lowercase letters, not Unicode superscript ordinals: the row is 10 px
(`.interval`, `TranspositionRuler.svelte:526-533`) and superscripts at that size are a risk the desk did not take.
A normal space separates the number from the quality, because `.interval` is already `white-space: nowrap`, so no
no-break space is needed.

**Why this is a constraint and not a nicety.** Dann's ruling 11 (`OPEN.md`, N.94): the integer, the abbreviation,
and the readout agree in both languages, so the French abbreviations are not free to differ in form from the
French readout.

## Item 2. The pair row stays inside the dock's window. DESK DEFAULT, Dann's to overrule

**Occasion:** report r1 item 3. On a 390 px phone, « sol bémol » begins 17 px outside the screen at −6 and
« fa dièse » ends 7 px outside it at +6.

**The rule to build.** The pair row centres on its node, as ruling 17 has it, except where centring would put
either half outside the dock's window. There it shifts by the smallest amount that puts both halves inside, and
it still prints in full. The rule is written against the window, not against the two end nodes, because the phone
ribbon slides and any node can reach the first or last slot.

**The one site.** `.pair` (`TranspositionRuler.svelte:559-566`) is the only definition of the pair row's
position, `position: absolute; left: 50%; width: 0`, and the dock renders the same snippet
(`TranspositionDock.svelte:99`). No other site positions it.

**The departure, named.** This departs from ruling 17's "centre", on the phone alone, and only where the
alternative is a clipped pair. Ruling 17's reason was room to read the pair, and a pair half off the screen does
not meet it. The desktop never fires the rule: report r1 measures 4.9 px of clearance for the longest French pair
after ruling 17's padding.

## Step 0: the measurement. Keeps nothing, may run first

On the dev server, in French, at 390 and at 1440:

1. The painted width of each of the six abbreviations at 10 px, against its node's slot (55.7 px at 390 by
   ruling 15; the desktop's own width measured, not assumed).
2. Whether any abbreviation overlaps a neighbour's slot, which `white-space: nowrap` and centring make possible.
3. After item 2 is built, both halves of the pair at −6 and at +6, in px, against the window's edges.

Report the numbers. If any abbreviation overflows its slot, stop and report rather than shortening it: the form
is Dann's ruling, and the fallback is his to make.

## Done when

- The six French values read as the table sets them, and no English value changes.
- No abbreviation overflows its node's slot or its neighbour's, in either language, at 390 and at 1440, measured.
- At −6 and at +6 on the phone, both halves of the pair sit inside the window and print in full, measured in px.
- Gate 4's key index does not move: these are value changes, and `i18n-index.test.ts` counts keys.
- Seven gates at baseline, and gate 4 at the lane's existing +15 unless this amendment adds a test.

## Every other site that computes the same thing

`shortInterval` (`transposition-ruler.ts:369`) is the only reader of `key.ruler.short.*`, and it returns
`key.ruler.orig` at zero, which stays « ORIG. » in both languages under ruling 8. `.pair`
(`TranspositionRuler.svelte:559`) is the only definition of the pair row's position.

## What the agent could not establish

**NOT ESTABLISHED beats a complete invented answer.**

- Whether *GDRM* gives an interval abbreviation form. Not opened this session.
- Anything on a real phone: this lane's measurements are headless Chromium on a Mac.
- **Held and not to be repaired here:** the readout names one and two semitones in tone words in both languages
  (« Un demi-ton », « Un ton », `i18n.ts:2375-2376`), while the abbreviation names them as seconds. English ships
  the same mismatch today. It is a separate wording question and it stays out of this lane.
