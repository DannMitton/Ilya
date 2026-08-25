/**
 * copy-reader.mjs — put the E.16 page reader where the browser can fetch it.
 *
 * N.59. The reader is a set of Python modules under `tools/e16-harness/reader/`,
 * plus the Leipzig glyph caches generated alongside them. Pyodide cannot import
 * from the repository, so the modules are copied into `static/reader/` and
 * served as ordinary files; the worker fetches them and writes them into the
 * Pyodide filesystem.
 *
 * The copies are GENERATED, never edited, and never committed:
 * `apps/web/static/reader/` is gitignored, because an untracked file blocks the
 * ship script. The source of truth stays the harness directory, so the reader
 * the browser runs and the reader the fixtures run are the same file.
 *
 * IT FAILS LOUDLY, for stamp-sw.mjs's reason. A silent no-op here would ship a
 * build whose reader is missing a module, and the failure would surface as an
 * ImportError inside a worker inside Pyodide, several layers from its cause.
 */
import { copyFileSync, mkdirSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const SOURCE = new URL('../../../tools/e16-harness/reader/', import.meta.url);
const FONTS = new URL('fonts/', SOURCE);
const DEST = new URL('../static/reader/', import.meta.url);

/** The glyph caches. Without them the modules shell out to Node and Verovio,
 *  which no browser can do. N.97 added the third: clef and accidental outlines. */
const CACHES = [
	'rest_templates_leipzig.json',
	'timesig_templates_leipzig.json',
	'clefkey_templates_leipzig.json'
];

/** Not shipped: it is the harness's own test file and imports pytest-shaped helpers. */
const SKIP = new Set(['test_metre.py']);

const fail = (why) => {
	console.error(`copy-reader: ${why}`);
	process.exit(1);
};

let modules;
try {
	modules = readdirSync(SOURCE).filter((n) => n.endsWith('.py') && !SKIP.has(n));
} catch (err) {
	fail(`could not read ${fileURLToPath(SOURCE)}: ${err.message}`);
}
if (modules.length === 0) fail('no reader modules found, so nothing would be served');

for (const name of CACHES) {
	try {
		statSync(new URL(name, FONTS));
	} catch {
		fail(
			`${name} is missing from ${fileURLToPath(FONTS)}. ` +
				'Generate the Leipzig caches first (N.59 step 1); without them the reader ' +
				'tries to shell out to Node and Verovio, which no browser can do.'
		);
	}
}

// Rebuilt from scratch each time, so a module deleted upstream cannot linger
// here and go on being imported.
rmSync(DEST, { recursive: true, force: true });
mkdirSync(new URL('.cache/', DEST), { recursive: true });

for (const name of modules) copyFileSync(new URL(name, SOURCE), new URL(name, DEST));
// The modules resolve their caches through `os.path.expanduser('~/.cache/...')`,
// which inside Pyodide is `/home/pyodide/.cache/`. Keeping that shape here means
// the worker copies a directory rather than knowing each cache's name.
for (const name of CACHES) copyFileSync(new URL(name, FONTS), new URL(`.cache/${name}`, DEST));

// The worker cannot list a served directory, so the manifest is what tells it
// which files to fetch. Generated here rather than hand-kept, so adding a
// reader module can never leave the browser importing a stale set.
writeFileSync(
	fileURLToPath(new URL('manifest.json', DEST)),
	JSON.stringify({ modules: modules.sort(), caches: CACHES }, null, '\t') + '\n'
);

console.log(
	`copy-reader: ${modules.length} modules and ${CACHES.length} glyph caches -> static/reader/`
);
