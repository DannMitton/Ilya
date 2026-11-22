import { describe, expect, it } from 'vitest';
import { askKey, linkParts, sectionNames } from './blank-state';
import { t } from '$lib/i18n';

/* Lane 78: the words' plumbing of the blank states (`blank-state.ts`). The sentences are read from `i18n.ts`; the strings themselves are pinned in `blank-states.test.ts`. */

const links = (text: string, language: 'en' | 'fr', available: readonly ('input' | 'voice')[] = ['input', 'voice']) =>
	linkParts(text, language, available).filter((p) => p.kind === 'link').map((p) => (p.kind === 'link' ? `${p.to}:${p.text}` : ''));

describe('the section names a blank page links', () => {
	it('are the Drawer’s own, in both languages', () => {
		expect(sectionNames('en')).toEqual({ input: 'INPUT', voice: 'VOICE' });
		expect(sectionNames('fr')).toEqual({ input: 'ENTRÉE', voice: 'VOIX' });
	});
});

describe('linkParts', () => {
	it('links the upper-case section name and not the lower-case word: « voix » is not VOIX', () => {
		expect(links(t('insights.silence.noVoice', 'fr'), 'fr')).toEqual(['voice:VOIX']);
		expect(links(t('insights.silence.noVoice', 'en'), 'en')).toEqual(['voice:VOICE']);
	});
	it('links each name once, where it stands, in the order it stands: VOICE before INPUT in the both-missing ask', () => {
		expect(links(t('insights.silence.noBoth', 'en'), 'en')).toEqual(['voice:VOICE', 'input:INPUT']);
		expect(links(t('insights.silence.noBoth', 'fr'), 'fr')).toEqual(['voice:VOIX', 'input:ENTRÉE']);
	});
	it('links a name once even when it is said twice', () => {
		expect(links('Open INPUT, then INPUT again.', 'en')).toEqual(['input:INPUT']);
	});
	it('links only the sections the page can open', () => {
		expect(links(t('insights.silence.noBoth', 'en'), 'en', ['input'])).toEqual(['input:INPUT']);
		expect(links(t('insights.silence.noBoth', 'en'), 'en', [])).toEqual([]);
	});
	it('does not link a section name inside a longer word', () => {
		expect(links('INPUTS and SUBVOICE are not sections.', 'en')).toEqual([]);
		expect(links('Les ENTRÉES et le VOIXÉ.', 'fr')).toEqual([]);
	});
	it('reads, with the links taken away, as the one string, whatever links are available', () => {
		for (const lang of ['en', 'fr'] as const) for (const key of ['paper.blank', 'insights.silence.noScore', 'insights.silence.noVoice', 'insights.silence.noBoth']) {
			for (const available of [[], ['input'], ['voice'], ['input', 'voice']] as const) {
				expect(linkParts(t(key, lang), lang, available).map((p) => p.text).join(''), lang + key).toBe(t(key, lang));
			}
		}
	});
	it('does not link POEM or LYRICS, which are views inside INPUT and not sections (DESK DEFAULT)', () => {
		expect(links(t('paper.blank', 'en'), 'en')).toEqual(['input:INPUT']);
		expect(links(t('paper.blank', 'fr'), 'fr')).toEqual(['input:ENTRÉE']);
	});
});

describe('the three asks', () => {
	it('are the three insights.silence lines', () => {
		expect([askKey('score'), askKey('voice'), askKey('both')]).toEqual(['insights.silence.noScore', 'insights.silence.noVoice', 'insights.silence.noBoth']);
	});
});
