import type { ReactNode } from 'react';
import styles from './Modal.module.css';

interface ModalProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export function Modal({ title, onClose, children }: ModalProps) {
  return (
    <div className={styles.overlay} role="presentation" onClick={onClose}>
      <div
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className={styles.header}>
          <h2 className={styles.title} id="modal-title">
            {title}
          </h2>
          <button type="button" className={styles.closeButton} onClick={onClose} aria-label="とじる">
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
