interface SemilacDaysLogoProps {
  semilacSize?: number;
  daysSize?: number;
  semilacColor?: string;
  daysColor?: string;
}

export function SemilacDaysLogo({
  semilacSize = 52,
  daysSize = 44,
  semilacColor = '#FFFFFF',
  daysColor = '#E8007D',
}: SemilacDaysLogoProps) {
  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: 1 }}>
      <div
        style={{
          fontFamily: "'Montserrat', sans-serif",
          fontSize: `${semilacSize}px`,
          fontWeight: 900,
          letterSpacing: '0.08em',
          color: semilacColor,
          lineHeight: 1,
        }}
      >
        SEMILAC
      </div>
      <div
        style={{
          fontFamily: "'Great Vibes', cursive",
          fontSize: `${daysSize}px`,
          color: daysColor,
          lineHeight: 1,
          marginTop: '-4px',
          marginLeft: `${semilacSize * 0.6}px`,
        }}
      >
        Days
      </div>
    </div>
  );
}
