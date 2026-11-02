/**
 * The clusters that are read as щ, /ʃʲʃʲ/ (Grayson 2012, pp. 230 to 231, 236).
 *
 * Grayson p. 236: СЧ, ЗЧ, ЖЧ, СТЧ, ЗДЧ, and ССЧ are all read as /ʃʲʃʲ/, "as if spelled with щ", with no dental
 * sound before it: рассчитывать /ra ˈʃʲʃʲi tɨ vatʲ/, мужчина /ˈmu ʃʲʃʲi na/, жёстче /ˈʒo ʃʲʃʲɪ/,
 * громоздче /ɡra ˈmo ʃʲʃʲɪ/, резче /ˈre ʃʲʃʲɪ/ (row 175 step 4; before it the engine held only сч and зч, and
 * gave рассчитать rʌsʲʃʲʃʲiˈtɑtʲ and мужчина muʃˈtʃʲinɑ).
 *
 * ORDER MATTERS. `findSpecialClusters` takes the clusters in the order of the engine's table and skips any index
 * already covered, so the longer clusters come first: ссч is read whole and not as с + сч.
 *
 * A prefix does not change this: подсчитать keeps its д hard at the prefix boundary (p. 249) and reads the сч
 * after it as /ʃʲʃʲ/.
 */
export const SHCHA_CLUSTERS: Readonly<Record<string, string>> = {
  'ссч': 'ʃʲʃʲ',
  'стч': 'ʃʲʃʲ',
  'здч': 'ʃʲʃʲ',
  'жч': 'ʃʲʃʲ',
  'сч': 'ʃʲʃʲ',
  'зч': 'ʃʲʃʲ',
};
