interface SemilacLogoProps {
  size?: number;
  color?: string;
}

export function SemilacLogo({ size = 28, color = '#FFFFFF' }: SemilacLogoProps) {
  return (
    <div
      style={{
        fontFamily: "'Montserrat', sans-serif",
        fontSize: `${size}px`,
        fontWeight: 900,
        letterSpacing: '0.1em',
        color,
        lineHeight: 1,
      }}
    >
      SEMILAC
    </div>
  );
}
