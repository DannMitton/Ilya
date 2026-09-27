/**
 * The Markup and Insights gate opens on PUBLIC_INCLUDE_MARKUP_INSIGHTS alone.
 * The name before N.174, PUBLIC_INCLUDE_SHANE, also opened it from slice D.1
 * until D.3 retired it (2026-09-27). `wall.ts` reads `import.meta.env` once at
 * import, so each case stubs the env and imports a fresh copy of the module.
 */
import { afterEach, describe, it, expect, vi } from 'vitest';

async function gateWith(env: Record<string, string>): Promise<boolean> {
	vi.resetModules();
	vi.stubEnv('PUBLIC_INCLUDE_MARKUP_INSIGHTS', '');
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

	it('the old name alone no longer opens it', async () => {
		expect(await gateWith({ PUBLIC_INCLUDE_SHANE: 'true' })).toBe(false);
	});

	it('stays closed with the name unset', async () => {
		expect(await gateWith({})).toBe(false);
	});
});
