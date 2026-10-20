// Rendering gerarchico 2D del giocatore di pallavolo con articolazioni e testa dell'avatar
import { POSES } from './poses.js';

export function drawRiggedPlayer(ctx, { px, py, z = 0, poseName = 'ready', headImg, jerseyColor = '#ef4444', number = '8' }) {
  const p = POSES[poseName] || POSES.ready;
  ctx.save();
  ctx.translate(px, py - z);

  // 1. Gambe con snodi anca-ginocchio-caviglia e ginocchiere
  drawLeg(ctx, -10, -p.hipY, p.leftThigh, p.leftShin);
  drawLeg(ctx, 10, -p.hipY, p.rightThigh, p.rightShin);

  // 2. Bacino e Pantaloncini
  ctx.fillStyle = jerseyColor;
  ctx.fillRect(-14, -p.hipY - 14, 28, 16);

  // 3. Torso e Maglia con numero
  ctx.save();
  ctx.translate(0, -p.hipY - 12);
  ctx.rotate(p.torsoAngle);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(-13, -34, 26, 34);
  ctx.fillStyle = jerseyColor;
  ctx.fillRect(-13, -34, 6, 34);
  ctx.fillRect(7, -34, 6, 34);
  ctx.fillStyle = '#111827';
  ctx.font = 'bold 13px Impact, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(number, 0, -12);

  // 4. Braccia con snodi spalla-gomito-polso
  drawArm(ctx, -14, -30, p.leftArm, p.leftForearm);
  drawArm(ctx, 14, -30, p.rightArm, p.rightForearm);

  // 5. Testa dell'Avatar montata identica sul collo
  if (headImg?.complete) {
    ctx.drawImage(headImg, -20, -74, 40, 40);
  } else {
    ctx.fillStyle = '#fde2d0';
    ctx.beginPath();
    ctx.arc(0, -44, 12, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
  ctx.restore();
}

function drawLeg(ctx, x, y, thighAngle, shinAngle) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(thighAngle);
  // Coscia
  ctx.fillStyle = '#ffd8be';
  ctx.fillRect(-4, 0, 8, 20);
  // Ginocchiera imbottita
  ctx.translate(0, 20);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(-6, -4, 12, 8);
  // Stinco e Scarpa
  ctx.rotate(shinAngle);
  ctx.fillStyle = '#ffd8be';
  ctx.fillRect(-3, 0, 6, 22);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(-4, 18, 14, 7); // scarpa
  ctx.restore();
}

function drawArm(ctx, x, y, armAngle, forearmAngle) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(armAngle);
  // Braccio superiore
  ctx.fillStyle = '#ffd8be';
  ctx.fillRect(-3, 0, 6, 18);
  // Gomito e avambraccio con polsino
  ctx.translate(0, 18);
  ctx.rotate(forearmAngle);
  ctx.fillRect(-3, 0, 6, 16);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(-4, 12, 8, 4); // polsino
  ctx.restore();
}
