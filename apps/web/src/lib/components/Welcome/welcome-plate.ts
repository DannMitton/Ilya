/**
 * THE WELCOME PLATE'S NUMBERS (brief r2 item 5). The plate is one small square page, drawn in code, that turns over five times through six
 * images: я, [ɑ], the eighth note on a staff, the [ɑ] zone, the vowel space, the Илья icon. Nothing here draws; `WelcomePlate.svelte` turns
 * these into SVG. Every figure is either (a) computed from the chart's own code, or (b) the ratified prototype's own layout number, named and
 * marked JUDGEMENT. A test holds (a) to the prototype's printed values (`docs/sessions/welcome-sheet/ilya-welcome-draft-17.html`, the plate's
 * fifth layer), so the picture is the ratified one and not a drift from it.
 *
 * THE VOWEL SPACE IS NOT HARD-CODED. `computeZones({}, 'bass')` (`voice/chart/zones.ts`) gives the ten zones for a bass with nothing sung;
 * `fullView` and `project` (`voice/chart/geometry.ts`) place them; the radii use the same two formulas as `voice/chart/ChartLayers.svelte`
 * (`:52-62`): `rx = w * halfSpanSemitones * (ln 2 / 12) / (u0 - u1)` and `ry = h * (ln f1High - ln f1Low) / 2 / (v1 - v0)`. That is the other site
 * that computes these numbers; the two agree because the test below reproduces the prototype's numbers, which were taken from the chart.
 * Zone colours are the chart's (`voice/chart/colours.ts`), as CSS custom properties.
 */
import { computeZones } from '$lib/voice/chart/zones';
import { fullView, project } from '$lib/voice/chart/geometry';
import { zoneColour } from '$lib/voice/chart/colours';
import type { Vowel } from '$lib/voice/engine/types';

/** The plate's drawing box. Every layer is drawn in a 300 by 300 viewBox. JUDGEMENT: the prototype's. */
export const BOX = 300;

/** The voice the vowel space is drawn for: a bass, the low male voice of Mitton (2020). */
export const PLATE_VOICE = 'bass';

/** The chart frame inside the box (x, y, width, height). JUDGEMENT: the prototype's landscape box in the square plate (critique, failure 6). */
export const FRAME = { x: 16, y: 64, w: 268, h: 172 } as const;

/** The [ɑ] zone, enlarged to fill the plate on layer 4 (the fourth image). JUDGEMENT: the prototype's 2.7 (its ellipse is 89.7 by 103.7). */
export const ZOOM = 2.7;

/** The vowel whose zone and dot the plate singles out. */
export const ACTIVE: Vowel = 'ɑ';

/** Opacities as the chart sets them (`ChartLayers.svelte:59-60`, board D): 0.24 a Bozeman zone, 0.30 a personal zone on the guard's window, 0.15 on a placeholder, 0.5 when active. */
const PERSONAL: readonly Vowel[] = ['ɪ', 'ɨ', 'a', 'ʌ'];
const opacity = (vowel: Vowel, basis: 'guard' | 'placeholder'): number => (vowel === ACTIVE ? 0.5 : PERSONAL.includes(vowel) ? (basis === 'guard' ? 0.3 : 0.15) : 0.24);

const r1 = (n: number) => Math.round(n * 10) / 10;
const SEMITONE = Math.log(2) / 12;

export interface PlateZone {
	vowel: Vowel;
	/** The centre and radii in the 300-unit box. */
	cx: number;
	cy: number;
	rx: number;
	ry: number;
	/** `var(--zone-...)`. */
	fill: string;
	opacity: number;
}

export interface VowelSpace {
	zones: PlateZone[];
	/** The [ɑ] placeholder dot in the 300-unit box. */
	dot: { x: number; y: number };
}

