/**
 * THE MEASURE SWITCH (N.200 Step 3). With `?measure=open` in the address, a take is read by the open picker (`engine/open-extract.ts`):
 * no vowel, no voice type, and no other singer's voice reaches into it. Read at the session boundary (`captureSessionFor`,
 * `chart/stub-switch.ts`), in every build, so Dann can score it on the lane's deployment and on a release build alike. Step 6
 * makes it the default; until the desk says so, a singer who does not type it is read by the picker the app has always used.
 */
import type { Picker } from '../engine/analyze';

export function measurePicker(search: string = typeof location === 'undefined' ? '' : location.search): Picker {
	return new URLSearchParams(search).get('measure') === 'open' ? 'open' : 'shipped';
}
