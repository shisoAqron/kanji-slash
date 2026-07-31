import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  gradeQuestionFileSchema,
  isValidWord,
  manifestSchema,
  MIN_QUESTIONS_PER_GRADE,
} from '../domain/question';

const projectRoot = process.cwd();

function readJson(relativePath: string): unknown {
  const filePath = path.join(projectRoot, relativePath);
  return JSON.parse(readFileSync(filePath, 'utf-8'));
}

const kanjiByGrade = readJson('src/data/kanji-by-grade.json') as Record<string, string[]>;
const KANJI_PATTERN = /\p{Script=Han}/u;

function isKanjiWithinGrade(char: string, grade: number): boolean {
  for (let g = 1; g <= grade; g += 1) {
    if (kanjiByGrade[String(g)]?.includes(char)) {
      return true;
    }
  }
  return false;
}

describe('manifest.json', () => {
  const manifest = readJson('public/data/questions/manifest.json');

  it('satisfies the manifest schema', () => {
    expect(() => manifestSchema.parse(manifest)).not.toThrow();
  });

  it('marks grade 1 and 2 as available with a path', () => {
    const parsed = manifestSchema.parse(manifest);
    const grade1 = parsed.levels.find((level) => level.grade === 1);
    const grade2 = parsed.levels.find((level) => level.grade === 2);
    expect(grade1?.available).toBe(true);
    expect(grade1?.path).toBeTruthy();
    expect(grade2?.available).toBe(true);
    expect(grade2?.path).toBeTruthy();
  });

  it('marks grade 3 through 6 as unavailable', () => {
    const parsed = manifestSchema.parse(manifest);
    for (const grade of [3, 4, 5, 6]) {
      const level = parsed.levels.find((entry) => entry.grade === grade);
      expect(level?.available).toBe(false);
    }
  });
});

const gradeFiles: Array<[string, number]> = [
  ['grade-1.json', 1],
  ['grade-2.json', 2],
];

const allIds: string[] = [];

describe.each(gradeFiles)('%s', (file, grade) => {
  const json = readJson(`public/data/questions/${file}`);
  const parsed = gradeQuestionFileSchema.parse(json);
  allIds.push(...parsed.questions.map((q) => q.id));

  it('satisfies the grade question schema', () => {
    expect(parsed.grade).toBe(grade);
  });

  it(`has at least ${MIN_QUESTIONS_PER_GRADE} questions`, () => {
    expect(parsed.questions.length).toBeGreaterThanOrEqual(MIN_QUESTIONS_PER_GRADE);
  });

  it('has unique ids within the file', () => {
    const ids = parsed.questions.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('has words containing two or more kanji characters', () => {
    for (const question of parsed.questions) {
      expect(isValidWord(question.word)).toBe(true);
    }
  });

  it('uses only kanji taught at or below the target grade', () => {
    for (const question of parsed.questions) {
      for (const char of question.word) {
        if (KANJI_PATTERN.test(char)) {
          expect(isKanjiWithinGrade(char, grade)).toBe(true);
        }
      }
    }
  });

  it('records kanjiGrades values not exceeding the target grade', () => {
    for (const question of parsed.questions) {
      for (const value of Object.values(question.kanjiGrades)) {
        expect(value).toBeLessThanOrEqual(grade);
      }
    }
  });

  it('has at least one distractor and no duplicate or correct-matching distractors', () => {
    for (const question of parsed.questions) {
      expect(question.distractors.length).toBeGreaterThanOrEqual(1);
      expect(question.distractors).not.toContain(question.reading);
      expect(new Set(question.distractors).size).toBe(question.distractors.length);
    }
  });

  it('keeps example sentences reasonably short', () => {
    for (const question of parsed.questions) {
      expect([...question.example].length).toBeLessThanOrEqual(30);
    }
  });
});

describe('question ids across all grades', () => {
  it('are unique across the whole dataset', () => {
    expect(new Set(allIds).size).toBe(allIds.length);
  });
});
