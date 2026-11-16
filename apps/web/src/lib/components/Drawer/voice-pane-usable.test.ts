import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { scoreStateLine } from './bandState';
import { usableReadingCount } from '../../voice/profileStore';

/* Rewritten from `voice-anchor-usable.test.ts` (N.203 lane 60, Step 2), which pinned the Drawer's anchor and went with it. A voice whose only readings are `implausible`, with no override, has nothing the app can use: the closed Voice band names the voice with no count, and the pane at rest says nothing is recorded (`voice-pane.test.ts`). */
const refused = { f1: 90, confidence: 'high', reading: 'provisional', source: 'measured-user', plausibility: 'implausible' } as const;
const kept = { ...refused, plausibilityOverride: true } as const;

describe('the closed Voice band and the pane follow the usable readings', () => {
	it('prints the band’s voice with no count when every reading was refused', () => {
		expect(scoreStateLine('Dann', usableReadingCount({ a: refused, e: refused }), 10, 'en')).toBe('Voice: Dann');
		expect(scoreStateLine('Dann', usableReadingCount({ a: refused, e: kept }), 10, 'en')).not.toBe('Voice: Dann');
	});

	/* The page is the one reader of the count: the band's line and the pane's sentence. Neither may count raw keys again; the wider test the wizard's opening phase uses is `hasAnyReadings`, named. */
	it('is wired in the page from one function', () => {
		const page = readFileSync('src/routes/+page.svelte', 'utf8');
		expect(page).toMatch(/usable=\{usableReadingCount\(voiceFormants\)\}/);
		expect(page).toMatch(/usableReadingCount\(voiceFormants\),\s+VOWELS\.length/);
		expect(page).toMatch(/hasStoredReading=\{hasAnyReadings\(voiceFormants\)\}/);
		expect(page).not.toMatch(/Object\.keys\(voiceFormants\)\.length/);
		expect(page).not.toMatch(/VoiceAnchor/);
		expect(page).not.toMatch(/const voiceCalibrated/);
	});
});
