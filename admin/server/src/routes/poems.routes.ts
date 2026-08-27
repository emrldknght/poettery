import { Hono } from 'hono';
import * as poemsController from '../controllers/poems.controller';

const router = new Hono();

router.get('/', poemsController.getAllPoems);
router.post('/sync', poemsController.syncAll);
router.patch('/:slug{.+}/publish', poemsController.togglePublish);

// Маршруты для тегов
router.post('/:slug{.+}/tags', poemsController.addTag);
router.delete('/:slug{.+}/tags/:tagName', poemsController.removeTag);

export default router;
