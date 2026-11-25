/**
 * Format dispatch: the ingestion API the ScoreUploader calls and live
 * wiring builds on (handover v34 §E.1; Round 9 §2 Items 1, 2, and 4).
 *
 * One entry point, `ingestScoreFile`, takes the uploaded File and returns
 * either a parsed score with its PROVENANCE (which fidelity tier the UI
 * shows, Round 9 Item 1) or a typed error the UI can map to specific,
 * persistent, inline copy. Nothing here renders or speaks; copy lives with
 * the component and the i18n table.
 *
 * Routing per format:
 * - MNX: decode, `JSON.parse`, `MnxScoreParser`. Direct tier, no banner.
 * - MusicXML: decode, `MusicXmlScoreParser`. Direct tier, no banner.
 * - `.mxl`: unzip, resolve the rootfile via `META-INF/container.xml`
 *   (falling back to the first plausible member), then the MusicXML path.
 *   Still the direct tier: decompression is not conversion.
 * - `.musx`: the existing denigma seam (`ScoreReader`, a warm WASM
 *   Worker), then the MNX path. Converted tier: dismissible banner.
 * - `.mscz`: the injected webmscore converter, then the MusicXML path.
 *   Silent acceptance with a "via MuseScore" format label (Round 9 Item 1:
 *   MuseScore's own engine is native to MuseScore, so no banner).
 *
 * Dependencies are injected so the routing logic tests as a pure seam:
 * the real parsers are the defaults; the Worker-backed converters have no
 * sandbox-runnable default and always arrive from the caller.
 */

import {
	foldDictionMarks,
	MnxScoreParser,
	MusicXmlScoreParser,
	type ParseError,
	type ParseResult,
	type ParseWarning,
	type ScoreParser,
	type SourceOrigin,
} from '@ilya/score-parser';
import type { ScoreReader } from '$lib/reader/score-reader';
import type { DenigmaError, ResourceError } from '$lib/reader/errors';
import {
	detectScoreFormat,
	decodeScoreText,
	type DetectionFailure,
} from './format-detection';
import { listZipEntries, readZipEntry, ZipReadError, type ZipFailureKind } from '$lib/reader/zip-reader';
import { t, type Language } from '$lib/i18n';
import { foldVowelessSyllables } from './vowelless-fold';
import { countUnderlay, type UnderlayCount } from './underlay-count';
import { decodeBars, encodeBars, mergeRanges, readUnreadBars, type BarRange } from '$lib/omr/unread-bars';
import { extenderMelismaIds } from '$lib/omr/extend-convention';

// ── Provenance (drives the fidelity surface, Round 9 Item 1) ─────

export type IngestProvenance =
	| { format: 'mnx'; via: 'direct' }
	| { format: 'musicxml'; via: 'direct' }
	| { format: 'musicxml'; via: 'mxl' }
	| { format: 'mnx'; via: 'denigma'; sourceFormat: 'musx' }
	| { format: 'musicxml'; via: 'webmscore'; sourceFormat: 'mscz' };

/**
 * Which dismissible fidelity banner a provenance earns. The `reader` tier
 * left with the old page reader (2026-10-27): a scan arrives as homr's
 * MusicXML, which ingests as `via: 'direct'` and earns no banner.
 */
export const fidelityBanner = (p: IngestProvenance): 'denigma' | null => {
	if (p.via === 'denigma') return 'denigma';
	return null;
};

/**
 * QUEUE row 95. Which courtesy message a wordless arrival earns.
 *
 * A file with no lyric elements really has no words in it, and says so. A scan
 * or photograph is different: its print may carry words that Ilya's reader
 * does not read, so its wordlessness is Ilya's limit, not a fact about the
 * song. The two are told apart by the score's own `source.origin`: the
 * singer's homr route hands its reading back as a `.musicxml` file, which
 * ingests as `via: 'direct'`, but homr stamps `<software>homr</software>` and
 * the parser reads that as `'homr-musicxml-from-image'` (row 121). A pure
 * function because `+page.svelte` is inert under vitest.
 */
