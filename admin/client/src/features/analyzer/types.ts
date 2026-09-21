// src/features/analyzer/types.ts

export interface AnalysisStats {
  total: number;
  blue: number;
  gray: number;
  black: number;
}

export interface RhythmContrast {
  plus: string;
  minus: string;
}

export interface AnalysisStructure {
  size: string;
  rhythmString: string;
  rhythm: number[];
  vowelTemplates: string[];
  accentTemplates: string[];
  numGlasTemplates: string[];
  rhythmContrast: RhythmContrast;
  triCode: string;
  StrofaPatternTypeMas: string[];
  StrofaRepeatTypeMas: number[];
  StrofaPositionMas: (number | undefined)[];
  ResumeComment: string;
  ResumeCommentMini: string;
  razmerComment: string;
  ReportMas: string;
  GlobalflagRitmBallMas: number;
}

export interface AnalysisRhymes {
  words: string[];
  sounds: string[];
  type: string;
  typeCode: string;
  scheme: string;
}

export interface AnalysisScoring {
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
}

export interface AnalysisComments {
  resume: string;
  resumeMini: string;
  lentaModeResume: string;
  rhythm: string;
  rhyme: string;
  stopa: string;
}

export interface LegendItem {
  code: number;
  label: string;
  count: number;
}

export interface AnalysisLegend {
  blue: LegendItem;
  gray: LegendItem;
  black: LegendItem;
}

export interface AnalysisFlags {
  passed: boolean;
  flag: string;
}

export interface AnalysisDOM {
  ContainerAnaliz1: string;
  ContainerAnaliz1f: string;
  ContainerComment0: string;
  ContainerComment1: string;
  ContainerFlag1: string;
}

export interface AnalysisResult {
  containerFlag1: string;
  accentedText: string;
  stats: AnalysisStats;
  structure: AnalysisStructure;
  rhymes: AnalysisRhymes;
  scoring: AnalysisScoring;
  comments: AnalysisComments;
  legend: AnalysisLegend;
  flags: AnalysisFlags;
  dom: AnalysisDOM;
  AccentedFragments: string[];
}