import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaExclamationTriangle } from 'react-icons/fa';
import '../styles/ConfirmationModal.css';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirm", cancelText = "Cancel", isDanger = false }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                className="modal-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            >
                <motion.div
                    className="modal-content confirmation-modal"
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    onClick={e => e.stopPropagation()}
                >
                    <div className="confirmation-header">
                        <div className={`icon-wrapper ${isDanger ? 'danger' : 'warning'}`}>
                            <FaExclamationTriangle />
                        </div>
                        <h3>{title}</h3>
                    </div>

                    <div className="confirmation-body">
                        <p>{message}</p>
                    </div>

                    <div className="modal-actions">
                        <button className="btn-cancel" onClick={onClose}>
                            {cancelText}
                        </button>
                        <button
                            className={`btn-confirm ${isDanger ? 'danger' : ''}`}
                            onClick={() => {
                                onConfirm();
                                onClose();
                            }}
                        >
                            {confirmText}
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ConfirmationModal;
