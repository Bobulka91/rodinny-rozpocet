/**
 * NEPOUŽÍVÁ SE samostatně - součást nepoužívaného SlideContainer.
 * Tečky pro navigaci mezi slidy (ukazují, kolik slidů je a který je aktivní).
 */
function Dots({ total, current, onChange }) {
  return (
    <div className="dots">
      {/* Array.from({length: total}) vytvoří pole "prázdných" prvků jen podle počtu,
          abychom je mohli projít přes .map() a vykreslit jedno tlačítko na slide */}
      {Array.from({ length: total }).map((_, index) => (
        <button
          key={index}
          className={index === current ? 'active' : ''}
          onClick={() => onChange(index)}
        ></button>
      ))}
    </div>
  );
}

export default Dots;