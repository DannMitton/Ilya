# BRIEF. N.78 research: the established French form of 62 names

**Paste this into a fresh Sonnet session. It is self-contained: you need no
repository access and no code.** Every name you must research is listed below.

## Goal

For each of the 62 people below, establish **the established French form of the
name**, or establish that French uses the same form the list already carries.

Ilya is a Russian lyric diction tool for singers. It runs in English and in
French. Its composer and poet dropdowns currently show one Latin spelling, which
is the English one: `Mussorgsky, Modest`. A francophone singer expects
`Moussorgski, Modeste`. This research produces the table that fixes that.

## The authority, and use it first every time

**`data.bnf.fr`, the Bibliothèque nationale de France authority records.** It is
the standing reference for how French publishing spells a person's name, and
using one source for all 62 is the point: 62 separate judgement calls would
produce an inconsistent table.

Order of resort, and **record which one you used for every single row**:

1. `data.bnf.fr` authority record.
2. French Wikipedia's article title, if BnF has no record.
3. Larousse or Universalis.
4. **Nothing else.** If none of those three carries the person, the answer is
   `NOT ESTABLISHED`. Do not transliterate the Cyrillic yourself, do not reason
   from a pattern you noticed in other names, and do not adapt an English
   spelling by analogy.

## The rules

- **Surname and given name both.** The list is `Surname, Given`. French changes
  both often enough to matter: `Mussorgsky, Modest` becomes
  `Moussorgski, Modeste`.
- **`same` is a real and common answer.** Shakespeare is Shakespeare in French.
  Say `same` rather than repeating the English, so the difference set is
  obvious.
- **Do not change the Cyrillic and do not change the dates.** They are given
  only so you can identify the right person. A BnF record whose dates disagree
  with the row is a different person, or the row is wrong: say which you think
  it is and mark the row `NOT ESTABLISHED`.
- **Do not invent a rule.** French does have a systematic convention for
  transliterating Cyrillic, and the established forms break it often enough that
  a rule would be right most of the time and wrong the rest. Every row comes
  from a source you looked at.
- **Where French usage is genuinely split**, give both, say which your source
  prefers, and mark the row `SPLIT`. `Rachmaninoff` is the likeliest case.

## What to return

A single markdown table, 62 rows, in the order given below, plus the sections
after it.

| # | list | English form | French form | source | note |
|---|---|---|---|---|---|

- **list**: `composer` or `poet`.
- **French form**: the full `Surname, Given` in French, or `same`.
- **source**: `BnF`, `wikipedia-fr`, `larousse`, `universalis`, or `none`.
- **note**: only when the row is `SPLIT` or `NOT ESTABLISHED`, or when the dates
  disagreed. Otherwise leave it empty.

Then three short sections:

1. **The difference set.** Just the rows where the French form is not `same`,
   counted. This is the number that matters.
2. **What I could not establish.** Every `NOT ESTABLISHED` and every `SPLIT`,
   with what you found and why it was not enough. **NOT ESTABLISHED beats a
   complete invented answer.**
3. **Anything that looked wrong in the English list itself.** You are reading 62
   authority records; if one of them says the given English spelling or a date is
   wrong, say so. Do not fix it. Report it.

## Do not

- Do not write code, do not produce a TypeScript file, and do not propose a data
  structure. This is research. The table is the whole deliverable.
- Do not research anyone not on this list.
- Do not translate the note field or any of your prose into French.

---

## The 62 names

### Composers, 25

| # | English form | Cyrillic | dates |
|---|---|---|---|
| 1 | Arensky, Anton | Аренский, Антон | 1861–1906 |
| 2 | Balakirev, Mily | Балакирев, Милий | 1837–1910 |
| 3 | Borodin, Alexander | Бородин, Александр | 1833–1887 |
| 4 | Bulakhov, Pyotr | Булахов, Пётр | 1822–1885 |
| 5 | Cui, César | Кюи, Цезарь | 1835–1918 |
| 6 | Dargomyzhsky, Alexander | Даргомыжский, Александр | 1813–1869 |
| 7 | Glazunov, Alexander | Глазунов, Александр | 1865–1936 |
| 8 | Glinka, Mikhail | Глинка, Михаил | 1804–1857 |
| 9 | Gretchaninov, Alexander | Гречанинов, Александр | 1864–1956 |
| 10 | Gurilev, Alexander | Гурилёв, Александр | 1803–1858 |
| 11 | Kabalevsky, Dmitri | Кабалевский, Дмитрий | 1904–1987 |
| 12 | Medtner, Nikolai | Метнер, Николай | 1880–1951 |
| 13 | Mussorgsky, Modest | Мусоргский, Модест | 1839–1881 |
| 14 | Prokofiev, Sergei | Прокофьев, Сергей | 1891–1953 |
| 15 | Rachmaninoff, Sergei | Рахманинов, Сергей | 1873–1943 |
| 16 | Rimsky-Korsakov, Nikolai | Римский-Корсаков, Николай | 1844–1908 |
| 17 | Rubinstein, Anton | Рубинштейн, Антон | 1829–1894 |
| 18 | Scriabin, Alexander | Скрябин, Александр | 1872–1915 |
| 19 | Shostakovich, Dmitri | Шостакович, Дмитрий | 1906–1975 |
| 20 | Stravinsky, Igor | Стравинский, Игорь | 1882–1971 |
| 21 | Sviridov, Georgy | Свиридов, Георгий | 1915–1998 |
| 22 | Taneyev, Sergei | Танеев, Сергей | 1856–1915 |
| 23 | Tchaikovsky, Pyotr | Чайковский, Пётр | 1840–1893 |
| 24 | Titov, Nikolai | Титов, Николай | 1800–1875 |
| 25 | Varlamov, Alexander | Варламов, Александр | 1801–1848 |

