import { SemilacLogo } from './SemilacLogo';
import { FootlogixLogo } from './FootlogixLogo';
import { SemilacAcademieLogo } from './SemilacAcademieLogo';
import { useLang, t } from '../../i18n';

export function BrandStrip() {
  const { lang } = useLang();
  // En mode kiosque (tablette → TV), tout doit être 2× plus grand pour rester
  // lisible depuis 2-3 mètres de distance devant l'écran.
  const isKiosk =
    typeof document !== 'undefined' && document.documentElement.classList.contains('kiosk-mode');

  const labelFontSize = isKiosk ? '16px' : '7px';
  const labelMarginBottom = isKiosk ? '28px' : '14px';
  const labelLetterSpacing = isKiosk ? '0.25em' : '0.3em';
  const paddingTop = isKiosk ? '32px' : '16px';
  const paddingBottom = isKiosk ? '16px' : '8px';
  const cellPadding = isKiosk ? '0 24px' : '0 12px';
  const dividerHeight = isKiosk ? '64px' : '32px';
  const logoH1 = isKiosk ? 52 : 25;
  const logoH2 = isKiosk ? 88 : 44;
  const logoH3 = isKiosk ? 76 : 38;

  return (
    <div
      style={{
        width: '100%',
        borderTop: '1px solid rgba(232,0,125,0.12)',
        paddingTop,
        paddingBottom,
      }}
    >
      <div
        style={{
          fontSize: labelFontSize,
          fontWeight: 700,
          letterSpacing: labelLetterSpacing,
          textTransform: 'uppercase',
          color: 'rgba(26,16,5,0.5)',
          textAlign: 'center',
          marginBottom: labelMarginBottom,
        }}
      >
        {t('shared', 'sponsoredBy', lang)}
      </div>
      {/* 3 cellules égales — séparateurs équidistants des logos */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: cellPadding }}>
          <SemilacLogo height={logoH1} />
        </div>
        <div style={{ width: '1px', height: dividerHeight, flexShrink: 0, background: 'rgba(232,0,125,0.15)' }} />
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: cellPadding }}>
          <FootlogixLogo height={logoH2} />
        </div>
        <div style={{ width: '1px', height: dividerHeight, flexShrink: 0, background: 'rgba(232,0,125,0.15)' }} />
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: cellPadding }}>
          <SemilacAcademieLogo height={logoH3} />
        </div>
      </div>
    </div>
  );
}
