/**
 * The reader's version, as stored beside a kept reading.
 *
 * A reading is kept with the song (`CONTRACT.md` §6; Dann 2026-10-01 23:18:
 * "read once and keep both the scan and the reading"), and it is only as good
 * as the reader that made it. The stamp names that reader: the `homr-web`
 * package version and the model. A stored reading is used again only while
 * its stamp equals `READER_STAMP`; a different one is read again, because the
 * newer reader may read the page better and nobody should have to ask.
 *
 * Kept in a file of its own, with no import, so the intake can state it
 * without loading `homr-web`. `stamp.test.ts` checks it against the package
 * that is installed, so a bump of the dependency cannot leave it behind.
 */

import type { KeptSystem } from './kept-bands';

/** The `version` of the installed `homr-web` package. */
export const HOMR_WEB_VERSION = '0.2.0-ilya.7';

/** The model `createRecognizer` is asked for (`homr-reader.ts`). */
export const OMR_MODEL = '465';


/**
 * The underlay reader's version (N.135): the reader that reads the words
 * printed under the notes, its rule for seating them, and the sewing.
 *
 * JOINED TO `READER_STAMP` (integration step 8a, 2026-11-09, after Dann ruled on 2026-11-09 11:56 that scan words ship to
 * colleagues as a preview and removed the `?words=read` switch). A change to the stamp spends the one silent re-read every stored
 * scan gets (`plan-scan-reader_r4`): every scan kept before this commit has the homr-only stamp, fails `isCurrent`, and is read
 * again once on its next opening, this time with the words. `stamp.test.ts` pins that the two are joined.
 *
 * Bumped when the reader's output changes, because `isCurrent` compares a kept
 * reading's stamp by equality (`restore.ts`) and a reading kept with the switch
 * on would otherwise be reused and never read again. `underlay@0` was stage 2b
 * as first built (the words written only where every page passed, a Russian
 * row at half the words known); `underlay@1` is brief r5 (a system that cannot
 * be read loses only itself, a Russian row at three in ten, the clitics
 * folded, the band ended in the ink). A reading kept as `underlay@0` is read
 * again once with the switch on. `underlay@2` is brief r5 steps 5 to 9: the
 * clitic match reads the modern spelling, so a printed «въ» folds into its host
 * as a «в» does (a reading kept as `underlay@1` is read again once). `underlay@3`
 * is the row fallback (N.135): a system with no Russian row seats the first
 * row the dictionary sews into words (a reading kept as `underlay@2` is read
 * again once). `underlay@4` is row 181 steps 1 to 3: the print's extender line is read (a long dash is
 * no longer dropped, `<extend>` rides with the reading), the second look is made, and the reading keeps where each system's
 * lyric band stood (`bands`); a reading kept as `underlay@3` is read again once, on its next opening. `underlay@5` is row 181 B0
 * and B0g: each syllable is placed where its own vowel's ink is, not a share of the way along the word's box, and a grace note or
 * a chord tone takes no syllable, so the same page seats differently (a reading kept as `underlay@4` is read again once). `underlay@6`
 * reads nothing differently; it marks that the reader's files are served, so a scan kept while they were not (kept with no words, and
 * current under `underlay@5`) is read again once. RULED by Dann 2026-11-11 23:37.
 */
export const UNDERLAY_READER = 'underlay@6';

/** What a kept reading is stamped with: the homr reader and the underlay reader together (`homr-web@V/model+underlay@N`). */
export const READER_STAMP = `homr-web@${HOMR_WEB_VERSION}/${OMR_MODEL}+${UNDERLAY_READER}`;

/** A scan's reading, kept with the song: homr's joined MusicXML and the reader that made it. */
export interface KeptReading {
	musicXml: string;
	stamp: string;
	/**
	 * Row 181 step 3, ADDITIVE: where each voice system's lyric band stood on the scan's pages, as fractions (`kept-bands.ts`).
	 * A reading without it reads as before. The band's picture is not kept; it is cut from the stored scan when it is asked for.
	 */
	bands?: KeptSystem[];
}
