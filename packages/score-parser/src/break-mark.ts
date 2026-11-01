/**
 * QUEUE row 163 step 2: THE # DRAWN APART.
 *
 * A typed # is a silence between two words, not part of the syllable it follows (Dann, 2026-10-30
 * 14:07: it "serves the function of a syntactic break" but "does not become part of its host syllable
 * the way enclitics do"). The IPA strings keep the # on their last syllable, because that is what is
 * copied and exported («tkʌ#»); this module splits it off at DRAWING time so the page can stand it a
 * full word space of the IPA font after the host, as an element of its own (Dann, 2026-10-30 14:17:
 * "Full gaps all around").
 *
 * `staff-renderer.ts` sits at its ratchet ceiling, so the arithmetic and the element live here.
 */
import { estimateIpaWidthPx } from './underlay-widths';

const BREAK_CHAR = '#';

/** An IPA string with its trailing # taken off, and whether there was one. */
export function splitBreak(ipa: string): { ipa: string; brk: boolean } {
  return ipa.endsWith(BREAK_CHAR) ? { ipa: ipa.slice(0, -1), brk: true } : { ipa, brk: false };
}

/** What the # takes to the right of its host's ink: one word space of the IPA font, then the mark itself. */
export function breakExtentPx(fontPx: number): number {
  return estimateIpaWidthPx(' ', fontPx) + estimateIpaWidthPx(BREAK_CHAR, fontPx);
}

/**
 * Half the room a column's underlay needs on each side of its note. The host stays centred on its own
 * letters, so the LEFT half is as wide as the widest line alone; the # hangs off the host's IPA, so only
 * the RIGHT half grows, and only past the widest line when the # reaches further than it does.
 */
export function underlayHalves(
  cyrW: number,
  ipaW: number,
  siglaW: number,
  brk: boolean,
  fontPx: number,
): { left: number; right: number } {
  const half = Math.max(cyrW, ipaW, siglaW) / 2;
  return { left: half, right: brk ? Math.max(half, ipaW / 2 + breakExtentPx(fontPx)) : half };
}

/**
 * The # as its own `<text>`, standing one word space past the right edge of the host's IPA. It carries
 * NO `data-ipa-of`: the selection squircle and the Loupe's hold rows find a syllable by that handle, and
 * the # is not part of its host (DESK DEFAULT, review amendment 8; Dann's 14:07 reason). Its own handle is
 * `data-ipa-break-of`.
 */
export function breakText(
  u: { x: number; align: 'middle' | 'start'; ipa: string },
  escapedId: string,
  y: number,
  fontPx: number,
  family: string,
): string {
  const hostW = estimateIpaWidthPx(u.ipa, fontPx);
  const x = Math.round((u.x + (u.align === 'start' ? hostW : hostW / 2) + estimateIpaWidthPx(' ', fontPx)) * 100) / 100;
  return `<text data-ipa-break-of="${escapedId}" x="${x}" y="${y}" text-anchor="start" font-size="${fontPx}" fill="#6a655f" font-family="${family}">${BREAK_CHAR}</text>`;
}
