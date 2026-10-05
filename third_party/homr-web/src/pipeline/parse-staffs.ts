// Changed by the Ilya project, 2026-10-05: drops lower2 as well as lower on a single staff, as homr main does (staff_parsing_tromr.py, 560ca5c), the same result for model 396; maps note positions back to the input image with model 465.
/**
 * staff_parsing.py's parse_staffs and parse_staff_image, with
 * staff_parsing_tromr.py's predict_best between them: canvas, encoder,
 * decoder, and the lower-position filter for a single staff.
 */

import { isLowerPosition } from "../transformer/vocabulary.js";
import type { OpenCv } from "../cv/opencv.js";
import type { GrayImage } from "../image/plane.js";
import type { StaffCanvas } from "../model/pipeline.js";
import type { MultiStaff } from "../model/staff.js";
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

/** parse_staffs: one symbol list per voice, staffs parsed one at a time in homr's order. */
export async function parseStaffs(
  cv: OpenCv,
  sessions: TransformerSessions,
  multiStaffs: readonly MultiStaff[],
  page: GrayImage,
  options: ParseStaffsOptions = {}
): Promise<EncodedSymbol[][]> {
  const systems = ensureSameNumberOfStaffs(multiStaffs, page.height);
  const regions = staffRegions(systems);
  const voiceCount = systems[0]?.staffs.length ?? 0;
  const total = systems.reduce(
    (sum, system) => sum + Math.min(system.staffs.length, voiceCount),
    0
  );
  let done = 0;
  const voices: EncodedSymbol[][] = [];
  for (let voice = 0; voice < voiceCount; voice += 1) {
    const staffs: DecodedSymbol[][] = [];
    for (const system of systems) {
      const staff = system.staffs[voice];
      if (staff !== undefined) {
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
    }
    voices.push(joinVoice(staffs));
  }
  return voices;
}
