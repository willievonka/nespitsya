import Router from 'express'
import tagController from '../controller/tag.controller.js'
import { roleMiddleware } from '../middleware/roleMiddleware.js'

const router = new Router();

// router.post('/tag', roleMiddleware('admin'), tagController.createTag);
router.post('/tag', tagController.createTag);
router.get('/tag', tagController.getTags);
router.get('/tag/:id', tagController.getOneTag);
// router.put('/tag/', roleMiddleware('admin'), tagController.updateTag);
// router.delete('/tag/:id', roleMiddleware('admin'), tagController.deleteTag);
router.put('/tag/', tagController.updateTag);
router.delete('/tag/:id', tagController.deleteTag);

export default router;