# Brief, lane 76: the threshold, and no borrowing into her own set

r2, 2026-11-20, by the Opus desk. Branch `cloud-lane-76`, **cut from the `Shane` commit that carries the amended `docs/memory/OPEN.md`**, not from `47bd5c5c`: at `47bd5c5c` that file still says the asked-for set is seven and that [ɨ] is "asked for, never invented", which this lane contradicts.

**r2 applies every blocker and amendment of `review-fable-two-briefs_r1_2026-11-20.md`, which returned DO NOT SEND on r1 with four blockers. r1 is superseded; do not read it.**

## 0. THIS LANE IS BUILT AND HELD. Read this before anything else

**The branch is built, reviewed as built, and then held. It does not merge into `Shane` on its own, and nothing in it reaches a singer until lane 77 and the wording round land with it.**

The reason, which r1 missed and Fable caught: step 2 makes six sentences already on a singer's page untrue, and r1's instruction that no string moves would have shipped them as lies.

- `calib.pane.belowCore` and `calib.pane.belowCoreOne`, drawn on the VOICE pane and on MELODY with no score (`markup/profile-status.ts:39`): "Ilya needs at least 5 stable fry samples. Until you provide {m} more, unsampled vowels are assigned placeholder values." Step 1 makes the number wrong; step 2 makes the last clause false at every count.
- `placeholder.line.belowCore`, `placeholder.line.belowCoreOne`, and their two `markup` forms: the same two faults, plus "Findings that rest on a placeholder are drawn dashed" when no placeholder is left.
- "You have sampled {n} of the 6 core vowels so far ({vowels})" undercounts after step 3, because `stableCore` feeds it (`analysis/placeholder-line.ts:54-58`) and step 3 drops a vowel she did sing.

A singer with one to five core vowels has ten values today and only what she sang after this lane, and the one tap back to the published profile is lane 77's. So the order is: this lane builds and holds, lane 77 builds, the wording round replaces those sentences, and the three merge together.

## 1. What this is for, from where the singer stands

The moment a singer sings one vowel she is building her own profile, and from then on Ilya shows her nothing from another singer's voice. The vowels she has not sung are empty and Ilya names them. When she has sung all six core vowels, Ilya works out the four hardest from her own vowels, and each of those four says so wherever it appears.

Today Ilya fills her gaps from a published staff scaled to her tract, so a page can carry her [i] beside somebody else's [o] with nothing to tell her which is which.

## 2. The rulings this carries out

- **Dann 2026-11-20 00:48**, quoting the desk's own sentence back, transcribed as written: *"Yes: \"a relationship computed across two tracts belongs to no singer.\""*
- **Dann 2026-11-20 00:51**, transcribed as written: *"OK is the threadhold is six, not five. yes"*.
- **Dann 2026-11-20 01:04**, transcribed as written: *"I thin it's ok for us to allow Ilya to break, or better than break, resist inventing based on incomplete input."*
- **Dann 2026-11-20 01:03**: a sung vowel whose second resonance could not be measured gets an invitation to sing it again, and nothing filled. The take still stands and is still used; it does not complete that vowel.
- **Dann 2026-11-20 02:15**, transcribed as written: *"so Ilya's synthesis of [ɨ] carries less confidence than its synthesis of [ɪ] and [ʌ], and it is marked accordingly."* The word is **synthesis**, adopted from pacifier v11 §9.2, never "placement".

**The second half of the 02:15 ruling is NOT built in this lane, and the desk says so plainly.** `INBOX.md` records it as: a sample supersedes the synthesis, "and a sample Ilya cannot read steadily does not, with Ilya saying which of the two it is using", from his *"A sample is always best, but a bad sample is no good."* Today a sung reading always wins and `isSung` ignores confidence (`voice/engine/sung.ts:14-15`, `voice/engine/resolve-values.ts:119-120`). **This lane keeps today's rule**: a sung reading is never displaced. The clause is recorded in `OPEN.md` as ruled and not yet built, and its reach is Dann's to settle, because only he can say whether it covers [ɨ] alone or all four.

