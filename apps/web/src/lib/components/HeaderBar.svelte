<script lang="ts">
	import { t, type Language } from '$lib/i18n';
	import type { TabId } from '$lib/destinations';

	interface Props {
		language: Language;
		activeTab: TabId;
		onlanguagechange: (lang: Language) => void;
		/* `undoLabel`, `redoLabel`, `onundo`, `onredo` AND `drawerWidth` ARE
		   GONE, N.115 increment 3. RULED BY DANN 2026-09-10 late: "I hate where
		   they are placed." Undo and Redo left this bar for the right end of the
		   SCORE MARKUP band header (`Drawer.svelte`, `bandHead`), and the bar
		   keeps the sigil and the language toggle. `drawerWidth` existed only to
		   stand the pair flush with the drawer's edge (N.114b), so it went with
		   them. */
	}

	let { language, activeTab, onlanguagechange }: Props = $props();

	/* ONE control, and it names the language the singer is NOT in. Ruled by
	   Dann 2026-08-20. The pattern is Canada.ca's, which he adopted for
	   convention and familiarity rather than compliance; he is not bound by
	   it. The pair of aria-pressed spans that stood here was built, never
	   decided.

	   The label is an autonym and is deliberately NOT routed through t():
	   on an English page the word is French and on a French page it is
	   English, so a translated string would say the wrong thing in both.
	   The visible word therefore carries its own `lang` in the template,
	   which is what stops a screen reader pronouncing "Français" with
	   English phonetics. */
	const other = $derived<Language>(language === 'en' ? 'fr' : 'en');
	const label = $derived(other === 'fr' ? 'Français' : 'English');

	function switchLanguage() {
		onlanguagechange(other);
	}
</script>

<header
	class="header-bar"
	class:tab-transcription={activeTab === 'transcription'}
	class:tab-learn={activeTab === 'learn'}
	class:tab-guide={activeTab === 'guide'}
	class:tab-shane={activeTab === 'shane'}
	class:tab-insights={activeTab === 'insights'}
>
	<h1 class="sr-only">{language === 'fr' ? 'Ilya — Diction lyrique russe' : 'Ilya — Russian Lyric Diction'}</h1>
	<div class="sigil" aria-label="Ilya 2026a">
		<span class="sigil-bracket">[</span><span class="sigil-name">Ilya</span><span class="sigil-bracket">]</span><span class="sigil-version">2026a</span>
	</div>

	<!-- TWO CHILDREN AGAIN, N.115 increment 3: the sigil at the left and the
	     language pill at the right, packed by the header's own
	     `space-between`, which is what the bar drew before N.114a. -->
	<button type="button" class="lang-pill" lang={other} onclick={switchLanguage}>{label}</button>
</header>

