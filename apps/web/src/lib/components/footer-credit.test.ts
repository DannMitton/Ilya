/**
 * Row 143 (Dann 2026-10-20 03:08 and 03:27): one credit in all three footers, and the
 * Guide, not the footer, thanks LiederNet. Text tests: `apps/web` runs vitest with no DOM,
 * so the components are read as source, as `install-prompt-gate.test.ts` reads its own.
 */
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { t } from '$lib/i18n';

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
		expect(t('footer.attribution', 'fr')).toContain('CC BY-SA 4.0</a>). Fait avec amour');
	});

	it('is passed to no footer as an override: every PageFooter prints the string as it is', () => {
		for (const f of ['./Paper/PageFooter.svelte', '../insights/InsightsPane.svelte', '../markup/MarkupPane.svelte', './Paper/TitlePage.svelte', './Paper/SubsequentPage.svelte']) {
			const src = read(f);
			expect(src, f).not.toMatch(/attribution=\{/);
			expect(src, f).not.toContain('strikeLiederClause');
		}
		expect(read('./Paper/PageFooter.svelte')).not.toMatch(/attributionOverride|attribution\?:/);
	});

	it('leaves the Guide thanking LiederNet in both languages', () => {
		const guide = read('./Reading/GuideContent.svelte');
		expect(guide).toContain('<strong>Texts.</strong> Test texts were drawn from <a href="https://www.lieder.net"');
		expect(guide).toContain('<strong>Textes.</strong> Les textes d’essai proviennent du <a href="https://www.lieder.net"');
	});
});
