/**
 * Testy pro colors.js - ověřují, že přiřazení barvy/ikony kategorii
 * je konzistentní (stejný název vždy dá stejný výsledek).
 */
import { describe, it, expect } from 'vitest';
import { colorForCategory, iconForCategory } from './colors';

describe('colorForCategory', () => {
  it('vrátí stejnou barvu pro stejnou kategorii opakovaně', () => {
    // Klíčová vlastnost funkce - appka spoléhá na to, že "Nájem" bude
    // mít vždy stejnou barvu v tabulce i v donut grafu
    const barva1 = colorForCategory('Nájem');
    const barva2 = colorForCategory('Nájem');
    expect(barva1).toBe(barva2);
  });

  it('vrátí platnou hex barvu (začíná #)', () => {
    const barva = colorForCategory('Jídlo');
    expect(barva).toMatch(/^#/); // regex - text musí začínat znakem #
  });
});

describe('iconForCategory', () => {
  it('vrátí ikonu domu pro kategorii "nájem"', () => {
    expect(iconForCategory('nájem')).toBe('🏠');
  });

  it('vrátí výchozí ikonu pro neznámou kategorii', () => {
    // Uživatel může zadat jakoukoliv vlastní kategorii - appka nesmí spadnout,
    // jen vrátí obecnou "špendlík" ikonu jako fallback
    expect(iconForCategory('neexistujici-kategorie-xyz')).toBe('📌');
  });

  it('nerozlišuje velikost písmen', () => {
    expect(iconForCategory('NÁJEM')).toBe(iconForCategory('nájem'));
  });
});