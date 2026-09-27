/**
 * Lexical palatalization of ц and ш (Grayson, Russian Lyric Diction, 2012).
 *
 * Brief: docs/sessions/brief-code-grayson-soft-ts-sh_r1_2026-09-26.md.
 * Each expected string is Grayson's printed transcription, read from the page
 * image, in Ilya's notation: tʲsʲ without his tie bar (Dann, 2026-09-27),
 * nn for his nː (Ilya's default geminate display), and no syllable spaces.
 *
 * The dictionary here is a fixture: each entry copies the real line from
 * data/dictionary.86d83340-{a,b}.json (stress `s`, lemma `l`). The singer
 * supplement is the real file, which carries пшют and the p. 284 examples
 * the dictionary lacks.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';
import { GraysonEngine, setSingerSupplement, setStressDictionary, transcribeWord } from '../src/index';
import {
  lexicalSoftIndices,
  SH_LEMMAS,
  TS_SUFFIX_ADJECTIVE_LEMMAS,
  TS_SUFFIX_LEMMAS,
  TS_SUFFIX_NORMAL,
  TS_TSVET_LEMMAS,
} from '../src/lexical-palatalization';

const FIXTURE: Record<string, { s: number; l: string }> = {
  'цвет': { s: 0, l: 'цвет' },
  'цветок': { s: 1, l: 'цветок' },
  'цветы': { s: 1, l: 'цветок' },
  'расцвет': { s: 1, l: 'расцвет' },
  'революция': { s: 2, l: 'революция' },
  'революции': { s: 2, l: 'революция' },
  'революционный': { s: 4, l: 'революционный' },
  'декламация': { s: 2, l: 'декламация' },
  'цивилизация': { s: 3, l: 'цивилизация' },
  'станция': { s: 0, l: 'станция' },
  'лекция': { s: 0, l: 'лекция' },
  'греция': { s: 0, l: 'Греция' },
  'цирк': { s: 0, l: 'цирк' },
  'цюрих': { s: 0, l: 'Цюрих' },
  'кальций': { s: 0, l: 'кальций' },
  'репетиция': { s: 2, l: 'репетиция' },
  'дирекция': { s: 1, l: 'дирекция' },
  'инерционный': { s: 3, l: 'инерционный' },
  'инфекционный': { s: 3, l: 'инфекционный' },
  'инвестиционный': { s: 4, l: 'инвестиционный' },
};

beforeAll(() => {
  setStressDictionary(FIXTURE);
  setSingerSupplement(JSON.parse(readFileSync(join(__dirname, '../../../data/singer-supplement.json'), 'utf8')));
});

describe('ц palatalizes in цвет and its derivatives (Grayson p. 168)', () => {
  it('цвет /tʲsʲvʲɛt/', () => {
    expect(transcribeWord('цвет').ipa).toBe('ˈtʲsʲvʲɛt');
  });
  it('цветок /tʲsʲvʲɪ ˈtok/', () => {
    expect(transcribeWord('цветок').ipa).toBe('tʲsʲvʲɪˈtok');
  });
  it('цветы /tʲsʲvʲɪ ˈtɨ/', () => {
    expect(transcribeWord('цветы').ipa).toBe('tʲsʲvʲɪˈtɨ');
  });
  it('цветов, a supplement entry, reaches its lemma цветок', () => {
    expect(transcribeWord('цветов').ipa).toBe('tʲsʲvʲɪˈtof');
  });
  it('расцвет carries the chain Grayson prints in расцветать: /rɑsʲ tʲsʲvʲ…/', () => {
    expect(transcribeWord('расцвет').ipa.replace('ˈ', '')).toContain('sʲtʲsʲvʲ');
  });
});

describe('ц palatalizes in -ция and -ционный where they answer to -tion or -ence (Grayson pp. 283-284)', () => {
  it('революция /rʲɪ vɑ ˈlʲu tʲsʲi jɪ/', () => {
    expect(transcribeWord('революция').ipa).toBe('rʲɪvɑˈlʲutʲsʲijɪ');
  });
  it('декламация /dʲɪ kɫɑ ˈmɑ tʲsʲi jɪ/', () => {
    expect(transcribeWord('декламация').ipa).toBe('dʲɪkɫɑˈmɑtʲsʲijɪ');
  });
  it('революционный /rʲɪ vʌ lʲu tʲsʲi ˈo nːɨj/', () => {
    expect(transcribeWord('революционный').ipa).toBe('rʲɪvʌlʲutʲsʲiˈonnɨj');
  });
  it('декламационный /dʲɪ kɫʌ mʌ tʲsʲi ˈo nːɨj/, from the supplement', () => {
    expect(transcribeWord('декламационный').ipa).toBe('dʲɪkɫʌmʌtʲsʲiˈonnɨj');
  });
  it('каденция /kɑ ˈdʲeɲ tʲsʲi jɪ/, from the supplement', () => {
    expect(transcribeWord('каденция').ipa).toBe('kɑˈdʲeɲtʲsʲijɪ');
  });
  it('every form of the lemma: революции', () => {
    expect(transcribeWord('революции').ipa).toBe('rʲɪvɑˈlʲutʲsʲiji');
  });
  it('only the suffix ц: цивилизация keeps its root ц hard', () => {
    const ipa = transcribeWord('цивилизация').ipa;
    expect(ipa.startsWith('tsɨ')).toBe(true);
    expect(ipa.endsWith('tʲsʲijɪ')).toBe(true);
  });
});

describe('the p. 284 test sorts by the form of the suffix, not the meaning', () => {
  it('репетиция is soft: its twin is repetition (-tion), though it means rehearsal', () => {
    expect(transcribeWord('репетиция').ipa).toBe('rʲipʲiˈtʲitʲsʲijɪ');
  });
  it('дирекция is soft: its twin is direction (-tion), though it means directorate', () => {
    expect(transcribeWord('дирекция').ipa).toBe('dʲiˈrʲɛktʲsʲijɪ');
  });
  it('инерционный is soft by its own twin, inertial (-tial), though инерция is hard', () => {
    expect(transcribeWord('инерционный').ipa).toBe('iɲɪrtʲsʲiˈonnɨj');
  });
  it('инфекционный is soft because its noun инфекция is soft (infection)', () => {
    expect(transcribeWord('инфекционный').ipa).toBe('infʲɪktʲsʲiˈonnɨj');
  });
  it('инвестиционный is hard: its noun is hard and it has no -tial, -tory, -tionary, or -tional twin', () => {
    expect(transcribeWord('инвестиционный').ipa).toBe('invʲisʲtʲitsɨˈonnɨj');
  });
});

describe('ш palatalizes in пшют (Grayson p. 163)', () => {
  it('пшют /pʲʃʲut/', () => {
    expect(transcribeWord('пшют').ipa).toBe('ˈpʲʃʲut');
  });
  it('and its forms: пшюта', () => {
    expect(transcribeWord('пшюта').ipa).toBe('ˈpʲʃʲutɑ');
  });
});

describe('ц stays hard everywhere else', () => {
  it('лекция /ˈlʲɛk tsɨ jɪ/: -ция answering to -ture (p. 284)', () => {
    expect(transcribeWord('лекция').ipa).toBe('ˈlʲɛktsɨjɪ');
  });
  it('цирк is unchanged by this work (p. 166)', () => {
    // Grayson p. 167 prints /tsɨrk/. The rʲ is the engine's existing
    // progressive-р reading, untouched here; this test pins the ц and ɨ.
    expect(transcribeWord('цирк').ipa).toBe('ˈtsɨrʲk');
  });
  it('Цюрих stays hard: Grayson allows /ˈtsu rʲix/ (p. 168); Dann, 2026-09-27', () => {
    expect(transcribeWord('цюрих').ipa).toBe('ˈtsurʲix');
  });
  it('a place name in -ция stays hard: Греция', () => {
    expect(transcribeWord('греция').ipa).toBe('ˈɡrʲɛtsɨjɪ');
  });
  it('a masculine -ций is not the suffix: кальций', () => {
    expect(transcribeWord('кальций').ipa).toBe('ˈkɑlʲtsɨj');
  });
  it('a word absent from the dictionary gets no lexical softening', () => {
    expect(lexicalSoftIndices('революция', null)).toEqual([]);
  });
});

describe('the lists', () => {
  it('no lemma is ruled both soft and hard', () => {
    for (const l of TS_SUFFIX_NORMAL) {
      expect(TS_SUFFIX_LEMMAS.has(l) || TS_SUFFIX_ADJECTIVE_LEMMAS.has(l)).toBe(false);
    }
  });
  it('лекция is on the hard list, as Grayson rules it (p. 284)', () => {
    expect(TS_SUFFIX_NORMAL.has('лекция')).toBe(true);
  });
  it('an adjective can be soft by its own twin when its noun is hard: инерция, инерционный (p. 284)', () => {
    expect(TS_SUFFIX_NORMAL.has('инерция')).toBe(true);
    expect(TS_SUFFIX_ADJECTIVE_LEMMAS.has('инерционный')).toBe(true);
  });
  it('the ц + ю/я/ё names are on no list (p. 168; Dann, 2026-09-27)', () => {
    for (const l of ['цюрих', 'цюрихский', 'сперцян', 'тайцзицюань', 'хуацяо']) {
      expect(TS_SUFFIX_LEMMAS.has(l) || TS_TSVET_LEMMAS.has(l)).toBe(false);
    }
  });
  it('ш softens in one lemma only (p. 163)', () => {
    expect([...SH_LEMMAS]).toEqual(['пшют']);
  });
});

describe('tʲsʲ is one segment', () => {
  it('the segmenter keeps tʲsʲ whole', () => {
    expect(GraysonEngine.parseIPASegments('tʲsʲijɪ')).toEqual(['tʲsʲ', 'i', 'j', 'ɪ']);
  });
  it('cross-word assimilation reads tʲsʲ as one initial consonant', () => {
    expect(GraysonEngine.getInitialConsonant('ˈtʲsʲvʲɛt')).toBe('tʲsʲ');
  });
  it('the log marks the vowel after a soft ц as not after-hard', () => {
    const log = transcribeWord('революция').transcriptionLog;
    expect(log.find((e) => e.char === 'ц')!.ipa).toBe('tʲsʲ');
    expect(log.find((e) => e.char === 'и')!.features.afterHard).toBe(false);
  });
  it('the log marks a soft ц with no vowel trigger as lexical: цвет', () => {
    const ts = transcribeWord('цвет').transcriptionLog.find((e) => e.char === 'ц')!;
    expect(ts.ipa).toBe('tʲsʲ');
    expect(ts.features.softTrigger).toBe('lexical');
  });
});
