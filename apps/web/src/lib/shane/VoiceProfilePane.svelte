<script lang="ts">
	/**
	 * The interim Voice Profile envelope pane (the Shane tab's main pane).
	 *
	 * Source of record: handover v30 §C.1 and §R (main-pane rulings,
	 * 2026-07-11), plus Dann's same-day ruling in review: the envelope
	 * carries the Paper system's page furniture for consistency — a fixed
	 * letter-size page, the TitleHeader exactly as the Ilya setup renders
	 * it (with a subtitle naming this a formant profile), and the full
	 * PageFooter. Dann and Kimi's division of labour stands: the drawer is
	 * the workshop (the wizard, the F1/F2 chart, the readings roster), the
	 * main pane is the gallery. This page is the gallery's envelope — one
	 * DRY container that today carries the interim message states and will
	 * later host the marked-up score states (§B build order: MnxScoreParser
	 * → overlay engine → Appendix B/C renderer), so the eventual score
	 * pages inherit this exact page geometry and furniture with no
	 * reframing.
	 *
	 * The two interim states (copy Dann's, 2026-07-12, superseding the
	 * 2026-07-11 trio and folding the Workshop cue and forward pointer
	 * into two body paragraphs):
	 * - Pre-calibration: the single line "Calibrate your voice to begin."
	 * - Post-calibration: (1) "Your repertoire-fit results will appear
	 *   here once you upload your score." — the upload clause names an
	 *   unwired action; Claude raised the never-advertise rule once, Dann
	 *   ruled it acceptable because ingestion is the next build (2026-07-12,
	 *   closed). (2) The profile line with the captured count and the
	 *   provisional vowels in the wizard's vowelTag convention, closing
	 *   with the drawer wayfinding. Counts, lists, and grammar degrade
	 *   mechanically (singular vowel, none captured, none provisional).
	 *   Still no score-input CONTROL is wired anywhere here.
	 *
	 * Header content: the title line carries the active voice's name (the
	 * page's subject, as the song title is the transcription page's), and
	 * the metadata line beneath carries the formant-profile subtitle, its
	 * wording drawn from the wizard's shipped Welcome copy ("a formant
	 * profile, which is a map of your voice's resonances"). The "Your
	 * voice" fallback title, shown only in the brief no-voice window before
	 * first-launch naming, is placeholder copy pending Dann's eye.
	 *
	 * Data flow: the wizard in the drawer owns the profile store and
	 * publishes the active voice's name and readings through the page shell
	 * (CalibrationWizard's onActiveProfileChange); this pane only reads.
	 * Stored readings are direct samples only (captured or provisional —
	 * estimated previews are display-only in the workshop and never
	 * persisted), so the trio's counts are counts of what was actually sung.
	 *
	 * Body copy now reads through the i18n dictionary (N.22 extraction), with
	 * French values placeholder (English verbatim) pending Dann's copy pass;
	 * the header and footer components were already bilingual through t().
	 */
	import { onMount } from 'svelte';
	import TitleHeader from '$lib/components/Paper/TitleHeader.svelte';
	import PageFooter from '$lib/components/Paper/PageFooter.svelte';
	import RunningHeader from '$lib/components/Paper/RunningHeader.svelte';
	import { PAGE_SIZES, MARGINS, FOOTER_MAX_HEIGHT, GAP, HEADER_HEIGHTS } from '$lib/page-config';
	import type { LineData, PageSize } from '$lib/types';
	import { t, type Language } from '$lib/i18n';
	import { SPOKEN_NAME } from '$lib/shane/pacifier/Pacifier.svelte';
	import type { Vowel, CalibratedFormant, VoiceCharacteristics } from '$lib/shane/engine/types';
	import { buildFitLegend } from '$lib/shane/fit-legend';
	import {
		paginateScore,
		analyzeScore,
		resolveVocalReadingOctave,
		shiftVocalOctave,
		scoreInPerformanceOrder
	} from '@ilya/score-parser';
	import type { IngestedScore } from '$lib/shane/ingestion/ingest';
	import { buildUnderlayResolvers } from '$lib/shane/vowel-resolver';
	import type { NotationPreferences } from '@ilya/phonology';
	import { applyNotationPreferences } from '@ilya/phonology';
	import { resolveAdvice } from '$lib/shane/advice-resolver';
	import { buildVoiceProfileSnapshot, composeBroadNote, isBroadAnalysis } from '$lib/shane/analyze-score-adapter';
	import { loadNotationFont, type LoadedNotationFont } from '$lib/shane/engine/notation-fonts';
	import { ENGRAVING_DEFAULTS, type EngravingValues } from '$lib/shane/engraving';
	import { buildWatchList, watchEntryLine, WATCH_HEADER } from '$lib/shane/watchlist';
	import { scoreMetrics } from '$lib/shane/score-metrics';

	interface Props {
		/** The active voice's stored readings (direct samples only). */
		formants: Partial<Record<Vowel, CalibratedFormant>>;
		/**
		 * The active voice's typed range/tessitura/passaggio (E.5 slice 4).
		 * Undefined when the singer skipped the Voice characteristics phase;
		 * the adapter then fills each missing dimension with a permissive
		 * default and the broad-analysis note appears (§A.31).
		 */
		characteristics?: VoiceCharacteristics;
		/** The active voice's name; undefined before first-launch naming. */
		voiceName?: string;
		language: Language;
		/** Mirrors Paper.svelte's prop; the page shell passes letter today. */
		pageSize?: PageSize;
		/**
		 * The accepted upload from the Fit uploader (live wiring, v36 §E.7).
		 * When present, the envelope's content window carries the rendered
		 * score pages instead of the interim copy. Slice 1 (Dann's scope
		 * ruling, 2026-07-13) renders notation only: real systems and
		 * underlay through paginateScore, no acoustic marks (see
		 * notation-overlay.ts for why that is the engine's own semantics).
		 */
		ingested?: IngestedScore | null;
		/**
		 * The song title for the page-1 header (the title slot belongs to
		 * the SONG, per the header ruling). Sourced from the shared drawer
		 * metadata today; parser-extracted titles and the score-wins
		 * conflict rules are the deferred §A.6 behaviours.
		 */
		scoreTitle?: string;
		/**
		 * Engraving preferences from the drawer panel (Dann's ruling,
		 * 2026-07-13). Defaults to the Appendix-derived values so the
		 * pane renders correctly standalone.
		 */
		engraving?: EngravingValues;
		/**
		 * Q3 wizard-collapse trigger (Kimi's §A.28 ruling, 2026-07-13):
		 * fires once per ingested score when it has actually produced
		 * rendered pages — loaded, parsed, AND rendered, never on failure
		 * (failures stay in the uploader slot and this pane never sees
		 * them). Engraving re-paginations of the same score do not
		 * re-fire; a pane remount does, so the page shell dedupes by
		 * score identity across mounts.
		 */
		onrendered?: () => void;
		/**
		 * The singer's notation preferences (N.5, 2026-08-05). Ilya's output
		 * is ONE study document, and Transcribe already spells its IPA to
		 * these preferences (`Paper/WordStack.svelte`), so the score pages
		 * must use the same set or конь prints `ˈkonʲ` on one page and
		 * `ˈkoɲ` on the next. Required rather than defaulted: a silent
		 * default here is exactly the unlabelled preference set that
		 * `DIRECTIVE-all-ipa-through-ilya.md` forbids on a printed page.
		 */
		notationPrefs: NotationPreferences;
		/**
		 * The singer's open-syllable preference (N.8, 2026-08-06). Applies to
		 * the IPA line ONLY on this page: Dann's ruling is that the Cyrillic
		 * keeps the engraver's hyphenation, as printed in the score they
		 * perform from, so the two lines may legitimately differ here.
		 * Transcribe is unaffected and continues to divide both lines.
		 */
		openSyllabification?: boolean;
		/**
		 * The singer's own transcription (N.10, Dann's ruling of 7 August:
		 * "Fit consumes Transcription's output including the singer's stress
		 * overrides").
		 *
		 * Fit and Transcribe share the pipeline and share no state (E.31 §1.2),
		 * so before this prop existed a word the singer had corrected in
		 * Transcribe printed here with the engine's original stress, and the
		 * control that would fix it lived on a tab whose output never reached
		 * this one. Where a score word pairs with a transcribed word the
		 * singer's result is used; where it does not, Fit's own run stands for
		 * that word alone (Path C, E.31 §1.5).
		 *
		 * Undefined, or an empty array, means no donor pass runs and the page
		 * is exactly what it was before N.10.
		 */
		transcribedLines?: readonly LineData[];
	}

	let {
		formants,
		characteristics = undefined,
		voiceName = undefined,
		language,
		pageSize = 'letter',
		ingested = null,
		scoreTitle = undefined,
		engraving = ENGRAVING_DEFAULTS,
		onrendered = undefined,
		notationPrefs,
		openSyllabification = false,
		transcribedLines = undefined,
	}: Props = $props();

	// N.22: dictionary lookup, following ScoreUploader.svelte's convention.
	const T = (key: string) => t(key, language);

	const dims = $derived(PAGE_SIZES[pageSize]);

	// The header ruling (Dann, 2026-07-12): the title slot belongs to the
	// SONG, verbatim as on the Ilya page — the italic "Aria or song title"
	// placeholder until a real score arrives (which is exactly what this
	// envelope awaits). The voice's identity lives in the qualifier line
	// beneath (the composer/opus/poet slot on the Ilya page): "Formant
	// profile: a map of <voice>'s resonances", with the voice name
	// substituted, falling back to "your voice" in the brief window
	// before first-launch naming. TitleHeader renders the line in its
	// small-caps register.
	const subtitle = $derived(
		T('profile.subtitle').replace('{voice}', voiceName ? `${voiceName}’s` : T('profile.yourVoice')),
	);

	// The roster's canonical display order (wizard spec v1 §2: the seven
	// defaults in the fixed counterclockwise order, then the three optional
	// vowels), so the trio lists provisional vowels in the same order the
	// singer sees them in the workshop roster.
	const ROSTER_ORDER: Vowel[] = ['i', 'e', 'ɛ', 'a', 'ɑ', 'o', 'u', 'ɨ', 'ɪ', 'ʌ'];

	// Counts are spelled out in the locked copy's register ("Seven vowels
	// are captured"), so the words live here; the roster caps at ten.
	const COUNT_WORDS = $derived([
		T('profile.count.0'),
		T('profile.count.1'),
		T('profile.count.2'),
		T('profile.count.3'),
		T('profile.count.4'),
		T('profile.count.5'),
		T('profile.count.6'),
		T('profile.count.7'),
		T('profile.count.8'),
		T('profile.count.9'),
		T('profile.count.10')
	]);

	// The provisional roster still reads capture STATUS: it names which vowels
	// the singer may want to re-take. That is a different question from what
	// the forecast is built on; see `analysedVowels` below (§B.2).
	let provisionalVowels = $derived(
		ROSTER_ORDER.filter((g) => formants[g]?.reading === 'provisional')
	);
	let hasReadings = $derived(Object.keys(formants).length > 0);

	/**
	 * The provenance legend (item 1.6), built from this voice's own readings.
	 *
	 * It defines the vocabulary this page already uses in prose: the sentences
	 * above say "with seven vowels measured" and "are provisional", and until
	 * now nothing on the printed page said what those words mean. Empty for an
	 * uncalibrated profile, so the footer omits the row rather than printing a
	 * glossary for readings that do not exist (E.22 §4, "never guesses where
	 * calibration is absent").
	 *
	 * ONCE PER DOCUMENT, on the first page. A four-line glossary repeated on
	 * every sheet of a printed Fit result is noise, and the singer's page is
	 * where a glossary belongs. Deliberately NOT the same placement rule as
	 * `broadNote`, which repeats because it qualifies the analysis printed on
	 * each sheet; this qualifies the calibration behind all of them.
	 * DECLARED BELOW, beside `withheldIpa`, not here: N.10b gave this a
	 * dependency on the render, and `withheldIpa` cannot be computed until
	 * `readingScore` and the resolvers exist. A `$derived` reading a `const`
	 * declared later is a temporal dead zone, and `svelte-check` does not see
	 * one.
	 */


	// ── Page geometry, mirrored from TitlePage.svelte ────────────────────
	// The header is measured (its height varies with wrapping), the footer
	// window is fixed; the content layer lives between them. The 18px
	// header-to-content gap is TitlePage's TITLE_HEADER_GAP — one document,
	// one rhythm.
	const TITLE_HEADER_GAP = 18;
	let headerHeight = $state(0);
	const contentTop = $derived(MARGINS.vertical + headerHeight + TITLE_HEADER_GAP);
	const contentBottom = MARGINS.vertical + FOOTER_MAX_HEIGHT + GAP;

	function handleHeaderHeight(height: number) {
		headerHeight = height;
	}

	// ── Score pages (live wiring slice 1: notation only) ─────────────────
	// The parsed score paginates into the page-1 content window's geometry
	// (the smaller window, since the measured TitleHeader outweighs the
	// running header), so every page's systems fit every page type; pages
	// after the first simply carry a little extra room at the bottom.
	const parsed = $derived(ingested?.result.score ?? null);
	const contentWidth = $derived(dims.width - 2 * MARGINS.horizontal);
	const subsequentTop = MARGINS.vertical + HEADER_HEIGHTS.subsequent + GAP;

	// paginateScore paints a white full-page backing rect (its pages are
	// standalone artifacts); here the Paper page provides the surface, so
	// the rect is stripped. Upstream option (background: null) noted for
	// the package.
	const stripBackingRect = (svg: string): string =>
		svg.replace(/<rect x="0" y="0" width="\d+" height="\d+" fill="#FFFFFF"\/>/, '');

	// SMuFL font wiring (Dann's ruling, 2026-07-13): Finale Maestro is the
	// default for ALL renderings. Loaded async through the shared loader;
	// until it arrives (or if it fails) the render falls back to the
	// package's primitive shapes, so a dropped score is never blocked on a
	// font fetch.
	let notationFont = $state<LoadedNotationFont | null>(null);
	onMount(() => {
		let alive = true;
		loadNotationFont()
			.then((f) => {
				if (alive) notationFont = f;
			})
			.catch(() => {
				/* primitive-mode fallback; the pane stays fully functional */
			});
		return () => {
			alive = false;
		};
	});

	// ── The acoustic overlay (E.5 slice 4) ───────────────────────────────
	// The adapter builds the overlay engine's snapshot from the active
	// voice's measured formants and typed characteristics, filling any
	// missing dimension with a permissive default (see analyze-score-adapter
	// for the sentinel proof). buildVowelResolver supplies Ilya's per-event
	// sung vowel; a non-Russian score resolves nothing and renders notation
	// only, correctly (§A.35). This replaces notationOnlyOverlay: with no
	// resolvable vowels or no fR1, analyzeScore omits every event, so the
	// same plain vocal line renders, no acoustic claim made.
	const adapted = $derived(buildVoiceProfileSnapshot(formants, characteristics, voiceName));

	/**
	 * The vowels the FORECAST reads, which is not the same as the vowels that
	 * were cleanly captured (Dann's §B.2 ruling, 2026-07-15: the pane's count
	 * reports what the analysis used; capture quality is the drawer's job,
	 * where Re-take lives).
	 *
	 * Derived from the snapshot itself rather than re-testing `reading`, so it
	 * can never drift from what `analyzeScore` is actually given. §A.48 admits
	 * provisional and unchecked readings into fR1 and excludes only those the
	 * plausibility guard judged implausible. Before that ruling a provisional
	 * reading was excluded, and the old capture-status count happened to match;
	 * it no longer does, which is why this exists.
	 */
	const analysedVowels = $derived(ROSTER_ORDER.filter((g) => adapted.snapshot.fR1[g] !== undefined));

	// ── Vocal reading octave (denigma treble-8vb repair) ─────────────────
	// A treble-notated lower-voice line arrives an octave too high (denigma
	// flattens the octave clef). Resolve the octave that fits the singer's own
	// declared range and read BOTH the analysis and the render there, so the
	// marks and the engraving stay coherent (a shifted-down line lands in bass
	// clef via the tessitura heuristic). Non-destructive; `parsed` is untouched.
	const octaveShift = $derived(parsed ? resolveVocalReadingOctave(parsed, adapted.snapshot.range) : 0);
	const readingScore = $derived(
		parsed && octaveShift !== 0 ? shiftVocalOctave(parsed, octaveShift) : parsed,
	);
	const showOctaveNotice = $derived(octaveShift !== 0);
	// Approved copy (Dann, 2026-07-18); shown only when the reading octave shifted.
	const OCTAVE_NOTICE = $derived(T('profile.octaveNotice'));

	// ── Performance order for the analysis path (M0 jump-family wiring) ───
	// analyzeScore and the watch list should see the score as it is actually
	// SUNG: repeats taken, the D.C./D.S. jump family followed, and material after
	// a Fine (or jumped over) absent, so a note earns an acoustic forecast only
	// where the singer reaches it. The RENDER keeps the notated `readingScore`
	// below (repeats and jumps drawn as written); this does not pre-empt the open
	// strophic-render ruling (D3). When a structure cannot be unfolded, the
	// projection falls back to as-written and carries the unfolder's own flags.
	const performanceOrder = $derived(readingScore ? scoreInPerformanceOrder(readingScore) : null);
	const analysisScore = $derived(performanceOrder ? performanceOrder.score : null);
	// Score-level notices for a later UI to read (§M0.3): the unfolder's flags for
	// a jump structure it could not follow. Not rendered here — no new UI, and the
	// flag copy is the unfolder's, awaiting Dann's sign-off before it is shown.
	const analysisNotices = $derived(performanceOrder ? performanceOrder.flags : []);

	// The resolver is keyed by event id and built from the NOTATED line, so it
	// resolves every sung occurrence (same ids) identically; feed analyzeScore the
	// performance-order view so the overlay reflects the sung sequence.
	// N.5: BOTH resolvers, from one reconstruction pass. `buildVowelResolver`
	// is a wrapper that returns only `.vowel` (`vowel-resolver.ts:384`), so
	// the display IPA was being computed and thrown away on every render.
	const underlayResolvers = $derived(
		readingScore
			? buildUnderlayResolvers(readingScore, 1, {
					openSyllabification,
					...(transcribedLines ? { transcribedLines } : {}),
				})
			: null,
	);
	const vowelResolver = $derived(underlayResolvers?.vowel ?? null);

	// N.5: the printed IPA line. Every string is Ilya's own, read from the
	// engine's syllable transcription (`vowel-resolver.ts:265-266`), then
	// spelled to the singer's preferences so the score pages agree with the
	// transcription pages. Fit synthesizes nothing, per
	// `DIRECTIVE-all-ipa-through-ilya.md`; where the engine resolves no
	// syllable the event is simply absent and the renderer prints no IPA for
	// it, which is the correct abstention rather than a guess.
	const ipaPreview = $derived.by(() => {
		if (!readingScore || !underlayResolvers) return undefined;
		const out: Record<string, string> = {};
		for (const ev of readingScore.vocalLine) {
			const ipa = underlayResolvers.ipa(ev);
			if (ipa) out[ev.id] = applyNotationPreferences(ipa, notationPrefs, true);
		}
		return Object.keys(out).length > 0 ? out : undefined;
	});
	// N.10b: the onsets the resolver declined to transcribe (Dann's ruling of
	// 7 August, E.29 §5.1 ruled A). Undefined when the page carries none, so
	// the renderer and the legend both take their existing no-op path and an
	// unaffected score is byte-for-byte what it was.
	const withheldIpa = $derived.by(() => {
		if (!readingScore || !underlayResolvers) return undefined;
		const out = new Set<string>();
		for (const ev of readingScore.vocalLine) {
			if (underlayResolvers.withheld(ev)) out.add(ev.id);
		}
		return out.size > 0 ? out : undefined;
	});

	// The Fit legend (item 1.6). Declared here rather than beside its doc
	// comment above, because N.10b's entry depends on `withheldIpa`.
	let fitLegend = $derived(
		buildFitLegend(formants, language, { withheldSyllables: !!withheldIpa })
	);
	// The advice resolver (§A.158 RULED A) is a PURE POST-PASS wrapped here, at the
	// analysed seam, so `analyzed` carries the resolved `vowelModification` BEFORE
	// `buildWatchList` reads it below. It leaves the pure engine content-free and
	// only adds the sourced advice (v1: the [i]→[ɪ] crossing, §A.161/§A.169).
	const analyzed = $derived(
		analysisScore && vowelResolver
			? resolveAdvice(analyzeScore(analysisScore, adapted.snapshot, vowelResolver))
			: null,
	);

	// ── The "Places to watch" list (design C) ────────────────────────────
	// Built purely from the marks the overlay already computed (watchlist.ts);
	// verse 1 today. Silent on zero challenge (§7.3). Rendered AFTER the score
	// (Dann's placement ruling, 2026-07-18) so a variable-length list never
	// displaces the score markup, which also frees the full page-1 height for
	// pagination.
	// The transposition inputs (Dann's ruling A, 2026-07-20): the watch list
	// computes the one song-level suggestion itself, run over the SAME
	// performance-order score the analysis used, so its forecast crossings match
	// the marks on the page.
	const watchList = $derived(
		readingScore && analyzed && analysisScore && vowelResolver
			? buildWatchList(readingScore, analyzed, 1, {
					analysisScore,
					profile: adapted.snapshot,
					resolver: vowelResolver
				})
			: null,
	);
	const showWatchBand = $derived(!!watchList && watchList.entries.length > 0);

	// ── The measurement layer (E.20 built, E.21 wired) ───────────────────
	// Phonation time per pitch and per vowel, Pacheco's tessitura, the tempo
	// seam, seconds, and the nominal fold-cycle count, from one call.
	//
	// Read from `analysisScore`, the PERFORMANCE-ORDER projection, for the same
	// reason `analyzed` is: the question Fit answers is what the singer actually
	// sings, repeats taken and jumps followed, not what the page shows.
	//
	// The resolver is passed only when there is one. Its absence makes the
	// per-vowel totals ABSENT rather than empty, which is the seam's own
	// discipline: no vowel was ever asked for, so no claim is made about any.
	// No tempo override is passed, because the singer has no way to set one yet
	// (A9 is unbuilt). The seam then abstains wherever the score states no
	// tempo, and never invents a bpm.
	//
	// NOT RENDERED HERE, and deliberately so. The same treatment as
	// `analysisNotices` above: the data path lands, the pixels wait on Dann's
	// copy and Kimi's component, because a figure about a singer's voice should
	// not reach them in wording nobody signed off. Two things must surface when
	// it is drawn (Fable A.2 and A.3, binding): `tessitura.basis`, and
	// `tessitura.marginal`, since a knife-edge band presented as robust is a
	// wrong answer wearing confidence.
	//
	// One caveat travels with `phonation.byVowel` until the diction-mark fold
	// lands: `#` still occupies a syllable slot, so the per-vowel split is
	// provisional. `byPitch`, `total`, `tessitura`, `seconds`, and `foldCycles`
	// never consult a syllable and are unaffected.
	const metrics = $derived(
		analysisScore
			? scoreMetrics(analysisScore, {
					...(vowelResolver ? { vowelForEvent: vowelResolver } : {})
				})
			: null,
	);

	// Page-1 score window: the measured header sets contentTop; the score fills
	// the window below it, undisplaced by the watch list.
	const page1WindowHeight = $derived(dims.height - contentTop - contentBottom);

	// The broad-analysis note fires only when the overlay actually carries
	// acoustic marks (at least one resolved event) AND a characteristics
	// dimension was left blank. A notation-only render (no marks) has nothing
	// to qualify, so the note stays silent there.
	const hasAcousticMarks = $derived(!!analyzed && Object.keys(analyzed.events).length > 0);
	const showBroadNote = $derived(hasAcousticMarks && isBroadAnalysis(adapted.completeness));

	// ── Item 1.8, the withheld statement (2026-08-05) ─────────────────────
	// The clause this serves: "read or print a complete Fit result that never
	// guesses where calibration is absent." The ENGINE already satisfies it, by
	// Dann's Option A ruling of 2026-07-15: with no fR1 it omits every event and
	// the render is notation-only (analyze-score-adapter.ts:60-64). What it does
	// not do is SAY so, and a silent page is indistinguishable from a page whose
	// analysis came back clean.
	//
	// THE CONDITION IS THE PROFILE, NOT THE EVENTS. `hasAcousticMarks` above is
	// also false for a fully measured singer whose score happens to contain no
	// crossings and no timbre turns, and telling that singer "nothing was
	// checked" would be a lie in the opposite direction. `completeness.formants`
	// (analyze-score-adapter.ts:76) is `Object.keys(fR1).length > 0`, so this
	// fires only when no measured resonance exists and nothing COULD be
	// forecast.
	//
	// VOCABULARY: Dann ruled 2026-08-05 that this app's verb is MEASURE, in both
	// languages. `étalonner` is the accurate metrological term but reverses the
	// relation, since Ilya is calibrated against the voice rather than the other
	// way round, and `mesuré` was already shipped at fit-legend.ts:76 and in
	// i18n's `fit.broad.body`. A vocabulary sweep of the older `calibrate`
	// strings is recorded as its own item.
	//
	// N.22: migrated into i18n.ts under profile.withheld.*, preserving the
	// French verbatim (it is Dann's, still flagged for his eye).
	const showWithheld = $derived(!adapted.completeness.formants);
	const withheld = $derived({
		heading: T('profile.withheld.heading'),
		lede: T('profile.withheld.lede'),
		items: [
			T('profile.withheld.item1'),
			T('profile.withheld.item2'),
			T('profile.withheld.item3')
		],
		close: T('profile.withheld.close')
	});

	// The broad-analysis legend text (§B.5): composed from localized parts by
	// the adapter (EN and FR), rendered print-native in the PageFooter legend
	// zone rather than as a banner above the score. Empty when nothing is broad.
	const broadNoteText = $derived(composeBroadNote(adapted.completeness, language));

	const scorePages = $derived(
		readingScore && analyzed
			? paginateScore(readingScore, analyzed, {
					pageWidth: contentWidth,
					pageHeight: page1WindowHeight,
					marginTop: 0,
					marginBottom: 0,
					marginLeft: 0,
					marginRight: 0,
					lineGap: engraving.lineGap,
					pxPerWhole: engraving.pxPerWhole,
					minGap: engraving.minGap,
					systemGap: engraving.systemGap,
					leftMargin: engraving.leftMargin,
					...(ipaPreview ? { ipaPreview } : {}),
					...(withheldIpa ? { withheldIpa } : {}),
					...(notationFont ? { font: notationFont.prepared, fontFamily: notationFont.family } : {}),
				}).pages.map(stripBackingRect)
			: null,
	);

	// The commentary (octave notice + watch list) prints on its own trailing
	// page sheet AFTER the score (Dann's placement ruling, 2026-07-18), so it
	// sits inside the page boundary like the score and expands freely there
	// without displacing the markup. Numbered as a continuation of the score.
	// Item 1.8: the withheld statement is a third reason for this sheet to
	// exist. Without it there is no trailing page at all in the uncalibrated
	// state, and the statement lands in exactly the position the watch list
	// would have occupied: the page that would have carried the conclusions
	// instead says why there are none.
	const hasCommentaryPage = $derived(showOctaveNotice || showWatchBand || showWithheld);
	const totalPages = $derived(
		scorePages ? scorePages.length + (hasCommentaryPage ? 1 : 0) : 0,
	);

	// The Q3 render report (see the onrendered prop doc): once per score
	// identity, only when pagination yielded at least one page. A plain
	// variable, not state — it is compared, never rendered.
	let reportedRenderFor: IngestedScore | null = null;
	$effect(() => {
		if (ingested && scorePages && scorePages.length > 0 && reportedRenderFor !== ingested) {
			reportedRenderFor = ingested;
			onrendered?.();
		}
	});

	// Interim running-header text for pages 2+: the song title when the
	// singer has one in the shared metadata, else the profile subtitle.
	// Interim copy, flagged for Dann's eye with the §A.6 behaviours.
	const runningHeader = $derived(scoreTitle?.trim() ? scoreTitle : subtitle);

	function countWord(n: number): string {
		return COUNT_WORDS[n] ?? String(n);
	}

	// Built as an expression so the leading space survives Svelte's
	// block-boundary whitespace trimming (the "setwith" bug, caught by
	// Dann in live testing, 2026-07-12).
	// DRAFT copy, flagged for Dann (§B.2). "measured" replaces "successfully
	// captured": the count now spans every reading the forecast reads, which
	// includes provisional ones, and "successfully captured" would overclaim
	// their quality.
	let statusLine = $derived(
		analysedVowels.length === 0
			? T('profile.statusSetPlain')
			: (analysedVowels.length === 1
					? T('profile.statusSetMeasuredSingular')
					: T('profile.statusSetMeasuredPlural')
				).replace('{count}', countWord(analysedVowels.length).toLowerCase()),
	);

	// N.22: split around {vowels} so the glyph snippet renders in the gap. The
	// split point travels with the translation, which is the entire point: the
	// fragments this replaced could not be translated, because French needs a
	// noun English omits ("Votre voyelle [ɛ]") and the gender then
	// propagates through the participle.
	let provisionalParts = $derived(
		(provisionalVowels.length === 1
			? T('profile.provisional.sentenceSingular')
			: T('profile.provisional.sentencePlural')
		).split('{vowels}'),
	);

	/**
	 * The separator before item `idx` in a natural-language list, Oxford
	 * comma applied: "a and b" for two, "a, b, and c" for three or more.
	 */
	function listSep(idx: number, len: number): string {
		if (idx === 0) return '';
		if (len === 2) return ' and ';
		return idx === len - 1 ? ', and ' : ', ';
	}
