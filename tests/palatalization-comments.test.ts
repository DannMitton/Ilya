/**
 * Row 175 step 3: the ratified palatalization comments, seated verbatim and pinned.
 *
 * The strings below are copied from docs/sessions/ratified-palatalization-comments-en_2026-11-02.md and
 * -fr_2026-11-02.md (RATIFIED by Dann, 2026-11-02 00:05 EN and 00:07 FR; lexical-exception 00:25), and from the
 * desk's message of 2026-11-02 for look-alike-root (RATIFIED 00:53, EN and FR). The French colon is preceded
 * by an ordinary space, as in every one of the sixteen in the file; the desk's message asked for a no-break
 * space "as in the other ratified French comments", but the file has none (0 of 16), so the file is matched.
 *
 * Each comment is also composed from a real engine log entry, so that the placeholders {trigger}, {base_ipa},
 * {word}, {look}, and {root} are shown to be filled by the engine, not just present in the data.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it, beforeAll } from 'vitest';
import { GraysonEngine, setStressDictionary } from '@ilya/phonology';
import { composeBlurb, deriveRule, setBlurbData, substituteVars } from '@ilya/blurb';

const DATA = JSON.parse(readFileSync(fileURLToPath(new URL('../data/blurb-composer.json', import.meta.url)), 'utf8'));

const EN: Record<string, string> = {
  "agent-vowel": "⟨{char}⟩ softens to [{ipa}] before ⟨{trigger}⟩, a palatalizing vowel letter.",
  "agent-soft-sign": "⟨{char}⟩ softens to [{ipa}] before the soft sign ⟨ь⟩.",
  "regressive-dental": "⟨{char}⟩ softens to [{ipa}] before the soft [{trigger}]: a dental consonant like [{base_ipa}] is softened by any soft consonant that follows.",
  "regressive-dental-dp-differs": "⟨{char}⟩ softens to [{ipa}] before the soft [{trigger}]: a dental consonant like [{base_ipa}] is softened by any soft consonant that follows. In everyday speech it often stays hard here.",
  "regressive-homorganic": "⟨{char}⟩ softens to [{ipa}] before the soft [{trigger}]: a labial (or velar) like [{base_ipa}] is softened only by another soft labial (or velar).",
  "regressive-n": "⟨н⟩ softens to [{ipa}] before the soft [{trigger}]: [n] is softened only by another soft [n] or a soft dental.",
  geminate: "⟨{char}⟩ softens to [{ipa}] before a second soft ⟨{char}⟩: doubled, the pair is softened together.",
  "r-front-stressed": "⟨р⟩ softens to [rʲ] before the soft [{trigger}]: it follows ⟨и⟩, ⟨е⟩, or ⟨э⟩, and the stress falls on that vowel or the next.",
  "hard-sign-vzs": "⟨{char}⟩ softens to [{ipa}] before the hard sign: ⟨в⟩, ⟨с⟩, and ⟨з⟩ are softened before ⟨ъ⟩.",
  "blocked-class": "⟨{char}⟩ stays [{ipa}] though the [{trigger}] after it is soft: a labial (or velar) is softened only by another soft labial (or velar).",
  "blocked-n": "⟨н⟩ stays [n] though the [{trigger}] after it is soft: [n] is softened only by another soft [n] or a soft dental.",
  "blocked-r": "⟨р⟩ stays [r] though the [{trigger}] after it is soft: before a soft consonant, [r] is softened only when doubled, or after ⟨и⟩, ⟨е⟩, or ⟨э⟩ with the stress on that vowel or the next.",
  "blocked-l": "⟨л⟩ stays [ɫ] though the [{trigger}] after it is soft: [l] is softened by a soft consonant only when doubled.",
  "boundary-hard-sign": "⟨{char}⟩ stays [{ipa}]: softening does not cross the hard sign ⟨ъ⟩.",
  "boundary-prefix": "⟨{char}⟩ stays [{ipa}]: softening does not cross from the root back into its prefix, unless the same consonant stands on both sides.",
  "no-soft-follower": "⟨{char}⟩ stays [{ipa}]: the sound right after it is not soft.",
  "lexical-exception": "⟨а⟩ sits interpalatally here (between two soft consonants), where the rules usually require a fronted [a]. A known exception is «счастье» and its derivatives: Grayson shares that many Russian speakers keep the dark [ɑ], which he finds less tense and more resonant for singing.",
  "look-alike-root": "⟨{char}⟩ softens to [{ipa}] before the soft [{trigger}]. «{word}» looks as if it begins with the prefix «{look}-», but ⟨{char}⟩ belongs to the root «{root}-», so the softening reaches it.",
};

const FR: Record<string, string> = {
  "agent-vowel": "⟨{char}⟩ se palatalise en [{ipa}] devant ⟨{trigger}⟩, une lettre voyelle palatalisatrice.",
  "agent-soft-sign": "⟨{char}⟩ se palatalise en [{ipa}] devant le signe mou ⟨ь⟩.",
  "regressive-dental": "⟨{char}⟩ se palatalise en [{ipa}] devant le [{trigger}] palatalisé : une consonne dentale comme [{base_ipa}] est palatalisée par toute consonne palatalisée qui la suit.",
  "regressive-dental-dp-differs": "⟨{char}⟩ se palatalise en [{ipa}] devant le [{trigger}] palatalisé : une consonne dentale comme [{base_ipa}] est palatalisée par toute consonne palatalisée qui la suit. Dans la langue parlée courante, il reste souvent dur ici.",
  "regressive-homorganic": "⟨{char}⟩ se palatalise en [{ipa}] devant le [{trigger}] palatalisé : une labiale (ou vélaire) comme [{base_ipa}] n'est palatalisée que par une autre labiale (ou vélaire) palatalisée.",
  "regressive-n": "⟨н⟩ se palatalise en [{ipa}] devant le [{trigger}] palatalisé : [n] n'est palatalisé que par un autre [n] palatalisé ou par une dentale palatalisée.",
  geminate: "⟨{char}⟩ se palatalise en [{ipa}] devant un second ⟨{char}⟩ palatalisé : redoublées, les deux lettres se palatalisent ensemble.",
  "r-front-stressed": "⟨р⟩ se palatalise en [rʲ] devant le [{trigger}] palatalisé : il suit ⟨и⟩, ⟨е⟩ ou ⟨э⟩, et l'accent tombe sur cette voyelle ou sur la suivante.",
  "hard-sign-vzs": "⟨{char}⟩ se palatalise en [{ipa}] devant le signe dur : ⟨в⟩, ⟨с⟩ et ⟨з⟩ se palatalisent devant ⟨ъ⟩.",
  "blocked-class": "⟨{char}⟩ reste [{ipa}] bien que le [{trigger}] qui le suit soit palatalisé : une labiale (ou vélaire) n'est palatalisée que par une autre labiale (ou vélaire) palatalisée.",
  "blocked-n": "⟨н⟩ reste [n] bien que le [{trigger}] qui le suit soit palatalisé : [n] n'est palatalisé que par un autre [n] palatalisé ou par une dentale palatalisée.",
  "blocked-r": "⟨р⟩ reste [r] bien que le [{trigger}] qui le suit soit palatalisé : devant une consonne palatalisée, [r] ne se palatalise que redoublé, ou après ⟨и⟩, ⟨е⟩ ou ⟨э⟩ lorsque l'accent tombe sur cette voyelle ou sur la suivante.",
  "blocked-l": "⟨л⟩ reste [ɫ] bien que le [{trigger}] qui le suit soit palatalisé : [l] n'est palatalisé par une consonne palatalisée que s'il est redoublé.",
  "boundary-hard-sign": "⟨{char}⟩ reste [{ipa}] : la palatalisation ne franchit pas le signe dur ⟨ъ⟩.",
  "boundary-prefix": "⟨{char}⟩ reste [{ipa}] : la palatalisation ne remonte pas de la racine jusqu'au préfixe, sauf si la même consonne se trouve de part et d'autre.",
  "no-soft-follower": "⟨{char}⟩ reste [{ipa}] : le son qui le suit immédiatement n'est pas palatalisé.",
  "lexical-exception": "⟨а⟩ est ici en position interpalatale (entre deux consonnes palatalisées), où les règles exigent d'ordinaire un [a] antériorisé. «счастье» et ses dérivés font exception : Grayson rapporte que beaucoup de Russes conservent le [ɑ] sombre, qu'il juge moins tendu et plus résonnant pour le chant.",
  "look-alike-root": "⟨{char}⟩ se palatalise en [{ipa}] devant le [{trigger}] palatalisé. «{word}» semble commencer par le préfixe «{look}-», mais ⟨{char}⟩ appartient à la racine «{root}-» : la palatalisation l'atteint donc.",
};

const CITATION: Record<string, string> = {
  "agent-vowel": "p. 169",
  "agent-soft-sign": "p. 169",
  "regressive-dental": "pp. 209–210",
  "regressive-dental-dp-differs": "pp. 209–210 + D&P 1980, p. 79",
  "regressive-homorganic": "p. 209",
  "regressive-n": "p. 209",
  geminate: "p. 209",
  "r-front-stressed": "p. 209",
  "hard-sign-vzs": "p. 193",
  "blocked-class": "p. 209",
  "blocked-n": "p. 209",
  "blocked-r": "p. 209",
  "blocked-l": "p. 209",
  "boundary-hard-sign": "p. 206",
  "boundary-prefix": "p. 249",
  "no-soft-follower": "p. 206",
  "look-alike-root": "p. 249",
  "lexical-exception": "p. 287",
};

/** A word with an apostrophe after its stressed vowel, the letter, and which occurrence of the letter. */
const CASES: Array<[reason: string, word: string, letter: string, nth: number]> = [
  ['agent-vowel', 'мять', 'м', 1],
  ['agent-soft-sign', "сто'ль", 'л', 1],
  ['regressive-dental', "сестрё'нка", 'с', 2],
  ['regressive-dental-dp-differs', 'три', 'т', 1],
  ['regressive-homorganic', "симметри'ческий", 'м', 1],
  ['regressive-n', 'пенсия', 'н', 1],
  ['geminate', "э'ллин", 'л', 1],
  ['r-front-stressed', "терпе'ть", 'р', 1],
  ['hard-sign-vzs', "съе'сть", 'с', 1],
  ['blocked-class', 'книга', 'к', 1],
  ['blocked-n', 'анви', 'н', 1],
  ['blocked-r', 'парви', 'р', 1],
  ['blocked-l', 'алви', 'л', 1],
  ['boundary-hard-sign', "подъё'м", 'д', 1],
  ['boundary-prefix', "обви'ть", 'б', 1],
  ['no-soft-follower', "ма'ть", 'м', 1],
  ['look-alike-root', "по'двиг", 'д', 1],
];

