import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const donutPalette = ['#3aafd0', '#2b4c7e', '#7c4d9e', '#c24ba0'];

function CategoryDonut({ segments, centerLabel }) {
  let cumulative = 0;

  return (
    <View style={styles.row}>
      <View style={styles.svgWrap}>
        <Svg width="90" height="90" viewBox="0 0 42 42">
          <Circle cx="21" cy="21" r="15.9" fill="transparent" stroke="rgba(46,42,71,0.08)" strokeWidth="7" />
          {segments.map((seg, i) => {
            const dashoffset = 100 - cumulative;
            cumulative += seg.percentage;
            const color = donutPalette[i % donutPalette.length];
            return (
              <Circle
                key={i}
                cx="21" cy="21" r="15.9"
                fill="transparent"
                stroke={color}
                strokeWidth="7"
                strokeDasharray={`${seg.percentage} ${100 - seg.percentage}`}
                strokeDashoffset={dashoffset}
                rotation="-90"
                origin="21, 21"
              />
            );
          })}
        </Svg>
        {centerLabel && (
          <View style={styles.centerLabelWrap}>
            <Text style={styles.centerLabel}>{centerLabel}</Text>
          </View>
        )}
      </View>
      <View style={styles.legendList}>
        {segments.map((seg, i) => (
          <View style={styles.li} key={i}>
            <View style={[styles.sw, { backgroundColor: donutPalette[i % donutPalette.length] }]} />
            <Text style={styles.liText}>{seg.category}</Text>
            <Text style={styles.pct}>{seg.percentage}%</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  svgWrap: { position: 'relative', alignItems: 'center', justifyContent: 'center' },
  centerLabelWrap: { position: 'absolute', alignItems: 'center' },
  centerLabel: { fontSize: 9, color: '#2E2A47', textAlign: 'center', maxWidth: 60 },
  legendList: { flex: 1 },
  li: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  sw: { width: 10, height: 10, borderRadius: 5, marginRight: 6 },
  liText: { flex: 1, fontSize: 13, color: '#2E2A47' },
  pct: { fontSize: 13, fontWeight: '600', color: '#2E2A47' },
});

export default CategoryDonut;