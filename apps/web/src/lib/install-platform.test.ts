/**
 * Tests for which browser the install banner is talking to (QUEUE row 100).
 *
 * NO DOM HERE, as `install-decline.test.ts`: a user-agent string in, a word
 * out. The strings are the shapes the browsers send; each carries its source.
 * None was taken from a device in this session (a cloud box has no iPhone), so
 * they are written from the documented shapes and each is marked as such.
 */

import { describe, expect, it } from 'vitest';
import { installPlatform } from './install-platform';

// Apple's documented iPhone Safari shape (WebKit user agent, "Version/x Mobile/..Safari").
const IPHONE_SAFARI =
	'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1';
// Google's documented Chrome-on-iOS shape: the `CriOS/` token replaces `Version/`.
const IPHONE_CHROME =
	'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/126.0.6478.153 Mobile/15E148 Safari/604.1';
// Mozilla's documented Firefox-on-iOS shape: the `FxiOS/` token.
const IPHONE_FIREFOX =
	'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) FxiOS/127.0 Mobile/15E148 Safari/605.1.15';
// Google's documented Chrome-on-Android shape.
const ANDROID_CHROME =
	'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.6478.122 Mobile Safari/537.36';
// Safari on a Mac. A current iPadOS Safari sends this same Macintosh shape by default (desktop-class browsing), so it is `other`: the component's behaviour today, not changed here.
const MAC_SAFARI =
	'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15';
// An older iPad Safari that names `iPad`. A current iPadOS Safari sends the Macintosh string above by default.
const IPAD_SAFARI =
	'Mozilla/5.0 (iPad; CPU OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1 Mobile/15E148 Safari/604.1';

describe('installPlatform', () => {
	it('iPhone Safari is ios-safari', () => {
		expect(installPlatform(IPHONE_SAFARI)).toBe('ios-safari');
	});

	it('iPhone Chrome (CriOS) is ios-chrome', () => {
		expect(installPlatform(IPHONE_CHROME)).toBe('ios-chrome');
	});

	it('iPhone Firefox (FxiOS) is other', () => {
		expect(installPlatform(IPHONE_FIREFOX)).toBe('other');
	});

	it('Android Chrome is other', () => {
		expect(installPlatform(ANDROID_CHROME)).toBe('other');
	});

	it('desktop Safari is other', () => {
		expect(installPlatform(MAC_SAFARI)).toBe('other');
	});

	it('an iPad Safari string that names iPad is ios-safari', () => {
		expect(installPlatform(IPAD_SAFARI)).toBe('ios-safari');
	});
});
