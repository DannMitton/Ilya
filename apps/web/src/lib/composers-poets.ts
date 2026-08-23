/* ═══════════════════════════════════════════════════════════
   ILYA — Composer and Poet Lookup Tables
   Curated list of Russian art song composers and poets.
   Each entry has Latin name (Surname, Given), Cyrillic, and dates,
   plus a French display form where French spells the name differently.
   Alphabetized by surname for dropdown display.
   ═══════════════════════════════════════════════════════════ */

import type { Language } from './i18n';

export interface PersonEntry {
	latin: string;
	cyrillic: string;
	dates: string;
	/**
	 * The French display form, "Surname, Given", where French usage differs
	 * from `latin`. Display only (N.78, ruled by Dann 2026-08-21): storage
	 * always holds the English form, whatever the interface language.
	 *
	 * Source: the French Wikipedia article title, patronymic dropped,
	 * one authority for all 62 entries (ruled 2026-08-23). Absent on the
	 * thirteen entries French spells the same as English, or that French
	 * Wikipedia has no article for.
	 */
	french?: string;
}

export const COMPOSERS: PersonEntry[] = [
	{ latin: 'Arensky, Anton', cyrillic: 'Аренский, Антон', dates: '1861–1906', french: 'Arenski, Anton' },
	{ latin: 'Balakirev, Mily', cyrillic: 'Балакирев, Милий', dates: '1837–1910', french: 'Balakirev, Mili' },
	{ latin: 'Borodin, Alexander', cyrillic: 'Бородин, Александр', dates: '1833–1887', french: 'Borodine, Alexandre' },
	{ latin: 'Bulakhov, Pyotr', cyrillic: 'Булахов, Пётр', dates: '1822–1885' },
	{ latin: 'Cui, César', cyrillic: 'Кюи, Цезарь', dates: '1835–1918' },
	{ latin: 'Dargomyzhsky, Alexander', cyrillic: 'Даргомыжский, Александр', dates: '1813–1869', french: 'Dargomyjski, Alexandre' },
	{ latin: 'Glazunov, Alexander', cyrillic: 'Глазунов, Александр', dates: '1865–1936', french: 'Glazounov, Alexandre' },
	{ latin: 'Glinka, Mikhail', cyrillic: 'Глинка, Михаил', dates: '1804–1857', french: 'Glinka, Mikhaïl' },
	{ latin: 'Gretchaninov, Alexander', cyrillic: 'Гречанинов, Александр', dates: '1864–1956', french: 'Gretchaninov, Alexandre' },
	{ latin: 'Gurilev, Alexander', cyrillic: 'Гурилёв, Александр', dates: '1803–1858', french: 'Gouriliov, Alexandre' },
	{ latin: 'Kabalevsky, Dmitri', cyrillic: 'Кабалевский, Дмитрий', dates: '1904–1987', french: 'Kabalevski, Dmitri' },
	{ latin: 'Medtner, Nikolai', cyrillic: 'Метнер, Николай', dates: '1880–1951', french: 'Medtner, Nikolaï' },
	{ latin: 'Mussorgsky, Modest', cyrillic: 'Мусоргский, Модест', dates: '1839–1881', french: 'Moussorgski, Modeste' },
	{ latin: 'Prokofiev, Sergei', cyrillic: 'Прокофьев, Сергей', dates: '1891–1953', french: 'Prokofiev, Sergueï' },
	{ latin: 'Rachmaninoff, Sergei', cyrillic: 'Рахманинов, Сергей', dates: '1873–1943', french: 'Rachmaninov, Sergueï' },
	{ latin: 'Rimsky-Korsakov, Nikolai', cyrillic: 'Римский-Корсаков, Николай', dates: '1844–1908', french: 'Rimski-Korsakov, Nikolaï' },
	{ latin: 'Rubinstein, Anton', cyrillic: 'Рубинштейн, Антон', dates: '1829–1894' },
	{ latin: 'Scriabin, Alexander', cyrillic: 'Скрябин, Александр', dates: '1872–1915', french: 'Scriabine, Alexandre' },
	{ latin: 'Shostakovich, Dmitri', cyrillic: 'Шостакович, Дмитрий', dates: '1906–1975', french: 'Chostakovitch, Dmitri' },
	{ latin: 'Stravinsky, Igor', cyrillic: 'Стравинский, Игорь', dates: '1882–1971' },
	{ latin: 'Sviridov, Georgy', cyrillic: 'Свиридов, Георгий', dates: '1915–1998', french: 'Sviridov, Gueorgui' },
	{ latin: 'Taneyev, Sergei', cyrillic: 'Танеев, Сергей', dates: '1856–1915', french: 'Taneïev, Sergueï' },
	{ latin: 'Tchaikovsky, Pyotr', cyrillic: 'Чайковский, Пётр', dates: '1840–1893', french: 'Tchaïkovski, Piotr' },
	{ latin: 'Titov, Nikolai', cyrillic: 'Титов, Николай', dates: '1800–1875' },
	{ latin: 'Varlamov, Alexander', cyrillic: 'Варламов, Александр', dates: '1801–1848', french: 'Varlamov, Alexandre' },
];

