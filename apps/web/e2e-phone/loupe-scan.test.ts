/**
 * N.153 STAGE 5. THE WHOLE-FIXTURE SCAN, AT PHONE WIDTH, and the real-click
 * verification of note, rest and caret tap resolution.
 *
 * Run it (the `phone` project is the only one that reads this directory):
 *
 *     pnpm --filter @ilya/web exec playwright test --project=phone
 *
 * THE SCAN MEASURES AND REPORTS, clause 13: "Where the floor cannot be
 * reached, it is reported, never quietly shrunk." Nothing here writes to the
 * page. A failing rule is a reported row, and the report is written whether or
 * not a rule fails, to `test-results/loupe-scan/`.
 *
 * ONE WALK COVERS EVERY SELECTION. The loupe is raised once, on the first
 * entry of m. 1, switched to Corrections, stepped back to the head gap, and
 * then stepped forward with the dock's own Next note button through every
 * entry and gap to the end of the score. The loupe follows the selection
 * across measures, so each measure is drawn with each of its notes taken (the
 * squircle, rule 2) and with each of its gaps taken (no squircle, rule 5's
 * centring). m. 0 carries no entry and opens no loupe; it is a reported row.
 */
import { test, expect, type Page } from '@playwright/test';
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { probeLoupe, type Probe } from './loupe-probe';
import {
	TAP_FLOOR_PX,
	beamContacts,
	centring,
	drawnWorst,
	squircleDistance,
	parseDerivations,
	rule1TapFloor,
	rule2SquircleClearance,
	rule3NoAdjacentMarks,
	rule4NoOpeningBarline,
	rule5Position,
	type Derivation,
	type ScanState,
} from './loupe-rules';

const FIXTURE = 'src/lib/shane/ingestion/fixtures/sunless-01-engraved.musicxml';
const MEASURES = 18;
const REPORT_DIR = join(process.cwd(), 'test-results', 'loupe-scan');
const SCAN_JSON = join(REPORT_DIR, 'scan.json');

/* ── DRIVING THE PAGE ─────────────────────────────────────────────────── */

async function loadFixture(page: Page, lines: { type: string; text: string; step: number }[], step: () => number) {
	page.on('console', (m) => {
		const text = m.text();
		if (text.startsWith('[loupe]')) lines.push({ type: m.type(), text, step: step() });
	});
	/* WAIT FOR THE SEAT BEFORE MEASURING ANYTHING. MEASURED 2026-09-21: the
	   page first draws the score's raw underlay, and about four seconds later,
	   once the poem's transcription exists, redraws it seated (the one line
	   `+page.svelte` logs per song per load says so). The loupe's spacing
	   reads the underlay, so a measure derived before the seat gets a
	   different answer (m. 5: 82.78 before, 82.16 after) and the walk would
	   mix the two drawings. */
	const seated = page.waitForEvent('console', {
		predicate: (m) => m.text().startsWith('[Ilya] N.160 seats:'),
		timeout: 90_000,
	});
	await page.goto('/');
	await page.locator('input.hidden-input').setInputFiles(FIXTURE);
	await page.getByRole('tab', { name: 'Markup' }).click();
	await page.locator('.score-page [data-hit]').first().waitFor({ state: 'attached' });
	await seated;
	await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
}

/** Wait for the loupe to stop moving: no running animation, two frames drawn. */
async function settle(page: Page) {
	await page.waitForFunction(() => document.getAnimations().every((a) => a.playState !== 'running'), undefined, { timeout: 5_000 });
	await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
}

async function readout(page: Page): Promise<string | null> {
	return page.evaluate(() => document.querySelector('.readout')?.textContent?.trim() ?? null);
}