export type NoLyricsNoticeKey = 'upload.banner.noLyrics' | 'upload.banner.noLyricsScan';

export const noLyricsNoticeKey = (p: IngestProvenance, origin: SourceOrigin): NoLyricsNoticeKey =>
	origin === 'homr-musicxml-from-image' ? 'upload.banner.noLyricsScan' : 'upload.banner.noLyrics';

/**
 * N.135 stage 2b, brief r5 step 2. The drawer's message for a scan, which is
 * one of four: the two above, and the two ratified for a song whose words were
 * read on some systems and not others (`ratified-banner-words-partly-read_2026-10-28.md`),
 * one naming several bars and one naming a single bar.
 */
export type ScanNoticeKey = NoLyricsNoticeKey | 'upload.banner.wordsPartlyRead' | 'upload.banner.wordsPartlyReadOne' | 'upload.banner.reader';

/**
 * INTEGRATION STEP 10 (desk, 2026-11-10): the banner that says a score is Ilya's synthesis from an image, ratified by Dann
 * (step 8b) and until now shown nowhere. It checks one thing, the score's own `source.origin`: `homr-musicxml-from-image` (a
 * scan or photograph read by homr) earns it, and every other origin (MusicXML, MXL, MEI, MNX, a vector PDF, a MIDI file) does
 * not. WHY: only an image reading is imperfect in the way the sentence names. WHEN IT FAILS: a singer is told to check a
 * MusicXML file against an original it was never read from, or is not told so of a scan. The page draws it above the
 * no-words and partly-read banners, in the same slot, and it is shown again for each scan because the origin is read from
 * the score that is open. It relates to `scanNotice` (the other banners) and `ScanBanner.svelte`.
 */
export const readerNoticeKey = (origin: SourceOrigin | undefined): 'upload.banner.reader' | null => (origin === 'homr-musicxml-from-image' ? 'upload.banner.reader' : null);

/**
 * The message a parse earns, and the text its `%s`-or-bars slot is filled
 * from (`noticeText`): the file's name for the two wordless messages, the
 * unread bars (`encodeBars`) for the other two. Null where it earns none.
 * A wordless score is told as ever; a score with words in it and a
 * `words-partly-read` warning (`withUnreadBars`) is told which bars. The page
 * is inert under vitest, so the choice is a pure function (as for
 * `noLyricsNoticeKey`).
 */
export function scanNotice(warnings: readonly ParseWarning[], p: IngestProvenance, origin: SourceOrigin, fileName: string): { key: ScanNoticeKey; arg: string } | null {
	if (warnings.some((w) => w.code === 'no-lyrics-found')) return { key: noLyricsNoticeKey(p, origin), arg: fileName };
	const bars = warnings.find((w) => w.code === 'words-partly-read')?.bars;
	if (!bars || bars.length === 0) return null;
	const one = bars.length === 1 && bars[0][0] === bars[0][1];
	return { key: one ? 'upload.banner.wordsPartlyReadOne' : 'upload.banner.wordsPartlyRead', arg: encodeBars(bars) };
}

/** «4, 9 to 12, and 39» or «4, 9 à 12 et 39»: a range of one bar is the bar alone; no comma before «et». */
export function barsText(ranges: readonly BarRange[], language: Language): string {
	const to = language === 'fr' ? ' à ' : ' to ';
	const parts = ranges.map(([a, b]) => (a === b ? `${a}` : `${a}${to}${b}`));
	if (parts.length <= 1) return parts.join('');
	if (language === 'fr') return `${parts.slice(0, -1).join(', ')} et ${parts[parts.length - 1]}`;
	if (parts.length === 2) return `${parts[0]} and ${parts[1]}`;
	return `${parts.slice(0, -1).join(', ')}, and ${parts[parts.length - 1]}`;
}

