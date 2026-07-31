import { GameButton } from '../components/common/GameButton';
import { SoundToggle } from '../components/common/SoundToggle';
import { YokaiFigure } from '../components/game/YokaiFigure';
import styles from './TitleScreen.module.css';

interface TitleScreenProps {
  onStart: () => void;
  onShowHowToPlay: () => void;
}

export function TitleScreen({ onStart, onShowHowToPlay }: TitleScreenProps) {
  return (
    <div className={styles.screen}>
      <div className={styles.soundSlot}>
        <SoundToggle />
      </div>

      <div className={styles.logoBlock}>
        <h1 className={styles.logo}>かんじスラッシュ</h1>
        <p className={styles.subtitle}>じゅくごの よみを きりさこう！</p>
      </div>

      <div className={styles.keyVisual}>
        <YokaiFigure face="normal" className={styles.keyVisualFigure} />
        <YokaiFigure face="startled" className={`${styles.keyVisualFigure} ${styles.delayed}`} />
      </div>

      <div className={styles.actions}>
        <GameButton variant="primary" onClick={onStart}>
          はじめる
        </GameButton>
        <GameButton variant="secondary" onClick={onShowHowToPlay}>
          あそびかた
        </GameButton>
      </div>
    </div>
  );
}
