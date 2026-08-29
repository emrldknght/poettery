import { useState } from 'react';
import { useFilesStore } from '@/features/files/store';
import { usePoemsStore } from '@/features/poems/store';
import { Button } from '@/shared/ui/Button';
import type { FileNode } from '@/features/files';
import * as React from "react";
import {SyncConfirmModal} from "@/features/files/SyncConfirmModal.tsx";

interface FileNodeItemProps {
  node: FileNode;
  prefix: string;
  showSyncButton?: boolean;
}

export function FileNodeItem({ node, prefix, showSyncButton = true }: FileNodeItemProps) {
  const { syncSingleFile, isSyncing } = useFilesStore();
  const { selectedSlug, selectPoem } = usePoemsStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSyncingFile, setIsSyncingFile] = useState(false);

  const isSelected = node.slug === selectedSlug;

  if (!node.path) return null;

  const handleSyncClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsModalOpen(true);
  };

  const handleConfirm = async (mode: 'full' | 'partial') => {
    setIsSyncingFile(true);
    try {
      await syncSingleFile(node.path!, mode);
      setIsModalOpen(false);
    } catch (e) {
      console.error('Sync failed:', e);
    } finally {
      setIsSyncingFile(false);
    }
  };

  return (
    <>
      <div
        onClick={() => node.slug && selectPoem(node.slug)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '4px 8px',
          fontSize: '12px',
          color: node.inDb ? 'var(--text)' : 'var(--text-muted)',
          borderRadius: '4px',
          fontFamily: 'monospace',
          cursor: 'pointer',
          background: isSelected ? 'var(--accent-soft)' : 'transparent',
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          flex: 1,
          overflow: 'hidden'
        }}>
          <span style={{ color: 'var(--text-muted)', userSelect: 'none' }}>
            {prefix}
          </span>
          <span style={{ fontSize: '12px' }}>📄</span>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {node.name.replace(/\.md$/, '')}
          </span>
        </div>

        {showSyncButton && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSyncClick}
            disabled={isSyncing || isSyncingFile}
            style={{
              padding: '2px 6px',
              fontSize: '14px',
              lineHeight: 1,
              fontWeight: 'bold',
              color: node.inDb ? 'var(--text-muted)' : 'var(--accent)',
            }}
            title={node.inDb ? 'Обновить данные из файла' : 'Добавить в БД'}
          >
            {node.inDb ? '↻' : '+'}
          </Button>
        )}
      </div>

      <SyncConfirmModal
        isOpen={isModalOpen}
        onClose={() => !isSyncingFile && setIsModalOpen(false)}
        onConfirm={handleConfirm}
        fileName={node.name}
        isLoading={isSyncingFile}
      />
    </>
  );
}