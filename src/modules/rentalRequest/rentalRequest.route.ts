import express from "express";
import { RentalRequestControllers } from "./rentalRequest.controller";
import { auth } from "../../middleware/auth";
import { Role } from "../../generated/prisma/enums";



const router = express.Router();

router.post(
  "/",
  auth(Role.TENANT),
  RentalRequestControllers.createRentalRequest
);


router.get("/",  RentalRequestControllers.getMyRentalRequests);


router.get(
  "/:id",
  auth(Role.ADMIN, Role.LANDLORD, Role.TENANT),
  RentalRequestControllers.getRentalRequestById
);

export const RentalRequestRoutes = router;