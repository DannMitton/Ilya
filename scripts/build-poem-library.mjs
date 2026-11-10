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
 * THE FURNITURE A LIBRETTO'S TEXT MUST NOT CARRY (row 182, step 3). An aria's lines come from a page that also holds speaker labels,
 * stage directions, page numbers, and number headings; the data is cleaned of them, and each check below refuses one shape, so none
 * can return. Each is a test over ONE LINE of `textModern`. They apply to `kind: 'libretto'` only: a poem may carry an author's own
 * parentheses («(как знать?)» is a poet's line), and a rule against a parenthetical run over every entry would refuse a future poem.
 * Any Latin letter is refused for every entry (`TEXT_FAULTS`).
 */
const CAPS_ROLE = /^\s*[А-ЯЁ][А-ЯЁ\- ]*[.)]?\s*$/u;
const CAPITALIZED_WORD = /^\s*([А-ЯЁ][а-яё\-]+)[.)]?\s*$/u;
export const LIBRETTO_FURNITURE = [
	['a line that is only a role name in capitals', (line) => CAPS_ROLE.test(line)],
	['a line wholly in parentheses', (line) => /^\s*\([^()]*\)\s*[.!?…]*\s*$/u.test(line)],
	['a parenthetical run inside a line', (line) => /\([^()]*\)/u.test(line)],
	['bracketed text', (line) => /\[[^\]]*\]/u.test(line)],
	['a page number («- 38 -»)', (line) => /^\s*[-–—]\s*\d+\s*[-–—]\s*$/u.test(line)],
	['a number heading («[N. 13 - ...]», «№ 7», «Сцена V»)', (line) => /^\s*(?:\[\s*)?(?:№|N\.?|No\.?)\s*\d+/u.test(line) || /^\s*Сцена\s+(?:[IVXLC]+|\d+)\s*$/iu.test(line)],
	['a stage-direction opener', (line) => /^\s*(?:Входит|Входят|Появляется|Появляются|Выходит|Выходят|Выбегает|Вбегает)(?!\p{L})[^,;]*\.\s*$/u.test(line)],
];

