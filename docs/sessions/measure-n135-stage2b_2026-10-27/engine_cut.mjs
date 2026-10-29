import { readFileSync, writeFileSync } from 'node:fs';
import { GraysonEngine } from '../../../packages/phonology/src/index.ts';
const words = JSON.parse(readFileSync(process.argv[2], 'utf8'));
writeFileSync(process.argv[3], JSON.stringify(words.map((w) => GraysonEngine.syllabify(w))));
