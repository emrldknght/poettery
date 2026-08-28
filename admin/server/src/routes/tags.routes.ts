import { Hono } from 'hono';
import * as tagsController from '../controllers/tags.controller';

const router = new Hono();

// --- Глобальное управление тегами (статические пути в начале) ---
router.get('/list', tagsController.getAllTags);
router.post('/', tagsController.createTag);
router.patch('/:id', tagsController.renameTag);
router.delete('/:id', tagsController.deleteTag);

// --- Работа с тегами у конкретного стиха ---
router.post('/:slug{.+}/tags', tagsController.addTagToPoem);
router.delete('/:slug{.+}/tags/:tagName', tagsController.removeTagFromPoem);

export default router;