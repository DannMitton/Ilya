import { readFileSync, writeFileSync } from 'node:fs';
import { frameRow } from '../../../apps/web/src/lib/omr/underlay-frame.ts';
const rows = JSON.parse(readFileSync(process.argv[2], 'utf8'));
const out = rows.map((r) => {
	const { crop, transform } = frameRow({ width: r.w, height: r.h, data: Uint8Array.from(r.data) }, 30);
	return { w: crop.width, h: crop.height, angle: transform.angle, scale: transform.scale, data: Array.from(crop.data) };
});
writeFileSync(process.argv[3], JSON.stringify(out));
