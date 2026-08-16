"""envelope.py -- E.16 Front 3a, decision 2: the piece-level envelope and
container model.

Authority: claude/fable-spec-e16-front3a_2026-07-27.md (revision 3), Item A,
decisions 1 through 8. This module is the NEW orchestration layer that sits
above run_page2.run (unchanged legacy note/rhythm/pitch path, kept
byte-identical) and adds:

  - the piece_ctx cookie, threaded as run(cfg, ctx_in) -> ctx_out (decision
    2), plain dicts and functions, no classes, JSON-serializable (Fractions
    as numerator/denominator pairs);
  - decision 1's generalized signature anchor sweep (via timesig.py),
    mapped from page-local windows to GLOBAL piece measure indices;
  - decision 4's beat model (via metre.py) attached per measure;
  - decisions 3, 5, 7: the event-gated, piece-scoped pickup rule and the
    empty-bar third silence category, via run_page2.measure_integrity_flag;
  - decisions 6 and 8: the additive `measures` array and its abstention
    shape.

Two axes, per decision 2, kept deliberately distinct in this module: the
PHYSICAL axis (page, system, barline-defined measure-stack) is where ink is
found -- computed fresh every call from the page's own geometry. The
MUSICAL axis (piece, global measureIndex) is where state persists -- carried
only in piece_ctx's `facets`, never hung off a page.
"""
from fractions import Fraction

import numpy as np

import reader
import run_page2
import timesig
import metre as metre_mod


def _frac_to_dict(f):
    if f is None:
        return None
    return dict(numerator=f.numerator, denominator=f.denominator)


def _dict_to_frac(d):
    if d is None:
        return None
    return Fraction(d['numerator'], d['denominator'])


def default_ctx(cfg):
    """The envelope arrives whole as a schema (decision 2's scope ruling):
    all six facets present from birth. Only `metre` and `grouping` are ever
    populated from ink in 3a; `key`, `clef`, `octaveChange`, and
    `vocalStaff` ride as config-sourced pass-through cells."""
    return dict(
        pieceId=None,
        measureIndexOffset=0,
        facets=dict(
            metre=dict(value=None, source='abstain', at=None),
            grouping=dict(value=None, source='abstain', at=None),
            key=dict(value=dict(fifths=cfg['key']), source='config', at=None),
            clef=dict(value=dict(sign=cfg['clef'][0], line=cfg['clef'][1]), source='config', at=None),
            octaveChange=dict(value=cfg.get('octaveChange', 0), source='config', at=None),
            vocalStaff=dict(value=list(cfg.get('vocal', [])), source='config', at=None),
        ),
    )


