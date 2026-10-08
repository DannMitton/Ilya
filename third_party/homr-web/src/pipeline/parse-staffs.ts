// Changed by the Ilya project, 2026-10-05: drops lower2 as well as lower on a single staff, as homr main does (staff_parsing_tromr.py, 560ca5c), the same result for model 396; maps note positions back to the input image with model 465. 0.2.0-ilya.3 (2026-10-06): the number of voices is the largest system's. 0.2.0-ilya.4 (2026-10-06): a system that does not print the top staff gives that voice rests, and its grand staff stays with the piano. 0.2.0-ilya.5 (2026-10-08): a piano whose brace was not found is joined into its grand staff.
/**
 * staff_parsing.py's parse_staffs and parse_staff_image, with
 * staff_parsing_tromr.py's predict_best between them: canvas, encoder,
 * decoder, and the lower-position filter for a single staff.
 */

import { followsHomrMain } from "../model/homr-version.js";
import { barLengthsMain } from "../musicxml/generate-main.js";
import { type Ratio, compareRatio, ratio } from "../transformer/duration.js";
import { EMPTY, isLowerPosition } from "../transformer/vocabulary.js";
import type { OpenCv } from "../cv/opencv.js";
import type { GrayImage } from "../image/plane.js";
import { DetectionError, type StaffCanvas } from "../model/pipeline.js";
import {
  createMultiStaff,
  type MultiStaff,
  mergeStaffs,
  type Staff,
} from "../model/staff.js";
import type { ModelSession } from "../models/session.js";
import {
  type DecodeOptions,
  runDecoder,
  type TokenSequence,
} from "../transformer/decoder.js";
import { encodeCanvas } from "../transformer/encoder.js";
import { removeDuplicatedSymbols } from "../transformer/remove-duplicated-symbols.js";
import {
  createEncodedSymbol,
  type DecodedSymbol,
  type EncodedSymbol,
  NEWLINE,
} from "../transformer/symbol.js";
import {
  ensureSameNumberOfStaffs,
  type PointMapping,
  prepareStaffImageWithMapping,
  staffRegions,
} from "./staff-image.js";

/**
 * homr main's parse_staff_image (staff_parsing.py, commit 560ca5c): every
 * symbol with coordinates, chords excepted, gets them mapped back to the
 * input image.
 */
function withImageCoordinates(
  symbols: readonly DecodedSymbol[],
  toPage: PointMapping,
  pageToInput: PointMapping
): DecodedSymbol[] {
  return symbols.map((symbol) => {
    const center = symbol.coordinates;
    if (
      center === null ||
      symbol.rhythm.startsWith("chord") ||
      Number.isNaN(center.x) ||
      Number.isNaN(center.y)
    ) {
      return symbol;
    }
    return { ...symbol, imageCoordinates: pageToInput(toPage(center)) };
  });
}

export interface TransformerSessions {
  readonly decoder: ModelSession;
  readonly encoder: ModelSession;
}

/** predict_best: a single staff keeps no symbol placed on a lower staff. */
export function filterPositions(
  symbols: TokenSequence,
  isGrandstaff: boolean
): DecodedSymbol[] {
  return isGrandstaff
    ? [...symbols]
    : symbols.filter((symbol) => !isLowerPosition(symbol.position));
}

/** parse_staff_tromr on a prepared canvas: what tokens-<n>.json holds. */
export async function parseStaffCanvas(
  sessions: TransformerSessions,
  canvas: StaffCanvas,
  options: DecodeOptions = {}
): Promise<DecodedSymbol[]> {
  const context = await encodeCanvas(
    sessions.encoder,
    sessions.decoder,
    canvas.image
  );
  try {
    const symbols = await runDecoder(sessions.decoder, context, options);
    return filterPositions(symbols, canvas.staff.isGrandstaff);
  } finally {
    context.dispose();
  }
}

/**
 * The per-voice tail of parse_staffs: an empty staff is skipped, every other
 * staff gains a newline, and the voice is cleaned once.
 */
export function joinVoice(
  staffs: readonly (readonly EncodedSymbol[])[]
): EncodedSymbol[] {
  const voice: EncodedSymbol[] = [];
  for (const staff of staffs) {
    if (staff.length > 0) {
      voice.push(...staff, createEncodedSymbol(NEWLINE));
    }
  }
  return removeDuplicatedSymbols(voice);
}

