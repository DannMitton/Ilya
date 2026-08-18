<script lang="ts">
	/**
	 * SongList.svelte — N.67 step 4b, the library door.
	 *
	 * THE DOOR IS IN THE DRAWER, NOT ON THE PAPER (CONTRACT §6: the drawer
	 * manipulates, the page displays and prints). It sits beside the binder row,
	 * which is where song-level controls already live.
	 *
	 * NO LOGIC LIVES HERE. Vitest never compiles a `.svelte` file, so naming,
	 * ordering, and the six operations are all in `$lib/library/songs.ts`, which
	 * is plain TypeScript and gate-checked. What is left in this file is the
	 * rename draft, which is a text box's own state and nothing else's.
	 *
	 * ON THE LEGACY DRIVER, New song and Delete DO NOT RENDER. Six localStorage
	 * keys have no room for a second song, and a control that cannot work is
	 * worse than no control. No new string, no apology, no explanation: the door
	 * shows the one song it has. Delete is withheld on the same rule when there
	 * is only one song left, because there would be no survivor to open.
	 */
	import { tick } from 'svelte';
	import { t, type Language } from '$lib/i18n';
	import type { SongRow } from '$lib/library/songs';

	interface Props {
		songs: SongRow[];
		activeId: string;
		/** False where the driver cannot hold two songs. */
		plural: boolean;
		/** Why the last act on the library did not happen. N.27: never silent. */
		error: string | null;
		language: Language;
		onopen: (id: string) => void;
		onnew: () => void;
		onrename: (id: string, name: string) => void;
		ondelete: (id: string) => void;
	}

	let { songs, activeId, plural, error, language, onopen, onnew, onrename, ondelete }: Props = $props();

	let renamingId = $state<string | null>(null);
	let draft = $state('');
	let inputEl = $state<HTMLInputElement | undefined>(undefined);

	const canDelete = $derived(plural && songs.length > 1);

	async function startRename(row: SongRow): Promise<void> {
		renamingId = row.id;
		// The DRAWN label, not the stored name, so a singer renaming a song that
		// has never been named starts from what they can see rather than from an
		// empty box. Accepting it unchanged stores that name, which is the right
		// outcome: they looked at it and said yes.
		draft = row.label;
		// Focused here rather than with `autofocus`, which raises `a11y_autofocus`
		// and would move the web-check gate.
		await tick();
		inputEl?.select();
	}

	function commitRename(): void {
		const id = renamingId;
		const name = draft.trim();
		renamingId = null;
		// An empty box is not a name. It returns the song to unnamed, and the
		// list draws its placeholder again, which is a legitimate thing to want.
		if (id !== null) onrename(id, name);
	}

	function cancelRename(): void {
		renamingId = null;
	}

	function onRenameKey(event: KeyboardEvent): void {
		if (event.key === 'Enter') {
			event.preventDefault();
			commitRename();
		} else if (event.key === 'Escape') {
			event.preventDefault();
			cancelRename();
		}
	}
</script>

