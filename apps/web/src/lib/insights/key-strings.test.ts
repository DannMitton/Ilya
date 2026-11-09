/**
 * N.182 (row 71): the 43 `insights.key.*` strings, English and French, RATIFIED by Dann 2026-11-05 11:52 to 11:59 and
 * recorded in `docs/memory/OPEN.md` ("ROW 71 (N.182): THE 43 `insights.key.*` ENGLISH STRINGS, RATIFIED" and "... FRENCH
 * STRINGS, RATIFIED"). The expected values below are written out here, character by character, and are NOT read back
 * out of `i18n.ts`: a pin that read its own source could never fail.
 *
 * It checks three things: each key holds exactly the ratified English and French; no other `insights.key.*` key exists
 * (an extra one would be a string nobody ratified); and the French follows the OQLF (U+00A0 before a colon, none before
 * a semicolon, U+2019 and not a straight apostrophe). When it fails, either the seated text drifted from the ratified
 * text or the ratified text was changed without this table, and a singer reads wording Dann did not rule. It relates to
 * `key-lines.test.ts` (which pins how the lines are built from these words) and to `i18n.test.ts` (the OQLF table over
 * `i18n.ts` as a whole).
 *
 * Five English strings carry Dann's or the desk's wording (OPEN.md says "five" and lists seven: the three `suits.*`,
 * `noneBetter`, `noWorkable`, `why.range`, `fraction.most`); the other 36 are Code's proposals, ratified as written.
 * `\u00a0` is the no-break space.
 */
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { t } from '../i18n';

