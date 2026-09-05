// PoemStructure.tsx
interface PoemStructureProps {
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
    razmerComment: string;
  };
}

export function PoemStructure({ structure }: PoemStructureProps) {
  return (
    <div className="poem-structure" style={{ marginBottom: '20px' }}>
      <h3>Структура стихотворения:</h3>

      <div style={{ marginBottom: '15px' }}>
        <strong>Размер:</strong> {structure.size}
      </div>

      <div style={{ marginBottom: '15px' }}>
        <strong>Ритм:</strong> {structure.rhythmString}
      </div>

      <div style={{ marginBottom: '15px' }}>
        <strong>Комментарий о размере:</strong>
        <div style={{ padding: '10px', backgroundColor: '#f9f9f9', marginTop: '5px' }}>
          {structure.razmerComment}
        </div>
      </div>

      {structure.vowelTemplates.length > 0 && (
        <div style={{ marginBottom: '15px' }}>
          <strong>Шаблоны гласных:</strong>
          <div style={{
            fontFamily: 'monospace',
            padding: '10px',
            backgroundColor: '#f5f5f5',
            marginTop: '5px'
          }}>
            {structure.vowelTemplates.map((template, idx) => (
              <div key={idx}>{template}</div>
            ))}
          </div>
        </div>
      )}

      <div style={{ marginBottom: '15px' }}>
        <strong>Контраст ритма:</strong>
        <div style={{ fontFamily: 'monospace', marginTop: '5px' }}>
          <div>Плюс: {structure.rhythmContrast.plus}</div>
          <div>Минус: {structure.rhythmContrast.minus}</div>
        </div>
      </div>
    </div>
  );
}