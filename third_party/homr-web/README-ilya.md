# homr-web, as changed by the Ilya project

This folder holds the source of the browser port of homr that Ilya reads a
scanned score with, and the package built from it,
`homr-web-0.2.0-ilya.3.tgz`. Ilya's `apps/web/package.json` depends on that
file.

It is a changed copy of homr-web 0.2.0, <https://github.com/jymen/homr-web>,
at upstream commit `cb333a597ad31993d8e60a60e1279c04115533e0` (`cb333a5`). It
is not a release by homr-web's author. The changes let it read with homr's
model 465 and with the code of homr's main branch at commit `560ca5c`. In
one place, 0.2.0-ilya.3 departs from homr main: it does not regroup the staffs
of a page in a way that splits a system homr detected (`CHANGES-ilya.md`,
section 0.2.0-ilya.3). `CHANGES-ilya.md` lists every changed file and the homr
code each follows.

homr and homr-web are licensed under the GNU Affero General Public License
version 3 (`LICENSE`, `NOTICE`). This folder is the source of the changed
copy that the licence asks to be offered with it. It is not part of the pnpm
workspace, and none of its code is used anywhere else in this repository.

The port's tests (`test/`, 22 MB of fixtures) are not copied here: the
package builds without them. The upstream tests are in homr-web's
repository at `cb333a5`.

## Rebuild the package

From this folder, with Node 22 or later:

1. `npm ci`
2. `npm run build`
3. `npm pack`

The third command writes `homr-web-0.2.0-ilya.3.tgz` here. After a rebuild,
run `pnpm install` at the repository root so the lockfile records the new
file's integrity.
