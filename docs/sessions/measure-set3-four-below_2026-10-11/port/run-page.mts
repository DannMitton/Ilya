// Row 77 trace: one page PNG through the port on WebAssembly, model 465; prints the layout hook and writes the MusicXML.
import { readFileSync, writeFileSync } from "node:fs";
import { PNG } from "pngjs";
import { recognizePage } from "./src/pipeline/recognize.js";
import { colorImageFromRgba } from "./src/image/plane.js";
import { startRuntime } from "./src/models/backend.js";
import { memoryCache } from "./src/models/cache.js";
import { ModelStore } from "./src/models/store.js";
const CPU: any = { artifactsFor: "wasm", provider: "wasm" };
const storeOn = async (placement: any) => new ModelStore({ baseUrl: "file:///models/", cache: memoryCache(), placement, runtime: await startRuntime({ maxBackend: "wasm" }),
  fetchBytes: ({ url }: any) => Promise.resolve(new Uint8Array(readFileSync(`${import.meta.dirname}/models/${url.slice(url.lastIndexOf("/") + 1)}`))) } as any);
import { testOpenCv } from "./test/support/opencv.js";
const [png, out] = process.argv.slice(2);
(globalThis as any).__homrDiag = (d: any) => console.log("DIAG " + JSON.stringify(d));
const p = PNG.sync.read(readFileSync(png));
const store = await storeOn(CPU);
const r = await recognizePage(colorImageFromRgba(p.width, p.height, p.data), {
  backend: "wasm", cv: await testOpenCv(), open: (role: any, batch: any) => store.open(role, batch === undefined ? {} : { batch }),
}, { model: "465" } as any);
console.log("ok", r.ok, r.durationMs, "ms");
if (r.ok) writeFileSync(out, r.musicXml);
else console.log(r.log.slice(-2000));
process.exit(0);
