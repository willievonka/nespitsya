import Router from 'express'
import authController from '../controller/auth.controller.js'
import { authMiddleware } from '../middleware/authMiddleware.js'
import { roleMiddleware } from '../middleware/roleMiddleware.js'

const router = new Router()

router.post('/registration', authController.registration)
router.post('/login', authController.login)
router.get('/users', authController.getUsers)

export default router