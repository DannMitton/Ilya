/**
 * Reads one page's underlay (N.135 stage 2b): the two halves joined, with
 * everything that touches the browser passed in, so every branch is a unit test.
 *
 * `prepare` is the Worker's half (`underlay-prepare.ts`, by way of
 * `underlay.worker.ts`): the page in, the framed rows out as images for the
 * reader and the layout to put its answer back with. `recognize` is the reader
 * (tesseract.js, `underlay-recognize.ts`): one framed row in, its word boxes
 * out. `seams` is the dictionary and the engine (`underlay-seams.ts`).
 * `seatPage` is the page's half (`underlay-page.ts`).
 *
 * NEVER REJECTS. Where the Worker throws, the model does not load, a fetch
 * fails, or the reader throws on a row, the page answers null with one
 * `console.info` line saying why, and the song is joined as it was before this
 * stage existed (`underlay-song.ts`).
 */
import type { StaffBoxLike } from './metre-windows';
import type { ExtenderArm } from './underlay-extender';
import { chooseLook, scoreLook, type LookRead } from './underlay-choose';
import { LOOKS, type Look } from './underlay-looks';
import { seatPage, type LookReport, type PageLayout, type ReadUnderlay, type RowLayout, type Seams, type SystemWords, type UnderlayPage, type UnderlayStats, type WordBox } from './underlay-page';

export interface UnderlayParts<Row> {
	/** The Worker's half: one framed image per row, in `layout`'s order. */
	prepare(image: Blob, musicXml: string, staves: readonly StaffBoxLike[]): Promise<{ layout: PageLayout; rows: Row[]; ms: number }>;
	/**
	 * The second looks (row 181 step 2): the page decoded again and each wanted system cut as each look says, as framed rows
	 * and where each stands (ids from 0 within the look). Absent, a system with no Russian row stays unread, as before.
	 */
	looks?(image: Blob, musicXml: string, staves: readonly StaffBoxLike[], wants: { system: number; looks: Look[] }[]): Promise<{ system: number; look: Look; rows: Row[]; layoutRows: RowLayout[] }[]>;
	/** The reader: the word boxes of one framed row. */
	recognize(row: Row): Promise<WordBox[]>;
	/** The dictionary and the engine, once they are ready; rejects where they are not. */
	seams(): Promise<Seams>;
	now?: () => number;
	/** The extender arm for this read (`underlay-switch.ts`, `?extender=a` or `b`); absent, `off`. */
	arm?: () => ExtenderArm;
	/** Whether the second look is made on this read (`underlay-switch.ts`, `?looks=off`); absent, it is. */
	looksOn?: () => boolean;
}

/**
 * What a failure says. tesseract.js rejects with a string, or with an event
 * from its Worker, as often as with an `Error`; `String(err.message)` of those is
 * the word "undefined".
 */
export function describeError(err: unknown): string {
	if (err instanceof Error && err.message) return err.message;
	if (typeof err === 'string' && err) return err;
	if (err && typeof err === 'object') {
		const o = err as { message?: unknown; type?: unknown; target?: { src?: unknown; url?: unknown } };
		if (typeof o.message === 'string' && o.message) return o.message;
		const where = o.target && (o.target.src ?? o.target.url);
		if (typeof o.type === 'string') return `${o.type} event${typeof where === 'string' ? ` from ${where}` : ''}`;
		try {
			const json = JSON.stringify(err);
			if (json && json !== '{}') return json;
		} catch {
			/* not serialisable */
		}
	}
	return 'no reason was given';
}

