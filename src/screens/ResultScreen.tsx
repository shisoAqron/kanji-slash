import { useEffect, useMemo } from 'react';
import { GameButton } from '../components/common/GameButton';
import { ResultSummary } from '../components/result/ResultSummary';
import type { GameSession } from '../domain/game';
import { updateHighScore } from '../domain/highScores';
import { evaluationMessage, summarizeResult } from '../domain/scoring';
import styles from './ResultScreen.module.css';

interface ResultScreenProps {
  session: GameSession;
  onPlayAgain: () => void;
  onChooseLevel: () => void;
  onBackToTitle: () => void;
}

export function ResultScreen({ session, onPlayAgain, onChooseLevel, onBackToTitle }: ResultScreenProps) {
  const summary = useMemo(() => summarizeResult(session), [session]);
  const message = evaluationMessage(summary.correctCount, summary.totalQuestions);

  useEffect(() => {
    updateHighScore(session.grade, summary.correctCount, summary.maxCombo);
  }, [session.grade, summary.correctCount, summary.maxCombo]);

  return (
    <div className={styles.screen}>
      <h2 className={styles.heading}>しゅぎょう かんりょう！</h2>
      <p className={styles.evaluation}>{message}</p>

      <ResultSummary summary={summary} />

      <div className={styles.actions}>
        <GameButton variant="primary" onClick={onPlayAgain}>
          もういちど
        </GameButton>
        <GameButton variant="secondary" onClick={onChooseLevel}>
          学年を えらぶ
        </GameButton>
        <GameButton variant="ghost" onClick={onBackToTitle}>
          タイトルに もどる
        </GameButton>
      </div>
    </div>
  );
}
