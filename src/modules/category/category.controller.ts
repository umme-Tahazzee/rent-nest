import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { categoryService } from "./category.service";
import { sendResponse } from "../utils/sendResponse";
import   httpStatus  from "http-status";
const createCategory = catchAsync(async(req:Request, res:Response, next:NextFunction)=>{
  const payload = req.body
  console.log(payload, 'categoty')
  const result = await categoryService.createCategoryFromDb(payload)

  sendResponse(res,{
      success : true,
      statusCode : httpStatus.CREATED,
      message : "Successfully created porperty category",
      data : result
  })
})

export const categoryController = {
     createCategory
}