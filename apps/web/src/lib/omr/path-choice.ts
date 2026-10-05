/**
 * Which path the score reader is asked for: WebGPU, or WebAssembly.
 *
 * homr-web's WebGPU path runs homr's 16-bit (fp16) model files. A WebGPU
 * adapter that lacks the `shader-f16` feature cannot run them: onnxruntime's
 * shaders fail to compile (`'f16' type used without 'f16' extension enabled`)
 * and the read ends `not_music`. homr-web asks the adapter whether it exists
 * but not whether it has `shader-f16` (`third_party/homr-web/src/models/backend.ts`,
 * `probeRuntime` and `chooseBackend`), so this module asks, before the
 * recognizer is made, and names WebAssembly where the answer is no.
 *
 * `'wasm-threads'` is homr-web's own word for "the WebAssembly path, with
 * threads where the page can have them": it steps down to single-threaded
 * `wasm` where the page has no `SharedArrayBuffer`. It is what homr-web picks
 * on its own where there is no WebGPU adapter at all, so a device with no
 * adapter reads as it did before this module existed.
 *
 * Nothing here touches the browser. The caller hands in `navigator.gpu`, so
 * every branch is a unit test.
 */

/** The values of homr-web's `prefer` that this app uses. */
export type PreferredBackend = 'webgpu' | 'wasm-threads';

/** The one part of a `GPUAdapter` this module reads. */
export interface AdapterLike {
	features: { has(feature: string): boolean };
}

/** The one part of `navigator.gpu` this module reads. */
export interface GpuLike {
	requestAdapter(): Promise<AdapterLike | null>;
}

/** What the browser answered when asked for an adapter. */
export interface AdapterProbe {
	/** `navigator.gpu` exists. */
	hasGpu: boolean;
	/** The adapter, or null when the browser granted none. */
	adapter: AdapterLike | null;
	/** The message of an error that `requestAdapter` threw, if it threw. */
	error?: string;
}

/** The path to ask homr-web for, and why it is not WebGPU when it is not. */
export interface PathChoice {
	prefer: PreferredBackend;
	/** `null` when WebGPU is asked for; otherwise one line for the console. */
	reason: string | null;
}

/** The feature homr's fp16 model files need from the adapter. */
export const FP16_FEATURE = 'shader-f16';

/** Asks the browser for an adapter, the way homr-web's own probe does (no options). Never rejects. */
export async function probeAdapter(gpu: GpuLike | undefined | null): Promise<AdapterProbe> {
	if (!gpu) return { hasGpu: false, adapter: null };
	try {
		return { hasGpu: true, adapter: (await gpu.requestAdapter()) ?? null };
	} catch (err) {
		return { hasGpu: true, adapter: null, error: String((err as Error)?.message ?? err) };
	}
}

/** The decision. A pure function of what the probe found. */
export function choosePath(probe: AdapterProbe): PathChoice {
	if (!probe.hasGpu) {
		return { prefer: 'wasm-threads', reason: 'no WebGPU in this browser' };
	}
	if (!probe.adapter) {
		const why = probe.error ? `requestAdapter threw: ${probe.error}` : 'the browser granted no adapter';
		return { prefer: 'wasm-threads', reason: `no WebGPU adapter (${why})` };
	}
	if (!probe.adapter.features.has(FP16_FEATURE)) {
		return { prefer: 'wasm-threads', reason: `the WebGPU adapter lacks ${FP16_FEATURE}, which the fp16 models need` };
	}
	return { prefer: 'webgpu', reason: null };
}

/** The probe and the decision together. */
export async function choosePathFor(gpu: GpuLike | undefined | null): Promise<PathChoice> {
	return choosePath(await probeAdapter(gpu));
}
