/**
 * The scan reader's stamp, and the desk's measure-only switches for the underlay reader (N.135 stage 2b; row 181).
 *
 * The singer's switch, `?words=read`, is GONE (integration step 8a, 2026-11-09; Dann 2026-11-09 11:56: scan words ship to
 * colleagues as a preview). The words printed under the voice staff are always read on the scan path (`homr-reader.ts`,
 * `underlay-page.ts`), and `UNDERLAY_READER` is part of `READER_STAMP` (`stamp.ts`), so every scan kept before this change is
 * read again once on its next opening. What stays are the desk's measure switches below (`?looks=off`, `?extender=`), which
 * change no stamp and are not a singer's. `scanStamp` is kept as the one name the callers read the stamp by.
 */
import { READER_STAMP } from './stamp';

/** The stamp a reading is kept with, and compared with: the reader that is installed, with the underlay reader. */
export function scanStamp(): string {
	return READER_STAMP;
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
