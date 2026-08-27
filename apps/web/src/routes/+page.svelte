<script lang="ts">
	import { onMount, tick, untrack } from 'svelte';
	import { updated } from '$app/state';
	import { transcribeWord } from '@ilya/phonology';
	import type { NotationPreferences } from '@ilya/phonology';
	import { loadDictionary, type LoaderState } from '$lib/loader';
	import { processText } from '$lib/pipeline';
	import { applyOpenSyllabificationToLines } from '$lib/syllable-utils';
	import type { LineData, WordStackData, SongMetadata, UserStressOverride, YoToggle, SyllableOverride } from '$lib/types';
	import { t, type Language } from '$lib/i18n';
	import HeaderBar from '$lib/components/HeaderBar.svelte';
	import Drawer from '$lib/components/Drawer/Drawer.svelte';
	import {
		buildSlotQueue,
		firstPass,
		reconcilePairings,
		shiftToEndOfLyric,
		shiftToNextOpenNote,
		mergeOnUpload,
		type PairingMap,
		type ShiftDirection,
	} from '$lib/shane/pairings';
	// N.67 step 0: the song document owns the per-song state and is the only
	// thing that talks to storage. `savePairings` / `loadPairings` are no
	// longer called from here; the legacy driver writes the same key.
	import { SongDocument, LEGACY_SONG_ID } from '$lib/library/document.svelte';
	import { Library } from '$lib/library/library';
	import { createMemoryDriver, globalStore } from '$lib/library/driver';
	import { emptySongRecord } from '$lib/library/types';
	import { readStorageEstimate, type StorageReading } from '$lib/library/quota';
	// N.67 step 6, the sweep. WHICH SENTENCE, AND WHETHER, is decided in plain
	// TypeScript where a gate can reach it. What is left in this file is looking
	// the key up and drawing the paragraph.
	import { bootNotices, drawerNotices, fillNotice, type NoticeLine } from '$lib/library/notices';
	import { hashBytes, fingerprintVocalLine } from '$lib/library/fingerprint';
	import { arrivalDecision } from '$lib/library/library';
	import { readBinder } from '$lib/library/binder';
	// N.67 step 5, the remainder. Which songs go into a binder, and what happens
	// to each song that comes out of one, are decisions in plain TypeScript for
	// the same reason the door's are: runes are inert under vitest, so a rule
	// written in this file is a rule no gate can reach.
	import {
		binderFailureKey,
		collisionName,
		exportBinder,
		importBinder,
		importNoticeKey,
		type Collision,
		type CollisionAnswer,
	} from '$lib/library/exchange';
	import { newId, writeActiveSongId } from '$lib/library';
	// N.67 step 4b, the library door. Every decision it makes is in this plain
	// TypeScript module, where vitest can reach it; what is left below is wiring.
	import {
		createSong,
		deleteSong,
		libraryRows,
		listSongs,
		nameFor,
		recognize,
		renameSong,
		toRows,
	} from '$lib/library/songs';
	import type { SongSummary } from '$lib/library/driver';
	import type { SongRecord } from '$lib/library/types';
	import type { SourceBytes } from '$lib/library/driver';
	import { version } from '$app/environment';
	import type { OpenedLibrary } from '$lib/library';
	import SyllableStation from '$lib/shane/SyllableStation.svelte';
	import ShiftLyricsControl from '$lib/shane/ShiftLyricsControl.svelte';
	import RootPanel from '$lib/components/Drawer/RootPanel.svelte';
	import InspectorPanel from '$lib/components/Drawer/InspectorPanel.svelte';
	import Paper from '$lib/components/Paper/Paper.svelte';
	import ReadingAid from '$lib/components/ReadingAid.svelte';
