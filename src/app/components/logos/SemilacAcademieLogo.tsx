interface SemilacAcademieLogoProps {
  size?: number;
  color?: string;
}

export function SemilacAcademieLogo({ size = 22, color = '#FFFFFF' }: SemilacAcademieLogoProps) {
  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1 }}>
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
      <div
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: `${size * 0.65}px`,
          fontWeight: 300,
          letterSpacing: '0.18em',
          color: `rgba(255,255,255,0.55)`,
          lineHeight: 1,
          marginTop: '4px',
        }}
      >
        Académie
      </div>
    </div>
  );
}
