import { GameButton } from '../components/common/GameButton';
import { Modal } from '../components/common/Modal';
import styles from './HowToPlayScreen.module.css';

interface HowToPlayScreenProps {
  onClose: () => void;
}

export function HowToPlayScreen({ onClose }: HowToPlayScreenProps) {
  return (
    <Modal title="あそびかた" onClose={onClose}>
      <ol className={styles.list}>
        <li>じゅくごを よもう。</li>
        <li>ただしい よみを もつ 妖怪を えらぼう。</li>
        <li>ただしい 妖怪を かたなで たいじしよう。</li>
        <li>れんぞく せいかいで れんぞく たいじを のばそう。</li>
      </ol>
      <div className={styles.closeAction}>
        <GameButton variant="primary" onClick={onClose}>
          わかった！
        </GameButton>
      </div>
    </Modal>
  );
}
