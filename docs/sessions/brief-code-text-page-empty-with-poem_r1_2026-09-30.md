# Brief to Code: the Text page says "Enter your Cyrillic text" while the Input holds the poem

From the desk, 2026-09-30 23:30. Found by the desk walking Dann's library on the branch alias in his Chrome, after "A new version of Ilya is ready" was refreshed onto `93bc639` (the "Try another key" control was present, so the build was current). No git writes. Diagnose first; report the cause before changing anything.

## Observed (desk, 23:24 to 23:29)

- Song: "Without Sun, no. 1: Within Four Walls" (Mussorgsky), Dann's library, his own Chrome profile.
- Drawer, Input: the poem box shows the Russian poem (« Комнатка тесная, тихая, милая; … »), and its receipt reads POEM, 8 lines; the SCORE receipt is "Mussorgsky - Sunless 01 - Within Four W…".
- Markup draws the score with its underlay and transcription.
- **Text draws only the empty-state line, "Enter your Cyrillic text in the drawer on the left."**, page 1 of 1. It stayed so after 20 s, before and after the refresh.
- The poem in the box rendered in a lighter grey than typed text would (NOT ESTABLISHED whether it is the placeholder colour or the field's ordinary text colour).

## Why it matters

Ilya tells the singer something false: the drawer holds the text, and the page says to enter it. That meets the freeze rule's exception. It also breaks Dann's ruling of 2026-09-24 09:57 and 09:59: *"Text in the system must yield a transcription if that text populates Markup"* (`docs/memory/OPEN.md` §RULINGS HOMED FROM SESSION FILES).

## The work

1. Reproduce: a stored song with a poem restored from the library, Text tab. Name the cause with `path:line` (the derived text path the 2026-09-30 brief audit cites is `routes/+page.svelte:405-453`).
2. Report the cause and the smallest fix; then fix it and add a test that restores a song with a stored poem and asserts Text draws it.
3. Check the second observation: whether the restored poem is drawn in the placeholder style.

## Also, one string. RATIFIED by Dann 2026-09-30 23:21 (*"yes"*), desk-drafted

`insights.figure.halfMass` FR « la moitié du temps chanté » (replaces Code's proposal « la moitié du chant »); `insights.figure.centre` FR « centre » ratified as built. Rewrite the comment at `i18n.ts:1604` to carry the ratification. Check the longer label still clears the bars on Sunless 05 and T01 in French.

## Report

`docs/sessions/report-code-text-page-empty-with-poem_r1_2026-09-30.md`. Gates before and after. NOT ESTABLISHED beats a complete invented answer.
