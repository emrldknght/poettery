import { Router } from 'express';
import * as poemsController from '../controllers/poems.controller';

const router = Router();

router.get('/', poemsController.getAllPoems);
router.post('/sync', poemsController.syncAll);
router.patch('/:slug/publish', poemsController.togglePublish);

export default router;