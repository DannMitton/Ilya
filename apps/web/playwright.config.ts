import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
	testDir: './e2e',
	fullyParallel: false,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: 1,
	reporter: 'list',
	timeout: 60_000,
	use: {
		baseURL: 'http://localhost:5173',
		trace: 'on-first-retry',
	},
	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] },
		},
		/* N.153 STAGE 5. Clause 13's floor is defined at phone width, so the
		   loupe scan runs here and only here: its own `testDir`, which the
		   `chromium` project above never reads. 390 x 844 at 3x is the width
		   stage 3b measured at; `hasTouch` and `isMobile` make
		   `(pointer: coarse)` match, which the page's tap band reads. */
		{
			name: 'phone',
			testDir: './e2e-phone',
			use: {
				...devices['Desktop Chrome'],
				viewport: { width: 390, height: 844 },
				deviceScaleFactor: 3,
				hasTouch: true,
				isMobile: true,
			},
		},
	],
	webServer: {
		command: 'pnpm dev',
		url: 'http://localhost:5173',
		reuseExistingServer: !process.env.CI,
		timeout: 30_000,
	},
});
