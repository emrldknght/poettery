import { useState, type KeyboardEvent } from 'react';

interface TagInputProps {
  onAdd: (tagName: string) => void;
}

export function TagInput({ onAdd }: TagInputProps) {
  const [value, setValue] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const trimmed = value.trim();
      if (trimmed) {
        onAdd(trimmed);
        setValue('');
      }
    }
  };

  return (
    <input
      type="text"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={handleKeyDown}
      placeholder="+ тег"
      style={{
        border: 'none',
        background: 'transparent',
        fontSize: '11px',
        color: 'var(--accent)',
        outline: 'none',
        width: '60px',
        padding: '2px 0',
      }}
    />
  );
}
