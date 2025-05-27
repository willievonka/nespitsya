import { Router } from "express"
import organizerController from "../controller/organizer.controller.js"

const router = Router();

router.get('/organizer', organizerController.getOrganizers);
router.get('/organizer/:id', organizerController.getOrganizerById);
router.post('/organizer/by-ids', organizerController.getOrganizersByIds);

export default router;