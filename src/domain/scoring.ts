import type { GameSession } from './game';
import { QUESTIONS_PER_PLAY } from './question';

export const CORRECT_SCORE = 100;
export const COMBO_BONUS_PER_STEP = 10;

/** 正解1回分の得点。連続正解2回目以降はボーナスを加算する。 */
export function calculateAnswerScore(comboAfterIncrement: number): number {
  const comboBonus = comboAfterIncrement >= 2 ? comboAfterIncrement * COMBO_BONUS_PER_STEP : 0;
  return CORRECT_SCORE + comboBonus;
}

export interface IncorrectWordSummary {
  id: string;
  word: string;
  reading: string;
}

export interface ResultSummary {
  grade: number;
  totalQuestions: number;
  correctCount: number;
  correctRate: number;
  maxCombo: number;
  score: number;
  incorrectWords: IncorrectWordSummary[];
}

export function summarizeResult(session: GameSession): ResultSummary {
  const totalQuestions = session.questions.length;
  const incorrectWords = session.questions
    .filter((prepared) => session.incorrectQuestionIds.includes(prepared.question.id))
    .map((prepared) => ({
      id: prepared.question.id,
      word: prepared.question.word,
      reading: prepared.question.reading,
    }));

  return {
    grade: session.grade,
    totalQuestions,
    correctCount: session.correctCount,
    correctRate: totalQuestions === 0 ? 0 : session.correctCount / totalQuestions,
    maxCombo: session.maxCombo,
    score: session.score,
    incorrectWords,
  };
}

export function evaluationMessage(correctCount: number, totalQuestions: number = QUESTIONS_PER_PLAY): string {
  if (totalQuestions <= 0) {
    return '';
  }
  const ratio = correctCount / totalQuestions;
  if (correctCount >= totalQuestions) {
    return 'かんじマスター！';
  }
  if (ratio >= 0.8) {
    return 'すごい！ あとすこし！';
  }
  if (ratio >= 0.5) {
    return 'よくがんばった！';
  }
  return 'もういちど しゅぎょうしよう！';
}
