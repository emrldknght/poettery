import { useState, useRef, useEffect, type KeyboardEvent } from 'react';
import { usePoemsStore } from './store';

interface SectionInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function SectionInput({ value, onChange }: SectionInputProps) {
  const [inputValue, setInputValue] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { poems } = usePoemsStore();

  // Получаем уникальные секции из стихов
  const availableSections = Array.from(
    new Set(poems.map(p => p.section).filter(Boolean))
  ).sort();

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFocus = () => setIsOpen(true);

  const filteredSections = availableSections
    .filter(s => s.toLowerCase().includes(inputValue.toLowerCase()))
    .slice(0, 10);

  const hasExactMatch = filteredSections.some(s => s.toLowerCase() === inputValue.toLowerCase());
  const showCreateOption = inputValue.trim().length > 0 && !hasExactMatch;

  const handleSelect = (sectionName: string) => {
    onChange(sectionName);
    setInputValue(sectionName);
    setIsOpen(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const trimmed = inputValue.trim();
      if (trimmed) {
        const exact = filteredSections.find(s => s.toLowerCase() === trimmed.toLowerCase());
        handleSelect(exact ? exact : trimmed);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div ref={wrapperRef} style={{ position: 'relative', width: '100%' }}>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        placeholder="Введите секцию..."
        style={{
          width: '100%',
          padding: '6px 8px',
          border: '1px solid var(--border)',
          borderRadius: '4px',
          fontSize: '13px',
          marginTop: '4px',
        }}
      />

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            marginTop: '4px',
            background: 'white',
            border: '1px solid var(--border)',
            borderRadius: '6px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            zIndex: 100,
            width: '100%',
            maxHeight: '200px',
            overflowY: 'auto',
          }}
        >
          {filteredSections.length === 0 && !showCreateOption ? (
            <div style={{ padding: '8px 12px', fontSize: '12px', color: 'var(--text-muted)' }}>
              Нет совпадений
            </div>
          ) : (
            <>
              {filteredSections.map((section) => (
                <div
                  key={section}
                  onClick={() => handleSelect(section)}
                  style={{
                    padding: '6px 12px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    color: 'var(--text)',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--accent-soft)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  {section}
                </div>
              ))}

              {showCreateOption && (
                <div
                  onClick={() => handleSelect(inputValue.trim())}
                  style={{
                    padding: '6px 12px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    color: 'var(--accent)',
                    fontWeight: 500,
                    borderTop: '1px solid var(--border)',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--accent-soft)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  ✨ Создать новую: "{inputValue.trim()}"
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}