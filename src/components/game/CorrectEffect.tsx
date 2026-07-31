import { ComboPopup } from './ComboPopup';
import styles from './CorrectEffect.module.css';

interface CorrectEffectProps {
  word: string;
  reading: string;
  combo: number;
}

export function CorrectEffect({ word, reading, combo }: CorrectEffectProps) {
  return (
    <div className={styles.banner}>
      <p className={styles.title}>せいかい！</p>
      <ComboPopup combo={combo} />
      <p className={styles.answer}>
        {word}（{reading}）
      </p>
    </div>
  );
}
