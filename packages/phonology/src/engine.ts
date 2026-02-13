/**
 * GraysonEngine — Phonological analysis engine for Russian lyric diction
 *
 * Implements the phonological rules from Craig Grayson's 2012 dissertation
 * "Russian Lyric Diction" — the sole phonological authority for Ilya.
 *
 * Extracted from prototype v6.0.114 (index.html, lines 6169–8202).
 * This is a clean extraction, not a rewrite. Internal logic is preserved
 * identically. TypeScript types are added to the public API only.
 *
 * @module @ilya/phonology
 */

// ─────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────

/** Multi-authority engine configuration (Grayson default, supports Belov, Richter, etc. later) */
export interface EngineConfig {
  /** Velar adjectival suffix treatment: 'stage' = Old Muscovite [ɨj], 'modern' = [ij] */
  adjectival: 'stage' | 'modern';
}

/** Notation display preferences — pure cosmetic transforms, never modify engine data */
export interface NotationPreferences {
  /** false = ʌ (Grayson default), true = ə */
  reducedVowel: boolean;
  /** false = nn (Grayson default), true = nː */
  geminate: boolean;
  /** false = ʃʲʃʲ (Grayson default), true = ʃʲː */
  shcha: boolean;
  /** false = ɲ (Grayson default), true = nʲ */
  palatalNasal: boolean;
  /** Phase 3 — not wired yet */
  reconstitution: boolean;
}

/** Result of a stress dictionary lookup */
export interface StressLookupResult {
  stress: number;
  gloss: any;
  pos: string;
  lemma: string;
  source: string;
  isHomograph: boolean;
  allEntries?: any[];
  canonicalForm: string;
  originalInput?: string;
}

/** Per-syllable transcription data */
export interface SyllableData {
  cyrillic: string;
  ipa: string;
  isStressed: boolean;
}

/** Per-character transcription log entry (for Phoneme Ribbon) */
export interface TranscriptionLogEntry {
  char: string;
  ipa: string;
  features: {
    type: 'vowel' | 'consonant' | 'sign' | 'glide' | 'cluster';
    [key: string]: any;
  };
  syllableIndex: number;
  position: number;
}

/** Full transcription result from the engine */
export interface TranscriptionResult {
  ipa: string;
  ipaUnderlying: string;
  syllables: SyllableData[];
  transcriptionLog: TranscriptionLogEntry[];
  source?: string;
}

/**
 * Proclitic reduction position relative to host word stress.
 * Determines vowel quality in proclitic transcription.
 * Binary model for v1; structured type supports future distance-sensitive reduction.
 */
export type ProcliticPosition =
  | null                    // Not a proclitic, or no host found
  | { type: 'pretonic' }    // Adjacent to host stress (first pretonic)
  | { type: 'remote' };     // Not adjacent to host stress
  // Future: | { type: 'distance'; syllables: number }

/** Clitic registry entry */
export interface CliticEntry {
  type: 'proclitic' | 'enclitic';
  canonicalIpa: string;
  gloss: { en: string; fr: string };
}

/** Special cluster match info */
export interface SpecialClusterInfo {
  startIndex: number;
  endIndex: number;
  cluster: string;
  ipa: string;
}

/** Word object for cross-word assimilation */
export interface BoundaryWord {
  cyrillic: string;
  ipaSurface: string;
  ipaUnderlying: string;
  rightBoundary: 'hard' | 'soft' | 'clitic';
  boundarySource: 'user' | 'auto' | 'punctuation';
  skipFinalDevoicing: boolean;
  cleanWord?: string;
  [key: string]: any;
}

// ─────────────────────────────────────────────────────────────────────
// MODULE-LEVEL STATE (injectable dictionaries)
// ─────────────────────────────────────────────────────────────────────

/** Stress dictionary — 1.29M-word Russian dictionary with stress markings */
let STRESS_DICTIONARY: Record<string, any> = {};

/** Singer supplement — high-frequency vocabulary overrides */
let SINGER_SUPPLEMENT: Record<string, any> = {};

/** Inject the main stress dictionary (called by @ilya/dictionary after load) */
export function setStressDictionary(dict: Record<string, any>): void {
  STRESS_DICTIONARY = dict;
}

/** Inject the singer supplement (called by @ilya/dictionary after load) */
export function setSingerSupplement(supp: Record<string, any>): void {
  SINGER_SUPPLEMENT = supp;
}

/** Default engine configuration: Old Muscovite / Grayson */
export const DEFAULT_ENGINE_CONFIG: EngineConfig = {
  adjectival: 'stage',
};

// ─────────────────────────────────────────────────────────────────────
// NOTATION PREFERENCES (display transform)
// ─────────────────────────────────────────────────────────────────────

/**
 * Apply cosmetic notation preferences to an IPA string.
 * Pure display transform — engine data is never modified.
 *
 * @param ipa - The IPA string to transform
 * @param prefs - Notation preference settings
 * @param includeGeminates - Apply geminate notation (paper only, not ribbon)
 * @returns Transformed IPA string
 */
export function applyNotationPreferences(
  ipa: string,
  prefs: NotationPreferences,
  includeGeminates: boolean = false,
): string {
  if (!ipa) return ipa;
  let result = ipa;

  if (prefs.reducedVowel) {
    result = result.replace(/ʌ/g, 'ə');
  }
  if (prefs.shcha) {
    result = result.replace(/ʃʲʃʲ/g, 'ʃʲː');
  }
  if (prefs.palatalNasal) {
    result = result.replace(/ɲ/g, 'nʲ');
  }
  if (prefs.geminate && includeGeminates) {
    // Identical consonant IPA across syllable boundary (space separator)
    // Handles plain (n n) and palatalized (nʲ nʲ) geminates
    result = result.replace(/([bdɡfgklɫmnɲprstvxzʃʒ]ʲ?) \1/g, '$1ː');
  }

  return result;
}

// ─────────────────────────────────────────────────────────────────────
// GRAYSON ENGINE
// ─────────────────────────────────────────────────────────────────────

