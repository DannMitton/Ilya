/**
 * settle-field.test.ts: Enter, or leaving the field, settles a one-line field
 * (QUEUE row 62). The unit suite has no DOM, so the field is a stand-in built
 * on Node's own `EventTarget`: a value, `blur()`, and the two events.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { savedFlag, settle, SAVED_MS } from './settle-field';
import { t } from '$lib/i18n';

function field(value = '') {
	const target = new EventTarget();
	const f = Object.assign(target, {
		value,
		blurred: 0,
		blur() {
			f.blurred++;
			target.dispatchEvent(new Event('blur'));
		},
	});
	return f;
}
const key = (k: string, isComposing = false) => Object.assign(new Event('keydown', { cancelable: true }), { key: k, isComposing });

describe('settle', () => {
	it('Enter blurs the field, is not passed on, and settles a changed value', () => {
		const f = field('');
		const onsettle = vi.fn();
		settle(f as unknown as HTMLInputElement, { onsettle });
		f.value = 'Seriöserbaß';
		const e = key('Enter');
		f.dispatchEvent(e);
		expect(e.defaultPrevented).toBe(true);
		expect(f.blurred).toBe(1);
		expect(onsettle).toHaveBeenCalledTimes(1);
	});

	it('leaving the field settles it too', () => {
		const f = field('a');
		const onsettle = vi.fn();
		settle(f as unknown as HTMLInputElement, { onsettle });
		f.value = 'ab';
		f.dispatchEvent(new Event('blur'));
		expect(onsettle).toHaveBeenCalledTimes(1);
	});

	it('an unchanged value does not show: neither the one it opened with nor the one last settled', () => {
		const f = field('Op. 38');
		const onsettle = vi.fn();
		settle(f as unknown as HTMLInputElement, { onsettle });
		f.dispatchEvent(new Event('blur'));
		expect(onsettle).not.toHaveBeenCalled();
		f.value = 'Op. 38, no. 3';
		f.dispatchEvent(new Event('blur'));
		f.dispatchEvent(new Event('blur'));
		f.dispatchEvent(key('Enter'));
		expect(onsettle).toHaveBeenCalledTimes(1);
	});

	it('other keys, and Enter while composing, do nothing', () => {
		const f = field('');
		const onsettle = vi.fn();
		settle(f as unknown as HTMLInputElement, { onsettle });
		f.value = 'é';
		const a = key('a');
		f.dispatchEvent(a);
		f.dispatchEvent(key('Enter', true));
		expect(a.defaultPrevented).toBe(false);
		expect(f.blurred).toBe(0);
		expect(onsettle).not.toHaveBeenCalled();
	});

	it('destroy removes both listeners', () => {
		const f = field('');
		const onsettle = vi.fn();
		settle(f as unknown as HTMLInputElement, { onsettle }).destroy();
		f.value = 'x';
		f.dispatchEvent(key('Enter'));
		f.dispatchEvent(new Event('blur'));
		expect(onsettle).not.toHaveBeenCalled();
		expect(f.blurred).toBe(0);
	});
});

describe('the note', () => {
	afterEach(() => vi.useRealTimers());

	it('shows, then disappears after about two seconds; a second show restarts the count', () => {
		vi.useFakeTimers();
		const seen: boolean[] = [];
		const flag = savedFlag((v) => seen.push(v));
		flag.show();
		expect(seen).toEqual([true]);
		vi.advanceTimersByTime(SAVED_MS - 1);
		flag.show();
		vi.advanceTimersByTime(SAVED_MS - 1);
		expect(seen).toEqual([true, true]);
		vi.advanceTimersByTime(1);
		expect(seen).toEqual([true, true, false]);
		expect(SAVED_MS).toBe(2000);
	});

	it('the live region carries the word, in both languages', () => {
		expect(t('field.saved', 'en')).toBe('Saved');
		expect(t('field.saved', 'fr')).toBe('Enregistré');
		const note = readFileSync(new URL('./SavedNote.svelte', import.meta.url), 'utf8');
		expect(note).toMatch(/aria-live="polite"/);
		expect(note).toMatch(/t\('field\.saved', language\)/);
	});
});

