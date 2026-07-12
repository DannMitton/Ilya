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
		`Formant profile: a map of ${voiceName ? `${voiceName}’s` : 'your voice’s'} resonances`,
	);

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

	// Built as an expression so the leading space survives Svelte's
	// block-boundary whitespace trimming (the "setwith" bug, caught by
	// Dann in live testing, 2026-07-12).
	let capturedClause = $derived(
		capturedVowels.length > 0
			? ` with ${countWord(capturedVowels.length).toLowerCase()} ${
					capturedVowels.length === 1 ? 'vowel' : 'vowels'
				} successfully captured`
			: '',
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

<article
	class="paper-page profile-page"
	style="width: {dims.width}px; height: {dims.height}px;"
	aria-label="Voice profile"
>
	<!-- Header layer: the same TitleHeader the transcription page renders,
	     pinned to the top margin. Title = the song's (placeholder until a
	     score arrives, verbatim as on the Ilya page); the composer slot
	     carries the voice-qualified formant-profile line (Dann's header
	     ruling, 2026-07-12). -->
	<TitleHeader
		title=""
		composer={subtitle}
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
					Your repertoire-fit results will appear here once you upload your score.
				</p>
				<p class="profile-line profile-status">
					Your profile is now set{capturedClause}.
					{#if provisionalVowels.length > 0}Your
						{#each provisionalVowels as g, i (g)}{listSep(
								i,
								provisionalVowels.length
							)}{@render vowelGlyph(g)}{/each}
						{provisionalVowels.length === 1 ? 'is' : 'are'} provisional, and you can update
						{provisionalVowels.length === 1 ? 'this value' : 'these values'} anytime through the
						drawer on the left.{:else}You can update these values anytime through the drawer on
						the left.{/if}
				</p>
			</div>
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

	/* The typography ruling (Dann, 2026-07-12): one reading size,
	   left-justified, a document rather than an eye chart. The body sets
	   in the reading papers' measure (serif, 1.05rem, generous leading),
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
		font-family: var(--font-serif, 'Source Serif 4', serif);
		font-size: 1.05rem;
		line-height: 1.75;
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

	/* ── Print rules (parity with TitlePage) ───────────────── */

	@media print {
		.paper-page {
			box-shadow: none;
			background: white;
		}
	}
</style>
