/**
 * Donut graf výdajů podle kategorií, s legendou vedle sebe.
 * segments = pole { category, percentage } - graf i legenda se
 * generují ze stejných dat, ať nikdy nejsou nekonzistentní.
 */
const donutPalette = ['#3aafd0', '#2b4c7e', '#7c4d9e', '#c24ba0']; // pevné 4 barvy podle mockupu

function CategoryDonut({ segments, centerLabel }) {
  let cumulative = 0; // sleduje, kolik % kruhu je už "obsazeno" předchozími segmenty

  return (
    <div className="donut-row">
      <div className="donut-svg-wrap">
        <svg width="90" height="90" viewBox="0 0 42 42">
          {/* Šedý podkladový kruh */}
          <circle cx="21" cy="21" r="15.9" fill="transparent" stroke="rgba(46,42,71,0.08)" strokeWidth="7" />
          {segments.map((seg, i) => {
            const dashoffset = 100 - cumulative; // posun, kam segment nasadí
            cumulative += seg.percentage; // po vykreslení segmentu posuneme "ukazatel" dál
            const color = donutPalette[i % donutPalette.length]; // opakuje paletu, pokud je segmentů víc než barev
            return (
              <circle
                key={i}
                cx="21" cy="21" r="15.9"
                fill="transparent"
                stroke={color}
                strokeWidth="7"
                strokeDasharray={`${seg.percentage} ${100 - seg.percentage}`}
                strokeDashoffset={dashoffset}
                transform="rotate(-90 21 21)"
              />
            );
          })}
        </svg>
        {/* Volitelný text uprostřed grafu (např. "Moje Bilance") */}
        {centerLabel && <div className="donut-center-label">{centerLabel}</div>}
      </div>
      <div className="legend-list">
        {segments.map((seg, i) => (
          <div className="li" key={i}>
            <span className="sw" style={{ background: donutPalette[i % donutPalette.length] }}></span>
            {seg.category}
            <span className="pct">{seg.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CategoryDonut;