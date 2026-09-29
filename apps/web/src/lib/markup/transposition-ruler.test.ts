import { describe, expect, it } from 'vitest';
import type { TranspositionCandidate } from '@ilya/score-parser';
import {
	bandLine,
	isHome,
	isStopOf,
	openingStops,
	pageHeader,
	printedKey,
	readout,
	stopLabel,
	stopsFor,
	type NamedKey,
} from './transposition-ruler';

const D_MAJOR: NamedKey = { fifths: 2, mode: 'major' };
const B_MAJOR = { semitones: -3, fifths: 5 };
const C_FLAT_MAJOR = { semitones: -3, fifths: -7 };

const candidate = (semitones: number, fifths: number): TranspositionCandidate => ({
	semitones,
	intervalName: '',
	outOfRange: 0,
	crossings: 0,
	resolvesRange: true,
	targetKey: '',
	targetKeySignature: { fifths, mode: 'major' },
});

describe('the Transposition ruler, named', () => {
	it('draws the stops of drawing r4 for a song in D major', () => {
		expect(stopsFor(D_MAJOR).map((s) => stopLabel(s, D_MAJOR, 'en'))).toEqual([
			'A♭', 'A', 'B♭', 'B', 'C♭', 'C', 'C♯', 'D♭', 'D', 'E♭', 'E', 'F', 'F♯', 'G♭', 'G', 'A♭',
		]);
		expect(stopLabel(C_FLAT_MAJOR, D_MAJOR, 'fr')).toBe('do♭');
	});

	it('reads out the interval and the key, and the recommendation on its stop only', () => {
		expect(readout(B_MAJOR, D_MAJOR, B_MAJOR, 'en')).toBe('Down a minor third · B major · Ilya’s recommendation');
		expect(readout(C_FLAT_MAJOR, D_MAJOR, B_MAJOR, 'en')).toBe('Down a minor third · C flat major');
		expect(readout(B_MAJOR, D_MAJOR, B_MAJOR, 'fr')).toBe('Une tierce mineure plus bas · si majeur · recommandation d’Ilya');
		expect(readout({ semitones: 5, fifths: 1 }, D_MAJOR, null, 'fr')).toBe('Une quarte juste plus haut · sol majeur');
		expect(readout({ semitones: 0, fifths: 2 }, D_MAJOR, B_MAJOR, 'en')).toBe('D major');
	});

	it('says the key on the Piece band, as printed and transposed', () => {
		expect(bandLine(null, D_MAJOR, 'en')).toEqual({ before: 'Key: ', key: 'D major', after: ', as printed', transposed: false });
		expect(bandLine(B_MAJOR, D_MAJOR, 'fr')).toEqual({ before: 'Tonalité : ', key: 'si majeur', after: ', après transposition', transposed: true });
		expect(bandLine({ semitones: 0, fifths: 2 }, D_MAJOR, 'en').transposed).toBe(false);
	});

	it('prints the header of drawing r4, plate 3, in both languages, and nothing as printed', () => {
		expect(pageHeader(B_MAJOR, D_MAJOR, 'en')).toBe('Transposed down a minor third from D major, at the singer’s choice.');
		expect(pageHeader(B_MAJOR, D_MAJOR, 'fr')).toBe(
			'Transposition d’une tierce mineure vers le bas à partir de ré majeur, au choix de l’interprète.',
		);
		expect(pageHeader(null, D_MAJOR, 'en')).toBeNull();
		expect(pageHeader({ semitones: 0, fifths: 2 }, D_MAJOR, 'en')).toBeNull();
	});

	it('opens on the first suggestion, marks the second, and on the printed key with none', () => {
		expect(openingStops(D_MAJOR, [candidate(-3, 5), candidate(-2, 0)])).toEqual({
			pick: B_MAJOR,
			runnerUp: { semitones: -2, fifths: 0 },
		});
		expect(openingStops(D_MAJOR, [])).toEqual({ pick: null, runnerUp: null });
	});

	it('names no key for a source with no mode, so offers no ruler', () => {
		expect(printedKey({ fifths: 2 })).toBeNull();
		expect(printedKey(undefined)).toBeNull();
		expect(printedKey({ fifths: 2, mode: 'major' })).toEqual(D_MAJOR);
	});

	it('applies a stored choice only when the printed key offers it', () => {
		expect(isStopOf(B_MAJOR, D_MAJOR)).toBe(true);
		expect(isStopOf({ semitones: -3, fifths: 4 }, D_MAJOR)).toBe(false);
		expect(isHome(null, D_MAJOR)).toBe(true);
	});
});
