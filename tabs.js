// tabs.js — скрипт для страниц с табами

import * as alphaTab from 'https://cdn.jsdelivr.net/npm/@coderline/alphatab@latest/dist/alphaTab.min.mjs';

window.addEventListener('DOMContentLoaded', async function() {
  const container = document.getElementById('alphaTabContainer');
  const filePath = container?.getAttribute('data-file');
  if (!filePath) return;

  const playPauseBtn = document.getElementById('playPauseBtn');
  const stopBtn = document.getElementById('stopBtn');

  const settings = new alphaTab.Settings();
  settings.player.enablePlayer = true;
  settings.player.soundFont = "https://cdn.jsdelivr.net/npm/@coderline/alphatab@latest/dist/soundfont/sonivox.sf2";
  settings.player.enableCursor = true;
  settings.player.enableAnimatedBeatCursor = true;
  settings.player.enableElementHighlighting = true;
  settings.core.tracks = 'all';
  settings.display.layoutMode = alphaTab.LayoutMode.Horizontal;
  settings.display.scale = 0.9;

  const api = new alphaTab.AlphaTabApi(container, settings);

  await api.load(filePath);
  await api.loadSoundFont(settings.player.soundFont);

  api.playerReady.on(() => {
    console.log('Плеер готов!');
    if (playPauseBtn) playPauseBtn.disabled = false;
    if (stopBtn) stopBtn.disabled = false;
  });

  api.playerStateChanged.on((state) => {
    if (playPauseBtn) {
      playPauseBtn.textContent = state.state === 'playing' ? '⏸ Pause' : '▶ Play';
    }
  });

  playPauseBtn?.addEventListener('click', () => api.playPause());
  stopBtn?.addEventListener('click', () => api.stop());
});