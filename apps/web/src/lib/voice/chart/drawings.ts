/**
 * THE TEN FINISHED SIDE VIEWS OF THE MOUTH AND THROAT (N.199 Step 6b), one for each vowel. The SVGs live in `chart/sagittal/`, copied byte for byte from
 * `docs/sessions/n199-calibrate/drawings-r4/` (`drawings.test.ts` proves it), and are read with `import.meta.glob` and `?raw` as
 * `components/Reading/CursiveGlyph.svelte` reads its own, so they ride in the page's script and are there offline (`sw.js` precaches the shell only).
 * They replace the ten interim PNGs of Step 4d, which sat in `static/` and could not take a colour.
 *
 * Each file is one drawing: a `fixed` group (the nose, the incisors, the palate, the pharyngeal wall: identical in all ten) and a `moving` group (the
 * tongue, jaw, lips, velum, and pharynx). `SagittalDrawing.svelte` draws the fixed group once and the ten moving groups stacked, cross-faded. Bolla is
 * authoritative for every articulator; the line style and the frame are Dann's (`OPEN.md` section N.199, 2026-11-13 11:06 to 11:35).
 *
 * THE PLATE NUMBERS are the drawing agent's registration and the handoff's: i 17, e 13, ɛ 10, a 3, ɑ 2, o 6, u 19, ɨ 15, ʌ 23; [ɪ] has none and is Dann's own
 * tongue. Not checked against Bolla (1981) itself, which is not in this repository (brief r2, "What the desk could not establish").
 */
import type { Language } from '$lib/i18n';
import { tv } from '$lib/i18n';
import type { Vowel } from '../engine/types';

/** The file for each vowel, in `chart/sagittal/`. */
export const DRAWING_FILE: Record<Vowel, string> = {
	i: 'sag-i.svg',
	e: 'sag-e.svg',
	ɪ: 'sag-smallcap-i.svg',
	ɨ: 'sag-velar-i.svg',
	ɛ: 'sag-open-e.svg',
	a: 'sag-a.svg',
	ɑ: 'sag-dark-a.svg',
	ʌ: 'sag-turned-v.svg',
	o: 'sag-o.svg',
	u: 'sag-u.svg'
};

/** Bolla's plate for each vowel; 0 where he has none. */
export const PLATES: Record<Vowel, number> = { i: 17, e: 13, ɪ: 0, ɨ: 15, ɛ: 10, a: 3, ɑ: 2, ʌ: 23, o: 6, u: 19 };

/** The credit under the vowel's name: the ratified line (Dann 2026-11-13 11:35), with the plate or without. */
export function creditLine(v: Vowel, language: Language): string {
	return PLATES[v] ? tv('capture.credit.plate', language, { n: PLATES[v] }) : tv('capture.credit.noPlate', language);
}

export interface Sagittal {
	/** The root `<svg>`'s drawing attributes, as the files give them: the box and the line. */
	viewBox: string;
	/** The `fixed` group's inner markup, ids stripped, drawn once. */
	fixed: string;
	/** Each vowel's `moving` group's inner markup, ids stripped. */
	moving: Record<Vowel, string>;
}

const stripIds = (s: string) => s.replace(/\sid="[^"]*"/g, '');

function groupInner(svg: string, id: string, until: string): string {
	const open = `<g id="${id}">`;
	const a = svg.indexOf(open);
	if (a < 0) throw new Error(`no <g id="${id}"> in a sagittal drawing`);
	const b = svg.indexOf(until, a);
	return svg.slice(a + open.length, b);
}

/**
 * Builds the one drawing from the ten files' text. The `fixed` group is taken from [i]'s and `drawings.test.ts` proves it is the same in all ten; the
 * `<metadata>` (a provenance manifest the files carry) and every id are left out of what is drawn, so no id repeats in the page.
 */
export function buildSagittal(files: Record<string, string>): Sagittal {
	const get = (v: Vowel) => {
		const svg = files[DRAWING_FILE[v]];
		if (!svg) throw new Error(`missing drawing for [${v}]`);
		return svg;
	};
	const first = get('i');
	const viewBox = /viewBox="([^"]+)"/.exec(first)?.[1] ?? '-24 -12 544 544';
	// `fixed` ends at the `moving` group's opening; `moving` ends at the metadata.
	const fixed = stripIds(groupInner(first, 'fixed', '<g id="moving">')).replace(/<\/g>\s*$/, '');
	const moving = {} as Record<Vowel, string>;
	for (const v of Object.keys(DRAWING_FILE) as Vowel[]) moving[v] = stripIds(groupInner(get(v), 'moving', '<metadata>')).replace(/<\/g>\s*$/, '').trim();
	return { viewBox, fixed: fixed.trim(), moving };
}
