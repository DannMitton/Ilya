# Brief, lane 76: the threshold, and no borrowing into her own set

r1, 2026-11-20, by the Opus desk. Branch `cloud-lane-76`, cut from `Shane` `47bd5c5c`. This is the engine half of the VOICE design; the wizard half is lane 77 and the pages' sentences are lane 72.

## 1. What this is for, from where the singer stands

A singer opens VOICE, names her voice type, and sings nothing: Ilya works from the field's published values for her type, and every page says whose they are. The moment she sings one vowel, she is building her own profile, and from then on Ilya shows her nothing from another singer's voice. The vowels she has not sung are empty, and Ilya names them. When she has sung all six core vowels, Ilya works out the four hardest from her own vowels, and each of those four says so wherever it appears.

Today Ilya does something else: it fills her gaps from a published staff scaled to her tract, so a page can carry her [i] beside somebody else's [o] with nothing to tell her which is which. This lane ends that.

## 2. The rulings this carries out

- **Dann 2026-11-20 00:48**, quoting the desk's own sentence back, transcribed as written: *"Yes: \"a relationship computed across two tracts belongs to no singer.\""* Once she has sampled, no other tract's values mix with hers, at any count.
- **Dann 2026-11-20 00:51**, transcribed as written: *"OK is the threadhold is six, not five. yes"*. All six core vowels, not five, make her own profile.
- **Dann 2026-11-20 01:04**, transcribed as written: *"I thin it's ok for us to allow Ilya to break, or better than break, resist inventing based on incomplete input."*
- **Dann 2026-11-20 01:03**, on a sung vowel whose second resonance could not be measured, transcribed as written: *"A vowel she sang whose second resonance could not be measured should trigger an invitation to try that sample again until fr@ is stable"*. The take still stands and is still used; it does not complete that vowel.
- **Dann 2026-11-20 02:15**, transcribed as written: *"so Ilya's synthesis of [ɨ] carries less confidence than its synthesis of [ɪ] and [ʌ], and it is marked accordingly."* Ilya does synthesize [ɨ], with a wider marked uncertainty. The word is **synthesis**, adopted from pacifier v11 §9.2, never "placement".
- The design's home is `docs/memory/OPEN.md`, "VOICE: TWO PROFILES, AND ONE MARK", with the desk's amendment of 2026-11-20 15:4x that returns the asked-for set to the six core vowels.

## 3. The tree as it stands, every line read by the desk on `47bd5c5c`, 2026-11-20

- `apps/web/src/lib/voice/engine/sung.ts:40`: `export const PERSONAL_CORE_MIN = 5;`
- `sung.ts:25-29`: `stableCore` counts a core vowel when `isSung` and (`confidence !== 'low'` or `plausibilityOverride === true`). **The second resonance takes no part in the test.**
- `sung.ts:21`: `CORE_VOWELS = ['i','e','ɛ','ɑ','o','u']`, already the six.
- `engine/resolve-values.ts:131`: the synthesis loop runs `personal ? Object.keys(DERIV_SOURCE) : []`, so below the threshold nothing is synthesized. That gate is correct and stays.
- `resolve-values.ts:155-157`: `fillStandIns` runs when `anySung || generic || placeholders === 'always'`. **The `anySung` term is what borrows another voice's values into a sampling singer's set, and it is what this lane removes.**
- `engine/stand-ins.ts:21-22` (its own header, step 2): a sung core vowel with no usable fR2 "takes shape fR2 times k for that resonance only", which is two tracts inside one vowel.
- `engine/stand-ins.ts:29-31` (step 3): below the threshold the declared type's template fills every unsampled vowel, unscaled.
- `engine/derivations.ts:29-36`: the four synthesis formulas. `DERIV_SOURCE` (`:4-6`) already names the four and their kind.
- `engine/derivations.ts:22-25`: `expectedF1` holds the same ratios for the plausibility guard, flagged in its own comment as the single source of truth.
- `engine/divergence.ts:22`: `1.365` and `0.67` **a second time**, inline. Found by Fable's review of the synthesis brief, confirmed by the desk this session.
- `chart/tour.ts:10-12`: `TOUR_SEVEN` is seven and `TOUR_HARDEST` three. `CalibrationWizard.svelte:103-105`: `DEFAULT_VOWELS` seven, `CHALLENGING_VOWELS` three. **Both are lane 77's, not this lane's; they are named here so the two lanes do not collide.**

## 4. The search the desk ran before proposing anything

`CONTRACT.md` section 4. Searched `apps/web/src/lib/voice/` and `apps/web/src/lib/insights/` for an existing per-vowel provenance mark and for any existing confidence tier on a synthesized value. What came back: `Provenance` exists already (`stand-ins.ts:46`, the three words `sung`, `derived`, `surrogate`) and is carried per vowel per resonance through `ResolvedValues.fR1Source` and `fR2Source` (`resolve-values.ts:36-39`). **So the mark's carrier exists and this lane widens it; it does not add a mechanism.** No confidence tier on a synthesized value exists anywhere: that is new.

## 5. The steps

### Step 0, measure before changing anything

Count, over every stored reading in the tracked capture fixtures and in any capture set the repository holds, how many sung core vowels carry no usable second resonance (`f2` absent, not a positive number, or `f2Quality === 'absent'`). Report the count and the proportion per voice. **This is the blast radius of step 3 and it is not established today** (`OPEN.md`, "VOICE: TWO PROFILES, AND ONE MARK", NOT ESTABLISHED). Change nothing in this step. If the proportion is above one in four, say so plainly in the report and stop before step 3 for the desk's ruling.

