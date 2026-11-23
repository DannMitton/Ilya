/**
 * Row 143 (Dann 2026-10-20 03:08 and 03:27): one credit in all three footers, and the
 * Guide, not the footer, thanks LiederNet. Text tests: `apps/web` runs vitest with no DOM,
 * so the components are read as source, as `install-prompt-gate.test.ts` reads its own.
 */
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { t, tv } from '$lib/i18n';
import { ILYA_VERSION } from '$lib/version';

const read = (p: string) => readFileSync(new URL(p, import.meta.url), 'utf8');

describe('the footer credit', () => {
	it('carries no LiederNet clause in either language, and keeps kaikki.org and its licence', () => {
		for (const lang of ['en', 'fr'] as const) {
			const s = t('footer.attribution', lang);
			expect(s).not.toContain('lieder.net');
			expect(s).toContain('kaikki.org');
			expect(s).toContain('4.0</a>). ');
		}
		expect(t('footer.attribution', 'en')).toContain('CC BY-SA 4.0</a>). Made with love');
		expect(t('footer.attribution', 'fr')).toContain('CC BY-SA 4.0</a>). Fait avec cœur');
	});

	it('carries one {version} placeholder in each language, and the footer fills it from the version module', () => {
		for (const lang of ['en', 'fr'] as const) {
			expect(t('footer.attribution', lang).split('{version}').length - 1, lang).toBe(1);
		}
		const src = read('./Paper/PageFooter.svelte');
		expect(src).toContain("tv('footer.attribution', language, { version: ILYA_VERSION })");
		expect(src).toContain("from '$lib/version'");
	});

	it('prints the ratified sentence with the version, in each language', () => {
		const NB = '\u00a0';
		const lead = (lang: 'en' | 'fr') => tv('footer.attribution', lang, { version: ILYA_VERSION }).split(' Stress data')[0].split(' Données')[0];
		expect(lead('en')).toBe(`Free and open source, <em>Ilya</em>${NB}2026b operationalizes Craig Grayson\u2019s <em>Russian Lyric Diction</em> (University of Washington, 2012).`);
		expect(lead('fr')).toBe(`Gratuit et à code ouvert, <em>Ilya</em>${NB}2026b met en \u0153uvre <em>Russian Lyric Diction</em> de Craig Grayson (University of Washington, 2012).`);
	});

	it('is passed to no footer as an override: every PageFooter prints the string as it is', () => {
		for (const f of ['./Paper/PageFooter.svelte', '../insights/InsightsPane.svelte', '../melody/MarkupPane.svelte', './Paper/TitlePage.svelte', './Paper/SubsequentPage.svelte']) {
			const src = read(f);
			expect(src, f).not.toMatch(/attribution=\{/);
			expect(src, f).not.toContain('strikeLiederClause');
		}
		expect(read('./Paper/PageFooter.svelte')).not.toMatch(/attributionOverride|attribution\?:/);
	});

	it('leaves the Guide thanking LiederNet in both languages', () => {
		const guide = read('./Reading/GuideContent.svelte');
		expect(guide).toContain(' Test texts were drawn from <a href="https://www.lieder.net"'); // after the poem-sources sentences that open the paragraph (step 9b)
		expect(guide).toContain(' Les textes d’essai proviennent du <a href="https://www.lieder.net"');
	});
});
