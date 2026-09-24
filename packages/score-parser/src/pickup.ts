/**
 * THE PICKUP THAT ARRIVES CARRYING ITS OWN LENGTH AS A METER.
 *
 * Walk finding 2026-09-24, ruled by Dann 10:17: Sunless 2 printed 2/4 over
 * its two-beat anacrusis and 4/4 at bar 2, where the dissertation prints the
 * song's 4/4 once, over the incomplete bar. The `.musx` itself holds bar 1 as
 * an actual 2/4 displayed as 4/4 (`<beats>2</beats>`, `<dispBeats>4</dispBeats>`,
 * `<useDisplayTimesig/>`), Finale's way of writing a pickup. denigma carries
 * the actual meter into MNX and drops the displayed one, so the parsers'
 * own pickup test (content shorter than bar 1's OWN meter) never fires. A
 * MusicXML file written the same way fails the same test.
 *
 * THE RULE, DESK DEFAULT: when bar 1 is shorter than bar 2's meter and its
 * meter differs from bar 2's, bar 1 is a pickup under bar 2's meter. It takes
 * bar 2's signature and length and `isPickup`, and the meter list opens with
 * bar 2's signature and records no change at bar 2. No event moves: an
 * event's position is within its measure, and its id never names the meter.
 *
 * Both parsers call this after their own duration accounting, so every
 * reader shares one rule: MusicXML and `.mxl` and `.mscz` through
 * `musicxml-parser.ts`, `.mnx` and `.musx` through `mnx-parser.ts`.
 */

import type { Fraction, Measure, TimeSignatureChange } from './types';

function shorter(a: Fraction, b: Fraction): boolean {
	return a.numerator * b.denominator < b.numerator * a.denominator;
}

/** Applies the rule in place. True when bar 1 became a pickup under bar 2's meter. */
export function adoptPickupMeter(measures: Measure[], timeSignatures: TimeSignatureChange[]): boolean {
	const [first, second] = measures;
	if (!first || !second || first.isPickup) return false;
	const a = first.timeSignature;
	const b = second.timeSignature;
	if (!a || !b || (a.beats === b.beats && a.beatType === b.beatType)) return false;
	if (!shorter(first.expectedDuration, second.expectedDuration)) return false;

	first.timeSignature = b;
	first.expectedDuration = second.expectedDuration;
	first.isPickup = true;

	const rest = timeSignatures.filter((t) => t.measureIndex > 1);
	timeSignatures.length = 0;
	timeSignatures.push({ measureIndex: 0, signature: b }, ...rest);
	return true;
}