/** Raise the loupe on the page's own entry, by a real tap, and open Corrections. */
async function raiseOn(page: Page, hitId: string) {
	const hit = page.locator(`.score-page [data-hit="${hitId}"]`);
	await hit.scrollIntoViewIfNeeded();
	const b = await hit.boundingBox();
	if (!b) throw new Error(`no box for ${hitId}`);
	await page.touchscreen.tap(b.x + b.width / 2, b.y + b.height / 2);
	await page.locator('.loupe .loupe-body').waitFor();
	await page.locator('#loupe-mode-corrections').click();
	await page.locator('.loupe [data-loupe-gap]').first().waitFor({ state: 'attached' });
	await settle(page);
}

/** Press a dock stepper button and wait for the readout to answer. */
async function stepBy(page: Page, name: 'Next note' | 'Previous note'): Promise<boolean> {
	const before = await readout(page);
	const beforeTag = await page.locator('.loupe .loupe-tag').textContent();
	await page.getByRole('button', { name }).click();
	try {
		await page.waitForFunction(
			([r, t]) =>
				(document.querySelector('.readout')?.textContent?.trim() ?? null) !== r ||
				(document.querySelector('.loupe .loupe-tag')?.textContent ?? null) !== t,
			[before, beforeTag] as const,
			{ timeout: 2_000 },
		);
	} catch {
		return false;
	}
	await page.locator('.loupe [data-loupe-gap]').first().waitFor({ state: 'attached' });
	await settle(page);
	return true;
}

function kindOf(p: Probe): ScanState['kind'] {
	if (p.ring) return 'note';
	if (p.readout?.startsWith('Rest')) return 'rest';
	return p.readout?.includes('the next duration enters here') ? 'gap' : 'rest';
}

/* ── THE REPORT ───────────────────────────────────────────────────────── */

interface Scan {
	states: ScanState[];
	derivations: Derivation[];
	pageHitIds: string[];
}

function lastDerivation(ds: Derivation[], m: number): Derivation | undefined {
	return [...ds].reverse().find((d) => d.measure === m);
}