export interface ParseStaffsOptions extends DecodeOptions {
  /** After each staff's canvas ("dewarp") and after its tokens ("staff"), with the staffs done and the page's count. */
  readonly onStaff?: (
    stage: "dewarp" | "staff",
    done: number,
    total: number
  ) => void;
  /** With model 465: maps page pixels back to the input image, to fill imageCoordinates (Ilya project, after homr main). */
  readonly pageToInput?: PointMapping;
}

/**
 * Added by the Ilya project (0.2.0-ilya.4). For each system, how many voices
 * down its first staff goes.
 *
 * In a song the voice's staff is printed above the piano's, and where the
 * voice rests for some bars an engraver may leave its staff out: the system
 * is the piano's grand staff alone (Kabalevsky op. 52, nos. 4 and 7). homr
 * gives each system's staffs to the voices from the top, so the piano's
 * grand staff of such a system became the voice. A musician reads that
 * system as the voice resting and the piano playing, each in its own part.
 *
 * So, with model 465: take the first of the largest systems as the page's
 * layout. When it has single staffs above its first grand staff, and a
 * system begins with a grand staff, that system's staffs move down by the
 * number of those single staffs, as long as they still fit. Every other
 * system, and every page whose systems all begin alike, keeps homr's order
 * (offset 0).
 */
export function systemOffsets(
  systems: readonly MultiStaff[],
  voiceCount: number
): number[] {
  const offsets = systems.map(() => 0);
  if (!followsHomrMain()) {
    return offsets;
  }
  const layout = systems.find((system) => system.staffs.length === voiceCount);
  const above =
    layout === undefined
      ? -1
      : layout.staffs.findIndex((staff) => staff.isGrandstaff);
  if (above <= 0) {
    return offsets;
  }
  return systems.map((system) => {
    const [first] = system.staffs;
    return first?.isGrandstaff && system.staffs.length + above <= voiceCount
      ? above
      : 0;
  });
}

/**
 * Added by the Ilya project (0.2.0-ilya.5). The piano of a system whose brace
 * homr did not find, joined into the grand staff it is.
 *
 * In a song the piano is printed on two staffs joined by a brace, below the
 * voice. homr makes the two one grand staff only where it scores the brace;
 * where it does not, the piano arrives as two single staffs at the bottom of
 * a system of single staffs (Grechaninov op. 20 no. 4, the last systems of
 * pages 2 and 5: voice, piano, piano; Varlamov, «Скажи, зачем?», the first
 * system of page 3). The page then holds systems of different shapes, homr's
 * regrouping by the grand-staff flags cannot match them, and a piano staff
 * becomes the voice.
 *
 * A musician reads the bottom two staffs of such a system as its piano,
 * because the page's other systems show the piano there. So, with model 465:
 * on a page where a single staff stands directly above a grand staff (a
 * voice over its piano), a system of two or more single staffs and no grand
 * staff has its bottom two merged into one grand staff, as homr merges a
 * pair it finds a brace for. A system with a grand staff directly below it
 * is left alone: its single staffs are voices over that piano (a duet).
 */
export function joinUnbracedPianos(
  multiStaffs: readonly MultiStaff[]
): readonly MultiStaff[] {
  if (!followsHomrMain()) {
    return multiStaffs;
  }
  const flat = multiStaffs
    .flatMap((system) => system.staffs)
    .sort((a, b) => a.minY - b.minY);
  const songLayout = flat.some(
    (staff, i) => !staff.isGrandstaff && flat[i + 1]?.isGrandstaff === true
  );
  if (!songLayout) {
    return multiStaffs;
  }
  return multiStaffs.map((system) => {
    const { staffs } = system;
    if (staffs.length < 2 || staffs.some((staff) => staff.isGrandstaff)) {
      return system;
    }
    const last = staffs.at(-1);
    const next = flat.find((staff) => last !== undefined && staff.minY > last.maxY);
    const upper = staffs.at(-2);
    if (next?.isGrandstaff === true || upper === undefined || last === undefined) {
      return system;
    }
    let piano: Staff;
    try {
      piano = mergeStaffs(upper, last);
    } catch (error) {
      if (error instanceof DetectionError) {
        return system;
      }
      throw error;
    }
    return createMultiStaff([...staffs.slice(0, -2), piano], system.connections);
  });
}

const WHOLE_BAR_RESTS: readonly (readonly [Ratio, string])[] = [
  [ratio(1), "rest_1"],
  [ratio(3, 4), "rest_2."],
  [ratio(1, 2), "rest_2"],
  [ratio(3, 8), "rest_4."],
  [ratio(1, 4), "rest_4"],
  [ratio(3, 16), "rest_8."],
  [ratio(1, 8), "rest_8"],
  [ratio(1, 16), "rest_16"],
  [ratio(1, 32), "rest_32"],
];

