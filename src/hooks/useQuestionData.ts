import { useEffect, useState } from 'react';
import {
  gradeQuestionFileSchema,
  manifestSchema,
  MIN_QUESTIONS_PER_GRADE,
  type ManifestLevel,
  type Question,
} from '../domain/question';

export const LOAD_ERROR_MESSAGE = 'もんだいを よみこめませんでした。\nもういちど ためしてください。';

export class QuestionDataError extends Error {}

function assetUrl(path: string): string {
  return `${import.meta.env.BASE_URL}${path}`;
}

async function fetchJson(url: string): Promise<unknown> {
  let response: Response;
  try {
    response = await fetch(url);
  } catch (cause) {
    throw new QuestionDataError(`ネットワークエラー: ${url}`, { cause });
  }
  if (!response.ok) {
    throw new QuestionDataError(`ファイルの取得に失敗しました: ${url} (${response.status})`);
  }
  try {
    return await response.json();
  } catch (cause) {
    throw new QuestionDataError(`JSONの解析に失敗しました: ${url}`, { cause });
  }
}

export async function loadManifest(): Promise<ManifestLevel[]> {
  const json = await fetchJson(assetUrl('data/questions/manifest.json'));
  const parsed = manifestSchema.safeParse(json);
  if (!parsed.success) {
    throw new QuestionDataError(`manifest.jsonのスキーマが不正です: ${parsed.error.message}`);
  }
  return parsed.data.levels;
}

export async function loadGradeQuestions(level: ManifestLevel): Promise<Question[]> {
  if (!level.available || !level.path) {
    throw new QuestionDataError(`学年${level.grade}はまだ利用できません。`);
  }
  const json = await fetchJson(assetUrl(level.path));
  const parsed = gradeQuestionFileSchema.safeParse(json);
  if (!parsed.success) {
    throw new QuestionDataError(`${level.path}のスキーマが不正です: ${parsed.error.message}`);
  }
  if (parsed.data.questions.length < MIN_QUESTIONS_PER_GRADE) {
    throw new QuestionDataError(
      `${level.path}の問題数が不足しています（${parsed.data.questions.length}問）。`,
    );
  }
  return parsed.data.questions;
}

interface ManifestState {
  levels: ManifestLevel[] | null;
  loading: boolean;
  error: string | null;
}

export function useManifest(): ManifestState {
  const [state, setState] = useState<ManifestState>({ levels: null, loading: true, error: null });

  useEffect(() => {
    let cancelled = false;
    setState({ levels: null, loading: true, error: null });

    loadManifest()
      .then((levels) => {
        if (!cancelled) {
          setState({ levels, loading: false, error: null });
        }
      })
      .catch((error: unknown) => {
        if (import.meta.env.DEV) {
          console.error(error);
        }
        if (!cancelled) {
          setState({ levels: null, loading: false, error: LOAD_ERROR_MESSAGE });
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