</script>

<!--
	Vowel tag in the wizard's convention (Dann's copy, 2026-07-12): the
	bracketed glyph followed by its visible informal name ("[i] cardinal-i").
	The §4.6 speakable-name discipline holds — the glyph is aria-hidden, so
	screen readers announce only the informal name and [ɪ]/[ɨ] never
	collapse onto "ee".
-->
{#snippet vowelGlyph(g: Vowel)}<span class="profile-ipa" aria-hidden="true">[{g}]</span
	>{SPOKEN_NAME[g]}{/snippet}

{#if scorePages && scorePages.length > 0}
	<!-- Score state (live wiring slice 1): the uploaded score's systems,
	     paginated into the envelope's exact page geometry and furniture,
	     mirroring Paper.svelte's TitlePage/SubsequentPage pattern. The
	     SVG pages come from paginateScore, notation only for now (no
	     acoustic marks; see notation-overlay.ts). -->
	<!-- data-analysis-notices carries the unfolder's flag codes (machine tags,
	     not user copy) for a later notice UI to read; absent when the sung order
	     was computed cleanly. No visible surface is built here (§M0.3). -->
	<div
		class="fit-paper-container"
		role="region"
		aria-label={T('profile.scoreRegionAria')}
		data-analysis-notices={analysisNotices.length
			? analysisNotices.map((f) => f.code).join(' ')
			: undefined}
	>

		{#each scorePages as page, i (i)}
			<article
				class="paper-page profile-page"
				style="width: {dims.width}px; height: {dims.height}px;"
				aria-label={T('profile.scorePageAria').replace('{n}', String(i + 1)).replace('{total}', String(scorePages.length))}
			>
				{#if i === 0}
					<TitleHeader
						title={scoreTitle ?? ''}
						composer={subtitle}
						poet=""
						translator=""
						opus=""
						{language}
						onheightchange={handleHeaderHeight}
						versionAccent="#8E7E9B"
						markAccent="#8E7E9B"
						ruleAccent="#8E7E9B"
					/>
					<div class="score-window" style="top: {contentTop}px; bottom: {contentBottom}px;">
						<!-- eslint-disable-next-line svelte/no-at-html-tags -- our own renderer's SVG -->
						{@html page}
					</div>
				{:else}
					<RunningHeader headerText={runningHeader} />
					<div class="score-window" style="top: {subsequentTop}px; bottom: {contentBottom}px;">
						{@html page}
					</div>
				{/if}
				<PageFooter pageNumber={i + 1} totalPages={totalPages} {language} legendItems={i === 0 ? fitLegend : []} broadNote={showBroadNote ? broadNoteText : undefined} hairlineAccent="#8E7E9B" />
			</article>
		{/each}
		{#if hasCommentaryPage}
			<!-- A trailing "notes" page: the octave notice and the "Places to
			     watch" list on their own sheet AFTER the score (Dann's placement
			     ruling, 2026-07-18) so they sit within the page boundary and
			     expand freely without displacing the markup. -->
			<article
				class="paper-page profile-page"
				style="width: {dims.width}px; height: {dims.height}px;"
				aria-label={T('profile.notesPageAria')}
			>
				<RunningHeader headerText={runningHeader} />
				<div class="commentary-window" style="top: {subsequentTop}px; bottom: {contentBottom}px;">
					{#if showWithheld}
						<!-- Item 1.8: absence as a positive object on the page, not a
						     gap. Placed FIRST, above the octave notice, because it
						     governs everything else on the sheet: if no voice has been
						     measured, nothing below it could have been forecast. -->
						<aside class="withheld" aria-label={withheld.heading}>
							<p class="withheld-heading">{withheld.heading}</p>
							<p class="withheld-lede">{withheld.lede}</p>
							<ul class="withheld-list">
								{#each withheld.items as item (item)}
									<li class="withheld-line">{item}</li>
								{/each}
							</ul>
							<p class="withheld-close">{withheld.close}</p>
						</aside>
					{/if}
					{#if showOctaveNotice}
						<aside class="octave-notice">{OCTAVE_NOTICE}</aside>
					{/if}
					{#if showWatchBand && watchList}
						<aside class="watch-band" aria-label={WATCH_HEADER}>
							<p class="watch-band-header">{WATCH_HEADER}</p>
							<ul class="watch-band-list">
								{#each watchList.entries as entry (entry.eventId)}
									<li class="watch-band-line">{watchEntryLine(entry)}</li>
								{/each}
							</ul>
						</aside>
					{/if}
				</div>
				<PageFooter pageNumber={totalPages} totalPages={totalPages} {language} legendItems={[]} hairlineAccent="#8E7E9B" />
			</article>
		{/if}
	</div>
{:else}
<article
	class="paper-page profile-page"
	style="width: {dims.width}px; height: {dims.height}px;"
	aria-label={T('profile.emptyStateAria')}
>
	<!-- Header layer: the same TitleHeader the transcription page renders,
	     pinned to the top margin. Title = the song's (placeholder until a
	     score arrives, verbatim as on the Ilya page); the composer slot
	     carries the voice-qualified formant-profile line (Dann's header
	     ruling, 2026-07-12).

	     Item 1.8, 2026-08-05: this passed `title=""` and had done since the
	     envelope was written, so the comment above described an intent the
	     code never carried out. A singer with «Gretchen am Spinnrade» in the
	     drawer printed a Fit sheet that could not name its own subject.
	     OBSERVED by Dann in a browser print preview on dc7cf09. The score
	     branch at :503 was already passing `scoreTitle`; this is the envelope
	     catching up to it, not a new decision. An empty title still falls
	     through to TitleHeader's own placeholder, so the no-metadata state is
	     unchanged. -->
	<TitleHeader
		title={scoreTitle ?? ''}
		composer={subtitle}
		poet=""
		translator=""
		opus=""
		{language}
		onheightchange={handleHeaderHeight}
		versionAccent="#8E7E9B"
		markAccent="#8E7E9B"
		ruleAccent="#8E7E9B"
	/>

	<!-- Content layer: the envelope's interim states, centred in the
	     window between header and footer. The eventual score state mounts
	     in this same window (§B build order). -->
	<div class="profile-content" style="top: {contentTop}px; bottom: {contentBottom}px;">
		{#if hasReadings}
			<div class="profile-copy">
				<p class="profile-line profile-lede">
					{T('profile.lede')}
				</p>
				<p class="profile-line profile-status">
					{statusLine}
				</p>
				<p class="profile-line profile-status">
					{#if provisionalVowels.length > 0}{provisionalParts[0]}{#each provisionalVowels as g, i (g)}{listSep(
								i,
								provisionalVowels.length
							)}{@render vowelGlyph(g)}{/each}{provisionalParts[1] ?? ''}{:else}{T(
							'profile.provisional.noneMessage'
						)}{/if}
				</p>
			</div>
		{:else}
			<!-- Pre-calibration empty state: a single line by ruling. -->
			<p class="profile-empty">{T('profile.emptyState')}</p>
		{/if}
	</div>

	<!-- Footer layer: the full PageFooter, pinned to the bottom margin.
	     No provenance legend items yet; the legend row simply stays empty
	     until the score pane brings provenance to this surface. -->
	<PageFooter pageNumber={1} totalPages={1} {language} legendItems={fitLegend} hairlineAccent="#8E7E9B" />
</article>
{/if}

<style>
	/* The envelope page: TitlePage's .paper-page geometry, twinned so the
	   eventual score pages replace the content window with no reframing. */
	.paper-page {
		position: relative;
		box-sizing: border-box;
		background: var(--paper-cream);
		box-shadow: 0 1px 6px rgba(0, 0, 0, 0.1);
		flex-shrink: 0;
	}

	/* ── Content window ────────────────────────────────────── */

	/* The typography ruling (Dann, 2026-07-12): one reading size,
	   left-justified, a document rather than an eye chart. The body sets
	   in the Transcription empty-state's measure (serif italic, 1rem),
	   aligned to the page's text column; the quiet furniture below keeps
	   its own smaller sans register but shares the left edge. Vertical
	   centring within the content window stays. */
	.profile-content {
		position: absolute;
		left: 96px;
		right: 96px;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: center;
		text-align: left;
	}

	.profile-copy {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 1rem;
		max-width: 34rem;
	}

	.profile-line {
		margin: 0;
		/* Match the Transcription empty-state ("Enter your Cyrillic text…"):
		   serif italic, 1rem, 1.6 leading. Left-justified via .profile-content,
		   and each sentence sits on its own line (Dann, 2026-07-13). */
		font-family: var(--font-serif, 'Source Serif 4', serif);
		font-style: italic;
		font-size: 1rem;
		line-height: 1.6;
	}

	.profile-lede {
		color: var(--ink-primary, #1a1612);
	}

	.profile-status {
		color: var(--ink-secondary, #4a4540);
	}

	/* The IPA glyphs keep the calibration surfaces' IPA face, with the
	   wizard's 0.3em breath between glyph and informal name. */
	.profile-ipa {
		font-family: 'Lato IPA', sans-serif;
		margin-right: 0.3em;
	}

	.profile-empty {
		margin: 0;
		font-family: var(--font-serif, 'Source Serif 4', serif);
		font-size: 1.05rem;
		line-height: 1.75;
		color: var(--ink-secondary, #4a4540);
	}

	/* ── Score state (live wiring slice 1) ─────────────────── */

	/* Mirrors Paper.svelte's .paper-container so a multi-page score
	   stacks with the same rhythm as the transcription document. */
	.fit-paper-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2rem;
		padding-bottom: 2rem;
	}


	/* The content window a score page renders into: the same left/right
	   text column as .profile-content, top set inline per page type. The
	   SVG keeps its 1:1 scale (viewBox width equals the window width) and
	   anchors to the top of the window. */
	.score-window {
		position: absolute;
		left: 96px;
		right: 96px;
		overflow: hidden;
	}

	.score-window :global(svg) {
		display: block;
		width: 100%;
		height: auto;
	}

	/* ── The trailing notes page (design C, §7.1) ──────────── */

	/* The notes page's content window: the same text column as the score, a
	   column of the octave notice then the "Places to watch" band. The octave
	   notice and band render AFTER the score on their own sheet (Dann's
	   placement ruling, 2026-07-18). First-pass treatment; design is Dann's. */
	.commentary-window {
		position: absolute;
		left: 96px;
		right: 96px;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		overflow: hidden;
	}

	.octave-notice {
		box-sizing: border-box;
		font-family: var(--font-serif, 'Source Serif 4', serif);
		font-style: italic;
		font-size: 0.92rem;
		line-height: 1.5;
		color: var(--ink-secondary, #4a4540);
	}

	/* Item 1.8, the withheld statement. Twinned on .watch-band deliberately:
	   it stands in the place the watch list would have stood, so it should
	   carry the same weight rather than read as a warning. Same squircle, same
	   lavender, same small-caps header. The only departure is the closing line,
	   which is italic serif to match .octave-notice, because it is a remark
	   about the page rather than an item in a list. */
	.withheld {
		box-sizing: border-box;
		border: 1px solid #8e7e9b;
		border-radius: 12px;
		padding: 0.7rem 1.1rem 0.8rem;
		background: var(--paper-cream);
	}

	.withheld-heading {
		margin: 0 0 0.35rem;
		font-family: var(--font-sans, 'Source Sans 3', sans-serif);
		font-variant: small-caps;
		letter-spacing: 0.06em;
		font-size: 0.8rem;
		color: #8e7e9b;
	}

	.withheld-lede {
		margin: 0 0 0.5rem;
		font-family: var(--font-serif, 'Source Serif 4', serif);
		font-size: 0.9rem;
		line-height: 1.45;
		color: var(--ink-secondary, #4a4540);
	}

	.withheld-list {
		margin: 0 0 0.5rem;
		padding-left: 1.1rem;
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
	}

	.withheld-line {
		font-family: var(--font-serif, 'Source Serif 4', serif);
		font-size: 0.9rem;
		line-height: 1.45;
		color: var(--ink-secondary, #4a4540);
	}

	.withheld-close {
		margin: 0;
		font-family: var(--font-serif, 'Source Serif 4', serif);
		font-style: italic;
		font-size: 0.9rem;
		line-height: 1.45;
		color: var(--ink-secondary, #4a4540);
	}

	/* Outline-only lavender squircle; an in-flow block below the score. */
	.watch-band {
		box-sizing: border-box;
		border: 1px solid #8e7e9b;
		border-radius: 12px;
		padding: 0.7rem 1.1rem 0.8rem;
		background: var(--paper-cream);
	}

	.watch-band-header {
		margin: 0 0 0.35rem;
		font-family: var(--font-sans, 'Source Sans 3', sans-serif);
		font-variant: small-caps;
		letter-spacing: 0.06em;
		font-size: 0.8rem;
		color: #8e7e9b;
	}

	.watch-band-list {
		margin: 0;
		padding: 0;
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
	}

	.watch-band-line {
		font-family: var(--font-serif, 'Source Serif 4', serif);
		font-size: 0.9rem;
		line-height: 1.45;
		color: var(--ink-secondary, #4a4540);
	}

	/* ── Print rules (parity with TitlePage) ───────────────── */

	@media print {
		.paper-page {
			box-shadow: none;
			background: white;
		}
	}
</style>
