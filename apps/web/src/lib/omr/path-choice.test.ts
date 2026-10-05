/**
 * choosePath and probeAdapter: which path the score reader is asked for.
 * No browser: the adapter and `navigator.gpu` are stood in for by plain
 * objects, which is what `AdapterLike` and `GpuLike` are for.
 */
import { describe, expect, it } from 'vitest';
import { choosePath, choosePathFor, probeAdapter, FP16_FEATURE, type AdapterLike } from './path-choice';

const adapter = (...features: string[]): AdapterLike => ({ features: new Set(features) });

describe('choosePath', () => {
	it('asks for WebGPU, with no reason, where the adapter has shader-f16', () => {
		expect(choosePath({ hasGpu: true, adapter: adapter('timestamp-query', FP16_FEATURE) })).toEqual({
			prefer: 'webgpu',
			reason: null,
		});
	});

	it('asks for WebAssembly where the adapter lacks shader-f16, and says so', () => {
		const choice = choosePath({ hasGpu: true, adapter: adapter('timestamp-query', 'subgroups') });
		expect(choice.prefer).toBe('wasm-threads');
		expect(choice.reason).toContain('lacks shader-f16');
	});

	it('asks for WebAssembly where the browser granted no adapter, and says so', () => {
		const choice = choosePath({ hasGpu: true, adapter: null });
		expect(choice.prefer).toBe('wasm-threads');
		expect(choice.reason).toContain('no WebGPU adapter');
	});

	it('names the error where requestAdapter threw', () => {
		const choice = choosePath({ hasGpu: true, adapter: null, error: 'boom' });
		expect(choice.prefer).toBe('wasm-threads');
		expect(choice.reason).toContain('requestAdapter threw: boom');
	});

	it('asks for WebAssembly where the browser has no navigator.gpu, and says so', () => {
		const choice = choosePath({ hasGpu: false, adapter: null });
		expect(choice.prefer).toBe('wasm-threads');
		expect(choice.reason).toContain('no WebGPU in this browser');
	});
});

describe('probeAdapter', () => {
	it('reports no gpu for undefined and for null', async () => {
		expect(await probeAdapter(undefined)).toEqual({ hasGpu: false, adapter: null });
		expect(await probeAdapter(null)).toEqual({ hasGpu: false, adapter: null });
	});

	it('hands back the adapter the browser granted', async () => {
		const a = adapter(FP16_FEATURE);
		expect(await probeAdapter({ requestAdapter: async () => a })).toEqual({ hasGpu: true, adapter: a });
	});

	it('reports a null adapter as no adapter', async () => {
		expect(await probeAdapter({ requestAdapter: async () => null })).toEqual({ hasGpu: true, adapter: null });
	});

	it('never rejects: a throw from requestAdapter is carried as an error', async () => {
		const probe = await probeAdapter({
			requestAdapter: async () => {
				throw new Error('denied');
			},
		});
		expect(probe).toEqual({ hasGpu: true, adapter: null, error: 'denied' });
	});
});

describe('choosePathFor', () => {
	it('runs the whole decision from navigator.gpu to a choice', async () => {
		expect((await choosePathFor({ requestAdapter: async () => adapter(FP16_FEATURE) })).prefer).toBe('webgpu');
		expect((await choosePathFor({ requestAdapter: async () => adapter() })).prefer).toBe('wasm-threads');
		expect((await choosePathFor(undefined)).prefer).toBe('wasm-threads');
	});
});
