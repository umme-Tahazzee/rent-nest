import { Router } from "express";
import { auth } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";
import { categoryController } from "./category.controller";

const router = Router()

router.post('/', auth(Role.ADMIN), categoryController.createCategory)
router.get('/',categoryController.getAllCategories)
router.get('/:id',categoryController.getSingleCategory)




export const categoryRoutes = router