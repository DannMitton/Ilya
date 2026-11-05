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

/** The query that turns the second look off (row 181): `?looks=off`. */
export const LOOKS_QUERY = 'looks';

/**
 * Whether the second look (`underlay-looks.ts`) is made: on, unless the address carries `?looks=off`. A measure switch like
 * `?extender=b`, not a singer's: the desk turns it off to separate step 1's count from step 2's on row 114. It changes no
 * stamp, so a reading kept with it off is current with it on; read the scan fresh for each arm.
 */
export function looksOn(search: string = here()): boolean {
	return new URLSearchParams(search).get(LOOKS_QUERY) !== 'off';
}

/** The query that chooses the extender arm (row 181 step 1): `?extender=a`, `?extender=b`, or none (off). */
export const EXTENDER_QUERY = 'extender';

/**
 * The setting of the extender rule (`underlay-extender.ts`) for a measurement: `?extender=a` or `?extender=b`; anything else,
 * including no query, is `off` (row 181 step 8a: no note is marked at all, and a long dash sews words as a hyphen does).
 * Not a singer's switch: the desk measures the three on row 114 and one becomes the only one.
 */
export function extenderArm(search: string = here()): 'off' | 'a' | 'b' {
	const v = new URLSearchParams(search).get(EXTENDER_QUERY);
	return v === 'a' || v === 'b' ? v : 'off';
}
