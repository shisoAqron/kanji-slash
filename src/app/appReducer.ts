import {
  advanceToNextQuestion,
  isGameComplete,
  submitAnswer,
  type GameSession,
} from '../domain/game';
import type { Side } from '../domain/question';

export type Screen = 'title' | 'howToPlay' | 'levelSelect' | 'playing' | 'result';

export interface AppState {
  screen: Screen;
  session: GameSession | null;
  gameLoading: boolean;
  gameError: string | null;
}

export const initialAppState: AppState = {
  screen: 'title',
  session: null,
  gameLoading: false,
  gameError: null,
};

export type AppAction =
  | { type: 'GO_TITLE' }
  | { type: 'GO_HOW_TO_PLAY' }
  | { type: 'GO_LEVEL_SELECT' }
  | { type: 'START_GAME_REQUEST' }
  | { type: 'GAME_READY'; session: GameSession }
  | { type: 'GAME_LOAD_ERROR'; error: string }
  | { type: 'SUBMIT_ANSWER'; side: Side }
  | { type: 'ADVANCE_QUESTION' };

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'GO_TITLE':
      return { ...state, screen: 'title', session: null, gameError: null };

    case 'GO_HOW_TO_PLAY':
      return { ...state, screen: 'howToPlay' };

    case 'GO_LEVEL_SELECT':
      return { ...state, screen: 'levelSelect', session: null, gameError: null };

    case 'START_GAME_REQUEST':
      return { ...state, gameLoading: true, gameError: null };

    case 'GAME_READY':
      return {
        ...state,
        screen: 'playing',
        session: action.session,
        gameLoading: false,
        gameError: null,
      };

    case 'GAME_LOAD_ERROR':
      return { ...state, gameLoading: false, gameError: action.error };

    case 'SUBMIT_ANSWER': {
      if (!state.session) return state;
      return { ...state, session: submitAnswer(state.session, action.side) };
    }

    case 'ADVANCE_QUESTION': {
      if (!state.session) return state;
      const nextSession = advanceToNextQuestion(state.session);
      return {
        ...state,
        session: nextSession,
        screen: isGameComplete(nextSession) ? 'result' : state.screen,
      };
    }

    default:
      return state;
  }
}
