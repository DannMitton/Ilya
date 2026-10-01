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

---

## French, PROPOSED 2026-10-01 03:15 (desk), for Dann's ruling

### Ce que font les Aperçus  (id `guide-markup-forecast`)

Les Aperçus réunissent les forces d'Ilya (les valeurs de diction que fournit l'onglet Texte, les points de bascule acoustiques que montre l'Annotation, ainsi que l'ambitus et les passaggi déclarés et les résonances vocaliques échantillonnées lors du parcours d'accueil de la personne qui chante) pour évaluer avec quelle aisance cette personne est susceptible d'aborder une pièce russe telle qu'elle est écrite. Les Aperçus prévoient comment une voix rencontrera vraisemblablement les hauteurs, les voyelles et les nuances d'une partition. Ils peuvent ainsi offrir des conseils judicieux, comme des transpositions plus favorables lorsqu'il en existe. Chaque conseil s'appuie sur la littérature du domaine, ou sur un prolongement raisonné de celle-ci qui en expose les étapes. L'oreille avertie du professeur a toujours le dernier mot.

Chaque note d'une partition fixe trois choses : une hauteur, une voyelle et une nuance. Reid les considère comme les seuls facteurs de contrôle dont dispose la personne qui chante : si l'on en change un, les autres doivent s'adapter. Les Aperçus lisent ces trois éléments tels que le compositeur les a fixés, note par note, et prévoient ce que chaque combinaison exige de la voix, sur le plan acoustique et sur celui des registres. Lorsque la littérature l'appuie, cette prévision devient un conseil applicable.

### Conventions de notation de l'Annotation  (id `guide-markup-notation`)

L'Annotation trace la partition selon un petit ensemble de conventions, adaptées de Mitton (2020, annexes B et C). La direction des hampes est porteuse de sens : hampe vers le haut, timbre fermé; hampe vers le bas, timbre ouvert. Les têtes de note lavande, sans hampe, indiquent la hauteur à laquelle bascule le timbre de la voyelle chantée, avec leurs propres altérations dans la même couleur. Un cadre rouge arrondi signale un croisement entre la première résonance et la hauteur chantée (*f*R1/*f*o). Sous la portée, la ligne cyrillique est doublée d'une ligne API en caractères droits, jamais en italique, afin que le contraste entre le a clair et le a sombre demeure lisible.

Comme les hampes portent le timbre, l'Annotation regroupe les notes sous les ligatures autrement que ne le ferait un graveur. Ilya ne relie par une ligature que les notes brèves qui partagent une mesure, un temps et un timbre. Lorsqu'un même temps contient des notes des deux timbres, leurs hampes pointent dans les deux directions : ces notes prennent alors des crochets plutôt qu'une ligature commune, et une même page peut montrer crochets et ligatures côte à côte. Les traités de gravure, dont celui de Gould, regroupent selon le seul temps. Ilya s'écarte de cette convention à dessein, pour que la direction d'une hampe dise toujours la vérité sur le timbre.

Une rupture de phonation s'écrit **[#]** sur la ligne API, à la jonction des deux notes qu'elle sépare. *(Inchangé.)*

**Sources of the French:** adopted from `GuideContent.svelte:59-80` (« hampe vers le haut », « timbre fermé/ouvert », « hauteur de bascule », « croisement », « ligne API », « a clair / a sombre », « Mitton (2020, annexes B et C) ») and `i18n.ts` (« Aperçus », « Annotation », « Texte », « la personne qui chante » from the ratified fry essay). **Coined or chosen by the desk:** « Ce que font les Aperçus » (heading); « l'oreille avertie » for "informed ear"; « sur celui des registres » for "in registration"; « ligature » and « crochet » for beam and flag (confirmed 2026-10-01: Steinberg's French Dorico manual, « Une barre de ligature est une ligne qui relie des notes par leurs hampes… »; Musicmot, « un ou plusieurs crochets (isolés ou liés par un trait épais à d'autres hampes) »); « parcours d'accueil » for "intake process".

**Dann 2026-10-01 03:16:** « comme des transpositions plus favorables » (his edit); everything else ratified except « l'oreille avertie », which is under discussion.
**Dann 2026-10-01 03:18: « l'oreille avertie » ratified**, with his stated reservation: *"I'm just itchy about avertissement meaning warning. I don't want to imply The Warned Ear, but I think l'oreille avertie is probably the best we can hope for."* The French of this file is now RATIFIED in full.
