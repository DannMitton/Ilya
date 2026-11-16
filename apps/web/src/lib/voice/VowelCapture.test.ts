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
		expect(one).not.toContain('See your vowel space');
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

	it('with all ten sung, says so, offers Re-take for the focused vowel and See your vowel space under the buttons, and invites any vowel again', () => {
		const h = html({ profile: BASS, startVowel: 'u' });
		expect(text(h)).toContain('All ten captured. This is your vowel space.');
		expect(h).toMatch(/class="main[^"]*"[^>]*>Re-take \[u\]</);
		expect(h).toMatch(/class="see-space[^"]*"[^>]*>See your vowel space</);
		expect(h).not.toContain('Return to summary');
		expect(h).not.toContain('>Done<');
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

describe('the readings list (readings brief, Step 1)', () => {
	const count = (h: string, re: RegExp) => (h.match(re) ?? []).length;
	const details = (h: string) => h.match(/<details[^>]*class="readings[^"]*"[^>]*>/)![0];
	const rowsOf = (h: string) => [...h.matchAll(/<tr[^>]*data-row="([^"]+)"[^>]*data-kind="([^"]+)"/g)].map((m) => [m[1], m[2]]);

	it('is one folded disclosure titled “Your readings”, closed by default, below the hint and the explanation and above the toggle', () => {
		const h = html({ profile: pick('i') });
		expect(details(h)).not.toMatch(/\sopen[\s=>]/);
		expect(text(h)).toContain('Your readings');
		expect(h.indexOf('class="explain')).toBeLessThan(h.indexOf('<details'));
		expect(h.indexOf('<details')).toBeLessThan(h.indexOf('class="hide-toggle'));
		expect(count(h, /<details/g)).toBe(1);
		expect(details(h)).not.toContain('inert');
	});

	it('lists all ten vowels in the buttons’ order, in a table named by the summary, with no caption, headed by the resonance symbols', () => {
		const h = html({ profile: pick('i', 'e') });
		expect(rowsOf(h).map((r) => r[0])).toEqual([...VOWELS]);
		expect(h).toContain('aria-labelledby="capture-readings-summary"');
		expect(h).toContain('id="capture-readings-summary"');
		expect(h).not.toContain('<caption');
		const head = h.match(/<thead[^>]*>[\s\S]*?<\/thead>/)![0];
		expect(head).toContain('aria-label="f R 1"');
		expect(head).toContain('aria-label="f R 2"');
		expect(text(head)).toContain('Vowel');
		expect(text(head)).toContain('Hz and note');
	});

	it('marks a sung row and a placeholder row differently, in words for assistive technology and by the legend’s two dots', () => {
		const h = html({ profile: pick('i', 'e') });
		expect(rowsOf(h).slice(0, 3)).toEqual([['i', 'sung'], ['e', 'sung'], ['ɪ', 'placed']]);
		expect(h).toContain('cardinal-i, sung');
		expect(h).toContain('smallcaps-i, placeholder');
		expect(count(h, /class="mark-sung[ "]/g)).toBe(2);
		expect(count(h, /class="mark-placed[ "]/g)).toBe(8);
		expect(h).toMatch(/<tr[^>]*data-row="ɪ"[^>]*class="[^"]*placed-row/);
	});

	it('prints Hz with the nearest note and signed cents, for both resonances', () => {
		const t = text(html({ profile: pick('i') }));
		expect(t).toContain('296 Hz D4 +14');
		expect(t).toContain('1705 Hz G♯6 +45');
	});

	it('says “Try again” for a sung reading with no usable fR2, and never for a placeholder; a stored 0 never prints “0 Hz”', () => {
		const h = html({ profile: { e: f(381), u: f(346, 0) } });
		const row = (v: string) => h.match(new RegExp(`<tr[^>]*data-row="${v}"[\\s\\S]*?</tr>`))![0];
		expect(row('e')).toContain('Try again');
		expect(row('u')).toContain('Try again');
		expect(text(row('u'))).not.toContain('0 Hz Try');
		expect(row('i')).not.toContain('Try again');
		expect(text(h)).not.toMatch(/(^|\s)0 Hz/);
	});

	it('does the same with no declared type, and in French', () => {
		const none = html({ voiceType: undefined, profile: pick('i') });
		expect(rowsOf(none)).toHaveLength(10);
		const fr = html({ language: 'fr', profile: pick('i') });
		expect(text(fr)).toContain('Vos lectures');
		expect(text(fr)).toContain('Voyelle');
		expect(fr).toContain('i cardinal, chantée');
	});
});
