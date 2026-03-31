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
          color: 'rgba(26,16,5,0.5)',
          textAlign: 'center',
          marginBottom: '14px',
        }}
      >
        Sponsored By
      </div>
      {/* 3 cellules égales — séparateurs équidistants des logos */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0 12px' }}>
          <SemilacLogo height={25} />
        </div>
        <div style={{ width: '1px', height: '32px', flexShrink: 0, background: 'rgba(232,0,125,0.15)' }} />
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0 12px' }}>
          <FootlogixLogo height={44} />
        </div>
        <div style={{ width: '1px', height: '32px', flexShrink: 0, background: 'rgba(232,0,125,0.15)' }} />
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0 12px' }}>
          <SemilacAcademieLogo height={38} />
        </div>
      </div>
    </div>
  );
}
