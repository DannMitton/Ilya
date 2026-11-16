/**
 * N.202 Step 4 (D7): the two entries stand in both halves of the GUIDE and in the Drawer's hand-written contents
 * list, and each contents label is its entry's ratified heading, word for word, in both languages (OPEN.md, N.202,
 * "THE GUIDE'S TWO ENTRIES": the labels are the headings). `apps/web` runs vitest with no DOM, so the components are
 * read as source.
 */
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { t } from '$lib/i18n';

const read = (p: string) => readFileSync(new URL(p, import.meta.url), 'utf8');
const guide = read('./Reading/GuideContent.svelte');
const drawer = read('./Drawer/Drawer.svelte');
const frStart = guide.indexOf("{#if language === 'fr'}");
const frEnd = guide.indexOf('{:else}', frStart);
const halves = { fr: guide.slice(frStart, frEnd), en: guide.slice(0, frStart) + guide.slice(frEnd) };

const ENTRIES = [
	{ id: 'guide-version', key: 'toc.guide.version', en: 'Which Ilya is this?', fr: 'De quelle version d’Ilya s’agit-il?' },
	{ id: 'guide-cite', key: 'toc.guide.cite', en: 'How do I cite Ilya?', fr: 'Comment citer Ilya?' },
] as const;

describe('the two version entries', () => {
	for (const e of ENTRIES) {
		it(`${e.id}: one h4 in each half of the GUIDE, in the Drawer's list, and among guide-how's children`, () => {
			for (const lang of ['en', 'fr'] as const) {
				expect(halves[lang].split(`<h4 id="${e.id}">`).length - 1, lang).toBe(1);
			}
			expect(drawer).toContain(`data-heading-id="${e.id}"`);
			expect(drawer).toContain(`handleTocClick('${e.id}')`);
			expect(drawer).toContain(`'${e.id}'`);
			expect(drawer).toMatch(new RegExp(`\\['guide-what'[^\\]]*'${e.id}'[^\\]]*\\]\\.includes\\(id\\)\\) return \\['guide-how'\\]`));
		});
		it(`${e.id}: the contents label is the heading, word for word, in both languages`, () => {
			expect(t(e.key, 'en')).toBe(e.en);
			expect(t(e.key, 'fr')).toBe(e.fr);
			expect(halves.en).toContain(`<h4 id="${e.id}">${e.en}</h4>`);
			expect(halves.fr).toContain(`<h4 id="${e.id}">${e.fr}</h4>`);
		});
	}
});
