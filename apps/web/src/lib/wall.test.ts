/**
 * The Markup and Insights gate opens on either name, N.174 slice D.1
 * (2026-09-27): PUBLIC_INCLUDE_MARKUP_INSIGHTS, and the older
 * PUBLIC_INCLUDE_SHANE. `wall.ts` reads `import.meta.env` once at import, so
 * each case stubs the env and imports a fresh copy of the module.
 */
import { afterEach, describe, it, expect, vi } from 'vitest';

async function gateWith(env: Record<string, string>): Promise<boolean> {
	vi.resetModules();
	vi.stubEnv('PUBLIC_INCLUDE_MARKUP_INSIGHTS', '');
	vi.stubEnv('PUBLIC_INCLUDE_SHANE', '');
	for (const [name, value] of Object.entries(env)) vi.stubEnv(name, value);
	return (await import('./wall')).INCLUDE_MARKUP_INSIGHTS;
}

describe('INCLUDE_MARKUP_INSIGHTS', () => {
	afterEach(() => {
		vi.unstubAllEnvs();
	});

	it('opens on PUBLIC_INCLUDE_MARKUP_INSIGHTS alone', async () => {
		expect(await gateWith({ PUBLIC_INCLUDE_MARKUP_INSIGHTS: 'true' })).toBe(true);
	});

	it('opens on PUBLIC_INCLUDE_SHANE alone', async () => {
		expect(await gateWith({ PUBLIC_INCLUDE_SHANE: 'true' })).toBe(true);
	});

	it('stays closed with both unset', async () => {
		expect(await gateWith({})).toBe(false);
	});
});
