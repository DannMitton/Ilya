# Report: aria titles r3 (Sonnet helper, 2026-11-10)

Output: arias-for-library_r3_2026-11-10.json, md5 76dd8f4675ccd662239d20742dc161eb. Checker (check-aria-r2.mjs run from /home/claude/gates on the r3 file): 0 failures (89 r3 entries + 14 library entries). Built by build-r3.mjs from the r2 file; ids, work, texts, and all other fields compared unchanged against r2 (0 differences).

## Field layout for role and opera

All inside each entry's provenance object, where r2 already kept the opera:

- provenance.opera_ru and provenance.opera_en: already present on all 89, unchanged.
- provenance.character_ru and provenance.character_en: NEW, the named role (the character who sings the first line). Placed straight after opera_en.
- provenance.role: already present, unchanged. It is the English aria label (for example "Marfa's Aria"), not the character, so it was not reused for the role. DESK DEFAULT: new names character_ru and character_en to avoid colliding with it. Rename if you prefer role_ru and role_en.
- provenance.formerTitle: NEW, the r2 title, placed after character_en.

English character names follow the spelling already in provenance.role (for example Tatjana, Konchakovna). Where the entry gave only an aria label, the character is the one named in that label.

## Title rule applied

title = first line of textModern, with trailing comma, semicolon, colon, hyphen, en dash, or em dash removed (repeatedly). Periods, ?, !, ... and the ellipsis character are kept. Stress marks untouched. 27 titles had a trailing character removed; 62 are the first line verbatim. Titles keep the line as printed, including a lower-case start (928b4a48e6, cd6ea3ec30, 54cd11a333).

## Duplicates

None. All 89 new titles are distinct.

## Incipit check

All 89 incipits equal the first line of textModern. The new title equals the incipit in 62 entries. In the 27 below the incipit is the new title plus the removed trailing mark (incipit left unchanged, per instruction):
d235f6570b, 1d04179eea, d821a19eea, 4df4aae954, b50289f2fb, 991bae857f, b43e7a4fc6, a478c50e41, 21fcad8421, 928b4a48e6, a6cb4d6427, e4f99dc0f8, f89215ab76, a7d0fd6ff1, 51acdae73e, 494e86cbc0, 48549298be, cc3641fa35, 0a506bc0cd, f136f9e163, 0289cea53f, c1ded8fed4, 3ec922ea5a, 67580c48a1, d8376688d5, 74bcbbe89c, 9ea4bc0f8a

## Unfillable fields

None. Every entry has all four of opera ru/en and character ru/en. Note on source: the English opera and character come from the entry. For the Russian character, 63 are found in the entry itself (old title, text speaker label, or text). For the 20 below no Russian form of the name appears in the entry, so the Russian was taken from the ROLES list inside check-aria-r2.mjs (the checker's own list of each opera's roles); it is not in the entry. Please confirm or reject that source: 928b4a48e6 Оксана; 7351c66f05 Марфа; e4f99dc0f8 Кума; f89215ab76 Лаура; 7d695fa800 Лаура; a7d0fd6ff1 Ратмир; 51acdae73e Марина; 2744800a03 Полина; f6614b4b3a Князь; d0352cf090 Левко; 26f8b28d4a Левко; f136f9e163 Индийский гость; d7fcb7708a Лыков; 221d579b08 Вакула; e064a670ac Щелкалов; 0301bd8795 Шакловитый; 67580c48a1 Роберт; d8376688d5 Елецкий; babbcdc0fc Князь; c70fe11b02 Мельник; a29bc5327a Сусанин

Also, f136f9e163 "Индийский гость": the checker's list has «Индейский» for this opera; I wrote «Индийский гость» to match the English "Indian Guest". The Russian form is NOT ESTABLISHED from the entry; confirm it.

## Table