export const POETS: PersonEntry[] = [
	{ latin: 'Akhmatova, Anna', cyrillic: 'Ахматова, Анна', dates: '1889–1966' },
	{ latin: 'Apukhtin, Alexei', cyrillic: 'Апухтин, Алексей', dates: '1840–1893', french: 'Apoukhtine, Alexeï' },
	{ latin: 'Balmont, Konstantin', cyrillic: 'Бальмонт, Константин', dates: '1867–1942', french: 'Balmont, Constantin' },
	{ latin: 'Baratynsky, Yevgeny', cyrillic: 'Баратынский, Евгений', dates: '1800–1844', french: 'Baratynski, Ievgueni' },
	{ latin: 'Bely, Andrei', cyrillic: 'Белый, Андрей', dates: '1880–1934', french: 'Biély, Andreï' },
	{ latin: 'Blok, Alexander', cyrillic: 'Блок, Александр', dates: '1880–1921', french: 'Blok, Alexandre' },
	{ latin: 'Bryusov, Valery', cyrillic: 'Брюсов, Валерий', dates: '1873–1924', french: 'Brioussov, Valéri' },
	{ latin: 'Bunin, Ivan', cyrillic: 'Бунин, Иван', dates: '1870–1953', french: 'Bounine, Ivan' },
	{ latin: 'Delvig, Anton', cyrillic: 'Дельвиг, Антон', dates: '1798–1831', french: 'Delwig, Anton' },
	{ latin: 'Fet, Afanasy', cyrillic: 'Фет, Афанасий', dates: '1820–1892', french: 'Fet, Afanassi' },
	{ latin: 'Galina, Glafira', cyrillic: 'Галина, Глафира', dates: '1870–1942' },
	{ latin: 'Gippius, Zinaida', cyrillic: 'Гиппиус, Зинаида', dates: '1869–1945', french: 'Hippius, Zinaïda' },
	{ latin: 'Goethe, Johann Wolfgang', cyrillic: 'Гёте, Иоганн Вольфганг', dates: '1749–1832' },
	{ latin: 'Golenishchev-Kutuzov, Arseny', cyrillic: 'Голенищев-Кутузов, Арсений', dates: '1848–1913' },
	{ latin: 'Heine, Heinrich', cyrillic: 'Гейне, Генрих', dates: '1797–1856' },
	{ latin: 'Khomyakov, Alexei', cyrillic: 'Хомяков, Алексей', dates: '1804–1860', french: 'Khomiakov, Alexeï' },
	{ latin: 'Koltsov, Alexei', cyrillic: 'Кольцов, Алексей', dates: '1809–1842', french: 'Koltsov, Alexeï' },
	{ latin: 'Lermontov, Mikhail', cyrillic: 'Лермонтов, Михаил', dates: '1814–1841', french: 'Lermontov, Mikhaïl' },
	{ latin: 'Mandelstam, Osip', cyrillic: 'Мандельштам, Осип', dates: '1891–1938', french: 'Mandelstam, Ossip' },
	{ latin: 'Marshak, Samuil', cyrillic: 'Маршак, Самуил', dates: '1887–1964', french: 'Marchak, Samouil' },
	{ latin: 'Maykov, Apollon', cyrillic: 'Майков, Аполлон', dates: '1821–1897', french: 'Maïkov, Apollon' },
	{ latin: 'Merezhkovsky, Dmitry', cyrillic: 'Мережковский, Дмитрий', dates: '1865–1941', french: 'Merejkovski, Dimitri' },
	{ latin: 'Mey, Lev', cyrillic: 'Мей, Лев', dates: '1822–1862', french: 'Meï, Lev' },
	{ latin: 'Nekrasov, Nikolai', cyrillic: 'Некрасов, Николай', dates: '1821–1878', french: 'Nekrassov, Nikolaï' },
	{ latin: 'Pasternak, Boris', cyrillic: 'Пастернак, Борис', dates: '1890–1960' },
	{ latin: 'Pleshcheyev, Alexei', cyrillic: 'Плещеев, Алексей', dates: '1825–1893', french: 'Plechtcheïev, Alexeï' },
	{ latin: 'Polonsky, Yakov', cyrillic: 'Полонский, Яков', dates: '1819–1898', french: 'Polonski, Iakov' },
	{ latin: 'Pushkin, Alexander', cyrillic: 'Пушкин, Александр', dates: '1799–1837', french: 'Pouchkine, Alexandre' },
	{ latin: 'Rathaus, Daniil', cyrillic: 'Ратгауз, Даниил', dates: '1868–1937' },
	{ latin: 'Shevchenko, Taras', cyrillic: 'Шевченко, Тарас', dates: '1814–1861', french: 'Chevtchenko, Taras' },
	{ latin: 'Shakespeare, William', cyrillic: 'Шекспир, Уильям', dates: '1564–1616' },
	{ latin: 'Sologub, Fyodor', cyrillic: 'Сологуб, Фёдор', dates: '1863–1927', french: 'Sologoub, Fiodor' },
	{ latin: 'Tolstoy, Alexei K.', cyrillic: 'Толстой, Алексей К.', dates: '1817–1875', french: 'Tolstoï, Alexis K.' },
	{ latin: 'Tsvetaeva, Marina', cyrillic: 'Цветаева, Марина', dates: '1892–1941', french: 'Tsvetaïeva, Marina' },
	{ latin: 'Tyutchev, Fyodor', cyrillic: 'Тютчев, Фёдор', dates: '1803–1873', french: 'Tiouttchev, Fiodor' },
	{ latin: 'Yesenin, Sergei', cyrillic: 'Есенин, Сергей', dates: '1895–1925', french: 'Essénine, Sergueï' },
	{ latin: 'Zhukovsky, Vasily', cyrillic: 'Жуковский, Василий', dates: '1783–1852', french: 'Joukovski, Vassili' },
];