/** «; counted: 1 clitic with a note of its own, 0 units of many vowels cut, 1 merged»: counts only (`underlay-clitics.ts`, `underlay-counts.ts`); nothing where all are 0. */
function counted(stats: UnderlayStats): string {
	const { ownNote, manyVowels, perSystem } = stats.counted;
	const { breaches } = stats.counted;
	const noSyllable = breaches.filter((b) => b.kind === 'no-syllable').length;
	const perSystemLine = perSystem.length
		? `; free notes against syllable units after the vowelless drop, by system (ties-only free, slur-aware free, units, the reading taken): ${perSystem.map((p) => `${p.system}: ties ${p.free}, slur-aware ${p.slurFree}, units ${p.units}, ${p.slurReading ? 'SLUR' : p.extender ? 'EXTENDER' : 'ties'}`).join('; ')}`
		: '';
	if (ownNote.length + manyVowels.cut.length + manyVowels.merged.length + breaches.length + perSystem.length === 0) return '';
	return `; counted: ${ownNote.length} folded clitic(s) the print gives a note of its own${ownNote.map((o) => ` (system ${o.system} row ${o.row} «${o.text}»)`).join('')}, ${manyVowels.cut.length} unit(s) of two vowels or more uncut, ${manyVowels.merged.length} many-vowels merge(s) refused (a second token on a note is unseated), ${breaches.length} note(s) breaking one vowel per note over the sung notes (${noSyllable} with no syllable)${perSystemLine}`;
}

/** «; no words in system 2 (no Russian row), system 5 (no band)»: the systems of the page that took none; nothing where every one did. A silent system (no ink, every note tied) is named so, not as unread. */
function tookNone(systems: readonly SystemWords[]): string {
	const none = systems.flatMap((s, i) => (s.written ? [] : [`system ${i + 1} (${s.silent ? `${s.why}, nothing to read` : s.why})`]));
	return none.length ? `; no words in ${none.join(', ')}` : '';
}

/** «; second look: system 3 down 812 ms (not Russian), wide 903 ms (Russian, 6 words, kept), … (4.2 s)»: each look tried, for the desk's measure of its cost and its gain. */
function looksLine(looks: readonly LookReport[] | undefined, total: number | undefined): string {
	if (!looks || looks.length === 0) return '';
	return `; second look: ${looks.map((l) => `system ${l.system} ${l.look} ${l.ms} ms (${l.russian ? `Russian, ${l.known} words${l.kept ? ', kept' : ''}` : 'not Russian'})`).join(', ')} (${((total ?? 0) / 1000).toFixed(1)} s)`;
}

/**
 * Row 181 step 1, for the desk's measure on row 114: what the rows held that bears on a printed extender, the notes marked
 * (arm `a` or `b`), and each banded system's ink share and text-line candidates, from which the desk sets `NO_INK_SHARE_MAX`.
 */
function extenderLine(stats: UnderlayStats, arm: string): string {
	const { extender, joint, longDash, marked } = stats.extenders;
	const bands = stats.inkBands.map((b) => `${b.system}${b.written ? 'w' : 'u'}:${b.inkShare === null ? '?' : b.inkShare.toFixed(4)}/${b.textLines ?? '?'}`).join(' ');
	return `; extenders (arm ${arm}): ${extender} underscore, ${joint} hyphen, ${longDash} long-dash token(s), ${marked} note(s) marked under one; ink bands (system, w written or u not: ink share/text-line candidates): ${bands || 'none'}`;
}

