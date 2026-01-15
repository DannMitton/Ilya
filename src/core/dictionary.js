/**
 * MSR Dictionary Module
 * Stress lookup, gloss lookup, and harvest management
 * 
 * Dictionary source: OpenRussian.org (CC-BY-SA-4.0)
 * https://github.com/Badestrand/russian-dictionary
 */

// ============================================================================
// STORAGE KEYS
// ============================================================================

const HARVEST_STORAGE_KEY = 'msr_wiktionary_harvest';

// ============================================================================
// STATE
// ============================================================================

let wikiHarvest = {};
let STRESS_DICTIONARY = {};      // OpenRussian base dictionary
let STRESS_CORRECTIONS = {};     // Manual overrides
let Ё_EXCEPTION_DICTIONARY = {};
let EXCEPTION_WORDS = {};        // Grayson Appendix F

// ============================================================================
// INITIALIZATION
// ============================================================================

export function setDictionaries(dictionaries) {
    if (dictionaries.stress) STRESS_DICTIONARY = dictionaries.stress;
    if (dictionaries.corrections) STRESS_CORRECTIONS = dictionaries.corrections;
    if (dictionaries.yoExceptions) Ё_EXCEPTION_DICTIONARY = dictionaries.yoExceptions;
    if (dictionaries.exceptions) EXCEPTION_WORDS = dictionaries.exceptions;
}

// ============================================================================
// STRESS LOOKUP
// ============================================================================

/**
 * Look up stress position for a word
 * Priority: corrections > exceptions > openrussian > harvest
 * 
 * @param {string} word - The word to look up
 * @returns {{ index: number, source: string|null }} Stress index and source
 */
export function lookupStress(word) {
    const normalized = word.toLowerCase().replace(/[.,!?;:"""''„‚«»—–\-()]/g, '');
    
    // 1. Check corrections first (highest priority - manual overrides)
    if (STRESS_CORRECTIONS[normalized] !== undefined) {
        return { index: STRESS_CORRECTIONS[normalized], source: 'corrections' };
    }
    
    // 2. Check exception words (Grayson Appendix F)
    if (EXCEPTION_WORDS[normalized]?.stress !== undefined) {
        return { index: EXCEPTION_WORDS[normalized].stress, source: 'exceptions' };
    }
    
    // 3. Check main dictionary (OpenRussian)
    // Supports both formats: { word: index } and { word: { stress, gloss } }
    const dictEntry = STRESS_DICTIONARY[normalized];
    if (dictEntry !== undefined) {
        if (typeof dictEntry === 'number') {
            return { index: dictEntry, source: 'openrussian' };
        } else if (dictEntry.stress !== undefined) {
            return { index: dictEntry.stress, source: 'openrussian' };
        }
    }
    
    // 4. Check user harvest (lowest priority)
    if (wikiHarvest[normalized]) {
        return { index: wikiHarvest[normalized].stress, source: 'harvest' };
    }
    
    return { index: -1, source: null };
}

export function hasStressEntry(word) {
    const normalized = word.toLowerCase().replace(/[.,!?;:"""''„‚«»—–\-()]/g, '');
    return STRESS_CORRECTIONS[normalized] !== undefined ||
           EXCEPTION_WORDS[normalized]?.stress !== undefined ||
           STRESS_DICTIONARY[normalized] !== undefined ||
           wikiHarvest[normalized] !== undefined;
}

// ============================================================================
// GLOSS LOOKUP
// ============================================================================

/**
 * Look up English gloss/translation for a word
 * 
 * @param {string} word - The word to look up
 * @returns {string|null} English gloss or null if not found
 */