function report(scan: Scan, rules: Record<string, string[]>, beams: string[], notMeasured: string[]): string {
	const L: string[] = [];
	L.push('# N.153 stage 5: the whole-fixture scan at 390 x 844', '');
	L.push(`Fixture \`${FIXTURE}\`. ${scan.states.length} selections walked. Measure numbers are the fixture's 0-based index; the loupe's tag prints each one higher.`, '');
	L.push('`converged` is INFERRED as worst >= 44, not logged (`loupe-render.ts:126-149`).', '');
	L.push('The walk starts after the page logs `[Ilya] N.160 seats:`, so every measure is derived on the seated underlay. "answers logged" lists every distinct `minGap` the console printed for the measure; more than one means the measure was re-derived on a different drawing during the walk.', '');
	L.push('The last three measured columns are the rules\' own evidence, so a zero row is a measured zero: the nearest any caret\'s drawn mark came to the squircle, the largest distance any caret stood from the middle of its space, and the barlines the probe saw drawn and hidden.', '');
	L.push('| m. | minGap (page) | renders | converged (inferred) | search worst px | drawn worst px | answers logged | offending pairs (search) | nearest squircle, lg | worst off-centre, px | barlines drawn / hidden | rules violated |');
	L.push('|---|---|---|---|---|---|---|---|---|---|---|---|');
	for (let m = 0; m < MEASURES; m++) {
		const own = scan.states.filter((s) => s.probe.heldMeasure === m);
		const hasEntry = scan.pageHitIds.some((id) => id.startsWith(`m${m}-`));
		if (!hasEntry && own.length === 0) {
			L.push(`| ${m} | no entry, no loupe | | | | | | | | | | |`);
			continue;
		}
		const d = lastDerivation(scan.derivations, m);
		const answers = [...new Set(scan.derivations.filter((x) => x.measure === m).map((x) => x.minGap.toFixed(2)))];
		const drawn = own.length ? Math.min(...own.map((s) => drawnWorst(s.probe))) : NaN;
		const violated = Object.entries(rules)
			.filter(([, v]) => v.some((line) => line.startsWith(`m.${m} `) || line.startsWith(`m.${m}:`)))
			.map(([k]) => k.split(':')[0]);
		let nearest = Infinity;
		for (const s of own) {
			if (s.kind !== 'note' || !s.probe.ring) continue;
			for (const c of s.probe.carets) {
				const q = squircleDistance(s.probe, c.after);
				if (q) nearest = Math.min(nearest, q.edge / s.probe.lineGapPx);
			}
		}
		const offs = own
			.filter((s) => s.kind !== 'note' || !s.probe.ring)
			.flatMap((s) => centring(s.probe).map((r) => r.offsetPx))
			.filter((x): x is number => x !== null);
		const worstOff = offs.length ? Math.max(...offs.map(Math.abs)) : NaN;
		const drawnBars = new Set(own.flatMap((s) => s.probe.barlines.filter((b) => b.visible).map((b) => `${b.panel}${Math.round(b.cx)}`))).size;
		const hiddenBars = new Set(own.flatMap((s) => s.probe.barlines.filter((b) => !b.visible).map((b) => `${b.panel}${Math.round(b.cx)}`))).size;
		L.push(
			`| ${m} | ${d ? `${d.minGap.toFixed(2)} (${d.pageMinGap})` : 'NOT LOGGED'} | ${d?.renders ?? ''} | ${d ? (d.convergedInferred ? 'yes' : '**no**') : ''} | ${d ? d.worst.toFixed(2) : ''} | ${Number.isFinite(drawn) ? drawn.toFixed(2) : 'no pair'} | ${answers.length > 1 ? `**${answers.join(', ')}**` : answers.join('')} | ${d?.offending.join('; ') || 'none'} | ${Number.isFinite(nearest) ? nearest.toFixed(2) : 'no squircle'} | ${Number.isFinite(worstOff) ? worstOff.toFixed(2) : ''} | ${drawnBars} / ${hiddenBars} | ${violated.join(', ') || 'none'} |`,
		);
	}
	L.push('');
	for (const [name, v] of Object.entries(rules)) {
		L.push(`## ${name}: ${v.length} violation${v.length === 1 ? '' : 's'}`, '');
		for (const line of v) L.push(`- ${line}`);
		if (v.length) L.push('');
	}
	L.push(`## Clause 15, beam contacts (not violations): ${beams.length}`, '');
	for (const b of beams) L.push(`- ${b}`);
	L.push('');
	L.push(`## Not measured: ${notMeasured.length}`, '');
	for (const n of notMeasured) L.push(`- ${n}`);
	/* NOT ONE OF THE FIVE RULES. `nearestTarget` resolves notes and carets in
	   one pool (`Loupe.svelte`'s `handleTap`), so what a thumb meets is the
	   nearest centre of either kind. Rule 1 measures caret to caret only. */
	L.push('', '## Not a rule: caret to entry, in the shared tap pool', '');
	L.push('`handleTap` resolves notes and carets together by nearest centre. Rule 1 reads clause 13 as caret to caret; this is the nearest caret-to-entry centre distance per measure, over every state walked.', '');
	L.push('| m. | nearest caret to entry, px | the pair |', '|---|---|---|');
	for (let m = 1; m < MEASURES; m++) {
		let best = { d: Infinity, pair: '' };
		for (const s of scan.states.filter((x) => x.probe.heldMeasure === m)) {
			for (const c of s.probe.carets)
				for (const e of s.probe.entries) {
					const dd = Math.hypot(c.cx - e.cx, c.cy - e.cy);
					if (dd < best.d) best = { d: dd, pair: `caret after ${c.after || 'head'}, entry ${e.id}` };
				}
		}
		if (Number.isFinite(best.d)) L.push(`| ${m} | ${best.d.toFixed(1)} | ${best.pair} |`);
	}
	const tc = scan.states.map((s) => s.probe.textCheck);
	const outside = [...new Set(tc.flatMap((t) => t.outsideBox))];
	L.push('');
	L.push(
		`## Text ink check: ${tc.reduce((a, t) => a + t.measured, 0)} glyph measures, ${tc.reduce((a, t) => a + t.unmeasured, 0)} unmeasured, ${outside.length} outside their own em box`,
		'',
	);
	for (const o of outside) L.push(`- \`${o}\``);
	return L.join('\n') + '\n';
}

