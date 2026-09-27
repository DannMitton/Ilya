#!/usr/bin/env node
/**
 * The architecture ratchets. Run from the repository root:
 *
 *   node scripts/ratchets.mjs
 *
 * Exits non-zero, naming each breach, when any of these is true:
 *
 * 1. FILE SIZE. A source file listed in scripts/ratchets.json has grown past
 *    its ceiling, or an unlisted source file is longer than newFileMaxLines.
 *    New work goes into a new module rather than into an already large file.
 * 2. LAYERING. Code under packages/<name>/src imports from the application
 *    (apps/, or SvelteKit's $lib alias). Dependencies run one way: the app
 *    uses the packages, and the packages know nothing about the app.
 * 3. PACKAGE SURFACE. Application source reaches into a package's files by
 *    a relative path (../packages/...) instead of through its @ilya/ name.
 *    Tests are exempt, because they may load a package's fixtures directly.
 * 4. MODULES. A file under apps/web/src/lib/<m>/, for <m> one of the six
 *    modules in MODULES below, imports a module <m> may not import. Tests
 *    are NOT exempt here: they obey the same table. Added by N.174 D.2.0,
 *    2026-09-27, per the module map (n174-B, section 8).
 *
 * A ceiling whose file no longer exists is a breach too, so a moved file
 * cannot lose its ceiling silently: move the key with the file.
 *
 * Added on the audit branch, 2026-09-26. The idea of a ratchet in CI comes
 * from Fable's ruling of 2026-08-03 (claude/fable-ruling-e22-three-audit-
 * assessment_2026-08-03.md, 7.2), which asked for one on the colour fallbacks.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, posix, relative, sep } from 'node:path';

const root = process.cwd();
const config = JSON.parse(readFileSync(join(root, 'scripts/ratchets.json'), 'utf8'));
const SOURCE_ROOTS = ['apps/web/src', ...readdirSync(join(root, 'packages')).map((p) => `packages/${p}/src`)];
const IS_SOURCE = /\.(ts|svelte)$/;
const IS_TEST = /\.(test|spec)\.ts$|\.d\.ts$/;

function walk(dir, out = []) {
	let entries;
	try {
		entries = readdirSync(join(root, dir));
	} catch {
		return out;
	}
	for (const name of entries) {
		if (name === 'node_modules') continue;
		const rel = `${dir}/${name}`;
		if (statSync(join(root, rel)).isDirectory()) walk(rel, out);
		else if (IS_SOURCE.test(name)) out.push(rel.split(sep).join('/'));
	}
	return out;
}

const files = SOURCE_ROOTS.flatMap((d) => walk(d));
const breaches = [];
const canLower = [];

// 1. File size.
for (const file of files) {
	if (IS_TEST.test(file) || file in config.exempt) continue;
	const text = readFileSync(join(root, file), 'utf8');
	const lines = text.split('\n').length - (text.endsWith('\n') ? 1 : 0);
	const ceiling = config.ceilings[file];
	if (ceiling !== undefined) {
		if (lines > ceiling) breaches.push(`SIZE  ${file} is ${lines} lines, over its ceiling of ${ceiling}. Move the new work into a new module, or raise the ceiling on purpose in scripts/ratchets.json.`);
		else if (lines < ceiling) canLower.push(`${file}: ${ceiling} -> ${lines}`);
	} else if (lines > config.newFileMaxLines) {
		breaches.push(`SIZE  ${file} is ${lines} lines, over the ${config.newFileMaxLines}-line limit for a file without a ceiling.`);
	}
}
for (const file of Object.keys(config.ceilings)) {
	if (!files.includes(file)) breaches.push(`SIZE  ${file} has a ceiling in scripts/ratchets.json but no longer exists. Move the key with the file.`);
}

// 4. Modules: what each module under apps/web/src/lib/ may import.
const LIB = 'apps/web/src/lib/';
const MODULES = {
	reader: [],
	score: ['reader'],
	voice: ['reader', 'score'],
	analysis: ['reader', 'score', 'voice'],
	markup: ['reader', 'score', 'voice', 'analysis'],
	insights: ['reader', 'score', 'voice', 'analysis'],
};
/** The module a repository path sits in, or null outside the six. */
function moduleOfPath(path) {
	if (!path.startsWith(LIB)) return null;
	const name = path.slice(LIB.length).split('/')[0];
	return name in MODULES ? name : null;
}
/** The module an import specifier in `file` resolves to, or null. */
function moduleOfSpec(file, spec) {
	if (spec.startsWith('$lib/')) return moduleOfPath(LIB + spec.slice('$lib/'.length));
	if (spec.startsWith('.')) return moduleOfPath(posix.normalize(posix.join(posix.dirname(file), spec)));
	return null;
}
// Slice D.2.6 switches this on, once lib/shane/ is empty: any file left there is a breach.
const SHANE_FOLDER_IS_GONE = false;

// 2, 3 and 4. Imports.
const IMPORT = /(?:import|export)\s[^'"]*?from\s*['"]([^'"]+)['"]|import\(\s*['"]([^'"]+)['"]\s*\)|new\s+URL\(\s*['"]([^'"]+)['"]\s*,\s*import\.meta\.url\s*\)/g;
for (const file of files) {
	if (SHANE_FOLDER_IS_GONE && file.startsWith(`${LIB}shane/`)) {
		breaches.push(`MODULE ${file} is under lib/shane/, which no longer exists.`);
	}
	const isTest = IS_TEST.test(file);
	const own = moduleOfPath(file);
	const text = readFileSync(join(root, file), 'utf8');
	for (const m of text.matchAll(IMPORT)) {
		const spec = m[1] ?? m[2] ?? m[3];
		if (own) {
			const target = moduleOfSpec(file, spec);
			if (target && target !== own && !MODULES[own].includes(target)) {
				breaches.push(`MODULE ${file} imports "${spec}". ${own}/ may not import ${target}/.`);
			}
		}
		// Checks 2 and 3 skip tests, which may load a package's fixtures directly.
		if (isTest) continue;
		if (file.startsWith('packages/')) {
			if (spec.startsWith('$lib') || spec.startsWith('$app') || /(^|\/)apps\//.test(spec)) {
				breaches.push(`LAYER ${file} imports "${spec}". A package must not depend on the application.`);
			}
		} else if (/(^|\/)packages\//.test(spec) && spec.startsWith('.')) {
			breaches.push(`SURFACE ${file} imports "${spec}" by path. Import it through its @ilya/ package name.`);
		}
	}
}

console.log(`ratchets: ${files.length} source files checked.`);
if (canLower.length) {
	console.log(`ratchets: these ceilings can be lowered in scripts/ratchets.json:\n  ${canLower.join('\n  ')}`);
}
if (breaches.length) {
	console.error(`ratchets: ${breaches.length} breach(es):\n  ${breaches.join('\n  ')}`);
	process.exit(1);
}
console.log('ratchets: OK.');
