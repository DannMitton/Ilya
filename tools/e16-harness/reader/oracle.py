"""E.16 SVG oracle (AT-15). Harness-only frozen-truth extractor.

Ratified by Fable's oracle-amendment ruling, 2026-07-27, section 3 AT-15 and
section 4 item 1: the SVG oracle is the frozen-truth source for every
rendered page. This module reads a Verovio-rendered SVG and reports the
page's true staff count.

CONSTRAINT, ratified (ruling 1.1, section 4 item 1): this is a harness truth
source ONLY. It must NEVER be imported by reader.py or by anything in the
runtime path. If detect_staves could read this module's answer, the
acceptance tests it feeds would mean nothing.

METHOD, ratified (ruling section 5 item 1, AT-15): split the SVG into
<g class="system"> blocks. For each system, count the <g class="staff">
elements inside that system's FIRST <g class="measure"> (in document order).
SUM those per-system counts to get the page total. Do NOT multiply a system
count by an assumed uniform staves-per-system -- that recipe silently
embeds a uniformity assumption that happens to hold on this corpus today
but is not guaranteed to hold on a future page.

REQUIRED ASSERTION, ratified: if the systems on one page do not all carry
the same per-system staff count, raise loudly, naming the page and the
full per-system list. Uniformity holds on this corpus (SOURCED, this
session: verified across all 47 rendered pages, see oracle-counts.json
generation log) so the assertion never fires today; it exists so a future
mixed-system page cannot silently corrupt the truth source.
"""
import xml.etree.ElementTree as ET


class OracleError(RuntimeError):
    """Raised when a page cannot be resolved to a single, unambiguous
    per-system-uniform staff count."""


def _local(tag):
    """Strip the SVG XML namespace off an ElementTree tag name."""
    return tag.rsplit('}', 1)[-1] if '}' in tag else tag


def _classes(elem):
    return set(elem.get('class', '').split())


def page_staff_count(svg_path):
    """Return (total_staff_count, per_system_counts) for one rendered SVG page.

    total_staff_count: sum over systems of that system's staff count.
    per_system_counts: list, one entry per system, in document order --
        returned even on the uniform (non-raising) path so callers can log it.

    Raises OracleError if the SVG has no systems, a system has no measures,
    or the per-system counts are not all equal.
    """
    tree = ET.parse(svg_path)
    root = tree.getroot()

    systems = [e for e in root.iter() if _local(e.tag) == 'g' and 'system' in _classes(e)]
    if not systems:
        raise OracleError("oracle: no <g class='system'> found in %r" % (svg_path,))

    per_system = []
    for sys_elem in systems:
        measures = [e for e in sys_elem.iter() if _local(e.tag) == 'g' and 'measure' in _classes(e)]
        if not measures:
            raise OracleError("oracle: system with no <g class='measure'> in %r" % (svg_path,))
        first_measure = measures[0]
        staves = [e for e in first_measure.iter() if _local(e.tag) == 'g' and 'staff' in _classes(e)]
        per_system.append(len(staves))

    if len(set(per_system)) > 1:
        raise OracleError(
            "oracle: non-uniform staff counts across systems in %r: per-system=%r"
            % (svg_path, per_system))

    return sum(per_system), per_system


if __name__ == '__main__':
    import sys
    for path in sys.argv[1:]:
        total, per_sys = page_staff_count(path)
        print(f"{path}: total={total} per_system={per_sys}")
