// Row 81, step 3: modernisePreReform (unchanged) on every token in a JSON list; prints [token, modern or null] pairs.
// Usage: tsx norm.ts <tokens.json>
import fs from 'node:fs';
import { modernisePreReform } from '/root/ilya-merge9/packages/dictionary/src/pre-reform-normalizer.ts';
const toks: string[] = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
console.log(JSON.stringify(toks.map((t) => [t, modernisePreReform(t)])));
