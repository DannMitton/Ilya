/**
 * The destinations, the documents Studio holds, and the id each one is known by.
 *
 * This type lived in `Drawer/TabBar.svelte` until N.73 S1 deleted that
 * component. It is not drawer furniture and never was: `+page.svelte` holds
 * the active destination, `HeaderBar` keys its colour from it, and the drawer
 * only receives it. So it lives here, in a module with no component attached.
 *
 * N.73 S3 ship two splits the one type into two, which is what its header has
 * asked for since S1. `TabId` carried two meanings at once: WHERE the singer
 * is, and WHICH paper Studio has on the desk. S2 merged the two Studio
 * drawers, so the second meaning stopped being a destination and became a
 * property of one. The two are separate values now, and `TabId` is what is
 * left: the wire id, and the four-way surface name the app bar and the desk
 * head still key their hue from.
 *
 * The ids are wire values. They are written to `localStorage` under
 * `ilya:activeTab` and read back on load, so renaming one breaks every
 * singer's stored destination. The split does not rename any of them and
 * writes the same four strings it always wrote.
 *
 * `shane` is Studio's second document, shown to the singer as "Marked score"
 * (« Partition annotée »). The engine codename stays in the code.
 */
import { INCLUDE_SHANE } from '$lib/wall';

/** Where the singer is. THREE, not four: Studio holds two documents. */
export type Destination = 'studio' | 'learn' | 'guide';

/** Which paper Studio has on the desk. */
export type StudioDocument = 'transcription' | 'shane';

/**
 * The wire id, and the surface name. Four strings, unchanged since S1.
 * Two things still want a four-way answer and both are right to: `HeaderBar`
 * paints four hues for four working surfaces (Dann's ruling of 2026-08-19),
 * and `DeskHead` draws four names. Everything that asks WHERE reads
 * `Destination`, and everything that asks WHICH PAPER reads `StudioDocument`.
 */
export type TabId = 'transcription' | 'learn' | 'guide' | 'shane';

/** Where the singer is, and which paper is on the desk, together. */
export interface Surface {
	destination: Destination;
	studioDocument: StudioDocument;
}

/** The surface a singer arrives at with nothing stored, or nothing readable. */
export const DEFAULT_SURFACE: Surface = { destination: 'studio', studioDocument: 'transcription' };

/** The wire id for a surface. This is what `ilya:activeTab` stores. */
export function tabIdFor({ destination, studioDocument }: Surface): TabId {
	return destination === 'studio' ? studioDocument : destination;
}

/** The surface a wire id names. Total over the four ids. */
export function surfaceFor(id: TabId): Surface {
	switch (id) {
		case 'transcription':
			return { destination: 'studio', studioDocument: 'transcription' };
		case 'shane':
			return { destination: 'studio', studioDocument: 'shane' };
		case 'learn':
			return { destination: 'learn', studioDocument: 'transcription' };
		case 'guide':
			return { destination: 'guide', studioDocument: 'transcription' };
	}
}

/**
 * THE STORED-TAB MIGRATION. N.73 S3 ship two, per E.27 §3.4: "stored
 * active-tab values `transcription` and `shane` both map to Studio,
 * explicitly, so nothing falls through silently."
 *
 * Before this, an unrecognised stored value was dropped by a four-way string
 * comparison and `activeTab` kept its default, which gave the right answer for
 * the wrong reason and said nothing about what it had refused. Every value is
 * named here, and a browser that saved any of the four lands where it did
 * before.
 *
 * `shane` with the wall closed is the one case that does NOT round-trip, and
 * it is deliberate: the marked score is compiled out, so the surface it names
 * does not exist in that build. It maps to Studio's transcription, which is
 * where the same value landed before the split, by falling through.
 */
export function restoreSurface(stored: string | null): Surface {
	switch (stored) {
		case 'transcription':
			return surfaceFor('transcription');
		case 'shane':
			return INCLUDE_SHANE ? surfaceFor('shane') : DEFAULT_SURFACE;
		case 'learn':
			return surfaceFor('learn');
		case 'guide':
			return surfaceFor('guide');
		default:
			return DEFAULT_SURFACE;
	}
}
