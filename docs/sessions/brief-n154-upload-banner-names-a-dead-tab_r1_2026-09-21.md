# BRIEF N.154, first fix. The picture banner sends a singer to a tab that no longer exists

**Written 2026-09-21 by the desk. Shape from `BRIEF-TEMPLATE.md`.**
**ONE KEY, TWO SLOTS. Do not widen it.**

---

## 1. What was observed

- **A read-only Sonnet sweep of `i18n.ts` on 2026-09-21** returned 5 STALE rows across 3
  keys. Memo: `memo-n154-stale-surface-names-sweep_r1_2026-09-21.md`.
- **The desk then read the tree and reduced those 3 keys to 1.** `a11y.paper` went to
  N.131 as a naming decision Dann has already filed there;
  `profile.scoreRegionAria` was over-classified by the sweep and is left alone, with the
  reasons in the memo. **This brief is the one that survived.**
- **What a singer sees now, after the N.132 ship `5f7be82`:** upload a picture of a
  score, and the banner says *"The words are not in a picture; type them in
  Transcription."* **There is no Transcription tab. It is called Text.**

## 2. What is established, each line carrying its `path:line`

Read in the tree on 2026-09-21, after `5f7be82`.

- `i18n.ts:902` `upload.banner.reader`:
  - `en`: `Read from a picture. Ilya worked the notes out from the ink, so check them
    against your own paper before you trust them. The words are not in a picture; type
    them in Transcription.`
  - `fr`: `Lu à partir d’une image. Ilya a déduit les notes de l’encre, alors
    vérifiez-les sur votre propre partition avant de vous y fier. Les paroles ne sont pas
    dans une image; saisissez-les dans Transcription.`
- **The tab's ratified names, already in the tree:** `i18n.ts:105` `tab.transcription` =
  `{ en: 'Text', fr: 'Texte' }`, shipped in `5f7be82` and walked by Dann the same evening.
- **There is no `transcription` surface name left for a singer to read.**
  `destinations.ts:47` keeps `transcription` as a WIRE id only, and `:19-21` records that
  the ids are written to `localStorage` under `ilya:activeTab`, so **the id must not
  change.** Only the word a singer reads changes here.
- **The sweep found no other value-level hit** for a superseded surface name in the
  dictionary's 614 entries. See the memo.

## 3. Measure before you change anything

Report these before writing code.

1. **Confirm there is exactly one occurrence of the word in each slot** of
   `upload.banner.reader`, so the edit is by anchor on a single match per language.
2. **Report whether any test asserts this string**, in any test directory, **including
   `apps/web/e2e-phone/`**. The desk's §2 in the N.132 brief said no test asserted the
   old tab strings and was WRONG: `e2e-phone/loupe-scan.test.ts:67` did, and Code caught
   it. **That directory is outside the desk's habitual grep and this is the correction.**
3. **Report whether `upload.banner.reader` has a sibling banner** for the PDF or MNX
   intake paths that names a tab the same way. If one exists, report it and **do not fix
   it in this ship**; it becomes its own row.

## 4. The rulings this serves

- **N.154, numbered 2026-09-19 on Dann's instruction:** *"we need to align all of our text
  with the actual evolved app."*
- **N.154's freeze note, same record:** *"a string that names a surface the singer cannot
  find is Ilya telling a singer something false."* **This is that item's first case that
  is false rather than merely stale.**
- **`Text` / « Texte » was ratified by Dann 2026-09-13** and walked by him on the live
  build 2026-09-21. **No new French is written in this ship:** the French substitution is
  a ratified name going into an existing sentence.
- **English first, then French** (`SCHEDULE.md` week 5) does not gate this one, because
  the French change is the same ratified noun and carries no new translation.

## 5. Constraints

- **ONE KEY: `upload.banner.reader`. Both slots. Nothing else.**
- **Do not touch `a11y.paper`.** Dann filed it in N.131 on 2026-09-21 as a naming
  decision. Picking a value for it here would put a word in his mouth.
- **Do not touch `profile.scoreRegionAria`.** The memo says why. `i18n.ts:1392` cites it
  as house vocabulary.
- **Do not touch `tab.fit`**, which is a dead key, or any `fit.*` key name. N.154's own
  record puts those out of scope as cosmetic.
- **Do not change the `transcription` wire id** in `destinations.ts` or anywhere else.
  It is in every singer's `localStorage`.
- **Do not rewrite the sentence.** Replace the tab's name and leave every other word,
  including the semicolon, exactly as it is.
- **What this displaces: nothing.** It is minutes, and `SCHEDULE.md` week 2 is closed.

## 6. Done when

**WRITTEN:**

- `upload.banner.reader` `en` reads `…type them in Text.`
- `upload.banner.reader` `fr` reads `…saisissez-les dans Texte.`
- Five gates at baseline.
- The three readings from section 3 are reported.

**DONE is Dann's walk:** upload a picture of a score, in both languages, and read the
banner.

## 7. Report back

The commit, the results against section 6, the three readings, and **what could not be
established.**

**NOT ESTABLISHED beats a complete invented answer.**
