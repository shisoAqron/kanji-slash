import type { ResultSummary as ResultSummaryData } from '../../domain/scoring';
import styles from './ResultSummary.module.css';

interface ResultSummaryProps {
  summary: ResultSummaryData;
}

export function ResultSummary({ summary }: ResultSummaryProps) {
  const percent = Math.round(summary.correctRate * 100);

  return (
    <>
      <div className={styles.stats}>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>せいかい</span>
          <span className={styles.statValue}>
            {summary.correctCount} / {summary.totalQuestions}
          </span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>せいかいりつ</span>
          <span className={styles.statValue}>{percent}%</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>さいだい れんぞく</span>
          <span className={styles.statValue}>{summary.maxCombo}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>スコア</span>
          <span className={styles.statValue}>{summary.score}</span>
        </div>
      </div>

      <div className={styles.incorrectSection}>
        <p className={styles.incorrectTitle}>まちがえた もんだい</p>
        {summary.incorrectWords.length === 0 ? (
          <p className={styles.empty}>ぜんもん せいかい できたね！</p>
        ) : (
          <ul className={styles.incorrectList}>
            {summary.incorrectWords.map((item) => (
              <li key={item.id} className={styles.incorrectItem}>
                <span>{item.word}</span>
                <span>{item.reading}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
