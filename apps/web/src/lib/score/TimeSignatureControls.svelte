<script lang="ts">
	/**
	 * THE TIME SIGNATURE CARD (QUEUE row 138, ruled by Dann 2026-11-09 21:35 and 21:38; Finale is the model).
	 *
	 * Change the time signature from the held bar: to the next change, or to the end of the song. Two fields and a list of the common signatures,
	 * any signature typable; one button writes it as one Undo step ("time signature changed"). The bars keep the barlines the reading has; the
	 * ones that now add up lose their flag, the others keep it (`rebar.ts`). "Rebar the notes" (T2, off by default) instead moves the notes across
	 * barlines to fill bars of the new signature, tying any note that crosses one (`rebar-notes.ts`).
	 *
	 * A MENU-SIZED CARD ON A FINE POINTER, A SHEET FROM THE FOOT OF THE SCREEN ON A COARSE ONE, every target at least 44 px, on the
	 * `ClefControls.svelte` pattern: a `position: fixed` overlay moved to `<body>` so its z-index means what it says. It stands over the Loupe
	 * (9100), because it is opened from the Loupe's CORRECTIONS pane. NOTHING PRINTS (`CONTRACT.md` §8).
	 *
	 * EVERY STRING IS RATIFIED (`rulings-2026-11-09-evening.md`, 22:08 and 22:09). The card's one button reads `correct.tsChange`, the ratified
	 * sentence, and its way out `upload.ask.cancel`; no string was coined for it. DESK DEFAULT, to strike.
	 */
	import { t, type Language } from '$lib/i18n';
	import { tsUi } from './time-signature-ui.svelte';
	import { COMMON_SIGNATURES } from './time-signature';

	let { language, pages }: { language: Language; pages: readonly string[] | null } = $props();

	/** A time signature drawn on the score: where it is on screen, and an entry of the bar it opens. */
	interface Anchor { left: number; top: number; width: number; height: number; id: string }
	let anchors = $state<Anchor[]>([]);
	let frame = 0;
	const MIN_HIT = 44;

	/**
	 * Reads every drawn time signature's place on screen (`data-meter`, `staff-renderer.ts`). The bar it opens is the bar of the first
	 * note or rest drawn to its right on the same system (`data-hit` carries the entry's id): the renderer's output is pinned by approved
	 * SVGs, so it carries no bar number and none is added.
	 */
	function measure(): void {
		const out: Anchor[] = [];
		for (const el of document.querySelectorAll<SVGGElement>('.markup-paper-container .score-page [data-meter]')) {
			const r = el.getBoundingClientRect();
			const svg = el.ownerSVGElement;
			if (!svg) continue;
			let best: { id: string; dx: number; left: number } | null = null;
			for (const h of svg.querySelectorAll<SVGElement>('[data-hit]')) {
				const b = h.getBoundingClientRect();
				const dx = b.left - r.right;
				if (dx < -2 || b.bottom < r.top - 40 || b.top > r.bottom + 40) continue;
				if (!best || dx < best.dx) best = { id: h.getAttribute('data-hit') ?? '', dx, left: b.left };
			}
			if (!best?.id) continue;
			const min = coarse ? MIN_HIT : 24;
			const height = Math.max(r.height + 8, min);
			const left = r.left + r.width / 2 - Math.max(r.width + 8, min) / 2;
			/* IT STOPS SHORT OF THE NEXT NOTE: a hit stands over the page, and one that reached the first note's own area would take its tap
			   (the phone suite caught exactly that). The tap is a convenience; the pane's button is the entry that always has its 44 px. */
			const width = Math.min(Math.max(r.width + 8, min), best.left - 2 - left);
			if (width < 16) continue;
			out.push({ left, top: r.top + r.height / 2 - height / 2, width, height, id: best.id });
		}
		anchors = out;
	}
	function schedule(): void {
		if (frame) return;
		frame = requestAnimationFrame(() => {
			frame = 0;
			measure();
		});
	}

	$effect(() => {
		window.addEventListener('resize', schedule);
		document.addEventListener('scroll', schedule, true);
		return () => {
			window.removeEventListener('resize', schedule);
			document.removeEventListener('scroll', schedule, true);
			if (frame) cancelAnimationFrame(frame);
		};
	});
	// The pages were redrawn (a signature changed, a barline was added): read the signatures again.
	$effect(() => {
		void pages;
		void language;
		void tsUi.open;
		const id = setTimeout(measure, 0);
		return () => clearTimeout(id);
	});
	const visible = (a: Anchor) => a.top + a.height > 0 && a.top < (typeof window === 'undefined' ? 0 : window.innerHeight);

	let coarse = $state(false);
	let cardEl: HTMLElement | undefined = $state();

	$effect(() => {
		const query = window.matchMedia('(pointer: coarse)');
		const sync = () => (coarse = query.matches);
		sync();
		query.addEventListener('change', sync);
		return () => query.removeEventListener('change', sync);
	});

	$effect(() => {
		if (!tsUi.open) return;
		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				e.stopPropagation();
				tsUi.close();
			}
		};
		window.addEventListener('keydown', onKey, true);
		queueMicrotask(() => cardEl?.querySelector<HTMLElement>('input[data-ts-beats]')?.focus());
		return () => window.removeEventListener('keydown', onKey, true);
	});

	/** The card is moved to `<body>`, out of every stacking context the page's layout makes. */
	function portal(node: HTMLElement) {
		document.body.appendChild(node);
		return { destroy: () => node.remove() };
	}

	const on = (b: number, u: number) => Number(tsUi.beats) === b && Number(tsUi.beatType) === u;
	const T = (key: string) => t(key, language);
