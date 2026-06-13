/// <reference types="@coderline/alphatab" />

import * as alphaTab from 'https://cdn.jsdelivr.net/npm/@coderline/alphatab@latest/dist/alphaTab.min.mjs';

/** @typedef {import('@coderline/alphatab').SettingsJson} SettingsJson */
/** @typedef {import('@coderline/alphatab').AlphaTabApi} AlphaTabApi */
/** @typedef {import('@coderline/alphatab').PlayerStateChangedEventArgs} PlayerStateEventArgs */

/** @type {typeof import('@coderline/alphatab').AlphaTabApi} */
const AlphaTabApi = alphaTab.AlphaTabApi;

/**
 * Создаёт панель управления треками
 * @param {AlphaTabApi} api
 * @param {HTMLElement} container - куда вставить панель
 */
function createTrackPanel(api, container) {
  const panel = document.createElement('fieldset');
  panel.className = 'track-panel';
  panel.innerHTML = '<legend>Треки</legend>';
  container.after(panel);

  api.scoreLoaded.on((score) => {
    panel.innerHTML = '<legend>Треки</legend>';

    // Сохраняем текущие видимые треки
    let visibleTracks = score.tracks.map((_, idx) => idx);

    score.tracks.forEach((track, idx) => {
      const label = document.createElement('label');
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = true;
      checkbox.dataset.trackIndex = idx;

      checkbox.addEventListener('change', (e) => {
        if (e.target.checked) {
          // Добавляем трек обратно
          if (!visibleTracks.includes(idx)) {
            visibleTracks.push(idx);
            visibleTracks.sort((a, b) => a - b);
            api.renderTracks(visibleTracks);
          }
        } else {
          // Убираем трек
          visibleTracks = visibleTracks.filter(i => i !== idx);
          api.renderTracks(visibleTracks);
        }
      });

      label.appendChild(checkbox);
      label.appendChild(document.createTextNode(` ${track.name}`));
      panel.appendChild(label);
    });
  });
}

window.addEventListener('DOMContentLoaded', async function() {
  const container = document.getElementById('alphaTabContainer');
  const filePath = container?.getAttribute('data-file');
  if (!filePath) return;

  const playPauseBtn = document.getElementById('playPauseBtn');
  const stopBtn = document.getElementById('stopBtn');

  /** @type {SettingsJson} */
  const settings = {
    core: { tracks: 'all' },
    player: {
      enablePlayer: true,
      soundFont: "https://cdn.jsdelivr.net/npm/@coderline/alphatab@latest/dist/soundfont/sonivox.sf2",
      enableCursor: true,
      enableAnimatedBeatCursor: true,
      enableElementHighlighting: true,
      scrollElement: document.querySelector('#track-wrapper')
    },
    display: {
      layoutMode: 'horizontal',
      scale: 0.9
    }
  };

  const api = new AlphaTabApi(container, settings);

  // Создаём панель треков
  const controls = document.querySelector('.player-controls');
  createTrackPanel(api, controls);

  await api.load(filePath);
  await api.loadSoundFont(settings.player.soundFont);

  api.playerReady.on(() => {
    console.log('Плеер готов!');
    if (playPauseBtn) playPauseBtn.disabled = false;
    if (stopBtn) stopBtn.disabled = false;
  });

  api.playerStateChanged.on((/** @type {PlayerStateEventArgs} */ state) => {
    if (playPauseBtn) {
      playPauseBtn.textContent = state.state === 'playing' ? '⏸ Pause' : '▶ Play';
    }
  });

  playPauseBtn?.addEventListener('click', () => api.playPause());
  stopBtn?.addEventListener('click', () => api.stop());
});