# Brief for Design: the Loupe's Corrections, round 3 (r4, 2026-10-08)

Written by the desk (Fable) 2026-10-08 about 22:49. For Claude Design, with the repository `DannMitton/Ilya` connected on branch `Shane` (at `6b7c3de` it holds your round 2 return, `docs/sessions/design-corrections_r2_2026-10-08.md`, its drawings, and brief r3). **This brief is complete in itself:** the rulings and strings below are newer than the repository and are not in it yet. Your round 2 holds except where this brief says otherwise.

## The singer, first

A classical singer has dropped a scanned song. Ilya has drawn the vocal line, and a few bars may not match the print. The singer holds the score. Ilya's part is to say which bars to look at and what it read there; the singer's part is to compare with the page and answer. **The singer is comparing with the score, not judging a machine** (Dann, 2026-10-08 16:02). Many of these singers read French, and the French is longer.

## What Dann ruled after your round 2 (all 2026-10-08)

1. **The page is the authority, not the arithmetic (15:50).** *"what we are looking for is not simple alignment in arithmetic... we are looking to replicate the rhythmic values assigned by the composer."* So no string says "flag", "add up", "gap", or "as read". An offer asks what the score shows and never argues that a bar must fill.
2. **Seven stations on the phone, without the octave buttons (15:51), then six (21:45).** Accidentals join Pitch, as you proposed. "Not voice" is no longer a station: removing notes is the singer's judgement, so it lives in the footer's remove control, with a reach and one Undo. **The rail is: Tuplet · Pitch · Length · Tempo · Dynamic · Hairpin.** At the desk, keep the octave pair in Pitch where the width allows.
3. **Every string is final, in English and in French (16:02, 21:55, 22:31, 22:34, 22:40).** They are in the last section. Use them as written. Write no new string without marking it as yours.

## What to draw

Phone (390 by 844) for every state; desk (1440 by 900) for the review path. **Each state in English and in French.** Existing colour tokens (`apps/web/src/app.css`).

