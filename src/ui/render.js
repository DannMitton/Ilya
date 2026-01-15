/**
 * MSR UI Rendering Module
 * DOM manipulation and output rendering
 */

// ============================================================================
// STATE (will be set by main app)
// ============================================================================

let processedWords = [];
let activeExplanationPanel = null;

export function setProcessedWords(words) {
    processedWords = words;
}

export function getProcessedWords() {
    return processedWords;
}

// ============================================================================
// STRESS DISPLAY HELPERS
// ============================================================================

/**
 * Add combining acute accent to stressed vowel
 */
export function addStressToSyllable(syllable) {
    const vowels = ['а', 'е', 'ё', 'и', 'о', 'у', 'ы', 'э', 'ю', 'я'];
    const chars = Array.from(syllable);
    
    for (let i = 0; i < chars.length; i++) {
        if (vowels.includes(chars[i].toLowerCase())) {
            chars[i] = chars[i] + '\u0301';
            break;
        }
    }
    
    return chars.join('');
}

/**
 * Get Cyrillic text with stress mark on the stressed syllable
 */
export function getCyrillicWithStress(processed) {
    return processed.syllables.map((syl, idx) => {
        if (syl.isStressed) {
            return addStressToSyllable(syl.cyrillic);
        }
        return syl.cyrillic;
    }).join('');
}

// ============================================================================
// IPA PARSING
// ============================================================================

/**
 * Parse IPA string into units for syllable editor
 */
export function parseIPAtoUnits(ipa) {
    const units = [];
    let i = 0;
    
    while (i < ipa.length) {
        const char = ipa[i];
        let unit = char;
        
        while (i + 1 < ipa.length) {
            const next = ipa[i + 1];
            if (next === 'ʲ' || next === 'ː' || next === 'ˈ' || next === '̞') {
                unit += next;
                i++;
            } else {
                break;
            }
        }
        
        units.push({
            ipa: unit,
            isVowel: /[aɑɛeioɔuɪʊʌɨæ]/.test(char),
            isConsonant: /[bcdfgɡhjklmnprsʃtvwxzʒɲɫθðŋ]/.test(char)
        });
        
        i++;
    }
    
    return units;
}

/**
 * Convert units back to IPA string
 */
export function unitsToIPA(units) {
    return units.map(u => u.ipa).join('');
}

// ============================================================================
// STRESS INDICATORS
// ============================================================================

export function getStressIndicatorClass(source, hasUserOverride) {
    if (hasUserOverride) return 'stress-user';
    
    switch (source) {
        case 'vuizur':
        case 'corrections':
            return 'stress-dict';
        case 'wiktionary':
            return 'stress-wiktionary';
        case 'yo':
            return 'stress-yo';
        default:
            return 'stress-unverified';
    }
}

export function getStressIndicatorTooltip(source, hasUserOverride) {
    if (hasUserOverride) return 'Stress assigned by you';
    
    switch (source) {
        case 'vuizur':
            return 'Verified by Vuizur dictionary';
        case 'corrections':
            return 'Verified (MSR corrections)';
        case 'wiktionary':
            return 'Verified via Wiktionary';
        case 'yo':
            return 'Stress from ё';
        default:
            return 'Click to assign stress';
    }
}

// ============================================================================
// VIEW SWITCHING
// ============================================================================

let currentView = 'workspace';

export function switchView(view) {
    currentView = view;
    
    const workspaceView = document.getElementById('workspaceView');
    const singersView = document.getElementById('singersView');
    const workspaceTab = document.getElementById('workspaceTab');
    const singersTab = document.getElementById('singersTab');
    
    if (view === 'workspace') {
        workspaceView?.classList.remove('hidden');
        singersView?.classList.add('hidden');
        workspaceTab?.classList.add('active');
        singersTab?.classList.remove('active');
    } else {
        workspaceView?.classList.add('hidden');
        singersView?.classList.remove('hidden');
        workspaceTab?.classList.remove('active');
        singersTab?.classList.add('active');
    }
}

export function getCurrentView() {
    return currentView;
}

// ============================================================================
// EXPLANATION PANEL
// ============================================================================

export function closeExplanationPanel() {
    if (activeExplanationPanel) {
        activeExplanationPanel.remove();
        activeExplanationPanel = null;
    }
}

export function setActiveExplanationPanel(panel) {
    activeExplanationPanel = panel;
}
