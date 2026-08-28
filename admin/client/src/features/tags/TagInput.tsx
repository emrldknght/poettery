import { useState, useRef, useEffect, type KeyboardEvent } from 'react';
import { useTagsStore } from './store';
import { SETTINGS_MAX_TAG_SUGGESTIONS } from '@/shared/config/settings';

interface TagInputProps {
  onAdd: (tagName: string) => void;
}

export function TagInput({ onAdd }: TagInputProps) {
  const [value, setValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // ТОЛЬКО ЧИТАЕМ теги из стора. Никаких fetchTags здесь!
  const { tags } = useTagsStore();

  // Закрытие выпадающего списка при клике вне компонента
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

  // Фильтруем теги и ограничиваем лимитом из настроек
  const filteredTags = tags
    .filter(t => t.name.toLowerCase().includes(value.toLowerCase()))
    .slice(0, SETTINGS_MAX_TAG_SUGGESTIONS);

  const hasExactMatch = filteredTags.some(t => t.name.toLowerCase() === value.toLowerCase().trim());
  const showCreateOption = value.trim().length > 0 && !hasExactMatch;

  const handleSelect = (tagName: string) => {
    onAdd(tagName);
    setValue('');
    setIsOpen(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const trimmed = value.trim();
      if (trimmed) {
        const exact = filteredTags.find(t => t.name.toLowerCase() === trimmed.toLowerCase());
        handleSelect(exact ? exact.name : trimmed);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div ref={wrapperRef} style={{ position: 'relative', display: 'inline-block' }}>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={handleFocus}
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
            minWidth: '160px',
            maxHeight: '200px',
            overflowY: 'auto',
          }}
        >
          {filteredTags.length === 0 && !showCreateOption ? (
            <div style={{ padding: '8px 12px', fontSize: '12px', color: 'var(--text-muted)' }}>
              Нет совпадений
            </div>
          ) : (
            <>
              {filteredTags.map((tag) => (
                <div
                  key={tag.id}
                  onClick={() => handleSelect(tag.name)}
                  style={{
                    padding: '6px 12px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    color: 'var(--text)',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--accent-soft)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  {tag.name}
                </div>
              ))}

              {showCreateOption && (
                <div
                  onClick={() => handleSelect(value.trim())}
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
                  ✨ Создать новый: "{value.trim()}"
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}