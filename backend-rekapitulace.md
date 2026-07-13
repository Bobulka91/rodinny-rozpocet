# Backend — Rodinný rozpočet — kompletní technická rekapitulace

Stav: **Backend (Fáze 1) je 100% hotový.** Spring Boot 3.5.16, Java 24, MySQL 8, Maven.
Balíček: `com.pavel.rozpocetbackend`, databáze: `rodinny_rozpocet`.

---

## Architektura vrstev

```
Controller (REST API, DTO in/out)
      ↓ ↑
   Mapper (DTO ↔ Entity)
      ↓ ↑
   Service (business logika, výpočty, agregace)
      ↓ ↑
  Repository (Spring Data JPA, JpaRepository<Entity, Long>)
      ↓ ↑
   Entity (@Entity, mapováno na MySQL tabulku)
```

Balíčky: `entity`, `dto`, `mapper`, `repository`, `service`, `controller`, `config`.

CORS je nastaven v `config/WebConfig.java`: povoluje `http://localhost:5173` a `http://localhost:3000` pro všechny `/api/**` cesty, metody GET/POST/PUT/DELETE/OPTIONS.

---

## Modul 1: Income (příjmy)

**Entity** (`entity/Income.java`):
```java
private Long id;
private Double amount;
private LocalDate date;
private TypePrijmu type;   // enum: HLAVNI_PRIJEM, VEDLEJSI_PRIJEM, JINE_PRIJMY
private String source;     // volný text — jen relevantní u vedlejšího příjmu, např. "Dýško", "Brigáda"
```

**DTO** (`dto/IncomeDTO.java`): stejná pole jako Entity (id, amount, date, type, source).

**Endpoints** (`/api/incomes`):
- `GET /api/incomes` → `List<IncomeDTO>` — všechny příjmy
- `POST /api/incomes` (body: IncomeDTO bez id) → vrací uložený IncomeDTO s vygenerovaným id
- `GET /api/incomes/total/{year}` → `Double` — součet všech příjmů za daný rok
- `GET /api/incomes/monthly/{year}` → `Map<Integer, Double>` — klíč = číslo měsíce (1-12), hodnota = součet příjmů v tom měsíci

**Poznámka k `type`:** Hlavní příjem (výplata) typicky nemá vyplněné `source`. Vedlejší příjem má `type=VEDLEJSI_PRIJEM` a `source` popisuje odkud (text zadá uživatel).

---

## Modul 2: Expense (výdaje)

**Entity** (`entity/Expense.java`):
```java
private Long id;
private Double amount;
private LocalDate date;
private String category;   // volný text, uživatel může přidávat vlastní — "Nájem", "Jídlo", "PHM", atd.
```

**DTO** (`dto/ExpenseDTO.java`): stejná pole (id, amount, date, category).

**Endpoints** (`/api/expenses`):
- `GET /api/expenses` → `List<ExpenseDTO>` — všechny výdaje
- `POST /api/expenses` (body: ExpenseDTO bez id) → vrací uložený ExpenseDTO
- `GET /api/expenses/by-category` → `Map<String, Double>` — součet výdajů podle kategorie, přes VŠECHNY záznamy (bez ohledu na rok) — pro pie chart
- `GET /api/expenses/by-category/{year}` → `Map<String, Double>` — totéž, ale jen pro daný rok
- `GET /api/expenses/total/{year}` → `Double` — součet všech výdajů za daný rok
- `GET /api/expenses/monthly/{year}` → `Map<Integer, Double>` — klíč = měsíc (1-12), hodnota = součet výdajů v tom měsíci

**Interní metoda Service (není přímý endpoint):** `getActualAmountForCategoryAndMonth(category, year, month)` — používá ji `PlanService` pro porovnání plán vs. skutečnost.

---

## Modul 3: SavingGoal (cíle spoření)

**Entity** (`entity/SavingGoal.java`):
```java
private Long id;
private String category;         // "Auto", "Dovolená", "Rezerva", volný text
private Double targetAmount;      // cílová částka
private Double currentAmount;     // aktuálně naspořeno
```

