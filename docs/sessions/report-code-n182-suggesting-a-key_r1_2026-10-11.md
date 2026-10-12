# Report: N.182, how Ilya suggests a key (QUEUE row 71)

**QUEUE row 71, state: WRITTEN, pushed to `cloud-lane`. Insights now offers one to three keys under "How this key sits for you". Each line names its move and only what differs for this singer, and each has "Try this key". When no key is shown, one line says why. "Show keys that reach higher" reveals the rest. No key is marked as Ilya's recommendation. Every new string is PROPOSED, with French owed, and is listed in "For Dann".** The desk carries this line into `QUEUE.md`; this session does not edit `docs/memory/`.

Written by Code (cloud lane) 2026-10-12, for `docs/sessions/brief-code-n182-suggesting-a-key_r2_2026-10-11.md` (r2, after Fable's review, which it carries; no amendments section), on `cloud-lane` after row 67 (`1a358716`), clean tree before the first edit. Read whole: the brief, `draft-n182-suggesting-a-key_r1_2026-10-11.md`, and `review-fable-n182_r1_2026-10-11.md`.

## Pictures

`docs/sessions/n182-shots/`, English, *Without Sun*, no. 1 (`sunless-01-engraved.musicxml`). Each is the "How this key sits for you" block, at desktop (`-desktop`) and at 390 px (`-phone`). The voices are typed, with all ten vowels sung.

| State | File | Voice (range; primo, secondo) |
|---|---|---|
| A written key that suits | `suits-baritoneHigh-*` | baritone, A2 to A4; E4, A4 |
| One group | `one-group-mezzo-*` | mezzo, A3 to A5; E4, E5 (the song is "unlikely"; its one key sits under the paragraph) |
| Three groups | `three-groups-tenor-*` | tenor, C3 to C5; D4, G4 |
| No workable key | `no-workable-soprano-*` | soprano, C4 to C6; F4, F5 |
| The reveal, opened | `reveal-bass-*` | bass, D2 to C4; G3, C4 |

**How often the cap binds.** A probe over 16 voice-and-song pairs (the two engraved fixtures, eight typed voices) gave:

- three key lines in 7 pairs, two in 5, one in 2;
- "No key suggested" in 1, and "No workable key" in 1.

The probe read the page, which does not show whether more than three groups qualified, so the cap's binding count on the fixtures is NOT ESTABLISHED. The unit test has a case where it binds: four groups, one moved under the reveal.

**Surrogate vowels.** None among the fixture voices: all ten vowels are sung, so none was left out. The exclusion is proven by unit test.

## The changes

- **`apps/web/src/lib/insights/key-suggest.ts` (new), the search.** Pure, one function per rule.
  - `measureKey` (`:151`) reads one move's challenge set:
    - the range axis (inside, above, below, or both), with the count, distance, and bar of the notes past it;
    - workable within `RANGE_CHALLENGE_MARGIN = 2` (`:54`);
    - the shares at or above the primo and above the secondo, by `buildInsights` on the moved score, as the page's zones count them;
    - a held note above the secondo: the written key's held chain heads, moved;
    - the share past the vowels' turn, counting only vowels whose `fR1Source` is not `'surrogate'`.
  - `stakesOf` (`:133`) and `challengeWeight` give the stakes by the intake answers: 1 to 2 weigh 1.0, 3 weighs 0.75, 4 to 5 weigh 0.5, and "not sure" or no answer weighs 1.0.
  - `matters` (`:144`) is the 10-point test: a challenge gained or lost, or a share moved by `BETTER_KEY_MIN_DROP`.
  - `suggestKeys` (`:213`):
    - searches six semitones each way and groups workable keys by challenge set;
    - shows each group's smallest move that matters;
    - orders by stakes, then the primo share, then the smaller move, then the lower key;
    - caps at `MAX_KEY_GROUPS = 3` (`:56`);
    - puts the capped groups, then the unworkable keys nearest first, under the reveal;
    - returns `none`, `noneBetter`, `noWorkable`, or `keys`;
    - without a typed range it returns null, and without passaggi the set has the range axis only.
- **`apps/web/src/lib/insights/key-lines.ts` (new), the words.**
  - `keyParts` (`:64`) prints only what differs from the written key:
    - the range;
    - a share moved by 10 points or a challenge flipped;
    - the held note;
    - the turn share moved by 10 points.
  - Each part follows its own question's band: points 1 to 2 add a clause of why, and points 4 to 5 take the terse form for range. The passaggi are named in the Q7 register.
  - `keyWords` (`:100`) builds the lines, the one-line answer, and the reveal's label (higher, lower, or both).
  - `moveWords` (`:46`) names a move when the score names no key.
- **`apps/web/src/lib/insights/InsightsPane.svelte:311-323`.** The one source of keys on Insights.
  - It replaces both of today's sources: `searchBetterKey`, and the range finding's `transposition`.
  - `nameMove` asks the ruler for its stop and its readout without "Ilya's recommendation".
- **`apps/web/src/lib/markup/transposition-ruler-state.svelte.ts:138`.** `readoutFor` takes `asPick` (default true, so Markup is unchanged); the key lines pass false.
- **`apps/web/src/lib/insights/insights.ts`.** `SungKey.readoutFor` gains the optional parameter.
- **`apps/web/src/lib/insights/singer-blocks.ts`.**
  - The conclusion's `forward` (one key) becomes `keys` (`KeyWords`).
  - The unlikely paragraph is untouched; its keys sit under it.
  - For a key that fits, the paragraph is the verdict line. The row 66 "better" paragraph (`insights.r2.better.*`) and the reasons' "compare" line (`insights.r2.compare`) are no longer used: each named one key as the better one.
  - The `KeyForward` type is removed.
- **`apps/web/src/lib/insights/SingerBlock.svelte:70-84`.** It draws the one-line answer, each key line with "Try this key", and the reveal as a `<details>`. The reveal and "Try this key" do not print.
- **`apps/web/src/lib/insights/singer-page.ts`.** `searchBetterKey` and `shareAfter` are removed, and so are their now-unused imports; a comment points to the new search.
- **`apps/web/src/lib/i18n.ts`.** 31 PROPOSED keys under `key.*`, added after `insights.r2.noBetterKey` by key. The French stands in English, marked `[FR: owed]`, with French typography where the drift tests require it (Italian terms in `*…*`, U+00A0 before « : »).

The rules not to touch are kept:

- Markup's ruler is untouched (the default keeps its readout).
- `isUnlikely` is untouched.
- Nothing reads the declared voice type.

## Tests

- **New, `apps/web/src/lib/insights/key-suggest.test.ts` (16).** The three named fixture voices are a soprano (C4 to C6; F4, F5), a tenor (C3 to C5; D4, G4), and a bass (D2 to C4; G3, C4). Expectations are worked from the written notes.
  - **Challenge sets:**
    - the range axis and the margin (2 workable, 3 not);
    - passaggio time as the page counts it;
    - the held note moving with the key;
    - missing passaggi, and a missing range.
  - **Which keys:**
    - one per set, smallest move that matters, three at most, the cap into the reveal;
    - the 10-point test excluding moves that change nothing;
    - the weights;
    - the same keys whatever the answers.
  - **The one-line answers:** "No key suggested" (tenor), and "No workable key" with every key under the reveal (soprano, bass song).
  - **Placeholder vowels:** a sung vowel counts; a surrogate is left out.
  - **The words:**
    - lines that name only differences, with no recommendation;
    - the register;
    - the why clause and the terse form;
    - distances past a tritone in semitones, never a missing string.
- **Removed (5).** The `searchBetterKey` cases in `singer-page.test.ts`, with the function they tested.
- **Changed (2), in `singer-blocks.test.ts`.** `forward` becomes `keys` (the blocks pass N.182's keys through).

## The eight gates

All pass.

1. `pnpm test:phonology`: 251 passed (251)
2. `pnpm test:dictionary`: 242 passed (242)
3. `pnpm --filter @ilya/web check`: 0 errors and 12 warnings in 5 files
4. `pnpm --filter @ilya/web test`: 2350 → **2361** passed (+16, −5)
5. `pnpm --filter @ilya/score-parser test`: 663 passed, 5 skipped (668)
6. `pnpm test:blurb`: 145 passed (145)
7. `pnpm test:integration`: 55 passed (55)
8. `pnpm ratchets`: OK

## DESK DEFAULTS taken

- **A written key that suits gets "No key suggested", never keys that only add challenges.** "Suits" means range inside and nothing at or above the primo, the brief's definition. The harder keys wait under the reveal. Without this, a gained challenge counts as "something that matters" and the line could never appear.
- **"No other key within a tritone changes these challenges by much."** This line (`key.noneBetter`) covers a written key with challenges and no key that changes them. The brief names no line for that case.
- **The register of Q7 sets the passaggio nouns:** "your first passaggio" (plain), "your primo" (working), "your primo passaggio" (technical). Other register differences are NOT built.
- **The band's terse form exists for range parts only.** Passaggio and held parts are the same at points 3 to 5.
- **The cap's groups and the unworkable keys share the reveal**, groups first, then the rest nearest first.
- **The verdict paragraph** no longer names a better key (row 66's ratified "better" sentences are unused).

## For Dann

1. **Every string is PROPOSED, English; French `[FR: owed]`:**
   - `key.none`: "No key suggested: as written, the song stays inside your range and below {primo}, and no other key within a tritone changes that by much."
   - `key.noneBetter`: "No other key within a tritone changes these challenges by much."
   - `key.noWorkable`: "No key within a tritone keeps this song within a tone of your range. Whether to pursue it, or to choose other repertoire, is yours to decide."
   - `key.line`: "{readout}: {parts}."
   - Parts:
     - "inside your range"
     - "one note {interval} above your range, in bar {bar}"
     - "{count} notes up to {interval} above your range, the highest in bar {bar}"
     - the same pair below, with "down to" and "the lowest"
     - "{n} percent of the singing at or above {primo}"
     - "nothing at or above {primo}"
     - "{n} percent above {secondo}"
     - "nothing above {secondo}"
     - "a held note above {secondo}, in bar {bar}"
     - "no held note above {secondo}"
     - "{n} percent past where the vowels turn"
     - "{n} semitones"
   - Why clauses: "past the notes you typed as your limits", "where the voice turns", "a long note in the upper passaggio".
   - Terse: "{count} up to {interval} over the range, bar {bar}"; "{count} down to {interval} under the range, bar {bar}".
   - Nouns: "your first passaggio" / "your primo" / "your primo passaggio", and the secondo's three.
   - Reveal: "Show keys that reach higher", "Show keys that reach lower", "Show keys that reach higher or lower".
2. **Taste:**
   - **Some lines name very small figures,** for example "2 percent above your secondo". That part prints because a challenge is gained, as rule 4 says. Whether such a figure "helps a decision" (your second test) is yours.
   - **The reveal can be long.** It holds up to twelve keys, some with "34 notes up to a tritone above your range".
3. **The cap of three** is yours to strike.
4. **Row 66's "better" paragraph and "compare" line are retired** (both ratified). Say if either should return in another form.

## Could not establish

- **How often the cap binds on the fixtures.** See "Pictures".
- **The French.** All owed.
- **Seen on a French page.** Only English was photographed, as the brief asks.
- **A real singer's answers.** The intake is weighted as ruled, but no picture uses a filled intake.
