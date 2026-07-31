import styles from './ComboPopup.module.css';

interface ComboPopupProps {
  combo: number;
}

export function ComboPopup({ combo }: ComboPopupProps) {
  if (combo < 2) {
    return null;
  }

  return (
    <div className={styles.popup} role="status">
      {combo}れんぞく たいじ！
    </div>
  );
}
