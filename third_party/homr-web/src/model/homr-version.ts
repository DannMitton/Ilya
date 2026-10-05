// Added by the Ilya project, 2026-10-05: selects model 465 and the homr main code paths that go with it.
/**
 * Which transformer model reads the page, and so which homr the pipeline
 * follows. Model 396 goes with homr 0.7.0, the version this port matches;
 * model 465 goes with homr main at commit 560ca5c, whose vocabulary and
 * whose staff grouping, brace scoring, staff-line detection and MusicXML
 * writing differ from 0.7.0. Each place that differs reads followsHomrMain()
 * and keeps the 0.7.0 behaviour when it is false.
 *
 * recognizePage sets this for the length of one page and puts it back after.
 * One recognizer reads one page at a time, so a module-level value is enough.
 */

export type TransformerModel = "396" | "465";

let active: TransformerModel = "396";

export const activeModel = (): TransformerModel => active;

/** True while a page is read with model 465 and homr main's code paths. */
export const followsHomrMain = (): boolean => active === "465";

/** Sets the model for the pages that follow; returns the one it replaced. */
export function setActiveModel(model: TransformerModel): TransformerModel {
  const previous = active;
  active = model;
  return previous;
}
