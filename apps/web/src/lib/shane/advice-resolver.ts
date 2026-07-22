/**
 * The advice resolver: Fit's prescriptive layer (framework §4), as a PURE
 * POST-PASS over an already-analysed score.
 *
 * The pure score-parser overlay engine forecasts what the acoustics DO (open /
 * close timbre, the pitch of turning, the fR1/fo crossing) and deliberately
 * leaves `AnalyzedEvent.vowelModification` `undefined` so it stays content-free
 * (`overlay-engine.test.ts` asserts this; `analysis-types.ts`'s own comment
 * assigns the field to the analysis-application layer). This module is that
 * layer: given an `AnalyzedScore`, it returns a NEW `AnalyzedScore` with
 * `vowelModification` populated on the events a SOURCED advice case matches,
 * and everything else untouched.
 *
 * Where it runs (§A.158 RULED A): as a post-pass in `apps/web`, wired at the
 * `analyzed = $derived(analyzeScore(...))` seam in `VoiceProfilePane`, BEFORE
 * `buildWatchList` reads the events, so the watch line can render the resolved
 * advice. It is NOT threaded through `analyzeScore`, keeping the pure engine
 * content-free.
 *
 * The general modification engine (§A.162, score-parser `modificationTarget`)
 * now supersedes the v1 hardcoded `[i]→[ɪ]` case without waste: each case names
 * a source vowel and its SOURCED target, and the resolver reads the engine's
 * computed target from the singer's own measured matrix. The SOURCED target
 * governs what the singer is told (Dann, 2026-07-21): over the curated measured
 * matrix the computed target equals the sourced one, and if a future Jones-full
 * search ever diverges (e.g. computing `[o]→[ɔ]` where Grayson prescribes
 * `[ɑ]`), or the profile is too sparse to compute a target at all, the sourced
 * target still wins. The computed target is the forecast layer, never the
 * uncited prescription. The `[o]→[ɑ]` cover and the higher-voice cases slot in
 * here as new entries in `ADVICE_CASES`, each with its own predicate, sourced
 * target, and verified citation, at their sourcing beats.
 *
 * Integrity (framework §8): every advice string carries a `citation`, an
 * INTERNAL provenance record verified on the actual source page before it ships
 * (the v1 string is Mitton, re-verified on the thesis this cycle). The citation
 * is never printed on the paper apparatus; attribution lives in Learn/Guide
 * (Dann, 2026-07-21). Forecast-not-declare extends to advice: the copy hedges
 * ("you may find it helpful", §A.169), it does not command.
 *
 * Tags: SOURCED (a ruling, a type, or a verified citation), INFERENCE (derived),
 * JUDGEMENT (a build-time default, Dann rules). Copy is Dann's and is APPROVED
 * (§A.169); this module only places it.
 *
 * Pure and framework-free, so it unit-tests the way the parsers do.
 */

import {
	modificationTarget,
	type AnalyzedEvent,
	type AnalyzedScore
} from '@ilya/score-parser';

/** The machine-readable register tag on the resolved advice (§A.159). */
type Register = 'hazard' | 'opportunity';

/**
 * One sourced advice case. The v1 set has a single entry; higher voices slot in
 * as additional entries (the resolver's extension seam, §A.162). Each case is a
 * pure predicate over an analysed event plus the sourced advice it emits, with
 * the SOURCED target vowel it names and its verified internal citation.
 */
