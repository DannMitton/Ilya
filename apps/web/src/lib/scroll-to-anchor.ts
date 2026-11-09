/**
 * Moved out of `routes/+page.svelte` (integration step 4, 2026-11-09), verbatim, to make room under that file's
 * line ceiling (`scripts/ratchets.json`); the function reads no page state, only the document and its fonts.
 * It checks nothing and returns nothing: given an anchor id it scrolls to it. If the id never appears it gives
 * up after 90 animation frames and leaves the scroll where it is. It relates to the Drawer's table of contents
 * (`handleHeadingNavigate`) and to the deep link in `routes/+page.svelte`, its two callers.
 */

/**
 * Scroll a lazily-rendered anchor to the top of the reading pane,
 * robust against post-scroll reflow. LearnContent/GuideContent fire
 * their ready signal in onMount, before the web fonts swap in and the
 * large glyph table settles, so a one-shot scrollIntoView undershoots:
 * the target moves down after the scroll has already landed. This
 * retries until the element exists, scrolls once, then re-snaps to the
 * target after the fonts are ready and across a short settle window,
 * correcting for that late reflow. Caught by Dann's sung-[o] deep link
 * landing at the Section 3 head instead of the note (2026-07-12).
 */
export function scrollToAnchor(id: string, smoothFirst = true) {
	let attempts = 0;
	const snap = (behavior: ScrollBehavior) =>
		document.getElementById(id)?.scrollIntoView({ behavior, block: 'start' });
	const find = () => {
		if (!document.getElementById(id)) {
			if (attempts++ < 90) requestAnimationFrame(find);
			return;
		}
		snap(smoothFirst ? 'smooth' : 'auto');
		// Corrective re-snaps: font swap and late layout shift the
		// target after the first scroll. Instant, so they only close
		// the residual gap rather than re-animating.
		[120, 300, 600].forEach((ms) => setTimeout(() => snap('auto'), ms));
		if (typeof document !== 'undefined' && 'fonts' in document) {
			document.fonts.ready.then(() => snap('auto')).catch(() => {});
		}
	};
	find();
}
