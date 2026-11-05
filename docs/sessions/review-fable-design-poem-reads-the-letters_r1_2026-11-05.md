# Review: design-desk-poem-reads-the-letters_r1 (Fable, 2026-11-05; filed by the desk)

161,056 Fable tokens against 110,000 stated (over by 51k). Verdict: **PROCEED WITH CHANGES.** Condensed by the desk from the review as returned; findings and verdict kept whole in substance.

Read by Fable: the design, the inventory, the feasibility report, CONTRACT §0 to §0.2, OPEN "JOINING" items 1 to 16; on `origin/cloud-lane-34`: `poem-join.ts`, `poem-join-wire.ts`, `poem-join.svelte.ts` (1-60, 95-140), `underlay-recognize.ts`, `underlay-units.ts`, `underlay-tokens.ts`, `underlay-page.ts` (1-120, 180-391), `underlay-seat.ts` (1-130, 165-275), `underlay-prepare.ts` (110-150), `stamp.ts` (30-65). The McGill paper was not read.

## The five open questions

1. **Ordering.** The stored reading holds `musicXml`, `stamp`, `bands` only (`stamp.ts:57-65`). Keeping symbols means an additive `symbols` field, `underlay@5`, one silent re-read of every stored scan (`stamp.ts:38-41`). Deeper: Part B produces seats, and the only path putting a scan's words on notes is `writeLyrics` inside `seatPage` (`underlay-page.ts:67`, `:384`); the join produces text placed by diff (`poem-join.ts:7-9`). Part B needs a way to set pairings from boxes after ingestion, which exists nowhere read: the design's largest unpriced cost, NOT ESTABLISHED how.
2. **Span.** Per system, bounded by `alignWords`' anchors (`poem-join.ts:195-220`), never whole-song.
3. **Repeats.** Affine gaps model omission, not repetition. Keep repeats at word level (`:211-217`); run letter alignment per aligned word or gap.
4. **Against row 181.** Feed the tiers; do not replace them. Letter alignment over a system string would substitute a real scan word with a different real poem word, the opposite of "the scan's word stays".
5. **Failure modes.** Findings 2, 4, 5, 6.

## Findings, ranked for the singer

1. **The biggest gain needs no poem: B0.** Replace the letter-share split (`underlay-tokens.ts:63-69`, `underlay-units.ts:79-85`) with each vowel's own symbol box, inside `seatPage` at scan time, measurable against 376 at once. It satisfies §0.2 directly. Brief it first, measure it alone.
2. **Part A as written can seat wrongly and silently.** Within one means a syllable with no note or a note with none (a §0.1 breach). The fill is seated by `reseat.ts` by diff (`poem-join.ts:337-341`), so which note goes empty is decided by unnamed code. It also breaks item 6(d) for unread systems. Change: loosen blank runs only, never unread systems; allow within-one only where `needs` holds two counts (ties against slur, `poem-join-wire.ts:154`) and the poem's count equals one of them; else an offer.
3. **Orthography absent from Part B.** Modernise read letters first or price ѣ/е, і/и, terminal ъ at zero (`joinIsWord`, `poem-join-wire.ts:24-28`, already modernises); hyphens, dashes, spaces free.
4. **"Nearest" and "monotone" are two rules** (`underlay-seat.ts:11`; `:18-26`, `:226-234`). State monotone alone, with `seatTokens`' free set and FAR rule.
5. **Grace notes, chord tones, voice 2 are seat candidates today** (`underlay-prepare.ts:123-137`; only rests and notes without `imgpos` dropped, `:169`). DESK DEFAULT: exclude, count, measure. Whether a print ever sets a syllable under a grace note is Dann's to confirm.
6. **Word confidence not calibrated on Ilya's rows** (the 32 against 82 came from a plain crop). Log it into the reading first; weight only after its distribution on row 114 f1 is seen.
7. **The 77 offers are undiagnosed.** The console prints the set of `why` values, not counts (`poem-join.svelte.ts:134`). Count each kind, and the `tokenMapReport` failure rate on songs 2 to 5, before any arm.
8. **McGill's 80 to 90 percent is a different corpus** (chant, Latin). Not a forecast; the brief must not carry it.

## Verdict and order

PROCEED WITH CHANGES. B0 first; then the offer-kind diagnostic; then Part A narrowed per finding 2; then Part B as a tier-fed placement engine with orthography handled, the pairing-from-boxes path priced before its brief.

**The deciding measure:** B0 alone on row 114 f1 against 376, credits (a), (b), (c), the ledger, new two-vowel or empty notes counted (must be 0). If B0 does not move the count, reconsider the design before building anything else.

**Dann's to confirm:** whether a grace note ever carries its own printed syllable in his editions; whether a marked within-one fill on a blank run is acceptable to the singer, or every inexact run goes to the Loupe.
