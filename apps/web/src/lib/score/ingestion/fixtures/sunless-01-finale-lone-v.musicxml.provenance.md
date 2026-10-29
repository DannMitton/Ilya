# Provenance: sunless-01-finale-lone-v.musicxml

Written 2026-10-29 (brief r5 step 8).

**What it is.** A byte-for-byte copy of `sunless-01-engraved.musicxml` as it stood at `46f1d310` / HEAD before the repair (md5 `8341a301d78abcba62098cbcee764b62`; checked with `cmp` when copied). It is Sunless 1 as Finale printed it: «в» alone on bar 8's first note, every syllable after it one note late through bar 18, and a stray `#` alone on a note in verse 2 (bar 5 and a second). It breaks `CONTRACT.md` §0.1 on purpose, and is kept because the tests listed in `score/ingestion/fixture-rule.test.ts` (`ALLOWED`) were written for it: N.111's proof of the clitic seat needs the lone «в», and N.171's fold needs the lone `#`.

**Where it came from, and its edits.** Same as `sunless-01-engraved.musicxml.provenance.md`, to 2026-09-27. Not edited since. It is not repaired and is not compared with the extract.

**Do not use it for a new test.** Use `sunless-01-engraved.musicxml`.
