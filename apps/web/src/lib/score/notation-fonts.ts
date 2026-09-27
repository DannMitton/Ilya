/**
 * Shared SMuFL notation-font loader.
 *
 * Finale Maestro is the product default for ALL renderings, interim and
 * final alike (Dann's rulings, 2026-07-12 and 2026-07-13); Bravura and
 * Leland remain as customization options. Extracted from the
 * fit-font-lab dev route at font wiring so the lab and the live Fit
 * pane load fonts through one path.
 *
 * Kimi guardrail 1 (2026-07-12): every non-Bravura font is prepared
 * with Bravura as the metrics fallback, so a glyph gap in a candidate
 * font degrades to Bravura's published metrics instead of breaking the
 * layout arithmetic.
 *
 * Browser-only: FontFace, document.fonts, and fetch of same-origin
 * static assets. Callers guard with onMount (or `browser`). Loads are
 * memoized as promises, so repeated callers share one network trip and
 * one FontFace registration.
 */

import { prepareSmuflFont, type PreparedSmuflFont } from '@ilya/score-parser';

export type NotationFontId = 'bravura' | 'leland' | 'finale-maestro';

export interface NotationFontSpec {
	id: NotationFontId;
	label: string;
	/** Static font-file path under /fonts (SIL OFL; licences ship with the files). */
	file: string;
	/** The font's SMuFL metadata JSON path. */
	meta: string;
	/** CSS font-family registered on the FontFace. */
	family: string;
}

export const NOTATION_FONTS: readonly NotationFontSpec[] = [
	{ id: 'bravura', label: 'Bravura', file: '/fonts/bravura/Bravura.woff2', meta: '/fonts/bravura/bravura_metadata.json', family: 'Bravura' },
	{ id: 'leland', label: 'Leland', file: '/fonts/leland/Leland.otf', meta: '/fonts/leland/leland_metadata.json', family: 'Leland' },
	{ id: 'finale-maestro', label: 'Finale Maestro', file: '/fonts/finale-maestro/FinaleMaestro.otf', meta: '/fonts/finale-maestro/FinaleMaestro.json', family: 'Finale Maestro' },
];

export const DEFAULT_NOTATION_FONT_ID: NotationFontId = 'finale-maestro';

export interface LoadedNotationFont {
	prepared: PreparedSmuflFont;
	/** CSS font-family to pass alongside `prepared` as `fontFamily`. */
	family: string;
}

const cache = new Map<NotationFontId, Promise<LoadedNotationFont>>();

async function loadRaw(spec: NotationFontSpec, fallback?: PreparedSmuflFont): Promise<LoadedNotationFont> {
	const face = new FontFace(spec.family, `url(${spec.file})`);
	await face.load();
	document.fonts.add(face);
	const meta = await (await fetch(spec.meta)).json();
	return { prepared: prepareSmuflFont(meta, fallback), family: spec.family };
}

/**
 * Load and prepare a notation font (the product default when no id is
 * given). Bravura is always loaded first so it can stand as the
 * metrics fallback for the others.
 */
export function loadNotationFont(id: NotationFontId = DEFAULT_NOTATION_FONT_ID): Promise<LoadedNotationFont> {
	const hit = cache.get(id);
	if (hit) return hit;
	const spec = NOTATION_FONTS.find((f) => f.id === id);
	if (!spec) return Promise.reject(new Error(`Unknown notation font: ${id}`));
	const p =
		id === 'bravura'
			? loadRaw(spec)
			: loadNotationFont('bravura').then((b) => loadRaw(spec, b.prepared));
	cache.set(id, p);
	// A failed load must not poison the memo for retries on later drops.
	p.catch(() => cache.delete(id));
	return p;
}
