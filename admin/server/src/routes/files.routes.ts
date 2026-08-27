import { Router } from 'express';
import * as filesController from '../controllers/files.controller';

const router = Router();

// ВАЖНО: Конкретный путь /tree должен идти ВЫШЕ, чем динамический /:slug
router.get('/tree', filesController.getFileTree);
router.get('/:slug', filesController.getFileContent);
router.post('/sync/single', filesController.syncSingleFile);

export default router;