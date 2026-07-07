import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";

import { sendResponse } from "../utils/sendResponse";
import  httpStatus  from "http-status";
import { authService } from "./auth.service";

const loginUser = catchAsync(async(req:Request, res:Response, next:NextFunction)=>{
        const payload = req.body
        const {accessToken, refreshToken} = await authService.loginUser(payload)
       
       res.cookie("accesstoken", accessToken, {
          httpOnly: true,
          secure : false,
          sameSite : "none",
          maxAge : 1000 * 60 * 60 * 24
       } )

        res.cookie("refreshtoken", accessToken, {
          httpOnly: true,
          secure : false,
          sameSite : "none",
          maxAge : 1000 * 60 * 60 * 7
       })
       
        sendResponse(res, {
               success : true,
               statusCode:  httpStatus.OK,
               message: "User Login Successfully",
               data: {accessToken, refreshToken}
        })
})


export const authController = {
    loginUser
}