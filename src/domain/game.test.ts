import { describe, expect, it } from 'vitest';
import {
  advanceToNextQuestion,
  createGameSession,
  currentQuestion,
  isGameComplete,
  pickQuestions,
  submitAnswer,
} from './game';
import type { Question } from './question';
import { QUESTIONS_PER_PLAY } from './question';

function makeQuestions(count: number): Question[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `q-${index}`,
    word: `熟語${index}`,
    reading: `よみ${index}`,
    distractors: [`ちがう${index}`],
    example: `熟語${index}を つかう。`,
    exampleReading: `よみ${index}を つかう。`,
    kanjiGrades: {},
    tags: [],
  }));
}

function sequenceRandom(values: number[]): () => number {
  let i = 0;
  return () => values[Math.min(i++, values.length - 1)];
}

describe('pickQuestions', () => {
  it('draws the requested count without duplicates', () => {
    const pool = makeQuestions(20);
    const picked = pickQuestions(pool, QUESTIONS_PER_PLAY, Math.random);
    expect(picked).toHaveLength(QUESTIONS_PER_PLAY);
    expect(new Set(picked.map((q) => q.id)).size).toBe(QUESTIONS_PER_PLAY);
  });
});

describe('createGameSession', () => {
  it('fixes the distractor and correct side per question up front', () => {
    const pool = makeQuestions(12);
    const session = createGameSession(1, pool, Math.random);
    expect(session.questions).toHaveLength(QUESTIONS_PER_PLAY);
    for (const prepared of session.questions) {
      expect(prepared.question.distractors).toContain(prepared.distractor);
      expect(['left', 'right']).toContain(prepared.correctSide);
    }
  });
});

describe('submitAnswer', () => {
  it('increments combo and correctCount on a correct answer', () => {
    const pool = makeQuestions(10);
    let session = createGameSession(1, pool, sequenceRandom([0]));
    // random() < 0.5 -> correctSide 'left' for every prepared question
    session = submitAnswer(session, 'left');
    expect(session.answerState).toBe('correct');
    expect(session.combo).toBe(1);
    expect(session.correctCount).toBe(1);
  });

  it('resets combo to 0 and records the question as incorrect on a wrong answer', () => {
    const pool = makeQuestions(10);
    let session = createGameSession(1, pool, sequenceRandom([0]));
    session = { ...session, combo: 3 };
    session = submitAnswer(session, 'right');
    expect(session.answerState).toBe('incorrect');
    expect(session.combo).toBe(0);
    expect(session.correctCount).toBe(0);
    expect(session.incorrectQuestionIds).toContain(currentQuestion(session).question.id);
  });

  it('ignores further answers while not idle (double-tap guard)', () => {
    const pool = makeQuestions(10);
    let session = createGameSession(1, pool, sequenceRandom([0]));
    session = submitAnswer(session, 'left');
    const afterFirst = session;
    session = submitAnswer(session, 'left');
    expect(session).toBe(afterFirst);
  });
});

describe('advanceToNextQuestion / isGameComplete', () => {
  it('moves to the next question after either a correct or incorrect answer', () => {
    const pool = makeQuestions(10);
    let session = createGameSession(1, pool, sequenceRandom([0]));

    // wrong answer on the first question still advances to the next one
    session = submitAnswer(session, 'right');
    expect(session.answerState).toBe('incorrect');
    session = advanceToNextQuestion(session);
    expect(session.currentIndex).toBe(1);
    expect(session.answerState).toBe('idle');
  });

  it('moves to the result state after the final question', () => {
    const pool = makeQuestions(10);
    let session = createGameSession(1, pool, sequenceRandom([0]));
    for (let i = 0; i < QUESTIONS_PER_PLAY; i += 1) {
      session = submitAnswer(session, 'left');
      expect(session.answerState).toBe('correct');
      session = advanceToNextQuestion(session);
    }
    expect(isGameComplete(session)).toBe(true);
  });

  it('reaches the result state after 10 questions even with incorrect answers mixed in', () => {
    const pool = makeQuestions(10);
    let session = createGameSession(1, pool, sequenceRandom([0]));
    for (let i = 0; i < QUESTIONS_PER_PLAY; i += 1) {
      const side = i % 2 === 0 ? 'left' : 'right'; // alternate correct/incorrect
      session = submitAnswer(session, side);
      session = advanceToNextQuestion(session);
    }
    expect(isGameComplete(session)).toBe(true);
    expect(session.correctCount).toBe(5);
    expect(session.incorrectQuestionIds).toHaveLength(5);
  });
});
