interface SemilacLogoProps {
  height?: number;
  className?: string;
}

export function SemilacLogo({ height = 28, className }: SemilacLogoProps) {
  return (
    <img
      src="/logos/semilac.svg"
      alt="Semilac"
      height={height}
      style={{ display: 'block' }}
      className={className}
    />
  );
}
