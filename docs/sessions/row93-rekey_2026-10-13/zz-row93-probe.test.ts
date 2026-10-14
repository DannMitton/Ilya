// Row 93 probe (2026-10-13, Code on the Mac). Copied into apps/web/src/lib/score/ to run, then removed before
// the gates. Runs the re-key on a stored pairing map against the kept homr reading the repro wrote, and writes
// the per-bar outcomes to PROBE_OUT (vitest hides console in apps/web).
// PROBE_PAIRINGS=<json> PROBE_XML=<musicxml> PROBE_OUT=<json> npx vitest run src/lib/score/zz-row93-probe.test.ts
import { it } from 'vitest';
import fs from 'fs';
import { MusicXmlScoreParser } from '@ilya/score-parser';
import { parseXml } from './ingestion/mini-dom';
import { notePositions, rekeyOldReaderSeats, OLD_READER_ID } from './old-reader-seats';
import { syllableTargetIds } from './pairings';

it('row 93 probe', async () => {
	const map = JSON.parse(fs.readFileSync(process.env.PROBE_PAIRINGS as string, 'utf8'));
	const xml = fs.readFileSync(process.env.PROBE_XML as string, 'utf8');
	const { score } = await new MusicXmlScoreParser().parse({ format: 'musicxml', data: parseXml(xml) as unknown as Document, sourcePath: 'kept.musicxml' } as never);
	const line = score.vocalLine;
	const positions = notePositions(xml, line);
	const plain = rekeyOldReaderSeats(map, line);
	const r = rekeyOldReaderSeats(map, line, positions);
	const present = new Set(line.filter((e) => e.type !== 'rest').map((e) => e.id));
	const oldBars = Math.max(...Object.keys(map).filter((k) => OLD_READER_ID.test(k)).map((k) => Number(OLD_READER_ID.exec(k)![1]))) + 1;
	const targets = syllableTargetIds(line);
	const out = {
		measures: score.measures.length, oldBars, events: line.length, sung: present.size, targets: targets.length,
		notesPositioned: positions.size, idsWithoutPositions: line.filter((e) => !positions.has(e.id)).map((e) => e.id),
		withoutPositions: { moved: plain.moved, left: plain.left },
		moved: r.moved, left: r.left, barsLeft: r.bars.filter((b) => b.rule === 'left').length,
		orphanedAfter: Object.keys(r.map).filter((k) => !present.has(k)).length,
		bars: r.bars,
		firstPairs: Object.entries(map).slice(0, 12).map(([k, v]) => [k, Object.keys(r.map)[Object.keys(map).indexOf(k)], (v as { cyrillic?: string }).cyrillic]),
		allPairs: Object.keys(map).map((k, i) => [k, Object.keys(r.map)[i]]),
		imgposRange: positions.size ? [Math.min(...positions.values()), Math.max(...positions.values())] : null,
	};
	fs.writeFileSync(process.env.PROBE_OUT as string, JSON.stringify(out, null, 1));
});