const restSymbol = (rhythm: string): EncodedSymbol =>
  createEncodedSymbol(rhythm, {
    articulation: EMPTY,
    lift: EMPTY,
    pitch: EMPTY,
    position: "upper",
    slur: EMPTY,
  });

/**
 * Added by the Ilya project (0.2.0-ilya.4). The staff of a voice that a
 * system does not print: in each bar of the staff that is printed (the
 * piano's), rests as long as that bar, written with the fewest rests (one,
 * whenever the bar is a whole, half, quarter or eighth, dotted or not), and
 * the same bar lines.
 */
export function restsForBars(printed: readonly EncodedSymbol[]): EncodedSymbol[] {
  const lengths = barLengthsMain(printed);
  const barlines = printed.filter(
    (symbol) =>
      symbol.rhythm.includes("barline") || symbol.rhythm.includes("repeat")
  );
  const staff: EncodedSymbol[] = [];
  for (const [index, length] of lengths.entries()) {
    let left = length;
    for (const [value, rhythm] of WHOLE_BAR_RESTS) {
      while (compareRatio(left, value) >= 0) {
        staff.push(restSymbol(rhythm));
        left = ratio(left.num * value.den - value.num * left.den, left.den * value.den);
      }
    }
    const barline = barlines[index];
    if (barline !== undefined) {
      staff.push(createEncodedSymbol(barline.rhythm));
    }
  }
  return staff;
}

/** parse_staffs: one symbol list per voice, staffs parsed one at a time in homr's order. */
export async function parseStaffs(
  cv: OpenCv,
  sessions: TransformerSessions,
  multiStaffs: readonly MultiStaff[],
  page: GrayImage,
  options: ParseStaffsOptions = {}
): Promise<EncodedSymbol[][]> {
  // Changed by the Ilya project (0.2.0-ilya.5): a piano whose brace was not
  // found is joined into its grand staff first (joinUnbracedPianos).
  const systems = ensureSameNumberOfStaffs(
    joinUnbracedPianos(multiStaffs),
    page.height
  );
  const regions = staffRegions(systems);
  // Changed by the Ilya project (0.2.0-ilya.3): the largest system sets the
  // number of voices, because a page whose systems are kept as detected
  // (regroupingCutsASystem in staff-image.ts) may hold systems of different
  // sizes. With systems of one size this is homr's own count.
  const voiceCount = Math.max(0, ...systems.map((system) => system.staffs.length));
  // Changed by the Ilya project (0.2.0-ilya.4): a system that leaves out the
  // voice's staff moves down (systemOffsets), and the voice gets rests there.
  const offsets = systemOffsets(systems, voiceCount);
  const total = systems.reduce(
    (sum, system) => sum + Math.min(system.staffs.length, voiceCount),
    0
  );
  let done = 0;
  const parsed: (DecodedSymbol[] | undefined)[][] = [];
  for (let voice = 0; voice < voiceCount; voice += 1) {
    const staffs: (DecodedSymbol[] | undefined)[] = [];
    for (const [index, system] of systems.entries()) {
      const staff = system.staffs[voice - (offsets[index] ?? 0)];
      if (staff === undefined) {
        staffs.push(undefined);
        continue;
      }
      const { canvas, toPage } = prepareStaffImageWithMapping(
        cv,
        staff,
        page,
        regions
      );
      options.onStaff?.("dewarp", done + 1, total);
      // biome-ignore lint/performance/noAwaitInLoops: one staff at a time, as homr does; the sessions share one WebAssembly arena
      const symbols = await parseStaffCanvas(sessions, canvas, options);
      staffs.push(
        options.pageToInput === undefined
          ? symbols
          : withImageCoordinates(symbols, toPage, options.pageToInput)
      );
      done += 1;
      options.onStaff?.("staff", done, total);
    }
    parsed.push(staffs);
  }
  return parsed.map((staffs, voice) =>
    joinVoice(
      staffs.flatMap((staff, index) => {
        if (staff !== undefined) {
          return [staff];
        }
        const offset = offsets[index] ?? 0;
        const printed = parsed[offset]?.[index];
        return voice < offset && printed !== undefined
          ? [restsForBars(printed)]
          : [];
      })
    )
  );
}
