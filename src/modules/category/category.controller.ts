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

const getAllCategories = catchAsync(async(req:Request, res:Response, next:NextFunction)=>{
    const result = await categoryService.getAllCategoriesFromDb()

    sendResponse(res,{
          success : true,
          statusCode: httpStatus.OK,
          message : "Get all category successfully",
          data : result
    })
})

const getSingleCategory = catchAsync(async(req:Request, res:Response, next:NextFunction)=>{
    
    const id = req.params.id as string
  

    
    
    const result = await categoryService.getSingleCategoryFromDb(id)

    sendResponse(res,{
          success : true,
          statusCode: httpStatus.OK,
          message : "Get all category successfully",
          data : result
    })
})
export const categoryController = {
     createCategory,
     getAllCategories,
     getSingleCategory
}