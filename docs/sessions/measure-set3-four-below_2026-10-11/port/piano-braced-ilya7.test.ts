/**
 * Added by the Ilya project (0.2.0-ilya.7). On a page that prints the voice
 * above the piano, a system of three staffs that homr made a grand staff of
 * its top two (voice and the piano's upper staff) is regrouped as voice over
 * piano. "v" is a single staff, "g" a grand staff; `systems` gives each
 * system's three single staffs as detected, before any brace.
 */

import { afterEach, describe, expect, it } from "vitest";
import { pianoBracedAtTheBottom } from "../src/geometry/braces.js";
import { setActiveModel } from "../src/model/homr-version.js";
import {
  createMultiStaff,
  createStaff,
  createStaffPoint,
  type MultiStaff,
  mergeStaffs,
  type Staff,
} from "../src/model/staff.js";

let top = 100;
const single = (): Staff => {
  const y = Array.from({ length: 5 }, (_, i) => top + 20 * i);
  top += 300;
  return createStaff([createStaffPoint(100, y, 0), createStaffPoint(3000, y, 0)]);
};
/** Three staffs per system, and how homr braced them: "vg" (the piano's two), "gv" (voice and right hand), "vvv" (none). */
function page(braced: readonly string[]): { systems: MultiStaff[]; grouped: MultiStaff[] } {
  top = 100;
  const systems = braced.map(() => createMultiStaff([single(), single(), single()]));
  const grouped = systems.map((system, i) => {
    const [a, b, c] = system.staffs as [Staff, Staff, Staff];
    if (braced[i] === "vg") return createMultiStaff([a, mergeStaffs(b, c)]);
    if (braced[i] === "gv") return createMultiStaff([mergeStaffs(a, b), c]);
    return system;
  });
  return { systems, grouped };
}
const shapes = (systems: readonly MultiStaff[]) =>
  systems.map((s) => s.staffs.map((st) => (st.isGrandstaff ? "g" : "v")).join(""));

describe("0.2.0-ilya.7", () => {
  afterEach(() => setActiveModel("396"));

  it("regroups a voice braced to the right hand (Balakirev, Carl Fischer, page 8)", () => {
    setActiveModel("465");
    const { systems, grouped } = page(["vg", "vg", "gv"]);
    const out = pianoBracedAtTheBottom(systems, grouped);
    expect(shapes(out)).toEqual(["vg", "vg", "vg"]);
    expect(out[2]?.staffs[0]).toBe(systems[2]?.staffs[0]);
    expect(out[0]).toBe(grouped[0]);
  });

  it("leaves a page with no voice over a piano as homr grouped it", () => {
    setActiveModel("465");
    const { systems, grouped } = page(["gv", "gv"]);
    expect(pianoBracedAtTheBottom(systems, grouped)).toEqual(grouped);
    const none = page(["vvv", "gv"]);
    expect(shapes(pianoBracedAtTheBottom(none.systems, none.grouped))).toEqual(["vvv", "gv"]);
  });

  it("reads as homr 0.7.0 with model 396", () => {
    setActiveModel("396");
    const { systems, grouped } = page(["vg", "gv"]);
    expect(shapes(pianoBracedAtTheBottom(systems, grouped))).toEqual(["vg", "gv"]);
  });
});
