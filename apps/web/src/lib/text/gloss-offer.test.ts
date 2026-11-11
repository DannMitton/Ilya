/**
 * Row 179, step 3: the offer under the Inspector's field is a state of the field
 * (`glossLine`, `gloss-edit.ts`; `GlossOffer.svelte`). Walk items 1 to 5.
 */
import { describe, it, expect } from 'vitest';
import { glossLine } from './gloss-edit';
import { GlossaryStore } from './glossary.svelte';
import { t } from '$lib/i18n';

const open = { source: 'song' as const, songEdit: 'vous', dictionaryGloss: '', glossaryText: undefined, dismissed: false };

describe('the offer is a state of the field (walk items 1 and 4)', () => {
	it('stands while she has an edit of her own and nothing else supplies a gloss', () => {
		expect(glossLine(open)).toBe('offer');
	});
	it('is there again on reopening the panel on an unanswered word: the same inputs give the same line', () => {
		expect(glossLine({ ...open })).toBe('offer');
	});
	it('does not stand with no edit, an empty edit, a dictionary gloss, a glossary entry, or after "Not now"', () => {
		expect(glossLine({ ...open, source: undefined, songEdit: undefined })).toBeNull();
		expect(glossLine({ ...open, songEdit: '' })).toBeNull();
		expect(glossLine({ ...open, dictionaryGloss: 'you' })).toBeNull(); // walk item 7: a corrected dictionary gloss
		expect(glossLine({ ...open, glossaryText: 'vous' })).toBeNull();
		expect(glossLine({ ...open, dismissed: true })).toBeNull();
	});
});

describe('the fill line (walk item 5)', () => {
	it('stands where the field shows the glossary, and only there', () => {
		expect(glossLine({ ...open, source: 'glossary', songEdit: undefined, glossaryText: 'vous' })).toBe('fromGlossary');
		expect(glossLine({ ...open, source: 'dictionary', songEdit: undefined })).toBeNull();
	});
});

describe('"Not now" and "Stop using" (walk items 4 and 5)', () => {
	const store = new GlossaryStore(undefined);
	it('hides the offer for this word in this song only, and for the session', () => {
		store.dismissOffer('song-a|0-0');
		expect(store.offerDismissed('song-a|0-0')).toBe(true);
		expect(store.offerDismissed('song-b|0-0')).toBe(false);
		expect(store.offerDismissed('song-a|0-1')).toBe(false);
	});
	it('is never stored', () => {
		const written: string[] = [];
		const s = new GlossaryStore({ getItem: () => null, setItem: (_k: string, v: string) => written.push(v) } as unknown as Storage);
		s.dismissOffer('x|0-0');
		expect(written).toEqual([]);
	});
	it('"Stop using" lets a fresh edit bring the offer back', () => {
		store.reviveOffer('song-a|0-0');
		expect(store.offerDismissed('song-a|0-0')).toBe(false);
	});
	it('a refused write leaves the offer open (walk item 2)', () => {
		const refusing = new GlossaryStore(undefined);
		expect(refusing.set('вы', 'вас', 'fr', 'vous')).toEqual({ ok: false, reason: 'no-storage' });
		expect(glossLine({ ...open, glossaryText: refusing.get('вы', 'вас', 'fr') })).toBe('offer');
	});
});

describe('the ratified strings, seated exactly', () => {
	const rows: [string, string, string][] = [
		['inspector.glossOffer', 'Use for this word in your other songs', 'Utiliser pour ce mot dans vos autres chants'],
		['inspector.glossOfferDismiss', 'Not now', 'Pas maintenant'],
		['inspector.glossOfferDone', 'Used in your other songs', 'Utilisée dans vos autres chants'],
		['inspector.glossOfferFailed', 'Could not be kept on this device', 'Impossible de la conserver sur cet appareil'],
		['inspector.glossFromGlossary', 'From your other songs', 'De vos autres chants'],
		['inspector.glossStopUsing', 'Stop using', 'Ne plus utiliser'],
	];
	for (const [key, en, fr] of rows) {
		it(key, () => {
			expect(t(key as never, 'en')).toBe(en);
			expect(t(key as never, 'fr')).toBe(fr);
		});
	}
});