### Poets, 37

| # | English form | Cyrillic | dates |
|---|---|---|---|
| 1 | Akhmatova, Anna | Ахматова, Анна | 1889–1966 |
| 2 | Apukhtin, Alexei | Апухтин, Алексей | 1840–1893 |
| 3 | Balmont, Konstantin | Бальмонт, Константин | 1867–1942 |
| 4 | Baratynsky, Yevgeny | Баратынский, Евгений | 1800–1844 |
| 5 | Bely, Andrei | Белый, Андрей | 1880–1934 |
| 6 | Blok, Alexander | Блок, Александр | 1880–1921 |
| 7 | Bryusov, Valery | Брюсов, Валерий | 1873–1924 |
| 8 | Bunin, Ivan | Бунин, Иван | 1870–1953 |
| 9 | Delvig, Anton | Дельвиг, Антон | 1798–1831 |
| 10 | Fet, Afanasy | Фет, Афанасий | 1820–1892 |
| 11 | Galina, Glafira | Галина, Глафира | 1870–1942 |
| 12 | Gippius, Zinaida | Гиппиус, Зинаида | 1869–1945 |
| 13 | Goethe, Johann Wolfgang | Гёте, Иоганн Вольфганг | 1749–1832 |
| 14 | Golenishchev-Kutuzov, Arseny | Голенищев-Кутузов, Арсений | 1848–1913 |
| 15 | Heine, Heinrich | Гейне, Генрих | 1797–1856 |
| 16 | Khomyakov, Alexei | Хомяков, Алексей | 1804–1860 |
| 17 | Koltsov, Alexei | Кольцов, Алексей | 1809–1842 |
| 18 | Lermontov, Mikhail | Лермонтов, Михаил | 1814–1841 |
| 19 | Mandelstam, Osip | Мандельштам, Осип | 1891–1938 |
| 20 | Marshak, Samuil | Маршак, Самуил | 1887–1964 |
| 21 | Maykov, Apollon | Майков, Аполлон | 1821–1897 |
| 22 | Merezhkovsky, Dmitry | Мережковский, Дмитрий | 1865–1941 |
| 23 | Mey, Lev | Мей, Лев | 1822–1862 |
| 24 | Nekrasov, Nikolai | Некрасов, Николай | 1821–1878 |
| 25 | Pasternak, Boris | Пастернак, Борис | 1890–1960 |
| 26 | Pleshcheyev, Alexei | Плещеев, Алексей | 1825–1893 |
| 27 | Polonsky, Yakov | Полонский, Яков | 1819–1898 |
| 28 | Pushkin, Alexander | Пушкин, Александр | 1799–1837 |
| 29 | Rathaus, Daniil | Ратгауз, Даниил | 1868–1937 |
| 30 | Shevchenko, Taras | Шевченко, Тарас | 1814–1861 |
| 31 | Shakespeare, William | Шекспир, Уильям | 1564–1616 |
| 32 | Sologub, Fyodor | Сологуб, Фёдор | 1863–1927 |
| 33 | Tolstoy, Alexei K. | Толстой, Алексей К. | 1817–1875 |
| 34 | Tsvetaeva, Marina | Цветаева, Марина | 1892–1941 |
| 35 | Tyutchev, Fyodor | Тютчев, Фёдор | 1803–1873 |
| 36 | Yesenin, Sergei | Есенин, Сергей | 1895–1925 |
| 37 | Zhukovsky, Vasily | Жуковский, Василий | 1783–1852 |