/** The text of a `scanNotice`: the key's string, with the file or the bars in its slot. */
export function noticeText(key: ScanNoticeKey, language: Language, arg: string): string {
	if (key === 'upload.banner.wordsPartlyRead') return t('upload.banner.wordsPartlyRead', language).replace('{bars}', barsText(decodeBars(arg), language));
	if (key === 'upload.banner.wordsPartlyReadOne') return t('upload.banner.wordsPartlyReadOne', language).replace('{bar}', barsText(decodeBars(arg), language));
	return t(key, language).replace('%s', arg);
}

/**
 * The parse with the bars a scan's reader could not read, if the MusicXML says
 * so (`unread-bars.ts`): a `words-partly-read` warning. The parser reads no
 * `<miscellaneous>` element and ceilings its own file, so the one reader of the
 * field is here, at the seam every MusicXML passes. A kept reading reopened
 * from its stored text passes through here again, and the warning returns.
 */
function withUnreadBars(result: ParseResult, text: string): ParseResult {
	const bars = readUnreadBars(text);
	if (bars.length === 0 || result.warnings.some((w) => w.code === 'words-partly-read')) return result;
	const message = `Printed words were not read in bars ${encodeBars(bars)}.`;
	return { ...result, warnings: [...result.warnings, { code: 'words-partly-read', message, bars }] };
}

/**
 * The parse with the notes a scan's printed extender sustains, if the MusicXML says so (`omr/extend-convention.ts`): an
 * `extender-notes` warning carrying their event ids. The parser reads no `<extend>`, so this is the one reader, at the same
 * seam as `withUnreadBars`. A kept reading reopened from its stored text passes through here again and the warning returns.
 * An authored score does not carry the convention's field and is not read BY THIS READER. Since item 1 of the arrival seam
 * (cloud-lane-88) the parser itself reads `<extend>` in every MusicXML file and warns first; where it has, this returns at
 * once, so THE PARSER'S READING WINS where a file Ilya wrote carries both (both name the same notes: `extend-convention.test.ts`).
 * This reader keeps its work for a file the parser's pass found nothing in, and for the bars it could not line up, which are
 * named in the message, so a loss is reported and never silent.
 */
function withExtenders(result: ParseResult, text: string): ParseResult {
	if (result.warnings.some((w) => w.code === 'extender-notes')) return result;
	const found = extenderMelismaIds(text, result.score.vocalLine);
	if (found.ids.length === 0 && found.unaligned === 0) return result;
	const message = `A printed extender sustains ${found.ids.length} note(s)${found.unaligned ? `; ${found.unaligned} bar(s) holding one could not be lined up with the notes and mark nothing` : ''}.`;
	return { ...result, warnings: [...result.warnings, { code: 'extender-notes', message, eventIds: found.ids }] };
}

export interface IngestedScore {
	fileName: string;
	provenance: IngestProvenance;
	/** May carry non-fatal warnings; fatal parses become `IngestError`s. */
	result: ParseResult;
}

// ── Errors ───────────────────────────────────────────────────────

/**
 * The typed failure vocabulary for the upload surface. Denigma's codes
 * (`CONVERSION_FAILED`, `WASM_LOAD_FAILED`) pass through verbatim so the
 * uploader shares copy with the existing first-load handling.
 */
export type IngestError =
	| { code: 'DETECTION_FAILED'; failure: DetectionFailure }
	| { code: 'CONTAINER_UNREADABLE'; container: 'mxl' | 'mscz'; zipKind: ZipFailureKind }
	| { code: 'MXL_NO_ROOTFILE' }
	| { code: 'INVALID_MNX_JSON' }
	| { code: 'PARSE_FAILED'; errors: ParseError[] }
	| { code: 'MSCZ_CONVERTER_UNAVAILABLE' }
	/** A picture or PDF reached dispatch. `take()` sends every scan to homr first. */
	| { code: 'PAGE_READER_UNAVAILABLE' }
	| DenigmaError
	| ResourceError;

