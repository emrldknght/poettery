import { useCallback, useEffect, useState } from 'react';

let worker = null;
let seq = 0;
const pending = new Map();
const listeners = new Set();

let shared = {
  status: 'idle', // idle | loading | ready | error
  phase: '',
  loaded: 0,
  total: 0,
  stats: null,
  error: null,
};

function emit(patch) {
  shared = { ...shared, ...patch };
  listeners.forEach((listener) => listener(shared));
}

function ensureWorker() {
  if (worker) return worker;

  worker = new Worker(
    new URL('../workers/accentDictionary.worker.js', import.meta.url),
    { type: 'module' }
  );

  worker.onmessage = (event) => {
    const msg = event.data || {};

    if (msg.type === 'progress') {
      emit({ status: 'loading', phase: msg.phase, loaded: msg.loaded, total: msg.total, error: null });
      return;
    }
    if (msg.type === 'phase') {
      emit({ phase: msg.phase });
      return;
    }
    if (msg.type === 'ready') {
      emit({ status: 'ready', stats: msg.stats, error: null, phase: '' });
    }
    if (msg.type === 'error') {
      emit({ status: 'error', error: msg.message, phase: '' });
    }

    const task = pending.get(msg.id);
    if (!task) return;
    pending.delete(msg.id);
    if (msg.type === 'error') task.reject(new Error(msg.message));
    else task.resolve(msg);
  };

  worker.onerror = (event) => {
    const message = event.message || 'Ошибка воркера словаря';
    emit({ status: 'error', error: message });
    pending.forEach((task) => task.reject(new Error(message)));
    pending.clear();
    worker = null;
  };

  return worker;
}

function request(payload) {
  const instance = ensureWorker();
  const id = ++seq;
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject });
    instance.postMessage({
      ...payload,
      id,
      base: import.meta.env.BASE_URL || '/',
    });
  });
}

export function useAccentDictionary() {
  const [state, setState] = useState(shared);

  useEffect(() => {
    listeners.add(setState);
    setState(shared);
    return () => { listeners.delete(setState); };
  }, []);

  const load = useCallback(() => request({ type: 'load' }), []);

  const placeAccents = useCallback(
    (text, options = {}) => request({
      type: 'accent',
      text,
      tonic: Boolean(options.tonic),
    }),
    []
  );

  return {
    ...state,
    ready: state.status === 'ready',
    load,
    placeAccents,
  };
}

export const formatCount = (n) => Number(n || 0).toLocaleString('ru-RU');
export const formatMb = (bytes) => `${(Number(bytes || 0) / 1048576).toFixed(1)} МБ`;