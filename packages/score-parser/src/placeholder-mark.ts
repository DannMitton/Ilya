/**
 * A MARK THAT RESTS ON A PLACEHOLDER SAYS SO (QUEUE row 69; Dann, 2026-10-11
 * 12:28 to 12:42, `OPEN.md` "STAND-INS ARE LABELLED"): "We must not propose
 * synthetic values as if they were actual readings."
 *
 * Since row 17 a vowel the singer has not sampled carries a stand-in fR1, and
 * the turning pitch, the timbre, and the crossing are all computed from fR1
 * (`overlay-engine.ts`). The overlay engine sets `AnalyzedEvent.placeholder` on
 * such a note; the renderer passes each mark it draws for that note through
 * here. Markup's line names the vowels and says "Findings that rest on a
 * placeholder are drawn hollow or dashed", and these are the two ways.
 *
 * THE TURNING NOTEHEAD IS A HOLLOW CIRCLE (QUEUE row 78b; Dann 2026-10-11 19:56,
 * amended 20:03 to 20:04, `OPEN.md` "PLACEHOLDER TURNING NOTES ARE HOLLOW"):
 * "We use solid stemless noteheads for verified bespoke values. Let's abandon
 * this dotted line approach and use hollow stemless noteheads for placeholder
 * values", then "an actual proportional circle instead of the ovoid note
 * shape". A circle, not an oval, because an oval claims a duration. Its outer
 * edge is the height of the font's half-note head, so it covers a line or a
 * space as a head does; its stroke is `PLACEHOLDER_HOLLOW_STROKE_SP`. Solid
 * stroke, lavender, stemless, at the filled head's opacity.
 *
 * Its ledger lines and accidental are solid lavender, only tagged (DESK DEFAULT
 * (b) under the same ruling). A stroked mark that is not a notehead, the
 * crossing squircle, keeps its dash. Every such mark carries
 * `data-placeholder`, a handle as `data-analysis` is, so a test or a later
 * surface can find them by name.
 *
 * Kept out of `staff-renderer.ts`, which stands at its size ceiling.
 */

/** The dash of a stroked mark: long enough to read as a dash at stave size. */
export const PLACEHOLDER_DASH = '3 2';

/**
 * The hollow circle's stroke, in staff spaces: the rim's thinnest. MEASURED
 * 2026-10-12 (row 78b) from `FinaleMaestro.otf`'s `noteheadHalf`, rasterised at
 * 100 px a space: its rim is 0.098 sp at its thinnest and 0.297 sp at its
 * thickest, the shortest distance from each point of the hole's edge to the
 * outside. Chosen by Dann on 2026-10-14 on the picture
 * `docs/sessions/placeholder-shots/hollow-strokes.png`: "thinnest 0.098 has my
 * vote for the placeholder circles".
 */
export const PLACEHOLDER_HOLLOW_STROKE_SP = 0.098;

/** Where a hollow head stands: its centre, its outer diameter in px, and the staff space in px. */
export interface HollowHead {
  cx: number;
  cy: number;
  d: number;
  space: number;
}

/** How a mark shows its placeholder: a dashed stroke, the handle alone, or a hollow circle for a notehead. */
export type PlaceholderStyle = 'stroke' | 'tag' | HollowHead;

/** The height of an ellipse of radii `rx` and `ry` turned by `deg` degrees: the primitive head's footprint. */
export function rotatedEllipseHeight(rx: number, ry: number, deg: number): number {
  const t = (deg * Math.PI) / 180;
  return 2 * Math.hypot(rx * Math.sin(t), ry * Math.cos(t));
}

const round2 = (v: number): number => Math.round(v * 100) / 100;

/** `markup` as drawn when `placeholder` holds, else unchanged. */
export function placeholderMark(placeholder: boolean | undefined, markup: string, how: PlaceholderStyle): string {
  if (!placeholder) return markup;
  if (typeof how === 'object') {
    const kind = /data-analysis="([^"]+)"/.exec(markup)?.[1];
    const colour = / fill="([^"]+)"/.exec(markup)?.[1] ?? 'currentColor';
    const opacity = / opacity="([^"]+)"/.exec(markup)?.[1];
    const w = PLACEHOLDER_HOLLOW_STROKE_SP * how.space;
    // The stroke straddles the path, so the path's radius is the outer radius less half the stroke.
    const r = (how.d - w) / 2;
    return `<circle data-placeholder="true"${kind ? ` data-analysis="${kind}"` : ''} cx="${round2(how.cx)}" cy="${round2(how.cy)}" r="${round2(r)}" fill="none" stroke="${colour}" stroke-width="${round2(w)}"${opacity ? ` opacity="${opacity}"` : ''}/>`;
  }
  const tagged = markup.replace(/^<(\w+) /, '<$1 data-placeholder="true" ');
  if (how === 'tag') return tagged;
  return tagged.replace(/^(<\w+ )/, `$1stroke-dasharray="${PLACEHOLDER_DASH}" `);
}