export function makeUnderlayReader<Row>(parts: UnderlayParts<Row>): ReadUnderlay {
	const now = parts.now ?? (() => performance.now());
	return async (image, musicXml, staves) => {
		let stage = 'the Worker';
		let prepared: { rows: number; ms: number } | null = null;
		try {
			const made = await parts.prepare(image, musicXml, staves);
			prepared = { rows: made.rows.length, ms: Math.round(made.ms) };
			stage = 'the reader';
			const t1 = now();
			const reads: WordBox[][] = [];
			for (const row of made.rows) reads.push(await parts.recognize(row));
			const t2 = now();
			stage = 'the dictionary';
			const seams = await parts.seams();
			stage = 'the seating';
			const options = { extenderArm: parts.arm?.() ?? 'off' } as const;
			let seated = seatPage(made.layout, reads, seams, options);
			// THE SECOND LOOK (row 181 step 2; Dann 2026-11-04 10:12 items 6 (b) and 7), for a system whose band held ink and gave no Russian
			// row. LIMIT: each such system gets each of `LOOKS` (four) at most once, so four further looks per system and no more; no look
			// is itself looked at again. The look kept is the one whose first Russian row holds the most dictionary words.
			const failing = parts.looks && (parts.looksOn?.() ?? true) ? seated.systems.flatMap((s, i) => (s.why === 'no Russian row' && made.layout.systems[i].hasBand ? [i] : [])) : [];
			let looks: LookReport[] | undefined;
			let lookMs = 0;
			if (parts.looks && failing.length > 0) {
				stage = 'the second look';
				const t3 = now();
				const got = await parts.looks(image, musicXml, staves, failing.map((system) => ({ system, looks: [...LOOKS] })));
				const kept = new Map<number, { layoutRows: RowLayout[]; reads: WordBox[][] }>();
				looks = [];
				for (const system of failing) {
					const candidates: (LookRead & { ms: number })[] = [];
					for (const g of got.filter((x) => x.system === system && x.rows.length > 0)) {
						const t4 = now();
						const read: WordBox[][] = [];
						for (const row of g.rows) read.push(await parts.recognize(row));
						candidates.push({ look: g.look, layoutRows: g.layoutRows, reads: read, ms: Math.round(now() - t4) });
					}
					const best = chooseLook(candidates, seams);
					for (const [i, c] of candidates.entries()) {
						const score = scoreLook(c, seams);
						looks.push({ system: system + 1, look: c.look, ms: c.ms, russian: score.russian, known: score.known, kept: i === best });
					}
					if (best !== null) kept.set(system, { layoutRows: [...candidates[best].layoutRows], reads: candidates[best].reads.map((r) => [...r]) });
				}
				if (kept.size > 0) {
					// The kept look's rows go into the page's rows, numbered after the first look's, and the whole page is seated again, so a word that
					// carries across a system break is sewn as it always is.
					const more: WordBox[][] = [];
					const layout: PageLayout = { ...made.layout, systems: made.layout.systems.map((sys, i) => {
						const k = kept.get(i);
						if (!k) return sys;
						const rows = k.layoutRows.map((r) => ({ ...r, id: reads.length + more.length + r.id }));
						more.push(...k.reads);
						return { ...sys, rows };
					}) };
					seated = seatPage(layout, [...reads, ...more], seams, options);
				}
				lookMs = Math.round(now() - t3);
			}
			const ms = { prepare: Math.round(made.ms), read: Math.round(t2 - t1), seat: Math.round(now() - t2) - lookMs, ...(looks ? { look: lookMs } : {}) };
			const page: UnderlayPage = { ...seated, ms, ...(looks ? { looks } : {}) };
			console.info(`[omr] underlay: page read in ${((ms.prepare + ms.read + ms.seat) / 1000).toFixed(1)} s (worker ${ms.prepare} ms, reader ${ms.read} ms, seating ${ms.seat} ms): ${seated.stats.rows} rows in ${seated.stats.systems} systems, ${seated.stats.seated} syllables seated, ${seated.stats.unseated} unseated${seated.stats.fallback ? `; the dictionary-sewing fallback seated ${seated.stats.fallback} system(s)` : ''}${counted(seated.stats)}${extenderLine(seated.stats, parts.arm?.() ?? 'off')}${looksLine(looks, lookMs)}${tookNone(seated.systems)}`);
			return page;
		} catch (err) {
			console.info(`[omr] underlay: the page was not read (${stage} failed: ${describeError(err)}${prepared ? `; the Worker had framed ${prepared.rows} rows in ${prepared.ms} ms` : ''})`);
			return null;
		}
	};
}
