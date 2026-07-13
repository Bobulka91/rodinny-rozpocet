/**
 * Obecný "obal" s tónovaným pozadím a zaoblenými rohy.
 * Nemá vlastní obsah - cokoliv vložíš mezi <Card>...</Card> (children)
 * se zobrazí uvnitř. Používá se všude, kde potřebujeme konzistentní kartu.
 */
function Card({ children }) {
  return (
    <div className="card">
      {children}
    </div>
  );
}

export default Card;