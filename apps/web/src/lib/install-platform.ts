/**
 * Which browser the install banner is talking to, read from the user agent.
 *
 * PLAIN TYPESCRIPT, NOT THE COMPONENT, for the reason `install-decline.ts`
 * gives: `apps/web` runs vitest with no DOM, so a rule in the component is a
 * rule no gate can reach.
 *
 * `ios-safari` is what the component called "iOS" before this file: the
 * Safari test, character for character. `ios-chrome` is the new branch, the
 * `CriOS` token. `FxiOS` (Firefox on iPhone) and everything else is `other`;
 * no source was read for Firefox on iOS, so it stays excluded.
 *
 * iPadOS Safari sends a Macintosh user agent by default (desktop-class
 * browsing), so a current iPad with default settings reaches `other`. That is
 * the component's behaviour today and is not changed here.
 */
export type InstallPlatform = 'ios-safari' | 'ios-chrome' | 'other';

export function installPlatform(ua: string): InstallPlatform {
	if (!/iphone|ipad|ipod/i.test(ua)) return 'other';
	if (ua.includes('FxiOS')) return 'other';
	if (ua.includes('CriOS')) return 'ios-chrome';
	return 'ios-safari';
}