<div class="song-list">
	<h3 class="section-label">{t('songs.heading', language)}</h3>

	<ul class="songs">
		{#each songs as song (song.id)}
			<li class="song-row" class:is-open={song.id === activeId}>
				{#if renamingId === song.id}
					<input
						class="song-name-input"
						bind:this={inputEl}
						bind:value={draft}
						aria-label={t('songs.nameLabel', language)}
						onkeydown={onRenameKey}
					/>
					<button type="button" class="song-btn" onclick={cancelRename}>
						{t('songs.cancel', language)}
					</button>
					<button type="button" class="song-btn" onclick={commitRename}>
						{t('songs.save', language)}
					</button>
				{:else}
					<button
						type="button"
						class="song-open"
						aria-current={song.id === activeId ? 'true' : undefined}
						aria-label={t('songs.openAria', language).replace('%s', song.label)}
						onclick={() => onopen(song.id)}
					>
						{song.label}
					</button>
					<button type="button" class="song-btn" onclick={() => void startRename(song)}>
						{t('songs.rename', language)}
					</button>
					{#if canDelete}
						<button type="button" class="song-btn" onclick={() => ondelete(song.id)}>
							{t('songs.delete', language)}
						</button>
					{/if}
				{/if}
			</li>
		{/each}
	</ul>

	{#if error}
		<!-- N.27: no act on the library is silent. Unstyled beyond its
		     neighbours, like every other notice in this drawer. -->
		<p class="song-error">{error}</p>
	{/if}

	{#if plural}
		<div class="new-row">
			<button type="button" class="new-btn" onclick={onnew}>{t('songs.new', language)}</button>
		</div>
	{/if}
</div>

<style>
	.song-list {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	/* RootPanel's own .section-label, value for value, so the drawer keeps one
	   register rather than gaining a second heading style. */
	.section-label {
		margin: 0 0 0.4rem;
		font-family: var(--font-sans);
		font-size: 0.7rem;
		font-weight: 600;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--sage);
	}

	.songs {
		display: flex;
		flex-direction: column;
		gap: 2px;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.song-row {
		display: flex;
		align-items: center;
		gap: 4px;
	}

	/* The name takes the room, and the two verbs take what is left. */
	.song-open {
		flex: 1 1 auto;
		min-width: 0;
		overflow: hidden;
		padding: 0.35rem 0.5rem;
		font-family: var(--font-sans);
		font-size: 0.8rem;
		text-align: left;
		text-overflow: ellipsis;
		white-space: nowrap;
		color: var(--ink-primary, #1a1612);
		background: none;
		border: 1px solid transparent;
		border-radius: 4px;
		cursor: pointer;
	}

	.song-open:hover {
		background: rgb(0 0 0 / 0.04);
	}

	/* THE SONG YOU ARE IN, AND NOT A TEXT FIELD. A border here read as an
	   input, because every other bordered box in this drawer is one, and the
	   rename box is literally that shape. A rule down the left edge and the
	   drawer's own sage say "you are here" without borrowing a field's clothes.
	   Weight carries it too, so it does not rest on colour alone. */
	.is-open .song-open {
		font-weight: 600;
		color: var(--ink-primary, #1a1612);
		border-left: 3px solid var(--sage);
		border-radius: 0 4px 4px 0;
		background: rgb(0 0 0 / 0.03);
	}

	.song-name-input {
		flex: 1 1 auto;
		min-width: 0;
		padding: 0.3rem 0.45rem;
		font-family: var(--font-sans);
		font-size: 0.8rem;
		color: var(--ink-primary, #1a1612);
		background: white;
		border: 1px solid var(--stone-600, #57534e);
		border-radius: 4px;
	}

	.song-btn {
		flex: 0 0 auto;
		padding: 0.3rem 0.45rem;
		font-family: var(--font-sans);
		font-size: 0.7rem;
		color: var(--ink-secondary);
		background: none;
		border: 1px solid transparent;
		border-radius: 4px;
		cursor: pointer;
	}

	.song-btn:hover {
		border-color: var(--stone-600, #57534e);
	}

	/* RootPanel's .button-row / .action-btn / .btn-ghost are scoped to RootPanel,
	   so New song rendered as a bare browser button beneath two ghost buttons it
	   was supposed to twin. These are those rules, value for value, with the one
	   change the grid needs: one control, not three columns. */
	.new-row {
		margin-top: 4px;
		margin-bottom: 6px;
	}

	.new-btn {
		padding: 0.45rem 0.5rem;
		font-family: var(--font-sans);
		font-size: 0.8rem;
		font-weight: 500;
		color: var(--stone-500);
		background: transparent;
		border: 1px solid var(--stone-600, #57534e);
		border-radius: 4px;
		cursor: pointer;
		transition: opacity 0.12s;
	}

	.song-error {
		margin: 0;
		font-family: var(--font-sans);
		font-size: 0.75rem;
		line-height: 1.4;
		color: var(--ink-secondary);
	}
</style>