/** The roles each opera's numbers name, by the opera's Russian title: a line that is only one of them is a speaker label. */
export const OPERA_ROLES = {
	'Князь Игорь': ['Ярославна', 'Кончаковна', 'Владимир', 'Игорь', 'Галицкий', 'Кончак', 'Скула', 'Ерошка', 'Овлур', 'Девушки', 'Народ', 'Хор'],
	'Золотой петушок': ['Шемаханская', 'Додон', 'Звездочёт', 'Амелфа', 'Полкан', 'Афрон'],
	'Сказка о царе Салтане': ['Гвидон', 'Салтан', 'Лебедь', 'Лебедь-птица', 'Бабариха', 'Ткачиха', 'Повариха'],
	'Евгений Онегин': ['Татьяна', 'Ольга', 'Ленский', 'Онегин', 'Гремин', 'Ларина', 'Филипьевна', 'Трике', 'Зарецкий', 'Хор'],
	'Чародейка': ['Кума', 'Князь', 'Княгиня', 'Мамыров', 'Настасья', 'Кичига', 'Юрий', 'Хор'],
	'Сон на Волге': ['Старуха', 'Воевода', 'Нечай', 'Дубровин', 'Олёна', 'Шалыгин'],
	'Алеко': ['Алеко', 'Земфира', 'Цыган', 'Старик'],
	'Снегурочка': ['Снегурочка', 'Лель', 'Царь', 'Берендей', 'Весна', 'Мороз', 'Купава', 'Мизгирь', 'Бобыль', 'Бобылиха', 'Леший', 'Хор'],
	'Борис Годунов': ['Борис', 'Пимен', 'Шуйский', 'Щелкалов', 'Варлаам', 'Мисаил', 'Марина', 'Рангони', 'Самозванец', 'Григорий', 'Феодор', 'Ксения', 'Юродивый', 'Хор'],
	'Жизнь за Царя': ['Антонида', 'Сусанин', 'Собинин', 'Ваня', 'Хор'],
	'Руслан и Людмила': ['Руслан', 'Людмила', 'Горислава', 'Ратмир', 'Баян', 'Финн', 'Фарлаф', 'Наина', 'Светозар', 'Черномор', 'Хор'],
	'Франческа да Римини': ['Франческа', 'Паоло', 'Ланчотто', 'Дант', 'Вергилий'],
	'Ночь перед Рождеством': ['Оксана', 'Вакула', 'Солоха', 'Чуб'],
	'Садко': ['Садко', 'Любава', 'Волхова', 'Нежата', 'Веденецкий', 'Индейский', 'Варяжский', 'Гость', 'Хор'],
	'Царская невеста': ['Марфа', 'Любаша', 'Лыков', 'Грязной', 'Собакин', 'Бомелий', 'Малюта', 'Дуняша', 'Домна', 'Хор'],
	'Иоланта': ['Иоланта', 'Водемон', 'Роберт', 'Король', 'Рене', 'Эбн-Хакиа', 'Марта', 'Бертран', 'Альмерик', 'Бригитта', 'Лаура', 'Хор'],
	'Опричник': ['Наталья', 'Андрей', 'Басманов', 'Морозов', 'Жемчужный', 'Вяземский', 'Хор'],
	'Пиковая дама': ['Герман', 'Лиза', 'Полина', 'Елецкий', 'Томский', 'Сурин', 'Чекалинский', 'Графиня', 'Хор'],
	'Русалка': ['Княгиня', 'Князь', 'Мельник', 'Наташа', 'Русалка', 'Водяной', 'Ольга'],
	'Каменный гость': ['Лаура', 'Дон-Гуан', 'Лепорелло', 'Монах'],
	'Хованщина': ['Марфа', 'Шакловитый', 'Досифей', 'Голицин', 'Хованский', 'Андрей', 'Сусанна', 'Подьячий', 'Эмма', 'Хор'],
	'Орестея': ['Клитемнестра', 'Агамемнон', 'Орест', 'Электра', 'Эгист', 'Кассандра', 'Хор'],
	'Орлеанская дева': ['Иоанна', 'Дюнуа', 'Карл', 'Лионель', 'Тибо', 'Раймонд', 'Хор'],
	'Дубровский': ['Дубровский', 'Дворовые', 'Троекуров', 'Маша', 'Верейский', 'Архип', 'Хор'],
	'Майская ночь': ['Левко', 'Ганна', 'Голова', 'Винокур', 'Писарь', 'Каленик', 'Хор'],
	'Мазепа': ['Мазепа', 'Андрей', 'Мария', 'Кочубей', 'Любовь', 'Орлик', 'Искра', 'Хор'],
	'Черевички': ['Вакула', 'Оксана', 'Солоха', 'Чуб', 'Голова'],
	'Аскольдова могила': ['Неизвестный', 'Рыбаки', 'Торопка', 'Аскольд', 'Вышата', 'Надежда', 'Стемида', 'Хор'],
	'Демон': ['Демон', 'Тамара', 'Ангел', 'Синодал', 'Гудал'],
};

/**
 * The first furniture fault in a libretto's text, as "line N is <shape>", or null. A line that is a capitalized single word naming a
 * role of the entry's opera (from `OPERA_ROLES`) is a speaker label too.
 */
export function librettoFault(text, operaRu) {
	const roles = (OPERA_ROLES[operaRu] || []).map((r) => r.toLowerCase());
	const lines = text.split('\n');
	for (let n = 0; n < lines.length; n += 1) {
		for (const [name, test] of LIBRETTO_FURNITURE) if (test(lines[n])) return `line ${n + 1} is ${name}: ${JSON.stringify(lines[n].slice(0, 40))}`;
		const word = CAPITALIZED_WORD.exec(lines[n]);
		if (word && roles.includes(word[1].toLowerCase())) return `line ${n + 1} is only a role name: ${JSON.stringify(lines[n].slice(0, 40))}`;
	}
	return null;
}