1. **The Paper with the line**, in both languages. The French line is 46 characters where your English was 29, and it shares its row with two buttons. Draw what the card does at 390 px, and say what it costs.
2. **The review path with the real words**: one act (the dotted half), two candidates (A and B), no offer ("Matches my score"), the result lines, "Same in m. 22", the last bar with Done, the Paper after Done, and the many-bars sentence.
3. **The rail of six.** Rows by meaning on the phone, as in round 2: repairs over marks. Say whether three over three, or one row of six, serves better, and measure each French label with its mark against the chip (your test: within 67 px at 13 px semibold). The French: Nolet · Hauteur · Durée · Tempo · Nuance · Soufflet.
4. **The greying table for six stations**, with the reason sentences as now worded.
5. **Removal in its one home, with a reach.** The footer's first slot removes the thing in focus. For notes it takes a reach: this note, This beat, This bar, From here to…, with the count on the button ("Remove 4 notes") and one Undo. Draw it. **Draw what the bar shows after a run is removed**, both ways (rests in the notes' places; nothing in their places), and say which a singer would expect. Your round 2 label "Rests keep the bar its length." waits on this.
6. **The footer in French.** « Supprimer la nuance » is longer than "Remove dynamic". Measure each French remove label against its slot. The fallback is « Supprimer » alone, with the thing named in the line over it; draw that too.
7. **The scan strip (the desk's proposal; Dann has not ruled on it, and your drawing is how he will judge it).** In the review, the printed bar from the singer's own scan sits beside Ilya's reading of that bar, so the singer compares without turning to the paper score. What Ilya has for it: the scanned page, and the place of each note Ilya read on that page (`apps/web/src/lib/omr/join-pages.ts:21-24`); so the strip is a crop of the page around the bar's notes. Ilya does not keep where the printed systems break (`docs/sessions/memo-sonnet-corrections-code-questions_r1_2026-10-08.md`, section 1). Draw where the strip sits on a phone and at the desk, what it displaces, how it behaves for a wide bar, and the review without it, so the two can be compared. Use a stand-in crop and label it as a stand-in.
8. **The mark.** The words no longer say "flag". Say whether ⚑ still reads as "to confirm" on the Paper, in the top line, and on a suggested chip, or what sign serves better. It is a layer that never prints (`docs/memory/CONTRACT.md`, section 6).

## What stays from your round 2

The four rail states; the focus said once; ← and → in the focus row; the reserved offer row; the review strip under the card; nothing advancing on its own; the fixed panel (344 px on the phone, 296 px at the desk) unless these changes move it, in which case say the new height and why; marks placed from a note in focus; no target under 44 px; nothing scrolls.

## Return

The drawings as one HTML file and as images, named by state and language. With them: the six-station greying table; the French label widths against their room, measured in the render; a short note per decision with its cost; where the scan strip lives and what it displaced; any string you had to add, marked; and a section **Could not establish**. NOT ESTABLISHED beats a complete invented answer. Name the return `design-corrections_r3_2026-10-08` (`.md`, `.html`, and a `-png` folder). Write no app code.

## Who offered what

Dann ruled the wording's principle, the stations, and every string. The verb in « 5 mesures à confirmer d’après votre partition. » is his. The scan strip, the reach on removal, and the question about the mark are the desk's, and none is his ruling until he rules on your drawing.

## The strings, final (English / French)

**The Paper.**
- 5 bars may not match your score. / 5 mesures à confirmer d’après votre partition.
- Compare · Not now / Comparer · Plus tard
- 1 bar left to compare: m. 31. / Il reste 1 mesure à confirmer : mes. 31.
- Ilya could not read most of this scan clearly (31 of 40 bars). A clearer scan may read better. / Ilya n’a pas pu lire clairement la majeure partie de cette numérisation (31 mesures sur 40). Une numérisation plus nette pourrait donner de meilleurs résultats.
- Compare all 31 / Comparer les 31
- Compare 5 bars with your score (the link on a bar opened outside the review) / Comparer 5 mesures avec votre partition

**The review strip.**
- ‹ Previous bar · 1 of 5 · Next bar › · Done / ‹ Mesure précédente · 1 sur 5 · Mesure suivante › · Terminé

**The top line.**
- m. 9 · to compare / mes. 9 · à confirmer
- m. 9 · compared / mes. 9 · comparée
- Measure 9 reads as only 3 beats in 4/4. / Ilya ne lit que 3 temps dans la mesure 9, en 4/4.
- Measure 14 reads as 3½ beats in 3/4. / Ilya lit 3½ temps dans la mesure 14, en 3/4.
- ✓ Half note dotted. / ✓ Blanche pointée.
- ✓ Kept as printed. / ✓ Conservée telle qu’imprimée.
- Before A♯3 · beat 3 / Avant A♯3 · temps 3

**Offers.**
- Is the half note dotted in your score? / La blanche est-elle pointée dans votre partition?
- Dot the half note / Pointer la blanche
- Does A or B match a triplet in your score? / A ou B correspond-il à un triolet dans votre partition?
- A: notes 1 to 3 · B: notes 3 to 5 / A : notes 1 à 3 · B : notes 3 à 5
- Matches my score / Correspond à ma partition
- Same in m. 22 · Same in {n} bars / De même à la mes. 22 · De même dans {n} mesures

**Focus sentences.**
- Now a dotted half note. / C’est maintenant une blanche pointée.
- Next bar › when you are ready. / Mesure suivante › quand vous voudrez.
- No note changed. / Aucune note modifiée.
- Measure 22 has the same rhythm. / La mesure 22 a le même rythme.
- The last bar to compare. / La dernière mesure à confirmer.
- Tempo at A♯3. / Tempo sur A♯3.
- Your mf at A♯3. / Votre mf sur A♯3. (mf in italics in both)
- In your score. Ilya’s timings do not use it yet. / Dans votre partition. Les minutages d’Ilya n’en tiennent pas encore compte.
- Triplet over this beat: notes 1 to 3. / Triolet sur ce temps : notes 1 à 3.
- {pitch} is inside a triplet, notes 1 to 3. / {pitch} fait partie d’un triolet, notes 1 à 3.

**Reasons, for a station that cannot act.**
- Pitch works on one note. Tap a note, or →. / Hauteur agit sur une seule note. Touchez une note, ou →.
- Pitch works on one note. Tap one of these notes. / Hauteur agit sur une seule note. Touchez l’une de ces notes.
- Length works on one note. For a triplet, use Tuplet. / Durée agit sur une seule note. Pour un triolet, utilisez Nolet.
- Tap a note, or →. / Touchez une note, ou →.
- Restore puts a corrected note back as Ilya read it. / Rétablir remet une note corrigée telle qu’Ilya l’a lue.
- Nothing to remove here. / Rien à supprimer ici.

**The rail.**
- Tuplet · Pitch · Length · Tempo · Dynamic · Hairpin / Nolet · Hauteur · Durée · Tempo · Nuance · Soufflet

**Detail rows and footer.**
- This beat · This bar · From here to… / Ce temps · Cette mesure · D’ici à…
- Triplet over these {n} notes · Other… / Triolet sur ces {n} notes · Autre…
- Remove note · Remove {n} notes · Remove dynamic · Remove tempo · Remove triplet · Remove hairpin · Remove / Supprimer la note · Supprimer {n} notes · Supprimer la nuance · Supprimer le tempo · Supprimer le triolet · Supprimer le soufflet · Supprimer
- Restore / Rétablir
- Through the bar / Toute la mesure
- Place here · Move here · Move end here / Placer ici · Déplacer ici · Déplacer la fin ici

**Undo pills.**
- Undo: kept as printed / Annuler : conservée telle qu’imprimée
- Undo: same in {n} bars / Annuler : de même dans {n} mesures
- Undo: tempo placed · dynamic placed · hairpin placed · {n} notes removed / Annuler : tempo placé · nuance placée · soufflet placé · {n} notes supprimées

French typography: a no-break space before a colon and after « mes. »; no space before « ? »; a typographic apostrophe.
