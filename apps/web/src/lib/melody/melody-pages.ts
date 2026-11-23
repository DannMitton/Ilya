/**
 * MELODY's pagination (strophic lane A, brief r5, D5 and the extraction under
 * "Ratchets").
 *
 * `MarkupPane.svelte` hands this module the notated score, verse 1's analysis,
 * and verse 1's five channels, and gets pages back. For a song with one verse, or
 * where no later pass is kept, it is `paginateScore` on the notated score with
 * the same options, and the output is byte-identical to the call it replaced
 * (D8, `strophic-byte-baseline.test.ts`). For a strophic song it paginates the
 * render score (`renderScoreOf`, `@ilya/score-parser`) in place of the notated
 * one, with each later verse built the way verse 1 is: its own view
 * (`verseView`), its own underlay resolvers, its own analysis, keyed by derived
 * ids. No pairings, no blanks, no transcribed lines: those belong to verse 1
 * (lane B).
 *
 * Agrees with: `MarkupPane.svelte` (verse 1's live channels), `render-score.ts`
 * (the derived id form `<id>~v<k>`), and `render-seam.ts` (what the page does to
 * a later pass's markup).
 */
import {
	analyzeScore,
	derivedId,
	paginateScore,
	renderScoreOf,
	scoreInPerformanceOrder,
	systemSeam,
	verseView,
	type AnalyzedScore,
	type PaginatedScore,
	type ParsedScore,
	type RenderScore,
	type StaffRenderOptions,
	type VoiceProfileSnapshot,
} from '@ilya/score-parser';
import { applyNotationPreferences, type NotationPreferences } from '@ilya/phonology';
import { buildUnderlayResolvers } from '$lib/score/vowel-resolver';
import { resolveAdvice } from '$lib/analysis/advice-resolver';
import type { EngravingValues } from '$lib/score/engraving';
import { t, type Language } from '$lib/i18n';

/** Verse 1's five channels to the renderer, as `MarkupPane.svelte` derives them. */
export interface MelodyChannels {
	ipaPreview?: Record<string, string>;
	withheldIpa?: ReadonlySet<string>;
	cyrPreview?: Record<string, string>;
	sylTypePreview?: Record<string, 'whole' | 'start' | 'middle' | 'end'>;
	melismaPreview?: ReadonlySet<string>;
}

/** What a later verse is built from. */
export interface VerseBuild {
	profile: VoiceProfileSnapshot;
	notationPrefs: NotationPreferences;
	openSyllabification: boolean;
}

export interface MelodyPagesInput {
	/** The notated score the page reads (octave and key applied). */
	score: ParsedScore;
	/** Verse 1's analysis. */
	analyzed: AnalyzedScore;
	clef?: StaffRenderOptions['clef'] | null;
	pageWidth: number;
	pageHeight: number;
	laterPageHeight: number;
	engraving: EngravingValues;
	channels: MelodyChannels;
	font?: { prepared: StaffRenderOptions['font']; family: string };
	/** Present when the page can build later verses; absent, a later pass would carry no vowel. */
	verses?: VerseBuild;
	/** The language of the verse label and tag (ratified strings, `markup.verseLabel` and `markup.verseTag`). */
	language?: Language;
}

export interface MelodyPages extends PaginatedScore {
	/** The render score that was paginated, or the notated score's identity report when none was kept. */
	render: RenderScore;
	/** The analysis the pages were drawn from: verse 1's, plus each later verse's under derived ids. The legend reads every verse. */
	analyzed: AnalyzedScore;
	/** The withheld set the pages were drawn from, later verses included; undefined when nothing is withheld. */
	withheld: ReadonlySet<string> | undefined;
}

/** One later verse's analysis and five channels, keyed by derived ids (D5). */
function laterVerse(score: ParsedScore, lyricNumber: number, place: number, build: VerseBuild) {
	const view = verseView(score, lyricNumber);
	const resolvers = buildUnderlayResolvers(view, 1, { openSyllabification: build.openSyllabification });
	const analysisScore = scoreInPerformanceOrder(view).score;
	const analysed = resolveAdvice(analyzeScore(analysisScore, build.profile, resolvers.vowel));
	const events: AnalyzedScore['events'] = {};
	for (const [id, ev] of Object.entries(analysed.events)) events[derivedId(id, place)] = { ...ev, eventId: derivedId(id, place) };
	const ipa: Record<string, string> = {};
	const cyr: Record<string, string> = {};
	const withheld = new Set<string>();
	for (const ev of view.vocalLine) {
		const id = derivedId(ev.id, place);
		const sound = resolvers.ipa(ev);
		if (sound) ipa[id] = applyNotationPreferences(sound, build.notationPrefs, true);
		const modern = resolvers.cyrillic?.(ev);
		if (modern !== undefined) cyr[id] = modern;
		if (resolvers.withheld(ev)) withheld.add(id);
	}
	return { events, ipa, cyr, withheld };
}

