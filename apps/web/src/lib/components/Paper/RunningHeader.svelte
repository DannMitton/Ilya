<script lang="ts">
	interface Props {
		headerText: string;
		onheightchange?: (height: number) => void;
	}

	let { headerText, onheightchange }: Props = $props();

	/**
	 * Measured height of this header, ending AT the rule: .header-underline is
	 * the last child and nothing renders below it. So a page's contentTop minus
	 * (margin + this) is exactly the visible gap under the rule.
	 */
	let measuredHeight = $state(0);

	$effect(() => {
		if (measuredHeight > 0) {
			onheightchange?.(measuredHeight);
		}
	});
</script>

<header class="running-header" bind:offsetHeight={measuredHeight}>
	<span class="header-text">{headerText}</span>
	<div class="header-underline"></div>
</header>

<style>
	.running-header {
		position: absolute;
		top: 48px;
		left: 96px;
		right: 96px;
	}

	.header-text {
		font-family: var(--font-sans);
		font-size: 14px;
		font-weight: 600;
		color: var(--ink-secondary);
		letter-spacing: 1.5px;
		line-height: 1.4;
		font-variant-caps: all-small-caps;
	}

	.header-underline {
		border-bottom: 1px solid var(--sage);
		margin-top: 4px;
	}

	/* N.73 portrait C retires the N.45 rule that stood here. It hid this
	   running head on the phone because the mobile document had no pages a
	   reader could see. It has pages again, each one whole, so the head that
	   names them is back with them. */
</style>
