import { Router } from "express"
import { auth } from "../../middleware/auth"

import { propertyController } from "./property.controller"
import validateRequest from "../../middleware/validateRequest"
import { PropertyValidations } from "./property.validation"
import { Role } from "../../generated/prisma/enums"


const router = Router()

router.post('/', auth(Role.LANDLORD),validateRequest(PropertyValidations.createPropertyValidationSchema),
           propertyController.createProperty)
router.get('/',  propertyController.getAllProperties)
router.get('/:id',  propertyController.getPropertyById)
router.patch('/:id', auth(Role.LANDLORD, Role.ADMIN),validateRequest(PropertyValidations.updatePropertyValidationSchema), propertyController.updateProperty)
router.delete("/:id",auth(Role.ADMIN, Role.LANDLORD),propertyController.deleteProperty);



export const propertyRoutes = router