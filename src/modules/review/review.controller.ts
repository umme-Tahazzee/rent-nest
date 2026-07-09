import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { reviewServices } from "./review.service";
import { sendResponse } from "../utils/sendResponse";
import  httpStatus  from "http-status";

const createReview = catchAsync(async(req:Request, res:Response)=>{
    const  id = req.user?.id  as string
    const payload = req.body
    

    const review = await reviewServices.createReviewFromDb(id, payload)
    sendResponse(res, {
           success : true,
           statusCode: httpStatus.OK,
           message : "Add review successfully",
           data : review
    })

})

export const reviewsController = {
     createReview
}