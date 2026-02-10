/**
 * @ilya/blurb – Blurb Composer
 *
 * IPI (Identity-Process-Implication) assembly engine for composing
 * context-aware educational blurbs from modular layers.
 *
 * The composer takes transcription log entries from the phonology engine
 * and produces bilingual educational text explaining each phonological
 * process (e.g., "The letter о appears in the pretonic position...").
 *
 * Architecture:
 * - deriveRule() maps engine features to process keys
 * - composeBlurb() assembles Identity + Process + Implication layers
 * - buildDisplayLog() expands clusters and merges j-glide pairs
 *
 * Data: The IPI data (identities, processes, implications) is loaded
 * from blurb-composer.json and injected via setBlurbData(). This keeps
 * the module independent of any loading mechanism.
 *
 * In the prototype, BlurbComposer and RuleRegistry were separate globals
 * with circular references. Here they are merged into one module with
 * clean function exports.
 */

import type {
  BlurbData,
  BlurbResult,
  BilingualBlurb,
  TranscriptionFeatures,
  TranscriptionLogEntry,
  DisplayLogEntry,
} from './types';
import {
  CLUSTER_BREAKDOWNS,
  isMergedCluster,
} from './cluster-breakdowns';
import type { ClusterCharEntry } from './cluster-breakdowns';

// ---------------------------------------------------------------------------
// Module-level data (injected via setBlurbData)
// ---------------------------------------------------------------------------

let _data: BlurbData = { identities: {}, processes: {} };

/**
 * Set the IPI data used by composeBlurb().
 * Call this after loading blurb-composer.json.
 */
export function setBlurbData(data: BlurbData): void {
  _data = data;
}

/**
 * Get the current IPI data (for testing or inspection).
 */
export function getBlurbData(): BlurbData {
  return _data;
}

// ---------------------------------------------------------------------------
// substituteVars — Template variable replacement
// ---------------------------------------------------------------------------

/**
 * Replace {var} placeholders in template strings.
 * Available variables: char, ipa, base_ipa, trigger, cluster, profile.
 */
export function substituteVars(
  template: string,
  vars: Record<string, string>
): string {
  if (!template) return '';
  return template.replace(
    /\{(\w+)\}/g,
    (match, key) => (vars[key] !== undefined ? vars[key] : match)
  );
}

// ---------------------------------------------------------------------------
// formatCitations — Deduplicate and format page citations
// ---------------------------------------------------------------------------

/**
 * Deduplicate and format page citations into a single parenthetical.
 * Uses citation_style from blurb-composer.json for formatting.
 *
 * @param citations - Array of citation strings (e.g., ["p. 104", "pp. 106-107"])
 * @returns Formatted citation string or null
 */
export function formatCitations(citations: string[]): string | null {
  if (!citations || citations.length === 0) return null;

  const style = _data.citation_style?.en;
  if (!style) return citations.join(', ');

  // Split all citations into individual page references, deduplicate
  const allPages: string[] = [];
  const seen = new Set<string>();
  citations.forEach((c) => {
    c.split(/,\s*/).forEach((page) => {
      const trimmed = page.replace(/^pp?\.\s*/, '').trim();
      if (trimmed && !seen.has(trimmed)) {
        seen.add(trimmed);
        allPages.push(trimmed);
      }
    });
  });

  if (allPages.length === 0) return null;

  const joined = allPages.join(style.separator);
  const prefix =
    allPages.length > 1 ||
    allPages.some((p) => p.includes('–') || p.includes('-'))
      ? style.plural
      : style.singular;

  return style.template.replace('{pages}', `${prefix} ${joined}`);
}

// ---------------------------------------------------------------------------
// deriveRuleStandard — Standard rule derivation (vowel/consonant/sign)
// ---------------------------------------------------------------------------

/**
 * Derive rule name from transcription log features for standard
 * vowel, consonant, and sign types. Called by deriveRule() after
 * checking for assimilation and j-glide special cases.
 *
 * This was RuleRegistry.deriveRule() in the prototype.
 */
