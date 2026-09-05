// PoemScoring.tsx
interface PoemScoringProps {
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
}

export function PoemScoring({ scoring }: PoemScoringProps) {
  const getBallColor = (ball: number, max: number = 3) => {
    if (ball === max) return '#4caf50';
    if (ball >= max * 0.66) return '#8bc34a';
    if (ball >= max * 0.33) return '#ffc107';
    return '#f44336';
  };

  return (
    <div className="poem-scoring" style={{ marginBottom: '20px' }}>
      <h3>Оценки:</h3>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '10px'
      }}>
        <div style={{
          padding: '10px',
          backgroundColor: getBallColor(scoring.classicBall),
          color: 'white',
          borderRadius: '4px'
        }}>
          <strong>Классика:</strong> {scoring.classicBall}/3
        </div>

        <div style={{
          padding: '10px',
          backgroundColor: getBallColor(scoring.rhythmBall),
          color: 'white',
          borderRadius: '4px'
        }}>
          <strong>Ритм:</strong> {scoring.rhythmBall}/3
        </div>

        <div style={{
          padding: '10px',
          backgroundColor: getBallColor(scoring.rhymeBall, 1),
          color: 'white',
          borderRadius: '4px'
        }}>
          <strong>Рифма:</strong> {scoring.rhymeBall}/1
        </div>

        <div style={{
          padding: '10px',
          backgroundColor: '#f5f5f5',
          borderRadius: '4px'
        }}>
          <strong>Сбои ритма:</strong> {scoring.rhythmErrors}
        </div>

        <div style={{
          padding: '10px',
          backgroundColor: '#f5f5f5',
          borderRadius: '4px'
        }}>
          <strong>Сбои рифмы:</strong> {scoring.rhymeErrors}
        </div>

        <div style={{
          padding: '10px',
          backgroundColor: '#f5f5f5',
          borderRadius: '4px'
        }}>
          <strong>Слабоударные:</strong> {scoring.percentSecondarySyllables}%
        </div>
      </div>
    </div>
  );
}