const STORAGE_PREFIX = 'kanji-slash:high-score:grade-';

export interface GradeHighScore {
  bestCorrectCount: number;
  bestMaxCombo: number;
}

function storageKey(grade: number): string {
  return `${STORAGE_PREFIX}${grade}`;
}

export function readHighScore(grade: number): GradeHighScore | null {
  try {
    const raw = window.localStorage.getItem(storageKey(grade));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as GradeHighScore;
    if (typeof parsed.bestCorrectCount !== 'number' || typeof parsed.bestMaxCombo !== 'number') {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

/** 過去の記録と比較し、更新があれば保存したうえで最新の記録を返す。 */
export function updateHighScore(grade: number, correctCount: number, maxCombo: number): GradeHighScore {
  const previous = readHighScore(grade);
  const next: GradeHighScore = {
    bestCorrectCount: Math.max(previous?.bestCorrectCount ?? 0, correctCount),
    bestMaxCombo: Math.max(previous?.bestMaxCombo ?? 0, maxCombo),
  };
  try {
    window.localStorage.setItem(storageKey(grade), JSON.stringify(next));
  } catch {
    // localStorageが使えない場合も記録なしで続行する。
  }
  return next;
}