export function deriveRuleStandard(
  features: TranscriptionFeatures,
  char: string
): string {
  if (features.type === 'vowel') {
    // Exception rules first
    if (features.exception) return features.exception;

    // Stressed vowels
    if (features.position === 'stressed') {
      return features.interpalatal ? 'stressed-interpalatal' : 'stressed';
    }

    // Unstressed vowels
    const lowerChar = char?.toLowerCase();
    // afterHard only applies to и and е (which become ɨ after ж/ш/ц)
    if (
      features.afterHard &&
      (lowerChar === 'и' || lowerChar === 'е')
    ) {
      return 'after-hard';
    }
    // Non-reducing vowels (у, ю, ы, ё) use a single 'unstressed' key
    if (['у', 'ю', 'ы', 'ё'].includes(lowerChar)) return 'unstressed';
    // и is non-reducing except in pretonic position (ikanye)
    if (lowerChar === 'и' && features.position !== 'pretonic') {
      return 'unstressed';
    }
    if (features.position === 'pretonic') {
      return features.interpalatal ? 'pretonic-interpalatal' : 'pretonic';
    }
    if (features.position === 'initial') return 'initial';
    if (features.position === 'posttonic-immediate') {
      return 'post-stress-immediate';
    }
    if (features.position === 'remote') return 'remote';
    return 'unstressed';
  }

  if (features.type === 'consonant') {
    const lowerChar = char?.toLowerCase();

    // Final devoicing takes precedence (v5.5.1)
    if (features.finalDevoicing) return 'final-devoicing';

    // Always-soft consonants (ч, щ)
    if (['ч', 'щ'].includes(lowerChar)) return 'always-soft';
    // Always-hard consonants (ж, ш, ц)
    if (['ж', 'ш', 'ц'].includes(lowerChar)) return 'always-hard';
    // Glide й
    if (lowerChar === 'й') return 'glide';
    // Soft consonants → 'soft'
    if (features.soft) return 'soft';
    // Hard consonants → 'hard'
    return 'hard';
  }

  if (features.type === 'sign') {
    return features.signType === 'soft' ? 'soft-sign' : 'hard-sign';
  }

  if (features.type === 'cluster') {
    return 'cluster';
  }

  return 'unknown';
}

// ---------------------------------------------------------------------------
// deriveRule — Full rule derivation (assimilation + j-glide + standard)
// ---------------------------------------------------------------------------

/**
 * Derive the composer rule key from a transcription log entry.
 * Maps engine features to process keys for blurb-composer.json lookup.
 *
 * Checks assimilation processes and j-glide variants first, then
 * delegates to deriveRuleStandard() for vowel/consonant/sign rules.
 *
 * @param entry - A transcription log entry from the phonology engine
 * @returns The rule key (e.g., "pretonic", "soft", "final-devoicing")
 */
export function deriveRule(entry: TranscriptionLogEntry): string {
  const { features, char } = entry;

  // Assimilation processes (checked before generic derivation)
  if (features?.silent && features?.deletionCluster) return 'silent';
  if (features?.voicingAssimilation && features?.devoiced) return 'regressive-devoicing';
  if (features?.voicingAssimilation && features?.voiced) return 'regressive-voicing';
  if (features?.finalDevoicing) return 'final-devoicing';
  if (features?.genitiveEnding) return 'genitive';
  if (features?.bogException) return 'bog-exception';

  // J-glide variants
  if (features?.type === 'glide' && features?.source) {
    if (features.source === 'ii-suffix') return 'j-ii-suffix';
    if (features.source === 'after-vowel') return 'j-after-vowel';
    if (features.source === 'after-sign') return 'j-after-sign';
    return 'j-glide';
  }

  // Delegate to standard vowel/consonant/sign rules
  return deriveRuleStandard(features, char);
}

// ---------------------------------------------------------------------------
// composeBlurb — IPI assembly
// ---------------------------------------------------------------------------

/**
 * Compose a blurb from IPI (Identity-Process-Implication) layers.
 *
 * Pipeline:
 * 1. Determine the effective character (handles j-glide special case)
 * 2. Look up identity for the character
 * 3. Look up process for rule:char
 * 4. Optionally look up implication
 * 5. Assemble bilingual text from templates
 *
 * @param entry - A transcription log entry from the phonology engine
 * @returns BlurbResult with bilingual blurb, citation, and notable flag, or null
 */
