/**
 * Nothing about the singer or the song leaves the device (poem library, build 1, "Done").
 *
 * The match runs on the device, against a library the device fetched once. The only network request the feature
 * makes is a GET of one static file, `/data/<poemFiles[0]>`, by `loadPoemLibrary`, through the `fetchFile` the loader
 * lends it (`loader.ts`, `schedulePoemTier`). This reads the feature's sources and fails if any of them reaches for the
 * network itself, or if the one request carries anything but the file's name. The browser walk
 * (`e2e/poem-library.test.ts`) logs every request of a real paste, keep, and decline and checks the same.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const LIB = join(__dirname, '..');
const read = (path: string): string => readFileSync(join(LIB, path), 'utf8');

/** What a source may not do with the network: call it by any of its names. */
const NETWORK = /\b(fetch|XMLHttpRequest|sendBeacon|WebSocket|EventSource|navigator\.share)\b\s*\(|new\s+(XMLHttpRequest|WebSocket|EventSource)\b|\bimportScripts\b/;

describe('the poem library feature makes no network request of its own', () => {
	const FILES = [
		'text/poem-match.ts',
		'text/poem-source.ts',
		'text/poem-offer.svelte.ts',
		'text/input-line.ts',
		'components/Drawer/PoemLibraryCard.svelte',
	];
	for (const file of FILES) {
		it(`${file} does not call the network`, () => {
			const code = read(file)
				.replace(/\/\*[\s\S]*?\*\//g, '')
				.replace(/^\s*\/\/.*$/gm, '');
			expect(code).not.toMatch(NETWORK);
		});
	}

	it('poem-library.ts reaches the network only through the `fetchFile` it is lent, for the named file', () => {
		const code = read('text/poem-library.ts')
			.replace(/\/\*[\s\S]*?\*\//g, '')
			.replace(/^\s*\/\/.*$/gm, '');
		expect(code).not.toMatch(NETWORK);
		const calls = [...code.matchAll(/io\.fetchFile\(([^)]*)\)/g)].map((m) => m[1]);
		expect(calls).toEqual(['`/data/${file}`']); // a path from the manifest, and nothing of the song's
	});

	it('the loader lends it a plain GET: the URL it is given and nothing else', () => {
		const code = read('loader.ts');
		expect(code).toContain('fetchFile: (url) => fetch(url)');
		expect(code.match(/fetchFile:/g)).toHaveLength(1);
	});

	it('the matcher and the offer take the Lyrics as an argument and never write them anywhere but the song', () => {
		const offer = read('text/poem-offer.svelte.ts');
		expect(offer).not.toMatch(/localStorage|sessionStorage|indexedDB|document\.cookie|console\./);
		const match = read('text/poem-match.ts');
		expect(match).not.toMatch(/localStorage|sessionStorage|indexedDB|document\.cookie|console\./);
	});
});
