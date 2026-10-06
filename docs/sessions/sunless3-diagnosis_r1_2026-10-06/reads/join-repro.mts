import fs from 'node:fs';
import { joinPages } from '/Users/dannmitton/Desktop/ilya-rewrite/apps/web/src/lib/omr/join-pages.ts';
const O='/private/tmp/claude-502/-Users-dannmitton-Desktop-ilya-rewrite/9bd8867e-af4f-41f0-9866-3e291d1dcc74/scratchpad/out/';
for (const t of ['gpu','wasm']) {
  const x=[1,2,3,4].map(i=>fs.readFileSync(O+'s3-'+t+'-p'+i+'.musicxml','utf8'));
  const j=joinPages(x);
  console.log(t, 'same as browser join:', j===fs.readFileSync(O+'s3-'+t+'.musicxml','utf8'), 'stray close:', /<measure number="\d+" \/><\/measure>/.test(j));
}
