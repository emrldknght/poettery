export interface Poem {
  slug: string;
  file_path: string;
  layout: string;
  title: string | null;
  date: string | null;
  section: string;
  published: boolean;
  tags: string[];
}

export interface FileNode {
  name: string;
  type: 'folder' | 'file';
  path: string;
  slug?: string;
  inDb?: boolean;
  children?: FileNode[];
}