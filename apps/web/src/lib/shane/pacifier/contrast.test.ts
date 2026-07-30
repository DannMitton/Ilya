/**
 * Shane pacifier: contrast verification tests.
 *
 * Run with: pnpm vitest (or `pnpm test` once wired into package.json).
 *
 * Three layers:
 *   1. Unit tests pinning the WCAG maths against known reference values, so
 *      the computation itself can't drift.
 *   2. Obligation tests asserting two honesty properties of the Route B
 *      registry: every 'locked' state combination clears its WCAG
 *      threshold, and every 'owned-exception' is in fact sub-threshold.
 *      The first fails loudly if a styling change drops a locked state below
 *      contrast; the second fails loudly if a change lifts an owned
 *      exception into compliance, which is the signal to reclassify it as
 *      'locked' rather than leave it mislabelled.
 *   3. Regression pins fixing the exact ratios computed for spec v6, so a
 *      token change that happens to stay on the right side of a threshold
 *      is still caught as a drift.
 *   4. R20, added 2026-07-30: PALETTE checked against app.css read at check
 *      time. Layers 1 to 3 all reason from PALETTE; until R20 existed,
 *      nothing checked that PALETTE still matched the application. See the
 *      block at the foot of this file.
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, it, expect } from 'vitest';
import {
	hexToRgb,
	composite,
	relativeLuminance,
	contrastRatio,
	evaluate,
	evaluateAll,
	OBLIGATIONS,
	PALETTE,
	NO_UPSTREAM_TOKEN,
	type RGB,
	type Token
} from './contrast';

describe('hexToRgb', () => {
	it('parses with and without leading hash', () => {
		expect(hexToRgb('#1A1612')).toEqual([26, 22, 18]);
		expect(hexToRgb('1A1612')).toEqual([26, 22, 18]);
	});

	it('rejects malformed hex', () => {
		expect(() => hexToRgb('#FFF')).toThrow();
		expect(() => hexToRgb('#GGGGGG')).toThrow();
	});
});

describe('relativeLuminance', () => {
	// Reference values from the WCAG definition.
	it('is 1.0 for white and 0.0 for black', () => {
		expect(relativeLuminance([255, 255, 255])).toBeCloseTo(1.0, 5);
		expect(relativeLuminance([0, 0, 0])).toBeCloseTo(0.0, 5);
	});
});

describe('contrastRatio', () => {
	it('is 21:1 for black on white', () => {
		expect(contrastRatio([0, 0, 0], [255, 255, 255])).toBeCloseTo(21, 1);
	});

	it('is 1:1 for identical colours', () => {
		expect(contrastRatio([120, 120, 120], [120, 120, 120])).toBeCloseTo(1, 5);
	});

	it('is symmetric in argument order', () => {
		const a: RGB = [26, 22, 18];
		const b: RGB = [216, 208, 224];
		expect(contrastRatio(a, b)).toBeCloseTo(contrastRatio(b, a), 10);
	});
});

describe('composite', () => {
	it('returns the foreground at full alpha', () => {
		expect(composite([10, 20, 30], 1, [200, 200, 200])).toEqual([10, 20, 30]);
	});

	it('returns the background at zero alpha', () => {
		expect(composite([10, 20, 30], 0, [200, 200, 200])).toEqual([200, 200, 200]);
	});

	it('rejects out-of-range alpha', () => {
		expect(() => composite([0, 0, 0], 1.5, [255, 255, 255])).toThrow();
	});
});

describe('palette', () => {
	// Route B added white, arc-green, and signal-red. Pin them so a typo in a
	// hex value surfaces here rather than as a silently wrong ratio.
	it('carries the Route B additions and the v11 prep-amber', () => {
		expect(PALETTE['white']).toEqual([255, 255, 255]);
		expect(PALETTE['arc-green']).toEqual([29, 185, 84]);
		expect(PALETTE['signal-red']).toEqual([163, 45, 45]);
		expect(PALETTE['prep-amber']).toEqual([188, 126, 8]);
	});
});

describe('pacifier state contrast obligations (Route B)', () => {
	const results = evaluateAll();

	// Composition of the registry. Guards against an obligation being added
	// or dropped without the change being noticed here.
	it('has the expected status counts: 12 locked, 6 owned-exception, 0 policy-pending', () => {
		const count = (s: string) => results.filter((r) => r.status === s).length;
		expect(count('locked')).toBe(12);
		expect(count('owned-exception')).toBe(6);
		expect(count('policy-pending')).toBe(0);
	});

	// Every locked obligation must clear its threshold. If one fails, the
	// failure message names the state, element, ratio, and threshold so the
	// regression is immediately legible.
	const locked = results.filter((r) => r.status === 'locked');

	it.each(locked)(
		'locked $state $element: $ratio:1 meets $threshold:1 ($kind)',
		(r) => {
			expect(
				r.pass,
				`${r.state} ${r.element}: ${r.ratio.toFixed(2)}:1 < ${r.threshold}:1 threshold`
			).toBe(true);
		}
	);

	// Every owned-exception must in fact be sub-threshold. These are
	// deliberate accepted deviations; if one starts clearing its threshold,
	// the honest move is to reclassify it as 'locked', not to leave it
	// labelled an exception. This test fails to force that relabelling.
	const owned = results.filter((r) => r.status === 'owned-exception');

	it.each(owned)(
		'owned-exception $state $element: $ratio:1 is below $threshold:1 ($kind)',
		(r) => {
			expect(
				r.pass,
				`${r.state} ${r.element}: ${r.ratio.toFixed(2)}:1 now clears the ${r.threshold}:1 threshold; reclassify as 'locked'`
			).toBe(false);
		}
	);

	// Policy-pending obligations are reported but neither required to pass
	// nor required to fail (undecided). None at present; this block
	// keeps a deferral visible in test output if one is ever added.
	const pending = results.filter((r) => r.status === 'policy-pending');
	if (pending.length > 0) {
		it.each(pending)(
			'[policy-pending] $state $element: $ratio:1 (threshold $threshold:1, not enforced)',
			(r) => {
				expect(typeof r.ratio).toBe('number');
			}
		);
	}
});

describe('contrast regression pins (spec v6 computed values)', () => {
	// These pin the exact ratios computed under Route B, so a token change
	// that happens to stay on the right side of a threshold is still caught.
	const byKey = (state: string, element: string) =>
		evaluate(OBLIGATIONS.find((o) => o.state === state && o.element === element)!);

	// Glyphs on the white interior.
	it('dormant glyph (owned) is ~3.42:1', () => {
		expect(byKey('dormant', 'glyph').ratio).toBeCloseTo(3.42, 1);
	});
	it('deselected glyph is ~6.66:1', () => {
		expect(byKey('deselected', 'glyph').ratio).toBeCloseTo(6.66, 1);
	});
	it('listening glyph is ~9.47:1', () => {
		expect(byKey('listening', 'glyph').ratio).toBeCloseTo(9.47, 1);
	});
	it('working glyph is ~9.47:1', () => {
		expect(byKey('working', 'glyph').ratio).toBeCloseTo(9.47, 1);
	});
	it('captured glyph is ~17.99:1', () => {
		expect(byKey('captured', 'glyph').ratio).toBeCloseTo(17.99, 1);
	});

	// Outlines against the band.
	it('dormant outline (owned) is ~2.10:1', () => {
		expect(byKey('dormant', 'outline').ratio).toBeCloseTo(2.10, 1);
	});
	it('deselected outline is ~3.85:1', () => {
		expect(byKey('deselected', 'outline').ratio).toBeCloseTo(3.85, 1);
	});
	it('listening outline (owned) is ~1.87:1', () => {
		expect(byKey('listening', 'outline').ratio).toBeCloseTo(1.87, 1);
	});
	it('working outline is ~3.30:1', () => {
		expect(byKey('working', 'outline').ratio).toBeCloseTo(3.30, 1);
	});
	it('captured outline (owned) is ~2.50:1', () => {
		expect(byKey('captured', 'outline').ratio).toBeCloseTo(2.50, 1);
	});

	// Progress arc and white resting fill (both owned exceptions).
	it('progress arc (owned) is ~1.73:1 against the band', () => {
		expect(byKey('working', 'progress-arc').ratio).toBeCloseTo(1.73, 1);
	});
	it('resting fill (owned) is ~1.50:1 against the band', () => {
		expect(byKey('resting', 'fill').ratio).toBeCloseTo(1.50, 1);
	});

	// Badges.
	it('captured badge mark is ~9.47:1', () => {
		expect(byKey('captured', 'badge-mark').ratio).toBeCloseTo(9.47, 1);
	});
	it('captured badge disc is ~6.32:1 (band-governed)', () => {
		expect(byKey('captured', 'badge-disc').ratio).toBeCloseTo(6.32, 1);
	});
	it('retake badge mark is ~7.07:1', () => {
		expect(byKey('retake', 'badge-mark').ratio).toBeCloseTo(7.07, 1);
	});
	it('retake badge disc is ~4.72:1 (band-governed)', () => {
		expect(byKey('retake', 'badge-disc').ratio).toBeCloseTo(4.72, 1);
	});

	// v11 prep-countdown flash (locked): a full-opacity fill on the white
	// interior, and the IPA glyph at the peak of that flash.
	it('prep flash is ~3.43:1 on the white interior', () => {
		expect(byKey('preparing', 'prep-flash').ratio).toBeCloseTo(3.43, 1);
	});
	it('prep-flash glyph is ~5.25:1 on the amber peak', () => {
		expect(byKey('preparing', 'glyph').ratio).toBeCloseTo(5.25, 1);
	});
});

// ---------------------------------------------------------------------------
// R20 — every value in PALETTE equals the app.css token of the same name.
//
// Ruled by Fable across three exchanges on 2026-07-30, after the rule's
// original allowlist clause was falsified by measurement: it exempted five
// tokens as "not present in Ilya's app.css" when all five are declared there,
// and omitted `white`, the only PALETTE key that genuinely has no token.
//
// The operative form is Ruling 2, with Ruling 4a AS AMENDED, and Rulings 4b,
// 6, and 7, all Fable, 2026-07-30:
//
//   Ruling 2   — three clauses. Every key outside NO_UPSTREAM_TOKEN has a
//                matching app.css token; every key inside it has NO token of
//                that name in ANY bucket. The second clause is what makes the
//                exemption set a check rather than an escape: moving a failing
//                key into it does not stop the key being checked, it swaps
//                which assertion applies, and the new assertion still reads
//                app.css. The claiming file cannot vote itself true.
//   Ruling 4a   — app.css is parsed at check time, never mirrored into a
//    AS AMENDED   generated module, because a mirror is a third copy with its
//                own drift channel. "Total" means EXHAUSTIVE CLASSIFICATION,
//                not universal acceptance: every :root declaration lands in
//                exactly one of literal-colour, alias, or non-colour, there is
//                no residual bucket, and a declaration matching no classifier
//                halts. `non-colour` carries a positive classifier of its own
//                (no hex literal and no var() anywhere in the value) rather
//                than being "whatever the other two rejected", which would be
//                the skip list rebuilt with better manners.
//   Ruling 4b   — a PALETTE key whose token is a var() alias is IN SCOPE and
//                is resolved to a terminal literal hex, with cycle detection.
//                Unexercised on the corpus today; implemented anyway, because
//                the alternative is that refactoring one token into an alias
//                silently moves that key outside the rule. Its controls are
//                synthetic and are at the foot of this block.
//   Ruling 6    — the non-colour bucket is NOT pinned. Counts are emitted as
//                observation and asserted never, because a rule that fails on
//                facts outside its subject teaches its operators to clear
//                failures by editing the expectation.
//   Ruling 7    — classification is a named precondition inside R20's own run,
//                not a separate gate that could be skipped or reordered. When
//                it fails, the comparison reports BLOCKED and never passed.
// ---------------------------------------------------------------------------

const APP_CSS_PATH = fileURLToPath(new URL('../../../app.css', import.meta.url));

type Bucket = 'literal-colour' | 'alias' | 'non-colour';
interface Decl {
	name: string;
	value: string;
	bucket: Bucket;
}

const HEX_LITERAL = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;
const ALIAS_FORM = /^var\(\s*--[A-Za-z0-9_-]+\s*(?:,[\s\S]*)?\)$/;
const CONTAINS_HEX = /#[0-9a-fA-F]{3,8}/;
const CONTAINS_VAR = /var\(/;

/** Exactly one bucket, or null meaning halt. Never a residual. */
function classify(value: string): Bucket | null {
	const hits: Bucket[] = [];
	if (HEX_LITERAL.test(value)) hits.push('literal-colour');
	if (ALIAS_FORM.test(value)) hits.push('alias');
	if (!CONTAINS_HEX.test(value) && !CONTAINS_VAR.test(value)) hits.push('non-colour');
	return hits.length === 1 ? hits[0] : null;
}

