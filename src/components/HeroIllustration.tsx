import { cn } from "@/lib/utils";

type HeroIllustrationProps = {
  className?: string;
};

const HeroIllustration = ({ className }: HeroIllustrationProps) => {
  return (
    <svg
      viewBox="0 0 560 320"
      role="img"
      aria-hidden
      className={cn("w-full max-w-2xl text-primary-foreground", className)}
    >
      <defs>
        <linearGradient id="heroGradient" x1="0%" x2="100%" y1="0%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.95" />
          <stop offset="50%" stopColor="hsl(var(--secondary))" stopOpacity="0.85" />
          <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0.95" />
        </linearGradient>
      </defs>

      <rect
        x="16"
        y="24"
        width="528"
        height="272"
        rx="28"
        fill="url(#heroGradient)"
        opacity="0.18"
      />

      <g className="motion-safe:animate-float">
        <path
          d="M112 208c0-40 28-72 66-72h122c14 0 27 6.4 36 17.4l28 34.6c7.6 9.2 11.7 21 11.7 33v12c0 10.5-8.5 19-19 19H131c-10.5 0-19-8.5-19-19Z"
          fill="currentColor"
          opacity="0.16"
        />
        <path
          d="M150 196c4.2-24 23.5-42 48-42h108c12.3 0 23.9 5.6 31.5 15.1l15.5 19.5c5 6.2 7.8 13.9 7.8 21.9v6.5c0 8.8-7.2 16-16 16H160c-9.8 0-17.2-8.7-16-17.5Z"
          fill="currentColor"
          opacity="0.22"
        />
        <path
          d="M182 188c5.8-15 19.8-25 36-25h94c9.6 0 18.8 4.4 24.7 12l11.4 15c4 5.2 6.1 11.6 6.1 18.1v4.8c0 6.9-5.6 12.5-12.5 12.5H192c-10.2 0-17.4-10-14-19.4Z"
          fill="currentColor"
          opacity="0.28"
        />
      </g>

      <g opacity="0.85">
        <rect x="84" y="80" width="128" height="80" rx="14" fill="hsl(var(--card))" />
        <rect x="108" y="104" width="38" height="10" rx="5" fill="hsl(var(--primary))" opacity="0.7" />
        <rect x="108" y="124" width="68" height="10" rx="5" fill="hsl(var(--foreground))" opacity="0.45" />
        <rect x="108" y="144" width="52" height="10" rx="5" fill="hsl(var(--foreground))" opacity="0.25" />
      </g>

      <g opacity="0.92">
        <rect x="230" y="96" width="128" height="96" rx="18" fill="hsl(var(--card))" />
        <polyline
          points="252,168 274,138 301,154 328,120 356,150"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="274" cy="138" r="6" fill="hsl(var(--primary))" />
        <circle cx="301" cy="154" r="6" fill="hsl(var(--primary))" />
        <circle cx="328" cy="120" r="6" fill="hsl(var(--primary))" />
      </g>

      <g opacity="0.85">
        <rect x="388" y="72" width="92" height="120" rx="18" fill="hsl(var(--card))" />
        <rect x="404" y="104" width="28" height="56" rx="12" fill="hsl(var(--primary))" opacity="0.65" />
        <rect x="440" y="88" width="28" height="72" rx="12" fill="hsl(var(--secondary))" opacity="0.7" />
        <rect x="420" y="168" width="48" height="8" rx="4" fill="hsl(var(--foreground))" opacity="0.4" />
      </g>
    </svg>
  );
};

export default HeroIllustration;
