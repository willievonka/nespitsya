import Router from 'express'
import authController from '../controller/auth.controller.js'
import upload from '../middleware/upload.js'

const router = new Router();

router.post('/subscribe/add', authController.addSubscribe);
router.post('/subscribe/remove', authController.removeSubscribe);
router.post('/favorite/add', authController.addFavorite);
router.post('/favorite/remove', authController.removeFavorite);
router.post('/registration', authController.registrationUser);
router.post('/registration/organizer', upload.single('image'), authController.registrationOrganizer);
router.post('/login', authController.login);
router.get('/users', authController.getUsers);
router.get('/users/:id', authController.getUserById);

export default router;