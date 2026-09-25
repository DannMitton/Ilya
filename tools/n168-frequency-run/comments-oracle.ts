/**
 * N.168 first slice: the comments oracle, run inside the frequency run.
 *
 * Brief `docs/sessions/brief-code-n168-first-slice_r2_2026-09-25.md`, "Done
 * when" items 1 and 2. It runs `$lib/shane/comments.ts` (the module the app
 * calls) over every song and voice, counts the way r1 §4 counts, and writes
 * the comparison beside r1's own numbers. A difference is reported with the
 * notes that caused it. Nothing here adjusts a number to match.
 *
 * r1 §4's counting: "events" drop tie continuations; "rows" count every row of
 * a firing chain; "patterns" count one per vowel and pitch per song; "songs"
 * count songs with at least one event.
 */

import type { IntakeAnswers, NoteCondition, Pitch, VoiceProfileSnapshot } from '@ilya/score-parser';
import { pitchToMidi } from '@ilya/score-parser';
import {
	COMMENT_DEFAULTS,
	byStakes,
	noteComments,
	noteFacts,
	selectComments,
	type CommentKind,
	type NoteComment,
} from '$lib/shane/comments';
import { renderComments, runsText, songSeed } from '$lib/shane/comment-text';

export interface OracleRow extends NoteCondition {
	song: string;
	bar: string;
	beat: number;
	pitch: Pitch;
	pitchName: string;
}

export interface OracleSong {
	voice: string;
	treble: boolean;
	profile: VoiceProfileSnapshot;
	song: string;
	rows: OracleRow[];
}

export interface OracleFinding {
	song: string;
	eventId: string;
	bar: string;
	kinds: string[];
	vowel: string;
}

type Count = [number, number, number, number] | 'not assessed';

/** r1 §4, "Counts at the default intake": events; rows; patterns; songs. Comment 3 is r1's musical-weight line (the desk default of 13:28), which gives events; patterns; songs only. */
const R1_DEFAULT: Record<CommentKind, Record<string, Count | [number, number, number]>> = {
	sustained: {
		mitton: [9, 18, 9, 4], bass: [3, 6, 3, 3], baritone: [5, 9, 5, 3], tenor: [6, 11, 6, 4],
		contralto: [6, 11, 6, 4], mezzo: [6, 11, 6, 4], soprano: [9, 18, 9, 4], godin: 'not assessed',
	},
	turning: {
		mitton: [6, 7, 5, 4], bass: [4, 5, 3, 3], baritone: [10, 12, 7, 7], tenor: [19, 22, 15, 10],
		contralto: [4, 5, 3, 3], mezzo: [20, 25, 15, 11], soprano: [55, 61, 40, 14], godin: [3, 3, 2, 2],
	},
	closedU: { mitton: [5, 5, 5], bass: [1, 1, 1], baritone: [8, 8, 8], tenor: [25, 21, 13] },
};

/** r1 §4, "Counts by intake answer": events; patterns; songs. */
const R1_BY_ANSWER: { label: string; kind: CommentKind; intake: IntakeAnswers; counts: Record<string, [number, number, number]> }[] = [
	{ label: '1 at points 1 to 2 (1.5 s)', kind: 'sustained', intake: { sustained: 2 }, counts: { mitton: [20, 20, 9], bass: [5, 5, 4], baritone: [9, 9, 5], tenor: [12, 12, 7], contralto: [12, 12, 7], mezzo: [12, 12, 7], soprano: [20, 20, 9] } },
	{ label: '1 at points 4 to 5 (4.0 s)', kind: 'sustained', intake: { sustained: 4 }, counts: { mitton: [3, 3, 3], bass: [1, 1, 1], baritone: [1, 1, 1], tenor: [2, 2, 2], contralto: [2, 2, 2], mezzo: [2, 2, 2], soprano: [3, 3, 3] } },
	{ label: '2 at points 1 to 2 (-3 to +5; treble edge 3)', kind: 'turning', intake: { passaggi: 2 }, counts: { mitton: [6, 5, 4], bass: [4, 3, 3], baritone: [12, 9, 8], tenor: [46, 34, 14], contralto: [4, 3, 3], mezzo: [20, 15, 11], soprano: [55, 40, 14] } },
	{ label: '2 at points 4 to 5 (0 to +2; treble edge 1)', kind: 'turning', intake: { passaggi: 4 }, counts: { mitton: [3, 3, 3], bass: [0, 0, 0], baritone: [4, 3, 3], tenor: [11, 8, 8], contralto: [4, 3, 3], mezzo: [12, 9, 8], soprano: [40, 29, 14] } },
];