/** The fifth image's numbers: every zone and the [ɑ] dot, in the 300-unit box, from the chart's own functions. */
export function vowelSpace(): VowelSpace {
	const set = computeZones({}, PLATE_VOICE);
	const view = fullView(
		set.zones,
		set.placeholders.map((p) => ({ f1: p.f1, f2: p.f2 }))
	);
	const spanU = view.u0 - view.u1;
	const spanV = view.v1 - view.v0;
	const zones = set.zones.map((z) => {
		const c = project(view, FRAME.w, FRAME.h, Math.sqrt(z.f1Low * z.f1High), z.f2Centre);
		return {
			vowel: z.vowel,
			cx: r1(FRAME.x + c.x),
			cy: r1(FRAME.y + c.y),
			rx: r1((FRAME.w * z.f2HalfSpanSemitones * SEMITONE) / spanU),
			ry: r1((FRAME.h * (Math.log(z.f1High) - Math.log(z.f1Low))) / 2 / spanV),
			fill: zoneColour(z.vowel),
			opacity: opacity(z.vowel, z.basis)
		};
	});
	const p = set.placeholders.find((q) => q.vowel === ACTIVE)!;
	const d = project(view, FRAME.w, FRAME.h, p.f1, p.f2);
	return { zones, dot: { x: r1(FRAME.x + d.x), y: r1(FRAME.y + d.y) } };
}

/** The fourth image: the [ɑ] zone alone, centred in the box and enlarged by `ZOOM`. */
export function activeZoneEnlarged(space: VowelSpace = vowelSpace()): PlateZone {
	const z = space.zones.find((q) => q.vowel === ACTIVE)!;
	return { ...z, cx: BOX / 2, cy: BOX / 2, rx: r1(z.rx * ZOOM), ry: r1(z.ry * ZOOM) };
}

/* ── the staff and the note ──────────────────────────────────────────────── */

/** The staff: five lines, 25 units apart, from x = 26 to x = 274, the middle line on the box's centre. JUDGEMENT: the prototype's. */
export const STAFF = { x1: 26, x2: 274, gap: 25, lines: 5 } as const;
export const STAFF_TOP = BOX / 2 - (STAFF.gap * (STAFF.lines - 1)) / 2;
export const staffLineYs = (): number[] => Array.from({ length: STAFF.lines }, (_, i) => STAFF_TOP + i * STAFF.gap);

/** The glyph: SMuFL `metNote8thUp`, U+E1D7 (an eighth note, stem up), in Bravura. It is the glyph `score/correction.ts` `LENGTH_CELLS` draws for "eighth" (`:201`, `:208`). */
export const NOTE_GLYPH = '';
/** Font size 100 makes a staff space 25 units (SMuFL: a staff space is a quarter of the font size), so the glyph sits on this staff exactly. */
export const NOTE_FONT_SIZE = STAFF.gap * 4;

/**
 * `metNote8thUp`'s bounding box from `static/fonts/bravura/bravura_metadata.json` (`glyphBBoxes.metNote8thUp`), in staff spaces. The 733 KB metadata is
 * not fetched for one glyph: the constant is pinned here and `welcome-plate.test.ts` reads the file and fails if they differ. (`note8thUp`, a different
 * glyph, is wider and taller; U+E1D7 is the metronome-mark form.)
 */
export const NOTE_BBOX = { sw: [0.0, -0.564], ne: [2.132, 2.784] } as const;

/**
 * The note's left edge, in box units: the ratified prototype's own `x = 134` (`ilya-welcome-draft-17.html`, line 84), so that the NOTEHEAD, not the whole
 * glyph with its flag, sits on the middle of the staff, as in the design Dann ratified. JUDGEMENT, the desk's amendment of 2026-11-16 (item 2). The first
 * build centred the glyph's bounding box instead (the brief's wording), which put the notehead about ten units left of the middle; the desk ruled for the
 * prototype's place. `NOTE_BBOX` stays as the pinned record of the glyph's box.
 */
export function noteX(): number {
	return 134;
}

/** The note's baseline: Bravura's noteheads sit on the baseline, so the middle line is the baseline. */
export const noteBaselineY = (): number => BOX / 2;

/* ── the icon ────────────────────────────────────────────────────────────── */

/** The five stripes of the Илья icon in tab order (ruled 2026-10-31): sage, lavender, rose, slate, cobalt jewels, as the tokens. */
export const ICON_STRIPES = ['var(--sage-jewel)', 'var(--lavender-jewel)', 'var(--rose-jewel)', 'var(--slate-jewel)', 'var(--cobalt-jewel)'] as const;
export const ICON_WORD = 'Илья';
