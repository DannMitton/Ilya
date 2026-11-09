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
 *
 * ONE TOPIC FOR THE WHOLE LIST PRINTS ONCE (Dann 2026-11-09 12:10, `docs/memory/OPEN.md`, last section once
 * committed). WHAT: `readingList` checks whether every work serves exactly one topic, one key of vowel, pitch, and
 * bar across all works. If so, the topic's own line, `insights.r2.readingTopic` or `...NoPitch` unchanged, is returned
 * once as `sharedTopic`, and each work's line carries only its pages and passages. If the list serves two or more
 * topics, nothing changes: `readingList` returns today's lines, each with its own label. WHY: when every work serves
 * the same topic, the line "[u] on A3, bar 6:" repeats under each work and says nothing new. WHAT FOLLOWS: the page
 * draws `sharedTopic` once, under the FURTHER READING heading after the teacher line (`singer-blocks.ts`,
 * `SingerBlock.svelte`); a list that stopped lifting would print the label under every work, and a list that always
 * lifted would drop the label from a work that serves a topic of its own. RELATION: `furtherReading` is the form a
 * work takes with its labels, unchanged; `readingList` is the one the page reads.
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

/** A work's topics before they are written as lines: the key, the label, and the rows. */
function topicsByWork(comments: readonly RenderedComment[], i: ReadingInputs) {
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
		return { work, topics };
	});
}

/** The pages and passages of a topic's rows, in page order, joined by semicolons. */
const passagesOf = (rows: string[], language: Language) => pageOrder(rows).map((id) => passageText(id, language)).join('; ');

/** Each work with its topic lines, each line carrying its own label: today's form. */
export function furtherReading(comments: readonly RenderedComment[], i: ReadingInputs): ReadingWork[] {
	return topicsByWork(comments, i).map(({ work, topics }) => ({
		reference: fullReference(work, i.language),
		topics: [...topics.values()].map((x) => [{ text: `${x.label} ${passagesOf(x.rows, i.language)}` }]),
	}));
}

/** The list the page reads: the works, and the one topic line when the whole list serves exactly one topic. */
export interface ReadingList {
	/** The topic's line, printed once under the heading after the teacher line; null where two or more topics are served. */
	sharedTopic: string | null;
	works: ReadingWork[];
}

export function readingList(comments: readonly RenderedComment[], i: ReadingInputs): ReadingList {
	const by = topicsByWork(comments, i);
	const keys = new Set(by.flatMap((w) => [...w.topics.keys()]));
	if (keys.size !== 1) return { sharedTopic: null, works: furtherReading(comments, i) };
	const label = by[0].topics.values().next().value!.label;
	return {
		sharedTopic: label,
		works: by.map(({ work, topics }) => ({
			reference: fullReference(work, i.language),
			topics: [...topics.values()].map((x) => [{ text: passagesOf(x.rows, i.language) }]),
		})),
	};
}
