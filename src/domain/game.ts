import type { PreparedQuestion, Question, Side } from './question';
import { QUESTIONS_PER_PLAY } from './question';
import { calculateAnswerScore } from './scoring';

export type AnswerState = 'idle' | 'checking' | 'correct' | 'incorrect';

export interface GameSession {
  grade: number;
  questions: PreparedQuestion[];
  currentIndex: number;
  combo: number;
  maxCombo: number;
  correctCount: number;
  incorrectQuestionIds: string[];
  answerState: AnswerState;
  score: number;
}

/** [0, 1) の乱数を返す関数。テストでは決定的な実装に差し替える。 */
export type RandomFn = () => number;

export function shuffle<T>(items: readonly T[], random: RandomFn = Math.random): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function pickQuestions(
  pool: readonly Question[],
  count: number,
  random: RandomFn = Math.random,
): Question[] {
  return shuffle(pool, random).slice(0, count);
}

export function prepareQuestion(question: Question, random: RandomFn = Math.random): PreparedQuestion {
  const distractor = question.distractors[Math.floor(random() * question.distractors.length)];
  const correctSide: Side = random() < 0.5 ? 'left' : 'right';
  return { question, distractor, correctSide };
}

export function createGameSession(
  grade: number,
  pool: readonly Question[],
  random: RandomFn = Math.random,
): GameSession {
  const picked = pickQuestions(pool, QUESTIONS_PER_PLAY, random);
  const questions = picked.map((question) => prepareQuestion(question, random));
  return {
    grade,
    questions,
    currentIndex: 0,
    combo: 0,
    maxCombo: 0,
    correctCount: 0,
    incorrectQuestionIds: [],
    answerState: 'idle',
    score: 0,
  };
}

export function currentQuestion(session: GameSession): PreparedQuestion {
  return session.questions[session.currentIndex];
}

export function isGameComplete(session: GameSession): boolean {
  return session.currentIndex >= session.questions.length;
}

/**
 * 回答を確定する。二重入力防止のため idle 以外では何もしない。
 * 各問題の回答機会は1回のみで、正解でも不正解でも次の問題へ進む。
 */
export function submitAnswer(session: GameSession, side: Side): GameSession {
  if (session.answerState !== 'idle') {
    return session;
  }

  const question = currentQuestion(session);
  const questionId = question.question.id;
  const isCorrect = side === question.correctSide;

  if (isCorrect) {
    const combo = session.combo + 1;
    const maxCombo = Math.max(session.maxCombo, combo);
    const correctCount = session.correctCount + 1;
    const score = session.score + calculateAnswerScore(combo);

    return {
      ...session,
      combo,
      maxCombo,
      correctCount,
      score,
      answerState: 'correct',
    };
  }

  const incorrectQuestionIds = session.incorrectQuestionIds.includes(questionId)
    ? session.incorrectQuestionIds
    : [...session.incorrectQuestionIds, questionId];

  return {
    ...session,
    incorrectQuestionIds,
    combo: 0,
    answerState: 'incorrect',
  };
}

/** 正解・不正解いずれの後も、この関数で次の問題へ進める。 */
export function advanceToNextQuestion(session: GameSession): GameSession {
  return {
    ...session,
    currentIndex: session.currentIndex + 1,
    answerState: 'idle',
  };
}
