package com.pavel.rozpocetbackend.service;

import com.pavel.rozpocetbackend.entity.MonthlyBalance;
import com.pavel.rozpocetbackend.repository.MonthlyBalanceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service vrstva pro MonthlyBalance - obsahuje logiku výpočtu a ukládání
 * měsíčního zůstatku, včetně přenosu (carry-over) z předchozího měsíce.
 */
@Service
public class MonthlyBalanceService {

    @Autowired  // Spring sem automaticky vloží instanci MonthlyBalanceRepository
    private MonthlyBalanceRepository monthlyBalanceRepository;

    @Autowired  // Spring sem automaticky vloží instanci IncomeService (potřebujeme měsíční příjmy)
    private IncomeService incomeService;

    @Autowired  // Spring sem automaticky vloží instanci ExpenseService (potřebujeme měsíční výdaje)
    private ExpenseService expenseService;

    /**
     * Vrátí všechny uložené měsíční zůstatky (historii) z databáze.
     */
    public List<MonthlyBalance> getAllBalances() {
        return monthlyBalanceRepository.findAll();
    }

    /**
     * Spočítá a uloží zůstatek pro daný měsíc/rok.
     * Nejdřív najde uložený zůstatek předchozího měsíce (carry-over), pak k němu
     * přičte příjmy a odečte výdaje TOHOHLE měsíce - výsledek je nový uzavírací
     * zůstatek, který se příště stane carry-over hodnotou pro měsíc následující.
     */
    public MonthlyBalance calculateAndSaveBalance(int year, int month) {

        // Zjistíme, jaký je předchozí měsíc (a pokud je aktuální měsíc leden, předchozí je prosinec loňského roku)
        int prevMonth = (month == 1) ? 12 : month - 1;
        int prevYear = (month == 1) ? year - 1 : year;

        // Najdeme uložený zůstatek předchozího měsíce - pokud neexistuje (např. úplně první měsíc appky), použijeme 0
        Double carryOver = monthlyBalanceRepository.findAll().stream()
                .filter(b -> b.getYear() == prevYear && b.getMonth() == prevMonth)
                .map(MonthlyBalance::getClosingBalance)
                .findFirst()
                .orElse(0.0);

        // Vytáhneme příjmy a výdaje jen pro TENHLE konkrétní měsíc z existujících měsíčních map
        // getOrDefault zajistí, že pokud appka v daném měsíci neměla žádný příjem/výdaj, použije se 0 místo chyby
        Double income = incomeService.getMonthlyIncomeForYear(year).getOrDefault(month, 0.0);
        Double expenses = expenseService.getMonthlyExpensesForYear(year).getOrDefault(month, 0.0);

        // Uzavírací zůstatek = to, co se přeneslo dovnitř, plus příjmy, minus výdaje
        Double closingBalance = carryOver + income - expenses;

        MonthlyBalance balance = new MonthlyBalance();
        balance.setYear(year);
        balance.setMonth(month);
        balance.setCarryOver(carryOver);
        balance.setClosingBalance(closingBalance);
        return monthlyBalanceRepository.save(balance);
    }
}