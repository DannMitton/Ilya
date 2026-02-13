<script lang="ts">
	interface Props {
		headerText: string;
	}

	let { headerText }: Props = $props();
</script>

<header class="running-header">
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
		font-size: 10px;
		color: var(--ink-secondary);
		letter-spacing: 1.5px;
		line-height: 1.4;
	}

	.header-underline {
		border-bottom: 1px solid var(--sage);
		margin-top: 4px;
	}
</style>
