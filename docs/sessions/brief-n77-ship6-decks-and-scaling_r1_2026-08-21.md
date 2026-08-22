# BRIEF FOR CODE. N.77 ship 6: nine decks, and the band title scales

Two parts, both ruled by Dann on 2026-08-21. Keep them separate in your memo.

Everything below was read in the tree at `9f11490` on 2026-08-21.

---

# PART A. The band title scales with the sheet

## The defect

Ship 3's memo measured it: at 360 px in English, Guide's `Licences and
Acknowledgments` sets the word `Acknowledgments` at 312 px inside a 252 px band
measure, so it paints 29.8 px past the sheet and **5.8 px off the right of the
screen**. A word cannot break, so no wrapping rule saves it.

## The ruling

**Dann, 2026-08-21:** *"Let the title scale with the sheet."*

He chose this over hyphenating, over shortening the chapter title, and over
leaving it, **because it is the only option that also protects the chapters
nobody has measured.**

## The change

Make the band title's size fluid rather than fixed.

**The constraint that makes this safe: at desk width the rendered size must
still be exactly 40 px.** Dann ratified 40 px by eye on a desk mockup. This ship
extends that ruling to the phone, which he never saw; it does not revise it.

Pick the floor and the fluid term yourself, **measure what you picked**, and put
the three measured sizes in your memo. Do not introduce a breakpoint if a single
fluid declaration will do: `.chapter-band`'s other values are all unconditional
and this one should be too.

## Part A is done when

Report the rendered result, not the source.

1. At 1400 px the band title measures **40.0 px** in both rooms, both languages.
   Give the number.
2. At 360 px, English, Guide's `Acknowledgments` sits **inside** the sheet. Give
   the band's right edge and the word's right edge.
3. At 393 px the same. **This is Dann's own phone width and ship 3 never
   measured it.**
4. All twelve bands, both languages, at all three widths: no title paints past
   the sheet. Report any that does.
5. Ship 2's landing positions are unchanged. If a smaller title moves where a
   chapter lands, say so and change nothing.

---

# PART B. Nine decks

## The ruling

**Dann, 2026-08-21, ratified all eighteen strings verbatim.** Ship 1 gave decks
to Learn's chapters 2, 3, and 4 by lifting a thesis sentence already in the
body. **These nine are new copy and nothing is lifted out of any chapter.** Add
the deck to the band and change no body text.

## The strings, exactly as ratified

**Copy them character for character. Do not edit, do not re-punctuate, and do
not translate anything.**

| anchor | English | French |
|---|---|---|
| `learn-unit-1` | Thirty-three letters. By the end of this section you will have met every one. | Trente-trois lettres. À la fin de cette section, vous aurez fait connaissance avec chacune d'elles. |
| `learn-unit-5` | Most of these you already know. Five need your attention. | La majorité de ces consonnes, vous les connaissez déjà. Seule une poignée est véritablement nouvelle. |
| `learn-unit-6` | Two gestures at once: the consonant, and the tongue arching toward the palate. | Deux gestes simultanés&#160;: la consonne, et le dos de la langue qui monte vers le palais. |
| `learn-unit-7` | Palatalization is a question the tongue answers. Voicing is a question the larynx answers. | La palatalisation pose une question à laquelle répond la langue. Le voisement en pose une à laquelle répond le larynx. |
| `learn-coda` | Some pronunciations cannot be derived. They must simply be known. | Certaines prononciations résistent entièrement à la déduction. Il faut simplement les connaître. |
| `guide-how` | What happens when you paste a poem, and why you can check every symbol it prints. | Ce qui se passe lorsque vous collez un poème, et pourquoi vous pouvez vérifier chaque symbole imprimé. |
| `guide-walkthrough` | One complete session, from an empty page to a printed sheet. | Une session complète, de l'ouverture de l'outil jusqu'à l'impression d'une transcription achevée. |
| `guide-contributors` | The people whose scholarship Ilya is built on. | Celles et ceux sur qui Ilya repose. |
| `guide-licences` | Everything Ilya ships with, acknowledged in one place, so that nothing owed is buried. | Chaque composante distribuée avec Ilya, reconnue en un seul endroit, afin qu'aucune reconnaissance due ne soit enfouie. |

## THE ONE TYPOGRAPHIC TRAP

**`learn-unit-6`'s French carries a colon, and that colon takes a hard space
before it.** It is written above as `&#160;:`, which is the spelling
`LearnContent.svelte` already uses in 62 places. **Preserve it.**

This is Dann's ruling of 2026-08-21, checked against both Canadian authorities:
**no space before `?`, a hard space before `:`.** Ship 5 removed 47 spaces
before question marks. **Do not let this colon lose its space, and do not add a
space anywhere else.**

None of the eighteen strings contains a question mark. Confirm that after you
paste them.

## Where they go

Into each band's deck slot, the same `.band-deck` element ship 1 built for
Learn's chapters 2, 3, and 4. **Every band then carries a deck: twelve of
twelve, in both languages, twenty-four bands in all.**

## Do not touch

- **Any body text.** Nothing is lifted out. Chapters 2, 3, and 4 keep the decks
  they already have.
- **The kickers**, including `SECTION 8`, which ship 5 settled.
- **The three decks that already exist.** They are the register these nine were
  written to match.
- **`Drawer.svelte`'s table of contents.** Decks are not entries.
- **The heading elements and their `id`s.**

## Part B is done when

1. All twelve Learn and Guide chapters show a deck, in both languages. Twenty-
   four in total. Give the count you rendered.
2. `learn-unit-6`'s French deck renders with a hard space before its colon.
   **Verify it in the built bundle, not in the source.**
3. No question mark anywhere in the eighteen new strings, and ship 5's invariant
   still holds: no space of any kind precedes a `?` in either reading file.
4. Chapters 2, 3, and 4 are unchanged, and their thesis sentence still appears
   once, not twice.
5. All five gates at baseline.

---

## What you owe back

A memo in the same commit, Part A and Part B in separate sections.

- **What changed**, each with `path:line`.
- **Every done-condition**, with what you observed, not what you expected. Give
  measured numbers.
- **What I could not establish.** `NOT ESTABLISHED` beats a complete invented
  answer.

Do not run `git`. Do not commit.
