/**
 * one-head-one-foot.test.ts: a guard on QUEUE row 64 (Dann 2026-10-11 03:22 to
 * 03:24, `OPEN.md` "ONE FOOTER FOR ALL THREE TABS").
 *
 * Text, Markup, and Insights draw one running head and one footer, so a loose
 * printed sheet names its piece and its tab. The day a tab draws its own head or
 * foot again, the three drift apart without a test noticing, as they had before
 * this row: Insights drew both itself, and Markup's head named the title alone.
 * Svelte components do not render under this vitest setup, so the guard reads
 * the source and holds its shape; the pictures in
 * `docs/sessions/head-foot-shots/` and `e2e/insights-page.test.ts` hold the
 * render.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { formatRunningHeader } from '$lib/page-config';

const read = (rel: string) => readFileSync(new URL(rel, import.meta.url), 'utf8');

const text1 = read('./TitlePage.svelte');
const textN = read('./SubsequentPage.svelte');
const markup = read('../../melody/MarkupPane.svelte');
const insights = read('../../insights/InsightsPane.svelte');

describe('one running head for all three tabs', () => {
	it('names the tab on every page from page 2 on', () => {
		// Text's tab name follows the text the page prints (step 7, part 2), through one derived name on each Text page.
		expect(textN).toMatch(/<RunningHeader[^>]*\{tabName\}/);
		expect(textN).toContain('const tabName = $derived(t(textTabKey(witness, documentHasLines), language));');
		expect(markup).toMatch(/<RunningHeader headerText=\{runningHeader\} \{tabName\} accent="var\(--lavender\)"/);
		expect(markup).toContain("const tabName = $derived(T('tab.markedScore'));");
		// Insights draws its pages in one loop since QUEUE row 66, so one call serves every page from 2 on.
		expect(insights).toMatch(/<RunningHeader headerText=\{runningHeader\} tabName=\{T\('tab\.insights'\)\}/);
	});

	it('names the tab on page 1, alone', () => {
		expect(text1).toMatch(/<RunningHeader headerText="" \{tabName\} tabOnly \/>/);
		expect(text1).toContain('const tabName = $derived(t(textTabKey(witness, documentHasLines), language));');
		// Markup's score page and its empty envelope both.
		expect(markup.match(/<RunningHeader headerText="" \{tabName\} accentInk="var\(--lavender-ink\)" tabOnly \/>/g)).toHaveLength(2);
		expect(insights).toMatch(/<RunningHeader headerText="" tabName=\{T\('tab\.insights'\)\} accentInk="var\(--rose-ink\)" tabOnly \/>/);
	});

	it('prints the piece as Text does, composer and poet before the title', () => {
		expect(markup).toContain("formatRunningHeader(composer, scoreTitle ?? '', poet)");
		expect(insights).toContain("formatRunningHeader(composer, scoreTitle ?? '', poet)");
		expect(formatRunningHeader('Modest Mussorgsky', 'Without Sun, no. 1', 'Arseny Golenishchev-Kutuzov')).toBe(
			'MUSSORGSKY | GOLENISHCHEV-KUTUZOV | WITHOUT SUN, NO. 1',
		);
	});

	it('keeps the identity line out of Insights’ running head', () => {
		expect(insights).not.toMatch(/runningHeader = \$derived\([^;]*identityLine/);
	});
});

describe('one footer for all three tabs', () => {
	it('Insights draws PageFooter, its line in rose; its notes are endnotes, not above the line (QUEUE row 79)', () => {
		expect(insights).toContain('<PageFooter');
		expect(insights).toContain('hairlineAccent="var(--rose)"');
		expect(insights).not.toContain('{#snippet apparatus()}');
		expect(insights).toContain('notesBlock(methodLine');
		expect(insights).not.toContain('class="insights-foot"');
	});

	it('Insights still measures its footer, and since lane 80 it is the drawn footer of page 1, as MELODY measures it', () => {
		// Row 66 measured a probe footer; every footer has been the same since row 79, and a probe with no legend measured what page 1 draws, so the probe is gone.
		expect(insights).not.toContain('footProbe');
		expect(insights).toContain('onheightchange={n === 0 ? (h) => (footHeight = h) : undefined}');
	});
});
