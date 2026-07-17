/**
 * Fit tempo tier-default resolver (steady tempo words).
 *
 * Turns a written tempo WORD with no metronome number into a credible,
 * honest, overridable starting bpm, for the text-derived (INFERRED) tier of
 * the tempo provenance gradient. Not authoritative: a place to start.
 *
 * Three layers, each with its own provenance (house rule §3):
 *   - Tier (slow | moderate | fast): SOURCED. Membership is Quantz's own
 *     grouping, quoted via Huebsch Schilling 2019 (fn. 20) and verified
 *     against the primary text. Terms outside Quantz's list carry a
 *     JUDGEMENT tier.
 *   - Representative bpm: JUDGEMENT, from music21's `defaultTempoValues`
 *     (BSD 3-Clause, cuthbertLab/music21; adopted with attribution). Modern
 *     editorial single points, a sensible start, not a sourced era figure.
 *   - Tier range band: JUDGEMENT. The visible honesty: real practice spans
 *     this much, so the singer adjusts.
 *
 * The display layer carries the reliability caveat, quotable from
 * Martin-Castro & Ucar 2020 (PLOS ONE): even a composer's own metronome
 * marks are contested (a documented ~12 bpm systematic offset).
 *
 * Scope: steady tempo words only. Gradual and relative cues (rit., accel.,
 * a tempo, Tempo I, meno/piu mosso) are NOT tier terms; the separate
 * gradual-cue model owns them, and they carry no tier bpm here.
 *
 * Pure and self-contained (no ParsedScore dependency), so it is unit-proven
 * in-sandbox. OCR-ready: normalize, exact, then bounded fuzzy; unrecognized
 * input returns null so Fit stays silent and prompts the singer, never a
 * guess (§A.56).
 */

export type TempoTier = 'slow' | 'moderate' | 'fast';

export interface TempoTermResolution {
	/** Canonical term matched, for display. */
	term: string;
	tier: TempoTier;
	/** How the tier classification is grounded. */
	tierSource: 'quantz' | 'judgement';
	/** Representative starting bpm (quarter-note); JUDGEMENT / music21. */
	bpm: number;
	/** The tier's honest practice band, [low, high]. */
	range: [number, number];
	/** Always 'inferred': never the confidence of an encoded number. */
	provenance: 'inferred';
}

/** Per-tier honest range bands (JUDGEMENT), anchored near Quantz's 80-pulse. */
export const TEMPO_TIER_BANDS: Record<TempoTier, [number, number]> = {
	slow: [40, 69],
	moderate: [66, 112],
	fast: [116, 208],
};

interface TermEntry {
	term: string;
	tier: TempoTier;
	tierSource: 'quantz' | 'judgement';
	bpm: number;
	aliases?: string[];
}

/**
 * The term table. `tierSource: 'quantz'` marks terms in Quantz's own
 * three-tier list (Schilling 2019 fn. 20, verified). bpm values are music21
 * `defaultTempoValues` unless the trailing comment tags a JUDGEMENT bpm.
 */
const TERMS: TermEntry[] = [
	// ── Slow ──
	{ term: 'larghissimo', tier: 'slow', tierSource: 'judgement', bpm: 16 },
	{ term: 'grave', tier: 'slow', tierSource: 'quantz', bpm: 40 },
	{ term: 'largo', tier: 'slow', tierSource: 'quantz', bpm: 46 },
	{ term: 'lento', tier: 'slow', tierSource: 'quantz', bpm: 52, aliases: ['lent', 'slow', 'langsam'] },
	{ term: 'adagio', tier: 'slow', tierSource: 'quantz', bpm: 56 },
	{ term: 'larghetto', tier: 'slow', tierSource: 'quantz', bpm: 60 },
	{ term: 'adagietto', tier: 'slow', tierSource: 'judgement', bpm: 66 },
	// ── Moderate ──
	{ term: 'andante', tier: 'moderate', tierSource: 'quantz', bpm: 72, aliases: ['andte'] },
	{ term: 'andantino', tier: 'moderate', tierSource: 'quantz', bpm: 80 },
	{ term: 'andante moderato', tier: 'moderate', tierSource: 'judgement', bpm: 83 },
	{ term: 'maestoso', tier: 'moderate', tierSource: 'judgement', bpm: 88 },
	{ term: 'moderato', tier: 'moderate', tierSource: 'quantz', bpm: 92, aliases: ['moderate', 'modere', 'modéré', 'massig', 'mässig', 'mäßig', 'modto'] },
	{ term: 'tempo di minuetto', tier: 'moderate', tierSource: 'quantz', bpm: 108 }, // JUDGEMENT bpm (dance tempo)
	{ term: 'allegretto', tier: 'moderate', tierSource: 'quantz', bpm: 108 },
	// ── Fast ──
	{ term: 'allegro moderato', tier: 'fast', tierSource: 'quantz', bpm: 116 }, // JUDGEMENT bpm (tier floor; music21 gives 128)
	{ term: 'animato', tier: 'fast', tierSource: 'judgement', bpm: 120 },
	{ term: 'alla breve', tier: 'fast', tierSource: 'quantz', bpm: 132 }, // JUDGEMENT bpm (meter-dependent)
	{ term: 'allegro', tier: 'fast', tierSource: 'quantz', bpm: 132, aliases: ['fast', 'schnell', 'vite', 'allo'] },
	{ term: 'vif', tier: 'fast', tierSource: 'quantz', bpm: 132 }, // JUDGEMENT bpm
	{ term: 'allegrissimo', tier: 'fast', tierSource: 'judgement', bpm: 140 },
	{ term: 'molto allegro', tier: 'fast', tierSource: 'judgement', bpm: 144, aliases: ['tres vite', 'très vite'] },
	{ term: 'vivace', tier: 'fast', tierSource: 'quantz', bpm: 160 },
	{ term: 'vivacissimo', tier: 'fast', tierSource: 'judgement', bpm: 168 },
	{ term: 'presto', tier: 'fast', tierSource: 'quantz', bpm: 184 },
	{ term: 'prestissimo', tier: 'fast', tierSource: 'quantz', bpm: 208 },
];

