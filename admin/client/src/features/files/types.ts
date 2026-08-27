export interface FileNode {
  name: string;
  type: 'folder' | 'file';
  path: string;
  slug?: string;
  inDb?: boolean;
  children?: FileNode[];
}