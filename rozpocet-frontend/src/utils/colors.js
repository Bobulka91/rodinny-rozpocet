/**
 * Pomocné funkce pro konzistentní barvu a ikonu podle názvu kategorie.
 * Appka umožňuje volný text jako kategorii (Nájem, Jídlo, cokoliv vlastního),
 * takže potřebujeme způsob, jak jí přiřadit barvu/ikonu bez pevného seznamu.
 */

// Paleta barev - stejná kategorie vždy dostane stejnou barvu (viz colorForCategory)
const palette = ['#6C63E0', '#C2569B', '#9D7FE8', '#3FAE86', '#F0B860', '#5C7FE8', '#E0559B', '#4E6FE0'];

/**
 * Spočítá "hash" (číslo) z textu kategorie a podle něj vybere barvu z palety.
 * Stejný text vždy dá stejné číslo, takže "Nájem" bude mít vždy stejnou barvu
 * napříč appkou (v tabulce i v donut grafu), aniž bychom to museli ručně přiřazovat.
 */
export function colorForCategory(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    // charCodeAt vrátí číselný kód znaku, kombinujeme ho do jednoho čísla
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return palette[Math.abs(hash) % palette.length]; // modulo zajistí, že index je vždy v rozsahu palety
}

// Mapování názvu kategorie (malými písmeny) na emoji ikonu.
// Duplicitní klíče (s diakritikou i bez) pro případ, že uživatel napíše kategorii jinak.
const iconMap = {
  'nájem': '🏠', 'najem': '🏠',
  'jídlo': '🍽', 'jidlo': '🍽', 'potraviny': '🍽',
  'phm': '⛽', 'benzín': '⛽', 'benzin': '⛽',
  'spoření': '💰', 'sporeni': '💰',
  'dluh': '💳',
  'zábava': '🎬', 'zabava': '🎬',
  'zdraví': '💊', 'zdravi': '💊',
  'doprava': '🚗',
};

/**
 * Vrátí ikonu pro danou kategorii podle iconMap.
 * Pokud kategorie není v mapě (uživatel napsal něco vlastního), vrátí
 * obecnou "špendlík" ikonu jako výchozí hodnotu.
 */
export function iconForCategory(name) {
  return iconMap[name.toLowerCase()] || '📌'; // toLowerCase - appka nerozlišuje velikost písmen
}