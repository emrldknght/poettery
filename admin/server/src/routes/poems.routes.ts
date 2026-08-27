import { Hono } from 'hono';
import * as poemsController from '../controllers/poems.controller';

const router = new Hono();

router.get('/', poemsController.getAllPoems);
router.post('/sync', poemsController.syncAll);
// router.patch('/:slug/publish', poemsController.togglePublish);
router.patch('/:slug{.+}/publish', poemsController.togglePublish);

export default router;