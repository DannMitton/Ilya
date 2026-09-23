# CODE BRIEF. Two fixes to the r2 tessituragram (N.123 part 1)

**Written by the desk 2026-09-23 03:40. For Claude Code in `~/Desktop/ilya-rewrite`, branch `Shane`, working tree uncommitted on top of `0ccda31`.** It continues `docs/sessions/brief-code-tessituragram_r2_2026-09-23.md`, and your memo `memo-code-tessituragram_r2_2026-09-23.md`. Everything there holds.

**NOT ESTABLISHED beats a complete invented answer.** Rules of the house as in r2.

## 1. Sunless 2's pitch names read an octave low

**The evidence (desk, read 2026-09-23):**

- Your memo names Sunless 2's rows C♯2 up to E♭3, with ledger lines down to A1.
- The fixture's voice part is P1 in `tools/e16-harness/output/mussorgsky---sunless-02---you-did-not-recognize-me/mxl_extract/score.musicxml`. It spans A2 to E♭4 by its `<octave>` values, in a G clef with `<clef-octave-change>-1</clef-octave-change>` (treble-8vb).
- Dann's dissertation gives the song as A2 to E♭4 (printed p. 92).
- Sunless 1, which isn't in an octave clef, names correctly.

**The cause is NOT ESTABLISHED.** DESK INFERENCE, offered only as a place to start: the octave clef's shift may be applied twice somewhere between the parsed pitch and the row's name or position. **Find the cause, and cite the `path:line`.**

**Fix it where it starts,** so the names, the row positions, the compass notes, and the ledger lines all agree with the parsed pitch.

**Check the rest of Insights too.** Say whether the fit table's compass, the tessitura, the passaggio shares, and the findings' pitches on Sunless 2 were ever affected, before your change and after it.

**Add a test** that runs a treble-8vb vocal line through the figure's model and asserts its lowest and highest row names.

## 2. The vowel chart without a tempo

**RATIFIED by Dann 2026-09-23 03:39 (desk-offered):** when the tempo state is `none`, the vowel chart's heading is "Share of phonation per vowel" / « Part de la phonation par voyelle ».

Add it as `insights.phonation.byVowelShare`, DESK DEFAULT name. French typography as the file does it. With a tempo, the heading stays "Seconds of phonation per vowel".

## Done when

- The gates are at baseline, or moved only by the tests you added, each one named.
- Seen rendered, in both languages:
  - Sunless 2's rows named A2 to E♭4, with its accidentals an octave above what r2 showed
  - Sunless 1 unchanged
  - a no-tempo score showing the share heading
- Dann walks it on the alias.

## Return

A memo of at most 200 words, with a section headed "NOT ESTABLISHED", saved as `docs/sessions/memo-code-tessituragram-fix_r1_<date>.md`.