/* ── THE SCAN ─────────────────────────────────────────────────────────── */

test('the whole-fixture scan, and the five rules', async ({ page }) => {
	test.setTimeout(15 * 60_000);
	const lines: { type: string; text: string; step: number }[] = [];
	let step = 0;
	await loadFixture(page, lines, () => step);
	const pageHitIds = await page.evaluate(() => [...document.querySelectorAll('.score-page [data-hit]')].map((e) => e.getAttribute('data-hit') ?? ''));
	const firstOfM1 = pageHitIds.find((id) => id.startsWith('m1-'));
	expect(firstOfM1, 'm. 1 has an entry on the page').toBeTruthy();

	await raiseOn(page, firstOfM1!);
	/* Back one, to the score's head gap, so it is walked too. */
	await stepBy(page, 'Previous note');

	const states: ScanState[] = [];
	for (let guard = 0; guard < 500; guard++) {
		const probe = await page.evaluate(probeLoupe);
		if (!probe) throw new Error(`no loupe at step ${step}`);
		states.push({ step, kind: kindOf(probe), probe });
		step++;
		if (!(await stepBy(page, 'Next note'))) break;
	}

	const derivations = parseDerivations(lines);
	const scan: Scan = { states, derivations, pageHitIds };

	const rules = {
		'rule 1: tap floor, 44 px between neighbouring caret centres': rule1TapFloor(derivations, states),
		'rule 2: squircle clearance, 1.6 line-gaps': rule2SquircleClearance(states),
		'rule 3: no mark of an adjacent measure': rule3NoAdjacentMarks(states),
		'rule 4: no opening barline': rule4NoOpeningBarline(states),
	} as Record<string, string[]>;
	const r5 = rule5Position(states);
	rules['rule 5a: the caret stands in the middle of its space'] = r5.centre;
	rules['rule 5b: the caret touches nothing (the beam excepted, clause 15)'] = r5.touch;
	const beams = beamContacts(states);

	mkdirSync(REPORT_DIR, { recursive: true });
	writeFileSync(SCAN_JSON, JSON.stringify({ derivations, lines, states }, null, 1));
	const md = report(scan, rules, beams, r5.notMeasured);
	writeFileSync(join(REPORT_DIR, 'report.md'), md);
	console.log(md);

	/* The walk reached every measure that has an entry. */
	await test.step('the walk reached every measure with an entry', async () => {
		for (let m = 1; m < MEASURES; m++) {
			expect.soft(states.some((s) => s.probe.heldMeasure === m), `m.${m} was drawn`).toBe(true);
			expect.soft(lastDerivation(derivations, m), `m.${m} logged its spacing`).toBeTruthy();
		}
		expect.soft(pageHitIds.some((id) => id.startsWith('m0-')), 'm.0 carries no entry').toBe(false);
	});

	/* EACH RULE ITS OWN NAMED STEP, soft, so every rule is asserted and reported. */
	for (const [name, violations] of Object.entries(rules)) {
		await test.step(name, async () => {
			expect.soft(violations, `${name}\n${violations.join('\n')}`).toEqual([]);
		});
	}
});

/* ── REAL-CLICK VERIFICATION ──────────────────────────────────────────── */

interface Expected {
	id: string;
	kind: 'entry' | 'gap';
	readout: string;
	/** The entry a Previous note press lands on from here, to tell apart two gaps that read the same. */
	previous: string | null;
}

/**
 * Tap every note, rest and caret of one measure by a real touch at its hit
 * centre and at 40 percent of the way toward its nearest neighbour in the
 * shared pool, and check the selection the readout names each time.
 */
