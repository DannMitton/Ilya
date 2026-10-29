# Provenance: n188-markings.musicxml

Written 2026-10-29 (brief r5 step 8).

**What it is.** A hand-written MusicXML (the file says so on line 2: "Written by hand for the tests; not a score"): one voice part, 8 bars, printed slurs, note markings, fermatas, and arcs, with a verse-1 lyric on some notes.

**Where it came from.** Written by hand for N.188. No converter, no source. Added 2026-10-20, `de9efa5c`, "N.188 (checkpoint): Markup draws printed slurs, note markings, and fermatas". No later commit touches it.

**Its only reader.** `packages/score-parser/src/n188-markings.test.ts` (`:34`). That test asserts slurs, fermatas, and arcs; none of its assertions reads a lyric's text.

**What it is checked against.** `apps/web/src/lib/score/ingestion/fixture-rule.test.ts`: it breaks one vowel per note at bar 1 («знь», no vowel) and bar 4 («в», no vowel). Neither is needed by the test that reads the file, so they are reported to the desk and the file is unchanged, as the brief directs; both are on the allow-list with that reason.

**What it is NOT checked against.** Any source or truth: none exists.
