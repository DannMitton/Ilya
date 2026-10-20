/**
 * Which printed marks Markup draws, and the keys that let one system's render
 * know about a slur whose other end is in another system (N.188).
 *
 * THE PRINCIPLE (Dann, 2026-10-19 15:26, `PRODUCT.md`, "what the reader already
 * has, Ilya does not throw away and guess back by rule"): a score read from a
 * scan starts as an accurate replication of the print, so its slurs, accents,
 * and other note markings are drawn as printed. ITS CONDITION: a kind of mark is
 * drawn once its measured accuracy on Dann's proofed pages earns it, so a
 * detection error is not drawn as the composer's.
 */
import type { Articulation, ParsedScore, SlurEnd } from './types';

/** `ScoreSource.origin` of a score the page reader (homr) read from an image. */
export const READ_SCAN_ORIGIN = 'homr-musicxml-from-image';

/** Every kind of printed mark Markup can draw. */
export type MarkKind = 'slur' | 'fermata' | Articulation;

/**
 * THE ONE LIST: the kinds drawn on a score read from a scan.
 *
 * THE TEST, a DESK DEFAULT from the principle's condition (2026-10-19 20:2x):
 * of the marks of that kind the reader writes on the proofed pages, at least
 * 9 in 10 are printed. Tonight's figures (QUEUE row 114 measure, 15 proofed
 * pages of four songs): slur ends 91 of 96 written are printed (5 extra, 94.8
 * percent), accents 10 of 10, fermatas 4 of 4. Tenuti were 0 of 3 detected, and
 * staccati, staccatissimi, strong accents, and breath marks were not printed
 * on those pages, so they are unmeasured and stay out until a measure earns
 * them. Every other kind stays in the data (`VocalLineEvent`) and is not drawn.
 *
 * On a MusicXML or MNX file every kind is drawn: a file's marks are the
 * publisher's or the editor's, not a detection.
 */
export const SCAN_DRAWN_KINDS: ReadonlySet<MarkKind> = new Set<MarkKind>(['slur', 'accent', 'fermata']);

/**
 * Whether the score was read from an image. Keyed on the score's own origin and
 * NOT on `provenance.via`: the singer's homr route hands the reading back as a
 * `.musicxml` file, which ingests as `via: 'direct'`. The origin rides on
 * `ParsedScore` through `sliceScore` and the loupe bundle.
 */
export function isReadScan(parsed: Pick<ParsedScore, 'source'>): boolean {
  return parsed.source.origin === READ_SCAN_ORIGIN;
}

/** Whether Markup draws this kind of mark on this score. */
export function drawsKind(parsed: Pick<ParsedScore, 'source'>, kind: MarkKind): boolean {
  return !isReadScan(parsed) || SCAN_DRAWN_KINDS.has(kind);
}

/** The key one slur end is known by: its event, its number, and which end. */
export function slurEndKey(eventId: string, end: Pick<SlurEnd, 'type' | 'number'>): string {
  return `${eventId}|${end.number}|${end.type}`;
}

/**
 * The slur ends of measures `fromMeasure` to `toMeasure` whose partner is in the
 * score but outside that range, by `slurEndKey`.
 *
 * WHY THE PAGE LAYER COMPUTES THIS. Every system is rendered from a slice
 * holding its own measures, so the renderer cannot tell a partner in another
 * system from a partner that is gone (a note deleted in Corrections). Here the
 * whole line is in hand. An end whose partner is not on the line at all is
 * absent from the set, and the renderer draws nothing for it.
 */
export function slurEndsAcross(parsed: ParsedScore, fromMeasure: number, toMeasure: number): Set<string> {
  const out = new Set<string>();
  const measureOf = new Map<string, number>();
  for (const ev of parsed.vocalLine) measureOf.set(ev.id, ev.measureIndex);
  for (const ev of parsed.vocalLine) {
    if (!ev.slurs || ev.measureIndex < fromMeasure || ev.measureIndex > toMeasure) continue;
    for (const end of ev.slurs) {
      if (!end.partnerEventId) continue;
      const partnerMeasure = measureOf.get(end.partnerEventId);
      if (partnerMeasure === undefined) continue;
      if (partnerMeasure < fromMeasure || partnerMeasure > toMeasure) out.add(slurEndKey(ev.id, end));
    }
  }
  return out;
}

/**
 * The slurs that cross measures `fromMeasure` to `toMeasure` with both ends
 * outside them: started before, stopped after. A system in the middle of a long
 * slur holds neither end, so `slurEndsAcross` cannot see it. Named by the
 * START event, with the file's `placement` where it gave one.
 */
export function slursThrough(parsed: ParsedScore, fromMeasure: number, toMeasure: number): Array<{ id: string; placement?: 'above' | 'below' }> {
  const measureOf = new Map<string, number>();
  for (const ev of parsed.vocalLine) measureOf.set(ev.id, ev.measureIndex);
  const out: Array<{ id: string; placement?: 'above' | 'below' }> = [];
  for (const ev of parsed.vocalLine) {
    if (!ev.slurs || ev.measureIndex >= fromMeasure) continue;
    for (const end of ev.slurs) {
      if (end.type !== 'start' || !end.partnerEventId) continue;
      const stopMeasure = measureOf.get(end.partnerEventId);
      if (stopMeasure === undefined || stopMeasure <= toMeasure) continue;
      const stop = parsed.vocalLine.find((e) => e.id === end.partnerEventId)?.slurs?.find((e) => e.type === 'stop' && e.partnerEventId === ev.id);
      const placement = end.placement ?? stop?.placement;
      out.push({ id: ev.id, ...(placement ? { placement } : {}) });
    }
  }
  return out;
}
