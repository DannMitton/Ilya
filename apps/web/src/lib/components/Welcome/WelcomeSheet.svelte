<script lang="ts">
	/**
	 * THE WELCOME SHEET (lane `cloud-lane-57`, brief r2). Shown over the app on a browser's first visit, before anything else is usable, until the
	 * singer chooses Begin; then `ilya:welcomeSeen` is written and a returning browser never sees it. Design RATIFIED by Dann 2026-11-15 01:30
	 * (English and design) and 01:38 (French): `docs/memory/OPEN.md`, "THE WELCOME SHEET, EN AND FR, RATIFIED". The prototypes it reproduces are
	 * `docs/sessions/welcome-sheet/ilya-welcome-draft-17.html` and `-17-fr.html`; the critique is `critique-fable-welcome_r1.md`.
	 *
	 * BUILT THE WAY THE CARDS ARE: a `<div role="dialog" aria-modal="true">` moved to `<body>` by `use:portal`, over a full-viewport scrim, as
	 * `KeySignatureCard.svelte` and `TimeSignatureControls.svelte` are, and NOT a native `<dialog>`: `app.css` resets `margin: 0`, which breaks a
	 * `showModal()` dialog's centring, and the `close` event does not fire in the in-app browser pane (`docs/memory/ENVIRONMENT.md`, "`app.css:93`
	 * BREAKS NATIVE MODALS" and "`<dialog>`'s `close` EVENT DOES NOT FIRE"). Nothing here waits on a `close` event. Two differences from the cards, both
	 * the brief's: focus is TRAPPED (the cards' is not), and ESCAPE DOES NOTHING (the singer must choose Begin).
	 *
	 * BEFORE ANYTHING ELSE IS USABLE: while it is open the app (`.app-shell`, `+layout.svelte`) is `inert`, so nothing behind the scrim takes a key or
	 * a tap, and the sheet stands over the install banner (z-index 9000) and the clef chip because it sits at 9400. It does not delay the dictionary or the
	 * service worker: it mounts beside `HeaderBar`, reads one localStorage key, and awaits nothing (`+page.svelte`'s `loadDictionary` is not awaited, and
	 * the service worker is registered from `app.html`). It never prints.
	 *
	 * THE LANGUAGE follows the app's. The pill is the header pill's rule (`language-switch.ts`) and calls the page's one `handleLanguageChange`.
	 * THE PLATE is `WelcomePlate.svelte`; the motion is `welcome-motion.ts`, once, about 5.5 s, all text readable and Begin usable from the first frame.
	 * DESK DEFAULT: focus lands on the SCROLLING TEXT (`.body`, `tabindex="-1"`), not on Begin, so the first Enter does not skip the reading (critique, open
	 * item 6) and the arrow keys, Space, Page Down, and End scroll the text at once. It used to land on the sheet, which is not the scroller: at 1280 x 600 the text
	 * overflows and no key scrolled it (the desk's review, 2026-11-16). Tab reaches the links, then Begin; Shift+Tab reaches the language pill.
	 */
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { t, type Language } from '$lib/i18n';
	import { languageSwitch } from '$lib/language-switch';
	import { hasSeenWelcome, markWelcomeSeen } from '$lib/welcome-seen';
	import WelcomePlate from './WelcomePlate.svelte';
	import { FINAL, FIRST_FRAME, LEAVE_MS, STATION_OF_IMAGE, plan } from './welcome-motion';

	let { language, onlanguagechange }: { language: Language; onlanguagechange: (lang: Language) => void } = $props();

	const prefersReducedMotion = (): boolean => {
		try {
			return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		} catch {
			return false;
		}
	};

	/** Decided at init, before the first paint, so a first visit never flashes the app and a returning browser never builds the sheet. */
	let open = $state(browser ? !hasSeenWelcome(() => localStorage) : false);
	let leaving = $state(false);
	const reduced = browser ? prefersReducedMotion() : false;
	let animate = $state(!reduced);
	let turned = $state(reduced ? FINAL.turned : FIRST_FRAME.turned);
	let station = $state(reduced ? FINAL.station : FIRST_FRAME.station);
	let sheetEl: HTMLElement | undefined = $state();
	let returnTo: Element | null = null;

	const sw = $derived(languageSwitch(language));
	const T = (key: string) => t(key, language);
	const stations: { key: string; family: string }[] = [
		{ key: 'tab.text', family: 'sage' },
		{ key: 'tab.markedScore', family: 'lav' },
		{ key: 'tab.insights', family: 'rose' }
	];

	function portal(node: HTMLElement) {
		document.body.appendChild(node);
		return { destroy: () => node.remove() };
	}

	/** The motion: five turns, once. Reduced motion has already been given the final state and runs nothing. */
	$effect(() => {
		if (!open) return;
		const p = plan(prefersReducedMotion());
		if (!p.animate) return;
		const timers: ReturnType<typeof setTimeout>[] = [];
		for (const turn of p.turns) {
			timers.push(setTimeout(() => (turned = turn.image), turn.startMs));
			timers.push(setTimeout(() => (station = STATION_OF_IMAGE[turn.image]), turn.stationMs));
		}
		return () => timers.forEach(clearTimeout);
	});

	/** Nothing behind the sheet takes a key or a tap while it stands. */
	$effect(() => {
		if (!open) return;
		const shell = document.querySelector('.app-shell');
		shell?.setAttribute('inert', '');
		return () => shell?.removeAttribute('inert');
	});

	/** Focus moves into the sheet and stays; Escape does nothing. */
	$effect(() => {
		if (!open) return;
		returnTo = document.activeElement;
		const focusables = (): HTMLElement[] =>
			sheetEl
				? [...sheetEl.querySelectorAll<HTMLElement>('button, a[href], [tabindex]:not([tabindex="-1"])')].filter((el) => el.getClientRects().length > 0)
				: [];
		/** Where focus lives: the scrolling text, so the keys that scroll work at once; the sheet itself if that is not found. */
		const home = (): HTMLElement | undefined => sheetEl?.querySelector<HTMLElement>('.body') ?? sheetEl;
		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				e.preventDefault();
				e.stopPropagation();
				return;
			}
			if (e.key !== 'Tab' || !sheetEl) return;
			const list = focusables();
			if (list.length === 0) {
				e.preventDefault();
				sheetEl.focus();
				return;
			}
			const first = list[0];
			const last = list[list.length - 1];
			const here = document.activeElement;
			const inside = !!here && sheetEl.contains(here);
			if (e.shiftKey && (here === first || here === sheetEl || !inside)) {
				e.preventDefault();
				last.focus();
			} else if (!e.shiftKey && (here === last || !inside)) {
				e.preventDefault();
				first.focus();
			}
		};
		const onFocusIn = (e: FocusEvent) => {
			if (sheetEl && e.target instanceof Node && !sheetEl.contains(e.target)) home()?.focus();
		};
		window.addEventListener('keydown', onKey, true);
		document.addEventListener('focusin', onFocusIn, true);
		queueMicrotask(() => home()?.focus());
		return () => {
			window.removeEventListener('keydown', onKey, true);
			document.removeEventListener('focusin', onFocusIn, true);
		};
	});

	let leaveTimer: ReturnType<typeof setTimeout> | undefined;
	onMount(() => () => {
		if (leaveTimer) clearTimeout(leaveTimer);
	});
	function begin() {
		markWelcomeSeen(() => localStorage);
		const done = () => {
			open = false;
			if (returnTo instanceof HTMLElement && returnTo.isConnected) returnTo.focus();
		};
		if (prefersReducedMotion()) return done();
		leaving = true;
		leaveTimer = setTimeout(done, LEAVE_MS);
	}
