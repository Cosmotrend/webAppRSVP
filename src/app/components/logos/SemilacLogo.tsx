interface SemilacLogoProps {
  height?: number;
  className?: string;
}

export function SemilacLogo({ height = 28, className }: SemilacLogoProps) {
  return (
    <img
      src="/logos/semilac.svg"
      alt="Semilac"
      style={{ display: 'block', height: `${height}px`, width: 'auto' }}
      className={className}
    />
  );
}
