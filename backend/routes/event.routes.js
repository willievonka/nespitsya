import Router from 'express'
import eventController from '../controller/event.controller.js'

const router = new Router()

router.post('/event', eventController.createEvent)
router.get('/event', eventController.getEvents)
router.get('/event/city/:id', eventController.getEventsFromCity)
router.get('/event/artist/:id', eventController.getEventsByArtist)
router.get('/event/organizer/:id', eventController.getEventsByOrganizer)
router.get('/event/tag/:id', eventController.getEventsByTag)
router.get('/event/:id', eventController.getOneEvent)
router.put('/event', eventController.updateEvent)
router.delete('/event/:id', eventController.deleteEvent)

export default router