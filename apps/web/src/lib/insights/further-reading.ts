/**
 * FURTHER READING, one list of resources for the whole song (2026-11-03; ruled
 * by Dann 2026-11-03 22:41 to 22:53, `docs/memory/OPEN.md`, "INSIGHTS: FURTHER
 * READING IS ONE CONSOLIDATED LIST OF RESOURCES"). Each work appears once, its
 * full reference on its own line. Under it, one line per topic it is cited for:
 * the topic in plain words, then each page with its passage, passages joined by
 * semicolons. Pure, so the rules have tests.
 *
 * Topics run in the order of the observations (`i.comments`, which is
 * performance order); they are never re-sorted by bar. Two observations with the
 * same vowel, pitch, and printed bar merge into one topic with the union of their
 * rows (DESK DEFAULT). Works run alphabetical by author then year (`worksCited`).
 */
import { t, type Language } from '$lib/i18n';
import { ROWS, fullReference, passageText, worksCited, type Run } from './comment-sources';
import type { RenderedComment } from './comment-text';

export interface ReadingInputs {
	language: Language;
	/** The sung note's pitch as the page names it; '' where it has none. */
	pitchOf: (r: RenderedComment) => string;
	/** The printed bar. */
	barOf: (r: RenderedComment) => string;
}

export interface ReadingWork {
	/** The full reference, once. */
	reference: Run[];
	/** One line per topic: its label, then its passages joined by semicolons. */
	topics: Run[][];
}

const fill = (s: string, vars: Record<string, string>) => Object.entries(vars).reduce((out, [k, v]) => out.replaceAll(`{${k}}`, v), s);

/** A work's rows in page order, each once; ties by row id so the order is stable. */
function pageOrder(ids: Iterable<string>): string[] {
	return [...new Set(ids)].sort((a, b) => ROWS[a].pages[0] - ROWS[b].pages[0] || ROWS[a].pages[1] - ROWS[b].pages[1] || a.localeCompare(b));
}

export function furtherReading(comments: readonly RenderedComment[], i: ReadingInputs): ReadingWork[] {
	const { language } = i;
	return worksCited(comments.flatMap((c) => c.rows)).map((work) => {
		const topics = new Map<string, { label: string; rows: string[] }>();
		for (const c of comments) {
			const rows = c.rows.filter((id) => ROWS[id]?.work === work);
			if (rows.length === 0) continue;
			const vowel = c.comment.vowel;
			const pitch = i.pitchOf(c);
			const bar = i.barOf(c);
			const key = `${vowel}\u0000${pitch}\u0000${bar}`;
			const seen = topics.get(key);
			if (seen) seen.rows.push(...rows);
			else topics.set(key, { label: fill(t(pitch ? 'insights.r2.readingTopic' : 'insights.r2.readingTopicNoPitch', language), { vowel, pitch, bar }), rows: [...rows] });
		}
		return {
			reference: fullReference(work, language),
			topics: [...topics.values()].map((x) => [{ text: `${x.label} ${pageOrder(x.rows).map((id) => passageText(id, language)).join('; ')}` }]),
		};
	});
}
