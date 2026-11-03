/**
 * Where `routes/+page.svelte` calls the poem offer (poem library, build 1, step 4; review amendment 11).
 *
 * The page cannot be mounted in this suite, so this reads its source. It pins the one rule that cost a review
 * amendment: the match is NEVER called from `handleInput`. `claimDerivedPoem` calls `handleInput(text)` with the
 * default `how` of `'paste'` on a keystroke, so a hook there would fill Poem as the singer types. The hooks are at the
 * arrival sites only, and a paste into an empty Lyrics is the one site that runs from the field.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const page = readFileSync(join(__dirname, '../../routes/+page.svelte'), 'utf8');
const lines = page.split('\n');

/** The text of a top-level `function name(...) { ... }` in the page, by brace matching from its first line. */
function bodyOf(name: string): string {
	const from = lines.findIndex((l) => new RegExp(`^\\s*(async )?function ${name}\\b`).test(l));
	expect(from, `function ${name}`).toBeGreaterThanOrEqual(0);
	let depth = 0;
	let started = false;
	const out: string[] = [];
	for (let i = from; i < lines.length; i += 1) {
		out.push(lines[i]);
		for (const ch of lines[i].replace(/\/\*.*?\*\//g, '').replace(/\/\/.*$/, '')) {
			if (ch === '{') {
				depth += 1;
				started = true;
			} else if (ch === '}') depth -= 1;
		}
		if (started && depth === 0) break;
	}
	return out.join('\n');
}

describe('the poem offer is called from the arrival sites and never from handleInput', () => {
	it('handleInput does not mention the offer, and neither do the functions that call it on a keystroke', () => {
		expect(bodyOf('handleInput')).not.toContain('poemOffer');
		expect(bodyOf('claimDerivedPoem')).not.toContain('poemOffer');
		expect(bodyOf('adoptPoemLines')).not.toContain('poemOffer');
		expect(bodyOf('joinText')).not.toContain('poemOffer');
	});

	it('`offer` is called at exactly two sites', () => {
		expect(page.match(/poemOffer\.offer\(/g)).toHaveLength(2);
	});

	it('site 1: a Lyrics paste into an empty field, and only a paste', () => {
		const body = bodyOf('handlePoemInput');
		expect(body).toContain("const wasEmpty = doc.inputText.trim() === ''");
		expect(body).toMatch(/if \(wasEmpty && how === 'paste'\) void poemOffer\.offer\(text\)/);
		// ... after the field has taken the text, so the offer matches what the field now holds
		expect(body.indexOf('handleInput(text, how)')).toBeLessThan(body.indexOf('poemOffer.offer'));
	});

	it('site 2: a file’s or a scan’s words, in the fill of an empty Lyrics on an upload; a restore never reaches it', () => {
		const body = bodyOf('applyArrival');
		const fill = lines.find((l) => l.includes("if (fillText !== '')"))!;
		expect(fill).toContain('poemOffer.offer(fillText)');
		expect(body).toContain(fill); // inside the one function that places an arriving score
		// the fill's own gate, which the offer inherits: an upload (not a restore), Lyrics empty, the score carrying words
		expect(body).toContain("origin === 'upload' && !noLyrics && doc.inputText.trim() === ''");
	});

	it('the Poem field’s edits, Clear, a poem page, and the guard are told', () => {
		expect(bodyOf('handlePoemEdit')).toContain('poemOffer.onPoemEdit(before, text, how)');
		expect(page).toContain("onclearpoem={() => { doc.publishedPoem = ''; poemOffer.onClear(); }}");
		const pageBody = bodyOf('handlePoemPage');
		expect(pageBody).toContain('held: poemOffer.heldForGuard(doc.publishedPoem)');
		expect(pageBody).toContain('poemOffer.onReplace(); handlePoemEdit(t)');
	});

	it('the page attaches the offer once, with the open song asked for each time (the song can be replaced)', () => {
		expect(page.match(/poemOffer\.attach\(/g)).toHaveLength(1);
		expect(page).toContain('poemOffer.attach({ doc: () => doc, library: poemLibrary');
	});
});