</script>

{#if anchors.length > 0 && !tsUi.open}
	<div class="ts-overlay" data-ts-hits use:portal>
		{#each anchors as a, i (i)}
			{#if visible(a)}
				<button type="button" class="ts-hit" data-ts-hit={a.id} aria-haspopup="dialog" aria-label={T('correct.tsChange')} style="left:{a.left}px;top:{a.top}px;width:{a.width}px;height:{a.height}px" onclick={(e) => tsUi.show(e.currentTarget, a.id)}></button>
			{/if}
		{/each}
	</div>
{/if}

{#if tsUi.open}
	<div class="ts-overlay" data-ts-overlay use:portal>
		<div class="scrim" aria-hidden="true" onpointerdown={() => tsUi.close()}></div>
		<div bind:this={cardEl} class={coarse ? 'sheet' : 'card'} data-ts-card={coarse ? 'sheet' : 'card'} role="dialog" aria-modal="true" aria-label={T('loupe.timeSignature')}>
			<h2 class="title">{T('loupe.timeSignature')}</h2>

			<div class="common" role="group" aria-label={T('loupe.timeSignature')}>
				{#each COMMON_SIGNATURES as s (`${s.beats}/${s.beatType}`)}
					<button type="button" class="chip" class:on={on(s.beats, s.beatType)} aria-pressed={on(s.beats, s.beatType)} data-ts-common="{s.beats}/{s.beatType}" onclick={() => tsUi.choose(s.beats, s.beatType)}>{s.beats}/{s.beatType}</button>
				{/each}
			</div>

			<div class="fields">
				<label class="field">
					<span>{T('correct.tsBeats')}</span>
					<input type="number" inputmode="numeric" min="1" max="99" step="1" data-ts-beats bind:value={tsUi.beats} />
				</label>
				<label class="field">
					<span>{T('correct.tsBeatType')}</span>
					<input type="number" inputmode="numeric" list="ts-beat-types" min="1" max="64" step="1" data-ts-beat-type bind:value={tsUi.beatType} />
					<datalist id="ts-beat-types">
						{#each tsUi.beatTypes as n (n)}<option value={n}></option>{/each}
					</datalist>
				</label>
			</div>

			<fieldset class="scope">
				<legend class="visually-hidden">{T('correct.tsChange')}</legend>
				<label class="radio"><input type="radio" name="ts-through" value="next" data-ts-through="next" bind:group={tsUi.through} /><span>{T('correct.tsToNext')}</span></label>
				<label class="radio"><input type="radio" name="ts-through" value="end" data-ts-through="end" bind:group={tsUi.through} /><span>{T('correct.tsToEnd')}</span></label>
			</fieldset>

			<label class="radio check"><input type="checkbox" data-ts-rebar bind:checked={tsUi.rebar} aria-describedby="ts-rebar-help" /><span>{T('correct.tsRebar')}</span></label>
			<p class="help" id="ts-rebar-help">{T('correct.tsRebarHelp')}</p>

			<div class="actions">
				<button type="button" class="apply" data-ts-apply disabled={!tsUi.valid} onclick={() => tsUi.apply()}>{T('correct.tsChange')}</button>
				<button type="button" class="cancel" data-ts-cancel onclick={() => tsUi.close()}>{T('upload.ask.cancel')}</button>
			</div>
		</div>
	</div>
{/if}

<style>
	.ts-overlay {
		display: contents;
	}

	/* The clef's hit areas' rule (`ClefControls.svelte`), one layer UNDER theirs: where the two meet the clef's wins (the phone suite caught
	   this one taking the clef button's tap). Under the drawer's 60 and the Loupe's 9100. */
	.ts-hit {
		position: fixed;
		z-index: 44;
		padding: 0;
		border: 0;
		background: transparent;
		cursor: pointer;
		border-radius: 8px;
	}

	.ts-hit:focus-visible {
		outline: 2px solid var(--lavender);
		outline-offset: 2px;
	}

	.scrim {
		position: fixed;
		inset: 0;
		z-index: 9290;
		background: rgba(26, 22, 18, 0.18);
	}

	.card,
	.sheet {
		position: fixed;
		z-index: 9300;
		box-sizing: border-box;
		background: var(--paper-cream, #f6f1e6);
		color: var(--ink-primary, #1a1612);
		border: 1px solid var(--lavender);
		box-shadow: 0 6px 24px rgba(26, 22, 18, 0.18);
		font-family: var(--font-sans);
	}

	.card {
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		width: min(380px, calc(100vw - 16px));
		padding: 0.8rem 0.9rem 0.9rem;
		border-radius: 12px;
	}

	/* On a phone the card opens from the foot of the screen, clear of the home bar. */
	.sheet {
		left: 0;
		right: 0;
		bottom: 0;
		max-height: 88vh;
		overflow-y: auto;
		padding: 0.9rem 1rem calc(0.9rem + env(safe-area-inset-bottom, 0px));
		border-radius: 16px 16px 0 0;
	}

	.title {
		margin: 0 0 0.6rem;
		font-size: 0.95rem;
		font-weight: 600;
	}

	.common {
		display: flex;
		flex-wrap: wrap;
		gap: 0.35rem;
		margin-bottom: 0.7rem;
	}

	.chip,
	.apply,
	.cancel {
		appearance: none;
		min-height: 44px;
		min-width: 44px;
		padding: 0 0.7rem;
		box-sizing: border-box;
		border: 1px solid var(--lavender);
		border-radius: 10px;
		background: transparent;
		color: inherit;
		font: inherit;
		font-size: 0.85rem;
		cursor: pointer;
	}

	.chip.on,
	.apply:not(:disabled) {
		background: var(--lavender-jewel);
		color: #fff;
	}

	.apply:disabled {
		opacity: 0.45;
		cursor: default;
	}

	.fields {
		display: flex;
		gap: 0.6rem;
		margin-bottom: 0.7rem;
	}

	.field {
		flex: 1 1 0;
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
		font-size: 0.75rem;
		color: var(--ink-secondary, #4a4540);
	}

	.field input {
		min-height: 44px;
		box-sizing: border-box;
		padding: 0 0.5rem;
		border: 1px solid var(--lavender);
		border-radius: 8px;
		background: #fff;
		color: var(--ink-primary, #1a1612);
		font: inherit;
		font-size: 1rem;
	}

	.scope {
		margin: 0 0 0.8rem;
		padding: 0;
		border: 0;
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
	}

	.radio {
		display: flex;
		align-items: center;
		gap: 0.55rem;
		min-height: 44px;
		font-size: 0.85rem;
	}

	.radio input {
		width: 20px;
		height: 20px;
	}

	.check {
		margin-bottom: 0;
	}

	.help {
		margin: 0 0 0.8rem 1.75rem;
		font-size: 0.75rem;
		line-height: 1.35;
		color: var(--ink-secondary, #4a4540);
	}

	.actions {
		display: flex;
		gap: 0.5rem;
		justify-content: flex-end;
	}

	.visually-hidden {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
	}

	.chip:focus-visible,
	.apply:focus-visible,
	.cancel:focus-visible,
	.field input:focus-visible {
		outline: 2px solid var(--lavender);
		outline-offset: 2px;
	}

	@media print {
		.ts-overlay {
			display: none;
		}
	}
</style>
