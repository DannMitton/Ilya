/**
 * A MARK THAT RESTS ON A PLACEHOLDER IS DRAWN DASHED (QUEUE row 69; Dann,
 * 2026-10-11 12:28 to 12:42, `OPEN.md` "STAND-INS ARE LABELLED"): "We must not
 * propose synthetic values as if they were actual readings."
 *
 * Since row 17 a vowel the singer has not sampled carries a stand-in fR1, and
 * the turning pitch, the timbre, and the crossing are all computed from fR1
 * (`overlay-engine.ts`). The overlay engine sets `AnalyzedEvent.placeholder` on
 * such a note; the renderer passes each mark it draws for that note through
 * here. The page's line names the vowels and says "Findings that rest on a
 * placeholder are drawn dashed", so the dash is the promise kept.
 *
 * A stroked mark (the crossing squircle, a ledger line) keeps its stroke and
 * takes a dash. The turning notehead cannot be dashed as a fill, so it is
 * drawn as its own outline, dashed, in its own colour (DESK DEFAULT). The
 * turning accidental stays solid (DESK DEFAULT): a sharp drawn as a dashed
 * outline was measured hard to read at stave size, and legibility outranks
 * the rule; the dashed head beside it already marks the unit. Every such mark
 * carries `data-placeholder`, a handle as `data-analysis` is, so a test or a
 * later surface can find them by name.
 *
 * Kept out of `staff-renderer.ts`, which stands at its size ceiling.
 */

/** The dash of a stroked mark: long enough to read as a dash at stave size. */
export const PLACEHOLDER_DASH = '3 2';
/** The dash of an outlined glyph, finer because the outline is short. */
export const PLACEHOLDER_DASH_FINE = '2 1.2';
/** The outline weight of a filled mark drawn as its outline. */
export const PLACEHOLDER_OUTLINE = 1.2;

/** How a mark shows its placeholder: a dashed stroke, a dashed outline, or the handle alone. */
export type PlaceholderStyle = 'stroke' | 'outline' | 'tag';

/** `markup` as drawn when `placeholder` holds, else unchanged. */
export function placeholderMark(placeholder: boolean | undefined, markup: string, how: PlaceholderStyle): string {
  if (!placeholder) return markup;
  const tagged = markup.replace(/^<(\w+) /, '<$1 data-placeholder="true" ');
  if (how === 'tag') return tagged;
  if (how === 'outline') {
    return tagged.replace(
      / fill="([^"]+)"/,
      ` fill="none" stroke="$1" stroke-width="${PLACEHOLDER_OUTLINE}" stroke-dasharray="${PLACEHOLDER_DASH_FINE}"`,
    );
  }
  return tagged.replace(/^(<\w+ )/, `$1stroke-dasharray="${PLACEHOLDER_DASH}" `);
}
