// Exception Words - full IPA transcriptions for irregular words
// Sources: Grayson Ch. 8.5, Ch. 6, Appendix F
// CLEANED: 2026-01-15 - removed 44 redundant entries (207 valid remain)

const EXCEPTION_WORDS = {

    // ════════════════════════════════════════════════════════════
    // SILENT LETTERS (9 entries)
    // ════════════════════════════════════════════════════════════

    'сердце': { ipa: 'sʲɛr.tsɨ', stressIndex: 0, rule: 'д is silent: рдц → рц (p. 243)' },
    'сердца': { ipa: 'sʲɛr.tsɑ', stressIndex: 1, rule: 'д is silent: рдц → рц (p. 243)' },
    'сердцу': { ipa: 'sʲɛr.tsu', stressIndex: 0, rule: 'д is silent: рдц → рц (p. 243)' },
    'сердцем': { ipa: 'sʲɛr.tsɨm', stressIndex: 0, rule: 'д is silent: рдц → рц (p. 243)' },
    'солнце': { ipa: 'son.tsɨ', stressIndex: 0, rule: 'л is silent: лнц → нц (p. 246)' },
    'солнца': { ipa: 'son.tsɑ', stressIndex: 0, rule: 'л is silent: лнц → нц (p. 246)' },
    'солнцу': { ipa: 'son.tsu', stressIndex: 0, rule: 'л is silent: лнц → нц (p. 246)' },
    'солнцем': { ipa: 'son.tsɨm', stressIndex: 0, rule: 'л is silent: лнц → нц (p. 246)' },
    'чувствовать': { ipa: 'tʃʲu.stvʌ.vɑtʲ', stressIndex: 0, rule: 'в is silent: вств → ств (p. 246)' },

    // ════════════════════════════════════════════════════════════
    // CLUSTER RULES (5 entries)
    // ════════════════════════════════════════════════════════════

    'конечно': { ipa: 'kɑ.ɲɛ.ʃnʌ', stressIndex: 1, rule: 'чн → ʃn (p. 239)' },
    'мягкий': { ipa: 'mʲɑxʲ.kʲij', stressIndex: 0, rule: 'гк → xʲkʲ before soft vowel (p. 240)' },
    'мягко': { ipa: 'mʲɑx.kʌ', stressIndex: 0, rule: 'гк → xk before hard vowel (p. 240)' },
    'лёгкий': { ipa: 'lʲoxʲ.kʲij', stressIndex: 0, rule: 'гк → xʲkʲ before soft vowel (p. 240)' },
    'легко': { ipa: 'lʲɪx.ko', stressIndex: 1, rule: 'гк → xk; unstressed е → ɪ (p. 240)' },

    // ════════════════════════════════════════════════════════════
    // OLD MUSCOVITE (6 entries)
    // ════════════════════════════════════════════════════════════

    'церковь': { ipa: 'tsɛrʲ.kʌfʲ', stressIndex: 0, rule: 'р soft by Old Muscovite tradition (p. 287)' },
    'церкви': { ipa: 'tsɛrʲ.kvʲi', stressIndex: 0, rule: 'р soft by Old Muscovite tradition (p. 287)' },
    'церквей': { ipa: 'tsɪrʲ.kvʲej', stressIndex: 1, rule: 'р soft by Old Muscovite tradition (p. 287)' },
    'сейчас': { ipa: 'si.tʃʲɑs', stressIndex: 1, rule: 'с stays hard (depalatalization tradition, p. 288)' },
    'танцевать': { ipa: 'tʌn.tsɑ.vɑtʲ', stressIndex: 2, rule: 'це = /tsɑ/ (Old Muscovite, p. 288)' },
    'симметрический': { ipa: 'sʲi.mʲmʲi.tʲrʲi.tʃʲɪ.skɨj', stressIndex: 2, rule: 'Multiple palatalization zones; Old Muscovite style (p. 211)' },

    // ════════════════════════════════════════════════════════════
    // OTHER (20 entries)
    // ════════════════════════════════════════════════════════════

    'ангел': { ipa: 'ɑn.ɡʲɪɫ', stressIndex: 0, rule: 'н stays hard (borrowed word, p. 288)' },
    'ангела': { ipa: 'ɑn.ɡʲɪ.ɫɑ', stressIndex: 0, rule: 'н stays hard (borrowed word, p. 288)' },
    'ангелы': { ipa: 'ɑn.ɡʲɪ.ɫɨ', stressIndex: 0, rule: 'н stays hard (borrowed word, p. 288)' },
    'ангелов': { ipa: 'ɑn.ɡʲɪ.ɫʌf', stressIndex: 0, rule: 'н stays hard (borrowed word, p. 288)' },
    'ага': { ipa: 'ɑ.hɑ', stressIndex: 1, rule: 'г = aspirate /h/ (archaic interjection, p. 288)' },
    'русский': { ipa: 'ru.sʲkʲij', stressIndex: 0, rule: 'Single с despite сс spelling (p. 288)' },
    'русская': { ipa: 'ru.sʲkɑ.jɑ', stressIndex: 0, rule: 'Single с despite сс spelling (p. 288)' },
    'русское': { ipa: 'ru.sʲkʌ.jɪ', stressIndex: 0, rule: 'Single с despite сс spelling (p. 288)' },
    'русские': { ipa: 'ru.sʲkʲi.jɪ', stressIndex: 0, rule: 'Single с despite сс spelling (p. 288)' },
    'русского': { ipa: 'ru.sʲkʌ.vʌ', stressIndex: 0, rule: 'Single с despite сс spelling (p. 288)' },
    'танцую': { ipa: 'tʌn.tsu.ju', stressIndex: 1, rule: 'танцевать family (p. 288)' },
    'танцуешь': { ipa: 'tʌn.tsu.jɪʃ', stressIndex: 1, rule: 'танцевать family (p. 288)' },
    'танцует': { ipa: 'tʌn.tsu.jɪt', stressIndex: 1, rule: 'танцевать family (p. 288)' },
    'большой': { ipa: 'bɑlʲ.ʃoj', stressIndex: 1, rule: 'Only л palatalized; й preceded by vowel boundary (p. 210)' },
    'сестрёнка': { ipa: 'sʲi.sʲtʲrʲon.kɑ', stressIndex: 1, rule: 'Entire стр cluster palatalized; unstressed interpalatal е → /i/ (p. 210)' },
    'смерть': { ipa: 'sʲmʲerʲtʲ', stressIndex: 0, rule: 'р palatalizes after stressed е (p. 209 fn. 277)' },
    'терпеть': { ipa: 'tʲirʲ.pʲetʲ', stressIndex: 1, rule: 'р palatalizes after stressed е (p. 209 fn. 277)' },
    'кирпич': { ipa: 'kʲirʲ.pʲitʃʲ', stressIndex: 1, rule: 'р palatalizes after stressed и (p. 209 fn. 277)' },
    'вернуть': { ipa: 'vʲɪr.nutʲ', stressIndex: 1, rule: 'р stays hard: unstressed е does not unlock р (p. 209 fn. 277)' },
    'черника': { ipa: 'tʃʲɪr.nʲi.kə', stressIndex: 1, rule: 'р stays hard: unstressed е does not unlock р (p. 209 fn. 277)' },
};

