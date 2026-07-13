/**
 * Obecný modal (vyskakovací okno) - použitý jako obal pro všechny
 * formuláře i ConfirmDeleteModal. Vykreslený přes React Portal přímo
 * do document.body, aby ho neovlivňovaly CSS transformace rodičů.
 */
import { createPortal } from 'react-dom';

function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null; // appka "drží" komponentu připravenou, ale nic nevykreslí

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      {/* stopPropagation zabrání, aby klik uvnitř modalu probublal
          nahoru a omylem zavřel modal přes onClick na overlay */}
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        {children}
      </div>
    </div>,
    document.body
  );
}

export default Modal;