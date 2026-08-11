<script lang="ts">
	/**
	 * Shane voice switcher: the drawer header above the calibration wizard.
	 *
	 * Consensus record (Claude-Kimi-Dann, 2026-07-11):
	 * - The header is always interactive, from first launch, with one quiet
	 *   permanent chevron (Kimi's ruling resolving the solo-header
	 *   contradiction: a two-stage header would have made New unreachable).
	 *   The chevron is decorative and aria-hidden; the button's accessible
	 *   name is "<voice name>, options".
	 * - The panel adapts: solo hides Delete (Start over in the wizard covers
	 *   it); plural shows the voice list with quiet locale-aware dates plus
	 *   all verbs. One recorded deviation from Kimi's solo listing: Duplicate
	 *   is available solo too, because duplicating the sole voice is the
	 *   primary path to a style variant (Dann's case 2).
	 * - Naming is inline, never modal: the field arrives prefilled with a
	 *   sequential default ("Voice N") and pre-selected, so tapping through
	 *   always works; the empty-name guard restores the default on blur
	 *   ("every voice needs a name" without a dead end).
	 * - First launch asks immediately: with no voices saved, this component
	 *   renders the naming field itself and the wizard waits behind it.
	 * - The whole control is inert during an active capture (the `disabled`
	 *   prop, driven by the wizard's phase): preventive, not punitive.
	 * - "Voice", not "User" or "Singer": Shane measures the instrument, not
	 *   the identity, and the default scales cleanly to variants and guests.
	 *   French mode ("Voix N") arrived with N.22 (E.40, 2026-08-11). The
	 *   parent still supplies the default name text; this component now
	 *   reads its own strings from the dictionary.
	 */
	import { t, type Language } from '$lib/i18n';

	interface VoiceMeta {
		id: string;
		name: string;
		createdAt: string;
	}
	interface Props {
		voices: VoiceMeta[];
		activeId: string | null;
		/** Inert during an active capture; the wizard drives this. */
		disabled?: boolean;
		/** N.22: active display language, threaded to the i18n dictionary. */
		language: Language;
		/** The prefilled sequential default for New/Duplicate/first launch. */
		nextDefaultName: string;
		onSelect: (id: string) => void;
		onCreate: (name: string) => void;
		/** Duplicates the active voice under the given name. */
		onDuplicate: (name: string) => void;
		/** Renames the active voice. */
		onRename: (name: string) => void;
		/** Deletes the active voice; only offered when more than one exists. */
		onDelete: () => void;
	}
	let {
		voices,
		activeId,
		disabled = false,
		language,
		nextDefaultName,
		onSelect,
		onCreate,
		onDuplicate,
		onRename,
		onDelete
	}: Props = $props();

	const T = (key: string) => t(key, language);

	type Mode = 'closed' | 'list' | 'new' | 'duplicate' | 'rename';
	let mode = $state<Mode>('closed');
	let confirmingDelete = $state(false);
	let nameDraft = $state('');

	let active = $derived(voices.find((v) => v.id === activeId));

	function toggle() {
		confirmingDelete = false;
		mode = mode === 'closed' ? 'list' : 'closed';
	}
	function closeAll() {
		mode = 'closed';
		confirmingDelete = false;
	}
	function beginNew() {
		nameDraft = nextDefaultName;
		mode = 'new';
	}
	function beginDuplicate() {
		nameDraft = nextDefaultName;
		mode = 'duplicate';
	}
	function beginRename() {
		nameDraft = active?.name ?? nextDefaultName;
		mode = 'rename';
	}
	/** Empty-name guard (Kimi): a blank field restores its default on blur. */
	function restoreOnBlur() {
		if (!nameDraft.trim()) {
			nameDraft = mode === 'rename' ? (active?.name ?? nextDefaultName) : nextDefaultName;
		}
	}
	function submitName() {
		const typed = nameDraft.trim();
		const fallback = mode === 'rename' ? (active?.name ?? nextDefaultName) : nextDefaultName;
		const name = typed || fallback;
		if (mode === 'new') onCreate(name);
		else if (mode === 'duplicate') onDuplicate(name);
		else if (mode === 'rename') onRename(name);
		closeAll();
	}
	function submitFirst() {
		onCreate(nameDraft.trim() || nextDefaultName);
	}
	function chooseVoice(id: string) {
		closeAll();
		if (id !== activeId) onSelect(id);
	}
	function confirmDelete() {
		closeAll();
		onDelete();
	}

	// Inert means inert (Kimi's review, 2026-07-11): if the panel was open
	// when a capture began, close it, so its inner verbs cannot switch or
	// delete the active voice mid-capture. The header's disabled state
	// alone only guarded the door, not the room.
	$effect(() => {
		if (disabled && mode !== 'closed') closeAll();
	});

	// Prefill the first-launch field once, at construction; the singer's
	// typing is never fought by reactivity.
	// svelte-ignore state_referenced_locally
	if (voices.length === 0) nameDraft = nextDefaultName;

	/** Focus and pre-select, so tapping through (or typing over) both work. */
	function selectAll(node: HTMLInputElement) {
		node.focus();
		node.select();
	}

	function fmtDate(iso: string): string {
		try {
			return new Date(iso).toLocaleDateString(language === 'fr' ? 'fr-CA' : 'en-CA', {
				month: 'short',
				day: 'numeric'
			});
		} catch {
			return '';
		}
	}
