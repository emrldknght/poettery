import { buildStressIndex, buildYoIndex } from '../lib/accentCore.js';
import { runAccentPipeline } from '../lib/accentPipeline.js';

let index = null;
let yoIndex = null;
let stats = null;
let loading = null;

async function fetchText(url, onProgress) {
  const response = await fetch(url, { cache: 'force-cache' });
  if (!response.ok) throw new Error(`HTTP ${response.status}: ${url}`);

  const total = Number(response.headers.get('content-length')) || 0;
  if (!response.body) return response.text();

  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf-8');
  const chunks = [];
  let loaded = 0;

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    loaded += value.byteLength;
    chunks.push(decoder.decode(value, { stream: true }));
    onProgress(loaded, total);
  }
  chunks.push(decoder.decode());
  return chunks.join('');
}

async function ensureLoaded(base) {
  if (index) return stats;
  if (loading) return loading;

  loading = (async () => {
    const started = performance.now();
    let lastPost = 0;

    const report = (phase) => (loaded, total) => {
      const now = performance.now();
      if (now - lastPost < 120 && loaded !== total) return;
      lastPost = now;
      self.postMessage({ type: 'progress', phase, loaded, total });
    };

    const accentCsv = await fetchText(`${base}slovar/slovar_full_accent.txt`, report('accent'));
    self.postMessage({ type: 'phase', phase: 'index' });
    const builtIndex = buildStressIndex(accentCsv);

    const yoCsv = await fetchText(`${base}slovar/slovar_Yo.txt`, report('yo'));
    const builtYo = buildYoIndex(yoCsv);

    index = builtIndex;
    yoIndex = builtYo;
    stats = {
      words: index.size,
      yoWords: yoIndex.size,
      bytes: accentCsv.length + yoCsv.length,
      ms: Math.round(performance.now() - started),
    };
    return stats;
  })();

  try {
    return await loading;
  } catch (error) {
    loading = null;
    index = null;
    yoIndex = null;
    throw error;
  }
}

self.onmessage = async (event) => {
  const data = event.data || {};
  const { type, id } = data;
  const base = data.base || '/';

  try {
    if (type === 'load') {
      const info = await ensureLoaded(base);
      self.postMessage({ type: 'ready', id, stats: info });
      return;
    }

    if (type === 'accent') {
      const info = await ensureLoaded(base);
      const result = runAccentPipeline(data.text || '', {
        index,
        yoIndex,
        tonic: Boolean(data.tonic),
        passes: Number(data.passes) > 0 ? Number(data.passes) : 2,
        adjustMono: data.adjustMono !== false,
        promoteUnmarked: data.promoteUnmarked !== false,
      });

      self.postMessage({
        type: 'accented',
        id,
        text: result.text,
        unmarked: result.unmarked,
        triCod: result.triCod,
        razmer: result.razmer,
        steps: result.steps,
        stats: { ...result.stats, dictionary: info },
      });
    }
  } catch (error) {
    self.postMessage({
      type: 'error',
      id,
      message: String((error && error.message) || error),
    });
  }
};