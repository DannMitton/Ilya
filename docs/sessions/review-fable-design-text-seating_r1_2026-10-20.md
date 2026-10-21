# Review: the draft design for how Ilya seats text on notes, r1, 2026-10-20

Critic: Fable. Object: `../memory/OPEN.md`, "N.135 STAGE 3, HOW ILYA SEATS TEXT ON NOTES" (DRAFT, items 1 to 10), read in full with its record and the papers memo. No code written; one file created (this one).

## Lead

The tiers were believed to be mutually exclusive; as worded, a word that passes the dictionary and is one letter from the poem's word meets tier 2 and tier 3 at once, and N.163's own case («Го» for «То», `OPEN.md:2350-2385`) falls to tier 2 as the composer's word unless the tests are ordered, so the draft needs an evaluation order before ratification.

## Findings, ranked

### 1. Blocks. The tiers overlap and have no order

Point: tier 2's first test ("passes the dictionary after normalizing") is true of every tier 3 word of the first kind ("both real and one letter apart"). «Го» passed the dictionary (N.163: drawn with the gloss "go"), so tier 2 marks it as the composer's word, the outcome N.163 was ruled in to stop.
Evidence: item 6 wording; `OPEN.md:2350-2366`.
Better: evaluate tier 3 before tier 2, and write the order into item 6; tier 2 then reads "passes the dictionary and is more than one letter (or one confusion pair) from the poem's word".
Cost: one sentence; more spots flagged for the singer where the composer changed one letter, which tier 3 already accepts as its price.

### 2. Blocks. Strophic songs make default 11's line a false statement

Point: a strophic edition carries verse 1 under the notes and the later verses as a text block or stacked rows; the alignment labels them omitted, and Poem greys them under the ratified line "Greyed words are those left out of the song by the composer" (default 14 table). The composer left nothing out: a false statement, the test that admitted N.163.
Evidence: item 9 labels omissions from the alignment alone; nothing in the draft or defaults 1 to 14 names strophic form.
Better: when the sung text covers one stanza and the poem has several of equal line count, label the rest "later verses" and grey nothing; stacked rows under one staff route verse 1 to Lyrics and hold the rest. Whether Text transcribes later verses is a question for Dann.
Cost: a stanza detector (line count and rhyme, row 108) and one state; without it every strophic setting (Varlamov, Gurilyov, Koltsov texts) greys most of its poem.

### 3. Blocks. A melisma note and a missed word look the same to the reader

Point: default 8 widened says a note the reader found no word under takes the poem's aligned word. A melisma note also has no word under it. Filling it seats a syllable the composer did not set, which is the guess item 1 forbids.
Evidence: `OPEN.md:2817`; `pairings.ts:120-128` holds `melisma` as a decision the text never makes; `reseat.ts:24-27` "never writes melisma".
Better: fill a wordless note from the poem only when the reader saw an underlay row at that note's column with ink it could not read; a note with clean blank space under it, or under an extender line or slur, stays undecided for the singer's hand. Draw the boundary in item 1.
Cost: the reader must report "blank" against "unread ink" per note; NOT ESTABLISHED that it does today (no per-word confidence found: `grep confidence` in `apps/web/src/lib/score/ingestion` returns nothing; `pairings.ts:832` says a confidence that cannot be checked is not shown).

### 4. Change. "Occurs more than once in the song" is not evidence of a real word

Point: То/Го is a glyph-level confusion (N.163: a bar on one side of the stem); a repeated phrase in one engraving repeats the glyph, so the garble appears twice and tier 2 keeps it.
Better: drop the count test from tier 2; a repeated word still has to pass the dictionary or the table. Keep the count as a tie-breaker inside tier 3 only.
Cost: none in code; a repeated correct rare word falls to tier 3 and is shown, not applied, which is the safe side.

### 5. Change. Define gibberish by character set only, never by sequence

Point: "sequences Russian does not use" will catch correct rare words (consonant clusters, folk and dialect forms, Church Slavonic in Mussorgsky), and tier 1 then overwrites a correct word with no review but the count line.
Better: gibberish is a token containing a character outside the set {modern Cyrillic, ё, ѣ, і, ѵ, ѳ, ъ in any position, hyphen, apostrophe, combining acute}; mojibake is a Latin look-alike (a, c, e, o, p, x, y, 3, 0) inside a Cyrillic token. Nothing else.
Cost: a garble made only of real Cyrillic letters is not tier 1; it falls to tier 3 and the singer taps once.

