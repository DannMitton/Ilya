# Report: Insights Further reading, step 3 (strings) (r1)

Brief: `brief-code-insights-further-reading_r2_2026-11-03.md`, step 3, with review amendments 2 and 11. Branch `cloud-lane-33`, built on `a140983`.

The strings were added where they are used (the opening sentence in step 1, the topic line in step 2), exactly as the brief gives them, each marked as a draft in `apps/web/src/lib/i18n.ts` (comments above `insights.r2.otherApproaches.*` and `insights.r2.readingTopic*`). This step adds one thing: `apps/web/src/lib/insights/draft-strings.test.ts`, which pins all six values, English and French, and states in its header that they are desk drafts Dann has not ratified. When he rules, the file changes with the strings (`CONTRACT.md` §1 item 11a).

## The strings (for Dann to rule on; nothing here is ratified)

| Key | English | French |
|---|---|---|
| `insights.r2.otherApproaches.one.a` | There is another way in. | Il existe une autre approche. |
| `insights.r2.otherApproaches.one.b` | You can also come at it differently. | On peut aussi s’y prendre autrement. |
| `insights.r2.otherApproaches.many.a` | There are other ways in. | Il existe d’autres approches. |
| `insights.r2.otherApproaches.many.b` | You can also come at it differently. | On peut aussi s’y prendre autrement. |
| `insights.r2.readingTopic` | [{vowel}] on {pitch}, bar {bar}: | [{vowel}] sur {pitch}, mesure {bar} : |
| `insights.r2.readingTopicNoPitch` (my addition, not in the brief) | [{vowel}], bar {bar}: | [{vowel}], mesure {bar} : |

Which words are coined and which adopted (`CONTRACT.md` §5, §7):

- **Adopted:** « mesure {bar} » from `insights.r2.unlikely.range` (`i18n.ts`); the pitch format (`pitchName`, letter and American index); « d’autres » and « aussi » are ordinary French, not coined terms.
- **Coined by the desk, in the brief:** all four opening sentences, English and French, and the topic line's English. The French avoids « piste » because opener 4 uses it (`i18n.ts`, `comment.opener.4`).
- **Coined by me, in this lane:** `readingTopicNoPitch`, in both languages, a fallback for a note with no pitch to name. Dann may strike it. `pitchOf` returns '' where the note has none, so it should be rare; I did not establish that it never occurs.

French checked against its referent: « Il existe une autre approche » and « Il existe d’autres approches » agree with « approche(s) » (feminine, singular and plural). « On peut aussi s’y prendre autrement » has no agreement. In the topic line « [u] sur A3 » names a vowel by its bracket, with no adjective to agree. OQLF typography: a no-break space (U+00A0) before the colon, and the test checks it. Typographic apostrophes (’) as the file uses.

Decision left to Dann, not made by me: the same sentence ("You can also come at it differently.") serves variants `one.b` and `many.b`, as the brief gives them. The count (one or several approaches) is therefore not audible in variant b. I kept it as given.

## Review amendment 11, the `lean` exception

`lean` prints no short citation when hidden (`comment-text.ts`, `cite: false`). The step 1 test "keeps every hidden suggestion's short citation" excludes it and a separate test forces a hidden `lean` to show that it prints none and adds no printed row.

## Tests and the eight gates

`draft-strings.test.ts` adds 8 tests (six values in both languages, no « piste », the no-break space before the colon, no em dash). Gates at the end of step 3: see the table.

| Gate | Step 0 | Step 3 |
|---|---|---|
| phonology | 407 | 407 |
| dictionary | 248 | 248 |
| web-check | 0 errors, 12 warnings, 5 files | 0 errors, 12 warnings, 5 files |
| web-test | 3927 passed, 1 skipped | 3959 passed, 1 skipped |
| score-parser | 785 passed, 5 skipped | same |
| blurb | 148 | 148 |
| integration | 98 | 98 |
| ratchets | OK | OK |
