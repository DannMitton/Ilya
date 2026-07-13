<!--
	ScoreUploader — the Fit ingest widget (Round 9 §2 Items 1, 2, 6; handover
	v35 §E.5). One drag-and-drop surface with click-to-browse, auto-detection,
	provenance-driven fidelity treatment, and inline persistent errors keyed by
	IngestError code. Agentless throughout: the copy never speaks as an agent,
	IPA and analysis live elsewhere.

	This component owns both converter lifecycles (§B.2): it constructs a
	WorkerScoreReader (denigma, .musx) and a WebmscoreMsczConverter (webmscore,
	.mscz) lazily on first need and disposes them on destroy. The webmscore
	converter is constructed only when a .mscz actually arrives, since its
	warm-up prefetches ~17.5 MB of runtime assets; the denigma reader keeps its
	original any-drop construction. The parsed result is handed up through
	`oningested`; live wiring (§E.7) consumes it. PDF, image, and MIDI are
	advertised as coming soon and, if dropped, answered with a note rather
	than a hard error.
-->
<script lang="ts">
	import { onDestroy } from 'svelte';
	import { t, type Language } from '$lib/i18n';
	import { WorkerScoreReader } from './engine/score-reader';
	import { WebmscoreMsczConverter } from './engine/mscz-converter';
	import {
		ingestScoreFile,
		fidelityBanner,
		type IngestedScore,
		type IngestError,
		type IngestOutcome,
		type IngestProvenance,
	} from './ingestion/ingest';

	interface Props {
		language: Language;
		/** The parsed score, accepted by the user via "Continue to analysis".
		 *  Live wiring (§E.7) consumes this. */
		oningested: (ingested: IngestedScore) => void;
	}

	let { language, oningested }: Props = $props();

	const T = (key: string) => t(key, language);

	/** The file dialog offers the advertised set, live plus coming-soon, so it
	 *  matches the dropzone text. Coming-soon formats resolve to a note. */
	const ACCEPT = '.mnx,.json,.xml,.musicxml,.mxl,.musx,.mscz,.pdf,.mid,.midi,image/*';

	type UiState =
		| { kind: 'idle' }
		| { kind: 'busy'; label: string }
		| { kind: 'done'; ingested: IngestedScore }
		| { kind: 'error'; message: string }
		| { kind: 'soon'; message: string };

	let ui = $state<UiState>({ kind: 'idle' });
	let dragging = $state(false);
	let musHelpOpen = $state(false);
	let bannerDismissed = $state(false);
	let fileInputEl: HTMLInputElement;

	/* ── converter lifecycles (this component owns them, §B.2) ──────── */
	let reader: WorkerScoreReader | null = null;
	const getReader = (): WorkerScoreReader => (reader ??= new WorkerScoreReader());
	let converter: WebmscoreMsczConverter | null = null;
	const getConverter = (): WebmscoreMsczConverter => (converter ??= new WebmscoreMsczConverter());
	onDestroy(() => {
		reader?.dispose();
		converter?.dispose();
	});

	/* ── Intake ─────────────────────────────────────────────────────── */

	function browse(): void {
		fileInputEl?.click();
	}

	async function onPick(e: Event): Promise<void> {
		const input = e.target as HTMLInputElement;
		const file = input.files?.[0];
		input.value = ''; // reset so the same file can be re-selected
		if (file) await handleFile(file);
	}

	function onDrop(e: DragEvent): void {
		e.preventDefault();
		dragging = false;
		const file = e.dataTransfer?.files?.[0];
		if (file) void handleFile(file);
	}

	function onDragOver(e: DragEvent): void {
		e.preventDefault();
		dragging = true;
	}

	function onDragLeave(): void {
		dragging = false;
	}

	async function handleFile(file: File): Promise<void> {
		bannerDismissed = false;
		// A .musx or .mscz routes through conversion; name the wait honestly.
		const isMusx = /\.musx$/i.test(file.name);
		const isMscz = /\.mscz$/i.test(file.name);
		// Start the webmscore warm-up (module import + asset prefetch) while
		// the bytes are read and the container pre-check runs.
		if (isMscz) getConverter();
		ui = {
			kind: 'busy',
			label: isMusx
				? T('upload.status.converting')
				: isMscz
					? T('upload.status.convertingMscz')
					: T('upload.status.reading'),
		};

		let outcome: IngestOutcome;
		try {
			outcome = await ingestScoreFile(file, {
				scoreReader: getReader(),
				// Constructed inside the closure, so only a real .mscz pays the
				// converter's warm-up.
				msczConvert: (bytes, name) => getConverter().convert(bytes, name),
			});
		} catch (err) {
			console.error('[ScoreUploader] unexpected ingest failure:', err);
			ui = { kind: 'error', message: T('upload.err.parseFailed') };
			return;
		}

		if (outcome.ok) {
			ui = { kind: 'done', ingested: outcome.ingested };
			return;
		}
		const c = classify(outcome.error, isMscz);
		ui = c.soon ? { kind: 'soon', message: c.message } : { kind: 'error', message: c.message };
	}

	function accept(): void {
		if (ui.kind === 'done') {
			oningested(ui.ingested);
			reset();
		}
	}

	function reset(): void {
		ui = { kind: 'idle' };
		dragging = false;
		bannerDismissed = false;
	}

	/* ── Presentation mappings ──────────────────────────────────────── */

	function formatLabel(p: IngestProvenance): string {
		if (p.via === 'direct') {
			return p.format === 'mnx' ? T('upload.format.mnxDirect') : T('upload.format.musicxmlDirect');
		}
		if (p.via === 'mxl') return T('upload.format.mxl');
		if (p.via === 'denigma') return T('upload.format.musxDenigma');
		return T('upload.format.msczWebmscore'); // via === 'webmscore'
	}

	/** Map a typed ingest error to user copy, and flag the "coming soon" cases
	 *  so they render as a calm note rather than an error. CONVERSION_FAILED
	 *  and WASM_LOAD_FAILED are shared between the denigma (.musx) and
	 *  webmscore (.mscz) paths, so the dropped file's kind picks the copy. */
	function classify(err: IngestError, isMscz = false): { soon: boolean; message: string } {
		switch (err.code) {
			case 'DETECTION_FAILED': {
				const f = err.failure;
				switch (f.kind) {
					case 'pre-2014-finale':
						return { soon: false, message: T('upload.err.mus') };
					case 'pdf':
						return { soon: true, message: T('upload.soon.pdf') };
					case 'image':
						return { soon: true, message: T('upload.soon.image') };
					case 'midi':
						return { soon: true, message: T('upload.soon.midi') };
					case 'json-not-mnx':
						return { soon: false, message: T('upload.err.jsonNotMnx') };
					case 'xml-not-musicxml': {
						const base = T('upload.err.xmlNotMusicxml');
						return {
							soon: false,
							message: f.rootElement
								? `${base} ${T('upload.err.xmlRootIs').replace('%s', f.rootElement)}`
								: base,
						};
					}
					case 'zip-unrecognised':
						return { soon: false, message: T('upload.err.zipUnrecognised') };
					default:
						return { soon: false, message: T('upload.err.unrecognised') };
				}
			}
			case 'CONTAINER_UNREADABLE':
				return {
					soon: false,
					message: T(err.container === 'mxl' ? 'upload.err.mxlUnreadable' : 'upload.err.msczUnreadable'),
				};
			case 'MXL_NO_ROOTFILE':
				return { soon: false, message: T('upload.err.mxlNoRootfile') };
			case 'INVALID_MNX_JSON':
				return { soon: false, message: T('upload.err.invalidMnxJson') };
			case 'PARSE_FAILED':
				return { soon: false, message: T('upload.err.parseFailed') };
			case 'MSCZ_CONVERTER_UNAVAILABLE':
				return { soon: true, message: T('upload.soon.mscz') };
			case 'CONVERSION_FAILED':
				return {
					soon: false,
					message: T(isMscz ? 'upload.err.msczConversionFailed' : 'upload.err.conversionFailed'),
				};
			case 'WASM_LOAD_FAILED':
				return {
					soon: false,
					message: T(isMscz ? 'upload.err.msczWasmLoadFailed' : 'upload.err.wasmLoadFailed'),
				};
			case 'SCORE_TOO_LARGE_FOR_DEVICE':
				return {
					soon: false,
					message: `${T('upload.err.tooLarge')}${err.suggestedAction ? ` ${err.suggestedAction}` : ''}`,
				};
			default:
				return { soon: false, message: T('upload.err.unrecognised') };
		}
	}

	const showBanner = $derived(
		ui.kind === 'done' && !bannerDismissed && fidelityBanner(ui.ingested.provenance) === 'denigma'
	);