function entryFor(spec: string, letter: string, nth: number, type: 'consonant' | 'vowel' = 'consonant') {
  const i = spec.indexOf("'");
  const word = spec.replace("'", '');
  let stress = -1;
  if (i >= 0) {
    let start = 0;
    const syllables = GraysonEngine.syllabify(word);
    for (let s = 0; s < syllables.length; s++) {
      if (i - 1 >= start && i - 1 < start + syllables[s].length) stress = s;
      start += syllables[s].length;
    }
  }
  const log = GraysonEngine.transcribe(word, stress).transcriptionLog.filter((e) => e.char === letter && e.features.type === type);
  return log[nth - 1];
}

const vars = (e: ReturnType<typeof entryFor>) => ({
  char: e.char, ipa: e.ipa, base_ipa: e.features.baseIpa ?? '', trigger: e.features.trigger ?? '', cluster: '', profile: '',
  word: e.features.word ?? '', look: e.features.look ?? '', root: e.features.root ?? '',
});

beforeAll(() => setBlurbData(DATA));

describe('the data holds the ratified strings verbatim', () => {
  for (const id of Object.keys(EN)) {
    it(id, () => {
      const p = DATA.processes[id];
      expect(p.en.template).toBe(EN[id]);
      expect(p.fr.template).toBe(FR[id]);
      expect(p.en.citation).toBe(CITATION[id]);
      expect(p.fr.citation).toBe(CITATION[id]);
      expect(p.standalone).toBe(true);
    });
  }
  it('the old wrong-reason templates are gone: no soft:* or hard:* process, and no "no palatalizing agent nearby"', () => {
    expect(Object.keys(DATA.processes).filter((k) => /^(soft|hard):/.test(k))).toEqual([]);
    const text = JSON.stringify(DATA.processes);
    expect(text).not.toContain('no palatalizing agent nearby');
    expect(text).not.toContain('like it is here');
    expect(text).not.toContain('aucun agent palatalisateur');
  });
});