async function verifyTaps(page: Page, m: number) {
	const hits = await page.evaluate(() => [...document.querySelectorAll('.score-page [data-hit]')].map((e) => e.getAttribute('data-hit') ?? ''));
	const first = hits.find((id) => id.startsWith(`m${m}-`));
	expect(first, `m.${m} has an entry`).toBeTruthy();
	await raiseOn(page, first!);

	/* WHAT EACH TARGET SHOULD SELECT, learned from the stepper: in the loupe's
	   own order the positions are entry, gap, entry, gap, ..., and the stepper
	   walks them in that order. */
	const start = (await page.evaluate(probeLoupe))!;
	const entries = start.entries.map((e) => e.id);
	/* THE HEAD CARET BELONGS TO THE MEASURE BEFORE: its `after` is that
	   measure's last entry, so a tap on it hands the loupe to m - 1. */
	const headCaret = start.carets.find((c) => !entries.includes(c.after));
	await stepBy(page, 'Previous note');
	const headReadout = (await readout(page)) ?? '';
	await stepBy(page, 'Previous note');
	const headPrevious = (await readout(page)) ?? '';
	await stepBy(page, 'Next note');
	await stepBy(page, 'Next note');
	const walk: string[] = [(await readout(page)) ?? ''];
	for (let i = 0; i < entries.length * 2 - 1; i++) {
		await stepBy(page, 'Next note');
		walk.push((await readout(page)) ?? '');
	}
	const expected: Expected[] = [];
	if (headCaret) expected.push({ id: headCaret.after, kind: 'gap', readout: headReadout, previous: headPrevious });
	entries.forEach((id, k) => {
		expected.push({ id, kind: 'entry', readout: walk[2 * k], previous: null });
		expected.push({ id, kind: 'gap', readout: walk[2 * k + 1], previous: walk[2 * k] });
	});
	/* Back to the first entry, so the loupe holds m. */
	for (let i = 0; i < entries.length * 2 - 1; i++) await stepBy(page, 'Previous note');

	const results: string[] = [];
	for (const ex of expected) {
		for (const toward of [0, -0.4, 0.4]) {
			/* Bring the target into the window, then read it fresh. */
			await page.evaluate(
				([id, kind]) => {
					const sel = kind === 'entry' ? `[data-loupe-hit="${CSS.escape(id)}"]` : `[data-loupe-gap="${CSS.escape(id)}"]`;
					const el = document.querySelector(`.loupe .loupe-body ${sel}`);
					const win = document.querySelector('.loupe .loupe-window') as HTMLElement | null;
					if (!el || !win) return;
					const r = el.getBoundingClientRect();
					const w = win.getBoundingClientRect();
					win.scrollLeft += r.left + r.width / 2 - (w.left + w.width / 2);
				},
				[ex.id, ex.kind] as const,
			);
			await settle(page);
			const p = (await page.evaluate(probeLoupe))!;
			expect(p.heldMeasure, `the loupe holds m.${m} before the tap on ${ex.kind} ${ex.id}`).toBe(m);
			const pool = [
				...p.entries.map((e) => ({ key: `entry:${e.id}`, cx: e.cx, cy: e.cy })),
				...p.carets.map((c) => ({ key: `gap:${c.after}`, cx: c.cx, cy: c.cy })),
			];
			const me = pool.find((t) => t.key === `${ex.kind}:${ex.id}`);
			if (!me) {
				results.push(`${ex.kind} ${ex.id}: NOT DRAWN`);
				continue;
			}
			/* The neighbour on the side asked for, by centre, in the shared pool. */
			const side = pool
				.filter((t) => t !== me && (toward < 0 ? t.cx < me.cx : t.cx > me.cx))
				.sort((a, b) => Math.hypot(a.cx - me.cx, a.cy - me.cy) - Math.hypot(b.cx - me.cx, b.cy - me.cy))[0];
			if (toward !== 0 && !side) continue;
			const x = toward === 0 ? me.cx : me.cx + (side!.cx - me.cx) * Math.abs(toward);
			const y = toward === 0 ? me.cy : me.cy + (side!.cy - me.cy) * Math.abs(toward);
			if (x < p.window.left + 1 || x > p.window.right - 1) {
				results.push(`${ex.kind} ${ex.id} at ${toward}: point outside the window, NOT TAPPED`);
				continue;
			}
			await page.touchscreen.tap(x, y);
			await settle(page);
			const got = await readout(page);
			let ok = got === ex.readout;
			let detail = '';
			if (ok && ex.kind === 'entry' && !ex.readout.startsWith('Rest')) {
				const q = (await page.evaluate(probeLoupe))!;
				const e = q.entries.find((z) => z.id === ex.id)!;
				ok = !!q.ring && q.ring.left <= e.cx && e.cx <= q.ring.right;
				if (!ok) detail = ' (readout right, squircle not on it)';
			}
			if (ok && ex.kind === 'gap' && ex.previous) {
				/* Two gaps can read the same; the entry before tells them apart. */
				await stepBy(page, 'Previous note');
				ok = (await readout(page)) === ex.previous;
				if (!ok) detail = ' (readout right, but the entry before it is not)';
				await stepBy(page, 'Next note');
			}
			results.push(`${ok ? 'ok' : 'WRONG'} ${ex.kind} ${ex.id} tapped at ${toward === 0 ? 'centre' : `${toward * 100}% toward ${side!.key}`}, x ${x.toFixed(1)}: read "${got}"${ok ? '' : `, expected "${ex.readout}"${detail}`}`);
			/* Only the head caret hands the loupe to m - 1; one step brings it back. */
			for (let i = 0; i < 3 && (await page.evaluate(probeLoupe))?.heldMeasure !== m; i++) await stepBy(page, 'Next note');
		}
	}
	return results;
}

