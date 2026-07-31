import { useCallback, useEffect, useRef, useState } from 'react';
import { SoundToggle } from '../components/common/SoundToggle';
import { CorrectEffect } from '../components/game/CorrectEffect';
import { FeedbackOverlay } from '../components/game/FeedbackOverlay';
import { IncorrectEffect } from '../components/game/IncorrectEffect';
import { QuestionBoard } from '../components/game/QuestionBoard';
import { SlashEffect } from '../components/game/SlashEffect';
import { SwordIcon } from '../components/game/SwordIcon';
import { YokaiChoice, type YokaiVisualState } from '../components/game/YokaiChoice';
import { currentQuestion, type GameSession } from '../domain/game';
import { QUESTIONS_PER_PLAY, type Side } from '../domain/question';
import { useReducedMotion } from '../hooks/useReducedMotion';
import styles from './GameScreen.module.css';

interface GameScreenProps {
  session: GameSession;
  onAnswer: (side: Side) => void;
  onAdvance: () => void;
}

const TAUNTS = ['あははっ！ ちがうぞ〜！', 'こっちじゃないぞ！', 'ざんねーん！'];
const DEFEAT_LINES = ['やられたぁ', 'ぐへぇ', 'むねん...'];
const CORRECT_ADVANCE_DELAY_MS = 1200;
const INCORRECT_ADVANCE_DELAY_MS = 1300;
const REDUCED_MOTION_DELAY_MS = 500;

export function GameScreen({ session, onAnswer, onAdvance }: GameScreenProps) {
  const [selectedSide, setSelectedSide] = useState<Side | null>(null);
  const [slashKey, setSlashKey] = useState(0);
  const [tauntText, setTauntText] = useState(TAUNTS[0]);
  const [defeatText, setDefeatText] = useState(DEFEAT_LINES[0]);
  const tauntIndexRef = useRef(0);
  const defeatIndexRef = useRef(0);
  const reducedMotion = useReducedMotion();

  const prepared = currentQuestion(session);
  const { question, distractor, correctSide } = prepared;
  const leftReading = correctSide === 'left' ? question.reading : distractor;
  const rightReading = correctSide === 'right' ? question.reading : distractor;

  const handleSelect = useCallback(
    (side: Side) => {
      if (session.answerState !== 'idle') return;
      setSelectedSide(side);
      setSlashKey((key) => key + 1);
      tauntIndexRef.current = (tauntIndexRef.current + 1) % TAUNTS.length;
      setTauntText(TAUNTS[tauntIndexRef.current]);
      defeatIndexRef.current = (defeatIndexRef.current + 1) % DEFEAT_LINES.length;
      setDefeatText(DEFEAT_LINES[defeatIndexRef.current]);
      onAnswer(side);
    },
    [session.answerState, onAnswer],
  );

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (session.answerState !== 'idle') return;
      if (event.key === 'ArrowLeft' || event.key === '1') {
        handleSelect('left');
      } else if (event.key === 'ArrowRight' || event.key === '2') {
        handleSelect('right');
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [session.answerState, handleSelect]);

  useEffect(() => {
    if (session.answerState === 'correct' || session.answerState === 'incorrect') {
      const baseDelay =
        session.answerState === 'correct' ? CORRECT_ADVANCE_DELAY_MS : INCORRECT_ADVANCE_DELAY_MS;
      const delay = reducedMotion ? REDUCED_MOTION_DELAY_MS : baseDelay;
      const timer = setTimeout(() => {
        setSelectedSide(null);
        onAdvance();
      }, delay);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [session.answerState, onAdvance, reducedMotion]);

  function visualStateFor(side: Side): YokaiVisualState {
    if (session.answerState === 'correct' && selectedSide) {
      return side === selectedSide ? 'vanishing' : 'startled';
    }
    if (session.answerState === 'incorrect' && selectedSide) {
      return side === selectedSide ? 'taunting' : 'idle';
    }
    return 'idle';
  }

  function speechTextFor(side: Side): string | undefined {
    if (side !== selectedSide) return undefined;
    if (session.answerState === 'correct') return defeatText;
    if (session.answerState === 'incorrect') return tauntText;
    return undefined;
  }

  const answering = session.answerState !== 'idle';
  const slashVariant =
    session.answerState === 'correct' ? 'hit' : session.answerState === 'incorrect' ? 'miss' : null;

  return (
    <div className={styles.screen}>
      <div className={styles.header}>
        <p className={styles.miniLogo}>かんじスラッシュ</p>
        <div className={styles.statusRow}>
          <span className={styles.progress} aria-live="polite">
            {session.currentIndex + 1} / {QUESTIONS_PER_PLAY}
          </span>
          <span className={styles.combo}>れんぞく {session.combo}</span>
        </div>
      </div>

      <div className={styles.boardStage}>
        <QuestionBoard word={question.word} example={question.example} />
        {session.answerState === 'correct' && (
          <FeedbackOverlay>
            <CorrectEffect reading={question.reading} combo={session.combo} />
          </FeedbackOverlay>
        )}
        {session.answerState === 'incorrect' && (
          <FeedbackOverlay>
            <IncorrectEffect reading={question.reading} />
          </FeedbackOverlay>
        )}
      </div>

      <div className={styles.choiceStage}>
        <SlashEffect side={selectedSide} variant={slashVariant} slashKey={slashKey} />
        <YokaiChoice
          reading={leftReading}
          side="left"
          visualState={visualStateFor('left')}
          wasWrongChoice={session.answerState === 'incorrect' && selectedSide === 'left'}
          speechText={speechTextFor('left')}
          onSelect={() => handleSelect('left')}
          disabled={answering}
        />
        <YokaiChoice
          reading={rightReading}
          side="right"
          visualState={visualStateFor('right')}
          wasWrongChoice={session.answerState === 'incorrect' && selectedSide === 'right'}
          speechText={speechTextFor('right')}
          onSelect={() => handleSelect('right')}
          disabled={answering}
        />
      </div>

      <div className={styles.swordRest} aria-hidden="true">
        <SwordIcon className={styles.restIcon} />
      </div>

      <div className={styles.footer}>
        <SoundToggle />
      </div>
    </div>
  );
}
