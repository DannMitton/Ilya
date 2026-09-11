# Brief: read-only anchor memo for the path pass, increment 2

Written by the desk 2026-09-10 22:30 after Dann's walk of `a584ad8` on the branch
alias at 1400 px and at 390 px. For a fresh Sonnet session. Paste this whole
file as the first message.

## 0. Ground rules

- You are READ-ONLY. You change no file, run no build, run no git command, and
  install nothing. Reading and grepping the tree is the whole job.
- Repository: `~/Desktop/ilya-rewrite`, branch `Shane`, HEAD `0f7e89d` or later.
  Do not check out anything.
- Every claim carries a `path:line` you opened in this session, or the words
  NOT ESTABLISHED. No fourth form. Do not describe a file from a grep hit; open
  it.
- **NOT ESTABLISHED beats a complete invented answer.**
- The previous memo of this kind is
  `docs/sessions/memo-anchors-path-pass_r1_2026-09-10.md` (86 lines). Read it
  first; it names the band and station files. The Code memo for the ship is
  `docs/sessions/memo-path-pass_r1_2026-09-10.md`; read its §9.
- Do not propose designs. The design is ruled. You find where each finding
  lives in the tree so that a Code session can be briefed with anchors.

## 1. What was walked and what was seen

The path pass (`a584ad8`) gave the drawer's front side four bands, PIECE,
INPUT, TEXT, SCORE MARKUP, each with a chevron and, when closed, a one-line
state under the band. Dann walked it in a fresh incognito profile. Findings:

F1. **Square corners on a closed band.** At 1400 px, after closing INPUT by
its chevron, the band's top corners rendered square while the state line under
it kept its rounded corners; the same on SCORE MARKUP at rest, untouched. A
reload cleared it. At 390 px it did not appear. Find the CSS that rounds the
band and its state line, and anything that could override or clip it on a
state change (a transition, an `overflow`, a wrapper that takes the radius
only in one state).

F2. **TEXT folds into INPUT.** Ruled by Dann 2026-09-10 22:00, on trial: the
TEXT band (Notation toggles and Analysis) stops being a sibling band and
becomes a section inside INPUT, under the poem box, closed by default. Find:
where the four bands are declared and ordered; where TEXT's contents are
rendered (`NotationFields.svelte`, and whatever renders Analysis); what state
store holds band open/closed (the previous memo names
`sections.svelte.ts:54`); and what would have to move for TEXT's contents to
render inside INPUT's open body. Name every file that would be touched.

F3. **TEXT's default state line.** Ruled by Dann 2026-09-10 21:55: nothing
under TEXT at default; `n of 7 changed` only once a toggle has moved. Find
where the string `Grayson defaults` comes from (the i18n key and the site that
chooses it) and where the changed-count is computed. Under F2 the line may
vanish altogether; still report the anchors.

F4. **Bands open themselves on score arrival.** After `Continue to analysis`
on a dropped `.musx`, PIECE opened with all five fields and TEXT opened with
Notation and Analysis, and INPUT stayed open. The brief for the ship
(`docs/sessions/brief-path-pass_r1_2026-09-10.md` §3) expected closed bands
with state lines. Find every site that sets a band or station open as a side
effect of a score arriving or of the analysis tab being chosen.

F5. **`from score` missing on one arrival.** The Kabalevsky `.musx` arrival
filled PIECE's line with title and composer but no `from score` tag; the
Mussorgsky `.musicxml` song in Dann's own library shows the tag. Find where
the tag is decided and what condition it depends on. Say whether the
condition could differ between a `.musx` (via the MNX conversion) and a
`.musicxml` arrival. Do not guess; if the answer needs a run, say so.

F6. **INPUT's line is short on the Score markup tab after reload.** After
Cmd+R with the Score markup tab active, INPUT's closed line read `14 lines`
alone; switching to the Transcription tab, it read
`14 lines · 78 words · 0 / 146 placed`. Find where the three parts of that
line are computed and which of them depend on a value that exists only after
transcription or only on one tab.

F7. **Two filled buttons in INPUT after a drop.** After the `.musx` drop and
before `Continue to analysis`, INPUT showed `Continue to analysis` (filled) and
`Transcribe and fit` (filled) at once, plus `Try another file`. Find where each
of the three is rendered and what condition fills each. Also, for N.121(c):
state exactly what the `Transcribe and fit` handler does today, step by step
with lines, given that text transcribes live (N.112). Do not rename anything.

## 2. Definition of done

A memo at `docs/sessions/memo-anchors-path-pass-inc2_r1_2026-09-10.md`, under
120 lines, with one section per finding F1 to F7, each holding: the anchors
(`path:line`, opened), one sentence on what the code does there, and, where
the brief asks, the list of files that would be touched. Then a final
section **NOT ESTABLISHED** listing everything you could not settle by
reading, each with what would settle it (a run, a browser observation, a
ruling). An empty NOT ESTABLISHED section is a red flag, not a success.

## 3. Constraints

- Do not edit, build, commit, or stage anything. Writing the memo file is
  the only write.
- Do not open `docs/memory/INBOX.md`.
- Do not read more than you need: the previous two memos, then the files they
  name, then greps from there.
- If line numbers in the previous memo no longer match, say so and give the
  current ones.

## 4. Return format

Reply in the chat with the memo's path, its line count, and the NOT
ESTABLISHED section pasted verbatim. Nothing else.
