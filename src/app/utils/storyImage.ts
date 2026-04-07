// Premium share-image generator for Instagram Story / WhatsApp Status / Feed
// Pure canvas — no external deps, no CORS pitfalls.
// Two formats: 'story' (1080×1920, 9:16) and 'square' (1080×1080, 1:1).
// IMPORTANT (privacy): the coupon code is NEVER drawn on the image.

export type ShareFormat = 'story' | 'square';

export interface ShareImageParams {
  prize: string;       // e.g. "-35%"
  fullName: string;    // e.g. "Sarah Benali"
  lang: 'fr' | 'ar';
  format: ShareFormat;
}

const HASHTAG = '#SemilacDays2026';

// Pre-load web fonts so canvas can render them
async function ensureFontsLoaded() {
  if (typeof document === 'undefined' || !('fonts' in document)) return;
  try {
    await Promise.all([
      document.fonts.load('italic 300 200px "Cormorant Garamond"'),
      document.fonts.load('300 280px "Cormorant Garamond"'),
      document.fonts.load('700 40px "Montserrat"'),
      document.fonts.load('600 34px "Montserrat"'),
    ]);
  } catch {
    /* fallback handled by font stack */
  }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

async function tryLoadImage(src: string): Promise<HTMLImageElement | null> {
  try { return await loadImage(src); } catch { return null; }
}

function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// Draw a row of sponsor logos centered on a given y-center, each max logoH tall
function drawSponsors(
  ctx: CanvasRenderingContext2D,
  logos: (HTMLImageElement | null)[],
  W: number,
  yCenterZone: number,
  zoneH: number,
  labelText: string,
  isAr: boolean,
) {
  // Label
  ctx.font = isAr
    ? '600 18px "Tahoma", "Arial", sans-serif'
    : '600 18px "Montserrat", Arial, sans-serif';
  ctx.fillStyle = 'rgba(26,16,5,0.35)';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(labelText, W / 2, yCenterZone - zoneH / 2 + 22);

  const validLogos = logos.filter(Boolean) as HTMLImageElement[];
  if (validLogos.length === 0) return;

  const logoMaxH = zoneH - 30; // leave room for label
  const gapX = 60;
  const logoAreaY = yCenterZone - zoneH / 2 + 30; // below label

  // Compute widths scaled to logoMaxH
  const widths = validLogos.map(img => {
    const ratio = img.width / img.height;
    return Math.min(logoMaxH * ratio, 260); // cap width
  });
  const totalW = widths.reduce((s, w) => s + w, 0) + gapX * (validLogos.length - 1);
  let x = (W - totalW) / 2;

  validLogos.forEach((img, i) => {
    const drawW = widths[i];
    const drawH = drawW / (img.width / img.height);
    const drawY = logoAreaY + (logoMaxH - drawH) / 2;
    ctx.drawImage(img, x, drawY, drawW, drawH);
    x += drawW + gapX;
  });
}

export async function generateShareImage(params: ShareImageParams): Promise<Blob> {
  const { prize, fullName, lang, format } = params;

  // Split name into first / last
  const nameParts = fullName.trim().split(/\s+/);
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ');

  await ensureFontsLoaded();

  const W = 1080;
  const H = format === 'story' ? 1920 : 1080;

  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  // ─── Background gradient ────────────────────────────────────────────────────
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#FAF7F2');
  bg.addColorStop(0.5, '#FFF0F5');
  bg.addColorStop(1, '#FAF7F2');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // ─── Aurora blobs ───────────────────────────────────────────────────────────
  const blob = (cx: number, cy: number, r: number, color: string) => {
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    grad.addColorStop(0, color);
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
  };
  if (format === 'story') {
    blob(160, 280, 460, 'rgba(232,0,125,0.18)');
    blob(W - 120, 760, 520, 'rgba(196,144,74,0.14)');
    blob(W / 2, H - 400, 600, 'rgba(255,77,166,0.12)');
  } else {
    blob(120, 160, 380, 'rgba(232,0,125,0.18)');
    blob(W - 80, 520, 440, 'rgba(196,144,74,0.14)');
    blob(W / 2, 900, 480, 'rgba(255,77,166,0.10)');
  }

  // ─── Load all images in parallel ────────────────────────────────────────────
  const [logo, logoSemilac, logoFootlogix, logoAcademie] = await Promise.all([
    tryLoadImage('/logos/semilac-days.svg'),
    tryLoadImage('/logos/semilac.svg'),
    tryLoadImage('/logos/footlogix.svg'),
    tryLoadImage('/logos/semilac-academie.svg'),
  ]);

  const sponsorLogos = [logoSemilac, logoFootlogix, logoAcademie];

  const isAr = lang === 'ar';
  const headlineFont = isAr
    ? 'bold 100px "Tahoma", "Arial", sans-serif'
    : 'italic 300 160px "Cormorant Garamond", Georgia, serif';
  const nameFont = isAr
    ? 'bold 88px "Tahoma", "Arial", sans-serif'
    : 'italic 300 140px "Cormorant Garamond", Georgia, serif';
  const lastNameFont = isAr
    ? '600 32px "Tahoma", "Arial", sans-serif'
    : '600 32px "Montserrat", Arial, sans-serif';
  const subFont = isAr
    ? '600 36px "Tahoma", "Arial", sans-serif'
    : '600 36px "Montserrat", Arial, sans-serif';
  const labelFont = isAr
    ? 'bold 28px "Tahoma", "Arial", sans-serif'
    : 'bold 28px "Montserrat", Arial, sans-serif';
  const eventFont = isAr
    ? '600 30px "Tahoma", "Arial", sans-serif'
    : '600 30px "Montserrat", Arial, sans-serif';

  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';

  if (format === 'story') {
    // ─── STORY layout (1080 × 1920) ─────────────────────────────────────────

    // Semilac Days logo
    const logoMaxW = 700;
    const logoY = 190;
    if (logo && logo.width > 0) {
      const ratio = logo.height / logo.width;
      const drawW = logoMaxW;
      const drawH = drawW * ratio;
      ctx.drawImage(logo, (W - drawW) / 2, logoY, drawW, drawH);
    } else {
      ctx.font = 'bold 64px "Cormorant Garamond", Georgia, serif';
      ctx.fillStyle = '#E8007D';
      ctx.fillText('SEMILAC DAYS', W / 2, logoY + 70);
    }

    // "Bravo"
    ctx.font = headlineFont;
    ctx.fillStyle = '#1A1005';
    ctx.fillText(isAr ? 'برافو' : 'Bravo', W / 2, 710);

    // First name (magenta)
    if (firstName) {
      ctx.font = nameFont;
      ctx.fillStyle = '#E8007D';
      ctx.fillText(firstName, W / 2, 855);
    }

    // Last name (dark, smaller)
    if (lastName) {
      ctx.font = lastNameFont;
      ctx.fillStyle = 'rgba(26,16,5,0.65)';
      ctx.fillText(lastName, W / 2, 910);
    }

    // "VOUS AVEZ GAGNÉ" label
    ctx.font = labelFont;
    ctx.fillStyle = 'rgba(232,0,125,0.7)';
    ctx.fillText(isAr ? 'ربحتي' : 'VOUS AVEZ GAGNÉ', W / 2, lastName ? 965 : 940);

    // Divider
    const divY = lastName ? 995 : 970;
    const divGrad = ctx.createLinearGradient(W / 2 - 200, 0, W / 2 + 200, 0);
    divGrad.addColorStop(0, 'rgba(232,0,125,0)');
    divGrad.addColorStop(0.5, 'rgba(232,0,125,0.5)');
    divGrad.addColorStop(1, 'rgba(232,0,125,0)');
    ctx.fillStyle = divGrad;
    ctx.fillRect(W / 2 - 200, divY, 400, 2);

    // Prize
    const prizeY = 1280;
    ctx.font = `300 310px "Cormorant Garamond", Georgia, serif`;
    const prizeMetrics = ctx.measureText(prize);
    const prizeGrad = ctx.createLinearGradient(
      W / 2 - prizeMetrics.width / 2, prizeY - 310,
      W / 2 + prizeMetrics.width / 2, prizeY,
    );
    prizeGrad.addColorStop(0, '#C4157A');
    prizeGrad.addColorStop(0.4, '#E8007D');
    prizeGrad.addColorStop(0.7, '#ff4da6');
    prizeGrad.addColorStop(1, '#C4904A');
    ctx.fillStyle = prizeGrad;
    ctx.shadowColor = 'rgba(232,0,125,0.35)';
    ctx.shadowBlur = 40;
    ctx.fillText(prize, W / 2, prizeY);
    ctx.shadowBlur = 0;

    // Subtitle
    ctx.font = subFont;
    ctx.fillStyle = 'rgba(26,16,5,0.65)';
    ctx.fillText(isAr ? 'تخفيض حصري على Semilac' : 'de réduction exclusive Semilac', W / 2, 1370);

    // Event info
    ctx.font = eventFont;
    ctx.fillStyle = '#C4904A';
    ctx.fillText(isAr ? '14-19 ماي 2026 · الدار البيضاء' : '14-19 Mai 2026  ·  Casablanca', W / 2, 1530);
    ctx.font = isAr
      ? '500 24px "Tahoma", "Arial", sans-serif'
      : '500 24px "Montserrat", Arial, sans-serif';
    ctx.fillStyle = 'rgba(196,144,74,0.75)';
    ctx.fillText(isAr ? 'الطبعة الثانية' : '2ème Édition', W / 2, 1580);

    // Hashtag pill
    const hashtagY = 1700;
    ctx.font = 'bold 30px "Montserrat", Arial, sans-serif';
    const hashMetrics = ctx.measureText(HASHTAG);
    const pillW = hashMetrics.width + 60;
    const pillH = 58;
    const pillX = (W - pillW) / 2;
    const pillY = hashtagY - 42;
    roundedRect(ctx, pillX, pillY, pillW, pillH, 29);
    ctx.fillStyle = 'rgba(232,0,125,0.10)';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(232,0,125,0.35)';
    ctx.stroke();
    ctx.fillStyle = '#E8007D';
    ctx.fillText(HASHTAG, W / 2, hashtagY);

    // Dots
    ctx.fillStyle = '#E8007D';
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.arc(W / 2 - 56 + i * 28, hashtagY + 46, 5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Sponsor bar (1790–1920)
    const sponsorSeparatorY = 1790;
    const sponsorDivGrad = ctx.createLinearGradient(0, 0, W, 0);
    sponsorDivGrad.addColorStop(0, 'rgba(232,0,125,0)');
    sponsorDivGrad.addColorStop(0.5, 'rgba(232,0,125,0.25)');
    sponsorDivGrad.addColorStop(1, 'rgba(232,0,125,0)');
    ctx.fillStyle = sponsorDivGrad;
    ctx.fillRect(60, sponsorSeparatorY, W - 120, 1);

    drawSponsors(ctx, sponsorLogos, W, 1855, 130, isAr ? 'برعاية' : 'SPONSORED BY', isAr);

  } else {
    // ─── SQUARE layout (1080 × 1080) ────────────────────────────────────────
    // Content zone: y=55 to y=880 (sponsor bar: 880–1080)

    // Semilac Days logo
    const logoMaxW = 500;
    const logoTopY = 55;
    if (logo && logo.width > 0) {
      const ratio = logo.height / logo.width;
      const drawW = logoMaxW;
      const drawH = drawW * ratio;
      ctx.drawImage(logo, (W - drawW) / 2, logoTopY, drawW, drawH);
    } else {
      ctx.font = 'bold 54px "Cormorant Garamond", Georgia, serif';
      ctx.fillStyle = '#E8007D';
      ctx.fillText('SEMILAC DAYS', W / 2, logoTopY + 60);
    }

    // "Bravo"
    ctx.font = isAr ? 'bold 80px "Tahoma", "Arial", sans-serif' : 'italic 300 130px "Cormorant Garamond", Georgia, serif';
    ctx.fillStyle = '#1A1005';
    ctx.fillText(isAr ? 'برافو' : 'Bravo', W / 2, 265);

    // First name (magenta)
    if (firstName) {
      ctx.font = isAr ? 'bold 72px "Tahoma", "Arial", sans-serif' : 'italic 300 118px "Cormorant Garamond", Georgia, serif';
      ctx.fillStyle = '#E8007D';
      ctx.fillText(firstName, W / 2, 380);
    }

    // Last name
    if (lastName) {
      ctx.font = isAr ? '600 28px "Tahoma", "Arial", sans-serif' : '600 28px "Montserrat", Arial, sans-serif';
      ctx.fillStyle = 'rgba(26,16,5,0.6)';
      ctx.fillText(lastName, W / 2, 424);
    }

    // "VOUS AVEZ GAGNÉ" label
    const labelY = lastName ? 462 : (firstName ? 435 : 410);
    ctx.font = isAr ? 'bold 22px "Tahoma", "Arial", sans-serif' : 'bold 22px "Montserrat", Arial, sans-serif';
    ctx.fillStyle = 'rgba(232,0,125,0.7)';
    ctx.fillText(isAr ? 'ربحتي' : 'VOUS AVEZ GAGNÉ', W / 2, labelY);

    // Divider
    const divY = labelY + 22;
    const divGrad2 = ctx.createLinearGradient(W / 2 - 180, 0, W / 2 + 180, 0);
    divGrad2.addColorStop(0, 'rgba(232,0,125,0)');
    divGrad2.addColorStop(0.5, 'rgba(232,0,125,0.5)');
    divGrad2.addColorStop(1, 'rgba(232,0,125,0)');
    ctx.fillStyle = divGrad2;
    ctx.fillRect(W / 2 - 180, divY, 360, 2);

    // Prize (big gradient)
    const prizeY = 680;
    const prizeFontSize = 185;
    ctx.font = `300 ${prizeFontSize}px "Cormorant Garamond", Georgia, serif`;
    const prizeMetrics2 = ctx.measureText(prize);
    const prizeGrad2 = ctx.createLinearGradient(
      W / 2 - prizeMetrics2.width / 2, prizeY - prizeFontSize,
      W / 2 + prizeMetrics2.width / 2, prizeY,
    );
    prizeGrad2.addColorStop(0, '#C4157A');
    prizeGrad2.addColorStop(0.4, '#E8007D');
    prizeGrad2.addColorStop(0.7, '#ff4da6');
    prizeGrad2.addColorStop(1, '#C4904A');
    ctx.fillStyle = prizeGrad2;
    ctx.shadowColor = 'rgba(232,0,125,0.35)';
    ctx.shadowBlur = 32;
    ctx.fillText(prize, W / 2, prizeY);
    ctx.shadowBlur = 0;

    // Subtitle
    ctx.font = isAr ? '600 28px "Tahoma", "Arial", sans-serif' : '600 28px "Montserrat", Arial, sans-serif';
    ctx.fillStyle = 'rgba(26,16,5,0.65)';
    ctx.fillText(isAr ? 'تخفيض حصري على Semilac' : 'de réduction exclusive Semilac', W / 2, 736);

    // Hashtag pill
    const hashtagY = 828;
    ctx.font = 'bold 26px "Montserrat", Arial, sans-serif';
    const hashMetrics2 = ctx.measureText(HASHTAG);
    const pillW2 = hashMetrics2.width + 52;
    const pillH2 = 52;
    const pillX2 = (W - pillW2) / 2;
    const pillY2 = hashtagY - 38;
    roundedRect(ctx, pillX2, pillY2, pillW2, pillH2, 26);
    ctx.fillStyle = 'rgba(232,0,125,0.10)';
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = 'rgba(232,0,125,0.35)';
    ctx.stroke();
    ctx.fillStyle = '#E8007D';
    ctx.fillText(HASHTAG, W / 2, hashtagY);

    // Dots
    ctx.fillStyle = '#E8007D';
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.arc(W / 2 - 56 + i * 28, hashtagY + 40, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    // Sponsor bar (880–1080)
    const sponsorSepY = 882;
    const sponsorDivGrad2 = ctx.createLinearGradient(0, 0, W, 0);
    sponsorDivGrad2.addColorStop(0, 'rgba(232,0,125,0)');
    sponsorDivGrad2.addColorStop(0.5, 'rgba(232,0,125,0.25)');
    sponsorDivGrad2.addColorStop(1, 'rgba(232,0,125,0)');
    ctx.fillStyle = sponsorDivGrad2;
    ctx.fillRect(60, sponsorSepY, W - 120, 1);

    // Light tint in sponsor zone
    ctx.fillStyle = 'rgba(250,247,242,0.5)';
    ctx.fillRect(0, sponsorSepY + 1, W, H - sponsorSepY - 1);

    drawSponsors(ctx, sponsorLogos, W, (sponsorSepY + H) / 2, H - sponsorSepY, isAr ? 'برعاية' : 'SPONSORED BY', isAr);
  }

  return new Promise<Blob>((resolve) => {
    canvas.toBlob((blob) => resolve(blob!), 'image/png', 0.95);
  });
}

// ─── Share helper ────────────────────────────────────────────────────────────
export async function shareImage(
  blob: Blob,
  filename: string,
  caption: string,
): Promise<'shared' | 'downloaded' | 'cancelled'> {
  const file = new File([blob], filename, { type: 'image/png' });

  if (
    typeof navigator !== 'undefined' &&
    navigator.share &&
    navigator.canShare?.({ files: [file] })
  ) {
    try {
      await navigator.share({
        files: [file],
        title: 'Semilac Days 2026',
        text: caption,
      });
      return 'shared';
    } catch (e) {
      if ((e as Error)?.name === 'AbortError') return 'cancelled';
    }
  }

  // Fallback: download the PNG
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  return 'downloaded';
}
