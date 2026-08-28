import { Modal } from '@/shared/ui/Modal';
import { TagEditor } from '@/features/tags/TagEditor';

interface TagEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TagEditorModal({ isOpen, onClose }: TagEditorModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Редактор тегов">
      <TagEditor />
    </Modal>
  );
}