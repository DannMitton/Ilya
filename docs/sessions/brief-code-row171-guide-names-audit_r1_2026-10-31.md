# Brief: row 171, the Guide names what is on screen today

r1, 2026-10-31, written by the desk (Opus) at Dann's request (20:08: "make updating old tab names and old controls part of a granular update audit brief. Plan the brief for Code to execute."). NOT Fable-reviewed. Lane: cloud, Sonnet. Row number provisional: GitHub's `Shane` ends at row 165, and rows 166 to 170 are drafts from 2026-10-31. Continues row 97 ("Fit out of the Guide", shipped `0b0c52a`), which left the walkthrough captions for a later row. **NOT ESTABLISHED beats a complete invented answer.** Every claim about the code carries the line the desk's research agent read on 2026-10-31 (`guide-formatting-review_r1_2026-10-31.md`, Tables B and C); re-read each line before changing it, because line numbers drift.

## What the singer meets, and why it matters

The Guide (`apps/web/src/lib/components/Reading/GuideContent.svelte`; French about lines 15 to 300, English about 310 to 600) tells a singer to press controls and open tabs that no longer exist. A disoriented singer follows the Guide to the letter; every outdated name is a dead end. Examples: "Return to the Transcription tab" (the tab is **Text**, `tab.text`, `i18n.ts:186`); "click Transcribe" (no component reads `input.transcribe`, `i18n.ts:258`); "four tabs ... Transcription, Fit, Learn, and Guide" (Fit was retired at N.174, `i18n.ts:181-185`).

This row brings every name in the Guide into line with the interface as `Shane` renders it. It is not the Guide rewrite. The walkthrough section will later be replaced by task units (walkthrough brief, "Guide architecture"); until then it must not send a singer to a control that is gone.

## Scope

- **In:** every tab name, drawer band, station, field, button, checkbox, toggle, and message that the Guide names, in English and French, in prose, captions, and image alt text.
- **Out:** new screenshots (the shot list is a separate production); rewriting the walkthrough's structure; Learn (one French line only, see step 5).
- **Depends on row 170** (Markup becomes "Melody" / « Chant », ratified by Dann 2026-10-31 20:07; keys unchanged). If row 170 has landed, the Guide uses the new names; if not, use today's ("Markup" / « Annotation ») and leave a one-line note in the report.

## The French rule for this row

Dann's ruling (2026-09-19, in memory): French arrives as a marked draft for him, never committed unseen. So:

