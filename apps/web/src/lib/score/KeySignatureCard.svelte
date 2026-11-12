<script lang="ts">
	/**
	 * THE KEY SIGNATURE CARD (N.192, step 6b), shaped like the time signature card: a menu-sized card on a fine pointer, a sheet from the foot on a
	 * coarse one, every target at least 44 px, moved to `<body>` so its z-index means what it says. It lists the fifteen signatures by count, the
	 * labels the upload question used (count the sharps or flats on your paper); the scope is the time signature card's two choices; the notes choice
	 * is ONE checkbox, on by default, with one help line, as "Rebar the notes" is (off is "keep the pitches"). "Remove this key change" appears only on
	 * a bar that opens with one and is not the first. Strings are PENDING DANN (the English drafts stand). NOTHING PRINTS (`CONTRACT.md` §8).
	 */
	import { t, type Language } from '$lib/i18n';
	import { keyUi } from './key-signature-ui.svelte';
	import { KEY_CHOICES, keyLabelKey } from './key-signature';

	let { language }: { language: Language } = $props();
	let coarse = $state(false);
	let cardEl: HTMLElement | undefined = $state();
	const T = (key: string) => t(key, language);
	const label = (f: number): string => {
		const { key, n } = keyLabelKey(f);
		return T(key).replace('%s', String(n));
	};

	$effect(() => {
		const query = window.matchMedia('(pointer: coarse)');
		const sync = () => (coarse = query.matches);
		sync();
		query.addEventListener('change', sync);
		return () => query.removeEventListener('change', sync);
	});
	$effect(() => {
		if (!keyUi.open) return;
		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				e.stopPropagation();
				keyUi.close();
			}
		};
		window.addEventListener('keydown', onKey, true);
		queueMicrotask(() => cardEl?.querySelector<HTMLElement>('select')?.focus());
		return () => window.removeEventListener('keydown', onKey, true);
	});
	function portal(node: HTMLElement) {
		document.body.appendChild(node);
		return { destroy: () => node.remove() };
	}
</script>

{#if keyUi.open}
	<div class="ks-overlay" data-ks-overlay use:portal>
		<div class="scrim" aria-hidden="true" onpointerdown={() => keyUi.close()}></div>
		<div bind:this={cardEl} class={coarse ? 'sheet' : 'card'} data-ks-card={coarse ? 'sheet' : 'card'} role="dialog" aria-modal="true" aria-label={T('loupe.keySignature')}>
			<h2 class="title">{T('loupe.keySignature')}</h2>

			<label class="field">
				<span>{T('correct.keyChange')}</span>
				<select data-ks-key bind:value={keyUi.fifths}>
					{#each KEY_CHOICES as f (f)}<option value={f}>{label(f)}</option>{/each}
				</select>
			</label>

			<fieldset class="scope">
				<legend class="visually-hidden">{T('correct.keyChange')}</legend>
				<label class="radio"><input type="radio" name="ks-through" value="next" data-ks-through="next" bind:group={keyUi.through} /><span>{T('correct.keyToNext')}</span></label>
				<label class="radio"><input type="radio" name="ks-through" value="end" data-ks-through="end" bind:group={keyUi.through} /><span>{T('correct.keyToEnd')}</span></label>
			</fieldset>

			<label class="radio check"><input type="checkbox" data-ks-follow bind:checked={keyUi.follow} aria-describedby="ks-follow-help" /><span>{T('correct.keyFollow')}</span></label>
			<p class="help" id="ks-follow-help">{T('correct.keyFollowHelp')}</p>

			<div class="actions">
				<button type="button" class="apply" data-ks-apply onclick={() => keyUi.apply()}>{T('correct.keyChange')}</button>
				{#if keyUi.canRemove}<button type="button" class="cancel" data-ks-remove onclick={() => keyUi.remove()}>{T('correct.keyRemove')}</button>{/if}
				<button type="button" class="cancel" data-ks-cancel onclick={() => keyUi.close()}>{T('upload.ask.cancel')}</button>
			</div>
		</div>
	</div>
{/if}

<style>
	.ks-overlay { display: contents; }
	.scrim { position: fixed; inset: 0; z-index: 9290; background: rgba(26, 22, 18, 0.18); }
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
	.card { left: 50%; top: 50%; transform: translate(-50%, -50%); width: min(380px, calc(100vw - 16px)); padding: 0.8rem 0.9rem 0.9rem; border-radius: 12px; }
	.sheet { left: 0; right: 0; bottom: 0; max-height: 88vh; overflow-y: auto; padding: 0.9rem 1rem calc(0.9rem + env(safe-area-inset-bottom, 0px)); border-radius: 16px 16px 0 0; }
	.title { margin: 0 0 0.6rem; font-size: 0.95rem; font-weight: 600; }
	.field { display: flex; flex-direction: column; gap: 0.2rem; margin-bottom: 0.7rem; font-size: 0.75rem; color: var(--ink-secondary, #4a4540); }
	.field select { min-height: 44px; box-sizing: border-box; padding: 0 0.5rem; border: 1px solid var(--lavender); border-radius: 8px; background: #fff; color: var(--ink-primary, #1a1612); font: inherit; font-size: 1rem; }
	.scope { margin: 0 0 0.8rem; padding: 0; border: 0; display: flex; flex-direction: column; gap: 0.15rem; }
	.radio { display: flex; align-items: center; gap: 0.55rem; min-height: 44px; font-size: 0.85rem; }
	.radio input { width: 20px; height: 20px; }
	.check { margin-bottom: 0; }
	.help { margin: 0 0 0.8rem 1.75rem; font-size: 0.75rem; line-height: 1.35; color: var(--ink-secondary, #4a4540); }
	.actions { display: flex; flex-wrap: wrap; gap: 0.5rem; justify-content: flex-end; }
	.apply, .cancel { appearance: none; min-height: 44px; min-width: 44px; padding: 0 0.7rem; box-sizing: border-box; border: 1px solid var(--lavender); border-radius: 10px; background: transparent; color: inherit; font: inherit; font-size: 0.85rem; cursor: pointer; }
	.apply { background: var(--lavender-jewel); color: #fff; }
	.visually-hidden { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
	.apply:focus-visible, .cancel:focus-visible, .field select:focus-visible { outline: 2px solid var(--lavender); outline-offset: 2px; }
	@media print { .ks-overlay { display: none; } }
</style>
