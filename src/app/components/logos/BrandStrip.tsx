import { SemilacLogo } from './SemilacLogo';
import { FootlogixLogo } from './FootlogixLogo';
import { SemilacAcademieLogo } from './SemilacAcademieLogo';

export function BrandStrip() {
  return (
    <div
      style={{
        width: '100%',
        borderTop: '1px solid rgba(248,164,200,0.12)',
        paddingTop: '16px',
        paddingBottom: '8px',
      }}
    >
      <div
        style={{
          fontSize: '7px',
          fontWeight: 700,
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: 'rgba(255,248,245,0.3)',
          textAlign: 'center',
          marginBottom: '12px',
        }}
      >
        Nos marques
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '20px',
        }}
      >
        <SemilacLogo size={16} />
        <div style={{ width: '1px', height: '28px', background: 'rgba(248,164,200,0.2)' }} />
        <FootlogixLogo height={34} />
        <div style={{ width: '1px', height: '28px', background: 'rgba(248,164,200,0.2)' }} />
        <SemilacAcademieLogo size={14} />
      </div>
    </div>
  );
}
