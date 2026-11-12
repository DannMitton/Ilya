import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { render } from 'svelte/server';
import VoiceAnchor from './VoiceAnchor.svelte';
import { scoreStateLine } from './bandState';
import { usableReadingCount } from '../../voice/profileStore';

/* Closing polish lane, step 1 (39-6). A voice whose only readings are `implausible`, with no override, has nothing the app can use: the Drawer's
   anchor reads "Voice: not yet calibrated" with a Calibrate button, and the Voice band names the voice with no count. */
const refused = { f1: 90, confidence: 'high', reading: 'provisional', source: 'measured-user', plausibility: 'implausible' } as const;
const kept = { ...refused, plausibilityOverride: true } as const;
const anchor = (readings: Parameters<typeof usableReadingCount>[0], language: 'en' | 'fr') =>
	render(VoiceAnchor, { props: { voiceName: 'Dann', calibrated: usableReadingCount(readings) > 0, language, oncalibrate: () => {} } }).body;

describe('the voice anchor and the Voice band follow the usable readings', () => {
	it('shows Calibrate and "not yet calibrated" when every reading was refused', () => {
		const html = anchor({ a: refused, e: refused }, 'en');
		expect(html).toContain('Voice: not yet calibrated');
		expect(html).toContain('Calibrate');
		expect(html).not.toContain('Re-calibrate');
		expect(anchor({ a: refused }, 'fr')).toContain('Calibrer');
	});

	it('shows Re-calibrate and the voice’s name when a reading is usable, or kept by the singer', () => {
		for (const readings of [{ a: refused, e: { f1: 600, confidence: 'high', reading: 'captured', source: 'measured-user' } as const }, { a: kept }]) {
			const html = anchor(readings, 'en');
			expect(html).toContain('Voice: Dann');
			expect(html).toContain('Re-calibrate');
		}
	});

	it('prints the band’s voice with no count when every reading was refused', () => {
		expect(scoreStateLine('Dann', usableReadingCount({ a: refused, e: refused }), 10, 'en')).toBe('Voice: Dann');
		expect(scoreStateLine('Dann', usableReadingCount({ a: refused, e: kept }), 10, 'en')).not.toBe('Voice: Dann');
	});

	/* The page is the one reader of both: `voiceCalibrated` for the anchor, and the band's count. Neither may count raw keys again. */
	it('is wired in the page from one function', () => {
		const page = readFileSync('src/routes/+page.svelte', 'utf8');
		expect(page).toMatch(/const voiceCalibrated = \$derived\(usableReadingCount\(voiceFormants\) > 0\)/);
		expect(page).toMatch(/usableReadingCount\(voiceFormants\),\s+VOWELS\.length/);
		expect(page).not.toMatch(/Object\.keys\(voiceFormants\)\.length/);
	});
});
