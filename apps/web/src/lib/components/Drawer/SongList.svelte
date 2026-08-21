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
	import StationHeader from './StationHeader.svelte';
	import type { SongRow } from '$lib/library/songs';

	interface Props {
		songs: SongRow[];
		activeId: string;
		/** False where the driver cannot hold two songs. */
		plural: boolean;
		/** Why the last act on the library did not happen. N.27: never silent. */
		error: string | null;
		/**
		 * N.67 step 6, design §4. What a row says when its record could not be
		 * read, and when it was written by a newer Ilya. Handed in rather than
		 * looked up: this file holds no dictionary, for the same reason it holds
		 * no logic.
		 */
		unreadable: string;
		newerIlya: string;
		language: Language;
		onopen: (id: string) => void;
		onnew: () => void;
		onrename: (id: string, name: string) => void;
		ondelete: (id: string) => void;
		/**
		 * N.65 ship B. REPERTOIRE retracts, like every other header. Handed
		 * in rather than held here, for the same reason this file holds no
		 * logic: the open set is one object in `+page.svelte` and every
		 * station reads the same one.
		 */
		expanded: boolean;
		ontoggle: () => void;
	}

	let {
		songs,
		activeId,
		plural,
		error,
		unreadable,
		newerIlya,
		language,
		onopen,
		onnew,
		onrename,
		ondelete,
		expanded,
		ontoggle,
	}: Props = $props();

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
	<StationHeader
		label={t('songs.heading', language)}
		expanded={expanded}
		ontoggle={ontoggle}
		controls="station-songs"
	/>

	<!-- N.65 ship one. THE BODY IS ITS OWN FLEX COLUMN. `.song-list` used to
	     be the column, so its 6px gap landed between the header and the list
	     ON TOP of the header's own 0.4rem, and SONGS measured 12.39px to its
	     first entry where every other station measured 6.39px. That is Dann's
	     ruling 2, and this is where it was broken. The 6px between the list,
	     the error, and New song is unchanged; it just belongs to the body
	     now instead of to the whole station. -->
	{#if expanded}
	<div class="station-body" id="station-songs">
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
			{#if song.readFailure}
				<!-- N.67 step 6, design §4. THE RECORD IS NEVER OVERWRITTEN AND NEVER
				     DELETED, so the row stays and says what is wrong with it. The
				     whole sentence rather than a mark, because its last clause is the
				     salvage path and a badge cannot carry that. Rename and Delete are
				     still drawn: a rename is a write this song refuses, and deleting
				     it is the singer's own choice to make. -->
				<li class="song-note-row">
					<p class="song-note">{song.readFailure === 'newer-schema' ? newerIlya : unreadable}</p>
				</li>
			{/if}
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
	{/if}
</div>

<style>
	/* N.65 ship one. A plain block. The station's gap is the header's alone,
	   and the body below keeps the 6px this rule used to spend on both. */
	.song-list {
		display: block;
	}

	.station-body {
		display: flex;
		flex-direction: column;
		gap: 6px;
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

	/* The unreadable sentence, in the drawer's own quiet register: the same
	   family, size, and colour as .song-error, indented under the row it belongs
	   to so it reads as that row's note rather than as the list's. */
	.song-note-row {
		display: block;
	}

	.song-note {
		margin: 0 0 4px 0.5rem;
		font-family: var(--font-sans);
		font-size: 0.75rem;
		line-height: 1.4;
		color: var(--ink-secondary);
	}

	.song-error {
		margin: 0;
		font-family: var(--font-sans);
		font-size: 0.75rem;
		line-height: 1.4;
		color: var(--ink-secondary);
	}
</style>
