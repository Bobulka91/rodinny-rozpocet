/**
 * NEPOUŽÍVÁ SE samostatně - součást nepoužívaného SlideContainer.
 * Šipky pro navigaci vlevo/vpravo mezi slidy (pro použití myší na PC).
 */
function Arrows({ current, total, onChange }) {
  // Přechod na předchozí slide - jen pokud nejsme na prvním
  function goPrev() {
    if (current > 0) onChange(current - 1);
  }

  // Přechod na další slide - jen pokud nejsme na posledním
  function goNext() {
    if (current < total - 1) onChange(current + 1);
  }

  return (
    // Fragment (<>...</>) - vrací dva prvky vedle sebe bez zbytečného obalového <div>
    <>
      <button className="arrow left" onClick={goPrev} disabled={current === 0}>
        ←
      </button>
      <button className="arrow right" onClick={goNext} disabled={current === total - 1}>
        →
      </button>
    </>
  );
}

export default Arrows;