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
export const HOMR_WEB_VERSION = '0.2.0-ilya.5';

/** The model `createRecognizer` is asked for (`homr-reader.ts`). */
export const OMR_MODEL = '465';

/** What a kept reading is stamped with. */
export const READER_STAMP = `homr-web@${HOMR_WEB_VERSION}/${OMR_MODEL}`;

/** A scan's reading, kept with the song: homr's joined MusicXML and the reader that made it. */
export interface KeptReading {
	musicXml: string;
	stamp: string;
}
