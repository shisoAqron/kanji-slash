interface SwordIconProps {
  className?: string;
}

/** 和風の刀のオリジナルSVGイラスト。抜き身の刀身・鍔・柄巻を描く。 */
export function SwordIcon({ className }: SwordIconProps) {
  return (
    <svg viewBox="0 0 100 220" className={className} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="sword-blade-gradient" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#c9d8e6" />
          <stop offset="45%" stopColor="#f4fbff" />
          <stop offset="55%" stopColor="#eef7ff" />
          <stop offset="100%" stopColor="#9fb6c8" />
        </linearGradient>
        <linearGradient id="sword-tsuka-gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3c2a1e" />
          <stop offset="100%" stopColor="#1c120c" />
        </linearGradient>
      </defs>

      {/* 切っ先・刀身 */}
      <path
        d="M50 6 L58 20 L55.5 118 L44.5 118 L42 20 Z"
        fill="url(#sword-blade-gradient)"
        stroke="#5a6b78"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* 鎬筋（ハイライト） */}
      <path d="M50 14 L49.2 116" stroke="#ffffff" strokeWidth="1.4" opacity="0.85" />
      {/* 刃文 */}
      <path
        d="M45.5 108 Q49 96 46 84 Q49.5 72 46.3 60 Q49.5 48 46.6 36 Q49.5 26 47.5 18"
        fill="none"
        stroke="#bfe3ff"
        strokeWidth="1.3"
        opacity="0.75"
      />

      {/* 鍔（つば） */}
      <ellipse cx="50" cy="124" rx="21" ry="7" fill="#caa042" stroke="#7a5a1f" strokeWidth="2" />
      <ellipse cx="50" cy="124" rx="12" ry="3.6" fill="#a97f2c" opacity="0.8" />

      {/* 柄（つか） */}
      <rect x="41" y="128" width="18" height="66" rx="5" fill="url(#sword-tsuka-gradient)" stroke="#0d0805" strokeWidth="1.5" />
      {/* 柄巻（つかまき）の菱形模様 */}
      <g stroke="#caa042" strokeWidth="2" opacity="0.9">
        <path d="M41 136 L59 146" />
        <path d="M59 136 L41 146" />
        <path d="M41 150 L59 160" />
        <path d="M59 150 L41 160" />
        <path d="M41 164 L59 174" />
        <path d="M59 164 L41 174" />
        <path d="M41 178 L59 188" />
        <path d="M59 178 L41 188" />
      </g>

      {/* 柄頭（かしら） */}
      <rect x="40" y="192" width="20" height="12" rx="4" fill="#caa042" stroke="#7a5a1f" strokeWidth="2" />
    </svg>
  );
}
