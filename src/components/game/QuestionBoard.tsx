import styles from './QuestionBoard.module.css';

interface QuestionBoardProps {
  word: string;
  example: string;
}

export function QuestionBoard({ word, example }: QuestionBoardProps) {
  return (
    <div className={styles.board}>
      <p className={styles.word}>{word}</p>
      <hr className={styles.divider} />
      <p className={styles.example}>{example}</p>
    </div>
  );
}