interface AdviceCase {
	/** Stable identifier, for provenance and debugging (never rendered). */
	readonly id: string;
	/** The register this case emits (§A.159). */
	readonly register: Register;
	/**
	 * The operative sung vowel (IPA) this case advises on, or omitted for a
	 * VOWEL-AGNOSTIC case that keys on the circumstance, not the vowel (H2, Dann
	 * 2026-07-22); documentation only, since `matches` carries the predicate.
	 */
	readonly sourceVowel?: string;
	/**
	 * The SOURCED target vowel (IPA) the pedagogue prescribes: what the singer is
	 * told to lean toward. The sourced target governs the shipped advice (Dann,
	 * 2026-07-21), even where the general engine's computed target would differ.
	 * Omitted for an ARTICULATORY case, whose sourced fix is a manoeuvre (open,
	 * drop the jaw), not a vowel substitution, and which names no target (H2).
	 */
	readonly sourcedTarget?: string;
	/** The internal provenance record, verified on the source; never printed. */
	readonly citation: string;
	/** Does this event trigger the case? Pure, side-effect-free. */
	matches(ev: AnalyzedEvent): boolean;
	/**
	 * The sourced advice copy. Receives the operative sung vowel and, for a
	 * named-target case, the target vowel to lean toward (`undefined` for an
	 * articulatory case).
	 */
	copy(vowel: string, target?: string): string;
}

/**
 * SOURCED (Mitton 2020, re-verified on the thesis page this cycle,
 * 2026-07-21). The internal provenance record for the `[i]→[ɪ]` crossing
 * advice, never printed. Mitton states BOTH the modification and its acoustic
 * effect in his own words, so this one source carries the whole string; Bozeman
 * (the general vowel-opening lever) is corroborating, not load-bearing here, and
 * joins the acknowledgements at the per-voice sourcing beat.
 */
const MITTON_I_TO_LAX_I_CITATION =
	'Mitton 2020, Sung Russian for the Low Male Voice Classical Singer (Univ. of Toronto DMA), ' +
	'§6.2.1 (Kabalevsky Op. 52 no. 1) and §6.1.5 (Sunless 5): the singer "may open [i] slightly ' +
	'to [ɪ], moving the fR1 of [i] up and out of the way of the sung pitch."';

/**
 * v1 case (§A.161): an `[i]` vowel on a forecast fR1/fo crossing. `ev.vowel` is
 * the operative sung vowel (IPA verbatim from the resolver); `ev.crossing` is
 * the engine's forecast that fo has reached fR1. A hazard (§A.159): a fix is
 * offered. Detection generalises via the crossing predicate landing on
 * different vowels per voice (§A.162); the ADVICE is voice-specific and sourced,
 * so higher voices need their own cases, not a widened predicate here.
 *
 * The APPROVED copy (§A.169) is templated on the target vowel: "first
 * resonance" not "first formant" (§A.164 consistency); the forecast-not-declare
 * hedge "you may find it helpful"; slashes `/ɪ/` to match the crossing line's
 * `/i/`. For the sourced target `ɪ` it renders Dann's approved string verbatim.
 */
const I_CROSSING: AdviceCase = {
	id: 'i-to-lax-i-crossing',
	register: 'hazard',
	sourceVowel: 'i',
	sourcedTarget: 'ɪ',
	citation: MITTON_I_TO_LAX_I_CITATION,
	matches: (ev) => ev.crossing === true && ev.vowel === 'i',
	copy: (_vowel, target) =>
		`You may find it helpful to relax the jaw and lean it toward /${target}/, giving it a touch more space, which lifts your first resonance clear of the pitch.`
};

/**
 * SOURCED (Godin & Howell 2015, Opus-verified on the rendered poster,
 * 2026-07-22). The internal provenance record for the [ɔ] crossing advice, never
 * printed. At its own crossing (fo meets fR1) the soprano [ɔ] reaches WHOOP
 * coupling (F1/H1), and the poster's fix is to OPEN and MAINTAIN that coupling.
 * Quoted verbatim in the poster's own "F1"/"H1"/"C#5" notation; our own usage is
 * fR1/fo (§A.164/§A.165).
 */