### 6. Change. Item 2 reverses a built ruling and does not say so

Point: the draft cites `reseat.ts:7-11` for deletion only. The same header rules "An inserted word takes OPEN notes only, and never pushes the tail" and "It displaces nothing" (`reseat.ts:9`, `:39-43`), Dann's 2026-09-07 ruling, restated at `PRODUCT.md:613-633`. Item 2 revises it.
Better: say so in item 2 and have Dann ratify the revision by name. Cost: one line; otherwise Code meets two conflicting rulings and picks.

### 7. Change. A repaired word is invisible in Lyrics

Point: default 5 colours a word that differs from the poem. A tier 1 repair now matches the poem, so it draws in plain ink; its only trace is the count on Input's receipt line, which a singer working in Score markup never sees (`PRODUCT.md:534` is about surprise under the notes).
Ranked: (a) recommended: a repaired word carries one quiet mark (dotted underline, the provenance-frame pattern of `WordStack.svelte:110-116`) in Lyrics and under the notes; the receipt line stays as summary with Revert all; cost: a third word state, EN and FR labels. (b) As drafted; cost: a singer who never opens Input is surprised. (c) A review on arrival; cost: breaks "Ilya asks no question" (`PRODUCT.md:536-540`). Tier 3's "marks the spot gently" names no surface; (a) gives it one.

### 8. Change. The shipped table needs a conflict rule and a key

Point: a local confirmation persists on the device; a later build may ship or reject the same word, and which wins is unstated. The table has no key: «мгновенье» is correct against «мгновение» and a garble against another word.
Better: key entries by the normalized pair (poem word, scan word); a shipped entry supersedes a local one; a rejection removes it locally with one receipt line. NOT ESTABLISHED how a candidate leaves a device (no server in the records read); whatever travels with it (song title, device identity) is a privacy surface to rule on.
Cost: a small schema and one ruling.

### 9. Consider. The section 8 rewording catches existing storage

The proposed rule applies to `Pairing.ipa` (`pairings.ts:124`), stored today with no engine version. Inference: the rewording is right and exposes an existing debt. Cost: a version field on the pairing, or a named exception.

### 10. Consider. Compare letters, not strings

N.157's period («одинокая.» against «я») shows punctuation and case in the underlay. Say in item 6 that the tests compare normalized letters with punctuation, capitals, and hyphens stripped (THE LIMIT ruling, 2026-10-14, calls them orthographic).

### 11. Consider. Latin-script rows under the notes

A transliteration or singing translation under the Cyrillic gives two rows per staff; default 13 names a Latin row "beside a system" only. Rule: the Cyrillic row is Lyrics; a Latin row under it is held, never aligned (N.178 item 10).

## Blind spots the interview never asked, ranked

1. Strophic form and stacked verse rows (finding 2).
2. The reader's silence: blank, melisma, or unread (finding 3).
3. Instant reconciliation on every Poem keystroke: a half-typed poem word that passes the dictionary and is a confusion pair from a scan word triggers a tier 1 repair mid-typing. Rule: reconcile on the 600 ms pause the text path already uses (`OPEN.md:2283`, N.160 path 2), never mid-word.
4. Which edition the poem is: lieder.net's text may be a later redaction; a composer set an earlier one. Tier 3 catches a one-letter variant; a whole-word variant is tier 2 and correct. No action, named so Dann knows the limit.
5. Poetic truncations and clitics («иль», «средь», «чтоб», «ль», «б»): tier 1 is safe only if the confusion list holds substitutions alone, never deletions; otherwise «иль» from «или» is "reached by confusion" and overwritten. State it in item 6.
6. Undo scope: one Revert for all, one tap per word, and the device table's confirmation are three undo stacks; which one the browser's Undo touches is unstated.

## Could not establish

- Whether the dictionary holds the poetic and archaic forms the tiers rely on (three misses on record: QUEUE row 91, N.12, N.181).
- Whether the reader gives any per-word or per-note signal of doubt (none found in `apps/web/src/lib/score/ingestion`; not every reader file searched).
- How Ilya's syllabifier counts a poem word with a yod cluster («мгновенье» two or three syllables) and so whether "syllable count unchanged" is checkable on both sides.
- How a candidate spelling reaches Dann from a singer's device.
- Whether the two papers' accuracy transfers (the memo says so too; the measure on row 114's truth files comes first).
- What the Fremerey paper's "jumps only at block boundaries" means in a song with no printed repeat marks; row 108's phrase ends stand in and are unmeasured.
