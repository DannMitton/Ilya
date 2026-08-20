/**
 * The four destinations, and the id each one is known by.
 *
 * This type lived in `Drawer/TabBar.svelte` until N.73 S1 deleted that
 * component. It is not drawer furniture and never was: `+page.svelte` holds
 * the active destination, `HeaderBar` keys its colour from it, and the drawer
 * only receives it. So it lives here, in a module with no component attached.
 *
 * The ids are wire values. They are written to `localStorage` under
 * `ilya:activeTab` and read back on load, so renaming one breaks every singer's
 * stored destination.
 *
 * The stored-tab migration is N.73 S3, not S1 and not S2. It was S2's until
 * the coordinating desk moved it on 2026-08-20
 * (`docs/sessions/brief-to-code-n73-s2_r1_2026-08-20.md` §6): S2 merged the
 * two Studio drawers and left the ids alone, so a browser that saved either
 * one still lands where it did. Splitting this type into destination plus
 * document touches `HeaderBar`, `DeskHead`, `Drawer`, and the wall, and
 * folding that into S2's ship would have made a failed walk ambiguous.
 *
 * `shane` is Studio's second document, shown to the singer as "Marked score"
 * (« Partition annotée »). The engine codename stays in the code.
 */
export type TabId = 'transcription' | 'learn' | 'guide' | 'shane';
