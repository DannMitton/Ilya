# Code brief: how Ilya synthesizes the vowels a singer did not sing

r1, 2026-11-20, by the desk (Opus 5), for Fable's review before any lane is cut. Branch when cut: `cloud-lane-76`, from `Shane` after lane 75 merges. It serves QUEUE row 167's successor work and the ruling in `../memory/OPEN.md`, "VOICE: TWO PROFILES, AND ONE MARK", with its section "THE FILL RULE, and why the asked-for set is SEVEN".

## 1. What this is for, in a singer's terms

A singer gives Ilya some of her ten Russian vowels in vocal fry. Ilya needs the rest. Today it reaches them by six fixed proportions taken from the internal relationships of one informant's measured vowels, Dann's own, and applies those proportions to every singer whatever her voice (`apps/web/src/lib/voice/engine/derivations.ts:20-36`). Dann's objection, 2026-11-20 01:43: *"We already know that my own voice ius atypoical. Grafting my distribution onto a treble voice is going to lead to unreliable data"*.

The commissioned literature scan (`research-vowel-synthesis-methods_r1_2026-11-20.md`, md5 `f7dcdff2`) measured the objection. Across nine speakers in Padgett and Tabain (2005), read in full, the first-resonance step from [i] to [ɨ] runs from slightly negative to +0.90 ERB; the step in Mitton's sung fry is 1.74 ERB, about twice the largest of those nine. On the second resonance [ɨ] falls between [i] and [u] in all nine speakers, at 13 to 54 percent of the way, where Ilya uses 67 percent. A first-resonance ratio for [ɪ] over [i] has a median of 1.47 in Peterson and Barney's men, 1.26 in Hillenbrand's men, and 1.10 in his women. One voice's proportions have no claim on another's.

**What the singer gets from this work:** every value Ilya shows her is her own measurement, or one reference set scaled to the size of her own vocal tract by a single number drawn from everything she sang. One rule, one scale, and a mark on every value she did not sing.

## 2. The rulings this enacts

All Dann's, with his words in `../memory/INBOX.md` under their times on 2026-11-20.

1. **Two profiles and one mark** (00:42 to 01:13). A profile is wholly borrowed from a named voice type, or wholly her own. Once she sings anything, nothing is borrowed into her set.
2. **Ilya synthesizes, and owns the uncertainty** (02:15): *"we will in fact provide velar-i so figure out a eway to do so that we can explain and we will own the uncertainty of it. A sample is always best, but a bad sample is no good."*
3. **The term is synthesis** (02:15), adopted from pacifier v11 §9.2, not coined here. `derivation` stays only where it names the old mechanism being replaced.
4. **A published proportion applied to her own measurements is admissible; another voice's absolute values are not** (00:54).
5. **Transparency and veracity**, and Ilya resists inventing on incomplete input (01:02, 01:04).

## 3. What changes

### 3.1 The reference set

Ilya holds one reference set: the ten fR1 and fR2 values of Mitton (2020), §5.3.3, Table 5.3, printed page 81 (PDF page 99 of `~/Documents/Voice Pedagogy Library/M-O/Mitton_D (2020) - Sung Russian for the Low Male Voice Classical Singer The Latent Pedagogical Value of Sung Russian - DMA dissertation.pdf`).

**Read the table from that page and encode all twenty values, with the page cited in the file's header.** Do not take them from this brief and do not reconstruct them from the existing ratios. The desk read six fR1 values there as a cross-check: [i] 296, [e] 381, [ɪ] 393, [ɨ] 404, [ɛ] 577, [a] 711 Hz. If your extraction disagrees with any of those six, stop and report rather than proceeding.

Today's `MITTON_FR2` (`voice/engine/stand-ins.ts:46`) holds six of the ten fR2 values already; it is superseded by the full table and its name should say what it is.

### 3.2 The scale

One scale per singer, the constant ratio hypothesis as set out for missing vowels in Barreda and Nearey (2018), JASA 144(1), 500-520, now filed in the library's A-C folder. The scale is the geometric mean, over every vowel she has sung and both resonances where she sang them, of her value divided by the reference value for that same vowel.

**This is one reference, one scale.** Today's `tractScale` (`stand-ins.ts:122`, called at `:160`) computes its scale against `template('middle')`, a composite of five Bozeman staves, while the synthesized vowels would come from Mitton's table. Scaling against one shape and filling from another is incoherent; both sides become Mitton's table.

### 3.3 What is synthesized, and what is asked for

| vowel | what Ilya does |
| --- | --- |
| [i], [e], [ɛ], [a], [ɑ], [o], [u] | asked for; never synthesized for a singer who has begun sampling |
| [ɨ], [ɪ], [ʌ] | synthesized as reference value times her scale, each marked |

The seven asked-for vowels are already what the capture screen asks for (`voice/CalibrationWizard.svelte:103-105`, `voice/chart/tour.ts:10-12`), so neither file's membership changes.

### 3.4 Confidence, and the mark

Every synthesized value is marked wherever it appears. **[ɨ] carries a wider uncertainty than [ɪ] and [ʌ]** and says so, on the evidence in section 1. The exact form of the mark and its words are the wording round's, not this lane's; this lane carries the provenance through to the surfaces that draw it and leaves today's wording in place.

Today the mark is driven by one flag set when a vowel's first resonance reads `surrogate` (`packages/score-parser/src/overlay-engine.ts:231`), and a value derived from her own anchors is not flagged. After this change every synthesized value is scaled from another voice's reference, so the flag's meaning has to be re-decided rather than inherited. **Report what you find before changing it.**

### 3.5 A sample beats a synthesis, and a poor sample does not

A sung vowel supersedes its synthesis. A sung vowel Ilya cannot read steadily does not supersede it, and Ilya names which of the two it is using. The existing divergence check for [ɨ] (pacifier v11 §7.4, built as `useEstimate`, `voice/engine/sung.ts:14-15`) is the nearest mechanism; say whether it can carry this, and note that its window must widen to match the measured spread or it will flag correct singing as divergent.

### 3.6 What goes

`voice/engine/derivations.ts`'s six proportions and the anchor table that feeds them (`:20-36`, `:50-55`). **`expectedF1` is also read by the plausibility guard** (`voice/engine/plausibility.ts:30`, `:219`), which uses it to centre its judgement windows. Establish what the guard does for a vowel with no `expectedF1` before removing anything, and report it.

## 4. Out of scope, named so it is not drifted into

The completion threshold and what a page says while a profile is incomplete; the blank states; the wizard's words; the one-tap return to a borrowed profile; and every string. Those are the VOICE lane and the wording round. This lane changes how a value is produced and carries its provenance, and changes no string.

## 5. What the review should test hardest

1. Whether one reference and one scale is what Barreda and Nearey actually support for a missing vowel, read in the filed paper, and whether the scan's reading of it survives your own.
2. Whether scaling against Mitton's table breaks anything that currently depends on `template('middle')`, including the chart's drawing ground.
3. What the plausibility guard does once `expectedF1` loses [ɨ] and [a].
4. Whether the accuracy claim is honest: the scan's own comparison is desk arithmetic on spoken English, not a published result for sung Russian in fry, and nothing in this brief or in any string may present it as measured.
5. Whether anything here grafts one voice onto another by a route the brief has not noticed.

## 6. What you could not establish

**NOT ESTABLISHED beats a complete invented answer.**

Carried in: how close a synthesized value falls to a measured one for sung Russian in vocal fry; why Mitton's [i] to [ɨ] step is about twice the largest spoken one measured; and whether the reference would be better served by more singers' complete ten-vowel sets, which the scan names as the largest available gain and which no reading can supply.
