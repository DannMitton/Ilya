#!/usr/bin/env node
// Run from the Ilya repo root:
//   node update-blurb-composer.js
//
// This script updates data/blurb-composer.json with:
// 1. Silent consonant Process entries: new template with {cluster}, correct citations, standalone: true
// 2. Removes 6 silent Implication entries (silence needs no mouth choreography)
// 3. Adds missing hard:н Process entry

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'data', 'blurb-composer.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// --- 1. Update silent Process entries ---
const silentTemplate = "In the cluster \u27E8{cluster}\u27E9, the letter \u27E8{char}\u27E9 is silent. This is one of several consonant clusters in Russian where a letter is still written but has no phonetic realization.";

const silentCitations = {
  "\u0434": "pp. 242\u2013243",   // д: рдц (p. 243), здн (p. 242)
  "\u0442": "pp. 242\u2013243",   // т: стн (p. 242), стл (p. 243)
  "\u043B": "p. 244",             // л: лнц
  "\u0432": "pp. 244\u2013245",   // в: вств
  "\u0437": "pp. 242\u2013246",   // з: general range
  "\u0441": "pp. 242\u2013246"    // с: general range
};

for (const [char, citation] of Object.entries(silentCitations)) {
  const key = `silent:${char}`;
  data.processes[key] = {
    en: { template: silentTemplate, citation: citation },
    fr: null,
    standalone: true
  };
}

// --- 2. Remove silent Implication entries ---
for (const char of ["\u0434", "\u0442", "\u043B", "\u0432", "\u0437", "\u0441"]) {
  delete data.implications[`silent:${char}`];
}

// --- 3. Add missing hard:н ---
data.processes["hard:\u043D"] = {
  en: {
    template: "Here, \u27E8{char}\u27E9 has no palatalizing agent nearby, so it takes its default: [{ipa}].",
    citation: "p. 152"
  },
  fr: null
};

// --- Write output ---
fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');

// --- Verify ---
const verify = JSON.parse(fs.readFileSync(filePath, 'utf8'));
const pc = Object.keys(verify.processes).length;
const ic = Object.keys(verify.implications).length;
const idc = Object.keys(verify.identities).length;
console.log(`Done. ${idc} identities, ${pc} processes, ${ic} implications = ${idc + pc + ic} total`);
console.log(`silent:д standalone: ${verify.processes["silent:\u0434"].standalone}`);
console.log(`silent:д citation: ${verify.processes["silent:\u0434"].en.citation}`);
console.log(`silent:д template has {cluster}: ${verify.processes["silent:\u0434"].en.template.includes('{cluster}')}`);
console.log(`hard:н present: ${!!verify.processes["hard:\u043D"]}`);
console.log(`silent implications remaining: ${Object.keys(verify.implications).filter(k => k.startsWith('silent:')).length}`);
