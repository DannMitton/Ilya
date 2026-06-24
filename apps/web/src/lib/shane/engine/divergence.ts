import type { CalibratedFormant, Vowel } from './types';

const TOL_F1_HZ = 50, TOL_F2_HZ = 100;
export interface IghReading extends CalibratedFormant { isDivergent?: boolean | null; }

function usable(f?: IghReading): boolean {
	return !!f && f.reading !== 'provisional' && f.f1 != null && f.f2 != null;
}

/** Profile-level [ɨ] divergence pass (engine spec §7, relocation Option A). Mutates the profile. */
export function applyIghDivergence(profile: Partial<Record<Vowel, IghReading>>): Partial<Record<Vowel, IghReading>> {
	const igh = profile['ɨ'];
	if (!igh) return profile;
	const i = profile['i'], u = profile['u'];
	if (!usable(i) || !usable(u)) { igh.isDivergent = null; igh.reading = 'provisional'; return profile; }
	const e1 = i!.f1 * 1.365, e2 = i!.f2! - 0.67 * (i!.f2! - u!.f2!);
	const divergent = Math.abs(igh.f1 - e1) > TOL_F1_HZ || Math.abs((igh.f2 ?? 0) - e2) > TOL_F2_HZ;
	igh.isDivergent = divergent;
	if (divergent) igh.reading = 'provisional';
	return profile;
}