export type IngestOutcome =
	| { ok: true; ingested: IngestedScore }
	| { ok: false; error: IngestError };

// ── Dependencies ─────────────────────────────────────────────────

export interface IngestDeps {
	/** The denigma seam for `.musx`. The component owns its lifecycle. */
	scoreReader: ScoreReader;

	/**
	 * The webmscore seam for `.mscz`: whole-file bytes in, MusicXML text
	 * out. Absent while the spike is pending; `.mscz` uploads then land in
	 * `MSCZ_CONVERTER_UNAVAILABLE` rather than a crash.
	 */
	msczConvert?: (bytes: Uint8Array, fileName: string) => Promise<string>;

	/** Parser overrides for routing tests; real parsers by default. */
	mnxParser?: ScoreParser;
	musicxmlParser?: ScoreParser;
}

// ── Dispatch ─────────────────────────────────────────────────────

const err = (error: IngestError): IngestOutcome => ({ ok: false, error });

export async function ingestScoreFile(file: File, deps: IngestDeps): Promise<IngestOutcome> {
	const bytes = new Uint8Array(await file.arrayBuffer());
	const detected = detectScoreFormat(file.name, bytes);
	if (!detected.ok) return err({ code: 'DETECTION_FAILED', failure: detected.failure });

	const mnxParser = deps.mnxParser ?? new MnxScoreParser();
	const musicxmlParser = deps.musicxmlParser ?? new MusicXmlScoreParser();

	switch (detected.format) {
		case 'mnx':
			return parseMnxText(decodeScoreText(bytes), file.name, mnxParser, {
				format: 'mnx',
				via: 'direct',
			});

		case 'musicxml':
			return parseMusicXmlText(decodeScoreText(bytes), file.name, musicxmlParser, {
				format: 'musicxml',
				via: 'direct',
			});

		case 'mxl': {
			let xmlText: string;
			try {
				xmlText = decodeScoreText(await readMxlRootfile(bytes));
			} catch (e) {
				if (e instanceof ZipReadError) {
					return err({ code: 'CONTAINER_UNREADABLE', container: 'mxl', zipKind: e.kind });
				}
				if (e instanceof MxlRootfileError) return err({ code: 'MXL_NO_ROOTFILE' });
				throw e;
			}
			return parseMusicXmlText(xmlText, file.name, musicxmlParser, {
				format: 'musicxml',
				via: 'mxl',
			});
		}

		case 'musx': {
			let mnxText: string;
			try {
				mnxText = await deps.scoreReader.convert(file);
			} catch (e) {
				return err(asConverterError(e));
			}
			return parseMnxText(mnxText, file.name, mnxParser, {
				format: 'mnx',
				via: 'denigma',
				sourceFormat: 'musx',
			});
		}

		case 'pdf':
		case 'image':
			// A picture or PDF reaching dispatch is the uploader's fault: `take()`
			// routes every scan to homr before dispatch, and homr's MusicXML is
			// what arrives here.
			return err({ code: 'PAGE_READER_UNAVAILABLE' });

		case 'mscz': {
			if (!deps.msczConvert) return err({ code: 'MSCZ_CONVERTER_UNAVAILABLE' });
			let xmlText: string;
			try {
				xmlText = await deps.msczConvert(bytes, file.name);
			} catch (e) {
				if (e instanceof ZipReadError) {
					return err({ code: 'CONTAINER_UNREADABLE', container: 'mscz', zipKind: e.kind });
				}
				return err(asConverterError(e));
			}
			return parseMusicXmlText(xmlText, file.name, musicxmlParser, {
				format: 'musicxml',
				via: 'webmscore',
				sourceFormat: 'mscz',
			});
		}
	}
}

// ── The two terminal parse paths ─────────────────────────────────

