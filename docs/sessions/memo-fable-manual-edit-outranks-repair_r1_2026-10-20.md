# Memo: where "a manual edit always outranks an automatic repair" misleads a singer, r1, 2026-10-20

Consultant: Fable. Object: the rule over all of `OPEN.md` "N.135 STAGE 3, HOW ILYA SEATS TEXT ON NOTES" (`OPEN.md:2823-2829`), read with its record (`draft-text-seating-design_r1_2026-10-20.md`, last 60 lines), my critique r1, `reseat.ts:1-50`, `PRODUCT.md:530-542` and `:613-641`, `pairings.ts:60-132` and `:385-480`, `placement-scope.ts:1-40`, `undo-history.svelte.ts:1-25`, and `WordStack.svelte:105-120`. No code written; one file created (this one). Nothing here is a ruling.

## Lead

The rule survives as a default on one reading only: "outranks" means a repair never replaces a hand edit, and nothing more; the desk's two extensions (no mark on a hand-edited word, and Undo as the only remedy) do not survive, because a hand word can be a non-word with no reader left to catch it, and Undo is empty after a reload (`undo-history.svelte.ts:18-23`).

## What "manual edit" has to mean first

The tree stores no provenance on a word or a seat: `Pairing` carries `kind`, text, IPA, vowel, and `origin` (`pairings.ts:119-128`), and the loupe's write path saves the whole map with no mark of whose hand made the seat (`placement-scope.ts:8-11`). So "outranks" needs a new stored fact, hand or not, on each Lyrics word and each seat, kept with the document across reloads. Every case under this heading assumes that fact exists; without it the rule is unenforceable and the desk's reading is a wish. Cost: one field on the word and one on the pairing, with a migration (NOT ESTABLISHED what the library's migration path requires; `library/migration.ts` not read).

## Cases, ranked

### 1. BLOCKS. A hand edit that leaves a non-word, with no mark

Situation: the singer retypes «Го» as «То» and hits a neighbouring key, or pastes a word with a Latin «o» inside it. The absolute: no repair, and by the desk's reading no tier 3 mark either, so a word that fails by character set sits under the notes in plain ink. Worse for the singer: Ilya now hides the one error class it can prove (item 6's gibberish set is a character test, not a judgement), and `PRODUCT.md:534` ("never surprised by which words end up under the notes") is broken by the singer's own slip with no witness. The user-error ruling (`PRODUCT.md:636-641`) forbids warning about a placement that is "merely wrong" and marking "uncertainty it cannot justify"; a non-Russian character is justified.
Better rule: outranking stops a repair from being applied, never from being shown. A hand-edited word is tested like any other and, when it fails the dictionary by character set, or fails and sits one confusion pair from the poem's word, it takes the tier 3 offer (shown, one tap, never applied). A hand word that passes the dictionary is left alone and unmarked, which keeps the user-error ruling.
Cost: one clause in item 6 and a reversal of the desk's "no mark on a hand-edited word" reading.

### 2. BLOCKS. "Undo already allows" is false after a reload

Situation: the singer mis-edits, closes the tab, returns tomorrow. The absolute's remedy is Undo; the stack is in memory only and arrives empty on reload (`undo-history.svelte.ts:18-23`), and NOT ESTABLISHED that Lyrics text edits enter that stack at all (it is the Correction Station's, `undo-history.svelte.ts:2`). So the remedy for a protected slip does not exist for most of a song's life.
Better rule: a hand-edited word keeps a per-word "Revert to score" (or "to poem") on the same list the receipt line opens (item 8), so the way back does not depend on the session's history.
Cost: the review list gains one row kind; Revert all (item 8) must say what it does to hand words (case 4).

### 3. CHANGES. The evidence changes under the hand edit: new score, new reader, new dictionary, new poem

Situation: the singer fixed three garbled words by hand against a poor scan in September. In November they replace the score with a clean scan (N.157, `OPEN.md:2233-2258`), or the reader improves (N.166), or the dictionary file updates (item 7, hash-named data files), or they paste a better edition of the poem. Today a replacement keeps the pairing map untouched (`pairings.ts:403`) and a stored seat's text is refreshed only on an exact origin match (`pairings.ts:449-465`), so nothing re-reads anything. Under the absolute, the hand edits stay protected even when the new scan, the dictionary, and the poem all agree on a different word, and the singer sees their old guess outvoted three to one with no mark.
Better: the hand edit outranks a repair made against the same evidence. When the evidence changes (score replaced, reader or dictionary version changed, poem changed at that word), the hand word is re-tested and, where it now disagrees with both the poem and the new reading, it takes the tier 3 offer; it is never applied over. Where the new reading agrees with the hand edit, the hand mark may clear quietly (the singer was right). Requires the engine or data version on the document, which the §8 rewording (item 7) already proposes.
Cost: a version stamp per document and a re-test pass on replacement; the N.157 re-derive, not yet built, is the natural home.

### 4. CHANGES. Revert all, Acknowledge all, and the hand word

