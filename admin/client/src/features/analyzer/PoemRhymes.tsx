// PoemRhymes.tsx
interface PoemRhymesProps {
  rhymes: {
    words: string[];
    sounds: string[];
    type: string;
    typeCode: string;
    scheme: string;
  };
}

export function PoemRhymes({ rhymes }: PoemRhymesProps) {
  return (
    <div className="poem-rhymes" style={{ marginBottom: '20px' }}>
      <h3>Рифмы:</h3>

      <div style={{ marginBottom: '10px' }}>
        <strong>Тип рифмовки:</strong> {rhymes.type} ({rhymes.typeCode})
      </div>

      <div style={{ marginBottom: '10px' }}>
        <strong>Схема:</strong> {rhymes.scheme}
      </div>

      {rhymes.words.length > 0 && (
        <div style={{ marginBottom: '10px' }}>
          <strong>Рифмующиеся слова:</strong>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px',
            marginTop: '5px'
          }}>
            {rhymes.words.map((word, idx) => (
              <span
                key={idx}
                style={{
                  padding: '5px 10px',
                  backgroundColor: '#e8f5e9',
                  borderRadius: '4px'
                }}
              >
                {word}
              </span>
            ))}
          </div>
        </div>
      )}

      {rhymes.sounds.length > 0 && (
        <div style={{ marginBottom: '10px' }}>
          <strong>Ударные звуки:</strong>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px',
            marginTop: '5px',
            fontFamily: 'monospace'
          }}>
            {rhymes.sounds.map((sound, idx) => (
              <span
                key={idx}
                style={{
                  padding: '5px 10px',
                  backgroundColor: '#fff9c4',
                  borderRadius: '4px'
                }}
              >
                {sound}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}