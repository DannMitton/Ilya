# Report, N.200 Step 7: the ratified strings and sources that ride with N.200

Cloud lane 52, branch `cloud-lane-52`. Brief Step 7. **I wrote no English or French of my own.** A script (not my typing) read each pair from `docs/memory/OPEN.md` at the line the brief names and wrote it into the tree; the one-line transformations in item 1 are the rule `OPEN.md` states. All five `OPEN.md` lines were where the brief says: 3790, 3791, 3792 (with EN at 3793 and FR at 3794), 3796, 3800 (EN 3801, FR 3802). The `i18n.ts` and Guide lines had moved, as the brief expected (below).

## The five items

1. **The four "Resonance profile" strings** (`OPEN.md:3791`, ratified 2026-11-14 21:22; the name `:3790`). In `calib.welcome.lede`, `profile.subtitleNamed`, `profile.subtitleYours`, and `profile.subtitlePlaceholder` (now `i18n.ts:1255`, `:1390`, `:1391`, `:1393`; the brief and `OPEN.md` cite older lines), "formant profile" and "Formant profile" became "resonance profile" and "Resonance profile"; « profil de formants » and « Profil de formants » became « profil de résonances » and « Profil de résonances ». Every other character is as the tree had it, the repetition after the colon kept.
2. **« Reprendre »** for `calib.common.retake` (`i18n.ts:1211`, as the brief says; was « Réessayer »). `calib.roster.tryAgain` stays « Réessayer ». The comment above it is rewritten to say the 2026-09-14 adoption is superseded and why the old reason still holds. **That comment is my wording**, in a code comment, not a screen string; strike it if you prefer.
3. **The fRn and Fn sentence** in the GUIDE, "What Insights forecasts", after the paragraph's first sentence. The brief's lines **had not moved**: English `GuideContent.svelte:362`, French `:67`. Set as `<em>F</em><sub>1</sub>` and `<em>f</em><sub>R1</sub>` (the Learn page's own markup for fR1, `LearnContent.svelte:1354`), and « qu’<em>Ilya</em> » with U+2019.
   - **A discrepancy for Dann, not mine to decide:** the ratified English at `OPEN.md:3793` prints "Ilya" plain in both places ("the values Ilya reads", "Ilya follows"); the ratified French at `:3794` prints it in italics. Every other "Ilya" in the Guide is italic, in both languages, so in the English picture the new sentence stands out (`pictures-n200-step7/guide-forecast-en.png`). I copied it as ratified. If the English should be `<em>Ilya</em>` twice, that is two edits, and the pin in `n200-strings.test.ts` changes with it.
4. **`sources.ts`**: two entries.
   - `titze2017`: "Titze, Ingo R., Lynn M. Maxfield, and Megan C. Walker. “A Formant Range Profile for Singers.” *Journal of Voice* 31, no. 3 (2017): 382.e9–382.e13." with the DOI. **The first names and the DOI are not in `OPEN.md`**: I read them from the ratified Guide essay's reference list, `docs/sessions/draft-guide-fry-essay_r1_2026-09-30.md` line 20 ("Checked 2026-09-30"), and said so in the entry's `record`. **I did not open the DOI.**
   - `bozeman2013`: "Bozeman, Kenneth. *Practical Vocal Acoustics: Pedagogic Applications for Teachers and Singers*, 1st ed. Hillsdale, NY: Pendragon Press, 2013." No ISBN (none is in `OPEN.md`). The Vox Musicæ series number (9) is on the record and has no field in `Work`. The second edition (`bozeman2025`) is untouched.
   - Two code changes the format needed, both with tests: `Work.container` gains an optional `pages` (EN ` (2017): 382.e9–382.e13`; FR `, vol. 31, no 3, 2017, p. 382.e9–382.e13`); `frenchAuthor` set only the first and the last author's surname in capitals, so a three-author notice printed « Lynn M. Maxfield » in lower case, and now sets every author's (« TITZE, Ingo R., Lynn M. MAXFIELD, et Megan C. WALKER »). The registry test's `registered` set now reads every surname in a work's `author`, so "Walker 2017" and, in French, "Maxfield 2017" are known; before, the new sentence's citation failed it.
   - The Guide's Sources section lists both works by itself (pictures).
5. **The far-off [ɨ] message** (`OPEN.md:3800`, ratified 2026-11-13 15:29), key `calib.summary.outsideIgh` (the key name is mine: code convention, "the last segment names the concept"). **Seated, and nothing reads it yet:** the summary's third choice for [ɨ] is Step 5.10, which is not built (it waits on the desk's word after Step 4), so there is no screen to picture it on. The key index at the head of `i18n.ts` is updated (1,247 keys; `calib.` 100).

## Tests and the pins

- `n200-strings.test.ts` (new) pins every pair character for character: the four Resonance-profile strings and that no "formant profile" is left in them; « Reprendre » and the unchanged « Réessayer »; both Guide sentences in the Guide source, with the italics, the subscripts, and U+2019; the far-off [ɨ] message in both languages.
- Old pins changed with the text, in the same commit (CONTRACT 11a): `markup/subtitle.test.ts`, `insights/ratified-lines.test.ts` (`:410`, `:411`), `i18n.test.ts` (`:58`).
- `sources.test.ts`: the registry test's surname set, and four new reference tests (English and French).

## Pictures (all looked at), `docs/sessions/pictures-n200-step7/`, Chromium on the development server, 1440 wide

`lede-en.png`, `lede-fr.png` (the Calibrate welcome: "build a resonance profile", « un profil de résonances »); `summary-en.png`, `summary-fr.png` (the summary's rows: "Re-take" and « Reprendre »); `guide-forecast-en.png`, `guide-forecast-fr.png` (the new sentence in place); `guide-sources-en.png`, `guide-sources-fr.png`, `guide-sources-bozeman-en.png`, `guide-sources-bozeman-fr.png` (the two new entries; the Titze entry's page range breaks at its en dash in French at this width, which I left); `melody-subtitle-en.png`, `melody-subtitle-fr.png` (MELODY page 1, "RESONANCE PROFILE: A MAP OF DANN’S RESONANCES", « PROFIL DE RÉSONANCES : UNE CARTE DES RÉSONANCES DE LA VOIX « DANN » »; the French title in that picture is the score's own).

A line the Guide's sentence raised and I did not touch: in both languages the `<sub>` lines in the paragraph have a slightly taller line box than their neighbours (the same markup as the Learn page).

## The eight gates after Step 7

462; 248; 0 errors, 12 warnings (5 files); **5769 passed, 1 skipped (5770)** (+9 from 5760: `n200-strings.test.ts` and four reference tests in `sources.test.ts`); 785, 5 skipped; 178; 159; ratchets OK (814 files).

## Could not establish

- The DOI and the first names in `titze2017`: from the essay's list, not opened or checked against the paper in this session.
- The first edition's own ISBN and its author's middle initial: not in `OPEN.md`; the entry prints neither.
- Whether the far-off [ɨ] message reads well on the summary: no screen shows it yet.
- Whether the Guide's English should italicise "Ilya" in the new sentence (above).
