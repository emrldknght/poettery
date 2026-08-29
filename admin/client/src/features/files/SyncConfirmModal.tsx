import { useState } from 'react';
import {Modal} from "@/shared/ui/Modal.tsx";


type SyncMode = 'full' | 'partial';

interface SyncConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (mode: SyncMode) => void;
  fileName: string;
  isLoading?: boolean;
}

export function SyncConfirmModal({
                                   isOpen,
                                   onClose,
                                   onConfirm,
                                   fileName,
                                   isLoading = false,
                                 }: SyncConfirmModalProps) {
  const [mode, setMode] = useState<SyncMode>('full');

  const handleConfirm = () => {
    onConfirm(mode);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="⚠️ Синхронизация файла">
      <div style={{ marginBottom: '20px' }}>
        <p style={{ margin: '0 0 12px', fontSize: '14px', lineHeight: 1.5 }}>
          Вы собираетесь синхронизировать файл <strong>{fileName}</strong> с базой данных.
        </p>
        <div style={{
          padding: '12px',
          background: 'rgba(255, 165, 0, 0.1)',
          border: '1px solid rgba(255, 165, 0, 0.3)',
          borderRadius: '6px',
          fontSize: '13px',
          lineHeight: 1.5,
        }}>
          ⚠️ <strong>Полная синхронизация</strong> перезапишет все метаданные в БД
          (layout, title, date, section) данными из файла.
        </div>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '10px' }}>
          Режим синхронизации:
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px',
            padding: '10px',
            border: '1px solid var(--border)',
            borderRadius: '6px',
            cursor: 'pointer',
            background: mode === 'full' ? 'rgba(255, 165, 0, 0.05)' : 'transparent',
          }}>
            <input
              type="radio"
              name="syncMode"
              checked={mode === 'full'}
              onChange={() => setMode('full')}
              style={{ marginTop: '2px' }}
            />
            <div>
              <div style={{ fontSize: '13px', fontWeight: 500 }}>Полная (по умолчанию)</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                Перезаписать layout, title, date, section из файла
              </div>
            </div>
          </label>

          <label style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px',
            padding: '10px',
            border: '1px solid var(--border)',
            borderRadius: '6px',
            cursor: 'pointer',
            background: mode === 'partial' ? 'rgba(100, 200, 100, 0.05)' : 'transparent',
          }}>
            <input
              type="radio"
              name="syncMode"
              checked={mode === 'partial'}
              onChange={() => setMode('partial')}
              style={{ marginTop: '2px' }}
            />
            <div>
              <div style={{ fontSize: '13px', fontWeight: 500 }}>Частичная</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                Только обновить timestamp, метаданные не трогать
              </div>
            </div>
          </label>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
        <button
          onClick={onClose}
          disabled={isLoading}
          style={{
            padding: '8px 16px',
            border: '1px solid var(--border)',
            background: 'transparent',
            borderRadius: '6px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontSize: '13px',
          }}
        >
          Отмена
        </button>
        <button
          onClick={handleConfirm}
          disabled={isLoading}
          style={{
            padding: '8px 16px',
            border: 'none',
            background: mode === 'full' ? '#d97706' : '#059669',
            color: 'white',
            borderRadius: '6px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontSize: '13px',
            fontWeight: 500,
            opacity: isLoading ? 0.6 : 1,
          }}
        >
          {isLoading ? 'Синхронизация...' : 'Синхронизировать'}
        </button>
      </div>
    </Modal>
  );
}