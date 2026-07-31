import type { Side } from '../../domain/question';
import styles from './SlashEffect.module.css';
import { SwordIcon } from './SwordIcon';

export type SlashVariant = 'hit' | 'miss';

interface SlashEffectProps {
  side: Side | null;
  variant: SlashVariant | null;
  slashKey: number;
}

export function SlashEffect({ side, variant, slashKey }: SlashEffectProps) {
  if (!side) {
    return <div className={styles.stage} aria-hidden="true" />;
  }

  return (
    <div className={styles.stage} aria-hidden="true">
      <div key={`trail-${slashKey}`} className={`${styles.trail} ${styles[side]}`} />
      <div key={`sword-${slashKey}`} className={`${styles.swordWrap} ${styles[side]}`}>
        <SwordIcon className={styles.swordIcon} />
      </div>
      {variant === 'hit' && (
        <span key={`spark-${slashKey}`} className={`${styles.spark} ${styles[side]}`} />
      )}
    </div>
  );
}
