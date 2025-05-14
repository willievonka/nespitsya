import Router from 'express'
import artistController from '../controller/artist.controller.js'
import { roleMiddleware } from '../middleware/roleMiddleware.js'

const router = new Router();

// router.post('/artist', roleMiddleware('admin'), artistController.createArtist);
router.post('/artist', artistController.createArtist);
router.get('/artist', artistController.getArtists);
router.get('/artist/:id', artistController.getOneArtist);
router.put('/artist', artistController.updateArtist);
router.delete('/artist/:id',  artistController.deleteArtist);
// router.put('/artist', roleMiddleware('admin'), artistController.updateArtist);
// router.delete('/artist/:id', roleMiddleware('admin'), artistController.deleteArtist);

export default router;