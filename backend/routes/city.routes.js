import Router from 'express'
import cityController from '../controller/city.controller.js'

const router = new Router()

router.post('/cities', cityController.createCity);
router.get('/cities', cityController.getRegionsList);
router.get('/cities/:id', cityController.getCityById);
router.delete('/cities/:id', cityController.deleteCity);

export default router