function normalize(s: string): string {
	return s.toLowerCase().replace(/\s+/g, ' ').trim().replace(/\.+$/, '').trim();
}

function stripDiacritics(s: string): string {
	return s.normalize('NFD').replace(/[̀-ͯ]/g, '');
}

const EXACT = new Map<string, TermEntry>();
const STRIPPED = new Map<string, TermEntry>();
for (const e of TERMS) {
	for (const k of [e.term, ...(e.aliases ?? [])]) {
		const nk = normalize(k);
		if (!EXACT.has(nk)) EXACT.set(nk, e);
		const sk = stripDiacritics(nk);
		if (!STRIPPED.has(sk)) STRIPPED.set(sk, e);
	}
}

/** Levenshtein edit distance. */
function lev(a: string, b: string): number {
	const m = a.length;
	const n = b.length;
	const dp: number[][] = Array.from({ length: m + 1 }, () => new Array<number>(n + 1).fill(0));
	for (let i = 0; i <= m; i++) dp[i][0] = i;
	for (let j = 0; j <= n; j++) dp[0][j] = j;
	for (let i = 1; i <= m; i++) {
		for (let j = 1; j <= n; j++) {
			dp[i][j] = Math.min(
				dp[i - 1][j] + 1,
				dp[i][j - 1] + 1,
				dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
			);
		}
	}
	return dp[m][n];
}

function toResolution(e: TermEntry): TempoTermResolution {
	return {
		term: e.term,
		tier: e.tier,
		tierSource: e.tierSource,
		bpm: e.bpm,
		range: TEMPO_TIER_BANDS[e.tier],
		provenance: 'inferred',
	};
}

/**
 * Resolve a written tempo word to a tier default, or null when it is not a
 * recognized steady tempo word. Match order: exact (diacritic-preserving,
 * then stripped), bounded fuzzy (edit distance <= 2, but a tie spanning more
 * than one tier resolves to null rather than a guess), then a head-term token
 * match so modified markings like "Allegro con brio" classify by their head
 * (v1 ignores modifier nudges). A full compound term ("Allegro moderato")
 * wins over its head token because exact precedes the token pass.
 */
export function resolveTempoTerm(text: string): TempoTermResolution | null {
	if (!text) return null;
	const n = normalize(text);
	if (!n) return null;
	const sn = stripDiacritics(n);

	let hit = EXACT.get(n) ?? STRIPPED.get(sn) ?? null;

	if (!hit) {
		let best = 3;
		let cands: TermEntry[] = [];
		for (const [key, e] of STRIPPED) {
			const d = lev(sn, key);
			if (d < best) {
				best = d;
				cands = [e];
			} else if (d === best) {
				cands.push(e);
			}
		}
		if (best <= 2 && cands.length > 0) {
			const tiers = new Set(cands.map((c) => c.tier));
			if (tiers.size === 1) hit = cands[0];
			// A tie across tiers stays null: never guess between slow and fast.
		}
	}

	if (!hit) {
		for (const tok of sn.split(' ')) {
			const e = STRIPPED.get(tok);
			if (e) {
				hit = e;
				break;
			}
		}
	}

	return hit ? toResolution(hit) : null;
}