import InstallPrompt from '$lib/components/InstallPrompt.svelte';
	import ReadingPaper from '$lib/components/Paper/ReadingPaper.svelte';
	import DeskHead from '$lib/components/DeskHead.svelte';
	import {
		tabIdFor,
		surfaceFor,
		restoreSurface,
		type Destination,
		type StudioDocument,
		type TabId,
	} from '$lib/destinations';
	import { INCLUDE_SHANE } from '$lib/wall';
	import CalibrationWizard from '$lib/shane/CalibrationWizard.svelte';
	import VoiceAnchor from '$lib/components/Drawer/VoiceAnchor.svelte';
	import MetadataFields from '$lib/components/Drawer/MetadataFields.svelte';
	import {
		SectionSet,
		FIRST_RUN_STATIONS,
		OPEN_STATIONS_KEY,
		STATION_IDS,
		UNPERSISTED_STATIONS,
	} from '$lib/components/Drawer/sections.svelte';
	// N.73 S3: the one predicate for "is this voice calibrated", lifted out of
	// the wizard so the voice anchor reads the same answer the wizard does.
	import { hasAnyReadings } from '$lib/shane/profileStore';
	import VoiceProfilePane from '$lib/shane/VoiceProfilePane.svelte';
	import ScoreUploader from '$lib/shane/ScoreUploader.svelte';
	import { ENGRAVING_DEFAULTS, type EngravingValues } from '$lib/shane/engraving';
	import {
		dropTagsForEdits,
		onScoreIngested,
		revertToScoreHeader,
		type MetadataField,
		type MetadataState,
	} from '$lib/metadata-provenance';
	import NotationFields from '$lib/components/Drawer/NotationFields.svelte';
	import CorrectionControls from '$lib/shane/CorrectionControls.svelte';
	import Loupe from '$lib/shane/Loupe.svelte';
	import CorrectionDock from '$lib/shane/CorrectionDock.svelte';
	import { isDismissSwipe, nearestTarget } from '$lib/shane/loupe';
	import type { NoteBase, SpellingContext, VocalLineEvent } from '@ilya/score-parser';
	import {
		applyCorrections,
		clearCorrection,
		currentDuration,
		currentPitch,
		DIGIT_BASE,
		flatPitch,
		naturalPitch,
		neighbourId,
		octavePitch,
		orphanIds,
		semitonePitch,
		sharpPitch,
		stepPitch,
		withCorrection,
		type CorrectionMap
	} from '$lib/shane/correction';
	import { pitchLabel } from '$lib/shane/note-picker';
	import type { IngestedScore } from '$lib/shane/ingestion/ingest';
	import type { PageProvenance } from '$lib/library/types';
	import type { Vowel, CalibratedFormant, VoiceCharacteristics } from '$lib/shane/engine/types';
	// Engine connectivity check
	const engineReady = typeof transcribeWord === 'function';
	// Dictionary loading state
	let loaderState = $state<LoaderState>({
		isLoading: true,
		error: null,
		entryCount: 0,
		durationMs: 0,
		progress: 0
	});
	// Language
	let language = $state<Language>('en');
	let { data }: { data: { opened: OpenedLibrary | null } } = $props();

	// N.67 steps 0 and 1, the socket and the vault. The per-song state, all
	// seven pieces of it, lives on this object and no longer on this component:
	// the poem, the metadata and its provenance tags, the glosses and their
	// anchors, the open-syllabification choice, and the pairing map. The page
	// reads and writes `doc.<field>` and never touches storage again.
	//
	// LOADED BEFORE IT EXISTS, WHICH IS THE WHOLE POINT. `+page.ts`'s load
	// function opened the vault, ran the migration, and read the record before
	// this component existed, and the document is constructed FROM that result.
	// There is no interval in which an unrestored default could be saved over
	// real work, which is why `pairingsRestored` and its apology are gone
	// rather than moved.
	//
	// The `?? ` fallback covers the prerender pass only, where there is no
	// browser to read: it produces an empty in-memory song that is replaced the
	// moment a real load lands.
	// Read ONCE, on purpose, and said so with `untrack`: the document owns the
	// song for the life of this component, and rebuilding it when `data`
	// changed identity would throw away the singer's unsaved edits. Song
	// switching is `close()` then `open()`, at step 4, not a prop change.
	const opened = untrack(() => data.opened);
	const library = opened?.library ?? new Library(createMemoryDriver());
	// N.67 step 4b. A SLOT, no longer a constant. The comment above still holds
	// for `data`, which is read once: rebuilding the document because a PROP
	// changed identity would throw away unsaved edits. What changes here is that
	// the page may now put a DIFFERENT document in the slot on purpose, which is
	// `switchSong` below, and which is close() then open() exactly as step 0
	// promised. Measured 2026-08-18 before choosing: opening a song costs about
	// 49 ms for a .musicxml and about 343 ms for a real 143 KB .musx, so the
	// reload branch buys nothing and costs the drawer's whole state.
	let doc = $state(
		SongDocument.fromLoaded(
			library,
			opened?.loaded ?? { record: emptySongRecord(LEGACY_SONG_ID, new Date().toISOString()) },
		),
	);
	// Pipeline state
	let lines = $state<LineData[]>([]);
	let transcribeError = $state('');
	let transcribeMs = $state(0);
	let selectedWord = $state<WordStackData | null>(null);
	let lastFocusedWord = $state<{ line: number; word: number } | null>(null);
	// Drawer state
	let drawerCollapsed = $state(false);
	/**
	 * N.73 S3 ship one. Whether the calibration takeover has the drawer. E.27:
	 * a takeover "replaces the entire drawer, shows a single back affordance at
	 * the top, restores the station accordion in its prior state on exit, and
	 * is never entered by a chevron"
	 * (`fable-ruling-e27-four-tab-consolidation_2026-08-05.md`). Deliberately
	 * NOT persisted, on the same reasoning NOTATION's exemption from the open
	 * set below carries: a remembered takeover would open a singer into a
	 * ritual they did not ask for on this visit.
	 */
	let calibrating = $state(false);
	// N.43: Notation collapse. Deliberately NOT persisted: a remembered
	// collapse hides the toggles from a singer who forgot they exist.
	//
	// N.73 S3 ship one, on Dann's instruction of 2026-08-20 to build a ruling
	// that was already made and never built. THE DEFAULT IS COLLAPSED, ruled
	// 2026-08-18 (`fable-gui-session-record_2026-08-18.md:12-15`, ruling 2, and
	// `fable-gui-audit-and-spec_r1_2026-08-18.md:124`). Dann's rationale, kept
	// in his words: Ilya is already set to Grayson's defaults; the toggles are
	// departures from Grayson's schema, permissible at the user's discretion,
	// so they are something the user intentionally accesses, not screen real
	// estate spent by default.
	//
	// The line above stands and is unchanged. What it guarantees has narrowed
	// rather than reversed: non-persistence used to mean the toggles are
	// visible on every arrival, and now it means the RULED default is what
	// every arrival gets. Nothing else about the retract mechanism moved.
	/* N.65 ship B. THE DRAWER'S OPEN SET, and `notationExpanded` is inside
	   it rather than beside it. Every header in the drawer retracts now, so
	   one state holds all six, and NOTATION is the one that does not reach
	   storage. The reason above is unchanged and it is why: a remembered
	   collapse hides the toggles from a singer who forgot they exist. The
	   filter lives in `sections.svelte.ts` beside the key it writes.

	   FIRST RUN IS PIECE AND SOURCE OPEN (§B.5). NOTATION's ruled
	   collapsed-on-arrival default is that same list not naming it, so the
	   two rulings agree without a second mechanism. */
	const sections = new SectionSet({
		open: FIRST_RUN_STATIONS,
		storageKey: OPEN_STATIONS_KEY,
		unpersisted: UNPERSISTED_STATIONS,
	});
	/* N.73 S3 ship two. THE SPLIT. One `$state<TabId>` carried two questions
	   at once: where the singer is, and which paper Studio has on the desk.
	   S2 merged the two Studio drawers, which made the second question a
	   property of the first rather than a peer of it, and `destinations.ts`
	   has asked for this since S1. They are two values now.

	   `activeTab` survives as a DERIVED wire id, not as state. It is what
	   `ilya:activeTab` stores, what `HeaderBar` keys its four hues from
	   (Dann's ruling of 2026-08-19: four working surfaces, four hues), and
	   what `DeskHead` names. Nothing writes it; writing `destination` or
	   `studioDocument` is what moves it. */
	let destination = $state<Destination>('studio');
	let studioDocument = $state<StudioDocument>('transcription');
	const activeTab = $derived(tabIdFor({ destination, studioDocument }));
	// Shane: the active voice's stored readings and name, published by the
	// wizard in the drawer (the workshop) so the main pane (the gallery,
	// the Voice Profile envelope) mirrors the voice the drawer is working
	// on. The wizard owns the profile store; this is a read-only reflection.
	let shaneFormants = $state<Partial<Record<Vowel, CalibratedFormant>>>({});
	let shaneVoiceName = $state<string | undefined>(undefined);
	let shaneCharacteristics = $state<VoiceCharacteristics | undefined>(undefined);
	// The most recently ingested score from the Fit uploader. Live wiring
	// (handover v35 §E.7) connects this into the renderer and analysis path.
	let ingestedScore = $state<IngestedScore | null>(null);
	// N.67 step 3: placements whose note the newly uploaded score does not
	// contain. Kept, reported, never dropped. Cleared by the next upload.
	let orphanedCount = $state(0);
	// N.55b: the N.55a courtesy notice's file name. The pairing map itself is
	// `doc.pairings` now, and the save still does not swallow its exception:
	// `doc.saveFailure` and `doc.loadFailure` carry the reason the whole song
	// save or load reported, and the drawer shows it exactly as before.
	// French ratified by Dann, 2026-08-14.
	let noLyricsFile = $state<string | null>(null);
	// The syllable the NEXT note click will place. Finale's insertion point.
	let pairingCursor = $state(0);
	const slotQueue = $derived(buildSlotQueue(lines));
	// N.55b: the pairing layer, wired. `reconcilePairings` (pairings.ts:318)
	// is the ONE rule for what counts as drift. A re-division moves consonants
	// within a word, so the nucleus the singer paired is still the same nucleus
	// and its text is refreshed. A re-transcription is a different decision and
	// stays drift, and R6 holds: the page prints what the singer decided.
	//
	// PROJECTED, NOT WRITTEN BACK. The refreshed map is derived from the live
	// queue on every render, so nothing derived is stored (CONTRACT s6) and
	// `pairings` stays the singer's own record. R5's `ilya:pairings` will save
	// the raw map, not this one.
	const reconciliation = $derived(reconcilePairings(doc.pairings, slotQueue));
	const shownPairings = $derived(reconciliation.map);
	const driftCount = $derived(reconciliation.drift.length);

	/* N.65 ship B. THE PLACED-SYLLABLE COUNT, DERIVED HERE because the header
	   that shows it is SHIFT LYRICS's now and `SyllableStation` no longer
	   draws one. THE RULE IS THAT COMPONENT'S OWN, unchanged and moved: a
	   slot counts as placed when SOME note carries a pairing that came from
	   it, keyed by ORIGIN rather than by text, so two identical syllables in
	   one line are still two slots.

	   `shownPairings` RATHER THAN `doc.pairings`, which is also what
	   `SyllableStation` was passed: the counter and the grey on a placed
	   syllable have to agree, and they only agree if they read the same map. */
	const placedSlotCount = $derived.by(() => {
		const placed = new Set<string>();
		for (const p of Object.values(shownPairings)) {
			if (p.kind === 'syllable') {
				placed.add(`${p.origin.lineIndex}-${p.origin.wordIndex}-${p.origin.slotIndex}`);
			}
		}
		return slotQueue.filter(
			(s) => placed.has(`${s.origin.lineIndex}-${s.origin.wordIndex}-${s.origin.slotIndex}`),
		).length;
	});

	// N.55b Shift Lyrics (§8). Notes, in document order, one slot per note
	// until one side runs out — the SAME order `firstPass` consumes them in,
	// below. `shiftToEndOfLyric` / `shiftToNextOpenNote` (pairings.ts:558,
	// :592) index into this, not into `slotQueue`: they operate on notes
	// already carrying a decision, not on the syllable queue.
	const eventIds = $derived(
		ingestedScore ? ingestedScore.result.score.vocalLine.filter((ev) => ev.type !== 'rest').map((ev) => ev.id) : [],
	);

	// The anchor, confirmed with Dann 2026-08-14: not the cursor itself (it
	// indexes `slotQueue`, a different sequence), but the note that CURRENTLY
	// holds the pairing whose origin matches the cursor's slot. Read from
	// `pairings`, the singer's own record (R6), not `shownPairings`: a
	// reconciled/refreshed origin could match a slot that drifted away from
	// what the singer actually decided, and shifting from the wrong note
	// silently would be worse than the button doing nothing.
	function shiftAnchorEventId(): string | null {
		const slot = slotQueue[pairingCursor];
		if (!slot) return null;
		const o = slot.origin;
		for (const id of eventIds) {
			const p = doc.pairings[id];
			if (
				p &&
				p.kind === 'syllable' &&
				p.origin.lineIndex === o.lineIndex &&
				p.origin.wordIndex === o.wordIndex &&
				p.origin.slotIndex === o.slotIndex
			) {
				return id;
			}
		}
		return null;
	}
	const shiftDisabled = $derived(shiftAnchorEventId() === null);

	// Never silently dropped (`ShiftResult.displaced`, pairings.ts:474): a
	// displaced pairing's note returns to undecided and its syllable shows
	// unplaced again in the station, both already visible without a toast.
	// Nothing else consumes `displaced` yet; if that turns out not to be
	// enough, it is a UI decision layered on top of this, not a change here.
	function handleShift(scope: 'end' | 'nextOpen', direction: ShiftDirection): void {
		const anchor = shiftAnchorEventId();
		if (anchor === null) return;
		const fromIndex = eventIds.indexOf(anchor);
		if (fromIndex === -1) return;
		const result =
			scope === 'end'
				? shiftToEndOfLyric(doc.pairings, eventIds, fromIndex, direction)
				: shiftToNextOpenNote(doc.pairings, eventIds, fromIndex, direction);
		pushUndo({ kind: 'text', key: 'loupe.undo.lyrics' });
		doc.pairings = result.map;
	}

	/**
	 * N.67 step 3, design §2.6. THE ONLY DESTRUCTIVE REBUILD, and it is the
	 * singer's own act, never a side effect of an upload.
	 *
	 * It runs the first pass again from scratch, exactly as an upload into an
	 * empty map does, so "start over" means the same thing here as it meant the
	 * first time. Disabled when there is nothing to start over from.
	 */
	function handleStartPlacementOver(): void {
		if (!ingestedScore) return;
		doc.pairings = firstPass(
			ingestedScore.result.score.vocalLine.filter((ev) => ev.type !== 'rest').map((ev) => ev.id),
			buildSlotQueue(lines),
		);
		orphanedCount = 0;
		pairingCursor = Math.min(Object.keys(doc.pairings).length, Math.max(0, slotQueue.length - 1));
	}

	/**
	 * N.55b's placement: the armed syllable lands on one note.
	 *
	 * Lifted out of `handleNotePick` by Dann's ruling of 2026-08-26 so that two
	 * callers can share it without either one owning it. The rule itself is
	 * unchanged, including the advance that stops at the end rather than
	 * wrapping, because a wrap would silently start overwriting from the top.
	 */
	function placeArmedSyllable(eventId: string): void {
		const slot = slotQueue[pairingCursor];
		if (!slot) return;
		doc.pairings = {
			...doc.pairings,
			[eventId]: {
				kind: 'syllable',
				cyrillic: slot.cyrillic,
				ipa: slot.ipa,
				vowel: slot.vowel,
				origin: slot.origin,
			},
		};
		pairingCursor = Math.min(pairingCursor + 1, slotQueue.length - 1);
	}

	/**
	 * A tap on the PAGE, through VoiceProfilePane's delegated listener.
	 *
	 * N.92. A click SELECTS, always. Selection is display, so setting it here
	 * disturbs nothing.
	 *
	 * ON A PHONE IT NAVIGATES AND NOTHING MORE, ruled by Dann 2026-08-26. The
	 * ruled tap grammar gives a page tap one meaning, which is choose the
	 * measure, and slice 2 measured what the second meaning cost: a tap meant
	 * to pick a measure silently spent a syllable and moved the station cursor
	 * off the note the lyric verbs anchor on. Placement now lives inside the
	 * loupe, where the entry under the finger is legible at 2.4 times.
	 *
	 * DESKTOP IS UNCHANGED. Off a phone this still places, exactly as shipped.
	 */
	function handleNotePick(eventId: string): void {
		selectedEventId = eventId;
		if (isPhone) return;
		placeArmedSyllable(eventId);
	}

	/** A tap on an entry INSIDE the loupe: it takes the entry and places. */
	function handleLoupePick(eventId: string): void {
		selectedEventId = eventId;
		placeArmedSyllable(eventId);
	}

	/* ── N.92, the correction minimum ────────────────────────────────────
	   ALTER and DELETE of the read's existing notes. Insertion is N.92 proper.

	   THE CORRECTIONS ARE A DIFF, not an edited score, and `correction.ts`
	   carries the reasoning: a page read is re-ingested from its stored BYTES
	   on reload, so an in-place edit would be destroyed by the re-read. Keyed
	   by event id, exactly as `doc.pairings` already is, and applied after the
	   read on the way to the renderer. */
	let selectedEventId = $state<string | null>(null);

	/** The line as the reader read it, before any hand correction. */
	const readLine = $derived(ingestedScore?.result.score.vocalLine ?? []);

	const correctedCount = $derived(Object.keys(doc.corrections).length);

	/* N.97. Corrections whose event id the current read no longer carries.
	   DERIVED, never stored: whether a correction lands is a fact about this
	   read, not about the correction, and storing it would freeze an answer the
	   next re-read may change. Counted against the line as the READER produced
	   it, so a note the singer deleted by hand is not counted as lost. */
	const orphanCount = $derived(orphanIds(readLine, doc.corrections).length);

	const selectedEvent = $derived(
		selectedEventId ? readLine.find((ev) => ev.id === selectedEventId) : undefined,
	);

	const selectedLabel = $derived.by(() => {
		const ev = selectedEvent;
		if (!ev) return null;
		const p = currentPitch(ev, doc.corrections);
		return p ? pitchLabel(p) : null;
	});

	const selectedBase = $derived(
		selectedEvent ? currentDuration(selectedEvent, doc.corrections).base : null,
	);
	const selectedDotted = $derived(
		selectedEvent ? currentDuration(selectedEvent, doc.corrections).dots > 0 : false,
	);

	/* ── THE NAMED UNDO (N.92 mobile slice 2) ────────────────────────────
	   IN MEMORY ONLY, AND THAT IS THE RULE RATHER THAN AN OMISSION. N.27
	   stands: corrections stay the one stored diff, and this ship adds NO SAVE
	   SITE. A reload therefore arrives with the corrections and with an empty
	   stack, which is the honest state: the singer's corrections survived and
	   the session's history did not.

	   A SNAPSHOT, NOT AN INVERSE. `withCorrection`, `clearCorrection`, and the
	   two shift functions all return NEW maps, so holding the previous
	   reference is a complete, cheap record of the state before the verb, and
	   there is no per-verb inverse to get wrong.

	   THE PILL'S SENTENCE IS COMPOSED AT RENDER, not at push, so a singer who
	   changes language mid-session reads the pill in the language they are
	   now in.

	   EVERY CORRECTION VERB PUSHES, wherever it was pressed. The dock and the
	   desktop drawer call the same handlers, so one stack cannot disagree with
	   another. Nothing renders the pill outside the dock, so the desk is
	   unchanged. */
	type UndoNote = { kind: 'text'; key: string } | { kind: 'change'; from: string; to: string };
	interface UndoEntry {
		note: UndoNote;
		corrections: CorrectionMap;
		pairings: PairingMap;
		selected: string | null;
	}
	let undoStack = $state<UndoEntry[]>([]);

	function pushUndo(note: UndoNote): void {
		undoStack = [
			...undoStack,
			{ note, corrections: doc.corrections, pairings: doc.pairings, selected: selectedEventId },
		];
	}

	function handleUndo(): void {
		const top = undoStack[undoStack.length - 1];
		if (!top) return;
		doc.corrections = top.corrections;
		doc.pairings = top.pairings;
		selectedEventId = top.selected;
		undoStack = undoStack.slice(0, -1);
	}

	/** The five duration words the surface already ships, by base. */
	const DURATION_KEY: Partial<Record<NoteBase, string>> = {
		'16th': 'correct.len16th',
		eighth: 'correct.len8th',
		quarter: 'correct.lenQuarter',
		half: 'correct.lenHalf',
		whole: 'correct.lenWhole',
	};

	function durationWord(base: NoteBase): string {
		const key = DURATION_KEY[base];
		return key ? t(key, language) : base;
	}

	function correct(change: Parameters<typeof withCorrection>[2]): void {
		const id = selectedEventId;
		if (!id) return;
		doc.corrections = withCorrection(doc.corrections, id, change);
	}

	function handleStep(direction: 1 | -1): void {
		const ev = selectedEvent;
		const p = ev && currentPitch(ev, doc.corrections);
		if (!p) return;
		const next = stepPitch(p, direction);
		pushUndo({ kind: 'change', from: pitchLabel(p), to: pitchLabel(next) });
		correct({ pitch: next });
	}

	function handleOctave(direction: 1 | -1): void {
		const ev = selectedEvent;
		const p = ev && currentPitch(ev, doc.corrections);
		if (!p) return;
		const next = octavePitch(p, direction);
		pushUndo({ kind: 'change', from: pitchLabel(p), to: pitchLabel(next) });
		correct({ pitch: next });
	}

	/* N.92 slice 2. The context the spelling policy reads: the key in force in
	   this note's own measure, and the note before it in the line.

	   THE KEY COMES FROM THE MEASURE, not from the score's first key
	   signature, so a mid-score change of key spells the notes after it
	   correctly. `Measure.keySignature` is snapshotted per measure by the
	   parsers, which is what makes that a lookup rather than a scan.

	   The previous note is read by the policy ONLY where a score carries no key
	   at all. It is passed anyway, because working it out here costs one
	   lookup and leaves the policy with everything its own fallback needs. */
	function spellingContextFor(ev: VocalLineEvent): SpellingContext {
		const key = ingestedScore?.result.score.measures.find(
			(m) => m.index === ev.measureIndex,
		)?.keySignature;
		const previousId = neighbourId(readLine, doc.corrections, ev.id, -1);
		const previousEvent = previousId ? readLine.find((e) => e.id === previousId) : undefined;
		const previous = previousEvent ? currentPitch(previousEvent, doc.corrections) : undefined;
		return { ...(key ? { key } : {}), ...(previous ? { previous } : {}) };
	}

	function handleSemitone(direction: 1 | -1): void {
		const ev = selectedEvent;
		const p = ev && currentPitch(ev, doc.corrections);
		if (!p || !ev) return;
		const next = semitonePitch(p, direction, spellingContextFor(ev));
		pushUndo({ kind: 'change', from: pitchLabel(p), to: pitchLabel(next) });
		correct({ pitch: next });
	}

	/* The accidental verbs. Cumulative, capped at doubles, and the policy is
	   NOT consulted: a spelling the singer chose by hand is the answer, and
	   nothing re-spells it afterwards. */
	function handleAccidental(kind: 'flat' | 'natural' | 'sharp'): void {
		const ev = selectedEvent;
		const p = ev && currentPitch(ev, doc.corrections);
		if (!p) return;
		const next =
			kind === 'flat' ? flatPitch(p) : kind === 'sharp' ? sharpPitch(p) : naturalPitch(p);
		// A capped click returns the same pitch, so the map is left alone and no
		// correction is recorded for a decision that changed nothing. The stack
		// stays out of it for the same reason: a pill offering to reverse a
		// change that never happened would be a lie.
		if (next === p) return;
		pushUndo({ kind: 'change', from: pitchLabel(p), to: pitchLabel(next) });
		correct({ pitch: next });
	}

	function handleBase(base: (typeof DIGIT_BASE)[string]): void {
		const ev = selectedEvent;
		const from = ev ? currentDuration(ev, doc.corrections).base : null;
		if (from && from !== base) {
			pushUndo({ kind: 'change', from: durationWord(from), to: durationWord(base) });
		}
		correct({ base });
	}

	function handleDot(): void {
		const ev = selectedEvent;
		if (!ev) return;
		const on = currentDuration(ev, doc.corrections).dots > 0;
		pushUndo({ kind: 'text', key: on ? 'loupe.undo.dotOff' : 'loupe.undo.dotOn' });
		correct({ dots: on ? 0 : 1 });
	}

	function handleMove(direction: 1 | -1): void {
		const id = selectedEventId;
		if (!id) return;
		const next = neighbourId(readLine, doc.corrections, id, direction);
		if (next) selectedEventId = next;
	}

	function handleDeleteNote(): void {
		const id = selectedEventId;
		if (!id) return;
		// Move the selection off the note before removing it, so the singer is
		// left somewhere rather than nowhere. Forward first, then back, because
		// a run of false positives is usually deleted left to right.
		const next =
			neighbourId(readLine, doc.corrections, id, 1) ??
			neighbourId(readLine, doc.corrections, id, -1);
		pushUndo({ kind: 'text', key: 'loupe.undo.deleted' });
		doc.corrections = withCorrection(doc.corrections, id, { deleted: true });
		selectedEventId = next;
	}

	function handleRestoreNote(): void {
		if (!selectedEventId) return;
		pushUndo({ kind: 'text', key: 'loupe.undo.restored' });
		doc.corrections = clearCorrection(doc.corrections, selectedEventId);
	}

	/* THE KEYBOARD, active only while a note is selected. Finale's own digit
	   mapping, kept because Dann knows it in his fingers.

	   It stands down inside a text field. A singer typing a title or a poem
	   must not have `5` swallowed by the score, and `closest` covers the
	   contenteditable case as well as inputs. */
	function handleCorrectionKey(e: KeyboardEvent): void {
		if (!selectedEventId) return;
		const el = e.target as HTMLElement | null;
		if (el?.closest('input, textarea, select, [contenteditable="true"]')) return;
		if (e.metaKey || e.ctrlKey || e.altKey) return;

		switch (e.key) {
			case 'ArrowUp':
				e.shiftKey ? handleOctave(1) : handleStep(1);
				break;
			case 'ArrowDown':
				e.shiftKey ? handleOctave(-1) : handleStep(-1);
				break;
			case '+':
			case '=':
				handleSemitone(1);
				break;
			case '-':
			case '_':
				handleSemitone(-1);
				break;
			case 'ArrowLeft':
				handleMove(-1);
				break;
			case 'ArrowRight':
				handleMove(1);
				break;
			case '.':
				handleDot();
				break;
			case 'Delete':
			case 'Backspace':
				handleDeleteNote();
				break;
			case 'Escape':
				selectedEventId = null;
				break;
			default:
				if (DIGIT_BASE[e.key]) handleBase(DIGIT_BASE[e.key]);
				else return;
		}
		// Reached only where a branch above acted, so a key this surface does
		// not claim still reaches the rest of the app.
		e.preventDefault();
	}

	/** The score the renderer sees: the read, with the hand corrections applied. */
	const correctedScore = $derived.by(() => {
		const ing = ingestedScore;
		if (!ing) return null;
		if (correctedCount === 0) return ing;
		return {
			...ing,
			result: {
				...ing.result,
				score: {
					...ing.result.score,
					vocalLine: applyCorrections(ing.result.score.vocalLine, doc.corrections),
				},
			},
		};
	});
	/* N.92 mobile slice 2. A PHONE IS A SMALLEST-SIDE TEST, not a width test,
	   and the two answer different questions. `isMobile` asks whether THIS
	   frame is narrower than the page, which is what decides the fit and which
	   rotation therefore flips. The loupe and the dock are ruled for a phone
	   in BOTH orientations, and 932 by 430 is over the width breakpoint while
	   still being the same hand holding the same glass. The smallest side is
	   under 768 in both, and on a desk it is not. */
	let isPhone = $state(false);
	/** Portrait docks at the bottom edge, landscape at the left. */
	let phonePortrait = $state(true);

	/* ── THE LOUPE AND THE DOCK (N.92 mobile slice 2) ────────────────────
	   Ruled by Dann 2026-08-25 and 2026-08-26. The page is the product and the
	   loupe is surgery on one of its components: a coarse tap on the page
	   chooses the measure, the loupe raises on it at 2.4 times, and the dock
	   carries the four stations. The page then drops one step of ink and stops
	   taking gestures until the loupe leaves.

	   THE STATE LIVES HERE, with the verbs. `Loupe.svelte` reads the rendered
	   page's own geometry and draws; `CorrectionDock.svelte` presents; neither
	   owns a correction. That is the split `SyllableStation` and
	   `ShiftLyricsControl` already keep. */
	let loupeOpen = $state(false);
	let dockHeight = $state(0);

	/** The score document on a phone, in either orientation, with a read to correct. */
	const loupeAvailable = $derived(
		INCLUDE_SHANE &&
			isPhone &&
			destination === 'studio' &&
			studioDocument !== 'transcription' &&
			!!ingestedScore,
	);

	/** The line as the PAGE draws it: deletions applied, so the loupe and the
	    paper never disagree about which entries a measure holds. */
	const renderedLine = $derived(correctedScore?.result.score.vocalLine ?? []);

	const heldMeasureIndex = $derived(selectedEvent ? selectedEvent.measureIndex : null);

	/* The measure's own display number, which is what the tag prints. A pickup
	   measure is `'0'` or `''` by publisher convention (`types.ts:225`), so the
	   index is the fallback and never the first answer. */
	const heldMeasureLabel = $derived.by(() => {
		const i = heldMeasureIndex;
		if (i === null) return null;
		const m = ingestedScore?.result.score.measures.find((x) => x.index === i);
		return m && m.number.trim() ? m.number : String(i + 1);
	});

	const heldMeasureIds = $derived(
		heldMeasureIndex === null
			? []
			: renderedLine
					.filter((ev) => ev.type !== 'rest' && ev.measureIndex === heldMeasureIndex)
					.map((ev) => ev.id),
	);

	/** The next measure that carries an entry, which bounds the loupe's window. */
	const nextMeasureIds = $derived.by(() => {
		if (heldMeasureIndex === null) return [];
		const later = renderedLine.filter(
			(ev) => ev.type !== 'rest' && ev.measureIndex > heldMeasureIndex,
		);
		const first = later[0];
		if (!first) return [];
		return later.filter((ev) => ev.measureIndex === first.measureIndex).map((ev) => ev.id);
	});

	/* THE READOUT, `F3 · quarter · на`. Every part of it is a string the app
	   already ships, and a part that has no value is absent rather than
	   printed empty: an unpaired note simply has no syllable segment. */
	const readoutLine = $derived.by(() => {
		const parts: string[] = [];
		if (selectedLabel) parts.push(selectedLabel);
		if (selectedBase) parts.push(durationWord(selectedBase));
		if (selectedDotted) parts.push(t('correct.dot', language));
		const p = selectedEventId ? shownPairings[selectedEventId] : undefined;
		if (p && p.kind === 'syllable') parts.push(p.cyrillic);
		return parts.join(' \u00b7 ');
	});

	/* THE DOCK'S LYRIC VERBS ANCHOR ON THE TAKEN ENTRY, ruled by Dann
	   2026-08-26. The schematic said so in its own §4, labelling the station
	   `LYRIC · TAKE A NOTE TO SHIFT ITS SYLLABLE`, and slice 2 measured what
	   the shipped anchor cost on a phone: the two scopes anchored on whichever
	   note held the syllable under the DRAWER's station cursor, and the dock
	   carries no cursor control, so the cells read disabled in the ordinary
	   flow.

	   THE DRAWER'S OWN VERBS ARE UNTOUCHED. `shiftAnchorEventId` and
	   `shiftDisabled` still drive `ShiftLyricsControl` from the station cursor,
	   because desktop is not in this slice and that anchor is the one Dann
	   confirmed on 2026-08-14. Two surfaces, two anchors, and each one says on
	   its face which note it acts from: the drawer through the station cursor
	   it sits beside, the dock through the entry in the loupe above it.

	   `eventIds` EXCLUDES RESTS, and so does every hit rectangle on the page,
	   so a taken entry always has an index here. */
	const dockShiftAnchor = $derived(
		selectedEventId && eventIds.includes(selectedEventId) ? selectedEventId : null,
	);
	const dockShiftDisabled = $derived(dockShiftAnchor === null);

	function handleDockShift(scope: 'end' | 'nextOpen', direction: ShiftDirection): void {
		const anchor = dockShiftAnchor;
		if (anchor === null) return;
		const fromIndex = eventIds.indexOf(anchor);
		if (fromIndex === -1) return;
		const result =
			scope === 'end'
				? shiftToEndOfLyric(doc.pairings, eventIds, fromIndex, direction)
				: shiftToNextOpenNote(doc.pairings, eventIds, fromIndex, direction);
		pushUndo({ kind: 'text', key: 'loupe.undo.lyrics' });
		doc.pairings = result.map;
	}

	const undoLabel = $derived.by(() => {
		const top = undoStack[undoStack.length - 1];
		if (!top) return null;
		return top.note.kind === 'text'
			? t(top.note.key, language)
			: `${top.note.from} \u2192 ${top.note.to}`;
	});

	/* THE PAGE'S FIRST STATE: every measure takes a tap, and a tap resolves to
	   the nearest entry rather than needing to land on a 7 px notehead. That
	   is what makes item 9's exemption for the page's own glyphs safe: coarse
	   tap picks the measure, and fine work happens inside the loupe.

	   IT DOES NOT DISTURB PLACEMENT. `handleNotePick`, VoiceProfilePane's own
	   delegated listener, still runs on a tap that lands on a hit rectangle
	   and still places the pending syllable. This adds the loupe and the
	   nearest-entry fallback, and takes nothing away. */
	function handlePageTap(e: MouseEvent): void {
		if (!loupeAvailable || loupeOpen) return;
		/* A TAP THAT BEGAN ON THE LOUPE OR THE DOCK IS NEVER A TAP ON THE PAGE,
		   and this is the fix for the dead dismissal Dann walked on the deploy.

		   THE CAUSE, exactly. The chevron's own `onclick` runs first, at the
		   target, and sets `loupeOpen` false. Svelte flushes and takes the dock
		   out of the DOM. The SAME click event then finishes bubbling to the
		   window and reaches this handler, where `loupeOpen` is now false so the
		   guard above lets it through, and `elementFromPoint` is a LIVE query:
		   the dock that stood at those coordinates is gone, so it answers with
		   the page underneath and the loupe rises again on whatever measure sits
		   there. Reproduced: a chevron press at 396, 538 in portrait re-tagged
		   the loupe from `m. 9 · system 3 of 6` to `m. 16 · system 5 of 6`,
		   which is Dann's own reading of it. In landscape the same press
		   dismissed correctly, because no sheet sits under the chevron there,
		   and that is why the first walk missed it.

		   TWO TESTS, BECAUSE THERE ARE TWO CASES. The click's own target still
		   answers `closest` after Svelte removes it, because a detached subtree
		   keeps its own ancestors, and that covers the chevron. A click
		   synthesized at the end of a swipe can carry a target that is already
		   the page, so the gesture that produced it is remembered on
		   `pointerdown` and consulted here. */
		if ((e.target as Element | null)?.closest?.('.loupe, .dock')) return;
		if (gestureBeganOnSurface) return;
		/* THE SHEET IS FOUND AT THE POINT, NOT FROM `e.target`, and both halves
		   of that are measured requirements rather than preferences.

		   NOT `e.target`, because a tap that lands on a hit rectangle reaches
		   VoiceProfilePane's delegated listener first, and on a desk that
		   listener places the pending syllable and re-renders the page through
		   `{@html}`. By the time the event reaches the window, the rectangle it
		   started on has been replaced and `closest` finds nothing, so the
		   loupe never rose on a score that had lyrics waiting.

		   `elementFromPoint` RATHER THAN A POINT-IN-BOX TEST over the sheets,
		   which is what this was first. A box test asks only whether the sheet
		   is under the finger and never whether anything is on top of it, and
		   the drawer on a phone covers the whole screen while the sheet keeps
		   its box behind it. Measured: every tap on an open drawer raised the
		   loupe. This asks the document what is actually topmost, and it
		   re-queries live, so it cannot be detached out from under itself
		   either. */
		const sheet = document.elementFromPoint(e.clientX, e.clientY)?.closest('.score-page');
		if (!sheet) return;
		const targets = [...sheet.querySelectorAll('[data-hit]')].map((el) => {
			const r = el.getBoundingClientRect();
			return {
				id: el.getAttribute('data-hit') ?? '',
				cx: r.left + r.width / 2,
				cy: r.top + r.height / 2,
			};
		});
		const id = nearestTarget(targets, e.clientX, e.clientY);
		if (!id) return;
		selectedEventId = id;
		loupeOpen = true;
	}

	function dismissLoupe(): void {
		loupeOpen = false;
		selectedEventId = null;
	}

	/* SWIPE DOWN, from anywhere on either, sends both away together. Bound at
	   the window and filtered by where the gesture STARTED, so one
	   implementation serves the loupe and the dock and the two cannot drift.
	   A stray tap outside the loupe deliberately does nothing: it is the
	   easiest gesture to make by accident, and no Undo restores a lost place. */
	let swipeFrom: { x: number; y: number } | null = null;
	/** Whether the gesture now in flight started on the loupe or the dock. */
	let gestureBeganOnSurface = $state(false);

	function handleSurfacePointerDown(e: PointerEvent): void {
		const el = (e.target as Element | null)?.closest?.('.loupe, .dock');
		gestureBeganOnSurface = !!el;
		swipeFrom = el ? { x: e.clientX, y: e.clientY } : null;
	}

	function handleSurfacePointerUp(e: PointerEvent): void {
		const from = swipeFrom;
		swipeFrom = null;
		if (from && loupeOpen && isDismissSwipe(e.clientX - from.x, e.clientY - from.y)) {
			dismissLoupe();
		}
		/* Cleared on the NEXT frame, not here. The click that a tap synthesizes
		   arrives after `pointerup`, and the flag has to still be standing when
		   it does. */
		requestAnimationFrame(() => (gestureBeganOnSurface = false));
	}

	/* A gesture the browser takes away from us, most often to scroll something.
	   It ends the swipe without a `pointerup`, so without this the flag would
	   stand until the next gesture and swallow one page tap. */
	function handleSurfacePointerCancel(): void {
		swipeFrom = null;
		gestureBeganOnSurface = false;
	}

	/* The loupe cannot stand without something to hold. Leaving the phone, the
	   score document, or the selection closes it, so it never survives into a
	   state where it would be drawing a measure nobody is working on. */
	$effect(() => {
		if (!loupeAvailable || !selectedEventId) loupeOpen = false;
	});

	/* ONE SURFACE AT A TIME. Ruled by Dann 2026-08-26 on the deploy walk:
	   opening the drawer sends the loupe and the dock away, in the same one
	   motion they leave by any other route.

	   THE DRAWER AND THE DOCK ARE SIBLINGS, and the schematic's own answer to
	   where the surface lives says only one of the two is open at a time. On a
	   phone the drawer covers the whole screen, so without this the singer met
	   three surfaces stacked on one another with the page under all of them.

	   IT COSTS THE SELECTION, and that is the ruling rather than an oversight:
	   this is the same leave the chevron performs, so the drawer's own
	   correction station arrives idle. */
	$effect(() => {
		if (!drawerCollapsed && loupeOpen) dismissLoupe();
	});

	// Fit engraving geometry: the fixed stave target (Kimi Q2, 2026-07-15).
	// No user control; the Appendix-derived defaults are the product, and the
	// renderer reads them as a constant. Kept as state for VoiceProfilePane.
	let engraving = $state<EngravingValues>({ ...ENGRAVING_DEFAULTS });
	// Q3 wizard collapse (Kimi §A.28): successful-render counter and the
	// wizard's collapse state, both held here so they survive the shane
	// panel's unmount on tab switches. The pane reports a render once per
	// mount; renderCountedFor dedupes by score identity across remounts,
	// so returning to the Fit tab never re-collapses an expanded wizard.
	let scoreRenders = $state(0);
	let wizardCollapsed = $state(false);
	let renderCountedFor: IngestedScore | null = null;
	function handleScoreRendered() {
		if (!ingestedScore || renderCountedFor === ingestedScore) return;
		renderCountedFor = ingestedScore;
		scoreRenders += 1;
	}
	let updateDismissed = $state(false);
	// Active heading for TOC sync
	let activeHeadingId = $state<string | null>(null);
	// Tab transition animation
	// Fit (engine codename 'shane') sits adjacent to Transcription; the
	// slide-direction order matches the visible tab order (Dann, 2026-07-12).
	const TAB_ORDER: TabId[] = ['transcription', 'shane', 'learn', 'guide'];
	let tabTransitionClass = $state('');
	// Mobile awareness. A WIDTH test, which on a phone is also the portrait
	// test: 390 by 844 is under the breakpoint and 844 by 390 is over it, so
	// rotation switches the mode exactly as Dann's rotation ruling says.
	let isMobile = $state(false);
	let mainContentEl: HTMLElement | undefined = $state(undefined);

	/* ── Portrait C: the page and the aid (ruled by Dann 2026-08-18) ──
	   The arrival view is the page. `Read` swaps in the aid, `The page`
	   swaps it back. Both stay mounted: the page has to survive the swap or
	   printing from the aid would emit nothing, and remounting it would
	   re-measure the title header from zero and re-paginate the document
	   under the singer. */
	let portraitView = $state<'page' | 'aid'>('page');
	/* One scroll position each, so neither view loses the singer's place. */
	let pageScrollTop = 0;
	let aidScrollTop = 0;

	async function showPortraitView(next: 'page' | 'aid') {
		if (next === portraitView) return;
		if (mainContentEl) {
			if (portraitView === 'page') pageScrollTop = mainContentEl.scrollTop;
			else aidScrollTop = mainContentEl.scrollTop;
		}
		portraitView = next;
		await tick();
		if (mainContentEl) {
			mainContentEl.scrollTop = next === 'page' ? pageScrollTop : aidScrollTop;
		}
	}

	/* Leaving portrait, or leaving Transcription, returns to the page. The aid
	   is a portrait reading of the transcription and has no meaning anywhere
	   else, and a singer who rotates back should meet the artefact. */
	$effect(() => {
		if (!isMobile || destination !== 'studio' || studioDocument !== 'transcription')
			portraitView = 'page';
	});
	// Song metadata: `doc.metadata`, N.67 step 0.
	// Notation preferences -- persisted to localStorage
	let notationPrefs = $state<NotationPreferences>({
		reducedVowel: false,
		shcha: false,
		palatalNasal: false,
		geminate: false,
		reconstitution: false,
	});
	// Display preferences
	let showStressDiacritics = $state(false);
	// The open-syllabification choice is `doc.openSyllabification`, N.67 step
	// 0. Its localStorage key is unchanged, and stays the default for new
	// songs when step 4 makes songs plural (design §2.2).
	// Spot reconstitution: ephemeral per-word overrides, keyed by "lineIndex-wordIndex"
	// Cleared on every transcribe or clear action
	let spotReconstitution = $state<Map<string, boolean>>(new Map());
	// User stress overrides: keyed by "lineIndex-wordIndex"
	// Cleared on every fresh transcription
	let userStressOverrides = $state<Map<string, UserStressOverride>>(new Map());
	// Character-level ё toggles: keyed by "lineIndex-wordIndex-charIndex"
	// Cleared on every fresh transcription
	let yoToggles = $state<Map<string, YoToggle>>(new Map());
	// Per-word syllable boundary overrides: keyed by "lineIndex-wordIndex"
	// Cleared when the global open syllabification toggle changes in either direction,
	// and on every fresh transcription or clear action.
	let syllableOverrides = $state<Map<string, SyllableOverride>>(new Map());
	// Per-word gloss overrides are `doc.glossOverrides`, keyed by
	// "lineIndex-wordIndex", cleared on every fresh transcription or clear
	// action, and by per-word reset.
	//
	// N.57: `doc.glossAnchors` holds the Cyrillic word each gloss was written
	// for, same keys. A gloss survives a re-transcription only where that word
	// is still at that position; otherwise it falls away rather than
	// re-attaching to whatever moved into the slot.
	// Breath animation state
	// paperBreathClass: animates Paper content only (transcription trigger)
	// viewBreathClass: animates entire app content (language toggle)
	let paperBreathClass = $state('');
	let viewBreathClass = $state('');
	function triggerPaperBreathIn() {
		paperBreathClass = 'breath-in';
		setTimeout(() => { paperBreathClass = ''; }, 300);
	}
	function triggerViewBreathCycle(callback: () => void) {
		viewBreathClass = 'breath-out';
		setTimeout(() => {
			callback();
			viewBreathClass = 'breath-in';
			setTimeout(() => { viewBreathClass = ''; }, 300);
		}, 150);
	}
	// ── Dynamic drawer width: pure calculation from ribbon content ──
	// Atoms are fixed 32px. Gaps, borders, and padding are constants.
	// Width is computed before render (no DOM measurement, no flicker).
	function calculateDrawerWidth(word: WordStackData): number {
		const ATOM_W = 32;
		const ATOM_GAP = 2;
		const MOL_PAD_BORDER = 9; // 3px padding × 2 + 1.5px border × 2
		const SYLLABLE_GAP = 12;
		const CLITIC_COL_W = ATOM_W + MOL_PAD_BORDER; // 41px
		const OVERHEAD = 70; // 32px panel padding + 24px lip + borders/scrollbar
		// Count atoms per syllable from displayLog
		const syllableAtomCounts = new Map<number, number>();
		for (const entry of word.displayLog) {
			const si = entry.syllableIndex ?? 0;
			syllableAtomCounts.set(si, (syllableAtomCounts.get(si) ?? 0) + 1);
		}
		let ribbonWidth = 0;
		const syllableCount = syllableAtomCounts.size;
		// Sum molecule widths
		for (const [, atomCount] of syllableAtomCounts) {
			ribbonWidth += atomCount * ATOM_W + (atomCount - 1) * ATOM_GAP + MOL_PAD_BORDER;
		}
		// Gaps between syllable columns
		if (syllableCount > 1) {
			ribbonWidth += (syllableCount - 1) * SYLLABLE_GAP;
		}
		// Clitic arrow columns (standalone, outside molecules)
		if (word.isProclitic) ribbonWidth += CLITIC_COL_W + SYLLABLE_GAP;
		if (word.isEnclitic) ribbonWidth += CLITIC_COL_W + SYLLABLE_GAP;
		return Math.max(520, Math.min(720, ribbonWidth + OVERHEAD));
	}
	// Derived
	const showInspector = $derived(selectedWord !== null);
	// Reading mode means the long-form reading tabs. Shane is a
	// paper-on-desk gallery like Transcription (Dann's consistency ruling,
	// 2026-07-12): its page sits exactly where the transcription page
	// sits, sharing the full 2rem desk padding rather than reading mode's
	// trimmed 1rem.
	const isReadingMode = $derived(destination !== 'studio');
	/* N.73 S3 ship two. THE WIDTH FOLLOWS THE CONSOLE, AND THE CONSOLE IS
	   STUDIO'S, NOT THE TRANSCRIPTION'S. This read `activeTab === 'transcription'`,
	   which was true while the two Studio documents had two drawers. S2 gave
	   them one: `RootPanel` and its Word Console render on BOTH documents, so a
	   word selected on the transcription is still shown on the marked score,
	   and the old expression narrowed the drawer back to 520 with the widened
	   word still in it. That contradicted S2's own invariant, "nothing in the
	   drawer appears, disappears, or moves when the singer flips the pair."
	   The guard on `destination` is still needed: Learn and Guide draw no
	   console, and a word selected before the singer left Studio must not
	   widen a reading drawer. MEASURED both ways; the numbers are in the
	   ship-two memo. */
	const drawerWidth = $derived(
		destination === 'studio' && selectedWord ? calculateDrawerWidth(selectedWord) : 520
	);
	const canTranscribe = $derived(
		doc.inputText.trim().length > 0 && !loaderState.isLoading && loaderState.entryCount > 0
	);
	const hasResults = $derived(lines.length > 0);
	/**
	 * N.73 S2. ONE Print button, in the Transcription drawer's button row,
	 * guarded by whichever document is on the desk. Both expressions are the
	 * ones the two buttons carried before the drawers merged, verbatim:
	 * the transcription is printable once it has been transcribed, and the
	 * marked score once a score is ingested or a formant exists. Nothing new
	 * is invented, and neither behaviour is lost.
	 */
	/**
	 * N.73 S3 ship one. Whether the active voice holds any reading at all.
	 * ONE predicate, `hasAnyReadings` in `profileStore.ts`, lifted out of
	 * `CalibrationWizard` so the wizard's opening phase, the voice anchor's
	 * sentence, and this Print guard cannot give three answers. The guard's
	 * expression is unchanged in meaning: it read
	 * `Object.keys(shaneFormants).length === 0` inline, which is the same test
	 * written a second time.
	 */
	/* `printDisabled` IS GONE, N.65, Dann's ruling of 2026-08-21. It read
	   `studioDocument === 'shane' ? !ingestedScore && !voiceCalibrated
	   : !hasResults`, and it guarded a Print button inside the drawer. Print
	   sits under the sheet now and IT IS ALWAYS LIVE ON TRANSCRIPTION AND
	   MARKED SCORE: no disabled state, no greying. `voiceCalibrated` stays,
	   because the voice anchor reads it. */
	const voiceCalibrated = $derived(hasAnyReadings(shaneFormants));
	/**
	 * Entering the takeover expands the wizard first. The Q3 collapse (Kimi
	 * §A.28) exists so a rendered score can take the drawer back from a wizard
	 * that was SHARING it; a wizard that has the whole drawer is not sharing
	 * anything, and a takeover that opened onto a one-line compact header would
	 * be a ritual with its own ritual hidden. This is a decision about the
	 * MOUNT POINT, not about the wizard, which is untouched.
	 */
	function enterCalibration() {
		wizardCollapsed = false;
		calibrating = true;
	}
	function exitCalibration() {
		calibrating = false;
	}
	const wordCount = $derived(
		lines.reduce((sum, l) => sum + l.words.length, 0)
	);
	// Apply open syllabification as a display-time transform (no pipeline re-run).
	// Per-word syllable overrides take precedence when present.
	const effectiveLines = $derived.by(() => {
		if (doc.openSyllabification || syllableOverrides.size > 0) {
			return applyOpenSyllabificationToLines(lines, syllableOverrides, doc.openSyllabification);
		}
		return lines;
	});
	function runPipeline() {
		transcribeError = '';
		try {
			const start = performance.now();
			const result = processText(doc.inputText, {
				language,
				userStressOverrides: userStressOverrides.size > 0 ? userStressOverrides : undefined,
				yoToggles: yoToggles.size > 0 ? yoToggles : undefined,
			});
			transcribeMs = Math.round(performance.now() - start);
			lines = result;
			// Update selected word to reflect new pipeline results
			if (selectedWord) {
				const newWord = result[selectedWord.lineIndex]?.words?.[selectedWord.wordIndex];
				if (newWord) selectedWord = newWord;
			}
		} catch (e: unknown) {
			transcribeError = e instanceof Error ? e.message : String(e);
			console.error('[Ilya] Transcription error:', e);
		}
	}
	/**
	 * The per-SESSION state, which is not the song and is never stored.
	 *
	 * Every one of these keys on word positions in the poem that is about to be
	 * replaced, so all three callers drop them together: Transcribe, Clear, and
	 * N.67 step 4b's song switch. They were three copies of one list until the
	 * switch would have made it four.
	 */
	function resetSessionState() {
		transcribeError = '';
		selectedWord = null;
		lastFocusedWord = null;
		spotReconstitution = new Map();
		userStressOverrides = new Map();
		yoToggles = new Map();
		syllableOverrides = new Map();
	}
	function handleTranscribe() {
		if (!canTranscribe) return;
		resetSessionState();
		// N.57: glosses are deliberately NOT wiped here. runPipeline() rebuilds
		// `lines`, then keepSurvivingGlosses() drops only the ones whose word
		// moved. The Guide has promised this since before it was true.
		runPipeline();
		keepSurvivingGlosses();
		if (lines.length > 0) {
			// Breath animation: content appears with breath-in
			triggerPaperBreathIn();
			// Console output for verification
			console.group('[Ilya] Transcription result');
			lines.forEach((line, li) => {
				console.group(`Line ${li}`);
				line.words.forEach((w) => {
					console.log(
						`${w.cleanWord} → ${w.ipaDisplay}`,
						{
							stress: w.stressIndex,
							source: w.stressSource,
							boundary: w.rightBoundary,
							proclitic: w.isProclitic,
							enclitic: w.isEnclitic,
							gloss: w.gloss,
						}
					);
				});
				console.groupEnd();
			});
			console.groupEnd();
			// Focus first WordStack after render
			requestAnimationFrame(() => {
				const first = document.querySelector<HTMLElement>('[data-word-index="0-0"]');
				first?.focus();
			});
		}
	}
	function handleClear() {
		doc.inputText = '';
		lines = [];
		transcribeMs = 0;
		resetSessionState();
		doc.glossOverrides = new Map();
		doc.glossAnchors = new Map();
		// The document writes the cleared poem and the cleared glosses itself.
		// Clearing used to REMOVE the gloss key and write an empty poem; it now
		// writes an empty list and an empty poem, which restores identically.
	}
	function handlePrint() {
		window.print();
	}
	function handleWordClick(word: WordStackData) {
		selectedWord = word;
		lastFocusedWord = { line: word.lineIndex, word: word.wordIndex };
		// Auto-expand drawer if collapsed when user clicks a word
		if (drawerCollapsed) {
			drawerCollapsed = false;
		}
		// Switch to Transcription if clicking a word from another surface
		if (destination !== 'studio' || studioDocument !== 'transcription') {
			destination = 'studio';
			studioDocument = 'transcription';
			try {
				localStorage.setItem('ilya:activeTab', 'transcription');
			} catch {
				// localStorage unavailable
			}
		}
		console.log('[Ilya] Selected:', word.cleanWord, word.ipaDisplay, {
			stress: word.stressIndex,
			source: word.stressSource,
			gloss: word.gloss,
			displayLog: word.displayLog,
		});
	}
	function handleNotationChange(prefs: NotationPreferences) {
		notationPrefs = prefs;
		try {
			localStorage.setItem('ilya:notationPrefs', JSON.stringify(prefs));
		} catch {
			// localStorage unavailable (private browsing)
		}
	}
	function handleStressDiacriticsChange(value: boolean) {
		showStressDiacritics = value;
		try {
			localStorage.setItem('ilya:showStressDiacritics', JSON.stringify(value));
		} catch {
			// localStorage unavailable
		}
	}
	function handleOpenSyllabificationChange(value: boolean) {
		doc.openSyllabification = value;
		// Spec requirement: toggling global in either direction clears all per-word overrides
		syllableOverrides = new Map();
	}
	// Toggle spot reconstitution for the currently selected word
	function handleSpotReconToggle() {
		if (!selectedWord) return;
		const key = `${selectedWord.lineIndex}-${selectedWord.wordIndex}`;
		const newMap = new Map(spotReconstitution);
		if (newMap.has(key)) {
			newMap.delete(key);
		} else {
			newMap.set(key, true);
		}
		spotReconstitution = newMap;
	}
	// ── Stress assignment handler ────────────────────────────────
	function handleStressAssign(syllableIndex: number, source: string) {
		if (!selectedWord) return;
		const key = `${selectedWord.lineIndex}-${selectedWord.wordIndex}`;
		const existingOverride = userStressOverrides.get(key);
		const isClitic = selectedWord.isProclitic || selectedWord.isEnclitic || existingOverride?.promotedFromClitic;
		const newMap = new Map(userStressOverrides);
		newMap.set(key, {
			stressIndex: syllableIndex,
			stressSource: source as UserStressOverride['stressSource'],
			...(isClitic ? { promotedFromClitic: true } : {}),
		});
		userStressOverrides = newMap;
		runPipeline();
	}
	// ── Stress revert handler ────────────────────────────────────
	function handleStressRevert() {
		if (!selectedWord) return;
		const key = `${selectedWord.lineIndex}-${selectedWord.wordIndex}`;
		const newMap = new Map(userStressOverrides);
		newMap.delete(key);
		userStressOverrides = newMap;
		runPipeline();
	}
	// ── Character-level ё toggle handler ─────────────────────────
	function handleYoCharToggle(charIndex: number, source: string | null) {
		if (!selectedWord) return;
		const key = `${selectedWord.lineIndex}-${selectedWord.wordIndex}-${charIndex}`;
		const newMap = new Map(yoToggles);
		if (source === null) {
			// Revert: remove the toggle
			newMap.delete(key);
		} else {
			newMap.set(key, { source: source as YoToggle['source'] });
		}
		yoToggles = newMap;
		runPipeline();
	}
	// ── Per-word syllable override handler ────────────────────────
	function handleSyllableOverride(lineIndex: number, wordIndex: number, override: SyllableOverride) {
		const key = `${lineIndex}-${wordIndex}`;
		const newMap = new Map(syllableOverrides);
		newMap.set(key, override);
		syllableOverrides = newMap;
	}
	// ── Per-word syllable override removal ────────────────────────
	function handleSyllableOverrideClear(lineIndex: number, wordIndex: number) {
		const key = `${lineIndex}-${wordIndex}`;
		const newMap = new Map(syllableOverrides);
		newMap.delete(key);
		syllableOverrides = newMap;
	}
	// ── Per-word gloss override handler ───────────────────────────
	function handleGlossOverride(gloss: string | null) {
		if (!selectedWord) return;
		const key = `${selectedWord.lineIndex}-${selectedWord.wordIndex}`;
		const newMap = new Map(doc.glossOverrides);
		const newAnchors = new Map(doc.glossAnchors);
		if (gloss === null) {
			newMap.delete(key);
			newAnchors.delete(key);
		} else {
			newMap.set(key, gloss);
			newAnchors.set(key, selectedWord.cleanWord);
		}
		doc.glossOverrides = newMap;
		doc.glossAnchors = newAnchors;
	}
	// ---- N.57: gloss persistence and the survival guard -------------
	//
	// The comparison is lowercased and yo-folded, because the dictionary is
	// keyed by lowercase word form (curated-glosses.ts) and a yo toggle
	// re-spells a word without making it a different word.
	function glossAnchorForm(word: string): string {
		return word.toLowerCase().replace(/\u0451/g, '\u0435');
	}
	// The gloss rows are assembled and written by the library now
	// (`library.ts`, `recordFromFields`), in the same shape and under the same
	// key. `persistGlosses()` is gone: assigning the maps is the save.
	function keepSurvivingGlosses() {
		const nextGloss = new Map<string, string>();
		const nextAnchor = new Map<string, string>();
		for (const [key, gloss] of doc.glossOverrides) {
			const anchor = doc.glossAnchors.get(key);
			if (!anchor) continue;
			const [lineIdx, wordIdx] = key.split('-').map(Number);
			const word = lines[lineIdx]?.words?.[wordIdx];
			if (word && glossAnchorForm(word.cleanWord) === glossAnchorForm(anchor)) {
				nextGloss.set(key, gloss);
				nextAnchor.set(key, anchor);
			}
		}
		doc.glossOverrides = nextGloss;
		doc.glossAnchors = nextAnchor;
	}
	// ── Per-word reset: clear all overrides for the selected word ──
	function handleReset() {
		if (!selectedWord) return;
		const wordKey = `${selectedWord.lineIndex}-${selectedWord.wordIndex}`;
		let needsPipeline = false;
		// Clear stress override
		if (userStressOverrides.has(wordKey)) {
			const newStress = new Map(userStressOverrides);
			newStress.delete(wordKey);
			userStressOverrides = newStress;
			needsPipeline = true;
		}
		// Clear ё toggles for this word (keys are "lineIndex-wordIndex-charIndex")
		const yoPrefix = `${wordKey}-`;
		const hasYoToggles = [...yoToggles.keys()].some(k => k.startsWith(yoPrefix));
		if (hasYoToggles) {
			const newYo = new Map(yoToggles);
			for (const k of [...newYo.keys()]) {
				if (k.startsWith(yoPrefix)) newYo.delete(k);
			}
			yoToggles = newYo;
			needsPipeline = true;
		}
		// Clear syllable override
		if (syllableOverrides.has(wordKey)) {
			const newSyll = new Map(syllableOverrides);
			newSyll.delete(wordKey);
			syllableOverrides = newSyll;
		}
		// Clear spot reconstitution
		if (spotReconstitution.has(wordKey)) {
			const newSpot = new Map(spotReconstitution);
			newSpot.delete(wordKey);
			spotReconstitution = newSpot;
		}
		// Clear gloss override
		if (doc.glossOverrides.has(wordKey)) {
			const newGloss = new Map(doc.glossOverrides);
			newGloss.delete(wordKey);
			doc.glossOverrides = newGloss;
			const newAnchors = new Map(doc.glossAnchors);
			newAnchors.delete(wordKey);
			doc.glossAnchors = newAnchors;
		}
		if (needsPipeline) runPipeline();
	}
	function handleInput(text: string) {
		doc.inputText = text;
		nameIfUnnamed();
	}

	/* ── N.67 step 4a: a different piece has arrived ───────────────── */

	// The upload waiting on the singer's answer. NOTHING is mutated while this
	// is set: not the score, not the metadata, not the placements, not the
	// stored source. So "Keep this song" has nothing to undo.
	let pendingArrival = $state<{
		ingested: IngestedScore;
		file: File;
		orphaned: number;
		total: number;
	} | null>(null);
	let replaceDialogEl = $state<HTMLDialogElement | undefined>(undefined);
	let keepButtonEl = $state<HTMLButtonElement | undefined>(undefined);

	/**
	 * N.67 step 5. ONE dialog serves both warnings, because they are the same
	 * act: something is about to replace this song and cannot be undone.
	 *
	 * `title` and `body` are already-resolved strings, so the template holds no
	 * copy decisions, and `replace` is what the destructive button does.
	 */
	/**
	 * One button on the confirmation dialog. THE LAST ANSWER IS THE SAFE ONE.
	 *
	 * `keepOpen` is for the escape hatch: exporting first is not an answer, it is
	 * something you do before answering, so it must not close the dialog.
	 */
	type Answer = { label: string; run?: () => void; destructive?: boolean; keepOpen?: boolean };
	let pendingConfirm = $state<{ title: string; body: string; answers: Answer[] } | null>(null);
	const safeAnswer = $derived(pendingConfirm?.answers.at(-1) ?? null);

	async function askToReplace(title: string, body: string, answers: Answer[]): Promise<void> {
		pendingConfirm = { title, body, answers };
		// RENDERED BEFORE THE DIALOG OPENS. Without this tick the buttons do not
		// exist yet, so `showModal()`'s own focus algorithm settles on the dialog
		// and the explicit focus below reaches nothing. The safe answer is last
		// in the DOM, which is `keepButtonEl`.
		await tick();
		replaceDialogEl?.showModal();
		// Focus the SAFE answer. Done here rather than with `autofocus`, which
		// raises `a11y_autofocus` and would move the web-check gate; and the DOM
		// order is the visual order, so nothing a singer sees disagrees with
		// what a screen reader is told (Dann, 2026-08-16).
		keepButtonEl?.focus();
	}

	/**
	 * Every accepted score comes through here first.
	 *
	 * Before this existed, a second score overwrote the song's title and file in
	 * place while the first song's placements survived onto music they were
	 * never made for (measured at `5c9c7f3`). Now Ilya can tell that a different
	 * piece has arrived, and says so before anything is lost.
	 */
	/** N.59 step 7: the page provenance of the arrival currently being applied. */
	let arrivalPage: PageProvenance | null = null;

	async function handleArrival(
		ingested: IngestedScore,
		file: File,
		origin: 'upload' | 'restore',
		page?: PageProvenance,
	): Promise<void> {
		arrivalPage = page ?? null;
		// A restore is the song's own score coming back from the vault. It is
		// never a new arrival and must never be questioned.
		if (origin === 'restore') {
			applyArrival(ingested, file, origin, false);
			return;
		}
		const eventIds = ingested.result.score.vocalLine.filter((ev) => ev.type !== 'rest').map((ev) => ev.id);
		const present = new Set(eventIds);
		const stored = Object.keys(doc.pairings);
		const orphaned = stored.filter((id) => !present.has(id)).length;

		let incoming = '';
		try {
			incoming = await fingerprintVocalLine(ingested.result.score.vocalLine);
		} catch {
			// No fingerprint means no evidence, and an unprovable suspicion must
			// not stand between a singer and their score.
		}
		const decision = incoming
			? arrivalDecision({
					storedFingerprint: doc.source?.fingerprint,
					incomingFingerprint: incoming,
					orphanCount: orphaned,
				})
			: 'attach';

		// DESIGN §2.6, SECOND BRANCH. From a NEUTRAL state, which is what New
		// song creates, an arriving score is checked against the library before
		// it is attached to anything. A hash may GUIDE; only the singer decides,
		// so the answer is a prompt and never an action, and nothing at all is
		// mutated until they give one. A song that already has a score is not
		// neutral, and that path is `arrivalDecision`'s, untouched.
		if (doc.source === null) {
			const matches = await recognize(library.plural, incoming, doc.id);
			const match = matches[0];
			if (match) {
				void askToReplace(
					t('recognize.title', language),
					t('recognize.body', language).replace(
						'%s',
						toRows([match], t('songs.untitled', language))[0].label,
					),
					[
						{ label: t('recognize.open', language), run: () => void switchSong(match.id) },
						{ label: t('recognize.here', language), run: () => applyArrival(ingested, file, origin, false) },
					],
				);
				return;
			}
		}

		if (decision === 'ask') {
			pendingArrival = { ingested, file, orphaned, total: stored.length };
			void askToReplace(
				t('replace.title', language),
				t('replace.body', language).replace('%s', String(orphaned)).replace('%s', String(stored.length)),
				[
					{
						label: t('replace.replace', language),
						destructive: true,
						run: () => {
							const pending = pendingArrival;
							if (pending) applyArrival(pending.ingested, pending.file, 'upload', true);
						},
					},
					{ label: t('binder.exportFirst', language), run: () => void handleExport(), keepOpen: true },
					{ label: t('replace.keep', language) },
				],
			);
			return;
		}
		applyArrival(ingested, file, origin, false);
	}

	/**
	 * Answer the dialog. Closed FIRST, then acted on, so an act that opens
	 * another dialog is never fighting this one for the modal.
	 */
	function answerWith(answer: Answer): void {
		if (answer.keepOpen) {
			answer.run?.();
			return;
		}
		replaceDialogEl?.close();
		answer.run?.();
	}

	/**
	 * Attach a score to the open song.
	 *
	 * `replaceWholeSong` empties the placements FIRST, so the merge rule below
	 * sees a fresh map and proposes into it: title, score file, and placements
	 * all become the new piece's together, which is the whole point. Without it
	 * this is step 3's behaviour exactly, unchanged.
	 */
	function applyArrival(
		ingested: IngestedScore,
		file: File,
		origin: 'upload' | 'restore',
		replaceWholeSong: boolean,
	): void {
		if (replaceWholeSong) doc.pairings = {};
		// N.67 step 2. The singer's own bytes go down with the song, in one
		// transaction, so a reload brings the score back. Only a real upload
		// writes: a restore's bytes came from the vault.
		if (origin === 'upload') void attachUploadedSource(ingested, file, arrivalPage ?? undefined);
		// Live-wired (§E.7 slice 1): VoiceProfilePane renders this as paginated
		// notation in the Fit main pane.
		ingestedScore = ingested;
		// N.55b R3: the first pass runs on accept, and the N.55a courtesy message
		// arrives in the same moment or it has no moment at all. It runs ONLY
		// where the file carried no lyrics. Where the score has an underlay, Ilya
		// READS it (`vowel-resolver.ts`), and proposing over it would be Ilya
		// claiming where the score already speaks. That is an INFERENCE from R3
		// and N.55a together, not a ruling of Dann's.
		const noLyrics = ingested.result.warnings.some((w) => w.code === 'no-lyrics-found');
		noLyricsFile = noLyrics ? ingested.fileName : null;
		// N.67 step 3, design §2.6. THE MERGE RULE, and where N.68 closed: an
		// upload never destroys placements; only the singer does, on purpose,
		// with Start placement over or with the replace dialog above.
		const merged = mergeOnUpload(
			doc.pairings,
			ingested.result.score.vocalLine.filter((ev) => ev.type !== 'rest').map((ev) => ev.id),
			buildSlotQueue(lines),
			noLyrics,
		);
		doc.pairings = merged.map;
		// Kept, never dropped, and reported as a count.
		orphanedCount = merged.orphaned.length;
		// The cursor lands on the first syllable the pass did not reach. Only
		// moved where the pass actually ran: a re-upload must not walk the
		// singer's insertion point back.
		if (merged.proposed) {
			pairingCursor = Math.min(Object.keys(doc.pairings).length, Math.max(0, slotQueue.length - 1));
		}
		// A new score arrives: clear whatever the previous score filled, then
		// fill the blanks from this score's header if it carries one. A score
		// with no header still clears, and that case is the whole point: at E.23,
		// Musorgsky's Sunless 1 rendered under the Schubert's title, composer,
		// and poet, because a header-less score reached no code that touched
		// metadata at all.
		commitMetadataState(
			onScoreIngested(
				{ metadata: doc.metadata, fromScore: doc.fromScoreFields },
				ingested.result.score.workMetadata,
			),
		);
	}

	/* ── N.67 step 5: the binder ────────────────────────────────────── */

	let importInputEl = $state<HTMLInputElement | undefined>(undefined);
	let binderError = $state<string | null>(null);
	/** What an import added. Cleared by the next export or import, never stale. */
	let binderNotice = $state<string | null>(null);

	/* ── N.67 step 6, the sweep: what storage tells the singer ───────── */

	// The last reading of `navigator.storage.estimate()`. Taken at boot and read
	// again the moment a write refuses for quota, because the boot figure is the
	// one thing a full origin is guaranteed to have moved past.
	let storageReading = $state<StorageReading>(opened?.storage ?? { persisted: null });
	// Decided ONCE, at mount, because deciding it again would show the
	// once-per-device eviction notice a second time: `bootNotices` writes the
	// flag as it decides, which is what makes "once" survive a reload.
	let bootLines = $state<NoticeLine[]>([]);
	const storageLines = $derived(
		drawerNotices({
			boot: bootLines,
			saveFailure: doc.saveFailure,
			loadFailure: doc.loadFailure,
			reading: storageReading,
		}),
	);
	$effect(() => {
		// A REAL FIGURE OR NONE. The notice appends "Storage: x of y used" only
		// where the browser answered with numbers, and the numbers worth showing
		// are the ones from the moment the write refused.
		if (doc.saveFailure !== 'quota-exceeded') return;
		void readStorageEstimate().then((reading) => {
			storageReading = reading;
		});
	});

	/** A date a singer would write, in their own language. */
	function todayInWords(): string {
		return new Date().toLocaleDateString(language === 'fr' ? 'fr-CA' : 'en-CA', {
			day: 'numeric',
			month: 'long',
			year: 'numeric',
		});
	}

	/**
	 * Write the binder to the singer's own device.
	 *
	 * A Blob and an anchor, which lands in Downloads or the Files app. **NOT
	 * `navigator.share`**, which would be the sharing affordance design §8
	 * rules out: the binder is addressed to nobody, and the moment it is handed
	 * to another person that act is the person's, not the tool's.
	 *
	 * WHICH SONGS is the only difference between the two export controls, which
	 * is design §5's "a binder of one song and a binder of the whole library are
	 * the same object at different sizes". Everything else, the gathering, the
	 * naming, and the open song coming from the document rather than the vault,
	 * is `exchange.ts`, where a gate can reach it.
	 */
	async function writeBinder(ids: string[]): Promise<void> {
		binderError = null;
		binderNotice = null;
		const result = await exportBinder({
			ids,
			openId: doc.id,
			// Taken live: the document holds edits the vault has not seen, and a
			// rename debounces like everything else.
			openRecord: { ...doc.toRecord(), name: doc.name },
			// THE WHOLE LOAD RESULT. A record that failed validation comes back with
			// its raw stored value beside it, and that is what the binder carries:
			// design §4's salvage path, which is the only way anything ever comes
			// back out of a record Ilya has promised never to write to again.
			load: (id) => library.load(id),
			loadSource: (id) => library.loadSource(id),
			appVersion: version,
			exportedAt: new Date().toISOString(),
			today: todayInWords(),
			untitled: t('songs.untitled', language),
		});
		if (!result.ok) {
			binderError = t('binder.err.damaged', language);
			return;
		}
		const url = URL.createObjectURL(new Blob([result.bytes as BlobPart], { type: 'application/zip' }));
		const anchor = document.createElement('a');
		anchor.href = url;
		anchor.download = result.fileName;
		anchor.click();
		URL.revokeObjectURL(url);
	}

	const handleExport = (songId: string = doc.id): Promise<void> => writeBinder([songId]);
	/** Every song the list holds, in the order it draws them. */
	const handleExportAll = (): Promise<void> => writeBinder(songRows.map((row) => row.id));

	/**
	 * Raise design §5's three answers for one colliding song, and wait.
	 *
	 * PROMISE-SHAPED RATHER THAN CALLBACK-SHAPED, because the songs in a binder
	 * are asked about one at a time and each answer must land before the next is
	 * asked.
	 *
	 * **THE PRESS SETTLES IT, NOT THE CLOSE EVENT.** Measured 2026-08-18: in the
	 * browser this walk ran in, `close()` fires NO `close` event at all, on a
	 * bare `<dialog>` with no framework anywhere near it. An answer that waited
	 * for that event waited forever and the import hung on the first collision.
	 * `answerWith` closes before it runs, so the dialog is already shut when
	 * this resolves and the next `showModal()` is safe.
	 *
	 * Escape settles to Keep mine, because closing without answering changes
	 * nothing: nothing is mutated before the answer. Both `cancel` and `close`
	 * are listened for, and whichever arrives first wins; the rest are no-ops,
	 * because a question can only be answered once.
	 */
	let collisionResolve: ((answer: CollisionAnswer) => void) | null = null;

	function settleCollision(answer: CollisionAnswer): void {
		const resolve = collisionResolve;
		collisionResolve = null;
		resolve?.(answer);
	}

	function askCollision(collision: Collision): Promise<CollisionAnswer> {
		// ISO, YYYY-MM-DD: it reads the same in both languages and cannot be
		// misread as a different day (`placeholderName` sets the precedent).
		const mine = collision.mine.updatedAt.slice(0, 10);
		const theirs = collision.incoming.record.updatedAt.slice(0, 10);
		return new Promise((resolve) => {
			collisionResolve = resolve;
			void askToReplace(
				// N.67 step 6, walk finding W1. The title names the song being asked
				// about, so two collisions in a row are two questions rather than one
				// stubborn dialog. The name comes from `exchange.ts`, which knows the
				// placeholder rule for a song that was never named.
				t('collide.title', language).replace('%s', collisionName(collision, t('songs.untitled', language))),
				t('collide.body', language).replace('%s', mine).replace('%s', theirs),
				[
					{ label: t('collide.take', language), destructive: true, run: () => settleCollision('take') },
					{ label: t('collide.both', language), run: () => settleCollision('both') },
					{ label: t('collide.mine', language), run: () => settleCollision('mine') },
				],
			).then(() => {
				// A dialog that never opened must not hang the import forever.
				// Nothing was asked, so nothing is taken.
				if (!replaceDialogEl?.open) settleCollision('mine');
			});
		});
	}

	/**
	 * Read a binder in.
	 *
	 * **AN IMPORT ADDS SONGS TO THE LIBRARY. IT NEVER TOUCHES THE SONG YOU ARE
	 * IN** (Dann's ruling, 2026-08-18). The open-song warning that used to stand
	 * here is RETIRED: it existed because there was only ever one song to
	 * destroy, and songs have been plural since `cb7a15a`. The one question left
	 * is the id collision, and a singer who re-imports a binder of the song they
	 * are working in still meets it, because that is an id collision and that is
	 * the one moment the question is worth asking.
	 */
	async function handleImportFile(file: File): Promise<void> {
		binderError = null;
		binderNotice = null;
		const bytes = new Uint8Array(await file.arrayBuffer());
		const read = await readBinder(bytes, new Date().toISOString());
		if (!read.ok) {
			binderError = t(binderFailureKey(read.reason), language);
			return;
		}
		const outcome = await importBinder({
			songs: read.songs,
			// The ids the vault ACTUALLY holds. `library.load` cannot answer this:
			// an absent id yields an empty record rather than an error, so a check
			// written on it would report "no collision" for every song in the file.
			existing: await listSongs(library.plural),
			save: (record, source) => library.save(record, source),
			// N.67 step 6. A song that could not be read in the origin it left is
			// written back EXACTLY AS THE FILE CARRIES IT, with no stamp and no
			// rebuild, or the round trip would repair what design §4 promised to
			// leave untouched.
			salvage: (raw, id, source) => library.salvage(raw, id, source),
			ask: askCollision,
			newId,
			openId: doc.id,
		});
		if (outcome.failed) binderError = t('songs.err.write', language);
		const notice = importNoticeKey(outcome);
		if (notice) binderNotice = t(notice.key, language).replace('%s', String(notice.count));
		// THE ONLY CASE THAT RELOADS. The live document was replaced underneath,
		// and the document's own guarantee is that it is constructed FROM a
		// record already read, so a reload is the honest way to get that for a
		// record which has just arrived.
		if (outcome.replacedOpen) {
			location.reload();
			return;
		}
		// Every other answer leaves the singer exactly where they were, because
		// an import ADDS. The list is refreshed and the pointer does not move.
		await refreshSongs();
	}

	/* ── N.67 step 4b: the library door ─────────────────────────────── */

	// The library, as the drawer draws it. Read from the vault, refreshed after
	// every act that changes what is in it. The OPEN song's live name is laid
	// over its row below, because a rename debounces like every other write and
	// the singer must see it land immediately.
	let songs = $state<SongSummary[]>([]);
	let libraryError = $state<string | null>(null);
	let switching = false;

	async function refreshSongs(): Promise<void> {
		songs = await listSongs(library.plural);
	}

	const songRows = $derived(
		libraryRows(
			songs,
			{
				id: doc.id,
				name: doc.name,
				createdAt: doc.createdAt,
				updatedAt: doc.createdAt,
				fingerprint: doc.source?.fingerprint ?? null,
			},
			t('songs.untitled', language),
			// N.67 step 6: a song that cannot be written to keeps its STORED name
			// in the list, never the live one, which for a damaged record is a name
			// the page invented and can never save.
			doc.readOnly,
		),
	);

	/**
	 * Open another song. CLOSE() THEN OPEN(), never a prop change and never a
	 * reload.
	 *
	 * Measured 2026-08-18 on this Mac in Chromium, before the branch was chosen,
	 * from the score's bytes reaching the ingest path to a stave in the DOM:
	 * about 49 ms for a .musicxml and about 343 ms for a real 143 KB .musx, plus
	 * a vault read under a millisecond. A `location.reload()` measured 97 ms and
	 * 448 ms for the same two files and additionally throws away the tab, the
	 * drawer, the scroll position, and the loaded dictionary. So the reload
	 * branch costs more and buys nothing.
	 *
	 * `close()` flushes the outgoing song's debounce tail and tears its autosave
	 * down BEFORE the next document exists, so two documents never share an
	 * effect and a switch cannot cross-write one song's work into another's.
	 */
	async function switchSong(id: string): Promise<void> {
		if (id === doc.id || switching) return;
		switching = true;
		try {
			await doc.close();
			writeActiveSongId(localStorage, id);
			const next = await SongDocument.open(library, id);
			const bytes = await library.loadSource(id);
			// Everything belonging to the OUTGOING song, dropped before the new
			// document lands, so nothing of one song is ever drawn against the
			// other's music.
			resetSessionState();
			ingestedScore = null;
			lines = [];
			transcribeMs = 0;
			orphanedCount = 0;
			pairingCursor = 0;
			noLyricsFile = null;
			restoreSource = restoreFrom(bytes, next.source?.page);
			doc = next;
			await refreshSongs();
			// A SWITCH IS NOT A BOOT. The singer just chose this song, so Ilya
			// shows it to them rather than making them press Transcribe to see
			// what they left. It also has to run: `slotQueue` comes from `lines`,
			// so without it the placements would come back looking like drift.
			if (doc.inputText.trim() !== '' && !loaderState.isLoading && loaderState.entryCount > 0) {
				runPipeline();
				keepSurvivingGlosses();
			}
		} finally {
			switching = false;
		}
	}

	async function handleNewSong(): Promise<void> {
		// WRITTEN BEFORE IT IS OPENED, so a reload between the two finds a song
		// that is really there.
		const created = await createSong({ library, newId, now: () => new Date().toISOString() });
		if (!created.ok) {
			libraryError = t('songs.err.write', language);
			return;
		}
		libraryError = null;
		await refreshSongs();
		await switchSong(created.record.id);
	}

	function handleRenameSong(id: string, name: string): void {
		libraryError = null;
		// THE OPEN SONG IS RENAMED THROUGH ITS DOCUMENT. The document holds the
		// live record and would write its own name back over a rename that went
		// round it, so the rename would appear to work and then undo itself.
		if (id === doc.id) {
			// N.67 step 6: except when this song refuses to be written to at all.
			// Reported rather than swallowed, which is N.27's rule, and the sentence
			// already exists.
			if (doc.readOnly) {
				libraryError = t('songs.err.write', language);
				return;
			}
			doc.name = name;
			return;
		}
		void renameSong(library, id, name).then(async (outcome) => {
			if (!outcome.ok) libraryError = t('songs.err.write', language);
			await refreshSongs();
		});
	}

	function handleDeleteSong(id: string): void {
		const row = songRows.find((candidate) => candidate.id === id);
		if (!row) return;
		void askToReplace(
			t('songs.deleteTitle', language),
			t('songs.deleteBody', language).replace('%s', row.label),
			[
				{ label: t('songs.deleteConfirm', language), destructive: true, run: () => void commitDelete(id) },
				{ label: t('binder.exportFirst', language), run: () => void handleExport(id), keepOpen: true },
				{ label: t('replace.keep', language) },
			],
		);
	}

	/**
	 * Remove a song and its bytes together, or neither (design §2.1).
	 *
	 * SWITCH FIRST when the target is the song you are in. Its document is still
	 * autosaving, and a delete underneath a live document would be undone by that
	 * document's next write. `switchSong` closes it and flushes its tail, so what
	 * is deleted is a settled record and the survivor is already open.
	 */
	async function commitDelete(id: string): Promise<void> {
		if (id === doc.id) {
			const survivor = songRows.find((row) => row.id !== id);
			if (!survivor) {
				libraryError = t('songs.err.write', language);
				return;
			}
			await switchSong(survivor.id);
		}
		const outcome = await deleteSong(library.plural, id);
		libraryError = outcome.ok ? null : t('songs.err.write', language);
		await refreshSongs();
	}

	const songLibrary = $derived({
		songs: songRows,
		activeId: doc.id,
		// Six localStorage keys have no room for a second song and are not being
		// given one, so on the legacy driver New song and Delete do not render.
		plural: library.plural !== undefined,
		error: libraryError,
		// N.67 step 6. The two sentences a row may have to say about itself,
		// looked up here because the list holds no dictionary: `SongList.svelte`
		// draws, and every string it draws is handed to it.
		unreadable: t('song.unreadable', language),
		newerIlya: t('song.newerIlya', language),
		onopen: (id: string) => void switchSong(id),
		onnew: () => void handleNewSong(),
		onrename: handleRenameSong,
		ondelete: handleDeleteSong,
	});

	/* ── N.67 step 2: the source survives ──────────────────────────── */

	// The stored score, handed to the uploader so it can re-ingest it once at
	// boot. Read from the load result, not from the document: the document
	// carries the score's provenance, never its bytes.
	/**
	 * What the uploader needs to bring a stored score back.
	 *
	 * N.59 step 7: a page read off a picture comes back with the clef and key it
	 * was read with, so the restore never asks again.
	 */
	function restoreFrom(source: SourceBytes | null, page: PageProvenance | null | undefined) {
		if (!source) return null;
		return {
			fileName: source.fileName,
			bytes: source.bytes,
			answers: page ? { clef: page.clef, octaveChange: page.octaveChange, fifths: page.fifths } : null,
		};
	}

	// N.67 step 4b: STATE, because a switch hands the uploader a different
	// song's bytes. The uploader is keyed on `doc.id`, so it remounts and its
	// own restore runs, which is the same path a reload takes and no other.
	let restoreSource = $state(restoreFrom(opened?.source ?? null, opened?.loaded?.record?.source?.page));

	/**
	 * Keep the singer's own file, byte for byte.
	 *
	 * Two hashes, doing two different jobs (design §2.3, §2.4): `contentHash`
	 * names these exact bytes and can never go stale, and `fingerprint` answers
	 * "have I met this music before" for the recognition prompt step 4 builds.
	 * Neither is identity; the song id is.
	 */
	async function attachUploadedSource(
		ingested: IngestedScore,
		file: File,
		page?: PageProvenance,
	): Promise<void> {
		// N.59 step 7: on the reader route `file` is already the GREYSCALE INK,
		// so these bytes are the ones the retention ruling keeps and the ones a
		// re-read reproduces exactly. The picture the singer supplied is recorded
		// by name and hash inside `page` rather than kept twice.
		const bytes = await file.arrayBuffer();
		// THE HASHES ARE BEST EFFORT; THE BYTES ARE NOT. `crypto.subtle` is
		// absent outside a secure context, and losing it must cost recognition
		// (a step 4 convenience) and never the singer's file. An empty hash is
		// honestly empty and recomputable at any time from the stored bytes.
		let contentHash = '';
		let fingerprint = '';
		try {
			[contentHash, fingerprint] = await Promise.all([
				hashBytes(bytes),
				fingerprintVocalLine(ingested.result.score.vocalLine),
			]);
		} catch (err) {
			console.error('[Ilya] score kept, but it could not be hashed:', err);
		}
		const importedAt = new Date().toISOString();
		doc.attachSource(
			{ songId: doc.id, fileName: file.name, bytes, byteLength: bytes.byteLength, contentHash, importedAt },
			{
				fileName: file.name,
				byteLength: bytes.byteLength,
				importedAt,
				contentHash,
				fingerprint,
				page: page ?? null,
			},
		);
	}
	function handleLanguageChange(lang: Language) {
		const doSwap = () => {
			language = lang;
			try {
				localStorage.setItem('ilya:language', lang);
			} catch {
				// localStorage unavailable
			}
			// Re-run pipeline to update glosses in the new language
			if (hasResults && doc.inputText.trim().length > 0) {
				runPipeline();
			}
		};
		// If there's content visible, use breath cycle; otherwise swap immediately
		if (hasResults) {
			triggerViewBreathCycle(doSwap);
		} else {
			doSwap();
		}
	}
	function handleMetadataChange(meta: SongMetadata) {
		// A "from score" tag fades on the field's first edit (Kimi's Q1
		// refinement, 2026-07-13). The callers below set the tags AFTER
		// calling this, so their own writes do not clear them.
		const kept = dropTagsForEdits(doc.metadata, meta, doc.fromScoreFields);
		if (kept !== doc.fromScoreFields) setFromScoreFields(kept);
		doc.metadata = meta;
		nameIfUnnamed();
	}

	/**
	 * Design §2.3 layer 3, called where the singer's material arrives: the
	 * metadata, whether typed or filled from a score header, and the poem.
	 *
	 * Not at creation, because a song made a moment ago has nothing to be named
	 * after, and not on every change, because a name the singer has accepted is
	 * theirs and Ilya does not argue with it. `nameFor` holds the rule.
	 */
	function nameIfUnnamed(): void {
		// N.67 step 6. Naming is a WRITE, and a record that could not be read is
		// never written to. Without this the page invents a name for a damaged
		// song on the singer's first keystroke and nothing can ever store it.
		if (doc.readOnly) return;
		if (doc.name !== '') return;
		const named = nameFor(doc.toRecord(), songs);
		if (named !== '') doc.name = named;
	}

	// ── §A.6 metadata provenance ──
	// The transitions live in $lib/metadata-provenance, where vitest can
	// reach them; the document holds the state and the library persists it.
	// Kimi's rulings, 2026-07-13, on filling blanks and fading a tag on a
	// hand edit; Dann's ruling, 2026-08-04, on what a second score does to
	// the first score's identity.
	//
	// The tags are persisted beside the values, in the same record now, so
	// the provenance can no longer come back without its values or the values
	// without their provenance.
	function setFromScoreFields(next: ReadonlySet<MetadataField>) {
		doc.fromScoreFields = next;
	}

	function commitMetadataState(next: MetadataState) {
		handleMetadataChange(next.metadata);
		setFromScoreFields(next.fromScore);
	}

	// Kimi's Q2 safety net: restore the header's fields verbatim (fields
	// the header does not carry are left untouched).
	function handleRevertToScoreHeader() {
		const wm = ingestedScore?.result.score.workMetadata;
		if (!wm) return;
		commitMetadataState(revertToScoreHeader({ metadata: doc.metadata, fromScore: doc.fromScoreFields }, wm));
	}

	// Q4 provenance line (Kimi's §A.28 ruling, 2026-07-13): an arranger
	// detected in the score header surfaces as a small line beneath the
	// Metadata block — never a drawer field — and is omitted entirely when
	// absent. The format label names where it was detected; in practice
	// only MusicXML-parsed scores can carry one (MNX defines no work
	// metadata anywhere, v38 §A.27).
	const PROVENANCE_FORMAT_LABELS: Record<IngestedScore['provenance']['format'], string> = {
		musicxml: 'MusicXML',
		mnx: 'MNX'
	};
	let arrangerProvenance = $derived.by(() => {
		const s = ingestedScore;
		const name = s?.result.score.workMetadata?.arranger;
		if (!s || !name) return null;
		return `${t('meta.arrAbbr', language)} ${name} · ${t('meta.detectedFrom', language)} ${PROVENANCE_FORMAT_LABELS[s.provenance.format]}`;
	});
	function handleDrawerToggle() {
		drawerCollapsed = !drawerCollapsed;
		try {
			localStorage.setItem('ilya:drawerCollapsed', JSON.stringify(drawerCollapsed));
		} catch {
			// localStorage unavailable
		}
	}
	function handleTabChange(tab: TabId) {
		const oldIndex = TAB_ORDER.indexOf(activeTab);
		const newIndex = TAB_ORDER.indexOf(tab);
		// Compute direction: moving right in tab order → content enters from right
		const direction = newIndex > oldIndex ? 'tab-enter-from-right' : 'tab-enter-from-left';
		/* The desk head hands back a wire id, because it draws four names.
		   `surfaceFor` is what turns it into the two values, and it is the
		   same function the stored-tab migration uses, so an id chosen by
		   hand and an id read out of localStorage cannot disagree. */
		({ destination, studioDocument } = surfaceFor(tab));
		tabTransitionClass = direction;
		try {
			localStorage.setItem('ilya:activeTab', tab);
		} catch {
			// localStorage unavailable
		}
		// Clear animation class after it completes (175ms + buffer)
		setTimeout(() => {
			tabTransitionClass = '';
		}, 200);
	}

	/* ── Heading navigation from Drawer TOC ────────────────── */

	/**
	 * Scroll a lazily-rendered anchor to the top of the reading pane,
	 * robust against post-scroll reflow. LearnContent/GuideContent fire
	 * their ready signal in onMount, before the web fonts swap in and the
	 * large glyph table settles, so a one-shot scrollIntoView undershoots:
	 * the target moves down after the scroll has already landed. This
	 * retries until the element exists, scrolls once, then re-snaps to the
	 * target after the fonts are ready and across a short settle window,
	 * correcting for that late reflow. Caught by Dann's sung-[o] deep link
	 * landing at the Section 3 head instead of the note (2026-07-12).
	 */
	function scrollToAnchor(id: string, smoothFirst = true) {
		let attempts = 0;
		const snap = (behavior: ScrollBehavior) =>
			document.getElementById(id)?.scrollIntoView({ behavior, block: 'start' });
		const find = () => {
			if (!document.getElementById(id)) {
				if (attempts++ < 90) requestAnimationFrame(find);
				return;
			}
			snap(smoothFirst ? 'smooth' : 'auto');
			// Corrective re-snaps: font swap and late layout shift the
			// target after the first scroll. Instant, so they only close
			// the residual gap rather than re-animating.
			[120, 300, 600].forEach((ms) => setTimeout(() => snap('auto'), ms));
			if (typeof document !== 'undefined' && 'fonts' in document) {
				document.fonts.ready.then(() => snap('auto')).catch(() => {});
			}
		};
		find();
	}

	function handleHeadingNavigate(id: string) {
		activeHeadingId = id;
		history.pushState(null, '', `#${id}`);
		scrollToAnchor(id);
	}

	/* ── Lazy reading content: readiness signal ──────────── */

	let readingContentEpoch = $state(0);

	function handleReadingContentReady() {
		readingContentEpoch++;
		handleHashNavigation();
	}

	/* ── N.40: mirror the language state onto <html lang> ────
	   app.html:2 hardcodes lang="en" and nothing ever wrote the
	   attribute afterwards, so a screen reader announced every French
	   string with English pronunciation rules. It also governs
	   hyphenation and quote rendering.

	   This tracks `language` itself rather than its three writers (the
	   initialiser, handleLanguageChange, and the onMount restore), so
	   no path can miss it.

	   RESIDUAL, stated rather than hidden: the served document is
	   lang="en" until hydration, because the language is restored from
	   localStorage on the client and the server cannot know it. */
	$effect(() => {
		document.documentElement.lang = language;
	});

	/* ── IntersectionObserver for scroll-based active heading ─ */

	$effect(() => {
		void readingContentEpoch; // re-run when lazy reading content mounts
		if (destination === 'studio') return;
		if (!mainContentEl) return;

		// Collect all heading elements with ids inside main-content
		const headings = mainContentEl.querySelectorAll('[id^="learn-"], [id^="guide-"]');
		if (headings.length === 0) return;

		const observer = new IntersectionObserver(
			(entries) => {
				// Find the topmost intersecting heading
				const visible = entries
					.filter(e => e.isIntersecting)
					.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
				if (visible.length > 0) {
					activeHeadingId = visible[0].target.id;
				}
			},
			{
				root: mainContentEl,
				rootMargin: '-25% 0px -60% 0px',
				threshold: 0,
			}
		);

		headings.forEach(h => observer.observe(h));
		return () => observer.disconnect();
	});

	/* ── Handle URL hash on page load ──────────────────────── */

	function handleHashNavigation() {
		const hash = window.location.hash.slice(1);
		if (hash) {
			activeHeadingId = hash;
			scrollToAnchor(hash);
		}
	}
	onMount(() => {
		// N.67 step 6. Step 1's storage console line is GONE, not moved: it said
		// it was there because "the storage COPY is step 6's work", and this is
		// step 6. What it logged is now drawn, in both languages.
		bootLines = bootNotices(
			{
				loadFailure: doc.loadFailure,
				persisted: opened?.storage.persisted ?? null,
				// A prerender pass has no vault and nothing to have lost.
				pointer: opened?.pointer ?? { stored: false, found: true, songCount: 0 },
			},
			globalStore(),
		);
		// N.67 step 4b. The library, read once at boot and refreshed after every
		// act that changes it. Not awaited into the boot path: a slow list must
		// not hold up the song the singer is already looking at.
		void refreshSongs();
		// Restore persisted state.
		//
		// N.67 step 0: the six per-song keys are NOT read here any more. The
		// document read them before this component rendered, which is why the
		// pairings guard flag could be deleted rather than moved. What is left
		// in this block is the device preferences, which are not a song and do
		// not move (design §2.2).
		try {
			const savedLang = localStorage.getItem('ilya:language');
			if (savedLang === 'en' || savedLang === 'fr') {
				language = savedLang;
			}
			const savedPrefs = localStorage.getItem('ilya:notationPrefs');
			if (savedPrefs) {
				const parsed = JSON.parse(savedPrefs);
				notationPrefs = { ...notationPrefs, ...parsed };
			}
			const savedDiacritics = localStorage.getItem('ilya:showStressDiacritics');
			if (savedDiacritics) {
				showStressDiacritics = JSON.parse(savedDiacritics);
			}
			const savedCollapsed = localStorage.getItem('ilya:drawerCollapsed');
			if (savedCollapsed) {
				drawerCollapsed = JSON.parse(savedCollapsed);
			}
			/* N.73 S3 ship two, THE STORED-TAB MIGRATION. Every stored value is
			   named in `restoreSurface`, including the two that mean Studio and
			   the ones that mean nothing, so a value this build does not know
			   lands somewhere on purpose rather than by falling through a
			   four-way string comparison. E.27 §3.4. */
			({ destination, studioDocument } = restoreSurface(localStorage.getItem('ilya:activeTab')));
			/* N.65 ship B, §B.4. THE OPEN SET PERSISTS PER DEVICE, under
			   `ilya:openStations`. An unrecognised or corrupt stored value
			   falls back to the first-run default and does not throw, which
			   is the pattern `restoreSurface` above established for
			   `ilya:activeTab`. NOTATION is never in the stored array, so a
			   reload always returns it to its ruled collapsed default. */
			sections.restore(localStorage.getItem(OPEN_STATIONS_KEY));
		} catch {
			// localStorage unavailable
		}
		// N.57's note, kept because it still governs: keepSurvivingGlosses() is
		// deliberately NOT called at boot. The pipeline has not run, so `lines`
		// is empty and the guard would drop every gloss. It runs on the next
		// Transcribe, which is also the first moment the glosses can be seen.
		loadDictionary({
			onStateChange(state) {
				loaderState = state;
			}
		});
		// Mobile detection
		function checkMobile() {
			isMobile = window.innerWidth < 768;
			isPhone = Math.min(window.innerWidth, window.innerHeight) < 768;
			phonePortrait = window.innerHeight >= window.innerWidth;
		}
		checkMobile();
		window.addEventListener('resize', checkMobile);
		// On mobile, default drawer to collapsed unless user has a saved preference
		if (isMobile) {
			try {
				if (!localStorage.getItem('ilya:drawerCollapsed')) {
					drawerCollapsed = true;
				}
			} catch {
				drawerCollapsed = true;
			}
		}
		handleHashNavigation();
		return () => {
			window.removeEventListener('resize', checkMobile);
		};
	});
