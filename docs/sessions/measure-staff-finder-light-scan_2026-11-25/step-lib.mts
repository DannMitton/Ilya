// Steps 1 and 2: what the measuring scripts share. Importing this lets node load the tree's own TypeScript modules
// (extensionless imports), gives the swept page list, and loads a page with homr's boxes and the voice boxes by the
// tree's `voiceBoxes`.
import { registerHooks } from 'node:module';
import fs from 'node:fs';

registerHooks({
	resolve(specifier, context, nextResolve) {
		if (/^\.\.?\//.test(specifier) && !/\.(ts|mts|js|mjs|json)$/.test(specifier)) return nextResolve(specifier + '.ts', context);
		return nextResolve(specifier, context);
	},
});

export const TREE = '/Users/dannmitton/Desktop/ilya-rewrite/apps/web/src/lib/omr';

/** Pages the brief names, then the held-out pages that take no part in choosing the pair. */
export const NAMED = ['nightingale-p4', 'song1-p1', 'withoutsun-p5'];
export const HELD = ['nightingale-p2', 'nightingale-p3', 'nightingale-p5', 'nightingale-p6', 'song2-p1', 'song3-p1', 'song4-p1', 'withoutsun-p4', 'withoutsun-p6'];
/** Held out and not in the desk's first sweep: the last page of each song, and Without Sun's last page. */
export const LAST = ['song1-p2', 'song2-p4', 'song3-p6', 'song4-p5', 'withoutsun-p23'];
/**
 * Sparse pages made from a swept page, everything outside the kept boxes painted with the page's paper tone:
 * song1 page 1 under its first system (rows below box 1 painted), and Nightingale page 4 cut to its first staff.
 */
export const CUTS: Record<string, { from: string; keep: number[]; above: boolean }> = {
	'song1-p1-first-system': { from: 'song1-p1', keep: [0, 1], above: false },
	'nightingale-p4-one-staff': { from: 'nightingale-p4', keep: [0], above: true },
};
export const PAGES = [...NAMED, ...HELD, ...LAST, ...Object.keys(CUTS)];

export interface Page {
	name: string;
	g: { width: number; height: number; data: Uint8Array };
	boxes: { cx: number; cy: number; w: number; h: number; index: number }[];
	/** Indices into `boxes`. */
	voice: number[];
	musicXml: string;
}

export async function loadPage(W: string, name: string): Promise<Page> {
	const cut = CUTS[name];
	const from = cut?.from ?? name;
	const { voiceBoxes } = await import(TREE + '/metre-model.ts');
	const { w, h } = JSON.parse(fs.readFileSync(`${W}/${from}.dim.json`, 'utf8'));
	let data = new Uint8Array(fs.readFileSync(`${W}/${from}.gray`));
	const homr = JSON.parse(fs.readFileSync(`${W}/${from}.homr.json`, 'utf8'));
	const fullPath = [`${W}/step0e-${from}.homrfull.json`, `${W}/step0c-p4.homrfull.json`].find((p, i) => (i === 0 || from === 'nightingale-p4') && fs.existsSync(p));
	if (!fullPath) throw new Error('no MusicXML for ' + from);
	const full = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
	const boxes = homr.staves ?? [];
	if (JSON.stringify(full.staves ?? []) !== JSON.stringify(boxes)) throw new Error('boxes differ for ' + from);
	let voice: number[] = voiceBoxes(full.musicXml ?? '', boxes, h);
	if (!cut) return { name, g: { width: w, height: h, data }, boxes, voice, musicXml: full.musicXml ?? '' };
	const { paperTone } = await import(TREE + '/underlay-frame.ts');
	const paper = paperTone(data);
	const kept = cut.keep.map((i) => boxes[i]);
	// the rows `staffIn` searches for the kept boxes: each box and a quarter of its height either side
	const top = cut.above ? Math.max(0, Math.floor(Math.min(...kept.map((b: any) => b.cy - (0.75 * b.h))) * h)) : 0;
	const bottom = Math.min(h, Math.ceil(Math.max(...kept.map((b: any) => b.cy + 0.75 * b.h)) * h));
	data = data.slice();
	data.fill(paper, 0, top * w);
	data.fill(paper, bottom * w);
	voice = cut.keep.flatMap((i, k) => (voice.includes(i) ? [k] : []));
	return { name, g: { width: w, height: h, data }, boxes: kept, voice, musicXml: full.musicXml ?? '' };
}
