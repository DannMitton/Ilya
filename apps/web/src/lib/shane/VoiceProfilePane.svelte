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
	 * The two interim states (copy LOCKED, Dann's register, 2026-07-11):
	 * - Pre-calibration: the single line "Calibrate your voice to begin."
	 * - Post-calibration: the centred copy trio, with line two's count and
	 *   provisional-vowel list computed from the active voice's readings.
	 *   Beneath it, the quiet non-animated "Workshop" wayfinding cue toward
	 *   the drawer (Kimi's refinement: singers must discover the drawer),
	 *   and the non-actionable forward pointer for the coming score surface.
	 *   No score-input control is wired anywhere here — "Please input your
	 *   score…" ships only when ingestion is live (never advertise an
	 *   action that isn't wired).
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
	 * Body copy is EN-only for now, matching the calibration surfaces (the
	 * calibration-UI French pass is the standing open item, v29/v30); the
	 * header and footer components are already bilingual through t().
	 */
	import TitleHeader from '$lib/components/Paper/TitleHeader.svelte';
	import PageFooter from '$lib/components/Paper/PageFooter.svelte';
	import { PAGE_SIZES, MARGINS, FOOTER_MAX_HEIGHT, GAP } from '$lib/page-config';
	import type { PageSize } from '$lib/types';
	import type { Language } from '$lib/i18n';
	import { SPOKEN_NAME } from '$lib/shane/pacifier/Pacifier.svelte';
	import type { Vowel, CalibratedFormant } from '$lib/shane/engine/types';

	interface Props {
		/** The active voice's stored readings (direct samples only). */
		formants: Partial<Record<Vowel, CalibratedFormant>>;
		/** The active voice's name; undefined before first-launch naming. */
		voiceName?: string;
		language: Language;
		/** Mirrors Paper.svelte's prop; the page shell passes letter today. */
		pageSize?: PageSize;
	}

	let { formants, voiceName = undefined, language, pageSize = 'letter' }: Props = $props();

	const dims = $derived(PAGE_SIZES[pageSize]);

	// The subtitle rides TitleHeader's first metadata line (the composer
	// slot on the transcription page), which renders it in the same
	// small-caps register. Wording from the wizard's Welcome copy.
	const SUBTITLE = 'Formant profile: a map of your voice’s resonances';

	// The roster's canonical display order (wizard spec v1 §2: the seven
	// defaults in the fixed counterclockwise order, then the three optional
	// vowels), so the trio lists provisional vowels in the same order the
	// singer sees them in the workshop roster.
	const ROSTER_ORDER: Vowel[] = ['i', 'e', 'ɛ', 'a', 'ɑ', 'o', 'u', 'ɨ', 'ɪ', 'ʌ'];

	// Counts are spelled out in the locked copy's register ("Seven vowels
	// are captured"), so the words live here; the roster caps at ten.
	const COUNT_WORDS = [
		'No',
		'One',
		'Two',
		'Three',
		'Four',
		'Five',
		'Six',
		'Seven',
		'Eight',
		'Nine',
		'Ten'
	];

	let capturedVowels = $derived(ROSTER_ORDER.filter((g) => formants[g]?.reading === 'captured'));
	let provisionalVowels = $derived(
		ROSTER_ORDER.filter((g) => formants[g]?.reading === 'provisional')
	);
	let hasReadings = $derived(Object.keys(formants).length > 0);

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

	function countWord(n: number): string {
		return COUNT_WORDS[n] ?? String(n);
	}

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
	Vowel glyph for the trio's provisional list: the locked copy shows the
	bare bracketed glyph ("[i], [e], and [o]"), so unlike the wizard's
	vowelTag there is no visible informal name — but the §4.6 speakable-name
	discipline still holds: the glyph is aria-hidden and a visually hidden
	spoken name carries it to screen readers, which otherwise collapse
	[ɪ]/[ɨ] onto "ee".
-->
{#snippet vowelGlyph(g: Vowel)}<span class="profile-ipa" aria-hidden="true">[{g}]</span><span
		class="visually-hidden">{SPOKEN_NAME[g]}</span
	>{/snippet}

<article
	class="paper-page profile-page"
	style="width: {dims.width}px; height: {dims.height}px;"
	aria-label="Voice profile"
>
	<!-- Header layer: the same TitleHeader the transcription page renders,
	     pinned to the top margin. Title = the voice's name; the composer
	     slot carries the formant-profile subtitle. -->
	<TitleHeader
		title={voiceName ?? 'Your voice'}
		composer={SUBTITLE}
		poet=""
		translator=""
		opus=""
		{language}
		onheightchange={handleHeaderHeight}
	/>

	<!-- Content layer: the envelope's interim states, centred in the
	     window between header and footer. The eventual score state mounts
	     in this same window (§B build order). -->
	<div class="profile-content" style="top: {contentTop}px; bottom: {contentBottom}px;">
		{#if hasReadings}
			<div class="profile-copy">
				<p class="profile-line profile-lede">
					Here is your voice, mapped across the ten Russian vowels.
				</p>
				<p class="profile-line profile-status">
					{#if capturedVowels.length > 0}{countWord(capturedVowels.length)}
						{capturedVowels.length === 1 ? 'vowel is' : 'vowels are'} captured.{/if}
					{#if provisionalVowels.length > 0}Your
						{#each provisionalVowels as g, i (g)}{listSep(
								i,
								provisionalVowels.length
							)}{@render vowelGlyph(g)}{/each}
						{provisionalVowels.length === 1 ? 'is' : 'are'} provisional, sound enough to use now.{/if}
				</p>
				<p class="profile-line profile-status">
					Your profile is now set, but you can re-take samples anytime.
				</p>
			</div>
			<!-- The Workshop wayfinding cue (Kimi's refinement, 2026-07-11):
			     quiet and deliberately non-animated, pointing at the drawer,
			     where the F1/F2 chart and the readings roster live by ruling
			     (the plot is instrumentation, not the steak). Informational
			     text, not a control: opening the drawer stays the drawer's
			     own affordance. -->
			<p class="profile-workshop">
				<span class="profile-workshop-chevron" aria-hidden="true">‹</span>
				Workshop: your readings and vowel chart live in the drawer.
			</p>
			<!-- The non-actionable forward pointer for the coming score
			     surface. The line is the shipped placeholder copy carried
			     forward; no input control accompanies it by ruling. -->
			<p class="profile-forward">Your repertoire-fit results will appear here.</p>
		{:else}
			<!-- Pre-calibration empty state: a single line by ruling. -->
			<p class="profile-empty">Calibrate your voice to begin.</p>
		{/if}
	</div>

	<!-- Footer layer: the full PageFooter, pinned to the bottom margin.
	     No provenance legend items yet; the legend row simply stays empty
	     until the score pane brings provenance to this surface. -->
	<PageFooter pageNumber={1} totalPages={1} {language} legendItems={[]} />
</article>

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

	.profile-content {
		position: absolute;
		left: 96px;
		right: 96px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
	}

	.profile-copy {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		max-width: 34rem;
	}

	.profile-line {
		margin: 0;
		font-family: var(--font-serif, 'Source Serif 4', serif);
		line-height: 1.6;
	}

	.profile-lede {
		font-size: 1.35rem;
		font-weight: 500;
		color: var(--ink-primary, #1a1612);
	}

	.profile-status {
		font-size: 1.05rem;
		color: var(--ink-secondary, #4a4540);
	}

	/* The IPA glyphs keep the calibration surfaces' IPA face. */
	.profile-ipa {
		font-family: 'Lato IPA', sans-serif;
	}

	/* Quiet wayfinding: no animation, no transition, tertiary ink. */
	.profile-workshop {
		margin: 3rem 0 0;
		font-family: var(--font-ui, var(--font-sans, sans-serif));
		font-size: 0.875rem;
		color: var(--ink-tertiary, #6a655f);
	}

	.profile-workshop-chevron {
		margin-right: 0.25em;
	}

	.profile-forward {
		margin: 0.5rem 0 0;
		font-family: var(--font-ui, var(--font-sans, sans-serif));
		font-size: 0.875rem;
		color: var(--ink-tertiary, #6a655f);
	}

	.profile-empty {
		margin: 0;
		font-family: var(--font-serif, 'Source Serif 4', serif);
		font-size: 1.1rem;
		color: var(--ink-secondary, #4a4540);
	}

	.visually-hidden {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0 0 0 0);
		white-space: nowrap;
		border: 0;
	}

	/* ── Print rules (parity with TitlePage) ───────────────── */

	@media print {
		.paper-page {
			box-shadow: none;
			background: white;
		}
	}
</style>