export function composeBlurb(entry: TranscriptionLogEntry): BlurbResult | null {
  if (!_data.identities || !_data.processes) return null;

  const { char, ipa, features } = entry;
  // J-glides log char as '' with the vowel in features.triggeredBy
  const effectiveChar =
    features?.type === 'glide' && features?.triggeredBy
      ? features.triggeredBy
      : char;
  const lowerChar = effectiveChar?.toLowerCase();
  if (!lowerChar) return null;

  const rule = deriveRule(entry);
  const processKey = `${rule}:${lowerChar}`;

  // Identity lookup (required)
  const identity = _data.identities[lowerChar];
  if (!identity) {
    console.warn(`[BlurbComposer] Missing identity: "${lowerChar}"`);
    return null;
  }

  // Process lookup (required unless Identity is self-sufficient)
  const process = _data.processes[processKey];
  if (!process) {
    if (identity.selfSufficient) {
      // Identity tells the whole story — return it alone
      const vars = {
        char: lowerChar,
        ipa: ipa || '',
        base_ipa: '',
        trigger: '',
        cluster: features?.clusterSource || '',
        profile: '',
      };
      const blurb: BilingualBlurb = {};
      const allCitations: string[] = [];
      for (const lang of ['en', 'fr'] as const) {
        const idEntry = identity[lang] || identity.en;
        if (!idEntry) {
          if (lang === 'en') return null;
          continue;
        }
        blurb[lang] = substituteVars(idEntry.template, vars);
        if (lang === 'en' && idEntry.citation) {
          allCitations.push(idEntry.citation);
        }
      }
      if (!blurb.fr) blurb.fr = blurb.en;
      return {
        blurb,
        citation: formatCitations(allCitations),
        notable: false,
      };
    }
    console.warn(`[BlurbComposer] Missing process: "${processKey}"`);
    return null;
  }

  // Implication lookup (optional; absence is valid for some processes)
  const implication = _data.implications?.[processKey] || null;

  // Template variables available for substitution
  const vars = {
    char: lowerChar,
    ipa: ipa || '',
    base_ipa: '',
    trigger: features?.trigger || '',
    cluster: features?.clusterSource || '',
    profile: '',
  };

  // Assemble for each language
  const blurb: BilingualBlurb = {};
  const allCitations: string[] = [];

  for (const lang of ['en', 'fr'] as const) {
    const idEntry = identity[lang] || identity.en;
    const procEntry = process[lang] || process.en;
    const implEntry = implication
      ? implication[lang] || implication.en
      : null;

    if (!idEntry || !procEntry) {
      if (lang === 'en') return null;
      if (lang === 'fr') {
        console.warn(
          `[BlurbComposer] French missing for "${processKey}"; falling back to English`
        );
      }
      continue;
    }

    // Assemble: Identity + Process + Implication (if present)
    // Standalone processes skip the Identity sentence
    let text = process.standalone
      ? substituteVars(procEntry.template, vars)
      : substituteVars(idEntry.template, vars) +
        ' ' +
        substituteVars(procEntry.template, vars);
    if (implEntry?.template) {
      text += ' ' + substituteVars(implEntry.template, vars);
    }

    blurb[lang] = text;

    // Collect citations once (from English pass)
    if (lang === 'en') {
      if (!process.standalone && idEntry.citation) {
        allCitations.push(idEntry.citation);
      }
      if (procEntry.citation) allCitations.push(procEntry.citation);
      if (implEntry?.citation) allCitations.push(implEntry.citation);
    }
  }

  // French fallback to English
  if (!blurb.fr) blurb.fr = blurb.en;

  return {
    blurb,
    citation: formatCitations(allCitations),
    notable: false,
  };
}

// ---------------------------------------------------------------------------
// lookupBlurb — Blurb lookup with fallback
// ---------------------------------------------------------------------------

/**
 * Look up blurb data for a transcription log entry.
 * Falls back to a simple "char → ipa" string if composition fails.
 */
