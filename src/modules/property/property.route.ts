import { Router } from "express"
import { auth } from "../../middleware/auth"
import { Role } from "../../../generated/prisma/enums"
import { propertyController } from "./property.controller"


const router = Router()

router.post('/', auth(Role.LANDLORD), propertyController.createProperty)
router.get('/',  propertyController.getAllProperties)
router.get('/:id',  propertyController.getPropertyById)
router.patch('/:id', auth(Role.LANDLORD, Role.ADMIN), propertyController.updateProperty)
router.delete("/:id",auth(Role.ADMIN, Role.LANDLORD),propertyController.deleteProperty);


export const propertyRoutes = router