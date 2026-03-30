interface FootlogixLogoProps {
  height?: number;
}

export function FootlogixLogo({ height = 40 }: FootlogixLogoProps) {
  const fontSize = height * 0.38;
  const subSize = height * 0.16;
  const padding = height * 0.14;

  return (
    <div
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#2B3467',
        border: '2px solid rgba(255,255,255,0.25)',
        borderRadius: '3px',
        padding: `${padding}px ${padding * 2}px`,
        height: `${height}px`,
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          fontFamily: "'Montserrat', sans-serif",
          fontSize: `${fontSize}px`,
          fontWeight: 400,
          color: '#FFFFFF',
          letterSpacing: '0.02em',
          lineHeight: 1,
        }}
      >
        footlogix
      </div>
      <div
        style={{
          fontFamily: "'Montserrat', sans-serif",
          fontSize: `${subSize}px`,
          fontWeight: 600,
          color: '#FFFFFF',
          letterSpacing: '0.22em',
          lineHeight: 1,
          marginTop: '3px',
          textTransform: 'uppercase',
        }}
      >
        PEDICEUTICALS
      </div>
    </div>
  );
}