/**
 * THE PROVENANCE A LIBRETTO MAY CARRY (step 3). The repository is public, so no field may name a working pass: a key outside this
 * list is refused, and so is a parenthetical in the three fields that are meant to be bare names. The two site names a libretto's
 * text may come from are listed with the site strings in `poem-site.ts`. The rights trail (`contributorDates`, `url_people`,
 * `pageNamesTextContributors`, `rightsTrail`, `rightsResolution`) stays: it is the record rule 5 asks for.
 */
export const PROVENANCE_KEYS = [
	'composer', 'opera_ru', 'opera_en', 'character_ru', 'character_en', 'formerTitle', 'role', 'voice', 'literary_source', 'text_kind', 'notes',
	'actScene', 'url_opera_en', 'url_opera_ru', 'url_people', 'pageNamesTextContributors', 'contributorDates', 'rightsTrail', 'rightsResolution',
];
export const LIBRETTO_SITES = ['Russian Wikisource', 'operalib.eu', 'FEB'];

/** The first fault in a libretto's provenance and source, or null. */
export function provenanceFault(e) {
	for (const k of Object.keys(e.provenance ?? {})) if (!PROVENANCE_KEYS.includes(k)) return `"provenance.${k}" is not a field a libretto carries`;
	for (const k of ['composer', 'text_kind', 'literary_source']) if (/[()]/.test(e.provenance?.[k] ?? '')) return `"provenance.${k}" carries a parenthetical`;
	if (!LIBRETTO_SITES.includes(e.source?.site)) return `"source.site" is "${e.source?.site}"`;
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

/**
 * THE IDS OF A LIBRETTO ENTRY (row 182, step 2). `work` is the opera's: the first 8 hex digits of the MD5 of the opera's Russian
 * title, NFC-normalised (`workOfOpera`; the build refuses an entry whose `work` is not that, so a mistyped one cannot ship). `id` is
 * the first 10 hex digits of the MD5 of the opera title, "/", and the first sung line. An id is a stored identity (a song's
 * `poemSource` names it), so it is never recomputed: the build checks that it is ten lowercase hex digits and, in `buildPoemFile`,
 * that no two entries share one. The formula reproduces from the cleaned text's first line for 87 of the 89 arias; the other two
 * (Кума's arioso, Гвидон's arioso) were hashed from a first line this repository does not hold, and stand as they are.
 *
 * `work` PER OPERA IS DELIBERATE. `rankWorks` scores a work by its best entry and the margin compares the top two works, so two
 * arias of one opera never compete against each other and a Lyrics of one aria is not refused for resembling its neighbour. The
 * cost: "Not this poem" declines by (songId, work) (`poem-offer.svelte.ts:111`), so declining one aria declines that opera for
 * that song.
 */
export const workOfOpera = (operaRu) => crypto.createHash('md5').update(operaRu.normalize('NFC')).digest('hex').slice(0, 8);

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
	if (e.work !== workOfOpera(opera.operaRu)) throw new Error(`library entry ${e.id}: "work" ${e.work} is not the opera's (${workOfOpera(opera.operaRu)} for "${opera.operaRu}")`);
	if (!/^[0-9a-f]{10}$/.test(e.id)) throw new Error(`library entry ${e.id}: a libretto "id" is ten lowercase hex digits`);
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
	if (libretto) {
		const furniture = librettoFault(e.textModern, e.provenance?.opera_ru);
		if (furniture) throw new Error(`library entry ${e.id}: "textModern" holds furniture: ${furniture}`);
		const bad = provenanceFault(e);
		if (bad) throw new Error(`library entry ${e.id}: ${bad}`);
	}
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
