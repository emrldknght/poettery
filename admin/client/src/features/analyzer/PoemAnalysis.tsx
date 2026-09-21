// PoemAnalysis.tsx
import {PoemStats} from "@/features/analyzer/PoemStats.tsx";
import {PoemStructure} from "@/features/analyzer/PoemStructure.tsx";
import {PoemRhymes} from "@/features/analyzer/PoemRhymes.tsx";
import {PoemScoring} from "@/features/analyzer/PoemScoring.tsx";
import {PoemComments} from "@/features/analyzer/PoemComments.tsx";
import {VowelAnalysisGrid} from "@/features/analyzer/VowelAnalysisGrid.tsx";
import type {AnalysisResult} from "@/features/analyzer/types";

interface PoemAnalysisProps {
  data: AnalysisResult;
}

export function PoemAnalysis({ data }: PoemAnalysisProps) {
  // Собираем текст из массива слов (каждые 4 слова = строка стиха)
  const words = data.AccentedFragments || [];
  const lines: string[] = [];
  for (let i = 0; i < words.length; i += 4) {
    lines.push(words.slice(i, i + 4).join(' '));
  }
  const accentedText = lines.join('\n');


  return (
    <div className="poem-analysis" style={{
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      display: 'flex',
      gap: '30px',
      alignItems: 'flex-start'
    }}>
      {/* ЛЕВАЯ КОЛОНКА - Текст с ударениями */}
      <div style={{ flex: '0 0 40%', minWidth: '300px' }}>
        <div className="accented-text" style={{
          padding: '20px',
          backgroundColor: '#f5f5f5',
          whiteSpace: 'pre-wrap',
          fontSize: '16px',
          lineHeight: '1.8',
          borderRadius: '8px',
          border: '1px solid #ddd'
        }}>
          <h3 style={{ marginTop: 0 }}>Текст с расставленными ударениями:</h3>
          {accentedText}
        </div>
      </div>

      {/* ПРАВАЯ КОЛОНКА - Анализ */}
      <div style={{ flex: '0 0 60%', minWidth: '400px' }}>
        {/* Сетка гласных */}
        <VowelAnalysisGrid
          vowelTemplates={data.structure.vowelTemplates}
          rhythm={data.structure.rhythm}
          stats={data.stats}
        />

        {/* Остальные блоки */}
        <PoemStats stats={data.stats} legend={data.legend} />
        <PoemStructure structure={data.structure} />
        <PoemRhymes rhymes={data.rhymes} />
        <PoemScoring scoring={data.scoring} />
        <PoemComments comments={data.comments} />
      </div>
    </div>
  );
}