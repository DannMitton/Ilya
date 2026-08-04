/**
 * Shane profile persistence, v2: multiple named voices.
 *
 * v1 (2026-07-11, same day): a single profile per device, built on Kimi's
 * gate that the profile-ready main-pane state must not ship before the
 * profile survives a reload. v2 (Claude-Kimi-Dann consensus, 2026-07-11,
 * same session) widens it to a flat list of named voices, one active at a
 * time, serving three cases with one mechanism: a guest on someone's
 * device (a guest is just a new voice, no guest concept anywhere), style
 * variants of one singer (a duplicate you re-take a few vowels on), and
 * progress snapshots (a duplicate you leave alone; the quiet date orders
 * it). Migration: an existing v1 profile becomes the first named voice
 * with its readings intact, and the v1 key is retired.
 *
 * What is stored per voice: only what was actually sung (direct samples).
 * Derived Estimated previews are display-only, recomputed from the same
 * derive() on render, never persisted — the standing single-source-of-
 * formulae rule (Mitton 2020 §5.3.3) unchanged.
 *
 * localStorage, client-side only (the app is adapter-static with SSR off,
 * but every entry point guards for a missing window so svelte-check and
 * any future SSR pass stay clean). Every function is failure-silent by
 * design: a private-browsing window, a full quota, or a corrupt entry
 * degrades to an empty store and the session lives on in memory.
 * Persistence must never throw into the calibration UI.
 *
 * Shape note: the engine schema's VoiceProfile (engine/types.ts) declares
 * calibratedFormants as a complete Record<Vowel, CalibratedFormant>, which
 * a partial in-progress profile cannot satisfy. This store persists its
 * own versioned shape; reconciling the two is recorded for the pending
 * engine-spec version bump (the Ilya2006B / three-tier error contract
 * bump already queued).
 */
import type { Vowel, CalibratedFormant, VoiceCharacteristics, VoiceType } from './engine/types';
import type { FryRangeVerdict } from './engine/readiness';

/**
 * What the readiness gate found at the moment this voice was calibrated (item
 * 1.4a: "add the room-monitor toast recorded in the profile's provenance").
 *
 * This is provenance, not a reading: it says what the room and the throwaway
 * fry were like when the vowels below were sampled, so a Fit result printed
 * from this voice can say so rather than implying laboratory conditions. Every
 * field distinguishes "measured" from "not measured"; nothing here stands in
 * for an absent measurement.
 */
export interface ReadinessRecord {
	/** ISO 8601, when the gate ran. */
	measuredAt: string;
	/** False when the gate abstained outright, e.g. no microphone was reachable. */
	measured: boolean;
	/** Room SNR over the engine's [100, 4000] Hz band, dB. `null` = not measured. */
	roomSnrDb: number | null;
	/**
	 * True only when a measured room reading warranted the room-monitor toast.
	 * An abstention is never lively; see `readiness.ts`.
	 */
	roomLively: boolean;
	/** The throwaway fry's inter-pulse rate, Hz. `null` = not recovered. */
	fryRateHz: number | null;
	/** The verdict against the published 20-80 Hz band. */
	fryRange: FryRangeVerdict;
}

const KEY_V1 = 'shane.profile.v1';
const KEY = 'shane.profiles.v2';

export interface StoredVoice {
	id: string;
	/** Free-text, never empty (the UI's empty-name guard enforces this). */
	name: string;
	/** ISO 8601. Shown as the quiet secondary date in the switcher list. */
	createdAt: string;
	/** ISO 8601; refreshed on every formant write. */
	updatedAt: string;
	/** Direct samples only; derived previews are never stored. */
	formants: Partial<Record<Vowel, CalibratedFormant>>;
	/**
	 * The singer's self-declared voice type (Kimi's standing ruling: a
	 * routing key to Bozeman value-sets and template pre-fill, never a
	 * label imposed on the singer). Optional and additive — voices saved
	 * before the Q5 build simply lack it, and validVoice() deliberately
	 * does not require it (same version-2 shape, no migration).
	 */
	voiceType?: VoiceType;
	/**
	 * Typed range/tessitura/passaggio (Kimi's Q5 ruling, 2026-07-13).
	 * Optional and additive, same discipline as voiceType: absent on
	 * voices that skipped the wizard's Voice characteristics phase, and
	 * analyzeScore falls back to permissive defaults when it is missing
	 * or incomplete.
	 */
	characteristics?: VoiceCharacteristics;
	/**
	 * The readiness gate's record for this voice (item 1.4a). Optional and
	 * additive, the same discipline as voiceType and characteristics: voices
	 * saved before the gate measured simply lack it, `validVoice()` deliberately
	 * does not require it, and its absence means "we do not know what the room
	 * was like", never "the room was fine".
	 */
	readiness?: ReadinessRecord;
}