</script>

<div class="uploader">
	{#if ui.kind === 'idle'}
		<div class="dz-wrap">
			<button
				type="button"
				class="dropzone"
				class:dragging
				onclick={browse}
				ondragover={onDragOver}
				ondragleave={onDragLeave}
				ondrop={onDrop}
			>
				{#if dragging}
					<p class="dz-title">{T('upload.drop.release')}</p>
				{:else}
					<p class="dz-title">{T('upload.drop.title')}</p>
					<p class="dz-browse">{T('upload.drop.browse')}</p>
				{/if}
				<p class="dz-accepted">{T('upload.drop.acceptedNow')}</p>
				<p class="dz-soon">{T('upload.drop.comingSoon')}</p>
			</button>
			<!-- Score-from-image scan, mirroring the Transcription OCR icon.
			     Visual only until the OMR/image path ships (Round 9); the
			     tooltip marks it coming soon, and it takes no action yet. -->
			<button
				type="button"
				class="scan-btn"
				title={T('upload.scanTooltip')}
				aria-label={T('upload.scanTooltip')}
				aria-disabled="true"
			>
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18">
					<path d="M2 7V2h5" />
					<path d="M17 2h5v5" />
					<path d="M22 17v5h-5" />
					<path d="M7 22H2v-5" />
					<line x1="5" y1="12" x2="19" y2="12" />
				</svg>
			</button>
		</div>
	{:else if ui.kind === 'busy'}
		<div class="status">
			<span class="spinner"></span>
			<span class="status-label">{ui.label}</span>
		</div>
	{:else if ui.kind === 'done'}
		<div class="result">
			<p class="format-label">{formatLabel(ui.ingested.provenance)}</p>
			{#if showBanner}
				<div class="banner">
					<p class="banner-text">{T('upload.banner.denigma')}</p>
					<button type="button" class="banner-dismiss" onclick={() => (bannerDismissed = true)}>
						{T('upload.banner.dismiss')}
					</button>
				</div>
			{/if}
			<div class="result-actions">
				<button type="button" class="btn-secondary" onclick={reset}>{T('upload.tryAnother')}</button>
				<button type="button" class="btn-primary" onclick={accept}>{T('upload.continue')}</button>
			</div>
		</div>
	{:else if ui.kind === 'soon'}
		<div class="note">
			<p class="note-text">{ui.message}</p>
			<button type="button" class="btn-secondary" onclick={reset}>{T('upload.tryAnother')}</button>
		</div>
	{:else if ui.kind === 'error'}
		<div class="error">
			<p class="error-text">{ui.message}</p>
			<button type="button" class="btn-secondary" onclick={reset}>{T('upload.tryAnother')}</button>
		</div>
	{/if}

	<!-- Hidden file input; the dropzone and browse click drive it. -->
	<input
		type="file"
		accept={ACCEPT}
		class="file-input"
		bind:this={fileInputEl}
		onchange={onPick}
	/>

	<!-- Item 6: the older-Finale-file guidance, always available below the
	     widget so the .mus user avoids the error state in the first place. -->
	<div class="mus-help">
		<button type="button" class="mus-trigger" aria-expanded={musHelpOpen} onclick={() => (musHelpOpen = !musHelpOpen)}>
			<span class="mus-chevron" class:open={musHelpOpen}>›</span>
			{T('upload.mus.trigger')}
		</button>
		{#if musHelpOpen}
			<div class="mus-body">
				<p>{T('upload.mus.intro')}</p>
				<p>{T('upload.mus.opt1')}</p>
				<p>{T('upload.mus.opt2')}</p>
				<p>{T('upload.mus.opt3')}</p>
				<p class="mus-trial">{T('upload.mus.trial')}</p>
			</div>
		{/if}
	</div>
</div>

<style>
	.uploader {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		/* Match the Transcription textarea-wrapper's 8px top margin, so the
		   input box sits the same 14px below the metadata on both tabs. */
		margin-top: 8px;
		font-family: var(--font-sans);
	}

	/* ── Dropzone ──────────────────────────────────────────── */

	.dropzone {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.25rem;
		width: 100%;
		/* A true visual twin of the Transcription text field (.text-input),
		   whose live design is a 3px solid sage border, 4px radius, white fill,
		   6-row height. Same box, only the colour differs: the Fit tab's
		   lavender (Dann, measured from the live site 2026-07-13). */
		min-height: 152px;
		padding: 0.5rem 0.6rem;
		border: 3px solid var(--deeper-lavender);
		border-radius: 4px;
		background: white;
		box-sizing: border-box;
		cursor: pointer;
		/* No resize affordance (Dann's ruling, 2026-07-13): the textarea's
		   handle serves growing TYPED content; a drop target's content
		   never grows. The box twins the Transcription field's border and
		   fill but holds its half-width drawer dimension. */
		transition: background 0.15s ease;
		text-align: center;
	}

	.dropzone:hover {
		background: rgba(142, 126, 155, 0.06);
	}

	.dropzone.dragging {
		background: rgba(142, 126, 155, 0.12);
	}

	/* ── Score-from-image scan icon (visual only, coming soon) ── */

	.dz-wrap {
		position: relative;
		/* Preserve negative space below the input box, mirroring the room
		   beneath the Transcription textarea before the next control. */
		margin-bottom: 0.5rem;
	}

	.scan-btn {
		position: absolute;
		top: 6px;
		right: 6px;
		width: 28px;
		height: 28px;
		padding: 4px;
		border: none;
		border-radius: 4px;
		background: rgba(255, 255, 255, 0.8);
		color: var(--ink-tertiary);
		opacity: 0.4;
		cursor: default;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: color 0.15s ease, opacity 0.2s ease;
	}

	.scan-btn:hover {
		opacity: 0.7;
		color: var(--deeper-lavender);
	}

	.dz-title {
		font-size: 0.9rem;
		font-weight: 600;
		color: var(--ink-primary);
	}

	.dz-browse {
		font-size: 0.8rem;
		color: var(--ink-secondary);
	}

	.dz-accepted,
	.dz-soon {
		font-size: 0.68rem;
		line-height: 1.35;
		color: var(--ink-tertiary);
		margin-top: 0.15rem;
	}

	.dz-soon {
		font-style: italic;
		margin-top: 0;
	}

	/* ── Busy status ──────────────────────────────────────── */

	.status {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		min-height: 132px;
		justify-content: center;
	}

	.status-label {
		font-size: 0.85rem;
		color: var(--ink-secondary);
	}

	.spinner {
		width: 18px;
		height: 18px;
		border: 2px solid var(--stone-300);
		border-top-color: var(--sage);
		border-radius: 50%;
		animation: uploader-spin 0.8s linear infinite;
	}

	@keyframes uploader-spin {
		to {
			transform: rotate(360deg);
		}
	}

	/* ── Result ───────────────────────────────────────────── */

	.result {
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
	}

	.format-label {
		font-size: 0.75rem;
		color: var(--ink-tertiary);
	}

	.banner {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
		padding: 0.6rem 0.7rem;
		border-left: 3px solid #7c6bb0; /* lavender, denigma tier (Round 9 Item 1) */
		background: rgba(124, 107, 176, 0.08);
		border-radius: 3px;
	}

	.banner-text {
		font-size: 0.75rem;
		line-height: 1.45;
		color: var(--ink-secondary);
	}

	.banner-dismiss {
		align-self: flex-end;
		font-size: 0.72rem;
		color: var(--ink-tertiary);
		background: transparent;
		border: none;
		cursor: pointer;
		padding: 0;
	}

	.banner-dismiss:hover {
		color: var(--ink-secondary);
	}

	.result-actions {
		display: flex;
		gap: 0.5rem;
		justify-content: flex-end;
	}

	/* ── Note (coming soon) and error ─────────────────────── */

	.note,
	.error {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		align-items: flex-start;
		padding: 0.7rem;
		border-radius: 4px;
	}

	.note {
		background: rgba(0, 0, 0, 0.03);
	}

	.note-text {
		font-size: 0.8rem;
		color: var(--ink-secondary);
	}

	.error {
		background: rgba(217, 119, 6, 0.06);
	}

	.error-text {
		font-size: 0.8rem;
		color: #b45309;
		line-height: 1.4;
	}

	/* ── Buttons ──────────────────────────────────────────── */

	.btn-primary,
	.btn-secondary {
		padding: 0.4rem 0.7rem;
		font-family: var(--font-sans);
		font-size: 0.78rem;
		font-weight: 600;
		border-radius: 4px;
		cursor: pointer;
		border: none;
		transition: opacity 0.12s;
	}

	.btn-primary {
		color: white;
		background: var(--sage);
	}

	.btn-secondary {
		color: var(--ink-secondary);
		background: white;
		border: 1px solid var(--stone-300);
	}

	.btn-primary:hover,
	.btn-secondary:hover {
		opacity: 0.85;
	}

	.file-input {
		display: none;
	}

	/* ── Older-Finale-file guidance (Item 6) ──────────────── */

	.mus-help {
		border-top: 1px solid var(--stone-300);
		padding-top: 0.5rem;
	}

	.mus-trigger {
		display: flex;
		align-items: center;
		gap: 0.35rem;
		width: 100%;
		font-family: var(--font-sans);
		font-size: 0.76rem;
		color: var(--ink-secondary);
		background: transparent;
		border: none;
		padding: 0.15rem 0;
		cursor: pointer;
		text-align: left;
	}

	.mus-chevron {
		display: inline-block;
		transition: transform 0.15s ease;
		color: var(--ink-tertiary);
	}

	.mus-chevron.open {
		transform: rotate(90deg);
	}

	.mus-body {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
		padding: 0.4rem 0 0.2rem 0.7rem;
		font-size: 0.74rem;
		line-height: 1.45;
		color: var(--ink-tertiary);
	}

	.mus-trial {
		font-style: italic;
	}
</style>
