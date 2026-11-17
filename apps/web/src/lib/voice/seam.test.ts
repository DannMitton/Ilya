import { describe, expect, it } from 'vitest';
import { landingFor, requestRefused } from './seam';

describe('where a request from the pane lands (N.203 lane 60, Step 1)', () => {
	it('record: Welcome for a voice with no stored reading, the capture screen for one with', () => {
		expect(landingFor('record', false)).toBe('welcome');
		expect(landingFor('record', true)).toBe('capture');
	});
	it('summary lands where it is asked, whatever is stored', () => {
		for (const has of [false, true]) expect(landingFor('summary', has)).toBe('summary');
	});
});

describe('which requests are refused', () => {
	it('"Add your range" while the capture screen is showing is refused', () => {
		expect(requestRefused('capture', { fromRest: false })).toBe(true);
	});
	it('a request from rest lands on the asked screen even when the wizard is stowed on the capture screen', () => {
		expect(requestRefused('capture', { fromRest: true })).toBe(false);
	});
	it('a `leave` request is refused over the capture screen exactly as "Add your range" was, and answered from every other screen, the test fry included', () => {
		expect(requestRefused('capture', { fromRest: false })).toBe(true);
		for (const phase of ['welcome', 'readiness', 'summary']) expect(requestRefused(phase, { fromRest: false })).toBe(false);
	});
	it('every other phase answers every request', () => {
		for (const phase of ['welcome', 'readiness', 'summary']) {
			expect(requestRefused(phase, { fromRest: false })).toBe(false);
			expect(requestRefused(phase, { fromRest: true })).toBe(false);
		}
	});
});
