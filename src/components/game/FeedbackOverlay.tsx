import type { ReactNode } from 'react';
import styles from './FeedbackOverlay.module.css';

interface FeedbackOverlayProps {
  children: ReactNode;
}

/** 問題文の上に重ねて正解・不正解のフィードバックを表示する。 */
export function FeedbackOverlay({ children }: FeedbackOverlayProps) {
  return (
    <div className={styles.overlay} role="status" aria-live="polite">
      {children}
    </div>
  );
}
