// Rendering e composizione atleti ad alta definizione per campo 2.5D con supporto pose e direzioni
export function drawAthlete(ctx, img, gx, gy, options = {}) {
  if (!img || !img.complete || img.naturalWidth === 0) return;
  const height = options.height || 340;
  const aspect = img.naturalWidth / img.naturalHeight;
  const width = height * aspect;
  const facing = options.facing ?? 1; // 1 = destra (Team A), -1 = sinistra (Team B)
  const isJumping = options.isJumping || false;
  const jumpAltitude = options.jumpAltitude || 0;

  // 1. Ombra proiettata a terra (si riduce e sfuma durante il salto)
  drawGroundShadow(ctx, gx, gy, width * 0.45, isJumping, jumpAltitude);

  // 2. Disegno dello sprite dell'atleta
  ctx.save();
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.translate(gx, gy - jumpAltitude);
  if (facing === -1) {
    ctx.scale(-1, 1);
  }

  // Disegna ancorato ai piedi (centro orizzontale, base verticale)
  ctx.drawImage(img, -width * 0.5, -height, width, height);
  ctx.restore();
}

function drawGroundShadow(ctx, gx, gy, baseRadius, isJumping, jumpAltitude) {
  const shrink = isJumping ? Math.max(0.35, 1 - (jumpAltitude / 400)) : 1;
  const rx = baseRadius * shrink;
  const ry = rx * 0.32;
  const alpha = isJumping ? Math.max(0.12, 0.42 * shrink) : 0.42;

  ctx.save();
  ctx.beginPath();
  ctx.ellipse(gx, gy, rx, ry, 0, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
  ctx.fill();
  ctx.restore();
}
