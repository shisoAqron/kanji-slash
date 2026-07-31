import styles from './IncorrectEffect.module.css';

interface IncorrectEffectProps {
  reading: string;
}

export function IncorrectEffect({ reading }: IncorrectEffectProps) {
  return (
    <div className={styles.banner}>
      <p className={styles.title}>ざんねん！</p>
      <p className={styles.answer}>{reading}</p>
    </div>
  );
}
