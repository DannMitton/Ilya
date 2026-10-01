# Draft: the Guide's Insights and Markup sections (N.84, inbox A2 and A3)

Status: **DRAFT r1, English only, desk 2026-10-01 02:40. Not ratified.** Replaces `GuideContent.svelte:338-353` (English) and their French twins. Anchors kept (DESK DEFAULT), so no `guide-anchors.ts` change.

**Why the heading changes:** "Insights forecasts, it does not declare" restates the line Dann struck on 2026-09-23 16:14: *"I have always hated that line and I am glad it is gone."* (`PRODUCT.md`, "What Insights is for"). The body still says *Fit*.

---

### What Insights is for  (id `guide-markup-forecast`)

Insights combines Ilya's strengths (the diction values that the Text tab supplies, the acoustic points of turning that Markup shows, and the declared range, passaggi, and sampled vowel resonances provided through the singer's intake process) to assess how well the singer is likely to negotiate a Russian piece as written. Insights forecasts how a voice will likely meet the pitches, vowels, and dynamics of a score. This allows Insights to offer judicious advice such as favourable transpositions if they exist. Every piece of advice is grounded in the literature of the field, or in a reasoned extension of it that shows its steps. The teacher's informed ear always has the last word.

Every note of a score fixes three things: a pitch, a vowel, and a dynamic. Reid treats these as the singer's only usable control factors: change one, and the others must accommodate. Insights reads these three as the composer set them, note by note, and forecasts what each combination asks of the singer's voice, acoustically and in registration. Where the literature supports it, that forecast becomes actionable advice.

*(Both paragraphs are Dann's ratified text, verbatim: 2026-09-23 16:14 and 16:24.)*

### Markup's notation conventions  (id `guide-markup-notation`)

Markup draws the score with a small set of conventions, adapted from Mitton (2020, Appendices B and C). Stem direction carries meaning: stems up mark close timbre, and stems down mark open timbre. Lavender noteheads without stems show the pitch at which the sung vowel's timbre turns, with their own accidentals in the same colour. A red rounded box marks a crossing of the first resonance and the sung pitch (*f*R1/*f*o). Below the staff, the Cyrillic line is doubled by an IPA line set upright, never italic, so that the contrast between bright-a and dark-a stays legible.

Because the stems carry timbre, Markup groups notes under beams differently from an engraver. Ilya beams short notes together only when they share a measure, a beat, and a timbre (`staff-renderer.ts:21-25`). Where one beat holds notes of both timbres, their stems point in both directions, so those notes take flags instead of a shared beam, and a page can show flags and beams side by side. Engraving manuals, Gould's among them, beam by the beat alone. Ilya departs from that convention on purpose, so that a stem's direction always tells the truth about the timbre.

A phonation break is written **[#]** on the IPA line, at the junction of the two notes it separates. *(Unchanged from today, second sentence kept.)*

---

## Notes for Dann
- "Sage stemless noteheads" was wrong: they have been lavender since 2026-08-27 (`staff-renderer.ts:851`, `:859`, per the path map). The French says « sauge » too.
- The page's own legend will carry the stems once N.176 ships.
- The Gould sentence rests on the renderer's comment and on Dann's 2026-08-18 ruling that an engraving convention is a prior, not a law (`claude/ruling-semantic-stems-vs-gould-priors_2026-08-18.md`, title only, NOT READ this session).