async function parseMnxText(
	text: string,
	fileName: string,
	parser: ScoreParser,
	provenance: IngestProvenance
): Promise<IngestOutcome> {
	let data: object;
	try {
		data = JSON.parse(text) as object;
	} catch {
		return err({ code: 'INVALID_MNX_JSON' });
	}
	return toOutcome(await parser.parse({ format: 'mnx', data, sourcePath: fileName }), fileName, provenance);
}

async function parseMusicXmlText(
	text: string,
	fileName: string,
	parser: ScoreParser,
	provenance: IngestProvenance
): Promise<IngestOutcome> {
	return toOutcome(
		withExtenders(withUnreadBars(await parser.parse({ format: 'musicxml', data: text, sourcePath: fileName }), text), text),
		fileName,
		provenance
	);
}

function toOutcome(
	result: ParseResult,
	fileName: string,
	provenance: IngestProvenance
): IngestOutcome {
	const fatal = result.errors.filter((e) => e.fatal);
	if (fatal.length > 0) return err({ code: 'PARSE_FAILED', errors: fatal });
	return { ok: true, ingested: { fileName, provenance, result: withVowelPerNote(withDictionMarksFolded(result)) } };
}

/**
 * N.171, "Switch it on" (Dann, 2026-09-24): the `#` phonation-break mark is
 * folded out of the syllable slot it took, here, at the one seam every
 * arrival passes through, so Text, Markup, the seat, and every resolver read
 * the same repaired underlay.
 *
 * Dann's rule, 2026-07-30 (`diction-marks.ts:8-12`): the mark joins the
 * syllable before it and is never discarded, so the boundary survives as a
 * fact. The fold records what it did on `score.dictionMarks`, which is how
 * `buildUnderlayResolvers` abstains on the vacated tail rather than carrying a
 * vowel onto a note the verse never reached.
 *
 * A score with no mark in any verse comes back BY REFERENCE, so this is
 * exactly the old arrival wherever there is nothing to repair.
 */
function withDictionMarksFolded(result: ParseResult): ParseResult {
	// No vocal line, nothing to fold (and `foldDictionMarks` rightly throws).
	if (!Array.isArray(result.score?.vocalLine)) return result;
	const fold = foldDictionMarks(result.score);
	return fold.score === result.score ? result : { ...result, score: fold.score };
}

/**
 * N.135 step 4, writer 3 (`CONTRACT.md` §0.1, one vowel per note, no exceptions): a
 * file's own syllable with no vowel letter on a note joins its host, or is not
 * drawn (`vowelless-fold.ts`). Runs after the `#` fold, at the same seam, so every
 * surface reads one repaired underlay. A score with nothing to repair comes back
 * by reference. The count of syllables left undrawn goes to the console.
 */
function withVowelPerNote(result: ParseResult): ParseResult {
	if (!Array.isArray(result.score?.vocalLine)) return result;
	const extenders = new Set(result.warnings.find((w) => w.code === 'extender-notes')?.eventIds ?? []);
	const fold = foldVowelessSyllables(result.score, extenders);
	if (fold.undrawn > 0) console.warn(`${fold.undrawn} syllable${fold.undrawn === 1 ? '' : 's'} with no note in the file's lyrics, not drawn (CONTRACT 0.1)`);
	const dealt = fold.score === result.score ? result : { ...result, score: fold.score };
	const count = countUnderlay(fold);
	return count.damaged || count.unchecked.length > 0 ? withUnderlayRecord(dealt, count) : dealt;
}

