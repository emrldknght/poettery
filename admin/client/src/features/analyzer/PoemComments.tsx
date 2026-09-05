// PoemComments.tsx
interface PoemCommentsProps {
  comments: {
    resume: string;
    resumeMini: string;
    lentaModeResume: string;
    rhythm: string;
    rhyme: string;
    stopa: string;
  };
}

export function PoemComments({ comments }: PoemCommentsProps) {
  return (
    <div className="poem-comments" style={{ marginBottom: '20px' }}>
      <h3>Комментарии:</h3>

      {comments.rhythm && (
        <div style={{
          padding: '15px',
          backgroundColor: '#e3f2fd',
          marginBottom: '10px',
          borderRadius: '4px'
        }}>
          <strong>О ритме:</strong>
          <div style={{ marginTop: '5px' }}>{comments.rhythm}</div>
        </div>
      )}

      {comments.rhyme && (
        <div style={{
          padding: '15px',
          backgroundColor: '#e8f5e9',
          marginBottom: '10px',
          borderRadius: '4px'
        }}>
          <strong>О рифме:</strong>
          <div style={{ marginTop: '5px' }}>{comments.rhyme}</div>
        </div>
      )}

      {comments.stopa && (
        <div style={{
          padding: '15px',
          backgroundColor: '#fff3e0',
          marginBottom: '10px',
          borderRadius: '4px'
        }}>
          <strong>О стопе:</strong>
          <div style={{ marginTop: '5px' }}>{comments.stopa}</div>
        </div>
      )}

      {comments.resume && (
        <div style={{
          padding: '15px',
          backgroundColor: '#f5f5f5',
          borderRadius: '4px'
        }}>
          <strong>Резюме:</strong>
          <div
            style={{ marginTop: '5px' }}
            dangerouslySetInnerHTML={{ __html: comments.resume }}
          />
        </div>
      )}
    </div>
  );
}