</script>

<!-- N.92. The correction keys, bound at the window because the score is
     injected SVG with nothing to hang a handler on, the same reason
     VoiceProfilePane delegates its click. The handler stands down entirely
     unless a note is selected, and inside any text field, so nothing else in
     the app loses a key it already had. -->
<!-- N.92 mobile slice 2. THREE LIVE GESTURES AND NO COLLISION, per the ruled
     tap grammar: a tap chooses, the browser's own pinch reads, and a swipe
     down dismisses. Double tap and drag are unassigned, and press-and-hold
     stays reserved, because the platform trains it for text selection and for
     context menus and neither belongs here.

     Bound at the window for the reason the correction keys already are: the
     score is injected SVG with nothing to hang a handler on. Each of the three
     stands down entirely off a phone. -->
<svelte:window
	on:keydown={handleCorrectionKey}
	on:click={handlePageTap}
	on:pointerdown={handleSurfacePointerDown}
	on:pointerup={handleSurfacePointerUp}
	on:pointercancel={handleSurfacePointerCancel}
/>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link href="https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,400;1,400&family=Noto+Serif:ital,wght@0,400;1,400&display=swap" rel="stylesheet" />
</svelte:head>
<!-- N.73 portrait C, ruling 4: THE INTERSTITIAL IS RETIRED. The gate that
     stood here ("Ilya is designed for desktop / Continue anyway") met every
     phone visit and is Fable's audit finding F5. A portrait visit now arrives
     at the fitted page. Nothing replaced it: no residue, no toast, no
     one-time note, because Dann has never ruled where a residue goes. -->
