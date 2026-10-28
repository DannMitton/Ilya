import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

/* N.196. The security headers `vercel.json` sets on every response, pinned. The file is read by
   path from the repository root (four levels up), as contrast.test.ts reads `app.css`, so this runs
   with the rest of `apps/web`. Vercel is not asked: whether a later rule overrides an earlier one on
   the same key is NOT ESTABLISHED, and it does not arise here because the two rules below share no
   key, so no assertion depends on their order. */
interface Rule {
	source: string;
	headers: { key: string; value: string }[];
}
const config = JSON.parse(readFileSync(fileURLToPath(new URL('../../../../vercel.json', import.meta.url)), 'utf8')) as { headers: Rule[] };
const rule = (source: string): Rule | undefined => config.headers.find((r) => r.source === source);
const valueOf = (r: Rule | undefined, key: string): string | undefined => r?.headers.find((h) => h.key === key)?.value;

describe('N.196: security headers on every response', () => {
	const all = rule('/(.*)');

	it('sets the four simple headers on every path', () => {
		expect(valueOf(all, 'X-Content-Type-Options')).toBe('nosniff');
		expect(valueOf(all, 'Referrer-Policy')).toBe('strict-origin-when-cross-origin');
		expect(valueOf(all, 'X-Frame-Options')).toBe('DENY');
		expect(valueOf(all, 'Permissions-Policy')).toBe('geolocation=(), payment=(), usb=(), microphone=(self), camera=(self)');
	});

	it('carries a report-only policy and never an enforcing one', () => {
		const policy = valueOf(all, 'Content-Security-Policy-Report-Only');
		expect(policy).toMatch(/^default-src 'self'; /);
		// Vercel's schema refuses a header value over 4,096 characters.
		expect(policy!.length).toBeLessThan(4096);
		const keys = config.headers.flatMap((r) => r.headers.map((h) => h.key.toLowerCase()));
		expect(keys).not.toContain('content-security-policy');
	});

	it('names every origin the app is known to reach, and no other', () => {
		const policy = valueOf(all, 'Content-Security-Policy-Report-Only')!;
		const origins = [...policy.matchAll(/https:\/\/[^\s;]+/g)].map((m) => m[0]).sort();
		expect(origins).toEqual(['https://cdn.jsdelivr.net', 'https://cdn.jsdelivr.net', 'https://fonts.googleapis.com', 'https://fonts.gstatic.com']);
	});

	it('leaves isolation to a later row: no Cross-Origin-Opener-Policy or Cross-Origin-Embedder-Policy', () => {
		const keys = config.headers.flatMap((r) => r.headers.map((h) => h.key.toLowerCase()));
		expect(keys).not.toContain('cross-origin-opener-policy');
		expect(keys).not.toContain('cross-origin-embedder-policy');
	});

	it('does not touch Strict-Transport-Security, which Vercel sets on a custom domain', () => {
		const keys = config.headers.flatMap((r) => r.headers.map((h) => h.key.toLowerCase()));
		expect(keys).not.toContain('strict-transport-security');
	});

	it('keeps the immutable asset cache rule exactly, sharing no key with the security rule', () => {
		const immutable = rule('/_app/immutable/(.*)');
		expect(immutable?.headers).toEqual([{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }]);
		const shared = immutable!.headers.map((h) => h.key).filter((k) => all?.headers.some((h) => h.key === k));
		expect(shared).toEqual([]);
	});

	it('adds no ignoreCommand, which would override the dashboard’s ignored build step', () => {
		expect(readFileSync(fileURLToPath(new URL('../../../../vercel.json', import.meta.url)), 'utf8')).not.toContain('ignoreCommand');
	});
});