test('real clicks resolve note, rest and caret taps on a converged measure', async ({ page }) => {
	test.setTimeout(10 * 60_000);
	const lines: { type: string; text: string; step: number }[] = [];
	await loadFixture(page, lines, () => 0);
	/* m. 5 carries notes, two rests and a beam: the widest pool of kinds. */
	const m = 5;
	const results = await verifyTaps(page, m);
	const d = lastDerivation(parseDerivations(lines), m);
	const head = `m.${m}: minGap ${d?.minGap}, worst ${d?.worst} px, converged (inferred) ${d?.convergedInferred}`;
	mkdirSync(REPORT_DIR, { recursive: true });
	writeFileSync(join(REPORT_DIR, `taps-m${m}.md`), [head, ...results].join('\n') + '\n');
	console.log([head, ...results].join('\n'));
	expect(d?.convergedInferred, `${head}: this test is the converged half`).toBe(true);
	const wrong = results.filter((r) => !r.startsWith('ok'));
	expect(wrong, wrong.join('\n')).toEqual([]);
});

test('real clicks on a measure that did not converge', async ({ page }) => {
	test.setTimeout(10 * 60_000);
	/* THE UNCONVERGED HALF NEEDS AN UNCONVERGED MEASURE, and the scan is the
	   only thing that says whether one exists. None is manufactured: no width,
	   budget or spacing is changed to make one. */
	test.skip(!existsSync(SCAN_JSON), 'NOT ESTABLISHED: the scan has not run, so no unconverged measure is known');
	const derivations = JSON.parse(readFileSync(SCAN_JSON, 'utf8')).derivations as Derivation[];
	const unconverged = [...new Set(derivations.filter((d) => d.worst < TAP_FLOOR_PX).map((d) => d.measure))];
	test.skip(unconverged.length === 0, 'NOT ESTABLISHED: every measure converged at 390 px, so there is no unconverged measure to click');
	const lines: { type: string; text: string; step: number }[] = [];
	await loadFixture(page, lines, () => 0);
	const m = unconverged[0];
	const results = await verifyTaps(page, m);
	writeFileSync(join(REPORT_DIR, `taps-m${m}.md`), results.join('\n') + '\n');
	console.log(results.join('\n'));
	const wrong = results.filter((r) => !r.startsWith('ok'));
	expect(wrong, wrong.join('\n')).toEqual([]);
});
