/**
 * build-poem-library.mjs: the poem library's data build (poem library, build 1,
 * step 1; brief `docs/sessions/brief-code-poem-library-build1_r3_2026-11-03.md`).
 *
 * Reads `tools/poems/library.json` and writes `data/dictionary.poems.<hash8>.json`,
 * the file the app fetches in the background and keeps in IndexedDB (step 2).
 * `data/` is served whole, so nothing under `tools/` is served. The file name
 * begins `dictionary.` and ends `.json`, so the service worker leaves it alone
 * (`apps/web/static/sw.js:100`) and the browser never stores it twice.
 *
 * WHAT AN ENTRY CARRIES. `id`, `work`, `title`, `incipit`, `author`,
 * `translator`, `source: { site, url }`, `spelling`, `verified`, `textModern`, and the
 * letter stream the matcher aligns against:
 *
 * A LIBRETTO ENTRY (an aria's text, `kind: 'libretto'`) also carries `opera`, the opera's own metadata, and ships `kind`. An entry of
 * the original kind (a poem) carries neither, and `kind` absent means poem. The opera object is MAPPED from the entry's `provenance`
 * (`OPERA_FIELDS`), not authored in the build, and `librettists` is the entry's `author` string as it stands.
 *
 *   letters   the folded letters of `textModern`, as one string.
 *   at        where each letter stands in `textModern`, DELTA-CODED to save
 *             bytes: `at[0]` is the first letter's offset, and `at[i]` is the
 *             distance from letter i-1 to letter i. `decodeOffsets` restores the
 *             offsets. An offset counts UTF-16 code units, which is what a
 *             JavaScript string index is; every letter that survives the fold is
 *             one Basic Multilingual Plane character, so it is also a code point.
 *
 * THE FOLD IS `tools/poems/reference_sw_match.py`'s, unchanged: lowercase;
 * ѣ→е, і→и, ѳ→ф, ѵ→и, ё→е, й→и; ъ dropped; everything outside а-я dropped.
 * `lib/text/poem-match.ts` (step 3) must fold the query the same way, and a
 * test pins the two against each other.
 *
 * It then adds `poemFiles` and `poemHash` to `data/dictionary-manifest.json`
 * and touches no other key. In particular `hash` stays: it is the dictionary's
 * hash and decides when the dictionary's cache is rebuilt.
 *
 * DETERMINISTIC. The same library gives the same bytes and the same name: no
 * date, no random number. The hash is the first 8 hex digits of the MD5 of the
 * file's text, as the dictionary's own (`scripts/build-dictionary.ts:1192`).
 * A poem file from an earlier build is removed, so `data/` holds exactly one.
 *
 * USAGE (from the repository root)
 *   node scripts/build-poem-library.mjs
 *   node scripts/build-poem-library.mjs --library tools/poems/library.json --out data
 */
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

/** The fold, as `reference_sw_match.py`'s `FOLD`: a letter maps to its folded form, '' drops it. */
const FOLD = new Map([
	['ѣ', 'е'],
	['і', 'и'],
	['ѳ', 'ф'],
	['ѵ', 'и'],
	['ё', 'е'],
	['й', 'и'],
	['ъ', ''],
]);
const KEPT = /^[а-я]$/;

/**
 * The folded letters of a text, and where each stands in it.
 * @param {string} text
 * @returns {{ letters: string, offsets: number[] }}
 */
export function letterStream(text) {
	let letters = '';
	const offsets = [];
	// `for...of` walks code points, so index by code unit by hand.
	let at = 0;
	for (const ch of text) {
		const lower = ch.toLowerCase();
		const folded = FOLD.has(lower) ? FOLD.get(lower) : lower;
		if (folded !== '' && KEPT.test(folded)) {
			letters += folded;
			offsets.push(at);
		}
		at += ch.length;
	}
	return { letters, offsets };
}

/** Offsets to deltas: the first stays, each later one becomes its distance from the one before. */
export function encodeOffsets(offsets) {
	return offsets.map((o, i) => (i === 0 ? o : o - offsets[i - 1]));
}

/** The inverse of `encodeOffsets`. */
export function decodeOffsets(deltas) {
	const out = [];
	let at = 0;
	for (const d of deltas) {
		at += d;
		out.push(at);
	}
	return out;
}

/**
 * THE FAULTS A TEXT MUST NOT CARRY (step 8, part 3). A Wikisource page read into the library once brought a stylesheet, invisible
 * direction marks, a line number, a heading, and a Latin letter inside a Russian word; this check refuses each, so the data
 * stays clean after the desk fixes it. Each is a regular expression over `textModern`, named for the message.
 */
export const TEXT_FAULTS = [
	['a brace (web-page code)', /[{}]/],
	['a MediaWiki class (".mw-")', /\.mw-/],
	['a direction mark (U+200E or U+200F)', /[\u200e\u200f]/],
	['a run of three or more underscores', /_{3,}/],
	['a run of three or more line breaks', /\n{3,}/],
	['a Latin letter', /\p{Script=Latin}/u],
	['a digit glued to a letter', /\d\p{L}|\p{L}\d/u],
];

/** The first fault in a text, or null. A line number is a line of one to three digits and a space or U+00A0 and a letter, with no four-digit year (a dating line such as «8 декабря 1840» has one and passes). */
export function textFault(text) {
	for (const [name, re] of TEXT_FAULTS) if (re.test(text)) return name;
	for (const line of text.split('\n')) {
		if (/^\d{1,3}[ \u00a0]\p{L}/u.test(line) && !/\d{4}/.test(line)) return `a line number (${JSON.stringify(line.slice(0, 20))})`;
	}
	return null;
}