// ════════════════════════════════════════════════════════════
// LOANWORDS (167 entries) - C unpalatalized before е, unstressed о = /o/, etc.
// ════════════════════════════════════════════════════════════

const LOANWORD_EXCEPTIONS = {
    'абитуриент': { ipa: 'ɑ.bʲi.tu.rʲi.ɛnt', stressIndex: 4, rule: 'Loan word (C unpalatalized before е) (German)' },
    'абсент': { ipa: 'ɑp.sɛnt', stressIndex: 1, rule: 'Loan word (C unpalatalized before е) (French)' },
    'адаптер': { ipa: 'ɑ.dɑp.tɛr', stressIndex: 1, rule: 'Loan word (C unpalatalized before е) (English)' },
    'анданте': { ipa: 'ɑn.dɑn.tɛ', stressIndex: 1, rule: 'Loan word (C unpalatalized before е) (Italian)' },
    'антенна': { ipa: 'ɑn.tɛ.nɑ', stressIndex: 1, rule: 'Loan word (C unpalatalized before е) (Latin)' },
    'ателье': { ipa: 'ɑ.tɛ.lʲɛ', stressIndex: 2, rule: 'Loan word (C unpalatalized before е) (French)' },
    'бизнес': { ipa: 'bʲiz.nɛs', stressIndex: 0, rule: 'Loan word (C unpalatalized before е) (English)' },
    'бутерброд': { ipa: 'bu.tɛr.brot', stressIndex: 2, rule: 'Loan word (C unpalatalized before е) (German)' },
    'интервал': { ipa: 'in.tɛr.vɑɫ', stressIndex: 2, rule: 'Loan word (C unpalatalized before е) (French)' },
    'интермеццо': { ipa: 'in.tɛr.mjɛ.tsʌ', stressIndex: 2, rule: 'Loan word (C unpalatalized before е) (Italian)' },
    'кабаре': { ipa: 'kʌ.bɑ.rɛ', stressIndex: 2, rule: 'Loan word (C unpalatalized before е) (French)' },
    'кафе': { ipa: 'kɑ.fɛ', stressIndex: 1, rule: 'Loan word (C unpalatalized before е) (French)' },
    'купе': { ipa: 'ku.pɛ', stressIndex: 1, rule: 'Loan word (C unpalatalized before е) (French)' },
    'модель': { ipa: 'mɑ.dɛlʲ', stressIndex: 1, rule: 'Loan word (C unpalatalized before е) (French)' },
    'отель': { ipa: 'o.tɛlʲ', stressIndex: 1, rule: 'Loan word (C unpalatalized before е) (French)' },
    'партер': { ipa: 'pɑr.tɛr', stressIndex: 1, rule: 'Loan word (C unpalatalized before е) (French)' },
    'резюме': { ipa: 'rʲi.zʲu.mɛ', stressIndex: 2, rule: 'Loan word (C unpalatalized before е) (French)' },
    'реквием': { ipa: 'rɛ.kʲvʲi.ɛm', stressIndex: 0, rule: 'Loan word (C unpalatalized before е) (Latin/German)' },
    'свитер': { ipa: 'svʲi.tɛr', stressIndex: 0, rule: 'Loan word (C unpalatalized before е) (English)' },
    'тембр': { ipa: 'tɛmbr', stressIndex: 0, rule: 'Loan word (C unpalatalized before е) (French)' },
    'темп': { ipa: 'tɛmp', stressIndex: 0, rule: 'Loan word (C unpalatalized before е) (Italian)' },
    'теннис': { ipa: 'tɛ.ɲis', stressIndex: 0, rule: 'Loan word (C unpalatalized before е) (French)' },
    'тест': { ipa: 'tɛst', stressIndex: 0, rule: 'Loan word (C unpalatalized before е) (English)' },
    'форте': { ipa: 'for.tɛ', stressIndex: 0, rule: 'Loan word (C unpalatalized before е) (Italian)' },
    'шоссе': { ipa: 'ʃɑ.sɛ', stressIndex: 1, rule: 'Loan word (C unpalatalized before е) (French)' },
    'эссе': { ipa: 'ɛ.sɛ', stressIndex: 1, rule: 'Loan word (C unpalatalized before е) (French)' },
    // Italian unstressed о = /o/
    'арпеджио': { ipa: 'ɑr.pʲɛ.dʒi.o', stressIndex: 1, rule: 'Loan word: unstressed о = /o/ (Italian)' },
    'радио': { ipa: 'rɑ.dʲi.o', stressIndex: 0, rule: 'Loan word: unstressed о = /o/ (English)' },
    'трио': { ipa: 'tri.o', stressIndex: 0, rule: 'Loan word: unstressed о = /o/ (Italian)' },
    'какао': { ipa: 'kɑ.kɑ.o', stressIndex: 1, rule: 'Loan word: unstressed о = /o/ (Spanish)' },
    'фортиссимо': { ipa: 'fɑr.tʲi.sʲi.mo', stressIndex: 1, rule: 'Loan word: unstressed о = /o/ (Italian)' },
    'пианиссимо': { ipa: 'pʲi.ɑ.ɲi.sʲi.mo', stressIndex: 2, rule: 'Loan word: unstressed о = /o/ (Italian)' },
    // French жю/шю
    'жюри': { ipa: 'ʒu.ri', stressIndex: 1, rule: 'Loan word: жю = /ʒu/ (French)' },
    'амбушюр': { ipa: 'ɑm.bu.ʃur', stressIndex: 2, rule: 'Loan word: шю = /ʃu/ (French)' },
    // ьо = /ʲo/
    'батальон': { ipa: 'bɑ.tɑ.lʲon', stressIndex: 2, rule: 'Loan word: ьо = /ʲo/ (French)' },
    'компаньон': { ipa: 'kʌm.pɑ.ɲon', stressIndex: 2, rule: 'Loan word: ьо = /ʲo/ (French)' },
    'шампиньон': { ipa: 'ʃʌm.pʲi.ɲon', stressIndex: 2, rule: 'Loan word: ьо = /ʲo/ (French)' },
};

// Merge loanwords into main dictionary
Object.assign(EXCEPTION_WORDS, LOANWORD_EXCEPTIONS);
