// Joins each build song's pages with Ilya's joinPages, unchanged, and writes one MusicXML per song.
// Run from /home/claude/wire-465/ilya: npx --yes tsx /home/claude/checks/join.mts
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { joinPages } from "/home/claude/wire-465/ilya/apps/web/src/lib/omr/join-pages.ts";
const IN = "/home/claude/checks/in";
const OUT = "/home/claude/checks/out/joined";
mkdirSync(OUT, { recursive: true });
const songs: Record<string, string[]> = {
  "tch": ["tch-1", "tch-2", "tch-3"],
  "sun1": ["sun-01", "sun-02"],
  "sun4": ["sun-03", "sun-04"],
  "sun5": ["sun-05", "sun-06", "sun-07", "sun-08", "sun-09", "sun-10", "sun-11"],
  "sun6": ["sun-12", "sun-13", "sun-14", "sun-15", "sun-16", "sun-17"],
};
for (const [song, pages] of Object.entries(songs)) {
  const j = joinPages(pages.map((p) => readFileSync(`${IN}/${p}.musicxml`, "utf8")));
  writeFileSync(`${OUT}/${song}.musicxml`, j);
  const ms = [...j.matchAll(/<measure number="(\d+)"/g)].length;
  console.log(song, "pages", pages.join(","), "measures", ms, "bytes", j.length);
}
