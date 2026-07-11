import { Router } from "express";

import { auth } from "../../middleware/auth";
import validateRequest from "../../middleware/validateRequest";
import { AdminControllers } from "./admin.controller";
import { AdminValidations } from "./admin.validation";
import { Role } from "../../generated/prisma/enums";

const router = Router();

router.get("/users", auth(Role.ADMIN), AdminControllers.getAllUsers);

router.patch(
  "/users/:id",
  auth(Role.ADMIN),
  validateRequest(AdminValidations.updateUserStatusValidationSchema),
  AdminControllers.updateUserStatus
);

router.get(
  "/properties",
  auth(Role.ADMIN),
  AdminControllers.getAllProperties
);

router.get("/rentals", auth(Role.ADMIN), AdminControllers.getAllRentalRequests);

export const adminRoutes = router;