export function paginateMelody(i: MelodyPagesInput): MelodyPages {
	const render = renderScoreOf(i.score);
	const base = {
		...(i.clef ? { clef: i.clef } : {}),
		pageWidth: i.pageWidth,
		pageHeight: i.pageHeight,
		laterPageHeight: i.laterPageHeight,
		marginTop: 0,
		marginBottom: 0,
		marginLeft: 0,
		marginRight: 0,
		lineGap: i.engraving.lineGap,
		pxPerWhole: i.engraving.pxPerWhole,
		minGap: i.engraving.minGap,
		systemGap: i.engraving.systemGap,
		leftMargin: i.engraving.leftMargin,
		...(i.font ? { font: i.font.prepared, fontFamily: i.font.family } : {}),
	};
	const c = i.channels;
	const lang = i.language ?? 'en';
	if (render.path === 'notated' || !i.verses) {
		const out = paginateScore(i.score, i.analyzed, {
			...base,
			...(c.ipaPreview ? { ipaPreview: c.ipaPreview } : {}),
			...(c.withheldIpa ? { withheldIpa: c.withheldIpa } : {}),
			...(c.cyrPreview ? { cyrPreview: c.cyrPreview } : {}),
			...(c.sylTypePreview ? { sylTypePreview: c.sylTypePreview } : {}),
			...(c.melismaPreview ? { melismaPreview: c.melismaPreview } : {}),
		});
		return { ...out, render, analyzed: i.analyzed, withheld: c.withheldIpa };
	}
	// A strophic song: verse 1's channels plus each later verse's, under derived ids.
	const events = { ...i.analyzed.events };
	const ipa = { ...(c.ipaPreview ?? {}) };
	const cyr = { ...(c.cyrPreview ?? {}) };
	const withheld = new Set(c.withheldIpa ?? []);
	for (let place = 2; place <= render.verses.length; place++) {
		const v = laterVerse(i.score, render.verses[place - 1], place, i.verses);
		Object.assign(events, v.events);
		Object.assign(ipa, v.ipa);
		Object.assign(cyr, v.cyr);
		for (const id of v.withheld) withheld.add(id);
	}
	// A live later-pass bar that carries verse 1's own one-line words (a second ending) draws them from verse 1's channels under the bare id,
	// so a correction made there (a placed syllable, a spelling, a melisma) reaches the page. The later verse's own channels are dropped for it.
	const sylType = c.sylTypePreview ? { ...c.sylTypePreview } : undefined;
	const melisma = c.melismaPreview ? new Set(c.melismaPreview) : undefined;
	for (const id of render.liveVerse1Ids) {
		const bare = id.replace(/~v\d+/, '');
		delete ipa[id];
		delete cyr[id];
		withheld.delete(id);
		if (c.ipaPreview && bare in c.ipaPreview) ipa[id] = c.ipaPreview[bare];
		if (c.cyrPreview && bare in c.cyrPreview) cyr[id] = c.cyrPreview[bare];
		if (c.withheldIpa?.has(bare)) withheld.add(id);
		if (sylType && c.sylTypePreview && bare in c.sylTypePreview) sylType[id] = c.sylTypePreview[bare];
		if (melisma && c.melismaPreview?.has(bare)) melisma.add(id);
	}
	const out = paginateScore(render.score, { ...i.analyzed, events }, {
		...base,
		ipaPreview: ipa,
		cyrPreview: cyr,
		...(withheld.size > 0 ? { withheldIpa: withheld } : {}),
		...(sylType ? { sylTypePreview: sylType } : {}),
		...(melisma ? { melismaPreview: melisma } : {}),
		breakRunsAt: render.boundaries,
		seam: systemSeam(render.bars, {
			label: (place) => t('markup.verseLabel', lang).replace('%s', String(place)),
			tag: (bar, place) => t('markup.verseTag', lang).replace('%m', bar).replace('%v', String(place)),
		}, render.liveIds),
	});
	return { ...out, render, analyzed: { ...i.analyzed, events }, withheld: withheld.size > 0 ? withheld : undefined };
}
