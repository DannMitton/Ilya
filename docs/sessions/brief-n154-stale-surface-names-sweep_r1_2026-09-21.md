# BRIEF N.154, English half. The sweep for strings that name a surface the singer cannot find

**Written 2026-09-21 by the desk, on Dann's instruction. Shape from `BRIEF-TEMPLATE.md`.**
**THIS IS A READ-ONLY AUDIT. You change no files and you write no code.**

---

## 1. What was observed

- **Dann, 2026-09-21, on N.132 closing:** *"Please add harmoizing the labels to N.131"*
  and, earlier the same evening, *"Please add a note to our plans to re-develop GUIDE,
  I bnet there are a ziullionplaces where we will need to update to these new names."*
- **Three strings found by hand in `i18n.ts` on 2026-09-21, after the N.132 ship:**
  - `:902` `upload.banner.reader` tells a singer to type the words "in Transcription",
    and « dans Transcription » in French. **The tab is called Text as of `5f7be82`.**
  - `:1181` `profile.scoreRegionAria` reads `Repertoire fit score` against
    « Partition annotée du répertoire ».
  - `:145` `a11y.paper` reads "Transcription" in both languages.
- **N.154's original seed, recorded in `SCHEDULE.md` week 5 on 2026-09-19:** `tab.fit`
  still reads "Fit", and `calib.welcome.lede` and `calib.welcome.fryAnswer` tell the
  singer *"Fit will measure your voice"* and *"Fit reads its resonances"*, **for a
  surface that no longer exists.**
- **All five were found by two greps for single words.** Nobody has swept the file.

## 2. What is established, each line carrying its `path:line`

Read in the tree on 2026-09-21, after the N.132 ship `5f7be82`.

- `apps/web/src/lib/i18n.ts` is **1542 lines and 614 keyed entries.**
- **The names as they now stand:**
  - `:105` `tab.transcription` = `{ en: 'Text', fr: 'Texte' }`
  - `:118` `tab.markedScore` = `{ en: 'Markup', fr: 'Annotation' }`
  - `:122` `tab.insights` = `{ en: 'Insights', fr: 'Aperçus' }`
  - `:57` `group.scoreMarkup` = `{ en: 'Voice', fr: 'Voix' }`, the drawer's band
  - `:108` `tab.fit` = `{ en: 'Fit', fr: 'Fit' }`, and `:115` records *"Fit is the
    tool's name and is invariant in French"*
  - `:107` `tab.guide`, `:106` `tab.learn` = `Learn` / « Leçons ». **Unchanged.**
- **The superseded names, which is what you are hunting:** "Transcription" as a tab,
  "Score markup", "Marked score", « Partition annotée », and "Fit" as a place a singer
  goes. `:112-113` records the « Partition annotée » supersession in the file itself.
- **`group.text` IS DELETED in both languages** (`:54-56`), N.115 increment 3, because
  Dann ruled the Text fold away 2026-09-10.
- **`Melody` / « Mélodie » was ratified 2026-09-13 and NEVER BUILT.** The band is
  `Voice` / « Voix » instead, by Dann's later ruling of 2026-09-20 under N.150.
  **So any string promising a Melody band is also stale.**
- All 59 `insights.*` entries have French differing from English (parsed 2026-09-21),
  so N.130's build is done and is **not** part of this sweep.

## 3. The method, because it is what bounds the cost

**Grep first. Do not read the file end to end.** Reading 1542 lines to classify 614
entries costs three to five times what this needs.

1. Grep the dictionary for each superseded name, in both the `en:` and `fr:` slots:
   `Transcription`, `transcription`, `Score markup`, `Marked score`,
   `Partition annotée`, `partition annotée`, `marquée`, `Melody`, `Mélodie`,
   and `Fit` / `fit` where it reads as a place rather than as a verb or a noun.
2. For each hit, read enough of the surrounding entry to see the whole string.
3. Classify it, and **do not fix it.**

**Search `apps/web/src/lib/i18n.ts` only.** The Guide and Learn prose
(`LearnContent.svelte` and its siblings) is **explicitly OUT OF SCOPE** and remains
Dann's `INBOX.md` note of 2026-09-21. Naming it out of scope is what keeps this one
agent inside its quote.

## 4. The rulings this serves

- **N.154, numbered 2026-09-19 on Dann's instruction:** *"we need to align all of our
  text with the actual evolved app."* Recorded in `SCHEDULE.md` week 5.
- **N.154's own freeze note, from the same record:** *"a string that names a surface
  the singer cannot find is Ilya telling a singer something false."* **It meets the
  freeze rule's exception rather than needing one.**
- **English first, then French**, from the same record, *"because the French cannot be
  verified against English that is itself stale."* **So this sweep reports both columns
  but proposes no French.** The desk drafts French and Dann rules on it (his ruling of
  2026-09-19); that is not this agent's job.
- **Thirty-five keys are named `fit.*`. That is cosmetic and is NOT in this item**, per
  the same record. Do not report key names, only string values a singer reads.

## 5. Constraints

- **READ ONLY. You write no file, you run no git command, and you change no code.**
  Not even an obvious one-word fix.
- **Search only `apps/web/src/lib/i18n.ts`.** See section 3.
- **Do not propose French.** See section 4.
- **Do not report `fit.*` key names.** See section 4.
- **Do not decide a borderline case.** "Transcription" as a common noun, meaning the act
  of transcribing, is correct English and stays. "Transcription" as a place the singer is
  sent is stale. **When the string could be read either way, classify it BORDERLINE and
  quote it. Dann decides those.** Guessing here is the one way this audit can do harm.
- **What this displaces:** nothing has started in `SCHEDULE.md` week 3. This pulls
  N.154's English half forward from week 5 and spends time the week 3 design rows would
  have had. Say if that trade looks wrong from the code's side.

## 6. Done when

You return **one table**, and nothing else, with a row per hit:

| key | line | slot (en/fr) | the string, quoted exactly | classification |

Classification is exactly one of:

- **STALE** — it names a surface the singer cannot find. Say which name it uses and what
  that surface is called now.
- **FINE** — the word appears but names nothing stale. One clause saying why.
- **BORDERLINE** — it could be read either way. Quote it and say what the two readings
  are. **Do not pick one.**

Then three counts: how many STALE, FINE, and BORDERLINE.

## 7. Report back

The table, the three counts, and **what you could not establish.**

**NOT ESTABLISHED beats a complete invented answer.**

**Return all of this as your final message. Do not write it to a file:** a new untracked
file in this repository blocks Dann's ship script, and the desk writes the memo.
