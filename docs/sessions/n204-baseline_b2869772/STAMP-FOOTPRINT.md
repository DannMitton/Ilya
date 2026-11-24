# Stamp footprint, `b2869772` against `93edb360`

Written by `harness/stamp-footprint.py` from two production builds of **identical source** (`git diff --stat b2869772..93edb360 -- apps packages scripts` is empty). The only input that differs is the commit the build stamps into itself. Every later lane builds at its own commit, so the files below differ from this baseline in the family 7 file list even when the lane changed nothing. **A later lane subtracts this list before reading its own diff.**

* Files in the base build: 218. In the third build: 218.
* Byte-identical in both: 202.
* Same path, different bytes: 4.
* Renamed (content-hashed names that moved): 12 paths in the base, 12 in the third; paired below: 12 (11 verified exact); unpaired: 0.

## Same path, different bytes

| path | base size | third size | what differs |
|---|---:|---:|---|
| `_app/version.json` | 22 | 22 | the version string: `{"version":"b2869772"}` becomes `{"version":"93edb360"}` |
| `index.html` | 3662 | 3661 | references to renamed entry and chunk files (a hashed name is one character shorter or longer); no stamp text |
| `notation-font-lab.html` | 3719 | 3718 | references to renamed entry and chunk files (a hashed name is one character shorter or longer); no stamp text |
| `sw.js` | 6066 | 6066 | the stamp: the `CACHE_VERSION` line and a comment that names it (`stamp-sw.mjs` replaces every `__BUILD_VERSION__`) |

## Renamed files, base name to third-build name

| base path | third path | size | how the content differs |
|---|---|---:|---|
| `_app/immutable/chunks/B9mnz2MJ.js` | `_app/immutable/chunks/D-KckOkZ.js` | 97986 | differs only in references to renamed chunks |
| `_app/immutable/chunks/BzrB98Pd.js` | `_app/immutable/chunks/C8K5ckwV.js` | 868 | differs only in references to renamed chunks |
| `_app/immutable/chunks/CHDEtQmV.js` | `_app/immutable/chunks/Du673HLW.js` | 200 | differs only in references to renamed chunks |
| `_app/immutable/chunks/CJ5vV2Pc.js` | `_app/immutable/chunks/C0LuZUrF.js` | 1365734 | contains the stamp (`b2869772` becomes `93edb360`) and references renamed chunks |
| `_app/immutable/chunks/CjT6FKQ2.js` | `_app/immutable/chunks/_WJGkzq9.js` | 3164 | differs only in references to renamed chunks |
| `_app/immutable/chunks/DDyeebWf.js` | `_app/immutable/chunks/Csba968O.js` | 1727 | differs only in references to renamed chunks |
| `_app/immutable/chunks/DQNXc5L2.js` | `_app/immutable/chunks/CnmTm5k5.js` | 29692 | contains the stamp (`b2869772` becomes `93edb360`) and references renamed chunks **and more than that**: after the stamp swap and the renames the files still differ (29692 against 29688 bytes); the first difference, at byte 284, is `et(t,n);import{bl as At,b6 as Ne,w as T,t as P,q as I,a0 as pt,br as j` in the base against `et(t,n);import{bl as At,b6 as je,w as T,t as P,q as I,a0 as pt,br as N` in the third build, so the minifier chose different short names. Whether the rest of the file differs the same way is NOT ESTABLISHED |
| `_app/immutable/chunks/DqHas2CR.js` | `_app/immutable/chunks/BEi_gwVV.js` | 21033 | differs only in references to renamed chunks |
| `_app/immutable/entry/app.DiVxHw3X.js` | `_app/immutable/entry/app.BAj6Rns8.js` | 4969 | differs only in references to renamed chunks |
| `_app/immutable/entry/start.Bof0qJYQ.js` | `_app/immutable/entry/start.DGDkIRp1.js` | 83 | differs only in references to renamed chunks |
| `_app/immutable/nodes/1.CVY4r-o1.js` | `_app/immutable/nodes/1.E4t9NsPm.js` | 927 | differs only in references to renamed chunks |
| `_app/immutable/nodes/2.B94dwXgv.js` | `_app/immutable/nodes/2.BXpbtgl-.js` | 88 | differs only in references to renamed chunks |

## Reading

The stamp moves **one value** (`version.json`, `CACHE_VERSION`, the `__ILYA_BUILD__` constant in two chunks) and, because SvelteKit names a chunk by a hash of its content, every chunk that holds the stamp or imports a chunk that does gets a new name, and so does every file that names one. Nothing else moves. The renamed-pair check above applies the stamp swap and the rename map to the base file and compares it to the third build's file byte for byte; a pair is listed only when that comparison is exact.