## 3. The tree as it stands, every line read by the desk on `47bd5c5c`, 2026-11-20

- `voice/engine/sung.ts:40`: `PERSONAL_CORE_MIN = 5`. Its callers: `:41`, `analysis/placeholder-line.ts:55`, `components/Drawer/voice-pane.ts:38`.
- `sung.ts:26-30`: `stableCore` counts a core vowel when `isSung` and (`confidence !== 'low'` or `plausibilityOverride === true`). **The second resonance takes no part.** `sung.ts:18`: `CORE_VOWELS` is already the six.
- `resolve-values.ts:130`: the synthesis loop runs `personal ? Object.keys(DERIV_SOURCE) : []`. That gate is correct and stays.
- `resolve-values.ts:154-157`: `fillStandIns` runs when `anySung || generic || placeholders === 'always'`. **The `anySung` term is what borrows another voice's values into a sampling singer's set.**
- `resolve-values.ts:130-142`: the synthesis loop fills each resonance separately, so a sung vowel with no usable fR2 keeps her fR1 and takes a synthesized fR2.
- `stand-ins.ts:21-22`: a sung core vowel with no usable fR2 takes the shape's fR2 times k, which is two tracts inside one vowel.
- `stand-ins.ts:24-26`: below the threshold the declared type's template fills every unsampled vowel, unscaled.
- `derivations.ts:29-36`: the four formulas. `:20-26`: `expectedF1` holds the same ratios for the plausibility guard, flagged at `:13-14` as the single source of truth. `:4-6`: `DERIV_SOURCE`.
- `divergence.ts:22`: `1.365` and `0.67` **a second time**, inline.
- `analysis/placeholder-line.ts:113`: the borrowing line draws whenever the voice is not personal.
- `chart/zones.ts:121-123`: for every unsung vowel it pushes a placeholder with `f1: now.fR1[vowel]` and `f2: now.fR2[vowel]`, **with no guard**.
- `chart/finish-early.ts:34-39`: `standIn` is true when any source is `'surrogate'`, and the kind is `'work-out'` only when no surrogate is present.
- `Provenance` is `stand-ins.ts:39`; it travels as `ResolvedValues.fR1Source` and `fR2Source` (`resolve-values.ts:37-38`).

## 4. The search the desk ran before proposing anything

`CONTRACT.md` section 4. The mark's carrier exists already: `Provenance`, three words, per vowel per resonance. **So this lane widens a mechanism; it does not add one.** No confidence tier on a synthesized value exists anywhere in `apps/` or `packages/` (grep); that is new. `reading: 'estimated'` (`derivations.ts:36`) and `PlaceholderDot.source` (`chart/zones.ts:65`) are the nearest existing marks.

## 5. The steps

### Step 0, measure before changing anything

**Already counted, by Fable through the bridge on 2026-11-20 and not verified by the desk:** Dann's two capture archives of 2026-11-15 and 2026-11-17 hold 22 readings with a first resonance, 13 core and 9 of the four, and **none lacks a usable second resonance**. One voice, a bass, in fry.

Your part: count the same over the synthesized set at `tools/n200-score/__golden__/` and report it **as synthetic**. **No treble voice has been counted, and your report says so.** This is the blast radius of step 3. Change nothing in this step.

### Step 1, the threshold moves to six

`sung.ts:40`: `PERSONAL_CORE_MIN` becomes `6`. Rewrite the comment above it to cite Dann 2026-11-20 00:51 in his words and drop the lane 67 and 68 wording of five. Every caller reads the constant; change no caller. **The strings that name five do not read it and are handled in section 0, not here.**

### Step 2, nothing is borrowed into a singer's own set

`resolve-values.ts:154-157`: `fillStandIns` runs only when `generic` is true, or when `placeholders === 'always'` **and** `anySung` is false. A vowel she has not sung and that cannot be synthesized from her own vowels then has no entry in any of the four maps.

