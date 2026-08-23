/**
 * Metadata provenance: which song-metadata fields the app filled from a
 * score header, and what becomes of them when a second score arrives.
 *
 * Extracted from `+page.svelte` on 2026-08-04 (E.24) so that these
 * transitions can be tested. `vitest` never compiles a `.svelte` file, so
 * every rule below had lived, unchecked, inside a 1,630-line component.
 *
 * Three rulings govern this file, in the order they were made.
 *
 * §A.6, fill blanks only (Kimi, 2026-07-13). A score header populates
 * empty fields; anything the singer typed survives. The header itself
 * stays immutable on the parsed score; these fields are the singer's
 * working copy and stay editable.
 *
 * Q1 refinement (Kimi, 2026-07-13). A "from score" tag fades on the
 * field's first hand edit. A field the singer has touched is the
 * singer's, whatever put the first draft there.
 *
 * A new score clears what a previous score filled (Dann, 2026-08-04).
 * E.23 observed Musorgsky's *Sunless* 1 rendering under the title
 * `Gretchen am Spinnrade, Op.2, D.118`, with `Franz Schubert` as its
 * composer, in the drawer and in the printed page header. The harness
 * `.mxl` carries no `<work>`, `<movement-title>`, or `<creator>`, so
 * `readWorkMetadata` returned `undefined`, so `applyScoreHeader` never
 * ran, and no other code path in the app touched the previous score's
 * identity. A printed page named the wrong work, which is the one
 * category this project exists to refuse.
 */

import type { SongMetadata } from './types';
import type { WorkMetadata } from '@ilya/score-parser';
import { formatNameForPaper, COMPOSERS, POETS } from './composers-poets';

/** A song-metadata field name. */
export type MetadataField = keyof SongMetadata;

/**
 * The fields a score header can fill, in the order they are serialized.
 *
 * `transcriber` is absent deliberately: no score header carries one, so
 * it is always the singer's and is never cleared by an arriving score.
 */
export const SCORE_HEADER_FIELDS: readonly MetadataField[] = [
	'title',
	'opus',
	'composer',
	'poet',
	'translator',
];

/** The metadata fields plus the record of which ones the score filled. */
export interface MetadataState {
	metadata: SongMetadata;
	fromScore: ReadonlySet<MetadataField>;
}

function isScoreHeaderField(k: string): k is MetadataField {
	return (SCORE_HEADER_FIELDS as readonly string[]).includes(k);
}

/**
 * Read a parsed score's header into drawer fields. Known composers and
 * poets canonicalize through `formatNameForPaper`, which matches exactly
 * and never guesses. Fields the header does not carry are omitted rather
 * than emitted empty, so a caller can tell "absent" from "blank".
 *
 * N.78: these three calls pass no language, and must not. What they return
 * lands in `doc.metadata` by way of `commitMetadataState` in
 * `+page.svelte:1604`, which is the persisted document. This is a write,
 * not a display, and every write is English. The French form is drawn at
 * the last moment, in `TitlePage.svelte` and in `SearchableSelect.svelte`.
 */
export function scoreHeaderAsFields(
	wm: WorkMetadata,
): Partial<Record<MetadataField, string>> {
	return {
		...(wm.title ? { title: wm.title } : {}),
		...(wm.opus ? { opus: wm.opus } : {}),
		...(wm.composer ? { composer: formatNameForPaper(wm.composer, COMPOSERS) } : {}),
		...(wm.poet ? { poet: formatNameForPaper(wm.poet, POETS) } : {}),
		...(wm.translator ? { translator: formatNameForPaper(wm.translator, POETS) } : {}),
	};
}

/**
 * §A.6: fill blank fields from a score header and tag exactly those.
 *
 * The returned tag set replaces the previous one rather than joining it.
 * A field this header did not fill is not "from score", whatever an
 * earlier score did.
 */
export function applyScoreHeader(
	state: MetadataState,
	wm: WorkMetadata,
): MetadataState {
	const incoming = scoreHeaderAsFields(wm);
	const metadata = { ...state.metadata };
	const fromScore = new Set<MetadataField>();
	for (const [k, v] of Object.entries(incoming) as Array<[MetadataField, string]>) {
		if ((metadata[k] ?? '').trim() === '') {
			metadata[k] = v;
			fromScore.add(k);
		}
	}
	return { metadata, fromScore };
}

/**
 * Kimi's Q2 safety net: restore the header's fields verbatim, over
 * anything currently in them. Fields the header does not carry are left
 * untouched, and only the restored fields carry the tag.
 */
export function revertToScoreHeader(
	state: MetadataState,
	wm: WorkMetadata,
): MetadataState {
	const incoming = scoreHeaderAsFields(wm);
	return {
		metadata: { ...state.metadata, ...incoming },
		fromScore: new Set(Object.keys(incoming) as MetadataField[]),
	};
}

/**
 * Q1 refinement: drop the tag from any tagged field whose value changed
 * by hand. Callers pass the value about to be committed, so this runs
 * before the write.
 */
export function dropTagsForEdits(
	previous: SongMetadata,
	next: SongMetadata,
	fromScore: ReadonlySet<MetadataField>,
): ReadonlySet<MetadataField> {
	if (fromScore.size === 0) return fromScore;
	const kept = new Set(fromScore);
	for (const k of fromScore) {
		if (next[k] !== previous[k]) kept.delete(k);
	}
	return kept.size === fromScore.size ? fromScore : kept;
}

/**
 * A new score has arrived. Clear every field a previous score filled and
 * drop all tags; leave everything the singer typed.
 *
 * This runs on every ingest, including one whose score carries no header
 * at all. That case is the whole reason the function exists: with no
 * header there is nothing to auto-populate, and without this step the
 * previous work's title, composer, and poet stay on the page, still
 * wearing a "from score" badge that now names the wrong file.
 */
export function clearScoreFilled(state: MetadataState): MetadataState {
	if (state.fromScore.size === 0) return { ...state, fromScore: new Set() };
	const metadata = { ...state.metadata };
	for (const k of state.fromScore) metadata[k] = '';
	return { metadata, fromScore: new Set() };
}

/**
 * The full ingest transition: clear what the last score filled, then fill
 * blanks from this score's header if it has one.
 */
export function onScoreIngested(
	state: MetadataState,
	wm: WorkMetadata | undefined,
): MetadataState {
	const cleared = clearScoreFilled(state);
	return wm ? applyScoreHeader(cleared, wm) : cleared;
}

/** Serialize the tag set for localStorage, in a stable order. */
export function serializeFromScore(fromScore: ReadonlySet<MetadataField>): string {
	return JSON.stringify(SCORE_HEADER_FIELDS.filter((k) => fromScore.has(k)));
}

/**
 * Read the tag set back from localStorage.
 *
 * Two guards, both of which matter because the values and the tags are
 * stored under separate keys and can therefore disagree. Unknown keys are
 * discarded, and a tag on a field that is empty in the restored metadata
 * is discarded too: a badge over an empty box claims a provenance for
 * nothing.
 */
export function parseFromScore(
	raw: string | null,
	metadata: SongMetadata,
): ReadonlySet<MetadataField> {
	if (!raw) return new Set();
	let parsed: unknown;
	try {
		parsed = JSON.parse(raw);
	} catch {
		return new Set();
	}
	if (!Array.isArray(parsed)) return new Set();
	const out = new Set<MetadataField>();
	for (const k of parsed) {
		if (typeof k !== 'string') continue;
		if (!isScoreHeaderField(k)) continue;
		if ((metadata[k] ?? '').trim() === '') continue;
		out.add(k);
	}
	return out;
}
