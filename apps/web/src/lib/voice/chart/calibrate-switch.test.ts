import { describe, expect, it } from 'vitest';
import { calibrateNewOn } from './calibrate-switch';

describe('?calibrate=new', () => {
	it('is off with no query, and off for anything but "new"', () => {
		expect(calibrateNewOn('')).toBe(false);
		expect(calibrateNewOn('?')).toBe(false);
		expect(calibrateNewOn('?calibrate=old')).toBe(false);
		expect(calibrateNewOn('?calibrate=')).toBe(false);
		expect(calibrateNewOn('?calibrate')).toBe(false);
		expect(calibrateNewOn('?harness=1')).toBe(false);
		expect(calibrateNewOn('?calibrate=NEW')).toBe(false);
	});
	it('is on for ?calibrate=new, alone or among others', () => {
		expect(calibrateNewOn('?calibrate=new')).toBe(true);
		expect(calibrateNewOn('?looks=off&calibrate=new&extender=a')).toBe(true);
	});
	it('with no argument and no location (the test runner), is off', () => {
		expect(calibrateNewOn()).toBe(false);
	});
});
