import { useId } from 'react';

/** Inline single-colour icons; they inherit `currentColor` and are always decorative. */
type IconProps = { className?: string };

function svgProps(className?: string) {
  return {
    className,
    viewBox: '0 0 24 24',
    width: 20,
    height: 20,
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
    focusable: 'false' as const,
  };
}

export function SearchIcon({ className }: IconProps) {
  return (
    <svg {...svgProps(className)}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16 16l4.5 4.5" />
    </svg>
  );
}

export function UserIcon({ className }: IconProps) {
  return (
    <svg {...svgProps(className)}>
      <circle cx="12" cy="8" r="3.6" />
      <path d="M4.5 20c1.4-3.6 4-5.4 7.5-5.4s6.1 1.8 7.5 5.4" />
    </svg>
  );
}

export function BagIcon({ className }: IconProps) {
  return (
    <svg {...svgProps(className)}>
      <path d="M5 7.5h14L18 20H6L5 7.5z" />
      <path d="M9 7.5V6a3 3 0 0 1 6 0v1.5" />
    </svg>
  );
}

export function ChevronLeftIcon({ className }: IconProps) {
  return (
    <svg {...svgProps(className)}>
      <path d="M14.5 5.5L8 12l6.5 6.5" />
    </svg>
  );
}

export function ChevronRightIcon({ className }: IconProps) {
  return (
    <svg {...svgProps(className)}>
      <path d="M9.5 5.5L16 12l-6.5 6.5" />
    </svg>
  );
}

export function ChevronDownIcon({ className }: IconProps) {
  return (
    <svg {...svgProps(className)} width={14} height={14} strokeWidth={2}>
      <path d="M5.5 9.5L12 16l6.5-6.5" />
    </svg>
  );
}

export function TruckIcon({ className }: IconProps) {
  return (
    <svg {...svgProps(className)} width={26} height={26}>
      <path d="M2.5 6.5h10v9h-10z" />
      <path d="M12.5 9.5h4l3 3v3h-7z" />
      <circle cx="6.5" cy="18" r="1.8" />
      <circle cx="16.5" cy="18" r="1.8" />
    </svg>
  );
}

export function ReturnIcon({ className }: IconProps) {
  return (
    <svg {...svgProps(className)} width={26} height={26}>
      <path d="M4 10a8 8 0 0 1 13.7-4.3L20 8" />
      <path d="M20 4v4.5h-4.5" />
      <path d="M20 14a8 8 0 0 1-13.7 4.3L4 16" />
      <path d="M4 20v-4.5h4.5" />
    </svg>
  );
}

export function ChatIcon({ className }: IconProps) {
  return (
    <svg {...svgProps(className)} width={26} height={26}>
      <path d="M4 5.5h16v10H10l-4.5 3.5v-3.5H4z" />
      <path d="M8.5 10.5h7" />
    </svg>
  );
}

export function ShieldIcon({ className }: IconProps) {
  return (
    <svg {...svgProps(className)} width={26} height={26}>
      <path d="M12 3.5l7 2.5v5.5c0 4-3 7.2-7 9-4-1.8-7-5-7-9V6z" />
      <path d="M9 12l2.2 2.2L15.5 10" />
    </svg>
  );
}

export function StarIcon({
  className,
  fill = 'full',
}: IconProps & { fill?: 'full' | 'half' | 'empty' }) {
  const path =
    'M12 3.6l2.6 5.3 5.9.85-4.25 4.15 1 5.85L12 16.9l-5.25 2.75 1-5.85L3.5 9.75l5.9-.85z';
  const id = useId();
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width={14}
      height={14}
      aria-hidden
      focusable="false"
    >
      {fill === 'half' && (
        <defs>
          <linearGradient id={id}>
            <stop offset="50%" stopColor="currentColor" />
            <stop offset="50%" stopColor="transparent" />
          </linearGradient>
        </defs>
      )}
      <path
        d={path}
        fill={
          fill === 'full'
            ? 'currentColor'
            : fill === 'half'
              ? `url(#${id})`
              : 'transparent'
        }
        stroke="currentColor"
        strokeWidth={1.4}
      />
    </svg>
  );
}
