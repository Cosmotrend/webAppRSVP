interface FootlogixLogoProps {
  height?: number;
  className?: string;
}

export function FootlogixLogo({ height = 40, className }: FootlogixLogoProps) {
  return (
    <img
      src="/logos/footlogix.svg"
      alt="Footlogix Pediceuticals"
      style={{ display: 'block', height: `${height}px`, width: 'auto' }}
      className={className}
    />
  );
}