/**
 * Item 4 of the arrival seam (cloud-lane-88). WHAT IS LEFT OVER IS RECORDED, NEVER COVERED. Ilya invents no syllable and no
 * melisma, so a place the count cannot account for is handed on, with its bars and its reason, in an `underlay-count` warning
 * (`ParseWarning` carries `bars` and `eventIds`; the `Breach` shape cannot). No string a singer reads is added here: the telling
 * belongs to slice 6R of `plan-corrections-build_r2_2026-11-05.md`.
 *
 * RECORDED, NOT MERELY COUNTED: a note with no syllable reads as a melisma to every reader (`types.ts`, `VocalLineEvent.syllable`),
 * and the resolver would sustain the last vowel across it. The `#` fold's vacated tail is the one thing that does not, because
 * the resolver abstains on it (`diction-marks.ts`, `vowelResolverAbstentions`). So the leftover is recorded the SAME way, in
 * `score.dictionMarks.vacatedTailEventIds`: the notes the deal left with no syllable, and the sung notes with no text and no
 * evidence of a held note. Text with no note (a syllable the cascade pushed off the end, a fragment with no host) is in the
 * message with its bar and is never seated somewhere to be rid of it.
 */
/**
 * THE ONE SENTENCE for Corrections when a verse's slur gate fails (round 3, Dann's ruling). RATIFIED by Dann 2026-11-24 21:43, English
 * and French together, at `upload.banner.slurEvidenceUnchecked`. `{n}` is the verse's syllables and `{m}` its sung notes. The carrier is a
 * `ParseWarning` whose `verse` and `counts` let Corrections fill the French; the message is the English. Nothing here puts it on a page.
 */
const slurUnchecked = (v: { verse: number; syllables: number; sung: number }): ParseWarning => ({
	code: 'slur-evidence-unchecked',
	message: t('upload.banner.slurEvidenceUnchecked', 'en').replace('{n}', String(v.syllables)).replace('{m}', String(v.sung)),
	verse: v.verse,
	counts: [v.syllables, v.sung],
});

function withUnderlayRecord(result: ParseResult, count: UnderlayCount): ParseResult {
	const score = result.score;
	const barOf = new Map<string, number>();
	score.vocalLine.forEach((ev) => {
		const m = score.measures?.[ev.measureIndex];
		const n = m ? parseInt(m.number, 10) : NaN;
		barOf.set(ev.id, Number.isFinite(n) ? n : ev.measureIndex + 1);
	});
	const bar = (id: string): number => barOf.get(id) ?? 0;
	const ids = new Set<string>();
	const abstain: Array<{ eventId: string; verseNumber: number }> = [];
	const said: string[] = [];
	for (const v of count.verses) {
		const parts: string[] = [];
		// Fix 1: a vacated note is also a textless one, so the two lists are joined by note, each counted once.
		// Round 3, Dann's ruling on the gate: where the verse's slur gate FAILED, Ilya seats the verse as it was seated before this seam, writes
		// NO per-note abstention for it, and writes ONE record for the verse (below). One thing to check, not many blanks.
		const failed = v.slurGate === 'failed';
		const noteless = failed ? [] : [...new Set([...v.vacated.map((p) => p.eventId), ...v.unexplained])];
		for (const id of noteless) {
			abstain.push({ eventId: id, verseNumber: v.verse });
			ids.add(id);
		}
		if (noteless.length > 0) parts.push(`${noteless.length} note(s) with no syllable in bar(s) ${[...new Set(noteless.map(bar))].sort((a, b) => a - b).join(', ')}`);
		const engine = v.undivided.filter((p) => p.why === 'engine');
		const shape = v.undivided.filter((p) => p.why === 'shape');
		const marks = v.pinned.filter((p) => p.why === 'mark');
		const foreign = v.pinned.filter((p) => p.why === 'foreign');
		for (const [label, places] of [
			['text with no note', [...v.overflow, ...v.orphans]],
			['a token the engine could not divide', engine],
			['a token of two vowels or more that is not one run of letters, not divided', shape],
			['a mark alone on a note, not read as a syllable', marks],
			['a token with no Cyrillic letter, left on its note', foreign],
		] as const) {
			if (places.length === 0) continue;
			places.forEach((p) => ids.add(p.eventId));
			parts.push(`${label}: ${places.map((p) => `«${p.text}» (bar ${bar(p.eventId)})`).join(', ')}`);
		}
		if (parts.length === 0 && !v.agrees && !failed) parts.push('the notes and the syllables do not come out even');
		if (parts.length > 0) said.push(`Verse ${v.verse}: ${v.sung} sung note(s), ${v.syllables} syllable(s); ${parts.join('; ')}.`);
	}
	const unchecked: ParseWarning[] = count.verses.filter((v) => v.slurGate === 'failed').map(slurUnchecked);
	const known = new Set((score.dictionMarks?.vacatedTailEventIds ?? []).map((t) => `${t.verseNumber}|${t.eventId}`));
	const fresh = abstain.filter((t, i) => !known.has(`${t.verseNumber}|${t.eventId}`) && abstain.findIndex((u) => u.eventId === t.eventId && u.verseNumber === t.verseNumber) === i);
	const dictionMarks = fresh.length === 0 ? score.dictionMarks : { breaks: score.dictionMarks?.breaks ?? [], vacatedTailEventIds: [...(score.dictionMarks?.vacatedTailEventIds ?? []), ...fresh] };
	const bars = mergeRanges([...ids].map((id): BarRange => [bar(id), bar(id)]).filter(([b]) => b > 0));
	return {
		...result,
		score: dictionMarks === score.dictionMarks ? score : { ...score, dictionMarks },
		warnings: [...result.warnings, ...(said.length > 0 ? [{ code: 'underlay-count' as const, message: said.join(' '), bars, eventIds: [...ids] }] : []), ...unchecked],
	};
}