describe('the engine composes each comment, with its placeholders filled', () => {
  for (const [reason, word, letter, nth] of CASES) {
    it(`${reason}: ${word.replace("'", '')} ${letter}`, () => {
      const e = entryFor(word, letter, nth);
      expect(e.features.palReason).toBe(reason);
      expect(deriveRule(e as never)).toBe(reason);
      const out = composeBlurb(e as never)!;
      const b = out.blurb as { en: string; fr: string };
      expect(b.en).toBe(substituteVars(EN[reason], vars(e)));
      expect(b.fr).toBe(substituteVars(FR[reason], vars(e)));
      expect(b.en).not.toMatch(/\{\w+\}/);
      expect(b.fr).not.toMatch(/\{\w+\}/);
      if (EN[reason].includes('{trigger}')) expect(e.features.trigger, 'the engine fills {trigger}').toBeTruthy();
      if (EN[reason].includes('{base_ipa}')) expect(e.features.baseIpa, 'the engine fills {base_ipa}').toBeTruthy();
    });
  }

  it('подвиг, rendered in both languages', () => {
    const out = composeBlurb(entryFor("по'двиг", 'д', 1) as never)!;
    expect(out.blurb).toEqual({
      en: '⟨д⟩ softens to [dʲ] before the soft [vʲ]. «подвиг» looks as if it begins with the prefix «под-», but ⟨д⟩ belongs to the root «двиг-», so the softening reaches it.',
      fr: "⟨д⟩ se palatalise en [dʲ] devant le [vʲ] palatalisé. «подвиг» semble commencer par le préfixe «под-», mais ⟨д⟩ appartient à la racine «двиг-» : la palatalisation l'atteint donc.",
    });
    expect(out.citation).toBe('(Grayson, p. 249)');
  });

  it('неподвижный д is plain regressive-dental, not look-alike-root: the existing reason stands', () => {
    const e = entryFor("неподви'жный", 'д', 1);
    expect(e.features.palReason).toBe('regressive-dental');
    expect((composeBlurb(e as never)!.blurb as { en: string }).en).toBe(
      '⟨д⟩ softens to [dʲ] before the soft [vʲ]: a dental consonant like [d] is softened by any soft consonant that follows.',
    );
  });

  it('a dental before рь: the D&P sentence follows, and the citation names D&P', () => {
    const out = composeBlurb(entryFor('три', 'т', 1) as never)!;
    expect((out.blurb as { en: string }).en).toBe(
      '⟨т⟩ softens to [tʲ] before the soft [rʲ]: a dental consonant like [t] is softened by any soft consonant that follows. In everyday speech it often stays hard here.',
    );
    expect(out.citation).toBe('(Grayson, pp. 209–210; D&P 1980, p. 79)');
  });

  it('lexical-exception: «счастье» ⟨а⟩, with the ratified string and Grayson p. 287', () => {
    const e = entryFor("сча'стье", 'а', 1, 'vowel');
    expect(e.features.exception).toBe('lexical-exception');
    const out = composeBlurb(e as never)!;
    expect((out.blurb as { en: string; fr: string }).en).toBe(EN['lexical-exception']);
    expect((out.blurb as { en: string; fr: string }).fr).toBe(FR['lexical-exception']);
    expect(out.citation).toBe('(Grayson, p. 287)');
  });
});