export function lookupBlurb(entry: TranscriptionLogEntry): BlurbResult {
  const composed = composeBlurb(entry);
  if (composed) return composed;

  const { char, ipa } = entry;
  return {
    blurb: `${char} → ${ipa}`,
    citation: null,
    notable: false,
  };
}

// ---------------------------------------------------------------------------
// lookupClusterCharBlurb — Blurb for a character within an expanded cluster
// ---------------------------------------------------------------------------

/**
 * Look up blurb for a character within an expanded cluster.
 * Handles special cases: silent letters, geminate simplification,
 * cluster assimilation, sibilant mergers.
 */
export function lookupClusterCharBlurb(
  charEntry: ClusterCharEntry,
  clusterSource: string
): BlurbResult {
  const { char, ipa, features } = charEntry;

  // Silent letters in deletion clusters — route through BlurbComposer
  if (features.silent && features.deletionCluster) {
    return lookupBlurb({ char, ipa, features });
  }

  // Geminate simplified
  if (features.silent && features.geminateSimplified) {
    return {
      blurb: `In ⟨русский⟩ and its declensions, the doubled ⟨сс⟩ is pronounced as a single /s/, not as a geminate. This is an exception to the normal geminate rule.`,
      citation: 'p. 233',
      notable: true,
    };
  }

  // Cluster assimilation (сч, зч → щ sound)
  if (features.clusterAssimilation && clusterSource === 'сч') {
    return {
      blurb: `The cluster ⟨сч⟩ is pronounced like ⟨щ⟩: a long soft hushing sound /ʃʲʃʲ/. The ⟨с⟩ fully assimilates to match the following ⟨ч⟩.`,
      citation: 'pp. 230–231',
      notable: true,
    };
  }

  if (features.clusterAssimilation && clusterSource === 'зч') {
    return {
      blurb: `The cluster ⟨зч⟩ is pronounced like ⟨щ⟩: a long soft hushing sound /ʃʲʃʲ/. The ⟨з⟩ fully assimilates to match the following ⟨ч⟩.`,
      citation: 'pp. 230–231',
      notable: true,
    };
  }

  // Sibilant mergers (Grayson pp. 235-236)
  if (features.sibilantMerger) {
    const mergeTarget = features.mergesInto;
    const voiceChange = features.voices
      ? ' (voicing)'
      : features.devoices
        ? ' (devoicing)'
        : '';
    return {
      blurb: `The ⟨${char}⟩ merges completely into the following ⟨${mergeTarget}⟩${voiceChange}, lengthening it to /ʒː/ or /ʃː/.`,
      citation: 'pp. 235–236',
      notable: true,
    };
  }

  if (features.receivesLength) {
    return {
      blurb: `This ⟨${char}⟩ receives length from the preceding sibilant, producing a geminate /ʒː/ or /ʃː/.`,
      citation: 'pp. 235–236',
      notable: true,
    };
  }

  // чн → шн assimilation
  if (features.clusterAssimilation && clusterSource === 'чн') {
    return {
      blurb: `In certain common words (⟨конечно⟩, ⟨скучно⟩, ⟨нарочно⟩, ⟨яичница⟩), the cluster ⟨чн⟩ is pronounced /ʃn/ rather than /tʃn/. This is a historical pronunciation retained in everyday speech.`,
      citation: 'p. 239',
      notable: true,
    };
  }

  // чт → шт assimilation
  if (features.clusterAssimilation && clusterSource === 'чт') {
    return {
      blurb: `In ⟨что⟩, ⟨чтобы⟩, and ⟨ничто⟩, the cluster ⟨чт⟩ is pronounced /ʃt/ rather than /tʃt/. This is one of the most common pronunciation exceptions in Russian.`,
      citation: 'p. 240',
      notable: true,
    };
  }

  // Default: look up regular blurb
  return lookupBlurb({ char, ipa, features });
}

// ---------------------------------------------------------------------------
// mergeJGlidePairs — Merge j-glide + vowel pairs in display log
// ---------------------------------------------------------------------------

