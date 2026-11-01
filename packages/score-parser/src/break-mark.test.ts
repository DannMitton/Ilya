/**
 * QUEUE row 163 step 2: the # of a syntactic break, drawn apart on Markup.
 */
import { describe, expect, it } from 'vitest';
import { breakExtentPx, breakText, splitBreak, underlayHalves } from './break-mark';
import { estimateIpaWidthPx } from './underlay-widths';
import { columnAdvance } from './staff-renderer';
import { demoScore } from './demo-fixture';

describe('splitBreak', () => {
  it('takes one trailing # off the IPA and says so', () => {
    expect(splitBreak('tkʌ#')).toEqual({ ipa: 'tkʌ', brk: true });
  });
  it('leaves a string with no trailing # as it is', () => {
    expect(splitBreak('tkʌ')).toEqual({ ipa: 'tkʌ', brk: false });
    expect(splitBreak('')).toEqual({ ipa: '', brk: false });
  });
});

describe('the room a # takes', () => {
  it('is one word space (256/1000 em, underlay-widths.ts) plus the mark (580/1000 em)', () => {
    expect(breakExtentPx(12)).toBeCloseTo(0.256 * 12 + 0.58 * 12, 6);
  });
  it('grows only the right half, and only past the widest line', () => {
    const none = underlayHalves(40, 20, 0, false, 12);
    expect(none).toEqual({ left: 20, right: 20 });
    const wideCyrillic = underlayHalves(40, 20, 0, true, 12);
    expect(wideCyrillic.left).toBe(20);
    expect(wideCyrillic.right).toBeCloseTo(Math.max(20, 10 + breakExtentPx(12)), 6);
    const narrowCyrillic = underlayHalves(10, 30, 0, true, 12);
    expect(narrowCyrillic.left).toBe(15);
    expect(narrowCyrillic.right).toBeCloseTo(15 + breakExtentPx(12), 6);
  });
});

describe('breakText', () => {
  const u = { x: 100, align: 'middle' as const, ipa: 'tkʌ' };
  it('stands one word space past the right edge of a centred host, anchored at its start', () => {
    const svg = breakText(u, 'm1-1-2', 158, 12, "'Lato IPA', sans-serif");
    const x = estimateIpaWidthPx('tkʌ', 12) / 2 + 100 + estimateIpaWidthPx(' ', 12);
    expect(svg).toContain(`x="${Math.round(x * 100) / 100}"`);
    expect(svg).toContain('text-anchor="start"');
    expect(svg).toContain('>#</text>');
  });
  it('past the whole host when the host is left-anchored (a melisma)', () => {
    const svg = breakText({ ...u, align: 'start' }, 'm1-1-2', 158, 12, 'x');
    const x = 100 + estimateIpaWidthPx('tkʌ', 12) + estimateIpaWidthPx(' ', 12);
    expect(svg).toContain(`x="${Math.round(x * 100) / 100}"`);
  });
  it('carries no data-ipa-of, so the squircle and the Loupe keep the host syllable’s box', () => {
    expect(breakText(u, 'm1-1-2', 158, 12, 'x')).not.toContain('data-ipa-of');
    expect(breakText(u, 'm1-1-2', 158, 12, 'x')).toContain('data-ipa-break-of="m1-1-2"');
  });
});

describe('the spacing a # asks for (columnAdvance)', () => {
  const [prev, next] = ['n5', 'n6'].map((id) => demoScore().vocalLine.find((e) => e.id === id)!);
  const advance = (ipa: Record<string, string>) =>
    columnAdvance(prev, next, 0, { minGap: 0, pxPerWhole: 0, cyrPreview: { n5: '', n6: '' }, ipaPreview: ipa });
  it('a # after the previous column’s syllable widens the advance by the # and its space', () => {
    const plain = advance({ n5: 'tkʌ', n6: 'ba' });
    const withBreak = advance({ n5: 'tkʌ#', n6: 'ba' });
    expect(withBreak - plain).toBeCloseTo(breakExtentPx(12), 6);
  });
  it('a # after the NEXT column’s syllable leaves the advance into it alone: the # hangs right', () => {
    expect(advance({ n5: 'tkʌ', n6: 'ba#' })).toBe(advance({ n5: 'tkʌ', n6: 'ba' }));
  });
});
