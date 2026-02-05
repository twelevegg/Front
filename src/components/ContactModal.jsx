import Modal from './Modal.jsx';
import ContactContent from './ContactContent.jsx';

export default function ContactModal({ open, onClose }) {
    return (
        <Modal open={open} title="문의하기" onClose={onClose}>
            {/* Removed max-h constraint or adjusted it if needed, but Modal usually handles it. 
            Using similar props to ToS modal for consistency. */}
            <div className="max-h-[70vh] overflow-auto custom-scrollbar pr-1">
                <ContactContent />
            </div>
        </Modal>
    );
}