- A French change that **substitutes a current label verbatim** from `i18n.ts` (for example « Transcription » to « Texte », « Effacer le texte » to « Retirer ») is applied, citing the key and line.
- Any French that needs **new wording** is written in the report as a marked draft, with the glossary source named (`i18n.ts` key or the Guide's own French), and left out of the commit.

## Steps (one commit and one report each)

**Step 0, the census, change nothing.** Grep `GuideContent.svelte` for every name in the "retired names" list at the end of this brief, in both languages, prose and alt text. Report a table: line, language, current text, current label with its `i18n.ts` key and line, and which step fixes it. Add anything the grep finds that Table B missed.

**Step 1, verbatim label substitutions.** Where the Guide names a control whose label has only changed, substitute the current label in both languages:

| Finding | Old | Current label and key |
|---|---|---|
| B-3 | "Transcription tab" / « l'onglet Transcription » | Text / Texte, `tab.text` (`i18n.ts:186`) |
| B-10 | « module APPRENDRE » (French only) | Leçons, `tab.learn` (`:187`) |
| B-11 | LEARN, LEÇONS, GUIDE in capitals | Learn / Leçons / Guide (`:187-188`); case only |
| B-16 | loose field names | "Aria or song title" (`meta.title`, `:274`); "Opera, song cycle, opus number" (`meta.opus`, `:277`); « Compositrice ou compositeur » (`:275`) |
| B-17 | "Exporting a song" / « Exporter un chant » | Export this song / Exporter ce chant, `binder.export` (`:1569`), in Export and import / Exportation et importation (`binder.heading`, `:163`) |
| B-9 | "the Dictionary tab", "the My assignment tab" | buttons, not tabs: **Dictionary** / Dictionnaire (`inspector.dictionary`, `:703`); **My assignment** / Mon choix (`inspector.stressAssign.myAssignment`, `:738`). English: "tab" becomes "button". French: draft only |
| B-15 | the toggle "showing English and Français options" (alt text) | the button shows one name, the other language's (`HeaderBar.svelte:23-24`, `:56`). English alt rewritten; French alt drafted |

**Step 2, sentences that need new wording.** Each describes a control or layout that no longer exists, so a substitution will not do. Code drafts the English in the Guide's existing voice and the house style (`docs/house-style/SKILL.md`), applies it, and flags each in the report for Dann's reading; French as marked drafts only.

| Finding | What the Guide says | What is true now |
|---|---|---|
| B-1 | three drawer sections, "Metadata, Analysis, and Notation" | bands **Piece** / Pièce (`group.piece`, `:135`), **Input** / Entrée (`group.input`, `:144`), **Voice** / Voix (`group.scoreMarkup`, `:139`); **Notation** (`cosmetic.heading`, `:286`) and **Analysis** (`console.placeholder`, `:882`) are stations inside Input |
| B-2 | "four tabs ... Transcription, Fit, Learn, and Guide", at the bottom | tabs **Text**, **Markup** (or Melody, row 170), **Insights** (`:186`, `:197`, `:201`), with **Learn** and **Guide** as links beside them (`DeskHead.svelte:115-131`). RULED by Dann 2026-10-31 20:11: "Fit was Shane, synonyms". The voice-analysis documents were developed under the codename Shane and shown on screen as Fit until 2026-09; N.174 (2026-09-27) renamed them Text, Markup, and Insights (`AGENTS.md:11-13`). So the Guide's "Fit" becomes the pair **Markup** (Melody, if row 170 has landed) and **Insights**. Do not say "at the bottom": NOT ESTABLISHED |
| B-4 | fields "called Metadata in Ilya" | `meta.heading` has no reader (`:273`); the fields sit in **Piece** |
| B-5 | "click Transcribe" | no Transcribe button; Ilya transcribes after a pause, and Cmd+Enter or Ctrl+Enter skips the pause (`IntakeViews.svelte:213-219`). Seen 2026-10-31: the Paper fills as the singer types |
| B-6 | "Clear text" / « Effacer le texte » | `input.clear` unused since N.108 (`:259-262`); buttons read **Clear** / Retirer (`intake.clear`, `:846`), one per receipt (`IntakePanel.svelte:451-454`, `:459-463`). DESK DEFAULT: "start fresh" means the poem receipt's |
| B-7 | the Drawer Handle, "the semicircle at the centre left" | no handle on the desk (`Drawer.svelte:181-185`, `:884-886`); on a phone, a bar reading **Drawer** / Tiroir or **Paper** / Papier (`:887-900`; `drawer.pull`, `:206`; `drawer.paper`, `:115`) |
| B-8 | a checkbox "Spot reconstitution" / « Reconstitution ponctuelle » | the label swaps with the global setting: "Spot reduction" or "Spot reconstitution"; « Réduction ciblée » or « Reconstitution ciblée » (`InspectorPanel.svelte:58-62`); drawn at the word stack's edge (`:1010-1023`). Describe both states |
| B-12 | toggles named descriptively | each toggle's paired labels (`:287-300`); name the label the singer sees, e.g. **No stress marks** / **Apply stress acutes** |
| B-13 | "the Drawer's Analysis Word Stack" | the station **Analysis** (`:882`) |
| B-14 | "Word Stack", "Ribbon", "Inspector" | no on-screen label uses them. RULED by Dann 2026-10-31 20:13. **Ribbon** is defunct: retire it. **Word Stack** stays, italic where it is defined, and the Guide shows it with a screenshot detail with the stack's structure encircled (a new annotated shot, S06-D, in the shot list). **Inspector** is the **Analysis** pane: the syllable breakdown, the letter legend, and controls that appear by context (syllable stress, reconstitution). RULED by Dann 2026-10-31 20:17: "Inspector is now the Analysis pane." The Guide calls it **Analysis**, its on-screen label, with no new header, and retires "Inspector" from singer-facing text outside Contributors |

**Step 3, the ratified text convention**, after steps 1 and 2 settle the wording. Apply Table A of `guide-formatting-review_r1_2026-10-31.md` (26 French rows, 29 English), re-read against the new wording: places bold; buttons bold with the chip class (row 169 builds the class; until then, `<strong>` with `class="ui-button"`); Ilya's messages in quotation marks; defined terms italic on first use; directives plain. Dann's governing principle: "We are looking to be helpful to a potentially disoriented user. We are not looking for the Draconian imposition of formatting rules for their own sake." Where a rule clutters a sentence, leave the sentence. Existing bold on `[#]` (FR 84, EN 380) becomes `<code>`, RULED by Dann 2026-10-31 20:18; the licences run-in headings (FR 285-305, EN 581-592) stay bold, DESK DEFAULT, since that section names no interface element.

**Step 4, hygiene.** Remove em dashes in user-facing copy (C-9: FR 94, 195, 260, 262, 266, 274; EN 390, 491, 556, 558, 562, 570), splitting sentences per the house style; French splits are drafts. Fix nested `<em>` in the Game Changer note (C-7, FR 256, EN 552). Curly quotation marks for "in the style of" (C-10, EN 355). *Ilya* in italics in the export paragraph (C-12, FR 305, EN 592).

**Step 5, one Learn line.** RATIFIED by Dann 2026-10-31 20:09 (« romance russe », "where ever you see fit if it sounds like me"), per his convention that art song takes its nationality's name (French *mélodie*, German *Lied*, Russian *romance*): `LearnContent.svelte:2031`, « la mélodie russe » becomes « la romance russe ». Apply. If the census in step 0 finds other French places that name Russian art song, list them as drafts; do not change them in this row.

**Step 6, the guard.** Extend the existing guard of row 97, `apps/web/src/lib/no-fit-name.test.ts` (shipped `0b0c52a`, 2026-10-14), rather than adding a second one: it already reads the Guide as source and splits the languages. Remove its two `KNOWN_FIGCAPTIONS` exceptions (its header says "the desk drafts new captions for Dann's ruling in a later row"; this is that row), and add every name in the retired list below, in prose, captions, and alt text, so the Guide cannot drift again unnoticed. **Exempt the Contributors section** (FR about 202 to 278, EN about 498 to 575): Claude's and Kimi's credits name "the Inspector's syllable-level Ribbon" and "the Inspector's interaction grammar" (FR 262, 272; EN 558, 568) as history of the build, not as screen labels. DESK DEFAULT: those credits stay as written.

**Step 7, the measure.** Screenshots of every Guide section in English and French, phone (390 × 844 at 3×) and desktop (1440 × 900 at 2×), from the preview, with the headless capture method in the storyboard doc ("Capture method"). Report which captions now sit under screenshots that still show the old interface (they stay until the shot list replaces them).

Gates at baseline; no push to `Shane` or `main`; nothing under `docs/memory/`.

## Retired names (the guard's list)

English: "Transcription tab", "Fit" as a tab, "Ribbon", "Inspector", "Metadata" as a section, "Transcribe" as a button, "Clear text", "Drawer Handle", "semicircle", "Analysis Word Stack", "Dictionary tab", "My assignment tab", "LEARN", "Score markup". French: « onglet Transcription », « Fit », « Ruban syllabique », « Inspecteur », « Métadonnées » as a section, « Transcrire », « Effacer le texte », « poignée », « demi-cercle », « APPRENDRE », « LEÇONS » in capitals, « Partition annotée ». If row 170 has landed, add "Markup" and « Annotation » as tab names.

## Owner decisions, collected (Dann rules before Code starts the step that needs each)

1. B-2: RULED 2026-10-31 20:11, "Fit" was Shane: now Markup and Insights.
2. B-6: DESK DEFAULT, Dann's to overrule: "start fresh" means the poem receipt's **Clear**, the only receipt a singer has before a score.
3. B-14: RULED 2026-10-31 20:13: Ribbon retired; Word Stack kept and illustrated; Inspector is Analysis.
4. Step 3: RULED 2026-10-31 20:18, the octothorpe needs no bold: `[#]` is set in code type (FR 84, EN 380). DESK DEFAULT for the Licences run-in headings: they stay bold, because that section names no interface element, so bold cannot be mistaken for a place or button there.
5. C-1: RULED by Dann 2026-11-01 11:25: "Treat the English appropriately and likewise the French. No needless doubling. The goal is to help users in the language of their choice, not to impose robotic repetition in translation." The French usage list (FR 291-300) stays French-only; the English Language sentence (EN 587) stays as written. Applies to every parity finding in this row: each language is judged on whether it serves its own reader, not on whether it mirrors the other. Asymmetry is a finding only where a reader of one language misses something they need (for example C-4: the French never explains custom glosses).

## What the desk could not establish

Whether the tab bar sits at the bottom of the screen on any device; whether the Voice band shows without the build wall (`PUBLIC_INCLUDE_MARKUP_INSIGHTS`, `apps/web/.env:1`); what the walkthrough images show (not opened; captions for steps 25, 32, and 35 disagree with their alt text, C-4 and C-5); who coined "Word Stack", "Ribbon", and "Inspector".
