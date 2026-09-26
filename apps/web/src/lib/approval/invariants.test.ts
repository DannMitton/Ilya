/**
 * Architectural invariants, pinned as tests. Added on the audit branch,
 * 2026-09-26. Each one names the document that states it.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

/**
 * AGENTS.md, "Scholarly integrity": Grayson's restricted, singable IPA
 * inventory is the notation, with no retroflex diacritics, no tie bars, and
 * no alveolopalatal symbols. The approved corpus (ipa-corpus.approval.test.ts)
 * is the engine's real output on forty lines of verse, and that test fails if
 * the engine's output drifts from the file, so checking the file checks the
 * engine. The space and the two join arrows (← →) are layout, not phonetics.
 */
describe('the IPA stays inside Grayson’s inventory', () => {
	const GRAYSON = new Set([...'ˈːaɑbdeɛfɡɣhiɪɨjʲklɫmnɲoprsʃtuvʌxzʒ']);
	const LAYOUT = new Set([' ', '←', '→']);

	it('emits no symbol outside the inventory on the approved corpus', () => {
		const path = fileURLToPath(new URL('./__approved__/ipa-corpus.txt', import.meta.url));
		const ipaLines = readFileSync(path, 'utf8')
			.split('\n')
			.filter((line) => line.startsWith('  '));
		expect(ipaLines.length).toBeGreaterThanOrEqual(40);

		const outside = new Set<string>();
		for (const line of ipaLines) {
			for (const ch of line) if (!GRAYSON.has(ch) && !LAYOUT.has(ch)) outside.add(ch);
		}
		expect([...outside]).toEqual([]);
	});

	it('would catch a symbol outside the inventory (positive control)', () => {
		const outside = [...'ʈ͡ɕ'].filter((ch) => !GRAYSON.has(ch) && !LAYOUT.has(ch));
		expect(outside.length).toBe(3);
	});
});
