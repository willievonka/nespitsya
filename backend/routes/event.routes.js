import Router from 'express'
import eventController from '../controller/event.controller.js'
import { roleMiddleware } from '../middleware/roleMiddleware.js'

const router = new Router()

router.post('/event', roleMiddleware(['organizer']), eventController.createEvent)
router.get('/event', eventController.getEvents)
router.get('/event/city/:id', eventController.getEventsFromCity)
router.get('/event/artist/:id', eventController.getEventsByArtist)
router.get('/event/organizer/:id', eventController.getEventsByOrganizer)
router.get('/event/tag/:id', eventController.getEventsByTag)
router.get('/event/:id', eventController.getOneEvent)
router.put('/event', roleMiddleware(['admin','organizer']), eventController.updateEvent)
router.delete('/event/:id', roleMiddleware(['admin','organizer']), eventController.deleteEvent)

export default router