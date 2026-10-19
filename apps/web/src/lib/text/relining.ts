/**
 * QUEUE row 108 B: WHEN LYRICS TAKES THE POEM'S LINE BREAKS (ruling default 4
 * of N.135 stage 3: "Lyrics adopts the poem's line breaks where a poem is
 * given, for comparison; an unmatched remainder sits as its own line").
 *
 * One pure decision, called by the page at three moments (the arrival's seat,
 * the waiting seat, a Poem edit). It returns the text Lyrics should become, or
 * null to leave Lyrics alone. ALL FOUR must hold:
 *
 * 1. Lyrics holds the score's words (`sameWords` with the score's text).
 * 2. THE LINE BREAKS ARE ILYA'S (DESK DEFAULT): Lyrics is one line, the shape
 *    a drop leaves, or it is exactly the text Ilya last wrote (`lastLaid`), or
 *    it equals `layOutLikePoem(Lyrics, the previous Poem)` exactly. A Lyrics
 *    the singer broke into lines of her own keeps them. `lastLaid` is the
 *    surer witness while a Poem is typed key by key: the layout of a PARTIAL
 *    poem is not a fixed point of itself (measured on the stand-in: from the
 *    121st character on), so the third test alone would let go of the lines
 *    half-way and leave Lyrics `7,7,13,12` instead of `7,7,7,7,7,4`.
 * 3. Poem is not empty.
 * 4. The texts agree (DESK DEFAULT, "half" is the desk's number, not Dann's):
 *    the matched pairs number at least half of Lyrics' DISTINCT words, by the
 *    comparison's own folded form. A song that sings its poem three times still
 *    passes (its distinct words are the poem's); a Poem of the song's first few
 *    words does not, and neither does a different text sharing a few short
 *    words. (The first rule also let the Poem's side pass: a Poem fully matched
 *    by five words re-lined Lyrics as it was typed.)
 *
 * Where `layOutLikePoem` finds nothing to adopt, or the layout is what Lyrics
 * already is, the answer is null and nothing is said.
 */
import { comparePoem, layOutLikePoem, type Token } from './poem-compare';
import { sameWords } from './same-words';

const distinct = (tokens: Token[]): number => new Set(tokens.filter((t) => t.folded !== '').map((t) => t.folded)).size;

export function lyricsInPoemLines(lyrics: string, poem: string, previousPoem: string, scoreText: string, lastLaid = ''): string | null {
	if (scoreText === '' || poem.trim() === '' || !sameWords(lyrics, scoreText)) return null;
	const ilyasLines = !lyrics.trim().includes('\n') || lyrics === lastLaid || (previousPoem.trim() !== '' && layOutLikePoem(lyrics, previousPoem) === lyrics);
	if (!ilyasLines) return null;
	const cmp = comparePoem(lyrics, poem);
	if (!cmp || cmp.pairs.length === 0) return null;
	if (2 * cmp.pairs.length < distinct(cmp.lyrics)) return null;
	const laid = layOutLikePoem(lyrics, poem);
	return laid === null || laid === lyrics ? null : laid;
}