const GODIN_HOWELL_O_CROSSING_CITATION =
	'Godin & Howell 2015, "Setting Vowels in the Female Secondo Passaggio" (New England ' +
	'Conservatory, poster), Mussorgsky "Serenade" analysis and Fig. 10: [ɔ] "presents the biggest ' +
	'problem ... where the first formant sits on C#5"; the lower-passaggio vowels [o], [ɔ], and [e] ' +
	'"can open the vowel to maintain this F1/H1 coupling" (Yell and Whoop). Opus-verified on the ' +
	'rendered poster, 2026-07-22.';

/**
 * The [ɔ] crossing case (H1, Dann 2026-07-22). SOURCED (Godin & Howell 2015).
 * ARTICULATORY and vowel-specific to [ɔ] (open-o), DISTINCT from O_COVER's close
 * [o]. At its own crossing (fo meets fR1) the soprano [ɔ] reaches whoop coupling
 * (F1/H1); the sourced fix is to OPEN and MAINTAIN the coupling, the OPPOSITE
 * intent to the [i] crossing (which opens to clear fR1 off the pitch, §A.161), so
 * it is its own case, never a widening of [i]. Firing is voice-safe: only a high
 * voice reaches [ɔ]'s high fR1. It reuses the crossing watch kind and line (no
 * watchlist change); §A.188 surfaces the exposed, climactic instance (the poster's
 * "biggest problem" spot). No target vowel: the fix is a manoeuvre, not a
 * substitution.
 *
 * The APPROVED copy is Dann's (2026-07-22, "Candidate 3"): forecast-not-declare;
 * it follows the crossing line's whoop observation and says "let it"; no notation
 * on the page (fR1/fo stay in our voice; the poster's F1/H1 live only in the
 * citation quote).
 */
const OPEN_O_CROSSING: AdviceCase = {
	id: 'open-o-whoop-crossing',
	register: 'hazard',
	sourceVowel: 'ɔ',
	citation: GODIN_HOWELL_O_CROSSING_CITATION,
	matches: (ev) => ev.crossing === true && ev.vowel === 'ɔ',
	copy: () =>
		`You may find it helpful to allow the turn and let the vowel open into that fuller, headier resonance; up here it settles the tone rather than straining to stay bright.`
};

/**
 * SOURCED (§A.185, Opus-verified on the pages, 2026-07-21). The internal
 * provenance record for the `[o]→[ɑ]` cover advice, never printed. The cover is
 * MITTON's own synthesis (§6.2.5, via his §3.2.4 cover theory after
 * Doscher/Bozeman), NOT Grayson's (Grayson's `/o/` diction target is the
 * diphthong `[oːʌ]`, and his high-note `[ɑ]` is universal, not Russian-specific).
 * The dark, backed character of the `[ɑ]` target is grounded in the backed
 * articulation of sung Russian `/o/` (Grayson 2012, the sung `/o/` "drawn back
 * toward the pharynx") and Mitton's dark-a-dominant repertoire, NOT in the
 * "basis of articulation" (a spoken-language descriptor, neutral for Russian);
 * corroborated by Kochetov (U of T phonetician, DMA-recital note, 2016). Cite
 * E4, not the prose typo "E3" (§A.180).
 */
const MITTON_O_COVER_CITATION =
	'Mitton 2020, Sung Russian for the Low Male Voice Classical Singer (Univ. of Toronto DMA), ' +
	'§6.2.5 (Kabalevsky Op. 52 no. 5, mm. 69–70): the LMV "may find it easier to modify the ' +
	'climactic [o] vowel ... toward [ɑ]" (E4, the range ceiling; the prose "E3" is a typo, §A.180), ' +
	'via §3.2.4 on Cover. Dark/backed target grounded in Grayson 2012 (sung Russian [o] drawn back ' +
	'toward the pharynx) and Mitton Ch. 6 (dark-a-dominant repertoire); NOT the basis of articulation ' +
	'(§A.185). Corroborated by A. Kochetov (U of T), DMA-recital note, 2016.';

