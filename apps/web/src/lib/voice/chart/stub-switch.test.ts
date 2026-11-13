import { afterEach, describe, expect, it, vi } from 'vitest';
import { captureSessionFor, captureStubOn } from './stub-switch';
import { StubCaptureSession } from '../engine/stub';
import { LiveCaptureSession } from '../engine/live';

afterEach(() => vi.unstubAllGlobals());

describe('?capture=stub', () => {
	it('is off with no query and for any other value, and on only for stub (the test runner is a development build)', () => {
		expect(captureStubOn('')).toBe(false);
		expect(captureStubOn('?capture=live')).toBe(false);
		expect(captureStubOn('?calibrate=new')).toBe(false);
		expect(captureStubOn('?calibrate=new&capture=stub')).toBe(true);
	});
	it('gives the live session unless the switch is on', () => {
		expect(captureSessionFor('')).toBeInstanceOf(LiveCaptureSession);
		expect(captureSessionFor('?capture=stub')).toBeInstanceOf(StubCaptureSession);
	});
});

describe('the stub’s per-take script', () => {
	it('an error outcome ends the take with NO_AUDIO_INPUT, and a scripted outcome wins once, then the default returns', () => {
		vi.useFakeTimers();
		vi.stubGlobal('window', { __ilyaStubNext: ['error-no-audio', 'provisional-low'] });
		const s = captureSessionFor('?capture=stub');
		const seen: string[] = [];
		const handlers = { onStableFry: () => {}, onComplete: (f: { reading: string }) => seen.push(f.reading), onError: (e: { code: string }) => seen.push(e.code) };
		s.start('i', 'bass', handlers);
		vi.advanceTimersByTime(5000);
		s.start('i', 'bass', handlers);
		vi.advanceTimersByTime(5000);
		s.start('i', 'bass', handlers);
		vi.advanceTimersByTime(5000);
		vi.useRealTimers();
		expect(seen).toEqual(['NO_AUDIO_INPUT', 'provisional', 'captured']);
	});
});
