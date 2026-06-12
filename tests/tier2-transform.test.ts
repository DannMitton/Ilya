import { describe, it, expect } from 'vitest';
import { fixFrenchCaps, splitEntry } from '../scripts/tier2-transform.mjs';

describe('Tier 2 transform — French capitalization rule', () => {
  it('lowercases ordinary sentence-style glosses', () => {
    expect(fixFrenchCaps('Chien, chienne', 'noun')).toBe('chien, chienne');
    expect(fixFrenchCaps('Génitif singulier de собака', 'noun')).toBe(
      'génitif singulier de собака'
    );
  });

  it('leaves already-lowercase glosses unchanged', () => {
    expect(fixFrenchCaps('aimer', 'verb')).toBe('aimer');
  });

  it('leaves empty and non-letter-initial glosses unchanged', () => {
    expect(fixFrenchCaps('', 'noun')).toBe('');
    expect(fixFrenchCaps(undefined, 'noun')).toBe(undefined);
    expect(fixFrenchCaps('@, symbole arobase', 'noun')).toBe('@, symbole arobase');
    expect(fixFrenchCaps('1990, année', 'num')).toBe('1990, année');
  });

  it('preserves all-caps acronyms, including accented ones', () => {
    expect(fixFrenchCaps('SDF, personne sans domicile', 'noun')).toBe(
      'SDF, personne sans domicile'
    );
    expect(fixFrenchCaps('NKVD', 'noun')).toBe('NKVD');
    expect(fixFrenchCaps('ÉU, USA', 'noun')).toBe('ÉU, USA');
    expect(fixFrenchCaps('AK-47', 'noun')).toBe('AK-47');
  });

  it('does not treat a single capital letter as an acronym', () => {
    expect(fixFrenchCaps('A priori, en principe', 'adv')).toBe(
      'a priori, en principe'
    );
  });

  it('preserves capitals on proper-noun (name) entries', () => {
    expect(fixFrenchCaps('Israël', 'name')).toBe('Israël');
    expect(fixFrenchCaps('Odessa, ville d’Ukraine', 'name')).toBe(
      'Odessa, ville d’Ukraine'
    );
    expect(fixFrenchCaps('Prénom masculin', 'name')).toBe('Prénom masculin');
  });

  it('lowercases the six case descriptors even on name entries', () => {
    expect(fixFrenchCaps('Génitif singulier de Израиль', 'name')).toBe(
      'génitif singulier de Израиль'
    );
    expect(fixFrenchCaps('Datif singulier de Израиль', 'name')).toBe(
      'datif singulier de Израиль'
    );
    expect(fixFrenchCaps('Instrumental singulier de Москва', 'name')).toBe(
      'instrumental singulier de Москва'
    );
    expect(fixFrenchCaps('Accusatif pluriel de Афины', 'name')).toBe(
      'accusatif pluriel de Афины'
    );
    expect(fixFrenchCaps('Locatif singulier de Киев', 'name')).toBe(
      'locatif singulier de Киев'
    );
    expect(fixFrenchCaps('Nominatif pluriel de Альпы', 'name')).toBe(
      'nominatif pluriel de Альпы'
    );
  });

  it('only changes the first character; later segments keep capitals', () => {
    expect(fixFrenchCaps('Chien, chienne; Gredin, vaurien; Symbole @', 'noun')).toBe(
      'chien, chienne; Gredin, vaurien; Symbole @'
    );
  });

  it('handles uppercase Cyrillic initials like any other letter', () => {
    expect(fixFrenchCaps('Сжиженный нефтяной газ : GPL', 'noun')).toBe(
      'сжиженный нефтяной газ : GPL'
    );
  });
});

describe('Tier 2 transform — entry splitting', () => {
  it('drops r and keeps s, e, f, p, l in the core entry', () => {
    const { core, gloss } = splitEntry({
      s: 1,
      e: 'dog',
      f: 'Chien, chienne',
      p: 'noun',
      l: 'собака',
      r: 'kaikki-en',
      E: 'dog; hound',
      F: 'Chien, chienne; Gredin'
    });
    expect(core).toEqual({
      s: 1,
      e: 'dog',
      f: 'chien, chienne',
      p: 'noun',
      l: 'собака'
    });
    expect(core.r).toBeUndefined();
    expect(gloss).toEqual({ E: 'dog; hound', F: 'chien, chienne; Gredin' });
  });

  it('returns null gloss when an entry has no full glosses', () => {
    const { core, gloss } = splitEntry({
      s: 0,
      e: 'and',
      f: 'et',
      p: 'conj',
      l: 'и',
      r: 'kaikki-en'
    });
    expect(gloss).toBeNull();
    expect(core).toEqual({ s: 0, e: 'and', f: 'et', p: 'conj', l: 'и' });
  });

  it('emits a gloss entry when only E is present', () => {
    const { gloss } = splitEntry({ s: -1, e: 'a KIA', f: '', p: 'noun', l: '200', E: 'a KIA, a soldier killed in action' });
    expect(gloss).toEqual({ E: 'a KIA, a soldier killed in action' });
  });

  it('applies the FR caps fix to both f and F, never to e and E', () => {
    const { core, gloss } = splitEntry({
      s: 1,
      e: 'Dog things',
      f: 'Chien',
      p: 'noun',
      l: 'x',
      E: 'Dog things, fully',
      F: 'Chien, pleinement'
    });
    expect(core.e).toBe('Dog things');
    expect(core.f).toBe('chien');
    expect(gloss.E).toBe('Dog things, fully');
    expect(gloss.F).toBe('chien, pleinement');
  });

  it('respects the name guard through splitEntry', () => {
    const { core } = splitEntry({ s: 0, e: 'Israel', f: 'Israël', p: 'name', l: 'израиль' });
    expect(core.f).toBe('Israël');
  });
});
