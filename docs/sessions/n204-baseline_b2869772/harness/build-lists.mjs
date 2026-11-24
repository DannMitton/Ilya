// Families 7, 8, 9 and the file list the stamp footprint is made from.
// usage: node build-lists.mjs <repo root> <out dir>
import { readdirSync, readFileSync, statSync, lstatSync, readlinkSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
const [root, out] = process.argv.slice(2);
const web = join(root, 'apps/web');
mkdirSync(out, { recursive: true });
const walk = (dir, base, acc = []) => { for (const e of readdirSync(dir, { withFileTypes: true })) { const p = join(dir, e.name); if (e.isDirectory()) walk(p, base, acc); else acc.push(p); } return acc; };
const rel = (p, base) => p.slice(base.length + 1);
const cmp = (a, b) => (a < b ? -1 : a > b ? 1 : 0);
const list = (dir) => walk(dir, dir).map((p) => { const b = readFileSync(p); return `${createHash('sha256').update(b).digest('hex')}  ${b.length}  ${rel(p, dir)}`; }).sort((x, y) => cmp(x.split('  ')[2], y.split('  ')[2]));
// 7: the production build's file list.
const build = join(web, 'build');
if (!existsSync(build)) throw new Error(`no build at ${build}; run pnpm --filter @ilya/web build first`);
const files = list(build);
writeFileSync(join(out, 'family7-build-files.txt'), files.join('\n') + '\n');
const total = files.reduce((n, l) => n + Number(l.split('  ')[1]), 0);
// 8: the service worker's precache list, built and source.
const arr = (src, name) => { const m = new RegExp(`const ${name} = \\[([\\s\\S]*?)\\];`).exec(src); return m ? m[1].split('\n').map((s) => s.trim()).filter(Boolean) : null; };
const version = (src) => /const CACHE_VERSION = ([^;]*);/.exec(src)?.[0] ?? null;
const sw = (label, p) => { const src = readFileSync(p, 'utf8'); return [`# ${label}: ${rel(p, root)}`, version(src), 'APP_SHELL', ...(arr(src, 'APP_SHELL') ?? ['NOT FOUND']), 'DECODER_FILES', ...(arr(src, 'DECODER_FILES') ?? ['NOT FOUND']), '']; };
writeFileSync(join(out, 'family8-sw-precache.txt'), [...sw('source', join(web, 'static/sw.js')), ...sw('built', join(build, 'sw.js'))].join('\n'));
// 9: the byte count of static/, measured here, at the point after `pnpm build` (its prebuild scripts have copied and fetched into static/).
const staticDir = join(web, 'static');
// `static/data` is a SYMLINK to the repo's `data/` (git mode 120000). A walk that does not follow it counts the link as one directory entry
// and misses the dictionary. This walk follows every symlink, and the output lists them.
const links = [];
const walkF = (dir, acc = []) => { for (const e of readdirSync(dir, { withFileTypes: true })) { const p = join(dir, e.name); const l = lstatSync(p); if (l.isSymbolicLink()) links.push({ path: rel(p, staticDir), target: readlinkSync(p) }); if (statSync(p).isDirectory()) walkF(p, acc); else acc.push(p); } return acc; };
const sf = walkF(staticDir).map((p) => ({ p: rel(p, staticDir), n: statSync(p).size }));
const top = {};
for (const f of sf) { const k = f.p.includes('/') ? f.p.split('/')[0] : '(files at the top)'; top[k] = (top[k] ?? 0) + f.n; }
writeFileSync(join(out, 'family9-static-bytes.json'), JSON.stringify({ measuredAt: 'apps/web/static/ after pnpm build (the build step copies the pdf.js, ort, heif, metre and underlay files into it and fetches the five omr model files)', symlinksFollowed: links, files: sf.length, bytes: sf.reduce((n, f) => n + f.n, 0), buildDirBytes: total, buildDirFiles: files.length, staticBytesByTopFolder: top }, null, '\t') + '\n');
console.log(`build: ${files.length} files, ${total} bytes; static: ${sf.length} files, ${sf.reduce((n, f) => n + f.n, 0)} bytes`);
