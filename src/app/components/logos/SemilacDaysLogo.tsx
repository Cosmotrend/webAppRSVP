interface SemilacDaysLogoProps {
  height?: number;
  className?: string;
}

export function SemilacDaysLogo({ height = 80, className }: SemilacDaysLogoProps) {
  return (
    <img
      src="/logos/semilac-days.svg"
      alt="Semilac Days"
      style={{ display: 'block', height: `${height}px`, width: 'auto' }}
      className={className}
    />
  );
}