### Step 1, the threshold moves to six

`sung.ts:40`: `PERSONAL_CORE_MIN` becomes `6`. Rewrite the comment above it to cite Dann 2026-11-20 00:51 in his words and to drop the lane 67 and 68 wording of five. Every caller already reads the constant; change no caller.

### Step 2, nothing is borrowed into a singer's own set

`resolve-values.ts:155-157`: `fillStandIns` runs only when `generic` is true, or when `placeholders === 'always'` **and** `anySung` is false. Once she has sung anything, no stand-in enters her values, so a vowel she has not sung and that cannot be synthesized from her own vowels has **no entry** in `fR1`, `fR2`, `fR1Source`, or `fR2Source`.

Consequences to carry out in the same step, each read before you change it:
- Every reader of `ResolvedValues` must treat a missing vowel as missing rather than as zero. Find them all (`resolveVowelValues` callers) and report what each does with a gap today.
- The calibration chart asks for `placeholders: 'always'` (`resolve-values.ts:26-30`). Under this rule it keeps that only while nothing is sung. Once she has sung, the chart draws her own vowels and the four synthesized ones, and draws nothing where there is nothing. **It must not crash, and it must not draw a dot at the origin.**
- `stand-ins.ts:21-22`'s rule that a sung vowel with no usable fR2 takes the shape's fR2 times k is **deleted**. That resonance stays empty; step 3 is what tells the singer so.

### Step 3, the second resonance joins the test of a completed vowel

`sung.ts`, `stableCore`: a core vowel counts toward the six only when it is sung, stable as today, **and** carries a usable second resonance (a positive `f2` with `f2Quality !== 'absent'`). Export the predicate separately so one test serves every caller, as `isSung` does.

The take still stands and is still used for its own vowel everywhere that reads values. It does not complete that vowel. **Add a function that answers which sung vowels are waiting on a steady second resonance**, so lane 77 can hang the retake invitation on it; this lane builds no screen.

### Step 4, the four are synthesized, and each carries its mark

- Keep the identifiers `derive`, `deriveFrom`, `DERIV_SOURCE`. **DESK DEFAULT**: renaming them to "synthesize" is N.204's consistency work and would collide with four other lanes; what changes here is what a singer reads, and lane 77 and the wording round carry that. Say so in a comment at `derivations.ts`'s head, with Dann's 02:15 ruling on the word.
- Add one exported table beside `DERIV_SOURCE` giving each of the four its confidence tier: `ɨ` wider, and `ɪ`, `ʌ`, `a` plain. Its comment carries Dann's 02:15 words and the desk default that `[a]` takes the plain tier. **No other tier exists; do not invent a third.**
- Carry the tier out through `ResolvedValues` beside the provenance, per vowel, so lane 77 and INSIGHTS can mark without recomputing anything.

### Step 5, the duplicated ratios

`divergence.ts:22` recomputes `1.365` and `0.67` inline. Import them from `derivations.ts` instead, exporting them by name there if they are not already named. **`CONTRACT.md` section 4:** this brief changes how a number is computed, so here are every other site that computes the same numbers and what depended on their agreeing: `derivations.ts:22-25` (`expectedF1`, read by `plausibility.ts`'s window centres), `derivations.ts:29-36` (`derive`), and `divergence.ts:22` (the [ɨ] divergence description). They must agree or the guard's window, the synthesized value, and the divergence verdict describe three different [ɨ]s. Fable's review checks this line against the tree.

### Step 6, the tests

- `PERSONAL_CORE_MIN`'s move breaks lane 67's and lane 68's tests. Move them with it; do not delete a case to make a number pass.
- A test that a sampling singer's unsung vowel has no value at all, for both resonances.
- A test that a vowel sung without a usable second resonance does not count toward the six and is still used for its own first resonance.
- A test that [ɨ] carries the wider tier and the other three the plain one.
- A test that the three ratio sites agree, by computing the same [ɨ] through each.

## 6. What must not change

- A sung reading is never displaced, demoted, or discarded by anything in this lane (Dann 2026-11-13, `PRODUCT.md:1269-1273`).
- The plausibility verdict still gates nothing (lane 66 step 5).
- Nothing is written to the stored profile; all of this is computed per snapshot.
- No string moves in this lane, in either language. New and amended wording is lane 77 and the wording round.
- `ONE VOWEL PER NOTE` (`CONTRACT.md` §0.1) is untouched by this lane and nothing here may weaken it.

## 7. Done when

1. All eight gates at baseline, with gate 4's new count reported for both the with-scipy and the without-scipy figures, and said which was measured.
2. A singer with five stable core vowels has an incomplete profile and no borrowed values anywhere in her set.
3. A singer with six has all ten values, four of them synthesized and tiered.
4. A singer who has sung nothing and named a type is unchanged from `Shane`.
5. Step 0's count is reported whatever it says.

## 8. What you could not establish

NOT ESTABLISHED beats a complete invented answer.

Report, under this heading, anything you could not settle from the tree, and name the instrument you used for each. The desk expects at least these to be live: what every reader of `ResolvedValues` does with a missing vowel; whether the chart has a drawing path for a vowel with no value; and step 0's count.
