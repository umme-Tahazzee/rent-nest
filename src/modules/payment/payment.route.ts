import { Router } from "express";

import { auth } from "../../middleware/auth";
import validateRequest from "../../middleware/validateRequest";
import { PaymentControllers } from "./payment.controller";
import { PaymentValidations } from "./payment.validation";
import { Role } from "../../generated/prisma/enums";

const router = Router();

router.post(
  "/create",
  auth(Role.TENANT),
  validateRequest(PaymentValidations.createPaymentValidationSchema),
  PaymentControllers.createPaymentSession
);

router.post(
  "/confirm",
  auth(Role.TENANT),
  validateRequest(PaymentValidations.verifyPaymentValidationSchema),
  PaymentControllers.verifyPayment
);

router.get("/", auth(Role.TENANT), PaymentControllers.getMyPayments);

router.get(
  "/:id",
  auth(Role.TENANT, Role.LANDLORD, Role.ADMIN),
  PaymentControllers.getPaymentById
);

export const paymentRoutes = router;
