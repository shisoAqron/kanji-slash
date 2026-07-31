import { ComboPopup } from './ComboPopup';
import styles from './CorrectEffect.module.css';

interface CorrectEffectProps {
  reading: string;
  combo: number;
}

export function CorrectEffect({ reading, combo }: CorrectEffectProps) {
  return (
    <div className={styles.banner}>
      <p className={styles.title}>せいかい！</p>
      <p className={styles.answer}>{reading}</p>
      <ComboPopup combo={combo} />
    </div>
  );
}
