/**
 * Palatalization of consonants, with the reason for each (Grayson 2012,
 * pp. 193, 206 to 211, 249 to 250; Derwing and Priestly 1980, pp. 76 to 87).
 *
 * Row 175 step 1 (brief r2, 2026-11-02). One function decides, for every
 * consonant of a word, whether it is soft and WHY. The log, the comments, and
 * the IPA all read this map; nothing re-derives softness from the IPA string.
 *
 * The rules Ilya implements, and nothing else:
 *
 * 1. Direct agents (p. 206): a consonant before ь or an indicator letter
 *    (е ё и ю я) is soft. ч щ й are always soft; ж ш ц are always hard.
 *    ⟨в⟩, ⟨с⟩, ⟨з⟩ before ⟨ъ⟩ and an iotated vowel are soft: Grayson p. 193
 *    prose, p. 206 rule 2, p. 250 (съесть /sʲ ˈjesʲtʲ/), ruled over his p. 194
 *    table (Dann, 2026-11-01 23:58). Reason `hard-sign-vzs`.
 * 2. Boundaries that stop a regressive chain (p. 206): ж ш ц; ъ (except after
 *    в с з); a vowel; a hard consonant; the word end. The prefix boundary
 *    (p. 249) is in `prefix-boundary.ts`.
 * 3. Limits (p. 209): л only when doubled; н only before a soft н or a soft
 *    dental; velars only before a soft velar; labials б п в ф (p. 209 rule 5)
 *    and м (D&P 1980, p. 76 3P1 and p. 78; Grayson pp. 211, 250) only before a
 *    soft labial.
 * 4. Dentals т д с з: softened by ANY soft consonant that follows (no limit
 *    on p. 209; сестрёнка /sʲi ˈsʲtʲrʲon kɑ/ p. 210; симметрический p. 211).
 *    Grayson, personal communication, February 2026: "Russian 'Stage'
 *    pronunciation (from which Russian lyric diction borrowed) palatalizes
 *    everything in similar clusters, except the 'always hard' consonants (of
 *    course)." ч and щ count as soft triggers (D&P p. 81, лётчик, кончать);
 *    Grayson is silent on these pages: NOT ESTABLISHED for him. Where D&P's
 *    speech rule differs (a dental before рь or a soft velar, D&P pp. 79 to
 *    80), the reason is `regressive-dental-dp-differs`: information for the
 *    singer, not a second pronunciation.
 * 5. ⟨р⟩ before a soft consonant is palatalized in two cases only: when it is
 *    doubled (⟨-ррь-⟩), or when it immediately follows ⟨и⟩, ⟨е⟩, or ⟨э⟩ and
 *    the stress falls either on that vowel or on the next vowel after the
 *    ⟨р⟩. This is Dann's ratified reformulation (OPEN.md 2026-11-01 23:53) of
 *    Grayson p. 209 rule 2 and n. 277 and D&P pp. 86 to 87, not D&P's wording
 *    (D&P 3R(b) names no stress). The three words of D&P 3R(c) (борщ, скорбь,
 *    церковь) are lexical exceptions (`lexical-r.ts`).
 * 6. Soft р and л do not stop the chain (Grayson p. 208 steps 3 to 5 treat a
 *    non-palatalizable consonant as a stop in the walk, not a boundary).
 *
 * A к, г, or х that the stage profile keeps hard in -кий/-гий/-хий
 * (`checkVelarAdjectival`, Grayson pp. 301 to 303) is hard here, so it
 * softens nothing before it: симметрический keeps с hard (p. 211). Reason
 * `adjectival-stage-hard`.
 */

import { prefixBoundary, type PrefixBoundary } from './prefix-boundary';

export type PalReason =
  | 'agent-vowel'
  | 'agent-soft-sign'
  | 'regressive-dental'
  | 'regressive-dental-dp-differs'
  | 'regressive-homorganic'
  | 'regressive-n'
  | 'geminate'
  | 'r-front-stressed'
  | 'hard-sign-vzs'
  | 'look-alike-root'
  | 'blocked-class'
  | 'blocked-n'
  | 'blocked-r'
  | 'blocked-l'
  | 'boundary-hard-sign'
  | 'boundary-prefix'
  | 'no-soft-follower'
  | 'always-soft'
  | 'always-hard'
  | 'lexical-soft'
  | 'reflexive-hard'
  | 'adjectival-stage-hard'
  | 'cluster';

/** Reasons that mean the consonant is soft. `cluster` is neither: a merged cluster has its own IPA. */
export const SOFT_REASONS: ReadonlySet<PalReason> = new Set<PalReason>([
  'agent-vowel', 'agent-soft-sign', 'regressive-dental', 'regressive-dental-dp-differs',
  'regressive-homorganic', 'regressive-n', 'geminate', 'r-front-stressed', 'hard-sign-vzs',
  'look-alike-root', 'always-soft', 'lexical-soft',
]);

