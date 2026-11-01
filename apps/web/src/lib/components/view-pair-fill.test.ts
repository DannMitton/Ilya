/**
 * QUEUE row 163 step 5 (Dann 2026-10-30 14:21; ruled 2026-11-01 12:34): Input's Poem | Lyrics pair marks its
 * active side with the sage desk tint, as the Loupe's pair does in lavender. Text's witness pair and the desk's
 * pair keep their look.
 */
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { render } from 'svelte/server';
import ViewPair from './ViewPair.svelte';

const html = (props: Record<string, unknown>) =>
	render(ViewPair, { props: { items: [{ id: 'a', label: 'A' }, { id: 'b', label: 'B' }], active: 'a', idPrefix: 'p', name: 'n', onchoose: () => {}, ...props } }).body;
const members = (h: string) => [...h.matchAll(/<button[^>]*>/g)].map((m) => m[0]);

describe('ViewPair activeFill', () => {
	it('fills only the active member, with the token it is given', () => {
		const [a, b] = members(html({ activeFill: 'var(--sage-desk)' }));
		expect(a).toContain('style="background: var(--sage-desk);"');
		expect(b).not.toContain('style=');
	});
	it('with nothing passed no member carries an inline fill, so the pair keeps --paper-cream', () => {
		for (const m of members(html({}))) expect(m).not.toContain('style=');
		expect(readFileSync(join(__dirname, 'ViewPair.svelte'), 'utf8')).toContain('background: var(--paper-cream');
	});
	it('only Input passes it', () => {
		const src = (f: string) => readFileSync(join(__dirname, f), 'utf8');
		expect(src('Drawer/IntakeViews.svelte')).toContain('activeFill="var(--sage-desk)"');
		expect(src('TextWitnessPair.svelte')).not.toContain('activeFill');
		expect(src('DeskHead.svelte')).not.toContain('activeFill');
	});
	it('uses the token, not a hex, so a new --sage-desk value lands without another edit', () => {
		expect(readFileSync(join(__dirname, 'Drawer/IntakeViews.svelte'), 'utf8')).not.toMatch(/activeFill="#/);
	});
});
