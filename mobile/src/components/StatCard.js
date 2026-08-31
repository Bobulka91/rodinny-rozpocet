import { View, Text, StyleSheet } from 'react-native';

const variantColors = {
  income: '#3FAE86',
  expense: '#E0559B',
  balance: '#6C63E0',
  default: '#2E2A47',
};

function StatCard({ label, amount, variant }) {
  const color = variantColors[variant] || variantColors.default;

  return (
    <View style={styles.col}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, { color }]}>{amount}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  col: { alignItems: 'center', flex: 1 },
  label: { fontSize: 12, color: '#8A85A8', marginBottom: 4 },
  value: { fontSize: 16, fontWeight: '700' },
});

export default StatCard;