export interface ProfileStore {
	version: 2;
	activeId: string | null;
	voices: StoredVoice[];
}

/** A collision-safe id; crypto.randomUUID with a time-random fallback. */
export function newVoiceId(): string {
	try {
		if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
			return crypto.randomUUID();
		}
	} catch {
		// fall through to the fallback
	}
	return `v-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function storage(): Storage | undefined {
	try {
		if (typeof window === 'undefined') return undefined;
		return window.localStorage;
	} catch {
		// Accessing localStorage itself can throw under some privacy settings.
		return undefined;
	}
}

function emptyStore(): ProfileStore {
	return { version: 2, activeId: null, voices: [] };
}

function validVoice(v: unknown): v is StoredVoice {
	if (!v || typeof v !== 'object') return false;
	const o = v as StoredVoice;
	return (
		typeof o.id === 'string' &&
		typeof o.name === 'string' &&
		o.name.length > 0 &&
		typeof o.createdAt === 'string' &&
		typeof o.updatedAt === 'string' &&
		typeof o.formants === 'object' &&
		o.formants !== null
	);
}

/**
 * The saved store, migrating a v1 single profile when present (it becomes
 * the first named voice, `migratedName`, readings intact; the v1 key is
 * removed). Returns an empty store when nothing valid is saved.
 */
export function loadStore(migratedName: string): ProfileStore {
	const s = storage();
	if (!s) return emptyStore();
	try {
		const raw = s.getItem(KEY);
		if (raw) {
			const parsed = JSON.parse(raw) as ProfileStore;
			if (parsed && parsed.version === 2 && Array.isArray(parsed.voices)) {
				const voices = parsed.voices.filter(validVoice);
				const activeId =
					typeof parsed.activeId === 'string' && voices.some((v) => v.id === parsed.activeId)
						? parsed.activeId
						: (voices[0]?.id ?? null);
				return { version: 2, activeId, voices };
			}
			// A malformed v2 entry reads as "no store"; fall through.
		}
		// Migration path: a v1 single profile becomes the first named voice.
		const rawV1 = s.getItem(KEY_V1);
		if (rawV1) {
			const parsedV1 = JSON.parse(rawV1) as {
				version?: number;
				savedAt?: string;
				formants?: Partial<Record<Vowel, CalibratedFormant>>;
			};
			if (
				parsedV1 &&
				parsedV1.version === 1 &&
				typeof parsedV1.formants === 'object' &&
				parsedV1.formants !== null
			) {
				const now = new Date().toISOString();
				const migrated: ProfileStore = {
					version: 2,
					activeId: null,
					voices: [
						{
							id: newVoiceId(),
							name: migratedName,
							createdAt: parsedV1.savedAt ?? now,
							updatedAt: parsedV1.savedAt ?? now,
							formants: parsedV1.formants
						}
					]
				};
				migrated.activeId = migrated.voices[0].id;
				try {
					s.setItem(KEY, JSON.stringify(migrated));
					s.removeItem(KEY_V1);
				} catch {
					// If the write fails the migration still serves this session.
				}
				return migrated;
			}
		}
		return emptyStore();
	} catch {
		return emptyStore();
	}
}

/** Write the whole store. Overwrites the previous save. */
export function saveStore(store: ProfileStore): void {
	const s = storage();
	if (!s) return;
	try {
		s.setItem(KEY, JSON.stringify(store));
	} catch {
		// Quota or serialization failure: the in-memory session store stands.
	}
}
