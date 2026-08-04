/**
 * Tests for metadata provenance (E.24, 2026-08-04).
 *
 * These cover the defect E.23 found on the live app: Musorgsky's
 * *Sunless* 1 rendered under the title `Gretchen am Spinnrade, Op.2,
 * D.118`, by `Franz Schubert`, to a poem by `Johann Wolfgang von Goethe`,
 * in the drawer and in the printed page header.
 *
 * FIXTURE PROVENANCE, and it is read rather than reconstructed.
 *
 * `SCHUBERT_HEADER` carries the exact strings in
 * `Schubert_Gretchen_am_Spinnrade_D118_OpenScore.mscz`, read on
 * 2026-08-04 from `lc7111114.mscx` inside that archive, from the
 * `metaTag` elements named `workTitle`, `composer`, `lyricist`, and
 * `arranger`. Its `workNumber` metaTag is empty, which is why no `opus`
 * appears here: the opus number lives inside the title string, exactly as
 * the file has it. The same three values were observed on the live DOM at
 * E.23 and recorded in `claude/e23-handover_v1_2026-08-03.md` §3.1.
 *
 * The header-less case is not an invention either. The Sunless harness
 * `.mxl` was unzipped on 2026-08-04 and its `score.musicxml` carries no
 * `<work>`, no `<movement-title>`, and no `<creator>`, so
 * `readWorkMetadata` (`musicxml-parser.ts:1006`) returns `undefined` and
 * `ParsedScore.workMetadata` is absent. `undefined` is therefore the
 * faithful input, not a stand-in for one.
 */

import { describe, expect, it } from 'vitest';
import type { WorkMetadata } from '@ilya/score-parser';
import type { SongMetadata } from './types';
import {
	SCORE_HEADER_FIELDS,
	applyScoreHeader,
	clearScoreFilled,
	dropTagsForEdits,
	onScoreIngested,
	parseFromScore,
	revertToScoreHeader,
	scoreHeaderAsFields,
	serializeFromScore,
	type MetadataField,
	type MetadataState,
} from './metadata-provenance';

const EMPTY: SongMetadata = {
	title: '',
	composer: '',
	poet: '',
	translator: '',
	opus: '',
	transcriber: '',
};

/** Read from `lc7111114.mscx` inside the OpenScore `.mscz`, 2026-08-04. */
const SCHUBERT_HEADER: WorkMetadata = {
	title: 'Gretchen am Spinnrade, Op.2, D.118',
	composer: 'Franz Schubert',
	poet: 'Johann Wolfgang von Goethe',
	arranger:
		'Transcribed by bradleykunda from IMSLP #13971. Source: https://imslp.org/wiki/Special:ReverseLookup/13971',
};

/** The state the app was in when E.23 uploaded its second score. */
function afterSchubert(): MetadataState {
	return applyScoreHeader({ metadata: EMPTY, fromScore: new Set() }, SCHUBERT_HEADER);
}

function tags(state: MetadataState): MetadataField[] {
	return SCORE_HEADER_FIELDS.filter((k) => state.fromScore.has(k));
}

describe('scoreHeaderAsFields', () => {
	it('reads the Schubert header into the three fields it carries', () => {
		expect(scoreHeaderAsFields(SCHUBERT_HEADER)).toEqual({
			title: 'Gretchen am Spinnrade, Op.2, D.118',
			composer: 'Franz Schubert',
			poet: 'Johann Wolfgang von Goethe',
		});
	});

	it('omits fields the header does not carry rather than emitting them blank', () => {
		const fields = scoreHeaderAsFields(SCHUBERT_HEADER);
		expect('opus' in fields).toBe(false);
		expect('translator' in fields).toBe(false);
	});

	it('never surfaces the arranger as a drawer field (§A.28)', () => {
		expect(Object.keys(scoreHeaderAsFields(SCHUBERT_HEADER))).not.toContain('arranger');
	});

	it('returns nothing for a header carrying only an arranger', () => {
		expect(scoreHeaderAsFields({ arranger: 'Someone' })).toEqual({});
	});
});

describe('applyScoreHeader, §A.6 fill blanks only', () => {
	it('fills the blank fields and tags exactly those', () => {
		const s = afterSchubert();
		expect(s.metadata.title).toBe('Gretchen am Spinnrade, Op.2, D.118');
		expect(s.metadata.composer).toBe('Franz Schubert');
		expect(s.metadata.poet).toBe('Johann Wolfgang von Goethe');
		expect(tags(s)).toEqual(['title', 'composer', 'poet']);
	});

	it('leaves a typed field alone and does not tag it', () => {
		const typed: SongMetadata = { ...EMPTY, title: 'My own title' };
		const s = applyScoreHeader({ metadata: typed, fromScore: new Set() }, SCHUBERT_HEADER);
		expect(s.metadata.title).toBe('My own title');
		expect(tags(s)).toEqual(['composer', 'poet']);
	});

	it('treats a whitespace-only field as blank', () => {
		const s = applyScoreHeader(
			{ metadata: { ...EMPTY, composer: '   ' }, fromScore: new Set() },
			SCHUBERT_HEADER,
		);
		expect(s.metadata.composer).toBe('Franz Schubert');
	});

	it('does not mutate the state it was given', () => {
		const before: MetadataState = { metadata: { ...EMPTY }, fromScore: new Set() };
		applyScoreHeader(before, SCHUBERT_HEADER);
		expect(before.metadata).toEqual(EMPTY);
		expect(before.fromScore.size).toBe(0);
	});
});

