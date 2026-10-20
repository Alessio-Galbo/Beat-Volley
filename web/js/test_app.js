// Controller per testbench con supporto cambio prospettiva (85/90 gradi), pose atleti e fullscreen
import { drawCourt } from './court_renderer.js';
import { playHit, playSpike, playWhistle, toggleBeat } from './audio_synth.js';

const canvas = document.getElementById('courtCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 1920; canvas.height = 1080;

function loadImg(src) {
  const img = new Image(); img.src = src; return img;
}

const assets = {
  bg90: loadImg('assets/court/arena_background.jpg'),
  bg85: loadImg('assets/court/arena_background_85deg.jpg'),
  net90: loadImg('assets/court/volleyball_net_90deg.png'),
  net85: loadImg('assets/court/volleyball_net_85deg.png'),
  femaleReady: loadImg('assets/court/female_ready.png'),
  femaleSpike: loadImg('assets/court/female_spike.png'),
  maleReady: loadImg('assets/court/male_ready.png'),
  maleBlock: loadImg('assets/court/male_block.png')
};

const savedView = localStorage.getItem('beat_volley_view') || 'angled85';
const state = {
  viewMode: savedView,
  teamAPose: 'ready',
  teamBPose: 'ready',
  ball: { x: -0.65, y: 0, z: 40 }
};

let t = 0;
function animate() {
  t += 0.024;
  state.ball.x = -Math.cos(t) * 0.62;
  state.ball.y = Math.sin(t * 0.5) * 0.22;
  state.ball.z = Math.abs(Math.sin(t)) * 195 + 40;

  drawCourt(ctx, assets, state);
  requestAnimationFrame(animate);
}

function initControls() {
  document.getElementById('btnHit')?.addEventListener('click', playHit);
  document.getElementById('btnSpike')?.addEventListener('click', () => {
    state.teamAPose = 'spike';
    state.teamBPose = 'block';
    playSpike();
    setTimeout(() => { state.teamAPose = 'ready'; state.teamBPose = 'ready'; }, 1600);
  });
  document.getElementById('btnWhistle')?.addEventListener('click', playWhistle);
  document.getElementById('btnBeat')?.addEventListener('click', () => toggleBeat());

  const btnView = document.getElementById('btnToggleView');
  const updateViewLabel = () => {
    if (btnView) btnView.textContent = state.viewMode === 'angled85'
      ? 'Visuale: Inclinata 85° (Clicca per 90°)'
      : 'Visuale: Laterale 90° (Clicca per 85°)';
  };
  updateViewLabel();

  btnView?.addEventListener('click', () => {
    state.viewMode = state.viewMode === 'angled85' ? 'side90' : 'angled85';
    localStorage.setItem('beat_volley_view', state.viewMode);
    updateViewLabel();
  });

  document.getElementById('btnFullscreen')?.addEventListener('click', () => {
    if (!document.fullscreenElement) {
      canvas.requestFullscreen?.() || canvas.webkitRequestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initControls();
  requestAnimationFrame(animate);
});
