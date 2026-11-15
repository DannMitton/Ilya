/**
 * Prints the vowel-space sheet on its own letter page (N.199 Step 2). The app prints by `window.print()` of the page, and its
 * print rules hide the drawer (`app.css`, `@media print`), where the sheet lives; so the sheet is mounted a second time as a
 * direct child of the body, the body is marked, the sheet's own print rules hide everything else (`VowelSpaceSheet.svelte`),
 * and the mount is taken down when the dialogue closes. The copy on the screen is not touched. Letter portrait is the page
 * (`app.css` `@page`); A4 is the print dialogue's to choose.
 */
import { mount, unmount } from 'svelte';
import type { Language } from '$lib/i18n';
import type { CalibratedFormant, Vowel } from '../engine/types';
import VowelSpaceSheet from './VowelSpaceSheet.svelte';

export const PRINT_ROOT_CLASS = 'vowel-sheet-print-root';
export const PRINTING_BODY_CLASS = 'printing-vowel-sheet';

export interface PrintSheetInput {
	profile: Partial<Record<Vowel, CalibratedFormant>>;
	voiceType?: string;
	language: Language;
	voiceName?: string;
}

export function printVowelSheet(input: PrintSheetInput): void {
	if (typeof document === 'undefined') return;
	const root = document.createElement('div');
	root.className = PRINT_ROOT_CLASS;
	document.body.appendChild(root);
	const app = mount(VowelSpaceSheet, { target: root, props: { ...input, forPrint: true } });
	document.body.classList.add(PRINTING_BODY_CLASS);
	let cleaned = false;
	const cleanUp = () => {
		if (cleaned) return;
		cleaned = true;
		window.removeEventListener('afterprint', cleanUp);
		void unmount(app);
		root.remove();
		document.body.classList.remove(PRINTING_BODY_CLASS);
	};
	window.addEventListener('afterprint', cleanUp);
	// Two frames, so the sheet and the Lato IPA subset have laid out before the dialogue takes its picture.
	const fontsReady = document.fonts?.ready ?? Promise.resolve();
	void fontsReady.then(() =>
		requestAnimationFrame(() =>
			requestAnimationFrame(() => {
				try {
					window.print();
				} finally {
					// Chromium holds `print()` until the dialogue closes; where it does not, `afterprint` takes the sheet down.
					if (!('onafterprint' in window)) cleanUp();
				}
			})
		)
	);
}
