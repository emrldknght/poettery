// PoemAnalysis.tsx
import {PoemStats} from "@/features/analyzer/PoemStats.tsx";
import {PoemStructure} from "@/features/analyzer/PoemStructure.tsx";
import {PoemRhymes} from "@/features/analyzer/PoemRhymes.tsx";
import {PoemScoring} from "@/features/analyzer/PoemScoring.tsx";
import {PoemComments} from "@/features/analyzer/PoemComments.tsx";

interface AnalysisResult {
  containerFlag1: string;
  accentedText: string;
  stats: {
    total: number;
    blue: number;
    gray: number;
    black: number;
  };
  structure: {
    size: string;
    rhythmString: string;
    rhythm: number[];
    vowelTemplates: string[];
    accentTemplates: string[];
    numGlasTemplates: string[];
    rhythmContrast: {
      plus: string;
      minus: string;
    };
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

interface PoemAnalysisProps {
  data: AnalysisResult;
}

export function PoemAnalysis({ data }: PoemAnalysisProps) {
  return (
    <div className="poem-analysis" style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      {/* Флаг результата */}
      <div
        className="analysis-flag"
        dangerouslySetInnerHTML={{ __html: data.containerFlag1 }}
        style={{
          padding: '15px',
          marginBottom: '20px',
          backgroundColor: data.flags.passed ? '#d4edda' : '#f8d7da',
          borderRadius: '4px'
        }}
      />

      {/* Текст с ударениями */}
      <div className="accented-text" style={{
        padding: '20px',
        backgroundColor: '#f5f5f5',
        marginBottom: '20px',
        whiteSpace: 'pre-wrap',
        fontSize: '16px',
        lineHeight: '1.8'
      }}>
        <h3>Текст с расставленными ударениями:</h3>
        {data.accentedText}
      </div>

      {/* Статистика */}
      <PoemStats stats={data.stats} legend={data.legend} />

      {/* Структура */}
      <PoemStructure structure={data.structure} />

      {/* Рифмы */}
      <PoemRhymes rhymes={data.rhymes} />

      {/* Оценки */}
      <PoemScoring scoring={data.scoring} />

      {/* Комментарии */}
      <PoemComments comments={data.comments} />
    </div>
  );
}