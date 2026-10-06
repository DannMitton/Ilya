/**
 * The reader's stamp must name the reader that is installed, or a kept reading
 * would be trusted after the dependency changed, or thrown away for nothing.
 */
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { HOMR_WEB_VERSION, OMR_MODEL, READER_STAMP } from './stamp';

describe('READER_STAMP', () => {
	it('names the installed homr-web version and the model', () => {
		const pkg = JSON.parse(readFileSync('node_modules/homr-web/package.json', 'utf8'));
		expect(HOMR_WEB_VERSION).toBe(pkg.version);
		expect(OMR_MODEL).toBe('465');
		expect(READER_STAMP).toBe(`homr-web@${pkg.version}/465`);
	});

	it('is the version the app depends on', () => {
		const app = JSON.parse(readFileSync('package.json', 'utf8'));
		expect(app.dependencies['homr-web']).toContain(`homr-web-${HOMR_WEB_VERSION}.tgz`);
	});
});