function parseRoot(css: string): Decl[] {
	const block = /:root\s*\{([\s\S]*?)\n\}/.exec(css);
	if (!block) {
		throw new Error('R20 precondition: classification — no :root block found in app.css');
	}
	const body = block[1].replace(/\/\*[\s\S]*?\*\//g, '');
	const out: Decl[] = [];
	const decl = /--([A-Za-z0-9_-]+)\s*:\s*([^;]+);/g;
	let m: RegExpExecArray | null;
	while ((m = decl.exec(body)) !== null) {
		const name = m[1];
		const value = m[2].trim();
		const bucket = classify(value);
		if (bucket === null) {
			throw new Error(
				`R20 precondition: classification — declaration --${name}: ${value} matches no ` +
					`classifier (literal-colour, alias, non-colour). This is a halt, not a skip: an ` +
					`unclassified declaration makes "not present" indistinguishable from "not parsed".`
			);
		}
		out.push({ name, value, bucket });
	}
	return out;
}

/** Resolve a token to its terminal literal hex within app.css. Ruling 4b. */
function resolve(name: string, decls: Map<string, Decl>, seen: readonly string[] = []): string {
	if (seen.includes(name)) {
		throw new Error(`R20: alias cycle in app.css: ${[...seen, name].join(' -> ')}`);
	}
	const d = decls.get(name);
	if (!d) throw new Error(`R20: token --${name} is not declared in app.css`);
	if (d.bucket === 'literal-colour') return d.value;
	if (d.bucket === 'alias') {
		const target = /^var\(\s*--([A-Za-z0-9_-]+)/.exec(d.value);
		if (!target) throw new Error(`R20: could not read the alias target of --${name}`);
		return resolve(target[1], decls, [...seen, name]);
	}
	throw new Error(
		`R20: token --${name} classifies as non-colour, so its chain does not terminate in a ` +
			`literal hex. That is a failure of the check, not an exemption from it.`
	);
}

/** Ruling 7: an unmet precondition blocks. It never reads as a pass. */
function guard(err: Error | null): void {
	if (err) {
		throw new Error(`R20 comparison BLOCKED: precondition not met — ${err.message}`);
	}
}

const eqRgb = (a: RGB, b: RGB) => a[0] === b[0] && a[1] === b[1] && a[2] === b[2];

function mismatchesAgainst(css: string): string[] {
	const map = new Map(parseRoot(css).map((d) => [d.name, d]));
	const out: string[] = [];
	for (const key of Object.keys(PALETTE) as Token[]) {
		if (NO_UPSTREAM_TOKEN.includes(key)) continue;
		const hex = resolve(key, map);
		if (!eqRgb(hexToRgb(hex), PALETTE[key])) {
			out.push(`${key}: app.css ${hex} vs PALETTE ${PALETTE[key].join(',')}`);
		}
	}
	return out;
}

describe('R20 precondition: classification', () => {
	let decls: Decl[] | null = null;
	let err: Error | null = null;
	let css = '';
	try {
		css = readFileSync(APP_CSS_PATH, 'utf8');
		decls = parseRoot(css);
	} catch (e) {
		err = e as Error;
	}

	it('every :root declaration falls in exactly one bucket, and the parse is non-empty', () => {
		if (err) throw err;
		expect(decls).not.toBeNull();
		expect(decls!.length).toBeGreaterThan(0);
		// Ruling 6: observation, logged for attestation, asserted never.
		const counts = decls!.reduce<Record<string, number>>((a, d) => {
			a[d.bucket] = (a[d.bucket] ?? 0) + 1;
			return a;
		}, {});
		console.log(
			`R20 observation: app.css :root classification ${JSON.stringify(counts)}, ` +
				`${decls!.length} declarations`
		);
	});

	it('negative control: a declaration matching no classifier halts', () => {
		expect(() => parseRoot(':root {\n\t--x: 1px solid #FFF;\n}')).toThrow(
			/R20 precondition: classification/
		);
	});

	it('negative control: a missing :root block halts', () => {
		expect(() => parseRoot('body { color: red; }')).toThrow(/no :root block/);
	});

	it('the comparison guard blocks rather than passes when the precondition failed', () => {
		expect(() => guard(new Error('classification halted'))).toThrow(/R20 comparison BLOCKED/);
		expect(() => guard(null)).not.toThrow();
	});

	describe('R20 comparison', () => {
		it('every PALETTE key outside NO_UPSTREAM_TOKEN matches its app.css token', () => {
			guard(err);
			expect(mismatchesAgainst(css)).toEqual([]);
		});

		it('every NO_UPSTREAM_TOKEN key is absent from app.css, in every bucket', () => {
			guard(err);
			const names = new Set(decls!.map((d) => d.name));
			expect(NO_UPSTREAM_TOKEN.filter((k) => names.has(k))).toEqual([]);
		});

		it('NO_UPSTREAM_TOKEN is not a way to exempt a key that does have a token', () => {
			guard(err);
			// The set is checked in both directions, so it cannot be used to silence
			// a failure. Listing a key that IS declared upstream fails clause 2.
			const names = new Set(decls!.map((d) => d.name));
			const abusive = [...NO_UPSTREAM_TOKEN, 'ink-primary' as Token];
			expect(abusive.filter((k) => names.has(k))).toEqual(['ink-primary']);
		});

		it('negative control: a one-byte change upstream is detected, and only there', () => {
			guard(err);
			const bad = css.replace('--surround-shane: #D8D0E0;', '--surround-shane: #D8D0E1;');
			expect(bad).not.toBe(css); // provenance: the control changed the data it names
			expect(mismatchesAgainst(bad)).toEqual([
				'surround-shane: app.css #D8D0E1 vs PALETTE 216,208,224'
			]);
		});

		it('negative control: deleting an upstream token is detected', () => {
			guard(err);
			const bad = css.replace(/--arc-green:\s*#1DB954;/, '');
			expect(bad).not.toBe(css);
			expect(() => mismatchesAgainst(bad)).toThrow(/--arc-green is not declared/);
		});
	});
});

describe('R20 alias resolution (Ruling 4b; unexercised on app.css today)', () => {
	const mapOf = (css: string) => new Map(parseRoot(css).map((d) => [d.name, d]));

	it('resolves a var() chain to its terminal literal hex', () => {
		expect(resolve('a', mapOf(':root {\n--a: var(--b);\n--b: var(--c);\n--c: #1DB954;\n}'))).toBe(
			'#1DB954'
		);
	});

	it('detects a cycle instead of recursing', () => {
		expect(() => resolve('a', mapOf(':root {\n--a: var(--b);\n--b: var(--a);\n}'))).toThrow(
			/alias cycle/
		);
	});

	it('fails on a chain that does not terminate in a literal hex', () => {
		expect(() =>
			resolve('a', mapOf(":root {\n--a: var(--b);\n--b: 'Georgia', serif;\n}"))
		).toThrow(/non-colour/);
	});

	it('fails on a chain whose target is undeclared', () => {
		expect(() => resolve('a', mapOf(':root {\n--a: var(--missing);\n}'))).toThrow(
			/not declared in app.css/
		);
	});
});