export const GraysonEngine = {

  inventory: Object.freeze({
    vowels_stressed: {
      'а': 'ɑ', 'а_interpalatal': 'a',
      'о': 'o',
      'е': 'ɛ', 'е_interpalatal': 'e',
      'ё': 'o',
      'и': 'i',
      'ы': 'ɨ',
      'у': 'u',
      'ю': 'u',
      'я': 'ɑ', 'я_interpalatal': 'a',
      'э': 'ɛ'
    },
    vowels_unstressed: {
      'а_pretonic': 'ɑ', 'а_remote': 'ʌ',
      'о_pretonic': 'ɑ', 'о_remote': 'ʌ',
      'е_unstressed': 'ɪ',
      'и': 'i',
      'ы_unstressed': 'ɨ',
      'у_unstressed': 'u',
      'ю_unstressed': 'u',
      'я_unstressed': 'ɪ',
      'э_unstressed': 'ɪ'
    },
    consonants: {
      'б': 'b', 'п': 'p',
      'в': 'v', 'ф': 'f',
      'д': 'd', 'т': 't',
      'г': 'ɡ', 'к': 'k',
      'з': 'z', 'с': 's',
      'ж': 'ʒ', 'ш': 'ʃ',
      'х': 'x',
      'ц': 'ts',
      'ч': 'tʃʲ',
      'щ': 'ʃʲʃʲ',
      'л': 'l', 'л_hard': 'ɫ', 'л_soft': 'lʲ',
      'м': 'm',
      'н': 'n', 'н_soft': 'ɲ',
      'р': 'r',
      'й': 'j'
    } as Record<string, string>,
    markers: {
      'palatalization': 'ʲ',
      'stress': 'ˈ'
    }
  }),

  vowels: new Set(['а', 'е', 'ё', 'и', 'о', 'у', 'ы', 'э', 'ю', 'я']),
  consonants: new Set(['б', 'в', 'г', 'д', 'ж', 'з', 'й', 'к', 'л', 'м', 'н', 'п', 'р', 'с', 'т', 'ф', 'х', 'ц', 'ч', 'ш', 'щ']),
  alwaysSoft: new Set(['ч', 'щ', 'й']),
  alwaysHard: new Set(['ж', 'ш', 'ц']),

  // Clitic data with canonical IPA for isolated forms (Grayson p. 248-257)
  // Canonical forms use pretonic reduction for proclitics, posttonic for enclitics
  cliticData: new Map<string, CliticEntry>([
    // Proclitics - canonical form assumes pretonic position
    // Short glosses curated for PDF display (v5.11.10)
    ['в', { type: 'proclitic', canonicalIpa: 'v', gloss: { en: 'in/into', fr: 'dans/en' } }],
    ['во', { type: 'proclitic', canonicalIpa: 'vɑ', gloss: { en: 'in/into', fr: 'dans/en' } }],
    ['к', { type: 'proclitic', canonicalIpa: 'k', gloss: { en: 'to/toward', fr: 'vers/à' } }],
    ['ко', { type: 'proclitic', canonicalIpa: 'kɑ', gloss: { en: 'to/toward', fr: 'vers/à' } }],
    ['с', { type: 'proclitic', canonicalIpa: 's', gloss: { en: 'with/from', fr: 'avec/de' } }],
    ['со', { type: 'proclitic', canonicalIpa: 'sɑ', gloss: { en: 'with/from', fr: 'avec/de' } }],
    ['о', { type: 'proclitic', canonicalIpa: 'ɑ', gloss: { en: 'about', fr: 'de/sur' } }],
    ['об', { type: 'proclitic', canonicalIpa: 'ɑb', gloss: { en: 'about', fr: 'de/sur' } }],
    ['обо', { type: 'proclitic', canonicalIpa: 'ɑbɑ', gloss: { en: 'about', fr: 'de/sur' } }],
    ['у', { type: 'proclitic', canonicalIpa: 'u', gloss: { en: 'at/by', fr: 'chez/près de' } }],
    ['на', { type: 'proclitic', canonicalIpa: 'nɑ', gloss: { en: 'on/onto', fr: 'sur' } }],
    ['за', { type: 'proclitic', canonicalIpa: 'zɑ', gloss: { en: 'behind/for', fr: 'derrière/pour' } }],
    ['по', { type: 'proclitic', canonicalIpa: 'pɑ', gloss: { en: 'along/by', fr: 'le long de/par' } }],
    ['до', { type: 'proclitic', canonicalIpa: 'dɑ', gloss: { en: 'until/to', fr: "jusqu'à" } }],
    ['из', { type: 'proclitic', canonicalIpa: 'iz', gloss: { en: 'from/out of', fr: 'de/hors de' } }],
    ['изо', { type: 'proclitic', canonicalIpa: 'izɑ', gloss: { en: 'from/out of', fr: 'de/hors de' } }],
    ['от', { type: 'proclitic', canonicalIpa: 'ɑt', gloss: { en: 'from', fr: 'de' } }],
    ['ото', { type: 'proclitic', canonicalIpa: 'ɑtɑ', gloss: { en: 'from', fr: 'de' } }],
    ['без', { type: 'proclitic', canonicalIpa: 'bʲɪz', gloss: { en: 'without', fr: 'sans' } }],
    ['не', { type: 'proclitic', canonicalIpa: 'ɲɪ', gloss: { en: 'not', fr: 'ne… pas' } }],
    ['ни', { type: 'proclitic', canonicalIpa: 'ɲi', gloss: { en: 'nor/not', fr: 'ni' } }],
    ['над', { type: 'proclitic', canonicalIpa: 'nɑt', gloss: { en: 'above', fr: 'au-dessus de' } }],
    ['надо', { type: 'proclitic', canonicalIpa: 'nɑdɑ', gloss: { en: 'above', fr: 'au-dessus de' } }],
    ['под', { type: 'proclitic', canonicalIpa: 'pɑt', gloss: { en: 'under', fr: 'sous' } }],
    ['подо', { type: 'proclitic', canonicalIpa: 'pɑdɑ', gloss: { en: 'under', fr: 'sous' } }],
    ['при', { type: 'proclitic', canonicalIpa: 'prʲi', gloss: { en: 'at/near', fr: 'près de/en présence de' } }],
    ['про', { type: 'proclitic', canonicalIpa: 'prɑ', gloss: { en: 'about', fr: 'au sujet de' } }],
    ['для', { type: 'proclitic', canonicalIpa: 'dlʲɑ', gloss: { en: 'for', fr: 'pour' } }],
    ['через', { type: 'proclitic', canonicalIpa: 'tʃʲɪrʲɪz', gloss: { en: 'through', fr: 'à travers' } }],
    ['перед', { type: 'proclitic', canonicalIpa: 'pʲɪrʲɪt', gloss: { en: 'before', fr: 'devant' } }],
    ['передо', { type: 'proclitic', canonicalIpa: 'pʲɪrʲɪdɑ', gloss: { en: 'before', fr: 'devant' } }],
    // Enclitics - canonical form assumes posttonic position
    ['ли', { type: 'enclitic', canonicalIpa: 'lʲi', gloss: { en: '(question)', fr: '(question)' } }],
    ['ль', { type: 'enclitic', canonicalIpa: 'lʲ', gloss: { en: '(question)', fr: '(question)' } }],
    ['же', { type: 'enclitic', canonicalIpa: 'ʒɨ', gloss: { en: '(emphasis)', fr: '(emphase)' } }],
    ['бы', { type: 'enclitic', canonicalIpa: 'bɨ', gloss: { en: 'would', fr: '(conditionnel)' } }],
    ['б', { type: 'enclitic', canonicalIpa: 'b', gloss: { en: 'would', fr: '(conditionnel)' } }],
    ['то', { type: 'enclitic', canonicalIpa: 'tɑ', gloss: { en: '(then)', fr: '(alors)' } }],
    ['ка', { type: 'enclitic', canonicalIpa: 'kɑ', gloss: { en: '(urging)', fr: '(exhortation)' } }],
    ['таки', { type: 'enclitic', canonicalIpa: 'tɑkʲi', gloss: { en: 'after all', fr: 'tout de même' } }],
  ]),

  // Derived Sets for backwards compatibility (computed once, not on every access)
  proclitics: null as unknown as Set<string>,  // Initialized below
  enclitics: null as unknown as Set<string>,   // Initialized below

  // Regressive palatalization categorical restrictions (Grayson p. 209; Derwing & Priestly pp. 76-87)
  // These consonants BLOCK regressive palatalization — consonants before them do not soften
  // NOTE: Grayson's example сестрёнка /sʲtʲrʲ/ appears to be an error; D&P pp. 85-87 confirms
  // that р blocks regressive palatalization. Ilya follows D&P: сестрёнка → /strʲ/
  regressivePalatalizationBlockers: new Set(['р', 'л']), // р and л block regressive palatalization (except doubled)

  // Categorical restrictions for regressive palatalization (Grayson p. 209)
  // Velars only palatalize before palatalized velars
  velars: new Set(['к', 'г', 'х']),
  // Labials only palatalize before palatalized labials
  labials: new Set(['б', 'п', 'в', 'ф', 'м']),
  // Dentals palatalize more freely
  dentals: new Set(['т', 'д', 'с', 'з', 'н', 'ц']),
  // н only palatalizes before palatalized н or dental

  // Special consonant clusters (Grayson p. 225-247)
  // These are detected and transcribed as units before letter-by-letter processing
  specialClusters: {
    'сч': 'ʃʲʃʲ',   // Same as щ (p. 230-231)
    'зч': 'ʃʲʃʲ',   // Same as щ (p. 230-231)
    // Sibilant mergers (Grayson pp. 235-236)
    'сш': 'ʃː',     // с + ш → long unvoiced postalveolar (p. 235)
    'зш': 'ʃː',     // з + ш → long unvoiced postalveolar (devoices, p. 235)
    'сж': 'ʒː',     // с + ж → long voiced postalveolar (voices, p. 236)
    'зж': 'ʒː',     // з + ж → long voiced postalveolar (p. 236)
  } as Record<string, string>,

  // Reflexive verb suffix clusters (Grayson p. 237-238)
  // "The clusters -тс-/-дс- and -тьс-/-дьс- resemble /ts/ but have an elongated stop"
  // These are ONLY checked at word end (suffix position)
  reflexiveSuffixes: {
    'ться': 'tːsʌ',  // купаться → /kuˈpɑtːsʌ/
    'тся': 'tːsʌ',   // боится → /bɑˈitːsʌ/
  } as Record<string, string>,

  // Word-specific cluster overrides (p. 239-240)
  wordSpecificClusters: {
    'конечно': { 'чн': 'ʃn' },
    'скучно': { 'чн': 'ʃn' },
    'скучный': { 'чн': 'ʃn' },
    'нарочно': { 'чн': 'ʃn' },
    'яичница': { 'чн': 'ʃn' },
    'что': { 'чт': 'ʃt' },
    'чтоб': { 'чт': 'ʃt' },
    'чтобы': { 'чт': 'ʃt' },
    'ничто': { 'чт': 'ʃt' },
    // русский exception (Grayson p. 233): single /s/, not geminate
    // Also overrides Old Muscovite -кий rule — uses modern soft кʲ
    'русский': { 'сс': 's' },
    'русская': { 'сс': 's' },
    'русское': { 'сс': 's' },
    'русские': { 'сс': 's' },
    'русского': { 'сс': 's' },
    'русскому': { 'сс': 's' },
    'русским': { 'сс': 's' },
    'русскими': { 'сс': 's' },
    'русской': { 'сс': 's' },
    'русских': { 'сс': 's' },
    'русскую': { 'сс': 's' },
    'русском': { 'сс': 's' },
    // Silent consonant exceptions (Grayson p. 235-236)
    // сердце family: рдц → рц (д silent)
    'сердце': { 'рдц': 'rts' },
    'сердца': { 'рдц': 'rts' },
    'сердцу': { 'рдц': 'rts' },
    'сердцем': { 'рдц': 'rts' },
    // солнце family: лнц → нц (л silent)
    'солнце': { 'лнц': 'nts' },
    'солнца': { 'лнц': 'nts' },
    'солнцу': { 'лнц': 'nts' },
    'солнцем': { 'лнц': 'nts' },
    // здравствуй family: вств → ств (first в silent)
    'здравствуй': { 'вств': 'stv' },
    'здравствуйте': { 'вств': 'stv' },
    'здравствуют': { 'вств': 'stv' },
    // чувство family: вств → ств (first в silent)
    'чувство': { 'вств': 'stv' },
    'чувства': { 'вств': 'stv' },
    'чувствам': { 'вств': 'stv' },
    'чувствами': { 'вств': 'stv' },
    'чувствах': { 'вств': 'stv' },
    'чувствую': { 'вств': 'stv' },
    'чувствует': { 'вств': 'stv' },
    'чувствовать': { 'вств': 'stv' },
    // бесчувственный family: вств → ств (first в silent)
    'бесчувственный': { 'вств': 'stv' },
    'бесчувственная': { 'вств': 'stv' },
    'бесчувственное': { 'вств': 'stv' },
    'бесчувственные': { 'вств': 'stv' },
    'бесчувственного': { 'вств': 'stv' },
    'бесчувственной': { 'вств': 'stv' },
    'бесчувственному': { 'вств': 'stv' },
    'бесчувственным': { 'вств': 'stv' },
    'бесчувственными': { 'вств': 'stv' },
    'бесчувственных': { 'вств': 'stv' },
    'бесчувственную': { 'вств': 'stv' },
    'бесчувственном': { 'вств': 'stv' },
    // Silent т in стн cluster (Grayson p. 235)
    // честный family (honest)
    'честный': { 'стн': 'sn' },
    'честная': { 'стн': 'sn' },
    'честное': { 'стн': 'sn' },
    'честные': { 'стн': 'sn' },
    'честного': { 'стн': 'sn' },
    'честной': { 'стн': 'sn' },
    'честному': { 'стн': 'sn' },
    'честным': { 'стн': 'sn' },
    'честными': { 'стн': 'sn' },
    'честных': { 'стн': 'sn' },
    'честную': { 'стн': 'sn' },
    'честном': { 'стн': 'sn' },
    'честно': { 'стн': 'sn' },
    // известный family (famous)
    'известный': { 'стн': 'sn' },
    'известная': { 'стн': 'sn' },
    'известное': { 'стн': 'sn' },
    'известные': { 'стн': 'sn' },
    'известного': { 'стн': 'sn' },
    'известной': { 'стн': 'sn' },
    'известному': { 'стн': 'sn' },
    'известным': { 'стн': 'sn' },
    'известными': { 'стн': 'sn' },
    'известных': { 'стн': 'sn' },
    'известную': { 'стн': 'sn' },
    'известном': { 'стн': 'sn' },
    'известно': { 'стн': 'sn' },
    // грустный family (sad)
    'грустный': { 'стн': 'sn' },
    'грустная': { 'стн': 'sn' },
    'грустное': { 'стн': 'sn' },
    'грустные': { 'стн': 'sn' },
    'грустного': { 'стн': 'sn' },
    'грустной': { 'стн': 'sn' },
    'грустному': { 'стн': 'sn' },
    'грустным': { 'стн': 'sn' },
    'грустными': { 'стн': 'sn' },
    'грустных': { 'стн': 'sn' },
    'грустную': { 'стн': 'sn' },
    'грустном': { 'стн': 'sn' },
    'грустно': { 'стн': 'sn' },
    // местный family (local)
    'местный': { 'стн': 'sn' },
    'местная': { 'стн': 'sn' },
    'местное': { 'стн': 'sn' },
    'местные': { 'стн': 'sn' },
    'местного': { 'стн': 'sn' },
    'местной': { 'стн': 'sn' },
    'местному': { 'стн': 'sn' },
    'местным': { 'стн': 'sn' },
    'местными': { 'стн': 'sn' },
    'местных': { 'стн': 'sn' },
    'местную': { 'стн': 'sn' },
    'местном': { 'стн': 'sn' },
    // частный family (private)
    'частный': { 'стн': 'sn' },
    'частная': { 'стн': 'sn' },
    'частное': { 'стн': 'sn' },
    'частные': { 'стн': 'sn' },
    'частного': { 'стн': 'sn' },
    'частной': { 'стн': 'sn' },
    'частному': { 'стн': 'sn' },
    'частным': { 'стн': 'sn' },
    'частными': { 'стн': 'sn' },
    'частных': { 'стн': 'sn' },
    'частную': { 'стн': 'sn' },
    'частном': { 'стн': 'sn' },
    'частно': { 'стн': 'sn' },
    // прелестный family (lovely)
    'прелестный': { 'стн': 'sn' },
    'прелестная': { 'стн': 'sn' },
    'прелестное': { 'стн': 'sn' },
    'прелестные': { 'стн': 'sn' },
    'прелестного': { 'стн': 'sn' },
    'прелестной': { 'стн': 'sn' },
    'прелестному': { 'стн': 'sn' },
    'прелестным': { 'стн': 'sn' },
    'прелестными': { 'стн': 'sn' },
    'прелестных': { 'стн': 'sn' },
    'прелестную': { 'стн': 'sn' },
    'прелестном': { 'стн': 'sn' },
    // Silent д in здн cluster (Grayson p. 235)
    // поздно family (late)
    'поздно': { 'здн': 'zn' },
    'поздний': { 'здн': 'zn' },
    'поздняя': { 'здн': 'zn' },
    'позднее': { 'здн': 'zn' },
    'поздние': { 'здн': 'zn' },
    'позднего': { 'здн': 'zn' },
    'поздней': { 'здн': 'zn' },
    'позднему': { 'здн': 'zn' },
    'поздним': { 'здн': 'zn' },
    'поздними': { 'здн': 'zn' },
    'поздних': { 'здн': 'zn' },
    'позднюю': { 'здн': 'zn' },
    'позднем': { 'здн': 'zn' },
    // праздник family (holiday)
    'праздник': { 'здн': 'zn' },
    'праздника': { 'здн': 'zn' },
    'праздникам': { 'здн': 'zn' },
    'праздниками': { 'здн': 'zn' },
    'праздниках': { 'здн': 'zn' },
    'праздники': { 'здн': 'zn' },
    'праздников': { 'здн': 'zn' },
    'праздником': { 'здн': 'zn' },
    'праздничный': { 'здн': 'zn' },
    'праздничная': { 'здн': 'zn' },
    'праздничное': { 'здн': 'zn' },
    'праздничные': { 'здн': 'zn' },
    'праздничного': { 'здн': 'zn' },
    'праздничной': { 'здн': 'zn' },
    'праздничному': { 'здн': 'zn' },
    'праздничным': { 'здн': 'zn' },
    'праздничными': { 'здн': 'zn' },
    'праздничных': { 'здн': 'zn' },
    'праздничную': { 'здн': 'zn' },
    'праздничном': { 'здн': 'zn' },
    // звёздный family (starry) - also has здн
    'звёздный': { 'здн': 'zn' },
    'звёздная': { 'здн': 'zn' },
    'звёздное': { 'здн': 'zn' },
    'звёздные': { 'здн': 'zn' },
    'звёздного': { 'здн': 'zn' },
    'звёздной': { 'здн': 'zn' },
    'звёздному': { 'здн': 'zn' },
    'звёздным': { 'здн': 'zn' },
    'звёздными': { 'здн': 'zn' },
    'звёздных': { 'здн': 'zn' },
    'звёздную': { 'здн': 'zn' },
    'звёздном': { 'здн': 'zn' },
  } as Record<string, Record<string, string>>,

  // Exception words where normal phonological rules don't apply (Grayson Appendix F)
  exceptionWords: {
    'счастье': { vowelOverrides: { 2: 'ɑ' } },
    'счастья': { vowelOverrides: { 2: 'ɑ' } },
    'счастлив': { vowelOverrides: { 2: 'ɑ' } },
    'счастливый': { vowelOverrides: { 2: 'ɑ' } },
    // русский exception (Grayson p. 233): uses modern -кий (soft), not Old Muscovite
    'русский': { skipVelarAdjectival: true },
    'русская': { skipVelarAdjectival: true },
    'русское': { skipVelarAdjectival: true },
    'русские': { skipVelarAdjectival: true },
    'русского': { skipVelarAdjectival: true },
    'русскому': { skipVelarAdjectival: true },
    'русским': { skipVelarAdjectival: true },
    'русскими': { skipVelarAdjectival: true },
    'русской': { skipVelarAdjectival: true },
    'русских': { skipVelarAdjectival: true },
    'русскую': { skipVelarAdjectival: true },
    'русском': { skipVelarAdjectival: true },
  } as Record<string, any>,

  // Find special clusters in a word
  findSpecialClusters(word: string): SpecialClusterInfo[] {
    const cleanWord = word.toLowerCase();
    const clusters: SpecialClusterInfo[] = [];

    // Check word-specific clusters first (higher priority)
    const wordOverrides = this.wordSpecificClusters[cleanWord];
    if (wordOverrides) {
      for (const [cluster, ipa] of Object.entries(wordOverrides)) {
        let idx = cleanWord.indexOf(cluster);
        while (idx !== -1) {
          clusters.push({
            startIndex: idx,
            endIndex: idx + cluster.length - 1,
            cluster: cluster,
            ipa: ipa
          });
          idx = cleanWord.indexOf(cluster, idx + 1);
        }
      }
    }

    // Check reflexive suffixes (only at word end)
    for (const [suffix, ipa] of Object.entries(this.reflexiveSuffixes)) {
      if (cleanWord.endsWith(suffix)) {
        const startIdx = cleanWord.length - suffix.length;
        clusters.push({
          startIndex: startIdx,
          endIndex: cleanWord.length - 1,
          cluster: suffix,
          ipa: ipa
        });
        break; // Only one reflexive suffix per word
      }
    }

    // Check universal clusters
    for (const [cluster, ipa] of Object.entries(this.specialClusters)) {
      let idx = cleanWord.indexOf(cluster);
      while (idx !== -1) {
        // Skip if already covered
        const alreadyCovered = clusters.some(c =>
          (idx >= c.startIndex && idx <= c.endIndex) ||
          (idx + cluster.length - 1 >= c.startIndex && idx + cluster.length - 1 <= c.endIndex)
        );
        if (!alreadyCovered) {
          clusters.push({
            startIndex: idx,
            endIndex: idx + cluster.length - 1,
            cluster: cluster,
            ipa: ipa
          });
        }
        idx = cleanWord.indexOf(cluster, idx + 1);
      }
    }

    return clusters.sort((a, b) => a.startIndex - b.startIndex);
  },

  // Check for vowel override in exception words
  getVowelOverride(word: string, charIndex: number): string | null {
    const cleanWord = word.replace(/[.,!?;:"""''–—]/g, '').toLowerCase();
    const exception = this.exceptionWords[cleanWord];
    if (exception?.vowelOverrides?.[charIndex] !== undefined) {
      return exception.vowelOverrides[charIndex];
    }
    return null;
  },

  // Check for -ая/-яя suffix exception (Grayson p. 124)
  // Feminine adjective endings are ALWAYS sung as /ɑjɑ/, never reduced
  isAyaSuffixVowel(word: string, charIndex: number): boolean {
    const cleanWord = word.replace(/[.,!?;:"""''–—]/g, '').toLowerCase();
    const len = cleanWord.length;

    // Check if word ends in -ая or -яя
    if (len >= 2) {
      const ending = cleanWord.slice(-2);
      if (ending === 'ая' || ending === 'яя') {
        // Check if this charIndex is one of the two final vowels
        if (charIndex === len - 2 || charIndex === len - 1) {
          return true;
        }
      }
    }
    return false;
  },

  // Check for Old Muscovite adjectival suffix -кий/-гий/-хий (Grayson p. 301-303)
  // When profile is 'stage': velars stay hard, и → [ɨ], й → [j]
  // Returns: { isVelarAdjectival: bool, charRole: 'velar'|'i'|'j'|null }
  checkVelarAdjectival(word: string, charIndex: number): { isVelarAdjectival: boolean; charRole: string | null } {
    const cleanWord = word.replace(/[.,!?;:"""''–—]/g, '').toLowerCase();
    const len = cleanWord.length;

    // Check if this word is an exception (e.g., русский uses modern -кий)
    const exception = this.exceptionWords[cleanWord];
    if (exception?.skipVelarAdjectival) {
      return { isVelarAdjectival: false, charRole: null };
    }

    // Check if word ends in -кий, -гий, or -хий
    if (len >= 3) {
      const ending = cleanWord.slice(-3);
      const velarEndings = ['кий', 'гий', 'хий'];

      if (velarEndings.includes(ending)) {
        const suffixStart = len - 3;

        // Check which part of the suffix this charIndex is
        if (charIndex === suffixStart) {
          return { isVelarAdjectival: true, charRole: 'velar' };
        } else if (charIndex === suffixStart + 1) {
          return { isVelarAdjectival: true, charRole: 'i' };
        } else if (charIndex === suffixStart + 2) {
          return { isVelarAdjectival: true, charRole: 'j' };
        }
      }
    }
    return { isVelarAdjectival: false, charRole: null };
  },

  // Check for genitive ending -ого/-его where г → /v/ (Grayson p. 243)
  // Exception: много, строго, etc. where -ого is NOT a genitive ending
  checkGenitiveEnding(word: string, charIndex: number): boolean {
    const cleanWord = word.replace(/[.,!?;:"""''–—]/g, '').toLowerCase();
    const len = cleanWord.length;

    // Exceptions: words where -ого/-его is NOT a genitive ending
    const exceptions = new Set([
      'много', 'немного', 'строго', 'нестрого', 'убого',
      'отлого', 'полого', 'дорого', 'недорого'
    ]);

    if (exceptions.has(cleanWord)) {
      return false;
    }

    // Check if word ends in -ого or -его
    if (len >= 3) {
      const ending3 = cleanWord.slice(-3);
      if (ending3 === 'ого' || ending3 === 'его') {
        // The г is at position len - 2 (second to last character)
        const gPosition = len - 2;
        return charIndex === gPosition;
      }
    }

    return false;
  },

  // Look up stress from dictionary
  // Handles both old format and new kaikki format (including homographs)
  lookupStress(word: string): StressLookupResult | null {
    const cleanWord = word.normalize('NFC').replace(/\u0301/g, '').replace(/[.,!?;:"""''–—]/g, '').toLowerCase();

    // Helper to normalize entry format
    const normalizeEntry = (entry: any, source: string = 'dictionary'): StressLookupResult | null => {
      if (!entry) return null;

      // Handle homographs (arrays) - return first match for now, mark as homograph
      if (Array.isArray(entry)) {
        const firstEntry = entry[0];
        const rawGloss = firstEntry.gloss ?? firstEntry.g;
        return {
          stress: firstEntry.stress ?? firstEntry.s,
          gloss: rawGloss,
          pos: firstEntry.pos ?? firstEntry.p ?? '',
          lemma: firstEntry.lemma ?? firstEntry.l ?? '',
          source: source,
          isHomograph: true,
          allEntries: entry,
          canonicalForm: cleanWord
        };
      }

      // Single entry
      const rawGloss = entry.gloss ?? entry.g;
      return {
        stress: entry.stress ?? entry.s,
        gloss: rawGloss,
        pos: entry.pos ?? entry.p ?? '',
        lemma: entry.lemma ?? entry.l ?? '',
        source: entry.source || source,
        isHomograph: false,
        canonicalForm: cleanWord
      };
    };

    // Phase 1: Check SINGER_SUPPLEMENT first (authoritative overrides)
    // This catches critical corrections like и→"and" (not "the tenth letter")
    const supplementEntry = SINGER_SUPPLEMENT[cleanWord];
    if (supplementEntry) {
      return normalizeEntry(supplementEntry, 'supplement');
    }

    // Phase 1b: Try dictionary lookup
    const exactEntry = STRESS_DICTIONARY[cleanWord];
    if (exactEntry) {
      return normalizeEntry(exactEntry, 'dictionary');
    }

    // Phase 2: Word not found — try ё-restoration
    // Russian publishers often omit the dieresis, printing ⟨е⟩ where ⟨ё⟩ should appear
    const chars = [...cleanWord];
    for (let i = 0; i < chars.length; i++) {
      if (chars[i] === 'е') {
        // Try substituting this е with ё
        const candidate = [...chars];
        candidate[i] = 'ё';
        const candidateWord = candidate.join('');

        const restoredEntry = STRESS_DICTIONARY[candidateWord] || SINGER_SUPPLEMENT[candidateWord];
        if (restoredEntry) {
          const result = normalizeEntry(restoredEntry, 'yo-restored');
          if (result) {
            result.canonicalForm = candidateWord;
            result.originalInput = cleanWord;
          }
          return result;
        }
      }
    }

    // Phase 2b: Try ё→е normalization
    // Some dictionaries store the е-form even when ё is correct
    // If user types ёлка but dictionary has елка, try that
    if (cleanWord.includes('ё')) {
      const normalizedWord = cleanWord.replace(/ё/g, 'е');
      const normalizedEntry = STRESS_DICTIONARY[normalizedWord] || SINGER_SUPPLEMENT[normalizedWord];
      if (normalizedEntry) {
        const result = normalizeEntry(normalizedEntry, 'yo-normalized');
        if (result) {
          result.canonicalForm = cleanWord; // Keep the ё form as canonical
          result.originalInput = cleanWord;
        }
        return result;
      }
    }

    // Phase 3: No match found
    return null;
  },

  // Apply the case pattern from original word to canonical form
  // Preserves uppercase/lowercase pattern when restoring ё
  applyCasePattern(original: string, canonical: string): string {
    // Strip punctuation from original to get just letters
    const origLetters = original.replace(/[.,!?;:"""''–—]/g, '');
    const canonLetters = canonical;

    // If lengths don't match, just return canonical (shouldn't happen with е→ё)
    if (origLetters.length !== canonLetters.length) {
      return canonical;
    }

    // Apply case from original to canonical, character by character
    const result: string[] = [];
    for (let i = 0; i < canonLetters.length; i++) {
      const origChar = origLetters[i];
      const canonChar = canonLetters[i];

      // Check if original was uppercase
      if (origChar === origChar.toUpperCase() && origChar !== origChar.toLowerCase()) {
        // Original was uppercase — apply to canonical
        result.push(canonChar.toUpperCase());
      } else {
        result.push(canonChar.toLowerCase());
      }
    }

    // Re-append any trailing punctuation from original
    const trailingPunct = original.match(/[.,!?;:"""''–—]+$/);
    return result.join('') + (trailingPunct ? trailingPunct[0] : '');
  },

  isVowel(char: string): boolean {
    return this.vowels.has(char?.toLowerCase());
  },

  isConsonant(char: string): boolean {
    return this.consonants.has(char?.toLowerCase());
  },

  isPalatalized(char: string, nextChar: string | undefined): boolean {
    const c = char?.toLowerCase();
    const nc = nextChar?.toLowerCase();

    if (this.alwaysSoft.has(c)) return true;
    if (this.alwaysHard.has(c)) return false;
    if (nc === 'ь') return true;
    if (['е', 'ё', 'и', 'ю', 'я'].includes(nc as string)) return true;

    return false;
  },

  // COMPLETE PALATALIZATION MAP (Grayson p. 207-209; D&P pp. 76-87)
  // Computes ALL palatalization sources upfront, before any transcription.
  // This ensures vowel interpalatal detection knows about progressive palatalization.
  // Architecture per Kimi's spec: single source of truth for vowels AND consonants.
  //
  // Pass 1: Direct palatalization (consonants before front vowels/ь)
  // Pass 2: Regressive chain through consonant clusters
  // Pass 3: Progressive palatalization of р (Grayson p. 209, footnote 277)
  //
  // Returns a Map of character indices that should be palatalized.
  computeCompletePalatalizationMap(word: string, syllables: string[], stressIndex: number): Map<number, boolean> {
    const chars = [...word.toLowerCase()];
    const softIndices = new Map<number, boolean>(); // index -> true if should be palatalized

    // Compute syllable boundaries: which char indices are in each syllable
    const syllableBoundaries: Array<{ start: number; end: number; isStressed: boolean }> = [];
    let charPos = 0;
    syllables.forEach((syl, sylIdx) => {
      const start = charPos;
      const end = charPos + syl.length - 1;
      syllableBoundaries.push({
        start,
        end,
        isStressed: sylIdx === stressIndex
      });
      charPos += syl.length;
    });

    // Helper: check if character index is in the stressed syllable
    const isInStressedSyllable = (index: number): boolean => {
      const boundary = syllableBoundaries.find(b => index >= b.start && index <= b.end);
      return boundary ? boundary.isStressed : false;
    };

    // PASS 1: Mark directly palatalized consonants (before indicator letters or ь)
    for (let i = 0; i < chars.length; i++) {
      if (this.isConsonant(chars[i])) {
        if (this.isPalatalized(chars[i], chars[i + 1])) {
          softIndices.set(i, true);
        }
      }
    }

    // PASS 2: Process regressive palatalization right-to-left through clusters
    // Working backwards, check if palatalization can step through
    for (let i = chars.length - 2; i >= 0; i--) {
      const char = chars[i];
      const nextChar = chars[i + 1];

      if (!this.isConsonant(char)) continue;
      if (softIndices.has(i)) continue; // Already soft

      // Check if next consonant is soft
      const nextIsSoft = softIndices.has(i + 1);
      if (!nextIsSoft) continue;

      // Check for blockers (Grayson p. 209; D&P pp. 85-87)
      // р and л block regressive palatalization (confirmed by D&P)
      if (this.regressivePalatalizationBlockers.has(nextChar)) {
        continue; // Blocked - don't palatalize through р or л
      }

      // Check categorical restrictions (Grayson p. 209)
      if (!this.canRegressivelyPalatalize(char, nextChar)) {
        continue; // Categorical mismatch
      }

      // Check for boundaries
      if (this.alwaysHard.has(char)) continue; // ж, ш, ц never palatalize
      if (chars[i + 1] === 'ъ') continue; // Hard sign blocks (except в, с, з - handled separately)

      // This consonant can be regressively palatalized
      softIndices.set(i, true);
    }

    // PASS 3: Progressive palatalization of р (Grayson p. 209, footnote 277)
    // "Do not regressively palatalize /r/ within a cluster except...
    // directly following -и-, -е-, or -э- (in the stressed syllable only)"
    // Examples: смерть /sʲmʲerʲtʲ/, терпеть /tʲirʲˈpʲetʲ/, кирпич /kʲirʲˈpʲitʃʲ/
    // NOTE: Applies only when р is in a CLUSTER (followed by consonant).
    // Word-final р after front vowel does NOT palatalize: мир /mʲir/ not /mʲirʲ/
    const progressiveFrontVowels = new Set(['и', 'е', 'э']);

    for (let i = 0; i < chars.length; i++) {
      if (chars[i] !== 'р') continue;
      if (softIndices.has(i)) continue; // Already soft from Pass 1 or 2
      if (!isInStressedSyllable(i)) continue; // Must be in stressed syllable

      const prevChar = chars[i - 1];
      if (!prevChar || !progressiveFrontVowels.has(prevChar)) continue; // Must follow front vowel

      // Find what follows р (skip ь/ъ)
      let charAfterR: string | null = null;
      for (let j = i + 1; j < chars.length; j++) {
        if (chars[j] === 'ь' || chars[j] === 'ъ') continue;
        charAfterR = chars[j];
        break;
      }

      // Cluster requirement: р must be followed by a consonant
      if (charAfterR && this.isConsonant(charAfterR)) {
        softIndices.set(i, true); // Progressive palatalization
      }
    }

    return softIndices;
  },

  // Legacy wrapper for any code still calling the old function name
  analyzeRegressivePalatalization(word: string): Map<number, boolean> {
    // Fallback: treat as single stressed syllable (conservative)
    return this.computeCompletePalatalizationMap(word, [word], 0);
  },

  // Check if consonant can regressively palatalize before another consonant (Grayson p. 209)
  canRegressivelyPalatalize(consonant: string, triggerConsonant: string): boolean {
    const c = consonant?.toLowerCase();
    const tc = triggerConsonant?.toLowerCase();

    // Always-hard consonants never palatalize
    if (this.alwaysHard.has(c)) return false;

    // л: only regressively palatalizes when doubled (лль)
    // (Grayson p. 209 rule 1)
    if (c === 'л') {
      return tc === 'л'; // Only before another л
    }

    // р: never regressively palatalizes except when doubled (ррь)
    // (Grayson p. 209 rule 2; D&P pp. 85-87)
    // NOTE: Progressive palatalization (after front vowel in cluster) is handled separately
    if (c === 'р') {
      return tc === 'р'; // Only before another р
    }

    // н: only before palatalized н or dental (Grayson p. 209 rule 3)
    if (c === 'н') {
      return tc === 'н' || this.dentals.has(tc);
    }

    // Velars (к, г, х): only before palatalized velar (Grayson p. 209 rule 4)
    if (this.velars.has(c)) {
      return this.velars.has(tc);
    }

    // Labials (б, п, в, ф, м): only before palatalized labial (Grayson p. 209 rule 5)
    if (this.labials.has(c)) {
      return this.labials.has(tc);
    }

    // Dentals (т, д, с, з): only before palatalized dental (Grayson p. 209)
    // Dentals do NOT palatalize before labials (e.g., д before в in дверь stays hard)
    if (this.dentals.has(c)) {
      return this.dentals.has(tc);
    }

    // Others: can palatalize more freely
    return true;
  },

  // Check if a consonant at given index is palatalized (considering regressive)
  isConsonantPalatalized(word: string, index: number, softIndices?: Map<number, boolean>): boolean {
    if (softIndices && softIndices.has(index)) {
      return true;
    }
    const chars = [...word.toLowerCase()];
    return this.isPalatalized(chars[index], chars[index + 1]);
  },

  // Protected suffixes that must stay together as syllable units (Grayson p. 237-238)
  // Format: { cyrillic: 'suffix', placeholder: '◊' }
  // The placeholder replaces consonants, keeping the vowel visible for syllable counting
  protectedSuffixes: [
    { suffix: 'ться', consonants: 'ться', placeholder: '◊', vowelKept: 'я' }, // купаться
    { suffix: 'тся', consonants: 'тс', placeholder: '◊', vowelKept: 'я' },   // боится
  ],

  // Main syllabification entry point
  // Wraps the open-syllable logic with morphological exception handling
  syllabify(word: string): string[] {
    const cleanWord = word.replace(/[.,!?;:"""''–—]/g, '').toLowerCase();

    // STEP 1: Check for protected suffixes and replace with placeholders
    let processedWord = cleanWord;
    let activeProtection: any = null;

    for (const protection of this.protectedSuffixes) {
      if (cleanWord.endsWith(protection.suffix)) {
        // Replace the consonant portion with placeholder, keep vowel
        // e.g., "боится" → "бои◊я" (тс replaced with ◊, я kept)
        const suffixStart = cleanWord.length - protection.suffix.length;
        const beforeSuffix = cleanWord.slice(0, suffixStart);
        processedWord = beforeSuffix + protection.placeholder + protection.vowelKept;
        activeProtection = { ...protection, startIndex: suffixStart };
        break; // Only one suffix per word
      }
    }

    // STEP 2: Apply open-syllable rules to processed word
    const rawSyllables = this.syllabifyOpenSyllable(processedWord);

    // STEP 3: Restore protected suffix in final syllable
    if (activeProtection) {
      const lastIdx = rawSyllables.length - 1;
      // Replace placeholder+vowel back to original suffix
      rawSyllables[lastIdx] = rawSyllables[lastIdx].replace(
        activeProtection.placeholder + activeProtection.vowelKept,
        activeProtection.suffix
      );
    }

    return rawSyllables;
  },

  // Core open-syllable logic (Maximum Onset Principle)
  // This is the original syllabify, now renamed and called by the wrapper
  syllabifyOpenSyllable(word: string): string[] {
    const chars = [...word];
    const syllables: string[] = [];
    let current = '';

    for (let i = 0; i < chars.length; i++) {
      const char = chars[i];
      current += char;

      if (this.isVowel(char)) {
        let j = i + 1;
        // Advance through consonants AND soft/hard signs (they attach to consonants)
        while (j < chars.length && !this.isVowel(chars[j])) {
          j++;
        }

        // If we've reached the end of the word, attach all remaining chars to this syllable
        if (j >= chars.length) {
          current += chars.slice(i + 1).join('');
          syllables.push(current);
          break;
        }

        // We have consonants between this vowel and the next
        const cluster = chars.slice(i + 1, j);
        if (cluster.length === 0) {
          // No consonants between vowels (e.g., two vowels in a row)
          syllables.push(current);
          current = '';
        } else if (cluster.length === 1) {
          // Single consonant goes with next syllable (CV.CV pattern)
          syllables.push(current);
          current = '';
        } else {
          // Multiple consonants: keep last one for next syllable, rest stay with current
          // But soft/hard signs always stay with preceding consonant
          let splitPoint = cluster.length - 1;
          // If the last char is a soft/hard sign, move split point back
          while (splitPoint > 0 && (cluster[splitPoint] === 'ь' || cluster[splitPoint] === 'ъ')) {
            splitPoint--;
          }
          // Keep at least one consonant for the next syllable (unless it's all signs)
          if (splitPoint === cluster.length - 1) {
            splitPoint = Math.max(1, cluster.length - 1);
          }
          current += cluster.slice(0, splitPoint).join('');
          syllables.push(current);
          current = '';
          i = i + splitPoint;
        }
      }
    }

    if (current && !syllables.includes(current)) {
      syllables.push(current);
    }

    return syllables.length > 0 ? syllables : [word];
  },

  countVowels(word: string): number {
    return [...word.toLowerCase()].filter(c => this.isVowel(c)).length;
  },

  // Detect if word contains ё and return its syllable index
  // ё always carries stress in Russian — this is non-negotiable
  findYoSyllable(word: string): number {
    const cleanWord = word.replace(/[.,!?;:"""''–—]/g, '').toLowerCase();
    const syllables = this.syllabify(cleanWord);
    for (let i = 0; i < syllables.length; i++) {
      if (syllables[i].includes('ё')) {
        return i;
      }
    }
    return -1; // No ё found
  },

  // Check if word contains ё (for UI decisions)
  hasYo(word: string): boolean {
    const cleanWord = word.replace(/[.,!?;:"""''–—]/g, '').toLowerCase();
    return cleanWord.includes('ё');
  },

  getSyllablePosition(index: number, stressIndex: number, total: number): string {
    if (index === stressIndex) return 'stressed';
    if (stressIndex === -2) return 'stressed'; // Unknown stress: all vowels cardinal
    if (stressIndex === -1) return 'unstressed';
    if (index === stressIndex - 1) return 'pretonic';
    // Grayson p. 266, fn. 306: immediate post-tonic а stays /ɑ/ to distinguish from о
    if (index === stressIndex + 1) return 'posttonic-immediate';
    return 'remote';
  },

  // Transcribe vowel based on position and palatal context
  // Grayson Ch. 3: Fronting to [a] or [e] requires INTERPALATAL position
  // (sandwiched between two palatalized consonants or followed by й)
  transcribeVowel(
    vowel: string,
    position: string,
    isPrecededByPalatalized: boolean,
    isFollowedByPalatalized: boolean,
    precedingConsonant: string | null,
  ): string {
    vowel = vowel.toLowerCase();

    // Interpalatal = preceded by soft C AND followed by soft C (Grayson p. 207)
    // Note: For word-initial position, the /j/ glide counts as "preceded by soft"
    const isInterpalatal = isPrecededByPalatalized && isFollowedByPalatalized;

    // Always-hard consonants ж, ш, ц (Grayson p. 102-103)
    const isAfterAlwaysHard = ['ж', 'ш', 'ц'].includes(precedingConsonant as string);

    if (position === 'stressed') {
      // а → [a] only when interpalatal (Grayson p. 104)
      if (vowel === 'а') return isInterpalatal ? 'a' : 'ɑ';
      if (vowel === 'о') return 'o';

      // RULE B: -е- requires INTERPALATAL for [e] (Grayson p. 207)
      // "е and its cluster /jɛ/ shift to [e]/[je] when interpalatal
      // (between two palatalized consonants or palatalizing agents)"
      if (vowel === 'е') return isInterpalatal ? 'e' : 'ɛ';

      if (vowel === 'ё') return 'o';
      // и after ж/ш/ц → ɨ (Grayson p. 93-95)
      if (vowel === 'и') return isAfterAlwaysHard ? 'ɨ' : 'i';
      if (vowel === 'ы') return 'ɨ';
      if (vowel === 'у') return 'u';
      if (vowel === 'ю') return 'u';
      // я → [a] only when interpalatal (Grayson p. 104)
      if (vowel === 'я') return isInterpalatal ? 'a' : 'ɑ';

      // RULE A: -э- only checks FOLLOWING consonant for [e] (Grayson p. 207)
      // "-э- shifts from /ɛ/ to [e] when followed by a palatalized consonant"
      // (Note: -э- cannot follow soft consonants orthographically)
      if (vowel === 'э') return isFollowedByPalatalized ? 'e' : 'ɛ';
    } else if (position === 'pretonic') {
      if (vowel === 'а' || vowel === 'о') return 'ɑ';
      // е after ж/ш/ц → ɨ (Grayson p. 102-103)
      // Interpalatal: /ɪ/ fronts to /i/ (Grayson p. 125, Ch. 3.7)
      if (vowel === 'е') return isAfterAlwaysHard ? 'ɨ' : (isInterpalatal ? 'i' : 'ɪ');
      if (vowel === 'я' || vowel === 'э') return isInterpalatal ? 'i' : 'ɪ';
      // и after ж/ш/ц → ɨ (Grayson p. 102)
      if (vowel === 'и') return isAfterAlwaysHard ? 'ɨ' : 'i';
      if (vowel === 'ы') return 'ɨ';
      if (vowel === 'у' || vowel === 'ю') return 'u';
    } else if (position === 'posttonic-immediate') {
      // Grayson p. 266, footnote 306: "This guide suggests that -а- in
      // the immediate-post-stress position be read as /ɑ/ in order to
      // aurally differentiate from words that have the letter -о- in
      // the same position."
      // Example: блюдa /ˈblʲu dɑ/ (platters) vs блюдо /ˈblʲu dʌ/ (a platter)
      if (vowel === 'а') return 'ɑ';
      if (vowel === 'я') return 'ɑ';  // я follows а pattern (underlying /ja/)
      if (vowel === 'о') return 'ʌ';
      // Other vowels follow remote patterns
      // Interpalatal: /ɪ/ fronts to /i/ (Grayson p. 125, Ch. 3.7)
      if (vowel === 'е') return isAfterAlwaysHard ? 'ɨ' : (isInterpalatal ? 'i' : 'ɪ');
      if (vowel === 'э') return isInterpalatal ? 'i' : 'ɪ';
      if (vowel === 'и') return isAfterAlwaysHard ? 'ɨ' : 'i';
      if (vowel === 'ы') return 'ɨ';
      if (vowel === 'у' || vowel === 'ю') return 'u';
    } else {
      // Remote unstressed positions (Grayson p. 109-112)
      if (vowel === 'а') return 'ʌ';
      if (vowel === 'о') return 'ʌ';
      // е after ж/ш/ц → ɨ (Grayson p. 102-103)
      // Interpalatal: /ɪ/ fronts to /i/ (Grayson p. 125, Ch. 3.7)
      if (vowel === 'е') return isAfterAlwaysHard ? 'ɨ' : (isInterpalatal ? 'i' : 'ɪ');
      if (vowel === 'я' || vowel === 'э') return isInterpalatal ? 'i' : 'ɪ';
      // и after ж/ш/ц → ɨ (Grayson p. 102)
      if (vowel === 'и') return isAfterAlwaysHard ? 'ɨ' : 'i';
      if (vowel === 'ы') return 'ɨ';
      if (vowel === 'у' || vowel === 'ю') return 'u';
    }

    return vowel;
  },

  transcribeConsonant(
    consonant: string,
    nextChar: string | undefined,
    prevChar: string | undefined,
    isStressedSyllable: boolean,
    isSoftFromRegressive: boolean = false,
    nextCharInWord: string | null = null,
  ): string {
    consonant = consonant.toLowerCase();
    prevChar = prevChar?.toLowerCase();
    // Combine direct palatalization with regressive palatalization analysis
    const softDirect = this.isPalatalized(consonant, nextChar);
    const soft = softDirect || isSoftFromRegressive;
    const base = this.inventory.consonants[consonant] || consonant;

    // Progressive palatalization of р (Grayson p. 209, footnote 277)
    // "Do not regressively palatalize /r/ within a cluster except...
    // directly following -и-, -е-, or -э- (in the stressed syllable only)"
    // Examples: смерть /sʲmʲerʲtʲ/, терпеть /tʲirʲˈpʲetʲ/, кирпич /kʲirʲˈpʲitʃʲ/
    // NOTE: This applies only when р is IN A CLUSTER (followed by consonant)
    // Word-final р after front vowel does NOT palatalize: мир /mʲir/ not /mʲirʲ/
    // v5.11.21: Use nextCharInWord to check across syllable boundaries
    if (consonant === 'р' && isStressedSyllable) {
      const frontVowels = ['и', 'е', 'э'];
      // Check both syllable-local nextChar AND word-level nextCharInWord
      const effectiveNextChar = nextChar || nextCharInWord;
      const nextIsConsonant = effectiveNextChar && this.consonants.has(effectiveNextChar.toLowerCase());
      if (frontVowels.includes(prevChar as string) && nextIsConsonant) {
        return 'rʲ'; // Progressive palatalization in cluster only
      }
    }

    if (consonant === 'л') {
      return soft ? 'lʲ' : 'ɫ';
    }
    if (consonant === 'н' && soft) {
      return 'ɲ';
    }

    if (soft && !this.alwaysSoft.has(consonant)) {
      return base + 'ʲ';
    }

    return base;
  },

  // Final consonant devoicing (Grayson Ch. 4 Sec. 4, pp. 199-202)
  // "In Russian, as in German, final consonants are generally unvoiced,
  // regardless of spelling. This does not apply to sonorants."
  voicedToVoiceless: Object.freeze({
    'b': 'p',    // б → п (p. 199-200)
    'bʲ': 'pʲ',  // бь → пь
    'v': 'f',    // в → ф (p. 200)
    'vʲ': 'fʲ',  // вь → фь
    'd': 't',    // д → т (p. 201)
    'dʲ': 'tʲ',  // дь → ть
    'ɡ': 'k',    // г → к (p. 201) — note: гь does not occur
    'z': 's',    // з → с (p. 202)
    'zʲ': 'sʲ',  // зь → сь
    'ʒ': 'ʃ'     // ж → ш (p. 202) — ж never palatalizes, so жь also → ш
  } as Record<string, string>),

  // Reverse mapping for voicing (voiceless → voiced)
  voicelessToVoiced: Object.freeze({
    'p': 'b',    // п → б
    'pʲ': 'bʲ',  // пь → бь
    'f': 'v',    // ф → в
    'fʲ': 'vʲ',  // фь → вь
    't': 'd',    // т → д
    'tʲ': 'dʲ',  // ть → дь
    'k': 'ɡ',    // к → г
    's': 'z',    // с → з
    'sʲ': 'zʲ',  // сь → зь
    'ʃ': 'ʒ'     // ш → ж
  } as Record<string, string>),

  // Sets for classification (Grayson Ch. 6 Sec. 1, pp. 213-214)
  // Sonorants: "do not influence the voicing of preceding, unvoiced consonants
  // and are never devoiced themselves in lyric diction"
  sonorantIPA: new Set(['ɫ', 'lʲ', 'm', 'mʲ', 'n', 'nʲ', 'ɲ', 'r', 'rʲ', 'j']),

  // Voiced obstruents (can trigger voicing of preceding consonants)
  voicedObstruents: new Set(['b', 'bʲ', 'd', 'dʲ', 'ɡ', 'z', 'zʲ', 'ʒ']),

  // Voiceless obstruents (can trigger devoicing of preceding consonants)
  voicelessObstruents: new Set(['p', 'pʲ', 't', 'tʲ', 'k', 's', 'sʲ', 'ʃ', 'x', 'ts', 'tʃ', 'ʃtʃ']),

  // /v/ phonemes: "has no assimilative voicing influence of its own,
  // but is influenced by most other consonants" (Grayson p. 214)
  vPhonemes: new Set(['v', 'vʲ', 'f', 'fʲ']),

  // Regressive voicing assimilation within words (Grayson Ch. 6 Sec. 1, pp. 214-224)
  // "The baseline approach to consonant clusters in Russian is to pronounce each
  // consonant member in the cluster and to determine the voicing of all the
  // consonants based upon the status of the last member of the cluster."
  applyRegressiveVoicing(ipa: string): string {
    // Parse IPA into segments (consonants may be multi-char like tʃ, ʃtʃ, or have ʲ)
    const segments = this.parseIPASegments(ipa);
    if (segments.length < 2) return ipa;

    // Process clusters: find sequences of consonants
    // Note: stress marks (ˈ) can appear mid-cluster and must be preserved
    const result: string[] = [];
    let i = 0;

    while (i < segments.length) {
      const seg = segments[i];

      // If it's a vowel, just add it
      if (this.isIPAVowel(seg)) {
        result.push(seg);
        i++;
        continue;
      }

      // If it's a stress mark at start (before any consonant), just add it
      if (seg === 'ˈ') {
        result.push(seg);
        i++;
        continue;
      }

      // Found a consonant - collect the cluster (including any stress marks)
      const cluster: string[] = [seg];
      const stressPositions: number[] = []; // Track where stress marks appear in cluster
      let j = i + 1;
      while (j < segments.length && !this.isIPAVowel(segments[j])) {
        if (segments[j] === 'ˈ') {
          // Record position and skip for now (will reinsert after assimilation)
          stressPositions.push(cluster.length);
        } else {
          cluster.push(segments[j]);
        }
        j++;
      }

      // Apply voicing assimilation to this cluster (consonants only)
      let assimilated = cluster;
      if (cluster.length > 1) {
        assimilated = this.assimilateClusterVoicing(cluster);
      }

      // Reinsert stress marks at their original positions
      for (let k = stressPositions.length - 1; k >= 0; k--) {
        assimilated.splice(stressPositions[k], 0, 'ˈ');
      }

      result.push(...assimilated);
      i = j;
    }

    return result.join('');
  },

  // Parse IPA string into segments (handling multi-char consonants)
  parseIPASegments(ipa: string): string[] {
    const segments: string[] = [];
    let i = 0;

    while (i < ipa.length) {
      // Check for multi-char consonants first (longest match)
      if (ipa.slice(i, i + 3) === 'ʃtʃ') {
        segments.push('ʃtʃ');
        i += 3;
      } else if (ipa.slice(i, i + 2) === 'tʃ') {
        segments.push('tʃ');
        i += 2;
      } else if (ipa.slice(i, i + 2) === 'ts') {
        segments.push('ts');
        i += 2;
      } else if (ipa[i + 1] === 'ʲ' && ipa[i + 2] === 'ː') {
        // Consonant + palatalization + length (e.g., ʃʲː)
        segments.push(ipa.slice(i, i + 3));
        i += 3;
      } else if (ipa[i + 1] === 'ʲ') {
        // Consonant + palatalization marker
        segments.push(ipa.slice(i, i + 2));
        i += 2;
      } else if (ipa[i + 1] === 'ː') {
        // Consonant + length marker (e.g., ʃː, ʒː)
        segments.push(ipa.slice(i, i + 2));
        i += 2;
      } else {
        segments.push(ipa[i]);
        i++;
      }
    }

    return segments;
  },

  // Check if IPA segment is a vowel
  isIPAVowel(seg: string): boolean {
    const ipaVowels = new Set(['ɑ', 'a', 'o', 'ɛ', 'e', 'i', 'ɪ', 'ɨ', 'u', 'ʊ', 'ʌ']);
    return ipaVowels.has(seg);
  },

  // Assimilate voicing within a consonant cluster (Grayson p. 214-215)
  // "the voicing of the entire cluster is that of the final member"
  assimilateClusterVoicing(cluster: string[]): string[] {
    // Find the last non-sonorant, non-/v/ consonant - this is the "agent"
    let agentIndex = -1;
    for (let i = cluster.length - 1; i >= 0; i--) {
      const seg = cluster[i];
      if (this.sonorantIPA.has(seg)) continue;
      if (this.vPhonemes.has(seg)) continue;
      agentIndex = i;
      break;
    }

    // No agent found (all sonorants or /v/) - no assimilation
    if (agentIndex === -1) return cluster;

    const agent = cluster[agentIndex];
    const agentIsVoiced = this.voicedObstruents.has(agent);

    // Apply voicing/devoicing backwards from agent — sonorants block the chain
    const result = [...cluster];
    for (let i = agentIndex - 1; i >= 0; i--) {
      const seg = result[i];

      // Sonorants block assimilation — stop here (Grayson p. 213-214)
      if (this.sonorantIPA.has(seg)) break;

      if (agentIsVoiced) {
        // Voice the consonant if it's voiceless
        if (this.voicelessToVoiced[seg]) {
          result[i] = this.voicelessToVoiced[seg];
        }
      } else {
        // Devoice the consonant if it's voiced
        if (this.voicedToVoiceless[seg]) {
          result[i] = this.voicedToVoiceless[seg];
        }
      }
    }

    return result;
  },

  // Apply final devoicing to IPA string
  applyFinalDevoicing(ipa: string): string {
    // Find the final consonant segment (may include palatalization marker)
    // Sonorants (ɫ, lʲ, m, mʲ, n, ɲ, r, rʲ, j) are never devoiced
    const sonorantPattern = /[ɫmnrj]ʲ?$/;
    if (sonorantPattern.test(ipa)) {
      return ipa; // Sonorants don't devoice
    }

    // Remove any trailing spaces for matching
    const trimmedIpa = ipa.trimEnd();

    // Check for voiced consonants at end and replace
    for (const [voiced, voiceless] of Object.entries(this.voicedToVoiceless)) {
      if (trimmedIpa.endsWith(voiced)) {
        return trimmedIpa.slice(0, -voiced.length) + voiceless;
      }
    }

    return ipa;
  },

  transcribe(
    word: string,
    stressIndex: number = -1,
    isClitic: boolean = false,
    procliticPosition: ProcliticPosition = null,
    config: EngineConfig = DEFAULT_ENGINE_CONFIG,
  ): TranscriptionResult {
    const cleanWord = word.replace(/[.,!?;:"""''–—]/g, '').toLowerCase();

    // Check for isolated clitic — use canonical form from registry
    // (Phrase-context clitics have procliticPosition set by the caller)
    const cliticInfo = this.cliticData.get(cleanWord);
    if (cliticInfo && isClitic && !procliticPosition && this.countVowels(cleanWord) === 0) {
      // Return canonical citation form for isolated clitic
      return {
        ipa: cliticInfo.canonicalIpa,
        ipaUnderlying: cliticInfo.canonicalIpa,
        syllables: [{
          cyrillic: cleanWord,
          ipa: cliticInfo.canonicalIpa,
          isStressed: false
        }],
        transcriptionLog: [{
          char: cleanWord,
          ipa: cliticInfo.canonicalIpa,
          features: {
            type: 'consonant' as const,
            source: 'isolated-clitic',
            note: 'Canonical citation form — contextual pronunciation varies'
          },
          syllableIndex: 0,
          position: 0
        }],
        source: 'isolated-clitic'
      };
    }

    const syllables = this.syllabify(cleanWord);
    const vowelCount = this.countVowels(cleanWord);

    // Find special clusters (e.g., сч → /ʃʲʃʲ/)
    const specialClusters = this.findSpecialClusters(cleanWord);

    // ё always carries stress — override any other stress assignment
    const yoSyllable = this.findYoSyllable(cleanWord);
    let effectiveStress: number;
    if (yoSyllable !== -1) {
      // ё found: stress is locked to that syllable
      effectiveStress = yoSyllable;
    } else if (vowelCount === 1 && !isClitic) {
      // Monosyllable (non-clitic): stress on only syllable
      effectiveStress = 0;
    } else {
      // Normal case: use provided stress index
      effectiveStress = stressIndex;
    }

    // Compute COMPLETE palatalization map for the whole word (Grayson p. 207-209)
    // This includes regressive AND progressive palatalization (for р after front vowels)
    // Architecture: single source of truth computed BEFORE any transcription
    const softIndices = this.computeCompletePalatalizationMap(cleanWord, syllables, effectiveStress);

    // Build a map of character position in full word to track palatalization
    let charIndexInWord = 0;

    let ipa = '';
    const syllableData: SyllableData[] = [];
    const transcriptionLog: TranscriptionLogEntry[] = [];

    syllables.forEach((syl, sylIdx) => {
      // For proclitics with host-stress-aware reduction, use procliticPosition
      // This overrides the default 'unstressed' position for accurate vowel reduction
      let position: string;
      if (isClitic && procliticPosition) {
        position = procliticPosition.type;  // 'pretonic' or 'remote' based on host word stress
      } else {
        position = this.getSyllablePosition(sylIdx, effectiveStress, syllables.length);
      }
      let sylIpa = '';
      const chars = [...syl];

      // v5.11.45: Always add stress mark for stressed syllables
      // Previously only polysyllables got marks in underlying IPA, causing
      // monosyllables to lose their mark after cross-word assimilation
      if (position === 'stressed' && effectiveStress >= 0) {
        sylIpa += 'ˈ';
      }

      for (let i = 0; i < chars.length; i++) {
        const char = chars[i];
        const nextChar = chars[i + 1];
        const globalIndex = charIndexInWord + i; // Position in full word

        // Log soft/hard signs before skipping
        if (char === 'ь' || char === 'ъ') {
          transcriptionLog.push({
            char: char,
            ipa: '',  // Signs produce no sound of their own (v5.11.1)
            features: {
              type: 'sign' as any,
              signType: char === 'ь' ? 'soft' : 'hard',
              silent: true  // Mark as silent for ribbon display
            },
            syllableIndex: sylIdx,
            position: globalIndex
          });
          continue;
        }

        // Check if this character is part of a special cluster
        const clusterInfo = specialClusters.find(c =>
          globalIndex >= c.startIndex && globalIndex <= c.endIndex
        );

        if (clusterInfo) {
          // First char of cluster outputs the IPA and logs the cluster
          if (globalIndex === clusterInfo.startIndex) {
            sylIpa += clusterInfo.ipa;

            transcriptionLog.push({
              char: clusterInfo.cluster,
              ipa: clusterInfo.ipa,
              features: {
                type: 'cluster',
                clusterChars: clusterInfo.cluster.length
              },
              syllableIndex: sylIdx,
              position: globalIndex
            });
          }
          continue;
        }

        if (this.isVowel(char)) {
          const prevCharInSyllable = chars[i - 1];
          // Use word-level previous char for j-glide and interpalatal detection
          const prevCharInWord = cleanWord[globalIndex - 1];

          // Standard j-glide: iotated vowels at word-initial or after vowel/ъ/ь
          let needsGlide = ['е', 'ё', 'ю', 'я'].includes(char) &&
                           (globalIndex === 0 || this.isVowel(prevCharInWord) || prevCharInWord === 'ь' || prevCharInWord === 'ъ');

          // EXCEPTION: -ии suffix (Grayson p. 89, 120)
          // The suffix -ии is pronounced /i ji/ for singing clarity.
          // This is an exception to the rule that и after vowels doesn't get a j-glide.
          // Example: странствии → /ˈstrɑnst vʲi ji/, в здании → /v ˈzdɑ ɲi ji/
          const isIiSuffix = char === 'и' && prevCharInWord === 'и' && globalIndex === cleanWord.length - 1;
          if (isIiSuffix) {
            needsGlide = true;
          }

          // Add j-glide to IPA and log it
          if (needsGlide) {
            sylIpa += 'j';

            // Determine j-glide source for ribbon display
            let jGlideSource = 'iotated';  // default: iotated vowel
            if (isIiSuffix) {
              jGlideSource = 'ii-suffix';
            } else if (prevCharInWord === 'ь') {
              jGlideSource = 'after-sign';
            } else if (prevCharInWord === 'ъ') {
              jGlideSource = 'after-sign';
            } else if (this.isVowel(prevCharInWord)) {
              jGlideSource = 'after-vowel';
            } else if (globalIndex === 0) {
              jGlideSource = 'word-initial';
            }

            // Log j-glide for Phoneme Ribbon
            transcriptionLog.push({
              char: '',  // No Cyrillic character - it's implicit
              ipa: 'j',
              features: {
                type: 'glide',
                source: jGlideSource,
                triggeredBy: char  // The vowel that triggered the glide
              },
              syllableIndex: sylIdx,
              position: globalIndex - 0.5  // Position between prev and current char
            });
          }

          // Initialize vowel tracking
          let vowelIpa: string | null = null;
          const vowelFeatures: any = {
            type: 'vowel',
            position: position,
            interpalatal: false,
            afterHard: false,
            exception: null
          };

          // Check for exception word vowel override
          const vowelOverride = this.getVowelOverride(cleanWord, globalIndex);
          if (vowelOverride !== null) {
            vowelIpa = vowelOverride;
            vowelFeatures.exception = 'word-override';
          }

          // Check for -ая/-яя suffix exception (Grayson p. 124)
          // These endings are ALWAYS /ɑjɑ/, never reduced
          if (vowelIpa === null && this.isAyaSuffixVowel(cleanWord, globalIndex)) {
            vowelIpa = 'ɑ';
            vowelFeatures.exception = 'aya-suffix';
          }

          // Check for Old Muscovite velar adjectival suffix -кий/-гий/-хий (Grayson p. 301-303)
          // When config adjectival='stage': и → [ɨ] after hard velar
          const velarAdj = this.checkVelarAdjectival(cleanWord, globalIndex);
          if (vowelIpa === null && velarAdj.isVelarAdjectival && velarAdj.charRole === 'i' && config.adjectival === 'stage') {
            vowelIpa = 'ɨ';
            vowelFeatures.exception = 'velar-adjectival';
          }

          // Normal vowel transcription (if no exception applied)
          if (vowelIpa === null) {
            // Check preceding consonant palatalization (using regressive analysis)
            // Use word-level previous char, not within-syllable
            const prevConsonant = this.isConsonant(prevCharInWord) ? prevCharInWord : null;
            const prevGlobalIndex = globalIndex - 1;

            // Check if preceded by a special cluster (for interpalatal)
            const prevCluster = specialClusters.find(c => c.endIndex === prevGlobalIndex);

            // Iotated vowels at word-initial or after vowel/ъ/ь produce /j/ glide
            // The /j/ glide counts as a palatalizing agent (Grayson p. 125)
            const iotatedVowels = ['е', 'ё', 'ю', 'я'];
            const isIotated = iotatedVowels.includes(char);
            const isWordInitialOrAfterVowel = globalIndex === 0 ||
              this.isVowel(prevCharInWord) || prevCharInWord === 'ъ' || prevCharInWord === 'ь';
            const precededByJGlide = isIotated && isWordInitialOrAfterVowel;

            const isPrecededByPal = prevCluster ?
              prevCluster.ipa.includes('ʲ') :
              (prevConsonant ?
                (softIndices.has(prevGlobalIndex) || this.isPalatalized(prevConsonant, char)) :
                precededByJGlide);  // Word-initial iotated → preceded by /j/

            // Check following consonant palatalization (Grayson p. 104, 106: interpalatal requires BOTH)
            // Find the next consonant after this vowel - must search in FULL WORD, not just current syllable
            let followingConsonant: string | null = null;
            let followingConsonantGlobalIndex = -1;
            let charAfterFollowingC: string | null = null;
            const wordChars = [...cleanWord];
            for (let j = globalIndex + 1; j < wordChars.length; j++) {
              if (wordChars[j] === 'ь' || wordChars[j] === 'ъ') continue;
              if (this.isConsonant(wordChars[j])) {
                followingConsonant = wordChars[j];
                followingConsonantGlobalIndex = j;
                charAfterFollowingC = wordChars[j + 1] || null;
                break;
              }
              if (this.isVowel(wordChars[j])) break; // Hit another vowel first
            }

            // Check if the following consonant is part of a special cluster
            // If so, check the cluster's IPA for palatalization, not the Cyrillic letter
            const followingCluster = followingConsonant ?
              specialClusters.find(c =>
                followingConsonantGlobalIndex >= c.startIndex &&
                followingConsonantGlobalIndex <= c.endIndex
              ) : null;

            let isFollowedByPal = false;
            if (followingConsonant === 'й') {
              // й always counts as palatalized
              isFollowedByPal = true;
            } else if (followingCluster) {
              // Check the cluster's IPA output for palatalization
              // e.g., чн→/ʃn/ starts with /ʃ/ which is hard (no ʲ at start)
              // But сч→/ʃʲʃʲ/ starts with /ʃʲ/ which is soft
              const clusterIPA = followingCluster.ipa;
              // The first sound in the cluster is what follows the vowel
              isFollowedByPal = clusterIPA.length > 1 && clusterIPA[1] === 'ʲ';
            } else if (followingConsonant) {
              // Normal case: check the Cyrillic consonant
              isFollowedByPal = softIndices.has(followingConsonantGlobalIndex) ||
                this.isPalatalized(followingConsonant, charAfterFollowingC as string | undefined);
            } else {
              // No following consonant found - check if next vowel is iotated
              // Iotated vowels (е, ё, ю, я) produce /j/ glide which is a palatalizing agent
              // This handles cases like её where /j/-[vowel]-/j/ is interpalatal
              const iotatedV = ['е', 'ё', 'ю', 'я'];
              for (let j = globalIndex + 1; j < wordChars.length; j++) {
                if (wordChars[j] === 'ь' || wordChars[j] === 'ъ') continue;
                if (this.isVowel(wordChars[j])) {
                  isFollowedByPal = iotatedV.includes(wordChars[j]);
                  break;
                }
                if (this.isConsonant(wordChars[j])) break;
              }
            }

            // Capture interpalatal and afterHard features
            const prevConsonantForFeatures = this.isConsonant(prevCharInWord) ? prevCharInWord : null;
            vowelFeatures.interpalatal = isPrecededByPal && isFollowedByPal && prevCharInWord !== 'ъ';
            vowelFeatures.afterHard = ['ж', 'ш', 'ц'].includes(prevConsonantForFeatures as string);

            vowelIpa = this.transcribeVowel(char, position, isPrecededByPal, isFollowedByPal, prevConsonantForFeatures);
          }

          sylIpa += vowelIpa;

          // Populate transcriptionLog for vowel
          transcriptionLog.push({
            char: char,
            ipa: vowelIpa!,
            features: vowelFeatures,
            syllableIndex: sylIdx,
            position: globalIndex
          });
        } else if (this.isConsonant(char)) {
          const prevChar = chars[i - 1];
          const nextCharInWord = cleanWord[globalIndex + 1] || null; // For cross-syllable checks
          const isStressedSyl = (position === 'stressed');
          // Pass regressive palatalization info
          const isSoftFromRegressive = softIndices.has(globalIndex);

          // Check for Old Muscovite velar adjectival suffix -кий/-гий/-хий (Grayson p. 301-303)
          // When config adjectival='stage': velar stays HARD (not palatalized)
          const velarAdj = this.checkVelarAdjectival(cleanWord, globalIndex);

          // Check for genitive ending -ого/-его: г → /v/ (Grayson p. 243)
          const isGenitiveG = (char === 'г') && this.checkGenitiveEnding(cleanWord, globalIndex);

          let consonantIpa: string;
          if (isGenitiveG) {
            // Genitive г → /v/
            consonantIpa = 'v';
          } else if (velarAdj.isVelarAdjectival && velarAdj.charRole === 'velar' && config.adjectival === 'stage') {
            // Force hard velar: output base consonant without palatalization
            consonantIpa = this.inventory.consonants[char] || char;
          } else {
            consonantIpa = this.transcribeConsonant(char, nextChar, prevChar, isStressedSyl, isSoftFromRegressive, nextCharInWord);
          }
          sylIpa += consonantIpa;

          // Populate transcriptionLog for consonant
          const isSoft = consonantIpa.includes('ʲ') || consonantIpa === 'ɲ';
          let softTrigger: string | null = null;
          if (isSoft) {
            // Priority: direct triggers first, then regressive
            // A consonant before a front vowel is soft because of the vowel, not regressive assimilation
            if (nextChar === 'ь') {
              softTrigger = 'ь';
            } else if (['е', 'ё', 'ю', 'я', 'и'].includes(nextChar)) {
              softTrigger = nextChar;
            } else if (isSoftFromRegressive) {
              softTrigger = 'regressive';
            }
          }

          transcriptionLog.push({
            char: char,
            ipa: consonantIpa,
            features: {
              type: 'consonant',
              soft: isSoft,
              softTrigger: softTrigger,
              genitiveEnding: isGenitiveG
            },
            syllableIndex: sylIdx,
            position: globalIndex
          });
        }
      }

      charIndexInWord += syl.length;

      syllableData.push({
        cyrillic: syl,
        ipa: sylIpa.replace(/^ˈ/, ''),
        isStressed: position === 'stressed' && effectiveStress >= 0
      });

      ipa += sylIpa;
    });

    // Step 2 (Grayson p. 247): Apply regressive voicing assimilation
    ipa = this.applyRegressiveVoicing(ipa);

    // Sync syllable IPAs with word-level assimilation (v5.10.20)
    // Cross-syllable clusters (e.g., кз in вок-зал) are only caught at word level
    // Re-split the assimilated word IPA back into syllables
    const assimilatedSegments = this.parseIPASegments(ipa.replace(/ˈ/g, ''));
    let segmentIdx = 0;
    syllableData.forEach(syl => {
      // Count how many segments this syllable originally had
      const originalSegments = this.parseIPASegments(syl.ipa);
      const segmentCount = originalSegments.length;

      // Extract that many segments from the assimilated word
      const newSegments = assimilatedSegments.slice(segmentIdx, segmentIdx + segmentCount);
      syl.ipa = newSegments.join('');
      segmentIdx += segmentCount;
    });

    // Sync transcriptionLog to match surface IPA after voicing assimilation (v5.10.20)
    // The log was built before assimilation, so consonant entries may have stale IPA
    transcriptionLog.forEach(entry => {
      if (entry.features?.type === 'consonant') {
        const originalIpa = entry.ipa;
        // Check if this consonant was devoiced
        if (this.voicedToVoiceless[originalIpa]) {
          // Look at what's in the syllable data to see if it changed
          const sylData = syllableData[entry.syllableIndex];
          if (sylData && !sylData.ipa.includes(originalIpa)) {
            // The original voiced consonant is not in the syllable anymore
            // Check if the devoiced version is there
            const devoiced = this.voicedToVoiceless[originalIpa];
            if (sylData.ipa.includes(devoiced)) {
              entry.ipa = devoiced;
              entry.features.voicingAssimilation = true;
              entry.features.devoiced = true;
            }
          }
        }
        // Check if this consonant was voiced
        if (this.voicelessToVoiced[originalIpa]) {
          const sylData = syllableData[entry.syllableIndex];
          if (sylData && !sylData.ipa.includes(originalIpa)) {
            const voiced = this.voicelessToVoiced[originalIpa];
            if (sylData.ipa.includes(voiced)) {
              entry.ipa = voiced;
              entry.features.voicingAssimilation = true;
              entry.features.voiced = true;
            }
          }
        }
      }
    });

    // Final consonant devoicing (Grayson Ch. 4 Sec. 4, pp. 199-202)
    // For clitics, devoicing is deferred to cross-word stage (boundary-dependent)
    // For standalone words, apply devoicing now
    let ipaSurface = ipa;
    if (!isClitic) {
      // Exception: бог → /box/ (Grayson p. 242) — г becomes /x/ not /k/
      // This is a Church Slavonic preservation
      if (cleanWord === 'бог' && ipa.endsWith('ɡ')) {
        ipaSurface = ipa.slice(0, -1) + 'x';
        // Update syllable data to show /x/ not /ɡ/
        const lastSyl = syllableData[syllableData.length - 1];
        if (lastSyl && lastSyl.ipa.endsWith('ɡ')) {
          lastSyl.ipa = lastSyl.ipa.slice(0, -1) + 'x';
        }
        // Update transcriptionLog for the final г
        const lastConsonantEntry = [...transcriptionLog].reverse().find(e => e.char === 'г');
        if (lastConsonantEntry) {
          lastConsonantEntry.ipa = 'x';
          lastConsonantEntry.features.bogException = true;
          lastConsonantEntry.features.finalDevoicing = false; // Not standard devoicing
        }
      } else {
        ipaSurface = this.applyFinalDevoicing(ipa);
      }
    }

    return { ipa: ipaSurface, ipaUnderlying: ipa, syllables: syllableData, transcriptionLog };
  },

  /**
   * Auto-detect boundary types for a line of words.
   * Called after initial transcription, before cross-word assimilation.
   *
   * Rules (in priority order):
   * 1. User-set boundaries are never overwritten
   * 2. Final word → always 'hard'
   * 3. Punctuation after word → 'hard'
   * 4. Current word is proclitic → 'clitic'
   * 5. Next word is enclitic → 'clitic'
   * 6. Otherwise → 'soft' (assimilation happens automatically)
   */
  autoDetectBoundaries(words: BoundaryWord[]): void {
    const punctuationRegex = /[.,!?;:"""''–—]$/;

    words.forEach((word, i) => {
      // Rule 1: Preserve user-set boundaries
      if (word.boundarySource === 'user') return;

      const isLastWord = (i === words.length - 1);
      const cleanWord = word.cyrillic.replace(/[.,!?;:"""''–—]/g, '').toLowerCase();
      const hasPunctuation = punctuationRegex.test(word.cyrillic);
      const isProclitic = this.proclitics.has(cleanWord);

      // Check if next word is enclitic
      const nextWord = words[i + 1];
      const nextCleanWord = nextWord
        ? nextWord.cyrillic.replace(/[.,!?;:"""''–—]/g, '').toLowerCase()
        : null;
      const nextIsEnclitic = nextCleanWord ? this.enclitics.has(nextCleanWord) : false;

      // Apply rules in priority order
      if (isLastWord) {
        word.rightBoundary = 'hard';
        word.boundarySource = 'auto';
      } else if (hasPunctuation) {
        word.rightBoundary = 'hard';
        word.boundarySource = 'punctuation';
      } else if (isProclitic) {
        word.rightBoundary = 'clitic';
        word.boundarySource = 'auto';
      } else if (nextIsEnclitic) {
        word.rightBoundary = 'clitic';
        word.boundarySource = 'auto';
      } else {
        // Default: SOFT — assimilation happens automatically
        // User can insert barriers when music has rests
        word.rightBoundary = 'soft';
        word.boundarySource = 'auto';
      }
    });
  },

  // --- CROSS-WORD BOUNDARY ASSIMILATION — Grayson p. 248-257 ---
  // Voiceless → Voiced (for cross-boundary voicing)
  crossWordVoicingMap: {
    'p': 'b', 'pʲ': 'bʲ',
    'f': 'v', 'fʲ': 'vʲ',
    't': 'd', 'tʲ': 'dʲ',
    's': 'z', 'sʲ': 'zʲ',
    'ʃ': 'ʒ',
    'k': 'ɡ', 'kʲ': 'ɡʲ',
    'x': 'ɣ', 'xʲ': 'ɣʲ',      // Cross-boundary allophone
    'ts': 'dz',                 // Cross-boundary allophone
    'tʃʲ': 'dʒʲ'                // Cross-boundary allophone
  } as Record<string, string>,

  // Voiced → Voiceless (for cross-boundary devoicing)
  crossWordDevoicingMap: {
    'b': 'p', 'bʲ': 'pʲ',
    'v': 'f', 'vʲ': 'fʲ',
    'd': 't', 'dʲ': 'tʲ',
    'z': 's', 'zʲ': 'sʲ',
    'ʒ': 'ʃ',
    'ɡ': 'k', 'ɡʲ': 'kʲ',
    'g': 'k', 'gʲ': 'kʲ'        // Handle both ɡ and g
  } as Record<string, string>,

  // Consonant sets for cross-word assimilation
  crossWordVoicelessSet: new Set(['p', 'pʲ', 'f', 'fʲ', 't', 'tʲ', 's', 'sʲ', 'ʃ', 'ʃʲ', 'k', 'kʲ', 'x', 'xʲ', 'ts', 'tʃʲ', 'ʃʲʃʲ']),
  crossWordVoicedObstruentSet: new Set(['b', 'bʲ', 'd', 'dʲ', 'g', 'gʲ', 'ɡ', 'ɡʲ', 'z', 'zʲ', 'ʒ', 'ʒʲ']),
  crossWordSonorantSet: new Set(['m', 'mʲ', 'n', 'nʲ', 'ɲ', 'l', 'lʲ', 'ɫ', 'r', 'rʲ', 'j']),
  crossWordVSet: new Set(['v', 'vʲ']),

  /**
   * Extract final consonant(s) from IPA string.
   * Returns null if word ends in vowel.
   */
  getFinalConsonant(ipa: string): string | null {
    // Remove stress marks first
    const clean = ipa.replace(/[ˈˌ]/g, '');
    // Match final consonant cluster (including affricates and palatalization)
    // Order matters: try longer sequences first
    const patterns = [
      'ʃʲʃʲ', 'tʃʲ', 'dʒʲ', 'ts', 'dz',  // Affricates
      'bʲ', 'pʲ', 'vʲ', 'fʲ', 'dʲ', 'tʲ', 'gʲ', 'ɡʲ', 'kʲ', 'zʲ', 'sʲ', 'ʒʲ', 'ʃʲ', 'xʲ', 'mʲ', 'nʲ', 'lʲ', 'rʲ',  // Palatalized
      'b', 'p', 'v', 'f', 'd', 't', 'g', 'ɡ', 'k', 'z', 's', 'ʒ', 'ʃ', 'x', 'm', 'n', 'ɲ', 'l', 'ɫ', 'r', 'j'  // Plain
    ];

    for (const pat of patterns) {
      if (clean.endsWith(pat)) {
        return pat;
      }
    }
    return null;
  },

  /**
   * Extract initial consonant(s) from IPA string.
   * Returns null if word starts with vowel.
   */
  getInitialConsonant(ipa: string): string | null {
    // Remove stress marks first
    const clean = ipa.replace(/[ˈˌ]/g, '');
    // Match initial consonant cluster
    const patterns = [
      'ʃʲʃʲ', 'tʃʲ', 'dʒʲ', 'ts', 'dz',
      'bʲ', 'pʲ', 'vʲ', 'fʲ', 'dʲ', 'tʲ', 'gʲ', 'ɡʲ', 'kʲ', 'zʲ', 'sʲ', 'ʒʲ', 'ʃʲ', 'xʲ', 'mʲ', 'nʲ', 'lʲ', 'rʲ',
      'b', 'p', 'v', 'f', 'd', 't', 'g', 'ɡ', 'k', 'z', 's', 'ʒ', 'ʃ', 'x', 'm', 'n', 'ɲ', 'l', 'ɫ', 'r', 'j'
    ];

    for (const pat of patterns) {
      if (clean.startsWith(pat)) {
        return pat;
      }
    }
    return null;
  },

  /** Check if consonant is voiceless. */
  isVoicelessConsonant(c: string): boolean {
    return this.crossWordVoicelessSet.has(c);
  },

  /** Check if consonant is voiced obstruent (can trigger voicing). */
  isVoicedObstruent(c: string): boolean {
    return this.crossWordVoicedObstruentSet.has(c);
  },

  /** Check if consonant is sonorant (neutral for voicing). */
  isSonorantConsonant(c: string): boolean {
    return this.crossWordSonorantSet.has(c);
  },

  /** Check if consonant is /v/ (special: no assimilative influence per Grayson). */
  isVPhoneme(c: string): boolean {
    return this.crossWordVSet.has(c);
  },

  /** Apply voicing to final consonant of IPA string. */
  applyVoicingToFinal(ipa: string, finalC: string): string {
    const voiced = this.crossWordVoicingMap[finalC];
    if (!voiced) return ipa;
    return ipa.slice(0, -finalC.length) + voiced;
  },

  /** Apply devoicing to final consonant of IPA string. */
  applyDevoicingToFinal(ipa: string, finalC: string): string {
    const devoiced = this.crossWordDevoicingMap[finalC];
    if (!devoiced) return ipa;
    return ipa.slice(0, -finalC.length) + devoiced;
  },

  /**
   * Apply cross-word voicing assimilation to a line of words.
   * Modifies word objects in place, setting ipaSurface.
   *
   * Grayson p. 248-257:
   * - Voicing determined by RIGHTMOST consonant (regressive)
   * - Only crosses 'soft' or 'clitic' boundaries
   * - Sonorants and /v/ are neutral (don't trigger, but DO undergo)
   */
  applyCrossWordAssimilation(words: BoundaryWord[]): void {
    // Initialize: copy ipaUnderlying to ipaSurface, set skipFinalDevoicing
    words.forEach(word => {
      word.ipaSurface = word.ipaUnderlying;
      word.skipFinalDevoicing = false;
    });

    // Process each boundary
    for (let i = 0; i < words.length - 1; i++) {
      const leftWord = words[i];
      const rightWord = words[i + 1];

      // Skip hard boundaries
      if (leftWord.rightBoundary === 'hard') continue;

      const leftFinal = this.getFinalConsonant(leftWord.ipaSurface);
      const rightInitial = this.getInitialConsonant(rightWord.ipaSurface);

      // Skip if either word lacks consonant at boundary
      if (!leftFinal || !rightInitial) continue;

      // Skip if right initial is sonorant or /v/ (no assimilative influence)
      if (this.isSonorantConsonant(rightInitial) || this.isVPhoneme(rightInitial)) continue;

      // SIBILANT MERGERS (Grayson pp. 235-236)
      // с/з + ш → /ʃː/, с/з + ж → /ʒː/
      // These take priority over voicing assimilation (complete merger, not just voicing change)
      const sibilantMergers: Record<string, Record<string, string>> = {
        's':  { 'ʃ': 'ʃː', 'ʒ': 'ʒː' },
        'z':  { 'ʃ': 'ʃː', 'ʒ': 'ʒː' },
        'sʲ': { 'ʃ': 'ʃː', 'ʒ': 'ʒː' },
        'zʲ': { 'ʃ': 'ʃː', 'ʒ': 'ʒː' }
      };

      if (sibilantMergers[leftFinal]?.[rightInitial]) {
        // Complete merger: delete left final, geminate right initial
        // Example: с шумом → /ʃːumʌm/ (not /s ʃumʌm/)
        const geminate = sibilantMergers[leftFinal][rightInitial];
        leftWord.ipaSurface = leftWord.ipaSurface.slice(0, -leftFinal.length);

        // Handle stress marks: getInitialConsonant strips stress marks before matching,
        // but ipaSurface may start with ˈ or ˌ. Preserve stress position.
        const rightSurface = rightWord.ipaSurface;
        const stressMatch = rightSurface.match(/^[ˈˌ]+/);
        const stressPrefix = stressMatch ? stressMatch[0] : '';
        const afterStress = rightSurface.slice(stressPrefix.length);
        const afterConsonant = afterStress.slice(rightInitial.length);
        rightWord.ipaSurface = stressPrefix + geminate + afterConsonant;

        leftWord.skipFinalDevoicing = true;
        continue; // Skip voicing assimilation - merger already handled
      }

      // Determine assimilation direction
      if (this.isVoicedObstruent(rightInitial) && this.isVoicelessConsonant(leftFinal)) {
        // Voice the left final: слух был → sɫuɣ bɨɫ
        leftWord.ipaSurface = this.applyVoicingToFinal(leftWord.ipaSurface, leftFinal);
        leftWord.skipFinalDevoicing = true;
      } else if (this.isVoicelessConsonant(rightInitial) && this.isVoicedObstruent(leftFinal)) {
        // Devoice the left final: друг там → druk tam
        leftWord.ipaSurface = this.applyDevoicingToFinal(leftWord.ipaSurface, leftFinal);
        leftWord.skipFinalDevoicing = true;  // Already handled
      } else if (this.isVoicelessConsonant(rightInitial) && this.isVPhoneme(leftFinal)) {
        // Special case: /v/ devoices before voiceless consonants (в шутку → f ʃutku)
        // Grayson: /v/ doesn't TRIGGER voicing, but DOES UNDERGO devoicing
        leftWord.ipaSurface = this.applyDevoicingToFinal(leftWord.ipaSurface, leftFinal);
        leftWord.skipFinalDevoicing = true;
      }
    }

    // Apply final devoicing to words that didn't undergo cross-word assimilation
    // Grayson pp. 199-202: every word-final voiced obstruent devoices categorically.
    // Only clitic boundaries suppress devoicing (phonologically attached).
    // Cross-word re-voicing by a following voiced obstruent is handled above
    // (sets skipFinalDevoicing = true), so those cases are already excluded.
    words.forEach((word, i) => {
      if (!word.skipFinalDevoicing && word.rightBoundary !== 'clitic') {
        word.ipaSurface = this.applyFinalDevoicing(word.ipaSurface);
      }
    });
  }
};

// Initialize derived clitic Sets from cliticData (DRY - single source of truth)
GraysonEngine.proclitics = new Set(
  [...GraysonEngine.cliticData.entries()]
    .filter(([_, d]) => d.type === 'proclitic')
    .map(([k, _]) => k)
);
GraysonEngine.enclitics = new Set(
  [...GraysonEngine.cliticData.entries()]
    .filter(([_, d]) => d.type === 'enclitic')
    .map(([k, _]) => k)
);

// ─────────────────────────────────────────────────────────────────────
// CONVENIENCE API
// ─────────────────────────────────────────────────────────────────────

/**
 * Transcribe a single Russian word to IPA.
 * Convenience wrapper that handles stress lookup + engine transcription in one call.
 *
 * @param word - Russian word (Cyrillic)
 * @param config - Optional engine configuration (defaults to Grayson/Old Muscovite)
 * @returns Full transcription result with surface IPA, underlying IPA, syllable breakdown, and log
 */
export function transcribeWord(word: string, config?: EngineConfig): TranscriptionResult {
  const cleanWord = word.replace(/[.,!?;:"""''–—]/g, '').toLowerCase();
  const isProclitic = GraysonEngine.proclitics.has(cleanWord);
  const isEnclitic = GraysonEngine.enclitics.has(cleanWord);
  const isClitic = isProclitic || isEnclitic;

  // Look up stress from dictionary
  const lookup = GraysonEngine.lookupStress(cleanWord);
  const stressIndex = lookup ? lookup.stress : -2; // -2 = unknown stress (VERIFY cascade)

  return GraysonEngine.transcribe(cleanWord, stressIndex, isClitic, null, config);
}
