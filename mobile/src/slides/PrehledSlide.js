import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import StatCard from '../components/StatCard';
import CategoryDonut from '../components/CategoryDonut';
import { colorForCategory } from '../utils/colors';

function buildCategoryBreakdown(expenses) {
  const map = {};
  expenses.forEach((e) => {
    map[e.category] = (map[e.category] || 0) + e.amount;
  });
  const total = Object.values(map).reduce((sum, v) => sum + v, 0);

  return Object.entries(map)
    .map(([category, amount]) => ({
      category,
      percentage: total > 0 ? Math.round((amount / total) * 100) : 0,
      color: colorForCategory(category),
    }))
    .sort((a, b) => b.percentage - a.percentage);
}

function PrehledSlide() {
  const { expenses, incomes, savingGoals, isLoading, error } = useContext(AppContext);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <Text style={styles.loadingText}>Načítám...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.loadingText}>Chyba: {error}</Text>
      </View>
    );
  }

  const totalIncome = incomes.reduce((sum, item) => sum + item.amount, 0);
  const totalExpense = expenses.reduce((sum, item) => sum + item.amount, 0);
  const balance = totalIncome - totalExpense;
  const totalSaved = savingGoals.reduce((sum, goal) => sum + goal.currentAmount, 0);

  const categoryBreakdown = buildCategoryBreakdown(expenses);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.eyebrow}>Sekce</Text>
      <Text style={styles.title}>Přehled</Text>

      <View style={styles.card}>
        <View style={styles.statsRow}>
          <StatCard label="Příjmy" amount={`${totalIncome} Kč`} variant="income" />
          <StatCard label="Výdaje" amount={`${totalExpense} Kč`} variant="expense" />
          <StatCard label="Naspořeno" amount={`${totalSaved} Kč`} variant="default" />
          <StatCard label="Bilance" amount={`${balance} Kč`} variant="balance" />
        </View>
      </View>

      <Text style={styles.sectionLabel}>Výdaje podle kategorií</Text>
      <View style={styles.card}>
        <CategoryDonut segments={categoryBreakdown} centerLabel="Moje Bilance" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, paddingTop: 60 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: 'white', fontSize: 16 },
  eyebrow: { color: '#9D7FE8', fontSize: 12, fontWeight: '600', textTransform: 'uppercase' },
  title: { color: 'white', fontSize: 28, fontWeight: '700', marginBottom: 16 },
  sectionLabel: { color: '#8A85A8', fontSize: 13, fontWeight: '600', marginBottom: 8, marginTop: 8 },
  card: { backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 16, padding: 16, marginBottom: 16 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between' },
});

export default PrehledSlide;