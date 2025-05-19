import Router from 'express'
import cityController from '../controller/city.controller.js'
import { roleMiddleware } from '../middleware/roleMiddleware.js'
import upload from '../middleware/upload.js'

const router = new Router();

router.post('/cities',upload.single('backgroundUrl'), roleMiddleware('admin'), cityController.createCity);
// router.post('/cities', upload.single('backgroundUrl'), cityController.createCity);
router.get('/cities', cityController.getRegionsList);
router.get('/cities/top/', cityController.getTopCities);
router.get('/cities/nearest', cityController.getNearestCity);
router.get('/cities/:id', cityController.getCityById);
router.put('/cities/:id', roleMiddleware('admin'), upload.single('backgroundUrl'), cityController.updateCity);
router.delete('/cities/:id', roleMiddleware('admin'), cityController.deleteCity);
// router.delete('/cities/:id', cityController.deleteCity);


export default router;