const VOICE_ORDER = ['mitton', 'bass', 'baritone', 'tenor', 'contralto', 'mezzo', 'soprano', 'godin'];

function commentsFor(s: OracleSong, intake?: IntakeAnswers): NoteComment[] {
	return noteComments({
		facts: noteFacts(s.rows, s.profile),
		intake,
		treble: s.treble,
		...(s.profile.range ? { ceilingMidi: pitchToMidi(s.profile.range.highest) } : {}),
	});
}

interface Tally {
	events: number;
	rows: number;
	patterns: number;
	songs: number;
	notes: string[];
}

function tally(songs: OracleSong[], kind: CommentKind, intake?: IntakeAnswers): Tally {
	const t: Tally = { events: 0, rows: 0, patterns: 0, songs: 0, notes: [] };
	for (const s of songs) {
		const firing = commentsFor(s, intake).filter((c) => c.kinds.includes(kind));
		if (firing.length === 0) continue;
		t.songs++;
		t.events += firing.length;
		t.patterns += new Set(firing.map((c) => `${c.vowel}|${c.midi}`)).size;
		for (const c of firing) {
			const i = s.rows.findIndex((r) => r.eventId === c.eventId);
			let n = 1;
			while (s.rows[i + n]?.approach?.band === 'tie') n++;
			t.rows += n;
			t.notes.push(`${s.song} bar ${s.rows[i].bar} ${s.rows[i].pitchName} [${c.vowel}]`);
		}
	}
	return t;
}

const fmt = (c: Count | [number, number, number] | undefined) => (c === undefined ? 'not in r1' : c === 'not assessed' ? 'not assessed' : c.join('; '));

