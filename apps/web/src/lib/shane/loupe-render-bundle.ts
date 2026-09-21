/**
 * N.153 stage 2. What the loupe needs to render one measure from the same
 * inputs the page rendered from, handed to it as data instead of read back out
 * of the page's SVG.
 *
 * The pane assembles this inside its untracked page-rebuilt report, so it is a
 * snapshot of the render that just landed and adds no reactive dependency. The
 * fields are the ones `paginateScore` was given, plus `clef`, which
 * `paginateScore` resolves once for the whole score (`chooseClef(readingScore)`)
 * and which a one-measure slice must be handed rather than re-derive.
 */
import type { AnalyzedScore, ParsedScore, PreparedSmuflFont, RenderClef } from '@ilya/score-parser';

export interface LoupeRenderBundle {
	readingScore: ParsedScore;
	analyzed: AnalyzedScore;
	clef: RenderClef;
	font: PreparedSmuflFont | undefined;
	fontFamily: string | undefined;
	ipaPreview: Record<string, string> | undefined;
	withheldIpa: ReadonlySet<string> | undefined;
	cyrPreview: Record<string, string> | undefined;
	sylTypePreview: Record<string, 'whole' | 'start' | 'middle' | 'end'> | undefined;
	melismaPreview: ReadonlySet<string> | undefined;
}