const RATIFIED: ReadonlyArray<readonly [string, string, string]> = [
	['insights.key.suits.primo', 'No alternate key suggested: as it stands, the song stays inside your range and below {primo}.', 'Aucune autre tonalité suggérée\u00a0: telle quelle, la mélodie reste dans votre ambitus et sous {primo}.'],
	['insights.key.suits.secondo', 'No alternate key suggested: as it stands, the song stays inside your range and below {secondo}.', 'Aucune autre tonalité suggérée\u00a0: telle quelle, la mélodie reste dans votre ambitus et sous {secondo}.'],
	['insights.key.suits.range', 'No alternate key suggested: as it stands, the song stays inside your range.', 'Aucune autre tonalité suggérée\u00a0: telle quelle, la mélodie reste dans votre ambitus.'],
	['insights.key.noneBetter', 'No better key: no other key within a tritone eases these challenges.', 'Aucune meilleure tonalité\u00a0: aucune autre tonalité à moins d’un triton n’atténue ces difficultés.'],
	['insights.key.noWorkable', 'No key within a tritone brings this song inside your range. Taking it on as a technical project, or choosing other repertoire, is your decision.', 'Aucune tonalité à moins d’un triton ne fait entrer cette mélodie dans votre ambitus. L’aborder comme un projet technique, ou choisir un autre répertoire, vous revient.'],
	['insights.key.line', '{readout}: {parts}.', '{readout}\u00a0: {parts}.'],
	['insights.key.where.bar', 'bar {n}', 'la mesure {n}'],
	['insights.key.where.bars', 'bars {from} to {to}', 'les mesures {from} à {to}'],
	['insights.key.where.and', '{a} and {b}', '{a} et {b}'],
	['insights.key.where.elsewhere', '{where}, and elsewhere', '{where}, et ailleurs'],
	['insights.key.part.inside', 'stays inside your range', 'reste dans votre ambitus'],
	['insights.key.part.above', 'reaches above your range in {where}', 'dépasse votre ambitus vers l’aigu dans {where}'],
	['insights.key.part.below', 'reaches below your range in {where}', 'dépasse votre ambitus vers le grave dans {where}'],
	['insights.key.part.by', '{part}, by {interval}', '{part} ({interval} au-delà)'],
	['insights.key.part.semitones', '{n} semitones', '{n} demi-tons'],
	['insights.key.part.primo', '{fraction} of the singing sits at or above {primo}', '{fraction} du chant se situe à la hauteur de {primo} ou au-dessus'],
	['insights.key.part.primoSome', 'some of the singing sits at or above {primo}', 'une partie du chant se situe à la hauteur de {primo} ou au-dessus'],
	['insights.key.part.primoNone', 'nothing sits at or above {primo}', 'rien ne se situe à la hauteur de {primo} ou au-dessus'],
	['insights.key.part.secondo', '{fraction} of the singing sits above {secondo}', '{fraction} du chant se situe au-dessus de {secondo}'],
	['insights.key.part.secondoSome', 'some of the singing sits above {secondo}', 'une partie du chant se situe au-dessus de {secondo}'],
	['insights.key.part.secondoNone', 'nothing sits above {secondo}', 'rien ne se situe au-dessus de {secondo}'],
	['insights.key.part.sustained', 'a sustained note above {secondo}, in bar {bar}', 'une note tenue au-dessus de {secondo}, à la mesure {bar}'],
	['insights.key.part.sustainedNone', 'no sustained note above {secondo}', 'aucune note tenue au-dessus de {secondo}'],
	['insights.key.part.turn', '{fraction} of the singing sits past where your vowels turn', '{fraction} du chant se situe au-delà du changement de timbre de vos voyelles'],
	['insights.key.terse.above', 'above your range in {where}', 'au-dessus de votre ambitus dans {where}'],
	['insights.key.terse.below', 'below your range in {where}', 'sous votre ambitus dans {where}'],
	['insights.key.why.range', 'beyond the range you gave', 'au-delà de l’ambitus que vous avez indiqué'],
	['insights.key.why.passaggio', 'where the voice turns', 'au changement de timbre de la voix'],
	['insights.key.why.sustained', 'a long note in the upper passaggio', 'une note longue dans le *passaggio* supérieur'],
	['insights.key.fraction.quarter', 'about a quarter', 'environ un quart'],
	['insights.key.fraction.third', 'about a third', 'environ un tiers'],
	['insights.key.fraction.nearHalf', 'nearly half', 'près de la moitié'],
	['insights.key.fraction.half', 'about half', 'environ la moitié'],
	['insights.key.fraction.most', 'more than half', 'plus de la moitié'],
	['insights.key.noun.primo.plain', 'your first passaggio', 'votre premier *passaggio*'],
	['insights.key.noun.primo.working', 'your primo', 'votre *primo*'],
	['insights.key.noun.primo.technical', 'your primo passaggio', 'votre *primo passaggio*'],
	['insights.key.noun.secondo.plain', 'your second passaggio', 'votre second *passaggio*'],
	['insights.key.noun.secondo.working', 'your secondo', 'votre *secondo*'],
	['insights.key.noun.secondo.technical', 'your secondo passaggio', 'votre *secondo passaggio*'],
	['insights.key.reveal.higher', 'Show keys that reach higher', 'Afficher les tonalités plus aiguës'],
	['insights.key.reveal.lower', 'Show keys that reach lower', 'Afficher les tonalités plus graves'],
	['insights.key.reveal.both', 'Show keys that reach higher or lower', 'Afficher les tonalités plus aiguës ou plus graves'],
];

describe('the 43 insights.key.* strings, as Dann ratified them (2026-11-05)', () => {
	it('has exactly 43 keys, in the ratified order', () => {
		expect(RATIFIED).toHaveLength(43);
		const src = readFileSync(new URL('../i18n.ts', import.meta.url), 'utf8');
		const seated = [...src.matchAll(/^\t'(insights\.key\.[A-Za-z.]+)':/gm)].map((m) => m[1]);
		expect(seated).toEqual(RATIFIED.map((r) => r[0]));
	});
	it.each(RATIFIED)('%s: English as ratified', (key, en) => {
		expect(t(key, 'en')).toBe(en);
	});
	it.each(RATIFIED)('%s: French as ratified', (key, _en, fr) => {
		expect(t(key, 'fr')).toBe(fr);
	});
	it('keeps the French typography the OQLF asks: U+00A0 before every colon, nothing before a semicolon, U+2019', () => {
		for (const [key, , fr] of RATIFIED) {
			expect(fr, key).not.toMatch(/[^\u00a0]:/);
			expect(fr, key).not.toMatch(/[\u00a0 ];/);
			expect(fr, key).not.toContain("'");
		}
	});
});
