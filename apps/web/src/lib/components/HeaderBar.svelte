<script lang="ts">
	import { t, type Language } from '$lib/i18n';
	import type { TabId } from '$lib/destinations';
	import { INCLUDE_SHANE } from '$lib/wall';

	interface Props {
		language: Language;
		activeTab: TabId;
		onlanguagechange: (lang: Language) => void;
		/**
		 * N.114a, RULED BY DANN 2026-09-09 from the user's side: "the button is
		 * hard to find." Undo and Redo left the Corrections dock for the top
		 * bar, which is the one strip that is in the same place whatever is
		 * scrolled, open, or taken over.
		 *
		 * THE LABELS ARE THE PAGE'S, not this component's: `stackLabel` in
		 * `+page.svelte` composes them from the same two stacks the hotkeys
		 * use, so a press and a Cmd-Z cannot diverge. `null` means the stack is
		 * empty.
		 */
		undoLabel?: string | null;
		redoLabel?: string | null;
		onundo?: () => void;
		onredo?: () => void;
	}

	let {
		language,
		activeTab,
		onlanguagechange,
		undoLabel = null,
		redoLabel = null,
		onundo,
		onredo,
	}: Props = $props();

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

	/* THE VERB WITHOUT ITS CLAUSE, for the state where there is nothing to name.
	   NO STRING IS COINED: `loupe.undo` is `Undo: %s` and `Annuler\u00a0: %s`,
	   and `loupe.redo` is `Redo: %s`, so dropping the argument and the
	   separator that introduces it leaves the verb the ratified string already
	   contains. `\s` matches the non-breaking space, which is what carries the
	   French spacing before the colon.

	   The DESK DEFAULT this serves, reversible in one line: both buttons are
	   always drawn and are disabled when their stack is empty, so their place is
	   learned before it is needed. Absent-when-empty is the dock's old rule and
	   is one `{#if}` away. */
	const verbOnly = (key: string) => t(key, language).replace(/[\s:]*%s\s*$/, '');

	const undoText = $derived(
		undoLabel ? t('loupe.undo', language).replace('%s', undoLabel) : verbOnly('loupe.undo')
	);
	const redoText = $derived(
		redoLabel ? t('loupe.redo', language).replace('%s', redoLabel) : verbOnly('loupe.redo')
	);
</script>

<header
	class="header-bar"
	class:tab-transcription={activeTab === 'transcription'}
	class:tab-learn={activeTab === 'learn'}
	class:tab-guide={activeTab === 'guide'}
	class:tab-shane={activeTab === 'shane'}
