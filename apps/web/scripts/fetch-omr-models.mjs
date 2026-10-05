/**
 * fetch-omr-models.mjs: put homr's five model files where the score reader
 * fetches them.
 *
 * The score reader for a scan (`src/lib/omr/homr-reader.ts`) runs homr-web,
 * which downloads its models from this app at `/omr/models/<sha256>/<file>`
 * and checks each against its SHA-256 before use. Browsers cannot download
 * them from homr's GitHub release directly, because the release's redirect
 * carries no CORS header (homr-web's README, "Hosting the models"), so this
 * script downloads them at `dev` and `build` and writes them to
 * `static/omr/models/<sha256>/<file>`.
 *
 * THE FIVE FILES are the ones homr-web 0.2.0-ilya.2 reads the notes with when
 * the reader asks for homr's model 465, which it always does: the
 * segmentation model and the model 465 transformer encoder in fp16 for WebGPU
 * and in fp32 for WebAssembly, and the model 465 transformer decoder, used by
 * both. No model 396 file is fetched, because the reader never reads with
 * it. The OCR models are not fetched, because the reader always reads with
 * OCR off. Names, sizes, and SHA-256 values are the records in the changed
 * port's manifest (`third_party/homr-web/src/models/manifest.ts`).
 *
 * Each file is homr's own release asset, a zip holding the one `.onnx` file.
 * A file already present with the right SHA-256 is not downloaded again.
 *
 * THE MODELS ARE GENERATED, NEVER EDITED, AND NEVER COMMITTED: the folder is
 * git-ignored, and the service worker does not precache it.
 *
 * IT NEVER STOPS `dev`. With no network, or a download that fails or does
 * not match, it prints a warning naming the file and exits 0: the rest of
 * the app works, and only reading a scan fails, with homr-web's
 * `engine_missing`. Set OMR_MODELS_STRICT=1 to make a failure exit 1
 * (for a release build that must carry the models).
 */
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { inflateRawSync } from 'node:zlib';

const RELEASE = 'https://github.com/liebharc/homr/releases/download/onnx_checkpoints';
const DEST = new URL('../static/omr/models/', import.meta.url);

const MODELS = [
	['60f495496cb41473c0521d0811d8f44b9d5cff892d287974a8aebb3eaee2fa83', 'segnet_308-3296ccd40960f90ca6ab9c035cca945675d30a0f_fp16.onnx', 28667207],
	['50823c061533328f5e64df016d3ed16eb9071a9f5c5ee8621646cf9ac9c8a992', 'encoder_pytorch_model_465-597144cab54c8f6d0f6c9619df5c5312694eadd6_fp16.onnx', 26466256],
	['6ed36640db4ef5d223098b6d5efe4eda97c66b24a2c72faab8a018c749003a8d', 'segnet_308-3296ccd40960f90ca6ab9c035cca945675d30a0f.onnx', 57311361],
	['92bd18338dc8da3c9b00185008ab14719ff9f912efe785ca42d7b623e06e0c6b', 'encoder_pytorch_model_465-597144cab54c8f6d0f6c9619df5c5312694eadd6.onnx', 52861122],
	['18801c1e3657bdea1b031db90b10d66e15accfc1d607780f09a9e059133e886a', 'decoder_pytorch_model_465-597144cab54c8f6d0f6c9619df5c5312694eadd6.onnx', 47309835],
];

const STRICT = process.env.OMR_MODELS_STRICT === '1';
const sha256 = (buf) => createHash('sha256').update(buf).digest('hex');

/**
 * The bytes of the entry called `want` in a zip file. Reads the central
 * directory, including the zip64 extra field, and inflates a deflated entry
 * or copies a stored one. Throws on anything else.
 */
