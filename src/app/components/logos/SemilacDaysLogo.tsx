interface SemilacDaysLogoProps {
  height?: number;
  className?: string;
}

export function SemilacDaysLogo({ height = 80, className }: SemilacDaysLogoProps) {
  return (
    <img
      src="/logos/semilac-days.svg"
      alt="Semilac Days"
      height={height}
      style={{ display: 'block' }}
      className={className}
    />
  );
}
