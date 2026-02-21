/* ═══════════════════════════════════════════════════════════
   ILYA — Composer and Poet Lookup Tables
   Curated list of Russian art song composers and poets.
   Each entry has Latin name (Surname, Given), Cyrillic, and dates.
   Alphabetized by surname for dropdown display.
   ═══════════════════════════════════════════════════════════ */

export interface PersonEntry {
	latin: string;
	cyrillic: string;
	dates: string;
}

export const COMPOSERS: PersonEntry[] = [
	{ latin: 'Arensky, Anton', cyrillic: 'Аренский, Антон', dates: '1861–1906' },
	{ latin: 'Balakirev, Mily', cyrillic: 'Балакирев, Милий', dates: '1837–1910' },
	{ latin: 'Borodin, Alexander', cyrillic: 'Бородин, Александр', dates: '1833–1887' },
	{ latin: 'Bulakhov, Pyotr', cyrillic: 'Булахов, Пётр', dates: '1822–1885' },
	{ latin: 'Cui, César', cyrillic: 'Кюи, Цезарь', dates: '1835–1918' },
	{ latin: 'Dargomyzhsky, Alexander', cyrillic: 'Даргомыжский, Александр', dates: '1813–1869' },
	{ latin: 'Glazunov, Alexander', cyrillic: 'Глазунов, Александр', dates: '1865–1936' },
	{ latin: 'Glinka, Mikhail', cyrillic: 'Глинка, Михаил', dates: '1804–1857' },
	{ latin: 'Gretchaninov, Alexander', cyrillic: 'Гречанинов, Александр', dates: '1864–1956' },
	{ latin: 'Gurilev, Alexander', cyrillic: 'Гурилёв, Александр', dates: '1803–1858' },
	{ latin: 'Kabalevsky, Dmitri', cyrillic: 'Кабалевский, Дмитрий', dates: '1904–1987' },
	{ latin: 'Medtner, Nikolai', cyrillic: 'Метнер, Николай', dates: '1880–1951' },
	{ latin: 'Mussorgsky, Modest', cyrillic: 'Мусоргский, Модест', dates: '1839–1881' },
	{ latin: 'Prokofiev, Sergei', cyrillic: 'Прокофьев, Сергей', dates: '1891–1953' },
	{ latin: 'Rachmaninoff, Sergei', cyrillic: 'Рахманинов, Сергей', dates: '1873–1943' },
	{ latin: 'Rimsky-Korsakov, Nikolai', cyrillic: 'Римский-Корсаков, Николай', dates: '1844–1908' },
	{ latin: 'Rubinstein, Anton', cyrillic: 'Рубинштейн, Антон', dates: '1829–1894' },
	{ latin: 'Scriabin, Alexander', cyrillic: 'Скрябин, Александр', dates: '1872–1915' },
	{ latin: 'Shostakovich, Dmitri', cyrillic: 'Шостакович, Дмитрий', dates: '1906–1975' },
	{ latin: 'Stravinsky, Igor', cyrillic: 'Стравинский, Игорь', dates: '1882–1971' },
	{ latin: 'Sviridov, Georgy', cyrillic: 'Свиридов, Георгий', dates: '1915–1998' },
	{ latin: 'Taneyev, Sergei', cyrillic: 'Танеев, Сергей', dates: '1856–1915' },
	{ latin: 'Tchaikovsky, Pyotr', cyrillic: 'Чайковский, Пётр', dates: '1840–1893' },
	{ latin: 'Titov, Nikolai', cyrillic: 'Титов, Николай', dates: '1800–1875' },
	{ latin: 'Varlamov, Alexander', cyrillic: 'Варламов, Александр', dates: '1801–1848' },
];

