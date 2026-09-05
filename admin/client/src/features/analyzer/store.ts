import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// === ТИПЫ ДАННЫХ (на основе твоего JSON из fetoAdapter) ===
export interface AnalysisStats {
  total: number;
  blue: number;
  gray: number;
  black: number;
}

export interface AnalysisResult {
  containerFlag1: string;
  accentedText: string;
  stats: AnalysisStats;
  structure: {
    size: string;
    rhythmString: string;
    rhythm: number[];
    vowelTemplates: string[];
    accentTemplates: string[];
    numGlasTemplates: string[];
    rhythmContrast: { plus: string; minus: string };
    triCode: string;
    ResumeComment: string;
    ResumeCommentMini: string;
    razmerComment: string;
  };
  rhymes: {
    words: string[];
    sounds: string[];
    type: string;
    typeCode: string;
    scheme: string;
  };
  scoring: {
    classicBall: number;
    tonicBall: number;
    rhythmBall: number;
    rhymeBall: number;
    accentBall: number;
    groupStrofaBall: number;
    rhythmErrors: number;
    rhymeErrors: number;
    isStrofaBroken: number;
    uniqueStrof: number;
    percentSecondarySyllables: number;
  };
  comments: {
    resume: string;
    resumeMini: string;
    lentaModeResume: string;
    rhythm: string;
    rhyme: string;
    stopa: string;
  };
  legend: {
    blue: { code: number; label: string; count: number };
    gray: { code: number; label: string; count: number };
    black: { code: number; label: string; count: number };
  };
  flags: {
    passed: boolean;
    flag: string;
  };
  dom: {
    ContainerAnaliz1: string;
    ContainerAnaliz1f: string;
    ContainerComment0: string;
    ContainerComment1: string;
    ContainerFlag1: string;
  };
}

// === ИНТЕРФЕЙС СОСТОЯНИЯ ===
interface AnalyzerState {
  result: AnalysisResult | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setAnalysisResult: (result: AnalysisResult) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearAnalysis: () => void;
}

// === СОЗДАНИЕ СОСТОЯНИЯ ===
export const useAnalyzerStore = create<AnalyzerState>()(
  devtools(
    persist(
      (set) => ({
        result: null,
        isLoading: false,
        error: null,

        setAnalysisResult: (result) =>
          set({ result, error: null, isLoading: false }, false, 'analyzer/setResult'),

        setLoading: (isLoading) =>
          set({ isLoading }, false, 'analyzer/setLoading'),

        setError: (error) =>
          set({ error, isLoading: false }, false, 'analyzer/setError'),

        clearAnalysis: () =>
          set({ result: null, error: null, isLoading: false }, false, 'analyzer/clear'),
      }),
      {
        name: 'feto-analyzer-storage', // Уникальный ключ для localStorage
        // Если объект result станет слишком большим, можно сохранять только его часть:
        // partialize: (state) => ({ result: state.result }),
      }
    ),
    {
      name: 'AnalyzerStore', // Имя, которое будет видно в Redux DevTools
      enabled: true
    }
  )
);