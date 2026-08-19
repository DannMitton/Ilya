# N.73: the ratified strings table, English and French

**Ratified whole by Dann, 2026-08-19 afternoon, every French word seen and
several improved by him in session. Ship as written; a change to any line goes
back to Dann first. Key names are Code's to choose; the words are not.**

| context | en | fr |
|---|---|---|
| the pair, document 1 | Transcription | Transcription |
| the pair, document 2 | Marked score | Partition annotée |
| the fifth station's label | Underlay | Répartition |
| slide, toward the end | Slide this syllable and everything after it, one note later | Décaler cette syllabe et toutes les suivantes d'une note vers la fin |
| slide, toward the start | Slide this syllable and everything after it, one note earlier | Décaler cette syllabe et toutes les suivantes d'une note vers le début |
| rotate, multi-select only | Rotate the selection | Permuter la sélection |
| portrait, enter the reading aid | Read | Lire |
| portrait, return to the page | The page | La page |
| the aid's label | Reading aid, not the page | Aide à la lecture, non la page |
| the mobile pull | Drawer | Tiroir |
| the aid's end mark | · end of verse 1 · | · fin du couplet 1 · |
| chapter kicker pattern | Chapter %s of %s | chapitre %s sur %s |

## The reasoning, recorded so nobody relitigates

- **« Partition annotée »** over « marquée »: the idiomatic francophone term
  for a score carrying working markings. Dann's correction.
- **« Répartition »** for Underlay: English names the result's position (text
  under the staff); French choral usage names the act (« la répartition des
  syllabes », allotting syllables to notes), which is what the station does.
  Adopted from choral usage, general knowledge, flagged as such; a francophone
  colleague's wince outranks this note.
- **« Décaler »** over « faire glisser »: « faire glisser » is the OS word for
  a drag gesture, and this is a shift command, not a drag. Finale's French
  localization says « Décaler les paroles », so singers may already own the
  word. « pousser » and « réaffecter » considered and declined.
- **« Permuter »** over « échanger » and « faire pivoter »: échanger swaps
  exactly two; rotate cycles the whole selection; and the implementation is
  ruled to be literally a permutation of a map.
- **« Tiroir »** stands: the Drawer was never renamed. Studio is the room; the
  Drawer is the tool panel inside it; the pull opens the panel.
- **« couplet »** over « strophe »: the singer's word for a song's verse, and
  neither word existed in `i18n.ts` before this table (grepped 2026-08-19),
  so the concept gets one word from birth. Noted faux ami: English "couplet"
  means two rhyming lines; the French word does not.

## Build notes that bind

- Typographic apostrophes (’) per the ruling of 2026-08-18 recorded in
  `i18n.ts` (so « d'une » ships as « d’une »).
- No string here carries a colon, question mark, or exclamation mark: the
  hard-space census does not move.
- Learn and Guide's link labels reuse their existing i18n keys; they are not
  in this table because they are not new.
- Case is sentence case in the strings; uppercase rendering, where the design
  wants it (station labels, the pull), lives in CSS.
