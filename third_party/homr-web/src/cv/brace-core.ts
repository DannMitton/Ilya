// Added by the Ilya project, 2026-10-05: port of homr main's _trim_symbol_to_core_span (brace_dot_detection.py, 560ca5c).
/**
 * homr main's `_trim_symbol_to_core_span`: a brace candidate keeps only the
 * rows of its filled contour that are at least BRACE_CORE_WIDTH_RATIO as wide
 * as its widest row. The box keeps its centre x, width and angle; its centre
 * y and height become those of the kept rows. Used only with model 465.
 */

import type { RotatedBox } from "../geometry/boxes.js";
import { pointCount, type LegacyConventionRect } from "../geometry/boxes.js";
import { rotatedBoxFromRect } from "../geometry/box-transforms.js";
import { BRACE_CORE_WIDTH_RATIO } from "../model/constants.js";
import { pointListToMat } from "./mat-points.js";
import { type OpenCv, withMatScope } from "./opencv.js";

export function trimSymbolToCoreSpan(
  cv: OpenCv,
  symbol: RotatedBox
): RotatedBox {
  if (pointCount(symbol.contour) === 0) {
    return symbol;
  }
  return withMatScope((scope) => {
    const contour = pointListToMat(cv, scope, symbol.contour);
    const { x, y, width: w, height: h } = cv.boundingRect(contour);
    if (h <= 0 || w <= 0) {
      return symbol;
    }
    const shifted = Int32Array.from(symbol.contour, (value, i) =>
      i % 2 === 0 ? value - x : value - y
    );
    const shiftedMat = scope.keep(
      new cv.Mat(pointCount(symbol.contour), 1, cv.CV_32SC2)
    );
    shiftedMat.data32S.set(shifted);
    const mask = scope.keep(cv.Mat.zeros(h, w, cv.CV_8UC1));
    const contours = scope.keep(new cv.MatVector());
    contours.push_back(shiftedMat);
    cv.drawContours(mask, contours, -1, new cv.Scalar(255), cv.FILLED);
    const rowWidths: number[] = [];
    for (let row = 0; row < h; row += 1) {
      let count = 0;
      for (let col = 0; col < w; col += 1) {
        if (mask.data[row * w + col] !== 0) {
          count += 1;
        }
      }
      rowWidths.push(count);
    }
    const maxWidth = Math.max(...rowWidths);
    if (maxWidth === 0) {
      return symbol;
    }
    const coreRows = rowWidths
      .map((width, row) =>
        width >= maxWidth * BRACE_CORE_WIDTH_RATIO ? row : -1
      )
      .filter((row) => row >= 0);
    if (coreRows.length === 0) {
      return symbol;
    }
    const coreMinY = y + Math.min(...coreRows);
    const coreMaxY = y + Math.max(...coreRows) + 1;
    const coreHeight = coreMaxY - coreMinY;
    if (coreHeight <= 0) {
      return symbol;
    }
    const rect = {
      angle: symbol.rect.angle,
      cx: symbol.rect.cx,
      cy: (coreMinY + coreMaxY) / 2,
      h: coreHeight,
      w: symbol.rect.w,
    } as LegacyConventionRect;
    return rotatedBoxFromRect(rect, symbol.contour, symbol.debugId);
  });
}
