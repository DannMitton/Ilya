<script lang="ts">
	/**
	 * N.111 increment 3: what Ilya did about a vowelless clitic, and the Undo.
	 *
	 * IT ASKS NOTHING. RULED BY DANN 2026-09-04 on his walk of `7875892`,
	 * amending brief r2 §5.3 and the increment 2 build, which offered a
	 * proposal and a Seat button: *"I swear to you: no vowelless word in
	 * Russian can carry its own duration. You are complicating things for the
	 * user with a situation that is impossible in music notation."* A lone
	 * vowelless clitic cannot exist on the page, so Ilya seats it at ingest and
	 * this states what it did, in one sentence, with Undo.
	 *
	 * E.24 §6's LIMIT IS WHAT SURVIVES OF THE PROPOSAL. "Do not silently
	 * re-seat the text without showing it" asked for two things, showing and
	 * asking. The showing is this sentence. The asking is gone, because it was
	 * asking about the impossible.
	 *
	 * NOTHING GOES ON THE PAPER. The note takes no new mark, per CONTRACT §6:
	 * a mark that says Ilya is unsure appears on everything and says nothing.
	 * The drawer manipulates; the page displays and prints.
	 *
	 * The line's geometry, the pill and the 44 px coarse-pointer floor are
	 * `VoiceAnchor.svelte`'s, so the drawer keeps one button shape (N.108
	 * increment 4, Dann 2026-09-03).
	 */
	import { t, type Language } from '$lib/i18n';
	import type { CliticFold } from '$lib/shane/clitic-seat';

	interface Props {
		/** The seated folds to report, in vocal-line order. Nothing on none. */
		folds: readonly CliticFold[];
		language: Language;
		/** Take one seat back off. The caller writes the pairings. */
		onundo: (fold: CliticFold) => void;
	}

	let { folds, language, onundo }: Props = $props();

	/**
	 * ONE SENTENCE FROM ONE KEY, its placeholders filled left to right.
	 *
	 * `String.replace` with a string pattern replaces the FIRST match only, so
	 * three calls fill `%s` in order. That ordering is what a positional
	 * placeholder costs, and it is named in the dictionary entry: a French
	 * translation that needs the clauses in another order will want the key
	 * restructured rather than reordered.
	 */
	function sentence(fold: CliticFold): string {
		const one = fold.seat.length === 1;
		let out = t(one ? 'clitic.seatedOne' : 'clitic.seated', language)
			.replace('%s', fold.cliticText)
			.replace('%s', fold.hostText);
		if (!one) out = out.replace('%s', String(fold.seat.length));
		return out;
	}
</script>

{#if folds.length > 0}
	<div class="clitic-seat">
		{#each folds as fold (fold.cliticEventId)}
			<div class="clitic-line">
				<span class="clitic-status">{sentence(fold)}</span>
				<button type="button" class="clitic-action" onclick={() => onundo(fold)}
					>{t('clitic.undo', language)}</button
				>
			</div>
		{/each}
	</div>
{/if}

<style>
	.clitic-line {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 9px 0;
	}

	/* The sentence WRAPS rather than truncating. `VoiceAnchor`'s own status
	   ellipsis exists so a long voice name cannot push its control off the
	   line; this sentence names two Cyrillic words and a count, and a singer
	   who cannot read which clitic is meant cannot judge what Ilya did. */
	.clitic-status {
		flex: 1;
		min-width: 0;
		font-family: var(--font-sans);
		font-size: 0.75rem;
		color: var(--ink-secondary);
	}

	.clitic-action {
		flex-shrink: 0;
		padding: 0.45rem 0.7rem;
		font-family: var(--font-sans);
		font-size: 0.8rem;
		font-weight: 600;
		color: white;
		background: var(--deeper-lavender);
		border: none;
		border-radius: 999px;
		cursor: pointer;
		transition: opacity 0.12s;
	}

	.clitic-action:hover {
		opacity: 0.85;
	}

	@media (pointer: coarse) {
		.clitic-action {
			min-height: 44px;
			min-width: 44px;
		}
	}
</style>
