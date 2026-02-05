// src/components/legal/TermsOfServiceModal.jsx
import Modal from '../Modal.jsx';
import TermsOfServiceContent from './TermsOfServiceContent.jsx';

export default function TermsOfServiceModal({ open, onClose }) {
    return (
        <Modal open={open} title="서비스 이용약관" onClose={onClose}>
            <div className="max-h-[70vh] overflow-auto pr-2 custom-scrollbar">
                <TermsOfServiceContent />
            </div>
        </Modal>
    );
}