</script>

<svelte:window
	onkeydown={(e) => {
		if (mode !== 'closed' && e.key === 'Escape') closeAll();
	}}
/>

{#if voices.length === 0}
	<!-- First launch: ask immediately (Kimi). The field is prefilled and
	     pre-selected, so a single tap-through still works; this is a beat
	     of orientation, not a gate.
	     The contextual lede is the pane's typographic hero, with the form
	     subordinate (Kimi's first-run-orientation ruling, 2026-07-11: a
	     local lede, weight inverted; no step numbering, no phase rails —
	     each phase's opening surface carries one sentence of context).
	     Copy is Dann's. The lede remains the input's <label> so the
	     name/field association survives the promotion. -->
	<div class="ps ps-first">
		<label class="ps-first-lede" for="ps-first-name"
			>{T('calib.switcher.firstLaunchLede')}</label
		>
		<div class="ps-name-row">
			<input
				id="ps-first-name"
				class="ps-input"
				type="text"
				bind:value={nameDraft}
				onblur={restoreOnBlur}
				onkeydown={(e) => {
					if (e.key === 'Enter') submitFirst();
				}}
				use:selectAll
			/>
			<button type="button" class="ps-primary" onclick={submitFirst}>{T('calib.switcher.startButton')}</button>
		</div>
	</div>
{:else}
	<div class="ps">
		<!-- N.22 (E.40): the ", options" suffix is deliberately NOT keyed.
		     "options" is already a French word, so this accessible name is
		     correct in both languages. Dann's ruling, 2026-08-11. Do not
		     "fix" this into the dictionary. -->
		<button
			type="button"
			class="ps-header"
			aria-label={`${active?.name ?? nextDefaultName}, options`}
			aria-expanded={mode !== 'closed'}
			{disabled}
			onclick={toggle}
		>
			<span class="ps-name">{active?.name}</span>
			<svg class="ps-chevron" aria-hidden="true" viewBox="0 0 12 12" width="10" height="10">
				<path
					d="M2 4l4 4 4-4"
					fill="none"
					stroke="currentColor"
					stroke-width="1.5"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
		</button>
		{#if mode === 'list'}
			<div class="ps-panel">
				{#if voices.length > 1}
					<ul class="ps-list">
						{#each voices as v (v.id)}
							<li>
								<button
									type="button"
									class="ps-voice"
									aria-current={v.id === activeId ? 'true' : undefined}
									onclick={() => chooseVoice(v.id)}
								>
									<span class="ps-voice-name">{v.name}</span>
									<span class="ps-date">{fmtDate(v.createdAt)}</span>
								</button>
							</li>
						{/each}
					</ul>
				{/if}
				{#if confirmingDelete}
					<div class="ps-confirm">
						<p>{T('calib.switcher.deleteConfirm').replace('{name}', active?.name ?? '')}</p>
						<div class="ps-verbs">
							<button type="button" onclick={confirmDelete}>{T('calib.switcher.deleteButton')}</button>
							<button type="button" onclick={() => (confirmingDelete = false)}>{T('calib.switcher.keepButton')}</button>
						</div>
					</div>
				{:else}
					<div class="ps-verbs">
						<button type="button" onclick={beginNew}>{T('calib.switcher.newButton')}</button>
						<button type="button" onclick={beginDuplicate}>{T('calib.switcher.duplicateButton')}</button>
						<button type="button" onclick={beginRename}>{T('calib.switcher.renameButton')}</button>
						{#if voices.length > 1}
							<button type="button" onclick={() => (confirmingDelete = true)}>{T('calib.switcher.deleteButton')}</button>
						{/if}
					</div>
				{/if}
			</div>
		{:else if mode === 'new' || mode === 'duplicate' || mode === 'rename'}
			<div class="ps-panel">
				<label class="ps-label" for="ps-name">
					{mode === 'rename' ? T('calib.switcher.renameLabel') : T('calib.switcher.nameLabel')}
				</label>
				<div class="ps-name-row">
					<input
						id="ps-name"
						class="ps-input"
						type="text"
						bind:value={nameDraft}
						onblur={restoreOnBlur}
						onkeydown={(e) => {
							if (e.key === 'Enter') submitName();
						}}
						use:selectAll
					/>
					<button type="button" class="ps-primary" onclick={submitName}>{T('calib.switcher.saveButton')}</button>
					<button type="button" class="ps-quiet" onclick={() => (mode = 'list')}>{T('calib.switcher.cancelButton')}</button>
				</div>
			</div>
		{/if}
	</div>
{/if}

<style>
	.ps {
		width: 100%;
		max-width: 26rem;
		margin: 0 auto;
		font-family: var(--font-ui, var(--font-sans));
	}
	.ps-first {
		display: flex;
		flex-direction: column;
		gap: 0.875rem;
		align-items: center;
		padding: 0.75rem 0 0.5rem;
	}
	/* The first-launch lede: the pane's typographic hero (Kimi, 2026-07-11).
	   Larger, centred, primary ink; the input row below reads as the
	   response to this invitation, not the main event. */
	.ps-first-lede {
		font-size: 1.0625rem;
		font-weight: 600;
		line-height: 1.45;
		color: var(--ink-primary);
		text-align: center;
		max-width: 22rem;
	}
	/* The always-interactive header: quiet in degree (small, muted), never
	   absent in kind (Kimi's ruling on the solo-header contradiction). */
	.ps-header {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.375rem;
		width: 100%;
		background: transparent;
		border: none;
		padding: 0.375rem 0.5rem;
		cursor: pointer;
		color: var(--ink-secondary);
		border-radius: 0.5rem;
	}
	.ps-header:hover:not(:disabled) {
		background: var(--drawer-bg);
	}
	.ps-header:disabled {
		cursor: default;
		opacity: 0.6;
	}
	.ps-name {
		font-size: 0.875rem;
		font-weight: 600;
		letter-spacing: 0.01em;
	}
	.ps-chevron {
		flex-shrink: 0;
		opacity: 0.6;
	}
	.ps-panel {
		margin-top: 0.375rem;
		padding: 0.625rem 0.75rem;
		border: 1px solid var(--stone-300);
		border-radius: 0.75rem;
		background: var(--drawer-bg);
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	.ps-list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 0.125rem;
	}
	.ps-voice {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 0.75rem;
		width: 100%;
		background: transparent;
		border: none;
		border-radius: 0.375rem;
		padding: 0.375rem 0.5rem;
		cursor: pointer;
		font-family: inherit;
		font-size: 0.875rem;
		color: var(--ink-secondary);
		text-align: left;
	}
	.ps-voice:hover {
		background: #ffffff;
	}
	.ps-voice[aria-current='true'] {
		color: var(--ink-primary);
		font-weight: 600;
	}
	.ps-voice-name {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	/* The quiet secondary date (Kimi): implicit ordering for snapshots
	   without forcing dates into names. */
	.ps-date {
		flex-shrink: 0;
		font-size: 0.75rem;
		color: var(--ink-tertiary);
		font-variant-numeric: tabular-nums;
	}
	.ps-verbs {
		display: flex;
		flex-wrap: wrap;
		gap: 0.375rem;
		justify-content: center;
	}
	.ps-verbs button {
		font-family: inherit;
		font-size: 0.75rem;
		font-weight: 600;
		padding: 0.25rem 0.75rem;
		border-radius: 999px;
		border: 1px solid var(--stone-300);
		background: #ffffff;
		color: var(--ink-secondary);
		cursor: pointer;
	}
	.ps-verbs button:hover {
		border-color: var(--sage);
		color: var(--sage);
	}
	.ps-confirm p {
		margin: 0 0 0.25rem;
		font-size: 0.8125rem;
		color: var(--ink-secondary);
		text-align: center;
		line-height: 1.4;
	}
	.ps-label {
		font-size: 0.8125rem;
		font-weight: 600;
		color: var(--ink-secondary);
		text-align: center;
	}
	.ps-name-row {
		display: flex;
		gap: 0.375rem;
		align-items: center;
		justify-content: center;
	}
	.ps-input {
		flex: 1;
		min-width: 0;
		font-family: inherit;
		font-size: 0.875rem;
		padding: 0.375rem 0.625rem;
		border: 1px solid var(--stone-300);
		border-radius: 0.5rem;
		color: var(--ink-primary);
		background: #ffffff;
	}
	.ps-input:focus {
		outline: 2px solid var(--sage);
		outline-offset: 1px;
	}
	.ps-primary {
		font-family: inherit;
		font-size: 0.8125rem;
		font-weight: 600;
		padding: 0.375rem 1rem;
		border-radius: 999px;
		border: 1px solid transparent;
		background: var(--sage);
		color: #ffffff;
		cursor: pointer;
	}
	.ps-primary:hover {
		background: var(--deeper-sage);
	}
	.ps-quiet {
		font-family: inherit;
		font-size: 0.8125rem;
		background: transparent;
		border: none;
		color: var(--ink-tertiary);
		text-decoration: underline;
		cursor: pointer;
		padding: 0.25rem 0.375rem;
	}
</style>
