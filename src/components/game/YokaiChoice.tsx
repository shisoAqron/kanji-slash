import styles from './YokaiChoice.module.css';
import { YokaiFigure, type YokaiFace } from './YokaiFigure';

export type YokaiVisualState = 'idle' | 'vanishing' | 'taunting' | 'startled';

interface YokaiChoiceProps {
  reading: string;
  side: 'left' | 'right';
  visualState: YokaiVisualState;
  wasWrongChoice: boolean;
  speechText?: string;
  onSelect: () => void;
  disabled: boolean;
}

const FACE_BY_STATE: Record<YokaiVisualState, YokaiFace> = {
  idle: 'normal',
  vanishing: 'defeated',
  taunting: 'laughing',
  startled: 'startled',
};

const FIGURE_CLASS_BY_STATE: Record<YokaiVisualState, string> = {
  idle: '',
  vanishing: styles.vanishing,
  taunting: styles.taunting,
  startled: styles.startled,
};

export function YokaiChoice({
  reading,
  side,
  visualState,
  wasWrongChoice,
  speechText,
  onSelect,
  disabled,
}: YokaiChoiceProps) {
  const figureClass = [styles.figure, FIGURE_CLASS_BY_STATE[visualState]].filter(Boolean).join(' ');
  const signClass = [styles.sign, wasWrongChoice ? styles.wrong : ''].filter(Boolean).join(' ');
  const showSpeechBubble = (visualState === 'taunting' || visualState === 'vanishing') && speechText;

  return (
    <button
      type="button"
      className={styles.wrapper}
      onClick={onSelect}
      disabled={disabled}
      data-side={side}
      aria-label={`よみかた ${reading} の妖怪をきる`}
    >
      <div className={styles.figureBox}>
        {showSpeechBubble ? (
          <div className={styles.speechBubble} role="status">
            {speechText}
          </div>
        ) : null}
        {visualState === 'vanishing' ? <span className={styles.smoke} aria-hidden="true" /> : null}
        <YokaiFigure face={FACE_BY_STATE[visualState]} className={figureClass} />
      </div>
      <span className={styles.signSlot}>
        <span className={signClass}>{reading}</span>
        {wasWrongChoice ? <span className={styles.chosenLabel}>きみが えらんだ</span> : null}
      </span>
    </button>
  );
}
