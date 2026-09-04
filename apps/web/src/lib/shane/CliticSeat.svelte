<script lang="ts">
	/**
	 * N.111 increment 2: the clitic seat's one proposal, and its one action.
	 *
	 * ONE SENTENCE PER FOLD, English only this ship, and one button. The
	 * sentence is the desk's, from `brief-n111-clitic-seat_r2_2026-09-03.md`
	 * §5.1: «в sits alone on a note. Seat it with бью? 59 notes move.»
	 *
	 * ILYA PROPOSES AND DOES NOT APPLY (E.24 §6). This component decides
	 * nothing and applies nothing; it renders what it is given and calls back.
	 * The count it prints is the length of the fold's own seat, so the number
	 * the singer reads and the number of notes the press rewrites are the same
	 * number by construction rather than by agreement.
	 *
	 * NOTHING GOES ON THE PAPER. The note itself takes no new mark, per
	 * CONTRACT §6: a mark that says Ilya is unsure appears on everything and
	 * says nothing. The proposal lives where the singer manipulates, and the
	 * page displays and prints.
	 *
	 * The line's geometry, the pill and the 44 px coarse-pointer floor are
	 * `VoiceAnchor.svelte`'s, so the drawer keeps one button shape (N.108
	 * increment 4, Dann 2026-09-03).
	 */
	import { t, type Language } from '$lib/i18n';
	import type { CliticFold } from '$lib/shane/clitic-seat';

	interface Props {
		/** The folds to offer, in vocal-line order. Nothing renders on none. */
		folds: readonly CliticFold[];
		language: Language;
		/** The singer's press. The caller writes the pairings and pushes undo. */
		onseat: (fold: CliticFold) => void;
	}

	let { folds, language, onseat }: Props = $props();

	function sentence(fold: CliticFold): string {
		const moved =
			fold.seat.length === 1
				? t('clitic.movesOne', language)
				: t('clitic.moves', language).replace('%s', String(fold.seat.length));
		return [
			t('clitic.alone', language).replace('%s', fold.cliticText),
			t('clitic.seatWith', language).replace('%s', fold.hostText),
			moved,
		].join(' ');
	}
</script>

{#if folds.length > 0}
	<div class="clitic-seat">
		{#each folds as fold (fold.cliticEventId)}
			<div class="clitic-line">
				<span class="clitic-status">{sentence(fold)}</span>
				<button type="button" class="clitic-action" onclick={() => onseat(fold)}
					>{t('clitic.seat', language)}</button
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
	   who cannot read which clitic is meant cannot judge the proposal. */
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
