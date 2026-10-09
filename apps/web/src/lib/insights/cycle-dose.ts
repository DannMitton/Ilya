/**
 * The cycle dose, as the sentence the page prints.
 *
 * It was drawn under the tessituragram, inside the figure's own component, until
 * Dann's walk of 2026-10-09 ("THE INSIGHTS PAGE, REARRANGED", ruling 4): it comes
 * last on page one, before the method line, as a sentence of its own. The words
 * and the arithmetic are the ones the figure used (`insights.figure.cycleDose`,
 * `formatCycles`); only where it is drawn moved.
 */
import { t, type Language } from '$lib/i18n';
import type { TessituragramModel } from './insights';
import { formatCycles } from './singing-measures';

const fill = (s: string, vars: Record<string, string | number>) =>
	Object.entries(vars).reduce((out, [k, v]) => out.replaceAll(`{${k}}`, String(v)), s);

/** The sentence, or null where the figure carries no dose (no tempo, so no cycles). */
export function cycleDoseSentence(cycles: TessituragramModel['cycles'], language: Language): string | null {
	if (!cycles) return null;
	const text =
		cycles.kind === 'point'
			? formatCycles(cycles.cycles, language)
			: fill(t('insights.fit.span', language), { low: formatCycles(cycles.low, language), high: formatCycles(cycles.high, language) });
	return fill(t('insights.figure.cycleDose', language), { cycles: text });
}
