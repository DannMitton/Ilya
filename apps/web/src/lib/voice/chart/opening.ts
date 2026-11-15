/**
 * Where the new capture screen opens, and what it walks (N.199 Step 4b), for each way the wizard sends a singer to it. Pure, so the
 * wizard (which is at its line ceiling) carries one line for each of its three doors and the rules are tested here.
 */
import type { CalibratedFormant, Vowel } from '../engine/types';
import { nextVowel, TOUR_HARDEST } from './tour';

export interface Opening {
	start: Vowel;
	/** A list to walk, then return to the summary (a re-take). Absent: Ilya's order. */
	pass?: Vowel[];
}

type Profile = Partial<Record<Vowel, CalibratedFormant>>;
const sungOf = (profile: Profile): Set<Vowel> => new Set((Object.keys(profile) as Vowel[]).filter((v) => !!profile[v]));

/** Begin: the first vowel Ilya's order has not got (the first of the seven for a voice with none). */
export const openTour = (profile: Profile): Opening => ({ start: nextVowel(sungOf(profile), null) ?? 'i' });

/** The invitation to sing the remaining three: the first of the three hardest not yet sung. */
export const openChallenging = (profile: Profile): Opening => ({ start: TOUR_HARDEST.find((v) => !profile[v]) ?? TOUR_HARDEST[0] });

/** A re-take from the summary: the vowels it names, in order, then back. */
export const openRetake = (vowels: Vowel[]): Opening => ({ start: vowels[0], pass: vowels });
