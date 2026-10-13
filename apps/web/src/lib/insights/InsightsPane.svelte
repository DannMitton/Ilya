<script lang="ts">
	/**
	 * INSIGHTS, Studio's third document (N.127), as Design round 2 draws it
	 * (QUEUE row 66; accepted by Dann 2026-10-11 03:50; brief
	 * `docs/sessions/brief-code-insights-for-the-singer_r1_2026-10-11.md`).
	 *
	 * The purpose, ratified 2026-10-10 23:17: a singer learns how this piece
	 * meets their voice in this key, to decide whether to sing it as written,
	 * work on it, try another key, or move on. The structure, ratified
	 * 2026-10-11 03:53 (`PRODUCT.md`, "How an Insights page is organized"): the
	 * opening frame (teacher line B); the conclusion, unboxed and first; then
	 * three squircles, the moments, the totals, and the sources as endnotes.
	 *
	 * THE PAGE FLOWS. `singer-blocks.ts` decides every sentence as a list of
	 * blocks; this pane draws each block once off screen at its printed width,
	 * measures it, and `paginate.ts` breaks the blocks into letter pages, a
	 * squircle continuing across a page break open at the break. Nothing is
	 * placed past a page's room: "collisions and overlaps are forbidden" (Dann,
	 * 03:42). On the phone the same blocks run in one column (the phone board).
	 *
	 * READ-ONLY, as N.127 ruled, with the controls it already had: the range
	 * offer (N.164), "Try this key" (N.94 slice 2), and the comments behind
	 * "more observations" (N.168). None of them prints.
	 *
	 * THE ANALYSIS CHAIN IS `MarkupPane`'S, repeated rather than shared, so the
	 * moments here are the marks the score page draws.
	 */
	import { tick, untrack } from 'svelte';
	import TitleHeader from '$lib/components/Paper/TitleHeader.svelte';
	import RunningHeader from '$lib/components/Paper/RunningHeader.svelte';
	import PageFooter from '$lib/components/Paper/PageFooter.svelte';
	import Italics from '$lib/components/Italics.svelte';
	import CompassStave from '$lib/insights/CompassStave.svelte';
	import SingerBlock from '$lib/insights/SingerBlock.svelte';
	import PageFit from '$lib/components/Paper/PageFit.svelte';
	import { PAGE_SIZES, MARGINS, HEADER_GAP, HEADER_HEIGHTS_AT_LETTER, formatRunningHeader } from '$lib/page-config';
	import type { LineData } from '$lib/types';
	import { t, type Language } from '$lib/i18n';
	import { COMPOSERS, formatNameForPaper } from '$lib/composers-poets';
	import { type Vowel, type CalibratedFormant, type VoiceCharacteristics } from '$lib/voice/engine/types';
	import type { IngestedScore } from '$lib/score/ingestion/ingest';
	import {
		analyzeScore,
		noteConditions,
		pitchToMidi,
		resolveVocalReadingOctave,
		shiftVocalOctave,
		scoreInPerformanceOrder,
		type IntakeAnswers,
		type KeyChoice,
		type Pitch,
	} from '@ilya/score-parser';
	import { isTreble, noteComments, noteFacts, registerFor, selectComments } from '$lib/insights/comments';
	import { renderComments, songSeed, speaks, type RenderedComment } from '$lib/insights/comment-text';
	import { buildUnderlayResolvers } from '$lib/score/vowel-resolver';
	import { withPairedVowel, type PairingMap, type DrawnUnderlay } from '$lib/score/pairings';
	import { resolveAdvice } from '$lib/analysis/advice-resolver';
	import { buildVoiceProfileSnapshot } from '$lib/analysis/analyze-score-adapter';
	import { buildWatchList } from '$lib/analysis/watchlist';
	import { placeholderLine, placeholderVowels } from '$lib/analysis/placeholder-line';
	import { pitchName } from '$lib/voice/note-picker';
	import {
		buildInsights,
		strikeLiederClause,
		formatSeconds,
		formatSecondsFine,
		formatTempo,
		secondsPerQuaver,
		verdictLine,
		printsNoFindingsLine,
		type PhonationSection,
		type SungKey,
	} from '$lib/insights/insights';
	import { cycleDoseSplit } from '$lib/insights/singing-measures';
	import { firstOutsideRange, longestAboveSecondo, searchBetterKey, shareAfter, vowelTurns } from '$lib/insights/singer-page';
	import { notesBlock, singerBlocks, type KeyForward, type PlacedBlock } from '$lib/insights/singer-blocks';
	import { breakOffsets, lineBoxes } from '$lib/insights/line-breaks';
	import { paginate, type Segment } from '$lib/insights/paginate';
	import { browserStore, rangeOfferDeclined, recordRangeOfferDecline } from '$lib/insights/range-offer-decline';
	import { composeIdentityLine } from '$lib/insights/identity';
	import { isUsable } from '$lib/voice/engine/plausibility';
	import type { VoiceTypeChoice } from '$lib/voice/profileStore';

	interface Props {
		formants: Partial<Record<Vowel, CalibratedFormant>>;
		characteristics?: VoiceCharacteristics;
		/** N.172: the voice's intake answers, which move the note comments. */
		intake?: IntakeAnswers;
		voiceName?: string;
		/** When the readings were written (`calibratedAt`, else `updatedAt`). Printed as the calibration date (N.19). */
		voiceUpdatedAt?: string;
		/** Voice type slice A: the singer's declared type, printed after the name. */
		voiceType?: VoiceTypeChoice;
		language: Language;
		/** The corrected score, the same value the marked score reads. */
		ingested?: IngestedScore | null;
		scoreTitle?: string;
		composer?: string;
		/** The piece's poet, for the running head (QUEUE row 64). */
		poet?: string;
		transcribedLines?: readonly LineData[];
		pairings?: PairingMap;
		/** N.159: the drawn vowel outranks the stored one, so Insights names
		 *  the marks Score markup draws. */
		drawnUnderlay?: DrawnUnderlay;
		openSyllabification?: boolean;
		isMobile?: boolean;
		/** N.164: "Add your range" opens calibration on the Range fields. */
		onaddrange?: () => void;
		/** N.94 slice 2: the chosen key, which Insights reads (curation rule 3), and "Try this key". */
		keyRuler?: SungKey;
	}

	let {
		formants,
		characteristics = undefined,
		intake = undefined,
		voiceName = undefined,
		voiceUpdatedAt = undefined,
		voiceType = undefined,
		language,
		ingested = null,
		scoreTitle = undefined,
		composer = '',
		poet = '',
		transcribedLines = undefined,
		pairings = undefined,
		drawnUnderlay = undefined,
		openSyllabification = false,
		isMobile = false,
		onaddrange = undefined,
		keyRuler = undefined,
	}: Props = $props();

	const T = (key: string) => t(key, language);
	const fill = (s: string, vars: Record<string, string | number>) =>
		Object.entries(vars).reduce((out, [k, v]) => out.replaceAll(`{${k}}`, String(v)), s);

	const dims = PAGE_SIZES.letter;

	// ── The chain, as `MarkupPane` runs it ───────────────────────
	const adapted = $derived(buildVoiceProfileSnapshot(formants, characteristics, voiceName, intake, voiceType?.voiceType));
	const parsed = $derived(ingested?.result.score ?? null);
	const octaveShift = $derived(parsed ? resolveVocalReadingOctave(parsed, adapted.snapshot.range) : 0);
	const printedReading = $derived(parsed && octaveShift !== 0 ? shiftVocalOctave(parsed, octaveShift) : parsed);
	const readingScore = $derived(printedReading && (keyRuler?.draw(printedReading) ?? printedReading));
	const analysisScore = $derived(readingScore ? scoreInPerformanceOrder(readingScore).score : null);
	const underlayResolvers = $derived(
		readingScore
			? buildUnderlayResolvers(readingScore, 1, {
					openSyllabification,
					...(transcribedLines ? { transcribedLines } : {}),
				})
			: null,
	);
	const vowelResolver = $derived(underlayResolvers ? withPairedVowel(underlayResolvers.vowel, pairings, drawnUnderlay) : null);
	const analyzed = $derived(
		analysisScore && vowelResolver
			? resolveAdvice(analyzeScore(analysisScore, adapted.snapshot, vowelResolver))
			: null,
	);
	// QUEUE row 69: the vowels the page rests on that the singer never sampled.
	const placeholders = $derived(placeholderVowels(analyzed));
	const watchList = $derived(
		readingScore && analyzed && analysisScore && vowelResolver
			? buildWatchList(readingScore, analyzed, 1, {
					analysisScore,
					profile: adapted.snapshot,
					resolver: vowelResolver,
				})
			: null,
	);

	/* THE CONDITION IS THE MEASURED VOICE, as it is for the score page's
	   withheld statement (`MarkupPane.svelte`, `showWithheld`). With no
	   measured resonance nothing about this voice can be forecast, so the page
	   prints no number at all (brief §7), even where a typed range exists. */
	const measured = $derived(adapted.completeness.formants);
	const model = $derived(
		measured && analysisScore
			? buildInsights({
					analysisScore,
					profile: adapted.snapshot,
					watchList,
					...(vowelResolver ? { vowelForEvent: vowelResolver, analyzed, ...(readingScore ? { readingScore } : {}) } : {}),
				})
			: null,
	);

	// ── The note comments (N.168, first slice) ────────────────────────
	/* The same six derivations feed them: the conditions read the
	   performance-order score, as the frequency run does, so the comments the
	   page prints are the ones the oracle counted. Treble comments are computed
	   and not shown: their wording is not ruled (brief r2, DESK DEFAULT). */
	const commentNotes = $derived(
		measured && analysisScore && analyzed && vowelResolver
			? noteConditions(analysisScore, adapted.snapshot, analyzed.events, {
					vowelForEvent: vowelResolver,
					...(readingScore ? { barsFrom: readingScore } : {}),
				}).notes
			: null,
	);
	const commentSelection = $derived.by(() => {
		if (!commentNotes) return null;
		const treble = isTreble(adapted.snapshot);
		const all = noteComments({
			facts: noteFacts(commentNotes, adapted.snapshot),
			intake,
			treble,
			...(adapted.snapshot.range ? { ceilingMidi: pitchToMidi(adapted.snapshot.range.highest) } : {}),
		}).filter((c) => !c.treble && speaks(c));
		return selectComments(all, { phraseCount: new Set(commentNotes.map((n) => n.phrase.index)).size });
	});
	/* Vowels the singer sang, by the adapter's own usability gate; a derived
	   fR1 is not a measured value for rule 1 of r2 §0. */
	const measuredVowels = $derived(
		new Set(
			Object.entries(formants)
				.filter(([, f]) => !!f && typeof f.f1 === 'number' && f.f1 > 0 && isUsable(f))
				.map(([v]) => v),
		),
	);
	const renderedComments = $derived.by((): { shown: RenderedComment[]; more: RenderedComment[] } => {
		if (!commentSelection || !commentNotes || !analysisScore) return { shown: [], more: [] };
		const pitchById = new Map(analysisScore.vocalLine.filter((e) => e.pitch).map((e) => [e.id, e.pitch!]));
		const page = [...commentSelection.shown, ...commentSelection.more];
		const rendered = renderComments(page, songSeed(commentNotes.map((n) => `${n.eventId}:${n.midi}`)), {
			language,
			register: registerFor(intake),
			measuredVowels,
			imagery: intake?.imagery !== false,
			all: intake?.suggestions === 'all',
			pitchOf: (id) => pitchById.get(id),
		});
		return { shown: rendered.slice(0, commentSelection.shown.length), more: rendered.slice(commentSelection.shown.length) };
	});
	const hasComments = $derived(
		renderedComments.shown.length > 0 || (commentSelection?.hiddenBySettings ?? 0) > 0,
	);

	function commentTag(r: RenderedComment): string {
		const m = analysisScore?.measures[r.comment.measureIndex];
		const bar = m?.number || String(r.comment.measureIndex + 1);
		const pitch = analysisScore?.vocalLine.find((e) => e.id === r.comment.eventId)?.pitch;
		return [T('loupe.measureTagShort').replace('%m', bar), pitch ? P(pitch) : ''].filter(Boolean).join(' · ');
	}

	/** The printed bar a comment sits in. */
	function commentBar(r: RenderedComment): string {
		return analysisScore?.measures[r.comment.measureIndex]?.number || String(r.comment.measureIndex + 1);
	}

	// ── The identity head (composed in `identity.ts`, voice type slice A) ──
	const calibratedOn = $derived(/^\d{4}-\d{2}-\d{2}/.exec(voiceUpdatedAt ?? '')?.[0] ?? null);
	const identityLine = $derived(composeIdentityLine({ voiceName, voiceUpdatedAt, measured, voiceType, language }));
	const composerDisplay = $derived(formatNameForPaper(composer, COMPOSERS, language));

	let headerHeight = $state(0);
	const contentTop = $derived(MARGINS.vertical + headerHeight + HEADER_GAP);
	let runningHeight = $state(0);
	const subsequentTop = $derived(MARGINS.vertical + (runningHeight || HEADER_HEIGHTS_AT_LETTER.subsequent) + HEADER_GAP);

	const attribution = $derived(strikeLiederClause(T('footer.attribution')));
	const hasTypedCharacteristics = $derived(
		adapted.completeness.range || adapted.completeness.tessitura || adapted.completeness.passaggio,
	);
	/* A French page names its octave index once, here: « (A4 = 440 Hz) » (QUEUE row 68; DESK DEFAULT). */
	const methodLine = $derived(
		(!model
			? T('insights.method.silent')
			: fill(T(hasTypedCharacteristics ? 'insights.method.typed' : 'insights.method.untyped'), { date: calibratedOn ?? '' })) +
			(model && language === 'fr' ? ` ${T('insights.r2.pitchKey')}` : ''),
	);

	// ── Words for the model ────────────────────────────────────────────
	const P = (p: Pitch) => pitchName(p, language);

	/* Row 4 replaces the section's numbers when there is no tempo. */
	function headlineOf(ph: PhonationSection): string {
		if (ph.timing === 'none' || !ph.phonation || !ph.tempo) return T('insights.phonation.noTempo');
		if (ph.phonation.kind === 'range') {
			return fill(T('insights.phonation.headlineInferred'), {
				low: formatSeconds(ph.phonation.low),
				high: formatSeconds(ph.phonation.high),
				tempoWord: ph.tempo.printedText ?? ph.tempo.term ?? '',
			});
		}
		return fill(T('insights.phonation.headline'), {
			phonation: formatSeconds(ph.phonation.seconds),
			length: formatSeconds(ph.length ?? ph.phonation.seconds),
			tempo: formatTempo(ph.tempo, language),
		});
	}

	// ── The range offer (N.164) ────────────────────────────────────────
	/* Read once per mount; the decline holds for every song and every reload. */
	let offerDeclined = $state(rangeOfferDeclined(browserStore()));
	function declineOffer() {
		recordRangeOfferDecline(browserStore());
		offerDeclined = true;
	}
	const verdict = $derived(model ? verdictLine(model, offerDeclined) : null);
	const noneFlagged = $derived(!!model && model.findings.length === 0 && printsNoFindingsLine(model.verdict));

	// ── The way forward: a key that fits better ────────────────────────
	/* Nothing out of range: the second search (`searchBetterKey`). A note out of
	   range: the watch list's own key, which "Try this key" already opened. */
	const better = $derived.by((): KeyForward | null => {
		if (!model || !analysisScore) return null;
		let semitones: number;
		let key: { fifths: number; mode: 'major' | 'minor' } | null = null;
		let compass: { low: Pitch; high: Pitch } | null = null;
		let shareThen: number | null;
		let score = null;
		const found = searchBetterKey(analysisScore, adapted.snapshot, model);
		if (found) {
			({ semitones, key, compass, shareThen } = found);
			score = found.score;
		} else {
			const tr = model.findings.find((f) => f.kind === 'range' && f.transposition)?.transposition;
			if (!tr || tr.semitones.length === 0) return null;
			semitones = tr.semitones[0];
			key = tr.keys?.[0] ?? null;
			shareThen = shareAfter(analysisScore, adapted.snapshot, semitones);
			score = { ...analysisScore, vocalLine: analysisScore.vocalLine.map((e) => (e.pitch ? { ...e, pitch: shift(e.pitch, semitones) } : e)) };
		}
		const stop = key ? (keyRuler?.stopFor({ semitones: [semitones], keys: [key] }) ?? null) : null;
		return {
			semitones,
			...(stop ? { stop, readout: keyRuler?.readoutFor(stop, language), keyName: keyRuler?.keyNameFor(stop, language) } : {}),
			shareThen,
			compass,
			score,
		};
	});
	/* A pitch moved by `n` semitones, for naming a note in another key; only its MIDI number is read. */
	function shift(p: Pitch, n: number): Pitch {
		const midi = pitchToMidi(p) + n;
		const names: Array<[Pitch['step'], number]> = [['C', 0], ['C', 1], ['D', 0], ['E', -1], ['E', 0], ['F', 0], ['F', 1], ['G', 0], ['A', -1], ['A', 0], ['B', -1], ['B', 0]];
		const [step, alter] = names[((midi % 12) + 12) % 12];
		return { step, alter, octave: Math.floor(midi / 12) - 1 } as Pitch;
	}

	// ── The blocks ─────────────────────────────────────────────────────
	const facts = $derived(commentNotes ? noteFacts(commentNotes, adapted.snapshot) : null);
	const blocks = $derived.by((): PlacedBlock[] => {
		if (!analysisScore)
			return [
				{ group: 'free', block: { kind: 'silence', lines: [T('insights.silence.noScore')] } },
				{ group: 'free', block: notesBlock(methodLine, null, language) },
			];
		if (!model) {
			return [
				{
					group: 'totals',
					block: {
						kind: 'silence',
						heading: T('profile.withheld.heading'),
						lines: [T('insights.silence.unmeasured')],
						withheld: [T('profile.withheld.item3'), T('insights.silence.findings')],
					},
				},
				{ group: 'free', block: notesBlock(methodLine, null, language) },
			];
		}
		const pricing = secondsPerQuaver(analysisScore);
		const typed = adapted.snapshot.tessitura;
		const untrusted = model.phonation.untrustedMeasures;
		return singerBlocks(
			{
				language,
				model,
				profile: adapted.snapshot,
				verdict,
				noneFlagged,
				held: longestAboveSecondo(facts, analysisScore),
				outside: firstOutsideRange(analysisScore, adapted.snapshot, (id) => vowelResolver?.({ id } as never)),
				better,
				comments: renderedComments.shown,
				more: renderedComments.more,
				hiddenBySettings: commentSelection?.hiddenBySettings ?? 0,
				tagOf: commentTag,
				barOf: commentBar,
				phonationHeadline: model.phonation.nothingSung ? null : headlineOf(model.phonation),
				untrustedLine: untrusted
					? fill(T(untrusted.length === 1 ? 'insights.phonation.untrustedOne' : 'insights.phonation.untrustedMany'), { measures: untrusted.join(', ') })
					: null,
				split:
					model.figure && typed
						? cycleDoseSplit(model.figure.rows, pricing ? pricing.price : null, { low: pitchToMidi(typed.low), high: pitchToMidi(typed.high) })
						: null,
				cycles: model.figure?.cycles ?? null,
				turns: vowelResolver ? vowelTurns(analysisScore, adapted.snapshot, vowelResolver) : null,
				placeholders,
				method: methodLine,
				footnote: model.tessitura.measured ? T('insights.footnote.tessitura') : null,
			},
			(s) => formatSecondsFine(s, language),
		);
	});

	// ── Measuring, then pages ──────────────────────────────────────────
	/* The text column is the page's width less its margins; a squircle's
	   blocks sit inside its 1 px border and 26 px padding. */
	const COLUMN = dims.width - 2 * MARGINS.horizontal;
	const INSIDE = COLUMN - 2 * 27;
	const GEOMETRY = { gap: 16, inner: 12, pad: 17, openPad: 5 };
	/* Clear space between the last content and the footer's notes: Unlikely
	   page 3's spacing, which Dann held up as the standard (03:42). DESK DEFAULT. */
	const CLEAR = 40;
	const widthOf = (b: PlacedBlock) => (b.group === 'free' ? COLUMN : INSIDE);

	let measureEls = $state<Array<HTMLElement | null>>([]);
	let heights = $state<number[]>([]);
	/* QUEUE row 79, rule 2: where each prose block may break between lines. Figures, the conclusion with its
	   controls, and the cycles bar never break. */
	const BREAKS = new Set(['comment', 'prose', 'endnote', 'note', 'notes']);
	let breakTops = $state<number[][]>([]);
	let footProbe = $state<HTMLElement | null>(null);
	let footHeight = $state(0);
	let fontsReady = $state(0);
	$effect(() => {
		document.fonts?.ready.then(() => (fontsReady += 1));
	});
	/* MEASURED AFTER `tick()`, as the old page-one fit did: a child's layout
	   lands after this component's effect, and a ResizeObserver does not run
	   in a hidden browser tab. */
	$effect(() => {
		void blocks;
		void fontsReady;
		void language;
		let current = true;
		tick().then(() => {
			if (!current) return;
			untrack(() => {
				heights = measureEls.slice(0, blocks.length).map((el) => el?.offsetHeight ?? 0);
				breakTops = measureEls.slice(0, blocks.length).map((el, k) => (el && BREAKS.has(blocks[k].block.kind) ? breakOffsets(lineBoxes(el)) : []));
				footHeight = footProbe?.offsetHeight ?? 0;
			});
		});
		return () => {
			current = false;
		};
	});

	const printed = $derived(blocks.map((b, k) => ({ b, k })).filter(({ b }) => !b.screenOnly));
	const pages = $derived.by((): Segment[][] => {
		const room = (top: number) => dims.height - MARGINS.vertical - footHeight - CLEAR - top;
		const segs = paginate(
			printed.map(({ b }) => b.group),
			printed.map(({ k }) => heights[k] ?? 0),
			{ ...GEOMETRY, capacity: (n) => room(n === 0 ? contentTop : subsequentTop) },
			// QUEUE row 79, rule 3: the two charts float; the cycles block carries its squircle's heading and stays.
			printed.map(({ b }) => b.block.kind === 'pitches' || b.block.kind === 'vowels'),
			printed.map(({ k }) => breakTops[k] ?? []),
		);
		// Back from printed indices to block indices; a screen-only block rides with the block before it.
		const back = printed.map(({ k }) => k);
		const pagesOut = segs.map((page) =>
			page.map((s) => ({
				...s,
				blocks: s.blocks.map((j) => back[j]),
				...(s.cuts ? { cuts: Object.fromEntries(Object.entries(s.cuts).map(([j, c]) => [back[Number(j)], c])) } : {}),
			})),
		);
		blocks.forEach((b, k) => {
			if (!b.screenOnly) return;
			// It rides with the part of the block before it that ends that block.
			for (const page of pagesOut)
				for (const s of page) if (s.blocks.includes(k - 1) && !(s.cuts?.[k - 1] && s.cuts[k - 1][1] < (heights[k - 1] ?? 0))) s.blocks.push(k);
		});
		return pagesOut;
	});
	const totalPages = $derived(pages.length);

	let flowWidth = $state(358);
	/* The phone's one column: each free block alone, each squircle's blocks together. */
	const flowSegments = $derived.by((): Segment[] => {
		const out: Segment[] = [];
		blocks.forEach((b, k) => {
			const last = out[out.length - 1];
			if (b.group !== 'free' && last?.group === b.group) last.blocks.push(k);
			else out.push({ group: b.group, blocks: [k], openTop: false, openBottom: false });
		});
		return out;
	});

	const runningHeader = $derived(formatRunningHeader(composer, scoreTitle ?? '', poet));
	const tryKey = (stop: KeyChoice) => keyRuler?.tryKey(stop);