/** Reasons that mean the consonant is hard. */
export const HARD_REASONS: ReadonlySet<PalReason> = new Set<PalReason>([
  'blocked-class', 'blocked-n', 'blocked-r', 'blocked-l', 'boundary-hard-sign', 'boundary-prefix',
  'no-soft-follower', 'always-hard', 'reflexive-hard', 'adjectival-stage-hard',
]);

/** The softness a reason implies; null for a reason that implies none (`cluster`). */
export function softnessOfReason(reason: PalReason): boolean | null {
  if (SOFT_REASONS.has(reason)) return true;
  if (HARD_REASONS.has(reason)) return false;
  return null;
}

export interface PalEntry {
  soft: boolean;
  reason: PalReason;
  /** `look-alike-root` only: the prefix the word seems to begin with, and the root. */
  look?: string;
  root?: string;
}

/** One entry per consonant index of the word: soft or hard, with the reason. */
export type PalMap = Map<number, PalEntry>;

export interface PalInput {
  /** The word, lowercased, punctuation out. */
  word: string;
  /** Its syllables, whose lengths sum to the word's length (for the stress test of ⟨р⟩). */
  syllables?: readonly string[];
  /** Index of the stressed syllable; -1 or less when unknown. */
  stressIndex?: number;
  /** ц, ш, р softened by lemma (`lexical-palatalization.ts`, `lexical-r.ts`). */
  lexicalSoft?: ReadonlySet<number>;
  /** The reflexive с (`reflexive.ts`). */
  lexicalHard?: ReadonlySet<number>;
  /** Velars the stage profile keeps hard in -кий/-гий/-хий. */
  velarAdjectivalHard?: ReadonlySet<number>;
}

const VOWELS = new Set(['а', 'е', 'ё', 'и', 'о', 'у', 'ы', 'э', 'ю', 'я']);
const CONSONANTS = new Set(['б', 'в', 'г', 'д', 'ж', 'з', 'й', 'к', 'л', 'м', 'н', 'п', 'р', 'с', 'т', 'ф', 'х', 'ц', 'ч', 'ш', 'щ']);
const ALWAYS_SOFT = new Set(['ч', 'щ', 'й']);
const ALWAYS_HARD = new Set(['ж', 'ш', 'ц']);
const INDICATORS = new Set(['е', 'ё', 'и', 'ю', 'я']);
const IOTATED = new Set(['е', 'ё', 'ю', 'я']);
const VELARS = new Set(['к', 'г', 'х']);
/** Labials of Grayson p. 209 rule 5, plus м (D&P 1980, pp. 76, 78; Grayson pp. 211, 250). */
const LABIALS = new Set(['б', 'п', 'в', 'ф', 'м']);
/** Triggers of the н rule (the engine's dental set since before row 175): NOT ESTABLISHED that Grayson counts ц so. */
const N_TRIGGERS = new Set(['т', 'д', 'с', 'з', 'н', 'ц']);
/** A dental softened before рь or a soft velar: D&P pp. 79 to 80 print it hard. */
const DP_DIFFERS = new Set(['р', 'к', 'г', 'х']);

