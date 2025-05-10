import Router from 'express'
import placeController from '../controller/place.controller.js'
import { roleMiddleware } from '../middleware/roleMiddleware.js'

const router = new Router();

// router.post('/place', roleMiddleware('admin'), placeController.createPlace);
router.post('/place', placeController.createPlace);
router.get('/place', placeController.getPlaces);
router.get('/place/:id', placeController.getOnePlace);
// router.put('/place', roleMiddleware('admin'), placeController.updatePlace);
// router.delete('/place/:id', roleMiddleware('admin'), placeController.deletePlace);
router.put('/place', placeController.updatePlace);
router.delete('/place/:id', placeController.deletePlace);

export default router;