Situation: four words repaired; the singer hand-edits one of them (clears its underline, per the desk's reading), then taps Revert all on the receipt line. Does the hand word go back to the scan's garble? The absolute says no, and the line still says "4 words repaired", so the count and the action disagree.
Better: a hand edit to a repaired word removes it from the repaired count ("3 words repaired, 1 edited by you"); Revert all and Acknowledge all skip hand words, and the per-word list shows the hand word with its own revert (case 2).
Cost: one more word state on the receipt line and in the list; EN and FR strings.

### 5. CHANGES. A whole pasted text is not a hand edit of every word

Situation: the singer pastes the poem from lieder.net into Lyrics, or uses Replace, to be rid of OCR garble in one move. If every pasted word now counts as "typed by hand", nothing in that song is ever repaired or offered again, including the composer's repeats the paste erased and any garble the pasted edition carries. The protection meant for a considered edit becomes a blanket.
Better: hand provenance attaches to words changed by a word-level edit (type, retype, tap-to-choose). A paste or Replace of the whole text is a new source, provenance "typed text" as the Input receipt already names its sources (`PRODUCT.md:535`, "from score"), and it reconciles like a poem: repeats are labelled from the alignment, never seated (item 9). A paste of one word inside a word is a hand edit.
Cost: the edit path must know the span of the change (the 600 ms pause diff already computes word-level change, `OPEN.md` item 6, "reconciliation runs on the 600 ms pause"; `text-diff.ts` not read this session).

### 6. CHANGES. A hand edit that changes the syllable count or the anchor

Situation: the singer retypes «мгновение» as «мгновенье» (or the reverse). The word is right by sound and wrong by count; its seats were made for the other count. No tier applies (the hand word passes the dictionary), and item 2 moves seats only for an insertion. `reseat.ts:30-34` leaves a re-divided word's extra slot to the singer's hand, and `refreshPairings` refreshes text only when the slot count did not change (`pairings.ts:428-441`). So the hand word sits with one syllable unseated or one seat orphaned, and nothing says so.
Better: this is not a repair question and the rule stays moot; the gap is reporting. A hand edit whose syllable count differs from the seats it inherits gets the "unseated" mark item 5 already defines, on the receipt line, not a tier.
Cost: none new; item 5's state reused.

### 7. CONSIDER. The same garble elsewhere in the song, and a verse

Situation: the singer fixes «Го» to «То» by hand in bar 5; the same glyph confusion stands in bars 21 and 40 and in verse 3 (unrolled into one string, item 11). The absolute is silent; the tiers leave the three as tier 3 spots, which is correct. The opportunity: the hand edit is the strongest evidence the pair (poem word, scan word) is a confusion, stronger than the shipped list. Offering "also in 3 places" on the list is consistent with "nothing learns a spelling silently" (item 7) because it is offered, not applied.
Better: a hand edit that turns a scan word into the poem's aligned word may offer the same change at the other occurrences, one tap for all, never applied. Cost: one list row; no change to the rule.

### 8. CONSIDER. A hand-placed syllable on the wrong note

Situation: the singer drags a syllable to a note the composer set for the next one. Tier 1 requires the syllable count and the anchor unchanged, so no repair moves a seat; item 1 fills only wordless notes under unread ink. The rule is moot for seats, and `PRODUCT.md:636-641` rules a wrong placement user error. Say so in the rule, so a brief does not read "manual edit" as text only: a hand placement is a manual edit, and the tiers never move a seat of any provenance. Cost: one sentence.

### 9. CONSIDER. A hand word that differs from the poem on purpose, and its colour

Situation: the singer types the composer's variant that the scan missed. Default 5 colours a word that differs from the poem in sage, which the tiers also use for "the composer's" (tier 2). A hand word with no mark draws sage, so a singer returning in a month reads their own edit as the composer's. The absolute does not cause this, but "no mark on a hand-edited word" does.
Better: colour by difference stays; the per-word list (item 8) names the source of each coloured word ("edited by you", "from the score"). Cost: the list already exists under item 8.

### 10. CONSIDER. The moot case, stated so a brief does not build it

Where the hand edit and the poem's aligned word agree, there is nothing to outrank, no mark, and no count; a hand edit made before the poem existed clears any later tier result at that word by agreement. Where the hand edit agrees with the scan and disagrees with the poem, it is tier 2 by provenance (the singer confirmed the print), and may feed the device's confirmed-spelling table (item 7) only by the confirming tap, never by the edit itself.

### 11. CONSIDER. Two devices, a teacher

Nothing leaves the device (item 7, ruled 22:22), so a hand edit on the student's phone and a repair on the teacher's laptop never meet; the rule has no cross-device case today. The hand provenance field (the heading of this memo) must live in the stored document, not the session, or a reload turns every hand word back into a repair candidate (`undo-history.svelte.ts:18-23` is the precedent for what is lost on reload). NOT ESTABLISHED where Lyrics text is stored (`library/driver.ts` not read beyond a grep).

## Proposed wording

By default a repair never replaces a word or a seat the singer typed or placed by hand, and a hand-edited word is still tested and, where it fails by character set or sits one confusion pair from the poem's word, shown with the tier 3 offer, never applied. Ilya departs from the default only when the evidence the hand edit answered has changed (the score replaced, the reader or the dictionary at a new version, or the poem changed at that word), and then it re-tests the hand word and offers, never applies.

## Could not establish

- Whether Lyrics text edits enter the Correction Station's undo stack (`undo-history.svelte.ts` header names placements and corrections only).
- Where Lyrics text and a future provenance field would persist (`library/driver.ts`, `library/migration.ts` not read).
- Whether `text-diff.ts` reports the span of a change finely enough to tell a one-word retype from a whole paste.
- Whether a document carries any engine or data version today (`Pairing.ipa` does not, `pairings.ts:124`, per my r1 finding 9).
- Whether Dann wants a hand edit to the Poem (Input) treated as a manual edit for this rule, or only edits to Lyrics; this memo assumes Lyrics and seats, with Poem edits re-running the tiers against auto words only.

## Tokens used

Estimate, no counter available: about 45,000 of the 100,000 cap, reading included.