/**
 * The `[o]→[ɑ]` cover case (§A.185, RULED Option B trigger §A.179). Fires on the
 * engine's content-free exposure forecast: a `close`-timbre `[o]` carried at or
 * above the singer's declared ceiling AND sustained (`ev.sustainedCeilingExposure`,
 * the three-gate predicate score-parser computes; §A.183). A hazard (§A.159): a
 * fix is offered. The ADVICE is voice- and language-specific and sourced, so the
 * predicate is narrow (`vowel === 'o'` here); the watch list surfaces the same
 * exposure via a hazard kind (clause 3, §A.149).
 *
 * The APPROVED copy is Dann's (2026-07-22), templated on the target vowel: the
 * forecast-not-declare hedge "you may find it helpful"; slashes to match the
 * watch line; a semicolon (not an em-dash) for the nested thought. For the
 * sourced target `ɑ` it renders Dann's approved string verbatim.
 */
const O_COVER: AdviceCase = {
	id: 'o-to-dark-a-cover',
	register: 'hazard',
	sourceVowel: 'o',
	sourcedTarget: 'ɑ',
	citation: MITTON_O_COVER_CITATION,
	matches: (ev) => ev.vowel === 'o' && ev.sustainedCeilingExposure === true,
	copy: (_vowel, target) =>
		`You may find it helpful to allow the vowel to open and darken toward /${target}/; that is a more comfortable option than a close /o/ this high.`
};

/**
 * SOURCED (Godin & Howell 2015, Opus-verified on the rendered poster,
 * 2026-07-22). The internal provenance record for the exposed close-vowel
 * active-open (formant-tracking) advice, never printed. The poster's fix is
 * ARTICULATORY and names no target vowel: a close vowel carried above its first
 * resonance is opened by dropping the jaw so fR1 rises to track fo (the
 * fundamental). Quoted verbatim in the poster's own "F1"/"H1" notation; our own
 * usage is fR1/fo (§A.164/§A.165). Bozeman KVP2 formant tracking (Ch.10 p.96;
 * glossary p.141) corroborates, Opus-verified on the photographed pages 2026-07-22.
 */
const GODIN_HOWELL_TRACKING_CITATION =
	'Godin & Howell 2015, "Setting Vowels in the Female Secondo Passaggio" (New England ' +
	'Conservatory, poster), Brahms "Immer Leiser" analysis and Fig. 9: vowels carried above ' +
	'their first formant location "will only function if F1 is raised to track H1. To accomplish ' +
	'this, Ms. Godin drops her jaw." Opus-verified on the rendered poster, 2026-07-22. ' +
	'Corroborated by Bozeman, Kinesthetic Voice Pedagogy 2 (Inside View Press, 2021), ' +
	'Ch. 10 p.96 ("fR1 must be raised approximately in tandem with the sung pitch to track the ' +
	'1fo") and glossary p.141 ("Formant tracking: the tuning of a resonance to follow or track ' +
	'a specific harmonic, such as fR1:1fo, tracking of whoop timbre, upper treble voice ' +
	'strategy"); KVP2 writes fR1/1fo (Titze consensus, §A.164), no translation needed. ' +
	'Opus-verified on the photographed pages, 2026-07-22.';

/**
 * The exposed close-vowel active-open (formant-tracking) case (H2; Dann,
 * 2026-07-22). VOWEL-AGNOSTIC: it keys on the CIRCUMSTANCE, not the vowel,
 * because the fix (open, drop the jaw, raise fR1 to track fo) is the mechanism,
 * not a per-vowel substitution. Fires on the engine's content-free exposure
 * forecast (close timbre + at-or-above ceiling + long sustain; §A.183), NOT on
 * a crossing (the [i] crossing case and the crossing kind cover that), AND only
 * on the WHOOP side of the ladder (`aboveFirstResonance`, fo above fR1; §A.190).
 * The guard matters: "raise fR1 to track fo" is only coherent once fo has
 * reached fR1, so a male voice's turned-over-but-below-crossing close vowel is
 * NOT this case; it goes to MALE_TURNOVER, whose sourced fix is the opposite. A
 * hazard (§A.159): the fix is offered, no target vowel named. Ordered AFTER the
 * crossing and the cover in `ADVICE_CASES`, so [i] stays the crossing and [o]
 * stays the Russian cover; this catches every other exposed close vowel held
 * above its own fR1 (sopranos, and male [i]/[u] at the very top).
 *
 * The APPROVED copy is Dann's (2026-07-22): the forecast-not-declare hedge; it
 * names the sung vowel it fires on (no target vowel); a semicolon, not an
 * em-dash, for the nested thought; "first resonance" not "first formant"
 * (§A.164). "Raising to the pitch" is formant tracking of fo in lay terms, the
 * opposite direction to the [i] crossing's "clear of the pitch".
 */
