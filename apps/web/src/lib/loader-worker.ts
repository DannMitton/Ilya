/**
 * Dictionary Loader Worker
 *
 * Handles fetch + gzip decompression off the main thread.
 * Uses the browser's built-in DecompressionStream API (no Pako dependency).
 *
 * Smart decompression: if the server sends Content-Encoding: gzip (meaning
 * the browser already decompressed), we skip DecompressionStream. This handles
 * both Vite dev server (auto-decompresses .gz) and production static hosting
 * (serves raw bytes).
 *
 * Messages in:  { type: 'fetch', url: string, key: string }
 * Messages out: { type: 'success', key: string, text: string }
 *             | { type: 'error', key: string, error: string }
 */

self.onmessage = async (event: MessageEvent) => {
	const { type, url, key } = event.data;

	if (type !== 'fetch') return;

	try {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`HTTP ${response.status}: ${response.statusText}`);
		}

		let text: string;

		// Check if the server already decompressed the .gz file for us.
		// Vite dev server sets Content-Encoding: gzip, which means the browser
		// transparently decompresses the response. In that case, the body is
		// already plain text and we must NOT run DecompressionStream on it.
		const wasAutoDecompressed = response.headers.get('content-encoding') === 'gzip';

		if (url.endsWith('.gz') && !wasAutoDecompressed) {
			// Raw gzipped bytes -- decompress manually
			const ds = new DecompressionStream('gzip');
			const decompressedStream = response.body!.pipeThrough(ds);
			text = await new Response(decompressedStream).text();
		} else {
			// Already plain text (either not .gz, or server auto-decompressed)
			text = await response.text();
		}

		self.postMessage({ type: 'success', key, text });
	} catch (error: any) {
		self.postMessage({
			type: 'error',
			key,
			error: error.message || String(error)
		});
	}
};
