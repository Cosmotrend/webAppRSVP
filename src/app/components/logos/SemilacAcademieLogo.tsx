interface SemilacAcademieLogoProps {
  height?: number;
  className?: string;
}

export function SemilacAcademieLogo({ height = 36, className }: SemilacAcademieLogoProps) {
  return (
    <img
      src="/logos/semilac-academie.svg"
      alt="Semilac Académie"
      style={{ display: 'block', height: `${height}px`, width: 'auto' }}
      className={className}
    />
  );
}