</script>


{#snippet header()}
	<!-- Page 1 names its tab, above the compass, which keeps its place (QUEUE row 64). -->
	<RunningHeader headerText="" tabName={T('tab.insights')} accentInk="var(--rose-ink)" tabOnly />
	<TitleHeader
		title={scoreTitle ?? ''}
		composer={composerDisplay}
		poet={identityLine}
		translator=""
		opus=""
		{language}
		note={[keyRuler?.header(language), placeholderLine(placeholders, language)]}
		onheightchange={(h) => (headerHeight = h)}
		versionAccent="#AB7F7F"
		markAccent="#AB7F7F"
		ruleAccent="#AB7F7F"
		labelInk="var(--rose-ink)"
	>
		{#snippet aside()}
			{#if model?.figure}<CompassStave compass={model.figure.compass} clef={model.figure.clef} {language} />{/if}
		{/snippet}
	</TitleHeader>
{/snippet}

{#snippet blockAt(k: number, width: number)}
	<SingerBlock block={blocks[k].block} {language} {width} ontry={keyRuler ? tryKey : undefined} onaddrange={() => onaddrange?.()} ondecline={declineOffer} />
{/snippet}

{#snippet segment(s: Segment, column: number, inside: number)}
	{#if s.group === 'free'}
		{#each s.blocks as k (k)}{@render part(s, k, column)}{/each}
	{:else}
		<div class="squircle" class:open-top={s.openTop} class:open-bottom={s.openBottom}>
			{#each s.blocks as k (k)}{@render part(s, k, inside)}{/each}
		</div>
	{/if}
{/snippet}

<!-- QUEUE row 79, rule 2: a block broken between lines shows in a window of its part's height, shifted up by where
     the part begins, so the lines are the measured lines and nothing reflows. -->
{#snippet part(s: Segment, k: number, width: number)}
	{#if s.cuts?.[k]}
		<div class="part" class:screen-only={blocks[k].screenOnly} style="height: {s.cuts[k][1] - s.cuts[k][0]}px;">
			<div style="margin-top: {-s.cuts[k][0]}px;">{@render blockAt(k, width)}</div>
		</div>
	{:else}
		<div class:screen-only={blocks[k].screenOnly}>{@render blockAt(k, width)}</div>
	{/if}
{/snippet}

<!-- The measurer: every block once, off screen, at its printed width. Inert, so its controls are never reached. -->
<div class="measurer" aria-hidden="true" inert>
	{#each blocks as b, k (k)}
		<div bind:this={measureEls[k]} style="width: {widthOf(b)}px;">{@render blockAt(k, widthOf(b))}</div>
	{/each}
	<div class="foot-probe" bind:this={footProbe} style="width: {COLUMN}px;">
		<PageFooter pageNumber={1} totalPages={1} {language} hairlineAccent="var(--rose, #ab7f7f)" {attribution} />
	</div>
</div>


{#if isMobile}
	<!-- THE PHONE, one column (the phone board, Dann 03:11: "this reads well"). -->
	<div class="insights-flow">
		<div class="flow-head">{@render header()}</div>
		<div class="flow-body" bind:clientWidth={flowWidth}>
			{#each flowSegments as seg, j (j)}{@render segment(seg, flowWidth, flowWidth - 2 * 17)}{/each}
		</div>
		<div class="flow-foot">
			<PageFooter pageNumber={1} totalPages={1} {language} hairlineAccent="var(--rose, #ab7f7f)" {attribution} />
		</div>
	</div>
{:else}
	<PageFit fit={false} pageWidth={dims.width}>
		{#snippet content()}
			<div class="insights-container">
				{#each pages as page, n (n)}
					<article
						class="paper-page insights-page"
						style="width: {dims.width}px; height: {dims.height}px;"
						aria-label={fill(T('insights.pageAria'), { n: n + 1, total: totalPages })}
					>
						{#if n === 0}
							{@render header()}
						{:else}
							<RunningHeader headerText={runningHeader} tabName={T('tab.insights')} accent="var(--rose, #ab7f7f)" onheightchange={(h) => (runningHeight = h)} />
						{/if}
						<div class="column" style="top: {n === 0 ? contentTop : subsequentTop}px;">
							{#each page as s, j (j)}{@render segment(s, COLUMN, INSIDE)}{/each}
						</div>
						<!-- QUEUE row 79: the footnote and the method line are endnotes now, in Notes; every page's footer is the same. -->
						<PageFooter pageNumber={n + 1} {totalPages} {language} hairlineAccent="var(--rose, #ab7f7f)" {attribution} />
					</article>
				{/each}
			</div>
		{/snippet}
	</PageFit>
{/if}

<style>
	/* The page stack: `MarkupPane`'s `.markup-paper-container`, whose
	   declarations are byte-identical to `Paper.svelte`'s `.paper-container`. */
	.insights-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2rem;
		padding-bottom: 2rem;
	}

	.paper-page {
		position: relative;
		box-sizing: border-box;
		background: var(--paper-cream);
		box-shadow: 0 3px 12px rgba(0, 0, 0, 0.35);
		flex-shrink: 0;
	}

	.column {
		position: absolute;
		left: 96px;
		right: 96px;
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	/* ── The squircle ─────────────────────────────────────────
	   The watch band's outline: 12 px radius, 1 px dusty rose, cream inside.
	   Open at a page break, as the accepted drawing shows. */
	.squircle {
		box-sizing: border-box;
		border: 1px solid var(--rose);
		border-radius: 12px;
		padding: 16px 26px;
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.squircle.open-top {
		border-top: none;
		border-top-left-radius: 0;
		border-top-right-radius: 0;
		padding-top: 5px;
	}

	.squircle.open-bottom {
		border-bottom: none;
		border-bottom-left-radius: 0;
		border-bottom-right-radius: 0;
		padding-bottom: 5px;
	}

	.part {
		overflow: hidden;
	}

	.measurer {
		position: absolute;
		left: -20000px;
		top: 0;
		visibility: hidden;
		pointer-events: none;
	}

	.measurer > div {
		box-sizing: border-box;
	}

	/* The probe's footer sits in flow, so its height is the footer's own. */
	.foot-probe :global(.page-footer) {
		position: static;
	}

	/* ── The phone: one column, the same blocks ── */
	.insights-flow {
		box-sizing: border-box;
		background: var(--paper-cream);
		padding: 24px 16px 32px;
		display: flex;
		flex-direction: column;
		gap: 16px;
		max-width: 100%;
	}

	.flow-head {
		position: relative;
	}

	.flow-head :global(.title-header),
	.flow-head :global(.tab-mark) {
		position: relative;
		top: 0;
		left: 0;
		right: 0;
	}

	.flow-head :global(.tab-mark) {
		text-align: right;
	}

	.flow-body {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.flow-body .squircle {
		padding: 14px 16px;
	}

	.flow-foot :global(.page-footer) {
		position: static;
	}

	@media print {
		.paper-page {
			box-shadow: none;
			background: white;
		}

		.screen-only {
			display: none;
		}
	}
</style>
