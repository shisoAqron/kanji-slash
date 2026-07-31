import type { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './GameButton.module.css';

type Variant = 'primary' | 'secondary' | 'ghost';

interface GameButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: Variant;
}

export function GameButton({ children, variant = 'primary', className, ...rest }: GameButtonProps) {
  const variantClass = styles[variant];
  const classes = [styles.button, variantClass, className].filter(Boolean).join(' ');

  return (
    <button type="button" className={classes} {...rest}>
      {children}
    </button>
  );
}
