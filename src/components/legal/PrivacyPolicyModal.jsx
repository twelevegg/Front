// src/components/legal/PrivacyPolicyModal.jsx
import Modal from '../Modal.jsx';
import PrivacyPolicyContent from './PrivacyPolicyContent.jsx';

export default function PrivacyPolicyModal({ open, onClose }) {
  return (
    <Modal open={open} title="개인정보처리방침" onClose={onClose}>
      <div className="max-h-[70vh] overflow-auto pr-2">
        <PrivacyPolicyContent />
      </div>
    </Modal>
  );
}
