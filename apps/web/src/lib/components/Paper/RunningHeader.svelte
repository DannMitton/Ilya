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

	/* N.45. A running head is a per-page artefact and the mobile document
	   has no pages a reader can see. Same absolute-positioning problem as
	   TitleHeader. Unchanged for print and for landscape. */
	@media screen and (max-width: 767px) {
		.running-header {
			display: none;
		}
	}
</style>
