import { GameButton } from '../components/common/GameButton';
import type { ManifestLevel } from '../domain/question';
import styles from './LevelSelectScreen.module.css';

interface LevelSelectScreenProps {
  levels: ManifestLevel[] | null;
  loading: boolean;
  error: string | null;
  onSelectGrade: (grade: number) => void;
  onBack: () => void;
}

export function LevelSelectScreen({ levels, loading, error, onSelectGrade, onBack }: LevelSelectScreenProps) {
  return (
    <div className={styles.screen}>
      <h2 className={styles.heading}>がくねんを えらぼう</h2>

      {loading && <p className={styles.message}>よみこみちゅう…</p>}
      {error && <p className={styles.message}>{error}</p>}

      {levels && (
        <div className={styles.grid}>
          {levels.map((level) => (
            <button
              key={level.grade}
              type="button"
              className={styles.levelButton}
              disabled={!level.available}
              onClick={() => onSelectGrade(level.grade)}
            >
              {level.label}
              {!level.available && <span className={styles.badge}>じゅんび中</span>}
            </button>
          ))}
        </div>
      )}

      <div className={styles.backAction}>
        <GameButton variant="ghost" onClick={onBack}>
          タイトルに もどる
        </GameButton>
      </div>
    </div>
  );
}
