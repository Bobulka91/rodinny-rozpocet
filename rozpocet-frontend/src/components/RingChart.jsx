/**
 * Kruhový (donut) progress graf pro celkový přehled splacení dluhu.
 * Kreslený ručně přes SVG - stroke-dasharray/dashoffset simulují
 * "vyplněný" oblouk kruhu podle zadaného procenta.
 */
function RingChart({ percentage, label, sublabel }) {
  const radius = 30;
  const circumference = 2 * Math.PI * radius; // obvod kruhu
  const offset = circumference * (1 - percentage / 100); // kolik obvodu zůstane "nevyplněné"

  return (
    <div className="ring-wrap">
      <svg width="66" height="66" viewBox="0 0 72 72">
        {/* Šedý podkladový kruh - vždy celý */}
        <circle cx="36" cy="36" r={radius} fill="none" stroke="rgba(46,42,71,0.1)" strokeWidth="9" />
        {/* Barevný kruh - vyplněný jen do zadaného procenta */}
        <circle
          cx="36" cy="36" r={radius} fill="none"
          stroke="var(--indigo)" strokeWidth="9"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 36 36)" // začátek oblouku nahoře, ne vpravo (výchozí chování SVG)
        />
      </svg>
      <div className="ring-label">
        {label}
        <b>{percentage}%</b>
        {sublabel}
      </div>
    </div>
  );
}

export default RingChart;