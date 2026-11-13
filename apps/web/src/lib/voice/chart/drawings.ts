/**
 * The ten interim side views of the mouth and throat (N.199 Step 4d), one for each vowel, in `static/sagittal/` (served at `/sagittal/`).
 * They are Dann's own 2020 panels, cropped, as the desk filed them (`docs/sessions/n199-calibrate/interim-sagittal/`); "interim" because
 * the redrawn set is out of scope here (brief r5 section 8) and "realized by you" is not yet true of them (`not-in-the-handoff.md`, item 9).
 *
 * THE PLATE NUMBERS are board D's (`n199-board-d-drawer-desktop.dc.html`, its `plates` array, in `VOWELS` order), carried as the
 * board has them. NOT CHECKED against Bolla (1981) or Mitton (2020), Fig. 4.3: Bolla is not in this repository. A zero is the board's
 * "Bolla has no plate for this vowel". The credit line's final wording is Dann's (brief section 11, item 2).
 */
import type { Vowel } from '../engine/types';

export interface Drawing {
	src: string;
	/** Bolla's plate as board D gives it; 0 for none. */
	plate: number;
}

export const DRAWINGS: Record<Vowel, Drawing> = {
	i: { src: '/sagittal/sag-i.png', plate: 17 },
	e: { src: '/sagittal/sag-e.png', plate: 13 },
	ɪ: { src: '/sagittal/sag-smallcap-i.png', plate: 0 },
	ɨ: { src: '/sagittal/sag-velar-i.png', plate: 15 },
	ɛ: { src: '/sagittal/sag-open-e.png', plate: 10 },
	a: { src: '/sagittal/sag-a.png', plate: 3 },
	ɑ: { src: '/sagittal/sag-dark-a.png', plate: 2 },
	ʌ: { src: '/sagittal/sag-turned-v.png', plate: 23 },
	o: { src: '/sagittal/sag-o.png', plate: 6 },
	u: { src: '/sagittal/sag-u.png', plate: 19 }
};

/** The credit under the vowel's name, from board D: Mitton (2020), Fig. 4.3, after Bolla (1981), plate N, or that Bolla has none. DRAFT. */
export function creditLine(v: Vowel): string {
	const p = DRAWINGS[v].plate;
	return `Interim drawing: Mitton (2020), Fig. 4.3${p ? `, after Bolla (1981), plate ${p}.` : '. Bolla has no plate for this vowel.'}`;
}
