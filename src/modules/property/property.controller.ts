import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { propertyService } from "./property.service";
import { sendResponse } from "../utils/sendResponse";
import httpStatus from "http-status";
import pick from "../utils/pick";

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



export const propertyController = {
     createProperty,
     getAllProperties
}