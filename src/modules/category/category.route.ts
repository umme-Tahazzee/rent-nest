import { Router } from "express";
import { auth } from "../../middleware/auth";

import { categoryController } from "./category.controller";
import validateRequest from "../../middleware/validateRequest";
import { CategoryValidations } from "./category.validation";
import { Role } from "../../generated/prisma/enums";

const router = Router()

router.post('/',auth(Role.ADMIN),validateRequest(CategoryValidations.createCategoryValidationSchema),  categoryController.createCategory)
router.get('/', categoryController.getAllCategories)
router.get('/:id',categoryController.getSingleCategory)
router.patch("/:id",validateRequest(CategoryValidations.updateCategoryValidationSchema),auth(Role.ADMIN),categoryController.updateCategory )
router.delete("/:id",validateRequest(CategoryValidations.createCategoryValidationSchema),auth(Role.ADMIN),categoryController.deleteCategory )






export const categoryRoutes = router