/**
 * THE OPERA OBJECT of a libretto entry, mapped from its `provenance`: [shipped key, provenance key]. `composer` is a `COMPOSERS` key
 * (English "Surname, Given"); `character*` is the role whose lines the text holds; `number` is the number's English name as the
 * provenance records it in `role` ("Yaroslavna's lament"), named for what it holds; `voice` is the voice type; `literarySource` is
 * the work behind the libretto, recorded and never substituted for the libretto itself (a libretto fills POEM; Pushkin does not).
 */
export const OPERA_FIELDS = [
	['composer', 'composer'],
	['operaRu', 'opera_ru'],
	['operaEn', 'opera_en'],
	['characterRu', 'character_ru'],
	['characterEn', 'character_en'],
	['number', 'role'],
	['voice', 'voice'],
	['literarySource', 'literary_source'],
];

/** The opera object for a libretto entry, or a thrown error naming what is missing. */
export function operaOf(e) {
	const p = e.provenance;
	if (!p || typeof p !== 'object') throw new Error(`library entry ${e.id}: a libretto needs "provenance"`);
	const opera = {};
	for (const [key, from] of OPERA_FIELDS) {
		if (typeof p[from] !== 'string' || p[from] === '') throw new Error(`library entry ${e.id}: a libretto needs "provenance.${from}"`);
		opera[key] = p[from];
	}
	opera.librettists = e.author;
	return opera;
}

/** One library entry as the app needs it. Throws on a missing field, so a bad library fails the build, not a singer. */
export function shipEntry(e) {
	for (const k of ['id', 'work', 'title', 'incipit', 'author', 'spelling', 'textModern']) {
		if (typeof e[k] !== 'string' || e[k] === '') throw new Error(`library entry ${e.id ?? '?'}: "${k}" is missing`);
	}
	if (e.translator !== null && typeof e.translator !== 'string') throw new Error(`library entry ${e.id}: "translator" must be a string or null`);
	if (!e.source || typeof e.source.site !== 'string' || e.source.site === '' || typeof e.source.url !== 'string' || e.source.url === '') throw new Error(`library entry ${e.id}: "source.site" and "source.url" are required`);
	if (e.spelling !== 'modern' && e.spelling !== 'pre-reform') throw new Error(`library entry ${e.id}: "spelling" is "${e.spelling}"`);
	// Every entry records its verification state (Dann 2026-11-04 09:40: an unverified Wikisource text fills POEM, and the card's source
	// line, which names the site, is the attribution). The app does not read it in build 1; it ships so a later build can.
	const state = e.verification?.state;
	if (state !== 'verified' && state !== 'unverified') throw new Error(`library entry ${e.id}: "verification.state" must be "verified" or "unverified"`);
	if (e.kind !== undefined && e.kind !== 'poem' && e.kind !== 'libretto') throw new Error(`library entry ${e.id}: "kind" is "${e.kind}"`);
	const libretto = e.kind === 'libretto';
	const fault = textFault(e.textModern);
	if (fault) throw new Error(`library entry ${e.id}: "textModern" holds ${fault}`);
	const { letters, offsets } = letterStream(e.textModern);
	return {
		...(libretto ? { kind: 'libretto', opera: operaOf(e) } : {}),
		id: e.id,
		work: e.work,
		title: e.title,
		incipit: e.incipit,
		author: e.author,
		translator: e.translator,
		source: { site: e.source.site, url: e.source.url },
		spelling: e.spelling,
		verified: state === 'verified',
		textModern: e.textModern,
		letters,
		at: encodeOffsets(offsets),
	};
}

/**
 * The file's text and name for a library.
 * @param {{ entries: object[] }} library
 * @returns {{ text: string, hash: string, name: string }}
 */
export function buildPoemFile(library) {
	if (!library || !Array.isArray(library.entries) || library.entries.length === 0) throw new Error('the library has no entries');
	const ids = new Set();
	for (const e of library.entries) {
		if (ids.has(e.id)) throw new Error(`library entry id ${e.id} appears twice`);
		ids.add(e.id);
	}
	const text = JSON.stringify({ version: 1, entries: library.entries.map(shipEntry) });
	const hash = crypto.createHash('md5').update(text).digest('hex').slice(0, 8);
	return { text, hash, name: `dictionary.poems.${hash}.json` };
}

/** The manifest with the poem keys set and every other key as it was. */
export function withPoemKeys(manifest, name, hash) {
	return { ...manifest, poemFiles: [name], poemHash: hash };
}

function arg(flag, fallback) {
	const i = process.argv.indexOf(flag);
	return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}

function main() {
	const libraryPath = arg('--library', 'tools/poems/library.json');
	const outDir = arg('--out', 'data');
	const library = JSON.parse(fs.readFileSync(libraryPath, 'utf-8'));
	const { text, hash, name } = buildPoemFile(library);

	for (const f of fs.readdirSync(outDir)) {
		if (/^dictionary\.poems\.[0-9a-f]{8}\.json$/.test(f) && f !== name) {
			fs.unlinkSync(path.join(outDir, f));
			console.log(`  Removed: ${f}`);
		}
	}
	fs.writeFileSync(path.join(outDir, name), text, 'utf-8');

	const manifestPath = path.join(outDir, 'dictionary-manifest.json');
	const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
	const next = withPoemKeys(manifest, name, hash);
	fs.writeFileSync(manifestPath, JSON.stringify(next, null, 2) + '\n', 'utf-8');

	const bytes = fs.statSync(path.join(outDir, name)).size;
	console.log(`  Written: ${name} (${bytes.toLocaleString('en-CA')} bytes, ${library.entries.length} entries)`);
	console.log(`  Manifest: poemFiles, poemHash ${hash}; hash ${next.hash} unchanged`);
}

if (import.meta.url === `file://${process.argv[1]}`) main();
