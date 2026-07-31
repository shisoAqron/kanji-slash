import { z } from 'zod';

export const questionSchema = z.object({
  id: z.string().min(1),
  word: z.string().min(1),
  reading: z.string().min(1),
  distractors: z.array(z.string().min(1)).min(1),
  example: z.string().min(1),
  exampleReading: z.string().min(1),
  kanjiGrades: z.record(z.string(), z.number()),
  tags: z.array(z.string()),
});

export const gradeQuestionFileSchema = z.object({
  schemaVersion: z.number(),
  grade: z.number(),
  title: z.string(),
  sourcePolicy: z.string(),
  questions: z.array(questionSchema),
});

export type Question = z.infer<typeof questionSchema>;
export type GradeQuestionFile = z.infer<typeof gradeQuestionFileSchema>;

export const manifestLevelSchema = z.object({
  grade: z.number(),
  label: z.string(),
  available: z.boolean(),
  path: z.string().optional(),
});

export const manifestSchema = z.object({
  schemaVersion: z.number(),
  levels: z.array(manifestLevelSchema),
});

export type ManifestLevel = z.infer<typeof manifestLevelSchema>;
export type Manifest = z.infer<typeof manifestSchema>;

export type Side = 'left' | 'right';

export interface PreparedQuestion {
  question: Question;
  distractor: string;
  correctSide: Side;
}

export const MIN_QUESTIONS_PER_GRADE = 10;
export const QUESTIONS_PER_PLAY = 10;

/** 二文字以上の熟語かどうかを判定する（一文字問題への回帰を防ぐ）。 */
export function isValidWord(word: string): boolean {
  return [...word].length >= 2;
}
