import path from 'path';

// Путь от admin/server/src к корневой папке content
export const CONTENT_DIR = path.join(__dirname, '..', '..', '..', 'content');
export const PORT = process.env.PORT || 3001;