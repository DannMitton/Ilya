import { describe, expect, it } from 'vitest';
import { BEFORE_TOPICS, TOPICS, tidy, withImagery, withPoint, withSuggestions, withTopic } from './intake-answers';

describe('the intake answers (one tidy for both stations, N.203 lane 61 Step 1)', () => {
	it('asks five scaled questions in "Describe your voice", and the acoustics question is not among them', () => {
		expect(BEFORE_TOPICS).toEqual(['top', 'bottom', 'passaggi', 'sustained', 'softHigh']);
		expect(BEFORE_TOPICS).not.toContain('acoustics');
		expect(TOPICS).toHaveLength(6);
	});

	it('stores a point and clears it back to nothing', () => {
		const one = withPoint(undefined, 'top', 3);
		expect(one).toEqual({ top: 3 });
		expect(withPoint(one, 'bottom', 'not-sure')).toEqual({ top: 3, bottom: 'not-sure' });
		expect(withPoint(one, 'top', undefined)).toBeUndefined();
	});

	it('keeps the other station’s answers when one station writes (each writes the whole object)', () => {
		const shares = withSuggestions(withPoint(undefined, 'acoustics', 4), 'all');
		const both = withPoint(shares, 'top', 2);
		expect(both).toEqual({ acoustics: 4, suggestions: 'all', top: 2 });
		expect(withTopic(both, 'high', false)).toEqual({ acoustics: 4, suggestions: 'all', top: 2, topics: { high: false } });
	});

	it('drops what equals its default: all topics on, two suggestions, imagery on', () => {
		expect(withTopic(withTopic(undefined, 'high', false), 'high', true)).toBeUndefined();
		expect(withSuggestions(undefined, 'two')).toBeUndefined();
		expect(withImagery(undefined, true)).toBeUndefined();
		expect(withImagery(undefined, false)).toEqual({ imagery: false });
	});

	it('is the same function whichever station calls it: undefined members never survive', () => {
		expect(tidy({ top: undefined, suggestions: 'all' })).toEqual({ suggestions: 'all' });
		expect(tidy({})).toBeUndefined();
	});
});
