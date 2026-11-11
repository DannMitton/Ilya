<!--
	ROW 179, STEP 3: THE LINE UNDER THE INSPECTOR'S GLOSS FIELD, where her hand is.
	Brief: `docs/sessions/brief-code-gloss-language-and-reuse_r3_2026-11-03.md`.

	THE OFFER IS A STATE OF THE FIELD, NOT AN EVENT (`glossLine`, `text/gloss-edit.ts`):
	it stands while she has typed a gloss of her own in this language and nothing
	else supplies one, and it is there again whenever the panel reopens on that word
	while the gap remains. Closing the panel, blurring the field, or moving to
	another word records nothing. "Not now" hides it for this word in this song for
	the session (`GlossaryStore.dismissOffer`).

	The tap keeps her gloss for this word in her other songs (`GlossaryStore.set`).
	If the device refuses, the line says so and the offer stays. After a tap, while
	the panel stays open on this word, her further edits update the glossary entry
	too. Where the field shows the glossary's fill, the line says where it came from
	and "Stop using" removes the entry, leaving the song as it is.

	The strings are the ratified ones (`inspector.glossOffer` and its five). The
	buttons take their visible words as their accessible names.
-->
<script lang="ts">
	import { untrack } from 'svelte';
	import { t, type Language } from '$lib/i18n';
	import { glossLine, type ResolvedGloss } from '$lib/text/gloss-edit';
	import type { GlossaryStore } from '$lib/text/glossary.svelte';

	interface Props {
		language: Language;
		word: { cleanWord: string; lemma: string; gloss?: string };
		/** What the song's edit or the glossary decides for this word, in `language`. */
		gloss?: ResolvedGloss;
		glossaryText?: string;
		glossary: GlossaryStore;
		/** This word in this song, for the session's "Not now". */
		scope: string;
	}
	let { language, word, gloss, glossaryText, glossary, scope }: Props = $props();

	/** True from a successful tap until the panel closes, the word changes, or the language does. */
	let used = $state(false);
	let failed = $state(false);

	const edit = $derived(gloss?.source === 'song' ? gloss.text : undefined);
	const line = $derived(glossLine({ source: gloss?.source, songEdit: edit, dictionaryGloss: word.gloss ?? '', glossaryText, dismissed: glossary.offerDismissed(scope) }));

	$effect(() => {
		void language;
		void scope;
		used = false;
		failed = false;
	});

	// After the tap, the glossary entry follows the field (walk item 3).
	$effect(() => {
		const text = edit;
		if (!used || text === undefined) return;
		untrack(() => {
			if (text === glossaryText) return;
			const out = glossary.set(word.lemma, word.cleanWord, language, text);
			if (!out.ok) failed = true;
			if (text === '') used = false;
		});
	});

	function use() {
		if (!edit) return;
		const out = glossary.set(word.lemma, word.cleanWord, language, edit);
		used = out.ok;
		failed = !out.ok;
	}

	function stopUsing() {
		glossary.remove(word.lemma, word.cleanWord, language);
		glossary.reviveOffer(scope);
	}
</script>

{#if used}
	<p class="gloss-line" role="status">{t('inspector.glossOfferDone', language)}</p>
{:else if line === 'offer'}
	<p class="gloss-line">
		<button class="gloss-offer" type="button" onclick={use}>{t('inspector.glossOffer', language)}</button>
		<button class="gloss-quiet" type="button" onclick={() => glossary.dismissOffer(scope)}>{t('inspector.glossOfferDismiss', language)}</button>
	</p>
{:else if line === 'fromGlossary'}
	<p class="gloss-line">
		<span>{t('inspector.glossFromGlossary', language)}</span>
		<button class="gloss-quiet" type="button" onclick={stopUsing}>{t('inspector.glossStopUsing', language)}</button>
	</p>
{/if}
{#if failed}
	<p class="gloss-line" role="status">{t('inspector.glossOfferFailed', language)}</p>
{/if}

<style>
	.gloss-line {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.2rem 0.8rem;
		margin: 0;
		font-family: var(--font-sans);
		font-size: 0.75rem;
		color: var(--sage-ink);
	}

	.gloss-offer,
	.gloss-quiet {
		font: inherit;
		color: inherit;
		background: none;
		border: 0;
		padding: 0.3rem 0;
		cursor: pointer;
		text-align: left;
	}

	.gloss-offer {
		text-decoration: underline;
		text-underline-offset: 0.15em;
	}

	/* "Not now" and "Stop using" are quiet: the line's own colour, a little lighter. */
	.gloss-quiet {
		opacity: 0.75;
	}

	.gloss-offer:focus-visible,
	.gloss-quiet:focus-visible {
		outline: 2px solid var(--sage);
		outline-offset: 2px;
	}

	/* A touch target is at least 44 px (the Input pair's strip, `e2e-phone/input-views.test.ts`). */
	@media (pointer: coarse) {
		.gloss-offer,
		.gloss-quiet {
			min-height: 2.75rem;
			display: inline-flex;
			align-items: center;
		}
	}

	@media print {
		.gloss-line {
			display: none;
		}
	}
</style>
