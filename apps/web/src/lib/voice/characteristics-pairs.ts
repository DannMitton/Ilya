/**
 * THE INVERTED-PAIR TESTS (N.203 lane 61, Step 1). They were two `$derived` values in `CalibrationWizard.svelte`; the pickers moved to
 * "Describe your voice", and the test moved with them, as a function. Gentle consistency notes (amber, never a block): an inverted pair is
 * almost certainly a typo, but the station is not a gate and the analysis copes, so the note only names what it sees. Enharmonic-aware
 * through `pitchToMidi`.
 */
import { pitchToMidi, type Pitch } from '@ilya/score-parser';

export interface PairInput {
	rangeLow?: Pitch;
	rangeHigh?: Pitch;
	tessituraLow?: Pitch;
	tessituraHigh?: Pitch;
}

export function invertedPairs(c: PairInput | undefined): { range: boolean; tessitura: boolean } {
	return {
		range: !!(c?.rangeLow && c.rangeHigh) && pitchToMidi(c.rangeLow) > pitchToMidi(c.rangeHigh),
		tessitura: !!(c?.tessituraLow && c.tessituraHigh) && pitchToMidi(c.tessituraLow) > pitchToMidi(c.tessituraHigh),
	};
}
