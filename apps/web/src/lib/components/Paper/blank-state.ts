/**
 * THE BLANK STATES OF TEXT, MELODY, AND INSIGHTS: the words' plumbing (lane 78).
 *
 * One component draws all three pages' blank state (`BlankState.svelte`), so they cannot drift apart again. This file holds the two
 * pure pieces that component and the panes share, so they are testable without a browser:
 *
 * - `linkParts` turns a sentence into runs, with each section name a singer must visit set apart as a link. Dann 2026-11-19 08:40:
 *   "I like the hyperlinks that save searching and provide one-touch access." The names are the Drawer's own (`group.input`,
 *   `group.scoreMarkup`), so a French line links « ENTRÉE » and « VOIX ». MATCHING IS CASE-SENSITIVE, so « Établissez votre voix
 *   dans VOIX » links only the upper-case « VOIX », and "Set up your voice in VOICE" links only "VOICE". It walks the line by
 *   position and links each name once, where it first stands. POEM and LYRICS are not links: they are views inside INPUT, not
 *   sections, and no handler exists for either (brief, step 3, DESK DEFAULT).
 * - `askKey` says which of the three asks a page makes. The rule, as Dann reworded it 2026-11-19 09:35: the ask names what is
 *   missing for the page to do what its own first sentence promises; NOTES says how complete what is already there is.
 *
 * Every string is read from `i18n.ts`; none is written here.
 */
import { t, type Language } from '$lib/i18n';

/** The two sections a blank page sends a singer to. */
export type SectionName = 'input' | 'voice';

/** One run of a blank state's sentence: plain text, a link to a section, or an IPA glyph (MELODY's provisional vowels). */
export type BlankPart =
	| { kind: 'text'; text: string }
	| { kind: 'link'; text: string; to: SectionName }
	| { kind: 'ipa'; text: string };

/** What the page is missing. `voice` is ratified and no page asks it yet: a score with no voice is not a blank page. */
export type BlankAsk = 'score' | 'voice' | 'both';

const ASK_KEYS: Record<BlankAsk, string> = {
	score: 'insights.silence.noScore',
	voice: 'insights.silence.noVoice',
	both: 'insights.silence.noBoth',
};

export function askKey(ask: BlankAsk): string {
	return ASK_KEYS[ask];
}

/** The section names in `language`, as the Drawer prints them. */
export function sectionNames(language: Language): Record<SectionName, string> {
	return { input: t('group.input', language), voice: t('group.scoreMarkup', language) };
}

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * The sentence as runs, each section name in `available` linked once, at its first whole-word, case-sensitive occurrence.
 * A name is "whole" when no letter or digit touches it, so « VOIX » does not match inside a longer word.
 */
export function linkParts(text: string, language: Language, available: readonly SectionName[]): BlankPart[] {
	const names = sectionNames(language);
	const hits: { at: number; to: SectionName; text: string }[] = [];
	for (const to of available) {
		const m = new RegExp(`(?<![\\p{L}\\p{N}])${escape(names[to])}(?![\\p{L}\\p{N}])`, 'u').exec(text);
		if (m) hits.push({ at: m.index, to, text: names[to] });
	}
	hits.sort((a, b) => a.at - b.at);
	const out: BlankPart[] = [];
	let from = 0;
	for (const h of hits) {
		if (h.at > from) out.push({ kind: 'text', text: text.slice(from, h.at) });
		out.push({ kind: 'link', text: h.text, to: h.to });
		from = h.at + h.text.length;
	}
	if (from < text.length) out.push({ kind: 'text', text: text.slice(from) });
	return out;
}
