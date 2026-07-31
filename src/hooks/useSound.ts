import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'kanji-slash:sound-on';

function readStoredSoundOn(): boolean {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === null ? true : stored === 'true';
  } catch {
    return true;
  }
}

function writeStoredSoundOn(value: boolean): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, String(value));
  } catch {
    // localStorageが使えない場合も設定はメモリ上でのみ保持して続行する。
  }
}

interface UseSoundResult {
  soundOn: boolean;
  toggleSound: () => void;
}

/**
 * 効果音ファイルは未収録のため、このフックはON/OFF設定の保持のみを担う。
 * 効果音を追加する際はここに再生処理を実装する。
 */
export function useSound(): UseSoundResult {
  const [soundOn, setSoundOn] = useState<boolean>(() => readStoredSoundOn());

  useEffect(() => {
    writeStoredSoundOn(soundOn);
  }, [soundOn]);

  const toggleSound = useCallback(() => {
    setSoundOn((current) => !current);
  }, []);

  return { soundOn, toggleSound };
}
