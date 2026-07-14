import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { sendResponse } from "../utils/sendResponse";
import  httpStatus  from "http-status";
import { userService } from "./user.service";

const createUser = catchAsync(async(req:Request, res:Response, next:NextFunction)=>{
       const payload = req.body
       const result = await userService.registerUserIntoDb(payload)

       sendResponse(res, {
           success: true,
           statusCode: httpStatus.CREATED,
           message: "Successfully create user",
           data: result
       })
})


const getMyProfile = catchAsync(async (req: Request, res: Response) => {

  const profile = await userService.getMyProfileFromDb(req.user?.id as string)
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User profile fetched successfully',
    data: { profile }
  })
})



export const userController = {
     createUser,
     getMyProfile
}