**DTO** (`dto/SavingGoalDTO.java`): stejná pole.

**Endpoints** (`/api/saving-goals`):
- `GET /api/saving-goals` → `List<SavingGoalDTO>`
- `POST /api/saving-goals` (body: SavingGoalDTO bez id) → vrací uložený DTO
- `GET /api/saving-goals/{id}/progress` → `Double` — % splnění tohoto konkrétního cíle = (currentAmount / targetAmount) * 100
- `GET /api/saving-goals/total-target` → `Double` — součet všech targetAmount napříč cíli
- `GET /api/saving-goals/total-current` → `Double` — součet všech currentAmount napříč cíli

**Důležité:** appka NEPOČÍTÁ a NEUKLÁDÁ "zbývá dospořit" — to se má dopočítat na frontendu jako `targetAmount - currentAmount`, pokud je potřeba.

---

## Modul 4: Debt (dluhy)

**Entity** (`entity/Debt.java`):
```java
private Long id;
private String category;        // "Hypotéka", "Půjčka na auto", volný text
private Double totalAmount;      // celková výše dluhu
private Double paidAmount;       // kolik už splaceno
```

**DTO** (`dto/DebtDTO.java`): stejná pole.

**Endpoints** (`/api/debts`):
- `GET /api/debts` → `List<DebtDTO>`
- `POST /api/debts` (body: DebtDTO bez id) → vrací uložený DTO
- `GET /api/debts/{id}/progress` → `Double` — % splaceno tohoto konkrétního dluhu = (paidAmount / totalAmount) * 100
- `GET /api/debts/total-amount` → `Double` — součet totalAmount napříč všemi dluhy
- `GET /api/debts/total-paid` → `Double` — součet paidAmount napříč všemi dluhy

**Poznámka:** stejná logická struktura jako SavingGoal, jen "obráceně" (u dluhu ubývá, u spoření přibývá) — sémanticky ale obě entity jen ukládají dvě částky a % se dopočítává stejným způsobem.

---

## Modul 5: Plan (rozpočtové plány) + porovnání se skutečností

**Entity** (`entity/Plan.java`):
```java
private Long id;
private String category;         // musí odpovídat kategorii v Expense, aby šlo párovat
private Double plannedAmount;     // kolik jsem si naplánoval utratit
private Integer year;            // rok platnosti plánu (např. 2026)
private Integer month;            // měsíc platnosti plánu (1-12)
```

**DTO** (`dto/PlanDTO.java`): stejná pole. **DŮLEŽITÉ: PlanDTO NEMÁ pole `actualAmount`** — skutečná částka se nikam neukládá, počítá se za běhu.

**Endpoints** (`/api/plans`):
- `GET /api/plans` → `List<PlanDTO>`
- `POST /api/plans` (body: PlanDTO bez id) → vrací uložený DTO
- `GET /api/plans/{planId}/compare` → `Map<String, Double>` s klíči:
  - `"planned"` — hodnota z `plan.plannedAmount`
  - `"actual"` — dopočítáno za běhu voláním `ExpenseService.getActualAmountForCategoryAndMonth(plan.category, plan.year, plan.month)` — sečte SKUTEČNÉ výdaje té kategorie za ten měsíc/rok z tabulky `expense`
  - `"difference"` — `planned - actual`

**Jak to funguje krok za krokem:** Uživatel vytvoří Plan (např. category="Jídlo", plannedAmount=7000, year=2026, month=6). Když appka volá `/compare`, najde všechny `Expense` záznamy, kde `category == "Jídlo"` AND `date.year == 2026` AND `date.monthValue == 6`, sečte jejich `amount`, a to je `actual`. Pokud žádné takové výdaje nejsou, `actual = 0.0`.

---

## Modul 6: Analytics (roční přehled)

Nemá vlastní Entity ani Repository — jen `AnalyticsService`, který kombinuje `IncomeService` + `ExpenseService`.