<style>
	.header-bar {
		height: 48px;
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 16px;
		border-bottom: none;
		transition: background-color 300ms ease;
	}

	/* ── Tab-responsive background ────────────────────────── */

	.header-bar.tab-transcription {
		background: var(--sage, #839275);
	}

	.header-bar.tab-learn {
		background: var(--umber, #A38669);
	}

	.header-bar.tab-guide {
		background: var(--cobalt, #748CB9);
	}

	/* FOUR destinations, four hues. Ruled by Dann 2026-08-19 during the
	   walk: every distinct working surface carries its own hue. This amends
	   the app-bar half of the 2026-08-18 ruling above, which had folded the
	   Marked score into Studio's sage, and it amends S0 ruling 3. The bar and
	   the desk move together; the desk is --lavender-desk in app.css. The
	   three sibling rules below (the sigil version, the inactive language
	   option, and its hover underline) already key to --lavender and
	   were never changed. */
	.header-bar.tab-shane {
		background: var(--lavender, #9585A2);
	}

	/* N.127 increment 1. Insights' governing colour is dusty rose, ruled by
	   Dann 2026-09-11, so the bar takes rose. Learn carried rose too until
	   stage 4 of the colour story moved it to umber, 2026-09-14; Insights
	   keeps rose, and its sigil version and language chip below keep rose's
	   values. */
	.header-bar.tab-insights {
		background: var(--rose, #AB7F7F);
	}

	/* ── [Ilya] sigil: version nestled in y descender ─────── */

	.sigil {
		position: relative;
		display: inline-flex;
		align-items: baseline;
		gap: 0;
		user-select: none;
	}

	.sigil-bracket {
		font-family: var(--font-mono, 'SF Mono', 'Fira Code', 'Cascadia Code', monospace);
		font-size: 22px;
		color: white;
		font-weight: 400;
	}

	.sigil-name {
		font-family: var(--font-serif);
		font-size: 22px;
		font-style: italic;
		color: white;
		font-weight: 400;
	}

	.sigil-version {
		position: absolute;
		top: 26px;
		left: 34px;
		font-family: var(--font-sans);
		font-size: 10px;
		color: rgba(255, 255, 255, 0.8);
		font-weight: 600;
		font-variant-caps: all-small-caps;
		letter-spacing: 0.04em;
		line-height: 1;
		padding: 0 3px;
		border-radius: 2px;
		transition: background-color 300ms ease;
	}

	.tab-transcription .sigil-version {
		background: var(--sage-deep, #7A8A6C);
	}

	.tab-learn .sigil-version {
		background: var(--umber-chip, #82664A);
	}

	.tab-guide .sigil-version {
		background: #4D6387;
	}

	/* Deeper shade of --lavender as it stood before stage 4 (#8E7E9B), computed the same way the
	   Learn and Guide deepened badge shades were hand-picked, not a token
	   that exists yet. If Kimi or Dann want a precise locked value, this is
	   the one to revisit. */
	.tab-shane .sigil-version {
		background: #74677F;
	}

	.tab-insights .sigil-version {
		background: #8F6A6A;
	}

	/* `.head-right`, `.head-pill` AND THE 1400 px ANCHOR THAT STOOD THE PAIR
	   OVER THE DRAWER'S EDGE ARE GONE with the pair, N.115 increment 3. The
	   pill ends, the band-inset padding and the dimmed-when-empty rule they
	   carried were the pair's alone; the pair on the band is drawn only
	   while its stack holds something. */

	/* ── The language pill ───────────────────────────────── */
	/* ONE control. It is a <button> because it changes application state
	   and does not navigate, and its own word is its accessible name, per
	   the Canada.ca pattern and WCAG's label-in-name. No aria-label sits
	   over it and no aria-pressed describes it: with one pill there is no
	   pressed state left to name.

	   The radius and the padding are unchanged from the pair. Spec §3.2,
	   the three radii, "full-round only for toggle knobs and the language
	   pills" (docs/sessions/fable-gui-audit-and-spec_r1_2026-08-18.md),
	   and that shape was ruled rather than chosen here. */

	.lang-pill {
		font-family: var(--font-sans);
		font-size: 13px;
		font-weight: 500;
		color: white;
		border: none;
		cursor: pointer;
		transition: background-color 300ms ease;
		user-select: none;
		line-height: 1;
		padding: 4px 12px;
		border-radius: 9999px;
		white-space: nowrap;
	}

	/* The chip is the band's own hue one step down, white on it, ratified
	   by Dann 2026-08-20 as option D from a drawing. Guide alone takes the
	   hairline, drawn because its chip was its band; since stage 4
	   (2026-09-14) the chip has its own value and the hairline was left in
	   place. The five values live in app.css. */

	.tab-transcription .lang-pill {
		background: var(--sage-chip, #637156);
	}

	.tab-learn .lang-pill {
		background: var(--umber-chip, #82664A);
	}

	.tab-guide .lang-pill {
		background: var(--cobalt-chip, #556C96);
		box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.22);
	}

	.tab-shane .lang-pill {
		background: var(--lavender-chip, #746580);
	}

	.tab-insights .lang-pill {
		background: var(--rose-chip, #885F60);
	}

	/* Hover is NOT ruled by the brief and this is the smallest thing that
	   invents nothing. The pair's hover drew an underline in the band's own
	   hue; that colour cannot survive here, because on Guide the chip IS
	   the band and the underline would vanish. So the underline stays and
	   takes the text's own white, which is one declaration for all four and
	   already measured against every chip. */
	.lang-pill:hover {
		text-decoration: underline;
		text-decoration-thickness: 2px;
		text-underline-offset: 3px;
	}

	.lang-pill:focus-visible {
		outline: 2px solid white;
		outline-offset: 2px;
	}

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border-width: 0;
	}
</style>
