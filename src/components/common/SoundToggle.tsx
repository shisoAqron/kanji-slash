import { useSound } from '../../hooks/useSound';
import styles from './SoundToggle.module.css';

export function SoundToggle() {
  const { soundOn, toggleSound } = useSound();

  return (
    <button
      type="button"
      className={styles.toggle}
      onClick={toggleSound}
      aria-pressed={soundOn}
      aria-label={soundOn ? 'おとを けす' : 'おとを つける'}
    >
      <span className={styles.icon} aria-hidden="true">
        {soundOn ? '🔊' : '🔇'}
      </span>
      <span aria-hidden="true">おと</span>
    </button>
  );
}
