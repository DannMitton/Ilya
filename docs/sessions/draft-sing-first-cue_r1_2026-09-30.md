# Draft: sing the vowel first, then fry (row 2d, part 3)

Desk draft, 2026-09-30 21:00, REVISED 21:02 on Dann's direction, NOT RATIFIED. Answers Dann 19:37: *"inject a directive in the wizard to sing the vowel first. We should provide a countdown for that and streamline the user experience."*

## The flow, today and proposed

Today (`Pacifier.svelte:371-412`): tap to arm, tap again to begin; "Preparing [a]. Three." "Two." "One." at 700 ms a beat; "Begin phonating now. [a] in vocal fry."; the live gate waits for fry; "Now sustain. Sample recording."

Proposed:
1. **One tap begins** (DESK RECOMMENDATION, taste: Dann's). The arm step goes; a tap during the count cancels. Long-press still skips.
2. **The count is sung.** "Sing [a]. Three." "Two." "One." The singer sings the vowel through the count, so its shape is set before the fry.
3. **On zero, into fry.** "Now ease into vocal fry on [a]." The gate already waits for fry, so the sung part is never recorded (`report-code-guard-provisional_r1_2026-09-30.md`, Part 2).
4. **Beat length 1000 ms** (DESK DEFAULT, was 700): three seconds of singing instead of 2.1.

## Strings

Drafted from the French already in `i18n.ts:1074-1151`. « friture vocale » and « Touchez » are the tree's. Agreement checked: « Chantez-la » refers to « la voyelle », feminine; `{v}` takes no agreeing word.

| Key | English | French |
|---|---|---|
| `calib.capture.cuePrefix` | Tap the | Touchez la voyelle |
| `calib.capture.cueSuffix` | vowel to begin. Sing it through the count, then ease into fry. | pour commencer. Chantez-la pendant le décompte, puis passez en friture vocale. |
| `pacifier.preparing` | Sing {v}. Three. | Chantez {v}. Trois. |
| `pacifier.beginPhonating` | Now ease into vocal fry on {v}. | Passez maintenant en friture vocale sur {v}. |
| `pacifier.wheelAria` | Vowel calibration. Tap a vowel to begin capture, long-press to skip. | Calibration des voyelles. Touchez une voyelle pour lancer la capture, appuyez longuement pour l’ignorer. |

Unchanged: "Two." "One." "Now sustain. Sample recording." Retired with the arm step: `pacifier.armed`, `pacifier.armedRetake`, `pacifier.selected` (Code confirms nothing else reads them).

Coined by the desk: « Chantez-la pendant le décompte », « passez en friture vocale », "ease into". Adopted from the tree: everything else.


## REVISION 21:02, on Dann's direction. Supersedes the flow and strings above

**Dann 20:56 and 20:57:** *"I want two samples per vowel: one sung sample to establish the shape of the vocal tract, then one in fry with that vocal tract shape preserved."* *"The sung sample is for the user. It is so they can correctly configure their vocal tract. Singing the vowel the way they are used to is for the user, and preserving that sung vocal tract shape while executing fry is the sample we will record and process."* Whether the sung sample is recorded: *"I don't care."* DESK DEFAULT: not recorded, not processed (the live gate already ignores it).

Flow: (1) one tap begins (desk recommendation, unruled); (2) the singer sings the vowel as usual through a count of three, 1000 ms a beat (DESK DEFAULT); (3) on zero, the singer keeps the vowel's shape and goes into fry; (4) the gate confirms fry and the fry sample is recorded and processed as today.

| Key | English | French |
|---|---|---|
| `calib.capture.cuePrefix` | Tap the | Touchez la voyelle |
| `calib.capture.cueSuffix` | vowel to begin. First sing it as you usually do, then keep its shape and go into fry. | pour commencer. Chantez-la d’abord comme d’habitude, puis gardez sa forme et passez en friture vocale. |
| `pacifier.preparing` | Sing {v} as you usually do. Three. | Chantez {v} comme d’habitude. Trois. |
| `pacifier.beginPhonating` | Keep the vowel’s shape. Now go into fry on {v}. | Gardez la forme de la voyelle. Passez maintenant en friture vocale sur {v}. |
| `pacifier.wheelAria` | as drafted above | as drafted above |

Agreement: « Chantez-la » and « sa forme » refer to « la voyelle »; « sa » agrees with « forme ». Coined by the desk: « comme d’habitude », « gardez sa forme », « Gardez la forme de la voyelle », « passez en friture vocale »; "as you usually do", "keep its shape", "go into fry".


## REVISION 21:05, on Dann's direction. Supersedes the 21:02 revision. RATIFIED by Dann 2026-09-30 21:00 (*"Ratified"*): the flow, including the desk's one-tap recommendation, and all four strings, English and French

**Dann 20:59:** *"Most singers will not feel comfortable going from modal singing into fry. It is ok to explain to the user that the sung vowel is to confirm their vocal tract shaping. Then allow them to switch to fry with that vocal tract shape preserved. Give them a moment between sung and fry."*

Flow: (1) one tap begins (desk recommendation, unruled); (2) **sung:** "Sing {v} as you usually do." with a count of three, 1000 ms a beat, not recorded; (3) **a moment:** "Stop, and keep the shape.", 2000 ms of silence (DESK DEFAULT); (4) **fry:** "Now {v} in vocal fry." The live gate waits for fry; the fry sample is recorded and processed as today.

| Key | English | French |
|---|---|---|
| `calib.capture.cueSuffix` | vowel to begin. First sing it as you usually do, to set the shape of your vocal tract. Then stop, keep that shape, and begin again in vocal fry. Ilya measures only the fry. | pour commencer. Chantez-la d’abord comme d’habitude, pour régler la forme de votre conduit vocal. Puis arrêtez, gardez cette forme et recommencez en friture vocale. Ilya ne mesure que la friture. |
| `pacifier.singFirst` (new; replaces `pacifier.preparing`) | Sing {v} as you usually do. Three. | Chantez {v} comme d’habitude. Trois. |
| `pacifier.pause` (new) | Stop, and keep the shape. | Arrêtez, et gardez la forme. |
| `pacifier.beginPhonating` | Now {v} in vocal fry. | Maintenant, {v} en friture vocale. |

French term: « conduit vocal » is the Learn page's (`LearnContent.svelte:1038`, `:1802`); the Guide uses « tractus vocal » once (`GuideContent.svelte:46`). Proposed: « conduit vocal ». Agreement: « Chantez-la » refers to « la voyelle »; « cette forme » and « la forme » are feminine. Coined by the desk: every new sentence in this table.
