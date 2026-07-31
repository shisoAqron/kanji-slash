export type YokaiFace = 'normal' | 'defeated' | 'laughing' | 'startled';

interface YokaiFigureProps {
  face: YokaiFace;
  className?: string;
}

/**
 * 手描きの簡易SVGで表現した丸みのある妖怪。
 * 参照画像を模写するのではなく、配色と輪郭のみを抽出したオリジナル造形。
 */
export function YokaiFigure({ face, className }: YokaiFigureProps) {
  return (
    <svg
      viewBox="0 0 120 130"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <ellipse cx="60" cy="118" rx="26" ry="8" fill="#000" opacity="0.18" />

      <path
        d="M60 8c-9 0-15 8-15 8s-9 2-9 12c0 5 3 8 3 8s-16 8-16 32c0 26 17 44 37 44s37-18 37-44c0-24-16-32-16-32s3-3 3-8c0-10-9-12-9-12s-6-8-15-8z"
        fill="var(--color-yokai-body)"
        stroke="var(--color-yokai-outline)"
        strokeWidth="3"
      />

      <path
        d="M39 28c-6-10-4-20 3-24 4 6 4 14 1 20z"
        fill="var(--color-yokai-horn)"
        stroke="var(--color-yokai-outline)"
        strokeWidth="2.5"
      />
      <path
        d="M81 28c6-10 4-20-3-24-4 6-4 14-1 20z"
        fill="var(--color-yokai-horn)"
        stroke="var(--color-yokai-outline)"
        strokeWidth="2.5"
      />

      <ellipse cx="36" cy="78" rx="7" ry="9" fill="var(--color-yokai-cheek)" opacity="0.7" />
      <ellipse cx="84" cy="78" rx="7" ry="9" fill="var(--color-yokai-cheek)" opacity="0.7" />

      {face === 'normal' && (
        <>
          <circle cx="45" cy="66" r="6" fill="var(--color-yokai-outline)" />
          <circle cx="75" cy="66" r="6" fill="var(--color-yokai-outline)" />
          <path d="M48 88q12 10 24 0" stroke="var(--color-yokai-outline)" strokeWidth="3" fill="none" strokeLinecap="round" />
        </>
      )}

      {face === 'defeated' && (
        <>
          <path d="M39 60l12 12M51 60l-12 12" stroke="var(--color-yokai-outline)" strokeWidth="3" strokeLinecap="round" />
          <path d="M69 60l12 12M81 60l-12 12" stroke="var(--color-yokai-outline)" strokeWidth="3" strokeLinecap="round" />
          <ellipse cx="60" cy="90" rx="9" ry="6" fill="var(--color-yokai-outline)" />
        </>
      )}

      {face === 'laughing' && (
        <>
          <path d="M39 68q6-6 12 0" stroke="var(--color-yokai-outline)" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M69 68q6-6 12 0" stroke="var(--color-yokai-outline)" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M44 84q16 16 32 0q-4 14-16 14q-12 0-16-14z" fill="var(--color-yokai-outline)" />
          <path d="M50 90q10 8 20 0" stroke="#ff6b81" strokeWidth="4" fill="none" strokeLinecap="round" />
        </>
      )}

      {face === 'startled' && (
        <>
          <circle cx="45" cy="66" r="7" fill="#fff" stroke="var(--color-yokai-outline)" strokeWidth="2.5" />
          <circle cx="75" cy="66" r="7" fill="#fff" stroke="var(--color-yokai-outline)" strokeWidth="2.5" />
          <circle cx="45" cy="66" r="3" fill="var(--color-yokai-outline)" />
          <circle cx="75" cy="66" r="3" fill="var(--color-yokai-outline)" />
          <ellipse cx="60" cy="90" rx="6" ry="8" fill="var(--color-yokai-outline)" />
        </>
      )}
    </svg>
  );
}
