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
 *    a drop leaves, or it equals `layOutLikePoem(Lyrics, the previous Poem)`
 *    exactly. A Lyrics the singer broke into lines of her own keeps them.
 * 3. Poem is not empty.
 * 4. The texts agree (DESK DEFAULT, "half" is the desk's number, not Dann's):
 *    at least half of Lyrics' words, or at least half of the Poem's, are
 *    matched. Below that the two are different texts that share a few short
 *    words, and re-lining one by the other would be wrong.
 *
 * Where `layOutLikePoem` finds nothing to adopt, or the layout is what Lyrics
 * already is, the answer is null and nothing is said.
 */
import { comparePoem, layOutLikePoem, type Token } from './poem-compare';
import { sameWords } from './same-words';

const words = (tokens: Token[]): number => tokens.filter((t) => t.folded !== '').length;

export function lyricsInPoemLines(lyrics: string, poem: string, previousPoem: string, scoreText: string): string | null {
	if (scoreText === '' || poem.trim() === '' || !sameWords(lyrics, scoreText)) return null;
	const ilyasLines = !lyrics.trim().includes('\n') || (previousPoem.trim() !== '' && layOutLikePoem(lyrics, previousPoem) === lyrics);
	if (!ilyasLines) return null;
	const cmp = comparePoem(lyrics, poem);
	if (!cmp || cmp.pairs.length === 0) return null;
	if (2 * cmp.pairs.length < words(cmp.lyrics) && 2 * cmp.pairs.length < words(cmp.poem)) return null;
	const laid = layOutLikePoem(lyrics, poem);
	return laid === null || laid === lyrics ? null : laid;
}
