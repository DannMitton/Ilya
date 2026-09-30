# Critique of the desk's plan (2026-09-30)

## 1. What is right

Splitting "could a human tract produce this" from "where does it sit among the types" is the correct cut, and it matches the rulings: nothing stops capture, one question at the summary, "the values Ilya draws on" (PRODUCT.md lines 1081 to 1087; first-moments brief §Strings). Real voices as a regression suite, measured data, and named personas are the right instincts. The norms pool as observation records with kinds kept apart (norms draft §Revision 2) is a sound base for the inner envelope.

## 2. Weaknesses and better alternatives

**The plan answers the wrong question first.** Dann's [i] read 1063, 247, and 186 Hz on three days (extractor brief §What is observed). No envelope fixes an instrument with that spread; any honest envelope would still flag 186 Hz. Better: make repeat-take agreement (two takes of one vowel within about two semitones) the primary acceptance signal, and let envelopes only decide whether to ask once at the summary.

**Speech-formant norms do not make a valid outer envelope for fry-derived sung resonances.** General knowledge, no citation offered: the classic tables (Peterson and Barney, Hillenbrand) are modal speech by adult speakers of American English, with F1 for men's [i] near 270 to 340 Hz. Classical singers lower the larynx, round and protrude the lips, and lengthen the tract; a "human envelope" built from speech would place a trained bass [i] at or below its own floor, which is exactly the false alarm the ruling forbids. Better: an outer envelope from tract-length physics plus a wide margin, stated as a desk estimate, widened by the real-voice suite on evidence.

**The two named studies may not measure the quantity needed.** Johnson and Kempster 2010, as far as I know, classifies male voices by long-term average spectrum, and I could not establish what Müller et al. 2022 measured. Neither is an fR1-per-vowel study of sung vowels. Pooling them as fR1 data mixes kinds, which the norms draft forbids (§"Different kinds of quantity"). Better: admit them as `range` or `LTAS` rows only, once Dann has the papers.

**The order leaves the extractor exposed.** "1, then 3, then 2, then 4" puts the only thing that can test the extractor (real voices) third. Better: 1, then 2 at N=3 (Dann plus two colleagues, one high, one low), then 3, then 4, then grow the suite.

**Real voices in a public repository is an ethics problem the plan does not see.** Ilya is open source. Committing colleagues' WAVs publishes their voices forever; withdrawal is impossible once cloned. Better: synthetic fixtures public; real takes in a private store Dann controls; only per-take expected values and md5s in the repo; a one-page bilingual consent that names storage, withdrawal, and that isolated fry vowels are low but not zero in identifiability; adults only.

**Per-type pools must not touch what Insights computes.** The singer's measured values are the values (PRODUCT.md §"Universal relations, individual values", line 260). Better: pools route citations and the one summary note, and nothing else; write that as a rule.

**Devices fail more often than voices.** Browsers enable echo cancellation, noise suppression, and automatic gain by default in getUserMedia (general knowledge); phone microphones high-pass below fry fundamentals; Bluetooth headsets narrowband the signal. The plan tests voices, not devices. Better: a device matrix in the synthetic suite (resampled, high-passed, AGC-compressed variants) and a session log line recording sample rate and the constraints actually applied.

**Populations missed.** Singers who cannot or will not produce fry (some sopranos, some vocal conditions, some CCM training); very tall and very small singers, where tract length drives the resonances more than the label does; singers recording quietly in shared housing.

## 3. Improvements, ranked

1. Repeat-take agreement as the acceptance signal; envelopes only choose whether to ask. Cost: one extra take per vowel, or a re-take only on disagreement.
2. Fixture policy: synthetic public, real private, expected values public. Cost: a private store and a consent page.
3. Device matrix and a preflight log line. Cost: a day in the synthetic harness.
4. Start the real suite at N=3 and grow. Cost: none.
5. A "Not sure" persona set, since most singers will pick it. Cost: small.
6. Version the norms pool and cite the version in the summary note. Cost: small.
7. A non-fry fallback path, flagged Provisional. Cost: design work; Dann's call.

## 4. Questions only Dann can answer

- May colleagues' recordings ever sit in a public repository? Recommendation: never.
- Should the summary note name the declared type, or only "the values Ilya draws on"? Recommendation: keep the ratified strings as they stand.
- Is a non-fry capture path wanted for singers who cannot fry? Recommendation: yes, later, marked Provisional.
- Treble voices in the suite? Recommendation: adults only; trebles as synthetic personas.

## 5. What I could not establish

The uploads hold only `plausibility.ts` from the engine; `analyze.ts`, `extract.ts`, and the getUserMedia constraints were not available, so claims about what the app does with audio are general knowledge, not read code. The content of Müller et al. 2022 and Johnson and Kempster 2010. Whether Bozeman's bands are measured or estimated beyond his own "approximate" (`plausibility.ts`, header comment). The exact scope of "no voice type named" (PRODUCT.md line 220 cites plan ruling 10, not read).
