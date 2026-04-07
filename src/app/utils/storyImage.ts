// Premium share-image generator for Instagram Story / WhatsApp Status / Feed
// Pure canvas — no external deps, no CORS pitfalls.
// Two formats: 'story' (1080×1920, 9:16) and 'square' (1080×1080, 1:1).
// IMPORTANT (privacy): the coupon code is NEVER drawn on the image.

export type ShareFormat = 'story' | 'square';

export interface ShareImageParams {
  prize: string;          // e.g. "-35%"
  firstName: string;      // e.g. "Sarah"
  lang: 'fr' | 'ar';
  format: ShareFormat;
}

const HASHTAG = '#SemilacDays2026';

// Pre-load web fonts so canvas can render them (otherwise it falls back to serif/sans-serif)
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

function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export async function generateShareImage(params: ShareImageParams): Promise<Blob> {
  const { prize, firstName, lang, format } = params;

  await ensureFontsLoaded();

  const W = 1080;
  const H = format === 'story' ? 1920 : 1080;

  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;

  // ─── Background gradient (Semilac cream → soft pink → cream) ───────────────
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#FAF7F2');
  bg.addColorStop(0.5, '#FFF0F5');
  bg.addColorStop(1, '#FAF7F2');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // ─── Aurora decorative blobs ───────────────────────────────────────────────
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
    blob(W / 2, H - 280, 600, 'rgba(255,77,166,0.12)');
  } else {
    blob(120, 160, 380, 'rgba(232,0,125,0.18)');
    blob(W - 80, 580, 440, 'rgba(196,144,74,0.14)');
    blob(W / 2, H + 60, 520, 'rgba(255,77,166,0.10)');
  }

  // ─── Semilac Days logo (SVG → image) ──────────────────────────────────────
  let logo: HTMLImageElement | null = null;
  try {
    logo = await loadImage('/logos/semilac-days.svg');
  } catch {
    /* fallback below */
  }

  const logoMaxW = format === 'story' ? 720 : 560;
  const logoY = format === 'story' ? 200 : 120;
  if (logo && logo.width > 0) {
    const ratio = logo.height / logo.width;
    const drawW = logoMaxW;
    const drawH = drawW * ratio;
    ctx.drawImage(logo, (W - drawW) / 2, logoY, drawW, drawH);
  } else {
    // Text fallback if SVG fails
    ctx.font = 'bold 64px "Cormorant Garamond", Georgia, serif';
    ctx.fillStyle = '#E8007D';
    ctx.textAlign = 'center';
    ctx.fillText('SEMILAC DAYS', W / 2, logoY + 70);
  }

  // Common drawing helpers
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';

  const isAr = lang === 'ar';
  // For Arabic, rely on system fonts (Cormorant Garamond doesn't support Arabic glyphs)
  const headlineFont = isAr
    ? 'bold 110px "Tahoma", "Arial", sans-serif'
    : 'italic 300 180px "Cormorant Garamond", Georgia, serif';
  const subFont = isAr
    ? '600 38px "Tahoma", "Arial", sans-serif'
    : '600 38px "Montserrat", Arial, sans-serif';
  const labelFont = isAr
    ? 'bold 30px "Tahoma", "Arial", sans-serif'
    : 'bold 30px "Montserrat", Arial, sans-serif';
  const eventFont = isAr
    ? '600 32px "Tahoma", "Arial", sans-serif'
    : '600 32px "Montserrat", Arial, sans-serif';

  const bravoY = format === 'story' ? 720 : 480;
  const nameY = format === 'story' ? 870 : 590;
  const labelY = format === 'story' ? 980 : 670;
  const prizeY = format === 'story' ? 1290 : 880;
  const subY = format === 'story' ? 1380 : 950;
  const eventY = format === 'story' ? 1560 : 0; // square has no event line, save space
  const editionY = format === 'story' ? 1620 : 0;
  const hashtagY = format === 'story' ? 1820 : 1030;

  // ─── "Bravo" headline ──────────────────────────────────────────────────────
  ctx.font = headlineFont;
  ctx.fillStyle = '#1A1005';
  const bravoText = isAr ? 'برافو' : 'Bravo';
  ctx.fillText(bravoText, W / 2, bravoY);

  // ─── First name (magenta accent) ───────────────────────────────────────────
  if (firstName) {
    ctx.font = isAr
      ? 'bold 100px "Tahoma", "Arial", sans-serif'
      : 'italic 300 150px "Cormorant Garamond", Georgia, serif';
    ctx.fillStyle = '#E8007D';
    ctx.fillText(firstName, W / 2, nameY);
  }

  // ─── "VOUS AVEZ GAGNÉ" label ───────────────────────────────────────────────
  ctx.font = labelFont;
  ctx.fillStyle = 'rgba(232,0,125,0.7)';
  const labelText = isAr ? 'ربحتي' : 'VOUS AVEZ GAGNÉ';
  // letter-spacing emulation via stretched draw not needed — keep it simple
  ctx.fillText(labelText, W / 2, labelY);

  // ─── Decorative divider ────────────────────────────────────────────────────
  const divY = labelY + 30;
  const divGrad = ctx.createLinearGradient(W / 2 - 200, 0, W / 2 + 200, 0);
  divGrad.addColorStop(0, 'rgba(232,0,125,0)');
  divGrad.addColorStop(0.5, 'rgba(232,0,125,0.5)');
  divGrad.addColorStop(1, 'rgba(232,0,125,0)');
  ctx.fillStyle = divGrad;
  ctx.fillRect(W / 2 - 200, divY, 400, 2);

  // ─── BIG prize % with gradient fill ────────────────────────────────────────
  const prizeFontSize = format === 'story' ? 320 : 240;
  ctx.font = `300 ${prizeFontSize}px "Cormorant Garamond", Georgia, serif`;
  // Measure for gradient bounds
  const prizeMetrics = ctx.measureText(prize);
  const prizeW = prizeMetrics.width;
  const prizeGrad = ctx.createLinearGradient(
    W / 2 - prizeW / 2,
    prizeY - prizeFontSize,
    W / 2 + prizeW / 2,
    prizeY,
  );
  prizeGrad.addColorStop(0, '#C4157A');
  prizeGrad.addColorStop(0.4, '#E8007D');
  prizeGrad.addColorStop(0.7, '#ff4da6');
  prizeGrad.addColorStop(1, '#C4904A');
  ctx.fillStyle = prizeGrad;
  // Soft glow
  ctx.shadowColor = 'rgba(232,0,125,0.35)';
  ctx.shadowBlur = 40;
  ctx.fillText(prize, W / 2, prizeY);
  ctx.shadowBlur = 0;

  // ─── Subtitle ──────────────────────────────────────────────────────────────
  ctx.font = subFont;
  ctx.fillStyle = 'rgba(26,16,5,0.65)';
  const subText = isAr ? 'تخفيض حصري على Semilac' : 'de réduction exclusive Semilac';
  ctx.fillText(subText, W / 2, subY);

  // ─── Event info (story format only) ───────────────────────────────────────
  if (format === 'story') {
    ctx.font = eventFont;
    ctx.fillStyle = '#C4904A';
    const eventText = isAr ? '14-19 ماي 2026 · الدار البيضاء' : '14-19 Mai 2026  ·  Casablanca';
    ctx.fillText(eventText, W / 2, eventY);

    ctx.font = isAr
      ? '500 26px "Tahoma", "Arial", sans-serif'
      : '500 26px "Montserrat", Arial, sans-serif';
    ctx.fillStyle = 'rgba(196,144,74,0.75)';
    const editionText = isAr ? 'الطبعة الثانية' : '2ème Édition';
    ctx.fillText(editionText, W / 2, editionY);
  }

  // ─── Hashtag pill ──────────────────────────────────────────────────────────
  ctx.font = 'bold 32px "Montserrat", Arial, sans-serif';
  const hashMetrics = ctx.measureText(HASHTAG);
  const pillW = hashMetrics.width + 60;
  const pillH = 60;
  const pillX = (W - pillW) / 2;
  const pillY = hashtagY - 44;
  // Pill background
  roundedRect(ctx, pillX, pillY, pillW, pillH, 30);
  ctx.fillStyle = 'rgba(232,0,125,0.10)';
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'rgba(232,0,125,0.35)';
  ctx.stroke();
  // Hashtag text
  ctx.fillStyle = '#E8007D';
  ctx.fillText(HASHTAG, W / 2, hashtagY);

  // ─── Tiny dots accent ──────────────────────────────────────────────────────
  ctx.fillStyle = '#E8007D';
  const dotsY = hashtagY + 50;
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.arc(W / 2 - 56 + i * 28, dotsY, 5, 0, Math.PI * 2);
    ctx.fill();
  }

  return new Promise<Blob>((resolve) => {
    canvas.toBlob((blob) => resolve(blob!), 'image/png', 0.95);
  });
}

// ─── Share helper ───────────────────────────────────────────────────────────
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
      // user cancelled or share failed → fall through to download
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
