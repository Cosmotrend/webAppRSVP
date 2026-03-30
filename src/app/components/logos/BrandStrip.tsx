import { SemilacLogo } from './SemilacLogo';
import { FootlogixLogo } from './FootlogixLogo';
import { SemilacAcademieLogo } from './SemilacAcademieLogo';

export function BrandStrip() {
  return (
    <div
      style={{
        width: '100%',
        borderTop: '1px solid rgba(232,0,125,0.12)',
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
          color: 'rgba(26,16,5,0.3)',
          textAlign: 'center',
          marginBottom: '14px',
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
        <SemilacLogo height={20} />
        <div style={{ width: '1px', height: '28px', background: 'rgba(232,0,125,0.15)' }} />
        <FootlogixLogo height={30} />
        <div style={{ width: '1px', height: '28px', background: 'rgba(232,0,125,0.15)' }} />
        <SemilacAcademieLogo height={30} />
      </div>
    </div>
  );
}
