import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { sendResponse } from "../utils/sendResponse";
import  httpStatus  from "http-status";
import { userService } from "./user.service";

const createUser = catchAsync(async(req:Request, res:Response)=>{
       const payload = req.body
       const result = await userService.registerUserIntoDb(payload)

       sendResponse(res, {
           success: true,
           statusCode: httpStatus.CREATED,
           message: "Successfully create user",
           data: result
       })
})

export const userController = {
     createUser
}