<script lang="ts">
	/**
	 * THE INTAKE WATERMARK (N.65). Dann's ruling, 2026-08-20.
	 *
	 * A large centred word inside each of the drawer's two intake fields,
	 * naming what that field takes: `text` in the textarea, `score` in the
	 * score drop zone. It sits IN ADDITION to the placeholder, which is
	 * unchanged. It is decorative, so it is `aria-hidden`: the placeholder
	 * already carries the instruction and a screen reader would only hear it
	 * twice.
	 *
	 * HUE NAMES PLACE, INSIDE THE FIELD AS WELL AS AT ITS EDGE. Sage names the
	 * text intake and lavender names the score intake, so the watermark takes
	 * `--light-sage` in the textarea and `--light-lavender` in the drop zone.
	 * DANN'S OWN CORRECTION: he first asked for light sage in both, the
	 * coordinating desk raised that a sage mark inside a lavender-bordered box
	 * breaks his hue rule, and he ruled "Light lavender for partition and
	 * score, my mistake."
	 *
	 * THIS COMPONENT DEFINES THE OVERSIZED-SANS CONVENTION RATHER THAN
	 * INHERITING IT. Dann asked for it to match "the large sans-serif font we
	 * use in our colour-blocked Learn and Guide meta headers." THOSE HEADERS DO
	 * NOT EXIST YET. They are drawn at
	 * `docs/sessions/fable-gui-mockup_r2_2026-08-18.html`, Exhibit 2, whose own
	 * caveat says its typefaces are stand-ins. His instruction was "the mockup
	 * can inspire our choice. Let's see it first and adapt if it needs
	 * tweaking."
	 *
	 * So the three shape values here are ADOPTED from that mockup's
	 * `.room-band h2` (`:94-95`), which is the only oversized sans this project
	 * has drawn: weight 700, `letter-spacing: -0.01em`, `line-height: 1.04`.
	 * The family is the project's own `--font-sans`, not the mockup's stand-in.
	 * **When the chapter bands are built, they match THIS.**
	 *
	 * WHY `40px` AND NOT A `rem`: the mockup names 40px and this adopts it
	 * whole rather than converting it. The value is deliberately fixed. This
	 * mark is decorative and `aria-hidden`, and the boxes it sits in are
	 * percentage-width, so a rem would grow the word while its box stayed put.
	 * The placeholder beneath it carries the instruction and still scales with
	 * a raised base font, which is the part that must.
	 */
	interface Props {
		/** The word. `t(...)`-keyed by the caller; never a literal. */
		word: string;
		/** `var(--light-sage)` for text intake, `var(--light-lavender)` for score. */
		colour: string;
	}

	let { word, colour }: Props = $props();
</script>

<span class="intake-watermark" aria-hidden="true" style="--watermark-colour: {colour}">{word}</span>

<style>
	.intake-watermark {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		/* Never catches a drag over the field, and never takes a click meant
		   for the textarea or the drop zone's own button. */
		pointer-events: none;
		user-select: none;
		-webkit-user-select: none;
		font-family: var(--font-sans);
		font-weight: 700;
		font-size: 40px;
		line-height: 1.04;
		letter-spacing: -0.01em;
		color: var(--watermark-colour);
	}
</style>
