# The Guide on phrase ends, RATIFIED by Dann 2026-10-19 21:09

Owed by row 108 (its report, section 7). Drafted by the desk (Opus) 2026-10-19 21:0x; Dann: *"Ratified. Thanks for doign the legowrk to ensure veracity"* (transcribed as written). Before it, the desk read Grayson, *Russian Lyric Diction* (2012), printed pp. 248 to 255, from `~/Downloads/Grayson - 2012 - Russian Lyric Diction.pdf` (physical pages 264 to 271): p. 248, punctuation and the implied phrase ("places of possible pause without punctuation") are "terminal boundaries which are not crossed by any phenomena of assimilation, including voicing and palatalization"; p. 250, "Voicing assimilation can occur across all boundaries except punctuation or the implied phrase." The step from Grayson's place of possible pause to a printed rest is Ilya's, and the sentence says so: a search of the text layer found no passage where Grayson names a musical rest.

Placement (DESK DEFAULT): after "…the sound of a sung word depends on the words beside it." in the Guide's paragraph on Poem and Lyrics (`guide-witnesses`, English; its French mirror), as its own sentences, in both languages. Russian words in `<em>`, no guillemets. Typography: a no-break space before the colon in French (the OQLF table, ruled 2026-09-30 21:39); no space before the semicolon, as the file's French does (`intake.view.poemLine`).

Coined: « phrase implicite » (the desk's rendering of Grayson's "implied phrase"). From the file: « silence », « ligne vocale », « voisement ».

## English

Grayson (p. 248) holds that punctuation and the implied phrase, a place where a speaker could pause, are boundaries that no assimilation crosses, not even voicing. Ilya treats a rest in the vocal line as such a pause: where a score sets a rest between <em>так</em> and <em>засыпаю</em>, <em>так</em> keeps its [k]; sung straight on, it takes [ɡ] before the [z].

## French

Selon Grayson (p. 248), la ponctuation et la phrase implicite, là où l’on pourrait marquer une pause, sont des frontières que ne franchit aucune assimilation, pas même celle du voisement. Ilya traite un silence dans la ligne vocale comme une telle pause : là où une partition place un silence entre <em>так</em> et <em>засыпаю</em>, <em>так</em> garde son [k]; chanté sans interruption, il prend [ɡ] devant le [z].

## What the sentence claims in Ilya, with its evidence

- A rest ends a phrase for the sound: `apps/web/src/lib/score/phrase-ends.ts:32-36` (a rest, a fermata, a breath mark, or a caesura); row 108 part C sets the boundary.
- A hard boundary stops cross-word voicing assimilation: `packages/phonology/src/engine.ts:2171` (`if (leftWord.rightBoundary === 'hard') continue;`), Grayson pp. 248 to 257 cited at `:2153`.
- The example, measured by row 108's report: «такъ» on the Tchaikovsky, `ˈtɑɡ` before part C and `ˈtɑk` after, with a rest before «засыпаю».
- Not claimed: palatalization across words. The audit of 2026-07-30 (project doc `claude/e20-audit-hard-boundary-vs-palatalization_2026-07-30.md`, snippet read) found cross-word regressive palatalization is not computed.

## The Input line, the other string row 108 owed

DESK DEFAULT 2026-10-19 21:0x: none, by Dann's ruling of 2026-09-16 (`PRODUCT.md`, "ILYA SORTS WHAT IT IS GIVEN, AND NEVER SAYS SO"); the field's undo returns Lyrics to one line (row 108's report, section 5). His to overrule.
