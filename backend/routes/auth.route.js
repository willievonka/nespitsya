import Router from 'express'
import authController from '../controller/auth.controller.js'
import upload from '../middleware/upload.js'

const router = new Router();

router.get('/users', authController.getUsers);
router.get('/users/:id', authController.getUserById);
router.get('/user', authController.getUserInfo);
router.post('/users/:userId/subscribes', authController.addSubscribe);
router.post('/users/:userId/favorites', authController.addFavorite);
router.post('/registration', upload.single('image'), authController.register);
router.post('/registration/organizer', upload.single('image'), authController.registrationOrganizer);
router.post('/login', authController.login);
router.post('/refresh', authController.refresh); 
router.post('/logout', authController.logout);
router.put('/users/:id', upload.single('image'), authController.updateUser);
router.delete('/users/:id', authController.deleteUser);
router.delete('/users/:userId/favorites' , authController.removeFavorite);
router.delete('/users/:userId/subscribes', authController.removeSubscribe);
router.delete('/users/:userId/favorites/clear', authController.clearFavorites);
router.delete('/users/:userId/subscribes/clear', authController.clearSubscribes);

export default router;