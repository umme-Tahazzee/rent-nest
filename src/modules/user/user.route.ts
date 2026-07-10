import { Router } from "express";
import { userController } from "./user.controller";
import { auth } from "../../middleware/auth";

import validateRequest from "../../middleware/validateRequest";
import { UserValidations } from "./user.validation";
import { Role } from "../../generated/prisma/enums";

const router = Router();

router.post('/register',validateRequest(UserValidations.createUserValidationSchema),userController.createUser)
router.get('/me', auth(Role.ADMIN, Role.LANDLORD, Role.TENANT), userController.getMyProfile)

export const userRoutes = router
