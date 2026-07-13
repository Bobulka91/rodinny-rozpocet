/**
 * Potvrzovací dialog před smazáním záznamu (transakce, cíl, dluh, plán).
 * Znovupoužívá obecný Modal, jen s předem daným obsahem (text + 2 tlačítka).
 */
import Modal from './Modal';

function ConfirmDeleteModal({ isOpen, onClose, onConfirm, itemName }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Opravdu smazat?">
      <p className="confirm-text">
        Chystáš se smazat <strong>{itemName}</strong>. Tuhle akci nejde vrátit zpět.
      </p>
      <div className="confirm-actions">
        <button className="btn-cancel" onClick={onClose}>Zrušit</button>
        <button className="btn-danger" onClick={onConfirm}>Smazat</button>
      </div>
    </Modal>
  );
}

export default ConfirmDeleteModal;