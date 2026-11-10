/**
 * Integration step 12 (Dann 2026-11-09 20:28): every scan banner can be dismissed with a × in its top-right corner.
 *
 * It checks that each banner the scan path can show (the reader banner, no words read for a scan and for a file, and the two partly-read
 * banners) carries a × that is a real button named by the shared string `upload.banner.dismiss` (the Finale banner's own label, « Dismiss » /
 * « Ignorer »); that none is drawn without a handler; that a dismissal is remembered per banner and per text, so it never hides a different banner,
 * and that a new score (the page's `reset()`) brings it back; and that the page wires the reset to an arrival, a clear, and a song switch. There
 * is no click-outside dismissal, and the component has none. WHEN IT FAILS: a banner cannot be dismissed, hides another, stays hidden after a new
 * upload, or hides on a stray tap. Keyboard: a `<button type="button">` is reached by Tab and dismisses on Enter and Space by the browser itself;
 * a browser walk is not part of this test. It relates to `ScoreUploader.svelte` (the Finale banner it follows) and `scan-banner-state.svelte.ts`.
 */
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { render } from 'svelte/server';
import ScanBanner from './ScanBanner.svelte';
import { ScanBannerState } from '$lib/score/scan-banner-state.svelte';
import { encodeBars } from '$lib/omr/unread-bars';
import { t } from '$lib/i18n';
import type { ScanNoticeKey } from '$lib/score/ingestion/ingest';

const BARS = encodeBars([[3, 4]]);
const BANNERS: ReadonlyArray<readonly [ScanNoticeKey, string]> = [
	['upload.banner.reader', ''],
	['upload.banner.noLyricsScan', 'a.pdf'],
	['upload.banner.noLyrics', 'a.xml'],
	['upload.banner.wordsPartlyRead', BARS],
	['upload.banner.wordsPartlyReadOne', encodeBars([[7, 7]])],
];
const html = (key: ScanNoticeKey, arg: string, language: 'en' | 'fr', withX: boolean) =>
	render(ScanBanner, { props: { noticeKey: key, arg, language, onbar: () => {}, ...(withX ? { ondismiss: () => {} } : {}) } }).body.replace(/<!--.*?-->/gs, '');

describe('the × on every scan banner', () => {
	it.each(BANNERS)('%s has a real button named by the shared Dismiss string, in both languages', (key, arg) => {
		for (const language of ['en', 'fr'] as const) {
			const h = html(key, arg, language, true);
			expect(h).toMatch(/<button type="button" class="banner-x[^"]*"/);
			expect(h).toContain(`aria-label="${t('upload.banner.dismiss', language)}"`);
		}
		expect(t('upload.banner.dismiss', 'en')).toBe('Dismiss');
		expect(t('upload.banner.dismiss', 'fr')).toBe('Ignorer');
	});
	it('draws no × where no handler is given, and no other control than the bar links', () => {
		expect(html('upload.banner.reader', '', 'en', false)).not.toContain('banner-x');
	});
	it('uses the string the Finale banner uses, and adds no string of its own', () => {
		const uploader = readFileSync(fileURLToPath(new URL('../../score/ScoreUploader.svelte', import.meta.url)), 'utf8');
		expect(uploader).toContain("T('upload.banner.dismiss')");
		const banner = readFileSync(fileURLToPath(new URL('./ScanBanner.svelte', import.meta.url)), 'utf8');
		expect(banner).toContain("t('upload.banner.dismiss', language)");
	});
	it('has no click-outside or blur dismissal', () => {
		const banner = readFileSync(fileURLToPath(new URL('./ScanBanner.svelte', import.meta.url)), 'utf8');
		expect(banner).not.toMatch(/clickoutside|onblur|onfocusout|svelte:window|svelte:document/i);
	});
});

describe('a dismissal is for that banner and that score', () => {
	it.each(BANNERS)('dismisses %s and a new score brings it back', (key, arg) => {
		const s = new ScanBannerState();
		expect(s.isDismissed(key, arg)).toBe(false);
		s.dismiss(key, arg);
		expect(s.isDismissed(key, arg)).toBe(true);
		s.reset();
		expect(s.isDismissed(key, arg)).toBe(false);
	});
	it('never hides a different banner, or the same banner with other text', () => {
		const s = new ScanBannerState();
		s.dismiss('upload.banner.reader', '');
		for (const [key, arg] of BANNERS.slice(1)) expect(s.isDismissed(key, arg)).toBe(false);
		s.dismiss('upload.banner.wordsPartlyRead', BARS);
		expect(s.isDismissed('upload.banner.wordsPartlyRead', encodeBars([[9, 10]]))).toBe(false);
		expect(s.isDismissed('upload.banner.reader', '')).toBe(true);
	});
});

describe('the page wires it', () => {
	const page = readFileSync(fileURLToPath(new URL('../../../routes/+page.svelte', import.meta.url)), 'utf8');
	it('passes ondismiss to both mounts and hides a dismissed banner', () => {
		expect(page).toContain("scanBanners.dismiss('upload.banner.reader', '')");
		expect(page).toContain('scanBanners.dismiss(noLyricsKey, noLyricsFile!)');
		expect(page).toContain("!scanBanners.isDismissed('upload.banner.reader', '')");
		expect(page).toContain('!scanBanners.isDismissed(noLyricsKey, noLyricsFile)');
	});
	it('resets on an arrival (an upload or a re-read), a clear, and a song switch', () => {
		expect(page.match(/scanBanners\.reset\(\)/g)).toHaveLength(3);
		expect(page).toMatch(/noLyricsKey = notice\?\.key \?\? 'upload\.banner\.noLyrics'; scanBanners\.reset\(\);/);
	});
});
