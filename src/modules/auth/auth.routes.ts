import { Router } from "express";
import { authController } from "./auth.controller";
import { AuthValidations } from "./auth.validation";
import validateRequest from "../../middleware/validateRequest";

const router = Router();

router.post("/login",validateRequest(AuthValidations.loginValidationSchema) , authController.loginUser)



export const authRoutes = router