# BRIEF. The page reader's status line, ruled by Dann 2026-09-22

**Shape from `BRIEF-TEMPLATE.md`, short because there is nothing to diagnose.**
**ONE KEY, TWO SLOTS. Both texts below are Dann's, ratified. Copy them exactly.**

---

## 1. What was observed

- **Dann waited about a minute on « Préparation du lecteur de page » 2026-09-22** while
  opening a stored scan, and asked whether it would always take that long.
- **The string it shows promises the opposite of what happens.** It reads
  *"Preparing the page reader. This will only happen once."* **N.166, established and
  measured by Code the same day, is that a stored scan re-runs the reader on EVERY load.**
  So the sentence is false today.
- **Dann ruled the replacement text**, English first and then the French, after the desk put
  two drafts and a French draft to him. **He edited both.**

## 2. What is established

- `i18n.ts:899` `upload.status.preparingReader` =
  `{ en: 'Preparing the page reader. This will only happen once.', fr: 'Préparation du lecteur de page. Cela n’arrivera qu’une fois.' }`
- **Two read sites, both in the same file:** `ScoreUploader.svelte:530` and `:556`.
- **No test asserts either text.** Searched `apps/web` for the key and for both sentences,
  **including `apps/web/e2e-phone/` and `apps/web/e2e/`**, on 2026-09-22.
- Code's measurement behind the new wording: after a reload of a ONE-page PDF the string
  showed from 3.8 s to 61.3 s; Dann's 23-page PDF read in 97.2 s once the reader had
  started. **So the start-up dominates and the per-page cost is small**, which is why the
  new text does not say a minute per page.

## 3. Measure before you change anything

1. **Confirm the key has exactly one definition** and the two read sites above are all of
   them.
2. **Report whether anything else in the tree promises the reader runs only once**, in
   either language. **Report only; do not fix it here.**

## 4. The rulings this serves

**Dann, 2026-09-22, the English, his own edit of the desk's draft:**

> Ilya is reading the notes off your page. Starting the reader might take about one minute, then a few seconds for each page of music after that.

**Dann, 2026-09-22, the French, his own edit of the desk's draft:**

> Ilya lit les notes sur votre page. Le démarrage du lecteur peut prendre environ une minute, et après quelques secondes par page de partition.

**What he changed, recorded because a ratification is not an authorship:** the desk drafted
*"takes about a minute"* and he made it *"might take about one minute"*; the desk drafted
« puis » and he made it « et après », mirroring the "after that" he had added to the
English. **The desk proposed « lit » over « relève » and « page de partition » over
« page de musique »; he kept both.**

**DESK DEFAULT, and the reason this needs no wait on N.166:** the new text **REPLACES** the
old, it does not join it. **The false "only once" promise disappears with the sentence that
carried it.**

## 5. Constraints

- **Replace both slots of `upload.status.preparingReader`. Change nothing else.**
- **Copy the French exactly, accents and all**, from section 4 of this file rather than
  from any paste.
- **Do not fix N.166 here.** It is numbered and its fix is a different path.
- **Do not touch `upload.banner.reader`**, the neighbouring string, which N.154 already
  shipped.
- **What this displaces: nothing.** It is one string.

## 6. Done when

- `upload.status.preparingReader` carries both texts from section 4, exactly.
- **No occurrence of "only happen once" or « n'arrivera qu'une fois » remains** for this key.
- Five gates at baseline.
- Section 3's two readings are reported.

**DONE is Dann's walk:** open a stored scan and read the line while it waits.

## 7. Report back

The commit, the results against section 6, both readings, and **what could not be
established.**

**NOT ESTABLISHED beats a complete invented answer.**