const OPEN_TRACKING: AdviceCase = {
	id: 'exposed-close-vowel-open-tracking',
	register: 'hazard',
	citation: GODIN_HOWELL_TRACKING_CITATION,
	matches: (ev) =>
		ev.sustainedCeilingExposure === true && ev.crossing !== true && ev.aboveFirstResonance === true,
	copy: (vowel) =>
		`You may find it helpful to let the jaw drop to open the vowel here, raising your first resonance to the pitch; that eases the sound rather than holding a close /${vowel}/ squeezed this high.`
};

/**
 * SOURCED (Bozeman 2008, Choral Journal 48/12, p.69; Bozeman 2010, Journal of
 * Singing 66/3, p.292; Opus-verified on the rendered pages, 2026-07-22). The
 * internal provenance for the male turnover advice, never printed. For a male
 * voice a close vowel carried past its turn but with fo still below fR1 is let
 * to turn over and settle, NOT opened to chase the coupling: opening early
 * "becomes a yell with increasingly pressed phonation" (2010, p.292); "after H2
 * has passed through F1 and the tone has shifted, mouth opening can and should
 * follow" (2008, p.69). Quoted verbatim in Bozeman's F1/H2 notation; our own
 * usage is fR1/fo/2fo (§A.164/§A.165).
 */
const BOZEMAN_MALE_TURNOVER_CITATION =
	'Bozeman 2008, "Registration Strategies for Training the Male Passaggio" (Choral Journal 48/12), ' +
	'p.69, and Bozeman 2010, "The Role of the First Formant in Training the Male Singing Voice" ' +
	'(Journal of Singing 66/3), p.292: a close vowel is allowed to turn over rather than opened to chase ' +
	'the coupling, which "becomes a yell with increasingly pressed phonation"; "after H2 has passed ' +
	'through F1 and the tone has shifted, mouth opening can and should follow." Opus-verified on the ' +
	'rendered pages, 2026-07-22.';

/**
 * The male turnover case (§A.190; Dann 2026-07-22). SOURCED (Bozeman 2008/2010).
 * ARTICULATORY and VOWEL-AGNOSTIC, the turned-side sibling of OPEN_TRACKING: it
 * fires on the SAME three-gate exposure (close timbre + at-or-above ceiling +
 * long sustain; §A.183), and not on a crossing, but on the TURNED side of the
 * ladder, where fo is still below fR1 (`aboveFirstResonance !== true`; §A.190).
 * There the sourced fix is the OPPOSITE of OPEN_TRACKING's whoop-tracking: let
 * the vowel turn and settle into its closer, ringier place, do not force it open
 * (which presses toward the yell). No target vowel: the fix is a manoeuvre. `[o]`
 * is claimed first by O_COVER (ordered earlier), so this catches every OTHER
 * exposed close vowel held below its own fR1 at the top of the range (the tenor /
 * higher-voice terrain; the low male's own exposed [i] at the ceiling is a
 * crossing, not this).
 *
 * The APPROVED copy is Dann's (2026-07-22, "draft 1"): the forecast-not-declare
 * hedge; it names the sung vowel it fires on (no target vowel); "the ring" is
 * the singer's-formant redirect in lay terms; a semicolon, not an em-dash, for
 * the nested thought. Its direction is the opposite of OPEN_TRACKING's, so a
 * tenor who sees both lines is told the right thing on each.
 */