/**
 * Merge j-glide + vowel pairs into single ribbon entries.
 *
 * Iotated vowels (е, ё, ю, я) at word-initial, after vowel, or after sign
 * produce a j-glide log entry followed by a vowel entry. This merges them
 * into one row showing the iotated letter and combined IPA (e.g., я → jɪ).
 */
export function mergeJGlidePairs(
  expandedLog: DisplayLogEntry[]
): DisplayLogEntry[] {
  const mergedLog: DisplayLogEntry[] = [];
  let idx = 0;
  while (idx < expandedLog.length) {
    const entry = expandedLog[idx];
    const next = expandedLog[idx + 1];

    // Detect j-glide followed by its triggered vowel
    if (
      entry.features?.type === 'glide' &&
      entry.ipa === 'j' &&
      next &&
      next.features?.type === 'vowel' &&
      entry.features.triggeredBy?.toLowerCase() === next.char?.toLowerCase()
    ) {
      const combinedIpa = 'j' + next.ipa;

      // Recompose j-glide blurb with combined IPA
      const mergedBlurb = lookupBlurb({
        char: '',
        ipa: combinedIpa,
        features: entry.features,
      });

      mergedLog.push({
        char: next.char,
        ipa: combinedIpa,
        features: { ...next.features, jGlideMerged: true },
        syllableIndex: next.syllableIndex,
        position: next.position,
        blurbData: mergedBlurb,
      });

      idx += 2; // Skip both entries
    } else {
      mergedLog.push(entry);
      idx++;
    }
  }
  return mergedLog;
}

// ---------------------------------------------------------------------------
// buildDisplayLog — Expand clusters and enrich with blurb data
// ---------------------------------------------------------------------------

/**
 * Build a display log with blurb data from a raw transcription log.
 *
 * - Expands cluster entries into per-character rows for educational clarity
 * - Enriches each entry with blurb data
 * - Merges j-glide + vowel pairs into single entries
 *
 * @param transcriptionLog - Raw transcription log from the phonology engine
 * @returns Display log entries ready for the inspector ribbon
 */
export function buildDisplayLog(
  transcriptionLog: TranscriptionLogEntry[]
): DisplayLogEntry[] {
  const expandedLog: DisplayLogEntry[] = [];

  transcriptionLog.forEach((entry) => {
    // Check if this is a cluster that should be expanded
    if (
      entry.features?.type === 'cluster' &&
      CLUSTER_BREAKDOWNS[entry.char]
    ) {
      const breakdown = CLUSTER_BREAKDOWNS[entry.char];

      if (isMergedCluster(breakdown)) {
        // Merged cluster: both letters → one sound
        const clusterBlurb = lookupBlurb({
          char: entry.char,
          ipa: breakdown.mergedIpa,
          features: { type: 'cluster' },
        });

        breakdown.members.forEach((charEntry, idx) => {
          const isFirst = idx === 0;
          const isLast = idx === breakdown.members.length - 1;

          expandedLog.push({
            char: charEntry.char,
            ipa: isFirst ? breakdown.mergedIpa : '',
            features: charEntry.features,
            syllableIndex: entry.syllableIndex,
            position: (entry.position || 0) + idx,
            clusterSource: entry.char,
            clusterMerged: true,
            clusterStart: isFirst,
            clusterEnd: isLast,
            clusterContinuation: !isFirst,
            blurbData: isFirst
              ? clusterBlurb
              : { blurb: '', citation: null, notable: false },
          });
        });
      } else {
        // Standard array format (silent letter clusters, etc.)
        breakdown.forEach((charEntry, idx) => {
          expandedLog.push({
            char: charEntry.char,
            ipa: charEntry.ipa,
            features: charEntry.features,
            syllableIndex: entry.syllableIndex,
            position: (entry.position || 0) + idx,
            clusterSource: entry.char,
            blurbData: lookupClusterCharBlurb(charEntry, entry.char),
          });
        });
      }
    } else {
      // Regular entry, add blurb data
      expandedLog.push({
        ...entry,
        blurbData: lookupBlurb(entry),
      });
    }
  });

  return mergeJGlidePairs(expandedLog);
}
