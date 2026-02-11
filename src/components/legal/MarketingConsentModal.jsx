import Modal from '../Modal.jsx';
import MarketingConsentContent from './MarketingConsentContent.jsx';

export default function MarketingConsentModal({ open, onClose }) {
    return (
        <Modal open={open} title="마케팅 정보 수신 동의" onClose={onClose}>
            <div className="max-h-[70vh] overflow-auto pr-2">
                <MarketingConsentContent />
            </div>
        </Modal>
    );
}
