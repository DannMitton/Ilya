/**
 * N.199 Step 4b: the capture screen, rendered on the server. What a singer would see at rest for a few profiles. The taps, the
 * take, Escape, and the sticky group are exercised in the browser in Step 6; nothing here mounts or clicks.
 */
import { describe, expect, it } from 'vitest';
import { render } from 'svelte/server';
import type { CalibratedFormant, Vowel } from './engine/types';
import { VOWELS } from './engine/types';
import { StubCaptureSession } from './engine/stub';
import VowelCapture from './VowelCapture.svelte';

const f = (f1: number, f2?: number): CalibratedFormant =>
	({ f1, ...(f2 === undefined ? {} : { f2 }), confidence: 'high', reading: 'captured', source: 'measured-user' }) as CalibratedFormant;
const BASS: Record<Vowel, CalibratedFormant> = {
	i: f(296, 1705), e: f(381, 1532), ɪ: f(393, 1600), ɨ: f(404, 1100), ɛ: f(577, 1311),
	a: f(711, 1113), ɑ: f(617, 1013), ʌ: f(616, 1167), o: f(489, 826), u: f(346, 804)
};
const pick = (...vs: Vowel[]) => Object.fromEntries(vs.map((v) => [v, BASS[v]])) as Partial<Record<Vowel, CalibratedFormant>>;
const html = (props: Record<string, unknown> = {}) =>
	render(VowelCapture, {
		props: {
			session: new StubCaptureSession(), language: 'en', voiceType: 'bass', profile: {}, startVowel: 'i',
			onCaptured: () => {}, onReturn: () => {}, onClearAll: () => {}, ...props
		} as never
	}).body.replace(/&#39;/g, "'");
const text = (h: string) => h.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');
const buttons = (h: string) => [...h.matchAll(/<button[^>]*class="vowel-btn[^"]*"[^>]*aria-label="([^"]*)"/g)].map((m) => m[1]);

describe('the screen at rest', () => {
	it('opens on the vowel it is told, with the header, the count, and the symbol in its circle', () => {
		const h = html({ startVowel: 'ɑ', profile: pick('i', 'e') });
		expect(h).toContain('Your resonances');
		expect(h).toContain('2 of 10');
		expect(h).toMatch(/class="glyph[^"]*"[^>]*>ɑ</);
		expect(h).toContain('dark-a');
	});

	it('has ten real buttons in Grayson’s order, named by their spoken name and state, the selected one saying so', () => {
		const labels = buttons(html({ profile: pick('i', 'e'), startVowel: 'ɛ' }));
		expect(labels).toEqual([
			'cardinal-i, sung', 'close-e, sung', 'smallcaps-i, placeholder', 'velar-i, placeholder', 'open-e, placeholder, selected',
			'bright-a, placeholder', 'dark-a, placeholder', 'turned-v, placeholder', 'Russian-o, placeholder', 'cardinal-u, placeholder'
		]);
		expect(VOWELS).toHaveLength(10);
	});

	it('draws the ten buttons in two rows of five', () => {
		const css = html();
		expect(css).toContain('class="buttons');
		// The grid is five columns (the stylesheet is scoped; the structure is what is asserted: ten buttons in one group).
		expect(buttons(css)).toHaveLength(10);
		expect(css).toContain('aria-label="The ten vowels"');
	});

	it('says what to do first, with nothing sung, and shows the tree’s explanation of sing, stop, and fry once', () => {
		const h = html();
		expect(text(h)).toContain('Ready for [i].');
		expect(h).toContain('Start [i]');
		expect(text(h)).toContain('Start follows Ilya’s order. Or tap any vowel to sing that one now.');
		expect(text(h)).toContain('Tap the [i] cardinal-i vowel to begin. First sing it as you usually do');
		expect(text(html({ profile: pick('i') }))).not.toContain('First sing it as you usually do');
	});

	it('offers a re-take for a sung selection, and a way back to the summary as soon as one vowel is sung, not before', () => {
		const none = html();
		expect(none).not.toContain('Return to summary');
		const one = html({ profile: pick('i') });
		expect(one).toContain('Return to summary');
		expect(one).toContain('Re-take [i]');
		expect(text(one)).toContain('is captured.');
		expect(text(one)).toContain('A re-take replaces [i] only if the new reading is as clear.');
	});

	it('shows the stored reading of the selected vowel in black, as Hz through the resonance symbol, and “Try again” for a missing fR2', () => {
		const h = html({ profile: pick('i') });
		expect(text(h)).toContain('296 Hz');
		expect(text(h)).toContain('1705 Hz');
		expect(h).toContain('aria-label="f R 1"');
		expect(html({ profile: { e: f(381) }, startVowel: 'e' })).toContain('Try again');
		// An unsung selection shows no numbers.
		expect(text(html({ profile: pick('i'), startVowel: 'e' }))).not.toContain('381 Hz');
	});

	it('with all ten sung, says so, offers Done, and invites any vowel again', () => {
		const h = html({ profile: BASS, startVowel: 'u' });
		expect(text(h)).toContain('All ten captured. This is your vowel space.');
		expect(h).toMatch(/class="main[^"]*"[^>]*>Done</);
		expect(text(h)).toContain('Tap any vowel to sing it again.');
		expect(text(h)).toContain('10 of 10');
	});

	it('has the toggle, the progress bar, Start over, and the one plain sentence about the dot and the axes', () => {
		const h = html({ profile: pick('i') });
		expect(h).toContain('type="checkbox"');
		expect(text(h)).toContain('Hide the chart and the readout while I sing');
		expect(h).toContain('role="progressbar"');
		expect(text(h)).toContain('Start over');
		expect(text(h)).toContain('Each dot is one of your vowels: the higher your tongue, the higher the dot; the further forward, the nearer the front edge.');
	});

	it('keeps Start over disabled when there is nothing to clear', () => {
		expect(html()).toMatch(/<button[^>]*class="stop[^"]*"[^>]*disabled/);
		expect(html({ profile: pick('i') })).not.toMatch(/<button[^>]*class="stop[^"]*"[^>]*disabled/);
	});

	it('speaks the vowel by its name in the live region and shows the bracketed symbol to the eye', () => {
		const h = html({ profile: pick('i') , startVowel: 'e' });
		expect(h).toMatch(/class="visually-hidden[^"]*"[^>]*role="status"[^>]*>Ready for the close-e vowel\./);
		expect(h).toMatch(/class="cue[^"]*"[^>]*aria-hidden="true"[^>]*>Ready for \[e\]\./);
	});

	it('says nothing that reads as a goal, a target, or a fault', () => {
		for (const profile of [{}, pick('i', 'e', 'u'), BASS]) expect(text(html({ profile })).toLowerCase()).not.toMatch(/\bgoals?\b|\btargets?\b|\bwrong\b|\bfault|\bimplausible\b/);
	});

	it('renders for every voice type and none, and in French, every string French and none missing', () => {
		for (const voiceType of [undefined, 'soprano', 'contralto', 'countertenor', 'bass-baritone', 'not-sure']) expect(buttons(html({ voiceType }))).toHaveLength(10);
		const fr = html({ language: 'fr', profile: pick('i') });
		expect(text(fr)).toContain('Retour au sommaire');
		expect(text(fr)).toContain('Tout recommencer');
		expect(text(fr)).toContain('Vos résonances');
		expect(text(fr)).toContain('1 sur 10');
		expect(text(fr)).toContain('Reprendre [i]');
		expect(text(fr)).toContain('Masquer le graphique et l’affichage pendant que je chante');
		expect(buttons(fr)[0]).toBe('i cardinal, chantée, sélectionnée');
		expect(text(fr)).toContain('Il en reste 9, dans l’ordre de votre choix.');
		expect(fr).toContain('aria-label="Graphique des zones des voyelles.');
		expect(text(fr)).not.toMatch(/MISSING|\{[a-z]+\}/);
		// And with nothing sung, the first-time explanation and the first-move hint in French.
		const none = html({ language: 'fr' });
		expect(text(none)).toContain('Commencer suit l’ordre d’Ilya.');
		expect(text(none)).not.toMatch(/MISSING|\{[a-z]+\}/);
	});
});
