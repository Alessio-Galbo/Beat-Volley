// Rendering del campo da pallavolo Full HD (1920x1080) con supporto visuali 85 e 90 gradi
import { drawAthlete } from './athlete_renderer.js';

const W = 1920, H = 1080;

export function drawCourt(ctx, assets, state) {
  ctx.clearRect(0, 0, W, H);
  const is85 = state.viewMode === 'angled85';

  // 1. Sfondo Palestra Anime Vintage (1080p nativo)
  const bg = is85 ? assets.bg85 : assets.bg90;
  if (bg?.complete && bg.naturalWidth > 0) {
    ctx.drawImage(bg, 0, 0, W, H);
  } else {
    ctx.fillStyle = '#0f172a'; ctx.fillRect(0, 0, W, H);
  }

  // 2. Rete da pallavolo orientata (85 gradi inclinata o 90 gradi laterale pura)
  drawNet(ctx, is85 ? assets.net85 : assets.net90, is85);

  // 3. Atleti sui due lati del campo (risoluzione nitida e proporzioni esatte)
  drawTeamPlayers(ctx, assets, state);

  // 4. Pallone da pallavolo con ombra dinamica proiettata sul parquet
  drawBall(ctx, state.ball);
}

function drawNet(ctx, netImg, is85) {
  if (!netImg?.complete || netImg.naturalWidth === 0) return;
  ctx.save();
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  if (is85) {
    const netW = 310, netH = 490;
    ctx.drawImage(netImg, W * 0.5 - netW * 0.42, H * 0.45, netW, netH);
  } else {
    const netW = 75, netH = 490;
    ctx.drawImage(netImg, W * 0.5 - netW * 0.5, H * 0.45, netW, netH);
  }
  ctx.restore();
}

function drawTeamPlayers(ctx, assets, state) {
  // Squadra A (Sinistra): Atleta rivolta a destra verso la rete
  const spriteA = state.teamAPose === 'spike' ? assets.femaleSpike : assets.femaleReady;
  const isSpikeA = state.teamAPose === 'spike';
  drawAthlete(ctx, spriteA, W * 0.29, H * 0.76, {
    height: isSpikeA ? 420 : 360,
    facing: 1,
    isJumping: isSpikeA,
    jumpAltitude: isSpikeA ? 140 : 0
  });

  // Squadra B (Destra): Atleta rivolto a sinistra verso la rete
  const spriteB = state.teamBPose === 'block' ? assets.maleBlock : assets.maleReady;
  const isBlockB = state.teamBPose === 'block';
  drawAthlete(ctx, spriteB, W * 0.71, H * 0.76, {
    height: isBlockB ? 440 : 360,
    facing: -1,
    isJumping: isBlockB,
    jumpAltitude: isBlockB ? 130 : 0
  });
}

function drawBall(ctx, b) {
  const screenX = W * 0.5 + (b.x * W * 0.32);
  const groundY = H * 0.76 + (b.y * 50);
  const screenY = groundY - b.z;

  // Ombra dinamica su parquet
  const shadowRadius = Math.max(10, 32 - b.z * 0.08);
  ctx.beginPath();
  ctx.ellipse(screenX, groundY, shadowRadius * 1.5, shadowRadius * 0.65, 0, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(0, 0, 0, ${Math.max(0.12, 0.45 - b.z * 0.002)})`;
  ctx.fill();

  // Pallone da volley Full HD bicolore giallo/blu con riflesso
  ctx.beginPath();
  ctx.arc(screenX, screenY, 22, 0, Math.PI * 2);
  ctx.fillStyle = '#facc15'; ctx.fill();
  ctx.strokeStyle = '#1e3a8a'; ctx.lineWidth = 4; ctx.stroke();
  ctx.beginPath();
  ctx.arc(screenX - 7, screenY - 7, 7, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff'; ctx.fill();
}
