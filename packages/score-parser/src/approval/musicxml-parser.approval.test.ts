/**
 * Approval (golden-master) test for `MusicXmlScoreParser` (musicxml-parser.ts,
 * 1,168 lines). Pins today's exact `ParsedScore` produced from a real
 * fixture already committed to the repo, not a synthetic one built for
 * this suite: `apps/web/src/lib/shane/ingestion/fixtures/sunless-01-engraved.musicxml`
 * (5,024 lines; Mussorgsky, "Without Sun no. 1: Within Four Walls",
 * `musx2mxl`-engraved). This is the only real score-file fixture found in
 * the repository outside `tools/e16-harness` (which is a separate,
 * non-package harness); see the memo's "What I could not establish" for
 * what was searched.
 *
 * Read-only: this file only reads that fixture, never writes it.
 *
 * A no-DOM-in-node problem, and the fix already used in this codebase:
 * `musicxml-parser.ts:863-872` (`resolveDocument`) requires a global
 * `DOMParser` for string input and says so when one is absent. Both
 * `musicxml-parser.test.ts:29-114` (this package) and
 * `apps/web/src/lib/shane/ingestion/mini-dom.ts` (the app) carry their own
 * copy of the same tiny, dependency-free XML reader for exactly this
 * reason. The copy below (lines marked MINI-DOM) is that same reader,
 * reproduced verbatim rather than imported, because moving it would touch
 * files outside this audit's write allowance.
 *
 * Determinism and the one thing normalized: `musicxml-parser.ts:268-276`
 * (`syllableId`) assigns each syllable a fresh `crypto.randomUUID()` (or a
 * `Date.now()`/`Math.random()` fallback) when the source gives it no id of
 * its own, and this fixture's lyrics carry no id attribute, so every
 * `syllable.id` in the raw `ParsedScore` differs from run to run. Proven
 * below (`it('assigns a fresh id...')`) and then normalized: each unique
 * `syllable.id`, in the order it is first encountered walking
 * `vocalLine`, is replaced with `SYL_0`, `SYL_1`, ... before the snapshot
 * is taken. Everything else in `ParsedScore` (pitches, durations, ties,
 * measures, key/time signatures, lyric text) is produced by pure
 * source-to-structure translation and carries no other randomness or
 * wall-clock dependency (grep for `Date.now`, `Math.random`, `crypto` in
 * musicxml-parser.ts turns up only `syllableId`).
 *
 * The approved JSON has its object keys sorted at every level (see
 * `stableStringify` below) so the diff a reviewer sees is about the DATA,
 * not about incidental key-insertion order.
 */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { MusicXmlScoreParser } from '../musicxml-parser';
import type { MusicXmlScoreInput, ParsedScore } from '../types';

// ── MINI-DOM: verbatim copy of musicxml-parser.test.ts:29-114 ────────

type MiniNode = { t: 'e'; el: MiniEl } | { t: 't'; s: string };

function decodeEntities(s: string): string {
	return s
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&quot;/g, '"')
		.replace(/&apos;/g, "'")
		.replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(parseInt(n, 10)))
		.replace(/&amp;/g, '&');
}

class MiniEl {
	tagName: string;
	attrs = new Map<string, string>();
	nodes: MiniNode[] = [];
	constructor(tagName: string) {
		this.tagName = tagName;
	}
	getAttribute(name: string): string | null {
		return this.attrs.has(name) ? (this.attrs.get(name) as string) : null;
	}
	get children(): MiniEl[] {
		return this.nodes.filter((n): n is { t: 'e'; el: MiniEl } => n.t === 'e').map((n) => n.el);
	}
	get textContent(): string {
		return this.nodes.map((n) => (n.t === 't' ? n.s : n.el.textContent)).join('');
	}
	getElementsByTagName(tag: string): MiniEl[] {
		const out: MiniEl[] = [];
		const rec = (el: MiniEl) => {
			for (const c of el.children) {
				if (tag === '*' || c.tagName === tag) out.push(c);
				rec(c);
			}
		};
		rec(this);
		return out;
	}
}

