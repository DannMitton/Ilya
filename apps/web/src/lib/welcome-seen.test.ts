import { describe, expect, it } from 'vitest';
import { WELCOME_SEEN_KEY, hasSeenWelcome, markWelcomeSeen, type WelcomeStore } from './welcome-seen';

/** A store that behaves, and keeps what it was given. */
const memory = (initial: Record<string, string> = {}): WelcomeStore & { data: Record<string, string> } => {
	const data = { ...initial };
	return { data, getItem: (k) => (k in data ? data[k] : null), setItem: (k, v) => void (data[k] = v) };
};

describe('the welcome sheet flag (`ilya:welcomeSeen`)', () => {
	it('is named after the tree\'s own keys', () => {
		expect(WELCOME_SEEN_KEY).toBe('ilya:welcomeSeen');
		expect(WELCOME_SEEN_KEY.startsWith('ilya:')).toBe(true);
	});

	it('a first visit has not seen it, so the sheet shows', () => {
		expect(hasSeenWelcome(() => memory())).toBe(false);
	});

	it('Begin writes the flag, and a returning browser has seen it', () => {
		const store = memory();
		expect(markWelcomeSeen(() => store)).toBe(true);
		expect(store.data[WELCOME_SEEN_KEY]).toBe('1');
		expect(hasSeenWelcome(() => store)).toBe(true);
	});

	it('only the value Begin writes counts as the flag', () => {
		expect(hasSeenWelcome(() => memory({ [WELCOME_SEEN_KEY]: '' }))).toBe(false);
		expect(hasSeenWelcome(() => memory({ [WELCOME_SEEN_KEY]: 'false' }))).toBe(false);
		expect(hasSeenWelcome(() => memory({ [WELCOME_SEEN_KEY]: '0' }))).toBe(false);
	});

	it('does not read or write any other key', () => {
		const store = memory({ 'ilya:language': 'fr' });
		markWelcomeSeen(() => store);
		expect(store.data).toEqual({ 'ilya:language': 'fr', [WELCOME_SEEN_KEY]: '1' });
	});

	describe('when storage throws, the sheet shows and nothing crashes', () => {
		const denied = (): WelcomeStore => {
			throw new DOMException('The operation is insecure.', 'SecurityError');
		};
		const full: WelcomeStore = {
			getItem: () => {
				throw new Error('read refused');
			},
			setItem: () => {
				throw new DOMException('The quota has been exceeded.', 'QuotaExceededError');
			}
		};

		it('the accessor itself throws (reading the name `localStorage` can)', () => {
			expect(hasSeenWelcome(denied)).toBe(false);
			expect(markWelcomeSeen(denied)).toBe(false);
		});

		it('the read throws', () => {
			expect(hasSeenWelcome(() => full)).toBe(false);
		});

		it('the write throws, and Begin still resolves (the sheet closes either way)', () => {
			expect(() => markWelcomeSeen(() => full)).not.toThrow();
			expect(markWelcomeSeen(() => full)).toBe(false);
		});
	});
});
