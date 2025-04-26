import { Router } from "express";
import organizerController from "../controller/organizer.controller.js";

const router = Router()

router.get('/organizer', organizerController.getOrganizers);
router.get('/organizer/:id', organizerController.getOrganizerById)

export default router