function parseXml(src: string): MiniEl {
	const cleaned = src
		.replace(/<\?xml[\s\S]*?\?>/g, '')
		.replace(/<!--[\s\S]*?-->/g, '')
		.replace(/<!DOCTYPE[\s\S]*?>/g, '');
	const doc = new MiniEl('#document');
	const stack: MiniEl[] = [doc];
	const attrRe = /([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g;
	let pos = 0;
	const addText = (text: string) => {
		if (text.length === 0) return;
		stack[stack.length - 1].nodes.push({ t: 't', s: decodeEntities(text) });
	};
	while (pos < cleaned.length) {
		const lt = cleaned.indexOf('<', pos);
		if (lt < 0) {
			addText(cleaned.slice(pos));
			break;
		}
		if (lt > pos) addText(cleaned.slice(pos, lt));
		const gt = cleaned.indexOf('>', lt);
		if (gt < 0) break;
		const raw = cleaned.slice(lt + 1, gt);
		pos = gt + 1;
		if (raw.startsWith('/')) {
			if (stack.length > 1) stack.pop();
			continue;
		}
		const selfClose = raw.endsWith('/');
		const inner = selfClose ? raw.slice(0, -1) : raw;
		const nameMatch = /^([^\s/]+)([\s\S]*)$/.exec(inner);
		if (!nameMatch) continue;
		const el = new MiniEl(nameMatch[1]);
		attrRe.lastIndex = 0;
		let am: RegExpExecArray | null;
		while ((am = attrRe.exec(nameMatch[2])) !== null) {
			el.attrs.set(am[1], decodeEntities(am[2] !== undefined ? am[2] : am[3]));
		}
		stack[stack.length - 1].nodes.push({ t: 'e', el });
		if (!selfClose) stack.push(el);
	}
	return doc;
}

// ── helpers ───────────────────────────────────────────────────────

const FIXTURE_PATH = join(
	__dirname,
	'../../../../apps/web/src/lib/shane/ingestion/fixtures/sunless-01-engraved.musicxml',
);

function parseFixture() {
	const xml = readFileSync(FIXTURE_PATH, 'utf8');
	const input: MusicXmlScoreInput = {
		format: 'musicxml',
		data: parseXml(xml) as unknown as Document,
		sourcePath: 'sunless-01-engraved.musicxml',
	};
	return new MusicXmlScoreParser().parse(input);
}

/** Every `syllable.id` in the score, in first-encountered order. */
function syllableIdsInOrder(score: ParsedScore): string[] {
	const seen: string[] = [];
	for (const ev of score.vocalLine) {
		const id = ev.syllable?.id;
		if (id !== undefined && !seen.includes(id)) seen.push(id);
	}
	return seen;
}

/**
 * Replace every `syllable.id` with a stable `SYL_n` placeholder, n being
 * its position in `syllableIdsInOrder`. The only normalization this suite
 * performs (see file header).
 */
function normalizeSyllableIds(score: ParsedScore): ParsedScore {
	const order = syllableIdsInOrder(score);
	const map = new Map(order.map((id, i) => [id, `SYL_${i}`]));
	return {
		...score,
		vocalLine: score.vocalLine.map((ev) =>
			ev.syllable ? { ...ev, syllable: { ...ev.syllable, id: map.get(ev.syllable.id)! } } : ev,
		),
	};
}

/** Deterministic JSON: object keys sorted at every level. */
function stableStringify(value: unknown): string {
	const sortKeys = (v: unknown): unknown => {
		if (Array.isArray(v)) return v.map(sortKeys);
		if (v !== null && typeof v === 'object') {
			const out: Record<string, unknown> = {};
			for (const k of Object.keys(v as object).sort()) {
				out[k] = sortKeys((v as Record<string, unknown>)[k]);
			}
			return out;
		}
		return v;
	};
	return JSON.stringify(sortKeys(value), null, 2) + '\n';
}

// ── the approval itself ──────────────────────────────────────────

describe('MusicXmlScoreParser approval: sunless-01-engraved.musicxml', () => {
	it('assigns a fresh syllable id on every parse (documents the non-determinism normalized below)', async () => {
		const a = await parseFixture();
		const b = await parseFixture();
		const idsA = syllableIdsInOrder(a.score);
		const idsB = syllableIdsInOrder(b.score);
		expect(idsA.length).toBeGreaterThan(0);
		expect(idsA).not.toEqual(idsB); // fresh ids each call
	});

	it('produces the approved ParsedScore, syllable ids normalized', async () => {
		const result = await parseFixture();
		expect(result.errors).toEqual([]);
		const normalized = normalizeSyllableIds(result.score);
		await expect(stableStringify(normalized)).toMatchFileSnapshot(
			'./__approved__/sunless-01-engraved.parsed-score.json',
		);
	});

	it('produces the approved warnings list', async () => {
		const result = await parseFixture();
		await expect(stableStringify(result.warnings)).toMatchFileSnapshot(
			'./__approved__/sunless-01-engraved.warnings.json',
		);
	});
});