const MALE_TURNOVER: AdviceCase = {
	id: 'exposed-close-vowel-turnover',
	register: 'hazard',
	citation: BOZEMAN_MALE_TURNOVER_CITATION,
	matches: (ev) =>
		ev.sustainedCeilingExposure === true && ev.crossing !== true && ev.aboveFirstResonance !== true,
	copy: (vowel) =>
		`You may find it helpful to let the /${vowel}/ turn and gather here rather than spreading it open for more sound; up this high the ring comes from letting it settle, not from pushing it wider.`
};

/**
 * The sourced advice cases, in match order (first match wins). The extension
 * seam for the general engine and per-voice pedagogy (§A.162, build order §C
 * items 3–4). Named-target cases first (`[i]→[ɪ]` crossing, `[ɔ]` crossing,
 * `[o]→[ɑ]` cover), then the two articulatory exposure siblings split by ladder
 * side: OPEN_TRACKING on the whoop side (fo above fR1) and MALE_TURNOVER on the
 * turned side (fo below fR1); the two are mutually exclusive (§A.190).
 */
// The specific named-target cases (crossings, cover) MUST precede the two
// articulatory exposure siblings so [i]/[ɔ] stay crossings and [o] stays the
// cover. OPEN_TRACKING and MALE_TURNOVER are mutually exclusive on the ladder
// side, so their order relative to each other is immaterial.
const ADVICE_CASES: readonly AdviceCase[] = [
	I_CROSSING,
	OPEN_O_CROSSING,
	O_COVER,
	OPEN_TRACKING,
	MALE_TURNOVER
];

/**
 * Populate `vowelModification` on every event a sourced case matches, returning
 * a NEW `AnalyzedScore`; the input is not mutated (non-destructive, so a cached
 * analysis is never rewritten in place). An event that already carries advice is
 * left as is (defensive: the engine never sets it, so the resolver is the sole
 * writer, but this keeps the pass idempotent). An event no case matches is
 * carried through unchanged, including a crossing with no v1 advice, which keeps
 * its descriptive whoop line in the watch list (§A.149 dial is additive, Dann's
 * ruling B, 2026-07-21): advice is an add-on, never a gate.
 *
 * The general modification engine computes the acoustic target from the singer's
 * own measured matrix (§A.162, `modificationTarget`); the SOURCED target governs
 * what ships (Dann, 2026-07-21). The engine is read and confirmed here, and the
 * sourced target is what fills the copy: over the curated measured matrix they
 * coincide, and a divergent or uncomputable target never overrides the source.
 */
export function resolveAdvice(analyzed: AnalyzedScore): AnalyzedScore {
	const events: Record<string, AnalyzedEvent> = {};
	for (const [id, ev] of Object.entries(analyzed.events)) {
		if (ev.vowelModification) {
			events[id] = ev;
			continue;
		}
		const hit = ADVICE_CASES.find((c) => c.matches(ev));
		if (!hit) {
			events[id] = ev;
			continue;
		}
		// The SOURCED target governs (§A.176); the engine's computed target is read
		// and confirmed for a named-target case but never overrides the source. An
		// ARTICULATORY case (no `sourcedTarget`) names no vowel to lean toward (H2).
		let target: string | undefined;
		if (hit.sourcedTarget !== undefined) {
			const computed = modificationTarget(ev.vowel, analyzed.calibrationSnapshot);
			target = computed?.vowel === hit.sourcedTarget ? computed.vowel : hit.sourcedTarget;
		}
		events[id] = {
			...ev,
			vowelModification: { text: hit.copy(ev.vowel, target), citation: hit.citation, register: hit.register }
		};
	}
	return { ...analyzed, events };
}