describe('dropTagsForEdits, Kimi Q1', () => {
	it('drops the tag from a field edited by hand', () => {
		const s = afterSchubert();
		const next = { ...s.metadata, composer: 'Schubert, F.' };
		expect([...dropTagsForEdits(s.metadata, next, s.fromScore)]).not.toContain('composer');
	});

	it('leaves the other tags in place', () => {
		const s = afterSchubert();
		const next = { ...s.metadata, composer: 'Schubert, F.' };
		const kept = dropTagsForEdits(s.metadata, next, s.fromScore);
		expect(kept.has('title')).toBe(true);
		expect(kept.has('poet')).toBe(true);
	});

	it('drops the tag when a tagged field is cleared to empty by hand', () => {
		const s = afterSchubert();
		const next = { ...s.metadata, title: '' };
		expect(dropTagsForEdits(s.metadata, next, s.fromScore).has('title')).toBe(false);
	});

	it('changes nothing when an untagged field is edited', () => {
		const s = afterSchubert();
		const next = { ...s.metadata, transcriber: 'D. Mitton' };
		expect(dropTagsForEdits(s.metadata, next, s.fromScore)).toBe(s.fromScore);
	});
});

describe('revertToScoreHeader, Kimi Q2', () => {
	it('restores the header over hand edits and re-tags only its own fields', () => {
		const edited: MetadataState = {
			metadata: { ...EMPTY, title: 'Something else', transcriber: 'D. Mitton' },
			fromScore: new Set(),
		};
		const s = revertToScoreHeader(edited, SCHUBERT_HEADER);
		expect(s.metadata.title).toBe('Gretchen am Spinnrade, Op.2, D.118');
		expect(s.metadata.transcriber).toBe('D. Mitton');
		expect(tags(s)).toEqual(['title', 'composer', 'poet']);
	});
});

describe('THE E.23 DEFECT: a second score arrives over a first', () => {
	it('clears the previous work when the new score carries no header at all', () => {
		const s = onScoreIngested(afterSchubert(), undefined);
		expect(s.metadata.title).toBe('');
		expect(s.metadata.composer).toBe('');
		expect(s.metadata.poet).toBe('');
	});

	it('drops every "from score" badge, so nothing claims a provenance it lacks', () => {
		const s = onScoreIngested(afterSchubert(), undefined);
		expect(s.fromScore.size).toBe(0);
	});

	it('replaces the previous work when the new score carries its own header', () => {
		const second: WorkMetadata = { title: 'Second work', composer: 'Second composer' };
		const s = onScoreIngested(afterSchubert(), second);
		expect(s.metadata.title).toBe('Second work');
		expect(s.metadata.composer).toBe('Second composer');
		expect(s.metadata.poet).toBe('');
		expect(tags(s)).toEqual(['title', 'composer']);
	});

	// NEGATIVE CONTROL. An implementation that simply wiped all metadata on
	// ingest would pass every assertion above and fail both of these. They
	// are the reason the tag set has to be trustworthy rather than merely
	// present.
	it('NEGATIVE CONTROL: a hand-typed field survives the arriving score', () => {
		const start: MetadataState = {
			...afterSchubert(),
			metadata: { ...afterSchubert().metadata, transcriber: 'D. Mitton' },
		};
		const s = onScoreIngested(start, undefined);
		expect(s.metadata.transcriber).toBe('D. Mitton');
	});

	it('NEGATIVE CONTROL: a field the singer corrected by hand survives it too', () => {
		const first = afterSchubert();
		const corrected = { ...first.metadata, composer: 'Schubert, Franz' };
		const start: MetadataState = {
			metadata: corrected,
			fromScore: dropTagsForEdits(first.metadata, corrected, first.fromScore),
		};
		const s = onScoreIngested(start, undefined);
		expect(s.metadata.composer).toBe('Schubert, Franz');
		expect(s.metadata.title).toBe('');
	});

	it('is a no-op on a first upload, when nothing is tagged', () => {
		const s = onScoreIngested({ metadata: EMPTY, fromScore: new Set() }, undefined);
		expect(s.metadata).toEqual(EMPTY);
		expect(s.fromScore.size).toBe(0);
	});

	it('clearScoreFilled leaves untagged values alone', () => {
		const typed: MetadataState = {
			metadata: { ...EMPTY, title: 'Typed by hand' },
			fromScore: new Set(),
		};
		expect(clearScoreFilled(typed).metadata.title).toBe('Typed by hand');
	});
});

describe('persistence across a reload', () => {
	it('round-trips the tag set', () => {
		const s = afterSchubert();
		const raw = serializeFromScore(s.fromScore);
		expect([...parseFromScore(raw, s.metadata)]).toEqual(['title', 'composer', 'poet']);
	});

	it('serializes in a stable order regardless of insertion order', () => {
		const a = new Set<MetadataField>(['poet', 'title', 'composer']);
		const b = new Set<MetadataField>(['title', 'composer', 'poet']);
		expect(serializeFromScore(a)).toBe(serializeFromScore(b));
	});

	it('discards a tag whose field came back empty, so no badge sits over a blank', () => {
		const s = afterSchubert();
		const raw = serializeFromScore(s.fromScore);
		const restored = { ...s.metadata, poet: '' };
		expect(parseFromScore(raw, restored).has('poet')).toBe(false);
	});

	it('discards keys that are not score-header fields', () => {
		expect(
			parseFromScore('["title","transcriber","nonsense",7]', {
				...EMPTY,
				title: 'T',
				transcriber: 'D',
			}),
		).toEqual(new Set(['title']));
	});

	it('returns an empty set for absent, malformed, or non-array storage', () => {
		expect(parseFromScore(null, EMPTY).size).toBe(0);
		expect(parseFromScore('{not json', EMPTY).size).toBe(0);
		expect(parseFromScore('{"title":true}', EMPTY).size).toBe(0);
	});
});
