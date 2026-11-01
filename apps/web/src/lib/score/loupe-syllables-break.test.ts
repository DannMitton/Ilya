/**
 * QUEUE row 163 step 4: the Syllables list draws a typed # after its unit's last syllable, apart from the button,
 * and never in the Cyrillic.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { render } from 'svelte/server';
import { processText } from '$lib/pipeline';
import { loadRealData } from '$lib/syntactic-break.support';
import { buildSlotQueue } from './pairings';
import LoupeSyllables from './LoupeSyllables.svelte';

beforeAll(loadRealData, 60_000);

const html = (text: string, isPhone: boolean) =>
	render(LoupeSyllables, { props: { slots: buildSlotQueue(processText(text)), pairings: {}, selectedEventId: null, isPhone, onplace: () => {}, id: 'syl' } })
		.body.replace(/<!--.*?-->/gs, '');
const buttons = (h: string) => [...h.matchAll(/<button[^>]*>(.*?)<\/button>/gs)].map((m) => m[1]);

describe.each([['desk', false], ['phone', true]] as const)('the Syllables list on the %s', (_, isPhone) => {
	it('draws one # after the break’s last syllable, as its own aria-hidden span outside every button', () => {
		const h = html('Я # на правду', isPhone);
		expect(h.match(/<span class="loupe-syl-hash[^"]*"[^>]*>#<\/span>/g)).toHaveLength(1);
		expect(h).toContain('aria-hidden="true">#</span>');
		expect(buttons(h)).toHaveLength(4);
		for (const b of buttons(h)) expect(b).not.toContain('#');
		// It follows «Я», the unit's last syllable, and nothing else.
		expect(h).toMatch(/Я<\/button><span class="loupe-syl-hash[^"]*"/u);
	});
	it('on a word of several syllables it follows the LAST one', () => {
		const h = html('правду # я', isPhone);
		expect(h).toMatch(/ду<\/button><span class="loupe-syl-hash[^"]*"/u);
	});
	it('draws none where nothing was typed', () => {
		expect(html('Я на правду', isPhone)).not.toContain('loupe-syl-hash');
	});
});
