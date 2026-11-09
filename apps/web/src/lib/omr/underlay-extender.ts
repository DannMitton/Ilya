/**
 * The notes a printed extender lies under (row 181, step 1; Fable's review amendments 2, 3, and 4).
 *
 * A note under the print's own line (an underscore the reader gave as a token, or a long dash kept as one:
 * `underlay-tokens.ts`) sings no new syllable. `NotePlace.underExtender` has always been read by `isContinuation`
 * (`underlay-seat.ts`) and was set by nothing. This sets it, from the token's own box and nothing else
 * (`CONTRACT.md` §0.2: a position comes from the ink, never from an inference).
 *
 * NO SEAT IS CONSULTED. The note the syllable stands on is found by geometry: the note nearest the preceding syllable
 * token's centre (`nearestOf`). The marks are CANDIDATES (step 8b): `seatPage` takes them for a system only where they bring
 * that system's free notes and syllable units to equal, as the slur gate does, and never where they make the counts disagree.
 *
 * THREE SETTINGS, chosen by `?extender=` (`underlay-switch.ts`) and measured by the desk on row 114; DEFAULT `'off'` until it has
 * (step 8a: on row 114 the long dash is the printed hyphen between syllables, and step 1's marking lost seats):
 * - `'off'`: no note is marked at all. The long dash is a joint that sews words, as a hyphen does.
 * - `'a'`: an `extender` token (an underscore) or a long dash standing after a syllable token on the same row.
 * - `'b'`: `'a'`, and also a `joint` token (an ordinary hyphen) whose OWN box spans at least one free note's x. The
 *   evidence is still the token's box, never the distance between two seats; a hyphen that spans no note marks nothing.
 *
 * Pure.
 */
import { isContinuation, kindOf, nearestOf, type NotePlace, type Token } from './underlay-seat';

export type ExtenderArm = 'off' | 'a' | 'b';

/** What the rows held, for the console line the desk reads (row 181 step 1, review amendment 2). */
export interface ExtenderCounts {
	/** `extender` tokens that were not a long dash (an underscore line the reader gave). */
	extender: number;
	/** `joint` tokens (hyphens). */
	joint: number;
	/** Long dashes kept as `extender` tokens (`Token.longDash`). */
	longDash: number;
	/** Notes this call newly marked `underExtender`. */
	marked: number;
}

export const NO_EXTENDERS: ExtenderCounts = { extender: 0, joint: 0, longDash: 0, marked: 0 };

/**
 * The system's notes with `underExtender` set on those a qualifying token lies over, and the counts. `rows` are the
 * system's rows' tokens in page pixels, each in x order. The notes come back as copies; the input is not changed.
 */
export function markExtenderNotes(notes: readonly NotePlace[], rows: readonly (readonly Token[])[], arm: ExtenderArm): { notes: NotePlace[]; counts: ExtenderCounts } {
	const counts = { ...NO_EXTENDERS };
	const out = notes.map((n) => ({ ...n }));
	const order = out.map((_, i) => i).sort((a, b) => out[a].x - out[b].x);
	const xs = order.map((i) => out[i].x);
	for (const tokens of rows) {
		tokens.forEach((token, t) => {
			const kind = kindOf(token.text);
			if (token.longDash) counts.longDash++;
			else if (kind === 'extender') counts.extender++;
			else if (kind === 'joint') counts.joint++;
			// Arm `off` marks nothing (row 181 step 8a). A long dash is a candidate in arm `a` as an underscore is; a plain hyphen only in arm `b`.
			if (arm === 'off') return;
			const line = kind === 'extender' || token.longDash === true;
			if (!line && !(arm === 'b' && kind === 'joint')) return;
			if (xs.length === 0) return;
			// The syllable token standing before it on the row (the token list is in x order).
			let before = -1;
			for (let j = t - 1; j >= 0; j--) {
				if (kindOf(tokens[j].text) === 'syllable') {
					before = j;
					break;
				}
			}
			if (before < 0) return;
			const owner = order[nearestOf((tokens[before].x0 + tokens[before].x1) / 2, xs)];
			const spanned = out.map((n, i) => i).filter((i) => out[i].x >= token.x0 && out[i].x <= token.x1 && i !== owner);
			// A hyphen counts only where it spans a note that was free (not already tied into): the box must lie over a note.
			if (!line && kind === 'joint' && !spanned.some((i) => !isContinuation(notes[i]))) return;
			for (const i of spanned) {
				if (!out[i].underExtender) counts.marked++;
				out[i].underExtender = true;
			}
		});
	}
	return { notes: out, counts };
}
