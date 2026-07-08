import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { propertyService } from "./property.service";
import { sendResponse } from "../utils/sendResponse";
import httpStatus from "http-status";
import pick from "../utils/pick";
import { Role } from "../../../generated/prisma/enums";

const createProperty = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

     const landlordId = req.user?.id as string
     const payload = req.body

     const result = await propertyService.createPropertyIntoDb(landlordId, payload)

     sendResponse(res, {
          success: true,
          statusCode: httpStatus.CREATED,
          message: "Property created Successfully",
          data: result
     })
})

const getAllProperties = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, [
    "searchTerm",
    "city",
    "minPrice",
    "maxPrice",
    "bedroom",
    "bathroom",
    "categoryId",
    "status",
  ]);

  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);

  const result = await propertyService.getAllPropertiesFromDb(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Properties retrieved successfully",
    data: result,
  });
});

const getPropertyById = catchAsync(async(req:Request, res:Response, next:NextFunction)=>{
       const id = req.params.id as string
       const result = await propertyService.getSinglePropertyFromDb(id)
       sendResponse(res,{
           success : true,
           statusCode: httpStatus.OK,
           message : "Get property successfully",
           data : result
       })
})


const updateProperty = catchAsync(async(req:Request, res:Response, next:NextFunction)=>{
       const propertyId = req.params.id as string
       const payload = req.body
       const role = req.user?.role as Role
       const userId = req.user?.id as string
       
       const result = await propertyService.updatePropertyFromDb(propertyId, userId, role, payload)
       sendResponse(res,{
           success : true,
           statusCode: httpStatus.OK,
           message : "Get property successfully",
           data : result
       })
})

const deleteProperty = catchAsync(async(req:Request, res:Response, next:NextFunction)=>{
    const id = req.params.id as string
    const userId = req.user?.id as string
    const userRole = req.user?.role as Role

    const result = propertyService.deletePropertyFromDb(id, userId, userRole)

    sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Property deleted successfully",
    data: null,
  });
})


export const propertyController = {
     createProperty,
     getAllProperties,
     getPropertyById,
     updateProperty,
     deleteProperty
}