export function computePalatalization(input: PalInput): PalMap {
  const chars = [...input.word.toLowerCase()];
  const n = chars.length;
  const map: PalMap = new Map();
  const lexicalSoft = input.lexicalSoft ?? new Set<number>();
  const lexicalHard = input.lexicalHard ?? new Set<number>();
  const velarHard = input.velarAdjectivalHard ?? new Set<number>();
  const syllables = input.syllables ?? [input.word];
  const stress = input.stressIndex ?? -1;
  const put = (i: number, soft: boolean, reason: PalReason, extra?: { look: string; root: string }): void => {
    map.set(i, extra ? { soft, reason, ...extra } : { soft, reason });
  };

  // Which syllable holds each letter; the stress test of ⟨р⟩ reads it.
  const inStressed = (index: number): boolean => {
    if (stress < 0) return false;
    let start = 0;
    for (let s = 0; s < syllables.length; s++) {
      const end = start + syllables[s].length - 1;
      if (index >= start && index <= end) return s === stress;
      start = end + 1;
    }
    return false;
  };
  const rFront = (i: number): boolean => {
    const pv = chars[i - 1];
    if (!(pv === 'и' || pv === 'е' || pv === 'э')) return false;
    if (inStressed(i - 1)) return true;
    for (let j = i + 1; j < n; j++) if (VOWELS.has(chars[j])) return inStressed(j);
    return false;
  };

  // PASS 1: direct causes and fixed values.
  for (let i = 0; i < n; i++) {
    const c = chars[i];
    if (!CONSONANTS.has(c)) continue;
    const nx = chars[i + 1];
    if (lexicalHard.has(i)) put(i, false, 'reflexive-hard');
    else if (velarHard.has(i)) put(i, false, 'adjectival-stage-hard');
    else if (lexicalSoft.has(i)) put(i, true, 'lexical-soft');
    else if (ALWAYS_SOFT.has(c)) put(i, true, 'always-soft');
    else if (ALWAYS_HARD.has(c)) put(i, false, 'always-hard');
    else if (nx === 'ь') put(i, true, 'agent-soft-sign');
    else if (nx !== undefined && INDICATORS.has(nx)) put(i, true, 'agent-vowel');
    else if ((c === 'в' || c === 'с' || c === 'з') && nx === 'ъ' && chars[i + 2] !== undefined && IOTATED.has(chars[i + 2])) {
      put(i, true, 'hard-sign-vzs');
    }
  }

  // PASS 2: the regressive chain, right to left. The consonant at i + 1 is decided first.
  const boundary: PrefixBoundary | null = prefixBoundary(input.word);
  for (let i = n - 1; i >= 0; i--) {
    const c = chars[i];
    if (!CONSONANTS.has(c) || map.has(i)) continue;
    const nx = chars[i + 1];
    if (nx === undefined || !CONSONANTS.has(nx)) {
      put(i, false, nx === 'ъ' ? 'boundary-hard-sign' : 'no-soft-follower');
      continue;
    }
    if (!map.get(i + 1)?.soft) {
      put(i, false, 'no-soft-follower');
      continue;
    }
    // The next consonant is soft: apply the limits of p. 209.
    let soft = true;
    let reason: PalReason;
    if (c === 'л') {
      soft = nx === 'л';
      reason = soft ? 'geminate' : 'blocked-l';
    } else if (c === 'р') {
      if (nx === 'р') reason = 'geminate';
      else if (rFront(i)) reason = 'r-front-stressed';
      else { soft = false; reason = 'blocked-r'; }
    } else if (c === 'н') {
      soft = nx === 'н' || N_TRIGGERS.has(nx);
      reason = soft ? 'regressive-n' : 'blocked-n';
    } else if (VELARS.has(c) || LABIALS.has(c)) {
      const cls = VELARS.has(c) ? VELARS : LABIALS;
      soft = cls.has(nx);
      reason = soft ? 'regressive-homorganic' : 'blocked-class';
    } else if (c === 'т' || c === 'д' || c === 'с' || c === 'з') {
      reason = DP_DIFFERS.has(nx) ? 'regressive-dental-dp-differs' : 'regressive-dental';
    } else {
      soft = false;
      reason = 'no-soft-follower';
    }
    // The prefix boundary (p. 249): not crossed, unless the same consonant stands on both sides.
    if (soft && boundary && boundary.end === i && boundary.kind !== 'vzs' && c !== nx) {
      if (boundary.kind === 'look-alike') {
        put(i, true, 'look-alike-root', { look: boundary.look, root: boundary.root });
      } else {
        put(i, false, 'boundary-prefix');
      }
      continue;
    }
    put(i, soft, reason);
  }
  return map;
}

/** Whether the consonant at `i` is soft in the map. */
export function softAt(map: PalMap, i: number): boolean {
  return map.get(i)?.soft ?? false;
}

/** The fields of a transcription-log consonant entry that `annotatePalatalization` fills. */
interface LogEntryLike {
  char: string;
  ipa: string;
  position?: number;
  features: Record<string, any>;
}

/**
 * Fill `trigger`, `baseIpa`, and (for look-alike roots) `word`, `look`, `root`
 * on the consonant entries of a word's log, so that the comment can name the
 * sound that caused or failed to cause the softening. `trigger` is the letter
 * for a direct vowel agent, and the sung sound of the next consonant for a
 * regressive reason or a limit that held.
 */
export function annotatePalatalization(
  log: LogEntryLike[],
  word: string,
  map: PalMap,
  baseOf: (ch: string) => string,
): void {
  const chars = [...word];
  const byPos = new Map<number, LogEntryLike>();
  for (const e of log) if (e.features?.type === 'consonant' && e.position !== undefined) byPos.set(e.position, e);
  for (const e of byPos.values()) {
    const pos = e.position as number;
    const pal = map.get(pos);
    if (!pal) continue;
    e.features.baseIpa = baseOf(e.char);
    if (pal.reason === 'agent-vowel') e.features.trigger = chars[pos + 1];
    else if (
      pal.reason.startsWith('regressive') || pal.reason.startsWith('blocked') || pal.reason === 'geminate' ||
      pal.reason === 'r-front-stressed' || pal.reason === 'look-alike-root' || pal.reason === 'boundary-prefix'
    ) {
      const next = byPos.get(pos + 1);
      if (next) e.features.trigger = next.ipa;
    }
    if (pal.reason === 'look-alike-root') {
      e.features.word = word;
      e.features.look = pal.look;
      e.features.root = pal.root;
    }
  }
}
