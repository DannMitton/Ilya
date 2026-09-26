/**
 * Approval (golden-master) test for the staff renderer's PUBLIC ENTRY
 * POINT (`renderAnalyzedStaff`, `@ilya/score-parser`, defined in
 * staff-renderer.ts, 3,534 lines; one function carries cyclomatic
 * complexity 244) run end to end through the REAL MusicXML parser on a
 * REAL, already-committed fixture:
 * `apps/web/src/lib/shane/ingestion/fixtures/sunless-01-engraved.musicxml`
 * (5,024 lines; Mussorgsky, "Without Sun no. 1: Within Four Walls").
 * `packages/score-parser/src/approval/staff-renderer.approval.test.ts`
 * covers the same renderer against the package's own synthetic demo
 * fixture; this file adds the one real score in the repository, so the
 * renderer is pinned against something an engraver actually produced, not
 * only hand-built test data.
 *
 * The no-DOM-in-node fix: `MusicXmlScoreParser.parse` needs a global
 * `DOMParser` for string input (musicxml-parser.ts:863-872) and none
 * exists under vitest/node, so this test uses `parseXml` from
 * `$lib/shane/ingestion/mini-dom.ts`, the app's own dependency-free XML
 * reader, exactly as `score-seat.test.ts`, `waiting-seat.test.ts`, and
 * five other test files in this app already do (grep
 * `from './ingestion/mini-dom'` under `src/lib/shane`).
 *
 * The vowel resolver is NOT `buildVowelResolver`
 * (`$lib/shane/vowel-resolver.ts`): that function runs the fixture's
 * Cyrillic verse through `processText`, which needs Ilya's ~1.29M-word
 * dictionary injected via module-level state
 * (`@ilya/phonology`'s `setStressDictionary`). This suite's other file,
 * `ipa-corpus.approval.test.ts`, injects that real dictionary into the
 * SAME module-level state inside one vitest worker, and vitest's default
 * per-file isolation was not verified strong enough to guarantee this
 * file never observes it (NOT ESTABLISHED; see the memo). Rather than
 * make this approval depend on load order across two test files, the
 * resolver here reads the vowel directly off the fixture's own verse 2,
 * which is ALREADY the singable IPA transcription the engraver printed
 * (`<lyric number="2">` throughout the fixture; see `vowelFromVerse2`
 * below), independent of any dictionary. This is honest, sourced, and
 * simpler, but is a narrower approval than production's actual resolver
 * would give; recorded here rather than left implicit.
 *
 * Determinism: `MusicXmlScoreParser` assigns each syllable a fresh
 * `crypto.randomUUID()` (musicxml-parser.ts:268-276) when the source
 * gives no id, which this fixture never does, so `syllable.id` differs
 * run to run. `staff-renderer.ts` never reads `syllable.id` (grep turns
 * up no `data-syllable` or `.syllable.id` in that file), so it never
 * reaches this test's SVG output; no normalization is needed here (this
 * IS needed, and IS performed, in the two parser-approval tests that
 * snapshot `ParsedScore` JSON directly). `analyzeScore` is given a fixed
 * `generatedAt`, the only other place non-determinism could enter.
 */

import { describe, expect, it } from 'vitest';
import {
	MusicXmlScoreParser,
	analyzeScore,
	demoProfile,
	renderAnalyzedStaff,
	type ParsedScore,
	type VowelResolver,
} from '@ilya/score-parser';
import { parseXml } from '$lib/shane/ingestion/mini-dom';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const FIXTURE_PATH = join(
	__dirname,
	'../shane/ingestion/fixtures/sunless-01-engraved.musicxml',
);

// Grayson's restricted, singable IPA inventory (AGENTS.md), vowels only.
const GRAYSON_VOWELS = new Set(['a', 'ɑ', 'e', 'ɛ', 'i', 'ɪ', 'ɨ', 'o', 'u', 'ʌ']);

/** The first Grayson vowel character found in a syllable's verse-2 IPA text. */
function firstVowel(ipa: string): string | undefined {
	for (const ch of ipa) if (GRAYSON_VOWELS.has(ch)) return ch;
	return undefined;
}

/**
 * A vowel resolver sourced directly from the fixture's own printed IPA
 * verse (index 1 = verse 2; see `SyllableInfo.verses`), not from
 * `processText`. See file header for why.
 */
function vowelFromVerse2(parsed: ParsedScore): VowelResolver {
	const byId = new Map<string, string>();
	for (const ev of parsed.vocalLine) {
		const ipa = ev.syllable?.verses?.[1];
		if (ipa) {
			const v = firstVowel(ipa);
			if (v) byId.set(ev.id, v);
		}
	}
	return (ev) => byId.get(ev.id);
}

async function parseFixture(): Promise<ParsedScore> {
	const xml = readFileSync(FIXTURE_PATH, 'utf8');
	const result = await new MusicXmlScoreParser().parse({
		format: 'musicxml',
		data: parseXml(xml) as unknown as Document,
		sourcePath: 'sunless-01-engraved.musicxml',
	});
	return result.score;
}

describe('renderAnalyzedStaff approval: real MusicXML fixture (sunless-01-engraved)', () => {
	it('renders the parsed fixture identically to the approved SVG (primitive mode)', async () => {
		const parsed = await parseFixture();
		const resolver = vowelFromVerse2(parsed);
		const analyzed = analyzeScore(parsed, demoProfile, resolver, {
			generatedAt: '2026-07-12T00:00:00.000Z',
		});
		const svg = renderAnalyzedStaff(parsed, analyzed, {});
		await expect(svg).toMatchFileSnapshot('./__approved__/sunless-01-engraved.primitive.svg');
	});
});