</script>

{#if open}
	<div class="overlay" use:portal>
		<div class="scrim" class:leaving style:--leave="{LEAVE_MS}ms">
			<div bind:this={sheetEl} class="sheet" role="dialog" aria-modal="true" aria-labelledby="welcome-title" tabindex="-1">
				<div class="head">
					<span>{T('welcome.band')}</span>
					<button type="button" class="pill" lang={sw.other} onclick={() => onlanguagechange(sw.other)}>{sw.label}</button>
				</div>
				<div class="body" tabindex="-1">
					<div class="side">
						<WelcomePlate {turned} {animate} />
						<ul class="stations" class:done={station < 0} aria-hidden="true">
							{#each stations as s, i (s.key)}
								<li class:on={station === i} data-f={s.family}>{T(s.key)}</li>
							{/each}
						</ul>
					</div>
					<div class="main">
						<h1 id="welcome-title">{T('welcome.title')}</h1>
						<div class="care"><p><span class="lead">{@html T('welcome.lead')}</span> {@html T('welcome.body')}</p></div>
					</div>
					<p class="who">{@html T('welcome.method')}</p>
					<p class="who">{@html T('welcome.maker')}</p>
					<div class="fines m">
						<p class="fine">{T('welcome.madeIn')}&#8194;{@render flag()}</p>
						<p class="fine">{@html T('welcome.licence')}</p>
					</div>
				</div>
				<div class="foot">
					<div class="fines">
						<p class="fine">{T('welcome.madeIn')}&#8194;{@render flag()}</p>
						<p class="fine">{@html T('welcome.licence')}</p>
					</div>
					<button type="button" class="go" onclick={begin}>{T('calib.welcome.beginButton')}</button>
				</div>
			</div>
		</div>
	</div>
{/if}

{#snippet flag()}
	<!-- The flag of Canada, as `footer.attribution`'s and the prototype's: red bars, white field, the leaf. -->
	<svg class="flag" viewBox="0 0 9600 4800" aria-label="Canada" role="img"
		><path fill="#f00" d="m0 0h2400l99 99h4602l99-99h2400v4800h-2400l-99-99h-4602l-99 99H0z" /><path
			fill="#fff"
			d="m2400 0h4800v4800h-4800zm2490 4430-45-863a95 95 0 0 1 111-98l859 151-116-320a65 65 0 0 1 20-73l941-762-212-99a65 65 0 0 1-34-79l186-572-542 115a65 65 0 0 1-73-38l-105-247-423 454a65 65 0 0 1-111-57l204-1052-327 189a65 65 0 0 1-91-27l-332-652-332 652a65 65 0 0 1-91 27l-327-189 204 1052a65 65 0 0 1-111 57l-423-454-105 247a65 65 0 0 1-73 38l-542-115 186 572a65 65 0 0 1-34 79l-212 99 941 762a65 65 0 0 1 20 73l-116 320 859-151a95 95 0 0 1 111 98l-45 863z"
		/></svg
	>
{/snippet}

<style>
	.overlay {
		display: contents;
	}
	/* Over every other first-visit affordance: the install banner is 9000, the cards 9290 and 9300. */
	.scrim {
		position: fixed;
		inset: 0;
		z-index: 9400;
		background: rgba(26, 22, 18, 0.36);
		-webkit-backdrop-filter: blur(2px);
		backdrop-filter: blur(2px);
		display: grid;
		place-items: center;
		padding: 24px;
		box-sizing: border-box;
		transition: opacity var(--leave) ease-out;
	}
	.sheet {
		box-sizing: border-box;
		width: min(100%, 880px);
		max-height: 100%;
		display: flex;
		flex-direction: column;
		background: var(--drawer-bg);
		color: var(--ink-primary);
		border-radius: 16px;
		overflow: hidden;
		outline: none;
		box-shadow:
			0 0 0 1px rgba(26, 22, 18, 0.1),
			0 1px 2px rgba(46, 42, 38, 0.2),
			0 8px 16px rgba(46, 42, 38, 0.13),
			0 20px 44px rgba(46, 42, 38, 0.16);
		transition:
			opacity var(--leave) ease-out,
			transform var(--leave) ease-out;
	}
	.leaving.scrim {
		opacity: 0;
		pointer-events: none;
	}
	.leaving .sheet {
		opacity: 0;
		transform: translateY(10px);
	}

	.head {
		flex: none;
		height: 40px;
		background: var(--sage-head);
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 18px 0 22px;
		box-sizing: border-box;
	}
	.head span {
		font: 600 11.5px/1 var(--font-sans);
		letter-spacing: 0.16em;
		color: var(--sage-ink);
	}
	.pill {
		font: 500 13px/1 var(--font-sans);
		color: #fff;
		background: var(--sage-jewel);
		border: 0;
		border-radius: 9999px;
		padding: 5px 12px;
		cursor: pointer;
		white-space: nowrap;
	}

	.body {
		flex: 1;
		min-height: 0;
		overflow: auto;
		outline: none;
		display: grid;
		grid-template-columns: 208px 1fr;
		column-gap: 40px;
		row-gap: 22px;
		padding: 32px 40px 26px 36px;
	}
	.side {
		display: flex;
		flex-direction: column;
		align-items: center;
		align-self: center;
	}
	.stations {
		display: flex;
		gap: 14px;
		margin: 16px 0 0;
		padding: 0;
		list-style: none;
		font: 600 11px/1 var(--font-sans);
		letter-spacing: 0.16em;
		/* The prototype's resting grey (#B9B4AC). No token carries it; it is lighter than --ink-tertiary on purpose, so a lit label reads as lit. */
		color: #b9b4ac;
	}
	.stations li {
		transition: color 300ms ease-out;
		padding-bottom: 5px;
		border-bottom: 1.5px solid transparent;
	}
	.stations li.on {
		border-bottom-color: currentColor;
	}
	.stations li.on[data-f='sage'] {
		color: var(--sage-ink);
	}
	.stations li.on[data-f='lav'] {
		color: var(--lavender-ink);
	}
	.stations li.on[data-f='rose'] {
		color: var(--rose-ink);
	}
	.stations.done li {
		color: var(--ink-tertiary);
	}

	h1 {
		font: 600 34px/1.12 var(--font-serif);
		letter-spacing: -0.018em;
		margin: 0 0 20px;
		color: var(--ink-primary);
	}
	.care {
		background: var(--sage-wash);
		border-radius: 12px;
		padding: 18px 22px 19px;
		margin: 0;
	}
	.care .lead {
		display: block;
		font: 600 20px/1.3 var(--font-serif);
		margin: 0 0 8px;
		color: var(--ink-primary);
	}
	.care p {
		font: 400 16px/1.6 var(--font-serif);
		margin: 0;
		text-wrap: pretty;
		color: var(--ink-primary);
	}
	.care :global(strong) {
		font-weight: 600;
	}
	.who {
		font: 400 14.5px/1.55 var(--font-serif);
		margin: 0;
		color: var(--ink-secondary);
		text-wrap: pretty;
	}
	.sheet :global(em) {
		font-style: italic;
	}
	.sheet :global(a) {
		color: var(--sage-ink);
		text-decoration-thickness: 1px;
		text-underline-offset: 3px;
		text-decoration-color: rgba(54, 94, 45, 0.45);
	}

	.foot {
		flex: none;
		display: flex;
		align-items: center;
		gap: 28px;
		padding: 14px 22px 14px 36px;
		border-top: 1px solid rgba(58, 53, 47, 0.14);
		background: var(--drawer-bg);
	}
	.fines {
		flex: 1;
	}
	.fine {
		font: 400 12.5px/1.5 var(--font-sans);
		color: var(--ink-tertiary);
		margin: 0;
	}
	.fine :global(em) {
		font-family: var(--font-serif);
	}
	.flag {
		display: inline-block;
		width: 20px;
		height: 10px;
		vertical-align: baseline;
		position: relative;
		top: 0.5px;
	}
	.go {
		flex: none;
		font: 600 16px/1 var(--font-sans);
		letter-spacing: 0.02em;
		color: #fff;
		background: var(--sage-jewel);
		border: 0;
		border-radius: 9999px;
		padding: 13px 40px;
		cursor: pointer;
	}
	.go:hover,
	.pill:hover {
		background: var(--sage-ink);
	}
	.go:focus-visible,
	.pill:focus-visible,
	.sheet :global(a):focus-visible {
		outline: 2px solid var(--cobalt-jewel);
		outline-offset: 2px;
	}
	.fines.m {
		display: none;
	}

	/* The phone, as the prototype's narrow layout. `screen and`, so it never matches paper (`ENVIRONMENT.md`, PRINT). */
	@media screen and (max-width: 700px) {
		.scrim {
			padding: 12px;
		}
		.body {
			display: block;
			padding: 20px;
		}
		.side {
			float: left;
			padding: 0;
			margin: 0 16px 10px 0;
			--plate-size: 76px;
		}
		.stations {
			display: none;
		}
		h1 {
			font-size: 25px;
			min-height: 86px;
			display: flex;
			align-items: center;
			margin: 0 0 10px;
		}
		.care {
			clear: both;
			padding: 16px 18px;
			margin-bottom: 16px;
		}
		.who {
			margin-bottom: 8px;
		}
		.care .lead {
			font-size: 19px;
		}
		.foot {
			padding: 12px 20px;
		}
		.foot .fines {
			display: none;
		}
		.go {
			flex: 1;
			padding: 15px;
		}
		.fines.m {
			display: block;
			margin-top: 14px;
			padding-top: 12px;
			border-top: 1px solid rgba(58, 53, 47, 0.14);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.scrim,
		.sheet,
		.stations li {
			transition: none;
		}
	}
	/* The sheet never prints (`CONTRACT.md` section 8: no control is part of the printed page). */
	@media print {
		.overlay {
			display: none;
		}
	}
</style>