export function commentsOracle(all: OracleSong[], findings: OracleFinding[]): string {
	const md: string[] = [];
	const byVoice = (v: string) => all.filter((s) => s.voice === v);
	const voices = VOICE_ORDER.filter((v) => all.some((s) => s.voice === v));
	md.push('# N.168 first slice: the comments oracle', '');
	md.push('Generated by `tools/n168-frequency-run/comments-oracle.ts` from `$lib/shane/comments.ts`, the module the app calls. r1 is `draft-three-comments_r1_2026-09-25.md` §4. Counts are events; rows; patterns; songs, as r1 counts them. A cell reads MATCH or DIFFERS; nothing is adjusted to match.', '');

	md.push('## At the default intake (point 3 or unanswered)', '');
	md.push('| Comment | Voice | r1 | Module | Verdict |', '|---|---|---|---|---|');
	const differences: string[] = [];
	for (const kind of ['sustained', 'turning', 'closedU'] as const) {
		for (const v of voices) {
			const expected = R1_DEFAULT[kind][v];
			const songs = byVoice(v);
			const assessed = kind !== 'sustained' || songs.some((s) => s.profile.passaggio);
			const t = tally(songs, kind);
			const got: Count | [number, number, number] = !assessed
				? 'not assessed'
				: kind === 'closedU'
					? [t.events, t.patterns, t.songs]
					: [t.events, t.rows, t.patterns, t.songs];
			if (expected === undefined && kind === 'closedU' && t.events === 0) continue;
			const verdict = expected === undefined ? 'r1 gives none' : fmt(expected) === fmt(got) ? 'MATCH' : 'DIFFERS';
			md.push(`| ${kind} | ${v} | ${fmt(expected)} | ${fmt(got)} | ${verdict} |`);
			if (verdict === 'DIFFERS') differences.push(`- ${kind}, ${v}: r1 ${fmt(expected)}, module ${fmt(got)}. The module's notes: ${t.notes.join('; ')}.`);
		}
	}

	md.push('', '## By intake answer (events; patterns; songs)', '');
	md.push('| Comment and answer | Voice | r1 | Module | Verdict |', '|---|---|---|---|---|');
	for (const line of R1_BY_ANSWER) {
		for (const v of voices) {
			const expected = line.counts[v];
			if (!expected) continue;
			const t = tally(byVoice(v), line.kind, line.intake);
			const got: [number, number, number] = [t.events, t.patterns, t.songs];
			const verdict = fmt(expected) === fmt(got) ? 'MATCH' : 'DIFFERS';
			md.push(`| ${line.label} | ${v} | ${fmt(expected)} | ${fmt(got)} | ${verdict} |`);
			if (verdict === 'DIFFERS') differences.push(`- ${line.label}, ${v}: r1 ${fmt(expected)}, module ${fmt(got)}. The module's notes: ${t.notes.join('; ')}.`);
		}
	}
	md.push('', '### Differences, with the notes that caused them', '', ...(differences.length ? differences : ['None.']));

	// r1's by-answer table names "treble edge 2" for points 1 to 2, where its §2.1 says E = 3. Both, for the treble voices.
	md.push('', '### The treble edge at points 1 to 2: r1 §2.1 says 3, r1 §4\'s table header says 2', '');
	for (const v of voices.filter((x) => byVoice(x).some((s) => s.treble))) {
		const edge = (e: number) => ({ ...COMMENT_DEFAULTS, trebleEdge: { ...COMMENT_DEFAULTS.trebleEdge, points1to2: e } });
		const count = (e: number) => {
			const hits: string[] = [];
			let events = 0;
			const pats = new Set<string>();
			const songs = new Set<string>();
			for (const s of byVoice(v)) {
				const cs = noteComments({ facts: noteFacts(s.rows, s.profile), intake: { passaggi: 2 }, treble: s.treble, defaults: edge(e) }).filter((c) => c.kinds.includes('turning'));
				for (const c of cs) {
					events++;
					pats.add(`${s.song}|${c.vowel}|${c.midi}`);
					songs.add(s.song);
					const r = s.rows.find((x) => x.eventId === c.eventId)!;
					hits.push(`${s.song} bar ${r.bar} ${r.pitchName} [${c.vowel}]`);
				}
			}
			return { text: `${events}; ${pats.size}; ${songs.size}`, hits };
		};
		const e2 = count(2);
		const e3 = count(3);
		const extra = e3.hits.filter((h) => !e2.hits.includes(h));
		md.push(`- ${v}: edge 2 gives ${e2.text}; edge 3 gives ${e3.text}.${extra.length ? ` Edge 3 adds: ${extra.join('; ')}.` : ''}`);
	}

	// ── The known-answer cases, on the real scores.
	md.push('', '## Known-answer cases (brief, "Done when" item 2), on the real files', '');
	const mitton = byVoice('mitton');
	const find = (song: string, bar: string, pitch: string) => {
		const s = mitton.find((x) => x.song === song)!;
		const row = s.rows.find((r) => r.bar === bar && r.pitchName === pitch && r.approach?.band !== 'tie');
		return { s, row };
	};
	const fires = (song: string, bar: string, pitch: string, intake: IntakeAnswers | undefined, kind: CommentKind) => {
		const { s, row } = find(song, bar, pitch);
		return !!row && commentsFor(s, intake).some((c) => c.eventId === row.eventId && c.kinds.includes(kind));
	};
	const points = [1, 2, 3, 4, 5, 'not-sure', undefined] as const;
	const cases: [string, boolean][] = [
		['E4 [i], Kabalevsky T01 bar 37: comment 1 at every answer to Q4', points.every((p) => fires('Kabalevsky T01', '37', 'E4', { sustained: p }, 'sustained'))],
		['E♭4 [o], Kabalevsky T04 bar 10: comment 1 at points 1 to 3, not 4 and 5', ([1, 2, 3, 'not-sure', undefined] as const).every((p) => fires('Kabalevsky T04', '10', 'Eb4', { sustained: p }, 'sustained')) && ([4, 5] as const).every((p) => !fires('Kabalevsky T04', '10', 'Eb4', { sustained: p }, 'sustained'))],
		['E♭4 [ɛ], Kabalevsky T02 bar 50: one merged comment', (() => {
			const { s, row } = find('Kabalevsky T02', '50', 'Eb4');
			const cs = commentsFor(s).filter((c) => c.eventId === row?.eventId);
			return cs.length === 1 && cs[0].kinds.join() === 'sustained,turning';
		})()],
		['E4 [ɛ], Sunless 05 bar 39: comment 2 at points 1 to 3 of Q3, not 4 and 5', ([1, 2, 3, 'not-sure', undefined] as const).every((p) => fires('Sunless 05', '39', 'E4', { passaggi: p }, 'turning')) && ([4, 5] as const).every((p) => !fires('Sunless 05', '39', 'E4', { passaggi: p }, 'turning'))],
		["N.172's test: the E♭4 [o] of T04 for a novice (Q4 point 1) and not an expert (point 5)", fires('Kabalevsky T04', '10', 'Eb4', { sustained: 1 }, 'sustained') && !fires('Kabalevsky T04', '10', 'Eb4', { sustained: 5 }, 'sustained')],
	];
	md.push('| Case | Result |', '|---|---|', ...cases.map(([c, ok]) => `| ${c} | ${ok ? 'PASS' : 'FAIL'} |`));

	// ── Overlaps between a comment and a shipped finding, Mitton.
	md.push('', '## Where a comment and a shipped finding fire on the same note (Mitton, default intake)', '');
	md.push('| Song | Bar | Pitch | Vowel | Comment | Finding kinds |', '|---|---|---|---|---|---|');
	let overlaps = 0;
	for (const s of mitton) {
		for (const c of commentsFor(s)) {
			const f = findings.find((x) => x.song === s.song && x.eventId === c.eventId);
			if (!f) continue;
			const r = s.rows.find((x) => x.eventId === c.eventId)!;
			md.push(`| ${s.song} | ${r.bar} | ${r.pitchName} | [${c.vowel}] | ${c.kinds.join(', ')} | ${f.kinds.join(', ')} |`);
			overlaps++;
		}
	}
	if (overlaps === 0) md.push('| none | | | | | |');
	const t01Findings = findings.filter((f) => f.song === 'Kabalevsky T01');
	md.push('', `Every shipped finding in Kabalevsky T01 for Mitton, to settle r1 §1.3's question about the E4 [i] of bar 37: ${t01Findings.map((f) => `bar ${f.bar} [${f.vowel}] ${f.kinds.join('+')}`).join('; ') || 'none'}.`);

	// ── The ranking fallback on Dann's library.
	md.push('', '## What the ranking fallback put first, Mitton, default intake', '');
	md.push(`Stakes as a number is NOT ESTABLISHED, so the fallback ranks by the challenges named, then summed seconds, then place (\`byStakes\`). Budget ${COMMENT_DEFAULTS.budget}. "Shown" is in performance order.`, '');
	md.push('| Song | Comments | Ranked first | Shown | More observations |', '|---|---|---|---|---|');
	const label = (s: OracleSong, c: NoteComment) => {
		const r = s.rows.find((x) => x.eventId === c.eventId)!;
		return `bar ${r.bar} ${r.pitchName} [${c.vowel}] (${c.challenges.join('+')}${c.seconds !== undefined ? `, ${c.seconds.toFixed(2)} s` : ''})`;
	};
	for (const s of mitton) {
		const cs = commentsFor(s);
		const phrases = new Set(s.rows.map((r) => r.phrase.index)).size;
		const sel = selectComments(cs, { phraseCount: phrases });
		const first = [...cs].sort(byStakes)[0];
		md.push(`| ${s.song} | ${cs.length} | ${first ? label(s, first) : 'none'} | ${sel.shown.map((c) => label(s, c)).join('; ') || 'none'} | ${sel.more.length} |`);
	}

	// ── Rarity, a DESK PROPOSAL, off: what it would change.
	md.push('', '## Rarity, if it were on (DESK PROPOSAL, off by default)', '');
	const rarityLines: string[] = [];
	for (const v of voices) {
		for (const s of byVoice(v)) {
			const phrases = new Set(s.rows.map((r) => r.phrase.index)).size;
			const sel = selectComments(commentsFor(s), { phraseCount: phrases, defaults: { ...COMMENT_DEFAULTS, rarity: true } });
			if (sel.heavy.length) rarityLines.push(`- ${v}, ${s.song}: ${sel.heavy.join(' and ')} heavy (${phrases} phrases); ${sel.rarityDeferred.length} note comments would move to the piece level.`);
		}
	}
	md.push(...(rarityLines.length ? rarityLines : ['Nothing would change.']));

	// ── The rotation across the corpus.
	md.push('', '## The rotation across the corpus (the corpus test of `PRODUCT.md`, the rotation line)', '');
	const lead = new Map<string, number>();
	const firstLead = new Map<string, number>();
	const frames = new Map<string, number>();
	let pages = 0;
	let total = 0;
	for (const s of all.filter((x) => !x.treble)) {
		const cs = selectComments(commentsFor(s), { phraseCount: 0 }).shown;
		if (cs.length === 0) continue;
		pages++;
		const seed = songSeed(s.rows.map((r) => `${r.eventId}:${r.midi}`));
		const byId = new Map(s.rows.map((r) => [r.eventId, r.pitch]));
		const r = renderComments(cs, seed, { language: 'en', register: 'working', measuredVowels: new Set(Object.keys(s.profile.fR1)), pitchOf: (id) => byId.get(id) });
		r.forEach((x, k) => {
			const opener = runsText(x.visible[0]?.runs ?? []).split(' ').slice(0, 2).join(' ');
			lead.set(opener, (lead.get(opener) ?? 0) + 1);
			if (k === 0) firstLead.set(opener, (firstLead.get(opener) ?? 0) + 1);
			const shape = x.frame.split('. ')[0].replace(/\[[^\]]+\]|[A-G][♭♯]?\d|\d+/g, '#');
			frames.set(shape, (frames.get(shape) ?? 0) + 1);
			total++;
		});
	}
	const share = (m: Map<string, number>, of: number) => [...m.entries()].sort((a, b) => b[1] - a[1]).map(([k, n]) => `"${k}…" ${n} (${((100 * n) / of).toFixed(0)}%)`).join('; ');
	const flag = (m: Map<string, number>, of: number, limit: number) => [...m.entries()].filter(([, n]) => n / of > limit).map(([k]) => k);
	md.push(`${pages} pages (songs × non-treble voices) carry ${total} comments.`, '');
	md.push(`- Lead openers, every comment: ${share(lead, total)}.`);
	md.push(`- Lead openers, each page's first comment: ${share(firstLead, pages)}.`);
	md.push(`- First sentences of the frame: ${share(frames, total)}.`);
	const flaggedLead = flag(lead, total, 2 / 6);
	const flaggedFirst = flag(firstLead, pages, 2 / 6);
	md.push('', `**Flagged (DESK DEFAULT threshold: an opener over twice its even share, 2 in 6):** ${[...flaggedLead, ...flaggedFirst].length ? [...new Set([...flaggedLead, ...flaggedFirst])].join('; ') : 'none'}. The frame's first sentence repeats by design: it states the note's facts, and the variety lives in the openers, closers, and frame shapes (\`PRODUCT.md\`, "UNITY IN VARIETY").`);

	// ── Kabalevsky T01 for Mitton, rendered, both languages.
	md.push('', '## Kabalevsky T01, Mitton, default intake, as the page renders it', '');
	const t01 = mitton.find((s) => s.song === 'Kabalevsky T01');
	if (t01) {
		const cs = selectComments(commentsFor(t01), { phraseCount: 0 }).shown;
		const seed = songSeed(t01.rows.map((r) => `${r.eventId}:${r.midi}`));
		const byId = new Map(t01.rows.map((r) => [r.eventId, r.pitch]));
		for (const language of ['en', 'fr'] as const) {
			md.push(`### ${language === 'en' ? 'English' : 'French'}`, '');
			for (const x of renderComments(cs, seed, { language, register: 'working', measuredVowels: new Set(Object.keys(t01.profile.fR1)), pitchOf: (id) => byId.get(id) })) {
				md.push(`> ${[x.frame, ...x.visible.map((v) => runsText(v.runs))].join(' ')}`, `>`, `> ${x.count ? `${x.count} · ` : ''}(tap)`, '');
			}
		}
	}
	return md.join('\n') + '\n';
}
