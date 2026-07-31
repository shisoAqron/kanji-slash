import { describe, expect, it } from 'vitest';
import { calculateAnswerScore, evaluationMessage, summarizeResult } from './scoring';
import { createGameSession, submitAnswer } from './game';
import type { Question } from './question';

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

describe('calculateAnswerScore', () => {
  it('awards 100 points for a correct answer with no combo bonus', () => {
    expect(calculateAnswerScore(1)).toBe(100);
  });

  it('adds combo × 10 bonus from the second consecutive correct answer', () => {
    expect(calculateAnswerScore(2)).toBe(100 + 20);
    expect(calculateAnswerScore(3)).toBe(100 + 30);
  });
});

describe('evaluationMessage', () => {
  it('returns the top message for a perfect score', () => {
    expect(evaluationMessage(10, 10)).toBe('かんじマスター！');
  });

  it('returns encouraging messages for lower scores without negativity toward the child', () => {
    expect(evaluationMessage(9, 10)).toBe('すごい！ あとすこし！');
    expect(evaluationMessage(6, 10)).toBe('よくがんばった！');
    expect(evaluationMessage(2, 10)).toBe('もういちど しゅぎょうしよう！');
  });
});

describe('summarizeResult', () => {
  it('lists only questions that were ever answered incorrectly', () => {
    const pool = makeQuestions(2);
    let session = createGameSession(1, pool, () => 0);
    session = submitAnswer(session, 'right'); // wrong on first question
    const summary = summarizeResult(session);
    expect(summary.incorrectWords).toHaveLength(1);
    expect(summary.incorrectWords[0].id).toBe(session.questions[0].question.id);
  });
});
