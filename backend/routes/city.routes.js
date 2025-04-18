import Router from 'express'
import cityController from '../controller/city.controller.js'
import { roleMiddleware } from '../middleware/roleMiddleware.js'

const router = new Router()

router.post('/cities', roleMiddleware('admin'), cityController.createCity);
router.get('/cities', cityController.getRegionsList);
router.get('/cities/:id', cityController.getCityById);
router.delete('/cities/:id', roleMiddleware('admin'), cityController.deleteCity);

export default router