// ── `.mxl` rootfile resolution ───────────────────────────────────

class MxlRootfileError extends Error {}

/**
 * Resolve and read the `.mxl` archive's score member. The container spec
 * names it in `META-INF/container.xml` as the first `<rootfile>`'s
 * `full-path`; the attribute is pulled with a regex because container.xml
 * is a fixed, tiny manifest and dispatch must run where no DOM exists.
 * Archives without a manifest (seen in the wild) fall back to the first
 * `.xml`/`.musicxml` member outside `META-INF/`.
 */
async function readMxlRootfile(bytes: Uint8Array): Promise<Uint8Array> {
	const entries = listZipEntries(bytes);

	const manifest = entries.find((e) => e.name === 'META-INF/container.xml');
	if (manifest) {
		const text = decodeScoreText(await readZipEntry(bytes, manifest.name));
		const match = text.match(/<rootfile[^>]*full-path\s*=\s*(?:"([^"]+)"|'([^']+)')/);
		const path = match?.[1] ?? match?.[2];
		if (path && entries.some((e) => e.name === path)) {
			return readZipEntry(bytes, path);
		}
		// A manifest that points nowhere is treated like no manifest.
	}

	const candidate = entries.find(
		(e) =>
			!e.name.startsWith('META-INF/') &&
			(e.name.toLowerCase().endsWith('.xml') || e.name.toLowerCase().endsWith('.musicxml'))
	);
	if (!candidate) throw new MxlRootfileError('no score member found in .mxl archive');
	return readZipEntry(bytes, candidate.name);
}

// ── Converter error mapping ──────────────────────────────────────

/**
 * Narrow a thrown converter failure to the shared vocabulary. The denigma
 * facade rejects with plain `{ code, message }` objects (they cross a
 * postMessage boundary), so `instanceof` is useless here; the code field
 * is the contract (engine errors.ts).
 */
function asConverterError(e: unknown): IngestError {
	if (typeof e === 'object' && e !== null && 'code' in e) {
		const code = (e as { code: unknown }).code;
		if (code === 'CONVERSION_FAILED' || code === 'WASM_LOAD_FAILED' || code === 'SCORE_TOO_LARGE_FOR_DEVICE') {
			return e as DenigmaError | ResourceError;
		}
	}
	return { code: 'CONVERSION_FAILED', message: e instanceof Error ? e.message : String(e) };
}
