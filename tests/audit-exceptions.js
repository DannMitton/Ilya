/**
 * Exception Dictionary Audit
 * 
 * Compares hardcoded exception IPA against what MSR's normal
 * transcription would produce. Identifies:
 * - REDUNDANT: Exception matches normal output (can be removed)
 * - VALID: Exception differs from normal output (doing real work)
 * 
 * Run in browser console after loading MSR:
 *   auditExceptions()
 */

function auditExceptions() {
    const results = {
        redundant: [],
        valid: [],
        errors: []
    };
    
    // Get all exception entries
    const exceptions = Object.entries(EXCEPTION_WORDS || {});
    
    console.log(`Auditing ${exceptions.length} exception entries...\n`);
    
    for (const [word, data] of exceptions) {
        try {
            // Get what MSR would produce WITHOUT the exception
            // Temporarily remove from dictionary
            const savedEntry = EXCEPTION_WORDS[word];
            delete EXCEPTION_WORDS[word];
            
            // Process with normal transcription
            const normalResult = processWord(word, data.stressIndex);
            const normalIPA = normalResult.syllables.map(s => s.ipa).join('.');
            
            // Restore the exception
            EXCEPTION_WORDS[word] = savedEntry;
            
            // Compare (normalize both for fair comparison)
            const exceptionIPA = data.ipa.replace(/\s+/g, '');
            const normalIPANorm = normalIPA.replace(/\s+/g, '');
            
            if (exceptionIPA === normalIPANorm) {
                results.redundant.push({
                    word,
                    ipa: data.ipa,
                    rule: data.rule,
                    note: 'Normal transcription matches - exception unnecessary'
                });
            } else {
                results.valid.push({
                    word,
                    exceptionIPA: data.ipa,
                    normalIPA: normalIPA,
                    rule: data.rule,
                    note: 'Exception provides different output - keeping'
                });
            }
        } catch (e) {
            results.errors.push({ word, error: e.message });
        }
    }
    
    // Report
    console.log('═══════════════════════════════════════════════════════════');
    console.log('EXCEPTION DICTIONARY AUDIT RESULTS');
    console.log('═══════════════════════════════════════════════════════════');
    
    console.log(`\n✅ VALID EXCEPTIONS (${results.valid.length}) - Keep these:\n`);
    for (const v of results.valid) {
        console.log(`  ${v.word}`);
        console.log(`    Exception: /${v.exceptionIPA}/`);
        console.log(`    Normal:    /${v.normalIPA}/`);
        console.log(`    Rule: ${v.rule}\n`);
    }
    
    console.log(`\n⚠️ REDUNDANT EXCEPTIONS (${results.redundant.length}) - Can remove:\n`);
    for (const r of results.redundant) {
        console.log(`  ${r.word}: /${r.ipa}/ — ${r.rule}`);
    }
    
    if (results.errors.length > 0) {
        console.log(`\n❌ ERRORS (${results.errors.length}):\n`);
        for (const e of results.errors) {
            console.log(`  ${e.word}: ${e.error}`);
        }
    }
    
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log(`Summary: ${results.valid.length} valid, ${results.redundant.length} redundant, ${results.errors.length} errors`);
    console.log('═══════════════════════════════════════════════════════════');
    
    return results;
}

// Make available globally
window.auditExceptions = auditExceptions;