/**
 * Turn a "Surname, Given" name and a date span into prose order:
 * "Given Surname (dates)". A name with no comma passes through whole.
 */
function proseWithDates(name: string, dates: string): string {
	const parts = name.split(',');
	if (parts.length >= 2) {
		const surname = parts[0].trim();
		const given = parts.slice(1).join(',').trim();
		return `${given} ${surname} (${dates})`;
	}
	return `${name} (${dates})`;
}

/**
 * Format a PersonEntry for paper display: "Given Surname (dates)"
 * Converts from "Surname, Given" storage format to natural prose order.
 *
 * Always English. This is the form that reaches storage, so it takes no
 * language and must never learn one (N.78).
 */
export function formatForPaper(entry: PersonEntry): string {
	return proseWithDates(entry.latin, entry.dates);
}

/**
 * The "Surname, Given" name a reader sees: `french` when the interface is
 * in French and the entry carries one, `latin` otherwise.
 *
 * N.78, ruled by Dann 2026-08-21: display only. Nothing this returns, and
 * nothing built from it, may be written to storage.
 */
export function personNameForDisplay(entry: PersonEntry, language?: Language): string {
	return language === 'fr' && entry.french ? entry.french : entry.latin;
}

/**
 * The form a reader sees on paper and on the dropdown trigger:
 * "Given Surname (dates)", in the language's own spelling.
 *
 * Display only. With no `language` argument it returns exactly what
 * `formatForPaper` returns.
 */
export function formatEntryForDisplay(entry: PersonEntry, language?: Language): string {
	return proseWithDates(personNameForDisplay(entry, language), entry.dates);
}

/**
 * Take any name string (from metadata/localStorage) and return
 * the correct paper display format: "Given Surname (dates)".
 *
 * Matches against both COMPOSERS and POETS arrays using all known
 * formats: "Surname, Given", "Given Surname (dates)", or "Surname, Given (dates)".
 * Returns the original string unchanged if no match is found (custom entry).
 *
 * Matching is always against the English forms, because those are the only
 * forms that reach storage. `language` steers the *return* alone: pass 'fr'
 * and a matched entry comes back in its French form. Omit it and the result
 * is what this function has always returned.
 */
export function formatNameForPaper(raw: string, list: PersonEntry[], language?: Language): string {
	if (!raw) return '';
	const trimmed = raw.trim();
	// Strip any trailing parenthesized dates for matching
	const withoutDates = trimmed.replace(/\s*\([^)]*\)\s*$/, '').trim();

	for (const entry of list) {
		// Match "Surname, Given" (e.g. "Shostakovich, Dmitri")
		if (withoutDates === entry.latin) {
			return formatEntryForDisplay(entry, language);
		}
		// Match already-formatted "Given Surname" (e.g. "Dmitri Shostakovich")
		const parts = entry.latin.split(',');
		if (parts.length >= 2) {
			const proseForm = `${parts.slice(1).join(',').trim()} ${parts[0].trim()}`;
			if (withoutDates === proseForm) {
				return formatEntryForDisplay(entry, language);
			}
		}
		// Match full formatForPaper output (e.g. "Dmitri Shostakovich (1906–1975)")
		if (trimmed === formatForPaper(entry)) {
			return formatEntryForDisplay(entry, language);
		}
	}

	// No match: return as-is (custom entry)
	return trimmed;
}

/**
 * Format a PersonEntry for display in the dropdown trigger: "Surname, Given (dates)"
 *
 * Display only. `language` of 'fr' draws the French form where the entry has
 * one; with no `language` the result is unchanged.
 */
export function formatPersonDisplay(entry: PersonEntry, language?: Language): string {
	return `${personNameForDisplay(entry, language)} (${entry.dates})`;
}

/**
 * Extract surname from a PersonEntry's Latin name (everything before the first comma).
 */
export function extractSurname(entry: PersonEntry): string {
	return entry.latin.split(',')[0].trim();
}
