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

/** The `version` of the installed `homr-web` package. */
export const HOMR_WEB_VERSION = '0.2.0-ilya.7';

/** The model `createRecognizer` is asked for (`homr-reader.ts`). */
export const OMR_MODEL = '465';

/** What a kept reading is stamped with. */
export const READER_STAMP = `homr-web@${HOMR_WEB_VERSION}/${OMR_MODEL}`;

/**
 * The underlay reader's version (N.135): the reader that reads the words
 * printed under the notes, its rule for seating them, and the sewing.
 *
 * NOT joined to `READER_STAMP`. A change to the stamp spends the one silent
 * re-read every stored scan gets (`stamp.ts` above; `plan-scan-reader_r4`), and
 * while the feature is behind its address flag that re-read would carry no
 * words and never come again (review amendment 7). It joins `READER_STAMP` in
 * the commit that removes the flag. `stamp.test.ts` holds the two apart until
 * then.
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
 * again once).
 */
export const UNDERLAY_READER = 'underlay@3';

/** A scan's reading, kept with the song: homr's joined MusicXML and the reader that made it. */
export interface KeptReading {
	musicXml: string;
	stamp: string;
}
