import { useCallback, useReducer } from 'react';
import { HowToPlayScreen } from '../screens/HowToPlayScreen';
import { GameScreen } from '../screens/GameScreen';
import { LevelSelectScreen } from '../screens/LevelSelectScreen';
import { ResultScreen } from '../screens/ResultScreen';
import { TitleScreen } from '../screens/TitleScreen';
import { createGameSession } from '../domain/game';
import type { Side } from '../domain/question';
import { LOAD_ERROR_MESSAGE, loadGradeQuestions, useManifest } from '../hooks/useQuestionData';
import { appReducer, initialAppState } from './appReducer';

export function App() {
  const [state, dispatch] = useReducer(appReducer, initialAppState);
  const { levels, loading: levelsLoading, error: levelsError } = useManifest();

  const startGrade = useCallback(
    async (grade: number) => {
      const level = levels?.find((entry) => entry.grade === grade);
      if (!level) return;

      dispatch({ type: 'START_GAME_REQUEST' });
      try {
        const questions = await loadGradeQuestions(level);
        const session = createGameSession(grade, questions);
        dispatch({ type: 'GAME_READY', session });
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error(error);
        }
        dispatch({ type: 'GAME_LOAD_ERROR', error: LOAD_ERROR_MESSAGE });
      }
    },
    [levels],
  );

  const handleAnswer = useCallback((side: Side) => {
    dispatch({ type: 'SUBMIT_ANSWER', side });
  }, []);

  const handleAdvance = useCallback(() => {
    dispatch({ type: 'ADVANCE_QUESTION' });
  }, []);

  return (
    <div className="app-shell">
      {state.screen === 'title' && (
        <TitleScreen
          onStart={() => dispatch({ type: 'GO_LEVEL_SELECT' })}
          onShowHowToPlay={() => dispatch({ type: 'GO_HOW_TO_PLAY' })}
        />
      )}

      {state.screen === 'howToPlay' && (
        <HowToPlayScreen onClose={() => dispatch({ type: 'GO_TITLE' })} />
      )}

      {state.screen === 'levelSelect' && (
        <LevelSelectScreen
          levels={levels}
          loading={levelsLoading || state.gameLoading}
          error={levelsError ?? state.gameError}
          onSelectGrade={startGrade}
          onBack={() => dispatch({ type: 'GO_TITLE' })}
        />
      )}

      {state.screen === 'playing' && state.session && (
        <GameScreen session={state.session} onAnswer={handleAnswer} onAdvance={handleAdvance} />
      )}

      {state.screen === 'result' && state.session && (
        <ResultScreen
          session={state.session}
          onPlayAgain={() => startGrade(state.session!.grade)}
          onChooseLevel={() => dispatch({ type: 'GO_LEVEL_SELECT' })}
          onBackToTitle={() => dispatch({ type: 'GO_TITLE' })}
        />
      )}
    </div>
  );
}
