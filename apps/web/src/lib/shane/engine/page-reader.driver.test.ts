/**
 * page-reader.driver.test.ts — a guard on the reader driver's per-page fault
 * isolation (N.96 ship 1b).
 *
 * WHY THIS EXISTS. One page that raised used to abort the whole upload, and the
 * singer got the generic could-not-read message with no page named and no
 * notation at all. Ship 1b isolated the fault; the very next ship made the Lamm
 * scan's page 2 readable, which REMOVED the only file in this repository that
 * exercised the isolation. The behaviour is now unwitnessed by any other test,
 * which is precisely when a guard earns its place.
 *
 * WHAT CAN AND CANNOT BE ASSERTED HERE. The isolation itself lives in Python,
 * inside a template literal, run under Pyodide in a Worker. vitest cannot
 * execute it. What vitest CAN do is hold the two things that actually broke:
 * the template literal's escaping, and the structure of the loop. Both are
 * checked against the resolved driver text, which is what Pyodide receives.
 *
 * THE ESCAPING CHECK IS NOT PEDANTRY. It caught a real defect on 2026-08-24: a
 * `\n` written into a Python string inside this template literal arrives as a
 * REAL newline, breaks the Python literal it sits in, and the whole driver
 * fails to compile. The symptom was "The page reader could not be loaded",
 * several layers from the cause, and it cost a full browser run to find.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';

const SOURCE = new URL('./page-reader.worker.ts', import.meta.url);

/** The driver's raw text, exactly as it sits in the file. */
function rawDriver(): string {
	const src = readFileSync(SOURCE, 'utf8');
	const m = src.match(/const DRIVER = `([\s\S]*?)\n`;/);
	if (!m) throw new Error('page-reader.worker.ts no longer carries a DRIVER template literal');
	return m[1];
}

/**
 * The driver as the JS engine hands it to Pyodide. Template-literal escapes are
 * resolved here and nowhere else, which is the whole point of comparing the two.
 */
function resolvedDriver(): string {
	// eslint-disable-next-line no-eval
	return eval('`' + rawDriver() + '`') as string;
}

describe('N.96 the reader driver survives its own template literal', () => {
	it('gains no lines when its escapes resolve, so no Python string is broken', () => {
		// A backslash-n written into a Python string here resolves to a real
		// newline and terminates that literal mid-sentence. Equal line counts is
		// the exact statement that no escape did this.
		expect(resolvedDriver().split('\n').length).toBe(rawDriver().split('\n').length);
	});

	it('imports traceback, which the isolation needs to record a failure', () => {
		expect(resolvedDriver()).toMatch(/^import json, time, traceback$/m);
	});
});

describe('N.96 per-page fault isolation', () => {
	const driver = resolvedDriver();
	// The loop body, from the `for` to the line that merges the pages.
	const loop = driver.slice(
		driver.indexOf('for page_no, path in enumerate(paths, start=1):'),
		driver.indexOf('merged = dict(ro_last)')
	);

	it('runs each page inside its own try, so one raise cannot end the read', () => {
		expect(loop).toMatch(/for page_no, path in enumerate\(paths, start=1\):\s*\n\s*try:/);
		expect(loop).toMatch(/except Exception:/);
	});

	it('records the failed page number and moves to the next one', () => {
		expect(loop).toMatch(/failed\.append\(page_no\)/);
		expect(loop).toMatch(/\bcontinue\b/);
	});

	it('advances the page context only after a page has actually read', () => {
		// ctx_in carries measure numbering across pages. A page nobody read has
		// no measures to count, so the assignment must sit AFTER the except.
		const exceptAt = loop.indexOf('except Exception:');
		const assignAt = loop.indexOf('ctx_in = ctx_next');
		expect(assignAt).toBeGreaterThan(exceptAt);
	});

	it('raises rather than reporting an empty read when every page failed', () => {
		expect(driver).toMatch(/if ro_last is None:/);
		expect(driver).toMatch(/no page of %d could be read/);
	});

	it('puts failedPages in the read report', () => {
		expect(driver).toMatch(/failedPages=failed/);
	});
});
