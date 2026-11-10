/**
 * bar-layer.ts — what the page reads of the barline and time signature layer.
 *
 * QUEUE row 138, B2. The page used to hold `correctedLine` as one
 * `applyCorrections` call over the read; it now asks this class, which runs
 * that call and then `rebar` (the layer: `rebar.ts`), once for each pair of
 * inputs it is handed. Moved here because `+page.svelte` is at its line ceiling
 * and a line of logic in a `.svelte` file has no test.
 *
 * A GETTER CLASS, as `CorrectionVerbs` is: a getter reads the same answer under
 * vitest and in the browser, where reading `$state` through one is tracked, so
 * the page's `$derived` over it re-runs when the score or the corrections do.
 * The result is MEMOISED on the identity of the two inputs, because a dozen
 * places read the line and a rebar for each would be wasteful.
 *
 * TWO COORDINATES (`rebar.ts`): `line` and `score.measures` are in SONG bars;
 * `preLine`, the ingested score's own measures, the print strip, and the kept
 * bands are in READING bars. `readingLabelOf` is the conversion the Loupe's
 * strip needs.
 */
import type { Measure, ParsedScore, VocalLineEvent } from '@ilya/score-parser';
import { applyCorrections, type CorrectionMap } from './correction';
import { barlineVerb, type BarlineVerb } from './barline-marks';
import { IDENTITY_BARS, rebar, type BarMap } from './rebar';
import { heldBar, setSignature, type HeldBar, type Through } from './time-signature';

export interface BarLayerDeps {
	/** The ingested score, as the reader produced it, or null. */
	score(): ParsedScore | null;
	corrections(): CorrectionMap;
}

interface Computed {
	/** The corrected line before the layer: reading bars. */
	pre: VocalLineEvent[];
	line: VocalLineEvent[];
	score: ParsedScore | null;
	bars: BarMap;
}

export class BarLayer {
	readonly #d: BarLayerDeps;
	#memo: { score: ParsedScore | null; map: CorrectionMap; out: Computed } | null = null;

	constructor(deps: BarLayerDeps) {
		this.#d = deps;
	}

	#get(): Computed {
		const score = this.#d.score();
		const map = this.#d.corrections();
		const memo = this.#memo;
		if (memo && memo.score === score && memo.map === map) return memo.out;
		const pre = applyCorrections(score?.vocalLine ?? [], map);
		let out: Computed;
		if (!score) out = { pre, line: pre, score: null, bars: IDENTITY_BARS };
		else {
			const r = rebar(score, pre, map);
			out = { pre, line: r.line, score: r.score, bars: r.bars };
		}
		this.#memo = { score, map, out };
		return out;
	}

	/** The corrected line, in song bars: what the page draws and every verb walks. */
	get line(): VocalLineEvent[] {
		return this.#get().line;
	}

	/** The corrected line before the layer, in reading bars. */
	get preLine(): VocalLineEvent[] {
		return this.#get().pre;
	}

	/** The ingested score with the layer applied (measures, lists, and line in song bars), or null. */
	get score(): ParsedScore | null {
		return this.#get().score;
	}

	get bars(): BarMap {
		return this.#get().bars;
	}

	/** The song bar's measure: signature, key, clef, and number as the singer has them. */
	measureAt(songBar: number): Measure | undefined {
		return this.#get().score?.measures.find((m) => m.index === songBar);
	}

	/** The bar's own display number, the index being the fallback (a pickup is `'0'` or `''`, `types.ts:225`). */
	labelOf(songBar: number): string {
		const m = this.measureAt(songBar);
		return m && m.number.trim() ? m.number : String(songBar + 1);
	}

	/** The printed bar's number for a bar named by its number as the singer reads it (the Loupe's tag); the label itself where no mark moved a barline. */
	readingLabelOfLabel(label: string): string {
		if (this.bars.identity) return label;
		const m = this.#get().score?.measures.find((x) => x.number.trim() === label.trim());
		const i = m ? m.index : Number.parseInt(label, 10) - 1;
		return Number.isFinite(i) && i >= 0 ? this.readingLabelOf(i) : label;
	}

	/** The Barline verb the entry offers, with the corrections it would write (`barline-marks.ts`); null where none, or where there is no score. */
	barlineVerb(id: string): BarlineVerb | null {
		const score = this.#d.score();
		return score ? barlineVerb(score, this.#get().pre, this.#d.corrections(), id) : null;
	}

	/** The bar the entry sits in, its opener, and the signatures in play (`time-signature.ts`); null where none. */
	heldBar(id: string): HeldBar | null {
		const score = this.#d.score();
		return score ? heldBar(score, this.#get().pre, this.#d.corrections(), id) : null;
	}

	/** The corrections after the singer sets the held bar's time signature, keeping the barlines (`time-signature.ts`); null where it cannot be. */
	signatureWrite(id: string, sig: { beats: number; beatType: number }, through: Through): CorrectionMap | null {
		const score = this.#d.score();
		return score ? setSignature(score, this.#get().pre, this.#d.corrections(), id, sig, through) : null;
	}

	/** The number the PRINTED bar carries: the reading's, for the strip and the banner's list. */
	readingLabelOf(songBar: number): string {
		const r = this.bars.toReading(songBar);
		const m = this.#d.score()?.measures.find((x) => x.index === r);
		return m && m.number.trim() ? m.number : String(r + 1);
	}
}
