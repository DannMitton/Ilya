import base from './playwright.config';
import { defineConfig } from '@playwright/test';
const exe = { launchOptions: { executablePath: '/opt/pw-browsers/chromium' } };
export default defineConfig({
	...base,
	testDir: './e2e-baseline',
	timeout: 180_000,
	webServer: { ...base.webServer, timeout: 120_000 },
	projects: [
		{ name: 'desk', use: { ...base.projects![0].use, ...exe } },
		{ name: 'phone', testDir: './e2e-baseline', use: { ...base.projects![1].use, ...exe } },
	],
});
