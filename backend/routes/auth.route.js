import Router from 'express'
import authController from '../controller/auth.controller.js'
import upload from '../middleware/upload.js'

const router = new Router()

router.post('/registration', authController.registrationUser)
router.post('/registration/organizer', upload.single('image'), authController.registrationOrganizer)
router.post('/login', authController.login)
router.get('/users', authController.getUsers)

export default router