def run(cfg, ctx_in=None):
    """decision 2's cookie contract. Returns (ro, ctx_out, msum, G, rests,
    events): `ro` is run_page2.run's legacy output dict PLUS the additive
    `measures` array (decision 6); confident note records inside it are
    byte-identical to run_page2.run's own `ro` (proven by A1/A3 -- this
    function never touches ro['verses']). `ctx_out` is the JSON-serializable
    cookie for the next page's `ctx_in`."""
    if ctx_in is None:
        ctx_in = default_ctx(cfg)

    page_no = cfg.get('page', 1)
    offset_in = ctx_in.get('measureIndexOffset', 0)

    ro, msum, G, rests, events, _read_metre_legacy = run_page2.run(cfg)

    # decision 2: "measureIndexOffset IS consumed in 3a: measureIndex =
    # offset + page-local index ... which is what cross-page numbering and
    # acceptance tests A5 and A8 require." run_page2.run always numbers a
    # page's own notes/rests LOCALLY (0-based, per page); on any page past
    # the first (offset_in > 0) those records are remapped here to GLOBAL
    # piece measureIndex, id included (the id format is r{measureIndex}-
    # {onset}-{x}, fixed in run_page2.run, so the prefix is rewritten to
    # match). A no-op, and therefore byte-identical, whenever offset_in==0
    # (every A1/A3 case) -- the remap only ever fires on page 2+.
    if offset_in:
        for nd in ro['verses'][0]['notes']:
            local_mi = nd['measureIndex']
            global_mi = offset_in + local_mi
            old_prefix = f"r{local_mi}-"
            if nd['id'].startswith(old_prefix):
                nd['id'] = f"r{global_mi}-" + nd['id'][len(old_prefix):]
            nd['measureIndex'] = global_mi

    staves, s, vocal, nl = G['staves'], G['s'], G['vocal'], G['nl']
    W = G['img'].shape[1]
    bl = reader.detect_barlines(nl, staves, vocal, s)
    # N.59, Ruling A. Same derivation as run_page2's, and it must stay the same
    # derivation: the two consumption sites number the same measures, and a
    # disagreement between them would misplace every measure on the page. See
    # run_page2's note for why it is len(barlines) and not len(barlines) + 1.
    mps = cfg.get('measures_per_system')
    if mps is None:
        mps = [max(1, len(bl.get(i, []))) for i in range(len(vocal))]
    base = list(np.cumsum([0] + list(mps))[:-1])
    n_measures = int(sum(mps))

    # Event count per GLOBAL measure index (decision 7's empty-bar gate is
    # tested on this count, never on msum reading 0 -- see run_page2's
    # measure_integrity_flag docstring for why). Notes are already
    # global-numbered above, so this dict is global-keyed directly.
    event_counts_global_from_notes = {}
    for nd in ro['verses'][0]['notes']:
        event_counts_global_from_notes[nd['measureIndex']] = event_counts_global_from_notes.get(nd['measureIndex'], 0) + 1

    # ---- decision 1's anchor sweep, per system, mapped to LOCAL measures.
    # Binding rule: a W-start or interior W-bar hit takes effect from the
    # measure that BEGINS at that anchor; a final-barline hit is evidence
    # for the NEXT system's first measure (this page's next system, or --
    # on the page's last system -- the next PAGE's first measure, stashed
    # in ctx_out as `pendingCautionary`).
    local_metre_hits = {}
    pending_cautionary = None
    for syi in range(len(vocal)):
        vsi = vocal[syi]
        bars = bl.get(syi, [])
        hits = timesig.search_system_signatures(nl, staves, s, vsi, 0, bars, W)
        for h in hits:
            if h['window'] == 'start':
                target_local = base[syi]
            else:
                k = h['window']
                if h['is_final_barline']:
                    if syi + 1 < len(vocal):
                        target_local = base[syi + 1]
                    else:
                        pending_cautionary = dict(beats=h['beats'], beat_type=h['beat_type'],
                                                   page=page_no, flagged=h['flagged'])
                        continue
                else:
                    target_local = base[syi] + k + 1
            local_metre_hits[target_local] = (h['beats'], h['beat_type'], h['flagged'])

    incoming_cautionary = ctx_in.get('pendingCautionary')

    # ---- pass 1: left-to-right sweep resolving metre/classification per
    # measure and updating the carried facet state (decision 2's
    # precedence: printed on this page beats inherited beats config beats
    # abstain; a new print at measure m overrides everything from m onward)
    cur_metre = dict(ctx_in['facets']['metre'])
    cur_grouping = dict(ctx_in['facets']['grouping'])
    cautionary_disagreement = False

    prelim = []   # per-measure dicts, integrity filled in during pass 2
    for local_mi in range(n_measures):
        global_mi = offset_in + local_mi

        printed_here = None
        if local_mi == 0 and incoming_cautionary is not None:
            caution_pair = (incoming_cautionary['beats'], incoming_cautionary['beat_type'])
            if local_mi in local_metre_hits:
                start_pair = local_metre_hits[local_mi][:2]
                if start_pair != caution_pair:
                    cautionary_disagreement = True
                printed_here = local_metre_hits[local_mi]     # start wins on disagreement
            else:
                printed_here = (caution_pair[0], caution_pair[1], False)
        elif local_mi in local_metre_hits:
            printed_here = local_metre_hits[local_mi]

        if printed_here is not None:
            beats, beat_type = printed_here[0], printed_here[1]
            cur_metre = dict(value=dict(beats=beats, beatType=beat_type), source='printed',
                              at=dict(page=page_no, measureIndex=global_mi))

        if cur_metre['source'] in ('printed', 'inherited'):
            mv = cur_metre['value']
            beats, beat_type = mv['beats'], mv['beatType']
            classification, boundaries = metre_mod.classify_metre(beats, beat_type)
            measure_duration = metre_mod.measure_duration(beats, beat_type)
            record_source = 'printed' if printed_here is not None else 'inherited'
            printed_at = (dict(page=page_no, measureIndex=global_mi) if record_source == 'printed'
                          else dict(cur_metre['at']))
        else:
            beats = beat_type = None
            classification = None
            boundaries = None
            measure_duration = None
            record_source = None
            printed_at = None

        abstain = {}
        beat_boundaries_out = None
        if classification == 'irregular':
            # Decision 4's detector (metre.py) is implemented but the
            # corpus contains zero irregular measures (SOURCED, spec
            # "Measured this session"), so this branch is DORMANT on every
            # real page; only persistence/abstain is wired here. See the
            # return memo's "what I did not do" section.
            if cur_grouping['source'] in ('printed', 'inherited') and cur_grouping['value'] is not None:
                grouping = tuple(cur_grouping['value'])
                # RUNTIME FILE MOVES UNDER THIS ORDER (Fable's ruling,
                # 2026-07-28, Phase 2.3): `beats` is now required by
                # grouping_to_boundaries. Pass the measure's own `beats`,
                # already in scope from `mv['beats']` above -- confirmed a
                # repair, not design, since a wrong default here would
                # silently collapse a compound reading to an irregular one
                # (see metre.grouping_to_boundaries' docstring). This branch
                # is dormant on every real page (see the comment above);
                # Fable waived a dedicated acceptance test for that stated
                # reason, and the protection that matters is the domain
                # assertion now running inside grouping_to_boundaries itself.
                beat_boundaries_out = metre_mod.grouping_to_boundaries(grouping, beat_type, beats)
                cur_grouping = dict(value=list(grouping), source='inherited', at=dict(cur_grouping['at']))
            else:
                abstain['beatBoundaries'] = 'no_printed_division'
        elif boundaries is not None:
            beat_boundaries_out = boundaries

        rec = dict(
            measureIndex=global_mi,
            metre=(dict(beats=beats, beatType=beat_type) if beats is not None else None),
            measureDuration=_frac_to_dict(measure_duration),
            classification=classification,
            beatBoundaries=([_frac_to_dict(b) for b in beat_boundaries_out]
                             if beat_boundaries_out is not None else None),
            source=record_source,
            printedAt=printed_at,
            _measure_duration_frac=measure_duration,
            _local_mi=local_mi,
            _abstain=abstain,
        )
        prelim.append(rec)

    # ---- pass 2: decisions 3, 5, 7 -- the event-gated, piece-scoped
    # pickup rule and the empty-bar abstention, via run_page2's canonical
    # (skip_first-free) measure_integrity_flag.
    msum_global = {offset_in + k: v for k, v in msum.items()}
    event_counts_global = {offset_in + k: event_counts_global_from_notes.get(offset_in + k, 0)
                            for k in range(n_measures)}
    metre_map_global = {r['measureIndex']: r['_measure_duration_frac'] for r in prelim}
    flags = run_page2.measure_integrity_flag(msum_global, metre_map_global, event_counts_global,
                                              piece_measure0_index=0)

    measures_out = []
    for r in prelim:
        mi = r['measureIndex']
        integrity = flags[mi]
        abstain = dict(r['_abstain'])
        if integrity == 'abstain':
            if r['_measure_duration_frac'] is None:
                abstain['metre'] = 'no_printed_signature_no_inheritance'
            elif event_counts_global.get(mi, 0) == 0:
                abstain['sum'] = 'empty_bar_no_events'
            elif msum_global.get(mi) is None:
                abstain['sum'] = 'contains_duration_abstention'
        out = dict(
            measureIndex=r['measureIndex'],
            metre=r['metre'],
            measureDuration=r['measureDuration'],
            classification=r['classification'],
            beatBoundaries=r['beatBoundaries'],
            source=r['source'],
            printedAt=r['printedAt'],
            integrity=integrity,
        )
        if abstain:
            out['abstain'] = abstain
        measures_out.append(out)

    ro['measures'] = measures_out

    ctx_out = dict(
        pieceId=ro.get('pieceId'),
        measureIndexOffset=offset_in + n_measures,
        facets=dict(
            metre=cur_metre,
            grouping=cur_grouping,
            key=dict(value=dict(fifths=cfg['key']), source='config', at=None),
            clef=dict(value=dict(sign=cfg['clef'][0], line=cfg['clef'][1]), source='config', at=None),
            octaveChange=dict(value=cfg.get('octaveChange', 0), source='config', at=None),
            vocalStaff=dict(value=list(vocal), source='config', at=None),
        ),
    )
    if pending_cautionary is not None:
        ctx_out['pendingCautionary'] = pending_cautionary
    if cautionary_disagreement:
        ctx_out['_cautionaryDisagreementAtLocal0'] = True

    return ro, ctx_out, msum, G, rests, events
