import { Router } from "express";
import { reviewsController } from "./review.controller";
import { auth } from "../../middleware/auth";


import validateRequest from "../../middleware/validateRequest";
import { ReviewValidations } from "./review.validation";
import { Role } from "../../generated/prisma/enums";

const router = Router()

router.post('/',auth(Role.TENANT) ,
validateRequest(ReviewValidations.createReviewValidationSchema),
reviewsController.createReview)
// router.get("/property/:propertyId", ReviewControllers.getReviewsByProperty);

export const reviewsRouter = router