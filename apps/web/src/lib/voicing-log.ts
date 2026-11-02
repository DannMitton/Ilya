/**
 * WHAT THE CROSS-WORD PASS DID TO A WORD'S FINAL, WRITTEN INTO THE WORD THE PAGE READS (QUEUE row 157).
 *
 * `GraysonEngine.applyCrossWordAssimilation` works on `ipaSurface`. The syllables the page draws and the
 * transcription log the Inspector reads are separate, so a change to the surface has to be carried into both,
 * once, after the pass. `finishLine` (`pipeline.ts`, at its line ceiling) calls `writeSurfaceToWord` for each word;
 * the block that used to sit there inline is this function, moved verbatim and then extended:
 *
 *  - the surface's last syllable replaces the syllable's own, and the last consonant's log entry is marked as
 *    devoiced where the surface devoiced it (`GraysonEngine.voicedToVoiceless`, which has no ɣ, so a surface
 *    ending in ɣ is never marked);
 *  - «бог» (Dann 2026-10-26 21:35): the entry `transcribe` marked with `bogException` takes the surface's final,
 *    [x] or [ɣ], so the ribbon says what the IPA line says;
 *  - a final that KEPT its voicing at boundary #4 (Grayson pp. 251-252; the engine sets `retainedVoicing` on the word,
 *    `engine.ts` `applyCrossWordAssimilation`) marks its last consonant entry, so the Inspector's blurb can say why a
 *    preposition or a particle did not devoice. Such a word's surface equals its underlying one, so the block above
 *    skips it and nothing else marks it.
 */
import { GraysonEngine } from '@ilya/phonology';
import type { SyllableData } from '@ilya/phonology';

/** The fields of a transcribed word this reads and writes. */
export interface SurfaceWord {
	ipaSurface: string;
	ipaUnderlying: string;
	syllables: SyllableData[];
	transcriptionLog: any[];
	/** Set by the cross-word pass where a final consonant kept its voicing at boundary #4, not through в. */
	retainedVoicing?: boolean;
}

export function writeSurfaceToWord(tw: SurfaceWord): void {
	if (tw.ipaSurface !== tw.ipaUnderlying && tw.syllables.length > 0) {
		const lastSyl = tw.syllables[tw.syllables.length - 1];
		const underlyingConcat = tw.syllables.map((s: SyllableData) => s.ipa).join('');
		const surfaceClean = (tw.ipaSurface ?? '').replace(/[ˈ\s]+/g, '');
		const prefixLen = underlyingConcat.length - lastSyl.ipa.length;

		if (surfaceClean.length >= prefixLen) {
			const newLastSylIpa = surfaceClean.slice(prefixLen);
			lastSyl.ipa = newLastSylIpa;

			// Update transcription log: mark final consonant as devoiced
			if (tw.transcriptionLog && tw.transcriptionLog.length > 0) {
				for (let i = tw.transcriptionLog.length - 1; i >= 0; i--) {
					const entry = tw.transcriptionLog[i];
					if (entry.features && entry.features.type === 'consonant') {
						const devoicingMap = GraysonEngine.voicedToVoiceless;
						if (devoicingMap[entry.ipa]) {
							entry.ipa = devoicingMap[entry.ipa];
							entry.features.finalDevoicing = true;
						}
						break;
					}
				}
			}
		}
	}
	followBogFinal(tw);
	markRetainedVoicing(tw);
}

/** «бог»: the log entry `transcribe` marked takes the surface's final consonant, [x] or [ɣ]. */
function followBogFinal(tw: SurfaceWord): void {
	const final = tw.ipaSurface.slice(-1);
	if (final !== 'x' && final !== 'ɣ') return;
	const entry = tw.transcriptionLog.find((e) => e.features?.bogException);
	if (entry) entry.ipa = final;
}

/** A kept voicing: the word's last consonant entry says so, for `deriveRule` (`@ilya/blurb`) to read as `retained-voicing`. */
function markRetainedVoicing(tw: SurfaceWord): void {
	if (!tw.retainedVoicing) return;
	for (let i = tw.transcriptionLog.length - 1; i >= 0; i--) {
		const entry = tw.transcriptionLog[i];
		if (entry.features?.type === 'consonant') {
			entry.features.retainedVoicing = true;
			return;
		}
	}
}