export const POETS: PersonEntry[] = [
	{ latin: 'Akhmatova, Anna', cyrillic: 'Ахматова, Анна', dates: '1889–1966' },
	{ latin: 'Apukhtin, Alexei', cyrillic: 'Апухтин, Алексей', dates: '1840–1893' },
	{ latin: 'Balmont, Konstantin', cyrillic: 'Бальмонт, Константин', dates: '1867–1942' },
	{ latin: 'Baratynsky, Yevgeny', cyrillic: 'Баратынский, Евгений', dates: '1800–1844' },
	{ latin: 'Bely, Andrei', cyrillic: 'Белый, Андрей', dates: '1880–1934' },
	{ latin: 'Blok, Alexander', cyrillic: 'Блок, Александр', dates: '1880–1921' },
	{ latin: 'Bryusov, Valery', cyrillic: 'Брюсов, Валерий', dates: '1873–1924' },
	{ latin: 'Bunin, Ivan', cyrillic: 'Бунин, Иван', dates: '1870–1953' },
	{ latin: 'Delvig, Anton', cyrillic: 'Дельвиг, Антон', dates: '1798–1831' },
	{ latin: 'Fet, Afanasy', cyrillic: 'Фет, Афанасий', dates: '1820–1892' },
	{ latin: 'Galina, Glafira', cyrillic: 'Галина, Глафира', dates: '1870–1942' },
	{ latin: 'Gippius, Zinaida', cyrillic: 'Гиппиус, Зинаида', dates: '1869–1945' },
	{ latin: 'Goethe, Johann Wolfgang', cyrillic: 'Гёте, Иоганн Вольфганг', dates: '1749–1832' },
	{ latin: 'Golenishchev-Kutuzov, Arseny', cyrillic: 'Голенищев-Кутузов, Арсений', dates: '1848–1913' },
	{ latin: 'Heine, Heinrich', cyrillic: 'Гейне, Генрих', dates: '1797–1856' },
	{ latin: 'Khomyakov, Alexei', cyrillic: 'Хомяков, Алексей', dates: '1804–1860' },
	{ latin: 'Koltsov, Alexei', cyrillic: 'Кольцов, Алексей', dates: '1809–1842' },
	{ latin: 'Lermontov, Mikhail', cyrillic: 'Лермонтов, Михаил', dates: '1814–1841' },
	{ latin: 'Mandelstam, Osip', cyrillic: 'Мандельштам, Осип', dates: '1891–1938' },
	{ latin: 'Marshak, Samuil', cyrillic: 'Маршак, Самуил', dates: '1887–1964' },
	{ latin: 'Maykov, Apollon', cyrillic: 'Майков, Аполлон', dates: '1821–1897' },
	{ latin: 'Merezhkovsky, Dmitry', cyrillic: 'Мережковский, Дмитрий', dates: '1865–1941' },
	{ latin: 'Mey, Lev', cyrillic: 'Мей, Лев', dates: '1822–1862' },
	{ latin: 'Nekrasov, Nikolai', cyrillic: 'Некрасов, Николай', dates: '1821–1878' },
	{ latin: 'Pasternak, Boris', cyrillic: 'Пастернак, Борис', dates: '1890–1960' },
	{ latin: 'Pleshcheyev, Alexei', cyrillic: 'Плещеев, Алексей', dates: '1825–1893' },
	{ latin: 'Polonsky, Yakov', cyrillic: 'Полонский, Яков', dates: '1819–1898' },
	{ latin: 'Pushkin, Alexander', cyrillic: 'Пушкин, Александр', dates: '1799–1837' },
	{ latin: 'Rathaus, Daniil', cyrillic: 'Ратгауз, Даниил', dates: '1868–1937' },
	{ latin: 'Shevchenko, Taras', cyrillic: 'Шевченко, Тарас', dates: '1814–1861' },
	{ latin: 'Shakespeare, William', cyrillic: 'Шекспир, Уильям', dates: '1564–1616' },
	{ latin: 'Sologub, Fyodor', cyrillic: 'Сологуб, Фёдор', dates: '1863–1927' },
	{ latin: 'Tolstoy, Alexei K.', cyrillic: 'Толстой, Алексей К.', dates: '1817–1875' },
	{ latin: 'Tsvetaeva, Marina', cyrillic: 'Цветаева, Марина', dates: '1892–1941' },
	{ latin: 'Tyutchev, Fyodor', cyrillic: 'Тютчев, Фёдор', dates: '1803–1873' },
	{ latin: 'Yesenin, Sergei', cyrillic: 'Есенин, Сергей', dates: '1895–1925' },
	{ latin: 'Zhukovsky, Vasily', cyrillic: 'Жуковский, Василий', dates: '1783–1852' },
];

/**
 * Format a PersonEntry for paper display: "Given Surname (dates)"
 * Converts from "Surname, Given" storage format to natural prose order.
 */
export function formatForPaper(entry: PersonEntry): string {
	const parts = entry.latin.split(',');
	if (parts.length >= 2) {
		const surname = parts[0].trim();
		const given = parts.slice(1).join(',').trim();
		return `${given} ${surname} (${entry.dates})`;
	}
	return `${entry.latin} (${entry.dates})`;
}

/**
 * Take any name string (from metadata/localStorage) and return
 * the correct paper display format: "Given Surname (dates)".
 *
 * Matches against both COMPOSERS and POETS arrays using all known
 * formats: "Surname, Given", "Given Surname (dates)", or "Surname, Given (dates)".
 * Returns the original string unchanged if no match is found (custom entry).
 */
export function formatNameForPaper(raw: string, list: PersonEntry[]): string {
	if (!raw) return '';
	const trimmed = raw.trim();
	// Strip any trailing parenthesized dates for matching
	const withoutDates = trimmed.replace(/\s*\([^)]*\)\s*$/, '').trim();

	for (const entry of list) {
		// Match "Surname, Given" (e.g. "Shostakovich, Dmitri")
		if (withoutDates === entry.latin) {
			return formatForPaper(entry);
		}
		// Match already-formatted "Given Surname" (e.g. "Dmitri Shostakovich")
		const parts = entry.latin.split(',');
		if (parts.length >= 2) {
			const proseForm = `${parts.slice(1).join(',').trim()} ${parts[0].trim()}`;
			if (withoutDates === proseForm) {
				return formatForPaper(entry);
			}
		}
		// Match full formatForPaper output (e.g. "Dmitri Shostakovich (1906–1975)")
		if (trimmed === formatForPaper(entry)) {
			return trimmed;
		}
	}

	// No match: return as-is (custom entry)
	return trimmed;
}

/**
 * Format a PersonEntry for display in the dropdown trigger: "Surname, Given (dates)"
 */
export function formatPersonDisplay(entry: PersonEntry): string {
	return `${entry.latin} (${entry.dates})`;
}

/**
 * Extract surname from a PersonEntry's Latin name (everything before the first comma).
 */
export function extractSurname(entry: PersonEntry): string {
	return entry.latin.split(',')[0].trim();
}
