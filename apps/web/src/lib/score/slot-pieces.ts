/**
 * The pieces of a word that may own a slot (`buildSlotQueue`, `pairings.ts`).
 *
 * ONE VOWEL PER NOTE (`CONTRACT.md` §0.1, N.135 step 4): a piece of a word with
 * no vowel letter owns no slot. It joins the piece before it in the word (the
 * leftward fold `buildSlotQueue` applies to a whole vowelless word), or, as the
 * word's first piece, joins the next piece. Every writer of typed text copies a
 * slot from the queue (`firstPass`, `refreshPairings`, `placeSyllable`,
 * `applyCliticSeat`, `reseatByDiff`, `seatScoreWords`, `applyHeal`, and the
 * rest), so a piece that never becomes a slot never reaches a note. The check is
 * `hasVowelLetter`, the shared one (`omr/assert-vowel-per-note.ts`).
 *
 * `slotIndex` counts the slots emitted, not the engine's piece index `k`: they
 * agree wherever nothing folded, so `begin` and `end` still read from it
 * (`pairedSyllableType`). The engine's own cut puts a vowel in every piece, so a
 * fold is a defence, rare in practice.
 *
 * Pure.
 */
import { hasVowelLetter } from '$lib/omr/assert-vowel-per-note';

const STRESS_MARK = 'ˈ';

/** One piece that may own a slot: the engine's piece `k`, with any vowelless piece folded in. */
export interface Piece {
	k: number;
	cyrillic: string;
	ipa: string;
}

/** Text that rides ahead of the next piece: the proclitics waiting in the line, or a vowelless piece of the word. */
export interface Rider {
	cyrillic: string;
	ipa: string;
}

const NBSP = '\u00A0';

/**
 * The word's pieces with the vowelless ones folded. `cyr(k)` and `ipa(k)` are the
 * engine's piece `k` (with the singer's case, with the stress mark); `punctuation`
 * rides on the word's last piece; `pending` is the proclitics waiting in the line,
 * which join the first piece behind the stress mark (`vowel-resolver.ts:547-551`).
 * Where no piece holds a vowel letter, `carry` is what the next word takes up
 * instead (`pending` and the word's letters), and `pieces` is empty.
 */
export function foldVowellessPieces(count: number, cyr: (k: number) => string, ipa: (k: number) => string, punctuation: string, pending: Rider): { pieces: Piece[]; carry: Rider | null } {
	const pieces: Piece[] = [];
	let lead: Rider = { cyrillic: '', ipa: '' };
	for (let k = 0; k < count; k++) {
		const own = cyr(k);
		const text = own + (k === count - 1 ? punctuation : '');
		if (!hasVowelLetter(own)) {
			const last = pieces[pieces.length - 1];
			if (last) {
				last.cyrillic += text;
				last.ipa += ipa(k);
			} else lead = { cyrillic: lead.cyrillic + text, ipa: lead.ipa + ipa(k) };
			continue;
		}
		let sung = ipa(k);
		if (pieces.length === 0 && (pending.ipa || lead.ipa)) {
			const before = pending.ipa + lead.ipa;
			sung = sung.startsWith(STRESS_MARK) ? STRESS_MARK + before + sung.slice(STRESS_MARK.length) : before + sung;
		}
		const own0 = pieces.length === 0 ? lead.cyrillic + text : text;
		pieces.push({ k, cyrillic: pieces.length === 0 && pending.cyrillic ? pending.cyrillic + NBSP + own0 : own0, ipa: sung });
	}
	if (pieces.length > 0 || !lead.cyrillic) return { pieces, carry: null };
	return { pieces, carry: { cyrillic: pending.cyrillic ? pending.cyrillic + NBSP + lead.cyrillic : lead.cyrillic, ipa: pending.ipa + lead.ipa } };
}