<div class="screen-only">
	<HeaderBar {language} {activeTab} onlanguagechange={handleLanguageChange} />
<!-- N.67 step 4a. A NATIVE <dialog>, Dann's ruling 2026-08-16: bits-ui's
     AlertDialog measured +18.7 KB gzipped for this one thing, against about
     8 KB budgeted for the whole of N.67, and showModal() gives the modality,
     the focus trap, Escape, and the backdrop for nothing.

     THE SAFE ANSWER IS LAST IN THE DOM, which is both where Tab reaches it
     last and where it is drawn rightmost, which is where macOS puts the default
     and where a tired hand goes (Dann's ruling 2026-08-16, after he met this
     dialog at half past four in the morning). It is focused programmatically on
     open, so keyboard and mouse both land on it. This comment said `row-reverse`
     until N.67 step 5: the CSS reversal was removed when DOM order was made the
     visual order, and the actions row below has said so since. Escape resolves
     to the safe answer, because closing without answering changes nothing:
     nothing is mutated before the answer. -->
<!-- N.67 step 5. ONE hidden input serves both tabs' Import controls.
     `accept` is dropped on mobile for N.70's reason exactly: iOS matches by
     registered type and knows nothing of `.ilya`, so it would grey out every
     binder a singer owns, which would make the AirDrop half of the walk
     impossible. -->
