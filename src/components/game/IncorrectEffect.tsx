import styles from './IncorrectEffect.module.css';

interface IncorrectEffectProps {
  word: string;
  reading: string;
}

export function IncorrectEffect({ word, reading }: IncorrectEffectProps) {
  return (
    <div className={styles.banner}>
      <p className={styles.title}>ざんねん！</p>
      <p className={styles.answer}>
        {word}（{reading}）
      </p>
    </div>
  );
}
