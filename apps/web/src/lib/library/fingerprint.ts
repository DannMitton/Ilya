/**
 * fingerprint.ts — recognition, never identity.
 *
 * N.67 step 2. Design §2.3 layer 2 and §2.4. Two hashes, both SHA-256 through
 * Web Crypto, which is a platform API and weighs nothing.
 *
 * - `contentHash` NAMES immutable stored bytes. It can never go stale, because
 *   the thing it names cannot change.
 * - `fingerprint` answers one question, "have I met this music before?", and
 *   its answer is always a prompt to the singer, never a silent action. A
 *   stale one costs a missed recognition, which the singer resolves by name.
 *
 * NEITHER IS IDENTITY. The song id is random, permanent, and derived from
 * nothing (design §2.3 layer 1), so correcting a typo in a composer's name
 * moves nothing and re-exporting a score from Finale moves nothing either.
 */
import type { VocalLineEvent } from '@ilya/score-parser';

async function sha256(data: BufferSource): Promise<string> {
	const digest = await crypto.subtle.digest('SHA-256', data);
	return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

/** SHA-256 of the score file's own bytes. */
export function hashBytes(bytes: BufferSource): Promise<string> {
	return sha256(bytes);
}

/**
 * The canonical vocal line, as one string: `id|pitch|duration` per event, in
 * order, RESTS INCLUDED.
 *
 * The event ids are the ones both parsers already construct positionally and
 * deterministically (`musicxml-parser.ts:701`, identically `mnx-parser.ts:899`),
 * which is why the same music re-exported through a different format
 * fingerprints identically while a genuinely changed note does not.
 *
 * Exported separately from the hash so a test can read the canonical form
 * rather than compare two opaque digests and learn nothing from a failure.
 */
export function canonicalVocalLine(vocalLine: readonly VocalLineEvent[]): string {
	return vocalLine
		.map((event) => {
			const pitch = event.pitch
				? `${event.pitch.step}${event.pitch.alter ?? 0}${event.pitch.octave}`
				: 'rest';
			const duration = `${event.duration.base}.${event.duration.dots}`;
			return `${event.id}|${pitch}|${duration}`;
		})
		.join('\n');
}

export function fingerprintVocalLine(vocalLine: readonly VocalLineEvent[]): Promise<string> {
	return sha256(new TextEncoder().encode(canonicalVocalLine(vocalLine)));
}