In the same step:

- `resolve-values.ts:130-142`: **a vowel with a sung first resonance takes nothing from the synthesis loop.** Its second resonance stays empty until she sings it again, as for a core vowel. Today the loop fills each resonance separately, which would leave a sung [ɨ] carrying a synthesized second resonance against the ruling of 01:03.
- `analysis/placeholder-line.ts:113`: the borrowing line draws **only while nothing is sung**, not while the voice is not personal. Otherwise a contralto who has sung one vowel reads that Ilya is using mezzo-soprano values with no mezzo-soprano value left in her set. Rewrite its comment at `:100-103`. **No string changes.**
- `chart/zones.ts:121-123`: guard it. A vowel with no value yields no placeholder dot. **It must not push `undefined` coordinates and must not draw a dot at the origin.**
- `chart/finish-early.ts:34-39`: **named here as a silent break.** With no surrogate ever present once she has sung, the kind becomes `'work-out'` for every profile, including one whose missing vowels are core, and `calib.pane.fills` becomes unreachable (`voice/VowelCapture.svelte:282`, `routes/+page.svelte:4188`, `components/Drawer/voice-pane.ts:40`). Decide the test on what is actually missing rather than on the presence of a surrogate, and say in the report what you chose.
- `stand-ins.ts`: with `fillStandIns` running only when nothing is sung, its `personal` path is dead (`:160-165`, `:184`, `:187`), and its header's steps 2, 3, and 5 and its line 2 become false. Remove the dead branch and rewrite the header. **Leave `tractScale` exported** (`:122`); the synthesis lane wants it.
- The control the capture screen offers "from the fifth core vowel" moves to the sixth (`chart/finish-early.ts:11`, `voice/VowelCapture.svelte:280-282`), and so does the far-off [ɨ] note (`voice/outside.ts:37`).

**Every other reader of `ResolvedValues`, each of which tolerates a gap by reading one vowel at a time; confirm each and report any that does not:** `analysis/analyze-score-adapter.ts:131`, then `packages/score-parser/src/overlay-engine.ts:165` and `:231`, `conditions.ts:368`, `modification-engine.ts:66-73`, `insights/comments.ts:164`, `insights/singer-page.ts:196` and `:209`, `insights/key-suggest.ts:291`, `chart/readings.ts:95-96`. `tools/n200-score/lane66-core.ts:132` and `lane67-core.ts:52`: say for each whether it moves or is frozen as a record.

### Step 3, the second resonance joins the test of a completed vowel

`sung.ts`, `stableCore`: a core vowel counts toward the six only when it is sung, stable as today, **and** carries a usable second resonance. **Export that predicate**, and have the three sites that test it today read the one predicate: `resolve-values.ts:95` and `voice/outside.ts:39` (positive and not `'absent'`), and `derivations.ts:80-82` (positive only). Note that `analyze.ts:95` can return `'absent'` beside a number.

The take still stands and is still used for its own vowel everywhere that reads values. **Add a function that answers which sung vowels are waiting on a steady second resonance**, so lane 77 can hang the retake invitation on it. This lane builds no screen.

### Step 4, the four are synthesized, and each carries its mark

- Keep the identifiers `derive`, `deriveFrom`, `DERIV_SOURCE`. **DESK DEFAULT**: renaming them to "synthesize" is N.204's consistency work and would collide with four other lanes. What changes is what a singer reads, and that is lane 77's. Record Dann's 02:15 ruling on the word in a comment at `derivations.ts`'s head.
- Add one exported table beside `DERIV_SOURCE` giving each of the four its tier: `ɨ` wider, and `ɪ`, `ʌ`, `a` plain. Its comment carries his 02:15 words and the desk default that `[a]` takes the plain tier, his to overrule. **No third tier exists; do not invent one.**
- Carry the tier through `ResolvedValues` beside the provenance, per vowel. **Say in the report whether it also reaches `VoiceProfileSnapshot`**, which is what INSIGHTS and MELODY actually read and which lives in another package with its own copy of the three provenance words (`packages/score-parser/src/analysis-types.ts`). Do not change that type in this lane without saying so.
- **The four formulas do not change in this lane.** Their method belongs to the synthesis lane, QUEUE row 197.