describe('reasons with no causal sentence get their identity alone, and never the old text', () => {
  it('lexical-soft: the ц of цвет gets the ц identity (it names цвет), not "always hard"', () => {
    setStressDictionary({ 'цвет': { s: 0, l: 'цвет' } } as never); // the lemma is what softens the ц (lexical-palatalization.ts)
    const e = GraysonEngine.transcribe('цвет', 0).transcriptionLog.find((x) => x.char === 'ц')!;
    expect(e.features.palReason).toBe('lexical-soft');
    const out = composeBlurb({ ...e, features: { ...e.features } } as never)!;
    expect((out.blurb as { en: string }).en).toBe(DATA.identities['ц'].en.template.replace(/\{char\}/g, 'ц'));
  });
  it('adjectival-stage-hard, reflexive-hard, cluster, and an entry with no reason: identity only', () => {
    const k = GraysonEngine.transcribe('симметрический', 2).transcriptionLog.filter((x) => x.char === 'к').at(-1)!;
    expect(k.features.palReason).toBe('adjectival-stage-hard');
    for (const f of [k.features, { type: 'consonant' as const, palReason: 'cluster' }, { type: 'consonant' as const, palReason: 'reflexive-hard' }, { type: 'consonant' as const }]) {
      const out = composeBlurb({ char: 'к', ipa: 'k', features: f } as never)!;
      expect((out.blurb as { en: string }).en).toBe(DATA.identities['к'].en.template.replace(/\{char\}/g, 'к'));
    }
  });
});
