/**
 * Testy pro buildMonthlyData() z AnalyzaHistorieSlide.jsx - ověřují
 * správné seskupení příjmů/výdajů podle měsíce pro sloupcový graf.
 */
import { describe, it, expect } from 'vitest';
import { buildMonthlyData } from './AnalyzaHistorieSlide';

describe('buildMonthlyData', () => {
  it('seskupí příjmy a výdaje podle měsíce', () => {
    const incomes = [{ date: '2026-07-05', amount: 40000 }];
    const expenses = [{ date: '2026-07-10', amount: 15000 }];

    const result = buildMonthlyData(incomes, expenses);

    // toEqual porovnává OBSAH objektů, ne jestli je to stejná instance v paměti
    expect(result).toEqual([
      { month: '2026-07', income: 40000, expense: 15000 },
    ]);
  });

  it('sečte více transakcí ve stejném měsíci', () => {
    const incomes = [
      { date: '2026-07-05', amount: 40000 },
      { date: '2026-07-20', amount: 5000 }, // druhá transakce, stejný měsíc
    ];
    const expenses = [];

    const result = buildMonthlyData(incomes, expenses);

    expect(result[0].income).toBe(45000); // 40000 + 5000
  });

  it('vrátí prázdné pole, když nejsou žádné transakce', () => {
    const result = buildMonthlyData([], []);
    expect(result).toEqual([]);
  });
});