| id | new title | character ru | character en | opera ru | opera en |
|---|---|---|---|---|---|
| 412703d604 | Да к милому на море шлю рано по утрам. | Ярославна | Yaroslavna | Князь Игорь | Prince Igor |
| d235f6570b | Ответь мне, зоркое светило | Шемаханская царица | The Queen of Shemakhan | Золотой петушок | The Golden Cockerel |
| 1d04179eea | Ты, царевич, мой спаситель | Царевна Лебедь | The Swan-Princess | Сказка о царе Салтане | The Tale of the Tsar Saltan |
| 419cc03424 | Пускай погибну я, но прежде | Татьяна | Tatjana | Евгений Онегин | Yevgenij Onegin |
| d821a19eea | На кормилицу Волгу-матушку | Кума | Kuma | Чародейка | The Enchantress |
| 157f06debb | Баю-баю, мил внучоночек! | Старуха | The Old Woman | Сон на Волге | A Dream on the Volga |
| c2df530513 | Меркнет свет дневной... | Кончаковна | Konchakovna | Князь Игорь | Prince Igor |
| 358424d49b | Всегда мечтаешь ты! | Ольга | Olga | Евгений Онегин | Yevgenij Onegin |
| 4df4aae954 | Медленно день угасал | Владимир Игоревич | Vladimir Igorevich | Князь Игорь | Prince Igor |
| 3f0bdfca66 | Взгляни: под отдаленным сводом | Молодой цыган | The Young Gypsy | Алеко | Aleko |
| 3538324966 | Ветер по морю гуляет | Царевич Гвидон | Prince Gvidon | Сказка о царе Салтане | The Tale of the Tsar Saltan |
| 633cdbefcf | Полна чудес могучая природа! | Царь | The Tsar | Снегурочка | The Snow Maiden |
| 40be44539a | Как одна безумная душа поэта | Ленский | Lensky | Евгений Онегин | Yevgenij Onegin |
| b50289f2fb | Куда, куда, куда вы удалились | Ленский | Lensky | Евгений Онегин | Yevgenij Onegin |
| cd162ef7cf | Ни сна, ни отдыха | Князь Игорь | Prince Igor | Князь Игорь | Prince Igor |
| 991bae857f | Вы мне писали | Онегин | Onegin | Евгений Онегин | Yevgenij Onegin |
| b43e7a4fc6 | Ужель та самая Татьяна | Онегин | Onegin | Евгений Онегин | Yevgenij Onegin |
| f1ea0cad95 | Грешно таить. Я скуки не люблю. | Галицкий | Galitsky | Князь Игорь | Prince Igor |
| a478c50e41 | Еще одно, последнее сказанье | Пимен | Pimen | Борис Годунов | Boris Godunov |
| 1fa79e19f0 | Ее порывы благотворны | Гремин | Gremin | Евгений Онегин | Yevgenij Onegin |
| 21fcad8421 | В поле, в поле чистое гляжу | Антонида | Antonida | Жизнь за Царя | A Life for the Tsar |
| 6edea660cc | Какие сладостные звуки | Горислава | Gorislava | Руслан и Людмила | Ruslan and Ludmila |
| e04061d4b4 | Доля моя горькая! | Людмила | Ludmila | Руслан и Людмила | Ruslan and Ludmila |
| 45c9b1d0c5 | О, не гляди так на меня... Читай! | Франческа | Francesca | Франческа да Римини | Francesca da Rimini |
| 928b4a48e6 | что хороша я, что хороша | Оксана | Oksana | Ночь перед Рождеством | Christmas Eve |
| a6cb4d6427 | Сон по бережку ходил | Волхова | Volkhova | Садко | Sadko |
| 2b9c5e37c8 | Ау! Ау! | Снегурочка | The Snow Maiden | Снегурочка | The Snow Maiden |
| 7351c66f05 | В Новгороде мы рядом с Ваней жили. | Марфа | Marfa | Царская невеста | The Tsar's Bride |
| a671865dad | Иван Сергеич, хочешь в сад пойдём? | Марфа | Marfa | Царская невеста | The Tsar's Bride |
| cd6ea3ec30 | в самом деле устала я. | Иоланта | Iolanta | Иоланта | Iolanta |
| 54814c41e6 | Почудились мне будто голоса | Наталья | Natalia | Опричник | The Oprichnik |
| d1998fe4b5 | Уж полночь близится, а Германа все нет, все нет... | Лиза | Liza | Пиковая дама | The Queen of Spades |
| e4f99dc0f8 | Я здесь. Поскорей приходи | Кума | Kuma | Чародейка | The Enchantress |
| 6993210453 | Чу! кажется, трубят. | Княгиня | The Princess | Русалка | Rusalka |
| f89215ab76 | Оделась туманом Гренада | Лаура | Laura | Каменный гость | The Stone Guest |
| 7d695fa800 | Я здесь, Инезилья! | Лаура | Laura | Каменный гость | The Stone Guest |
| a7d0fd6ff1 | И жар, и зной сменила ночи тень | Ратмир | Ratmir | Руслан и Людмила | Ruslan and Ludmila |
| 813bba0315 | Она мне жизнь, она мне радость! | Ратмир | Ratmir | Руслан и Людмила | Ruslan and Ludmila |
| 51acdae73e | Как томительно и вяло дни за днями длятся | Марина | Marina | Борис Годунов | Boris Godunov |
| ee018cba7e | К вам взываю! | Марфа | Marfa | Хованщина | Khovanshchina |
| 168f591269 | Исходила младёшенька | Марфа | Marfa | Хованщина | Khovanshchina |
| 2b5b69c536 | Всю ночь ждала его понапрасну. | Любава | Lyubava | Садко | Sadko |
| 494e86cbc0 | Туча со громом сговаривалась | Лель | Lel | Снегурочка | The Snow Maiden |
| de79e9a588 | Ступай готовить зелье. | Любаша | Lyubasha | Царская невеста | The Tsar's Bride |
| cfbd2254bc | О, горе мне, преступнице несчастной! | Клитемнестра | Clytemnestra | Орестея | The Oresteia |
| 54c72171a0 | Да, час настал! | Иоанна | Joan of Arc | Орлеанская дева | The Maid of Orleans |
| 2744800a03 | Постойте... Как это? Да вспомнила! | Полина | Polina | Пиковая дама | The Queen of Spades |
| f6614b4b3a | Невольно к этим грустным берегам | Князь | The Prince | Русалка | Rusalka |
| 48549298be | Братцы, в метель | Собинин | Sobinin | Жизнь за Царя | A Life for the Tsar |
| cc3641fa35 | Есть пустынный край | Баян | Bayan | Руслан и Людмила | Ruslan and Ludmila |
| abe08ecb02 | Добро пожаловать, мой сын! | Финн | Finn | Руслан и Людмила | Ruslan and Ludmila |
| ff66089db1 | Ступайте по дворам на мир и на покой! | Дубровский | Vladimir Dubrovsky | Дубровский | Dubrovsky |
| d0352cf090 | Солнышко низко, вечер уж близко. | Левко | Levko | Майская ночь | May Night |
| 26f8b28d4a | Спи, моя красавица, сладко спи! | Левко | Levko | Майская ночь | May Night |
| 0a506bc0cd | Гой вы, гости торговые | Садко | Sadko | Садко | Sadko |
| f136f9e163 | Не счесть алмазов в каменных пещерах | Индийский гость | The Indian Guest | Садко | Sadko |
| ee29333a6f | Весёлое гулянье! Сердцу радость | Царь | The Tsar | Снегурочка | The Snow Maiden |
| d7fcb7708a | Неужели Дуняша? Быть не может! | Лыков | Lykov | Царская невеста | The Tsar's Bride |
| 6092f1200c | Нет! | Водемон | Vaudemont | Иоланта | Iolanta |
| 0289cea53f | В бою кровавом | Андрей | Andrei | Мазепа | Mazeppa |
| 32249e717e | Да! К цели твердою ногой | Герман | Hermann | Пиковая дама | The Queen of Spades |
| 5d617a25ef | Красавица! Богиня! Ангел! | Герман | Hermann | Пиковая дама | The Queen of Spades |
| e481ac5b72 | Что вы носы повесили? | Герман | Hermann | Пиковая дама | The Queen of Spades |
| 221d579b08 | Лютое горюшко, горе моё? | Вакула | Vakula | Черевички | The Slippers |
| fb82ddda31 | В старину живали деды | Неизвестный | The Stranger | Аскольдова могила | Askold's Grave |
| c7a11a21a7 | Кто тебя усеял мёртвыми костями? | Руслан | Ruslan | Руслан и Людмила | Ruslan and Ludmila |
| e064a670ac | Православные! Неумолим боярин! | Щелкалов | Shchelkalov | Борис Годунов | Boris Godunov |
| 0301bd8795 | Спит стрелецкое гнездо. | Шакловитый | Shaklovity | Хованщина | Khovanshchina |
| 514c9111de | Весь табор спит. Луна над ним | Алеко | Aleko | Алеко | Aleko |
| c1ded8fed4 | Город каменный, городам всем мать | Веденецкий гость | The Venetian Guest | Садко | Sadko |
| adb8a7a26b | С ума нейдёт красавица! | Грязной | Gryaznoy | Царская невеста | The Tsar's Bride |
| 263865cfad | Проклятый мир! Презренный мир! | Демон | The Demon | Демон | The Demon |
| 33368e8b40 | Не плачь, дитя! не плачь напрасно! | Демон | The Demon | Демон | The Demon |
| 3ec922ea5a | Ты в полуночной тишине | Демон | The Demon | Демон | The Demon |
| 67580c48a1 | Кто может сравниться с Матильдой моей | Роберт | Robert | Иоланта | Iolanta |
| 18bdff66da | Так что же, друг? | Мазепа | Mazeppa | Мазепа | Mazeppa |
| d8376688d5 | Без вас не мыслю дня прожить | Елецкий | Yeletsky | Пиковая дама | The Queen of Spades |
| 4897e27523 | Если б милые девицы | Томский | Tomsky | Пиковая дама | The Queen of Spades |
| babbcdc0fc | А образ той пригожницы | Князь | The Prince | Чародейка | The Enchantress |
| c70fe11b02 | Посмотришь, мало толку в вас. | Мельник | The Miller | Русалка | Rusalka |
| a29bc5327a | Спасенья весть про царя! | Сусанин | Susanin | Жизнь за Царя | A Life for the Tsar |
| e422cdb651 | О, ужас! | Фарлаф | Farlaf | Руслан и Людмила | Ruslan and Ludmila |
| 37f8b7d757 | Достиг я высшей власти. | Борис | Boris | Борис Годунов | Boris Godunov |
| 41ce30c63c | Ой! душно! душно! свету! | Борис | Boris | Борис Годунов | Boris Godunov |
| 74bcbbe89c | Смиренный инок | Пимен | Pimen | Борис Годунов | Boris Godunov |
| 9ea4bc0f8a | Как во городе было во Казани | Варлаам | Varlaam | Борис Годунов | Boris Godunov |
| 99893498c7 | О скалы грозные дробятся с рёвом волны | Варяжский гость | The Varangian Guest | Садко | Sadko |
| 295bec285d | Забылася... авось, полегче будет. | Собакин | Sobakin | Царская невеста | The Tsar's Bride |
| 54cd11a333 | последняя надежда исцеленья. | Король Рене | King Rene | Иоланта | Iolanta |

## What I could not establish

- Whether the Russian character names for the 20 entries listed above (taken from the checker ROLES list) match the desk's preferred forms.
- Whether «Индийский гость» or «Индейский гость» is the form to use for f136f9e163.
- Whether three entries sung by more than one character in the printed text (for example 74bcbbe89c has Борис and Пимен labels; ee018cba7e has Голицин and Марфа) are rightly assigned. I took the character from the aria label in the old title and provenance.role, not from the speaker labels.
- Whether r2 was byte-for-byte two-space JSON; the r3 file is written with two-space indent and a trailing newline, and parses to the same structure apart from the changes above.