>
	<h1 class="sr-only">{language === 'fr' ? 'Ilya — Diction lyrique russe' : 'Ilya — Russian Lyric Diction'}</h1>
	<div class="sigil" aria-label="Ilya 2026a">
		<span class="sigil-bracket">[</span><span class="sigil-name">Ilya</span><span class="sigil-bracket">]</span><span class="sigil-version">2026a</span>
	</div>

	<!-- N.114a. THE RIGHT END OF THE BAR: Undo, Redo, then the language pill,
	     which keeps the far corner it has always had.

	     BEHIND THE WALL, like the pair in `DeskHead`. Every `pushUndo` in the
	     tree is a score-correction verb, so a wall-closed build has a stack
	     that can never fill and two buttons that could never act.

	     EACH SAYS WHAT IT WILL DO, which is the ruling: the sentence is the
	     label, not a tooltip. It clips with an ellipsis rather than wrapping,
	     because the bar is one line tall on every display. -->
	<div class="head-right">
		{#if INCLUDE_SHANE}
			<button
				type="button"
				class="head-pill"
				class:has-clause={!!undoLabel}
				disabled={!undoLabel}
				onclick={() => onundo?.()}
			>
				<span aria-hidden="true">&#x21B0;</span>
				<span class="head-pill-text">{undoText}</span>
			</button>
			<button
				type="button"
				class="head-pill"
				class:has-clause={!!redoLabel}
				disabled={!redoLabel}
				onclick={() => onredo?.()}
			>
				<span aria-hidden="true">&#x21B1;</span>
				<span class="head-pill-text">{redoText}</span>
			</button>
		{/if}
		<button type="button" class="lang-pill" lang={other} onclick={switchLanguage}>{label}</button>
	</div>
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
		background: var(--sage, #8B9A7D);
	}

	.header-bar.tab-learn {
		background: var(--dusty-rose, #A67B7B);
	}

	.header-bar.tab-guide {
		background: var(--quiet-cobalt, #5C739E);
	}

	/* FOUR destinations, four hues. Ruled by Dann 2026-08-19 during the
	   walk: every distinct working surface carries its own hue. This amends
	   the app-bar half of the 2026-08-18 ruling above, which had folded the
	   Marked score into Studio's sage, and it amends S0 ruling 3. The bar and
	   the desk move together; the desk is --surround-marked in app.css. The
	   three sibling rules below (the sigil version, the inactive language
	   option, and its hover underline) already key to --deeper-lavender and
	   were never changed. */
	.header-bar.tab-shane {
		background: var(--deeper-lavender, #8E7E9B);
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
		background: var(--deeper-sage, #7A8A6C);
	}

	.tab-learn .sigil-version {
		background: #8F6A6A;
	}

	.tab-guide .sigil-version {
		background: #4D6387;
	}

	/* Deeper shade of --deeper-lavender (#8E7E9B), computed the same way the
	   Learn and Guide deepened badge shades were hand-picked, not a token
	   that exists yet. If Kimi or Dann want a precise locked value, this is
	   the one to revisit. */
	.tab-shane .sigil-version {
		background: #74677F;
	}

	/* ── N.114a. THE RIGHT END ──────────────────────────────
	   One group so the three controls share a gap and the pill keeps the far
	   corner. `min-width: 0` is what lets the two sentences clip instead of
	   pushing the pill off the bar. */
	.head-right {
		display: flex;
		align-items: center;
		gap: 8px;
		min-width: 0;
	}

	/* PILL ENDS, the 2026-09-03 ruling `IntakePanel.svelte`'s `.action-btn`
	   carries, said here because Svelte scopes a rule to the file that writes
	   the markup. The FILL is this bar's own idiom and not the drawer's: the
	   band's hue one step down with white on it, which is what `.lang-pill`
	   already does, so the right end reads as one group of chips rather than
	   two drawer buttons pasted onto a coloured strip. The four `--lang-chip-*`
	   values are `app.css`'s and none is new.

	   44 px ON EVERY POINTER, not only a coarse one, because the bar is 48 px
	   tall on every display and a floor that changed with the pointer would
	   change the bar's own geometry. */
	.head-pill {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		min-height: 44px;
		min-width: 0;
		/* ONLY A PILL CARRYING A CLAUSE MAY SHRINK. MEASURED at 390 px: with
		   `flex: 0 1 auto` on both, an empty Redo was squeezed to `R…`, which
		   says less than nothing. A pill with no clause is four characters and
		   holds its width; a pill with a clause gives ground and clips the
		   clause, keeping its verb. So the bar's narrowest honest state is
		   `Undo: syllable…` beside `Redo`, and never a truncated verb. */
		flex: 0 0 auto;
		padding: 4px 12px;
		border: none;
		border-radius: 999px;
		font-family: var(--font-sans);
		font-size: 13px;
		font-weight: 500;
		line-height: 1;
		color: white;
		cursor: pointer;
		transition: background-color 300ms ease, opacity 150ms ease;
	}

	.head-pill.has-clause {
		flex: 0 1 auto;
	}

	/* The sentence clips; it never wraps. The bar is one line tall, so a second
	   line would push the sigil and the pill out of it. */
	.head-pill-text {
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.tab-transcription .head-pill {
		background: var(--lang-chip-transcription, #6C7A5F);
	}

	.tab-learn .head-pill {
		background: var(--lang-chip-learn, #9A6A6A);
	}

	.tab-guide .head-pill {
		background: var(--lang-chip-guide, #5C739E);
		box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.22);
	}

	.tab-shane .head-pill {
		background: var(--lang-chip-marked, #806E8E);
	}

	/* DIMMED AND DISABLED, not absent. The dock's rule was "a control that
	   cannot act earns no ink"; N.114a's desk default trades it for a place
	   that can be learned, since the whole ruling is that the button was hard
	   to find. One `{#if}` restores the old rule. */
	.head-pill:disabled {
		opacity: 0.45;
		cursor: not-allowed;
	}

	.head-pill:hover:not(:disabled) {
		text-decoration: underline;
		text-decoration-thickness: 2px;
		text-underline-offset: 3px;
	}

	.head-pill:focus-visible {
		outline: 2px solid white;
		outline-offset: 2px;
	}

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
	   hairline, because its chip IS its band. The four values live in
	   app.css. */

	.tab-transcription .lang-pill {
		background: var(--lang-chip-transcription, #6C7A5F);
	}

	.tab-learn .lang-pill {
		background: var(--lang-chip-learn, #9A6A6A);
	}

	.tab-guide .lang-pill {
		background: var(--lang-chip-guide, #5C739E);
		box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.22);
	}

	.tab-shane .lang-pill {
		background: var(--lang-chip-marked, #806E8E);
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
