# Brief for Code: a Sources section in the Guide, from one list of works

**Desk brief r1, 2026-09-27. Shape: `BRIEF-TEMPLATE.md`.** Dann, 2026-09-27 00:59:
*"I think we will create a Sources section to follow the licensing and
acknowledgments section."* And 00:58: *"I want unassailable citation to preserve
our claims of scholarly fair use."*

## 1. What was observed

Ilya's works are cited in several places, each written by hand: the Guide's
"Licences and Acknowledgments" (`GuideContent.svelte:547`, French at `:270`),
Learn's prose, `NOTICES.md`, `README.md`, and the Insights comments' registry
(`apps/web/src/lib/insights/comment-sources.ts`, `WORKS`). On 2026-09-27 `NOTICES.md`
was found crediting Grayson to the wrong university, which no other copy repeated.
Hand-kept copies drift.

## 2. What is established

- `comment-sources.ts` holds five works with full records (`authorFull`,
  `fullTitle`, `year`, imprint): Miller 2004, Bozeman 2025, Reid 1975, McKinney
  1994, Howell 2025. It already formats a full reference (`:222`–`:227`) and
  sorts works by author (`:241`–`:245`).
- Works the app relies on and that registry lacks: Grayson 2012 (title page:
  University of Washington, full title in `NOTICES.md`); Mitton 2020 (cited in
  the Guide); Richter 2002 (`NOTICES.md`, and the Latin brief of 2026-09-26).
- The Guide's table of contents lives in `Drawer.svelte:811`.

## 3. Measure before you change anything

1. List every work Ilya cites in Learn, the Guide, the word explanations
   (`data/blurb-composer.json` cites Grayson by page), and Insights. Report each
   with its `path:line`.
2. Say where one registry of works can live so that Insights, the Latin table,
   and the Guide all read it (DESK DEFAULT: widen `WORKS` into a shared
   `apps/web/src/lib/sources.ts`; N.174 will settle its final folder).

## 4. The rulings this serves

Dann's words in the header. `CONTRACT.md` §6 and `AGENTS.md` "Scholarly integrity":
attribution is not optional.

## 5. Constraints

- **The Sources section renders from the registry,** never from hand-typed
  entries, so it cannot drift from the citations the app prints elsewhere.
- Place: directly after "Licences and Acknowledgments", in both languages, with
  its own entry in the drawer's table of contents.
- Grouped by what each work does for Ilya. Groups and headings are in section 6;
  the French was ratified by Dann 2026-09-27 01:02; drafted by the desk.
- Full references in one citation style, the style `comment-sources.ts` already
  prints. Nothing is shortened to fit.
- No git command that writes. **Displaces:** nothing scheduled.

## 6. The words. RATIFIED by Dann in both languages, 2026-09-27 01:02: *"Ratified, thank you Claude"*

| key (proposed) | English | French (draft) |
|---|---|---|
| heading | Sources | Sources |
| deck | Every work Ilya cites or builds on, in full, so that each claim can be checked at its page. | Tous les ouvrages qu’Ilya cite ou sur lesquels il s’appuie, en référence complète, pour que chaque affirmation puisse être vérifiée à sa page. |
| group: diction | Russian lyric diction | La diction lyrique russe |
| group: voice | The voice and its acoustics | La voix et son acoustique |
| group: texts | Song texts | Les textes chantés |

## 7. Done when

- The Guide shows Sources after Licences, in both languages, with every work from
  section 3's list, each in full.
- A test fails if a work cited anywhere in the app is missing from the registry.
- All eight ship gates and Playwright pass. `WRITTEN` on the code; `DONE` is
  Dann's walk of the section in both languages.

Report back with section 3's list, the commit, and what could not be established.
**NOT ESTABLISHED beats a complete invented answer.**