export function lookupGloss(word) {
    const normalized = word.toLowerCase().replace(/[.,!?;:"""''„‚«»—–\-()]/g, '');
    
    const dictEntry = STRESS_DICTIONARY[normalized];
    if (dictEntry?.gloss) {
        return dictEntry.gloss;
    }
    
    return null;
}

/**
 * Look up both stress and gloss in one call
 * 
 * @param {string} word - The word to look up
 * @returns {{ stress: number, stressSource: string|null, gloss: string|null }}
 */
export function lookupWord(word) {
    const stressResult = lookupStress(word);
    const gloss = lookupGloss(word);
    
    return {
        stress: stressResult.index,
        stressSource: stressResult.source,
        gloss: gloss
    };
}

// ============================================================================
// YO EXCEPTIONS
// ============================================================================

export function checkYoException(word) {
    const normalized = word.toLowerCase();
    return Ё_EXCEPTION_DICTIONARY[normalized] || null;
}

// ============================================================================
// EXCEPTION WORDS
// ============================================================================

export function checkExceptionWord(word) {
    const normalized = word.toLowerCase();
    return EXCEPTION_WORDS[normalized] || null;
}

// ============================================================================
// HARVEST FUNCTIONS
// ============================================================================

export function loadHarvest() {
    try {
        const saved = localStorage.getItem(HARVEST_STORAGE_KEY);
        if (saved) {
            wikiHarvest = JSON.parse(saved);
            console.log(`[Harvest] Loaded ${Object.keys(wikiHarvest).length} words`);
        }
    } catch (e) {
        console.warn('[Harvest] Failed to load:', e);
        wikiHarvest = {};
    }
}

export function saveHarvest() {
    try {
        localStorage.setItem(HARVEST_STORAGE_KEY, JSON.stringify(wikiHarvest));
    } catch (e) {
        console.warn('[Harvest] Failed to save:', e);
    }
}

export function harvestWord(word, stressIndex) {
    const normalized = word.toLowerCase().replace(/[.,!?;:"""''„‚«»—–]/g, '');
    
    // Skip if already in any dictionary
    if (STRESS_DICTIONARY[normalized] !== undefined) return false;
    if (STRESS_CORRECTIONS[normalized] !== undefined) return false;
    
    if (wikiHarvest[normalized]) {
        wikiHarvest[normalized].count++;
        wikiHarvest[normalized].lastSeen = new Date().toISOString();
    } else {
        wikiHarvest[normalized] = {
            stress: stressIndex,
            timestamp: new Date().toISOString(),
            lastSeen: new Date().toISOString(),
            count: 1
        };
    }
    
    saveHarvest();
    return true;
}

export function getHarvestStats() {
    const words = Object.keys(wikiHarvest);
    if (words.length === 0) {
        return { total: 0, newest: null, oldest: null };
    }
    
    let newest = null, oldest = null;
    for (const word of words) {
        const ts = wikiHarvest[word].timestamp;
        if (!oldest || ts < oldest) oldest = ts;
        if (!newest || ts > newest) newest = ts;
    }
    
    return {
        total: words.length,
        newest: newest ? new Date(newest).toLocaleDateString() : null,
        oldest: oldest ? new Date(oldest).toLocaleDateString() : null
    };
}

export function exportHarvest() {
    const simpleFormat = {};
    for (const [word, data] of Object.entries(wikiHarvest)) {
        simpleFormat[word] = data.stress;
    }
    return JSON.stringify(simpleFormat, null, 2);
}

export function downloadHarvest(full = false) {
    const data = full ? JSON.stringify(wikiHarvest, null, 2) : exportHarvest();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `msr-harvest-${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

export function clearHarvest() {
    wikiHarvest = {};
    saveHarvest();
}

export function getHarvestData() {
    return wikiHarvest;
}

// ============================================================================
// DICTIONARY STATS
// ============================================================================

/**
 * Get statistics about loaded dictionaries
 */
export function getDictionaryStats() {
    return {
        openrussian: Object.keys(STRESS_DICTIONARY).length,
        corrections: Object.keys(STRESS_CORRECTIONS).length,
        exceptions: Object.keys(EXCEPTION_WORDS).length,
        yoExceptions: Object.keys(Ё_EXCEPTION_DICTIONARY).length,
        harvest: Object.keys(wikiHarvest).length
    };
}

// ============================================================================
// IPA VALIDATION
// ============================================================================

const FORBIDDEN_IPA_GLYPHS = {
    'g': 'ɡ',      // Latin g → IPA ɡ (opentail)
    'ə': 'ʌ',      // Schwa → wedge (for remote positions)
    'ɐ': 'ɑ',      // Near-open central → back open
    'nʲ': 'ɲ',     // n + palatalization → palatal nasal
    'ɔ': 'o'       // Grayson uses /o/ not /ɔ/ for stressed о/ё
};

export function validateIPAOutput(ipaString) {
    for (const [forbidden, correct] of Object.entries(FORBIDDEN_IPA_GLYPHS)) {
        if (ipaString.includes(forbidden)) {
            console.error(`❌ FORBIDDEN GLYPH: "${forbidden}" should be "${correct}"`);
            return false;
        }
    }
    return true;
}
