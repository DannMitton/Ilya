/**
 * Types for the one entry of `libheif-js` that heic-decode.ts loads. The
 * package's own `libheif.d.ts` types the Emscripten module (`MainModule`) and
 * leaves out `HeifDecoder` and `HeifImage`, which libheif.js adds in
 * JavaScript, so the names below are what `libheif-wasm/libheif.js` defines
 * (read in libheif-js 1.23.5).
 */
declare module 'libheif-js/libheif-wasm/libheif.js' {
	export interface LibheifImage {
		get_width(): number;
		get_height(): number;
		is_primary(): boolean;
		/** Fills `into.data` with RGBA and calls back with it, or with a falsy value on failure. */
		display(
			into: { data: Uint8ClampedArray<ArrayBuffer>; width: number; height: number },
			done: (out: { data: Uint8ClampedArray<ArrayBuffer> } | null) => void
		): void;
		free(): void;
	}

	export interface Libheif {
		HeifDecoder: new () => {
			/** Every top-level image, in item-ID order. An empty array on any failure; it does not throw. */
			decode(bytes: Uint8Array): LibheifImage[];
		};
	}

	export default function libheif(options: { wasmBinary: Uint8Array }): Libheif | Promise<Libheif>;
}
