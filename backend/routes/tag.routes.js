import Router from 'express'
import tagController from '../controller/tag.controller.js'

const router = new Router()

router.post('/tag', tagController.createTag)
router.get('/tag', tagController.getTags)
router.get('/tag/:id', tagController.getOneTag)
router.put('/tag/', tagController.updateTag)
router.delete('/tag/:id', tagController.deleteTag)

export default router