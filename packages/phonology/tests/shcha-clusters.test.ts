/** The clusters read as щ (Grayson 2012, p. 236). Row 175 step 4. */
import { describe, expect, it } from 'vitest';
import { GraysonEngine, transcribeWord } from '../src/index';
import { SHCHA_CLUSTERS } from '../src/shcha-clusters';

describe('SHCHA_CLUSTERS', () => {
  it('holds the six clusters of p. 236, all /ʃʲʃʲ/', () => {
    expect(Object.keys(SHCHA_CLUSTERS)).toEqual(['ссч', 'стч', 'здч', 'жч', 'сч', 'зч']);
    expect(new Set(Object.values(SHCHA_CLUSTERS))).toEqual(new Set(['ʃʲʃʲ']));
  });
  it('lists a cluster before any shorter cluster it contains: ссч before сч', () => {
    const keys = Object.keys(SHCHA_CLUSTERS);
    for (const long of keys) for (const short of keys) {
      if (long !== short && long.includes(short)) expect(keys.indexOf(long), `${long} before ${short}`).toBeLessThan(keys.indexOf(short));
    }
  });
  it('the engine table starts with them', () => {
    expect(Object.keys(GraysonEngine.specialClusters).slice(0, 6)).toEqual(Object.keys(SHCHA_CLUSTERS));
  });
});

describe('the clusters in words', () => {
  const ipa = (w: string) => transcribeWord(w).ipa;
  it('ссч is read whole: рассчитать has no с before the /ʃʲʃʲ/', () => {
    // No dictionary here, so the stress is unknown and the vowels are not the point: the consonants are.
    expect(ipa('рассчитать')).toMatch(/^r.ʃʲʃʲ/); // р, a vowel, then the cluster: no с between
    expect(ipa('рассчитать')).not.toContain('s');
  });
  it('жч, стч, здч, зч, сч', () => {
    expect(ipa('мужчина')).toContain('uʃʲʃʲ');
    expect(ipa('жёстче')).toBe('ˈʒoʃʲʃʲɪ');
    expect(ipa('громоздче')).toMatch(/ɡromo.?ʃʲʃʲ/);
    expect(ipa('громоздче')).not.toMatch(/[zsd]/);
    expect(ipa('резче')).toContain('ʃʲʃʲ');
    expect(ipa('резче')).not.toMatch(/[zs]/);
    expect(ipa('считать')).toContain('ʃʲʃʲ');
  });
  it('подсчитать keeps its д hard at the prefix boundary (p. 249) and reads the сч as /ʃʲʃʲ/', () => {
    const r = transcribeWord('подсчитать');
    expect(r.ipa).toContain('ʃʲʃʲ');
    const d = r.transcriptionLog.find((e) => e.char === 'д')!;
    expect(d.ipa).not.toContain('ʲ'); // hard; [t] because it devoices before the voiceless /ʃʲʃʲ/
    expect(d.features.palReason).toBe('boundary-prefix');
  });
});
