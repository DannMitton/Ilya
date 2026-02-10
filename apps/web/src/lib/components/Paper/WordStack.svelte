<script lang="ts">
	import type { WordStackData } from '$lib/types';

	interface Props {
		word: WordStackData;
		onclick?: (word: WordStackData) => void;
	}

	let { word, onclick }: Props = $props();

	function handleClick() {
		onclick?.(word);
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			onclick?.(word);
		}
	}
</script>

<div
	class="word-stack"
	class:proclitic={word.isProclitic}
	class:enclitic={word.isEnclitic}
	class:unknown-stress={word.stressSource === 'inferred' || word.stressSource === 'unknown'}
	data-word-index="{word.lineIndex}-{word.wordIndex}"
	tabindex="0"
	role="button"
	aria-label="{word.cleanWord}, {word.ipaDisplay}"
	onclick={handleClick}
	onkeydown={handleKeydown}
>
	<span class="ipa">{word.ipaDisplay}</span>
	<span class="cyrillic">
		{word.stressedCyrillic}<span class="punct">{word.punctuation}</span>
	</span>
</div>

<style>
	.word-stack {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.1rem;
		min-width: 2.5rem;
		cursor: pointer;
		border-radius: 4px;
		padding: 0.25rem 0.35rem;
		transition: background 0.12s;
	}

	.word-stack:hover {
		background: rgba(0, 0, 0, 0.04);
	}

	.word-stack:focus-visible {
		outline: 2px solid #4a90d9;
		outline-offset: 2px;
	}

	.word-stack.proclitic,
	.word-stack.enclitic {
		opacity: 0.6;
	}

	.word-stack.unknown-stress {
		border-bottom: 2px dashed #e2a500;
		padding-bottom: 0.15rem;
	}

	.ipa {
		font-size: 1.1rem;
		letter-spacing: 0.02em;
		white-space: nowrap;
	}

	.cyrillic {
		font-size: 0.85rem;
		color: #374151;
	}

	.punct {
		color: #9ca3af;
	}
</style>
