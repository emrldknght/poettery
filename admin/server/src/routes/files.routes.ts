import { Hono } from 'hono';
import * as filesController from '../controllers/files.controller';

const router = new Hono();

// В Hono порядок роутов тоже важен, но роутер умнее —
// статические пути автоматически приоритетнее параметрических.
// На всякий случай оставим явный порядок.
router.get('/tree', filesController.getFileTree);
// router.get('/:slug', filesController.getFileContent);
router.get('/:slug{.+}', filesController.getFileContent);
router.post('/sync/single', filesController.syncSingleFile);

export default router;