import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { propertyService } from "./property.service";
import { sendResponse } from "../utils/sendResponse";
import  httpStatus  from "http-status";

const createProperty = catchAsync(async(req:Request, res:Response , next:NextFunction)=>{
    
     const landlordId = req.user?.id as string 
     const payload = req.body 

     const result = await propertyService.createPropertyIntoDb(landlordId , payload)

     sendResponse(res,{
          success: true,
          statusCode : httpStatus.CREATED,
          message : "Property created Successfully",
          data : result
     })
})

export const propertyController = {
    createProperty
}