<input
	type="file"
	accept={isMobile ? undefined : '.ilya'}
	bind:this={importInputEl}
	class="binder-input"
	onchange={(e) => {
		const input = e.currentTarget;
		const file = input.files?.[0];
		input.value = '';
		if (file) void handleImportFile(file);
	}}
/>

<dialog
	class="replace-dialog"
	bind:this={replaceDialogEl}
	oncancel={() => settleCollision('mine')}
	onclose={() => {
		// GUARDED ON THE DIALOG BEING SHUT. One collision's close event can arrive
		// after the next collision's dialog has already opened, and unguarded it
		// would blank the question now on screen and answer it for the singer.
		if (replaceDialogEl?.open) return;
		pendingArrival = null;
		pendingConfirm = null;
		settleCollision('mine');
	}}
	aria-labelledby="replace-title"
>
	{#if pendingConfirm}
		<h2 id="replace-title">{pendingConfirm.title}</h2>
		<p>{pendingConfirm.body}</p>
		<!-- DOM ORDER IS THE VISUAL ORDER. It used to be reversed in CSS, which
		     told a screen reader one order and showed a sighted singer another.
		     Keep is last, so it is rightmost where a tired hand goes, and it is
		     focused programmatically on open. -->
		<div class="replace-actions">
			{#each pendingConfirm.answers.slice(0, -1) as answer (answer.label)}
				<button
					type="button"
					class:replace-destructive={answer.destructive}
					onclick={() => answerWith(answer)}
				>
					{answer.label}
				</button>
			{/each}
			{#if safeAnswer}
				<button type="button" bind:this={keepButtonEl} onclick={() => answerWith(safeAnswer)}>
					{safeAnswer.label}
				</button>
			{/if}
		</div>
	{/if}
</dialog>

<InstallPrompt {language} />
</div>
<div class="app-content {viewBreathClass}">
	<Drawer
		width={drawerWidth}
		collapsed={drawerCollapsed}
		{isMobile}
		{language}
		{destination}
		{activeTab}
		{activeHeadingId}
		{tabTransitionClass}
		takeoverActive={calibrating}
		onexittakeover={exitCalibration}
		ontogglecollapse={handleDrawerToggle}
		ontabchange={handleTabChange}
		onheadingnavigate={handleHeadingNavigate}
	>
			<!-- PIECE (N.73 S3 ship one). The drawer's pinned top region. The
			     metadata block and the Q4 provenance line moved out of
			     `RootPanel` to get here: a pinned region cannot be a child of
			     the scrolling one. Their props are unchanged and are passed
			     straight through. -->
			{#snippet pieceAnchor()}
				<MetadataFields
					metadata={doc.metadata}
					{language}
					onchange={handleMetadataChange}
					fromScore={doc.fromScoreFields}
					onrevert={ingestedScore?.result.score.workMetadata ? handleRevertToScoreHeader : undefined}
					expanded={sections.has(STATION_IDS.piece)}
					ontoggle={() => sections.toggle(STATION_IDS.piece)}
				/>
				{#if arrangerProvenance}
					<!-- Q4 provenance line (Kimi §A.28): beneath the Metadata block,
					     never a drawer field, omitted when absent. Clamped to one
					     line (Dann's ruling, 2026-07-13, on the Gretchen IMSLP-blob
					     evidence): verbatim, never parsed, but the drawer stays
					     quiet; title carries the full string on hover. Its rule
					     travels with it, N.73 S3, for the same reason it travelled
					     into RootPanel at N.73 S2: Svelte scopes a rule to the
					     component that authors the markup. -->
					<p class="shane-provenance" title={arrangerProvenance}>{arrangerProvenance}</p>
				{/if}
			{/snippet}
			<!-- THE VOICE (N.73 S3 ship one). The drawer's pinned bottom line,
			     and the only way into calibration. `voiceCalibrated` is the
			     wizard's own predicate, read from `profileStore.ts`, so this
			     line and the wizard cannot disagree. -->
			{#snippet voiceAnchor()}
				{#if INCLUDE_SHANE}
					<VoiceAnchor
						voiceName={shaneVoiceName}
						calibrated={voiceCalibrated}
						{language}
						oncalibrate={enterCalibration}
					/>
				{/if}
			{/snippet}
			<!-- THE CALIBRATION TAKEOVER (N.73 S3 ship one). The wizard MOVED
			     here from the shane panel; not one line of it is rewritten. Its
			     props are the ones it already had, in the order it already had
			     them. -->
			{#snippet voiceTakeover()}
				{#if INCLUDE_SHANE}
					<div class="takeover-panel">
					<CalibrationWizard
						{language}
						{scoreRenders}
						bind:collapsed={wizardCollapsed}
						onActiveProfileChange={(f, name, characteristics) => {
							shaneFormants = f;
							shaneVoiceName = name;
							shaneCharacteristics = characteristics;
						}}
						onOpenLearnNote={() => {
							// The sung-[o] glyph's deep link: Learn tab, then the
							// note's anchor. handleHeadingNavigate already retries
							// while the lazy Learn content mounts. The takeover is
							// left first, because Learn is a different destination
							// and a takeover held open behind it would be waiting
							// on a drawer the singer is no longer in.
							exitCalibration();
							handleTabChange('learn');
							handleHeadingNavigate('learn-u3-note-o');
						}}
					/>
					</div>
				{/if}
			{/snippet}
			{#snippet rootPanel()}
				<RootPanel
					inputText={doc.inputText}
					{loaderState}
					{canTranscribe}
					{hasResults}
					{wordCount}
					{transcribeMs}
					{transcribeError}
					{language}
					{showInspector}
					oninput={handleInput}
					ontranscribe={handleTranscribe}
					onclear={handleClear}
					onexport={() => void handleExport()}
					onimport={() => importInputEl?.click()}
					onexportall={() => void handleExportAll()}
					{songLibrary}
					{sections}
				>
					{#snippet sourceScore()}
						{#if INCLUDE_SHANE}
							<!-- The drop surface sits directly beneath the textarea it
							     twins: N.73 S2 made text intake and score intake one
							     Source region. The EngravingControls panel is removed
							     and the stave target is fixed (Dann's ruling,
							     2026-07-15; Kimi Q1 and Q2). -->
							<!-- N.67 step 4b. KEYED ON THE OPEN SONG. A switch replaces
							     the document, and this makes the uploader replace itself
							     with it, so the new song's stored score comes back
							     through the uploader's OWN restore: the same path a
							     reload takes, and no second one. -->
							{#key doc.id}
								<ScoreUploader
									{language}
									{isMobile}
									restore={restoreSource}
									oningested={(ingested, file, origin, page) =>
										void handleArrival(ingested, file, origin, page)}
								/>
							{/key}
							{#if noLyricsFile}
								<!-- N.55a's courtesy message (Dann, E.47). It lives in the
								     DRAWER and not on the page because it names the FILE, and
								     a file name dates a printed study sheet to an export
								     rather than to a song. Unstyled on purpose for the first
								     walk. -->
								<p class="shane-no-lyrics">{t('upload.banner.noLyrics', language).replace('%s', noLyricsFile)}</p>
							{/if}
						{/if}
					{/snippet}
					{#snippet consoleContent()}
						{#if selectedWord}
							{@const wordKey = `${selectedWord.lineIndex}-${selectedWord.wordIndex}`}
							{@const wordYoToggles = (() => {
								const prefix = `${wordKey}-`;
								const m = new Map<number, import('$lib/types').YoToggle>();
								for (const [k, v] of yoToggles) {
									if (k.startsWith(prefix)) {
										const ci = parseInt(k.substring(prefix.length), 10);
										if (!isNaN(ci)) m.set(ci, v);
									}
								}
								return m;
							})()}
							<InspectorPanel
								word={selectedWord}
								{language}
								{notationPrefs}
								openSyllabification={doc.openSyllabification}
								{showStressDiacritics}
								syllableOverride={syllableOverrides.get(wordKey) ?? null}
								spotReconstituted={spotReconstitution.has(wordKey)}
								promotedFromClitic={userStressOverrides.get(wordKey)?.promotedFromClitic ?? false}
								yoCharToggles={wordYoToggles}
								onspotrecontoggle={handleSpotReconToggle}
								onstressassign={handleStressAssign}
								onstressrevert={handleStressRevert}
								onyochartoggle={handleYoCharToggle}
								onsyllableoverride={(override) => handleSyllableOverride(selectedWord!.lineIndex, selectedWord!.wordIndex, override)}
								onsyllableoverrideclear={() => handleSyllableOverrideClear(selectedWord!.lineIndex, selectedWord!.wordIndex)}
								onreset={handleReset}
								glossOverride={doc.glossOverrides.get(wordKey)}
								onglossoverride={handleGlossOverride}
							/>
						{/if}
					{/snippet}
				</RootPanel>
			{/snippet}
			{#snippet shanePanel()}
				{#if INCLUDE_SHANE}
					<!-- One shared column, matching the Transcription drawer's
					     .root-panel (1rem sides, 40px bottom, 6px gaps). N.73 S2
					     dropped its 20px top, because this panel now renders directly
					     beneath .root-panel rather than in place of it and the two
					     paddings met in the middle of one column. -->
					<div class="shane-panel">
					<!-- N.73 S2. This panel's own Metadata block, provenance line,
					     score uploader, no-lyrics notice, Print button and binder row
					     are gone. The metadata block, the provenance line and score
					     intake moved into RootPanel; the Print button and the binder
					     row were duplicates of RootPanel's and were deleted. What is
					     left is the score work, the notices, and the voice. -->
					<!-- N.65 ship B. ONE STATION, SHIFT LYRICS, AND THE SYLLABIFIED TEXT
					     IS ITS FIRST ELEMENT. Dann's ruling of 2026-08-21. The two were
					     adjacent siblings here; they are one component with the other
					     inside it now, and the lavender rule that sits on
					     `ShiftLyricsControl`'s own root ends up above both with no work.
					     `SyllableStation`'s six props are unchanged and stay here, which
					     is why it goes in as a snippet rather than through the wrapper. -->
					<ShiftLyricsControl
						{language}
						disabled={shiftDisabled}
						onshift={handleShift}
						placed={placedSlotCount}
						total={slotQueue.length}
						expanded={sections.has(STATION_IDS.shiftLyrics)}
						ontoggle={() => sections.toggle(STATION_IDS.shiftLyrics)}
					>
						{#snippet syllables()}
							<SyllableStation
								slots={slotQueue}
								pairings={shownPairings}
								drift={driftCount}
								cursor={pairingCursor}
								{language}
								oncursor={(i) => (pairingCursor = i)}
							/>
						{/snippet}
					</ShiftLyricsControl>
					{#if binderError}
						<!-- N.67 step 5. The file is untouched in every failure, which is
						     why all three sentences end the same way. -->
						<p class="shane-storage-notice">{binderError}</p>
					{/if}
					{#if binderNotice}
						<!-- N.67 step 5, the remainder. What an import ADDED. A "take the
						     one in this file" adds nothing, so it says nothing: the song it
						     overwrote moves to the top of the list, which is the change
						     the singer can see. -->
						<p class="shane-storage-notice">{binderNotice}</p>
					{/if}
					{#if orphanedCount > 0}
						<!-- N.67 step 3. Reported, not acted on: the placements are
						     KEPT and this only says how many have no note to sit on in
						     the score just uploaded. Twins the drift surface in
						     restraint, and unstyled on purpose like its neighbours. -->
						<p class="shane-storage-notice">
							{t('station.orphaned', language).replace('%s', String(orphanedCount))}
						</p>
					{/if}
					{#if slotQueue.length > 0 && ingestedScore}
						<!-- N.67 step 3, design §2.6. The ONLY thing that may destroy a
						     placement, and it is the singer pressing it. An upload never
						     rebuilds. Placed after Shift Lyrics because it undoes what
						     Shift Lyrics does, and it is the last resort of the two. -->
						<button type="button" class="start-over" onclick={handleStartPlacementOver}>
							{t('station.startOver', language)}
						</button>
					{/if}
					<!-- R5, N.27: no save site is silent. N.67 step 0 made this the
					     WHOLE song's report rather than the pairing map's alone, and
					     N.67 step 6 finalized what it says: quota with its figures,
					     eviction, no storage at all, the partial-loss oddity, an
					     unreadable record, and a record from a newer Ilya. WHICH
					     sentences and in WHAT ORDER is `notices.ts`, where a gate can
					     reach it. Unstyled on purpose, matching its neighbours. -->
					{#each storageLines as line}
						<p class="shane-storage-notice">{fillNotice(t(line.key, language), line.args)}</p>
					{/each}
					{#if doc.remoteChange}
						<!-- N.67 step 1, socket §4.1. Last-write-wins WITH the notice.
						     A clean tab reloads silently and never reaches here; this
						     is only the tab that had unsaved work, and its work is
						     kept. Placed beside the storage notice because that is
						     where storage speaks today. -->
						<p class="shane-storage-notice">{t('storage.otherTab', language)}</p>
					{/if}
					<!-- N.73 S3 ship one. THE CALIBRATION WIZARD IS NOT HERE ANY
					     MORE. It is the drawer's one takeover, entered from the
					     voice anchor at the foot of the column, and rendered from
					     the `voiceTakeover` snippet below. The GUI spec's defect F2
					     was that its `welcome` plea sat inside this scroll, reading
					     voice at a singer who had asked for an Instrument panel
					     (`fable-gui-audit-and-spec_r1_2026-08-18.md:41-44`). -->
					</div>
				{/if}
			{/snippet}
			{#snippet notationPanel()}
				<!-- NOTATION (item N.7). ONE instance, rendered by the Drawer
				     inside its TOP anchor, above the scrolling panel, on both of
				     Studio's documents. It was pinned BELOW the scroll until
				     N.73 S3, which is the E.29 shape E.36 §1.4 replaced and Dann
				     ratified on 2026-08-19.
				     The state was always document-level and persisted (the notationPrefs and
				     openSyllabification declarations and their writers) and Fit obeyed it:
				     both reach VoiceProfilePane through its own props of
				     those names. Only the CONTROL was tab-scoped, which made its
				     placement lie about its scope.

				     Rendering it once rather than once per panel is Dann's
				     improvement on my first pass: two instances sharing state
				     can drift, and one cannot.

				     THE ACCENT IS SAGE, UNCONDITIONALLY. N.73 S3 ship two settled
				     it, and the reasoning is in NotationFields' own `accent`
				     prop comment rather than repeated here. Dann's ruling of
				     2026-08-06, that the colour follows the tab, is superseded
				     by two later ones: S2's invariant that nothing in the drawer
				     changes when the singer flips the pair, and the S0 slate's
				     ruling 3 of 2026-08-19, which keeps lavender in Studio to
				     the voice anchor and the calibration surfaces.

				     KNOWN GAP, accepted and unnumbered: the stress-acutes toggle
				     will appear on Fit and change nothing there, because
				     showStressDiacritics never reaches VoiceProfilePane
				     (it is never given that prop). Fit's IPA stress mark is a separate and
				     unconditional thing (pipeline.ts:711). -->
				<NotationFields
					{notationPrefs}
					{showStressDiacritics}
					openSyllabification={doc.openSyllabification}
					{language}
					accent="var(--sage)"
					onnotationchange={handleNotationChange}
					onstressdiacriticschange={handleStressDiacriticsChange}
					onopensyllabificationchange={handleOpenSyllabificationChange}
					expanded={sections.has(STATION_IDS.notation)}
					onexpandedchange={() => sections.toggle(STATION_IDS.notation)}
				/>
				<!-- N.92, seated in the NOTATION anchor per Dann's ruling of
				     2026-08-24. It rides inside the score capability's own wall
				     and shows nothing at all until there is a read to correct,
				     so a wall-closed build and a text-only session are both
				     untouched. Idle with a score open it is one line of prose,
				     which is what leaves the pinned anchor honest room. -->
				{#if INCLUDE_SHANE && ingestedScore}
					<CorrectionControls
						{language}
						{selectedLabel}
						{selectedBase}
						{selectedDotted}
						corrected={selectedEventId ? selectedEventId in doc.corrections : false}
						{correctedCount}
						{orphanCount}
						accent="var(--sage)"
						onstep={handleStep}
						onoctave={handleOctave}
						onsemitone={handleSemitone}
						onaccidental={handleAccidental}
						onmove={handleMove}
						onbase={handleBase}
						ondot={handleDot}
						ondelete={handleDeleteNote}
						onrestore={handleRestoreNote}
						ondeselect={() => (selectedEventId = null)}
					/>
				{/if}
			{/snippet}
	</Drawer>
	<main
		class="main-content tab-{activeTab} {paperBreathClass} {tabTransitionClass}"
		class:drawer-open={!drawerCollapsed}
		class:reading-mode={isReadingMode}
		class:loupe-up={loupeOpen}
		bind:this={mainContentEl}
		tabindex="0"
	>
		<!-- THE DESK HEAD (N.73 S1 §2.2). One line across the top of the desk,
		     above the sheet, on every display. It is the cure for audit finding
		     F4: with the tab bar living inside the drawer, closing the drawer
		     took every destination with it. -->
		<DeskHead {activeTab} {language} ontabchange={handleTabChange} />
		{#if destination === 'studio' && studioDocument === 'transcription'}
			<!-- ONE Paper, rendered from one snippet in both branches. Two call
			     sites for the same component drift, and a drifted prop list here
			     would mean the phone and the desk stopped showing the same
			     document. -->
			{#snippet transcriptionPaper()}
				<Paper lines={effectiveLines} {notationPrefs} {language} metadata={doc.metadata} pageSize="letter" {isMobile} {showStressDiacritics} {spotReconstitution} glossOverrides={doc.glossOverrides} onwordclick={handleWordClick} />
			{/snippet}
			{#if isMobile}
				<!-- N.73 portrait C. The stage holds both views. The one that is
				     not showing goes off-stage rather than to display:none,
				     because TitleHeader measures itself with bind:offsetHeight
				     and a display:none element measures 0, which would
				     re-paginate the document on every tap. -->
				<div class="portrait-stage">
					<div class="stage-page" class:offstage={portraitView === 'aid'}>
						{@render transcriptionPaper()}
						{#if effectiveLines.length > 0}
							<!-- ONE labelled action, UNDER the page and never on it.
							     It sits in the flow rather than fixed to the bottom
							     of the screen: N.73 S1 deleted the last fixed bottom
							     furniture and gave the phone back its 92px, and this
							     is not the place to put furniture back. -->
							<button
								class="portrait-action"
								type="button"
								onclick={() => void showPortraitView('aid')}
							>
								{t('portrait.read', language)}
								<span class="portrait-action-chevron" aria-hidden="true">&rsaquo;</span>
							</button>
						{/if}
					</div>
					{#if effectiveLines.length > 0}
						<div class="stage-aid" class:offstage={portraitView === 'page'}>
							<ReadingAid
								lines={effectiveLines}
								{notationPrefs}
								{language}
								{showStressDiacritics}
								{spotReconstitution}
								glossOverrides={doc.glossOverrides}
								onreturn={() => void showPortraitView('page')}
							/>
						</div>
					{/if}
				</div>
			{:else}
				{@render transcriptionPaper()}
			{/if}
		{:else if destination === 'studio'}
			<!-- The Voice Profile envelope (handover v30 §C.1, page furniture
			     per Dann's review ruling): the interim main pane, a fixed
			     letter page with the Paper system's header and footer. The
			     wizard in the drawer publishes the active voice's readings
			     and name into the state above. -->
			<!-- N.10 (Dann, 7 August): Fit consumes Transcription's output.
			     `lines` is passed RAW, not `effectiveLines` — the Fit resolver
			     applies its own open syllabification, so the display view would
			     be sliced twice. -->
			<VoiceProfilePane
				{isMobile}
				transcribedLines={lines}
				pairings={shownPairings}
				onnotepick={handleNotePick}
				{selectedEventId}
				formants={shaneFormants}
				voiceName={shaneVoiceName}
				characteristics={shaneCharacteristics}
				{language}
				ingested={correctedScore}
				scoreTitle={doc.metadata.title}
				{engraving}
				{notationPrefs}
				openSyllabification={doc.openSyllabification}
				onrendered={handleScoreRendered}
			/>
		{:else}
			<ReadingPaper {language}>
				{#snippet content()}
					{#if destination === 'learn'}
						{#await import('$lib/components/Reading/LearnContent.svelte') then mod}
							{@const LearnContent = mod.default}
							<LearnContent {language} onready={handleReadingContentReady} />
						{/await}
					{:else}
						{#await import('$lib/components/Reading/GuideContent.svelte') then mod}
							{@const GuideContent = mod.default}
							<GuideContent {language} onready={handleReadingContentReady} />
						{/await}
					{/if}
				{/snippet}
			</ReadingPaper>
		{/if}
		<!-- PRINT, UNDER THE SHEET AND FLUSH WITH ITS LEFT EDGE. N.65, and it
		     is Dann's amended ruling of 2026-08-21 rather than his first one.
		     He first asked for it beside the pair: "I want it to float next to
		     the Transcribe / Score Markup selector." Then he walked the desk
		     head on a phone and found no room: "On mobile it looks like there
		     is not enough room to insert a print button where i suggested.
		     what if we add it under the WYSIWYG flush left? Visually it can
		     parallel the Transcription button above the WYSIWYG." He was given
		     four placements with a critique of each and chose this one KNOWING
		     IT LOSES THE DESK HEAD'S STICKINESS.

		     STUDIO ONLY, RULED BY DANN THE SAME DAY, reversing his own "always
		     live on all four" of the night before: "we will simply not offer a
		     Print button for the Learn or Guide sections." A singer can still
		     print those pages from the browser's own menu; Ilya does not
		     invite it. `destination === 'studio'` is the whole test, so it
		     covers the transcription and the marked score and nothing else.

		     ALWAYS LIVE WHERE IT APPEARS. No disabled state and no greying,
		     which is why `printDisabled` left with it.

		     CONTRACT §6's "do not put a control on the paper" GOVERNS THE
		     SHEET. Below the sheet is the desk, which is where the desk head
		     already stands. -->
		{#if destination === 'studio'}
			<div class="sheet-print">
				<button class="sheet-print-btn" type="button" onclick={handlePrint}>
					{t('input.print', language)}
				</button>
			</div>
		{/if}
	</main>
</div>
<!-- N.92 mobile slice 2. THE LOUPE AND THE DOCK, siblings of the drawer and
     of the desk, outside `.app-content` because they answer to the viewport
     rather than to the desk's flow. The drawer's E.36 §1.4 anchors are
     untouched: this is a second surface, not the drawer re-anchored.

     THEY ARRIVE AS ONE MOTION AND LEAVE AS ONE, a single 180 ms fade on both,
     which is what teaches the singer they are one object on the first raise
     rather than on the first dismissal. -->
{#if loupeAvailable && loupeOpen && selectedEventId}
	<Loupe
		open={loupeOpen}
		measureLabel={heldMeasureLabel}
		measureIndex={heldMeasureIndex}
		ownIds={heldMeasureIds}
		nextIds={nextMeasureIds}
		{selectedEventId}
		revision={correctedScore}
		{language}
		onpick={handleLoupePick}
		dockInset={phonePortrait ? 0 : 380}
		{dockHeight}
	/>
	<CorrectionDock
		{language}
		portrait={phonePortrait}
		readout={readoutLine}
		{undoLabel}
		{selectedBase}
		{selectedDotted}
		shiftDisabled={dockShiftDisabled}
		onundo={handleUndo}
		ondismiss={dismissLoupe}
		onwalk={handleMove}
		onbase={handleBase}
		ondot={handleDot}
		onstep={handleStep}
		onoctave={handleOctave}
		onaccidental={handleAccidental}
		ondelete={handleDeleteNote}
		onshift={handleDockShift}
		onheight={(h) => (dockHeight = h)}
	/>
{/if}
{#if updated.current && !updateDismissed}
	<div class="update-toast screen-only" role="status">
		<span class="update-toast-text">{t('update.notice', language)}</span>
		<!-- N.54: location.reload() alone lands the singer back on the OLD build.
		     static/sw.js serves the app shell stale-while-revalidate, so a plain
		     reload returns the cached document and only then fetches the new one.
		     Dropping the caches that worker owns (same 'ilya-' prefix it filters
		     on in its own activate handler) sends the reload to the network. -->
		<button
			class="update-toast-action"
			onclick={async () => {
				try {
					const keys = await caches.keys();
					await Promise.all(
						keys.filter((k) => k.startsWith('ilya-')).map((k) => caches.delete(k))
					);
				} catch {
					// No CacheStorage, or it refused. Reload anyway: no worse than before.
				}
				location.reload();
			}}>{t('update.action', language)}</button
		>
		<button class="update-toast-dismiss" aria-label={t('update.dismiss', language)} onclick={() => (updateDismissed = true)}>×</button>
	</div>
{/if}

<style>
	/* ── Fit drawer column: identical to RootPanel's .root-panel, so the
	   Transcription and Fit drawers share one layout (Dann, 2026-07-13). The
	   CalibrationWizard's own outer padding is dropped in favour of this. */
	.shane-panel {
		display: flex;
		flex-direction: column;
		gap: 6px;
		/* STILL NO TOP PADDING, AND THE REASON HAS CHANGED. N.73 S2 dropped
		   this panel's 20px top because `.root-panel`'s 40px bottom already
		   closed the gap above, and 20px on top of 40px read as a seam in a
		   drawer that is meant to read as one.

		   THAT 40px IS GONE, ruled by Dann 2026-08-21: it made the
		   ANALYSIS-to-SHIFT-LYRICS boundary 98.0px against every other shut
		   station's 58.0 at a 430px viewport. So the sentence that justified
		   this zero no longer describes the tree, and it is replaced rather
		   than left.

		   THE ZERO IS NOW LOAD-BEARING, not incidental. The gap above this
		   panel is ANALYSIS's own `.section.shut` 6px, and SHIFT LYRICS brings
		   the 2px rule, which is exactly what every station boundary inside
		   `.root-panel` is made of. A top padding here would land on top of
		   that and make this the one boundary spaced differently, which is the
		   defect Dann just had removed. **The two panels read as one drawer
		   more strictly than before**, because the seam that separated them is
		   now the same recipe as every other boundary in the column.

		   THE 40px FOOT STAYS HERE. This panel ends the column when the wall is
		   open, so this is where the column's bottom space belongs.
		   `.root-panel:last-child` in `RootPanel.svelte` carries the same foot
		   for the wall-closed build, where this panel does not render. */
		padding: 0 1rem 40px;
	}

	/* Fit surfaces use the tab's lavender for the focus ring, not the global
	   sage, so focusing a Fit field mirrors the sage ring in purple. */
	.shane-panel :global(:focus-visible) {
		outline-color: var(--deeper-lavender);
	}

	/* N.73 S3 ship one. The takeover's own column, the same measures
	   `.shane-panel` gives the drawer, so the ritual keeps the drawer's left
	   edge. The wizard drops its own outer padding in favour of this, which is
	   why the value is repeated rather than shared. */
	.takeover-panel {
		display: flex;
		flex-direction: column;
		gap: 6px;
		padding: 12px 1rem 40px;
	}

	.takeover-panel :global(:focus-visible) {
		outline-color: var(--deeper-lavender);
	}

	/* The Q4 provenance line: tertiary, one quiet line beneath the Metadata
	   block, sharing the drawer's content edges. Clamped to a single line with
	   an ellipsis (Dann's ruling, 2026-07-13): real headers carry IMSLP credit
	   blobs and URLs; the text stays verbatim (no parsing of publisher habits)
	   but never wraps. It came back here at N.73 S3 with the metadata block,
	   for the reason it left at S2: Svelte scopes a rule to the component that
	   authors the markup, so the rule travels or the line loses its style
	   silently. */
	.shane-provenance {
		margin: 0;
		font-family: var(--font-ui, var(--font-sans));
		font-size: 0.75rem;
		color: var(--ink-tertiary);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	/* N.67 step 5. The import input is never seen: both Import controls click
	   it. Not `display: none`, which some browsers refuse to activate. */
	.binder-input {
		position: absolute;
		width: 1px;
		height: 1px;
		opacity: 0;
		pointer-events: none;
	}
	/* N.67 step 4a. The replace dialog. Unstyled beyond what modality needs,
	   matching the drawer's register rather than inventing a look. The
	   ::backdrop is the browser's own, dimmed a little. */
	.replace-dialog {
		/* `app.css:88-94` resets margin to 0 on every element, which overrides
		   the user-agent's `dialog { margin: auto }` and drops a modal at the
		   viewport's top-left corner. Measured on the deploy: (0, 0), 512 wide,
		   `:modal` true. Restoring the centring the browser already intended. */
		margin: auto;
		max-width: 32rem;
		padding: 1.25rem 1.5rem;
		border: 1px solid var(--stone-600, #57534e);
		border-radius: 6px;
		background: var(--paper-cream, #f5f0e6);
		color: var(--ink-primary, #1a1612);
		font-family: var(--font-sans);
	}
	.replace-dialog::backdrop {
		background: rgb(0 0 0 / 0.45);
	}
	.replace-dialog h2 {
		margin: 0 0 0.5rem;
		font-size: 1rem;
		font-weight: 600;
	}
	.replace-dialog p {
		margin: 0 0 1rem;
		font-size: 0.85rem;
		line-height: 1.5;
	}
	.replace-actions {
		display: flex;
		/* No `row-reverse` any more: the DOM order IS this order, so nothing a
		   singer sees disagrees with what a screen reader is told. */
		justify-content: flex-end;
		gap: 0.5rem;
	}
	.replace-actions button {
		padding: 0.45rem 0.75rem;
		font-family: var(--font-sans);
		font-size: 0.8rem;
		font-weight: 600;
		color: var(--ink-secondary);
		background: white;
		border: 1px solid var(--stone-600, #57534e);
		border-radius: 4px;
		cursor: pointer;
	}
	/* The destructive one is not the pretty one, and it is not the loud one
	   either: no border, no fill, just the word in the colour of the warning.
	   It has to be findable, not inviting. */
	.replace-actions .replace-destructive {
		color: #7f1d1d;
		background: transparent;
		border-color: transparent;
		font-weight: 500;
	}
	/* N.67 step 3. Sits inline rather than full width: it is the destructive
	   control on this panel and should not be the loudest thing on it. It was
	   twinned on .shane-print-btn, which N.73 S2 deleted; the values are the
	   same ones RootPanel's .action-btn carries. */
	.start-over {
		align-self: start;
		padding: 0.45rem 0.5rem;
		font-family: var(--font-sans);
		font-size: 0.8rem;
		font-weight: 600;
		color: var(--ink-secondary);
		background: white;
		border: 1px solid var(--stone-600, #57534e);
		border-radius: 4px;
		cursor: pointer;
		transition: opacity 0.12s;
	}

	/* ── Glyph Table (LEARN Section 1) ─────────────────── */

	:global(.gt-table) {
		border-collapse: collapse;
		width: max-content;
		table-layout: fixed;
	}

	:global(.gt-table thead) {
		position: sticky;
		top: 0;
		z-index: 10;
	}

	:global(.gt-table thead th) {
		background: #f5f7f3;
		border-bottom: 2px solid #3c3a36;
		border-right: 1px solid #c8c8c3;
		padding: 6px 2px;
		font-family: var(--font-sans, 'Source Sans 3', sans-serif);
		font-size: 0.5rem;
		font-weight: 600;
		text-align: center;
		vertical-align: bottom;
		line-height: 1.3;
		color: #3c3a36;
		min-width: 48px;
		max-width: 48px;
		width: 48px;
		white-space: normal;
		word-wrap: break-word;
		overflow-wrap: break-word;
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}

	:global(.gt-table thead th:last-child) { border-right: none; }

	:global(.gt-num-h) { min-width: 30px !important; width: 30px !important; }
	:global(.gt-label-h) { min-width: 56px !important; width: 56px !important; }

	:global(.gt-col-sub) {
		font-weight: 400;
		font-size: 0.45rem;
		color: #8a8780;
		white-space: normal;
		text-transform: uppercase;
	}

	:global(.gt-cursive-h) {
		border-bottom-color: #8ba48b !important;
		border-bottom-width: 3px !important;
	}

	:global(.gt-table tbody tr) { border-bottom: 1px solid #c8c8c3; }
	:global(.gt-table tbody tr:nth-child(even) td) { background: #fcfdfc; }
	:global(.gt-table tbody tr:last-child) { border-bottom: none; }

	:global(.gt-table td) {
		border-right: 1px solid #c8c8c3;
		text-align: center;
		vertical-align: middle;
		height: 48px;
		min-width: 48px;
		max-width: 48px;
		width: 48px;
		aspect-ratio: 1;
		padding: 0;
	}

	:global(.gt-table td:last-child) { border-right: none; }

	:global(.gt-num) {
		min-width: 30px !important;
		width: 30px !important;
		font-family: var(--font-sans, 'Source Sans 3', sans-serif);
		font-size: 0.6rem;
		color: #aaa8a0;
	}

	:global(.gt-label) {
		min-width: 56px !important;
		width: 56px !important;
		font-family: var(--font-sans, 'Source Sans 3', sans-serif);
		font-size: 0.75rem;
		text-align: right !important;
		padding-right: 8px !important;
		white-space: nowrap;
		overflow: hidden;
	}

	:global(.gt-cell) {
		font-size: 1.5rem;
		line-height: 1;
	}

	:global(.gt-serif) { font-family: 'Noto Serif', 'DejaVu Serif', serif; font-style: normal; }
	:global(.gt-sans) { font-family: 'Noto Sans', 'DejaVu Sans', sans-serif; font-style: normal; }
	:global(.gt-serif-it) { font-family: 'Noto Serif', 'DejaVu Serif', serif; font-style: italic; }
	:global(.gt-sans-obl) { font-family: 'Noto Sans', 'DejaVu Sans', sans-serif; font-style: italic; }

	:global(.gt-cursive) {
		background: #ebeee8 !important;
		color: #8ba48b;
		font-family: var(--font-sans, 'Source Sans 3', sans-serif);
		font-style: normal;
		font-size: 0.6rem !important;
		letter-spacing: 0.03em;
	}

	:global(.gt-null) {
		font-size: 1.15rem !important;
		font-weight: 700;
		letter-spacing: 0.12em;
		line-height: 48px;
		color: var(--dusty-rose, #A67B7B);
	}

	:global(.gt-hi) {
		background: #F0D8D8 !important;
		box-shadow: inset 0 0 0 1.5px #C28888;
	}

	:global(.gt-obsolete td) { background: #f8f6f0 !important; }
	:global(.gt-obsolete .gt-label),
	:global(.gt-obsolete .gt-num) { color: #96918a !important; }

	:global(.gt-divider td) {
		background: #fff !important;
		border-bottom: 2px solid #a0a09b !important;
		padding: 6px 8px !important;
		font-family: var(--font-sans, 'Source Sans 3', sans-serif);
		font-size: 0.7rem !important;
		color: #a0a09b;
		letter-spacing: 0.04em;
		height: auto !important;
		text-align: left !important;
	}
	.app-content {
		display: flex;
		flex: 1;
		overflow: hidden;
		background-color: var(--drawer-bg, #FAF8F5);
	}
	.main-content {
		flex: 1;
		overflow-y: auto;
		padding: 2rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		background-color: var(--desk-surface, #D8D4C8);
		transform: none;
		/* The desk head is flush with the SHEET's left edge, not the desk's
		   (placement B, ruled by Dann, N.42 §1.3). The two sheets are not the
		   same width, so the desk publishes the width of whichever one it is
		   holding and DeskHead takes its max-width from it. 816px is
		   PAGE_SIZES.letter.width in `$lib/page-config.ts`, which TitlePage
		   and SubsequentPage set on `.paper-page`. Below the mobile
		   breakpoint both sheets go full width and so does the head, so the
		   edges still agree. */
		--sheet-width: 816px;
		/* The desk head sticks to the top of this scroll region, and the
		   region's own top padding would otherwise leave a strip above the
		   head where the sheet slides past in the open. The head pulls itself
		   up by this much and pads itself back down by the same, so it covers
		   the strip and nothing below it moves. Every rule that changes the
		   desk's top padding sets this with it. */
		--desk-pad-top: 2rem;
	}

	/* ── Print, under the sheet ──────────────────────────── */

	/* FLUSH WITH THE SHEET'S LEFT EDGE, BY THE DESK HEAD'S OWN MECHANISM.
	   `--sheet-width` is set per destination just above and `DeskHead` takes
	   its `max-width` from it; this row takes the same one, so Print lands in
	   the same column as the `TRANSCRIPTION` half of the pair above the sheet,
	   which is what Dann asked for. `align-self` overrides `.main-content`'s
	   `align-items`, which is `center` on the desk and `flex-start` on the
	   phone.

	   NOT STICKY, and Dann was told. The desk head is; this is not, because it
	   sits below a sheet that can be several pages long. He chose this
	   placement knowing that. */
	.sheet-print {
		align-self: center;
		box-sizing: border-box;
		width: 100%;
		max-width: var(--sheet-width, 816px);
		display: flex;
		justify-content: flex-start;
		/* The desk head's own gap to the sheet, spent on the other side of it.
		   `.desk-head` is `padding: 0.35rem 0 0.6rem`, so 0.6rem is the ruled
		   distance between the pair and the paper. */
		padding-top: 0.6rem;
	}

	/* THE PAIR'S IDIOM, NOT THE ACTION BUTTONS'. The brief left this open and
	   Dann's own words settle it: "Visually it can parallel the Transcription
	   button above the WYSIWYG." Every value here is `.pair` and `.pair-member`
	   from `DeskHead.svelte`, so the two read as one vocabulary and no new one
	   enters. It is NOT drawn as a card, because the cream fill is how the pair
	   says which document you are looking at, and Print is an act rather than a
	   place.

	   IT TAKES THE PAIR'S BOX ON A COARSE POINTER TOO, which is under the 44px
	   floor, exactly as its twin `TRANSCRIPTION` is. Giving Print a floor its
	   twin does not have would make it stop paralleling the twin, which is the
	   thing Dann ruled. */
	/* N.77 ship 4 part B. THE SIZE IS THE DRAWER'S QUIET-BUTTON MODEL,
	   `.action-btn.btn-ghost` in `RootPanel.svelte:867` and `:878`: its
	   `padding: 0.45rem 0.5rem` and its `font-size: 0.8rem`. Print measured
	   26.59px tall against the model's 34.38px before this.

	   ITS LOOK IS UNTOUCHED, AND THAT IS DANN'S RULING OF 2026-08-21 READ
	   AS WRITTEN: the ruling governs Print's position and its idiom, not its
	   size. So the uppercase, the 0.1em tracking, the 600 weight, the ink
	   border, and the transparent fill all stay exactly as they were, and
	   `.sheet-print`'s own layout rules were not opened. Only the two
	   declarations that set the box changed. */
	.sheet-print-btn {
		border: 1px solid var(--ink-primary, #1a1612);
		border-radius: 4px;
		background: transparent;
		color: var(--ink-primary, #1a1612);
		font-family: var(--font-sans, 'Source Sans 3', sans-serif);
		font-size: 0.8rem;
		font-weight: 600;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		padding: 0.45rem 0.5rem;
		cursor: pointer;
	}

	/* GUARDED AT BIRTH. `.pair-member`'s own hover is not, and N.65 item 5
	   leaves the unguarded ones alone this ship; this rule is new, so it is
	   written with the guard rather than added to the list. A tap on iOS
	   latches `:hover` until the next touch elsewhere, which would leave this
	   button tinted after a singer printed. */
	@media (hover: hover) {
		.sheet-print-btn:hover {
			background: rgba(26, 22, 18, 0.06);
		}
	}

	.sheet-print-btn:focus-visible {
		outline: 2px solid var(--ink-primary, #1a1612);
		outline-offset: 2px;
	}

	/* IT IS CHROME, SO IT HIDES AT PRINT. `DeskHead.svelte` carries the same
	   rule and the reasoning is its own: the page prints; the desk does not. */
	@media print {
		.sheet-print {
			display: none;
		}
	}

	/* On the phone the gutter is the ruled distance, the same one `.desk-head`
	   spends above the sheet. */
	@media (max-width: 767px) {
		.sheet-print {
			padding-top: var(--portrait-gutter, 24px);
		}
	}

	/* N.73 S1b §4 deleted the override that stood here. It set --sheet-width
	   to 720px for Learn and Guide because ReadingPaper's max-width was 720px;
	   that max-width is now 816px, the same letter sheet the transcription
	   draws, so all four destinations take the 816px above and the desk head
	   lands on the sheet's left edge on every one of them. */

	/* ── Floating Paper: tab-specific surrounds (Approach A) ── */

	.main-content.tab-transcription {
		background-color: var(--surround-transcription, #D1D7CB);
	}

	.main-content.tab-learn {
		background-color: var(--surround-learn, #DBCACA);
	}

	.main-content.tab-guide {
		background-color: var(--surround-guide, #BEC7D8);
	}

	.main-content.tab-shane {
		/* One hue per working surface. Ruled by Dann 2026-08-19 during the
		   walk, superseding "one desk, many papers" (2026-07-12) and the S1
		   sage desk that carried it: the Marked score is a distinct working
		   surface, so it takes its own desk. --surround-marked is
		   --deeper-lavender tinted 60 percent toward white, parallel to the
		   other three. It is not --surround-shane, which is the calibration
		   pacifier band on white and stays where it is. The bar moves with
		   the desk (HeaderBar.svelte, .header-bar.tab-shane). */
		background-color: var(--surround-marked, #D2CBD7);
	}

	/* ── Floating Paper: the shadow ────────────────────────── */

	/* N.73 S1b §1 deleted three rules that stood here, one per destination,
	   each with its own shadow. They were `.main-content.tab-X :global(.Y)`,
	   which outweighs the sheets' own `.paper-page` and `.reading-paper` by
	   two class selectors, so a sheet's declared shadow never reached the
	   screen and changing it there would have done nothing. There is one
	   ruled shadow now, 0 3px 12px rgba(0, 0, 0, 0.35), and each sheet
	   component declares it. No per-destination differences: the sheet is
	   the same sheet on every desk, and only the desk under it changes. */

	/* ── Transcription mode: Paper centres naturally within flex ── */

	/*
	 * Reading mode: no translateX offset. The Reading Paper fills available
	 * width naturally via flex. When the Drawer collapses, the flex container
	 * grows and ReadingPaper's max-width centres it. Smooth width transition
	 * handled by the Drawer's own 1000ms cubic-bezier.
	 */
	/* N.73 S3 ship two. READING MODE NO LONGER SETS VERTICAL POSITION.
	   Ruled by Dann on the 63c2bb4 walk: the desk head takes ONE position on
	   all four destinations, at Learn and Guide's lower placement.

	   This rule carried `padding-top: 1rem` and `--desk-pad-top: 1rem`, and
	   two classes outweigh the one class every other rule for this element
	   uses, so it won in BOTH directions rather than one: on the desktop it
	   pulled Learn and Guide 1rem ABOVE Studio's 2rem, and on the phone it
	   pushed them 0.5rem BELOW Studio's 0.5rem. Deleting both declarations
	   leaves one value per breakpoint, set in one place, and the phone
	   breakpoint's base rises to 1rem to keep Learn and Guide where they
	   already were. The transform and the justification stay: they are what
	   this rule is actually for. */
	.main-content.reading-mode {
		transform: none;
		justify-content: flex-start;
	}

	/* ── Tab transition animations ──────────────────────── */

	@keyframes tabSlideFromRight {
		from {
			opacity: 0;
			transform: translateX(12px);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}

	@keyframes tabSlideFromLeft {
		from {
			opacity: 0;
			transform: translateX(-12px);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}

	.main-content.tab-enter-from-right {
		animation: tabSlideFromRight 175ms cubic-bezier(0.25, 0, 0.15, 1) both;
	}

	.main-content.tab-enter-from-left {
		animation: tabSlideFromLeft 175ms cubic-bezier(0.25, 0, 0.15, 1) both;
	}

	/* ── THE PAGE'S TWO STATES (N.92 mobile slice 2) ─────────────────────
	   Before the loupe, the page is the navigation interface: full ink, and
	   every measure takes a tap. While the loupe is up, the page stops taking
	   gestures and becomes texture. It is still the object being worked on and
	   it is no longer a control.

	   ONLY THE INK CHANGES. No layout moves, nothing reflows, no measure
	   changes place, so the geometry is identical pixel for pixel and the
	   transition is a fade rather than a move. That is the motion rule
	   satisfied exactly: opacity, and the paper never animates.

	   THE STEP IS SMALL ON PURPOSE. Enough to say the page is not taking taps
	   right now, and not enough to suggest it has been dismissed or disabled.
	   The right amount is NOT ESTABLISHED: the schematic draws roughly one
	   value of contrast and settles no number, so 0.78 is a first reading for
	   Dann's eye and not a derivation.

	   `.paper-fit` IS PageFit'S OWN ROOT, which both Studio documents share.
	   Only the score document ever raises a loupe, so the transcription is
	   reached by this rule and never matched by it. */
	.main-content :global(.paper-fit) {
		transition: opacity 180ms ease-out;
	}

	.main-content.loupe-up :global(.paper-fit) {
		opacity: 0.78;
		pointer-events: none;
	}

	@media (prefers-reduced-motion: reduce) {
		.main-content :global(.paper-fit) {
			transition: none;
		}
	}

	/* THE PAGE PRINTS AT FULL INK, whatever is on screen. Print carries none of
	   this slice's furniture. */
	@media print {
		.main-content :global(.paper-fit),
		.main-content.loupe-up :global(.paper-fit) {
			opacity: 1 !important;
			/* The transition has to go with the opacity. Without this the print
			   layout catches the fade mid-flight and the sheet prints at
			   whatever value the animation had reached. Measured: 0.813. */
			transition: none !important;
		}
	}

	/* screen-only wrappers: visible on screen, hidden in print */
	.screen-only {
		display: contents;
	}
	@media print {
		.screen-only {
			display: none !important;
		}
		.app-content {
			display: block;
			overflow: visible;
		}
		.main-content {
			display: block;
			flex: none;
			padding: 0;
			overflow: visible;
			transform: none;
		}
	}
	/* Breath animation: two-phase CSS transitions for moments of meaning */
	@keyframes breathOut {
		from { opacity: 1; transform: translateY(0); }
		to   { opacity: 0; transform: translateY(-2px); }
	}
	@keyframes breathIn {
		from { opacity: 0; transform: translateY(-2px); }
		to   { opacity: 1; transform: translateY(0); }
	}
	:global(.breath-out) {
		animation: breathOut 150ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
	}
	:global(.breath-in) {
		animation: breathIn 250ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
	}
	/* Respect reduced motion preferences */
	@media (prefers-reduced-motion: reduce) {
		:global(.breath-out),
		:global(.breath-in) {
			animation: none !important;
		}
		.main-content {
			transition: none !important;
		}
		.main-content.tab-enter-from-right,
		.main-content.tab-enter-from-left {
			animation: none !important;
		}
	}
	/* ── Editorial mark callout (scholarly departure/note) ──── */
	:global(.learn-callout) {
		border-left: 4px solid var(--dusty-rose, #A67B7B);
		border-top: none;
		border-right: none;
		border-bottom: none;
		background: none;
		padding: 0 0 0 1rem;
		margin: 2rem 0;
		border-radius: 0;
		font-size: 0.92em;
		position: relative;
	}
	:global(.learn-callout)::before {
		content: "NOTE";
		display: block;
		font-variant: small-caps;
		font-weight: 600;
		letter-spacing: 0.05em;
		color: var(--dusty-rose, #A67B7B);
		margin-bottom: 0.5rem;
		margin-left: -4px;
		font-family: var(--font-sans, 'Source Sans 3', sans-serif);
		font-size: 0.85rem;
	}
	:global(.learn-callout p:last-child) {
		margin-bottom: 0;
	}
	/* Variant labels via data attribute */
	:global(.learn-callout[data-label="departure"])::before {
		content: "DEPARTURE";
	}
	:global(.learn-callout[data-label="method"])::before {
		content: "METHOD";
	}
	:global(.learn-callout[data-label="context"])::before {
		content: "CONTEXT";
	}
	/* ── Placeholder content within ReadingPaper ──────────── */
	.placeholder-content {
		text-align: center;
		padding: 4rem 0;
	}

	/* ── Guide question headers: welcoming landmarks ───────── */
	.main-content.tab-guide :global(.reading-inner h4) {
		font-family: var(--font-serif, 'Source Serif 4', serif);
		font-size: 1.35rem;
		font-weight: 500;
		color: var(--ink-primary, #1a1612);
		margin-top: 3rem;
		margin-bottom: 0.75rem;
		line-height: 1.35;
	}

	/* Tab-scoped heading colours */

	.main-content.tab-learn :global(.reading-inner h1),
	.main-content.tab-learn :global(.reading-inner h2),
	.main-content.tab-learn :global(.reading-inner h3),
	.main-content.tab-learn :global(.reading-inner h4) {
		color: var(--dusty-rose, #A67B7B);
	}

	.main-content.tab-guide :global(.reading-inner h1),
	.main-content.tab-guide :global(.reading-inner h2),
	.main-content.tab-guide :global(.reading-inner h3),
	.main-content.tab-guide :global(.reading-inner h4) {
		color: var(--quiet-cobalt, #5C739E);
	}

	.main-content.tab-guide :global(.reading-inner h3) {
		border-top-color: var(--quiet-cobalt, #5C739E);
	}

	/* ── Text input field: the sage border (item 6) ────────
	   N.65 ship one. THESE TWO RULES ARE GONE, AND FINDING THEM IS THE
	   REASON THE BORDER CHANGE LANDED AT ALL. They set the border on
	   `.drawer-content textarea` with `!important`, so `RootPanel`'s own
	   `.text-input` rule declared a border it did not paint, and brief
	   §3.6's "`.text-input` is `3px solid var(--sage)`" was true of the
	   source and false of the screen. Editing `.text-input` alone changed
	   nothing.

	   There is exactly ONE textarea in the app, `RootPanel`'s, so a global
	   reaching into the drawer to style it bought nothing and cost a lie.
	   Both rules, the resting border and the focus colour, are on
	   `.text-input` in `RootPanel.svelte` now, where the rest of that
	   field's design already lived. Same defect as the station label
	   declared five times: one thing, more than one owner. */
	/* ── Portrait C: the stage (N.73, ruled by Dann 2026-08-18) ──

	   The eleven rules that stood here dressed the interstitial. Ruling 4
	   retired it, so they are gone with it.

	   The stage exists on the phone and on the Transcription destination
	   only: the desktop renders Paper as a direct child of .main-content, as
	   it always has, and this wrapper is never in its DOM. */
	.portrait-stage {
		position: relative;
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.stage-page,
	.stage-aid {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	/* NOT display:none. TitleHeader measures its own height with
	   bind:offsetHeight and a display:none element measures 0, so hiding the
	   page that way would collapse the row budget to its 9-row fallback,
	   re-slice the document, and re-slice it again on the way back. Off-stage
	   keeps the layout alive at a coordinate no scroll can reach: a left-to-
	   right document does not scroll into negative space. */
	.offstage {
		position: absolute;
		top: 0;
		left: -100000px;
		width: 100%;
	}

	/* ── The one labelled action ───────────────────────────── */

	.portrait-action {
		flex: 0 0 auto;
		margin: 1.25rem 0 0;
		border: 1px solid var(--ink-primary, #1a1612);
		border-radius: 4px;
		background: var(--ink-primary, #1a1612);
		color: var(--paper-cream, #F0EBE0);
		font-family: var(--font-sans, 'Source Sans 3', sans-serif);
		font-size: 0.85rem;
		font-weight: 600;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		/* 0.9rem either side of a 0.85rem line clears the 44px floor. */
		padding: 0.9rem 2.25rem;
		cursor: pointer;
		-webkit-tap-highlight-color: transparent;
		touch-action: manipulation;
	}

	.portrait-action-chevron {
		margin-left: 0.4em;
	}

	.portrait-action:focus-visible {
		outline: 2px solid var(--ink-primary, #1a1612);
		outline-offset: 3px;
	}

	/* PRINT EMITS THE PAGE. Whichever view the singer is looking at, the
	   action and the aid leave the sheet, and the page comes back on stage. */
	@media print {
		.portrait-action {
			display: none !important;
		}

		.stage-aid {
			display: none !important;
		}

		.stage-page.offstage {
			position: static !important;
			left: auto !important;
		}
	}
	/* Responsive layout for narrow viewports */
	@media (max-width: 767px) {
		.app-content {
			position: relative;
			height: 100vh;
			overflow: hidden;
		}

		.main-content {
			height: 100vh;
			overflow: auto;
			/* N.73 C2: the horizontal padding IS the gutter, so the page below
			   fills what is left and lands on the viewport width less twice
			   this number. --desk-pad-top must match the top padding, and
			   does. The clause that used to follow, "the vertical stays where
			   portrait C left it", is struck: it stopped being true when this
			   ruling raised the top. The BOTTOM is still portrait C's. */
			/* N.73 S3 ship two raised the vertical from 0.5rem to 1rem, on
			   Dann's ruling of the 63c2bb4 walk: Learn and Guide already sat
			   at 1rem here, through a two-class override that has now been
			   deleted, and this is the value that keeps them there and brings
			   Studio's two documents down to meet them. The BOTTOM is
			   unchanged: `padding-bottom` below re-sets it to 0.5rem. */
			padding: 1rem var(--portrait-gutter, 24px);
			width: 100%;
			align-items: flex-start;
			-webkit-overflow-scrolling: touch;
			transform: none;
			--desk-pad-top: 1rem;

			/* This reserved 92px at the bottom of the viewport for two pieces
			   of fixed furniture: the tab bar at 56px and the paper handle
			   sitting on it at 36px. Dann found the need for it under the
			   attribution's final line on 2026-08-11. N.73 S1 deleted both, so
			   the reservation goes with them and the phone gets its 92px back.
			   Nothing is fixed to the bottom of the desk any more; the drawer's
			   pull is on the side. */
			padding-bottom: 0.5rem;
		}
	}

	/* ── Update notice toast ─────────────────────────── */

	/* N.53. The shape did not hold: a shrink-wrapped flex row with no width
	   let the French string wrap to five lines, and border-radius 999px on a
	   tall box is a squircle rather than a pill. Width is now determinate
	   (left/right + margin auto + max-width) instead of shrink-to-fit, so the
	   radius always resolves against a known height. Dann, E.43: keep the
	   pill, bind it in a thicker lavender border. */
	.update-toast {
		position: fixed;
		bottom: 1.25rem;
		left: 1rem;
		right: 1rem;
		margin: 0 auto;
		max-width: 30rem;
		z-index: 200;
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.6rem 0.9rem 0.6rem 1.1rem;
		background: var(--paper, #faf7f2);
		border: 2px solid var(--muted-lavender, #A89BB5);
		border-radius: 999px;
		box-shadow: 0 4px 16px rgba(40, 38, 35, 0.18);
		font-family: var(--font-sans, 'Source Sans 3', sans-serif);
		font-size: 0.88rem;
		color: var(--ink-secondary, #4a4540);
	}
	/* The sentence takes the slack; the two controls never shrink. */
	.update-toast-text {
		flex: 1 1 auto;
		min-width: 0;
	}

	.update-toast-action {
		flex: 0 0 auto;
		border: none;
		border-radius: 999px;
		padding: 0.35rem 0.9rem;
		background: var(--sage, #8a9b7e);
		color: #fff;
		font-family: inherit;
		font-size: 0.85rem;
		cursor: pointer;
	}

	.update-toast-action:hover {
		filter: brightness(0.95);
	}

	.update-toast-dismiss {
		border: none;
		background: none;
		color: var(--ink-secondary, #4a4540);
		font-size: 1.1rem;
		line-height: 1;
		cursor: pointer;
		padding: 0.2rem;
	}

	/* N.53 raised the toast to clear the fixed tab bar it was sitting on:
	   the bar was bottom 0, height 56px, z-index 50, and the toast at bottom
	   1.25rem covered its upper 36px. N.73 S1 deleted the bar, so the
	   clearance has nothing left to clear and the toast sits where the phone
	   has room for it. */
	@media (max-width: 767px) {
		.update-toast {
			bottom: 0.75rem;
		}
	}

	@media print {
		.update-toast {
			display: none;
		}
	}
</style>