**Endpoint** (`/api/analytics`):
- `GET /api/analytics/yearly/{year}` → `ResponseEntity<Map<String, Object>>` s klíči:
  - `"year"` (int)
  - `"totalIncome"` (Double) — z `IncomeService.getTotalIncomeForYear(year)`
  - `"totalExpenses"` (Double) — z `ExpenseService.getTotalExpensesForYear(year)`
  - `"balance"` (Double) — totalIncome - totalExpenses
  - `"expenseByCategory"` (Map<String, Double>) — z `ExpenseService.getExpensesByCategoryForYear(year)`

Poznámka: je to `Map<String, Object>`, protože kombinuje různé typy (int, Double, Map) v jedné odpovědi.

---

## Shrnutí — kompletní seznam všech endpointů

```
POST   /api/incomes
GET    /api/incomes
GET    /api/incomes/total/{year}
GET    /api/incomes/monthly/{year}

POST   /api/expenses
GET    /api/expenses
GET    /api/expenses/by-category
GET    /api/expenses/by-category/{year}
GET    /api/expenses/total/{year}
GET    /api/expenses/monthly/{year}

POST   /api/saving-goals
GET    /api/saving-goals
GET    /api/saving-goals/{id}/progress
GET    /api/saving-goals/total-target
GET    /api/saving-goals/total-current

POST   /api/debts
GET    /api/debts
GET    /api/debts/{id}/progress
GET    /api/debts/total-amount
GET    /api/debts/total-paid

POST   /api/plans
GET    /api/plans
GET    /api/plans/{planId}/compare

GET    /api/analytics/yearly/{year}
```

Zatím NEJSOU implementovány: PUT (update), DELETE (mazání) endpointy pro žádný modul. CORS ale tyhle metody již povoluje, takže je lze kdykoliv doplnit.

---

## Poznámky k datovým typům pro frontend

- Všechny peněžní částky jsou `Double` (desetinné číslo, v Kč, bez měnového symbolu)
- `date` je `LocalDate`, v JSON se serializuje jako string `"YYYY-MM-DD"` (např. `"2026-06-28"`)
- `TypePrijmu` (enum) se v JSON serializuje jako string, jedna z hodnot: `"HLAVNI_PRIJEM"`, `"VEDLEJSI_PRIJEM"`, `"JINE_PRIJMY"`
- Všechny `category`/`source` fieldy jsou volný text (String) — žádný enum, uživatel může zadat cokoliv
- `year` a `month` u Plan jsou `Integer`, month je 1-12 (ne 0-11 jako v některých JS knihovnách — pozor na tohle při psaní frontendu!)

---

## UI/UX plán pro frontend (dohodnuto, zatím neimplementováno)

**4 prolistovatelné obrazovky (slides), mobile-first vzhled i na PC:**
1. **Přehled** — bilance měsíce, příjmy, výdaje, naspořeno celkem, rychlé insighty
2. **Příjem/Výdaj** — seznamy transakcí s datem, zdrojem/kategorií
3. **Spoření/Dluh** — cíle s progress bary + dluh s kruhovým grafem
4. **Analýza/Historie** — graf příjmy vs. výdaje po měsících, plán vs. skutečnost

**Vizuální styl:** abstraktní ale moderní, modro-fialová paleta (#6C63E0, #9D7FE8), růžová (#C2569B) jen jako malý akcent (ne dominantní), watercolor gradient pozadí (viditelné, ne moc slabé), jemně podbarvené karty (ne čistě bílé/sterilní), serifové nadpisy pro osobnost. Inspirace funkčností tabulky "Chytrá kačka" (hustota dat, tabulky, roční přehled) ale NE jejím kreslenym/cartoon vizuálem.

**Verzování:** v1.0 = plně funkční PC/web appka (React v prohlížeči) — musí být 100% hotová a manželka ji reálně používá, než se přejde na v2.0 (mobilní appka přes React Native/Expo).
