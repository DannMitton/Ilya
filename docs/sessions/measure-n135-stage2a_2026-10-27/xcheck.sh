#!/bin/sh
# Run from this folder. Needs python3 with numpy, and node 22.18 or later (it loads the .ts files directly).
T=$(mktemp -d)
python3 xcheck_rows_gen.py "$T/rows.json" && node xcheck_rows.mjs "$T/rows.json"
python3 xcheck_seat_gen.py "$T/seat.json" && node xcheck_seat.mjs "$T/seat.json"