### Step 5, the duplicated ratios

**`CONTRACT.md` section 4: this brief changes how a number is computed, so here is every site that computes the same ratios and what depended on their agreeing.** The literals `1.365` and `0.67` occur in source only at `derivations.ts:21`, `:31`, and `divergence.ts:22`. They must agree or the guard's window, the synthesized value, and the divergence verdict describe three different [ɨ]s.

- `divergence.ts:22` imports them from `derivations.ts` instead of recomputing.
- `derivations.ts` holds `1.365`, `1.0315`, and `1.15` **twice inside itself** (`:21-24` and `:31-34`). Name each constant once and have both `expectedF1` and `derive` read it.
- The callers that are not copies, for your check: `stand-ins.ts:185`, `plausibility.ts:219`, `tools/n200-score/fidelity-set.ts:55`, `tools/n168-frequency-run/frequency-run.run.ts:180`.
- For step 6's agreement test: `derive` rounds to a tenth (`:36`) and `divergence.ts` does not, and the two gate their anchors differently (`divergence.ts:6-8` refuses a provisional anchor, `derivations.ts:80-82` accepts one). **State a tolerance and use anchors both accept.**

### Step 6, the tests

Named, so none is missed: `voice/engine/sung.test.ts`, `resolve-values.test.ts`, `analysis/analyze-score-adapter.test.ts`, `adapter-golden.test.ts` (regenerated on purpose, with every changed row reported), `placeholder-line.test.ts`, `components/Drawer/voice-pane.test.ts`, `markup/profile-status.test.ts`, `voice/chart/finish-early.test.ts`, `e2e/melody-no-score-count.test.ts`, `tools/n200-score/lane66-core.test.ts`.

New cases: a sampling singer's unsung vowel has no value in either resonance; a vowel sung without a usable second resonance does not count toward the six and is still used for its own first resonance; [ɨ] carries the wider tier and the other three the plain one; the three ratio sites agree on one [ɨ] within the stated tolerance.

**Do not delete a case to make a number pass.** Where a test pins a sentence section 0 names as about to become untrue, pin the behaviour instead and say so.

**`markup/profile-status.test.ts` and `e2e/melody-no-score-count.test.ts` are also changed by lane 78**, which merges first. Take `Shane` into this branch after lane 78 lands and repair both there.

## 6. What must not change

- A sung reading is never displaced, demoted, or discarded by anything in this lane.
- The plausibility verdict still gates nothing.
- Nothing is written to the stored profile; all of this is computed per snapshot.
- The one-tap return to a published profile is **lane 77's**. Do not build it here, and do not add an engine switch for it.
- `ONE VOWEL PER NOTE` (`CONTRACT.md` §0.1) is untouched and nothing may weaken it.

## 7. Done when

1. All eight gates at baseline, gate 4 reported for both the with-scipy and the without-scipy figures, and said which was measured.
2. A singer with five stable core vowels has an incomplete profile and no borrowed value anywhere in her set.
3. A singer with six has all ten values, four of them synthesized and tiered.
4. A singer who has sung nothing and named a type is unchanged from `Shane`.
5. Step 0's synthetic count is reported whatever it says, marked synthetic.
6. **The branch is pushed and left unmerged**, with a report saying it is held under section 0.

## 8. What you could not establish

NOT ESTABLISHED beats a complete invented answer.

Report under this heading whatever you could not settle from the tree, with the instrument you used for each. The desk expects at least these to be live: the full list of browser fixtures that build a five-vowel voice; whether `tools/n200-score` runs inside the eight gates; and whether a positive second resonance beside `f2Quality: 'absent'` exists in any stored profile.