function unzipOne(zip, want) {
	let eocd = -1;
	for (let i = zip.length - 22; i >= Math.max(0, zip.length - 65557); i--) {
		if (zip.readUInt32LE(i) === 0x06054b50) {
			eocd = i;
			break;
		}
	}
	if (eocd < 0) throw new Error('not a zip file');
	let count = zip.readUInt16LE(eocd + 10);
	let cdOffset = zip.readUInt32LE(eocd + 16);
	if (cdOffset === 0xffffffff || count === 0xffff) {
		const loc = eocd - 20;
		if (zip.readUInt32LE(loc) !== 0x07064b50) throw new Error('zip64 locator missing');
		const z64 = Number(zip.readBigUInt64LE(loc + 8));
		count = Number(zip.readBigUInt64LE(z64 + 32));
		cdOffset = Number(zip.readBigUInt64LE(z64 + 48));
	}
	let p = cdOffset;
	for (let n = 0; n < count; n++) {
		if (zip.readUInt32LE(p) !== 0x02014b50) throw new Error('bad central directory');
		const method = zip.readUInt16LE(p + 10);
		let compSize = zip.readUInt32LE(p + 20);
		let size = zip.readUInt32LE(p + 24);
		const nameLen = zip.readUInt16LE(p + 28);
		const extraLen = zip.readUInt16LE(p + 30);
		const commentLen = zip.readUInt16LE(p + 32);
		let localOffset = zip.readUInt32LE(p + 42);
		const name = zip.toString('utf8', p + 46, p + 46 + nameLen);
		// zip64: the sizes and offset that read 0xffffffff are in extra field 0x0001, in this order.
		let e = p + 46 + nameLen;
		const eEnd = e + extraLen;
		while (e + 4 <= eEnd) {
			const id = zip.readUInt16LE(e);
			const len = zip.readUInt16LE(e + 2);
			if (id === 0x0001) {
				let q = e + 4;
				if (size === 0xffffffff) { size = Number(zip.readBigUInt64LE(q)); q += 8; }
				if (compSize === 0xffffffff) { compSize = Number(zip.readBigUInt64LE(q)); q += 8; }
				if (localOffset === 0xffffffff) { localOffset = Number(zip.readBigUInt64LE(q)); q += 8; }
			}
			e += 4 + len;
		}
		if (name.split('/').pop() === want) {
			if (zip.readUInt32LE(localOffset) !== 0x04034b50) throw new Error('bad local header');
			const start = localOffset + 30 + zip.readUInt16LE(localOffset + 26) + zip.readUInt16LE(localOffset + 28);
			const data = zip.subarray(start, start + compSize);
			if (method === 0) return Buffer.from(data);
			if (method === 8) return inflateRawSync(data);
			throw new Error(`compression method ${method} is not read here`);
		}
		p = eEnd + commentLen;
	}
	throw new Error(`${want} is not in the zip`);
}

async function fetchOne(sha, file) {
	const url = `${RELEASE}/${file.replace(/\.onnx$/, '.zip')}`;
	const res = await fetch(url, { redirect: 'follow' });
	if (!res.ok) throw new Error(`HTTP ${res.status} from ${url}`);
	const zip = Buffer.from(await res.arrayBuffer());
	const bytes = unzipOne(zip, file);
	const got = sha256(bytes);
	if (got !== sha) throw new Error(`wrong SHA-256 for ${file}: wanted ${sha}, got ${got}`);
	return bytes;
}

let failed = 0;
for (const [sha, file, size] of MODELS) {
	const dir = new URL(`${sha}/`, DEST);
	const dest = new URL(file, dir);
	if (existsSync(dest)) {
		const have = readFileSync(dest);
		if (have.length === size && sha256(have) === sha) continue;
	}
	process.stdout.write(`fetch-omr-models: downloading ${file} (${(size / 1e6).toFixed(1)} MB)\n`);
	try {
		const bytes = await fetchOne(sha, file);
		mkdirSync(dir, { recursive: true });
		const part = new URL(`${file}.part`, dir);
		writeFileSync(part, bytes);
		renameSync(part, dest);
	} catch (err) {
		failed += 1;
		console.warn(`fetch-omr-models: WARNING, ${file} not fetched: ${err.message}`);
		try {
			rmSync(new URL(`${file}.part`, dir), { force: true });
		} catch {}
	}
}
if (failed > 0) {
	console.warn(
		`fetch-omr-models: ${failed} of ${MODELS.length} model files are missing from ${fileURLToPath(DEST)}. ` +
			'The app runs; reading a scan will fail until they are fetched (run this script again with a network).',
	);
	if (STRICT) process.exit(1);
}
