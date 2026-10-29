/**
 * The hidden switch for the underlay reader (N.135 stage 2b): `?words=read` in
 * the address.
 *
 * With it off, nothing changes for a singer: no worker is made, no model is
 * fetched, the kept reading's stamp is the one it was. With it on, the scan
 * path reads the words printed under the voice staff (`underlay-page.ts`) and
 * the stamp is the reader's and the underlay reader's together, so that a
 * reading kept on one side of the switch is read again on the other, once.
 *
 * This is not `scan.ts`'s `?reader=ilya`, which is being retired (QUEUE row
 * 155); a different file, so the two lanes do not touch each other's.
 *
 * `UNDERLAY_READER` joins `READER_STAMP` itself in the commit that removes the
 * switch, after Dann has ratified the banner's new words (`stamp.ts`).
 */
import { READER_STAMP, UNDERLAY_READER } from './stamp';

/** The query that turns the underlay reader on. */
export const WORDS_QUERY = 'words';
export const WORDS_ON = 'read';

const here = (): string => (typeof location === 'undefined' ? '' : location.search);

/** True where the address carries `?words=read`. */
export function underlayOn(search: string = here()): boolean {
	return new URLSearchParams(search).get(WORDS_QUERY) === WORDS_ON;
}

/**
 * The stamp a reading is kept with, and compared with, on this side of the
 * switch: `READER_STAMP` with it off, as ever; `READER_STAMP+UNDERLAY_READER`
 * with it on (DESK DEFAULT on the separator).
 */
export function scanStamp(search: string = here()): string {
	return underlayOn(search) ? `${READER_STAMP}+${UNDERLAY_READER}` : READER_STAMP;
}
