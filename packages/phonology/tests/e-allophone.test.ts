/**
 * [e] allophone rule — Grayson Ch. 3 §4, pp. 106–107
 *
 * Task 4.6: Fix the stressed [e] vs [ɛ] distinction.
 *
 * [ɛ] is the default allophone of stressed ⟨е⟩.
 * It fronts to [e] when:
 *   (a) preceded by a palatalized consonant OR by ⟨ж⟩, ⟨ш⟩, or ⟨ц⟩
 *   (b) AND followed by a palatalized consonant or /j/
 *
 * This is BROADER than the interpalatal rule (which requires soft on both
 * sides). The always-hard trio qualify as preceding triggers for [e] even
 * though they never palatalize. They do NOT qualify for bright [a].
 *
 * Separate code paths must be maintained — merging them would break one.
 */
import { describe, it, expect } from 'vitest';
import { GraysonEngine } from '../src/index';

describe('[e] allophone rule (Grayson Ch. 3 §4, pp. 106–107)', () => {

  // ─── Always-hard preceding + soft following → [e] ───────────────

  describe('always-hard preceding triggers', () => {

    it('шесть: ш + е + soft cluster → [e]', () => {
      // шесть: single syllable, stress 0
      // ш (always-hard) + е + сʲтʲь → [e]
      const result = GraysonEngine.transcribe('шесть', 0);
      const eEntry = result.transcriptionLog.find(
        e => e.char === 'е' && e.features.type === 'vowel'
      );
      expect(eEntry?.ipa).toBe('e');
    });

    it('жечь: ж + е + ч (always-soft) → [e]', () => {
      // жечь: single syllable, stress 0
      // ж (always-hard) + е + ч (always-soft) → [e]
      const result = GraysonEngine.transcribe('жечь', 0);
      const eEntry = result.transcriptionLog.find(
        e => e.char === 'е' && e.features.type === 'vowel'
      );
      expect(eEntry?.ipa).toBe('e');
    });

    it('целить: ц + е + soft л → [e]', () => {
      // целить: це-лить, stress 0
      // ц (always-hard) + е + лʲ (soft before и) → [e]
      const result = GraysonEngine.transcribe('целить', 0);
      const eEntry = result.transcriptionLog.find(
        e => e.char === 'е' && e.features.type === 'vowel'
      );
      expect(eEntry?.ipa).toBe('e');
    });

  });

  // ─── Always-hard preceding + hard following → [ɛ] ──────────────

  describe('always-hard preceding but hard following → [ɛ]', () => {

    it('шест: ш + е + hard cluster → [ɛ]', () => {
      // шест: single syllable, stress 0
      // ш (always-hard) + е + ст (hard) → [ɛ]
      const result = GraysonEngine.transcribe('шест', 0);
      const eEntry = result.transcriptionLog.find(
        e => e.char === 'е' && e.features.type === 'vowel'
      );
      expect(eEntry?.ipa).toBe('ɛ');
    });

    it('целый: ц + е + hard л → [ɛ]', () => {
      // целый: це-лый, stress 0
      // ц (always-hard) + е + ɫ (hard л before ы) → [ɛ]
      const result = GraysonEngine.transcribe('целый', 0);
      const eEntry = result.transcriptionLog.find(
        e => e.char === 'е' && e.features.type === 'vowel'
      );
      expect(eEntry?.ipa).toBe('ɛ');
    });

  });

  // ─── Standard interpalatal [e] (no regression) ─────────────────

  describe('standard interpalatal [e] (soft + е + soft)', () => {

    it('день: дʲ + е + нʲь → [e]', () => {
      // день: single syllable, stress 0
      // дʲ (soft before е) + е + нʲ (soft before ь) → [e]
      const result = GraysonEngine.transcribe('день', 0);
      const eEntry = result.transcriptionLog.find(
        e => e.char === 'е' && e.features.type === 'vowel'
      );
      expect(eEntry?.ipa).toBe('e');
    });

    it('сеть: сʲ + е + тʲь → [e]', () => {
      // сеть: single syllable, stress 0
      const result = GraysonEngine.transcribe('сеть', 0);
      const eEntry = result.transcriptionLog.find(
        e => e.char === 'е' && e.features.type === 'vowel'
      );
      expect(eEntry?.ipa).toBe('e');
    });

  });

  // ─── Default [ɛ] (not followed by soft) ────────────────────────

  describe('default [ɛ] when following consonant is hard or absent', () => {

    it('тебе: word-final е → [ɛ]', () => {
      // тебе: те-бе, stress 1
      // бʲ (soft before е) + е + (nothing follows) → [ɛ]
      const result = GraysonEngine.transcribe('тебе', 1);
      // The stressed е is in the second syllable
      const eEntries = result.transcriptionLog.filter(
        e => e.char === 'е' && e.features.type === 'vowel'
      );
      // Second е is the stressed one
      const stressedE = eEntries.find(e => e.features.position === 'stressed');
      expect(stressedE?.ipa).toBe('ɛ');
    });

  });

  // ─── Bright [a] NOT affected (interpalatal only) ───────────────

  describe('bright [a] unchanged — always-hard do NOT qualify', () => {

    it('мяч: soft м + я + ч (always-soft) → bright [a]', () => {
      // мяч: single syllable, stress 0
      // мʲ (soft before я) + я + ч (always-soft) → interpalatal → [a]
      const result = GraysonEngine.transcribe('мяч', 0);
      const yaEntry = result.transcriptionLog.find(
        e => e.char === 'я' && e.features.type === 'vowel'
      );
      expect(yaEntry?.ipa).toBe('a');
    });

    it('мать: hard м + а + тʲь → dark [ɑ] (no preceding soft)', () => {
      // мать: single syllable, stress 0
      // м (hard — no palatalizing agent before vowel) → [ɑ]
      const result = GraysonEngine.transcribe('мать', 0);
      const aEntry = result.transcriptionLog.find(
        e => e.char === 'а' && e.features.type === 'vowel'
      );
      expect(aEntry?.ipa).toBe('ɑ');
    });

  });

});
