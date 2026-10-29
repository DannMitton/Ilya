// Row 105: batch modernisePreReform and GraysonEngine.syllabify, unchanged, over a JSON list of words.
// Usage: vite-node nodetool.ts <in.json> ; in = {"modernise":[...], "syllabify":[...]} ; prints {"modernise":[[w,m|null]...], "syllabify":[[w,[syl...]]...]}
import fs from 'node:fs';
import { modernisePreReform } from '/Users/dannmitton/Desktop/ilya-rewrite/packages/dictionary/src/pre-reform-normalizer.ts';
import { GraysonEngine } from '/Users/dannmitton/Desktop/ilya-rewrite/packages/phonology/src/index.ts';
const a = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const out: any = {};
out.modernise = (a.modernise ?? []).map((w: string) => [w, modernisePreReform(w)]);
out.syllabify = (a.syllabify ?? []).map((w: string) => { try { return [w, (GraysonEngine as any).syllabify(w)]; } catch (e) { return [w, null]; } });
fs.writeFileSync(process.argv[3], JSON.stringify(out));
