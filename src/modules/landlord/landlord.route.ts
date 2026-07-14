import { Router } from "express";
import { landlordController } from "./landlord.controller";
import { auth } from "../../middleware/auth";
import { Role } from "../../generated/prisma/enums";


const router = Router()

router.get('/request', landlordController.getLandlordRentalRequests)
router.post('/request/:id', auth(Role.LANDLORD), landlordController.updateRentalRequestStatus)
// router.put('properties/:id',)

export const landlordRoutes = router